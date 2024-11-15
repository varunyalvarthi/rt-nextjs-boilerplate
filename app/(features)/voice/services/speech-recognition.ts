type SpeechRecognitionCallback = (transcript: string) => void;

class SpeechRecognitionService {
  private recognition: any | null = null;
  private onTranscriptCallback: SpeechRecognitionCallback | null = null;
  private onErrorCallback: ((error: string) => void) | null = null;
  private onEndCallback: (() => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.setupRecognition();
      }
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
    };

    this.recognition.onend = () => {
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
      return false;
    }
  }

  public start() {
    if (this.recognition) {
      this.recognition.start();
    }
  }

  public stop() {
    if (this.recognition) {
      this.recognition.stop();
    }
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
