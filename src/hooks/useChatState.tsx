
import { useState, useEffect, useCallback } from 'react';
import { Contact, Message } from '@/data/sampleChatData';
import { useToast } from '@/hooks/use-toast';
import { sendMessageToN8n } from '@/utils/n8nService';

// Generate a random ID for new conversations
const generateId = () => `chat_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

export const useChatState = () => {
  // State to store conversations
  const [conversations, setConversations] = useState<Contact[]>(() => {
    const savedConversations = localStorage.getItem('conversations');
    return savedConversations ? JSON.parse(savedConversations) : [];
  });
  
  const [activeContactId, setActiveContactId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
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
      
      setShowChat(true);
    } else {
      // Reset messages when no active contact
      setMessages([]);
    }
  }, [activeContactId]);

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
    const userMessage: Message = {
      id: `${activeContactId}-${Date.now()}`,
      content,
      sender: 'user',
      timestamp: new Date().toISOString(),
      status: 'sent',
    };
    
    // Add user message to state
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
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
    
    try {
      // Send message to n8n workflow
      const n8nResponse = await sendMessageToN8n(content);
      
      // Update message status
      setMessages(prev => 
        prev.map(msg => 
          msg.id === userMessage.id 
            ? { ...msg, status: n8nResponse.success ? 'delivered' : 'sent' } 
            : msg
        )
      );
      
      if (n8nResponse.success) {
        // Create response message from n8n
        const responseMessage: Message = {
          id: `${activeContactId}-${Date.now() + 1}`,
          content: n8nResponse.message || "Message received",
          sender: 'contact',
          timestamp: new Date().toISOString(),
        };
        
        // Add the response message
        setMessages(prev => [...prev, responseMessage]);
        
        // Update all user messages as read
        setMessages(prev => 
          prev.map(msg => 
            msg.sender === 'user' && msg.status !== 'read'
              ? { ...msg, status: 'read' } 
              : msg
          )
        );
      } else {
        toast({
          title: "Message Delivery Failed",
          description: n8nResponse.message || "Failed to process your message",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error in message handling:", error);
      toast({
        title: "Error",
        description: "Failed to process your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [activeContactId, toast]);

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

  return {
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
    activeContact: conversations.find(contact => contact.id === activeContactId)
  };
};
