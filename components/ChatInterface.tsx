import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus, Loader2, AlertTriangle } from 'lucide-react';
import { Message, LocationData, QuickPrompt, GroundingMetadata } from '../types';
import { geminiService } from '../services/geminiService';
import MarkdownRenderer from './MarkdownRenderer';
import GroundingSources from './GroundingSources';
import { QUICK_PROMPTS } from '../constants';
import { GenerateContentResponse } from '@google/genai';

interface ChatInterfaceProps {
  location: LocationData | null;
  locationError: string | null;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ location, locationError }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hello! I'm HealthGuard AI. I can help you understand symptoms, find nearby clinics, or get the latest public health updates. How can I assist you today?",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (textOverride?: string) => {
    const text = textOverride || input;
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Create a placeholder for the AI response
    const aiMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: aiMsgId,
      role: 'model',
      text: '',
      timestamp: Date.now(),
      isStreaming: true
    }]);

    try {
      // Use the location if available
      const locData = location ? location : undefined;
      const streamResult = await geminiService.sendMessageStream(text, locData);
      
      let fullText = '';
      let finalMetadata: GroundingMetadata | undefined = undefined;

      for await (const chunk of streamResult) {
        const c = chunk as GenerateContentResponse;
        const chunkText = c.text || '';
        fullText += chunkText;
        
        // Capture grounding metadata if present in this chunk
        if (c.candidates?.[0]?.groundingMetadata) {
           // Merge logic is complex, usually it comes in one chunk or at the end. 
           // For simplicity, we overwrite with the latest non-empty metadata found.
           finalMetadata = c.candidates[0].groundingMetadata as unknown as GroundingMetadata;
        }

        setMessages(prev => prev.map(msg => 
          msg.id === aiMsgId 
            ? { ...msg, text: fullText, groundingMetadata: finalMetadata } 
            : msg
        ));
      }

      setMessages(prev => prev.map(msg => 
        msg.id === aiMsgId ? { ...msg, isStreaming: false } : msg
      ));

    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => prev.map(msg => 
        msg.id === aiMsgId 
          ? { ...msg, text: "I apologize, but I encountered an error connecting to the service. Please try again.", isStreaming: false } 
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden border border-slate-200">
      {/* Header */}
      <div className="bg-teal-600 p-4 text-white flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-xl font-bold font-serif tracking-wide">HealthGuard AI</h1>
          <p className="text-teal-100 text-xs">Public Health & Disease Awareness</p>
        </div>
        <div className="flex items-center space-x-2 text-xs bg-teal-700/50 px-3 py-1 rounded-full">
            {location ? (
              <>
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span>Location Active</span>
              </>
            ) : (
              <>
                 <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                 <span>{locationError ? "Location Denied" : "Locating..."}</span>
              </>
            )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50 scroll-smooth">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[90%] sm:max-w-[80%] rounded-2xl p-4 sm:p-5 shadow-sm ${
                msg.role === 'user'
                  ? 'bg-teal-600 text-white rounded-br-none'
                  : 'bg-white border border-slate-100 text-slate-800 rounded-bl-none'
              }`}
            >
              {msg.role === 'model' ? (
                <>
                  <MarkdownRenderer content={msg.text} />
                  {msg.groundingMetadata && (
                    <GroundingSources metadata={msg.groundingMetadata} />
                  )}
                  {msg.isStreaming && (
                    <span className="inline-block w-2 h-4 ml-1 bg-teal-400 animate-pulse align-middle"></span>
                  )}
                </>
              ) : (
                <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts (Visible only when chat is empty-ish or idle) */}
      {messages.length < 3 && !isLoading && (
        <div className="px-4 pb-2 bg-slate-50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt.text)}
                className="text-left p-3 bg-white border border-slate-200 hover:border-teal-400 hover:bg-teal-50 rounded-lg transition-colors group flex items-start gap-3"
              >
                <div className="mt-1 p-1.5 bg-slate-100 rounded-md text-slate-500 group-hover:text-teal-600 group-hover:bg-white transition-colors">
                  {prompt.icon}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-0.5 group-hover:text-teal-600">
                    {prompt.label}
                  </div>
                  <div className="text-sm text-slate-800">{prompt.text}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100 shrink-0">
        <div className="relative flex items-end gap-2">
          <button className="p-3 text-slate-400 hover:text-teal-600 hover:bg-slate-100 rounded-full transition-colors hidden sm:block" title="New Chat" onClick={() => window.location.reload()}>
            <Plus className="w-5 h-5" />
          </button>
          <div className="relative flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about symptoms, diseases, or nearby clinics..."
              className="w-full p-3 pr-12 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none max-h-32 min-h-[52px] text-slate-800 placeholder:text-slate-400"
              rows={1}
              style={{ height: 'auto', minHeight: '52px' }}
            />
            <div className="absolute right-2 bottom-2">
              <button
                onClick={() => handleSendMessage()}
                disabled={!input.trim() || isLoading}
                className={`p-2 rounded-lg transition-all ${
                  input.trim() && !isLoading
                    ? 'bg-teal-600 text-white shadow-md hover:bg-teal-700'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
        <div className="text-center mt-2">
            <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                
            </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
