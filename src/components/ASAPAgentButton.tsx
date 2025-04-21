import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import ASAPAgentChatWindow from './ASAPAgentChatWindow';

const ASAPAgentButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);

  const toggleChatWindow = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setUnreadMessages(0);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {isOpen && (
        <ASAPAgentChatWindow 
          onClose={() => setIsOpen(false)}
          onMessage={() => setUnreadMessages((prev) => prev + 1)}
        />
      )}

      <button
        onClick={toggleChatWindow}
        className="h-14 w-14 rounded-full bg-[#8B0000] shadow-lg hover:bg-[#A80000] transition-colors flex items-center justify-center text-white"
        aria-label="Chat with ASAP Agent"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <div className="relative">
            <MessageCircle className="h-6 w-6" />
            {unreadMessages > 0 && (
              <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-white text-[#8B0000] text-xs flex items-center justify-center font-bold">
                {unreadMessages}
              </span>
            )}
          </div>
        )}
      </button>
    </div>
  );
};

export default ASAPAgentButton;
