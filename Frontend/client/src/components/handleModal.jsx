import React, { useState } from 'react';
import Modal from "./modal"
function HandleModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDeactivate = () => {
    // Handle deactivation logic here
    console.log('Account deactivated');
    setIsModalOpen(false);
  };

  return (
    <div className="App">
      {/* Button to open the modal */}
      <button
        className="bg-blue-500  text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
        onClick={() => setIsModalOpen(true)}
      >
        Show Modal
      </button>

      {/* Modal component */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDeactivate={handleDeactivate}
      />
    </div>
  );
}

export default HandleModal;
