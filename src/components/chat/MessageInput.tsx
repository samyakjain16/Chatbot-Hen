import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Send } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  className?: string;
  isLoading?: boolean;
}

const MessageInput = ({ onSendMessage, className, isLoading = false }: MessageInputProps) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex items-center gap-2 p-4 bg-background border-t", className)}
    >
      <div className="relative flex-1">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={isLoading ? "Waiting for response..." : "Message..."}
          className="message-input"
          disabled={isLoading}
        />
      </div>
      <button
        type="submit"
        className={cn(
          "p-3 rounded-full transition-colors", 
          message.trim() && !isLoading 
            ? "bg-primary text-primary-foreground hover:bg-primary/90" 
            : "bg-secondary text-secondary-foreground opacity-50 cursor-not-allowed"
        )}
        disabled={!message.trim() || isLoading}
      >
        <Send className="h-5 w-5" />
      </button>
    </form>
  );
};

export default MessageInput;