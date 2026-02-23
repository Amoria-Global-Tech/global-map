'use client';

import { useState, useRef, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_ENDPOINT_URL || '';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your Amoria Global Tech assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const sendMessageToAPI = async (message: string): Promise<string> => {
    try {
      const res = await fetch(`${API_URL}/chatbot/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appId: 'amoria-home',
          message,
          conversationId: conversationId || undefined,
        }),
      });
      const data = await res.json();
      if (data.success && data.conversationId) {
        setConversationId(data.conversationId);
      }
      return data.response || 'Sorry, I could not process your request. Please try again.';
    } catch {
      return 'Sorry, I\'m having trouble connecting. Please try again or contact info@amoriaglobal.com';
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageText = inputValue.trim();
    setInputValue('');
    setIsTyping(true);

    const botResponse = await sendMessageToAPI(messageText);
    const botMessage: Message = {
      id: Date.now() + 1,
      text: botResponse,
      sender: 'bot',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMessage]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    "What services do you offer?",
    "How can I contact you?",
    "What are your pricing plans?",
    "Tell me about your products"
  ];

  return (
    <div className="chatbot-container">
      {/* Chat Window */}
      <div className={`chatbot-window ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="chatbot-header">
          <div className="chatbot-header-info">
            <div className="chatbot-avatar">
              <i className="bi bi-robot"></i>
            </div>
            <div className="chatbot-title">
              <h4>Amoria Assistant</h4>
              <span className="chatbot-status">Online</span>
            </div>
          </div>
          <button className="chatbot-close" onClick={toggleChatbot}>
            <i className="bi bi-x"></i>
          </button>
        </div>

        {/* Messages */}
        <div className="chatbot-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.sender}`}>
              <div className="message-content">
                <p>{message.text}</p>
                <span className="message-time">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="message bot">
              <div className="message-content typing">
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        {messages.length === 1 && (
          <div className="quick-questions">
            <p>Quick questions:</p>
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                className="quick-question-btn"
                onClick={async () => {
                  const userMessage: Message = {
                    id: Date.now(),
                    text: question,
                    sender: 'user',
                    timestamp: new Date()
                  };
                  setMessages(prev => [...prev, userMessage]);
                  setIsTyping(true);
                  const botResponse = await sendMessageToAPI(question);
                  const botMsg: Message = {
                    id: Date.now() + 1,
                    text: botResponse,
                    sender: 'bot',
                    timestamp: new Date()
                  };
                  setMessages(prev => [...prev, botMsg]);
                  setIsTyping(false);
                }}
              >
                {question}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="chatbot-input">
          <div className="input-container">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isTyping}
            />
            <button 
              onClick={handleSendMessage} 
              disabled={!inputValue.trim() || isTyping}
              className="send-button"
            >
              <i className="bi bi-send-fill"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      <button className={`chatbot-toggle ${isOpen ? 'open' : ''}`} onClick={toggleChatbot}>
        {isOpen ? (
          <i className="bi bi-x"></i>
        ) : (
          <i className="bi bi-chat-dots-fill"></i>
        )}
        {!isOpen && <span className="notification-dot"></span>}
      </button>
    </div>
  );
}