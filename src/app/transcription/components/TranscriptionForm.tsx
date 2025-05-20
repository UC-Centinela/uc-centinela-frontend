"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface TranscriptionResult {
  text: string;
}

// OpenAI Whisper API has a 25MB file size limit
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB in bytes

export default function TranscriptionForm() {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [transcription, setTranscription] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');
  const [isFileTooLarge, setIsFileTooLarge] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Check if the file is a video or audio file
      if (!selectedFile.type.startsWith('video/') && !selectedFile.type.startsWith('audio/')) {
        setError('Por favor selecciona un archivo de video o audio');
        setFile(null);
        setFileName('');
        setFileSize('');
        setIsFileTooLarge(false);
        return;
      }
      
      // Format file size for display
      const fileSizeMB = (selectedFile.size / (1024 * 1024)).toFixed(2);
      setFileSize(`${fileSizeMB} MB`);
      
      // Check if file exceeds size limit
      const isTooLarge = selectedFile.size > MAX_FILE_SIZE;
      setIsFileTooLarge(isTooLarge);
      
      if (isTooLarge) {
        setError(`El archivo es demasiado grande (${fileSizeMB} MB). El tamaño máximo permitido es 25 MB.`);
      } else {
        setError('');
      }
      
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Por favor selecciona un archivo para transcribir');
      return;
    }
    
    if (isFileTooLarge) {
      setError(`El archivo es demasiado grande (${fileSize}). El tamaño máximo permitido es 25 MB.`);
      return;
    }

    setIsLoading(true);
    setError('');
    setTranscription('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('language', 'es'); // Default to Spanish

      const response = await fetch('/api/transcription', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.details || 'Error al procesar la transcripción');
      }

      setTranscription(data.text);
    } catch (err) {
      console.error('Transcription error:', err);
      setError(err instanceof Error ? err.message : 'Error al procesar la transcripción');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6 p-4 bg-blue-50 rounded-md border border-blue-200">
        <h3 className="text-sm font-medium text-blue-800 mb-1">Información importante:</h3>
        <ul className="text-sm text-blue-700 list-disc pl-5 space-y-1">
          <li>El tamaño máximo de archivo permitido es <strong>25 MB</strong></li>
          <li>Formatos soportados: MP3, MP4, WAV, M4A, WEBM, MP2, AMR, FLAC</li>
          <li>Para archivos más grandes, considere recortar o comprimir el audio/video</li>
        </ul>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="file-upload" className="block text-sm font-medium">
            Archivo de Video o Audio
          </label>
          
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              id="file-upload"
              type="file"
              accept="video/*,audio/*"
              onChange={handleFileChange}
              className="hidden"
              ref={fileInputRef}
            />
            
            {!fileName ? (
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">
                  Arrastra y suelta un archivo o
                </p>
                <Button 
                  type="button" 
                  onClick={handleBrowseClick}
                  variant="outline"
                >
                  Seleccionar Archivo
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-sm text-gray-900 font-medium mb-1">{fileName}</p>
                {fileSize && (
                  <p className={`text-xs ${isFileTooLarge ? 'text-red-500 font-medium' : 'text-gray-500'} mb-1`}>
                    {fileSize} {isFileTooLarge && '(excede el límite de 25 MB)'}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  <Button 
                    type="button" 
                    onClick={handleBrowseClick} 
                    variant="link" 
                    className="p-0 h-auto text-xs"
                  >
                    Cambiar archivo
                  </Button>
                </p>
              </div>
            )}
          </div>
          
          {error && (
            <p className="text-sm text-red-600 mt-1">{error}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading || !file || isFileTooLarge}
          className="w-full"
        >
          {isLoading ? 'Procesando...' : 'Transcribir'}
        </Button>
      </form>

      {transcription && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Resultado de la Transcripción</h2>
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <p className="whitespace-pre-wrap">{transcription}</p>
          </div>
        </div>
      )}
    </div>
  );
}