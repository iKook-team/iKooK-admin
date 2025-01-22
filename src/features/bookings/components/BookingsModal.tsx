import React from 'react';

type ModalProps = {
  title: string;
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  isQuote: boolean;
};

const Modal: React.FC<ModalProps> = ({ isVisible, onClose, title, children, isQuote }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-2 ml-64 flex items-center justify-center bg-black-base bg-opacity-30 backdrop-blur-sm z-50 overflow-hidden ">
      <div
        className={`bg-white p-6 rounded-lg max-h-[80vh] overflow-y-auto shadow-lg relative ${isQuote ? 'w-[60%]' : 'w-[40%]'} `}
      >
        <div className="flex justify-between mb-5">
          <h1 className="font-bold capitalize text-2xl">{title}</h1>
          <button
            onClick={onClose}
            className="text-white font-bold bg-black-base items-center h-8 w-8 rounded-3xl  hover:text-gray-200"
          >
            X
          </button>
        </div>

        {children}
      </div>
    </div>
  );
};

export default Modal;
