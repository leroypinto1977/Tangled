"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import {
  scoreTracker,
  getResultsWithAnalysis as _getResultsWithAnalysis,
  type ScoreAnalysis as _ScoreAnalysis,
} from "@/utils/scoreTracker";
import {
  tangledEvaluator,
  type EvaluationResult,
} from "@/utils/tangledEvaluation";
import { allQuestions } from "@/data/questionData";
import { getPersonalityTraits } from "@/data/personalityInterpretations";

// Results interface
interface TestResults {
  [key: string]: number;
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [evaluationDetails, setEvaluationDetails] =
    useState<EvaluationResult | null>(null);
  const [results, setResults] = useState<TestResults>({});

  // Parse URL parameters
  useEffect(() => {
    const parsedResults: TestResults = {};
    let foundSessionId: string | null = null;

    if (searchParams) {
      for (const [key, value] of searchParams.entries()) {
        if (key === "sessionId") {
          foundSessionId = value;
          continue;
        }
        const count = parseInt(value, 10);
        if (!isNaN(count) && count > 0) {
          parsedResults[key] = count;
        }
      }
    }

    setResults(parsedResults);
    setSessionId(foundSessionId);
  }, [searchParams]);

  // Get detailed analysis
  useEffect(() => {
    if (Object.keys(results).length > 0) {
      // If we have session data, get the evaluation details
      if (sessionId) {
        const session = scoreTracker.getSession(sessionId);
        if (session) {
          console.log("=== DEBUGGING SESSION DATA ===");
          console.log("Session ID:", sessionId);
          console.log("Selected Options (IDs):", session.selectedOptions);
          console.log("Section Selections:", session.sectionSelections);

          // Get the selected answers from session
          const selectedAnswers: string[] = [];
          session.selectedOptions.forEach((optionId, index) => {
            // Find the option across all questions to get its value
            let optionValue = "";
            for (const question of allQuestions) {
              const option = question.options.find(
                (opt) => opt.id === optionId
              );
              if (option) {
                optionValue = option.value;
                console.log(
                  `Question ${
                    index + 1
                  }: Option ID: ${optionId} -> Value: ${optionValue}`
                );
                break;
              }
            }
            if (optionValue) {
              selectedAnswers.push(optionValue);
            }
          });

          console.log("=== FINAL SELECTED ANSWERS ===");
          console.log("Selected Answers:", selectedAnswers);
          console.log("Total answers:", selectedAnswers.length);

          // Show individual character breakdown
          const allChars: string[] = [];
          selectedAnswers.forEach((answer, index) => {
            console.log(
              `Answer ${index + 1}: "${answer}" -> Characters: [${answer
                .split("")
                .join(", ")}]`
            );
            allChars.push(...answer.split(""));
          });

          console.log("All Characters:", allChars);
          console.log("Character Count:", allChars.length);

          // Get full evaluation details
          const evaluation = tangledEvaluator.evaluate(
            selectedAnswers,
            undefined, // No clip selection
            session.sectionSelections || undefined
          );

          console.log("=== EVALUATION RESULT ===");
          console.log(
            "Orange Box Results (Character Counts):",
            evaluation.orangeBoxResults
          );
          console.log("Blue Box Pairs:", evaluation.blueBoxPairs);
          console.log("Yellow Box Values:", evaluation.yellowBoxValues);
          console.log("Purple Box Results:", evaluation.purpleBoxResults);
          console.log("Green Box Results:", evaluation.greenBoxResults);
          console.log(
            "Pink Box Result (Section Selections):",
            evaluation.pinkBoxResult
          );
          console.log("Supplementary Check:", evaluation.supplementaryCheck);
          console.log("Final Result:", evaluation.finalResult);

          setEvaluationDetails(evaluation);
        }
      }
    }
  }, [results, sessionId]);

