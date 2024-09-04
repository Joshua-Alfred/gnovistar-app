export interface Book {
  id: string,
  title: string,
  description: string,
  purpose: string,
  pages: BookPage[]
}
export type PageType = "notes" | "pdf";

export interface BookPage {
  id: string,
  type: PageType, // Could be 'video' 'pdf' or 'notes' for now 
  img?: string, // thumbnail img ?
  content?: string // idk 
}