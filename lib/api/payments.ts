// Types
export interface CheckoutRequest {
  type: string;
  // Ajoutez d'autres champs nécessaires
}
export interface CheckoutResponse {
  // Ajoutez les champs nécessaires
}

import { PAYMENT_SERVICE_URL } from '../config/service-urls';

// API Calls
export async function checkout(type: string, data: CheckoutRequest): Promise<CheckoutResponse> {
  try {
    const response = await fetch(`${PAYMENT_SERVICE_URL}/api/payments/checkout/${type}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw errorData || { message: 'Erreur lors du paiement.' };
    }
    const result = await response.json();
    if (result.url) {
      window.open(result.url, '_blank');
    }
    return result;
  } catch (error: any) {
    throw error;
  }
}
