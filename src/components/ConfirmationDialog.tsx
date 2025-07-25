interface ConfirmationDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationDialog({
  isOpen,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Are you sure you want to proceed to the test?
        </h3>

        <p className="text-gray-600 mb-6">
          Once you start the test, you&apos;ll need to complete all 29
          questions.
        </p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg 
                     hover:bg-gray-200 transition-colors duration-200
                     focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg 
                     hover:bg-gray-800 transition-colors duration-200
                     focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
