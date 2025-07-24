// Tangled Test Evaluation System
// Following the exact blueprint methodology from the PDF

import {
  clipSelectionData,
  hasCommonAlphabet,
  type ClipData,
} from "@/data/clipSelectionData";

export interface EvaluationResult {
  orangeBoxResults: Record<string, number>; // Step 1: Character counts from orange boxes
  blueBoxPairs: Array<{ chars: string; difference: number }>; // Step 2: Blue box pairs
  yellowBoxValues: Record<string, number>; // Step 3: Yellow box values
  purpleBoxResults: {
    section1: string[]; // >=5 pairs
    section2: string[]; // >=4 pairs
    section3: string[]; // >=3 pairs
  }; // Step 4: Purple box categorization
  greenBoxResults: string[]; // Step 4: Green box T additions
  pinkBoxResult: string; // Step 5: Chosen clip from selection
  supplementaryCheck: {
    totalVs: number;
    totalWs: number;
    selectedValue: string; // "V"/"W" or take higher value
  }; // Step 7: Supplementary task
  finalResult: string; // Step 9: Final combined result
}

export class TangledEvaluator {
  // Step 1: Fill orange boxes with character counts
  private fillOrangeBoxes(selectedAnswers: string[]): Record<string, number> {
    const orangeBoxes: Record<string, number> = {};

    // Count all characters from selected answers
    selectedAnswers.forEach((answer) => {
      for (const char of answer) {
        orangeBoxes[char] = (orangeBoxes[char] || 0) + 1;
      }
    });

    return orangeBoxes;
  }

  // Step 2: Create blue box pairs and calculate differences
  private createBlueBoxPairs(
    orangeBoxes: Record<string, number>
  ): Array<{ chars: string; difference: number }> {
    const pairs = ["AB", "CD", "EF", "GH", "IJ", "KL", "MN", "OP", "QR", "ST"];

    return pairs.map((pair) => {
      const char1 = pair[0];
      const char2 = pair[1];
      const count1 = orangeBoxes[char1] || 0;
      const count2 = orangeBoxes[char2] || 0;
      const difference = Math.abs(count1 - count2);

      return {
        chars: pair,
        difference: difference,
      };
    });
  }

  // Step 3: Fill yellow boxes with blue box differences
  private fillYellowBoxes(
    blueBoxPairs: Array<{ chars: string; difference: number }>
  ): Record<string, number> {
    const yellowBoxes: Record<string, number> = {};

    blueBoxPairs.forEach((pair) => {
      yellowBoxes[pair.chars] = pair.difference;
    });

    return yellowBoxes;
  }

  // Step 4: Categorize into purple boxes and handle green box
  private categorizePurpleAndGreen(yellowBoxValues: Record<string, number>): {
    purpleBoxResults: {
      section1: string[];
      section2: string[];
      section3: string[];
    };
    greenBoxResults: string[];
  } {
    const purpleBoxResults = {
      section1: [] as string[], // >=5
      section2: [] as string[], // >=4
      section3: [] as string[], // >=3
    };
    const greenBoxResults: string[] = [];

    Object.entries(yellowBoxValues).forEach(([pair, value]) => {
      if (value >= 5) {
        // Section 1: Move to each pair value and write down alphabet with highest value
        const char1 = pair[0];
        const char2 = pair[1];
        // For now, we'll add the pair itself - this would need the original orange box values to determine highest
        purpleBoxResults.section1.push(pair);
      } else if (value >= 4) {
        // Section 2: Similar logic
        purpleBoxResults.section2.push(pair);
      } else if (value >= 3) {
        // Section 3: Similar logic
        purpleBoxResults.section3.push(pair);
      }
    });

    // Step 4 continuation: Count alphabets in purple box
    const allPurpleChars = [
      ...purpleBoxResults.section1,
      ...purpleBoxResults.section2,
      ...purpleBoxResults.section3,
    ].join("");

    const charCounts: Record<string, number> = {};
    for (const char of allPurpleChars) {
      charCounts[char] = (charCounts[char] || 0) + 1;
    }

    // Add "T" for counts >=2
    Object.entries(charCounts).forEach(([char, count]) => {
      if (count >= 2) {
        greenBoxResults.push("T");
      } else if (count === 1) {
        // No action for count = 1
      } else if (count === 0) {
        greenBoxResults.push("U");
      }
    });

    return { purpleBoxResults, greenBoxResults };
  }

