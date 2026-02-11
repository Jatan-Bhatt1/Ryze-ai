import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

let openai = null;
let gemini = null;
let activeProvider = null; // 'openai' | 'gemini' | 'mock'

export function initLLM() {
  if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    activeProvider = 'openai';
    console.log('✅ LLM Provider: OpenAI');
  } else if (process.env.GEMINI_API_KEY) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    gemini = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    activeProvider = 'gemini';
    console.log('✅ LLM Provider: Google Gemini (Free Tier)');
  } else {
    activeProvider = 'mock';
    console.warn('⚠️ No API Key found. Using MOCK MODE.');
  }
  return activeProvider;
}

export async function complete({ system, user, jsonMode = false }) {
  if (activeProvider === 'openai') {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user }
      ],
      model: 'gpt-4o',
      response_format: jsonMode ? { type: 'json_object' } : undefined,
    });
    return completion.choices[0].message.content;
  }

  if (activeProvider === 'gemini') {
    // Gemini doesn't support system messages in the same way for Flash 1.5 via simple API,
    // but we can prepend it to the user message or use systemInstruction if supported.
    // Flash 1.5 supports systemInstruction.

    // Create a new model instance for each request to support system instruction and generation config
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: system,
      generationConfig: {
        responseMimeType: jsonMode ? "application/json" : "text/plain"
      }
    });

    const result = await model.generateContent(user);
    const response = await result.response;
    return response.text();
  }

  throw new Error('LLM not initialized or in Mock Mode');
}

export function getProvider() {
  return activeProvider;
}
