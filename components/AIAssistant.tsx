import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, FunctionDeclaration, Type, Chat, Part } from '@google/genai';
import { Professional, BookedSlot, SessionType } from '../types';

interface Message {
    role: 'user' | 'model';
    text: string;
}

interface AIAssistantProps {
    isOpen: boolean;
    onClose: () => void;
    professionals: Professional[];
    bookedSlots: BookedSlot[];
    onProChange: (id: string) => void;
    onDateChange: (date: string) => void;
    onTimeChange: (time: string) => void;
    onSessionChange: (session: SessionType) => void;
}

const ErrorIcon: React.FC = () => (
    <svg className="h-6 w-6 text-red-400 mr-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
);

// Helper to format model's text response into HTML
const formatTextToHtml = (text: string): string => {
    if (!text) return '';
    const lines = text.split('\n');
    let html = '';
    let inList = false;

    lines.forEach((line) => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
            const content = trimmedLine.substring(2);
            if (!inList) {
                html += '<ul class="list-disc list-inside space-y-1 my-2">';
                inList = true;
            }
            html += `<li>${content}</li>`;
        } else {
            if (inList) {
                html += '</ul>';
                inList = false;
            }
            if (trimmedLine) {
                 html += `<p>${line}</p>`;
            } else {
                html += '<br/>'
            }
        }
    });

    if (inList) {
        html += '</ul>';
    }

    return html.replace(/<br\/><p>/g, '<p>').replace(/<\/ul><br\/>/g, '</ul>');
};


