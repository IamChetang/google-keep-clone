import { create } from 'zustand'
type Note = {
  id: string;
  title: string;
  text: string;
};
type StoreState = {
  notes: Note[], // Active notes
  archivedNotes: Note[], // Archived notes
  deletedNotes: Note[], // Deleted notes
  addNotes: (note: Note) => any;
  archiveNote: (id: string) => void;
  deleteNote: (id: string) => void;
  restoreNote: (id: string) => void;
  permanentlyDeleteNote: (id: string) => void;
};

const useStore = create<StoreState>((set) => ({
  notes: [],
  archivedNotes: [], 
  deletedNotes: [],
  // addNotes: (newNote) => set((state) => ({ notes: [...state.notes, newNote] })),
  addNotes: (newNote) => set((state) => {

    if(newNote.title || newNote.text){
      return {
        notes: [...state.notes, newNote]
      };
    }else{
      return  [...state.notes]
    }
   
  }),
  archiveNote: (id) => set((state) => {
    const noteToArchive = state.notes.find((note) => note.id === id);
    return {
      notes: state.notes.filter((note) => note.id !== id),
      archivedNotes: [...state.archivedNotes, noteToArchive],
    };
  }),
  deleteNote: (id,fromNotes = true) => set((state) => {
    const deleteArray = fromNotes ? 'notes' : 'archivedNotes';
    const noteToDelete = state[deleteArray].find((note) => note.id === id);
    return {
      [deleteArray]: state[deleteArray].filter((note) => note.id !== id),
      deletedNotes: [...state.deletedNotes, noteToDelete],
    };
  }),
  restoreNote: (id, fromArchived = true) => set((state) => {
    const restoreArray = fromArchived ? 'archivedNotes' : 'deletedNotes';
    const noteToRestore = state[restoreArray].find((note) => note.id === id);
    return {
      [restoreArray]: state[restoreArray].filter((note) => note.id !== id),
      notes: [...state.notes, noteToRestore],
    };
  }),
  permanentlyDeleteNote: (id) => set((state) => ({
    deletedNotes: state.deletedNotes.filter((note) => note.id !== id),
  })),
}));

export default useStore;