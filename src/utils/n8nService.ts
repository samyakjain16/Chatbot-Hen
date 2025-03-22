
/**
 * Service for integrating with n8n workflows
 */

// Hardcoded n8n webhook URL
const N8N_WEBHOOK_URL = 'https://chatbot-henderson.app.n8n.cloud/webhook-test/chat';

// Generate a random session ID if none exists in localStorage
const getSessionId = (): string => {
  const SESSION_ID_KEY = 'chat_session_id';
  let sessionId = localStorage.getItem(SESSION_ID_KEY);
  
  if (!sessionId) {
    sessionId = 'session_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem(SESSION_ID_KEY, sessionId);
  }
  
  return sessionId;
};

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
    const sessionId = getSessionId();
    
    // Option 1: Using no-cors mode (note: this will return an opaque response)
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'no-cors', // Add this to handle CORS restrictions
      body: JSON.stringify({
        platform: 'testing',
        userId: 'user123',
        userName: 'Test User',
        message: message,
        timestamp: Date.now(),
        conversationId: 'conversation123',
        sessionId: sessionId
      }),
    });

    // With no-cors mode, we can't access the response content
    // So we'll need to provide a default response
    console.log("Request sent with no-cors mode");
    
    return {
      success: true,
      message: "Message sent to n8n workflow. Response not available due to CORS restrictions.",
      data: { output: message } // Echo back the message as default behavior
    };
  } catch (error) {
    console.error("Error sending message to n8n workflow:", error);
    return {
      success: false,
      message: "Failed to connect to n8n workflow. Please check your network connection."
    };
  }
};
