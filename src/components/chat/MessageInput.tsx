
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Send, Mic } from 'lucide-react';

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
      
      {message.trim() && !isLoading ? (
        <button
          type="submit"
          className="p-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Send className="h-5 w-5" />
        </button>
      ) : (
        <button
          type="button"
          className="p-3 rounded-full hover:bg-secondary transition-colors"
          disabled={isLoading}
        >
          <Mic className="h-5 w-5 text-muted-foreground" />
        </button>
      )}
    </form>
  );
};

export default MessageInput;
