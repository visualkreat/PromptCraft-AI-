import React from 'react';
import { DesignType, PromptStyle } from '../types';
import { cn } from '../lib/utils';
import { Layout, Palette } from 'lucide-react';

interface DesignSettingsProps {
  designType: DesignType;
  promptStyle: PromptStyle;
  onDesignTypeChange: (type: DesignType) => void;
  onPromptStyleChange: (style: PromptStyle) => void;
}

const designTypes: DesignType[] = ['Flyer', 'Social Media Ad', 'Badge Design', 'Fintech Style', 'Event Poster'];
const promptStyles: PromptStyle[] = ['Luxury', 'Minimal', 'Bold/Marketing', 'Tech/Futuristic'];

export const DesignSettings: React.FC<DesignSettingsProps> = ({
  designType,
  promptStyle,
  onDesignTypeChange,
  onPromptStyleChange
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-zinc-900">
          <Layout className="w-4 h-4" />
          <span>Design Type</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {designTypes.map((type) => (
            <button
              key={type}
              onClick={() => onDesignTypeChange(type)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
                designType === type
                  ? "bg-zinc-900 text-white border-zinc-900 shadow-sm"
                  : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400"
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-zinc-900">
          <Palette className="w-4 h-4" />
          <span>Prompt Style</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {promptStyles.map((style) => (
            <button
              key={style}
              onClick={() => onPromptStyleChange(style)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
                promptStyle === style
                  ? "bg-zinc-900 text-white border-zinc-900 shadow-sm"
                  : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400"
              )}
            >
              {style}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
