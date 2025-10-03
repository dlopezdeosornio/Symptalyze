// TypeScript declarations for Chatbase.co widget
declare global {
  interface Window {
    chatbase: {
      (action: string, ...args: any[]): void;
      q?: any[];
    };
  }
}

export {};
