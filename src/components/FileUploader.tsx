import { useState } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { parseFile } from '../utils/fileParser';

interface FileUploaderProps {
  onFileUpload: (data: any[], fileName: string) => void;
}

export default function FileUploader({ onFileUpload }: FileUploaderProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFile = async (file: File) => {
    setError('');
    setIsLoading(true);

    try {
      const data = await parseFile(file);
      if (data.length === 0) {
        setError('File is empty or could not be parsed');
        setIsLoading(false);
        return;
      }
      onFileUpload(data, file.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse file');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    if (files?.[0]) {
      handleFile(files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.[0]) {
      handleFile(files[0]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative rounded-lg border-2 border-dashed transition-all ${
          isDragActive
            ? 'border-blue-600 bg-blue-50'
            : 'border-gray-300 bg-white hover:border-blue-400'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input
          type="file"
          accept=".csv,.json"
          onChange={handleInputChange}
          disabled={isLoading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />

        <div className="flex flex-col items-center justify-center px-8 py-16">
          <Upload className="w-12 h-12 text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {isLoading ? 'Processing file...' : 'Upload your file'}
          </h3>
          <p className="text-gray-600 text-center mb-4">
            Drag and drop your CSV or JSON file here, or click to select
          </p>
          <p className="text-sm text-gray-500">Supported formats: CSV, JSON</p>
        </div>
      </div>

      {error && (
        <div className="mt-6 flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-900">Error</h4>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
