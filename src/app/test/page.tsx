"use client";

import { useState, useEffect } from "react";
import { allQuestions } from "@/data/questionData";

export default function TestPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);

  // Initialize start time when component mounts
  useEffect(() => {
    setStartTime(new Date());
  }, []);

  const question = allQuestions[currentQuestion];
  const isLastQuestion = currentQuestion === allQuestions.length - 1;

  const handleOptionSelect = (optionId: string) => {
    const newAnswers = [...selectedOptions];
    newAnswers[currentQuestion] = optionId;
    setSelectedOptions(newAnswers);

    // Auto-advance to next question after selection
    if (isLastQuestion) {
      // Calculate completion time
      const completionTime = startTime
        ? Math.round((Date.now() - startTime.getTime()) / (1000 * 60)) // in minutes
        : undefined;

      // Get the selected answer values for clip selection page
      const selectedAnswers: string[] = [];
      newAnswers.forEach((optionId, questionIndex) => {
        const question = allQuestions[questionIndex];
        const option = question.options.find((opt) => opt.id === optionId);
        if (option) {
          selectedAnswers.push(option.value);
        }
      });

      // Navigate to clip selection page with both option IDs and answer values
      const queryParams = new URLSearchParams();
      queryParams.set(
        "answers",
        encodeURIComponent(JSON.stringify(selectedAnswers))
      );
      queryParams.set(
        "optionIds",
        encodeURIComponent(JSON.stringify(newAnswers))
      );
      if (completionTime) {
        queryParams.set("completionTime", completionTime.toString());
      }

      window.location.href = `/final-selection?${queryParams.toString()}`;
    } else {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 300);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        {/* Header with question counter */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-light text-gray-900">Tangled</h1>
          <div className="text-sm text-gray-600">
            Question {currentQuestion + 1}/{allQuestions.length}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div
            className="bg-gray-900 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((currentQuestion + 1) / allQuestions.length) * 100}%`,
            }}
          ></div>
        </div>

        {/* Question card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-xl font-medium text-gray-900 text-center mb-8">
            {question.question}
          </h2>

          {/* Image options grid */}
          <div
            className={`grid gap-6 ${
              question.options.length === 4
                ? "grid-cols-2 md:grid-cols-4"
                : "grid-cols-1 md:grid-cols-2"
            }`}
          >
            {question.options.map((option) => {
              return (
                <div
                  key={option.id}
                  className="cursor-pointer group"
                  onClick={() => handleOptionSelect(option.id)}
                >
                  <div
                    className="relative overflow-hidden rounded-lg border-2 border-gray-200 
                              hover:border-gray-400 transition-all duration-200 
                              group-hover:shadow-md transform group-hover:scale-105"
                  >
                    <div className="aspect-square relative bg-white border rounded-lg overflow-hidden">
                      {/* Debug marker for first option */}
                      {option.id === "q1-a" && (
                        <div className="absolute top-0 left-0 w-8 h-8 bg-red-500 z-10 text-white text-xs flex items-center justify-center">
                          Q1A
                        </div>
                      )}
                      <img
                        src={option.imagePath}
                        alt={`Option ${option.id}`}
                        className="w-full h-full object-cover"
                        onLoad={() => {
                          console.log(
                            "✅ SUCCESS: Image loaded:",
                            option.imagePath
                          );
                        }}
                        onError={(e) => {
                          console.error(
                            "❌ ERROR: Image failed to load:",
                            option.imagePath
                          );
                          console.error("Error event:", e);
                          // Try to set a fallback
                          e.currentTarget.src =
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmZjY2NjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkVSUk9SPC90ZXh0Pjx0ZXh0IHg9IjUwJSIgeT0iNjUlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiPiR7b3B0aW9uLmltYWdlUGF0aH08L3RleHQ+PC9zdmc+";
                        }}
                        loading="eager"
                      />
                    </div>

                    {/* Overlay on hover */}
                    <div
                      className="absolute inset-0 bg-black bg-opacity-0 
                                group-hover:bg-opacity-10 transition-all duration-200 
                                flex items-center justify-center"
                    >
                      <div
                        className="w-8 h-8 bg-white rounded-full shadow-lg 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-200
                                  flex items-center justify-center"
                      >
                        <svg
                          className="w-4 h-4 text-gray-600"
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
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center text-sm text-gray-500">
          Click on the image you prefer to continue
        </div>
      </div>
    </div>
  );
}
