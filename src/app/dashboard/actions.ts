'use server'

import { Book, BookPage } from "@/types/book"
import { doc, getDocs, collection, addDoc, getDoc, setDoc, arrayUnion, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { auth } from '@clerk/nextjs/server'

const userId = "8m3thR6fquxAqJ8o5v6F"

export const getNotes = async (bookId: Book["id"], pageId: BookPage["id"]) => {
  // const { userId } = auth()
  if (!userId) {
    throw new Error('You must be signed in!')
  }
  try {
    const bookRef = doc(db, `users/${userId}/books/${bookId}`);
    
    const bookDoc = await getDoc(bookRef);

    if (!bookDoc.exists()) {
      throw new Error('Book does not exist!');
    }
  
    const bookData = bookDoc.data();
    
    const selectedPage = bookData.pages.filter((page:BookPage) => {
      page.id == pageId
    })

    const notes = selectedPage.content || ""
  
    console.log(notes);
    return notes
  } catch (error) {
    console.error("Error fetching notes: ", error);
    throw new Error("Error fetching notes");
  }
};
export const createNotes = async (
  bookId: Book["id"],
  pageId: BookPage["id"],
  content: string
) => {
  // const { userId } = auth()
  if (!userId) {
    throw new Error('You must be signed in!')
  }
  try {
    const notesRef = collection(db, `users/${userId}/books/${bookId}`);
    

    
  } catch (error) {
    console.error("Error creating note: ", error);
    throw new Error("Error creating note");
  }
};


export const getPages = async (bookId: Book['id']) => {
  // const { userId } = auth();
  if (!userId) {
    throw new Error('You must be signed in!');
  }

  const bookRef = doc(db, `users/${userId}/books/${bookId}`);
  const bookDoc = await getDoc(bookRef);

  if (!bookDoc.exists()) {
    throw new Error('Book does not exist!');
  }

  const bookData = bookDoc.data();
  
  if (!bookData?.pages) {
    return
  } else {
    return bookData.pages
  }

};

export const createPage = async (bookId: Book['id'], pageContent: BookPage) => {
  // const { userId } = auth();
  if (!userId) {
    throw new Error('You must be signed in!');
  }

  const bookRef = doc(db, `users/${userId}/books/${bookId}`);
  const bookDoc = await getDoc(bookRef);
  
  if (!bookDoc.exists()) {
    throw new Error('Book does not exist!');
  }

  const currentPages = bookDoc.data().pages || [];

  // this is solely for id generation
  const pagesCollectionRef = collection(db, `pages`);
  const newPageId = doc(pagesCollectionRef).id;

  const newPage = { ...pageContent, id: newPageId };

  const updatedPages = [...currentPages, newPage];

  await updateDoc(bookRef, {
    pages: updatedPages,
  });
};