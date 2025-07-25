// Personality interpretations based on the Tangled test results
export interface PersonalityTrait {
  name: string;
  description: string;
}

export const personalityInterpretations: Record<string, PersonalityTrait> = {
  A: {
    name: "Ambitious",
    description:
      "You intend to succeed. You want to rise to the top and be admired by others, indeed perhaps be in charge of them too.",
  },
  B: {
    name: "Modest",
    description:
      "You are undemanding. You do not aspire to power or fame: maybe you lack self confidence - or maybe you are simply comfortable as you are.",
  },
  C: {
    name: "Conservative/Sceptical",
    description:
      "You worry all the time. You approach anything new or different with scepticism, you stay out of danger, and you dislike adventures or risk. Reserved and unforthcoming, you are mistrustful of others, keeping your distance or shutting them out entirely.",
  },
  D: {
    name: "Progressive/Open-hearted",
    description:
      "You love a challenge. You are optimistic about the future and approach situations energetically. You have no trouble trusting other people; you are generous in your interactions, welcoming everyone, even strangers, with open arms.",
  },
  E: {
    name: "Primitive",
    description:
      "You have a tendency to be boorish and coarse, and don't always manage to strike the right tone.",
  },
  F: {
    name: "Cultivated",
    description:
      "You have a very sensitive, sophisticated, cultured and generally distinguished character. You set high aesthetic standards and you fulfil them.",
  },
  G: {
    name: "Traditional",
    description:
      "You avoid change wherever possible and wish for everything to remain the same.",
  },
  H: {
    name: "Metamorphic",
    description:
      "You make sweeping changes without hesitation. You are happy to throw out the old to make room for the new.",
  },
  I: {
    name: "Robust",
    description:
      "You are not intimidated by difficult, complicated or fraught situations. You rise to all challenges - you may even enjoy them.",
  },
  J: {
    name: "Not Available",
    description: "This letter is not used in the evaluation system.",
  },
  K: {
    name: "Fair",
    description:
      "You dislike chaos, confusion and messiness. You want things to be clear, open and upfront.",
  },
  L: {
    name: "Regal/Energetic",
    description:
      "You are strong, robust and resilient. You find positive solutions to problems and have plenty of stamina. Dignity and self-possession are important to you; you cultivate inner calm and like to maintain a broad overview. You aren't interested in petty rivalries and power struggles. Most of the time you enjoy being above it all.",
  },
  M: {
    name: "Asthenic/Subordinate",
    description:
      "You tend to be fragile, powerless and timid. You tire quickly, you are often clumsy and careless, lack a strong will, and generally need protection and support. You rely on having a solid roof over your head.",
  },
  N: {
    name: "Phlegmatic",
    description:
      "You are easy-going and enjoy things. Nothing gets you in a flap, and you seldom lose your cool. You stay calm, take your time and like to relax.",
  },
  O: {
    name: "Active",
    description:
      "You are bursting with energy, dynamic and quick to act. You get things moving.",
  },
  P: {
    name: "Hostile",
    description:
      "You are rancorous, resentful and antagonistic. You tend to compete with others and sometimes come to blows. Everyone is a potential enemy for you.",
  },
  Q: {
    name: "Amicable",
    description:
      "You are well disposed towards others. You respect their achievements, never begrudge them their success and you are happy to help when you can.",
  },
  R: {
    name: "Elegant",
    description:
      "You express your feelings, desires and frustrations in brilliant, elegant and playful ways, whether in how you communicate with others or in creative and artistic pursuits.",
  },
  S: {
    name: "Primal",
    description:
      "You do not always have the ability or concentration to channel your emotions and desires in ways that other people accept or expect. Your analysis of situations lacks nuance and your responses are simplistic. This may be a result of your present circumstances or your current frame of mind.",
  },
  T: {
    name: "Homogenous",
    description:
      "You are consistent and dependable in your preferences; you know what you want. You may be somewhat one-sided or blinkered in your opinions, but you know your own mind.",
  },
  U: {
    name: "Heterogeneous",
    description:
      "You have varied tastes, you are open to new experiences and are flexible in your outlook.",
  },
  V: {
    name: "Affective",
    description:
      "You wear your heart on your sleeve and express your feelings openly or even effusively - perhaps excessively so. Color plays an important role for you; you seek to make dark or drab environments blossom. This could be your way of banishing boredom or shuffling out negative thoughts.",
  },
  W: {
    name: "Rational",
    description:
      "You approach most things logically and objectively and tend to keep your feelings in check. You like things to be systematic and orderly. The uncertainty of emotions makes you nervous.",
  },
  VW: {
    name: "Affective / Rational",
    description:
      "You usually maintain a balance between emotion and logic. You express your feelings adequately and you are able to integrate them into your judgements and decisions. Consequently your opinions and positions seem reasonable and fair.",
  },
};

// Helper function to get personality trait by letter
export function getPersonalityTrait(letter: string): PersonalityTrait | null {
  return personalityInterpretations[letter.toUpperCase()] || null;
}

// Helper function to get multiple traits
export function getPersonalityTraits(letters: string[]): PersonalityTrait[] {
  return letters
    .map((letter) => getPersonalityTrait(letter))
    .filter((trait): trait is PersonalityTrait => trait !== null);
}
