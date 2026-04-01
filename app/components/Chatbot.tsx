import React, { useState, useRef, useEffect } from "react";
import { usePuterStore } from "~/lib/puter";

export default function Chatbot({ feedback }: { feedback: Feedback | null }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: "user" | "assistant" | "system"; content: string }[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { ai } = usePuterStore();
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (feedback && messages.length === 0) {
            const scores = [
                { name: 'ATS', score: feedback.ATS?.score || 100 },
                { name: 'Tone and Style', score: feedback.toneAndStyle?.score || 100 },
                { name: 'Content', score: feedback.content?.score || 100 },
                { name: 'Structure', score: feedback.structure?.score || 100 },
                { name: 'Skills Format', score: feedback.skills?.score || 100 },
            ];

            const lowest = scores.reduce((prev, current) => (prev.score < current.score) ? prev : current);

            if (lowest.score < 100) {
                setMessages([
                    {
                        role: "assistant",
                        content: `Hi! I noticed your lowest score is in ${lowest.name} (${lowest.score}/100). Would you like some tailored advice on how to improve it?`
                    }
                ]);
            } else {
                setMessages([
                    {
                        role: "assistant",
                        content: `Hi! Your resume looks perfect across the board! Is there anything specific you would like to ask?`
                    }
                ]);
            }
        }
    }, [feedback]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setInput("");
        const newMessages = [...messages, { role: "user" as const, content: userMsg }];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            const systemContext = feedback
                ? `You are a helpful AI career coach. You are helping the user improve their resume based on this feedback report: ${JSON.stringify(feedback)}. Answer their questions clearly and concisely.`
                : "You are a helpful AI career coach. Answer the user's questions about their resume.";

            const prompt = [
                { role: "system" as const, content: systemContext },
                ...newMessages
            ];

            const response = await ai.chat(prompt, undefined, false, { model: "openai/gpt-4o" });

            if (response && response.message && response.message.content) {
                const textReply = typeof response.message.content === 'string'
                    ? response.message.content
                    : response.message.content[0]?.text || "No text available.";
                setMessages([...newMessages, { role: "assistant" as const, content: textReply }]);
            } else {
                setMessages([...newMessages, { role: "assistant" as const, content: "I encountered an error getting a response." }]);
            }
        } catch (err) {
            console.error(err);
            setMessages([...newMessages, { role: "assistant" as const, content: "Sorry, I am unable to reply at the moment." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {isOpen && (
                <div className="w-80 h-96 bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col mb-4 overflow-hidden">
                    <div className="bg-blue-600 text-white font-bold p-4 flex justify-between items-center rounded-t-2xl">
                        <span>AI Assistant</span>
                        <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200 font-bold">✕</button>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-gray-50" ref={scrollRef}>
                        {messages.length === 0 && (
                            <p className="text-sm text-gray-500 text-center mt-4">Ask me anything about your resume or feedback!</p>
                        )}
                        {messages.map((msg, i) => (
                            <div key={i} className={`max-w-[85%] p-3 rounded-lg text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white self-end rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 self-start rounded-bl-none'}`}>
                                {msg.content}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="bg-gray-100 border border-gray-200 text-gray-500 self-start p-3 rounded-lg text-sm italic rounded-bl-none">
                                Thinking...
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-gray-200 flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600"
                            placeholder="Type a message..."
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:bg-gray-400"
                        >
                            Send
                        </button>
                    </form>
                </div>
            )}

            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center premium-shadow hover-scale group relative"
                >
                    <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20 group-hover:opacity-40"></div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
                    </svg>
                </button>
            )}
        </div>
    );
}
