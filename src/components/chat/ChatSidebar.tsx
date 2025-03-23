
import React from 'react';
import { cn } from '@/lib/utils';
import ConversationList from './ConversationList';
import { Contact } from '@/data/sampleChatData';

interface ChatSidebarProps {
  conversations: Contact[];
  activeContactId: string;
  onSelectContact: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
  className?: string;
  visible: boolean;
}

const ChatSidebar = ({
  conversations,
  activeContactId,
  onSelectContact,
  onNewChat,
  onDeleteChat,
  className,
  visible
}: ChatSidebarProps) => {
  return (
    <div className={cn(
      "w-full md:w-80 flex-shrink-0 border-r bg-card transition-all duration-300",
      visible ? "block" : "hidden",
      className
    )}>
      <ConversationList 
        contacts={conversations}
        activeContactId={activeContactId}
        onSelectContact={onSelectContact}
        onNewChat={onNewChat}
        onDeleteChat={onDeleteChat}
      />
    </div>
  );
};

export default ChatSidebar;
