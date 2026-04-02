import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <div className="relative group">
      <div className={cn(
        "flex items-end gap-2 p-3 bg-white border rounded-2xl transition-all shadow-sm",
        disabled ? "opacity-50 cursor-not-allowed" : "border-zinc-200 focus-within:border-zinc-900 focus-within:shadow-md"
      )}>
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe your design (e.g., 'A fintech flyer for a new crypto app with neon accents')..."
          className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-2 px-1 text-sm text-zinc-800 min-h-[44px] max-h-[200px]"
          disabled={disabled}
          rows={1}
        />
        <button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          className={cn(
            "p-2.5 rounded-xl transition-all flex items-center justify-center",
            message.trim() && !disabled
              ? "bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm"
              : "bg-zinc-100 text-zinc-400 cursor-not-allowed"
          )}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
      <div className="mt-2 flex items-center gap-1.5 px-1">
        <Sparkles className="w-3 h-3 text-zinc-400" />
        <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">AI Powered Prompt Engineering</span>
      </div>
    </div>
  );
};
