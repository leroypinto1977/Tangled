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
      { id: "q1-a", value: "ADFHKQ", imagePath: "/images/part1/q1-a.svg" },
      { id: "q1-b", value: "BGKM", imagePath: "/images/part1/q1-b.svg" },
      { id: "q1-c", value: "BFHIR", imagePath: "/images/part1/q1-c.svg" },
      { id: "q1-d", value: "EGILPS", imagePath: "/images/part1/q1-d.svg" },
    ],
  },
  {
    id: 2,
    question: "Which image do you like?",
    options: [
      { id: "q2-a", value: "BEGP", imagePath: "/images/part1/q2-a.svg" },
      { id: "q2-b", value: "AHL", imagePath: "/images/part1/q2-b.svg" },
      { id: "q2-c", value: "C", imagePath: "/images/part1/q2-c.svg" },
      { id: "q2-d", value: "LN", imagePath: "/images/part1/q2-d.svg" },
    ],
  },
  {
    id: 3,
    question: "Which image do you like?",
    options: [
      { id: "q3-a", value: "BCGK", imagePath: "/images/part1/q3-a.svg" },
      { id: "q3-b", value: "BFHIQR", imagePath: "/images/part1/q3-b.svg" },
      { id: "q3-c", value: "HOP", imagePath: "/images/part1/q3-c.svg" },
      { id: "q3-d", value: "ADGK", imagePath: "/images/part1/q3-d.svg" },
    ],
  },
  {
    id: 4,
    question: "Which image do you like?",
    options: [
      { id: "q4-a", value: "BCGI", imagePath: "/images/part1/q4-a.svg" },
      { id: "q4-b", value: "BDEKR", imagePath: "/images/part1/q4-b.svg" },
      { id: "q4-c", value: "BCGKM", imagePath: "/images/part1/q4-c.svg" },
      { id: "q4-d", value: "ACEGKP", imagePath: "/images/part1/q4-d.svg" },
    ],
  },
  {
    id: 5,
    question: "Which image do you like?",
    options: [
      { id: "q5-a", value: "ADHIL", imagePath: "/images/part1/q5-a.svg" },
      { id: "q5-b", value: "AD", imagePath: "/images/part1/q5-b.svg" },
      { id: "q5-c", value: "FQR", imagePath: "/images/part1/q5-c.svg" },
      { id: "q5-d", value: "BDGK", imagePath: "/images/part1/q5-d.svg" },
    ],
  },
  {
    id: 6,
    question: "Which image do you like?",
    options: [
      { id: "q6-a", value: "BKN", imagePath: "/images/part1/q6-a.svg" },
      { id: "q6-b", value: "BDFGKQ", imagePath: "/images/part1/q6-b.svg" },
      { id: "q6-c", value: "FHILR", imagePath: "/images/part1/q6-c.svg" },
      { id: "q6-d", value: "BCGMN", imagePath: "/images/part1/q6-d.svg" },
    ],
  },
  {
    id: 7,
    question: "Which image do you like?",
    options: [
      { id: "q7-a", value: "BCG", imagePath: "/images/part1/q7-a.svg" },
      { id: "q7-b", value: "CHK", imagePath: "/images/part1/q7-b.svg" },
      { id: "q7-c", value: "AHIL", imagePath: "/images/part1/q7-c.svg" },
      { id: "q7-d", value: "BGK", imagePath: "/images/part1/q7-d.svg" },
    ],
  },
  {
    id: 8,
    question: "Which image do you like?",
    options: [
      { id: "q8-a", value: "DEO", imagePath: "/images/part1/q8-a.svg" },
      { id: "q8-b", value: "DFHILR", imagePath: "/images/part1/q8-b.svg" },
      { id: "q8-c", value: "ADFHKLQ", imagePath: "/images/part1/q8-c.svg" },
      { id: "q8-d", value: "BCEKMS", imagePath: "/images/part1/q8-d.svg" },
    ],
  },
  {
    id: 9,
    question: "Which image do you like?",
    options: [
      { id: "q9-a", value: "DGIL", imagePath: "/images/part1/q9-a.svg" },
      { id: "q9-b", value: "GIL", imagePath: "/images/part1/q9-b.svg" },
      { id: "q9-c", value: "BHKM", imagePath: "/images/part1/q9-c.svg" },
      { id: "q9-d", value: "CG", imagePath: "/images/part1/q9-d.svg" },
    ],
  },
  {
    id: 10,
    question: "Which image do you like?",
    options: [
      { id: "q10-a", value: "CS", imagePath: "/images/part1/q10-a.svg" },
      { id: "q10-b", value: "AGKO", imagePath: "/images/part1/q10-b.svg" },
      { id: "q10-c", value: "DEKP", imagePath: "/images/part1/q10-c.svg" },
      { id: "q10-d", value: "EHOP", imagePath: "/images/part1/q10-d.svg" },
    ],
  },
  {
    id: 11,
    question: "Which image do you like?",
    options: [
      { id: "q11-a", value: "BDHKMO", imagePath: "/images/part1/q11-a.svg" },
      { id: "q11-b", value: "CFHKLR", imagePath: "/images/part1/q11-b.svg" },
      { id: "q11-c", value: "EGILS", imagePath: "/images/part1/q11-c.svg" },
      { id: "q11-d", value: "AIL", imagePath: "/images/part1/q11-d.svg" },
    ],
  },
  {
    id: 12,
    question: "Which image do you like?",
    options: [
      { id: "q12-a", value: "BCKM", imagePath: "/images/part1/q12-a.svg" },
      { id: "q12-b", value: "CGKLN", imagePath: "/images/part1/q12-b.svg" },
      { id: "q12-c", value: "BKN", imagePath: "/images/part1/q12-c.svg" },
      { id: "q12-d", value: "ADGK", imagePath: "/images/part1/q12-d.svg" },
    ],
  },
  {
    id: 13,
    question: "Which image do you like?",
    options: [
      { id: "q13-a", value: "DHQS", imagePath: "/images/part1/q13-a.svg" },
      { id: "q13-b", value: "ADEHILP", imagePath: "/images/part1/q13-b.svg" },
      { id: "q13-c", value: "CH", imagePath: "/images/part1/q13-c.svg" },
      { id: "q13-d", value: "FHILR", imagePath: "/images/part1/q13-d.svg" },
    ],
  },
  {
    id: 14,
    question: "Which image do you like?",
    options: [
      { id: "q14-a", value: "CH", imagePath: "/images/part1/q14-a.svg" },
      { id: "q14-b", value: "ADHK", imagePath: "/images/part1/q14-b.svg" },
      { id: "q14-c", value: "BCGK", imagePath: "/images/part1/q14-c.svg" },
      { id: "q14-d", value: "ACG", imagePath: "/images/part1/q14-d.svg" },
    ],
  },
  {
    id: 15,
    question: "Which image do you like?",
    options: [
      { id: "q15-a", value: "BGKM", imagePath: "/images/part1/q15-a.svg" },
      { id: "q15-b", value: "AEGKS", imagePath: "/images/part1/q15-b.svg" },
      { id: "q15-c", value: "BCHI", imagePath: "/images/part1/q15-c.svg" },
      { id: "q15-d", value: "AGK", imagePath: "/images/part1/q15-d.svg" },
    ],
  },
];

