"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { allQuestions } from "@/data/questionData";
import { evaluateTest } from "@/utils/tangledEvaluation";
import { saveTestSession } from "@/utils/scoreTracker";

interface SectionSelection {
  sectionName: string;
  questionRange: string;
  questions: typeof allQuestions;
  selectedOptions: string[];
  selectedAnswers: string[];
}

function FinalSelectionContent() {
  const [currentSection, setCurrentSection] = useState(0);
  const [sectionSelections, setSectionSelections] = useState<string[]>([
    "",
    "",
    "",
  ]);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  // Define the 3 sections (first 15 questions divided into 3 groups of 5)
  const sections: SectionSelection[] = [
    {
      sectionName: "Section A",
      questionRange: "Questions 1-5",
      questions: allQuestions.slice(0, 5),
      selectedOptions: selectedOptionIds.slice(0, 5),
      selectedAnswers: selectedAnswers.slice(0, 5),
    },
    {
      sectionName: "Section B",
      questionRange: "Questions 6-10",
      questions: allQuestions.slice(5, 10),
      selectedOptions: selectedOptionIds.slice(5, 10),
      selectedAnswers: selectedAnswers.slice(5, 10),
    },
    {
      sectionName: "Section C",
      questionRange: "Questions 11-15",
      questions: allQuestions.slice(10, 15),
      selectedOptions: selectedOptionIds.slice(10, 15),
      selectedAnswers: selectedAnswers.slice(10, 15),
    },
  ];

  useEffect(() => {
    // Get both the selected answers and option IDs from URL params
    const answers = searchParams.get("answers");
    const optionIds = searchParams.get("optionIds");

    if (answers) {
      const parsedAnswers = JSON.parse(decodeURIComponent(answers));
      setSelectedAnswers(parsedAnswers);
    }

    if (optionIds) {
      const parsedOptionIds = JSON.parse(decodeURIComponent(optionIds));
      setSelectedOptionIds(parsedOptionIds);
    }

    setLoading(false);
  }, [searchParams]);

  const handleOptionSelect = (optionId: string) => {
    const newSelections = [...sectionSelections];
    newSelections[currentSection] = optionId;
    setSectionSelections(newSelections);

    // Auto-advance to next section
    if (currentSection < 2) {
      setTimeout(() => {
        setCurrentSection(currentSection + 1);
      }, 500);
    }
  };

  const handleProceed = () => {
    if (sectionSelections.some((selection) => !selection)) return;

    // Evaluate test with section selections
    const evaluation = evaluateTest(
      selectedAnswers,
      undefined,
      sectionSelections
    );

    // Calculate completion time
    const completionTimeParam = searchParams.get("completionTime");
    const completionTime = completionTimeParam
      ? parseInt(completionTimeParam)
      : undefined;

    // Save the test session with section selections
    const sessionId = saveTestSession(
      selectedOptionIds, // Use the actual option IDs from the test
      evaluation.characterCounts,
      completionTime,
      undefined, // No clip selection needed
      sectionSelections // Pass the section selections (A, B, C values for Table 2)
    );

    // Build query params for results page
    const queryParams = new URLSearchParams();

    // Add character counts
    Object.keys(evaluation.characterCounts).forEach((char) => {
      queryParams.set(char, evaluation.characterCounts[char].toString());
    });

    // Add session ID for detailed analysis
    queryParams.set("sessionId", sessionId);

    // Navigate directly to results
    window.location.href = `/results?${queryParams.toString()}`;
  };

  const goBack = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading final selection...</div>
      </div>
    );
  }

  const currentSectionData = sections[currentSection];
  const allSelectionsComplete = sectionSelections.every(
    (selection) => selection !== ""
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light text-gray-900 mb-4">
            Final Selection
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            {currentSectionData.sectionName} -{" "}
            {currentSectionData.questionRange}
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Choose your favorite option from the ones you selected in this
            section
          </p>

          {/* Progress indicator */}
          <div className="flex justify-center space-x-2 mb-6">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === currentSection
                    ? "bg-blue-500"
                    : sectionSelections[index]
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {!allSelectionsComplete ? (
          /* Selection Interface */
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-xl font-medium text-gray-900 text-center mb-8">
              Your selected options from {currentSectionData.sectionName}:
            </h2>

            {/* Show the user's selected options for this section */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentSectionData.questions.map((question, questionIndex) => {
                const selectedOptionId =
                  currentSectionData.selectedOptions[questionIndex];
                const selectedOption = question.options.find(
                  (opt) => opt.id === selectedOptionId
                );

                if (!selectedOption) return null;

                return (
                  <div
                    key={question.id}
                    className={`cursor-pointer group border-2 rounded-lg transition-all duration-200 ${
                      sectionSelections[currentSection] === selectedOptionId
                        ? "border-blue-500 shadow-md transform scale-105"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                    }`}
                    onClick={() => handleOptionSelect(selectedOptionId)}
                  >
                    <div className="p-4">
                      <div className="text-sm text-gray-600 mb-3">
                        Question {question.id}: {question.question}
                      </div>

                      <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden mb-3">
                        <img
                          src={selectedOption.imagePath}
                          alt={`Your choice for Q${question.id}`}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">
                          Option Value
                        </div>
                        <div className="font-mono text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded">
                          {selectedOption.value}
                        </div>
                      </div>

                      {sectionSelections[currentSection] ===
                        selectedOptionId && (
                        <div className="mt-3 flex justify-center">
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
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* All selections complete - show summary */
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-xl font-medium text-gray-900 text-center mb-6">
              Final Selections Complete
            </h2>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {sections.map((section, index) => {
                const selectedOptionId = sectionSelections[index];
                const question = section.questions.find((q) =>
                  q.options.some((opt) => opt.id === selectedOptionId)
                );
                const selectedOption = question?.options.find(
                  (opt) => opt.id === selectedOptionId
                );

                return (
                  <div key={index} className="text-center">
                    <h3 className="font-medium text-gray-900 mb-3">
                      {section.sectionName}
                    </h3>
                    {selectedOption && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="font-mono text-sm text-gray-700 bg-white px-2 py-1 rounded mb-2">
                          {selectedOption.value}
                        </div>
                        <div className="text-xs text-gray-500">
                          From Question {question?.id}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {currentSection > 0 && !allSelectionsComplete && (
              <button
                onClick={goBack}
                className="bg-white text-gray-900 px-6 py-3 rounded-lg font-medium border border-gray-300
                         hover:bg-gray-50 transition-colors duration-200"
              >
                Back to {sections[currentSection - 1].sectionName}
              </button>
            )}

            {allSelectionsComplete && (
              <button
                onClick={handleProceed}
                className="bg-gray-900 text-white px-8 py-3 rounded-lg font-medium 
                         hover:bg-gray-800 transition-colors duration-200"
              >
                View Results
              </button>
            )}
          </div>

          {!allSelectionsComplete && (
            <p className="text-sm text-gray-500 mt-4">
              {currentSection < 2
                ? "Selection will auto-advance to the next section"
                : "Make your final selection to continue"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FinalSelectionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <FinalSelectionContent />
    </Suspense>
  );
}
