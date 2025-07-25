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
				},
				link: false // Disable default link extension
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
		shouldRerenderOnTransaction: false, // TipTap v3 equivalent of immediatelyRender: false
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML());
		},
		editorProps: {
			attributes: {
				class: `prose prose-sm sm:prose-lg prose-invert max-w-none focus:outline-none min-h-[200px] p-4 text-white ${className} prose-headings:text-white prose-p:text-gray-200 prose-strong:text-white prose-em:text-gray-200 prose-blockquote:text-gray-300 prose-blockquote:border-l-[#70C7BA] prose-code:text-[#49EACB] prose-pre:bg-slate-800 prose-pre:text-gray-200 prose-li:text-gray-200 prose-ul:text-gray-200 prose-ol:text-gray-200 prose-a:text-[#70C7BA] prose-a:no-underline hover:prose-a:underline`
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
		<div className="border border-[#70C7BA]/30 rounded-lg overflow-hidden bg-slate-800/50 backdrop-blur-sm">
			{editable && (
				<div className="border-b border-[#70C7BA]/20 bg-slate-800/80 p-2">
					<div className="flex flex-wrap gap-1">
						{/* Text Formatting */}
						<Button
							variant="ghost"
							size="sm"
							onClick={() => editor.chain().focus().toggleBold().run()}
							disabled={!editor.can().chain().focus().toggleBold().run()}
							className={`${editor.isActive('bold') ? 'bg-[#70C7BA]/20 text-[#70C7BA]' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
						>
							<Bold className="h-4 w-4" />
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => editor.chain().focus().toggleItalic().run()}
							disabled={!editor.can().chain().focus().toggleItalic().run()}
							className={`${editor.isActive('italic') ? 'bg-[#70C7BA]/20 text-[#70C7BA]' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
						>
							<Italic className="h-4 w-4" />
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => editor.chain().focus().toggleStrike().run()}
							disabled={!editor.can().chain().focus().toggleStrike().run()}
							className={`${editor.isActive('strike') ? 'bg-[#70C7BA]/20 text-[#70C7BA]' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
						>
							<Strikethrough className="h-4 w-4" />
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => editor.chain().focus().toggleCode().run()}
							disabled={!editor.can().chain().focus().toggleCode().run()}
							className={`${editor.isActive('code') ? 'bg-[#70C7BA]/20 text-[#70C7BA]' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
						>
							<Code className="h-4 w-4" />
						</Button>

						<Separator orientation="vertical" className="h-6 bg-gray-600" />

						{/* Headings */}
						<Button
							variant="ghost"
							size="sm"
							onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
							className={`${editor.isActive('heading', { level: 1 }) ? 'bg-[#70C7BA]/20 text-[#70C7BA]' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
						>
							<Heading1 className="h-4 w-4" />
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
							className={`${editor.isActive('heading', { level: 2 }) ? 'bg-[#70C7BA]/20 text-[#70C7BA]' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
						>
							<Heading2 className="h-4 w-4" />
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
							className={`${editor.isActive('heading', { level: 3 }) ? 'bg-[#70C7BA]/20 text-[#70C7BA]' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
						>
							<Heading3 className="h-4 w-4" />
						</Button>

						<Separator orientation="vertical" className="h-6 bg-gray-600" />

						{/* Lists */}
						<Button
							variant="ghost"
							size="sm"
							onClick={() => editor.chain().focus().toggleBulletList().run()}
							className={`${editor.isActive('bulletList') ? 'bg-[#70C7BA]/20 text-[#70C7BA]' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
						>
							<List className="h-4 w-4" />
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => editor.chain().focus().toggleOrderedList().run()}
							className={`${editor.isActive('orderedList') ? 'bg-[#70C7BA]/20 text-[#70C7BA]' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
						>
							<ListOrdered className="h-4 w-4" />
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => editor.chain().focus().toggleBlockquote().run()}
							className={`${editor.isActive('blockquote') ? 'bg-[#70C7BA]/20 text-[#70C7BA]' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
						>
							<Quote className="h-4 w-4" />
						</Button>

						<Separator orientation="vertical" className="h-6 bg-gray-600" />

						{/* Link */}
						<Button
							variant="ghost"
							size="sm"
							onClick={addLink}
							className={`${editor.isActive('link') ? 'bg-[#70C7BA]/20 text-[#70C7BA]' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
						>
							<LinkIcon className="h-4 w-4" />
						</Button>

						<Separator orientation="vertical" className="h-6 bg-gray-600" />

						{/* History */}
						<Button
							variant="ghost"
							size="sm"
							onClick={() => editor.chain().focus().undo().run()}
							disabled={!editor.can().chain().focus().undo().run()}
							className="text-gray-300 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<Undo className="h-4 w-4" />
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => editor.chain().focus().redo().run()}
							disabled={!editor.can().chain().focus().redo().run()}
							className="text-gray-300 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<Redo className="h-4 w-4" />
						</Button>
					</div>
				</div>
			)}
			<EditorContent
				editor={editor}
				className="min-h-[200px] max-h-[400px] overflow-y-auto bg-slate-900/50"
			/>
			{editable && (
				<div className="border-t border-[#70C7BA]/20 bg-slate-800/50 px-4 py-2 text-xs text-gray-400">
					{placeholder}
				</div>
			)}
		</div>
	);
} 