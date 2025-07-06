// Types
export interface SendNotificationEmailRequest {
  // Ajoutez les champs nécessaires (ex: email, subject, message)
}
export interface SendNotificationEmailResponse {
  // Ajoutez les champs nécessaires
}

export interface SendNotificationSMSRequest {
  // Ajoutez les champs nécessaires (ex: phone, message)
}
export interface SendNotificationSMSResponse {
  // Ajoutez les champs nécessaires
}

export interface SendPasswordResetSMSRequest {
  // Ajoutez les champs nécessaires (ex: phone, code)
}
export interface SendPasswordResetSMSResponse {
  // Ajoutez les champs nécessaires
}

import { NOTIF_SERVICE_URL } from '../config/service-urls';

// API Calls
export async function sendRegistrationEmail(data: SendNotificationEmailRequest): Promise<SendNotificationEmailResponse> {
  try {
    const response = await fetch(`${NOTIF_SERVICE_URL}/api/notifications/email/registration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw errorData || { message: "Erreur lors de l'envoi de l'email d'inscription." };
    }
    return await response.json();
  } catch (error: any) {
    throw error;
  }
}

export async function sendRegistrationSMS(data: SendNotificationSMSRequest): Promise<SendNotificationSMSResponse> {
  try {
    const response = await fetch(`${NOTIF_SERVICE_URL}/api/notifications/sms/registration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw errorData || { message: "Erreur lors de l'envoi du SMS d'inscription." };
    }
    return await response.json();
  } catch (error: any) {
    throw error;
  }
}

export async function sendPasswordResetSMS(data: SendPasswordResetSMSRequest): Promise<SendPasswordResetSMSResponse> {
  try {
    const response = await fetch(`${NOTIF_SERVICE_URL}/api/notifications/sms/password-reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw errorData || { message: "Erreur lors de l'envoi du SMS de réinitialisation." };
    }
    return await response.json();
  } catch (error: any) {
    throw error;
  }
}
