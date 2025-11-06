const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL;

export async function sendChatMessage(message: string, sessionId: string) {
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chatInput: message,
        sessionId: sessionId
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to send message');
    }
    
    const data = await response.json();
    return data.output || data.response || data.message || 'Thank you for your message!';
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
}

export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