// Part 2: Questions 16-29 (2 options each: U, V)
export const part2Data: Question[] = [
  {
    id: 16,
    question: "Which image do you like?",
    options: [
      { id: "q16-a", value: "U", imagePath: "/images/part2/q16-a.svg" },
      { id: "q16-b", value: "V", imagePath: "/images/part2/q16-b.svg" },
    ],
  },
  {
    id: 17,
    question: "Which image do you like?",
    options: [
      { id: "q17-a", value: "U", imagePath: "/images/part2/q17-a.svg" },
      { id: "q17-b", value: "V", imagePath: "/images/part2/q17-b.svg" },
    ],
  },
  {
    id: 18,
    question: "Which image do you like?",
    options: [
      { id: "q18-a", value: "U", imagePath: "/images/part2/q18-a.svg" },
      { id: "q18-b", value: "V", imagePath: "/images/part2/q18-b.svg" },
    ],
  },
  {
    id: 19,
    question: "Which image do you like?",
    options: [
      { id: "q19-a", value: "U", imagePath: "/images/part2/q19-a.svg" },
      { id: "q19-b", value: "V", imagePath: "/images/part2/q19-b.svg" },
    ],
  },
  {
    id: 20,
    question: "Which image do you like?",
    options: [
      { id: "q20-a", value: "U", imagePath: "/images/part2/q20-a.svg" },
      { id: "q20-b", value: "V", imagePath: "/images/part2/q20-b.svg" },
    ],
  },
  {
    id: 21,
    question: "Which image do you like?",
    options: [
      { id: "q21-a", value: "U", imagePath: "/images/part2/q21-a.svg" },
      { id: "q21-b", value: "V", imagePath: "/images/part2/q21-b.svg" },
    ],
  },
  {
    id: 22,
    question: "Which image do you like?",
    options: [
      { id: "q22-a", value: "U", imagePath: "/images/part2/q22-a.svg" },
      { id: "q22-b", value: "V", imagePath: "/images/part2/q22-b.svg" },
    ],
  },
  {
    id: 23,
    question: "Which image do you like?",
    options: [
      { id: "q23-a", value: "U", imagePath: "/images/part2/q23-a.svg" },
      { id: "q23-b", value: "V", imagePath: "/images/part2/q23-b.svg" },
    ],
  },
  {
    id: 24,
    question: "Which image do you like?",
    options: [
      { id: "q24-a", value: "U", imagePath: "/images/part2/q24-a.svg" },
      { id: "q24-b", value: "V", imagePath: "/images/part2/q24-b.svg" },
    ],
  },
  {
    id: 25,
    question: "Which image do you like?",
    options: [
      { id: "q25-a", value: "U", imagePath: "/images/part2/q25-a.svg" },
      { id: "q25-b", value: "V", imagePath: "/images/part2/q25-b.svg" },
    ],
  },
  {
    id: 26,
    question: "Which image do you like?",
    options: [
      { id: "q26-a", value: "U", imagePath: "/images/part2/q26-a.svg" },
      { id: "q26-b", value: "V", imagePath: "/images/part2/q26-b.svg" },
    ],
  },
  {
    id: 27,
    question: "Which image do you like?",
    options: [
      { id: "q27-a", value: "U", imagePath: "/images/part2/q27-a.svg" },
      { id: "q27-b", value: "V", imagePath: "/images/part2/q27-b.svg" },
    ],
  },
  {
    id: 28,
    question: "Which image do you like?",
    options: [
      { id: "q28-a", value: "U", imagePath: "/images/part2/q28-a.svg" },
      { id: "q28-b", value: "V", imagePath: "/images/part2/q28-b.svg" },
    ],
  },
  {
    id: 29,
    question: "Which image do you like?",
    options: [
      { id: "q29-a", value: "U", imagePath: "/images/part2/q29-a.svg" },
      { id: "q29-b", value: "V", imagePath: "/images/part2/q29-b.svg" },
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
export default {
  part1Data,
  part2Data,
  allQuestions,
  getQuestionById,
  getOptionValue,
};
