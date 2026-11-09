import { API_BASE_URL, authenticatedFetch, handleApiResponse } from '../config';

export interface CategoryResponse {
  id: number;
  name: string;
  depth: number;
  displayOrder: number;
}

export async function getCategoriesByDepth(depth?: number): Promise<CategoryResponse[]> {
  const query = typeof depth === 'number' ? `?depth=${depth}` : '';
  const response = await authenticatedFetch(`${API_BASE_URL}/catalog/category${query}`);
  const data = await handleApiResponse<CategoryResponse[]>(response);
  return data.data ?? [];
}
