
import React from 'react';
import { PlusCircle } from 'lucide-react';

interface NoConversationViewProps {
  onNewChat: () => void;
}

const NoConversationView = ({ onNewChat }: NoConversationViewProps) => {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center p-8">
        <PlusCircle className="h-12 w-12 mb-4 mx-auto text-muted-foreground" />
        <h2 className="text-2xl font-semibold mb-2">No conversation selected</h2>
        <p className="text-muted-foreground mb-4">Select an existing conversation or start a new one</p>
        <button 
          onClick={onNewChat}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          New Chat
        </button>
      </div>
    </div>
  );
};

export default NoConversationView;
