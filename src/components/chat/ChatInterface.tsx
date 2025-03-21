
import React, { useState, useEffect } from 'react';
import ConversationList from './ConversationList';
import MessageList, { Message } from './MessageList';
import MessageInput from './MessageInput';
import ChatHeader from './ChatHeader';
import { cn } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

// Sample data - in a real app this would come from your n8n workflow
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

// Sample message history
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
  const isMobile = useIsMobile();

  useEffect(() => {
    if (activeContactId) {
      setMessages(sampleMessageHistory[activeContactId] || []);
      if (isMobile) {
        setShowChat(true);
      }
    }
  }, [activeContactId, isMobile]);

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: `${activeContactId}-${Date.now()}`,
      content,
      sender: 'user',
      timestamp: new Date().toISOString(),
      status: 'sent',
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Simulate a delayed status update to "delivered"
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, status: 'delivered' } 
            : msg
        )
      );
    }, 1000);
    
    // Simulate a reply from the contact after a delay
    setTimeout(() => {
      const replyMessage: Message = {
        id: `${activeContactId}-${Date.now() + 1}`,
        content: `This is an automated reply to: "${content}"`,
        sender: 'contact',
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, replyMessage]);
      
      // Update status to "read" after reply
      setMessages(prev => 
        prev.map(msg => 
          msg.sender === 'user' && msg.status !== 'read'
            ? { ...msg, status: 'read' } 
            : msg
        )
      );
    }, 2000);
  };

  const activeContact = sampleContacts.find(contact => contact.id === activeContactId);

  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar - ConversationList */}
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
      
      {/* Main chat area */}
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
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
