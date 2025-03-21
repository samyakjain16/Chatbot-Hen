
/**
 * Service for integrating with n8n workflows
 */

const N8N_WEBHOOK_KEY = 'n8n_webhook_url';

interface N8nResponse {
  message: string;
  success: boolean;
  data?: any;
}

/**
 * Gets the n8n webhook URL from localStorage
 * @returns The stored webhook URL or empty string
 */
const getWebhookUrl = (): string => {
  return localStorage.getItem(N8N_WEBHOOK_KEY) || '';
};

/**
 * Sends a message to the n8n workflow and returns the response
 * @param message The message to send to the n8n workflow
 * @returns Promise with the n8n workflow response
 */
export const sendMessageToN8n = async (message: string): Promise<N8nResponse> => {
  const webhookUrl = getWebhookUrl();
  
  if (!webhookUrl) {
    console.error("N8n webhook URL is not set");
    return { 
      success: false, 
      message: "Please configure your n8n webhook URL in the settings" 
    };
  }
  
  try {
    console.log("Sending message to n8n workflow:", message);
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        timestamp: new Date().toISOString(),
        source: 'chat-interface'
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Received response from n8n workflow:", data);
    
    return {
      success: true,
      message: data.message || "Message processed",
      data
    };
  } catch (error) {
    console.error("Error sending message to n8n workflow:", error);
    return {
      success: false,
      message: "Failed to connect to n8n workflow. Please check your network connection and webhook configuration."
    };
  }
};
