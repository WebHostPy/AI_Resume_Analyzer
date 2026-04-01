import React, { useState, useRef, useEffect, useCallback } from "react";
import { usePuterStore } from "~/lib/puter";
import confetti from "canvas-confetti";

// Define the global window type to access SpeechRecognition
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

const RobotIcon = () => (
    <div className="relative">
        <div className="absolute inset-0 bg-white/20 blur-sm rounded-full"></div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 relative z-10">
            <path d="M12 2C6.48 2 2 5.92 2 10.75c0 2.22 1.05 4.25 2.76 5.8 0 1.25-.56 2.87-1.38 4.08a.75.75 0 001.07.97c2.51-1.35 4.14-1.92 5.46-1.91C10.57 19.79 11.27 19.83 12 19.83c5.52 0 10-3.92 10-8.75S17.52 2 12 2zm-3.5 11c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm.5-4h-1v-2h1v2zm6 4c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm.5-4h-1v-2h1v2z" />
        </svg>
    </div>
);

const Soundwave = () => (
    <div className="flex items-end gap-[2px] h-4">
        <div className="w-1 bg-white rounded-full animate-bounce h-2" style={{ animationDuration: '0.6s' }}></div>
        <div className="w-1 bg-white rounded-full animate-bounce h-4" style={{ animationDuration: '0.8s' }}></div>
        <div className="w-1 bg-white rounded-full animate-bounce h-3" style={{ animationDuration: '0.5s' }}></div>
        <div className="w-1 bg-white rounded-full animate-bounce h-1" style={{ animationDuration: '0.7s' }}></div>
    </div>
);

