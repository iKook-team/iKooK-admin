import React, { useState } from 'react';
import { ReactSVG } from 'react-svg';
import close from '../../../../src/app/assets/icons/close.svg';

const DragAndDropImage: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy'; // Show a copy cursor
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setError(''); // Clear any previous errors

    const file = event.dataTransfer.files[0]; // Get the first file
    if (file && file.type.endsWith( 'jpeg' ) || file.type.endsWith( 'png' ) || file.type.endsWith( 'jpg' )) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImageSrc(e.target.result as string); // Cast to string
        }
      };
      reader.readAsDataURL(file);
    } else {
      setError('Please drop a valid image file.');
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput?.click(); // Programmatically open the file input
  
    fileInput.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target?.files?.[0]; // Get the selected file
  
      if (file) {
        if (file.type.endsWith('jpeg') || file.type.endsWith('png') || file.type.endsWith('jpg')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              setImageSrc(e.target.result as string); // Cast to string
            }
          };
          reader.readAsDataURL(file); // Read the file as a Data URL
        } else {
          setError('Please select a valid image file (jpeg, png, or jpg).');
        }
      }
    };
  };
  

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(''); // Clear any previous errors
    const file = event.target.files?.[0];
    if (file) {
      //   handleImageUpload(file);
    }
  };

  return (
    <div className="flex justify-center mt-10 w-full  gap-5 items-center h-60">
      <div
        className="flex flex-col w-[90%] gap-8 h-full border-2 border-dashed border-gray-400 rounded-md  items-center justify-center bg-white"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <p className="text-gray-500">Drag & drop an image here</p>
        <button onClick={(e) => handleClick(e)}>
          <p className="text-yellow-400">Click here to select image</p>
        </button>
        {/* Hidden File Input */}
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileInputChange}
        />
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </div>

      <div className="h-full aspect-[248/251] ">
        {imageSrc ? (
          <div className="relative h-full w-full">
            <img src={imageSrc} alt="Dropped" className=" h-full w-full object-cover" />
            <button className="absolute top-4 right-4" onClick={() => setImageSrc(null)}>
              <ReactSVG src={close} className="w-6 h-6" />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default DragAndDropImage;