const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose, professionals, bookedSlots, onProChange, onDateChange, onTimeChange, onSessionChange }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chat, setChat] = useState<Chat | null>(null);
    const [initializationError, setInitializationError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        if (isOpen && !chat && !initializationError) {
            try {
                // In a build-less environment, the key must be injected into the window object.
                const apiKey = (window as any).GEMINI_API_KEY;

                if (!apiKey || apiKey === 'YOUR_API_KEY_HERE' || apiKey.startsWith("{{")) {
                    throw new Error("API Key not found. Please create config-env.js");
                }

                const ai = new GoogleGenAI({ apiKey });

                const getProfessionalInfo: FunctionDeclaration = {
                    name: 'getProfessionalInfo',
                    description: 'Get information about one or all available golf professionals.',
                    parameters: {
                        type: Type.OBJECT,
                        properties: {
                            proId: {
                                type: Type.STRING,
                                description: 'The ID of the professional (e.g., "ahmet-yilmaz"). If omitted, returns all professionals.',
                            },
                        },
                    },
                };
                const getAvailableSlots: FunctionDeclaration = {
                    name: 'getAvailableSlots',
                    description: 'Get available time slots for a specific professional on a given date.',
                    parameters: {
                        type: Type.OBJECT,
                        properties: {
                            proId: { type: Type.STRING, description: 'The ID of the professional.' },
                            date: { type: Type.STRING, description: 'The date in YYYY-MM-DD format.' },
                        },
                        required: ['proId', 'date'],
                    },
                };
                const updateBookingSelection: FunctionDeclaration = {
                    name: 'updateBookingSelection',
                    description: 'Update the main booking interface with the user\'s choices to help them book.',
                    parameters: {
                        type: Type.OBJECT,
                        properties: {
                            proId: { type: Type.STRING, description: 'The ID of the professional to select.' },
                            date: { type: Type.STRING, description: 'The date to select in YYYY-MM-DD format.' },
                            time: { type: Type.STRING, description: 'The time to select in HH:MM format.' },
                            sessionName: { type: Type.STRING, description: 'The name of the session to select (e.g., "60 Minute Lesson").' },
                        },
                    },
                };

                const newChat = ai.chats.create({
                    model: 'gemini-2.5-flash',
                    config: {
                        systemInstruction: `You are a helpful and friendly AI assistant for Matrix Golf Holidays, a golf lesson booking service in Belek, Antalya. Your goal is to help users find and book golf lessons with our Turkish PGA professionals.
- Today's date is ${new Date().toLocaleDateString()}.
- Use the available tools to answer questions about professionals, their schedules, and availability.
- When checking for availability, if a user's requested time is not available, you MUST inform them and suggest up to 3 nearby alternative time slots for the same day.
- When a user wants to book, use the updateBookingSelection tool to pre-fill the form for them and instruct them to review and confirm the booking themselves.
- When presenting lists, such as a list of professionals or available time slots, you MUST use Markdown bullet points (e.g., '* Item 1').
- Be concise and conversational.`,
                        tools: [{ functionDeclarations: [getProfessionalInfo, getAvailableSlots, updateBookingSelection] }],
                    }
                });
                setChat(newChat);
                setMessages([{ role: 'model', text: 'Hello! How can I help you plan your golf lesson today?' }]);
            
            } catch (error) {
                console.error("AI Assistant initialization failed:", error);
                 const errorMessage = `
                    <h3 class="font-bold text-red-800">AI Assistant Configuration Needed</h3>
                    <div class="mt-2 text-sm text-red-700">
                        <p>The assistant failed to start because the API key is not available. To fix this, you need to create a configuration file:</p>
                        <ol class="list-decimal list-inside mt-3 space-y-2">
                            <li>In the root directory of your project, create a new file named <strong>config-env.js</strong>.</li>
                            <li>Add the following line of code to this file, replacing <strong>'YOUR_API_KEY_HERE'</strong> with your actual Gemini API key:
                                <code class="text-xs bg-red-100 p-1 rounded-md block mt-1">window.GEMINI_API_KEY = 'YOUR_API_KEY_HERE';</code>
                            </li>
                            <li>Save the file and reload the application.</li>
                        </ol>
                        <p class="mt-3">This file will provide the necessary API key for the AI assistant to function.</p>
                    </div>`;
                setInitializationError(errorMessage);
                setMessages([]);
            }
        }
    }, [isOpen]);

    const handleSendMessage = async () => {
        if (!input.trim() || isLoading || !chat) return;

        const userMessage: Message = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            let response = await chat.sendMessage({ message: input });

            while(response.functionCalls && response.functionCalls.length > 0) {
                const functionCalls = response.functionCalls;
                const toolResults = [];

                for (const call of functionCalls) {
                    const { name, args } = call;
                    let result: any;
                    
                    if (name === 'getProfessionalInfo') {
                        const { proId } = args as { proId?: string };
                        if (proId) {
                            result = professionals.find(p => p.id === proId) || null;
                        } else {
                            result = professionals.map(p => ({ id: p.id, name: p.name, title: p.title }));
                        }
                    } else if (name === 'getAvailableSlots') {
                        const { proId, date } = args as { proId: string; date: string };
                        const pro = professionals.find(p => p.id === proId);
                        if (!pro) {
                            result = { error: 'Professional not found.' };
                        } else {
                            const dayOfWeek = new Date(date).getDay();
                            const daySchedule = pro.schedule[dayOfWeek];
                            if (!daySchedule) {
                                result = { availableSlots: [] };
                            } else {
                                const slots: string[] = [];
                                for (let hour = daySchedule.start; hour < daySchedule.end; hour++) {
                                    for (let minute = 0; minute < 60; minute += 30) {
                                        slots.push(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`);
                                    }
                                }
                                const proBookedSlots = bookedSlots.filter(s => s.proId === proId && s.date === date).map(s => s.time);
                                result = { availableSlots: slots.filter(s => !proBookedSlots.includes(s)) };
                            }
                        }
                    } else if (name === 'updateBookingSelection') {
                        const { proId, date, time, sessionName } = args as { proId?: string, date?: string, time?: string, sessionName?: string };
                        if (proId) onProChange(proId);
                        if (date) onDateChange(date);
                        if (time) onTimeChange(time);
                        if (sessionName) {
                            const proForSession = professionals.find(p => p.id === (proId || '')) || professionals[0];
                            const session = proForSession.sessionTypes.find(st => st.name.toLowerCase() === sessionName.toLowerCase());
                            if (session) onSessionChange(session);
                        }
                        result = { success: true, message: 'Selection updated on the main screen.' };
                    }
                    toolResults.push({ name, response: result });
                }
                 const functionResponseParts: Part[] = toolResults.map(toolResult => ({
                    functionResponse: {
                        name: toolResult.name,
                        response: { "result": toolResult.response },
                    },
                 }));
                 
                 response = await chat.sendMessage({ message: functionResponseParts });
            }

            setMessages(prev => [...prev, { role: 'model', text: response.text }]);

        } catch (error) {
            console.error('Error sending message to Gemini:', error);
            setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error. Please try again.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity duration-300" onClick={onClose}>
            <style>{`
                @keyframes fade-in-scale {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in-scale {
                    animation: fade-in-scale 0.2s ease-out forwards;
                }
            `}</style>
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg h-[80vh] max-h-[700px] flex flex-col transform opacity-0 scale-95 animate-fade-in-scale"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-4 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
                    <h2 className="text-lg font-bold text-[#0c4b83]">AI Golf Assistant</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800" aria-label="Close chat">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-4 flex-grow overflow-y-auto space-y-4">
                    {initializationError ? (
                        <div className="rounded-md bg-red-50 p-4">
                            <div className="flex">
                                <ErrorIcon />
                                <div className="ml-3" dangerouslySetInnerHTML={{ __html: initializationError }}></div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                                    {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 text-[#0c4b83]">AI</div>}
                                    <div className={`max-w-xs md:max-w-md p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-[#0c4b83] text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                                        {msg.role === 'user' ? (
                                             <p>{msg.text}</p>
                                        ) : (
                                            <div dangerouslySetInnerHTML={{ __html: formatTextToHtml(msg.text) }} />
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 text-[#0c4b83]">AI</div>
                                    <div className="max-w-xs md:max-w-md p-3 rounded-2xl bg-gray-100 text-gray-800 rounded-bl-none flex items-center gap-2">
                                        <span className="h-2 w-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="h-2 w-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="h-2 w-2 bg-blue-500 rounded-full animate-bounce"></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </>
                    )}
                </div>
                <div className="p-4 border-t border-gray-200 flex-shrink-0">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Ask about lessons or pros..."
                            className="w-full p-3 border-2 border-gray-200 rounded-lg text-sm transition focus:outline-none focus:border-[#0c4b83] disabled:bg-gray-100"
                            disabled={isLoading || !!initializationError}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={isLoading || !input.trim() || !!initializationError}
                            className="p-3 bg-[#0c4b83] text-white rounded-lg hover:bg-[#1a6aaf] transition disabled:bg-gray-300"
                            aria-label="Send message"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIAssistant;