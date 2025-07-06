import { IReference } from '@/types';
import { BDD_SERVICE_URL } from '../config/service-urls';

export async function getReferenceById(referenceId: string): Promise<IReference> {
  const response = await fetch(`${BDD_SERVICE_URL}/api/references/${referenceId}`);
  if (!response.ok) throw await response.json();
  return response.json();
}
