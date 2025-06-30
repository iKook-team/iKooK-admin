import React, { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';
import { ReactSVG } from 'react-svg';
import close from '../../../../src/app/assets/icons/close.svg';

export interface DragAndDropImageRef {
  getImage: () => File | null;
  clearImage: () => void;
}

interface DragAndDropImageProps {
  onImageSelected: (image?: string) => void;
  includeMargin?: boolean;
}

const DragAndDropImage = forwardRef<DragAndDropImageRef, DragAndDropImageProps>(
  ({ onImageSelected, includeMargin = false }, ref) => {
    const [image, setImage] = useState<string | null>(null);
    const imageFile = useRef<File>(null);

    const clearImage = useCallback(
      () => () => {
        setImage(null);
        onImageSelected(undefined);
        imageFile.current = null;
      },
      [onImageSelected]
    );

    useImperativeHandle(
      ref,
      () => ({
        getImage: () => imageFile.current,
        clearImage
      }),
      [clearImage]
    );

    return (
      <div
        className={`flex justify-center ${includeMargin ? 'mt-10' : ''} w-full gap-5 items-center h-60`}
      >
        <DragAndDropImageContainer
          className="w-[90%]"
          onImageGotten={(file, preview) => {
            imageFile.current = file;
            setImage(preview);
            onImageSelected(preview);
          }}
        />

        <div className="h-full aspect-[248/251] ">
          {image ? (
            <div className="relative h-full w-full">
              <img src={image} alt="Dropped" className=" h-full w-full object-cover" />
              <button className="absolute top-4 right-4" onClick={clearImage}>
                <ReactSVG src={close} className="w-6 h-6" />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
);

export function DragAndDropImageContainer({
  onImageGotten,
  className
}: {
  onImageGotten?: (file: File, preview: string) => void;
  className?: string;
}) {
  const [error, setError] = useState<string>('');

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy'; // Show a copy cursor
  };

  const onProcess = useCallback(
    (file?: File, errorMessage?: string) => {
      if (
        (file && file.type.endsWith('jpeg')) ||
        file?.type.endsWith('png') ||
        file?.type.endsWith('jpg') ||
        file?.type.endsWith('webp')
      ) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            onImageGotten?.(file, e.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      } else {
        setError(errorMessage || 'Please select a valid image file (jpeg, png, jpg or webp).');
      }
    },
    [onImageGotten]
  );

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setError(''); // Clear any previous errors
    onProcess(event.dataTransfer.files[0], 'Please drop a valid image file.');
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput?.click();
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(''); // Clear any previous errors
    onProcess((event.target as HTMLInputElement)?.files?.[0]);
  };
  return (
    <div
      className={`flex flex-col gap-8 h-full border-2 border-dashed border-gray-400 rounded-md items-center justify-center bg-white ${className || ''}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <p className="text-gray-500">Drag & drop an image here</p>
      <button onClick={handleClick}>
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
  );
}

DragAndDropImage.displayName = 'DragAndDropImage';

export default DragAndDropImage;
