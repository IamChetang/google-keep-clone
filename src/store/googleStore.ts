import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid';
import { doc, setDoc, getDoc, updateDoc, deleteDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
type Note = {
  id: string;
  title: string;
  text: string;
};
type StoreState = {
  notes: Note[], // Active notes
  archivedNotes: Note[], // Archived notes
  deletedNotes: Note[], // Deleted notes
  addNotes: (note: Note) =>void;
  archiveNote: (id: string) => void;
  deleteNote: (id: string,fromNotes:boolean) => void;
  restoreNote: (id: string,fromArchived:boolean) => void;
  permanentlyDeleteNote: (id: string) => void;
};

const useStore = create<StoreState>((set) => ({
  notes: [],
  archivedNotes: [], 
  deletedNotes: [],
  // addNotes: (newNote) => set((state) => ({ notes: [...state.notes, newNote] })),
  addNotes: async (newNote) => {
    console.log(newNote)
    if (newNote.title || newNote.text) {
      const id = newNote.id || uuidv4(); 
      const note = { ...newNote, id };
      console.log(db)
      await setDoc(doc(db, 'notes', id), note); 
      set((state) => ({
        notes: [...state.notes, note],
      }));
    }
  },
  archiveNote: async (id) => {
    const noteToArchive = await getDoc(doc(db, 'notes', id));
    if (noteToArchive.exists()) {
      const noteData = noteToArchive.data();
      await setDoc(doc(db, 'archivedNotes', id), noteData); 
      await deleteDoc(doc(db, 'notes', id)); 
      set((state) => ({
        notes: state.notes.filter((note) => note.id !== id),
        archivedNotes: [...state.archivedNotes, noteData as Note],
      }));
    }
  },
  deleteNote: async (id, fromNotes = true) => {
    const collectionName = fromNotes ? 'notes' : 'archivedNotes';
    const noteToDelete = await getDoc(doc(db, collectionName, id));
    if (noteToDelete.exists()) {
      const noteData = noteToDelete.data();
      await setDoc(doc(db, 'deletedNotes', id), noteData); // Move note to 'deletedNotes'
      await deleteDoc(doc(db, collectionName, id)); // Delete from source collection
      set((state) => ({
        [collectionName]: state[collectionName].filter((note) => note.id !== id),
        deletedNotes: [...state.deletedNotes, noteData as Note],
      }));
    }
  },
  restoreNote: async (id, fromArchived = true) => {
    const collectionName = fromArchived ? 'archivedNotes' : 'deletedNotes';
    const noteToRestore = await getDoc(doc(db, collectionName, id));
    if (noteToRestore.exists()) {
      const noteData = noteToRestore.data();
      await setDoc(doc(db, 'notes', id), noteData); // Restore to 'notes' collection
      await deleteDoc(doc(db, collectionName, id)); // Remove from source collection
      set((state) => ({
        [collectionName]: state[collectionName].filter((note) => note.id !== id),
        notes: [...state.notes, noteData as Note],
      }));
    }
  },
  permanentlyDeleteNote: async (id) => {
    await deleteDoc(doc(db, 'deletedNotes', id)); // Delete from 'deletedNotes'
    set((state) => ({
      deletedNotes: state.deletedNotes.filter((note) => note.id !== id),
    }));
  },
}));

export default useStore;