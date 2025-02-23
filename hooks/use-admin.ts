import { useEffect, useState } from 'react';
import { useUser, useFirestore } from 'reactfire';
import { doc, getDoc } from 'firebase/firestore';

export function useAdmin() {
  const { data: user } = useUser();
  const firestore = useFirestore();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(firestore, 'users', user.uid));
        setIsAdmin(userDoc.data()?.isAdmin === true);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [user, firestore]);

  return { isAdmin, isLoading };
} 