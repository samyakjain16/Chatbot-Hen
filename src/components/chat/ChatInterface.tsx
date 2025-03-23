
import React from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useChatState } from '@/hooks/useChatState';
import ChatSidebar from './ChatSidebar';
import ChatView from './ChatView';
import NoConversationView from './NoConversationView';

const ChatInterface = () => {
  const isMobile = useIsMobile();
  const {
    conversations,
    activeContactId,
    messages,
    isLoading,
    showChat,
    setShowChat,
    setActiveContactId,
    sendMessage,
    createNewChat,
    handleDeleteChat,
    activeContact
  } = useChatState();

  return (
    <div className="h-screen flex bg-background">
      <ChatSidebar 
        conversations={conversations}
        activeContactId={activeContactId}
        onSelectContact={(id) => {
          console.log(`Selecting contact: ${id}`);
          setActiveContactId(id);
        }}
        onNewChat={createNewChat}
        onDeleteChat={handleDeleteChat}
        visible={!(isMobile && showChat)}
      />
      
      {activeContact ? (
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
            onSendMessage={sendMessage}
            onBackClick={() => setShowChat(false)}
            isLoading={isLoading}
            showBackButton={isMobile}
          />
        </div>
      ) : (
        <NoConversationView onNewChat={createNewChat} />
      )}
    </div>
  );
};

export default ChatInterface;
