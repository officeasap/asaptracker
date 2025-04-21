'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Smile, Mic } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import EmojiPicker from 'emoji-picker-react';
import { Rnd } from 'react-rnd';
import { useChat } from '@/hooks/useChat';

interface ASAPAgentChatWindowProps {
  onClose: () => void;
}

const ASAPAgentChatWindow: React.FC<ASAPAgentChatWindowProps> = ({ onClose }) => {
  const { messages, isLoading, sendMessage } = useChat();
  const [input, setInput] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage(input);
      setInput('');
    }
  };

  const handleVoiceInput = () => {
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => prev + transcript);
    };
    recognition.start();
  };

  return (
    <Rnd
      default={{
        x: isMobile ? 0 : 100,
        y: isMobile ? 0 : 100,
        width: isMobile ? window.innerWidth : 400,
        height: isMobile ? window.innerHeight : 500,
      }}
      minWidth={300}
      minHeight={400}
      bounds="window"
      disableDragging={isMobile}
      enableResizing={!isMobile}
      className="z-50"
    >
      <div className="bg-dark border border-[#8B0000]/20 rounded-lg shadow-xl w-full h-full flex flex-col overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="bg-[#1A1A1A] px-4 py-3 border-b border-[#8B0000]/20 flex items-center justify-between">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-3 border border-[#8B0000]">
              <AvatarImage src="https://source.unsplash.com/random/150x150/?portrait-female" alt="ASAP Agent" />
              <AvatarFallback className="bg-[#8B0000] text-white font-semibold">AS</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-white font-semibold text-sm">ASAP Agent</h3>
              <p className="text-gray-400 text-xs">Online</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-dark to-[#1A1A1A]">
          {messages.length === 0 && (
            <div className="flex items-start mb-4">
              <Avatar className="h-8 w-8 mr-3 border border-[#8B0000]">
                <AvatarImage src="https://source.unsplash.com/random/150x150/?portrait-female" alt="ASAP Agent" />
                <AvatarFallback className="bg-[#8B0000] text-white font-semibold">AS</AvatarFallback>
              </Avatar>
              <div className="bg-[#2C2C2C] rounded-lg rounded-tl-none p-3 max-w-[85%]">
                <p className="text-white text-sm">
                  Hello! I'm your ASAP Agent. How can I assist you with flight tracking, schedules, or any aviation info? I'm here to help!
                </p>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className={`flex items-start ${message.role === 'user' ? 'justify-end' : ''}`}>
              {message.role === 'assistant' && (
                <Avatar className="h-8 w-8 mr-3 border border-[#8B0000]">
                  <AvatarImage src="https://source.unsplash.com/random/150x150/?portrait-female" alt="ASAP Agent" />
                  <AvatarFallback className="bg-[#8B0000] text-white font-semibold">AS</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`rounded-lg p-3 max-w-[85%] ${
                  message.role === 'user'
                    ? 'bg-[#8B0000] text-white rounded-br-none ml-auto'
                    : 'bg-[#2C2C2C] text-white rounded-tl-none'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-60 mt-1 text-right">
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start">
              <Avatar className="h-8 w-8 mr-3 border border-[#8B0000]">
                <AvatarImage src="https://source.unsplash.com/random/150x150/?portrait-female" alt="ASAP Agent" />
                <AvatarFallback className="bg-[#8B0000] text-white font-semibold">AS</AvatarFallback>
              </Avatar>
              <div className="space-y-2 max-w-[85%]">
                <Skeleton className="h-4 w-32 bg-[#2C2C2C]" />
                <Skeleton className="h-4 w-48 bg-[#2C2C2C]" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="p-3 border-t border-[#8B0000]/20 bg-[#1A1A1A] relative">
          {showEmoji && (
            <div className="absolute bottom-16 right-4 z-50">
              <EmojiPicker onEmojiClick={(emojiData) => setInput((prev) => prev + emojiData.emoji)} />
            </div>
          )}

          <div className="flex items-center">
            <Smile className="text-white mr-2 cursor-pointer" onClick={() => setShowEmoji(!showEmoji)} />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about flights, airports, or travel..."
              className="flex-1 bg-[#2C2C2C] text-white rounded-l-lg px-4 py-2 outline-none focus:ring-1 focus:ring-[#8B0000] placeholder:text-gray-400"
              disabled={isLoading}
            />
            <Mic className="text-white ml-2 cursor-pointer" onClick={handleVoiceInput} />
            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-[#8B0000] hover:bg-[#A80000] text-white rounded-l-none rounded-r-lg px-4 py-2 h-[38px]"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </Rnd>
  );
};

export default ASAPAgentChatWindow;















