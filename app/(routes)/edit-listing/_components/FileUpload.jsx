import React, { useState } from 'react';

function FileUpload({ setImage, imageList }) {
  const [imagePreview, setImagePreview] = useState([]);

  const handleFileUpload = (event) => {
    const files = event.target.files;
    const previews = Array.from(files).map((file) => URL.createObjectURL(file));
    setImagePreview(previews);
    setImage(files); // Pass the files to the parent component
  };

  return (
    <div>
      <div className="flex items-center justify-center w-full">
        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-auto border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-10 h-10 mb-2 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
          </div>
          <input id="dropzone-file" type="file" multiple className="hidden" onChange={handleFileUpload} />
        </label>
      </div>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {imagePreview.map((image, index) => (
          <div key={index} className="relative">
            <img src={image} width={100} height={100} className="rounded-lg object-cover" alt={`Preview ${index}`} />
          </div>
        ))}
      </div>
      {imageList && <div className="mt-4 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
        {imageList.map((image, index) => (
          <div key={index} className="relative">
            <img src={image?.url} width={100} height={100} className="rounded-lg object-cover" alt={`Preview ${index}`} />
          </div>
        ))}
      </div>}
    </div>
  );
}

export default FileUpload;