export default function InterviewBot({ feedback }: { feedback: any }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [messages, setMessages] = useState<{ role: string; content: string; marks?: number }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [questionCount, setQuestionCount] = useState(0);
    const { ai } = usePuterStore();
    const scrollRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<any>(null);

    // Initialize speech recognition
    useEffect(() => {
        if (typeof window !== "undefined") {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = true;
                recognition.interimResults = true;
                recognition.lang = "en-US";

                recognition.onresult = (event: any) => {
                    let currentTranscript = "";
                    for (let i = event.resultIndex; i < event.results.length; ++i) {
                        currentTranscript += event.results[i][0].transcript;
                    }
                    setTranscript(currentTranscript);
                };

                recognition.onerror = (event: any) => {
                    console.error("Speech recognition error", event.error);
                    setIsListening(false);
                };

                recognitionRef.current = recognition;
            }
        }
    }, []);

    // Text to Speech
    const speakText = useCallback((text: string) => {
        if (typeof window === "undefined" || !window.speechSynthesis) return;

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        setIsSpeaking(true);
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
    }, []);

    const stopSpeaking = () => {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    };

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, transcript, isOpen]);

    // Initial greeting and first question
    useEffect(() => {
        if (isOpen && messages.length === 0 && feedback) {
            startInterview();
        }
    }, [isOpen, feedback]);

    const startInterview = async () => {
        setIsLoading(true);
        setQuestionCount(1);
        try {
            const prompt = [
                {
                    role: "system" as const,
                    content: `You are an expert technical and HR interviewer. Review the user's resume feedback: ${JSON.stringify(feedback)}. Generate the FIRST interview question of a rigorous 10-question sequence based on their resume experience, skills, or job profile. Do not greet with a long introduction, simply state that you are starting a 10-question interview and ask Question 1.`
                }
            ];

            const response = await ai.chat(prompt, undefined, false, { model: "openai/gpt-4o" });
            const aiMessage = typeof response?.message?.content === 'string'
                ? response.message.content
                : response?.message?.content[0]?.text || "Let's begin. Tell me about your experience on this resume.";

            setMessages([{ role: "assistant", content: aiMessage }]);
            speakText(aiMessage);
        } catch (error) {
            console.error(error);
            setMessages([{ role: "assistant", content: "Could not generate a question. Let's start with: Tell me about yourself based on your resume." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
            if (transcript.trim()) {
                submitAnswer(transcript.trim());
            }
        } else {
            // Stop TTS if it's talking
            stopSpeaking();
            setTranscript("");
            try {
                recognitionRef.current?.start();
                setIsListening(true);
            } catch (e) {
                console.error("Microphone already started or error", e);
            }
        }
    };

    const submitAnswer = async (answer: string) => {
        setTranscript("");
        const currentMessages = [...messages, { role: "user", content: answer }];
        setMessages(currentMessages);
        setIsLoading(true);
        const newCount = questionCount + 1;
        setQuestionCount(newCount);

        try {
            const systemPrompt = newCount <= 10
                ? `You are an expert interviewer. The user just answered question ${newCount - 1} of 10. 
Context (their resume): ${JSON.stringify(feedback)}.
1. Evaluate their answer out of 10 marks. 
2. Provide a short feedback.
3. Then definitively ask Question ${newCount} of 10 based on their resume.
Format exactly like this:
Marks: [X]/10
Feedback: [Your feedback]
Question ${newCount}: [The next question]`
                : `You are an expert interviewer. The user just answered their final question (10 of 10).
Context (their resume): ${JSON.stringify(feedback)}.
1. Evaluate their final answer out of 10 marks.
2. Provide a short feedback on this final answer.
3. Give them an overall summary of how they performed across the 10-question interview and wish them the best.
Format exactly like this:
Marks: [X]/10
Feedback: [Your feedback]
Overall Assessment: [Holistic summary]`;

            const prompt = [
                { role: "system" as const, content: systemPrompt },
                ...currentMessages.map(m => ({ role: m.role as "user" | "assistant", content: m.content }))
            ];

            const response = await ai.chat(prompt, undefined, false, { model: "openai/gpt-4o" });
            const aiMessage = typeof response?.message?.content === 'string'
                ? response.message.content
                : response?.message?.content[0]?.text || (newCount <= 10 ? `Question ${newCount}: Let's move on.` : "We are finished. Thank you.");

            // Try to extract marks if formatted
            let marks;
            const marksMatch = aiMessage.match(/Marks:\s*(\d+)/i);
            if (marksMatch && marksMatch[1]) {
                marks = parseInt(marksMatch[1], 10);
            }

            setMessages([...currentMessages, { role: "assistant", content: aiMessage, marks }]);
            speakText(aiMessage);

            if (newCount > 10) {
                confetti({
                    particleCount: 150,
                    spread: 80,
                    origin: { y: 0.6 },
                    zIndex: 9999
                });
            }

        } catch (error) {
            console.error(error);
            setMessages([...currentMessages, { role: "assistant", content: "I encountered an error evaluating that." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const downloadTranscript = () => {
        const text = messages.map(m => {
            const role = m.role === 'assistant' ? 'Interviewer' : 'You';
            const extra = m.marks !== undefined ? `\n[Score Given: ${m.marks}/10]` : '';
            return `${role}:\n${m.content}${extra}\n\n`;
        }).join('---\n');

        const blob = new Blob([`Mock Interview Transcript\n\n${text}`], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Interview_Transcript.txt';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start">
            {isOpen && (
                <div className="w-[360px] h-[580px] glassmorphism rounded-[2.5rem] flex flex-col mb-4 overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-500 premium-shadow">
                    <div className="bg-gradient-to-r from-blue-700 to-indigo-600 text-white p-6 flex justify-between items-center z-10">
                        <div className="flex items-center gap-3">
                            <RobotIcon />
                            <div className="flex flex-col">
                                <span className="font-bold text-sm tracking-tight">AI Strategic Interviewer</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                                    <span className="text-[10px] font-bold uppercase opacity-80 tracking-widest">Question {Math.min(questionCount, 10)}/10</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => { setIsOpen(false); stopSpeaking(); setIsListening(false); recognitionRef.current?.stop(); }} className="text-white/50 hover:text-white transition-colors duration-200">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-5 bg-gray-50/30 scroll-smooth" ref={scrollRef}>
                        {messages.length === 0 && isLoading && (
                            <div className="flex flex-col justify-center items-center h-full opacity-40">
                                <div className="animate-spin mb-4">
                                    <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                </div>
                                <span className="text-xs font-bold uppercase tracking-tighter">Initializing Interview Core...</span>
                            </div>
                        )}
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'self-end' : 'self-start'}`}>
                                <div className={`p-4 rounded-2xl text-[14px] leading-relaxed shadow-sm relative group ${msg.role === 'user' ? 'primary-gradient text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'}`}>
                                    {msg.content}
                                    {msg.role === 'assistant' && <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white border-l border-b border-gray-100 rotate-45"></div>}
                                </div>
                                {msg.marks !== undefined && (
                                    <div className="flex items-center gap-2 mt-2 self-start animate-in fade-in slide-in-from-left-2">
                                        <div className={`h-1.5 w-1.5 rounded-full ${msg.marks >= 7 ? 'bg-green-500' : msg.marks >= 4 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${msg.marks >= 7 ? 'text-green-600' : msg.marks >= 4 ? 'text-yellow-600' : 'text-red-500'}`}>
                                            Performance: {msg.marks}/10
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                        {transcript && (
                            <div className="max-w-[85%] p-4 rounded-2xl text-[14px] bg-blue-50 text-blue-700 self-end rounded-br-none italic opacity-60 border border-blue-100">
                                {transcript}
                            </div>
                        )}
                        {isLoading && messages.length > 0 && (
                            <div className="flex gap-1.5 p-3 self-start">
                                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100"></div>
                                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200"></div>
                            </div>
                        )}
                    </div>

                    <div className="p-6 bg-white/80 backdrop-blur-md border-t border-gray-100 flex flex-col items-center gap-4">
                        {(isSpeaking || isListening) && (
                            <div className="flex items-center gap-4 bg-blue-600 px-4 py-2 rounded-full animate-in fade-in zoom-in duration-300">
                                <Soundwave />
                                <span className="text-[11px] font-bold text-white uppercase tracking-widest">
                                    {isListening ? "Listening..." : "Bot Speaking"}
                                </span>
                                <Soundwave />
                            </div>
                        )}

                        {questionCount > 10 ? (
                            <div className="w-full space-y-4">
                                <button
                                    onClick={downloadTranscript}
                                    className="w-full py-4 primary-gradient text-white rounded-2xl font-bold flex justify-center items-center gap-3 hover-scale shadow-lg"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                    Save Audit Transcript
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-6">
                                <button
                                    onClick={toggleListening}
                                    disabled={isLoading}
                                    className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-90 ${isListening
                                        ? "bg-red-500 shadow-2xl shadow-red-500/40"
                                        : "primary-gradient shadow-2xl shadow-blue-500/40"
                                        } disabled:grayscale disabled:opacity-50`}
                                >
                                    {isListening ? (
                                        <div className="w-6 h-6 bg-white rounded-md animate-pulse"></div>
                                    ) : (
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        )}
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest text-center">
                            {questionCount > 10 ? "Strategic Interview Complete" : isListening ? "Stop to submit your response" : "Experience Voice-First AI Interview"}
                        </p>
                    </div>
                </div>
            )}

            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center premium-shadow hover-scale group relative"
                >
                    <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20 group-hover:opacity-40"></div>
                    <RobotIcon />
                </button>
            )}
        </div>
    );
}

