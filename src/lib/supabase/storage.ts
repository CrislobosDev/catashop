export const uploadProductImage = async (file: File) => {
  const { supabase } = await import("@/lib/supabase/client");
  if (!supabase) {
    throw new Error("Supabase no configurado");
  }
  const extension = file.name.split(".").pop() || "jpg";
  const path = `products/${crypto.randomUUID()}.${extension}`;
  const { data, error } = await supabase.storage
    .from("products")
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw error;
  }

  const { data: publicUrlData } = supabase.storage
    .from("products")
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
};
