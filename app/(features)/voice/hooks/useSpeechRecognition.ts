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
    // Set up speech recognition handlers
    speechRecognitionService.onTranscript((text) => {
      setTranscript(text);
      if (onTranscript) {
        onTranscript(text);
      }
    });

    speechRecognitionService.onError((err) => {
      console.error('Speech recognition error:', err);
      setError(err);
      setIsListening(false);
      setTranscript('');
    });

    speechRecognitionService.onEnd(() => {
      setIsListening(false);
      setTranscript('');
    });

    // Cleanup when component unmounts
    return () => {
      speechRecognitionService.cleanup();
    };
  }, [onTranscript]);

  const startListening = useCallback(async () => {
    try {
      setError(null);
      setTranscript('');
      setIsListening(true);
      await speechRecognitionService.start();
    } catch (err) {
      console.error('Failed to start listening:', err);
      setError('Failed to start speech recognition');
      setIsListening(false);
      setTranscript('');
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
