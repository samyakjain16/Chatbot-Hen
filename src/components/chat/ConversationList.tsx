import React from 'react';
import { User, Search, PlusCircle, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Contact } from '@/data/sampleChatData';

interface ConversationListProps {
  contacts: Contact[];
  activeContactId: string;
  onSelectContact: (contactId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (contactId: string) => void;
  className?: string;
}

const ConversationList = ({
  contacts,
  activeContactId,
  onSelectContact,
  onNewChat,
  onDeleteChat,
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
      
      <div className="p-3">
        <button 
          onClick={onNewChat}
          className="flex items-center w-full gap-2 px-4 py-3 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
        >
          <PlusCircle className="h-5 w-5" />
          <span className="font-medium">New Chat</span>
        </button>
      </div>
      
      <div className="overflow-y-auto flex-1">
        {contacts.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            <p>No conversations yet</p>
            <p className="text-sm mt-1">Start a new chat to begin</p>
          </div>
        ) : (
          contacts.map((contact) => (
            <div 
              key={contact.id}
              className={cn(
                "flex items-center p-4 cursor-pointer transition-all duration-200 group",
                activeContactId === contact.id 
                  ? "bg-primary/5 border-l-2 border-primary" 
                  : "hover:bg-secondary/80 border-l-2 border-transparent"
              )}
            >
              <div 
                className="flex-1 flex items-center min-w-0"
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
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChat(contact.id);
                }}
                className="ml-2 p-2 rounded-full opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                aria-label={`Delete conversation with ${contact.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConversationList;