import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import ConversationList from './ConversationList';
import ChatView from './ChatView';
import { Contact, Message } from '@/data/sampleChatData';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Generate a random ID for new conversations
const generateId = () => `chat_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

const ChatInterface = () => {
  // State to store conversations
  const [conversations, setConversations] = useState<Contact[]>(() => {
    const savedConversations = localStorage.getItem('conversations');
    return savedConversations ? JSON.parse(savedConversations) : [];
  });
  
  const [activeContactId, setActiveContactId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Load conversations from localStorage when component mounts
  useEffect(() => {
    const savedConversations = localStorage.getItem('conversations');
    if (savedConversations) {
      setConversations(JSON.parse(savedConversations));
    }
  }, []);

  // Update localStorage when conversations change
  useEffect(() => {
    localStorage.setItem('conversations', JSON.stringify(conversations));
  }, [conversations]);

  // Load messages for the active conversation
  useEffect(() => {
    if (activeContactId) {
      console.log(`Loading messages for contact: ${activeContactId}`);
      
      // Get messages for this contact from localStorage
      const savedMessages = localStorage.getItem('messageHistory') || '{}';
      const messageHistory = JSON.parse(savedMessages);
      
      // This is where we load the messages for the selected contact
      const contactMessages = messageHistory[activeContactId] || [];
      console.log(`Found ${contactMessages.length} messages for this contact`);
      
      // Set messages in state
      setMessages(contactMessages);
      
      if (isMobile) {
        setShowChat(true);
      }
    } else {
      // Reset messages when no active contact
      setMessages([]);
    }
  }, [activeContactId, isMobile]);

  // Save messages to localStorage when they change
  useEffect(() => {
    if (activeContactId && messages.length > 0) {
      console.log(`Saving ${messages.length} messages for contact: ${activeContactId}`);
      
      const savedMessages = localStorage.getItem('messageHistory') || '{}';
      const messageHistory = JSON.parse(savedMessages);
      messageHistory[activeContactId] = messages;
      localStorage.setItem('messageHistory', JSON.stringify(messageHistory));
    }
  }, [messages, activeContactId]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !activeContactId) return;
    
    setIsLoading(true);
    
    // Create a new message object
    const newMessage: Message = {
      id: `${activeContactId}-${Date.now()}`,
      content,
      sender: 'user',
      timestamp: new Date().toISOString(),
      status: 'sent',
    };
    
    // Add message to the state
    setMessages(prevMessages => [...prevMessages, newMessage]);
    
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
    
    // Simulate response (replace with actual API call)
    setTimeout(() => {
      const responseMessage: Message = {
        id: `${activeContactId}-${Date.now() + 1}`,
        content: `Reply to: ${content}`,
        sender: 'contact',
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prevMessages => [...prevMessages, responseMessage]);
      setIsLoading(false);
    }, 1000);
    
  }, [activeContactId]);

  const createNewChat = useCallback(() => {
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
  }, [conversations]);

  const handleDeleteChat = useCallback((contactId: string) => {
    // Remove the conversation from state
    setConversations(prev => prev.filter(conv => conv.id !== contactId));
    
    // Remove the message history for this conversation
    const savedMessages = localStorage.getItem('messageHistory') || '{}';
    const messageHistory = JSON.parse(savedMessages);
    delete messageHistory[contactId];
    localStorage.setItem('messageHistory', JSON.stringify(messageHistory));
    
    // If the active conversation is being deleted, clear the active contact
    if (activeContactId === contactId) {
      setActiveContactId('');
      setMessages([]);
    }
    
    // Show confirmation toast
    toast({
      title: "Chat deleted",
      description: "The conversation has been removed",
    });
  }, [activeContactId, toast]);

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
          onSelectContact={(id) => {
            console.log(`Selecting contact: ${id}`);
            setActiveContactId(id);
          }}
          onNewChat={createNewChat}
          onDeleteChat={handleDeleteChat}
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
            onSendMessage={sendMessage}
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