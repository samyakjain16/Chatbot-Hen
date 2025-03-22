
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Message } from '@/data/sampleChatData';

interface MessageListProps {
  messages: Message[];
  className?: string;
}

const MessageList = ({ messages, className }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={cn("flex flex-col p-4 space-y-4 overflow-y-auto", className)}>
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground text-center p-4">
            Send a message to start the conversation
          </p>
        </div>
      ) : (
        messages.map((message, index) => {
          const isSent = message.sender === 'user';
          
          // Add date separator if needed
          const showDateSeparator = index === 0 || 
            new Date(message.timestamp).toDateString() !== 
            new Date(messages[index - 1].timestamp).toDateString();
          
          return (
            <React.Fragment key={message.id}>
              {showDateSeparator && (
                <div className="flex justify-center my-4">
                  <span className="text-xs text-muted-foreground bg-secondary/30 px-3 py-1 rounded-full">
                    {new Date(message.timestamp).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                  </span>
                </div>
              )}
              
              <div className={cn(
                "flex", 
                isSent ? "justify-end" : "justify-start",
                "group"
              )}>
                <div 
                  style={{animationDelay: `${index * 0.05}s`}}
                  className={cn(
                    "message-bubble",
                    isSent 
                      ? "message-bubble-sent" 
                      : "message-bubble-received"
                  )}
                >
                  <p className="break-words">{message.content}</p>
                  <div className={cn(
                    "flex items-center text-xs mt-1", 
                    isSent ? "justify-end" : "justify-start",
                    isSent ? "text-primary-foreground/70" : "text-muted-foreground"
                  )}>
                    <span>{formatTime(message.timestamp)}</span>
                    {isSent && message.status && (
                      <span className="ml-1">
                        {message.status === 'sent' && '✓'}
                        {message.status === 'delivered' && '✓✓'}
                        {message.status === 'read' && '✓✓'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
