import { ISubscription, IUser } from '@/types';
import { BDD_SERVICE_URL, AUTH_SERVICE_URL } from '../config/service-urls';

// Types
export interface CreateUserRequest {
  // Ajoutez les champs nécessaires
}
export interface CreateUserResponse {
  // Ajoutez les champs nécessaires
}

export interface GetUserByIdentifierRequest {
  // Ajoutez les champs nécessaires
}
export interface GetUserByIdentifierResponse {
  // Ajoutez les champs nécessaires
}

export interface FindUserByEmailOrOAuthRequest {
  // Ajoutez les champs nécessaires
}
export interface FindUserByEmailOrOAuthResponse {
  // Ajoutez les champs nécessaires
}

export interface VerifyUserCredentialsRequest {
  // Ajoutez les champs nécessaires
}
export interface VerifyUserCredentialsResponse {
  // Ajoutez les champs nécessaires
  token: string; // Assurez-vous que le token est inclus dans la réponse
}

export interface GetUserByIdResponse {
  // Ajoutez les champs nécessaires
}

export interface GetUserByTokenResponse extends IUser {
  // Ajoutez les champs nécessaires 
}


// Utilise AUTH_SERVICE_URL pour register
export async function createUser(data: CreateUserRequest): Promise<CreateUserResponse> {
  try {
    const response = await fetch(`${AUTH_SERVICE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw errorData || { message: 'Erreur lors de la création de l\'utilisateur.' };
    }
    return await response.json();
  } catch (error: any) {
    throw error;
  }
}

export async function getUserByIdentifier(data: GetUserByIdentifierRequest): Promise<GetUserByIdentifierResponse> {
  try {
    const response = await fetch(`${BDD_SERVICE_URL}/api/users/find`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw errorData || { message: 'Erreur lors de la recherche de l\'utilisateur.' };
    }
    return await response.json();
  } catch (error: any) {
    throw error;
  }
}


export async function findUserByEmailOrOAuth(data: FindUserByEmailOrOAuthRequest): Promise<FindUserByEmailOrOAuthResponse> {
  try {
    const response = await fetch(`${BDD_SERVICE_URL}/api/users/find/oauth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw errorData || { message: 'Erreur lors de la recherche OAuth.' };
    }
    return await response.json();
  } catch (error: any) {
    throw error;
  }
}


// Utilise AUTH_SERVICE_URL pour login
export async function verifyUserCredentials(data: VerifyUserCredentialsRequest): Promise<VerifyUserCredentialsResponse> {
  try {
    const response = await fetch(`${AUTH_SERVICE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw errorData || { message: 'Erreur lors de la vérification.' };
    }
    return await response.json();
  } catch (error: any) {
    throw error;
  }
}

export async function getUserById(id: string): Promise<GetUserByIdResponse> {
  try {
    const response = await fetch(`${BDD_SERVICE_URL}/api/users/${id}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw errorData || { message: 'Erreur lors de la récupération de l\'utilisateur.' };
    }
    return await response.json();
  } catch (error: any) {
    throw error;
  }
}

export async function getUserFromToken(token:string): Promise<GetUserByTokenResponse> {
    try {
      const response = await fetch(
        `${AUTH_SERVICE_URL}/api/auth/validate-token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ token })
        }
      )
      if (!response.ok) {
        throw new Error("Failed to verify token")
      }
      const data = await response.json()
      return data.user
    } catch (error) {
      throw new Error(`Error verifying token: ${error}`)
    }
  }

  export async function fetchUserSubscriptions(userId: string): Promise<ISubscription[]> {
    try {
      const response = await fetch(`${BDD_SERVICE_URL}/api/users/${userId}/subscriptions`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw errorData || { message: 'Erreur lors de la récupération des abonnements.' };
      }
      const result = await response.json();
      return result.data;
    } catch (error: any) {
      throw error;
    }
  }