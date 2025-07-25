"use client";

import { useState } from "react";
import ConfirmationDialog from "@/components/ConfirmationDialog";

export default function Home() {
  const [showDialog, setShowDialog] = useState(false);

  const handleProceedClick = () => {
    setShowDialog(true);
  };

  const handleConfirm = () => {
    // Navigate to test page
    window.location.href = "/test";
  };

  const handleCancel = () => {
    setShowDialog(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-light text-gray-900 mb-4 tracking-wide">
            Tangled
          </h1>
          <div className="w-16 h-px bg-gray-300 mx-auto"></div>
        </div>

        {/* Test Information Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-light text-gray-900 mb-6">
            Psychological Assessment
          </h2>

          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              This assessment consists of{" "}
              <strong>29 visual preference questions</strong> designed to
              understand your cognitive patterns and psychological tendencies.
            </p>

            <div className="grid md:grid-cols-2 gap-6 my-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Part 1</h3>
                <p className="text-sm text-gray-600">
                  15 questions with 4 image options each
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Part 2</h3>
                <p className="text-sm text-gray-600">
                  14 questions with 2 image options each
                </p>
              </div>
            </div>

            <p>
              Each question simply asks:{" "}
              <em>&ldquo;Which image do you like?&rdquo;</em>
              Trust your instincts and select the image that appeals to you
              most.
            </p>

            <div className="bg-blue-50 p-4 rounded-lg mt-6">
              <p className="text-sm text-blue-800">
                <strong>Estimated time:</strong> 5-10 minutes
                <br />
                <strong>Instructions:</strong> There are no right or wrong
                answers. Choose based on your immediate preference.
              </p>
            </div>
          </div>
        </div>

        {/* Proceed Button */}
        <div className="text-center">
          <button
            onClick={handleProceedClick}
            className="bg-gray-900 text-white px-8 py-3 rounded-lg font-medium 
                     hover:bg-gray-800 transition-colors duration-200 
                     focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Proceed to Test
          </button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showDialog}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}
