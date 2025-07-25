// Tangled Psychological Test - Question Data
// This file contains the mapping of each question option to its psychological value

export interface QuestionOption {
  id: string;
  value: string;
  imagePath: string;
}

export interface Question {
  id: number;
  question: string;
  options: QuestionOption[];
}

// Part 1: Questions 1-15 (4 options each: a, b, c, d)
export const part1Data: Question[] = [
  {
    id: 1,
    question: "Which image do you like?",
    options: [
      { id: "q1-a", value: "ADFHKQ", imagePath: "/images/part1/q1-a.png" },
      { id: "q1-b", value: "BGKM", imagePath: "/images/part1/q1-b.png" },
      { id: "q1-c", value: "BFHIR", imagePath: "/images/part1/q1-c.png" },
      { id: "q1-d", value: "EGILPS", imagePath: "/images/part1/q1-d.png" },
    ],
  },
  {
    id: 2,
    question: "Which image do you like?",
    options: [
      { id: "q2-a", value: "BEGP", imagePath: "/images/part1/q2-a.png" },
      { id: "q2-b", value: "AHL", imagePath: "/images/part1/q2-b.png" },
      { id: "q2-c", value: "C", imagePath: "/images/part1/q2-c.png" },
      { id: "q2-d", value: "LN", imagePath: "/images/part1/q2-d.png" },
    ],
  },
  {
    id: 3,
    question: "Which image do you like?",
    options: [
      { id: "q3-a", value: "BCGK", imagePath: "/images/part1/q3-a.png" },
      { id: "q3-b", value: "BFHIQR", imagePath: "/images/part1/q3-b.png" },
      { id: "q3-c", value: "HOP", imagePath: "/images/part1/q3-c.png" },
      { id: "q3-d", value: "ADGK", imagePath: "/images/part1/q3-d.png" },
    ],
  },
  {
    id: 4,
    question: "Which image do you like?",
    options: [
      { id: "q4-a", value: "BCGI", imagePath: "/images/part1/q4-a.png" },
      { id: "q4-b", value: "BDEKR", imagePath: "/images/part1/q4-b.png" },
      { id: "q4-c", value: "BCGKM", imagePath: "/images/part1/q4-c.png" },
      { id: "q4-d", value: "ACEGKP", imagePath: "/images/part1/q4-d.png" },
    ],
  },
  {
    id: 5,
    question: "Which image do you like?",
    options: [
      { id: "q5-a", value: "ADHIL", imagePath: "/images/part1/q5-a.png" },
      { id: "q5-b", value: "AD", imagePath: "/images/part1/q5-b.png" },
      { id: "q5-c", value: "FQR", imagePath: "/images/part1/q5-c.png" },
      { id: "q5-d", value: "BDGK", imagePath: "/images/part1/q5-d.png" },
    ],
  },
  {
    id: 6,
    question: "Which image do you like?",
    options: [
      { id: "q6-a", value: "BKN", imagePath: "/images/part1/q6-a.png" },
      { id: "q6-b", value: "CHK", imagePath: "/images/part1/q6-b.png" },
      { id: "q6-c", value: "ADFHKLQ", imagePath: "/images/part1/q6-c.png" },
      { id: "q6-d", value: "CG", imagePath: "/images/part1/q6-d.png" },
    ],
  },
  {
    id: 7,
    question: "Which image do you like?",
    options: [
      { id: "q7-a", value: "BDFGKQ", imagePath: "/images/part1/q7-a.png" },
      { id: "q7-b", value: "AHIL", imagePath: "/images/part1/q7-b.png" },
      { id: "q7-c", value: "BCEKMS", imagePath: "/images/part1/q7-c.png" },
      { id: "q7-d", value: "CS", imagePath: "/images/part1/q7-d.png" },
    ],
  },
  {
    id: 8,
    question: "Which image do you like?",
    options: [
      { id: "q8-a", value: "FHILR", imagePath: "/images/part1/q8-a.png" },
      { id: "q8-b", value: "BGK", imagePath: "/images/part1/q8-b.png" },
      { id: "q8-c", value: "DGIL", imagePath: "/images/part1/q8-c.png" },
      { id: "q8-d", value: "AGKO", imagePath: "/images/part1/q8-d.png" },
    ],
  },
  {
    id: 9,
    question: "Which image do you like?",
    options: [
      { id: "q9-a", value: "BCGMN", imagePath: "/images/part1/q9-a.png" },
      { id: "q9-b", value: "DEO", imagePath: "/images/part1/q9-b.png" },
      { id: "q9-c", value: "GIL", imagePath: "/images/part1/q9-c.png" },
      { id: "q9-d", value: "DEKP", imagePath: "/images/part1/q9-d.png" },
    ],
  },
  {
    id: 10,
    question: "Which image do you like?",
    options: [
      { id: "q10-a", value: "BCG", imagePath: "/images/part1/q10-a.png" },
      { id: "q10-b", value: "DFHILR", imagePath: "/images/part1/q10-b.png" },
      { id: "q10-c", value: "BHKM", imagePath: "/images/part1/q10-c.png" },
      { id: "q10-d", value: "EHOP", imagePath: "/images/part1/q10-d.png" },
    ],
  },
  {
    id: 11,
    question: "Which image do you like?",
    options: [
      { id: "q11-a", value: "BDHKMO", imagePath: "/images/part1/q11-a.png" },
      { id: "q11-b", value: "CFHKLR", imagePath: "/images/part1/q11-b.png" },
      { id: "q11-c", value: "CH", imagePath: "/images/part1/q11-c.png" },
      { id: "q11-d", value: "ACG", imagePath: "/images/part1/q11-d.png" },
    ],
  },
  {
    id: 12,
    question: "Which image do you like?",
    options: [
      { id: "q12-a", value: "EGILS", imagePath: "/images/part1/q12-a.png" },
      { id: "q12-b", value: "AIL", imagePath: "/images/part1/q12-b.png" },
      { id: "q12-c", value: "FHILR", imagePath: "/images/part1/q12-c.png" },
      { id: "q12-d", value: "BGKM", imagePath: "/images/part1/q12-d.png" },
    ],
  },
  {
    id: 13,
    question: "Which image do you like?",
    options: [
      { id: "q13-a", value: "BCKM", imagePath: "/images/part1/q13-a.png" },
      { id: "q13-b", value: "CGKLN", imagePath: "/images/part1/q13-b.png" },
      { id: "q13-c", value: "CH", imagePath: "/images/part1/q13-c.png" },
      { id: "q13-d", value: "AEGKS", imagePath: "/images/part1/q13-d.png" },
    ],
  },
  {
    id: 14,
    question: "Which image do you like?",
    options: [
      { id: "q14-a", value: "BKN", imagePath: "/images/part1/q14-a.png" },
      { id: "q14-b", value: "ADGK", imagePath: "/images/part1/q14-b.png" },
      { id: "q14-c", value: "ADHK", imagePath: "/images/part1/q14-c.png" },
      { id: "q14-d", value: "BCHI", imagePath: "/images/part1/q14-d.png" },
    ],
  },
  {
    id: 15,
    question: "Which image do you like?",
    options: [
      { id: "q15-a", value: "DHQS", imagePath: "/images/part1/q15-a.png" },
      { id: "q15-b", value: "ADEHILP", imagePath: "/images/part1/q15-b.png" },
      { id: "q15-c", value: "BCGK", imagePath: "/images/part1/q15-c.png" },
      { id: "q15-d", value: "AGK", imagePath: "/images/part1/q15-d.png" },
    ],
  },
];

