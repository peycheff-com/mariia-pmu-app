import { Area } from '../types';

// --- Mock Database (using localStorage for persistence) ---
const db = {
  getItem: (key: string): any[] => {
    try {
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch {
      return [];
    }
  },
  setItem: (key: string, value: any): void => {
    localStorage.setItem(key, JSON.stringify(value));
  },
};

const getTable = (name: 'client' | 'session' | 'asset') => db.getItem(`pmu_db_${name}`);

const insertInto = (name: 'client' | 'session' | 'asset', newItem: any): any => {
    const table = getTable(name);
    const newId = crypto.randomUUID();
    const itemWithId = { id: newId, created_at: new Date().toISOString(), ...newItem };
    db.setItem(`pmu_db_${name}`, [...table, itemWithId]);
    return itemWithId;
}

// --- Mock C2PA Service ---
const signAsset = async (claims: Record<string, string>): Promise<void> => {
    console.log('[BACKEND MOCK][C2PA] Signing asset with claims:', claims);
    await new Promise(resolve => setTimeout(resolve, 200)); // Simulate signing delay
};

// --- Mock Supabase Storage ---
const uploadAsset = async (path: string, sizeKB: number): Promise<void> => {
    console.log(`[BACKEND MOCK][Storage] Uploading to mockups/${path} (${sizeKB.toFixed(2)} KB)`);
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate upload delay
};

// --- API Service Functions ---

/**
 * Mocks the API call to the SAM-2 service to refine a selection mask.
 * @param image - Base64 data URL of the source image.
 * @param points - An array of points drawn by the user to indicate the selection.
 * @returns A promise that resolves with the data URL of the refined mask.
 */
export const refineMask = (
  image: string,
  points: { x: number; y: number; label: number }[]
): Promise<{ mask: string }> => {
  console.log('[BACKEND MOCK][/api/mask-refine] Received points for refinement.');

  return new Promise((resolve) => {
    setTimeout(() => {
      // Return a pre-defined semi-transparent image to simulate a real mask response.
      const mockMaskDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFMSURBVHhe7dixDQJBEAXBv/dACiiBEiiBEiiBEqiAAlSAAhSggPagB3rgh34kYcsF2e3sLiDJzW6T9+1u833+A0KIESNGjBgxYsSIESNGjBgxYsSIESNGjBgxYsSIESNGjBgxYsSIESNGjBgxYsSIESNGjBgxYsSIESNGjBgxYsSIESNGjBgxYsSIESNGjBgxYsSIESNGjBgxYsSIESNGjBgxYsSIESNGjBgxYsSIESNGjBgxYsSIESNGjBgxYsSIESNGjBgxYsSIESNGjBgxYsSIESNGjBgxYsSIESNGjBgxYsSIESNGjBgxYsSIESNGjBgxYsSIESNGjBgxYsSIESNGjBgxYsSIESNGjBgxYsSIESNGjBgxYsSIESNGjBgxYsSIESNGjBgxYsSIESNGjBgxYsSIESNGjBgxYsSIESNGjBgxYsSIESNGjBgxYsSIESNGjBgxYsSIESNGjBgxYsSIESNGjBgxYsSIESNGjBgxYsSIEWOcT092e6LAD5EFyL4AAAAASUVORK5CYII=';
      console.log('[BACKEND MOCK][/api/mask-refine] Mock SAM-2 service responding with a mask.');
      resolve({ mask: mockMaskDataUrl });
    }, 800); // Simulate SAM-2 processing delay
  });
};

/**
 * Mocks the full backend pipeline to generate a photorealistic mockup.
 */
export const generateMockup = async (
  image: string,
  mask: string,
  area: Area,
  hex: string,
  consents: { preview: boolean; portfolio: boolean }
): Promise<{ id: string }> => {
  console.log('[BACKEND MOCK][/api/edit] Received mockup request.');

  // 1. Mock ComfyUI call
  console.log('[BACKEND MOCK][ComfyUI] Generating photorealistic image...');
  await new Promise(resolve => setTimeout(resolve, 1500));
  const resultImageB64 = image.split(',')[1];
  const imageBuffer = atob(resultImageB64);
  console.log('[BACKEND MOCK][ComfyUI] Image generated.');

  // 2. Mock C2PA signing
  await signAsset({ tool: 'FLUX.1 Fill (Mock)', area, hex, studio: 'BM Beauty Studio' });
  
  // 3. Mock Supabase Storage upload
  const path = `m/${crypto.randomUUID()}.jpg`;
  await uploadAsset(path, imageBuffer.length / 1024);

  // 4. Mock Database inserts
  console.log('[BACKEND MOCK][Database] Storing session and asset metadata...');
  const client = insertInto('client', { handle: 'web-user' });
  const session = insertInto('session', {
      client_id: client.id,
      source: 'site',
      consent_preview: consents.preview,
      consent_portfolio: consents.portfolio,
  });
  insertInto('asset', {
      session_id: session.id,
      kind: 'mockup',
      url: path,
      meta: { area, hex },
  });
  console.log('[BACKEND MOCK][Database] Records created successfully.');

  // 5. Return the ID (which is the storage path)
  return { id: path };
};

/**
 * Mocks the creation of a Stripe Checkout session.
 */
export const createCheckoutSession = async (): Promise<{ url: string }> => {
    console.log('[BACKEND MOCK][/api/checkout] Creating Stripe Checkout session...');
    await new Promise(resolve => setTimeout(resolve, 500));
    // In a real app, this URL would be the one returned from the Stripe API
    const mockUrl = 'https://booksy.com/en-pl/p/borysewic-permanent-makeup'; 
    console.log('[BACKEND MOCK][/api/checkout] Mock session created. Redirecting...');
    return { url: mockUrl };
};

/**
 * Constructs a public URL for a given mockup path.
 * In a real app, this would use the NEXT_PUBLIC_SUPABASE_URL env variable.
 * @param path The storage path of the mockup object (e.g., 'm/uuid.jpg').
 * @returns A public URL that resolves to an image for demonstration.
 */
export const getMockupPublicUrl = (path: string): string => {
    // This uses a placeholder service that provides random images based on a seed.
    const seed = path.split('/').pop()?.split('.').shift();
    return `https://picsum.photos/seed/${seed}/1024/1024`;
};
