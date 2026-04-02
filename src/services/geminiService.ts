import { GoogleGenAI } from "@google/genai";
import { DesignType, PromptStyle } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

async function fileToGenerativePart(file: File) {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(",")[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
}

export async function generateDesignPrompt(
  instructions: string,
  designType: DesignType,
  promptStyle: PromptStyle,
  referenceImage: File | null,
  logo: File | null,
  additionalImages: File[]
): Promise<string> {
  const model = "gemini-3.1-pro-preview";
  
  const parts: any[] = [
    {
      text: `You are a professional design prompt engineer for AI image generators like Nano Banana.
      Your job is to generate a prompt that clearly instructs the image generator to USE the uploaded assets.
      
      ⚠️ STRICT RULES (DO NOT BREAK):
      1. ALWAYS start the prompt with: "Use the uploaded reference design as a guide to recreate a similar layout and style."
      2. ALWAYS include: "Use the uploaded logo as the main brand logo and place it appropriately in the design."
      3. ALWAYS include: "Use the uploaded image(s) and integrate them into the design based on the layout."
      4. If multiple images are provided, say: "Arrange the uploaded images properly (grid, circular frames, or layout based on reference design)."
      5. If only one image is provided, say: "Use the uploaded image as the main subject of the design."
      
      🧠 AI BEHAVIOR:
      - Carefully combine user instructions, reference design structure, and uploaded assets.
      - The generated prompt MUST follow the structure of the reference design.
      - Replace elements with uploaded assets.
      - Keep layout consistency but allow visual improvements.
      
      ✍️ PROMPT STRUCTURE TO FOLLOW:
      - Reference instruction (Start with this)
      - Logo placement instruction
      - Image placement instruction
      - Text/content from user (Integrated naturally)
      - Layout explanation (Based on reference design)
      - Style & color direction (Based on ${promptStyle} and ${designType})
      - Final quality instruction (High-quality, professional, premium)
      
      🚫 DO NOT:
      - Do NOT ignore uploaded files.
      - Do NOT create generic prompts.
      - Do NOT skip mentioning images or logo.
      - Do NOT assume design without referencing uploads.
      
      CONTEXT:
      - Design Type: ${designType}
      - Style: ${promptStyle}
      - User Instructions: ${instructions}
      - Number of additional images: ${additionalImages.length}
      
      Return ONLY the final generated prompt. Do not include any preamble or explanation.`
    }
  ];

  if (referenceImage) {
    parts.push(await fileToGenerativePart(referenceImage));
    parts.push({ text: "Reference design image for layout and style guidance." });
  }

  if (logo) {
    parts.push(await fileToGenerativePart(logo));
    parts.push({ text: "Logo to be included in the design." });
  }

  for (const img of additionalImages) {
    parts.push(await fileToGenerativePart(img));
    parts.push({ text: "Additional image element to be used in the design." });
  }

  parts.push({ text: `Final Instructions: ${instructions}` });

  const response = await ai.models.generateContent({
    model,
    contents: [{ parts }],
    config: {
      temperature: 0.7,
      topP: 0.95,
      topK: 64,
    }
  });

  return response.text || "Failed to generate prompt. Please try again.";
}