  // Step 5: Choose favorite clip from selection (this would be user input)
  private chooseFavoriteClip(selectedClipId?: string): string {
    // If no clip is selected, return the first clip as default
    const clipId = selectedClipId || clipSelectionData[0].id;
    const clip = clipSelectionData.find((c) => c.id === clipId);

    if (!clip) return clipSelectionData[0].id;

    return clipId;
  }

  // Step 6: Check if common alphabet exists in all three codes
  private checkCommonAlphabet(clipId: string): {
    hasCommon: boolean;
    commonChar?: string;
  } {
    const clip = clipSelectionData.find((c) => c.id === clipId);
    if (!clip) return { hasCommon: false };

    return hasCommonAlphabet(clip.codes);
  }

  // Step 7: Supplementary task - check total values of V & W
  private performSupplementaryCheck(selectedAnswers: string[]): {
    totalVs: number;
    totalWs: number;
    selectedValue: string;
  } {
    let totalVs = 0;
    let totalWs = 0;

    // Count V and W from all selected answers
    selectedAnswers.forEach((answer) => {
      for (const char of answer) {
        if (char === "V") totalVs++;
        if (char === "W") totalWs++;
      }
    });

    let selectedValue: string;
    if (totalVs >= 11 && totalWs >= 11) {
      // Select V/W with higher value
      selectedValue = totalVs > totalWs ? "V" : "W";
    } else if (totalVs >= 11) {
      selectedValue = "V";
    } else if (totalWs >= 11) {
      selectedValue = "W";
    } else {
      selectedValue = totalVs > totalWs ? "V" : "W";
    }

    return { totalVs, totalWs, selectedValue };
  }

  // Step 8: Put result in green box
  private putInGreenBox(supplementaryResult: string): void {
    // Add supplementary result to green box
    // This is handled in the final step
  }

  // Step 9: Combine all values for final result
  private combineForFinalResult(
    greenBoxResults: string[],
    pinkBoxResult: string,
    supplementaryResult: string
  ): string {
    // Put all values from pink, green, and purple boxes together in white box
    const allValues = [
      ...greenBoxResults,
      pinkBoxResult,
      supplementaryResult,
    ].filter((val) => val && val !== "PLACEHOLDER_CLIP");

    return allValues.join("");
  }

  // Main evaluation method
  public evaluate(
    selectedAnswers: string[],
    selectedClipId?: string
  ): EvaluationResult {
    // Step 1: Fill orange boxes
    const orangeBoxResults = this.fillOrangeBoxes(selectedAnswers);

    // Step 2: Create blue box pairs
    const blueBoxPairs = this.createBlueBoxPairs(orangeBoxResults);

    // Step 3: Fill yellow boxes
    const yellowBoxValues = this.fillYellowBoxes(blueBoxPairs);

    // Step 4: Categorize purple boxes and handle green box
    const { purpleBoxResults, greenBoxResults } =
      this.categorizePurpleAndGreen(yellowBoxValues);

    // Step 5: Choose favorite clip
    const pinkBoxResult = this.chooseFavoriteClip(selectedClipId);

    // Step 7: Supplementary check
    const supplementaryCheck = this.performSupplementaryCheck(selectedAnswers);

    // Step 9: Final result
    const finalResult = this.combineForFinalResult(
      greenBoxResults,
      pinkBoxResult,
      supplementaryCheck.selectedValue
    );

    return {
      orangeBoxResults,
      blueBoxPairs,
      yellowBoxValues,
      purpleBoxResults,
      greenBoxResults,
      pinkBoxResult,
      supplementaryCheck,
      finalResult,
    };
  }

  // Helper method to get a simplified result for display
  public getSimplifiedResult(
    selectedAnswers: string[],
    selectedClipId?: string
  ): {
    characterCounts: Record<string, number>;
    dominantTraits: string[];
    evaluationDetails: EvaluationResult;
  } {
    const evaluation = this.evaluate(selectedAnswers, selectedClipId);

    // Get dominant traits from orange box results
    const sortedTraits = Object.entries(evaluation.orangeBoxResults)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([char]) => char);

    return {
      characterCounts: evaluation.orangeBoxResults,
      dominantTraits: sortedTraits,
      evaluationDetails: evaluation,
    };
  }
}

// Export singleton instance
export const tangledEvaluator = new TangledEvaluator();

// Utility function for components
export const evaluateTest = (
  selectedAnswers: string[],
  selectedClipId?: string
) => {
  return tangledEvaluator.getSimplifiedResult(selectedAnswers, selectedClipId);
};
