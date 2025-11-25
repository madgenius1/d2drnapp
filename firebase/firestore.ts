/**
 * Firestore Helper Functions
 * Common Firestore operations
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  QueryConstraint,
  DocumentData,
  CollectionReference,
  DocumentReference,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';

/**
 * Collection names
 */
export const COLLECTIONS = {
  USERS: 'users',
  ORDERS: 'orders',
  ERRANDS: 'errands',
  ROUTES: 'routes',
} as const;

/**
 * Get a document by ID
 */
export const getDocument = async <T = DocumentData>(
  collectionName: string,
  documentId: string
): Promise<T | null> => {
  try {
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    }

    return null;
  } catch (error) {
    console.error(`Error getting document from ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Get all documents from a collection
 */
export const getDocuments = async <T = DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> => {
  try {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, ...constraints);
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as T[];
  } catch (error) {
    console.error(`Error getting documents from ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Add a new document
 */
export const addDocument = async <T = DocumentData>(
  collectionName: string,
  data: T
): Promise<string> => {
  try {
    const collectionRef = collection(db, collectionName);
    const docRef = await addDoc(collectionRef, {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return docRef.id;
  } catch (error) {
    console.error(`Error adding document to ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Set a document (create or overwrite)
 */
export const setDocument = async <T = DocumentData>(
  collectionName: string,
  documentId: string,
  data: T
): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await setDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error(`Error setting document in ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Update a document
 */
export const updateDocument = async (
  collectionName: string,
  documentId: string,
  data: Partial<DocumentData>
): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Delete a document
 */
export const deleteDocument = async (
  collectionName: string,
  documentId: string
): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Query documents with filters
 */
export const queryDocuments = async <T = DocumentData>(
  collectionName: string,
  filters: {
    field: string;
    operator: any;
    value: any;
  }[],
  orderByField?: string,
  limitCount?: number
): Promise<T[]> => {
  try {
    const collectionRef = collection(db, collectionName);
    const constraints: QueryConstraint[] = filters.map(f =>
      where(f.field, f.operator, f.value)
    );

    if (orderByField) {
      constraints.push(orderBy(orderByField, 'desc'));
    }

    if (limitCount) {
      constraints.push(limit(limitCount));
    }

    return getDocuments<T>(collectionName, constraints);
  } catch (error) {
    console.error(`Error querying documents from ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Convert Firestore Timestamp to ISO string
 */
export const timestampToISO = (timestamp: Timestamp): string => {
  return timestamp.toDate().toISOString();
};

/**
 * Convert ISO string to Firestore Timestamp
 */
export const isoToTimestamp = (isoString: string): Timestamp => {
  return Timestamp.fromDate(new Date(isoString));
};