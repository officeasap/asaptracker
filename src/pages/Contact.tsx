
import React, { useState, useRef, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import { Button } from '@/components/ui/button';
import { X, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

const Contact = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; fromUser: boolean }[]>([
    { text: "Hello! I'm Avia, your virtual assistant. How can I help you with your flight inquiries today?", fromUser: false }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [avatarLoaded, setAvatarLoaded] = useState(false);

  // Sample responses for the virtual assistant
  const sampleResponses = [
    "I can help you track any flight worldwide. Simply provide the flight number, and I'll give you real-time updates.",
    "Our global weather forecast can show conditions at any airport. Would you like me to check a specific location for you?",
    "You can view detailed information about airports and airlines in our database, including terminals, gates, and contact information.",
    "If your flight is delayed, I can help you understand the reason and estimated new departure time.",
    "Feel free to ask about any aspect of our flight tracking services!",
    "I'd be happy to assist with that. Could you provide more details?",
    "We have information for all major Asian airports including Jakarta, Singapore, Bangkok, Kuala Lumpur, and many more.",
    "Our historical flight data goes back 7 days, allowing you to check past flight performance."
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { text: inputValue, fromUser: true }]);
    setInputValue('');
    
    // Simulate AI thinking with delayed response
    setTimeout(() => {
      const randomResponse = sampleResponses[Math.floor(Math.random() * sampleResponses.length)];
      setMessages(prev => [...prev, { text: randomResponse, fromUser: false }]);
    }, 1000);
  };

  const handleInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-dark text-white overflow-x-hidden">
      <Header />
      
      {/* Page Title Section */}
      <section className="pt-32 pb-8 relative">
        <div className="absolute inset-0 bg-radial-gradient from-purple/10 via-transparent to-transparent z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold font-space mb-4 animate-fade-in">
              Contact <span className="text-purple animate-text-glow">Us</span>
            </h1>
            <p className="text-xl text-gray-light animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Have questions or need assistance? Our team is ready to help you track flights worldwide.
            </p>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <div className="container mx-auto px-4">
        <ContactForm />
        
        {/* 3D Avatar Chat Agent */}
        <div className="fixed bottom-6 right-6 z-50">
          {!chatOpen ? (
            <Button 
              onClick={() => setChatOpen(true)} 
              className="bg-purple hover:bg-purple-600 text-white purple-glow h-16 w-16 rounded-full"
            >
              <MessageCircle size={24} />
            </Button>
          ) : (
            <div className="bg-dark border border-gray-dark rounded-xl shadow-lg w-[350px] md:w-[400px] overflow-hidden flex flex-col">
              <div className="bg-gray-dark/70 p-3 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-purple overflow-hidden flex items-center justify-center">
                    <img 
                      src="https://images.unsplash.com/photo-1596590508711-ccc7d63d0187?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" 
                      alt="AI Assistant" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium">Avia Assistant</h3>
                    <p className="text-xs text-gray-light">Online now</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setChatOpen(false)}
                  className="text-gray-light hover:text-white"
                >
                  <X size={18} />
                </Button>
              </div>
              
              <div className="relative">
                <div className="h-[350px] overflow-y-auto bg-gradient-to-b from-gray-dark/20 to-dark p-4">
                  <div className="flex flex-col space-y-4">
                    {messages.map((message, index) => (
                      <div 
                        key={index} 
                        className={`flex ${message.fromUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[80%] p-3 rounded-xl ${
                            message.fromUser 
                              ? 'bg-purple text-white rounded-tr-none' 
                              : 'bg-gray-dark/70 text-white rounded-tl-none'
                          }`}
                        >
                          {message.text}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
                
                <div className="p-3 border-t border-gray-dark bg-dark">
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleInputKeyPress}
                      placeholder="Type your message..."
                      className="flex-1 bg-gray-dark/50 border-gray-dark text-white placeholder:text-gray-light focus:border-purple rounded-lg py-2 px-3"
                    />
                    <Button 
                      onClick={handleSendMessage} 
                      className="ml-2 bg-purple hover:bg-purple-600 text-white"
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Contact;
