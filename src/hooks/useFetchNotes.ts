import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  DocumentData,
} from "firebase/firestore";
import { db } from "../firebase";
import { NoteType } from "../type";

type Note = NoteType;

const useFetchNotes = (collectionName: string) => {
  const [notes, setNotes] = useState<Note[]>([]);
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        let q = collection(db, collectionName);
        let querySnapshot = await getDocs(q);
        const fetchedNotes: Note[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Note[];

        setNotes(fetchedNotes);
      } catch (err) {
        console.error("Error fetching notes:", err);
      }
    };

    fetchNotes();
  }, [collectionName]);

  return { notes };
};

export default useFetchNotes;
