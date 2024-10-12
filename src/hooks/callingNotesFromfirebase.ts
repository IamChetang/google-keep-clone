import { db } from "../firebase"; // Ensure Firebase is initialized in this file
import {
  collection,
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

// Archive query function and unarchive query function
const moveNoteArchive = async (payload: {
  id: string;
  collectionName: string;
  action: string;
}) => {
  try {
    if (payload.action === "archive") {
      const noteToArchive = await getDoc(
        doc(db, payload.collectionName, payload.id)
      );
      if (noteToArchive.exists()) {
        const noteData = noteToArchive.data();
        await setDoc(doc(db, "archivedNotes", payload.id), noteData);
        await deleteDoc(doc(db, "notes", payload.id));
      }
    }

    if (payload.action === "unarchive") {
      const noteToRestore = await getDoc(
        doc(db, payload.collectionName, payload.id)
      );
      if (noteToRestore.exists()) {
        const noteData = noteToRestore.data();
        await setDoc(doc(db, "notes", payload.id), noteData);
        await deleteDoc(doc(db, payload.collectionName, payload.id));
      }
    }

    let q = collection(db, payload.collectionName);
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
const moveNoteToDelete = async (payload: {
  id: string;
  fromNotes: boolean;
}) => {
  try {
    const collectionName = payload.fromNotes ? "notes" : "archivedNotes";
    const noteToDelete = await getDoc(doc(db, collectionName, payload.id));
    if (noteToDelete.exists()) {
      const noteData = noteToDelete.data();
      await setDoc(doc(db, "deletedNotes", payload.id), noteData);
      await deleteDoc(doc(db, collectionName, payload.id));
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
// permananely delete a note
const permanentlyDeleteNote = async (id: string) => {
  try {
    await deleteDoc(doc(db, "deletedNotes", id));
    let q = collection(db, "deletedNotes");
    let querySnapshot = await getDocs(q);
    const fetchedNotes: NoteType[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as NoteType[];
    return fetchedNotes;
  } catch (error) {}
};

export const usePermanentlyDeleteNote = (
  args: { onSuccess?: (data: NoteType[]) => void } = {}
) => {
  return useMutation({
    mutationFn: permanentlyDeleteNote,
    onSuccess: (data: any) => {
      if (args.onSuccess) {
        args.onSuccess(data);
      }
    },
  });
};

// background color change

const changeBackGroundColor = async (payload: {
  id: string;
  collectionName: string;
  background: string | number | boolean | null | undefined;
}) => {
  try {
    const noteToArchive = await getDoc(
      doc(db, payload.collectionName, payload.id)
    );
    if (noteToArchive.exists()) {
      const noteData = noteToArchive.data();
      await updateDoc(doc(db, payload.collectionName, payload.id), {
        ...noteData,
        background: payload.background,
      });
    }
    let q = collection(db, payload.collectionName);
    let querySnapshot = await getDocs(q);
    const fetchedNotes: NoteType[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as NoteType[];
    return fetchedNotes;
  } catch (error) {}
};

export const useChangeBackGroundColor = (
  args: { onSuccess?: (data: NoteType[]) => void } = {}
) => {
  return useMutation({
    mutationFn: changeBackGroundColor,
    onSuccess: (data: any) => {
      if (args.onSuccess) {
        args.onSuccess(data);
      }
    },
  });
};

const addLabelToNotes = async (payload: {
  id: string;
  collectionName: string;
  label: string;
}) => {
  try {
    const noteToArchive = await getDoc(
      doc(db, payload.collectionName, payload.id)
    );
    if (noteToArchive.exists()) {
      const noteData = noteToArchive.data();
      await updateDoc(doc(db, payload.collectionName, payload.id), {
        ...noteData,
        labels:
          noteData.labels && noteData.labels.includes(payload.label)
            ? noteData.labels // If the label already exists, do nothing
            : [...(noteData.labels || []), payload.label], // Otherwise, add the new label
      });
    }
    let q = collection(db, payload.collectionName);
    let querySnapshot = await getDocs(q);
    const fetchedNotes: NoteType[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as NoteType[];
    return fetchedNotes;
  } catch (error) {}
};

export const useAddLabelToNotes = (
  args: { onSuccess?: (data: NoteType[]) => void } = {}
) => {
  return useMutation({
    mutationFn: addLabelToNotes,
    onSuccess: (data: any) => {
      if (args.onSuccess) {
        args.onSuccess(data);
      }
    },
  });
};
