'use client'
import Tiptap from "@/app/dashboard/components/Tiptap"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getNotes, createNotes } from "@/app/dashboard/actions"
import { useUser } from "@clerk/nextjs"

export default function NotePage({ params }: { params: { pageId: string, bookId: string } }) {
  const { user } = useUser()

  const [noteContent, setNoteContent] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  // This is going to be an editable page
  // Fetches notes from the database and render it out in TipTap editor as content
  // If no notes in the database then just render out a default tip tap editor
  // done using html contenteditable which allows us to edit the input of html elements
  const router = useRouter()
  const bookId = "t2kT4B1E4guKlBcUYrRX"
  
  useEffect(() => {
    // change to params.bookId

    const fetchNotes = async () => {
      try {
        const notes = await getNotes(bookId, params.pageId)
        setNoteContent(notes)
      } catch(error) {
        throw new Error("Error getting the notes from database")
      } finally {
        setIsLoading(false)
      }
    }

    fetchNotes()
  }, [])

  const handleBackClick = () => {
    router.back()
  }
  return (
    <>
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" className="mr-4" onClick={handleBackClick}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>
      <div className="card">
        {!isLoading && <Tiptap currentBook={bookId} currentPage={params.pageId} noteContent={noteContent} setNoteContent={setNoteContent}/>}
      </div>
    </>
  )
}