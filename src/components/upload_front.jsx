'use client';

import { FileUploader } from '@/components/upload/multi-file';
import { UploaderProvider } from '@/components/upload/uploader-provider';
import { useEdgeStore } from '@/lib/edgestore';
import React, { useCallback, useState } from 'react';

export function MultiFileDropzoneUsage({ onUploadFile }) {
  const { edgestore } = useEdgeStore();
  const [fileContent, setFileContent] = useState('');

  // Lê o arquivo como texto de forma garantida com Promise
  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const uploadFn = useCallback(
    async ({ file, onProgressChange, signal }) => {
      const res = await edgestore.publicFiles.upload({
        file,
        signal,
        onProgressChange,
      });

      try {
        const text = await readFileAsText(file);
        if (typeof text === 'string') {
          setFileContent(text);
          if (onUploadFile) {
            onUploadFile(text);
          }
        }
      } catch (err) {
        console.error('Erro ao ler o arquivo:', err);
      }

      console.log(res);
      return res;
    },
    [edgestore, onUploadFile]
  );

  return (
    <UploaderProvider uploadFn={uploadFn} autoUpload>
      <FileUploader
        maxFiles={1}
        maxSize={1024 * 1024 * 10}
        accept={{ 'text/plain': ['.txt'] }}
      />

      <h3 className='h3 text-center mt-10'>Texto recebido:</h3>  
      <textarea
        className="w-full h-64 p-2 border border-gray-300 rounded"
        readOnly
        value={fileContent}
        placeholder="O arquivo será exibido aqui..."
      />
    </UploaderProvider>
  );
}
