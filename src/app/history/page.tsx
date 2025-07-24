"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getTestHistory,
  getTestStatistics,
  type TestSession,
} from "@/utils/scoreTracker";

export default function HistoryPage() {
  const [sessions, setSessions] = useState<TestSession[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const history = getTestHistory();
    const stats = getTestStatistics();
    setSessions(history.reverse()); // Show most recent first
    setStatistics(stats);
    setLoading(false);
  }, []);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getDominantTraitName = (trait: string) => {
    const traitNames: Record<string, string> = {
      A: "Analytical",
      B: "Behavioral",
      C: "Creative",
      D: "Detail-Focused",
      E: "Emotional",
      F: "Flexible",
      G: "Goal-Oriented",
      H: "Holistic",
      I: "Intuitive",
      J: "Judgmental",
      K: "Kinesthetic",
      L: "Logical",
      M: "Memory-Based",
      N: "Numerical",
      O: "Organized",
      P: "People-Centered",
      Q: "Questioning",
      R: "Reflective",
      S: "Sequential",
      T: "Theoretical",
      U: "Understanding",
      V: "Visual",
      W: "Whole-System",
      X: "Experimental",
      Y: "Yielding",
      Z: "Zone-Focused",
    };
    return traitNames[trait] || trait;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading your test history...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-light text-gray-900 mb-4 tracking-wide">
            Test History
          </h1>
          <div className="w-16 h-px bg-gray-300 mx-auto"></div>
        </div>

        {sessions.length === 0 ? (
          /* No Tests Taken */
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-light text-gray-600 mb-4">
              No Tests Taken Yet
            </h2>
            <p className="text-gray-500 mb-8">
              Take your first psychological assessment to start tracking your
              progress.
            </p>
            <Link
              href="/"
              className="bg-gray-900 text-white px-8 py-3 rounded-lg font-medium 
                       hover:bg-gray-800 transition-colors duration-200"
            >
              Take Your First Test
            </Link>
          </div>
        ) : (
          <>
            {/* Statistics Overview */}
            {statistics && (
              <div className="grid md:grid-cols-4 gap-6 mb-12">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                  <div className="text-3xl font-light text-gray-900 mb-2">
                    {statistics.totalTests}
                  </div>
                  <div className="text-sm text-gray-600">Total Tests</div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                  <div className="text-3xl font-light text-gray-900 mb-2">
                    {statistics.averageCompletionTime}m
                  </div>
                  <div className="text-sm text-gray-600">Avg. Time</div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                  <div className="text-3xl font-light text-gray-900 mb-2">
                    {getDominantTraitName(statistics.mostCommonDominantTrait)}
                  </div>
                  <div className="text-sm text-gray-600">Most Common Trait</div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                  <div className="text-3xl font-light text-gray-900 mb-2">
                    {statistics.testFrequency}
                  </div>
                  <div className="text-sm text-gray-600">Tests/Month</div>
                </div>
              </div>
            )}

            {/* Test Sessions List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-medium text-gray-900">
                  Test Sessions
                </h2>
              </div>

              <div className="divide-y divide-gray-200">
                {sessions.map((session, index) => (
                  <div
                    key={session.id}
                    className="px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <div className="text-sm font-medium text-gray-900">
                            Test #{sessions.length - index}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatDate(session.timestamp)}
                          </div>
                          {session.completionTime && (
                            <div className="text-xs text-gray-500">
                              {session.completionTime} min
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-6">
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Dominant:</span>{" "}
                            {getDominantTraitName(session.dominantTraits[0])} (
                            {session.dominantTraits[0]})
                          </div>

                          {session.dominantTraits[1] && (
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Secondary:</span>{" "}
                              {getDominantTraitName(session.dominantTraits[1])}{" "}
                              ({session.dominantTraits[1]})
                            </div>
                          )}
                        </div>

                        {/* Character Distribution */}
                        <div className="flex items-center space-x-2 mt-3">
                          {Object.entries(session.results)
                            .sort(([, a], [, b]) => b - a)
                            .slice(0, 5)
                            .map(([char, count]) => (
                              <div
                                key={char}
                                className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
                              >
                                {char}: {count}
                              </div>
                            ))}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/results?${new URLSearchParams(
                            Object.entries(session.results).reduce(
                              (acc, [key, value]) => {
                                acc[key] = value.toString();
                                return acc;
                              },
                              {} as Record<string, string>
                            )
                          ).toString()}&sessionId=${session.id}`}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress Insights */}
            <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 className="text-xl font-medium text-gray-900 mb-4">
                Progress Insights
              </h2>

              {sessions.length >= 2 ? (
                <div className="space-y-4">
                  <div className="text-sm text-gray-600">
                    <strong>Consistency:</strong> Your results show{" "}
                    {sessions.length >= 3 ? "good" : "developing"} consistency
                    across multiple tests.
                  </div>

                  <div className="text-sm text-gray-600">
                    <strong>Growth:</strong> Continue taking tests regularly to
                    track your psychological development and identify patterns
                    in your thinking preferences.
                  </div>

                  <div className="text-sm text-gray-600">
                    <strong>Recommendation:</strong> Aim to take a test monthly
                    to effectively monitor changes in your psychological
                    profile.
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-600">
                  Take more tests to unlock detailed progress insights and trend
                  analysis.
                </div>
              )}
            </div>
          </>
        )}

        {/* Navigation */}
        <div className="text-center mt-12">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="bg-gray-900 text-white px-8 py-3 rounded-lg font-medium 
                       hover:bg-gray-800 transition-colors duration-200"
            >
              Take New Test
            </Link>

            <Link
              href="/results"
              className="bg-white text-gray-900 px-8 py-3 rounded-lg font-medium border border-gray-300
                       hover:bg-gray-50 transition-colors duration-200"
            >
              Back to Results
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
