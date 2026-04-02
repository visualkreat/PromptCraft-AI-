import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface FileUploadProps {
  label: string;
  description?: string;
  onFileSelect: (files: File[]) => void;
  files: File[];
  maxFiles?: number;
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  description,
  onFileSelect,
  files,
  maxFiles = 1,
  className
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFileSelect(acceptedFiles);
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: maxFiles > 1
  } as any);

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    onFileSelect(newFiles);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium text-zinc-700">{label}</label>
      {description && <p className="text-xs text-zinc-500">{description}</p>}
      
      <div
        {...getRootProps()}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-4 transition-all cursor-pointer",
          "flex flex-col items-center justify-center gap-2 min-h-[100px]",
          isDragActive ? "border-zinc-900 bg-zinc-50" : "border-zinc-200 hover:border-zinc-400",
          files.length >= maxFiles && "opacity-50 pointer-events-none"
        )}
      >
        <input {...getInputProps()} />
        <Upload className="w-5 h-5 text-zinc-400" />
        <span className="text-xs text-zinc-500">
          {isDragActive ? "Drop here" : "Click or drag to upload"}
        </span>
      </div>

      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {files.map((file, idx) => (
            <div key={idx} className="relative group">
              <div className="w-16 h-16 rounded-lg overflow-hidden border border-zinc-200 bg-zinc-50 flex items-center justify-center">
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <button
                onClick={() => removeFile(idx)}
                className="absolute -top-1 -right-1 bg-white border border-zinc-200 rounded-full p-0.5 shadow-sm hover:bg-zinc-50 transition-colors"
              >
                <X className="w-3 h-3 text-zinc-600" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
