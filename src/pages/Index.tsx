
import React from 'react';
import ChatInterface from '@/components/chat/ChatInterface';
import N8nSettings from '@/components/chat/N8nSettings';

const Index = () => {
  return (
    <div className="h-screen bg-gradient-to-br from-background to-secondary/20 relative">
      <N8nSettings />
      <ChatInterface />
    </div>
  );
};

export default Index;
