
import React from 'react';
import { cn } from '@/lib/utils';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { ArrowLeft } from 'lucide-react';
import { Message } from '@/data/sampleChatData';

interface ChatViewProps {
  contact: {
    id: string;
    name: string;
    online: boolean;
  };
  messages: Message[];
  onSendMessage: (content: string) => void;
  onBackClick: () => void;
  isLoading: boolean;
  showBackButton: boolean;
  className?: string;
}

const ChatView = ({
  contact,
  messages,
  onSendMessage,
  onBackClick,
  isLoading,
  showBackButton,
  className
}: ChatViewProps) => {
  return (
    <div className={cn("flex-1 flex flex-col", className)}>
      <ChatHeader 
        contact={{
          name: contact.name,
          online: contact.online,
          lastSeen: !contact.online ? '10 minutes ago' : undefined,
        }}
        className="flex-shrink-0"
        messages={messages}
      />
      
      {showBackButton && (
        <button 
          onClick={onBackClick} 
          className="absolute top-4 left-4 z-20 md:hidden"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      )}
      
      <MessageList 
        messages={messages} 
        className="flex-1"
      />
      
      <MessageInput 
        onSendMessage={onSendMessage} 
        className="flex-shrink-0"
        isLoading={isLoading}
      />
    </div>
  );
};

export default ChatView;
