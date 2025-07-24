// Score Tracking Utility for Tangled Psychological Test
// This module handles storing, retrieving, and analyzing test results

export interface TestSession {
  id: string;
  timestamp: Date;
  selectedOptions: string[]; // Array of selected option IDs
  results: Record<string, number>; // Character counts
  dominantTraits: string[]; // Top 3 traits
  totalQuestions: number;
  completionTime?: number; // Time taken in minutes
}

export interface ScoreAnalysis {
  dominantTrait: { character: string; count: number; percentage: number };
  secondaryTrait: { character: string; count: number; percentage: number };
  characterProfile: Array<{
    character: string;
    count: number;
    percentage: number;
  }>;
  strengths: string[];
  recommendations: string[];
}

class ScoreTracker {
  private storageKey = "tangled_test_sessions";

  // Save a completed test session
  saveSession(
    selectedOptions: string[],
    results: Record<string, number>,
    completionTime?: number
  ): string {
    const sessionId = this.generateSessionId();
    const session: TestSession = {
      id: sessionId,
      timestamp: new Date(),
      selectedOptions,
      results,
      dominantTraits: this.getDominantTraits(results),
      totalQuestions: selectedOptions.length,
      completionTime,
    };

    const sessions = this.getAllSessions();
    sessions.push(session);

    // Keep only last 10 sessions to prevent storage bloat
    const recentSessions = sessions.slice(-10);

    localStorage.setItem(this.storageKey, JSON.stringify(recentSessions));
    return sessionId;
  }

