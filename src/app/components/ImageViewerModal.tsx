import { FC, useState } from 'react';
import { ReactSVG } from 'react-svg';
import close from '../assets/icons/close.svg';
import { FiDownload, FiMaximize, FiMinimize } from 'react-icons/fi';

interface ImageViewerDialogProps {
  src: string;
  alt?: string;
  onClose?: () => void;
}

const ImageViewerModal: FC<ImageViewerDialogProps> = ({ src, alt, onClose }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = src;
    link.download = alt || 'downloaded-image';
    link.click();
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <dialog className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
      <div
        className={`relative bg-white rounded-lg shadow-2xl transition-all duration-300 ease-in-out ${
          isFullScreen ? 'w-full h-full max-w-none max-h-none' : 'max-w-4xl max-h-[90vh] w-full'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ReactSVG src={close} className="w-6 h-6" />
        </button>

        {/* Image Container */}
        <div className="flex items-center justify-center h-full p-4">
          <img
            src={src}
            alt={alt}
            className={`object-contain w-full h-full ${
              isFullScreen ? 'max-w-full max-h-full' : 'max-h-[80vh]'
            }`}
          />
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
          <button
            onClick={handleDownload}
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
          >
            <FiDownload size={20} />
          </button>
          <button
            onClick={toggleFullScreen}
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors place-content-center"
          >
            {isFullScreen ? <FiMinimize size={20} /> : <FiMaximize size={20} />}
          </button>
        </div>
      </div>
    </dialog>
  );
};

ImageViewerModal.displayName = 'ImageViewerModal';

export default ImageViewerModal;
