'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import {
	Bold,
	Italic,
	Strikethrough,
	Code,
	Heading1,
	Heading2,
	Heading3,
	List,
	ListOrdered,
	Quote,
	Link as LinkIcon,
	Undo,
	Redo
} from 'lucide-react';
import { useCallback } from 'react';

interface RichTextEditorProps {
	content: string;
	onChange: (content: string) => void;
	placeholder?: string;
	editable?: boolean;
	className?: string;
}

export function RichTextEditor({
	content,
	onChange,
	placeholder = 'Write something amazing...',
	editable = true,
	className = ''
}: RichTextEditorProps) {
	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				heading: {
					levels: [1, 2, 3]
				}
			}),
			Link.configure({
				openOnClick: false,
				HTMLAttributes: {
					class: 'text-primary underline cursor-pointer'
				}
			})
		],
		content,
		editable,
		immediatelyRender: false, // Fix SSR hydration mismatch
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML());
		},
		editorProps: {
			attributes: {
				class: `prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4 ${className}`
			}
		}
	});

	const addLink = useCallback(() => {
		const previousUrl = editor?.getAttributes('link').href;
		const url = window.prompt('URL', previousUrl);

		// cancelled
		if (url === null) {
			return;
		}

		// empty
		if (url === '') {
			editor?.chain().focus().extendMarkRange('link').unsetLink().run();
			return;
		}

		// update link
		editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
	}, [editor]);

	if (!editor) {
		return null;
	}

	return (
		<div className="border rounded-lg overflow-hidden">
			{editable && (
				<div className="border-b bg-muted/50 p-2">
					<div className="flex flex-wrap gap-1">
						{/* Text Formatting */}
						<Button
							variant="ghost"
							size="sm"
							onClick={() => editor.chain().focus().toggleBold().run()}
							disabled={!editor.can().chain().focus().toggleBold().run()}
							className={editor.isActive('bold') ? 'bg-muted' : ''}
						>
							<Bold className="h-4 w-4" />
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => editor.chain().focus().toggleItalic().run()}
							disabled={!editor.can().chain().focus().toggleItalic().run()}
							className={editor.isActive('italic') ? 'bg-muted' : ''}
						>
							<Italic className="h-4 w-4" />
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => editor.chain().focus().toggleStrike().run()}
							disabled={!editor.can().chain().focus().toggleStrike().run()}
							className={editor.isActive('strike') ? 'bg-muted' : ''}
						>
							<Strikethrough className="h-4 w-4" />
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => editor.chain().focus().toggleCode().run()}
							disabled={!editor.can().chain().focus().toggleCode().run()}
							className={editor.isActive('code') ? 'bg-muted' : ''}
						>
							<Code className="h-4 w-4" />
						</Button>

						<Separator orientation="vertical" className="h-6" />

						{/* Headings */}
						<Button
							variant="ghost"
							size="sm"
							onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
							className={editor.isActive('heading', { level: 1 }) ? 'bg-muted' : ''}
						>
							<Heading1 className="h-4 w-4" />
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
							className={editor.isActive('heading', { level: 2 }) ? 'bg-muted' : ''}
						>
							<Heading2 className="h-4 w-4" />
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
							className={editor.isActive('heading', { level: 3 }) ? 'bg-muted' : ''}
						>
							<Heading3 className="h-4 w-4" />
						</Button>

						<Separator orientation="vertical" className="h-6" />

						{/* Lists */}
						<Button
							variant="ghost"
							size="sm"
							onClick={() => editor.chain().focus().toggleBulletList().run()}
							className={editor.isActive('bulletList') ? 'bg-muted' : ''}
						>
							<List className="h-4 w-4" />
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => editor.chain().focus().toggleOrderedList().run()}
							className={editor.isActive('orderedList') ? 'bg-muted' : ''}
						>
							<ListOrdered className="h-4 w-4" />
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => editor.chain().focus().toggleBlockquote().run()}
							className={editor.isActive('blockquote') ? 'bg-muted' : ''}
						>
							<Quote className="h-4 w-4" />
						</Button>

						<Separator orientation="vertical" className="h-6" />

						{/* Link */}
						<Button
							variant="ghost"
							size="sm"
							onClick={addLink}
							className={editor.isActive('link') ? 'bg-muted' : ''}
						>
							<LinkIcon className="h-4 w-4" />
						</Button>

						<Separator orientation="vertical" className="h-6" />

						{/* History */}
						<Button
							variant="ghost"
							size="sm"
							onClick={() => editor.chain().focus().undo().run()}
							disabled={!editor.can().chain().focus().undo().run()}
						>
							<Undo className="h-4 w-4" />
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => editor.chain().focus().redo().run()}
							disabled={!editor.can().chain().focus().redo().run()}
						>
							<Redo className="h-4 w-4" />
						</Button>
					</div>
				</div>
			)}
			<EditorContent
				editor={editor}
				className="min-h-[200px] max-h-[400px] overflow-y-auto"
			/>
			{editable && (
				<div className="border-t bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
					{placeholder}
				</div>
			)}
		</div>
	);
} 