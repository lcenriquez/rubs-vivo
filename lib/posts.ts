import { collection, addDoc, query, where, getDocs, serverTimestamp, orderBy, doc, updateDoc, deleteDoc, setDoc, GeoPoint } from "firebase/firestore";
import { Post, PostPhoto, PostType, Location } from "@/types/post";
import { deleteObject, ref as storageRef } from "firebase/storage";
import { getStorage } from "firebase/storage";

interface CreatePostData {
  userId: string;
  title: string;
  type: PostType;
  location: Location;
  description: string;
  photos: PostPhoto[];
  status: 'pending';
  author: {
    displayName: string | null;
    email: string | null;
  };
}

export function generatePostRef(db: any): { id: string, ref: any } {
  const postsCollection = collection(db, "posts");
  const newDocRef = doc(postsCollection);
  return { id: newDocRef.id, ref: newDocRef };
}

export async function createPost(data: CreatePostData, db: any, postId?: string): Promise<string> {
  const postData = {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  if (postId) {
    const docRef = doc(db, "posts", postId);
    await setDoc(docRef, postData);
    return postId;
  } else {
    const docRef = await addDoc(collection(db, "posts"), postData);
    return docRef.id;
  }
}

export async function getUserPosts(userId: string, db: any): Promise<Post[]> {
  console.log('Fetching posts for user:', userId);
  const q = query(
    collection(db, "posts"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);
  console.log('Query snapshot:', snapshot.docs.length, 'documents found');
  console.log('Documents:', snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Post[];
}

export async function updatePost(
  postId: string,
  data: Partial<CreatePostData>,
  db: any
): Promise<void> {
  const docRef = doc(db, "posts", postId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp()
  });
}

export async function deletePost(postId: string, photos: PostPhoto[], db: any): Promise<void> {
  const storage = getStorage();
  // Delete photos from storage
  const deletePromises = photos.map(photo => {
    const fileRef = storageRef(storage, photo.url);
    return deleteObject(fileRef);
  });
  
  await Promise.all(deletePromises);
  
  // Delete post document
  const docRef = doc(db, "posts", postId);
  await deleteDoc(docRef);
}

export async function getPendingPosts(db: any): Promise<Post[]> {
  const q = query(
    collection(db, "posts"),
    where("status", "==", "pending"),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Post[];
}

export async function updatePostStatus(
  postId: string,
  status: 'approved' | 'rejected',
  db: any,
  rejectionReason?: string
): Promise<void> {
  const docRef = doc(db, "posts", postId);
  await updateDoc(docRef, {
    status,
    ...(rejectionReason && { rejectionReason }),
    updatedAt: serverTimestamp()
  });
}

export async function getNearbyPosts(location: Location, radiusInKm: number, db: any): Promise<Post[]> {
  // Convert radius from km to degrees (rough approximation)
  const radiusInDegrees = radiusInKm / 111;

  // Create boundary box for rough filtering
  const bounds = {
    minLat: location.lat - radiusInDegrees,
    maxLat: location.lat + radiusInDegrees,
    minLng: location.lng - radiusInDegrees,
    maxLng: location.lng + radiusInDegrees
  };

  const q = query(
    collection(db, "posts"),
    where("status", "==", "approved"),
    where("location.lat", ">=", bounds.minLat),
    where("location.lat", "<=", bounds.maxLat),
    orderBy("location.lat"),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);
  const posts = snapshot.docs
    .map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Post[];

  // Further filter posts within the radius using the Haversine formula
  return posts.filter(post => {
    const distance = getDistanceFromLatLonInKm(
      location.lat,
      location.lng,
      post.location.lat,
      post.location.lng
    );
    return distance <= radiusInKm;
  });
}

// Haversine formula to calculate distance between two points
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
} 