import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid';
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

type Note = {
  id: string;
  title: string;
  text: string;
};
type StoreState = {
  addNotes: (note: Note) => void;
  archiveNote: (id: string) => void;
  archiveMultipleNotes: (ids: string[]) => void;
  deleteNote: (id: string, fromNotes: boolean) => void;
  restoreNote: (id: string, fromArchived: boolean) => void;
  permanentlyDeleteNote: (id: string) => void;
  // for login
  user: null | { uid: string; email: any };
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuthState: () => void;
};

const useStore = create<StoreState>((set) => ({
  addNotes: async (newNote) => {
    if (newNote.title || newNote.text) {
      const id = newNote.id || uuidv4();
      const note = { ...newNote, id };
      await setDoc(doc(db, 'notes', id), note);
      console.log(auth);
    }
  },
  archiveMultipleNotes: async (ids) => {
    try {
      const promises = ids.map(async (id) => {
        const noteToArchive = await getDoc(doc(db, 'notes', id));
        if (noteToArchive.exists()) {
          const noteData = noteToArchive.data();
          await setDoc(doc(db, 'archivedNotes', id), noteData);
          await deleteDoc(doc(db, 'notes', id));
        }
      });
      await Promise.all(promises);
    } catch (err) {
      console.error('Error updating multiple documents:', err);
    }
  },
  archiveNote: async (id) => {
    const noteToArchive = await getDoc(doc(db, 'notes', id));
    if (noteToArchive.exists()) {
      const noteData = noteToArchive.data();
      await setDoc(doc(db, 'archivedNotes', id), noteData);
      await deleteDoc(doc(db, 'notes', id));
    }
  },
  deleteNote: async (id, fromNotes = true) => {
    const collectionName = fromNotes ? 'notes' : 'archivedNotes';
    const noteToDelete = await getDoc(doc(db, collectionName, id));
    if (noteToDelete.exists()) {
      const noteData = noteToDelete.data();
      await setDoc(doc(db, 'deletedNotes', id), noteData); // Move note to 'deletedNotes'
      await deleteDoc(doc(db, collectionName, id)); // Delete from source collection

    }
  },
  restoreNote: async (id, fromArchived = true) => {
    const collectionName = fromArchived ? 'archivedNotes' : 'deletedNotes';
    const noteToRestore = await getDoc(doc(db, collectionName, id));
    if (noteToRestore.exists()) {
      const noteData = noteToRestore.data();
      await setDoc(doc(db, 'notes', id), noteData); 
      await deleteDoc(doc(db, collectionName, id)); 
    }
  },
  permanentlyDeleteNote: async (id) => {
    await deleteDoc(doc(db, 'deletedNotes', id)); 
  },
  user: null,
  loading: false,
  login: async (email, password) => {
    set({ loading: true });
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      set({ user: { uid: userCredential.user.uid, email: userCredential.user.email } });
    } catch (error) {
      console.error('Login Error:', error);
      alert(error)
    } finally {
      set({ loading: false });
    }
  },
  signUp: async (email, password) => {
    set({ loading: true });
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      set({ user: { uid: userCredential.user.uid, email: userCredential.user.email } });
    } catch (error) {
      console.error('Sign Up Error:', error);
    } finally {
      set({ loading: false });
    }
  },
  logout: async () => {
    try {
      await signOut(auth);
      set({ user: null });
    } catch (error) {
      console.error('Logout Error:', error);
    }
  },
  checkAuthState: () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        set({ user: { uid: user.uid, email: user.email } });
      } else {
        set({ user: null });
      }
    });
  },
}));

export default useStore;