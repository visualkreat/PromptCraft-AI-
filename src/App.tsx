import React, { useState } from 'react';
import { Sparkles, Layout, Image as ImageIcon, Upload, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { FileUpload } from './components/FileUpload';
import { DesignSettings } from './components/DesignSettings';
import { ChatInput } from './components/ChatInput';
import { PromptOutput } from './components/PromptOutput';
import { generateDesignPrompt } from './services/geminiService';
import { DesignType, PromptStyle, AppState } from './types';
import { cn } from './lib/utils';

export default function App() {
  const [state, setState] = useState<AppState>({
    referenceImage: null,
    logo: null,
    additionalImages: [],
    instructions: '',
    designType: 'Flyer',
    promptStyle: 'Luxury',
    isGenerating: false,
    generatedPrompt: null,
  });

  const handleGenerate = async (instructions: string) => {
    setState(prev => ({ ...prev, isGenerating: true, instructions }));
    
    try {
      const prompt = await generateDesignPrompt(
        instructions,
        state.designType,
        state.promptStyle,
        state.referenceImage,
        state.logo,
        state.additionalImages
      );
      setState(prev => ({ ...prev, generatedPrompt: prompt, isGenerating: false }));
    } catch (error) {
      console.error("Generation failed:", error);
      setState(prev => ({ ...prev, isGenerating: false }));
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 selection:bg-zinc-900 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center shadow-lg shadow-zinc-200">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-zinc-900">PromptCraft AI</h1>
              <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Design Prompt Generator</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-4">
              <a href="#" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">Templates</a>
              <a href="#" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">Showcase</a>
              <a href="#" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">Guide</a>
            </nav>
            <div className="h-4 w-[1px] bg-zinc-200" />
            <button className="text-sm font-semibold bg-zinc-900 text-white px-4 py-2 rounded-lg hover:bg-zinc-800 transition-all shadow-sm">
              Upgrade Pro
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar: Uploads & Settings */}
          <aside className="lg:col-span-4 space-y-8">
            <section className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Upload className="w-4 h-4 text-zinc-400" />
                <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Assets & Context</h2>
              </div>
              
              <FileUpload
                label="Reference Design"
                description="Guide layout, structure, and style"
                files={state.referenceImage ? [state.referenceImage] : []}
                onFileSelect={(files) => setState(prev => ({ ...prev, referenceImage: files[0] || null }))}
              />

              <FileUpload
                label="Brand Logo"
                description="To be integrated into the design"
                files={state.logo ? [state.logo] : []}
                onFileSelect={(files) => setState(prev => ({ ...prev, logo: files[0] || null }))}
              />

              <FileUpload
                label="Additional Elements"
                description="Upload 1-10 images to use as elements"
                maxFiles={10}
                files={state.additionalImages}
                onFileSelect={(files) => setState(prev => ({ ...prev, additionalImages: files }))}
              />

              <div className="h-[1px] bg-zinc-100" />

              <DesignSettings
                designType={state.designType}
                promptStyle={state.promptStyle}
                onDesignTypeChange={(type) => setState(prev => ({ ...prev, designType: type }))}
                onPromptStyleChange={(style) => setState(prev => ({ ...prev, promptStyle: style }))}
              />
            </section>

            <div className="bg-zinc-900 rounded-2xl p-6 text-white shadow-xl shadow-zinc-200 overflow-hidden relative group">
              <div className="relative z-10">
                <h3 className="font-bold text-lg mb-2">Pro Tip</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Upload a reference image with a layout you love. PromptCraft will analyze the spatial hierarchy and color theory to replicate the "vibe" in your generated prompt.
                </p>
              </div>
              <Sparkles className="absolute -bottom-4 -right-4 w-24 h-24 text-white/5 group-hover:text-white/10 transition-all duration-500" />
            </div>
          </aside>

          {/* Main Content: Chat & Output */}
          <div className="lg:col-span-8 space-y-8">
            <div className="flex flex-col gap-6">
              <div className="bg-white rounded-2xl p-8 border border-zinc-200 shadow-sm">
                <div className="max-w-2xl mx-auto text-center space-y-4 mb-10">
                  <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900">What are we designing today?</h2>
                  <p className="text-zinc-500 text-sm">
                    Describe your vision in detail. Mention specific colors, moods, or layout requirements.
                  </p>
                </div>
                
                <ChatInput 
                  onSend={handleGenerate} 
                  disabled={state.isGenerating} 
                />
              </div>

              <div className="flex-1">
                <PromptOutput 
                  prompt={state.generatedPrompt} 
                  isGenerating={state.isGenerating} 
                />
              </div>
            </div>

            {/* Features Footer */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: Layout, title: "Layout Analysis", desc: "AI extracts structure from reference images." },
                { icon: ImageIcon, title: "Multi-Asset", desc: "Seamlessly blend logos and custom elements." },
                { icon: Sparkles, title: "Optimized", desc: "Prompts tuned for Nano Banana & Gemini." },
              ].map((feature, i) => (
                <div key={i} className="bg-white p-4 rounded-xl border border-zinc-200 flex items-start gap-3">
                  <div className="p-2 bg-zinc-50 rounded-lg">
                    <feature.icon className="w-4 h-4 text-zinc-900" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900">{feature.title}</h4>
                    <p className="text-[10px] text-zinc-500 mt-1">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      <footer className="mt-12 py-12 border-t border-zinc-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">PromptCraft AI</span>
          </div>
          <p className="text-xs text-zinc-400">© 2026 PromptCraft AI. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-zinc-400 hover:text-zinc-900 transition-colors">Privacy</a>
            <a href="#" className="text-xs text-zinc-400 hover:text-zinc-900 transition-colors">Terms</a>
            <a href="#" className="text-xs text-zinc-400 hover:text-zinc-900 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
