"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { BookOpen, FileText, MoreVertical, Plus } from "lucide-react";
import Link from "next/link";
import { GnovistarSidebar } from "./components/Sidebar";
import { useAuth } from "@clerk/nextjs";
import {
  getDoc,
  doc,
  updateDoc,
  deleteField,
  collection,
  getDocs,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/firebase";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

type BookData = {
  id: string;
  name: string;
};

const dummyBookData = [
  {
    bookId: "randomString1",
    bookTitle: "Topology",
    bookDescription: "Math is very fun and it's so cool, oh my god.",
    bookPurpose: "Education",
    bookPages: [],
  },
  {
    bookId: "randomString2",
    bookTitle: "Algebra",
    bookDescription: "An interesting journey into abstract structures.",
    bookPurpose: "Study",
    bookPages: [],
  },
  {
    bookId: "randomString3",
    bookTitle: "Calculus",
    bookDescription: "Understanding the change and motion in mathematics.",
    bookPurpose: "Research",
    bookPages: [],
  },
];
export default function Dashboard() {
  const [books, setBooks] = useState<BookData[]>([]);
  const [renameBookId, setRenameBookId] = useState<string | null>(null);
  const [newBookName, setNewBookName] = useState("");
  const [deleteBookId, setDeleteBookId] = useState<string | null>(null);
  const [loadingRename, setLoadingRename] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const { userId } = useAuth();

  useEffect(() => {
    if (userId) {
      const fetchBooks = async () => {
        try {
          const userDocRef = doc(db, "users", userId);
          const userDocSnap = await getDoc(userDocRef);

          const data = userDocSnap.data();
          if (data) {
            const booksArray = data.books || [];
            const booksData = booksArray.map(
              (bookName: string, index: number) => ({
                id: index.toString(),
                name: bookName,
              })
            );
            setBooks(booksData);
          }
        } catch (error) {
          console.error("Error fetching books:", error);
        }
      };

      fetchBooks();
    }
  }, [userId]);

  const handleRename = async () => {
    if (userId && renameBookId && newBookName) {
      setLoadingRename(true);
      try {
        const userDocRef = doc(db, "users", userId);
        const userDocSnap = await getDoc(userDocRef);
        const data = userDocSnap.data();
        if (data) {
          const booksArray = data.books || [];
          const oldBookName = books[parseInt(renameBookId)].name;
          const bookIndex = booksArray.findIndex(
            (bookName: string) => bookName === oldBookName
          );

          if (bookIndex !== -1) {
            // Update book name in the books array
            booksArray[bookIndex] = newBookName;
            await updateDoc(userDocRef, { books: booksArray });

            // Transfer contents from old subcollection to new subcollection
            const oldSubcollectionRef = collection(userDocRef, oldBookName);
            const newSubcollectionRef = collection(userDocRef, newBookName);

            // Get all documents from the old subcollection
            const oldSubcollectionSnap = await getDocs(oldSubcollectionRef);
            const batch = writeBatch(db);

            oldSubcollectionSnap.forEach((docSnap) => {
              const docData = docSnap.data();
              // Set data in the new subcollection
              const newDocRef = doc(newSubcollectionRef, docSnap.id);
              batch.set(newDocRef, docData);
            });

            // Commit the batch
            await batch.commit();

            oldSubcollectionSnap.forEach(async (doc) => {
              await deleteDoc(doc.ref);
            });
          }
        }
        setRenameBookId(null);
        setNewBookName("");
        window.location.reload();
        setLoadingRename(false);
      } catch (error) {
        console.error("Error renaming book:", error);
      }
    }
  };

  const handleDelete = async () => {
    if (userId && deleteBookId) {
      setLoadingDelete(true);
      try {
        const userDocRef = doc(db, "users", userId);
        const userDocSnap = await getDoc(userDocRef);
        const data = userDocSnap.data();

        if (data) {
          const booksArray = data.books || [];
          const bookNameToDelete = books[parseInt(deleteBookId)].name;

          const bookSubcollectionRef = collection(userDocRef, bookNameToDelete);
          const bookSubcollectionSnapshot = await getDocs(bookSubcollectionRef);

          const deletePromises = bookSubcollectionSnapshot.docs.map((doc) =>
            deleteDoc(doc.ref)
          );
          await Promise.all(deletePromises);

          const updatedBooksArray = booksArray.filter(
            (bookName: string) => bookName !== bookNameToDelete
          );

          await updateDoc(userDocRef, { books: updatedBooksArray });
        }

        setDeleteBookId(null);
        window.location.reload();
        setLoadingDelete(false);
      } catch (error) {
        console.error("Error deleting book:", error);
      }
    }
  };

  return (
    <>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search your books"
          className="w-full border-0 dark:bg-neutral-800"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map((book) => (
          <div
            key={book.id}
            className="p-4 rounded shadow dark:bg-neutral-800 relative"
          >
            <FileText className="h-8 w-8 mb-2" />
            <h3 className="text-lg font-semibold mb-2">{book.name}</h3>
            <Link href={`dashboard/books/${book.name}`}>
              <Button variant="outline" className="border-0 w-full">
                Open
              </Button>
            </Link>

            {/* 3-dot settings menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="absolute top-2 right-2">
                  <MoreVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => {
                    setRenameBookId(book.id);
                    setNewBookName(book.name);
                  }}
                >
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDeleteBookId(book.id)}>
                  Delete
                </DropdownMenuItem>
                <DropdownMenuItem disabled>Share</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>

      {/* Rename Modal */}
      {renameBookId && (
        <Dialog open onOpenChange={() => setRenameBookId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rename Book</DialogTitle>
            </DialogHeader>
            <Input
              value={newBookName}
              onChange={(e) => setNewBookName(e.target.value)}
            />
            <DialogFooter>
              <Button onClick={() => setRenameBookId(null)}>Cancel</Button>
              <Button onClick={handleRename}>Submit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Modal */}
      {deleteBookId && (
        <Dialog open onOpenChange={() => setDeleteBookId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Book</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this book? This action cannot be
                undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => setDeleteBookId(null)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
