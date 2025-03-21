import React, { useState, useEffect } from 'react';
import ConversationList from './ConversationList';
import MessageList, { Message } from './MessageList';
import MessageInput from './MessageInput';
import ChatHeader from './ChatHeader';
import { cn } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { sendMessageToN8n } from '@/utils/n8nService';
import { useToast } from '@/hooks/use-toast';

const sampleContacts = [
  {
    id: '1',
    name: 'John Doe',
    lastMessage: 'Hey, how are you doing?',
    time: '10:30 AM',
    unread: 2,
    online: true,
  },
  {
    id: '2',
    name: 'Jane Smith',
    lastMessage: 'Can we meet tomorrow?',
    time: 'Yesterday',
    unread: 0,
    online: false,
  },
  {
    id: '3',
    name: 'Alex Johnson',
    lastMessage: 'Thanks for the info!',
    time: 'Yesterday',
    unread: 0,
    online: true,
  },
  {
    id: '4',
    name: 'Sarah Williams',
    lastMessage: 'The project is looking good!',
    time: 'Monday',
    unread: 0,
    online: false,
  },
  {
    id: '5',
    name: 'Michael Brown',
    lastMessage: 'Did you see the latest changes?',
    time: 'Monday',
    unread: 3,
    online: true,
  },
];

const sampleMessageHistory: Record<string, Message[]> = {
  '1': [
    {
      id: '1-1',
      content: 'Hey, how are you doing?',
      sender: 'contact',
      timestamp: '2023-06-10T10:30:00',
    },
    {
      id: '1-2',
      content: 'I\'m good, thanks! How about you?',
      sender: 'user',
      timestamp: '2023-06-10T10:32:00',
      status: 'read',
    },
    {
      id: '1-3',
      content: 'I\'m doing well. Just finished the project we discussed last time.',
      sender: 'contact',
      timestamp: '2023-06-10T10:33:00',
    },
    {
      id: '1-4',
      content: 'That\'s great to hear! How did it turn out?',
      sender: 'user',
      timestamp: '2023-06-10T10:35:00',
      status: 'read',
    },
    {
      id: '1-5',
      content: 'It turned out really well. The client was very happy with the results.',
      sender: 'contact',
      timestamp: '2023-06-10T10:36:00',
    },
  ],
  '2': [
    {
      id: '2-1',
      content: 'Can we meet tomorrow?',
      sender: 'contact',
      timestamp: '2023-06-09T15:20:00',
    },
    {
      id: '2-2',
      content: 'Sure, what time works for you?',
      sender: 'user',
      timestamp: '2023-06-09T15:25:00',
      status: 'read',
    },
  ],
  '3': [
    {
      id: '3-1',
      content: 'Thanks for the info!',
      sender: 'contact',
      timestamp: '2023-06-09T09:10:00',
    },
  ],
  '4': [
    {
      id: '4-1',
      content: 'The project is looking good!',
      sender: 'contact',
      timestamp: '2023-06-05T14:30:00',
    },
  ],
  '5': [
    {
      id: '5-1',
      content: 'Did you see the latest changes?',
      sender: 'contact',
      timestamp: '2023-06-05T11:20:00',
    },
    {
      id: '5-2',
      content: 'No, let me check. What was updated?',
      sender: 'user',
      timestamp: '2023-06-05T11:25:00',
      status: 'delivered',
    },
    {
      id: '5-3',
      content: 'I made some design adjustments and improved the performance.',
      sender: 'contact',
      timestamp: '2023-06-05T11:28:00',
    },
  ],
};

const ChatInterface = () => {
  const [activeContactId, setActiveContactId] = useState<string>('1');
  const [messages, setMessages] = useState<Message[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  useEffect(() => {
    if (activeContactId) {
      setMessages(sampleMessageHistory[activeContactId] || []);
      if (isMobile) {
        setShowChat(true);
      }
    }
  }, [activeContactId, isMobile]);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: `${activeContactId}-${Date.now()}`,
      content,
      sender: 'user',
      timestamp: new Date().toISOString(),
      status: 'sent',
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      const n8nResponse = await sendMessageToN8n(content);
      
      setMessages(prev => 
        prev.map(msg => 
          msg.id === userMessage.id 
            ? { ...msg, status: n8nResponse.success ? 'delivered' : 'sent' } 
            : msg
        )
      );
      
      if (n8nResponse.success) {
        const responseMessage: Message = {
          id: `${activeContactId}-${Date.now() + 1}`,
          content: n8nResponse.message || "Message received",
          sender: 'contact',
          timestamp: new Date().toISOString(),
        };
        
        setMessages(prev => [...prev, responseMessage]);
        
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
      
      <div className={cn(
        "flex-1 flex flex-col transition-all duration-300",
        (isMobile && !showChat) ? "hidden" : "block"
      )}>
        {activeContact && (
          <>
            <ChatHeader 
              contact={{
                name: activeContact.name,
                online: activeContact.online,
                lastSeen: !activeContact.online ? '10 minutes ago' : undefined,
              }}
              className="flex-shrink-0"
            />
            
            {isMobile && (
              <button 
                onClick={() => setShowChat(false)} 
                className="absolute top-4 left-4 z-20 md:hidden"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            
            <MessageList 
              messages={messages} 
              className="flex-1"
            />
            
            <MessageInput 
              onSendMessage={handleSendMessage} 
              className="flex-shrink-0"
              isLoading={isLoading}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
