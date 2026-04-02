export type DesignType = 'Flyer' | 'Social Media Ad' | 'Badge Design' | 'Fintech Style' | 'Event Poster';
export type PromptStyle = 'Luxury' | 'Minimal' | 'Bold/Marketing' | 'Tech/Futuristic';

export interface AppState {
  referenceImage: File | null;
  logo: File | null;
  additionalImages: File[];
  instructions: string;
  designType: DesignType;
  promptStyle: PromptStyle;
  isGenerating: boolean;
  generatedPrompt: string | null;
}
