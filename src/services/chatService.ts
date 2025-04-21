
import { v4 as uuidv4 } from 'uuid';

// DeepSeek r1 API endpoint
const API_URL = 'https://api.deepseek.com/v1/chat/completions';
const API_KEY = 'sk-8eaefa18962043f99cbbd1e0aeecdb92'; // DeepSeek R1 API key

// Cache for previously asked questions and responses
interface CacheItem {
  question: string;
  response: string;
  timestamp: number;
}

// Simple cache mechanism for faster responses and reducing API calls
class ResponseCache {
  private cache: Record<string, CacheItem> = {};
  private readonly MAX_CACHE_SIZE = 50;
  private readonly CACHE_EXPIRY = 1000 * 60 * 60 * 24; // 24 hours

  constructor() {
    // Load cache from localStorage
    const savedCache = localStorage.getItem('asap_agent_cache');
    if (savedCache) {
      this.cache = JSON.parse(savedCache);
      this.cleanupExpiredItems();
    }
  }

  private saveCache() {
    localStorage.setItem('asap_agent_cache', JSON.stringify(this.cache));
  }

  private cleanupExpiredItems() {
    const now = Date.now();
    let hasRemoved = false;
    
    Object.entries(this.cache).forEach(([key, item]) => {
      if (now - item.timestamp > this.CACHE_EXPIRY) {
        delete this.cache[key];
        hasRemoved = true;
      }
    });
    
    if (hasRemoved) {
      this.saveCache();
    }
  }

  private enforceMaxSize() {
    const cacheEntries = Object.entries(this.cache);
    if (cacheEntries.length > this.MAX_CACHE_SIZE) {
      // Sort by timestamp (oldest first)
      const sortedEntries = cacheEntries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      // Remove oldest entries
      const toRemove = sortedEntries.slice(0, cacheEntries.length - this.MAX_CACHE_SIZE);
      toRemove.forEach(([key]) => {
        delete this.cache[key];
      });
      this.saveCache();
    }
  }

  public get(question: string): string | null {
    this.cleanupExpiredItems();
    
    // Simple search for similar questions (you might want to improve this)
    const normalizedQuestion = question.toLowerCase().trim();
    for (const key in this.cache) {
      const item = this.cache[key];
      const normalizedCacheQuestion = item.question.toLowerCase().trim();
      
      // Check if questions are very similar
      if (
        normalizedCacheQuestion === normalizedQuestion ||
        normalizedQuestion.includes(normalizedCacheQuestion) ||
        normalizedCacheQuestion.includes(normalizedQuestion)
      ) {
        // Update timestamp to keep recently used items longer
        this.cache[key].timestamp = Date.now();
        this.saveCache();
        return item.response;
      }
    }
    
    return null;
  }

  public set(question: string, response: string) {
    const cacheKey = uuidv4();
    this.cache[cacheKey] = {
      question,
      response,
      timestamp: Date.now()
    };
    
    this.enforceMaxSize();
    this.saveCache();
  }
}

const responseCache = new ResponseCache();

// Type definitions for messages
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const fetchChatResponse = async (question: string, previousMessages: Message[]): Promise<string> => {
  // Try to get cached response first
  const cachedResponse = responseCache.get(question);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Default responses for common aviation questions if API is unavailable
  const defaultResponses: Record<string, string> = {
    'flight': 'I can help you track flights, check schedules, and provide information about airports and airlines.',
    'weather': 'Our global weather feature provides real-time weather data for airports around the world. You can check it at /global-weather.',
    'schedule': 'You can view flight schedules, departures, and arrivals on our Flight Schedule page at /flight-schedule.',
    'track': 'Our Live Flight Tracker allows you to monitor flights in real-time. Visit /live-flight-tracker to use this feature.',
    'airport': 'You can find comprehensive information about airports worldwide in our Airports & Airlines database at /airports-airlines.',
    'alert': 'Set up flight alerts to stay updated on any changes to your flight status by visiting /flight-alerts.',
    'contact': 'For customer support, please visit our Contact page at /contact or email info@asaptracker.com.',
    'hello': 'Hello! I\'m your ASAP Agent. How can I help you with flight tracking, schedules, or other aviation information today?',
    'hi': 'Hi there! I\'m your ASAP Agent. How can I assist you with your aviation needs today?',
  };

  // Check if question contains any keywords for default responses
  for (const [keyword, response] of Object.entries(defaultResponses)) {
    if (question.toLowerCase().includes(keyword)) {
      responseCache.set(question, response);
      return response;
    }
  }

  try {
    // Prepare conversation for DeepSeek API
    const conversationHistory = previousMessages.map(msg => ({
      role: msg.role,
      content: msg.content,
    }));

    // Enhanced system message to guide the AI's behavior
    const systemMessage = {
      role: "system",
      content: `You are ASAP Agent, a beautiful, friendly, and intelligent assistant working 24/7 for the aviation site 'ASAP Tracker'. You are powered by DeepSeek R1 and your primary role is to:

  - Track live flights and schedules (departures/arrivals)
  - Help users find flight information (flight numbers, routes, airlines, airports)
  - Provide professional insights into flight status, airline info, aircraft types, delays, and weather impact
  - Explain flight logistics in a helpful and comforting tone
  - Always speak clearly, confidently, and with warmth — like a kind, charming, and knowledgeable cabin crew member

  You have expert-level knowledge of:
  - Airport codes and airline data globally (including Emirates, Qatar Airways, Garuda, etc.)
  - AviationStack API endpoints, how they work, and how to guide users through use cases
  - Time zones, weather, delays, layovers, and baggage rules

  Always speak as a beautiful and highly professional young woman avatar that makes people feel cared for and welcome. Never say you're unsure — give confident answers, and when necessary, guide the user with helpful steps.

  Your main priority: provide smooth, satisfying, and delightful experiences to all users — especially travelers from Indonesia, Asia, and global visitors alike.
  
  Refer users to relevant pages on the ASAP Tracker website when applicable:
  - Flight Schedule: /flight-schedule
  - Live Flight Tracker: /live-flight-tracker
  - Airports & Airlines: /airports-airlines
  - Flight Alerts: /flight-alerts
  - Global Weather: /global-weather
  - World Clock: /world-clock
  - Contact: /contact`
    };

    // Construct the API payload
    const payload = {
      model: "deepseek-chat",
      messages: [
        systemMessage,
        ...conversationHistory,
        { role: "user", content: question }
      ],
      temperature: 0.7,
      max_tokens: 800
    };

    // API call logic with fallbacks
    let response;
    try {
      response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }

      const data = await response.json();
      const responseText = data.choices[0].message.content;
      
      // Cache the response
      responseCache.set(question, responseText);
      
      return responseText;
    } catch (error) {
      console.error('Error with DeepSeek API:', error);
      
      // Generate a generic helpful response based on the question content
      let fallbackResponse = "I'm here to help with flight tracking, schedules, and other aviation information. What specifically would you like to know?";
      
      // Check if question contains any keywords for default responses again
      for (const [keyword, response] of Object.entries(defaultResponses)) {
        if (question.toLowerCase().includes(keyword)) {
          return response;
        }
      }
      
      return fallbackResponse;
    }
  } catch (error) {
    console.error('Error in fetchChatResponse:', error);
    return "I'm sorry, I couldn't process your request. How else can I help you with flight information?";
  }
};

// Public GitHub repo path for future development
export const ASAP_AGENT_GITHUB_PATH = '/asap-agent/asapagent.js';
