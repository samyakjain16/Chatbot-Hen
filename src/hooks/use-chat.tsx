import { useState } from 'react';
import { Message } from '@/data/sampleChatData';
import { sendMessageToN8n } from '@/utils/n8nService';
import { useToast } from '@/hooks/use-toast';

export function useChat(initialMessages: Message[] = []) {
  // Initialize with empty array or initial messages if provided
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = async (content: string, activeContactId: string) => {
    if (!content.trim() || !activeContactId) {
      return;
    }
    
    const userMessage: Message = {
      id: `${activeContactId}-${Date.now()}`,
      content,
      sender: 'user',
      timestamp: new Date().toISOString(),
      status: 'sent',
    };
    
    // Add the user message to the chat
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
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
        // Create response message
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
          description: n8nResponse.message,
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
  };

  return {
    messages,
    setMessages,
    isLoading,
    sendMessage
  };
}