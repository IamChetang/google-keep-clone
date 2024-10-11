import { db } from "../firebase"; // Ensure Firebase is initialized in this file
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  getDoc,
  setDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useMutation } from "@tanstack/react-query"; // Assuming you are using react-query for mutation
import { NoteType } from "../type";
import { v4 as uuidv4 } from "uuid";
const createInputOption = async (payload: {
  collectionName: string;
  searchTerm?: string;
}) => {
  try {
    const { collectionName, searchTerm } = payload;
    let q;
    if (searchTerm) {
      q = query(
        collection(db, collectionName),
        where("title", "==", searchTerm)
      );
    } else {
      q = collection(db, collectionName);
    }

    let querySnapshot = await getDocs(q);
    const fetchedNotes: NoteType[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as NoteType[];

    return fetchedNotes;
  } catch (error) {}
};

export const useCreateInputOption = (
  args: { onSuccess?: (data: NoteType[]) => void } = {}
) => {
  return useMutation({
    mutationFn: createInputOption,
    onSuccess: (data: any) => {
      if (args.onSuccess) {
        args.onSuccess(data);
      }
    },
  });
};

// Archive query function
const moveNoteArchive = async (id: string) => {
  try {
    const noteToArchive = await getDoc(doc(db, "notes", id));
    if (noteToArchive.exists()) {
      const noteData = noteToArchive.data();
      await setDoc(doc(db, "archivedNotes", id), noteData);
      await deleteDoc(doc(db, "notes", id));
    }
    let q = collection(db, "notes");
    let querySnapshot = await getDocs(q);
    const fetchedNotes: NoteType[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as NoteType[];
    return fetchedNotes;
  } catch (error) {}
};

export const useMoveNoteArchive = (
  args: { onSuccess?: (data: NoteType[]) => void } = {}
) => {
  return useMutation({
    mutationFn: moveNoteArchive,
    onSuccess: (data: any) => {
      if (args.onSuccess) {
        args.onSuccess(data);
      }
    },
  });
};
// move to delete from notes and archive section
const moveNoteToDelete = async (id: string, fromNotes: boolean = true) => {
  try {
    const collectionName = fromNotes ? "notes" : "archivedNotes";
    const noteToDelete = await getDoc(doc(db, collectionName, id));
    if (noteToDelete.exists()) {
      const noteData = noteToDelete.data();
      console.log(noteData, collectionName);

      await setDoc(doc(db, "deletedNotes", id), noteData);
      await deleteDoc(doc(db, collectionName, id));
    }
    let q = collection(db, collectionName);
    let querySnapshot = await getDocs(q);
    const fetchedNotes: NoteType[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as NoteType[];
    return fetchedNotes;
  } catch (error) {}
};

export const useMoveNoteToDelete = (
  args: { onSuccess?: (data: NoteType[]) => void } = {}
) => {
  return useMutation({
    mutationFn: moveNoteToDelete,
    onSuccess: (data: any) => {
      if (args.onSuccess) {
        args.onSuccess(data);
      }
    },
  });
};

// Add notes
const addNotes = async (newNote: NoteType) => {
  try {
    if (newNote.title || newNote.text) {
      const id = newNote.id || uuidv4();
      const note = { ...newNote, id };
      await setDoc(doc(db, "notes", id), note);
    }
    let q = collection(db, "notes");
    let querySnapshot = await getDocs(q);
    const fetchedNotes: NoteType[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as NoteType[];
    return fetchedNotes;
  } catch (error) {}
};

export const useAddNotes = (
  args: { onSuccess?: (data: NoteType[]) => void } = {}
) => {
  return useMutation({
    mutationFn: addNotes,
    onSuccess: (data: any) => {
      if (args.onSuccess) {
        args.onSuccess(data);
      }
    },
  });
};

// toggle pinning
const togglePinNotes = async (id: string) => {
  try {
    const noteToArchive = await getDoc(doc(db, "notes", id));
    if (noteToArchive.exists()) {
      const noteData = noteToArchive.data();
      console.log(noteData);
      await updateDoc(doc(db, "notes", id), {
        ...noteData,
        isPinned: !noteData.isPinned,
      });
    }
    let q = collection(db, "notes");
    let querySnapshot = await getDocs(q);
    const fetchedNotes: NoteType[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as NoteType[];
    return fetchedNotes;
  } catch (error) {}
};

export const useTogglePinNotes = (
  args: { onSuccess?: (data: NoteType[]) => void } = {}
) => {
  return useMutation({
    mutationFn: togglePinNotes,
    onSuccess: (data: any) => {
      if (args.onSuccess) {
        args.onSuccess(data);
      }
    },
  });
};
// move multile otes to archives
const moveMultipleNoteArchive = async (ids: string[]) => {
  try {
    const promises = ids.map(async (id) => {
      const noteToArchive = await getDoc(doc(db, "notes", id));
      if (noteToArchive.exists()) {
        const noteData = noteToArchive.data();
        await setDoc(doc(db, "archivedNotes", id), noteData);
        await deleteDoc(doc(db, "notes", id));
      }
    });
    await Promise.all(promises);
    let q = collection(db, "notes");
    let querySnapshot = await getDocs(q);
    const fetchedNotes: NoteType[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as NoteType[];
    return fetchedNotes;
  } catch (error) {}
};

export const useMultipleMoveNoteArchive = (
  args: { onSuccess?: (data: NoteType[]) => void } = {}
) => {
  return useMutation({
    mutationFn: moveMultipleNoteArchive,
    onSuccess: (data: any) => {
      if (args.onSuccess) {
        args.onSuccess(data);
      }
    },
  });
};