  // Find dominant traits (currently unused)
  const _sortedResults = Object.entries(results)
    .sort(([, a], [, b]) => b - a)
    .filter(([, value]) => value > 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-light text-gray-900 mb-4 tracking-wide">
            Your Results
          </h1>
          <div className="w-16 h-px bg-gray-300 mx-auto"></div>
        </div>

        {/* Debug Section - Raw Data Display */}
        {sessionId && (
          <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-6 mb-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
              🔍 Test Details
            </h2>
            {(() => {
              const session = scoreTracker.getSession(sessionId);
              if (!session)
                return <p className="text-red-600">No session found</p>;

              // Get selected answers
              const selectedAnswers: string[] = [];
              session.selectedOptions.forEach((optionId) => {
                let optionValue = "";
                for (const question of allQuestions) {
                  const option = question.options.find(
                    (opt) => opt.id === optionId
                  );
                  if (option) {
                    optionValue = option.value;
                    break;
                  }
                }
                if (optionValue) {
                  selectedAnswers.push(optionValue);
                }
              });

              return (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-slate-700 mb-2 text-sm uppercase tracking-wide">
                      Selected Option IDs:
                    </h3>
                    <p className="text-sm font-mono bg-white p-3 rounded-lg border border-slate-200 text-slate-900 shadow-sm">
                      [{session.selectedOptions.join(", ")}]
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-700 mb-2 text-sm uppercase tracking-wide">
                      Selected Answers (Option Values):
                    </h3>
                    <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                      {selectedAnswers.map((answer, index) => (
                        <div
                          key={index}
                          className="text-sm font-mono text-slate-900 py-1 border-b border-slate-100 last:border-b-0"
                        >
                          <span className="text-blue-600 font-semibold">
                            Question {index + 1}:
                          </span>{" "}
                          <span className="bg-blue-50 px-2 py-1 rounded text-blue-800">
                            &ldquo;{answer}&rdquo;
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-700 mb-2 text-sm uppercase tracking-wide">
                      Section Selections (A, B, C):
                    </h3>
                    <p className="text-sm font-mono bg-white p-3 rounded-lg border border-slate-200 text-slate-900 shadow-sm">
                      {session.sectionSelections ? (
                        JSON.stringify(session.sectionSelections)
                      ) : (
                        <span className="text-orange-600 italic">None</span>
                      )}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-700 mb-2 text-sm uppercase tracking-wide">
                      All Characters Combined:
                    </h3>
                    <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                      <p className="text-sm font-mono text-slate-900 break-all">
                        {selectedAnswers
                          .join("")
                          .split("")
                          .map((char, index) => (
                            <span
                              key={index}
                              className="bg-green-50 text-green-800 px-1 py-0.5 rounded mr-1 mb-1 inline-block"
                            >
                              {char}
                            </span>
                          ))}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-700 mb-2 text-sm uppercase tracking-wide">
                      Letter Count (First 15 Questions Only - Excluding J):
                    </h3>
                    <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                      {(() => {
                        // Only consider first 15 questions for letter count
                        const first15Answers = selectedAnswers.slice(0, 15);
                        const letterCounts: Record<string, number> = {};

                        // Initialize letters A-S with 0 (excluding J)
                        const letters = "ABCDEFGHIKLMNOPQRS".split(""); // Removed J
                        letters.forEach((letter) => {
                          letterCounts[letter] = 0;
                        });

                        // Count letters from first 15 answers (excluding J)
                        first15Answers.forEach((answer) => {
                          for (const char of answer) {
                            if (char >= "A" && char <= "S" && char !== "J") {
                              letterCounts[char] =
                                (letterCounts[char] || 0) + 1;
                            }
                          }
                        });

                        return (
                          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
                            {letters.map((letter) => {
                              const count = letterCounts[letter];
                              return (
                                <div
                                  key={letter}
                                  className={`text-center p-2 rounded text-xs font-mono ${
                                    count > 0
                                      ? "bg-purple-50 text-purple-800 border border-purple-200"
                                      : "bg-gray-50 text-gray-400 border border-gray-200"
                                  }`}
                                >
                                  <div className="font-bold">{letter}</div>
                                  <div className="text-xs">{count}</div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-700 mb-2 text-sm uppercase tracking-wide">
                      Letter Pair Analysis (AB, CD, EF, GH, IK):
                    </h3>
                    <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                      {(() => {
                        // Only consider first 15 questions for letter count
                        const first15Answers = selectedAnswers.slice(0, 15);
                        const letterCounts: Record<string, number> = {};

                        // Initialize and count letters (excluding J)
                        const letters = "ABCDEFGHIKLMNOPQRS".split("");
                        letters.forEach((letter) => {
                          letterCounts[letter] = 0;
                        });

                        first15Answers.forEach((answer) => {
                          for (const char of answer) {
                            if (char >= "A" && char <= "S" && char !== "J") {
                              letterCounts[char] =
                                (letterCounts[char] || 0) + 1;
                            }
                          }
                        });

                        // Define pairs (note: using K instead of J for the IK pair)
                        const pairs = ["AB", "CD", "EF", "GH", "IK"];

                        return (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                            {pairs.map((pair) => {
                              const char1 = pair[0];
                              const char2 = pair[1];
                              const count1 = letterCounts[char1] || 0;
                              const count2 = letterCounts[char2] || 0;
                              const difference = Math.abs(count1 - count2);
                              const higherChar =
                                difference >= 5
                                  ? count1 > count2
                                    ? char1
                                    : count2 > count1
                                    ? char2
                                    : char1
                                  : ""; // Leave blank if difference is < 5

                              return (
                                <div key={pair} className="text-center">
                                  {/* Red box with pair letters */}
                                  <div className="bg-red-100 border-2 border-red-300 rounded-lg p-3 mb-2">
                                    <div className="font-bold text-red-800 text-lg">
                                      {pair}
                                    </div>
                                    <div className="text-xs text-red-600">
                                      {char1}: {count1} | {char2}: {count2}
                                    </div>
                                  </div>

                                  {/* Difference (positive mod) */}
                                  <div className="bg-yellow-100 border border-yellow-300 rounded p-2 mb-2">
                                    <div className="text-xs text-yellow-700 font-medium">
                                      Difference
                                    </div>
                                    <div className="font-bold text-yellow-800">
                                      {difference}
                                    </div>
                                  </div>

                                  {/* Higher magnitude letter */}
                                  <div className="bg-green-100 border border-green-300 rounded p-2">
                                    <div className="text-xs text-green-700 font-medium">
                                      Higher
                                    </div>
                                    <div className="font-bold text-green-800 text-lg">
                                      {higherChar}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-700 mb-2 text-sm uppercase tracking-wide">
                      Letter Pair Analysis 2 (LM, NO, PQ) - Threshold ≥ 4:
                    </h3>
                    <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                      {(() => {
                        // Only consider first 15 questions for letter count
                        const first15Answers = selectedAnswers.slice(0, 15);
                        const letterCounts: Record<string, number> = {};

                        // Initialize and count letters (excluding J)
                        const letters = "ABCDEFGHIKLMNOPQRS".split("");
                        letters.forEach((letter) => {
                          letterCounts[letter] = 0;
                        });

                        first15Answers.forEach((answer) => {
                          for (const char of answer) {
                            if (char >= "A" && char <= "S" && char !== "J") {
                              letterCounts[char] =
                                (letterCounts[char] || 0) + 1;
                            }
                          }
                        });

                        return (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                              ["L", "M"],
                              ["N", "O"],
                              ["P", "Q"],
                            ].map(([char1, char2]) => {
                              const count1 = letterCounts[char1] || 0;
                              const count2 = letterCounts[char2] || 0;
                              const difference = Math.abs(count1 - count2);
                              const higherChar =
                                difference >= 4
                                  ? count1 > count2
                                    ? char1
                                    : char2
                                  : "";

                              return (
                                <div
                                  key={`${char1}${char2}`}
                                  className="text-center"
                                >
                                  {/* Red box with pair letters */}
                                  <div className="bg-red-100 border-2 border-red-300 rounded-lg p-3 mb-2">
                                    <div className="font-bold text-red-800 text-lg">
                                      {char1}
                                      {char2}
                                    </div>
                                    <div className="text-xs text-red-600">
                                      {char1}: {count1} | {char2}: {count2}
                                    </div>
                                  </div>

                                  {/* Difference (positive mod) */}
                                  <div className="bg-yellow-100 border border-yellow-300 rounded p-2 mb-2">
                                    <div className="text-xs text-yellow-700 font-medium">
                                      Difference
                                    </div>
                                    <div className="font-bold text-yellow-800">
                                      {difference}
                                    </div>
                                  </div>

                                  {/* Higher magnitude letter */}
                                  <div className="bg-green-100 border border-green-300 rounded p-2">
                                    <div className="text-xs text-green-700 font-medium">
                                      Higher
                                    </div>
                                    <div className="font-bold text-green-800 text-lg">
                                      {higherChar}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-700 mb-2 text-sm uppercase tracking-wide">
                      Letter Pair Analysis 3 (RS) - Threshold ≥ 3:
                    </h3>
                    <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                      {(() => {
                        // Only consider first 15 questions for letter count
                        const first15Answers = selectedAnswers.slice(0, 15);
                        const letterCounts: Record<string, number> = {};

                        // Initialize and count letters (excluding J)
                        const letters = "ABCDEFGHIKLMNOPQRS".split("");
                        letters.forEach((letter) => {
                          letterCounts[letter] = 0;
                        });

                        first15Answers.forEach((answer) => {
                          for (const char of answer) {
                            if (char >= "A" && char <= "S" && char !== "J") {
                              letterCounts[char] =
                                (letterCounts[char] || 0) + 1;
                            }
                          }
                        });

                        return (
                          <div className="grid grid-cols-1 gap-4">
                            {(() => {
                              const char1 = "R";
                              const char2 = "S";
                              const count1 = letterCounts[char1] || 0;
                              const count2 = letterCounts[char2] || 0;
                              const difference = Math.abs(count1 - count2);
                              const higherChar =
                                difference >= 3
                                  ? count1 > count2
                                    ? char1
                                    : char2
                                  : "";

                              return (
                                <div className="text-center">
                                  {/* Red box with pair letters */}
                                  <div className="bg-red-100 border-2 border-red-300 rounded-lg p-3 mb-2">
                                    <div className="font-bold text-red-800 text-lg">
                                      RS
                                    </div>
                                    <div className="text-xs text-red-600">
                                      R: {count1} | S: {count2}
                                    </div>
                                  </div>

                                  {/* Difference (positive mod) */}
                                  <div className="bg-yellow-100 border border-yellow-300 rounded p-2 mb-2">
                                    <div className="text-xs text-yellow-700 font-medium">
                                      Difference
                                    </div>
                                    <div className="font-bold text-yellow-800">
                                      {difference}
                                    </div>
                                  </div>

                                  {/* Higher magnitude letter */}
                                  <div className="bg-green-100 border border-green-300 rounded p-2">
                                    <div className="text-xs text-green-700 font-medium">
                                      Higher
                                    </div>
                                    <div className="font-bold text-green-800 text-lg">
                                      {higherChar}
                                    </div>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-700 mb-2 text-sm uppercase tracking-wide">
                      Combined Higher Alphabets - Purple Box:
                    </h3>
                    <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                      {(() => {
                        // Only consider first 15 questions for letter count
                        const first15Answers = selectedAnswers.slice(0, 15);
                        const letterCounts: Record<string, number> = {};

                        // Initialize and count letters (excluding J)
                        const letters = "ABCDEFGHIKLMNOPQRS".split("");
                        letters.forEach((letter) => {
                          letterCounts[letter] = 0;
                        });

                        first15Answers.forEach((answer) => {
                          for (const char of answer) {
                            if (char >= "A" && char <= "S" && char !== "J") {
                              letterCounts[char] =
                                (letterCounts[char] || 0) + 1;
                            }
                          }
                        });

                        return (
                          <div className="w-full">
                            <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-4">
                              {(() => {
                                // Collect higher chars from all three analyses
                                const higherChars: string[] = [];

                                // First analysis: AB, CD, EF, GH, IK (threshold >= 5)
                                const pairs1 = ["AB", "CD", "EF", "GH", "IK"];
                                pairs1.forEach((pair) => {
                                  const char1 = pair[0];
                                  const char2 = pair[1];
                                  const count1 = letterCounts[char1] || 0;
                                  const count2 = letterCounts[char2] || 0;
                                  const difference = Math.abs(count1 - count2);
                                  const higherChar =
                                    difference >= 5
                                      ? count1 > count2
                                        ? char1
                                        : count2 > count1
                                        ? char2
                                        : char1
                                      : "";
                                  if (higherChar) higherChars.push(higherChar);
                                });

                                // Second analysis: LM, NO, PQ (threshold >= 4)
                                const pairs2 = [
                                  ["L", "M"],
                                  ["N", "O"],
                                  ["P", "Q"],
                                ];
                                pairs2.forEach(([char1, char2]) => {
                                  const count1 = letterCounts[char1] || 0;
                                  const count2 = letterCounts[char2] || 0;
                                  const difference = Math.abs(count1 - count2);
                                  const higherChar =
                                    difference >= 4
                                      ? count1 > count2
                                        ? char1
                                        : char2
                                      : "";
                                  if (higherChar) higherChars.push(higherChar);
                                });

                                // Third analysis: RS (threshold >= 3)
                                const count1 = letterCounts["R"] || 0;
                                const count2 = letterCounts["S"] || 0;
                                const difference = Math.abs(count1 - count2);
                                const higherChar =
                                  difference >= 3
                                    ? count1 > count2
                                      ? "R"
                                      : "S"
                                    : "";
                                if (higherChar) higherChars.push(higherChar);

                                // Join all higher alphabets
                                const combinedHigherAlphabets =
                                  higherChars.join("");

                                return (
                                  <div className="text-center">
                                    <div className="text-xs text-purple-700 font-medium mb-2">
                                      All Higher Alphabets Combined
                                    </div>
                                    <div className="font-mono font-bold text-purple-800 text-xl">
                                      {combinedHigherAlphabets || "(None)"}
                                    </div>
                                    <div className="text-xs text-purple-600 mt-2">
                                      {higherChars.length} letter(s) found
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-700 mb-2 text-sm uppercase tracking-wide">
                      Count Based Letter - Green Box:
                    </h3>
                    <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                      {(() => {
                        // Only consider first 15 questions for letter count
                        const first15Answers = selectedAnswers.slice(0, 15);
                        const letterCounts: Record<string, number> = {};

                        // Initialize and count letters (excluding J)
                        const letters = "ABCDEFGHIKLMNOPQRS".split("");
                        letters.forEach((letter) => {
                          letterCounts[letter] = 0;
                        });

                        first15Answers.forEach((answer) => {
                          for (const char of answer) {
                            if (char >= "A" && char <= "S" && char !== "J") {
                              letterCounts[char] =
                                (letterCounts[char] || 0) + 1;
                            }
                          }
                        });

                        return (
                          <div className="w-full">
                            <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
                              {(() => {
                                // Collect higher chars from all three analyses (same logic as above)
                                const higherChars: string[] = [];

                                // First analysis: AB, CD, EF, GH, IK (threshold >= 5)
                                const pairs1 = ["AB", "CD", "EF", "GH", "IK"];
                                pairs1.forEach((pair) => {
                                  const char1 = pair[0];
                                  const char2 = pair[1];
                                  const count1 = letterCounts[char1] || 0;
                                  const count2 = letterCounts[char2] || 0;
                                  const difference = Math.abs(count1 - count2);
                                  const higherChar =
                                    difference >= 5
                                      ? count1 > count2
                                        ? char1
                                        : count2 > count1
                                        ? char2
                                        : char1
                                      : "";
                                  if (higherChar) higherChars.push(higherChar);
                                });

                                // Second analysis: LM, NO, PQ (threshold >= 4)
                                const pairs2 = [
                                  ["L", "M"],
                                  ["N", "O"],
                                  ["P", "Q"],
                                ];
                                pairs2.forEach(([char1, char2]) => {
                                  const count1 = letterCounts[char1] || 0;
                                  const count2 = letterCounts[char2] || 0;
                                  const difference = Math.abs(count1 - count2);
                                  const higherChar =
                                    difference >= 4
                                      ? count1 > count2
                                        ? char1
                                        : char2
                                      : "";
                                  if (higherChar) higherChars.push(higherChar);
                                });

                                // Third analysis: RS (threshold >= 3)
                                const count1 = letterCounts["R"] || 0;
                                const count2 = letterCounts["S"] || 0;
                                const difference = Math.abs(count1 - count2);
                                const higherChar =
                                  difference >= 3
                                    ? count1 > count2
                                      ? "R"
                                      : "S"
                                    : "";
                                if (higherChar) higherChars.push(higherChar);

                                // Determine count-based letter
                                const letterCount = higherChars.length;
                                let countBasedLetter = "";

                                if (letterCount >= 2) {
                                  countBasedLetter = "T";
                                } else if (letterCount === 1) {
                                  countBasedLetter = ""; // Leave blank/null
                                } else if (letterCount === 0) {
                                  countBasedLetter = "U";
                                }

                                return (
                                  <div className="text-center">
                                    <div className="text-xs text-green-700 font-medium mb-2">
                                      Count Based Letter (≥2=T, 1=blank, 0=U)
                                    </div>
                                    <div className="font-mono font-bold text-green-800 text-xl">
                                      {countBasedLetter || "(Empty)"}
                                    </div>
                                    <div className="text-xs text-green-600 mt-2">
                                      Based on {letterCount} higher letter(s)
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-700 mb-2 text-sm uppercase tracking-wide">
                      Section Selections (A, B, C):
                    </h3>
                    <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                      {(() => {
                        if (!session.sectionSelections) {
                          return (
                            <p className="text-gray-500 text-center">
                              No section selections found
                            </p>
                          );
                        }

                        return (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {["Section A", "Section B", "Section C"].map(
                                (sectionName, index) => {
                                  const selectedOptionId =
                                    session.sectionSelections![index];
                                  const question = allQuestions.find((q) =>
                                    q.options.some(
                                      (opt) => opt.id === selectedOptionId
                                    )
                                  );
                                  const selectedOption = question?.options.find(
                                    (opt) => opt.id === selectedOptionId
                                  );

                                  return (
                                    <div
                                      key={index}
                                      className="bg-gray-50 border border-gray-300 rounded-lg p-4 text-center"
                                    >
                                      <div className="text-xs text-gray-600 font-medium mb-2">
                                        {sectionName}
                                      </div>
                                      {selectedOption ? (
                                        <div className="font-mono font-bold text-blue-900 text-lg">
                                          {selectedOption.value}
                                        </div>
                                      ) : (
                                        <div className="text-gray-400 text-sm">
                                          No selection
                                        </div>
                                      )}
                                    </div>
                                  );
                                }
                              )}
                            </div>

                            <div className="border-t border-gray-200 pt-4">
                              <div className="text-center">
                                <div className="text-xs text-gray-600 font-medium mb-2">
                                  Common Letters
                                </div>
                                {(() => {
                                  // Get all three section values
                                  const sectionValues: string[] = [];
                                  for (let i = 0; i < 3; i++) {
                                    const selectedOptionId =
                                      session.sectionSelections![i];
                                    const question = allQuestions.find((q) =>
                                      q.options.some(
                                        (opt) => opt.id === selectedOptionId
                                      )
                                    );
                                    const selectedOption =
                                      question?.options.find(
                                        (opt) => opt.id === selectedOptionId
                                      );
                                    if (selectedOption) {
                                      sectionValues.push(selectedOption.value);
                                    }
                                  }

                                  if (sectionValues.length < 3) {
                                    return (
                                      <div className="font-mono font-bold text-blue-900 text-lg">
                                        (Empty)
                                      </div>
                                    );
                                  }

                                  // Find common letters
                                  const commonLetters: string[] = [];

                                  // Get unique letters from first value
                                  const firstValueLetters = [
                                    ...new Set(sectionValues[0].split("")),
                                  ];

                                  // Check each letter if it exists in all three values
                                  firstValueLetters.forEach((letter) => {
                                    if (
                                      sectionValues[1].includes(letter) &&
                                      sectionValues[2].includes(letter)
                                    ) {
                                      commonLetters.push(letter);
                                    }
                                  });

                                  return (
                                    <div className="font-mono font-bold text-blue-900 text-lg">
                                      {commonLetters.length > 0
                                        ? commonLetters.join("")
                                        : "(Empty)"}
                                    </div>
                                  );
                                })()}
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-700 mb-2 text-sm uppercase tracking-wide">
                      V and W Count:
                    </h3>
                    <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                      {(() => {
                        // Count V and W from all selected answers
                        let vCount = 0;
                        let wCount = 0;

                        selectedAnswers.forEach((answer) => {
                          for (const char of answer) {
                            if (char === "V") vCount++;
                            if (char === "W") wCount++;
                          }
                        });

                        return (
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 rounded text-sm font-mono bg-purple-50 text-purple-800 border border-purple-200">
                              <div className="font-bold text-lg">V</div>
                              <div className="text-xs">{vCount}</div>
                            </div>
                            <div className="text-center p-3 rounded text-sm font-mono bg-purple-50 text-purple-800 border border-purple-200">
                              <div className="font-bold text-lg">W</div>
                              <div className="text-xs">{wCount}</div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-700 mb-2 text-sm uppercase tracking-wide">
                      Selected Value (V or W ≥ 11):
                    </h3>
                    <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                      {(() => {
                        // Count V and W from all selected answers
                        let vCount = 0;
                        let wCount = 0;

                        selectedAnswers.forEach((answer) => {
                          for (const char of answer) {
                            if (char === "V") vCount++;
                            if (char === "W") wCount++;
                          }
                        });

                        let selectedValue = "";
                        if (vCount >= 11) {
                          selectedValue = "V";
                        } else if (wCount >= 11) {
                          selectedValue = "W";
                        } else {
                          selectedValue = "VW";
                        }

                        return (
                          <div className="w-full">
                            <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 text-center w-full">
                              <div className="font-mono font-bold text-green-800 text-xl">
                                {selectedValue}
                              </div>
                              <div className="text-xs text-green-600 mt-2">
                                {selectedValue === "V"
                                  ? `${vCount} occurrences`
                                  : selectedValue === "W"
                                  ? `${wCount} occurrences`
                                  : `V: ${vCount}, W: ${wCount} - Neither ≥ 11`}
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-700 mb-2 text-sm uppercase tracking-wide">
                      Common Letters - Pink Box:
                    </h3>
                    <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                      {(() => {
                        if (!session.sectionSelections) {
                          return (
                            <div className="w-full">
                              <div className="bg-pink-50 border-2 border-pink-300 rounded-lg p-4 text-center w-full">
                                <div className="font-mono font-bold text-pink-800 text-xl">
                                  (Empty)
                                </div>
                              </div>
                            </div>
                          );
                        }

                        // Get all three section values
                        const sectionValues: string[] = [];
                        for (let i = 0; i < 3; i++) {
                          const selectedOptionId =
                            session.sectionSelections![i];
                          const question = allQuestions.find((q) =>
                            q.options.some((opt) => opt.id === selectedOptionId)
                          );
                          const selectedOption = question?.options.find(
                            (opt) => opt.id === selectedOptionId
                          );
                          if (selectedOption) {
                            sectionValues.push(selectedOption.value);
                          }
                        }

                        if (sectionValues.length < 3) {
                          return (
                            <div className="w-full">
                              <div className="bg-pink-50 border-2 border-pink-300 rounded-lg p-4 text-center w-full">
                                <div className="font-mono font-bold text-pink-800 text-xl">
                                  (Empty)
                                </div>
                              </div>
                            </div>
                          );
                        }

                        // Find common letters
                        const commonLetters: string[] = [];

                        // Get unique letters from first value
                        const firstValueLetters = [
                          ...new Set(sectionValues[0].split("")),
                        ];

                        // Check each letter if it exists in all three values
                        firstValueLetters.forEach((letter) => {
                          if (
                            sectionValues[1].includes(letter) &&
                            sectionValues[2].includes(letter)
                          ) {
                            commonLetters.push(letter);
                          }
                        });

                        return (
                          <div className="w-full">
                            <div className="bg-pink-50 border-2 border-pink-300 rounded-lg p-4 text-center w-full">
                              <div className="text-xs text-pink-700 font-medium mb-2">
                                Common Letters
                              </div>
                              <div className="font-mono font-bold text-pink-800 text-xl">
                                {commonLetters.length > 0
                                  ? commonLetters.join("")
                                  : "(Empty)"}
                              </div>
                              <div className="text-xs text-pink-600 mt-2">
                                {commonLetters.length} letter(s) found
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-700 mb-2 text-sm uppercase tracking-wide">
                      Final Green Box:
                    </h3>
                    <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                      {(() => {
                        // Only consider first 15 questions for letter count
                        const first15Answers = selectedAnswers.slice(0, 15);
                        const letterCounts: Record<string, number> = {};

                        // Initialize and count letters (excluding J)
                        const letters = "ABCDEFGHIKLMNOPQRS".split("");
                        letters.forEach((letter) => {
                          letterCounts[letter] = 0;
                        });

                        first15Answers.forEach((answer) => {
                          for (const char of answer) {
                            if (char >= "A" && char <= "S" && char !== "J") {
                              letterCounts[char] =
                                (letterCounts[char] || 0) + 1;
                            }
                          }
                        });

                        return (
                          <div className="w-full">
                            <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 text-center w-full">
                              {(() => {
                                // Calculate Count Based Letter
                                const higherChars: string[] = [];

                                // First analysis: AB, CD, EF, GH, IK (threshold >= 5)
                                const pairs1 = ["AB", "CD", "EF", "GH", "IK"];
                                pairs1.forEach((pair) => {
                                  const char1 = pair[0];
                                  const char2 = pair[1];
                                  const count1 = letterCounts[char1] || 0;
                                  const count2 = letterCounts[char2] || 0;
                                  const difference = Math.abs(count1 - count2);
                                  const higherChar =
                                    difference >= 5
                                      ? count1 > count2
                                        ? char1
                                        : count2 > count1
                                        ? char2
                                        : char1
                                      : "";
                                  if (higherChar) higherChars.push(higherChar);
                                });

                                // Second analysis: LM, NO, PQ (threshold >= 4)
                                const pairs2 = [
                                  ["L", "M"],
                                  ["N", "O"],
                                  ["P", "Q"],
                                ];
                                pairs2.forEach(([char1, char2]) => {
                                  const count1 = letterCounts[char1] || 0;
                                  const count2 = letterCounts[char2] || 0;
                                  const difference = Math.abs(count1 - count2);
                                  const higherChar =
                                    difference >= 4
                                      ? count1 > count2
                                        ? char1
                                        : char2
                                      : "";
                                  if (higherChar) higherChars.push(higherChar);
                                });

                                // Third analysis: RS (threshold >= 3)
                                const count1 = letterCounts["R"] || 0;
                                const count2 = letterCounts["S"] || 0;
                                const difference = Math.abs(count1 - count2);
                                const higherChar =
                                  difference >= 3
                                    ? count1 > count2
                                      ? "R"
                                      : "S"
                                    : "";
                                if (higherChar) higherChars.push(higherChar);

                                // Determine count-based letter
                                const letterCount = higherChars.length;
                                let countBasedLetter = "";

                                if (letterCount >= 2) {
                                  countBasedLetter = "T";
                                } else if (letterCount === 1) {
                                  countBasedLetter = ""; // Leave blank/null
                                } else if (letterCount === 0) {
                                  countBasedLetter = "U";
                                }

                                // Calculate V/W Selected Value
                                let vCount = 0;
                                let wCount = 0;

                                selectedAnswers.forEach((answer) => {
                                  for (const char of answer) {
                                    if (char === "V") vCount++;
                                    if (char === "W") wCount++;
                                  }
                                });

                                let selectedValue = "";
                                if (vCount >= 11) {
                                  selectedValue = "V";
                                } else if (wCount >= 11) {
                                  selectedValue = "W";
                                } else {
                                  selectedValue = "VW";
                                }

                                // Combine both results, ignoring empty ones
                                const results: string[] = [];

                                if (
                                  countBasedLetter &&
                                  countBasedLetter !== ""
                                ) {
                                  results.push(countBasedLetter);
                                }

                                if (selectedValue && selectedValue !== "") {
                                  results.push(selectedValue);
                                }

                                const combinedResult = results.join("");

                                return (
                                  <>
                                    <div className="text-xs text-green-700 font-medium mb-2">
                                      Final Green
                                    </div>
                                    <div className="font-mono font-bold text-green-800 text-xl">
                                      {combinedResult || "(Empty)"}
                                    </div>
                                    <div className="text-xs text-green-600 mt-2">
                                      Combined results from Count Based Letter
                                      and V/W Selection
                                    </div>
                                  </>
                                );
                              })()}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-700 mb-2 text-sm uppercase tracking-wide">
                      Final Purple Box:
                    </h3>
                    <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                      {(() => {
                        // Only consider first 15 questions for letter count
                        const first15Answers = selectedAnswers.slice(0, 15);
                        const letterCounts: Record<string, number> = {};

                        // Initialize and count letters (excluding J)
                        const letters = "ABCDEFGHIKLMNOPQRS".split("");
                        letters.forEach((letter) => {
                          letterCounts[letter] = 0;
                        });

                        first15Answers.forEach((answer) => {
                          for (const char of answer) {
                            if (char >= "A" && char <= "S" && char !== "J") {
                              letterCounts[char] =
                                (letterCounts[char] || 0) + 1;
                            }
                          }
                        });

                        return (
                          <div className="w-full">
                            <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-4">
                              {(() => {
                                // Collect higher chars from all three analyses
                                const higherChars: string[] = [];

                                // First analysis: AB, CD, EF, GH, IK (threshold >= 5)
                                const pairs1 = ["AB", "CD", "EF", "GH", "IK"];
                                pairs1.forEach((pair) => {
                                  const char1 = pair[0];
                                  const char2 = pair[1];
                                  const count1 = letterCounts[char1] || 0;
                                  const count2 = letterCounts[char2] || 0;
                                  const difference = Math.abs(count1 - count2);
                                  const higherChar =
                                    difference >= 5
                                      ? count1 > count2
                                        ? char1
                                        : count2 > count1
                                        ? char2
                                        : char1
                                      : "";
                                  if (higherChar) higherChars.push(higherChar);
                                });

                                // Second analysis: LM, NO, PQ (threshold >= 4)
                                const pairs2 = [
                                  ["L", "M"],
                                  ["N", "O"],
                                  ["P", "Q"],
                                ];
                                pairs2.forEach(([char1, char2]) => {
                                  const count1 = letterCounts[char1] || 0;
                                  const count2 = letterCounts[char2] || 0;
                                  const difference = Math.abs(count1 - count2);
                                  const higherChar =
                                    difference >= 4
                                      ? count1 > count2
                                        ? char1
                                        : char2
                                      : "";
                                  if (higherChar) higherChars.push(higherChar);
                                });

                                // Third analysis: RS (threshold >= 3)
                                const count1 = letterCounts["R"] || 0;
                                const count2 = letterCounts["S"] || 0;
                                const difference = Math.abs(count1 - count2);
                                const higherChar =
                                  difference >= 3
                                    ? count1 > count2
                                      ? "R"
                                      : "S"
                                    : "";
                                if (higherChar) higherChars.push(higherChar);

                                // Join all higher alphabets
                                const combinedHigherAlphabets =
                                  higherChars.join("");

                                return (
                                  <div className="text-center">
                                    <div className="text-xs text-purple-700 font-medium mb-2">
                                      All Higher Alphabets Combined
                                    </div>
                                    <div className="font-mono font-bold text-purple-800 text-xl">
                                      {combinedHigherAlphabets || "(None)"}
                                    </div>
                                    <div className="text-xs text-purple-600 mt-2">
                                      {higherChars.length} letter(s) found
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-700 mb-2 text-sm uppercase tracking-wide">
                      Final Result:
                    </h3>
                    <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                      {(() => {
                        // Get Common Letters result
                        let commonLettersResult = "";
                        if (session.sectionSelections) {
                          // Get all three section values
                          const sectionValues: string[] = [];
                          for (let i = 0; i < 3; i++) {
                            const selectedOptionId =
                              session.sectionSelections![i];
                            const question = allQuestions.find((q) =>
                              q.options.some(
                                (opt) => opt.id === selectedOptionId
                              )
                            );
                            const selectedOption = question?.options.find(
                              (opt) => opt.id === selectedOptionId
                            );
                            if (selectedOption) {
                              sectionValues.push(selectedOption.value);
                            }
                          }

                          if (sectionValues.length === 3) {
                            // Find common letters
                            const commonLetters: string[] = [];
                            const firstValueLetters = [
                              ...new Set(sectionValues[0].split("")),
                            ];

                            firstValueLetters.forEach((letter) => {
                              if (
                                sectionValues[1].includes(letter) &&
                                sectionValues[2].includes(letter)
                              ) {
                                commonLetters.push(letter);
                              }
                            });

                            commonLettersResult =
                              commonLetters.length > 0
                                ? commonLetters.join("")
                                : "";
                          }
                        }

                        // Get Final Green Box result
                        let finalGreenResult = "";

                        // Only consider first 15 questions for letter count
                        const first15Answers = selectedAnswers.slice(0, 15);
                        const letterCounts: Record<string, number> = {};

                        // Initialize and count letters (excluding J)
                        const letters = "ABCDEFGHIKLMNOPQRS".split("");
                        letters.forEach((letter) => {
                          letterCounts[letter] = 0;
                        });

                        first15Answers.forEach((answer) => {
                          for (const char of answer) {
                            if (char >= "A" && char <= "S" && char !== "J") {
                              letterCounts[char] =
                                (letterCounts[char] || 0) + 1;
                            }
                          }
                        });

                        // Calculate Count Based Letter
                        const higherChars: string[] = [];

                        // First analysis: AB, CD, EF, GH, IK (threshold >= 5)
                        const pairs1 = ["AB", "CD", "EF", "GH", "IK"];
                        pairs1.forEach((pair) => {
                          const char1 = pair[0];
                          const char2 = pair[1];
                          const count1 = letterCounts[char1] || 0;
                          const count2 = letterCounts[char2] || 0;
                          const difference = Math.abs(count1 - count2);
                          const higherChar =
                            difference >= 5
                              ? count1 > count2
                                ? char1
                                : count2 > count1
                                ? char2
                                : char1
                              : "";
                          if (higherChar) higherChars.push(higherChar);
                        });

                        // Second analysis: LM, NO, PQ (threshold >= 4)
                        const pairs2 = [
                          ["L", "M"],
                          ["N", "O"],
                          ["P", "Q"],
                        ];
                        pairs2.forEach(([char1, char2]) => {
                          const count1 = letterCounts[char1] || 0;
                          const count2 = letterCounts[char2] || 0;
                          const difference = Math.abs(count1 - count2);
                          const higherChar =
                            difference >= 4
                              ? count1 > count2
                                ? char1
                                : char2
                              : "";
                          if (higherChar) higherChars.push(higherChar);
                        });

                        // Third analysis: RS (threshold >= 3)
                        const rCount = letterCounts["R"] || 0;
                        const sCount = letterCounts["S"] || 0;
                        const rsDifference = Math.abs(rCount - sCount);
                        const rsHigherChar =
                          rsDifference >= 3
                            ? rCount > sCount
                              ? "R"
                              : "S"
                            : "";
                        if (rsHigherChar) higherChars.push(rsHigherChar);

                        // Determine count-based letter
                        const letterCount = higherChars.length;
                        let countBasedLetter = "";
                        if (letterCount >= 2) {
                          countBasedLetter = "T";
                        } else if (letterCount === 1) {
                          countBasedLetter = ""; // Leave blank/null
                        } else if (letterCount === 0) {
                          countBasedLetter = "U";
                        }

                        // Calculate V/W Selected Value
                        let vCount = 0;
                        let wCount = 0;
                        selectedAnswers.forEach((answer) => {
                          for (const char of answer) {
                            if (char === "V") vCount++;
                            if (char === "W") wCount++;
                          }
                        });

                        let selectedValue = "";
                        if (vCount >= 11) {
                          selectedValue = "V";
                        } else if (wCount >= 11) {
                          selectedValue = "W";
                        } else {
                          selectedValue = "VW";
                        }

                        // Combine Count Based Letter and V/W Selected Value for Final Green
                        const greenResults: string[] = [];
                        if (countBasedLetter && countBasedLetter !== "") {
                          greenResults.push(countBasedLetter);
                        }
                        if (selectedValue && selectedValue !== "") {
                          greenResults.push(selectedValue);
                        }
                        finalGreenResult = greenResults.join("");

                        // Get Final Purple Box result (Combined Higher Alphabets)
                        const finalPurpleResult = higherChars.join("");

                        // Combine all three results in order: Purple → Green → Pink, ignoring empty ones
                        const allResults: string[] = [];

                        if (finalPurpleResult && finalPurpleResult !== "") {
                          allResults.push(finalPurpleResult);
                        }

                        if (finalGreenResult && finalGreenResult !== "") {
                          allResults.push(finalGreenResult);
                        }

                        if (commonLettersResult && commonLettersResult !== "") {
                          allResults.push(commonLettersResult);
                        }

                        const combinedFinalResult = allResults.join("");

                        return (
                          <div className="w-full">
                            <div className="bg-white border-2 border-gray-300 rounded-lg p-4 text-center w-full">
                              <div className="text-xs text-gray-700 font-medium mb-2">
                                Combined Result (Purple + Green + Pink)
                              </div>
                              <div className="font-mono font-bold text-black text-xl">
                                {combinedFinalResult || "(Empty)"}
                              </div>
                              <div className="text-xs text-gray-600 mt-2">
                                Final combined result from all three boxes
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* About You Section */}
        {sessionId &&
          (() => {
            // Get the final result letters from the combined result
            let finalResultLetters = "";

            const session = scoreTracker.getSession(sessionId);
            if (session && evaluationDetails?.finalResult) {
              // Get the selected answers from session
              const selectedAnswers: string[] = [];
              session.selectedOptions.forEach((optionId) => {
                // Find the option across all questions to get its value
                let optionValue = "";
                for (const question of allQuestions) {
                  const option = question.options.find(
                    (opt) => opt.id === optionId
                  );
                  if (option) {
                    optionValue = option.value;
                    break;
                  }
                }
                if (optionValue) {
                  selectedAnswers.push(optionValue);
                }
              });

              // Get Common Letters result
              let commonLettersResult = "";
              if (session.sectionSelections) {
                // Get all three section values
                const sectionValues: string[] = [];
                for (let i = 0; i < 3; i++) {
                  const selectedOptionId = session.sectionSelections![i];
                  const question = allQuestions.find((q) =>
                    q.options.some((opt) => opt.id === selectedOptionId)
                  );
                  const selectedOption = question?.options.find(
                    (opt) => opt.id === selectedOptionId
                  );
                  if (selectedOption) {
                    sectionValues.push(selectedOption.value);
                  }
                }

                if (sectionValues.length === 3) {
                  // Find common letters
                  const commonLetters: string[] = [];
                  const firstValueLetters = [
                    ...new Set(sectionValues[0].split("")),
                  ];

                  firstValueLetters.forEach((letter) => {
                    if (
                      sectionValues[1].includes(letter) &&
                      sectionValues[2].includes(letter)
                    ) {
                      commonLetters.push(letter);
                    }
                  });

                  commonLettersResult =
                    commonLetters.length > 0 ? commonLetters.join("") : "";
                }
              }

              // Get Final Green Box result
              let finalGreenResult = "";

              // Only consider first 15 questions for letter count
              const first15Answers = selectedAnswers.slice(0, 15);
              const letterCounts: Record<string, number> = {};

              // Initialize and count letters (excluding J)
              const letters = "ABCDEFGHIKLMNOPQRS".split("");
              letters.forEach((letter) => {
                letterCounts[letter] = 0;
              });

              first15Answers.forEach((answer: string) => {
                for (const char of answer) {
                  if (char >= "A" && char <= "S" && char !== "J") {
                    letterCounts[char] = (letterCounts[char] || 0) + 1;
                  }
                }
              });

              // Calculate Count Based Letter
              const higherChars: string[] = [];

              // First analysis: AB, CD, EF, GH, IK (threshold >= 5)
              const pairs1 = ["AB", "CD", "EF", "GH", "IK"];
              pairs1.forEach((pair) => {
                const char1 = pair[0];
                const char2 = pair[1];
                const count1 = letterCounts[char1] || 0;
                const count2 = letterCounts[char2] || 0;
                const difference = Math.abs(count1 - count2);
                const higherChar =
                  difference >= 5
                    ? count1 > count2
                      ? char1
                      : count2 > count1
                      ? char2
                      : char1
                    : "";
                if (higherChar) higherChars.push(higherChar);
              });

              // Second analysis: LM, NO, PQ (threshold >= 4)
              const pairs2 = [
                ["L", "M"],
                ["N", "O"],
                ["P", "Q"],
              ];
              pairs2.forEach(([char1, char2]) => {
                const count1 = letterCounts[char1] || 0;
                const count2 = letterCounts[char2] || 0;
                const difference = Math.abs(count1 - count2);
                const higherChar =
                  difference >= 4 ? (count1 > count2 ? char1 : char2) : "";
                if (higherChar) higherChars.push(higherChar);
              });

              // Third analysis: RS (threshold >= 3)
              const rCount = letterCounts["R"] || 0;
              const sCount = letterCounts["S"] || 0;
              const rsDifference = Math.abs(rCount - sCount);
              const rsHigherChar =
                rsDifference >= 3 ? (rCount > sCount ? "R" : "S") : "";
              if (rsHigherChar) higherChars.push(rsHigherChar);

              // Determine count-based letter
              const letterCount = higherChars.length;
              let countBasedLetter = "";
              if (letterCount >= 2) {
                countBasedLetter = "T";
              } else if (letterCount === 1) {
                countBasedLetter = ""; // Leave blank/null
              } else if (letterCount === 0) {
                countBasedLetter = "U";
              }

              // Calculate V/W Selected Value
              let vCount = 0;
              let wCount = 0;
              selectedAnswers.forEach((answer: string) => {
                for (const char of answer) {
                  if (char === "V") vCount++;
                  if (char === "W") wCount++;
                }
              });

              let selectedValue = "";
              if (vCount >= 11) {
                selectedValue = "V";
              } else if (wCount >= 11) {
                selectedValue = "W";
              } else {
                selectedValue = "VW";
              }

              // Combine Count Based Letter and V/W Selected Value for Final Green
              const greenResults: string[] = [];
              if (countBasedLetter && countBasedLetter !== "") {
                greenResults.push(countBasedLetter);
              }
              if (selectedValue && selectedValue !== "") {
                greenResults.push(selectedValue);
              }
              finalGreenResult = greenResults.join("");

              // Get Final Purple Box result (Combined Higher Alphabets)
              const finalPurpleResult = higherChars.join("");

              // Combine all three results in order: Purple → Green → Pink, ignoring empty ones
              const allResults: string[] = [];

              if (finalPurpleResult && finalPurpleResult !== "") {
                allResults.push(finalPurpleResult);
              }

              if (finalGreenResult && finalGreenResult !== "") {
                allResults.push(finalGreenResult);
              }

              if (commonLettersResult && commonLettersResult !== "") {
                allResults.push(commonLettersResult);
              }

              finalResultLetters = allResults.join("");
            }

            // Parse individual letters from the final result
            const individualLetters = finalResultLetters
              ? [...new Set(finalResultLetters.split(""))]
              : [];

            // Get personality traits for the result letters
            const personalityTraits = getPersonalityTraits(individualLetters);

            return (
              <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  About You
                </h2>

                {personalityTraits.length > 0 ? (
                  <div className="space-y-6">
                    {/* Check for both V and W in individualLetters and render VW if both are present */}
                    {individualLetters.includes("V") &&
                    individualLetters.includes("W") ? (
                      <div className="border-l-4 border-blue-500 pl-6 py-4 bg-blue-50 rounded-r-lg">
                        <div className="flex items-start space-x-4">
                          <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg flex-shrink-0">
                            VW
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                              VW Personality
                            </h3>
                            <p className="text-gray-700 leading-relaxed">
                              {/* Use the previously provided description for VW here. Replace below with your actual description if needed. */}
                              You possess the strengths of both V and W:
                              analytical, visionary, and adaptable. This unique
                              blend allows you to approach challenges with
                              creativity and resilience, making you well-suited
                              for dynamic environments and complex
                              problem-solving.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : null}
                    {/* Render other traits as usual, skipping V and W if both are present */}
                    {personalityTraits.map((trait, index) => {
                      // If both V and W are present, skip rendering them individually
                      if (
                        individualLetters.includes("V") &&
                        individualLetters.includes("W") &&
                        (individualLetters[index] === "V" ||
                          individualLetters[index] === "W")
                      ) {
                        return null;
                      }
                      return (
                        <div
                          key={index}
                          className="border-l-4 border-blue-500 pl-6 py-4 bg-blue-50 rounded-r-lg"
                        >
                          <div className="flex items-start space-x-4">
                            <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg flex-shrink-0">
                              {individualLetters[index]}
                            </div>
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {trait.name}
                              </h3>
                              <p className="text-gray-700 leading-relaxed">
                                {trait.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-500 text-lg">
                      No personality insights available for your results.
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

        {/* Navigation with Progress Tracking */}
        <div className="text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/test"
              className="bg-gray-900 text-white px-8 py-3 rounded-lg font-medium 
                       hover:bg-gray-800 transition-colors duration-200 
                       focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Take Test Again
            </Link>

            <Link
              href="/"
              className="bg-white text-gray-900 px-8 py-3 rounded-lg font-medium border border-gray-300
                       hover:bg-gray-50 transition-colors duration-200 
                       focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading results...</p>
          </div>
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
