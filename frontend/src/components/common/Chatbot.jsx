import React, { useState, useEffect, useRef } from 'react';
import chatbotData from '../../data/chatbotData.json';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'bot',
            text: 'Hello 👋 Welcome to K Mondal Store. How can I help you today?',
            timestamp: new Date()
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [currentSuggestionSet, setCurrentSuggestionSet] = useState(0);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Get random suggestion set on mount
    useEffect(() => {
        const randomSet = Math.floor(Math.random() * chatbotData.quickSuggestions.length);
        setCurrentSuggestionSet(randomSet);
    }, []);

    // Rotate to next suggestion set after each interaction
    const rotateSuggestions = () => {
        setCurrentSuggestionSet(prev => (prev + 1) % chatbotData.quickSuggestions.length);
    };

    // Auto-scroll to latest message
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Match user input with keywords from JSON
    const findBestMatch = (userInput) => {
        const lowerInput = userInput.toLowerCase().trim();

        // Check for greetings first
        if (chatbotData.greetings.some(greeting => lowerInput.includes(greeting))) {
            return chatbotData.responses.hello;
        }

        // Check keywords
        for (const [pattern, responseKey] of Object.entries(chatbotData.keywords)) {
            const keywords = pattern.split('|');
            if (keywords.some(keyword => lowerInput.includes(keyword))) {
                return chatbotData.responses[responseKey];
            }
        }

        // No match found
        return chatbotData.responses.fallback;
    };

    const handleSendMessage = () => {
        if (!inputText.trim()) return;

        // Add user message
        const userMessage = {
            id: messages.length + 1,
            sender: 'user',
            text: inputText,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);

        // Get bot response
        const botResponse = findBestMatch(inputText);

        // Add bot message with slight delay for natural feel
        setTimeout(() => {
            const botMessage = {
                id: messages.length + 2,
                sender: 'bot',
                text: botResponse,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMessage]);
        }, 300);

        // Clear input
        setInputText('');

        // Rotate to next suggestion set
        rotateSuggestions();
    };

    const handleQuickSuggestion = (suggestion) => {
        setInputText(suggestion);
        // Auto-send after selecting suggestion
        setTimeout(() => {
            const userMessage = {
                id: messages.length + 1,
                sender: 'user',
                text: suggestion,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, userMessage]);

            const botResponse = findBestMatch(suggestion);
            setTimeout(() => {
                const botMessage = {
                    id: messages.length + 2,
                    sender: 'bot',
                    text: botResponse,
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, botMessage]);

                // Rotate suggestions after bot responds
                rotateSuggestions();
            }, 300);
            setInputText('');
        }, 100);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <>
            {/* Floating Chat Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 bg-primary hover:bg-primary-light text-white rounded-full w-14 h-14 sm:w-16 sm:h-16 shadow-premium-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center z-40 group"
                    aria-label="Open chat"
                >
                    <span className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform">💬</span>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-[90vw] sm:w-96 h-[70vh] sm:h-[500px] bg-white rounded-2xl shadow-premium-lg border-2 border-cream-dark flex flex-col z-50 animate-slideUp">
                    {/* Header */}
                    <div className="bg-primary text-cream px-4 py-4 rounded-t-2xl flex justify-between items-center border-b-2 border-secondary">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">🤖</span>
                            <div>
                                <h3 className="font-bold text-lg">K Mondal Store</h3>
                                <p className="text-xs text-cream/80">Assistant</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="hover:bg-primary-light rounded-lg p-2 transition-colors"
                            aria-label="Close chat"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-cream/20">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${message.sender === 'user'
                                        ? 'bg-primary text-cream rounded-br-sm'
                                        : 'bg-white text-charcoal border border-cream-dark rounded-bl-sm shadow-sm'
                                        }`}
                                >
                                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Suggestions */}
                    <div className="px-4 py-2 border-t border-cream-dark bg-white">
                        <p className="text-xs text-gray-600 mb-2">Quick questions:</p>
                        <div className="flex flex-wrap gap-2">
                            {chatbotData.quickSuggestions[currentSuggestionSet]?.map((suggestion, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleQuickSuggestion(suggestion)}
                                    className="text-xs bg-cream hover:bg-primary hover:text-white text-charcoal px-3 py-1.5 rounded-full border border-cream-dark transition-colors"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="border-t-2 border-cream-dark p-4 bg-white rounded-b-2xl">
                        <div className="flex gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your question..."
                                className="flex-1 border border-cream-dark rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!inputText.trim()}
                                className="bg-primary hover:bg-primary-light text-white px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Send message"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom animation styles */}
            <style jsx>{`
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-slideUp {
                    animation: slideUp 0.3s ease-out;
                }
            `}</style>
        </>
    );
};

export default Chatbot;
