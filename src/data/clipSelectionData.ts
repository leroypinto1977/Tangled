// Table 2 Data for Tangled Test - Clip Selection Step
// This represents the clips that users can choose from in Step 5 of the evaluation

export interface ClipData {
  id: string;
  name: string;
  codes: [string, string, string]; // Three codes as shown in the blueprint
  description: string;
}

// Sample clip data - this would need to be populated with actual clip information
export const clipSelectionData: ClipData[] = [
  {
    id: "clip1",
    name: "Abstract Patterns",
    codes: ["ABC", "DEF", "GHI"],
    description: "Geometric and abstract visual patterns",
  },
  {
    id: "clip2",
    name: "Nature Scenes",
    codes: ["JKL", "MNO", "PQR"],
    description: "Natural landscapes and organic forms",
  },
  {
    id: "clip3",
    name: "Human Interactions",
    codes: ["STU", "VWX", "YZA"],
    description: "People and social situations",
  },
  {
    id: "clip4",
    name: "Urban Environments",
    codes: ["BCD", "EFG", "HIJ"],
    description: "City scenes and architectural elements",
  },
  {
    id: "clip5",
    name: "Technical Diagrams",
    codes: ["KLM", "NOP", "QRS"],
    description: "Charts, graphs, and technical illustrations",
  },
  {
    id: "clip6",
    name: "Artistic Expressions",
    codes: ["TUV", "WXY", "ZAB"],
    description: "Creative and artistic visual content",
  },
];

// Helper function to check if there's a common alphabet in all three codes
export const hasCommonAlphabet = (
  codes: [string, string, string]
): { hasCommon: boolean; commonChar?: string } => {
  const [code1, code2, code3] = codes;

  // Find common characters across all three codes
  for (const char of code1) {
    if (code2.includes(char) && code3.includes(char)) {
      return { hasCommon: true, commonChar: char };
    }
  }

  return { hasCommon: false };
};

// Get clip by ID
export const getClipById = (clipId: string): ClipData | undefined => {
  return clipSelectionData.find((clip) => clip.id === clipId);
};
