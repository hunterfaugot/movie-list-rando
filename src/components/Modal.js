// src/components/Modal.js

import React from 'react';

const Modal = ({ show, onClose, onConfirm, title, message }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-black opacity-50 absolute inset-0"></div>
      <div className="bg-white rounded-lg p-6 shadow-lg relative z-10 max-w-sm mx-auto">
        <h2 className="text-lg font-semibold mb-4 text-black">{title}</h2>
        <p className="mb-4 text-black">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="mr-2 py-2 px-4 bg-gray-300 text-black rounded-lg hover:bg-gray-400 focus:outline-none"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="py-2 px-4 bg-customRed text-white rounded-lg hover:bg-red-700 focus:outline-none"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
