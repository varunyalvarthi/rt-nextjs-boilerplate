import { useState, useEffect, useCallback } from 'react';
import { speechRecognitionService } from '../services/speech-recognition';

interface UseSpeechRecognitionProps {
  onTranscript?: (transcript: string) => void;
}

export const useSpeechRecognition = ({ onTranscript }: UseSpeechRecognitionProps = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    speechRecognitionService.onTranscript((text) => {
      setTranscript(text);
      if (onTranscript) {
        onTranscript(text);
      }
    });

    speechRecognitionService.onError((err) => {
      setError(err);
      setIsListening(false);
    });

    speechRecognitionService.onEnd(() => {
      setIsListening(false);
    });
  }, [onTranscript]);

  const startListening = useCallback(async () => {
    try {
      const hasPermission = await speechRecognitionService.checkPermission();
      if (!hasPermission) {
        setError('Microphone permission denied');
        return;
      }

      setError(null);
      setIsListening(true);
      setTranscript('');
      speechRecognitionService.start();
    } catch (err) {
      setError('Error starting speech recognition');
      setIsListening(false);
    }
  }, []);

  const stopListening = useCallback(() => {
    speechRecognitionService.stop();
    setIsListening(false);
    setTranscript('');
  }, []);

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening
  };
};
