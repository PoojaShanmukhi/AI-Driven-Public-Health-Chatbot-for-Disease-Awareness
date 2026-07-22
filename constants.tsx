import React from 'react';
import { ShieldAlert, MapPin, Stethoscope, Activity } from 'lucide-react';
import { QuickPrompt } from './types';

export const APP_NAME = "HealthGuard AI";
export const DISCLAIMER_TEXT = `
  HealthGuard AI provides general public health information and awareness. 
  It is NOT a substitute for professional medical advice, diagnosis, or treatment. 
  Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. 
  If you think you may have a medical emergency, call your doctor or emergency services immediately.
`;

export const SYSTEM_INSTRUCTION = `
  You are HealthGuard AI, a public health assistant. 
  Your goal is to provide accurate, empathetic, and grounded information about diseases, public health guidelines (CDC/WHO), and nearby medical facilities.
  
  Guidelines:
  1. ALWAYS clarify you are an AI, not a doctor.
  2. Use the Google Search tool to find the latest outbreak news, vaccination guidelines, or symptom descriptions.
  3. Use the Google Maps tool when the user asks for locations (clinics, hospitals, pharmacies).
  4. Be concise but thorough. Use bullet points for symptoms or steps.
  5. If asked about a medical emergency, direct the user to call emergency services immediately.
  6. Tone: Professional, calm, reassuring, and informative.
`;

export const QUICK_PROMPTS: QuickPrompt[] = [
  {
    label: "Nearby Clinics",
    text: "Find urgent care clinics near me open now.",
    icon: <MapPin className="w-4 h-4" />
  },
  {
    label: "Flu Symptoms",
    text: "What are the common symptoms of the seasonal flu?",
    icon: <Stethoscope className="w-4 h-4" />
  },
  {
    label: "COVID-19 Updates",
    text: "What are the latest COVID-19 guidelines for isolation?",
    icon: <ShieldAlert className="w-4 h-4" />
  },
  {
    label: "Vaccine Schedule",
    text: "Show me the standard vaccination schedule for adults.",
    icon: <Activity className="w-4 h-4" />
  }
];
