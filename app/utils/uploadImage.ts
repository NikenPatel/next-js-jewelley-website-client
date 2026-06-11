import api from "@/app/store/lib/axios";

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);

  try {
    // Post to the backend route which handles the Cloudinary stream
    const response = await api.post<{
      success: boolean;
      imageUrl: string;
      public_id?: string;
    }>("/api/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data?.success) {
      return response.data.imageUrl;
    } else {
      throw new Error("Image upload failed");
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
