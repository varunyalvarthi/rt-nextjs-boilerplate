type SpeechRecognitionCallback = (transcript: string) => void;

class SpeechRecognitionService {
  private recognition: any | null = null;
  private onTranscriptCallback: SpeechRecognitionCallback | null = null;
  private onErrorCallback: ((error: string) => void) | null = null;
  private onEndCallback: (() => void) | null = null;
  private isInitialized: boolean = false;
  private isListening: boolean = false;

  constructor() {
    this.initializeRecognition();
  }

  private initializeRecognition() {
    if (typeof window === 'undefined') return;
    
    try {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.setupRecognition();
        this.isInitialized = true;
      } else {
        console.error('Speech Recognition not supported in this browser');
      }
    } catch (error) {
      console.error('Failed to initialize speech recognition:', error);
    }
  }

  private setupRecognition() {
    if (!this.recognition) return;

    this.recognition.continuous = true;
    this.recognition.interimResults = true;

    this.recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      if (this.onTranscriptCallback) {
        this.onTranscriptCallback(transcript);
      }
    };

    this.recognition.onerror = (event: any) => {
      if (this.onErrorCallback) {
        this.onErrorCallback(event.error);
      }
      this.isListening = false;
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.onEndCallback) {
        this.onEndCallback();
      }
    };
  }

  public async checkPermission(): Promise<boolean> {
    try {
      const result = await navigator.mediaDevices.getUserMedia({ audio: true });
      result.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('Microphone permission error:', error);
      return false;
    }
  }

  public async start() {
    if (!this.isInitialized) {
      this.initializeRecognition();
    }

    if (!this.recognition) {
      if (this.onErrorCallback) {
        this.onErrorCallback('Speech recognition not supported');
      }
      return;
    }

    if (this.isListening) {
      return; // Already listening
    }

    try {
      const hasPermission = await this.checkPermission();
      if (!hasPermission) {
        if (this.onErrorCallback) {
          this.onErrorCallback('Microphone permission denied');
        }
        return;
      }

      this.recognition.start();
      this.isListening = true;
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      if (this.onErrorCallback) {
        this.onErrorCallback('Failed to start speech recognition');
      }
      this.isListening = false;
    }
  }

  public stop() {
    if (!this.recognition || !this.isListening) return;

    try {
      this.recognition.stop();
      this.isListening = false;
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
    }
  }

  public cleanup() {
    if (this.isListening) {
      this.stop();
    }
    this.onTranscriptCallback = null;
    this.onErrorCallback = null;
    this.onEndCallback = null;
  }

  public onTranscript(callback: SpeechRecognitionCallback) {
    this.onTranscriptCallback = callback;
  }

  public onError(callback: (error: string) => void) {
    this.onErrorCallback = callback;
  }

  public onEnd(callback: () => void) {
    this.onEndCallback = callback;
  }
}

// Create a singleton instance
export const speechRecognitionService = new SpeechRecognitionService();
