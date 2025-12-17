import { SlideType, SlideData } from './types';

export const SLIDES: SlideData[] = [
  // TITLE
  {
    id: 1,
    type: SlideType.TITLE,
    title: "GRAMMAR TRAINING",
    subtitle: "MFP MODULE: MODALS & ADJECTIVES",
    content: "Meaning • Form • Pronunciation",
    visualId: "crest"
  },

  // --- MFP MODULE 1: ABILITY ---
  {
    id: 2,
    type: SlideType.MFP,
    title: "ABILITY",
    subtitle: "Can / Could / Manage to",
    visualId: "train_success",
    mfp: {
      meaning: {
        eng: "Power or skill to do something.",
        rus: "Способность или умение делать что-то.",
        uzb: "Biror narsa qilish qobiliyati yoki mahorati."
      },
      form: {
        formula: "S + can/could + V1",
        notes: "Use 'Manage to' for difficult specific tasks."
      },
      pronunciation: {
        word: "Can",
        ipa: "/kæn/ (weak) - /kænt/ (strong)"
      },
      examples: [
        "Harry can speak Parseltongue.",
        "Neville couldn't disarm the statue at first.",
        "Ron managed to drive the flying car."
      ]
    }
  },

  // --- MFP MODULE 2: OBLIGATION ---
  {
    id: 3,
    type: SlideType.MFP,
    title: "OBLIGATION",
    subtitle: "Must / Have to / Mustn't",
    visualId: "quiz_decree",
    mfp: {
      meaning: {
        eng: "Necessity or prohibition.",
        rus: "Необходимость или запрет.",
        uzb: "Zarurat yoki taqiqlash."
      },
      form: {
        formula: "S + must + V1",
        notes: "Must = Internal feeling. Have to = External rule."
      },
      pronunciation: {
        word: "Mustn't",
        ipa: "/ˈmʌs.ənt/ (silent 't')"
      },
      examples: [
        "I must study for my O.W.L.s.",
        "Students have to wear robes.",
        "You mustn't go into the Forbidden Forest."
      ]
    }
  },

  // --- MFP MODULE 3: ADJECTIVES ---
  {
    id: 4,
    type: SlideType.MFP,
    title: "COMPOUND ADJECTIVES",
    subtitle: "Describing Personality",
    visualId: "quiz_potion",
    mfp: {
      meaning: {
        eng: "Two words joined to describe a noun.",
        rus: "Два слова, описывающие существительное.",
        uzb: "Otni tasvirlash uchun birlashtirilgan ikki so'z."
      },
      form: {
        formula: "Word + Hyphen (-) + Word",
        notes: "Adjective/Noun + Past Participle"
      },
      pronunciation: {
        word: "Big-headed",
        ipa: "/ˌbɪɡˈhed.ɪd/"
      },
      examples: [
        "Lockhart is big-headed (arrogant).",
        "Hermione is quick-witted (smart).",
        "Filch is bad-tempered (angry)."
      ]
    }
  },

  // --- QUIZ (15 Questions) ---
  {
    id: 5,
    type: SlideType.QUIZ_SINGLE,
    title: "Question 1/15",
    visualId: "quiz_hourglass",
    quizQuestion: {
      id: 1,
      question: "Which word best completes the sentence: 'Harry _____ speak Parseltongue.'",
      options: ["can", "managed to", "succeeded in", "is able"],
      correctIndex: 0,
      explanation: "Can is used for general ability."
    }
  },
  {
    id: 6,
    type: SlideType.QUIZ_SINGLE,
    title: "Question 2/15",
    visualId: "train_fail",
    quizQuestion: {
      id: 2,
      question: "At first, Neville _____ perform the spell.",
      options: ["couldn't", "can't", "doesn't manage", "isn't able"],
      correctIndex: 0,
      explanation: "Couldn't is the past tense of can't."
    }
  },
  {
    id: 7,
    type: SlideType.QUIZ_SINGLE,
    title: "Question 3/15",
    visualId: "train_success",
    quizQuestion: {
      id: 3,
      question: "Eventually, Neville _____ disarming the statue.",
      options: ["could", "managed to", "succeeded in", "can"],
      correctIndex: 2,
      explanation: "Succeed in is followed by a verb+ing (gerund)."
    }
  },
  {
    id: 8,
    type: SlideType.QUIZ_SINGLE,
    title: "Question 4/15",
    visualId: "quiz_decree",
    quizQuestion: {
      id: 4,
      question: "Umbridge says: 'You _____ join any secret clubs.'",
      options: ["don't have to", "mustn't", "needn't", "couldn't"],
      correctIndex: 1,
      explanation: "Mustn't indicates prohibition (it is forbidden)."
    }
  },
  {
    id: 9,
    type: SlideType.QUIZ_SINGLE,
    title: "Question 5/15",
    visualId: "quiz_decree",
    quizQuestion: {
      id: 5,
      question: "Students _____ wear uniforms at Hogwarts (Rule).",
      options: ["must", "have to", "can", "should"],
      correctIndex: 1,
      explanation: "Have to is used for external rules/laws."
    }
  },
  {
    id: 10,
    type: SlideType.QUIZ_SINGLE,
    title: "Question 6/15",
    visualId: "quiz_potion",
    quizQuestion: {
      id: 6,
      question: "Lockhart thinks he is the best. He is _____.",
      options: ["open-minded", "big-headed", "absent-minded", "cold-blooded"],
      correctIndex: 1,
      explanation: "Big-headed means arrogant or conceited."
    }
  },
  {
    id: 11,
    type: SlideType.QUIZ_SINGLE,
    title: "Question 7/15",
    visualId: "quiz_potion",
    quizQuestion: {
      id: 7,
      question: "Filch shouts at everyone. He is _____.",
      options: ["kind-hearted", "bad-tempered", "easy-going", "well-behaved"],
      correctIndex: 1,
      explanation: "Bad-tempered means easily annoyed or angry."
    }
  },
  {
    id: 12,
    type: SlideType.QUIZ_SINGLE,
    title: "Question 8/15",
    visualId: "quiz_hourglass",
    quizQuestion: {
      id: 8,
      question: "Harry _____ save Ginny from the Chamber.",
      options: ["managed to", "could", "can", "succeed"],
      correctIndex: 0,
      explanation: "Managed to is for a specific difficult achievement in the past."
    }
  },
  {
    id: 13,
    type: SlideType.QUIZ_SINGLE,
    title: "Question 9/15",
    visualId: "quiz_decree",
    quizQuestion: {
      id: 9,
      question: "You _____ do the homework if you don't want to.",
      options: ["mustn't", "don't have to", "can't", "shouldn't"],
      correctIndex: 1,
      explanation: "Don't have to indicates lack of obligation."
    }
  },
  {
    id: 14,
    type: SlideType.QUIZ_SINGLE,
    title: "Question 10/15",
    visualId: "quiz_potion",
    quizQuestion: {
      id: 10,
      question: "Hermione learns very fast. She is _____.",
      options: ["slow-witted", "quick-witted", "narrow-minded", "stuck-up"],
      correctIndex: 1,
      explanation: "Quick-witted means able to think quickly; intelligent."
    }
  },
  {
    id: 15,
    type: SlideType.QUIZ_SINGLE,
    title: "Question 11/15",
    visualId: "train_believe",
    quizQuestion: {
      id: 11,
      question: "Ron _____ believe his eyes when he saw the spiders.",
      options: ["couldn't", "can't", "mustn't", "managed to"],
      correctIndex: 0,
      explanation: "Couldn't is used for past inability."
    }
  },
  {
    id: 16,
    type: SlideType.QUIZ_SINGLE,
    title: "Question 12/15",
    visualId: "quiz_decree",
    quizQuestion: {
      id: 12,
      question: "All visitors _____ sign in at the Ministry.",
      options: ["can", "must", "manage to", "able to"],
      correctIndex: 1,
      explanation: "Must is often used for written notices or strong obligation."
    }
  },
  {
    id: 17,
    type: SlideType.QUIZ_SINGLE,
    title: "Question 13/15",
    visualId: "quiz_potion",
    quizQuestion: {
      id: 13,
      question: "Draco only thinks about himself. He is _____.",
      options: ["self-centered", "warm-hearted", "level-headed", "strong-willed"],
      correctIndex: 0,
      explanation: "Self-centered means preoccupied with oneself."
    }
  },
  {
    id: 14,
    type: SlideType.QUIZ_SINGLE,
    title: "Question 14/15",
    visualId: "train_fail",
    quizQuestion: {
      id: 14,
      question: "I _____ find my wand anywhere!",
      options: ["couldn't", "can't", "managed to", "succeed in"],
      correctIndex: 1,
      explanation: "Can't implies present inability."
    }
  },
  {
    id: 19,
    type: SlideType.QUIZ_SINGLE,
    title: "Question 15/15",
    visualId: "map_reveal",
    quizQuestion: {
      id: 15,
      question: "We _____ be late for Potions, or Snape will deduct points.",
      options: ["don't have to", "mustn't", "needn't", "can"],
      correctIndex: 1,
      explanation: "Mustn't indicates it is necessary NOT to do something."
    }
  },

  // END
  {
    id: 20,
    type: SlideType.END,
    title: "TRAINING COMPLETE",
    subtitle: "Outstanding (O)",
    content: "You have mastered the basics.",
    visualId: "crest"
  }
];
