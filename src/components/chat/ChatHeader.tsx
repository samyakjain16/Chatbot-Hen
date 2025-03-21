
import React from 'react';
import { Phone, Video, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatHeaderProps {
  contact: {
    name: string;
    avatar?: string;
    online: boolean;
    lastSeen?: string;
  };
  onInfoClick?: () => void;
  className?: string;
}

const ChatHeader = ({ contact, onInfoClick, className }: ChatHeaderProps) => {
  return (
    <div className={cn("flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur-sm sticky top-0 z-10", className)}>
      <div className="flex items-center">
        <div className="relative mr-3">
          {contact.avatar ? (
            <img 
              src={contact.avatar} 
              alt={contact.name} 
              className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium border-2 border-white shadow-sm">
              {contact.name.charAt(0).toUpperCase()}
            </div>
          )}
          {contact.online && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
          )}
        </div>
        <div>
          <h3 className="font-medium">{contact.name}</h3>
          <p className="text-xs text-muted-foreground">
            {contact.online ? 'Active now' : contact.lastSeen ? `Last seen ${contact.lastSeen}` : 'Offline'}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button className="p-2 rounded-full hover:bg-secondary transition-colors">
          <Phone className="h-5 w-5 text-muted-foreground" />
        </button>
        <button className="p-2 rounded-full hover:bg-secondary transition-colors">
          <Video className="h-5 w-5 text-muted-foreground" />
        </button>
        <button 
          className="p-2 rounded-full hover:bg-secondary transition-colors"
          onClick={onInfoClick}
        >
          <Info className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
