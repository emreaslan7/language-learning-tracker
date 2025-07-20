import { VocabularyCard } from "./types";

// Spaced Repetition System - Calculates next review date based on performance
export class SpacedRepetitionSystem {
  private static readonly INTERVALS = [1, 3, 7, 14, 30, 60, 120]; // Days

  static calculateNextReview(
    currentInterval: number,
    difficulty: 1 | 2 | 3 | 4 | 5,
    performance: "excellent" | "good" | "fair" | "poor"
  ): Date {
    let nextInterval = currentInterval;

    switch (performance) {
      case "excellent":
        nextInterval = Math.min(currentInterval * 2, 120);
        break;
      case "good":
        nextInterval = Math.min(currentInterval * 1.5, 120);
        break;
      case "fair":
        nextInterval = Math.max(currentInterval * 0.8, 1);
        break;
      case "poor":
        nextInterval = 1;
        break;
    }

    // Adjust based on difficulty
    const difficultyMultiplier = {
      1: 1.2,
      2: 1.1,
      3: 1.0,
      4: 0.9,
      5: 0.8,
    };

    nextInterval = Math.round(nextInterval * difficultyMultiplier[difficulty]);

    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + nextInterval);

    return nextReviewDate;
  }

  static getInitialInterval(difficulty: 1 | 2 | 3 | 4 | 5): number {
    const baseInterval = {
      1: 3,
      2: 2,
      3: 1,
      4: 1,
      5: 1,
    };

    return baseInterval[difficulty];
  }
}

// Vocabulary Card Study Methods
export class VocabularyStudyMethods {
  // Multiple choice question generator
  static generateMultipleChoice(
    correctWord: VocabularyCard,
    allWords: VocabularyCard[],
    type: "word-to-definition" | "definition-to-word" = "word-to-definition"
  ): {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  } {
    // Get wrong options from same level
    const wrongOptions = allWords
      .filter(
        (word) =>
          word.id !== correctWord.id &&
          word.level === correctWord.level &&
          word.partOfSpeech === correctWord.partOfSpeech
      )
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    if (type === "word-to-definition") {
      const options = [
        correctWord.definition,
        ...wrongOptions.map((word) => word.definition),
      ].sort(() => 0.5 - Math.random());

      return {
        question: `What does "${correctWord.word}" mean?`,
        options,
        correctAnswer: correctWord.definition,
        explanation: `"${correctWord.word}" means: ${correctWord.definition}\n\nExample: ${correctWord.examples[0]}`,
      };
    } else {
      const options = [
        correctWord.word,
        ...wrongOptions.map((word) => word.word),
      ].sort(() => 0.5 - Math.random());

      return {
        question: `Which word means: "${correctWord.definition}"?`,
        options,
        correctAnswer: correctWord.word,
        explanation: `The word "${correctWord.word}" means: ${correctWord.definition}\n\nExample: ${correctWord.examples[0]}`,
      };
    }
  }

  // Fill in the blank generator
  static generateFillInTheBlank(word: VocabularyCard): {
    question: string;
    correctAnswer: string;
    hint: string;
    fullSentence: string;
  } {
    const example =
      word.examples[Math.floor(Math.random() * word.examples.length)];
    const wordInExample = word.word;
    const blankedSentence = example.replace(
      new RegExp(`\\b${wordInExample}\\b`, "gi"),
      "______"
    );

    return {
      question: `Fill in the blank: ${blankedSentence}`,
      correctAnswer: wordInExample,
      hint: `${word.partOfSpeech} - ${word.definition}`,
      fullSentence: example,
    };
  }

  // Sentence completion generator
  static generateSentenceCompletion(
    word: VocabularyCard,
    allWords: VocabularyCard[]
  ): {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  } {
    const example = word.examples[0];
    const contextWords = example.split(" ");
    const wordIndex = contextWords.findIndex(
      (w) => w.toLowerCase().replace(/[.,!?;]/, "") === word.word.toLowerCase()
    );

    if (wordIndex === -1) {
      return this.generateMultipleChoice(word, allWords);
    }

    // Create context before the word
    const contextBefore = contextWords.slice(0, wordIndex).join(" ");
    const contextAfter = contextWords.slice(wordIndex + 1).join(" ");

    const wrongOptions = allWords
      .filter(
        (w) =>
          w.id !== word.id &&
          w.level === word.level &&
          w.partOfSpeech === word.partOfSpeech
      )
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const options = [word.word, ...wrongOptions.map((w) => w.word)].sort(
      () => 0.5 - Math.random()
    );

    return {
      question: `Complete the sentence: "${contextBefore} ______ ${contextAfter}"`,
      options,
      correctAnswer: word.word,
      explanation: `The correct word is "${word.word}" which means: ${word.definition}`,
    };
  }

  // Word association generator
  static generateWordAssociation(
    word: VocabularyCard,
    allWords: VocabularyCard[]
  ): {
    question: string;
    pairs: { word: string; definition: string }[];
    correctPairs: { [key: string]: string };
  } {
    const relatedWords = allWords
      .filter(
        (w) =>
          w.level === word.level &&
          w.tags.some((tag) => word.tags.includes(tag))
      )
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);

    const wordsToMatch = [word, ...relatedWords];
    const shuffledDefinitions = [...wordsToMatch.map((w) => w.definition)].sort(
      () => 0.5 - Math.random()
    );

    const correctPairs: { [key: string]: string } = {};
    wordsToMatch.forEach((w) => {
      correctPairs[w.word] = w.definition;
    });

    return {
      question: "Match the words with their definitions:",
      pairs: wordsToMatch.map((w) => ({
        word: w.word,
        definition: w.definition,
      })),
      correctPairs,
    };
  }

  // Pronunciation practice
  static generatePronunciationPractice(word: VocabularyCard): {
    word: string;
    phonetic: string;
    audioHint: string;
    difficulty: string;
  } {
    return {
      word: word.word,
      phonetic: word.phonetic || "",
      audioHint: `Listen and repeat: "${word.word}"`,
      difficulty:
        word.difficulty <= 2
          ? "Easy"
          : word.difficulty <= 4
          ? "Medium"
          : "Hard",
    };
  }

  // Contextual usage generator
  static generateContextualUsage(
    word: VocabularyCard,
    allWords: VocabularyCard[]
  ): {
    question: string;
    scenarios: string[];
    correctScenario: string;
    explanation: string;
  } {
    const correctScenario = word.examples[0];

    const wrongScenarios = allWords
      .filter((w) => w.id !== word.id && w.level === word.level)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map((w) => w.examples[0]);

    const scenarios = [correctScenario, ...wrongScenarios].sort(
      () => 0.5 - Math.random()
    );

    return {
      question: `In which scenario is "${word.word}" used correctly?`,
      scenarios,
      correctScenario,
      explanation: `"${word.word}" means ${word.definition}, so it fits best in the context: "${correctScenario}"`,
    };
  }
}

export default VocabularyStudyMethods;
