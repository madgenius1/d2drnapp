/**
 * useFirestore Hook
 * Generic real-time Firestore data fetching hook
 */

import {
    collection,
    DocumentData,
    onSnapshot,
    query,
    QueryConstraint
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { firestore } from '../services/firebase/config';

interface UseFirestoreOptions {
  collectionName: string;
  queryConstraints?: QueryConstraint[];
  enabled?: boolean;
}

interface UseFirestoreResult<T> {
  data: T[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Generic Firestore real-time data hook
 * Usage: const { data, isLoading, error } = useFirestore<Order>({ collectionName: 'orders', queryConstraints: [where('userId', '==', userId)] })
 */
export function useFirestore<T = DocumentData>({
  collectionName,
  queryConstraints = [],
  enabled = true,
}: UseFirestoreOptions): UseFirestoreResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const collectionRef = collection(firestore, collectionName);
      const q = queryConstraints.length > 0 
        ? query(collectionRef, ...queryConstraints)
        : collectionRef;

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const documents = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as T[];

          setData(documents);
          setIsLoading(false);
          setError(null);
        },
        (err) => {
          console.error(`[useFirestore] Error fetching ${collectionName}:`, err);
          setError(err as Error);
          setIsLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error(`[useFirestore] Setup error for ${collectionName}:`, err);
      setError(err as Error);
      setIsLoading(false);
    }
  }, [collectionName, enabled, refetchTrigger, ...queryConstraints]);

  const refetch = () => {
    setRefetchTrigger((prev) => prev + 1);
  };

  return {
    data,
    isLoading,
    error,
    refetch,
  };
}

export default useFirestore;