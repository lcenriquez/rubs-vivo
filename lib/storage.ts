import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";

export async function uploadPhoto(
  file: File,
  userId: string,
  postId: string,
  onProgress?: (progress: number) => void,
  uniqueId?: string
): Promise<string> {
  const storage = getStorage();
  const fileExtension = file.type.split('/')[1] || 'jpg';
  const filename = uniqueId ? `${uniqueId}.${fileExtension}` : `${Date.now()}.${fileExtension}`;
  const fileRef = ref(storage, `posts/${postId}/${filename}`);
  
  const uploadTask = uploadBytesResumable(fileRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.(progress);
      },
      (error) => {
        reject(error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      }
    );
  });
}

export async function deletePhoto(photoUrl: string): Promise<void> {
  try {
    const storage = getStorage();
    
    // Extract the path from the URL
    // Firebase Storage URLs are in the format: https://firebasestorage.googleapis.com/v0/b/[bucket]/o/[path]?token=[token]
    const url = new URL(photoUrl);
    const path = decodeURIComponent(url.pathname.split('/o/')[1]?.split('?')[0]);
    
    if (!path) {
      throw new Error('Invalid storage URL format');
    }
    
    const fileRef = ref(storage, path);
    await deleteObject(fileRef);
  } catch (error) {
    console.error('Error in deletePhoto:', error);
    throw error;
  }
} 