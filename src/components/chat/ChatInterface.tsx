
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useChat } from '@/hooks/use-chat';
import ConversationList from './ConversationList';
import ChatView from './ChatView';
import { Contact, Message } from '@/data/sampleChatData';
import { PlusCircle } from 'lucide-react';

// Generate a random ID for new conversations
const generateId = () => `chat_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

const ChatInterface = () => {
  // State to store conversations
  const [conversations, setConversations] = useState<Contact[]>(() => {
    const savedConversations = localStorage.getItem('conversations');
    return savedConversations ? JSON.parse(savedConversations) : [];
  });
  
  const [activeContactId, setActiveContactId] = useState<string>('');
  const [showChat, setShowChat] = useState(false);
  const isMobile = useIsMobile();
  
  const { messages, setMessages, isLoading, sendMessage } = useChat();

  // Load conversations from localStorage when component mounts
  useEffect(() => {
    const savedConversations = localStorage.getItem('conversations');
    if (savedConversations) {
      setConversations(JSON.parse(savedConversations));
    }
    
    const savedMessages = localStorage.getItem('messageHistory');
    if (savedMessages) {
      const messageHistory = JSON.parse(savedMessages);
      if (activeContactId && messageHistory[activeContactId]) {
        setMessages(messageHistory[activeContactId]);
      }
    }
  }, []);

  // Update localStorage when conversations change
  useEffect(() => {
    localStorage.setItem('conversations', JSON.stringify(conversations));
  }, [conversations]);

  // Update localStorage when messages change
  useEffect(() => {
    if (activeContactId) {
      const savedMessages = localStorage.getItem('messageHistory') || '{}';
      const messageHistory = JSON.parse(savedMessages);
      messageHistory[activeContactId] = messages;
      localStorage.setItem('messageHistory', JSON.stringify(messageHistory));
    }
  }, [messages, activeContactId]);

  // Load messages for the active conversation
  useEffect(() => {
    if (activeContactId) {
      const savedMessages = localStorage.getItem('messageHistory') || '{}';
      const messageHistory = JSON.parse(savedMessages);
      setMessages(messageHistory[activeContactId] || []);
      
      if (isMobile) {
        setShowChat(true);
      }
    }
  }, [activeContactId, isMobile, setMessages]);

  const handleSendMessage = (content: string) => {
    sendMessage(content, activeContactId);
    
    // Update last message in conversation list
    setConversations(prev => 
      prev.map(conv => 
        conv.id === activeContactId 
          ? { 
              ...conv, 
              lastMessage: content,
              time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
              unread: 0
            } 
          : conv
      )
    );
  };

  const createNewChat = () => {
    const newChatId = generateId();
    const newChat: Contact = {
      id: newChatId,
      name: `Chat ${conversations.length + 1}`,
      lastMessage: 'New conversation',
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      unread: 0,
      online: true,
    };
    
    setConversations(prev => [newChat, ...prev]);
    setActiveContactId(newChatId);
    setMessages([]);
    
    // Initialize empty message history for this chat
    const savedMessages = localStorage.getItem('messageHistory') || '{}';
    const messageHistory = JSON.parse(savedMessages);
    messageHistory[newChatId] = [];
    localStorage.setItem('messageHistory', JSON.stringify(messageHistory));
  };

  const activeContact = conversations.find(contact => contact.id === activeContactId);

  return (
    <div className="h-screen flex bg-background">
      <div className={cn(
        "w-full md:w-80 flex-shrink-0 border-r bg-card transition-all duration-300",
        (isMobile && showChat) ? "hidden" : "block"
      )}>
        <ConversationList 
          contacts={conversations}
          activeContactId={activeContactId}
          onSelectContact={setActiveContactId}
          onNewChat={createNewChat}
        />
      </div>
      
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
            onSendMessage={handleSendMessage}
            onBackClick={() => setShowChat(false)}
            isLoading={isLoading}
            showBackButton={isMobile}
          />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <PlusCircle className="h-12 w-12 mb-4 mx-auto text-muted-foreground" />
            <h2 className="text-2xl font-semibold mb-2">No conversation selected</h2>
            <p className="text-muted-foreground mb-4">Select an existing conversation or start a new one</p>
            <button 
              onClick={createNewChat}
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              New Chat
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
