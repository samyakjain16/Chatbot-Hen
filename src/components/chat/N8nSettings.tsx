
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const N8N_WEBHOOK_KEY = 'n8n_webhook_url';

const N8nSettings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Load saved webhook URL from localStorage on component mount
    const savedUrl = localStorage.getItem(N8N_WEBHOOK_KEY);
    if (savedUrl) {
      setWebhookUrl(savedUrl);
    }
  }, []);

  const handleSave = () => {
    if (!webhookUrl) {
      toast({
        title: "Error",
        description: "Please enter your n8n webhook URL",
        variant: "destructive",
      });
      return;
    }

    // Save webhook URL to localStorage
    localStorage.setItem(N8N_WEBHOOK_KEY, webhookUrl);
    
    // Update n8nService's URL value if needed
    // (In a more sophisticated app, we would use a context or state management)
    
    toast({
      title: "Settings Saved",
      description: "Your n8n webhook URL has been saved",
    });
    
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-2 right-2 z-10"
      >
        <Settings className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div className="absolute top-12 right-2 z-20 w-80 p-4 bg-background border rounded-md shadow-lg">
          <h3 className="font-medium mb-2">n8n Webhook Settings</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="webhook-url" className="text-sm font-medium">
                Webhook URL
              </label>
              <Input
                id="webhook-url"
                type="text"
                placeholder="https://your-n8n-instance.com/webhook/..."
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter the webhook URL from your n8n workflow
              </p>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default N8nSettings;
