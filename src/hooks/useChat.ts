
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { fetchChatResponse } from '@/services/chatService';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const useChat = () => {
  // Load messages from localStorage on initial render
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('asap_agent_messages');
    return saved ? JSON.parse(saved) : [];
  });
  const [isLoading, setIsLoading] = useState(false);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('asap_agent_messages', JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async (content: string) => {
    // Add user message to the chat
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Get response from API
      const response = await fetchChatResponse(content, messages);
      
      // Add assistant message to the chat
      const assistantMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error fetching chat response:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('asap_agent_messages');
  };

  return {
    messages,
    isLoading,
    sendMessage,
    clearChat,
  };
};
