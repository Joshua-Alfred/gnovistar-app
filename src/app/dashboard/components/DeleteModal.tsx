import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import { Book, BookPage } from "@/types/book"
import React from "react"
import { deletePagesFromBook, getPages } from "../actions"
interface DeleteModalProps {
  bookId: Book['id'],
  selectedPages: BookPage['id'][],
  setSelectedPages: React.Dispatch<React.SetStateAction<BookPage['id'][]>>
  setBookPagesData: React.Dispatch<React.SetStateAction<BookPage[]>>
}
export function DeleteModal({bookId, selectedPages, setSelectedPages, setBookPagesData}:DeleteModalProps) {
  const onSubmit =  async () => {
    await deletePagesFromBook(bookId, selectedPages)
    const updatedPages = await getPages(bookId)
    setSelectedPages([])
    setBookPagesData(updatedPages)
    DialogClose
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          disabled={selectedPages.length == 0} 
          variant="destructive" 
          className="disabled:opacity-55 disabled:text-white text-white bg-red-500 hover:bg-red-500/90 hover:text-white dark:bg-red-400 dark:hover:bg-red-400/80"
          >
            Delete
          </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete {selectedPages.length} pages</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the pages and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>
            <Button variant={"outline"}>No</Button>
          </DialogClose>
          <DialogClose>
            <Button type="submit" onClick={onSubmit}>Yes</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
