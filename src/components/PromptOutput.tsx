import React, { useState } from 'react';
import { Copy, Check, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface PromptOutputProps {
  prompt: string | null;
  isGenerating: boolean;
}

export const PromptOutput: React.FC<PromptOutputProps> = ({ prompt, isGenerating }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (!prompt) return;
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative flex flex-col h-full min-h-[300px] bg-zinc-50 rounded-2xl border border-zinc-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-bottom border-zinc-200 bg-white">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-zinc-900" />
          <span className="text-sm font-semibold text-zinc-900">Generated Prompt</span>
        </div>
        {prompt && (
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 text-white hover:bg-zinc-800 transition-colors shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy Prompt
              </>
            )}
          </button>
        )}
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <AnimatePresence mode="wait">
          {isGenerating ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full gap-4"
            >
              <div className="w-8 h-8 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-zinc-500 font-medium animate-pulse">Crafting your design prompt...</p>
            </motion.div>
          ) : prompt ? (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="prose prose-sm max-w-none"
            >
              <div className="text-zinc-800 leading-relaxed whitespace-pre-wrap font-mono text-sm bg-white p-4 rounded-xl border border-zinc-100 shadow-sm">
                {prompt}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full text-center gap-2"
            >
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-zinc-100 shadow-sm mb-2">
                <Sparkles className="w-6 h-6 text-zinc-300" />
              </div>
              <p className="text-sm font-medium text-zinc-400">Your prompt will appear here</p>
              <p className="text-xs text-zinc-300">Upload images and enter instructions to begin</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
