import { supabase } from "@/lib/supabase";

export const deleteImageFromIonos = async (url: string | null | undefined) => {
  if (!url) return;
  
  // Only try to delete from IONOS if it's an uploads/ URL (to avoid errors on external/legacy URLs)
  if (!url.includes('/uploads/')) return;
  
  try {
    // Extract filename from URL (e.g. https://domain.com/uploads/filename.webp)
    const filename = url.substring(url.lastIndexOf('/') + 1);
    
    if (!filename) return;

    // Get the current Supabase session token for authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      console.warn('Cannot delete image: not authenticated');
      return;
    }

    await fetch('/delete.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({ filename })
    });
  } catch (error) {
    console.error('Failed to delete image from IONOS:', error);
  }
};
