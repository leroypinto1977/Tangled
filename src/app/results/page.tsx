"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  scoreTracker,
  getResultsWithAnalysis,
  type ScoreAnalysis,
} from "@/utils/scoreTracker";
import {
  tangledEvaluator,
  type EvaluationResult,
} from "@/utils/tangledEvaluation";
import { clipSelectionData, getClipById } from "@/data/clipSelectionData";

// Results interface
interface TestResults {
  [key: string]: number;
}

// Psychological interpretations for each character with detailed descriptions
const interpretations = {
  A: {
    name: "Analytical Thinking",
    description:
      "You approach problems systematically and prefer logical, step-by-step analysis. You value evidence-based decision making and tend to break down complex situations into manageable components.",
  },
  B: {
    name: "Behavioral Action",
    description:
      "You are action-oriented and prefer hands-on approaches. You tend to learn by doing and are comfortable taking initiative to implement solutions quickly.",
  },
  C: {
    name: "Creative Conceptualization",
    description:
      "You excel at generating innovative ideas and thinking outside conventional boundaries. You approach challenges with imagination and value artistic expression.",
  },
  D: {
    name: "Detail-Focused Processing",
    description:
      "You have a natural attention to detail and prefer thorough, methodical approaches. You value precision and accuracy in your work and thinking processes.",
  },
  E: {
    name: "Emotional Intelligence",
    description:
      "You are highly attuned to emotions - both your own and others'. You value empathy and consider emotional factors when making decisions.",
  },
  F: {
    name: "Flexible Adaptation",
    description:
      "You adapt easily to changing circumstances and prefer flexible approaches. You're comfortable with ambiguity and can adjust your strategies as needed.",
  },
  G: {
    name: "Goal-Oriented Strategic",
    description:
      "You are naturally goal-focused and excel at strategic planning. You prefer structured approaches to achieving objectives and value long-term thinking.",
  },
  H: {
    name: "Holistic Perspective",
    description:
      "You see the big picture and understand how different elements connect. You prefer comprehensive approaches that consider multiple viewpoints and systems.",
  },
  I: {
    name: "Intuitive Insight",
    description:
      "You rely on your intuition and inner wisdom. You often sense patterns and connections that aren't immediately obvious to others.",
  },
  J: {
    name: "Judgmental Evaluation",
    description:
      "You naturally evaluate and assess situations carefully. You value making well-considered judgments and prefer closure in decision-making.",
  },
  K: {
    name: "Kinesthetic Learning",
    description:
      "You learn best through physical experience and hands-on activities. You prefer active engagement and movement in your learning and work processes.",
  },
  L: {
    name: "Logical Reasoning",
    description:
      "You excel at logical reasoning and rational analysis. You prefer fact-based arguments and systematic approaches to problem-solving.",
  },
  M: {
    name: "Memory-Based Learning",
    description:
      "You have strong memory capabilities and learn well from past experiences. You value building on previous knowledge and proven methods.",
  },
  N: {
    name: "Numerical Processing",
    description:
      "You are comfortable with numbers and quantitative analysis. You prefer data-driven approaches and value measurable outcomes.",
  },
  O: {
    name: "Organized Structure",
    description:
      "You prefer organized, structured environments and approaches. You value order, planning, and systematic methods of working.",
  },
  P: {
    name: "People-Centered Social",
    description:
      "You are naturally people-focused and value social connections. You prefer collaborative approaches and consider the human element in all decisions.",
  },
  Q: {
    name: "Questioning Investigation",
    description:
      "You have a naturally curious mind and ask probing questions. You value research and investigation before forming conclusions.",
  },
  R: {
    name: "Reflective Contemplation",
    description:
      "You prefer thoughtful reflection and contemplation. You value taking time to process information deeply before acting or deciding.",
  },
  S: {
    name: "Sequential Processing",
    description:
      "You prefer step-by-step, sequential approaches to tasks and learning. You value order and progression in your thinking and work methods.",
  },
  T: {
    name: "Theoretical Abstract",
    description:
      "You enjoy theoretical concepts and abstract thinking. You prefer working with ideas and theories rather than concrete, practical applications.",
  },
  U: {
    name: "Understanding Focus",
    description:
      "You prioritize deep understanding and comprehension. You prefer to fully grasp concepts before moving forward and value clarity in communication.",
  },
  V: {
    name: "Visual Spatial",
    description:
      "You think and process information visually. You prefer visual representations, spatial relationships, and image-based learning and communication.",
  },
  W: {
    name: "Whole-System Thinking",
    description:
      "You naturally see systems and connections. You prefer holistic approaches that consider the entire ecosystem or environment.",
  },
  X: {
    name: "Experimental Exploration",
    description:
      "You enjoy experimenting and exploring new possibilities. You're comfortable with trial-and-error approaches and value innovation.",
  },
  Y: {
    name: "Yielding Collaboration",
    description:
      "You value collaboration and are willing to yield for the greater good. You prefer cooperative approaches and value team harmony.",
  },
  Z: {
    name: "Zone-Focused Concentration",
    description:
      "You have the ability to focus intensely on specific areas or topics. You prefer deep, concentrated work and value specialized expertise.",
  },
};
export default function ResultsPage() {
  const searchParams = useSearchParams();
  const [analysis, setAnalysis] = useState<ScoreAnalysis | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [selectedClip, setSelectedClip] = useState<string | null>(null);
  const [evaluationDetails, setEvaluationDetails] =
    useState<EvaluationResult | null>(null);

  // Parse results dynamically from URL parameters
  const results: TestResults = {};

  // Extract all parameters dynamically
  if (searchParams) {
    for (const [key, value] of searchParams.entries()) {
      if (key === "sessionId") {
        setSessionId(value);
        continue;
      }
      if (key === "selectedClip") {
        setSelectedClip(value);
        continue;
      }
      const count = parseInt(value, 10);
      if (!isNaN(count) && count > 0) {
        results[key] = count;
      }
    }
  }

  // Get detailed analysis
  useEffect(() => {
    if (Object.keys(results).length > 0) {
      const detailedAnalysis = getResultsWithAnalysis(results);
      setAnalysis(detailedAnalysis);

      // If we have session data, get the evaluation details
      if (sessionId) {
        const session = scoreTracker.getSession(sessionId);
        if (session) {
          // Get the selected answers from session
          const selectedAnswers: string[] = [];
          session.selectedOptions.forEach((optionId) => {
            // Extract the answer value from option ID (format: q{index}_{value})
            const parts = optionId.split("_");
            if (parts.length > 1) {
              selectedAnswers.push(parts[1]);
            }
          });

          // Get full evaluation details
          const evaluation = tangledEvaluator.evaluate(
            selectedAnswers,
            selectedClip || undefined
          );
          setEvaluationDetails(evaluation);
        }
      }
    }
  }, [sessionId, selectedClip]);

  // Find dominant traits
  const sortedResults = Object.entries(results)
    .sort(([, a], [, b]) => b - a)
    .filter(([, value]) => value > 0);

  const dominantTrait = sortedResults[0];
  const secondaryTrait = sortedResults[1];

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

        {/* Enhanced Analysis Results */}
        {analysis && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-light text-gray-900 mb-6">
              Enhanced Analysis
            </h2>

            {/* Strengths Section */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Your Key Strengths
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {analysis.strengths.map((strength, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700 text-sm">{strength}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations Section */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Recommendations for Growth
              </h3>
              <div className="space-y-2">
                {analysis.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700 text-sm">{recommendation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Character Profile Summary */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Character Profile Distribution
              </h3>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {analysis.characterProfile
                  .slice(0, 8)
                  .map(({ character, percentage }) => (
                    <div
                      key={character}
                      className="text-center p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="text-lg font-bold text-gray-900">
                        {character}
                      </div>
                      <div className="text-sm text-gray-600">{percentage}%</div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Blueprint Evaluation Details */}
        {evaluationDetails && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-light text-gray-900 mb-6">
              Detailed Evaluation Process
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Based on the Tangled Psychological Test blueprint methodology
            </p>

            {/* Selected Clip */}
            {selectedClip && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Selected Clip
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  {(() => {
                    const clip = getClipById(selectedClip);
                    return clip ? (
                      <div>
                        <div className="font-medium text-gray-900 mb-2">
                          {clip.name}
                        </div>
                        <div className="text-sm text-gray-600 mb-3">
                          {clip.description}
                        </div>
                        <div className="flex space-x-2">
                          {clip.codes.map((code, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-white rounded text-xs font-mono text-gray-700 border"
                            >
                              {code}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-500">Clip not found</div>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* Supplementary Analysis (V/W Check) */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Supplementary Analysis
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-gray-900">
                      {evaluationDetails.supplementaryCheck.totalVs}
                    </div>
                    <div className="text-sm text-gray-600">V Values</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">
                      {evaluationDetails.supplementaryCheck.totalWs}
                    </div>
                    <div className="text-sm text-gray-600">W Values</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-600">
                      {evaluationDetails.supplementaryCheck.selectedValue}
                    </div>
                    <div className="text-sm text-gray-600">Selected</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Blue Box Pairs Analysis */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Character Pair Analysis
              </h3>
              <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-3">
                {evaluationDetails.blueBoxPairs.map((pair, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-3 text-center"
                  >
                    <div className="font-mono text-sm text-gray-900 mb-1">
                      {pair.chars}
                    </div>
                    <div className="text-lg font-bold text-gray-700">
                      {pair.difference}
                    </div>
                    <div className="text-xs text-gray-500">difference</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Final Result */}
            {evaluationDetails.finalResult && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Final Evaluation Code
                </h3>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 text-center">
                  <div className="text-2xl font-mono font-bold text-gray-900 mb-2">
                    {evaluationDetails.finalResult}
                  </div>
                  <div className="text-sm text-gray-600">
                    Your unique psychological profile identifier
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Results Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-light text-gray-900 mb-6">
            Psychological Profile Summary
          </h2>

          {/* Dominant Trait */}
          {dominantTrait && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Primary Tendency: {dominantTrait[0]} ({dominantTrait[1]}{" "}
                selections)
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">
                  {
                    interpretations[
                      dominantTrait[0] as keyof typeof interpretations
                    ]?.name
                  }
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {
                    interpretations[
                      dominantTrait[0] as keyof typeof interpretations
                    ]?.description
                  }
                </p>
              </div>
            </div>
          )}

          {/* Secondary Trait */}
          {secondaryTrait && secondaryTrait[1] > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Secondary Tendency: {secondaryTrait[0]} ({secondaryTrait[1]}{" "}
                selections)
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">
                  {
                    interpretations[
                      secondaryTrait[0] as keyof typeof interpretations
                    ]?.name
                  }
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {
                    interpretations[
                      secondaryTrait[0] as keyof typeof interpretations
                    ]?.description
                  }
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Detailed Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-light text-gray-900 mb-6">
            Detailed Breakdown
          </h2>

          {/* Show all detected characters */}
          <div className="space-y-4">
            {sortedResults.map(([trait, count]) => {
              const interpretation =
                interpretations[trait as keyof typeof interpretations];
              return (
                <div
                  key={trait}
                  className="border-b border-gray-100 pb-4 last:border-b-0"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900">{trait}:</span>
                    <span className="text-sm text-gray-600">
                      {count} selections
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gray-900 h-3 rounded-full transition-all duration-300"
                        style={{
                          width: `${
                            (count /
                              Math.max(...sortedResults.map(([, c]) => c))) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p className="font-medium">
                      {interpretation?.name || `Character ${trait}`}
                    </p>
                    <p className="mt-1">
                      {interpretation?.description || "Analysis pending"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation with Progress Tracking */}
        <div className="text-center space-y-4">
          {sessionId && (
            <div className="text-sm text-gray-500 mb-4">
              Session ID: {sessionId} | Results saved for your progress tracking
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="bg-gray-900 text-white px-8 py-3 rounded-lg font-medium 
                       hover:bg-gray-800 transition-colors duration-200 
                       focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Take Test Again
            </Link>

            <Link
              href="/history"
              className="bg-white text-gray-900 px-8 py-3 rounded-lg font-medium border border-gray-300
                       hover:bg-gray-50 transition-colors duration-200 
                       focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              View Test History
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
