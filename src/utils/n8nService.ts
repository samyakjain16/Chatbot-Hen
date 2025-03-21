
/**
 * Service for integrating with n8n workflows
 */

// Hardcoded n8n webhook URL
const N8N_WEBHOOK_URL = 'https://chatbot-henderson.app.n8n.cloud/webhook-test/chat';

interface N8nResponse {
  message: string;
  success: boolean;
  data?: any;
}

/**
 * Sends a message to the n8n workflow and returns the response
 * @param message The message to send to the n8n workflow
 * @returns Promise with the n8n workflow response
 */
export const sendMessageToN8n = async (message: string): Promise<N8nResponse> => {
  try {
    console.log("Sending message to n8n workflow:", message);
    
    const response = await fetch(N8N_WEBHOOK_URL, {
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
      message: "Failed to connect to n8n workflow. Please check your network connection."
    };
  }
};
