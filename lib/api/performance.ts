import { BDD_SERVICE_URL } from '../config/service-urls';
import { IPerformance } from '@/types';

export interface CreatePerformanceRequest extends Omit<IPerformance, 'feedback'> {
  feedback?: {
    score?: number;
    comments?: string;
    details?: any;
  };
}

export interface CreatePerformanceResponse extends IPerformance {
  _id: string;
}


export async function createPerformance(data: CreatePerformanceRequest): Promise<CreatePerformanceResponse> {
  const response = await fetch(`${BDD_SERVICE_URL}/api/performances`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw await response.json();
  return response.json();
}

// Get all performances for a user
export async function getPerformancesByUser(userId: string): Promise<IPerformance[]> {
  const response = await fetch(`${BDD_SERVICE_URL}/api/performances/user/${userId}`);
  if (!response.ok) throw await response.json();
  return response.json();
}
