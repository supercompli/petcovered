import { GoogleGenAI } from '@google/genai';
import { SYSTEM_INSTRUCTION } from '../../../services/geminiService';

export async function POST(request: Request) {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    return Response.json({ error: 'Missing API_KEY environment variable.' }, { status: 500 });
  }

  const { message } = await request.json();

  if (!message || typeof message !== 'string') {
    return Response.json({ error: 'A message string is required.' }, { status: 400 });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: message,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    return Response.json({
      text: response.text || 'I am having trouble answering right now.',
    });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return Response.json(
      { text: 'I apologize, but I am having trouble connecting to the AI service right now.' },
      { status: 500 },
    );
  }
}
