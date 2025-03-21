
import React from 'react';
import { User, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Contact } from '@/data/sampleChatData';

interface ConversationListProps {
  contacts: Contact[];
  activeContactId: string;
  onSelectContact: (contactId: string) => void;
  className?: string;
}

const ConversationList = ({
  contacts,
  activeContactId,
  onSelectContact,
  className
}: ConversationListProps) => {
  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Messages</h2>
          <button className="p-2 rounded-full hover:bg-secondary transition-colors">
            <User className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search conversations..." 
            className="pl-10 py-2 w-full rounded-full bg-secondary/50 text-sm border-0 focus:ring-1 focus:ring-primary/30 transition-all duration-200"
          />
        </div>
      </div>
      
      <div className="overflow-y-auto flex-1">
        {contacts.map((contact) => (
          <div 
            key={contact.id}
            className={cn(
              "flex items-center p-4 cursor-pointer transition-all duration-200",
              activeContactId === contact.id 
                ? "bg-primary/5 border-l-2 border-primary" 
                : "hover:bg-secondary/80 border-l-2 border-transparent"
            )}
            onClick={() => onSelectContact(contact.id)}
          >
            <div className="relative mr-3 flex-shrink-0">
              {contact.avatar ? (
                <img 
                  src={contact.avatar} 
                  alt={contact.name} 
                  className="user-avatar"
                />
              ) : (
                <div className="user-avatar flex items-center justify-center bg-primary/10 text-primary">
                  {contact.name.charAt(0).toUpperCase()}
                </div>
              )}
              {contact.online && (
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <h3 className="font-medium truncate">{contact.name}</h3>
                <span className="text-xs text-muted-foreground">{contact.time}</span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <p className="text-sm text-muted-foreground truncate">{contact.lastMessage}</p>
                {contact.unread > 0 && (
                  <span className="bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center ml-2">
                    {contact.unread}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversationList;
