import { GoogleGenAI, Chat, GenerateContentStreamResult } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { LocationData } from "../types";

const apiKey = process.env.API_KEY || "";

// Initialize the client
const ai = new GoogleGenAI({ apiKey });

export class GeminiService {
  private chatSession: Chat | null = null;

  /**
   * Starts or retrieves the current chat session.
   */
  private getChatSession(location?: LocationData): Chat {
    if (!this.chatSession) {
      // Define tools - allowing both Search and Maps for a comprehensive health assistant
      const tools = [
        { googleSearch: {} },
        { googleMaps: {} }
      ];

      const config: any = {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: tools,
      };

      // If location is provided, add it to the retrieval config for Maps grounding
      if (location) {
        config.toolConfig = {
          retrievalConfig: {
            latLng: {
              latitude: location.latitude,
              longitude: location.longitude
            }
          }
        };
      }

      this.chatSession = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: config
      });
    }
    return this.chatSession;
  }

  /**
   * Resets the session (e.g. to update location config or clear history)
   */
  public resetSession() {
    this.chatSession = null;
  }

  /**
   * Sends a message to the model and returns a stream.
   */
  public async sendMessageStream(message: string, location?: LocationData): Promise<GenerateContentStreamResult> {
    // If we have a new location and an existing session, we might want to recreate the session
    // to inject the new location into the toolConfig. For simplicity in this demo,
    // we'll assume location is gathered at mount or we recreate if needed.
    // Here we just ensure a session exists.
    
    // Note: The Google GenAI SDK doesn't easily support updating toolConfig on an existing chat object
    // dynamically for every message without recreating. 
    // However, we can pass the location context in the prompt if the toolConfig is static, 
    // OR we can recreate the chat if location changes significantly.
    // For this implementation, we will lazily create the session with the location provided at first call.
    
    const chat = this.getChatSession(location);
    
    return chat.sendMessageStream({
      message: message
    });
  }
}

export const geminiService = new GeminiService();
