import { useRef, useState } from 'react';
import { useStore } from '../store';
import type { Document } from '../types';
import { Upload, X, FileText, Image, File } from 'lucide-react';

function fileIcon(doc: Document) {
  if (doc.type === 'pdf') return <FileText size={14} className="text-red-400 flex-shrink-0" />;
  if (doc.type === 'image') return <Image size={14} className="text-blue-400 flex-shrink-0" />;
  return <File size={14} className="text-slate-400 flex-shrink-0" />;
}

export function DocumentViewer() {
  const { documents, addDocument, removeDocument } = useStore();
  const [selected, setSelected] = useState<Document | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function loadFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      const isImage = file.type.startsWith('image/');
      const url = URL.createObjectURL(file);
      addDocument({
        id: `doc_${Date.now()}_${Math.random()}`,
        name: file.name,
        type: isPdf ? 'pdf' : isImage ? 'image' : 'pdf',
        dataUrl: url,
      });
    });
  }

  return (
    <div className="flex h-full gap-4">
      <div className="w-52 flex flex-col gap-3">

        {/* Upload button — most reliable method */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-lg w-full">
          <Upload size={16} /> Upload File
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="*/*"
          style={{ display: 'none' }}
          onChange={(e) => loadFiles(e.target.files)}
        />

        {/* Drag zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); loadFiles(e.dataTransfer.files); }}
          className={`border-2 border-dashed rounded-lg p-3 text-center text-xs transition-colors ${dragging ? 'border-blue-400 bg-blue-500/10 text-blue-300' : 'border-slate-600 text-slate-500'}`}>
          or drag & drop here
        </div>

        {/* File list */}
        <div className="flex-1 overflow-auto space-y-1">
          {documents.map((doc) => (
            <div key={doc.id}
              onClick={() => setSelected(doc)}
              className={`flex items-center gap-2 px-2 py-2 rounded cursor-pointer text-xs group ${selected?.id === doc.id ? 'bg-blue-700' : 'bg-slate-800 hover:bg-slate-700'}`}>
              {fileIcon(doc)}
              <span className="truncate flex-1 text-slate-300">{doc.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeDocument(doc.id);
                  if (selected?.id === doc.id) setSelected(null);
                }}
                className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 flex-shrink-0">
                <X size={12} />
              </button>
            </div>
          ))}
          {documents.length === 0 && (
            <p className="text-slate-600 text-center mt-6 text-xs">No documents yet</p>
          )}
        </div>
      </div>

      {/* Viewer */}
      <div className="flex-1 bg-slate-800 rounded-lg overflow-hidden flex items-center justify-center">
        {selected ? (
          selected.type === 'image' ? (
            <img src={selected.dataUrl} alt={selected.name}
              className="max-w-full max-h-full object-contain" />
          ) : (
            <embed
              src={selected.dataUrl}
              type="application/pdf"
              className="w-full h-full"
            />
          )
        ) : (
          <div className="text-center text-slate-600">
            <FileText size={48} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Select a file to preview</p>
          </div>
        )}
      </div>
    </div>
  );
}
