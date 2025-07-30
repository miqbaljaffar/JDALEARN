'use client';

import { type Editor } from '@tiptap/react';
import {
  Bold,
  Strikethrough,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Underline,
  Quote,
  Undo,
  Redo,
  Code,
} from 'lucide-react';

type Props = {
  editor: Editor | null;
};

export function Toolbar({ editor }: Props) {
  if (!editor) {
    return null;
  }

  return (
    <div
      className="px-4 py-3 rounded-tl-md rounded-tr-md flex justify-start items-center gap-5 w-full flex-wrap border-b border-gray-200"
    >
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBold().run();
        }}
        className={
          editor.isActive('bold')
            ? 'bg-sky-700 text-white p-2 rounded-lg'
            : 'text-sky-400'
        }
      >
        <Bold className="w-5 h-5" />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleItalic().run();
        }}
        className={
          editor.isActive('italic')
            ? 'bg-sky-700 text-white p-2 rounded-lg'
            : 'text-sky-400'
        }
      >
        <Italic className="w-5 h-5" />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleUnderline().run();
        }}
        className={
          editor.isActive('underline')
            ? 'bg-sky-700 text-white p-2 rounded-lg'
            : 'text-sky-400'
        }
      >
        <Underline className="w-5 h-5" />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleStrike().run();
        }}
        className={
          editor.isActive('strike')
            ? 'bg-sky-700 text-white p-2 rounded-lg'
            : 'text-sky-400'
        }
      >
        <Strikethrough className="w-5 h-5" />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleHeading({ level: 2 }).run();
        }}
        className={
          editor.isActive('heading', { level: 2 })
            ? 'bg-sky-700 text-white p-2 rounded-lg'
            : 'text-sky-400'
        }
      >
        <Heading2 className="w-5 h-5" />
      </button>

      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBulletList().run();
        }}
        className={
          editor.isActive('bulletList')
            ? 'bg-sky-700 text-white p-2 rounded-lg'
            : 'text-sky-400'
        }
      >
        <List className="w-5 h-5" />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleOrderedList().run();
        }}
        className={
          editor.isActive('orderedList')
            ? 'bg-sky-700 text-white p-2 rounded-lg'
            : 'text-sky-400'
        }
      >
        <ListOrdered className="w-5 h-5" />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBlockquote().run();
        }}
        className={
          editor.isActive('blockquote')
            ? 'bg-sky-700 text-white p-2 rounded-lg'
            : 'text-sky-400'
        }
      >
        <Quote className="w-5 h-5" />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().setCode().run();
        }}
        className={
          editor.isActive('code')
            ? 'bg-sky-700 text-white p-2 rounded-lg'
            : 'text-sky-400'
        }
      >
        <Code className="w-5 h-5" />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().undo().run();
        }}
        className={
          'text-sky-400'
        }
      >
        <Undo className="w-5 h-5" />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().redo().run();
        }}
        className={
          'text-sky-400'
        }
      >
        <Redo className="w-5 h-5" />
      </button>
    </div>
  );
}
