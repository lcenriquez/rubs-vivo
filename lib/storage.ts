import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";

export async function uploadPhoto(
  file: File,
  userId: string,
  postId: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  const storage = getStorage();
  const fileExtension = file.type.split('/')[1] || 'jpg';
  const fileRef = ref(storage, `posts/${postId}/${Date.now()}.${fileExtension}`);
  
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
  const storage = getStorage();
  const fileRef = ref(storage, photoUrl);
  await deleteObject(fileRef);
} 