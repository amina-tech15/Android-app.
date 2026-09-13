export type SensitiveType =
  | 'name'
  | 'phone'
  | 'email'
  | 'address'
  | 'cnic';

export interface SensitiveMatch {
  id: number;
  type: SensitiveType;
  value: string;
  start: number;
  end: number;
}

export interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  protected: boolean;
  timestamp: number;
}

export type ProtectionLevel = 'original' | 'protected';
