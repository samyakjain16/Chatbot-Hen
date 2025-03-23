
import React from 'react';
import { Download, FileDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Message } from '@/data/sampleChatData';

interface ChatHeaderProps {
  contact: {
    name: string;
    avatar?: string;
    online: boolean;
    lastSeen?: string;
  };
  onInfoClick?: () => void;
  className?: string;
  messages?: Message[];
}

const ChatHeader = ({ contact, className, messages = [] }: ChatHeaderProps) => {
  const { toast } = useToast();

  const handleExportChat = () => {
    if (!messages || messages.length === 0) {
      toast({
        title: "No messages to export",
        description: "This chat doesn't contain any messages yet.",
        variant: "destructive",
      });
      return;
    }

    // Format the chat data
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleString();
    };

    let exportContent = `Chat with ${contact.name}\n\n`;
    
    messages.forEach((message) => {
      const sender = message.sender === 'user' ? 'You' : contact.name;
      const time = formatDate(message.timestamp);
      exportContent += `[${time}] ${sender}: ${message.content}\n`;
    });

    // Create a blob and download it
    const blob = new Blob([exportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat_with_${contact.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Chat Exported",
      description: "Your conversation has been downloaded successfully",
    });
  };

  return (
    <div className={cn("flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur-sm sticky top-0 z-10", className)}>
      <div className="flex items-center">
        <div className="relative mr-3">
          {contact.avatar ? (
            <img 
              src={contact.avatar} 
              alt={contact.name} 
              className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium border-2 border-white shadow-sm">
              {contact.name.charAt(0).toUpperCase()}
            </div>
          )}
          {contact.online && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
          )}
        </div>
        <div>
          <h3 className="font-medium">{contact.name}</h3>
          <p className="text-xs text-muted-foreground">
            {contact.online ? 'Active now' : contact.lastSeen ? `Last seen ${contact.lastSeen}` : 'Offline'}
          </p>
        </div>
      </div>
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleExportChat}
          className="text-muted-foreground hover:text-foreground"
          title="Export chat"
        >
          <FileDown className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
