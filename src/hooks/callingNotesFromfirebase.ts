import { db } from "../firebase";
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
import { useMutation } from "@tanstack/react-query";
import { labelType, NoteType } from "../type";
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
const moveMultipleNoteArchive = async (payload: {
  ids: string[];
  moveFrom: string;
  moveTo: string;
  action: string;
}) => {
  try {
    if (payload.action === "archive") {
      const promises = payload.ids.map(async (id) => {
        const noteToArchive = await getDoc(doc(db, payload.moveFrom, id));
        if (noteToArchive.exists()) {
          const noteData = noteToArchive.data();
          await setDoc(doc(db, payload.moveTo, id), noteData);
          await deleteDoc(doc(db, payload.moveFrom, id));
        }
      });
      await Promise.all(promises);
    }
    if (payload.action === "delete") {
      const promises = payload.ids.map(async (id) => {
        const noteToDelete = await getDoc(doc(db, payload.moveFrom, id));
        if (noteToDelete.exists()) {
          const noteData = noteToDelete.data();
          await setDoc(doc(db, payload.moveTo, id), noteData); // Move note to 'deletedNotes'
          await deleteDoc(doc(db, payload.moveFrom, id)); // Delete from source collection
        }
      });
      await Promise.all(promises);
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
    const id = uuidv4();
    const labelObject = { id: id, label: payload.label };
    const querySnapshotLabel = await getDocs(
      query(collection(db, "labels"), where("label", "==", payload.label))
    );
    const fetchedLabels: { label: string; id: string }[] =
      querySnapshotLabel.docs.map((doc) => ({
        id: doc.id,
        label: doc.data().label,
      })) as { label: string; id: string }[];

    if (fetchedLabels.length === 0) {
      await setDoc(doc(db, "labels", id), labelObject);
      const getLabel = await getDoc(doc(db, "labels", id));
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
              : [...(noteData.labels || []), getLabel.data()], // Otherwise, add the new label
        });
      }
    } else {
      throw new Error("Found a label with same name");
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

const getLabels = async () => {
  try {
    let q = collection(db, "labels");
    let querySnapshot = await getDocs(q);
    const fetchedLabels: labelType[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as labelType[];
    return fetchedLabels;
  } catch (error) {}
};

export const useGetLabels = (
  args: { onSuccess?: (data: labelType[]) => void } = {}
) => {
  return useMutation({
    mutationFn: getLabels,
    onSuccess: (data: any) => {
      if (args.onSuccess) {
        args.onSuccess(data);
      }
    },
  });
};

// add labels

const addLabels = async (newLabel: string) => {
  try {
    const id = uuidv4();
    const label = { label: newLabel, id: id };
    await setDoc(doc(db, "labels", id), label);

    let q = collection(db, "labels");
    let querySnapshot = await getDocs(q);
    const fetchedLabels: labelType[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as labelType[];
    return fetchedLabels;
  } catch (error) {}
};

export const useAddLabels = (
  args: { onSuccess?: (data: labelType[]) => void } = {}
) => {
  return useMutation({
    mutationFn: addLabels,
    onSuccess: (data: any) => {
      if (args.onSuccess) {
        args.onSuccess(data);
      }
    },
  });
};

const deleteLabels = async (id: string) => {
  try {
    await deleteDoc(doc(db, "labels", id));
    let q = collection(db, "labels");
    let querySnapshot = await getDocs(q);
    const fetchedLabels: labelType[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as labelType[];
    return fetchedLabels;
  } catch (error) {}
};

export const useDeleteLabels = (
  args: { onSuccess?: (data: labelType[]) => void } = {}
) => {
  return useMutation({
    mutationFn: deleteLabels,
    onSuccess: (data: any) => {
      if (args.onSuccess) {
        args.onSuccess(data);
      }
    },
  });
};

// remove or add labels

const addOrDeleteLabelToNotes = async (payload: {
  id: string;
  collectionName: string;
  label: string;
  action: boolean;
}) => {
  try {
    const id = uuidv4();
    const labelObject = { id: id, label: payload.label };

    const querySnapshotLabel = await getDocs(
      query(collection(db, "labels"), where("label", "==", payload.label))
    );

    const fetchedLabels = querySnapshotLabel.docs.map((doc) => ({
      id: doc.id,
      label: doc.data().label,
    }));

    let labelToUse: any;

    if (fetchedLabels.length > 0) {
      // If a label already exists, use the existing label
      labelToUse = fetchedLabels[0];
    } else {
      // If the label doesn't exist, create a new one
      await setDoc(doc(db, "labels", id), labelObject);
      const getLabel = await getDoc(doc(db, "labels", id));
      labelToUse = getLabel.data(); // Use the newly created label
    }

    // Fetch the note to which the label should be added/removed
    const noteToArchive = await getDoc(
      doc(db, payload.collectionName, payload.id)
    );

    if (noteToArchive.exists()) {
      const noteData = noteToArchive.data();

      if (payload.action) {
        // If action is true, add the label
        // Check if the label is already associated with the note
        if (
          !noteData.labels.some(
            (label: { label: any }) => label.label === labelToUse.label
          )
        ) {
          await updateDoc(doc(db, payload.collectionName, payload.id), {
            ...noteData,
            labels: [...(noteData.labels || []), labelToUse], // Add the label
          });
        }
      } else {
        // If action is false, remove the label
        const updatedLabels = noteData.labels.filter(
          (label: { label: any }) => label.label !== labelToUse.label
        );
        await updateDoc(doc(db, payload.collectionName, payload.id), {
          ...noteData,
          labels: updatedLabels, // Update the labels to remove the specified label
        });
      }
    }

    // Fetch updated notes if needed
    const q = collection(db, payload.collectionName);
    const querySnapshot = await getDocs(q);
    const fetchedNotes = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return fetchedNotes;
  } catch (error) {
    console.error("Error updating labels:", error);
    throw error;
  }
};

export const useAddOrDeleteLabelToNotes = (
  args: { onSuccess?: (data: NoteType[]) => void } = {}
) => {
  return useMutation({
    mutationFn: addOrDeleteLabelToNotes,
    onSuccess: (data: any) => {
      if (args.onSuccess) {
        args.onSuccess(data);
      }
    },
  });
};
