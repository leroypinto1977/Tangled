// Tangled Test Evaluation System
// Following the exact blueprint methodology from the PDF

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
  pinkBoxResult: string; // Step 5: Section selections from Table 2 (A, B, C)
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
  private categorizePurpleAndGreen(
    yellowBoxValues: Record<string, number>,
    orangeBoxResults: Record<string, number>
  ): {
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

    // For each pair, find the character with the highest value and place in appropriate section
    Object.entries(yellowBoxValues).forEach(([pair, difference]) => {
      const char1 = pair[0];
      const char2 = pair[1];
      const count1 = orangeBoxResults[char1] || 0;
      const count2 = orangeBoxResults[char2] || 0;

      // Get the character with the highest value
      const higherChar =
        count1 > count2 ? char1 : count2 > count1 ? char2 : char1;

      if (difference >= 5) {
        purpleBoxResults.section1.push(higherChar);
      } else if (difference >= 4) {
        purpleBoxResults.section2.push(higherChar);
      } else if (difference >= 3) {
        purpleBoxResults.section3.push(higherChar);
      }
    });

    // Step 4 continuation: Count alphabets in purple box
    const allPurpleChars = [
      ...purpleBoxResults.section1,
      ...purpleBoxResults.section2,
      ...purpleBoxResults.section3,
    ];

    // Count occurrences of each character
    const charCounts: Record<string, number> = {};
    allPurpleChars.forEach((char) => {
      charCounts[char] = (charCounts[char] || 0) + 1;
    });

    // Green box logic: if character count >=2, place "T"; otherwise place the character itself
    const greenBoxResults: string[] = [];
    Object.entries(charCounts).forEach(([char, count]) => {
      if (count >= 2) {
        greenBoxResults.push("T");
      } else {
        greenBoxResults.push(char);
      }
    });

    return { purpleBoxResults, greenBoxResults };
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

    // If both V and W counts are >= 11, place both "UV"
    if (totalVs >= 11 && totalWs >= 11) {
      selectedValue = "UV";
    } else if (totalVs >= 11) {
      selectedValue = "V";
    } else if (totalWs >= 11) {
      selectedValue = "W";
    } else {
      // If neither reaches 11, select the higher one
      selectedValue = totalVs > totalWs ? "V" : totalWs > totalVs ? "W" : "V";
    }

    return { totalVs, totalWs, selectedValue };
  }

  // Step 8: Put result in green box
  private putInGreenBox(_supplementaryResult: string): void {
    // Add supplementary result to green box
    // This is handled in the final step
  }

  // Step 9: Combine all values for final result
  private combineForFinalResult(
    greenBoxResults: string[],
    table2Results: string,
    supplementaryResult: string
  ): string {
    // Combine all values from green box, Table 2 (section selections), and supplementary
    const allValues = [
      ...greenBoxResults,
      ...table2Results.split(""), // Split string into individual characters
      ...supplementaryResult.split(""), // Split string into individual characters
    ].filter((val) => val && val.trim()); // Remove empty values

    // Find common letters or combine all unique values
    const uniqueValues = [...new Set(allValues)];

    return uniqueValues.join("");
  }

  // Main evaluation method
  public evaluate(
    selectedAnswers: string[],
    selectedClipId?: string,
    sectionSelections?: string[]
  ): EvaluationResult {
    // Step 1: Fill orange boxes
    const orangeBoxResults = this.fillOrangeBoxes(selectedAnswers);

    // Step 2: Create blue box pairs
    const blueBoxPairs = this.createBlueBoxPairs(orangeBoxResults);

    // Step 3: Fill yellow boxes
    const yellowBoxValues = this.fillYellowBoxes(blueBoxPairs);

    // Step 4: Categorize purple boxes and handle green box
    const { purpleBoxResults, greenBoxResults } = this.categorizePurpleAndGreen(
      yellowBoxValues,
      orangeBoxResults
    );

    // Step 5: Use section selections for Table 2 (A, B, C dark blue boxes)
    // These are the user's favorite selections from each section of the first 15 questions
    const table2Results = sectionSelections || [];

    // Step 7: Supplementary check
    const supplementaryCheck = this.performSupplementaryCheck(selectedAnswers);

    // Step 9: Final result - combine Table 2 results + green box + supplementary
    const finalResult = this.combineForFinalResult(
      greenBoxResults,
      table2Results.join(""), // Combine the section selections
      supplementaryCheck.selectedValue
    );

    return {
      orangeBoxResults,
      blueBoxPairs,
      yellowBoxValues,
      purpleBoxResults,
      greenBoxResults,
      pinkBoxResult: table2Results.join(""), // Use section selections instead of clip
      supplementaryCheck,
      finalResult,
    };
  }

  // Helper method to get a simplified result for display
  public getSimplifiedResult(
    selectedAnswers: string[],
    selectedClipId?: string,
    sectionSelections?: string[]
  ): {
    characterCounts: Record<string, number>;
    dominantTraits: string[];
    evaluationDetails: EvaluationResult;
  } {
    const evaluation = this.evaluate(
      selectedAnswers,
      selectedClipId,
      sectionSelections
    );

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
  selectedClipId?: string,
  sectionSelections?: string[]
) => {
  return tangledEvaluator.getSimplifiedResult(
    selectedAnswers,
    selectedClipId,
    sectionSelections
  );
};
