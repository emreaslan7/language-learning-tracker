// Oxford 3000 Vocabulary - Generated from CSV with Enhanced Definitions
export { a1Words, a1WordsStats } from "./a1-words-oxford";
export { a2Words, a2WordsStats } from "./a2-words-oxford";
export { b1Words, b1WordsStats } from "./b1-words-oxford";
export { b2Words, b2WordsStats } from "./b2-words-oxford";
export { c1Words, c1WordsStats } from "./c1-words-oxford";

// Combined export for all Oxford 3000 words
import { VocabularyCard } from "./types";
import { a1Words } from "./a1-words-oxford";
import { a2Words } from "./a2-words-oxford";
import { b1Words } from "./b1-words-oxford";
import { b2Words } from "./b2-words-oxford";
import { c1Words } from "./c1-words-oxford";

export const allOxfordWords: VocabularyCard[] = [
  ...a1Words,
  ...a2Words,
  ...b1Words,
  ...b2Words,
  ...c1Words
];

export const oxfordStats = {
  totalWords: 3805,
  byLevel: {
    a1: 1076,
    a2: 990,
    b1: 902,
    b2: 837,
    c1: 0
  }
};
