import { useCallback, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | File[]) {
    Array.from(files).forEach((file) => {
      const isPdf = file.type.includes('pdf') || file.name.toLowerCase().endsWith('.pdf');
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

  const onDrop = useCallback((acceptedFiles: File[]) => {
    handleFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    noClick: true,
  });

  return (
    <div className="flex h-full gap-4">
      <div className="w-48 flex flex-col gap-2">
        {/* Drop zone */}
        <div {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-3 text-center transition-colors ${isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-slate-600'}`}>
          <input {...getInputProps()} />
          <Upload size={20} className="mx-auto text-slate-500 mb-1" />
          <p className="text-xs text-slate-500 mb-2">Drag & drop files here</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs py-1.5 rounded">
            Browse files
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
        </div>

        <div className="flex-1 overflow-auto space-y-1">
          {documents.map((doc) => (
            <div key={doc.id}
              onClick={() => setSelected(doc)}
              className={`flex items-center gap-2 px-2 py-2 rounded cursor-pointer text-xs group ${selected?.id === doc.id ? 'bg-blue-700' : 'bg-slate-800 hover:bg-slate-700'}`}>
              {fileIcon(doc)}
              <span className="truncate flex-1 text-slate-300">{doc.name}</span>
              <button onClick={(e) => { e.stopPropagation(); removeDocument(doc.id); if (selected?.id === doc.id) setSelected(null); }}
                className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 flex-shrink-0">
                <X size={12} />
              </button>
            </div>
          ))}
          {documents.length === 0 && (
            <p className="text-xs text-slate-600 text-center mt-4">No documents uploaded</p>
          )}
        </div>
      </div>

      <div className="flex-1 bg-slate-800 rounded-lg overflow-hidden flex items-center justify-center">
        {selected ? (
          selected.type === 'pdf' ? (
            <iframe src={selected.dataUrl} className="w-full h-full" title={selected.name} />
          ) : (
            <img src={selected.dataUrl} alt={selected.name} className="max-w-full max-h-full object-contain" />
          )
        ) : (
          <div className="text-center text-slate-600">
            <FileText size={48} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Upload and select a document to view</p>
          </div>
        )}
      </div>
    </div>
  );
}
