"use client"

import { useEffect, useRef, useState } from "react"

interface IMessages {
    role: "User" | "Bot";
    content: string
}

export default function Chat() {
    const [message, setMessage] = useState<string>("");
    const [messages, setMessages] = useState<IMessages[]>([]);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    async function handleChat() {
        const userText = message.trim();
        if (!userText) {
            return;
        }

        setMessages((prev) => [...prev, { role: "User", content: userText }]);
        setMessage("");

        const response = await fetch(`http://localhost:8000/chat?message=${encodeURIComponent(userText)}`);
        const data = await response.json();

        setMessages((prev) => [...prev, { role: "Bot", content: data?.message }])
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            handleChat();
        } else {
            return null;
        }
    }

    return (
        <div className="flex h-full w-full min-h-0 flex-col bg-slate-700/20 p-4">
            <div className="chat-scrollbar min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain rounded-md border border-slate-700/60 bg-slate-950/20 p-3">
                {messages.map((m, idx) => (
                    <div
                        key={idx}
                        className={`flex ${m.role === "User" ? "justify-end" : "justify-start"}`}
                    >
                        <div className={`max-w-[85%] border border-slate-300 px-4 py-3 ${m.role === "User" ? "bg-background" : "bg-slate-900/40"}`}>
                            <div className="mb-1 text-xs font-semibold text-slate-400">
                                {m.role}
                            </div>
                            <div className="whitespace-pre-wrap wrap-break-word">
                                {m.content}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="mt-auto grid grid-cols-[minmax(0,1fr)_auto] gap-2">
                <div className="min-w-0">
                    <input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        type="text"
                        placeholder="Enter your query here"
                        className="w-full border border-slate-300 bg-background px-4 py-3 outline-none"
                        onKeyDown={handleKeyDown}
                    />
                </div>
                <div>
                    <button
                        disabled={!message.trim()}
                        className="cursor-pointer border border-slate-300 px-4 py-3 disabled:text-slate-600 disabled:border-slate-600 disabled:cursor-not-allowed"
                        onClick={handleChat}
                    >
                        Send
                    </button>
                </div>
            </div>
            <div>
                <button
                    className="w-full mt-2 cursor-pointer border border-slate-300 px-4 py-3"
                    onClick={() => setMessages([])}
                >
                    Clear All Messages
                </button>
            </div>
        </div>
    )
}
