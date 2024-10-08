import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

type Note = {
  id: string;
  title: string;
  text: string;
};



const useFetchNotes = (collectionName: string ) => {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const fetchNotes = async () => {
  
      try {
        let q = collection(db, collectionName);
        const querySnapshot = await getDocs(q);
        const fetchedNotes: Note[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Note[];

        setNotes(fetchedNotes);
    
      } catch (err) {
        console.error('Error fetching notes:', err);
      }
    };

    fetchNotes();
    console.log(collectionName);
    
  }, [collectionName]);

  return { notes };
};

export default useFetchNotes;
