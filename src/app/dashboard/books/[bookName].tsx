import { useRouter } from 'next/router';
import { Input } from "@/components/ui/input"
import { GnovistarSidebar } from "../components/Sidebar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function BookDetails() {
  const router = useRouter();
  const { bookName } = router.query;
  console.log(bookName)



  return (
    <GnovistarSidebar>
      <div className="flex flex-1">
        <div className="p-2 md:p-10 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full overflow-y-auto">
          <div className="p-4 md:p-10 grow overflow-y-auto">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">{bookName}</h1>
              <Button className="border-0" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Page
              </Button>
            </div>
            <p className="text-lg text-muted-foreground mb-8">This is a
  book named <span className="text-blue-500">{bookName}</span>. You can add, interact, scribble and compile all of your study materials within a book with AI by your side.</p>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder="Search your book pages"
                    className="w-full border-0 dark:bg-neutral-800"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols
              -3 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((page) => (
                  
                  <div
                    key={page}
                    className="p-4 rounded shadow dark:bg-neutral-800 relative cursor-pointer hover:shadow-lg transition-shadow duration-300"
                    onClick={() => router.push(`/dashboard/books/${bookName}/page/${page}`)}
                  >
                    <h3 className="text-lg font-semibold mb-2">Page {page}</h3>
                    <p className="text-sm text-muted-foreground">This is a sample page content.</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </GnovistarSidebar>
  );
}
