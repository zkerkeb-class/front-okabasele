

// Types
export interface CreateThreadRequest {
  // Ajoutez les champs nécessaires
}
export interface CreateThreadResponse {
  // Ajoutez les champs nécessaires
}

export interface GetThreadByIdResponse {
  // Ajoutez les champs nécessaires
}


import { IA_SERVICE_URL } from '../config/service-urls';

// API Calls
export async function createThreadForSession(data: CreateThreadRequest): Promise<CreateThreadResponse> {
  try {
    const response = await fetch(`${IA_SERVICE_URL}/api/assistant/threads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw errorData || { message: 'Erreur lors de la création du thread.' };
    }
    return await response.json();
  } catch (error: any) {
    throw error;
  }
}

export async function getThreadById(threadId: string): Promise<GetThreadByIdResponse> {
  try {
    const response = await fetch(`${IA_SERVICE_URL}/api/assistant/threads/${threadId}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw errorData || { message: 'Erreur lors de la récupération du thread.' };
    }
    return await response.json();
  } catch (error: any) {
    throw error;
  }
}
