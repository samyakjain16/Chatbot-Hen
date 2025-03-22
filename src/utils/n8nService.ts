
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
    
    // Create the request payload
    const payload = {
      platform: 'testing',
      userId: 'user123',
      userName: 'Test User',
      message: message,
      timestamp: Date.now(),
      conversationId: 'conversation123',
      sessionId: sessionId
    };
    
    console.log("Request payload:", payload);
    
    try {
      // Try to make a regular request first
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      // Parse the response if successful
      if (response.ok) {
        const data = await response.json();
        console.log("Received response from n8n workflow:", data);
        
        return {
          success: true,
          message: data.output || data.message || "Message processed",
          data
        };
      } else {
        console.warn("Response not ok:", response.status);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (fetchError) {
      console.warn("Regular fetch failed, attempting fallback:", fetchError);
      
      // If CORS or other issues, try with no-cors as a fallback
      console.log("Attempting with no-cors mode");
      await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        mode: 'no-cors'
      });
      
      // Since no-cors won't give us a readable response, return a default
      return {
        success: true,
        message: `Message sent to n8n. Awaiting response.`,
        data: {
          message: message
        }
      };
    }
  } catch (error) {
    console.error("Error sending message to n8n workflow:", error);
    return {
      success: false,
      message: "Failed to connect to n8n workflow. Please check your network connection."
    };
  }
};
