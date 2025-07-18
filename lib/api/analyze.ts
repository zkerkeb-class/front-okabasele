// Types
export interface AnalyzePerformanceRequest {
  performance: IPerformance;
   reference: IReference
  [key: string]: any;
}
export interface AnalyzePerformanceResponse {
  score: number;
  feedback: string[];
  [key: string]: any;
}



import { IReference, IPerformance } from '@/types';
// API Calls
import { IA_SERVICE_URL } from '../config/service-urls';
export async function analyzePerformance(data: AnalyzePerformanceRequest): Promise<AnalyzePerformanceResponse> {
  try {
    const response = await fetch(`${IA_SERVICE_URL}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw errorData || { message: "Erreur lors de l'analyse." };
    }
    return await response.json();
  } catch (error: any) {
    throw error;
  }
}
