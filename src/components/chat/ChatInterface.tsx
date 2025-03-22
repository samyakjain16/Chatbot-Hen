
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useChat } from '@/hooks/use-chat';
import ConversationList from './ConversationList';
import ChatView from './ChatView';
import { sampleContacts, sampleMessageHistory } from '@/data/sampleChatData';

const ChatInterface = () => {
  const [activeContactId, setActiveContactId] = useState<string>('1');
  const [showChat, setShowChat] = useState(false);
  const isMobile = useIsMobile();
  
  const { messages, setMessages, isLoading, sendMessage } = useChat();

  useEffect(() => {
    if (activeContactId) {
      setMessages(sampleMessageHistory[activeContactId] || []);
      if (isMobile) {
        setShowChat(true);
      }
    }
  }, [activeContactId, isMobile, setMessages]);

  const handleSendMessage = (content: string) => {
    sendMessage(content, activeContactId);
  };

  const activeContact = sampleContacts.find(contact => contact.id === activeContactId);

  return (
    <div className="h-screen flex bg-background">
      <div className={cn(
        "w-full md:w-80 flex-shrink-0 border-r bg-card transition-all duration-300",
        (isMobile && showChat) ? "hidden" : "block"
      )}>
        <ConversationList 
          contacts={sampleContacts}
          activeContactId={activeContactId}
          onSelectContact={setActiveContactId}
        />
      </div>
      
      {activeContact && (
        <div className={cn(
          "flex-1 transition-all duration-300",
          (isMobile && !showChat) ? "hidden" : "block"
        )}>
          <ChatView
            contact={{
              id: activeContact.id,
              name: activeContact.name,
              online: activeContact.online
            }}
            messages={messages}
            onSendMessage={handleSendMessage}
            onBackClick={() => setShowChat(false)}
            isLoading={isLoading}
            showBackButton={isMobile}
          />
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
