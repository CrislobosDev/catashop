export const supabaseStorageHost = (() => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
})();

export const canUseOptimizedImage = (imageUrl: string) => {
  try {
    const host = new URL(imageUrl).hostname;
    return supabaseStorageHost ? host === supabaseStorageHost : false;
  } catch {
    return false;
  }
};
