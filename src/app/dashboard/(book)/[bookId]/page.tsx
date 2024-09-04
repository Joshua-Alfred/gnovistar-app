"use client"
import { Button } from '@/components/ui/button'; 
import { Plus, LoaderCircle, FileText, Video, BookIcon } from 'lucide-react'; 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Book } from '@/types/book';
import { PageType } from '@/types/book';
import { BookPage } from '@/types/book';
import { createPage, getPages } from '../../actions';
import { Checkbox } from '@/components/ui/checkbox';
import { DeleteModal } from '../../components/DeleteModal';
import { Card, CardContent } from '@/components/ui/card';

const dummyBookData = {
  id: "randomString1",
  title: "Topology",
  description: "Math is very fun and it's so cool, oh my god.",
  purpose: "Education",
  pages: [
    {
      id: "someString1",
      type: "notes" as PageType,  // pdf, notebook, or video
      img: "", // depends on page type
      content: "" // actual data of what is contained inside the page
    }
  ],
}
export default function Book({ params }: { params: { bookId: string } }) {
  // get the bookPages from current book and save it into state
  // when a page is appended or removed in the db, add or remove the page from the view
  const [selectedPages, setSelectedPages] = useState<BookPage['id'][]>([]) // state to store selected pages (to be used for deletion )
  const [bookData, setBookData] = useState<Book>(dummyBookData)
  const [bookPagesData, setBookPagesData] = useState<BookPage[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const router = useRouter()
  const bookId = "t2kT4B1E4guKlBcUYrRX"
  useEffect(() => {
    // const bookId = params.bookId
    const fetchPages = async () => {
      try {
        const pages = await getPages(bookId);
        if (pages) {
          setBookPagesData(pages);
        }
      } catch (error) {
        console.error("Error fetching pages:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPages()
  }, [])

  const toggleSelectPage = (pageId: string) => {
    setSelectedPages(prevSelected =>
      prevSelected.includes(pageId)
        ? prevSelected.filter(id => id !== pageId)
        : [...prevSelected, pageId]
    );
  };


  const handlePageClick = (page:BookPage) => {
    // determine what page it is and reroute them to correct page display
    // pdf page or note page
    if (page.type == "notes") {
      router.push(`/dashboard/${params.bookId}/${page.id}`)
    } else if (page.type == "pdf") {
      // handle when user clicks on a pdf type page
      router.push(`/dashboard/${params.bookId}/pdf/${page.id}`)
    }
  
  }
  const handlePdfClick = () => {
    // handle pdf page creation

  }
  const handleNoteClick = async () => {
    // handle note creation and save to database 
    const bookId = "t2kT4B1E4guKlBcUYrRX"
    // const bookId = params.bookId
    const newPage = {
      type: "notes"
    } as BookPage;
    await createPage(bookId, newPage)
    setBookPagesData([...bookPagesData, newPage]);
  }
  const handleVideoClick = () => {
    
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">{dummyBookData.title}</h1>
        <div className="flex gap-2">
          <DeleteModal 
            bookId={bookId} 
            selectedPages={selectedPages} 
            setSelectedPages={setSelectedPages} 
            setBookPagesData={setBookPagesData}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Page
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='border-0 bg-background'>
              <DropdownMenuItem onClick={handlePdfClick}>
                <FileText className="mr-2 h-4 w-4" />
                PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleNoteClick}>
                <BookIcon className="mr-2 h-4 w-4" />
                Notes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleVideoClick}>
                <Video className="mr-2 h-4 w-4" />
                Video
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <p className="text-lg text-muted-foreground mb-8">{dummyBookData.description}</p>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <LoaderCircle className="w-12 h-12 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {bookPagesData.map((page, idx) => (
            <Card 
              key={idx} 
              className="relative cursor-pointer hover:shadow-lg transition-shadow duration-300"
              onClick={() => handlePageClick(page)}
            >
              <CardContent className="p-6 flex flex-col items-center justify-center h-[300px]">
                {page.type === "notes" ? (
                  <BookIcon className="w-16 h-16 mb-4 text-primary" />
                ) : (
                  <FileText className="w-16 h-16 mb-4 text-primary" />
                )}
                <span className="text-lg font-medium">
                  {page.type === "notes" ? "Notes" : "PDF"}
                </span>
                <Checkbox
                  checked={selectedPages.includes(page.id)}
                  onCheckedChange={() => toggleSelectPage(page.id)}
                  className="absolute top-4 left-4"
                  onClick={(e) => e.stopPropagation()}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
