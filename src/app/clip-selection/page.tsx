"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { clipSelectionData } from "@/data/clipSelectionData";
import { evaluateTest } from "@/utils/tangledEvaluation";
import { saveTestSession } from "@/utils/scoreTracker";

function ClipSelectionContent() {
  const [selectedClip, setSelectedClip] = useState<string>("");
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [sectionSelections, setSectionSelections] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get all the data from URL params
    const answers = searchParams.get("answers");
    const optionIds = searchParams.get("optionIds");
    const sections = searchParams.get("sectionSelections");

    if (answers) {
      const parsedAnswers = JSON.parse(decodeURIComponent(answers));
      setSelectedAnswers(parsedAnswers);
    }

    if (optionIds) {
      const parsedOptionIds = JSON.parse(decodeURIComponent(optionIds));
      setSelectedOptionIds(parsedOptionIds);
    }

    if (sections) {
      const parsedSections = JSON.parse(decodeURIComponent(sections));
      setSectionSelections(parsedSections);
    }

    setLoading(false);
  }, [searchParams]);

  const handleClipSelect = (clipId: string) => {
    setSelectedClip(clipId);
  };

  const handleProceed = () => {
    if (!selectedClip) return;

    // Evaluate test with selected clip and section selections
    const evaluation = evaluateTest(
      selectedAnswers,
      selectedClip,
      sectionSelections
    );

    // Calculate completion time
    const completionTimeParam = searchParams.get("completionTime");
    const completionTime = completionTimeParam
      ? parseInt(completionTimeParam)
      : undefined;

    // Save the test session with clip selection and section selections
    const sessionId = saveTestSession(
      selectedOptionIds, // Use the actual option IDs from the test
      evaluation.characterCounts,
      completionTime,
      selectedClip, // Pass the selected clip
      sectionSelections // Pass the section selections (A, B, C values for Table 2)
    );

    // Build query params for results page
    const queryParams = new URLSearchParams();

    // Add character counts
    Object.keys(evaluation.characterCounts).forEach((char) => {
      queryParams.set(char, evaluation.characterCounts[char].toString());
    });

    // Add selected clip and session ID
    queryParams.set("selectedClip", selectedClip);
    queryParams.set("sessionId", sessionId);

    // Navigate to results
    window.location.href = `/results?${queryParams.toString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading clip selection...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light text-gray-900 mb-4">Final Step</h1>
          <p className="text-lg text-gray-600 mb-2">
            Choose your favorite clip from the selection below
          </p>
          <p className="text-sm text-gray-500">
            This selection will be used in the final evaluation of your results
          </p>
          <div className="w-16 h-px bg-gray-300 mx-auto mt-6"></div>
        </div>

        {/* Clip Selection Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {clipSelectionData.map((clip) => (
            <div
              key={clip.id}
              className={`bg-white rounded-lg shadow-sm border-2 transition-all duration-200 cursor-pointer
                         ${
                           selectedClip === clip.id
                             ? "border-blue-500 shadow-md transform scale-105"
                             : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                         }`}
              onClick={() => handleClipSelect(clip.id)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {clip.name}
                  </h3>
                  {selectedClip === clip.id && (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                <p className="text-gray-600 text-sm mb-4">{clip.description}</p>

                {/* Codes Display */}
                <div className="space-y-2">
                  <div className="text-xs text-gray-500 uppercase tracking-wide">
                    Associated Codes
                  </div>
                  <div className="flex space-x-2">
                    {clip.codes.map((code, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 rounded text-xs font-mono text-gray-700"
                      >
                        {code}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/test"
              className="bg-white text-gray-900 px-8 py-3 rounded-lg font-medium border border-gray-300
                       hover:bg-gray-50 transition-colors duration-200"
            >
              Back to Test
            </Link>

            <button
              onClick={handleProceed}
              disabled={!selectedClip}
              className={`px-8 py-3 rounded-lg font-medium transition-colors duration-200 ${
                selectedClip
                  ? "bg-gray-900 text-white hover:bg-gray-800"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              View Results
            </button>
          </div>

          {!selectedClip && (
            <p className="text-sm text-gray-500 mt-4">
              Please select a clip to continue
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ClipSelectionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading clips...</p>
          </div>
        </div>
      }
    >
      <ClipSelectionContent />
    </Suspense>
  );
}
