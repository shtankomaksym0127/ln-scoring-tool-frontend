// components/UploadFile.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { env } from 'process';

interface UploadFileProps {
  onUploadSuccess: (data: any) => void;
}

const UploadFile: React.FC<UploadFileProps> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [filePath, setFilePath] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (file) {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);
  
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_DEV_URL}/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });
        onUploadSuccess(response.data.json_data);
        setFilePath(response.data.file_path);
      } catch (error) {
        console.error('Error uploading file:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFileDownload = async () => {
    if (filePath) {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_DEV_URL}/download`, {
          params: { file_path: filePath },
          responseType: 'blob'
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'profiles_with_scores.xlsx');
        document.body.appendChild(link);
        link.click();
      } catch (error) {
        console.error('Error downloading file:', error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileChange}
        className="mb-4 p-2 border text-black"
      />
      <button
        onClick={handleFileUpload}
        className="bg-blue-500 text-white p-2 rounded flex items-center justify-center"
        disabled={loading}
      >
        {loading ? (
          <svg
            className="animate-spin h-5 w-5 text-white mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : null}
        Upload
      </button>
      <button
        onClick={handleFileDownload}
        className="bg-green-500 text-white p-2 rounded mt-4"
        disabled={!filePath}
      >
        Download
      </button>
    </div>
  );
};

export default UploadFile;