  // Get all stored sessions
  getAllSessions(): TestSession[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return [];

      const sessions = JSON.parse(stored);
      // Convert timestamp strings back to Date objects
      return sessions.map((session: any) => ({
        ...session,
        timestamp: new Date(session.timestamp),
      }));
    } catch (error) {
      console.error("Error loading sessions:", error);
      return [];
    }
  }

  // Get a specific session by ID
  getSession(sessionId: string): TestSession | null {
    const sessions = this.getAllSessions();
    return sessions.find((session) => session.id === sessionId) || null;
  }

  // Analyze results and provide detailed insights
  analyzeResults(results: Record<string, number>): ScoreAnalysis {
    const totalSelections = Object.values(results).reduce(
      (sum, count) => sum + count,
      0
    );

    // Sort by count to get dominant traits
    const sortedTraits = Object.entries(results)
      .sort(([, a], [, b]) => b - a)
      .map(([character, count]) => ({
        character,
        count,
        percentage: Math.round((count / totalSelections) * 100),
      }));

    const dominantTrait = sortedTraits[0];
    const secondaryTrait = sortedTraits[1] || dominantTrait;

    // Generate strengths based on top traits
    const strengths = this.generateStrengths(sortedTraits.slice(0, 3));

    // Generate recommendations
    const recommendations = this.generateRecommendations(
      dominantTrait,
      secondaryTrait
    );

    return {
      dominantTrait,
      secondaryTrait,
      characterProfile: sortedTraits,
      strengths,
      recommendations,
    };
  }

  // Compare current results with previous sessions
  compareWithHistory(currentResults: Record<string, number>): {
    averageProfile: Record<string, number>;
    consistency: number;
    growth: string[];
  } {
    const sessions = this.getAllSessions();
    if (sessions.length === 0) {
      return {
        averageProfile: currentResults,
        consistency: 100,
        growth: ["This is your first test - great start!"],
      };
    }

    // Calculate average profile from all sessions
    const averageProfile: Record<string, number> = {};
    const allCharacters = new Set<string>();

    sessions.forEach((session) => {
      Object.keys(session.results).forEach((char) => allCharacters.add(char));
    });

    allCharacters.forEach((char) => {
      const total = sessions.reduce(
        (sum, session) => sum + (session.results[char] || 0),
        0
      );
      averageProfile[char] = Math.round(total / sessions.length);
    });

    // Calculate consistency (how similar current results are to average)
    const consistency = this.calculateConsistency(
      currentResults,
      averageProfile
    );

    // Identify growth areas
    const growth = this.identifyGrowth(currentResults, sessions);

    return { averageProfile, consistency, growth };
  }

  // Generate test statistics
  getTestStatistics(): {
    totalTests: number;
    averageCompletionTime: number;
    mostCommonDominantTrait: string;
    testFrequency: number; // tests per month
  } {
    const sessions = this.getAllSessions();

    if (sessions.length === 0) {
      return {
        totalTests: 0,
        averageCompletionTime: 0,
        mostCommonDominantTrait: "",
        testFrequency: 0,
      };
    }

    const totalTests = sessions.length;

    // Calculate average completion time
    const completionTimes = sessions
      .filter((s) => s.completionTime)
      .map((s) => s.completionTime!);
    const averageCompletionTime =
      completionTimes.length > 0
        ? completionTimes.reduce((sum, time) => sum + time, 0) /
          completionTimes.length
        : 0;

    // Find most common dominant trait
    const dominantTraits = sessions.map((s) => s.dominantTraits[0]);
    const traitCounts = dominantTraits.reduce((counts, trait) => {
      counts[trait] = (counts[trait] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);

    const mostCommonDominantTrait =
      Object.entries(traitCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || "";

    // Calculate test frequency (tests per month)
    const oldestSession = sessions[0];
    const monthsSpan =
      (Date.now() - oldestSession.timestamp.getTime()) /
      (1000 * 60 * 60 * 24 * 30);
    const testFrequency = monthsSpan > 0 ? totalTests / monthsSpan : totalTests;

    return {
      totalTests,
      averageCompletionTime: Math.round(averageCompletionTime),
      mostCommonDominantTrait,
      testFrequency: Math.round(testFrequency * 10) / 10,
    };
  }

  // Private helper methods
  private generateSessionId(): string {
    return (
      "session_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
    );
  }

  private getDominantTraits(results: Record<string, number>): string[] {
    return Object.entries(results)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([character]) => character);
  }

  private generateStrengths(
    topTraits: Array<{ character: string; count: number }>
  ): string[] {
    const strengthMap: Record<string, string> = {
      A: "Excellent analytical and problem-solving abilities",
      B: "Strong action-oriented leadership and implementation skills",
      C: "Outstanding creative thinking and innovation capabilities",
      D: "Exceptional attention to detail and thoroughness",
      E: "High emotional intelligence and empathy",
      F: "Remarkable adaptability and flexibility",
      G: "Strategic planning and goal achievement excellence",
      H: "Comprehensive systems thinking and big-picture perspective",
      I: "Strong intuitive insights and pattern recognition",
      J: "Sound judgment and decision-making capabilities",
      K: "Hands-on learning and practical application strengths",
      L: "Logical reasoning and rational analysis skills",
      M: "Excellent memory and experience-based learning",
      N: "Strong numerical and quantitative analysis abilities",
      O: "Outstanding organizational and structural thinking",
      P: "Exceptional people skills and social intelligence",
      Q: "Natural curiosity and investigative abilities",
      R: "Deep reflective thinking and contemplation skills",
      S: "Sequential processing and systematic approach strengths",
      T: "Theoretical thinking and abstract conceptualization",
      U: "Focus on understanding and comprehension excellence",
      V: "Strong visual-spatial processing and design thinking",
      W: "Whole-system perspective and integration capabilities",
      X: "Experimental approach and innovation willingness",
      Y: "Collaborative leadership and team harmony skills",
      Z: "Focused concentration and specialized expertise",
    };

    return topTraits
      .filter((trait) => trait.count > 0)
      .map(
        (trait) =>
          strengthMap[trait.character] ||
          `Strong ${trait.character} characteristics`
      )
      .slice(0, 3);
  }

  private generateRecommendations(
    dominant: { character: string; count: number },
    secondary: { character: string; count: number }
  ): string[] {
    // Basic recommendations based on character combinations
    const recommendations = [
      `Leverage your ${dominant.character} strengths in leadership roles and decision-making`,
      `Develop your ${secondary.character} abilities to complement your dominant traits`,
      "Consider roles that utilize both analytical and creative thinking",
      "Practice balancing different thinking styles for well-rounded problem solving",
    ];

    // Add specific recommendations based on dominant trait
    if (dominant.character === "A") {
      recommendations.push(
        "Excel in research, data analysis, or strategic planning roles"
      );
    } else if (dominant.character === "P") {
      recommendations.push(
        "Consider careers in counseling, team leadership, or human resources"
      );
    } else if (dominant.character === "C") {
      recommendations.push(
        "Explore creative fields like design, marketing, or innovation"
      );
    }

    return recommendations.slice(0, 4);
  }

  private calculateConsistency(
    current: Record<string, number>,
    average: Record<string, number>
  ): number {
    const allChars = Array.from(
      new Set([...Object.keys(current), ...Object.keys(average)])
    );

    let totalDifference = 0;
    let totalPossible = 0;

    allChars.forEach((char) => {
      const currentVal = current[char] || 0;
      const avgVal = average[char] || 0;
      totalDifference += Math.abs(currentVal - avgVal);
      totalPossible += Math.max(currentVal, avgVal);
    });

    return totalPossible === 0
      ? 100
      : Math.max(0, 100 - (totalDifference / totalPossible) * 100);
  }

  private identifyGrowth(
    current: Record<string, number>,
    sessions: TestSession[]
  ): string[] {
    if (sessions.length < 2)
      return ["Take more tests to see your growth patterns"];

    const growth: string[] = [];
    const lastSession = sessions[sessions.length - 1];

    // Compare with last session
    Object.entries(current).forEach(([char, count]) => {
      const lastCount = lastSession.results[char] || 0;
      if (count > lastCount) {
        growth.push(`Increased ${char} characteristics since your last test`);
      }
    });

    if (growth.length === 0) {
      growth.push("Your results show consistency with previous tests");
    }

    return growth.slice(0, 3);
  }
}

// Export singleton instance
export const scoreTracker = new ScoreTracker();

// Utility functions for components
export const getResultsWithAnalysis = (results: Record<string, number>) => {
  return scoreTracker.analyzeResults(results);
};

export const saveTestSession = (
  selectedOptions: string[],
  results: Record<string, number>,
  completionTime?: number
) => {
  return scoreTracker.saveSession(selectedOptions, results, completionTime);
};

export const getTestHistory = () => {
  return scoreTracker.getAllSessions();
};

export const getTestStatistics = () => {
  return scoreTracker.getTestStatistics();
};
