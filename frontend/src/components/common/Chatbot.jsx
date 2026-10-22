import React, { useState, useEffect, useRef } from 'react';
import chatbotData from '../../data/chatbotData.json';
import { MessageSquare, X, Send, Bot } from 'lucide-react';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'bot',
            text: 'Hello, welcome to K Mondal Store. How can I help you today?',
            timestamp: new Date()
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [currentSuggestionSet, setCurrentSuggestionSet] = useState(0);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        const randomSet = Math.floor(Math.random() * chatbotData.quickSuggestions.length);
        setCurrentSuggestionSet(randomSet);
    }, []);

    const rotateSuggestions = () => {
        setCurrentSuggestionSet(prev => (prev + 1) % chatbotData.quickSuggestions.length);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const findBestMatch = (userInput) => {
        const lowerInput = userInput.toLowerCase().trim();

        if (chatbotData.greetings.some(greeting => lowerInput.includes(greeting))) {
            return chatbotData.responses.hello;
        }

        for (const [pattern, responseKey] of Object.entries(chatbotData.keywords)) {
            const keywords = pattern.split('|');
            if (keywords.some(keyword => lowerInput.includes(keyword))) {
                return chatbotData.responses[responseKey];
            }
        }

        return chatbotData.responses.fallback;
    };

    const handleSendMessage = () => {
        if (!inputText.trim()) return;

        const userMessage = {
            id: messages.length + 1,
            sender: 'user',
            text: inputText,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);

        const botReply = findBestMatch(inputText);

        setTimeout(() => {
            const botMessage = {
                id: messages.length + 2,
                sender: 'bot',
                text: botReply,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMessage]);
            rotateSuggestions();
        }, 400);

        setInputText('');
    };

    const handleQuickSuggestion = (suggestion) => {
        const userMessage = {
            id: messages.length + 1,
            sender: 'user',
            text: suggestion,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);

        const botReply = findBestMatch(suggestion);

        setTimeout(() => {
            const botMessage = {
                id: messages.length + 2,
                sender: 'bot',
                text: botReply,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMessage]);
            rotateSuggestions();
        }, 400);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <>
            {/* Floating Chat Trigger Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="card-chai fixed bottom-6 right-6 w-12 h-12 rounded-full flex items-center justify-center text-foreground hover:text-brand z-40 transition-transform active:scale-95 cursor-pointer"
                    aria-label="Open chat assistant"
                >
                    <MessageSquare className="w-5 h-5" />
                </button>
            )}

            {/* Chatbot Window */}
            {isOpen && (
                <div className="card-chai fixed bottom-6 right-6 w-[90vw] sm:w-96 h-[70vh] sm:h-[480px] flex flex-col z-50 overflow-hidden animate-slideUp">
                    {/* Header */}
                    <div className="p-3.5 border-b border-card-edge flex items-center justify-between bg-card-fill">
                        <div className="flex items-center gap-2">
                            <Bot className="w-5 h-5 text-brand" />
                            <div>
                                <h3 className="font-montserrat text-xs sm:text-sm font-semibold text-foreground">
                                    Store assistant
                                </h3>
                                <p className="text-[10px] text-muted-foreground">K Mondal Store</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="Close chat"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Messages Scroll Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-transparent">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[82%] text-xs sm:text-sm px-3.5 py-2.5 rounded-lg leading-relaxed ${
                                        message.sender === 'user'
                                            ? 'bg-primary text-primary-foreground rounded-tr-none'
                                            : 'border border-card-edge bg-card-fill text-foreground rounded-tl-none'
                                    }`}
                                >
                                    <p className="whitespace-pre-line">{message.text}</p>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Suggestions */}
                    <div className="p-2.5 border-t border-card-edge bg-card-fill/50">
                        <p className="text-[11px] text-muted-foreground mb-1.5">Suggested questions:</p>
                        <div className="flex flex-wrap gap-1.5">
                            {chatbotData.quickSuggestions[currentSuggestionSet]?.map((suggestion, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleQuickSuggestion(suggestion)}
                                    className="text-[11px] px-2.5 py-1 rounded-md border border-card-edge bg-muted/40 text-muted-foreground hover:text-foreground hover:border-card-edge-hover transition-colors"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Input Controls */}
                    <div className="p-3 border-t border-card-edge bg-card-fill">
                        <div className="flex gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask about timings, delivery..."
                                className="flex-1 border border-card-edge rounded-lg px-3 py-1.5 text-xs sm:text-sm text-foreground bg-transparent placeholder:text-muted-foreground focus:outline-none focus:border-brand/70"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!inputText.trim()}
                                className="btn-asym inline-flex items-center justify-center px-3 py-1.5 bg-neutral-900 text-white dark:bg-white dark:text-black disabled:opacity-40 transition-colors"
                                aria-label="Send message"
                            >
                                <Send className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbot;
