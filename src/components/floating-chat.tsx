"use client";

import React, { useState, useEffect, useRef } from 'react';

const messages = [
  'Hey!',
  'Want faster growth?',
  'Struggling with outbound?',
  'Tired of manual ops?',
  'I can help with that',
  "Let's chat!"
];

const FloatingChat: React.FC = () => {
  const [displayText, setDisplayText] = useState('Hey!');
  const [isAnimating, setIsAnimating] = useState(false);
  const messageIndexRef = useRef(0);
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  const calendarLink = 'https://calendar.app.google/vXojVNrChx8WhY5P8';

  useEffect(() => {
    const cycleMessages = () => {
      const currentIndex = messageIndexRef.current;
      const currentMessage = messages[currentIndex];
      const nextIndex = (currentIndex + 1) % messages.length;
      const nextMessage = messages[nextIndex];

      // Show current message for 2-3 seconds
      const displayTime = currentMessage.length > 15 ? 3000 : 2500;
      
      const timeout1 = setTimeout(() => {
        setIsAnimating(true);
        
        // Delete current message character by character
        let currentText = currentMessage;
        const deleteInterval = setInterval(() => {
          if (currentText.length > 0) {
            currentText = currentText.slice(0, -1);
            setDisplayText(currentText);
          } else {
            clearInterval(deleteInterval);
            
            // Wait a moment, then type next message
            const timeout2 = setTimeout(() => {
              let index = 0;
              const typeInterval = setInterval(() => {
                if (index < nextMessage.length) {
                  setDisplayText(nextMessage.slice(0, index + 1));
                  index++;
                } else {
                  clearInterval(typeInterval);
                  setIsAnimating(false);
                  messageIndexRef.current = nextIndex;
                  
                  // Continue cycling
                  const timeout3 = setTimeout(() => {
                    cycleMessages();
                  }, displayTime);
                  timeoutRefs.current.push(timeout3);
                }
              }, 100); // Type each character every 100ms
            }, 400);
            timeoutRefs.current.push(timeout2);
          }
        }, 80); // Delete each character every 80ms
      }, displayTime);
      timeoutRefs.current.push(timeout1);
    };

    // Start cycling after initial "Hey" display
    const initialTimeout = setTimeout(() => {
      cycleMessages();
    }, 2000); // Show "Hey" for 2 seconds first
    timeoutRefs.current.push(initialTimeout);

    return () => {
      timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
      timeoutRefs.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = () => {
    window.open(calendarLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float-chat {
          0% {
            transform: translate(0px, 0px);
          }
          25% {
            transform: translate(6px, -8px);
          }
          50% {
            transform: translate(-4px, -12px);
          }
          75% {
            transform: translate(-6px, -6px);
          }
          100% {
            transform: translate(0px, 0px);
          }
        }
        @keyframes float-rotate-chat {
          0%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(2deg);
          }
          50% {
            transform: rotate(-1deg);
          }
          75% {
            transform: rotate(-2deg);
          }
        }
        @keyframes pulse-slow-chat {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 0.8;
          }
        }
        .animate-float-chat {
          animation: float-chat 8s ease-in-out infinite;
        }
        .animate-float-rotate-chat {
          animation: float-rotate-chat 10s ease-in-out infinite;
        }
        .animate-pulse-slow-chat {
          animation: pulse-slow-chat 4s ease-in-out infinite;
        }
      `}} />
      <div className="fixed bottom-6 right-5 md:bottom-8 md:right-8 z-50 hidden md:block max-w-[calc(100vw-2rem)]">
        <div className="relative group animate-float-chat flex items-center gap-2">
          {/* Speech Bubble */}
          <div 
            className="relative z-10 cursor-pointer flex-shrink-0"
            onClick={handleClick}
            style={{
              maxWidth: 'calc(100vw - 8rem)',
            }}
          >
            <div 
              className="bg-white text-[#09090b] text-xs md:text-sm font-normal px-3 md:px-4 py-2 md:py-2.5 shadow-lg hover:shadow-xl transition-shadow duration-200 relative whitespace-nowrap"
              style={{
                borderRadius: '18px',
                border: '1px solid #e4e4e7',
                lineHeight: '1.4',
              }}
            >
              {displayText}
              {isAnimating && <span className="inline-block w-0.5 h-3 bg-[#09090b] ml-1 animate-pulse">|</span>}
              
              {/* Speech bubble tail pointing right */}
              <div 
                className="absolute"
                style={{
                  right: '-7px',
                  top: '50%',
                  width: '10px',
                  height: '10px',
                  background: 'white',
                  borderTop: '1px solid #e4e4e7',
                  borderRight: '1px solid #e4e4e7',
                  transform: 'translateY(-50%) rotate(45deg)',
                }}
              ></div>
            </div>
          </div>
          
          <div className="relative animate-float-rotate-chat flex-shrink-0">
            <div className="absolute -inset-1.5 rounded-full bg-gradient-to-br from-[#D4AF37]/30 via-[#09090b]/10 to-[#D4AF37]/20 opacity-60 group-hover:opacity-100 transition-opacity duration-300 blur-md animate-pulse-slow-chat"></div>
            <button
              onClick={handleClick}
              className="relative w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-[#e4e4e7] shadow-xl ring-1 ring-[#D4AF37]/20 group-hover:ring-[#D4AF37]/40 transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 overflow-hidden p-0 bg-transparent"
              style={{ outline: 'none' }}
            >
              <img 
                src="/sneha-das-dp.png" 
                alt="Sneha Das" 
                className="w-full h-full object-cover pointer-events-none"
              />
            </button>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent via-transparent to-[#D4AF37]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FloatingChat;
