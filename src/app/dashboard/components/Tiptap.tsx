'use client'

import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Button } from '@/components/ui/button'
import { Bold, Italic, Code, List, Heading1, Heading2, ChevronLeft } from 'lucide-react'
import { useDebounce } from 'use-debounce';

import { Editor } from '@tiptap/react'
import { Indent } from '@/lib/extensions/Indent'
import React, { useEffect } from 'react'
import { createNotes } from '../actions'
import { Book, BookPage } from '@/types/book'

interface MenuBarProps {
  editor: Editor | null
}
interface TipTapProps{
  noteContent: string,
  setNoteContent: React.Dispatch<React.SetStateAction<string>>
  currentBook: Book['id'],
  currentPage: BookPage['id'],
}
const MenuBar = ({ editor }:MenuBarProps) => {
  if (!editor) {
    return null
  }
  return (
    <div className="flex items-center space-x-2 mb-4 text-gray-500">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-accent text-white' : ''}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-accent text-white' : ''}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={editor.isActive('code') ? 'bg-accent text-white' : ''}
        >
          <Code className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-accent text-white' : ''}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'bg-accent text-white' : ''}
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'bg-accent text-white' : ''}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
      </div>
  )

}
const Tiptap = ({currentBook, currentPage, noteContent, setNoteContent}:TipTapProps) => {
  const [debouncedContent] = useDebounce(noteContent, 1000)
  const editor = useEditor({
    extensions: [StarterKit, Indent],
    content: `${noteContent == "" 
      ? 
      `<h1>
        Type here...
      </h1>`
      : noteContent}
    `,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl my-5 focus:outline-none',
      },
    },
    immediatelyRender: false,
    onUpdate: () => {
      const content = editor?.getHTML() as string
      setNoteContent(content)
    }
  })
  useEffect(() => {

    const saveContents = async () => {
      if (debouncedContent) {
        console.log('Saving debounced content:', debouncedContent);
        await createNotes(currentBook, currentPage, debouncedContent)
      }
    }
    saveContents()
    
  }, [debouncedContent]);

  if (!editor) {
    return null
  }
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <MenuBar editor={editor}/>
      {editor && (
        <FloatingMenu
          editor={editor}
          tippyOptions={{ duration: 100 }}
          className="bg-white rounded-md shadow-lg border border-gray-200 p-1 flex items-center space-x-1"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}
          >
            <Heading1 className="h-4 w-4 text-black" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}
          >
            <Heading2 className="h-4 w-4 text-black" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'bg-gray-200' : ''}
          >
            <List className="h-4 w-4 text-black" />
          </Button>
        </FloatingMenu>
      )}
      <EditorContent editor={editor} className="border-l-4 border-transparent focus-within:border-gray-200 pl-4 transition-all duration-200" />
    </div>
  )
}

export default Tiptap
