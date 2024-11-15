export interface VoiceState {
  isListening: boolean;
  transcript: string;
  error: string | null;
}

export interface VoiceCommand {
  command: string;
  action: string;
  parameters?: Record<string, any>;
}

export interface SpeechRecognitionConfig {
  onTranscript?: (transcript: string) => void;
  onError?: (error: string) => void;
  language?: string;
  continuous?: boolean;
}