// Part 2: Questions 16-29 (2 options each: U, V)
export const part2Data: Question[] = [
  {
    id: 16,
    question: "Which image do you like?",
    options: [
      { id: "q16-v", value: "V", imagePath: "/images/part2/q16-v.png" },
      { id: "q16-w", value: "W", imagePath: "/images/part2/q16-w.png" },
    ],
  },
  {
    id: 17,
    question: "Which image do you like?",
    options: [
      { id: "q17-v", value: "V", imagePath: "/images/part2/q17-v.png" },
      { id: "q17-w", value: "W", imagePath: "/images/part2/q17-w.png" },
    ],
  },
  {
    id: 18,
    question: "Which image do you like?",
    options: [
      { id: "q18-v", value: "W", imagePath: "/images/part2/q18-v.png" },
      { id: "q18-w", value: "V", imagePath: "/images/part2/q18-w.png" },
    ],
  },
  {
    id: 19,
    question: "Which image do you like?",
    options: [
      { id: "q19-v", value: "V", imagePath: "/images/part2/q19-v.png" },
      { id: "q19-w", value: "W", imagePath: "/images/part2/q19-w.png" },
    ],
  },
  {
    id: 20,
    question: "Which image do you like?",
    options: [
      { id: "q20-v", value: "V", imagePath: "/images/part2/q20-v.png" },
      { id: "q20-w", value: "W", imagePath: "/images/part2/q20-w.png" },
    ],
  },
  {
    id: 21,
    question: "Which image do you like?",
    options: [
      { id: "q21-v", value: "V", imagePath: "/images/part2/q21-v.png" },
      { id: "q21-w", value: "W", imagePath: "/images/part2/q21-w.png" },
    ],
  },
  {
    id: 22,
    question: "Which image do you like?",
    options: [
      { id: "q22-v", value: "V", imagePath: "/images/part2/q22-v.png" },
      { id: "q22-w", value: "W", imagePath: "/images/part2/q22-w.png" },
    ],
  },
  {
    id: 23,
    question: "Which image do you like?",
    options: [
      { id: "q23-v", value: "V", imagePath: "/images/part2/q23-v.png" },
      { id: "q23-w", value: "W", imagePath: "/images/part2/q23-w.png" },
    ],
  },
  {
    id: 24,
    question: "Which image do you like?",
    options: [
      { id: "q24-v", value: "W", imagePath: "/images/part2/q24-v.png" },
      { id: "q24-w", value: "V", imagePath: "/images/part2/q24-w.png" },
    ],
  },
  {
    id: 25,
    question: "Which image do you like?",
    options: [
      { id: "q25-v", value: "W", imagePath: "/images/part2/q25-v.png" },
      { id: "q25-w", value: "V", imagePath: "/images/part2/q25-w.png" },
    ],
  },
  {
    id: 26,
    question: "Which image do you like?",
    options: [
      { id: "q26-v", value: "V", imagePath: "/images/part2/q26-v.png" },
      { id: "q26-w", value: "W", imagePath: "/images/part2/q26-w.png" },
    ],
  },
  {
    id: 27,
    question: "Which image do you like?",
    options: [
      { id: "q27-v", value: "W", imagePath: "/images/part2/q27-v.png" },
      { id: "q27-w", value: "V", imagePath: "/images/part2/q27-w.png" },
    ],
  },
  {
    id: 28,
    question: "Which image do you like?",
    options: [
      { id: "q28-v", value: "V", imagePath: "/images/part2/q28-v.png" },
      { id: "q28-w", value: "W", imagePath: "/images/part2/q28-w.png" },
    ],
  },
  {
    id: 29,
    question: "Which image do you like?",
    options: [
      { id: "q29-v", value: "W", imagePath: "/images/part2/q29-v.png" },
      { id: "q29-w", value: "V", imagePath: "/images/part2/q29-w.png" },
    ],
  },
];

// Combined data for easy access
export const allQuestions: Question[] = [...part1Data, ...part2Data];

// Helper function to get question by ID
export const getQuestionById = (id: number): Question | undefined => {
  return allQuestions.find((q) => q.id === id);
};

// Helper function to get option value by question ID and option ID
export const getOptionValue = (
  questionId: number,
  optionId: string
): string | undefined => {
  const question = getQuestionById(questionId);
  const option = question?.options.find((opt) => opt.id === optionId);
  return option?.value;
};

// Export default for convenience
const questionDataExports = {
  part1Data,
  part2Data,
  allQuestions,
  getQuestionById,
  getOptionValue,
};

export default questionDataExports;
