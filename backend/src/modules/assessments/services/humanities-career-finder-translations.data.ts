export interface SectionTranslationSeed {
  sectionCode: string;
  languageCode: string;
  name: string;
  description: string;
}

export interface DimensionTranslationSeed {
  dimensionCode: string;
  languageCode: string;
  name: string;
}

export interface OptionTranslationSeed {
  optionKey: string;
  languageCode: string;
  optionText: string;
}

export interface McqOptionTranslationSeed {
  questionNumber: number;
  optionKey: string;
  languageCode: string;
  optionText: string;
}

export interface QuestionTranslationSeed {
  questionNumber: number;
  languageCode: string;
  questionText: string;
}

export const HUMANITIES_CAREER_FINDER_SECTION_TRANSLATIONS: SectionTranslationSeed[] = [
  {
    "sectionCode": "SEC_HUMAN_BEHAVIOUR",
    "languageCode": "ml",
    "name": "\u0d2e\u0d28\u0d41\u0d37\u0d4d\u0d2f \u0d38\u0d4d\u0d35\u0d2d\u0d3e\u0d35\u0d35\u0d41\u0d02 \u0d38\u0d39\u0d3e\u0d28\u0d41\u0d2d\u0d42\u0d24\u0d3f\u0d2f\u0d41\u0d02 (Human Behaviour & Empathy)",
    "description": "\u0d2e\u0d28\u0d41\u0d37\u0d4d\u0d2f\u0d7c, \u0d05\u0d35\u0d30\u0d41\u0d1f\u0d46 \u0d2a\u0d46\u0d30\u0d41\u0d2e\u0d3e\u0d31\u0d4d\u0d31\u0d02, \u0d35\u0d3f\u0d15\u0d3e\u0d30\u0d19\u0d4d\u0d19\u0d7e, \u0d2c\u0d28\u0d4d\u0d27\u0d19\u0d4d\u0d19\u0d7e, \u0d15\u0d4d\u0d37\u0d47\u0d2e\u0d02 \u0d0e\u0d28\u0d4d\u0d28\u0d3f\u0d35\u0d2f\u0d3f\u0d32\u0d41\u0d33\u0d4d\u0d33 \u0d24\u0d3e\u0d7d\u0d2a\u0d4d\u0d2a\u0d30\u0d4d\u0d2f\u0d02."
  },
  {
    "sectionCode": "SEC_HUMAN_BEHAVIOUR",
    "languageCode": "hi",
    "name": "\u092e\u093e\u0928\u0935 \u0935\u094d\u092f\u0935\u0939\u093e\u0930 \u090f\u0935\u0902 \u0938\u0939\u093e\u0928\u0941\u092d\u0942\u0924\u093f (Human Behaviour & Empathy)",
    "description": "\u0932\u094b\u0917\u094b\u0902, \u0909\u0928\u0915\u0947 \u0935\u094d\u092f\u0935\u0939\u093e\u0930, \u092d\u093e\u0935\u0928\u093e\u0913\u0902, \u0938\u0902\u092c\u0902\u0927\u094b\u0902 \u0914\u0930 \u0915\u0932\u094d\u092f\u093e\u0923 \u092e\u0947\u0902 \u0930\u0941\u091a\u093f\u0964"
  },
  {
    "sectionCode": "SEC_HUMAN_BEHAVIOUR",
    "languageCode": "ta",
    "name": "\u0bae\u0ba9\u0bbf\u0ba4 \u0ba8\u0b9f\u0ba4\u0bcd\u0ba4\u0bc8 \u0bae\u0bb1\u0bcd\u0bb1\u0bc1\u0bae\u0bcd \u0baa\u0b9a\u0bcd\u0b9a\u0bbe\u0ba4\u0bbe\u0baa\u0bae\u0bcd (Human Behaviour & Empathy)",
    "description": "\u0bae\u0ba9\u0bbf\u0ba4\u0bb0\u0bcd\u0b95\u0bb3\u0bcd, \u0ba8\u0b9f\u0ba4\u0bcd\u0ba4\u0bc8, \u0b89\u0ba3\u0bb0\u0bcd\u0bb5\u0bc1\u0b95\u0bb3\u0bcd, \u0b89\u0bb1\u0bb5\u0bc1\u0b95\u0bb3\u0bcd \u0bae\u0bb1\u0bcd\u0bb1\u0bc1\u0bae\u0bcd \u0ba8\u0bb2\u0bcd\u0bb5\u0bbe\u0bb4\u0bcd\u0bb5\u0bc1 \u0baa\u0bb1\u0bcd\u0bb1\u0bbf\u0baf \u0b86\u0bb0\u0bcd\u0bb5\u0bae\u0bcd."
  },
  {
    "sectionCode": "SEC_HUMAN_BEHAVIOUR",
    "languageCode": "kn",
    "name": "\u0cae\u0cbe\u0ca8\u0cb5 \u0ca8\u0ca1\u0cb5\u0cb3\u0cbf\u0c95\u0cc6 \u0cae\u0ca4\u0ccd\u0ca4\u0cc1 \u0cb8\u0cb9\u0cbe\u0ca8\u0cc1\u0cad\u0cc2\u0ca4\u0cbf (Human Behaviour & Empathy)",
    "description": "\u0c9c\u0ca8\u0cb0\u0cc1, \u0ca8\u0ca1\u0cb5\u0cb3\u0cbf\u0c95\u0cc6, \u0cad\u0cbe\u0cb5\u0ca8\u0cc6\u0c97\u0cb3\u0cc1, \u0cb8\u0c82\u0cac\u0c82\u0ca7\u0c97\u0cb3\u0cc1 \u0cae\u0ca4\u0ccd\u0ca4\u0cc1 \u0caf\u0ccb\u0c97\u0c95\u0ccd\u0cb7\u0cc7\u0cae\u0ca6\u0cb2\u0ccd\u0cb2\u0cbf \u0c86\u0cb8\u0c95\u0ccd\u0ca4\u0cbf."
  },
  {
    "sectionCode": "SEC_HUMAN_BEHAVIOUR",
    "languageCode": "ar",
    "name": "\u0627\u0644\u0633\u0644\u0648\u0643 \u0627\u0644\u0628\u0634\u0631\u064a \u0648\u0627\u0644\u062a\u0639\u0627\u0637\u0641 (Human Behaviour & Empathy)",
    "description": "\u0627\u0644\u0627\u0647\u062a\u0645\u0627\u0645 \u0628\u0627\u0644\u0646\u0627\u0633\u060c \u0648\u0633\u0644\u0648\u0643\u064a\u0627\u062a\u0647\u0645\u060c \u0648\u0639\u0648\u0627\u0637\u0641\u0647\u0645\u060c \u0648\u0639\u0644\u0627\u0642\u0627\u062a\u0647\u0645\u060c \u0648\u0631\u0641\u0627\u0647\u0647\u0645 \u0627\u0644\u0646\u0641\u0633\u064a."
  },
  {
    "sectionCode": "SEC_LANGUAGE_COMM",
    "languageCode": "ml",
    "name": "\u0d2d\u0d3e\u0d37\u0d2f\u0d41\u0d02 \u0d06\u0d36\u0d2f\u0d35\u0d3f\u0d28\u0d3f\u0d2e\u0d2f\u0d35\u0d41\u0d02 (Language & Communication)",
    "description": "\u0d35\u0d3e\u0d2f\u0d28, \u0d0e\u0d34\u0d41\u0d24\u0d4d\u0d24\u0d4d, \u0d38\u0d02\u0d38\u0d3e\u0d30\u0d02, \u0d06\u0d36\u0d2f\u0d35\u0d3f\u0d36\u0d26\u0d40\u0d15\u0d30\u0d23\u0d02, \u0d2d\u0d3e\u0d37\u0d3e \u0d35\u0d4d\u0d2f\u0d3e\u0d16\u0d4d\u0d2f\u0d3e\u0d28\u0d02 \u0d0e\u0d28\u0d4d\u0d28\u0d3f\u0d35\u0d2f\u0d3f\u0d32\u0d41\u0d33\u0d4d\u0d33 \u0d24\u0d3e\u0d32\u0d4d\u0d2a\u0d30\u0d4d\u0d2f\u0d02."
  },
  {
    "sectionCode": "SEC_LANGUAGE_COMM",
    "languageCode": "hi",
    "name": "\u092d\u093e\u0937\u093e \u090f\u0935\u0902 \u0938\u0902\u091a\u093e\u0930 (Language & Communication)",
    "description": "\u092a\u0922\u093c\u0928\u0947, \u0932\u093f\u0916\u0928\u0947, \u092c\u094b\u0932\u0928\u0947, \u0938\u092e\u091d\u093e\u0928\u0947 \u0914\u0930 \u092d\u093e\u0937\u093e \u0915\u0940 \u0935\u094d\u092f\u093e\u0916\u094d\u092f\u093e \u0915\u0930\u0928\u0947 \u092e\u0947\u0902 \u0930\u0941\u091a\u093f\u0964"
  },
  {
    "sectionCode": "SEC_LANGUAGE_COMM",
    "languageCode": "ta",
    "name": "\u0bae\u0bca\u0bb4\u0bbf \u0bae\u0bb1\u0bcd\u0bb1\u0bc1\u0bae\u0bcd \u0ba4\u0bca\u0b9f\u0bb0\u0bcd\u0baa\u0bc1 (Language & Communication)",
    "description": "\u0bb5\u0bbe\u0b9a\u0bbf\u0ba4\u0bcd\u0ba4\u0bb2\u0bcd, \u0b8e\u0bb4\u0bc1\u0ba4\u0bc1\u0ba4\u0bb2\u0bcd, \u0baa\u0bc7\u0b9a\u0bc1\u0ba4\u0bb2\u0bcd, \u0bb5\u0bbf\u0bb3\u0b95\u0bcd\u0b95\u0bc1\u0ba4\u0bb2\u0bcd \u0bae\u0bb1\u0bcd\u0bb1\u0bc1\u0bae\u0bcd \u0bae\u0bca\u0bb4\u0bbf \u0bb5\u0bbf\u0bb3\u0b95\u0bcd\u0b95\u0bae\u0bcd \u0bae\u0bc0\u0ba4\u0bbe\u0ba9 \u0b86\u0bb0\u0bcd\u0bb5\u0bae\u0bcd."
  },
  {
    "sectionCode": "SEC_LANGUAGE_COMM",
    "languageCode": "kn",
    "name": "\u0cad\u0cbe\u0cb7\u0cc6 \u0cae\u0ca4\u0ccd\u0ca4\u0cc1 \u0cb8\u0c82\u0cb5\u0cb9\u0ca8 (Language & Communication)",
    "description": "\u0c93\u0ca6\u0cc1\u0cb5\u0cc1\u0ca6\u0cc1, \u0cac\u0cb0\u0cc6\u0caf\u0cc1\u0cb5\u0cc1\u0ca6\u0cc1, \u0cae\u0cbe\u0ca4\u0ca8\u0cbe\u0ca1\u0cc1\u0cb5\u0cc1\u0ca6\u0cc1 \u0cae\u0ca4\u0ccd\u0ca4\u0cc1 \u0cad\u0cbe\u0cb7\u0cc6\u0caf\u0ca8\u0ccd\u0ca8\u0cc1 \u0c85\u0cb0\u0ccd\u0ca5\u0cc8\u0cb8\u0cc1\u0cb5\u0cb2\u0ccd\u0cb2\u0cbf \u0c86\u0cb8\u0c95\u0ccd\u0ca4\u0cbf."
  },
  {
    "sectionCode": "SEC_LANGUAGE_COMM",
    "languageCode": "ar",
    "name": "\u0627\u0644\u0644\u063a\u0629 \u0648\u0627\u0644\u062a\u0648\u0627\u0635\u0644 (Language & Communication)",
    "description": "\u0627\u0644\u0627\u0647\u062a\u0645\u0627\u0645 \u0628\u0627\u0644\u0642\u0631\u0627\u0621\u0629 \u0648\u0627\u0644\u0643\u062a\u0627\u0628\u0629 \u0648\u0627\u0644\u062e\u0637\u0627\u0628\u0629 \u0648\u0634\u0631\u062d \u0648\u062a\u0641\u0633\u064a\u0631 \u0627\u0644\u0644\u063a\u0629."
  },
  {
    "sectionCode": "SEC_SOCIETY_CULTURE",
    "languageCode": "ml",
    "name": "\u0d38\u0d2e\u0d42\u0d39\u0d35\u0d41\u0d02 \u0d38\u0d02\u0d38\u0d4d\u0d15\u0d3e\u0d30\u0d35\u0d41\u0d02 \u0d38\u0d4d\u0d35\u0d24\u0d4d\u0d35\u0d35\u0d41\u0d02 (Society, Culture & Identity)",
    "description": "\u0d38\u0d2e\u0d42\u0d39\u0d19\u0d4d\u0d19\u0d7e, \u0d38\u0d02\u0d38\u0d4d\u0d15\u0d3e\u0d30\u0d02, \u0d2a\u0d3e\u0d30\u0d2e\u0d4d\u0d2a\u0d30\u0d4d\u0d2f\u0d19\u0d4d\u0d19\u0d7e, \u0d38\u0d3e\u0d2e\u0d42\u0d39\u0d3f\u0d15 \u0d2e\u0d3e\u0d31\u0d4d\u0d31\u0d19\u0d4d\u0d19\u0d7e \u0d0e\u0d28\u0d4d\u0d28\u0d3f\u0d35\u0d2f\u0d3f\u0d32\u0d41\u0d33\u0d4d\u0d33 \u0d06\u0d15\u0d3e\u0d02\u0d15\u0d4d\u0d37."
  },
  {
    "sectionCode": "SEC_SOCIETY_CULTURE",
    "languageCode": "hi",
    "name": "\u0938\u092e\u093e\u091c, \u0938\u0902\u0938\u094d\u0915\u0943\u0924\u093f \u090f\u0935\u0902 \u092a\u0939\u091a\u093e\u0928 (Society, Culture & Identity)",
    "description": "\u0938\u092e\u0941\u0926\u093e\u092f\u094b\u0902, \u0938\u0902\u0938\u094d\u0915\u0943\u0924\u093f, \u092a\u0939\u091a\u093e\u0928, \u092a\u0930\u0902\u092a\u0930\u093e\u0913\u0902 \u0914\u0930 \u0938\u093e\u092e\u093e\u091c\u093f\u0915 \u092a\u0930\u093f\u0935\u0930\u094d\u0924\u0928 \u0915\u0947 \u092c\u093e\u0930\u0947 \u092e\u0947\u0902 \u091c\u093f\u091c\u094d\u091e\u093e\u0938\u093e\u0964"
  },
  {
    "sectionCode": "SEC_SOCIETY_CULTURE",
    "languageCode": "ta",
    "name": "\u0b9a\u0bae\u0bc2\u0b95\u0bae\u0bcd, \u0b95\u0bb2\u0bbe\u0b9a\u0bcd\u0b9a\u0bbe\u0bb0\u0bae\u0bcd \u0bae\u0bb1\u0bcd\u0bb1\u0bc1\u0bae\u0bcd \u0b85\u0b9f\u0bc8\u0baf\u0bbe\u0bb3\u0bae\u0bcd (Society, Culture & Identity)",
    "description": "\u0b9a\u0bae\u0bc2\u0b95\u0b99\u0bcd\u0b95\u0bb3\u0bcd, \u0b95\u0bb2\u0bbe\u0b9a\u0bcd\u0b9a\u0bbe\u0bb0\u0bae\u0bcd, \u0b85\u0b9f\u0bc8\u0baf\u0bbe\u0bb3\u0bae\u0bcd, \u0bae\u0bb0\u0baa\u0bc1\u0b95\u0bb3\u0bcd \u0bae\u0bb1\u0bcd\u0bb1\u0bc1\u0bae\u0bcd \u0b9a\u0bae\u0bc2\u0b95 \u0bae\u0bbe\u0bb1\u0bcd\u0bb1\u0b99\u0bcd\u0b95\u0bb3\u0bcd \u0bae\u0bc0\u0ba4\u0bbe\u0ba9 \u0b86\u0bb0\u0bcd\u0bb5\u0bae\u0bcd."
  },
  {
    "sectionCode": "SEC_SOCIETY_CULTURE",
    "languageCode": "kn",
    "name": "\u0cb8\u0cae\u0cbe\u0c9c, \u0cb8\u0c82\u0cb8\u0ccd\u0c95\u0cc3\u0ca4\u0cbf \u0cae\u0ca4\u0ccd\u0ca4\u0cc1 \u0c97\u0cc1\u0cb0\u0cc1\u0ca4\u0cc1 (Society, Culture & Identity)",
    "description": "\u0cb8\u0cae\u0cc1\u0ca6\u0cbe\u0caf\u0c97\u0cb3\u0cc1, \u0cb8\u0c82\u0cb8\u0ccd\u0c95\u0cc3\u0ca4\u0cbf, \u0cb8\u0c82\u0caa\u0ccd\u0cb0\u0ca6\u0cbe\u0caf\u0c97\u0cb3\u0cc1 \u0cae\u0ca4\u0ccd\u0ca4\u0cc1 \u0cb8\u0cbe\u0cae\u0cbe\u0c9c\u0cbf\u0c95 \u0cac\u0ca6\u0cb2\u0cbe\u0cb5\u0ca3\u0cc6\u0c97\u0cb3 \u0c95\u0cc1\u0cb0\u0cbf\u0ca4\u0cc1 \u0c95\u0cc1\u0ca4\u0cc2\u0cb9\u0cb2."
  },
  {
    "sectionCode": "SEC_SOCIETY_CULTURE",
    "languageCode": "ar",
    "name": "\u0627\u0644\u0645\u062c\u062a\u0645\u0639 \u0648\u0627\u0644\u062b\u0642\u0627\u0641\u0629 \u0648\u0627\u0644\u0647\u0648\u064a\u0629 (Society, Culture & Identity)",
    "description": "\u0627\u0644\u0641\u0636\u0648\u0644 \u062d\u0648\u0644 \u0627\u0644\u0645\u062c\u062a\u0645\u0639\u0627\u062a \u0648\u0627\u0644\u062b\u0642\u0627\u0641\u0629 \u0648\u0627\u0644\u0647\u0648\u064a\u0629 \u0648\u0627\u0644\u062a\u0642\u0627\u0644\u064a\u062f \u0648\u0627\u0644\u062a\u063a\u064a\u0631 \u0627\u0644\u0627\u062c\u062a\u0645\u0627\u0639\u064a."
  },
  {
    "sectionCode": "SEC_LAW_JUSTICE",
    "languageCode": "ml",
    "name": "\u0d28\u0d3f\u0d2f\u0d2e\u0d35\u0d41\u0d02 \u0d28\u0d40\u0d24\u0d3f\u0d2f\u0d41\u0d02 \u0d2a\u0d57\u0d30\u0d2c\u0d4b\u0d27\u0d35\u0d41\u0d02 (Law, Justice & Civic Reasoning)",
    "description": "\u0d28\u0d3f\u0d2f\u0d2e\u0d19\u0d4d\u0d19\u0d7e, \u0d05\u0d35\u0d15\u0d3e\u0d36\u0d19\u0d4d\u0d19\u0d7e, \u0d28\u0d40\u0d24\u0d3f, \u0d24\u0d46\u0d33\u0d3f\u0d35\u0d41\u0d15\u0d7e, \u0d2d\u0d30\u0d23\u0d38\u0d02\u0d35\u0d3f\u0d27\u0d3e\u0d28\u0d02 \u0d0e\u0d28\u0d4d\u0d28\u0d3f\u0d35\u0d2f\u0d3f\u0d32\u0d41\u0d33\u0d4d\u0d33 \u0d24\u0d3e\u0d32\u0d4d\u0d2a\u0d30\u0d4d\u0d2f\u0d02."
  },
  {
    "sectionCode": "SEC_LAW_JUSTICE",
    "languageCode": "hi",
    "name": "\u0935\u093f\u0927\u093f, \u0928\u094d\u092f\u093e\u092f \u090f\u0935\u0902 \u0928\u093e\u0917\u0930\u093f\u0915 \u0924\u0930\u094d\u0915 (Law, Justice & Civic Reasoning)",
    "description": "\u0928\u093f\u092f\u092e\u094b\u0902, \u0905\u0927\u093f\u0915\u093e\u0930\u094b\u0902, \u0928\u093f\u0937\u094d\u092a\u0915\u094d\u0937\u0924\u093e, \u0938\u093e\u0915\u094d\u0937\u094d\u092f\u094b\u0902 \u0914\u0930 \u0938\u093e\u0930\u094d\u0935\u091c\u0928\u093f\u0915 \u0928\u093f\u0930\u094d\u0923\u092f \u0932\u0947\u0928\u0947 \u092e\u0947\u0902 \u0930\u0941\u091a\u093f\u0964"
  },
  {
    "sectionCode": "SEC_LAW_JUSTICE",
    "languageCode": "ta",
    "name": "\u0b9a\u0b9f\u0bcd\u0b9f\u0bae\u0bcd, \u0ba8\u0bc0\u0ba4\u0bbf \u0bae\u0bb1\u0bcd\u0bb1\u0bc1\u0bae\u0bcd \u0b95\u0bc1\u0b9f\u0bbf\u0bae\u0bc8\u0baa\u0bcd \u0baa\u0b95\u0bc1\u0ba4\u0bcd\u0ba4\u0bb1\u0bbf\u0bb5\u0bc1 (Law, Justice & Civic Reasoning)",
    "description": "\u0bb5\u0bbf\u0ba4\u0bbf\u0b95\u0bb3\u0bcd, \u0b89\u0bb0\u0bbf\u0bae\u0bc8\u0b95\u0bb3\u0bcd, \u0ba8\u0bc0\u0ba4\u0bbf, \u0b86\u0ba4\u0bbe\u0bb0\u0b99\u0bcd\u0b95\u0bb3\u0bcd \u0bae\u0bb1\u0bcd\u0bb1\u0bc1\u0bae\u0bcd \u0baa\u0bca\u0ba4\u0bc1 \u0bae\u0bc1\u0b9f\u0bbf\u0bb5\u0bc6\u0b9f\u0bc1\u0ba4\u0bcd\u0ba4\u0bb2\u0bcd \u0bae\u0bc0\u0ba4\u0bbe\u0ba9 \u0b86\u0bb0\u0bcd\u0bb5\u0bae\u0bcd."
  },
  {
    "sectionCode": "SEC_LAW_JUSTICE",
    "languageCode": "kn",
    "name": "\u0c95\u0cbe\u0ca8\u0cc2\u0ca8\u0cc1, \u0ca8\u0ccd\u0caf\u0cbe\u0caf \u0cae\u0ca4\u0ccd\u0ca4\u0cc1 \u0ca8\u0cbe\u0c97\u0cb0\u0cbf\u0c95 \u0ca4\u0cb0\u0ccd\u0c95 (Law, Justice & Civic Reasoning)",
    "description": "\u0ca8\u0cbf\u0caf\u0cae\u0c97\u0cb3\u0cc1, \u0cb9\u0c95\u0ccd\u0c95\u0cc1\u0c97\u0cb3\u0cc1, \u0ca8\u0ccd\u0caf\u0cbe\u0caf, \u0caa\u0cc1\u0cb0\u0cbe\u0cb5\u0cc6\u0c97\u0cb3\u0cc1 \u0cae\u0ca4\u0ccd\u0ca4\u0cc1 \u0cb8\u0cbe\u0cb0\u0ccd\u0cb5\u0c9c\u0ca8\u0cbf\u0c95 \u0ca8\u0cbf\u0cb0\u0ccd\u0ca7\u0cbe\u0cb0\u0c97\u0cb3\u0cb2\u0ccd\u0cb2\u0cbf \u0c86\u0cb8\u0c95\u0ccd\u0ca4\u0cbf."
  },
  {
    "sectionCode": "SEC_LAW_JUSTICE",
    "languageCode": "ar",
    "name": "\u0627\u0644\u0642\u0627\u0646\u0648\u0646 \u0648\u0627\u0644\u0639\u062f\u0627\u0644\u0629 \u0648\u0627\u0644\u062a\u0641\u0643\u064a\u0631 \u0627\u0644\u0645\u062f\u0646\u064a (Law, Justice & Civic Reasoning)",
    "description": "\u0627\u0644\u0627\u0647\u062a\u0645\u0627\u0645 \u0628\u0627\u0644\u0642\u0648\u0627\u0639\u062f\u060c \u0648\u0627\u0644\u062d\u0642\u0648\u0642\u060c \u0648\u0627\u0644\u0639\u062f\u0627\u0644\u0629\u060c \u0648\u0627\u0644\u0623\u062f\u0644\u0629\u060c \u0648\u0635\u0646\u0639 \u0627\u0644\u0642\u0631\u0627\u0631 \u0627\u0644\u0639\u0627\u0645."
  },
  {
    "sectionCode": "SEC_HISTORY_EVIDENCE",
    "languageCode": "ml",
    "name": "\u0d1a\u0d30\u0d3f\u0d24\u0d4d\u0d30\u0d35\u0d41\u0d02 \u0d35\u0d4d\u0d2f\u0d3e\u0d16\u0d4d\u0d2f\u0d3e\u0d28\u0d35\u0d41\u0d02 \u0d24\u0d46\u0d33\u0d3f\u0d35\u0d41\u0d15\u0d33\u0d41\u0d02 (History, Interpretation & Evidence)",
    "description": "\u0d1a\u0d30\u0d3f\u0d24\u0d4d\u0d30\u0d2a\u0d30\u0d2e\u0d3e\u0d2f \u0d38\u0d28\u0d4d\u0d26\u0d7c\u0d2d\u0d19\u0d4d\u0d19\u0d7e, \u0d38\u0d4d\u0d30\u0d4b\u0d24\u0d38\u0d4d\u0d38\u0d41\u0d15\u0d7e, \u0d35\u0d4d\u0d2f\u0d3e\u0d16\u0d4d\u0d2f\u0d3e\u0d28\u0d19\u0d4d\u0d19\u0d7e \u0d0e\u0d28\u0d4d\u0d28\u0d3f\u0d35\u0d2f\u0d3f\u0d32\u0d41\u0d33\u0d4d\u0d33 \u0d24\u0d3e\u0d7d\u0d2a\u0d4d\u0d2a\u0d30\u0d4d\u0d2f\u0d02."
  },
  {
    "sectionCode": "SEC_HISTORY_EVIDENCE",
    "languageCode": "hi",
    "name": "\u0907\u0924\u093f\u0939\u093e\u0938, \u0935\u094d\u092f\u093e\u0916\u094d\u092f\u093e \u090f\u0935\u0902 \u0938\u093e\u0915\u094d\u0937\u094d\u092f (History, Interpretation & Evidence)",
    "description": "\u0910\u0924\u093f\u0939\u093e\u0938\u093f\u0915 \u0938\u0902\u0926\u0930\u094d\u092d, \u0938\u094d\u0930\u094b\u0924\u094b\u0902, \u0935\u094d\u092f\u093e\u0916\u094d\u092f\u093e \u0914\u0930 \u0938\u092e\u092f-\u0938\u0940\u092e\u093e \u092e\u0947\u0902 \u0930\u0941\u091a\u093f\u0964"
  },
  {
    "sectionCode": "SEC_HISTORY_EVIDENCE",
    "languageCode": "ta",
    "name": "\u0bb5\u0bb0\u0bb2\u0bbe\u0bb1\u0bc1, \u0bb5\u0bbf\u0bb3\u0b95\u0bcd\u0b95\u0bae\u0bcd \u0bae\u0bb1\u0bcd\u0bb1\u0bc1\u0bae\u0bcd \u0b9a\u0bbe\u0ba9\u0bcd\u0bb1\u0bc1\u0b95\u0bb3\u0bcd (History, Interpretation & Evidence)",
    "description": "\u0bb5\u0bb0\u0bb2\u0bbe\u0bb1\u0bcd\u0bb1\u0bc1 \u0b9a\u0bc2\u0bb4\u0bb2\u0bcd, \u0b86\u0ba4\u0bbe\u0bb0\u0b99\u0bcd\u0b95\u0bb3\u0bcd, \u0bb5\u0bbf\u0bb3\u0b95\u0bcd\u0b95\u0b99\u0bcd\u0b95\u0bb3\u0bcd \u0bae\u0bb1\u0bcd\u0bb1\u0bc1\u0bae\u0bcd \u0b95\u0bbe\u0bb2\u0bb5\u0bb0\u0bbf\u0b9a\u0bc8\u0b95\u0bb3\u0bbf\u0bb2\u0bcd \u0b86\u0bb0\u0bcd\u0bb5\u0bae\u0bcd."
  },
  {
    "sectionCode": "SEC_HISTORY_EVIDENCE",
    "languageCode": "kn",
    "name": "\u0c87\u0ca4\u0cbf\u0cb9\u0cbe\u0cb8, \u0cb5\u0cbf\u0cb5\u0cb0\u0ca3\u0cc6 \u0cae\u0ca4\u0ccd\u0ca4\u0cc1 \u0caa\u0cc1\u0cb0\u0cbe\u0cb5\u0cc6\u0c97\u0cb3\u0cc1 (History, Interpretation & Evidence)",
    "description": "\u0c90\u0ca4\u0cbf\u0cb9\u0cbe\u0cb8\u0cbf\u0c95 \u0cb8\u0c82\u0ca6\u0cb0\u0ccd\u0cad, \u0cae\u0cc2\u0cb2\u0c97\u0cb3\u0cc1, \u0cb5\u0ccd\u0caf\u0cbe\u0c96\u0ccd\u0caf\u0cbe\u0ca8 \u0cae\u0ca4\u0ccd\u0ca4\u0cc1 \u0cb8\u0cae\u0caf\u0cbe\u0cb5\u0ca7\u0cbf\u0caf\u0cb2\u0ccd\u0cb2\u0cbf \u0c86\u0cb8\u0c95\u0ccd\u0ca4\u0cbf."
  },
  {
    "sectionCode": "SEC_HISTORY_EVIDENCE",
    "languageCode": "ar",
    "name": "\u0627\u0644\u062a\u0627\u0631\u064a\u062e \u0648\u0627\u0644\u062a\u0641\u0633\u064a\u0631 \u0648\u0627\u0644\u0623\u062f\u0644\u0629 (History, Interpretation & Evidence)",
    "description": "\u0627\u0644\u0627\u0647\u062a\u0645\u0627\u0645 \u0628\u0627\u0644\u0633\u064a\u0627\u0642 \u0627\u0644\u062a\u0627\u0631\u064a\u062e\u064a\u060c \u0648\u0627\u0644\u0645\u0635\u0627\u062f\u0631\u060c \u0648\u0627\u0644\u062a\u0641\u0633\u064a\u0631\u0627\u062a\u060c \u0648\u0627\u0644\u062a\u0633\u0644\u0633\u0644 \u0627\u0644\u0632\u0645\u0646\u064a."
  },
  {
    "sectionCode": "SEC_CREATIVE_MEDIA",
    "languageCode": "ml",
    "name": "\u0d38\u0d7c\u0d17\u0d4d\u0d17\u0d3e\u0d24\u0d4d\u0d2e\u0d15 \u0d06\u0d35\u0d3f\u0d37\u0d4d\u0d15\u0d3e\u0d30\u0d35\u0d41\u0d02 \u0d2e\u0d3e\u0d27\u0d4d\u0d2f\u0d2e\u0d19\u0d4d\u0d19\u0d33\u0d41\u0d02 (Creative Expression & Media)",
    "description": "\u0d15\u0d25\u0d2a\u0d31\u0d1a\u0d4d\u0d1a\u0d3f\u0d7d, \u0d2e\u0d3e\u0d27\u0d4d\u0d2f\u0d2e\u0d19\u0d4d\u0d19\u0d7e, \u0d26\u0d43\u0d36\u0d4d\u0d2f\u0d3e\u0d35\u0d3f\u0d37\u0d4d\u0d15\u0d3e\u0d30\u0d02, \u0d2a\u0d4d\u0d30\u0d47\u0d15\u0d4d\u0d37\u0d15\u0d30\u0d41\u0d2e\u0d3e\u0d2f\u0d41\u0d33\u0d4d\u0d33 \u0d07\u0d1f\u0d2a\u0d46\u0d1f\u0d7d \u0d0e\u0d28\u0d4d\u0d28\u0d3f\u0d35\u0d2f\u0d3f\u0d32\u0d41\u0d33\u0d4d\u0d33 \u0d24\u0d3e\u0d32\u0d4d\u0d2a\u0d30\u0d4d\u0d2f\u0d02."
  },
  {
    "sectionCode": "SEC_CREATIVE_MEDIA",
    "languageCode": "hi",
    "name": "\u0930\u091a\u0928\u093e\u0924\u094d\u092e\u0915 \u0905\u092d\u093f\u0935\u094d\u092f\u0915\u094d\u0924\u093f \u090f\u0935\u0902 \u092e\u0940\u0921\u093f\u092f\u093e (Creative Expression & Media)",
    "description": "\u0915\u0939\u093e\u0928\u0940 \u0915\u0939\u0928\u0947, \u092e\u0940\u0921\u093f\u092f\u093e, \u0926\u0943\u0936\u094d\u092f/\u0930\u091a\u0928\u093e\u0924\u094d\u092e\u0915 \u0905\u092d\u093f\u0935\u094d\u092f\u0915\u094d\u0924\u093f \u0914\u0930 \u0926\u0930\u094d\u0936\u0915\u094b\u0902 \u0938\u0947 \u091c\u0941\u0921\u093c\u093e\u0935 \u092e\u0947\u0902 \u0930\u0941\u091a\u093f\u0964"
  },
  {
    "sectionCode": "SEC_CREATIVE_MEDIA",
    "languageCode": "ta",
    "name": "\u0baa\u0b9f\u0bc8\u0baa\u0bcd\u0baa\u0bbe\u0bb1\u0bcd\u0bb1\u0bb2\u0bcd \u0bb5\u0bc6\u0bb3\u0bbf\u0baa\u0bcd\u0baa\u0bbe\u0b9f\u0bc1 \u0bae\u0bb1\u0bcd\u0bb1\u0bc1\u0bae\u0bcd \u0b8a\u0b9f\u0b95\u0bae\u0bcd (Creative Expression & Media)",
    "description": "\u0b95\u0ba4\u0bc8\u0b9a\u0bca\u0bb2\u0bcd\u0bb2\u0bb2\u0bcd, \u0b8a\u0b9f\u0b95\u0bae\u0bcd, \u0b95\u0bbe\u0b9f\u0bcd\u0b9a\u0bbf/\u0baa\u0b9f\u0bc8\u0baa\u0bcd\u0baa\u0bc1 \u0bb5\u0bc6\u0bb3\u0bbf\u0baa\u0bcd\u0baa\u0bbe\u0b9f\u0bc1 \u0bae\u0bb1\u0bcd\u0bb1\u0bc1\u0bae\u0bcd \u0baa\u0bbe\u0bb0\u0bcd\u0bb5\u0bc8\u0baf\u0bbe\u0bb3\u0bb0\u0bcd \u0ba4\u0bca\u0b9f\u0bb0\u0bcd\u0baa\u0bc1 \u0bae\u0bc0\u0ba4\u0bbe\u0ba9 \u0b86\u0bb0\u0bcd\u0bb5\u0bae\u0bcd."
  },
  {
    "sectionCode": "SEC_CREATIVE_MEDIA",
    "languageCode": "kn",
    "name": "\u0cb8\u0cc3\u0c9c\u0ca8\u0cbe\u0ca4\u0ccd\u0cae\u0c95 \u0c85\u0cad\u0cbf\u0cb5\u0ccd\u0caf\u0c95\u0ccd\u0ca4\u0cbf \u0cae\u0ca4\u0ccd\u0ca4\u0cc1 \u0cae\u0cbe\u0ca7\u0ccd\u0caf\u0cae (Creative Expression & Media)",
    "description": "\u0c95\u0ca5\u0cc6 \u0cb9\u0cc7\u0cb3\u0cc1\u0cb5\u0cc1\u0ca6\u0cc1, \u0cae\u0cbe\u0ca7\u0ccd\u0caf\u0cae, \u0ca6\u0cc3\u0cb6\u0ccd\u0caf/\u0cb8\u0cc3\u0c9c\u0ca8\u0cb6\u0cc0\u0cb2 \u0c85\u0cad\u0cbf\u0cb5\u0ccd\u0caf\u0c95\u0ccd\u0ca4\u0cbf \u0cae\u0ca4\u0ccd\u0ca4\u0cc1 \u0caa\u0ccd\u0cb0\u0cc7\u0c95\u0ccd\u0cb7\u0c95\u0cb0 \u0ca4\u0cca\u0ca1\u0c97\u0cbf\u0cb8\u0cbf\u0c95\u0cca\u0cb3\u0ccd\u0cb3\u0cc1\u0cb5\u0cbf\u0c95\u0cc6\u0caf\u0cb2\u0ccd\u0cb2\u0cbf \u0c86\u0cb8\u0c95\u0ccd\u0ca4\u0cbf."
  },
  {
    "sectionCode": "SEC_CREATIVE_MEDIA",
    "languageCode": "ar",
    "name": "\u0627\u0644\u062a\u0639\u0628\u064a\u0631 \u0627\u0644\u0625\u0628\u062f\u0627\u0639\u064a \u0648\u0627\u0644\u0625\u0639\u0644\u0627\u0645 (Creative Expression & Media)",
    "description": "\u0627\u0644\u0627\u0647\u062a\u0645\u0627\u0645 \u0628\u0633\u0631\u062f \u0627\u0644\u0642\u0635\u0635\u060c \u0648\u0627\u0644\u0625\u0639\u0644\u0627\u0645\u060c \u0648\u0627\u0644\u062a\u0639\u0628\u064a\u0631 \u0627\u0644\u0645\u0631\u0626\u064a/\u0627\u0644\u0625\u0628\u062f\u0627\u0639\u064a\u060c \u0648\u0627\u0644\u062a\u0641\u0627\u0639\u0644 \u0645\u0639 \u0627\u0644\u062c\u0645\u0647\u0648\u0631."
  },
  {
    "sectionCode": "SEC_EDUCATION_FACIL",
    "languageCode": "ml",
    "name": "\u0d35\u0d3f\u0d26\u0d4d\u0d2f\u0d3e\u0d2d\u0d4d\u0d2f\u0d3e\u0d38\u0d35\u0d41\u0d02 \u0d2c\u0d4b\u0d27\u0d28\u0d35\u0d41\u0d02 (Education & Facilitation)",
    "description": "\u0d05\u0d27\u0d4d\u0d2f\u0d3e\u0d2a\u0d28\u0d02, \u0d2e\u0d3e\u0d7c\u0d17\u0d4d\u0d17\u0d28\u0d3f\u0d7c\u0d26\u0d4d\u0d26\u0d47\u0d36\u0d02, \u0d06\u0d36\u0d2f\u0d19\u0d4d\u0d19\u0d7e \u0d32\u0d33\u0d3f\u0d24\u0d2e\u0d3e\u0d15\u0d4d\u0d15\u0d7d, \u0d2e\u0d31\u0d4d\u0d31\u0d41\u0d33\u0d4d\u0d33\u0d35\u0d30\u0d46 \u0d38\u0d39\u0d3e\u0d2f\u0d3f\u0d15\u0d4d\u0d15\u0d7d \u0d0e\u0d28\u0d4d\u0d28\u0d3f\u0d35\u0d2f\u0d3f\u0d32\u0d41\u0d33\u0d4d\u0d33 \u0d24\u0d3e\u0d7d\u0d2a\u0d4d\u0d2a\u0d30\u0d4d\u0d2f\u0d02."
  },
  {
    "sectionCode": "SEC_EDUCATION_FACIL",
    "languageCode": "hi",
    "name": "\u0936\u093f\u0915\u094d\u0937\u093e \u090f\u0935\u0902 \u0938\u0941\u0935\u093f\u0927\u093e (Education & Facilitation)",
    "description": "\u0936\u093f\u0915\u094d\u0937\u0923, \u092e\u093e\u0930\u094d\u0917\u0926\u0930\u094d\u0936\u0928, \u0935\u093f\u091a\u093e\u0930\u094b\u0902 \u0915\u094b \u0938\u0930\u0932 \u092c\u0928\u093e\u0928\u0947 \u0914\u0930 \u0926\u0942\u0938\u0930\u094b\u0902 \u0915\u094b \u0938\u0940\u0916\u0928\u0947 \u092e\u0947\u0902 \u092e\u0926\u0926 \u0915\u0930\u0928\u0947 \u092e\u0947\u0902 \u0930\u0941\u091a\u093f\u0964"
  },
  {
    "sectionCode": "SEC_EDUCATION_FACIL",
    "languageCode": "ta",
    "name": "\u0b95\u0bb2\u0bcd\u0bb5\u0bbf \u0bae\u0bb1\u0bcd\u0bb1\u0bc1\u0bae\u0bcd \u0bb5\u0bb4\u0bbf\u0b95\u0bbe\u0b9f\u0bcd\u0b9f\u0bb2\u0bcd (Education & Facilitation)",
    "description": "\u0b95\u0bb1\u0bcd\u0baa\u0bbf\u0ba4\u0bcd\u0ba4\u0bb2\u0bcd, \u0bb5\u0bb4\u0bbf\u0b95\u0bbe\u0b9f\u0bcd\u0b9f\u0bc1\u0ba4\u0bb2\u0bcd, \u0b95\u0bb0\u0bc1\u0ba4\u0bcd\u0ba4\u0bc1\u0b95\u0bcd\u0b95\u0bb3\u0bc8 \u0b8e\u0bb3\u0bbf\u0bae\u0bc8\u0baf\u0bbe\u0b95\u0bcd\u0b95\u0bc1\u0ba4\u0bb2\u0bcd \u0bae\u0bb1\u0bcd\u0bb1\u0bc1\u0bae\u0bcd \u0baa\u0bbf\u0bb1\u0bb0\u0bc1\u0b95\u0bcd\u0b95\u0bc1\u0b95\u0bcd \u0b95\u0bb1\u0bcd\u0baa\u0ba4\u0bbf\u0bb2\u0bcd \u0b89\u0ba4\u0bb5\u0bc1\u0ba4\u0bb2\u0bcd \u0bae\u0bc0\u0ba4\u0bbe\u0ba9 \u0b86\u0bb0\u0bcd\u0bb5\u0bae\u0bcd."
  },
  {
    "sectionCode": "SEC_EDUCATION_FACIL",
    "languageCode": "kn",
    "name": "\u0cb6\u0cbf\u0c95\u0ccd\u0cb7\u0ca3 \u0cae\u0ca4\u0ccd\u0ca4\u0cc1 \u0cb8\u0cc1\u0cb2\u0cad\u0cc0\u0c95\u0cb0\u0ca3 (Education & Facilitation)",
    "description": "\u0cac\u0ccb\u0ca7\u0ca8\u0cc6, \u0cae\u0cbe\u0cb0\u0ccd\u0c97\u0ca6\u0cb0\u0ccd\u0cb6\u0ca8, \u0cb5\u0cbf\u0c9a\u0cbe\u0cb0\u0c97\u0cb3\u0ca8\u0ccd\u0ca8\u0cc1 \u0cb8\u0cb0\u0cb3\u0c97\u0cca\u0cb3\u0cbf\u0cb8\u0cc1\u0cb5\u0cc1\u0ca6\u0cc1 \u0cae\u0ca4\u0ccd\u0ca4\u0cc1 \u0c87\u0ca4\u0cb0\u0cb0\u0cc1 \u0c95\u0cb2\u0cbf\u0caf\u0cb2\u0cc1 \u0cb8\u0cb9\u0cbe\u0caf \u0cae\u0cbe\u0ca1\u0cc1\u0cb5\u0cb2\u0ccd\u0cb2\u0cbf \u0c86\u0cb8\u0c95\u0ccd\u0ca4\u0cbf."
  },
  {
    "sectionCode": "SEC_EDUCATION_FACIL",
    "languageCode": "ar",
    "name": "\u0627\u0644\u062a\u0639\u0644\u064a\u0645 \u0648\u0627\u0644\u062a\u064a\u0633\u064a\u0631 (Education & Facilitation)",
    "description": "\u0627\u0644\u0627\u0647\u062a\u0645\u0627\u0645 \u0628\u0627\u0644\u062a\u062f\u0631\u064a\u0633\u060c \u0648\u0627\u0644\u062a\u0648\u062c\u064a\u0647\u060c \u0648\u062a\u0628\u0633\u064a\u0637 \u0627\u0644\u0623\u0641\u0643\u0627\u0631\u060c \u0648\u0645\u0633\u0627\u0639\u062f\u0629 \u0627\u0644\u0622\u062e\u0631\u064a\u0646 \u0639\u0644\u0649 \u0627\u0644\u062a\u0639\u0644\u0645."
  },
  {
    "sectionCode": "SEC_RESEARCH_POLICY",
    "languageCode": "ml",
    "name": "\u0d17\u0d35\u0d47\u0d37\u0d23\u0d35\u0d41\u0d02 \u0d28\u0d2f\u0d30\u0d42\u0d2a\u0d40\u0d15\u0d30\u0d23\u0d35\u0d41\u0d02 \u0d06\u0d17\u0d4b\u0d33 \u0d1a\u0d3f\u0d28\u0d4d\u0d24\u0d2f\u0d41\u0d02 (Research, Policy & Global Thinking)",
    "description": "\u0d17\u0d35\u0d47\u0d37\u0d23\u0d02, \u0d2a\u0d4a\u0d24\u0d41 \u0d2a\u0d4d\u0d30\u0d36\u0d4d\u0d28\u0d19\u0d4d\u0d19\u0d7e, \u0d28\u0d2f\u0d30\u0d42\u0d2a\u0d40\u0d15\u0d30\u0d23\u0d02, \u0d06\u0d17\u0d4b\u0d33 \u0d15\u0d3e\u0d30\u0d4d\u0d2f\u0d19\u0d4d\u0d19\u0d7e \u0d0e\u0d28\u0d4d\u0d28\u0d3f\u0d35\u0d2f\u0d3f\u0d32\u0d41\u0d33\u0d4d\u0d33 \u0d24\u0d3e\u0d7d\u0d2a\u0d4d\u0d2a\u0d30\u0d4d\u0d2f\u0d02."
  },
  {
    "sectionCode": "SEC_RESEARCH_POLICY",
    "languageCode": "hi",
    "name": "\u0905\u0928\u0941\u0938\u0902\u0927\u093e\u0928, \u0928\u0940\u0924\u093f \u090f\u0935\u0902 \u0935\u0948\u0936\u094d\u0935\u093f\u0915 \u0935\u093f\u091a\u093e\u0930 (Research, Policy & Global Thinking)",
    "description": "\u0905\u0928\u0941\u0938\u0902\u0927\u093e\u0928, \u0938\u093e\u0930\u094d\u0935\u091c\u0928\u093f\u0915 \u092e\u0941\u0926\u094d\u0926\u094b\u0902, \u0928\u0940\u0924\u093f, \u092a\u094d\u0930\u0923\u093e\u0932\u093f\u092f\u094b\u0902 \u0914\u0930 \u0938\u093e\u0915\u094d\u0937\u094d\u092f-\u0906\u0927\u093e\u0930\u093f\u0924 \u0928\u093f\u0937\u094d\u0915\u0930\u094d\u0937\u094b\u0902 \u092e\u0947\u0902 \u0930\u0941\u091a\u093f\u0964"
  },
  {
    "sectionCode": "SEC_RESEARCH_POLICY",
    "languageCode": "ta",
    "name": "\u0b86\u0bb0\u0bbe\u0baf\u0bcd\u0b9a\u0bcd\u0b9a\u0bbf, \u0b95\u0bca\u0bb3\u0bcd\u0b95\u0bc8 \u0bae\u0bb1\u0bcd\u0bb1\u0bc1\u0bae\u0bcd \u0b89\u0bb2\u0b95\u0bb3\u0bbe\u0bb5\u0bbf\u0baf \u0b9a\u0bbf\u0ba8\u0bcd\u0ba4\u0ba9\u0bc8 (Research, Policy & Global Thinking)",
    "description": "\u0b86\u0bb0\u0bbe\u0baf\u0bcd\u0b9a\u0bcd\u0b9a\u0bbf, \u0baa\u0bca\u0ba4\u0bc1\u0baa\u0bcd \u0baa\u0bbf\u0bb0\u0b9a\u0bcd\u0b9a\u0bbf\u0ba9\u0bc8\u0b95\u0bb3\u0bcd, \u0b95\u0bca\u0bb3\u0bcd\u0b95\u0bc8, \u0b85\u0bae\u0bc8\u0baa\u0bcd\u0baa\u0bc1\u0b95\u0bb3\u0bcd \u0bae\u0bb1\u0bcd\u0bb1\u0bc1\u0bae\u0bcd \u0b86\u0ba4\u0bbe\u0bb0 \u0b85\u0b9f\u0bbf\u0baa\u0bcd\u0baa\u0b9f\u0bc8\u0baf\u0bbf\u0bb2\u0bbe\u0ba9 \u0bae\u0bc1\u0b9f\u0bbf\u0bb5\u0bc1\u0b95\u0bb3\u0bbf\u0bb2\u0bcd \u0b86\u0bb0\u0bcd\u0bb5\u0bae\u0bcd."
  },
  {
    "sectionCode": "SEC_RESEARCH_POLICY",
    "languageCode": "kn",
    "name": "\u0cb8\u0c82\u0cb6\u0ccb\u0ca7\u0ca8\u0cc6, \u0ca8\u0cc0\u0ca4\u0cbf \u0cae\u0ca4\u0ccd\u0ca4\u0cc1 \u0c9c\u0cbe\u0c97\u0ca4\u0cbf\u0c95 \u0c9a\u0cbf\u0c82\u0ca4\u0ca8\u0cc6 (Research, Policy & Global Thinking)",
    "description": "\u0cb8\u0c82\u0cb6\u0ccb\u0ca7\u0ca8\u0cc6, \u0cb8\u0cbe\u0cb0\u0ccd\u0cb5\u0c9c\u0ca8\u0cbf\u0c95 \u0cb8\u0cae\u0cb8\u0ccd\u0caf\u0cc6\u0c97\u0cb3\u0cc1, \u0ca8\u0cc0\u0ca4\u0cbf \u0cae\u0ca4\u0ccd\u0ca4\u0cc1 \u0caa\u0cc1\u0cb0\u0cbe\u0cb5\u0cc6 \u0c86\u0ca7\u0cbe\u0cb0\u0cbf\u0ca4 \u0ca4\u0cc0\u0cb0\u0ccd\u0cae\u0cbe\u0ca8\u0c97\u0cb3\u0cb2\u0ccd\u0cb2\u0cbf \u0c86\u0cb8\u0c95\u0ccd\u0ca4\u0cbf."
  },
  {
    "sectionCode": "SEC_RESEARCH_POLICY",
    "languageCode": "ar",
    "name": "\u0627\u0644\u0628\u062d\u062b \u0648\u0627\u0644\u0633\u064a\u0627\u0633\u0627\u062a \u0648\u0627\u0644\u062a\u0641\u0643\u064a\u0631 \u0627\u0644\u0639\u0627\u0644\u0645\u064a (Research, Policy & Global Thinking)",
    "description": "\u0627\u0644\u0627\u0647\u062a\u0645\u0627\u0645 \u0628\u0627\u0644\u0628\u062d\u062b\u060c \u0648\u0627\u0644\u0642\u0636\u0627\u064a\u0627 \u0627\u0644\u0639\u0627\u0645\u0629\u060c \u0648\u0627\u0644\u0633\u064a\u0627\u0633\u0627\u062a\u060c \u0648\u0627\u0644\u0634\u0624\u0648\u0646 \u0627\u0644\u0639\u0627\u0644\u0645\u064a\u0629\u060c \u0648\u0627\u0644\u0627\u0633\u062a\u0646\u062a\u0627\u062c\u0627\u062a \u0627\u0644\u0642\u0627\u0626\u0645\u0629 \u0639\u0644\u0649 \u0627\u0644\u0623\u062f\u0644\u0629."
  },
  {
    "sectionCode": "SEC_CAREER_SCEN",
    "languageCode": "ml",
    "name": "\u0d24\u0d4a\u0d34\u0d3f\u0d7d \u0d38\u0d3e\u0d39\u0d1a\u0d30\u0d4d\u0d2f \u0d24\u0d3f\u0d30\u0d1e\u0d4d\u0d1e\u0d46\u0d1f\u0d41\u0d2a\u0d4d\u0d2a\u0d41\u0d15\u0d7e (Career Preference Scenarios)",
    "description": "\u0d24\u0d4a\u0d34\u0d3f\u0d7d \u0d2e\u0d41\u0d7b\u0d17\u0d23\u0d28\u0d15\u0d33\u0d41\u0d02 \u0d2a\u0d4d\u0d30\u0d3e\u0d2f\u0d4b\u0d17\u0d3f\u0d15 \u0d38\u0d3e\u0d39\u0d1a\u0d30\u0d4d\u0d2f\u0d19\u0d4d\u0d19\u0d33\u0d41\u0d02 \u0d2a\u0d4d\u0d30\u0d24\u0d3f\u0d2b\u0d32\u0d3f\u0d2a\u0d4d\u0d2a\u0d3f\u0d15\u0d4d\u0d15\u0d41\u0d28\u0d4d\u0d28 \u0d1a\u0d4b\u0d26\u0d4d\u0d2f\u0d19\u0d4d\u0d19\u0d7e."
  },
  {
    "sectionCode": "SEC_CAREER_SCEN",
    "languageCode": "hi",
    "name": "\u0915\u0930\u093f\u092f\u0930 \u092a\u0930\u093f\u0926\u0943\u0936\u094d\u092f \u0935\u093f\u0915\u0932\u094d\u092a (Career Preference Scenarios)",
    "description": "\u0915\u093e\u0930\u094d\u092f \u0938\u0902\u0926\u0930\u094d\u092d \u0914\u0930 \u0926\u0948\u0928\u093f\u0915 \u092a\u094d\u0930\u093e\u0925\u092e\u093f\u0915\u0924\u093e\u0913\u0902 \u0915\u094b \u0926\u0930\u094d\u0936\u093e\u0928\u0947 \u0935\u093e\u0932\u0947 \u0935\u094d\u092f\u093e\u0935\u0939\u093e\u0930\u093f\u0915 \u092a\u0930\u093f\u0926\u0943\u0936\u094d\u092f \u0935\u093f\u0915\u0932\u094d\u092a\u0964"
  },
  {
    "sectionCode": "SEC_CAREER_SCEN",
    "languageCode": "ta",
    "name": "\u0ba4\u0bca\u0bb4\u0bbf\u0bb2\u0bcd \u0b9a\u0bc2\u0bb4\u0bb2\u0bcd \u0ba4\u0bc7\u0bb0\u0bcd\u0bb5\u0bc1\u0b95\u0bb3\u0bcd (Career Preference Scenarios)",
    "description": "\u0bb5\u0bbf\u0bb0\u0bc1\u0baa\u0bcd\u0baa\u0bae\u0bbe\u0ba9 \u0baa\u0ba3\u0bbf \u0b9a\u0bc2\u0bb4\u0bb2\u0bc8 \u0baa\u0bbf\u0bb0\u0ba4\u0bbf\u0baa\u0bb2\u0bbf\u0b95\u0bcd\u0b95\u0bc1\u0bae\u0bcd \u0ba8\u0b9f\u0bc8\u0bae\u0bc1\u0bb1\u0bc8 \u0ba4\u0bca\u0bb4\u0bbf\u0bb2\u0bcd \u0ba4\u0bc7\u0bb0\u0bcd\u0bb5\u0bc1\u0b95\u0bb3\u0bcd."
  },
  {
    "sectionCode": "SEC_CAREER_SCEN",
    "languageCode": "kn",
    "name": "\u0cb5\u0cc3\u0ca4\u0ccd\u0ca4\u0cbf \u0cb8\u0ca8\u0ccd\u0ca8\u0cbf\u0cb5\u0cc7\u0cb6\u0ca6 \u0c86\u0caf\u0ccd\u0c95\u0cc6\u0c97\u0cb3\u0cc1 (Career Preference Scenarios)",
    "description": "\u0c86\u0ca6\u0ccd\u0caf\u0ca4\u0cc6\u0caf \u0c95\u0cc6\u0cb2\u0cb8\u0ca6 \u0cb8\u0c82\u0ca6\u0cb0\u0ccd\u0cad\u0cb5\u0ca8\u0ccd\u0ca8\u0cc1 \u0caa\u0ccd\u0cb0\u0ca4\u0cbf\u0cac\u0cbf\u0c82\u0cac\u0cbf\u0cb8\u0cc1\u0cb5 \u0caa\u0ccd\u0cb0\u0cbe\u0caf\u0ccb\u0c97\u0cbf\u0c95 \u0cb8\u0ca8\u0ccd\u0ca8\u0cbf\u0cb5\u0cc7\u0cb6\u0ca6 \u0c86\u0caf\u0ccd\u0c95\u0cc6\u0c97\u0cb3\u0cc1."
  },
  {
    "sectionCode": "SEC_CAREER_SCEN",
    "languageCode": "ar",
    "name": "\u0633\u064a\u0646\u0627\u0631\u064a\u0648\u0647\u0627\u062a \u0627\u0644\u062a\u0641\u0636\u064a\u0644 \u0627\u0644\u0645\u0647\u0646\u064a (Career Preference Scenarios)",
    "description": "\u062e\u064a\u0627\u0631\u0627\u062a \u0627\u0644\u0633\u064a\u0646\u0627\u0631\u064a\u0648 \u0627\u0644\u0639\u0645\u0644\u064a \u0627\u0644\u062a\u064a \u062a\u0639\u0643\u0633 \u0633\u064a\u0627\u0642 \u0627\u0644\u0639\u0645\u0644 \u0627\u0644\u0645\u0641\u0636\u0644 \u0648\u0627\u0644\u062a\u062d\u062f\u064a\u0627\u062a \u0627\u0644\u064a\u0648\u0645\u064a\u0629."
  }
];

export const HUMANITIES_CAREER_FINDER_DIMENSION_TRANSLATIONS: DimensionTranslationSeed[] = [
  {
    "dimensionCode": "DIM_HUMAN_BEHAVIOUR",
    "languageCode": "ml",
    "name": "\u0d2e\u0d28\u0d41\u0d37\u0d4d\u0d2f \u0d38\u0d4d\u0d35\u0d2d\u0d3e\u0d35\u0d35\u0d41\u0d02 \u0d38\u0d39\u0d3e\u0d28\u0d41\u0d2d\u0d42\u0d24\u0d3f\u0d2f\u0d41\u0d02 (Human Behaviour & Empathy)"
  },
  {
    "dimensionCode": "DIM_HUMAN_BEHAVIOUR",
    "languageCode": "hi",
    "name": "\u092e\u093e\u0928\u0935 \u0935\u094d\u092f\u0935\u0939\u093e\u0930 \u090f\u0935\u0902 \u0938\u0939\u093e\u0928\u0941\u092d\u0942\u0924\u093f (Human Behaviour & Empathy)"
  },
  {
    "dimensionCode": "DIM_HUMAN_BEHAVIOUR",
    "languageCode": "ta",
    "name": "\u0bae\u0ba9\u0bbf\u0ba4 \u0ba8\u0b9f\u0ba4\u0bcd\u0ba4\u0bc8 \u0bae\u0bb1\u0bcd\u0bb1\u0bc1\u0bae\u0bcd \u0baa\u0b9a\u0bcd\u0b9a\u0bbe\u0ba4\u0bbe\u0baa\u0bae\u0bcd (Human Behaviour & Empathy)"
  },
  {
    "dimensionCode": "DIM_HUMAN_BEHAVIOUR",
    "languageCode": "kn",
    "name": "\u0cae\u0cbe\u0ca8\u0cb5 \u0ca8\u0ca1\u0cb5\u0cb3\u0cbf\u0c95\u0cc6 \u0cae\u0ca4\u0ccd\u0ca4\u0cc1 \u0cb8\u0cb9\u0cbe\u0ca8\u0cc1\u0cad\u0cc2\u0ca4\u0cbf (Human Behaviour & Empathy)"
  },
  {
    "dimensionCode": "DIM_HUMAN_BEHAVIOUR",
    "languageCode": "ar",
    "name": "\u0627\u0644\u0633\u0644\u0648\u0643 \u0627\u0644\u0628\u0634\u0631\u064a \u0648\u0627\u0644\u062a\u0639\u0627\u0637\u0641 (Human Behaviour & Empathy)"
  },
  {
    "dimensionCode": "DIM_LANGUAGE_COMM",
    "languageCode": "ml",
    "name": "\u0d2d\u0d3e\u0d37\u0d2f\u0d41\u0d02 \u0d06\u0d36\u0d2f\u0d35\u0d3f\u0d28\u0d3f\u0d2e\u0d2f\u0d35\u0d41\u0d02 (Language & Communication)"
  },
  {
    "dimensionCode": "DIM_LANGUAGE_COMM",
    "languageCode": "hi",
    "name": "\u092d\u093e\u0937\u093e \u090f\u0935\u0902 \u0938\u0902\u091a\u093e\u0930 (Language & Communication)"
  },
  {
    "dimensionCode": "DIM_LANGUAGE_COMM",
    "languageCode": "ta",
    "name": "\u0bae\u0bca\u0bb4\u0bbf \u0bae\u0bb1\u0bcd\u0bb1\u0bc1\u0bae\u0bcd \u0ba4\u0bca\u0b9f\u0bb0\u0bcd\u0baa\u0bc1 (Language & Communication)"
  },
  {
    "dimensionCode": "DIM_LANGUAGE_COMM",
    "languageCode": "kn",
    "name": "\u0cad\u0cbe\u0cb7\u0cc6 \u0cae\u0ca4\u0ccd\u0ca4\u0cc1 \u0cb8\u0c82\u0cb5\u0cb9\u0ca8 (Language & Communication)"
  },
  {
    "dimensionCode": "DIM_LANGUAGE_COMM",
    "languageCode": "ar",
    "name": "\u0627\u0644\u0644\u063a\u0629 \u0648\u0627\u0644\u062a\u0648\u0627\u0635\u0644 (Language & Communication)"
  },
  {
    "dimensionCode": "DIM_SOCIETY_CULTURE",
    "languageCode": "ml",
    "name": "\u0d38\u0d2e\u0d42\u0d39\u0d35\u0d41\u0d02 \u0d38\u0d02\u0d38\u0d4d\u0d15\u0d3e\u0d30\u0d35\u0d41\u0d02 \u0d38\u0d4d\u0d35\u0d24\u0d4d\u0d35\u0d35\u0d41\u0d02 (Society, Culture & Identity)"
  },
  {
    "dimensionCode": "DIM_SOCIETY_CULTURE",
    "languageCode": "hi",
    "name": "\u0938\u092e\u093e\u091c, \u0938\u0902\u0938\u094d\u0915\u0943\u0924\u093f \u090f\u0935\u0902 \u092a\u0939\u091a\u093e\u0928 (Society, Culture & Identity)"
  },
  {
    "dimensionCode": "DIM_SOCIETY_CULTURE",
    "languageCode": "ta",
    "name": "\u0b9a\u0bae\u0bc2\u0b95\u0bae\u0bcd, \u0b95\u0bb2\u0bbe\u0b9a\u0bcd\u0b9a\u0bbe\u0bb0\u0bae\u0bcd \u0bae\u0bb1\u0bcd\u0bb1\u0bc1\u0bae\u0bcd \u0b85\u0b9f\u0bc8\u0baf\u0bbe\u0bb3\u0bae\u0bcd (Society, Culture & Identity)"
  },
  {
    "dimensionCode": "DIM_SOCIETY_CULTURE",
    "languageCode": "kn",
    "name": "\u0cb8\u0cae\u0cbe\u0c9c, \u0cb8\u0c82\u0cb8\u0ccd\u0c95\u0cc3\u0ca4\u0cbf \u0cae\u0ca4\u0ccd\u0ca4\u0cc1 \u0c97\u0cc1\u0cb0\u0cc1\u0ca4\u0cc1 (Society, Culture & Identity)"
  },
  {
    "dimensionCode": "DIM_SOCIETY_CULTURE",
    "languageCode": "ar",
    "name": "\u0627\u0644\u0645\u062c\u062a\u0645\u0639 \u0648\u0627\u0644\u062b\u0642\u0627\u0641\u0629 \u0648\u0627\u0644\u0647\u0648\u064a\u0629 (Society, Culture & Identity)"
  },
  {
    "dimensionCode": "DIM_LAW_JUSTICE",
    "languageCode": "ml",
    "name": "\u0d28\u0d3f\u0d2f\u0d2e\u0d35\u0d41\u0d02 \u0d28\u0d40\u0d24\u0d3f\u0d2f\u0d41\u0d02 \u0d2a\u0d57\u0d30\u0d2c\u0d4b\u0d27\u0d35\u0d41\u0d02 (Law, Justice & Civic Reasoning)"
  },
  {
    "dimensionCode": "DIM_LAW_JUSTICE",
    "languageCode": "hi",
    "name": "\u0935\u093f\u0927\u093f, \u0928\u094d\u092f\u093e\u092f \u090f\u0935\u0902 \u0928\u093e\u0917\u0930\u093f\u0915 \u0924\u0930\u094d\u0915 (Law, Justice & Civic Reasoning)"
  },
  {
    "dimensionCode": "DIM_LAW_JUSTICE",
    "languageCode": "ta",
    "name": "\u0b9a\u0b9f\u0bcd\u0b9f\u0bae\u0bcd, \u0ba8\u0bc0\u0ba4\u0bbf \u0bae\u0bb1\u0bcd\u0bb1\u0bc1\u0bae\u0bcd \u0b95\u0bc1\u0b9f\u0bbf\u0bae\u0bc8\u0baa\u0bcd \u0baa\u0b95\u0bc1\u0ba4\u0bcd\u0ba4\u0bb1\u0bbf\u0bb5\u0bc1 (Law, Justice & Civic Reasoning)"
  },
  {
    "dimensionCode": "DIM_LAW_JUSTICE",
    "languageCode": "kn",
    "name": "\u0c95\u0cbe\u0ca8\u0cc2\u0ca8\u0cc1, \u0ca8\u0ccd\u0caf\u0cbe\u0caf \u0cae\u0ca4\u0ccd\u0ca4\u0cc1 \u0ca8\u0cbe\u0c97\u0cb0\u0cbf\u0c95 \u0ca4\u0cb0\u0ccd\u0c95 (Law, Justice & Civic Reasoning)"
  },
  {
    "dimensionCode": "DIM_LAW_JUSTICE",
    "languageCode": "ar",
    "name": "\u0627\u0644\u0642\u0627\u0646\u0648\u0646 \u0648\u0627\u0644\u0639\u062f\u0627\u0644\u0629 \u0648\u0627\u0644\u062a\u0641\u0643\u064a\u0631 \u0627\u0644\u0645\u062f\u0646\u064a (Law, Justice & Civic Reasoning)"
  },
  {
    "dimensionCode": "DIM_HISTORY_EVIDENCE",
    "languageCode": "ml",
    "name": "\u0d1a\u0d30\u0d3f\u0d24\u0d4d\u0d30\u0d35\u0d41\u0d02 \u0d35\u0d4d\u0d2f\u0d3e\u0d16\u0d4d\u0d2f\u0d3e\u0d28\u0d35\u0d41\u0d02 \u0d24\u0d46\u0d33\u0d3f\u0d35\u0d41\u0d15\u0d33\u0d41\u0d02 (History, Interpretation & Evidence)"
  },
  {
    "dimensionCode": "DIM_HISTORY_EVIDENCE",
    "languageCode": "hi",
    "name": "\u0907\u0924\u093f\u0939\u093e\u0938, \u0935\u094d\u092f\u093e\u0916\u094d\u092f\u093e \u090f\u0935\u0902 \u0938\u093e\u0915\u094d\u0937\u094d\u092f (History, Interpretation & Evidence)"
  },
  {
    "dimensionCode": "DIM_HISTORY_EVIDENCE",
    "languageCode": "ta",
    "name": "\u0bb5\u0bb0\u0bb2\u0bbe\u0bb1\u0bc1, \u0bb5\u0bbf\u0bb3\u0b95\u0bcd\u0b95\u0bae\u0bcd \u0bae\u0bb1\u0bcd\u0bb1\u0bc1\u0bae\u0bcd \u0b9a\u0bbe\u0ba9\u0bcd\u0bb1\u0bc1\u0b95\u0bb3\u0bcd (History, Interpretation & Evidence)"
  },
  {
    "dimensionCode": "DIM_HISTORY_EVIDENCE",
    "languageCode": "kn",
    "name": "\u0c87\u0ca4\u0cbf\u0cb9\u0cbe\u0cb8, \u0cb5\u0cbf\u0cb5\u0cb0\u0ca3\u0cc6 \u0cae\u0ca4\u0ccd\u0ca4\u0cc1 \u0caa\u0cc1\u0cb0\u0cbe\u0cb5\u0cc6\u0c97\u0cb3\u0cc1 (History, Interpretation & Evidence)"
  },
  {
    "dimensionCode": "DIM_HISTORY_EVIDENCE",
    "languageCode": "ar",
    "name": "\u0627\u0644\u062a\u0627\u0631\u064a\u062e \u0648\u0627\u0644\u062a\u0641\u0633\u064a\u0631 \u0648\u0627\u0644\u0623\u062f\u0644\u0629 (History, Interpretation & Evidence)"
  },
  {
    "dimensionCode": "DIM_CREATIVE_MEDIA",
    "languageCode": "ml",
    "name": "\u0d38\u0d7c\u0d17\u0d4d\u0d17\u0d3e\u0d24\u0d4d\u0d2e\u0d15 \u0d06\u0d35\u0d3f\u0d37\u0d4d\u0d15\u0d3e\u0d30\u0d35\u0d41\u0d02 \u0d2e\u0d3e\u0d27\u0d4d\u0d2f\u0d2e\u0d19\u0d4d\u0d19\u0d33\u0d41\u0d02 (Creative Expression & Media)"
  },
  {
    "dimensionCode": "DIM_CREATIVE_MEDIA",
    "languageCode": "hi",
    "name": "\u0930\u091a\u0928\u093e\u0924\u094d\u092e\u0915 \u0905\u092d\u093f\u0935\u094d\u092f\u0915\u094d\u0924\u093f \u090f\u0935\u0902 \u092e\u0940\u0921\u093f\u092f\u093e (Creative Expression & Media)"
  },
  {
    "dimensionCode": "DIM_CREATIVE_MEDIA",
    "languageCode": "ta",
    "name": "\u0baa\u0b9f\u0bc8\u0baa\u0bcd\u0baa\u0bbe\u0bb1\u0bcd\u0bb1\u0bb2\u0bcd \u0bb5\u0bc6\u0bb3\u0bbf\u0baa\u0bcd\u0baa\u0bbe\u0b9f\u0bc1 \u0bae\u0bb1\u0bcd\u0bb1\u0bc1\u0bae\u0bcd \u0b8a\u0b9f\u0b95\u0bae\u0bcd (Creative Expression & Media)"
  },
  {
    "dimensionCode": "DIM_CREATIVE_MEDIA",
    "languageCode": "kn",
    "name": "\u0cb8\u0cc3\u0c9c\u0ca8\u0cbe\u0ca4\u0ccd\u0cae\u0c95 \u0c85\u0cad\u0cbf\u0cb5\u0ccd\u0caf\u0c95\u0ccd\u0ca4\u0cbf \u0cae\u0ca4\u0ccd\u0ca4\u0cc1 \u0cae\u0cbe\u0ca7\u0ccd\u0caf\u0cae (Creative Expression & Media)"
  },
  {
    "dimensionCode": "DIM_CREATIVE_MEDIA",
    "languageCode": "ar",
    "name": "\u0627\u0644\u062a\u0639\u0628\u064a\u0631 \u0627\u0644\u0625\u0628\u062f\u0627\u0639\u064a \u0648\u0627\u0644\u0625\u0639\u0644\u0627\u0645 (Creative Expression & Media)"
  },
  {
    "dimensionCode": "DIM_EDUCATION_FACIL",
    "languageCode": "ml",
    "name": "\u0d35\u0d3f\u0d26\u0d4d\u0d2f\u0d3e\u0d2d\u0d4d\u0d2f\u0d3e\u0d38\u0d35\u0d41\u0d02 \u0d2c\u0d4b\u0d27\u0d28\u0d35\u0d41\u0d02 (Education & Facilitation)"
  },
  {
    "dimensionCode": "DIM_EDUCATION_FACIL",
    "languageCode": "hi",
    "name": "\u0936\u093f\u0915\u094d\u0937\u093e \u090f\u0935\u0902 \u0938\u0941\u0935\u093f\u0927\u093e (Education & Facilitation)"
  },
  {
    "dimensionCode": "DIM_EDUCATION_FACIL",
    "languageCode": "ta",
    "name": "\u0b95\u0bb2\u0bcd\u0bb5\u0bbf \u0bae\u0bb1\u0bcd\u0bb1\u0bc1\u0bae\u0bcd \u0bb5\u0bb4\u0bbf\u0b95\u0bbe\u0b9f\u0bcd\u0b9f\u0bb2\u0bcd (Education & Facilitation)"
  },
  {
    "dimensionCode": "DIM_EDUCATION_FACIL",
    "languageCode": "kn",
    "name": "\u0cb6\u0cbf\u0c95\u0ccd\u0cb7\u0ca3 \u0cae\u0ca4\u0ccd\u0ca4\u0cc1 \u0cb8\u0cc1\u0cb2\u0cad\u0cc0\u0c95\u0cb0\u0ca3 (Education & Facilitation)"
  },
  {
    "dimensionCode": "DIM_EDUCATION_FACIL",
    "languageCode": "ar",
    "name": "\u0627\u0644\u062a\u0639\u0644\u064a\u0645 \u0648\u0627\u0644\u062a\u064a\u0633\u064a\u0631 (Education & Facilitation)"
  },
  {
    "dimensionCode": "DIM_RESEARCH_POLICY",
    "languageCode": "ml",
    "name": "\u0d17\u0d35\u0d47\u0d37\u0d23\u0d35\u0d41\u0d02 \u0d28\u0d2f\u0d30\u0d42\u0d2a\u0d40\u0d15\u0d30\u0d23\u0d35\u0d41\u0d02 \u0d06\u0d17\u0d4b\u0d33 \u0d1a\u0d3f\u0d28\u0d4d\u0d24\u0d2f\u0d41\u0d02 (Research, Policy & Global Thinking)"
  },
  {
    "dimensionCode": "DIM_RESEARCH_POLICY",
    "languageCode": "hi",
    "name": "\u0905\u0928\u0941\u0938\u0902\u0927\u093e\u0928, \u0928\u0940\u0924\u093f \u090f\u0935\u0902 \u0935\u0948\u0936\u094d\u0935\u093f\u0915 \u0935\u093f\u091a\u093e\u0930 (Research, Policy & Global Thinking)"
  },
  {
    "dimensionCode": "DIM_RESEARCH_POLICY",
    "languageCode": "ta",
    "name": "\u0b86\u0bb0\u0bbe\u0baf\u0bcd\u0b9a\u0bcd\u0b9a\u0bbf, \u0b95\u0bca\u0bb3\u0bcd\u0b95\u0bc8 \u0bae\u0bb1\u0bcd\u0bb1\u0bc1\u0bae\u0bcd \u0b89\u0bb2\u0b95\u0bb3\u0bbe\u0bb5\u0bbf\u0baf \u0b9a\u0bbf\u0ba8\u0bcd\u0ba4\u0ba9\u0bc8 (Research, Policy & Global Thinking)"
  },
  {
    "dimensionCode": "DIM_RESEARCH_POLICY",
    "languageCode": "kn",
    "name": "\u0cb8\u0c82\u0cb6\u0ccb\u0ca7\u0ca8\u0cc6, \u0ca8\u0cc0\u0ca4\u0cbf \u0cae\u0ca4\u0ccd\u0ca4\u0cc1 \u0c9c\u0cbe\u0c97\u0ca4\u0cbf\u0c95 \u0c9a\u0cbf\u0c82\u0ca4\u0ca8\u0cc6 (Research, Policy & Global Thinking)"
  },
  {
    "dimensionCode": "DIM_RESEARCH_POLICY",
    "languageCode": "ar",
    "name": "\u0627\u0644\u0628\u062d\u062b \u0648\u0627\u0644\u0633\u064a\u0627\u0633\u0627\u062a \u0648\u0627\u0644\u062a\u0641\u0643\u064a\u0631 \u0627\u0644\u0639\u0627\u0644\u0645\u064a (Research, Policy & Global Thinking)"
  },
  {
    "dimensionCode": "DIM_CAREER_SCEN",
    "languageCode": "ml",
    "name": "\u0d24\u0d4a\u0d34\u0d3f\u0d7d \u0d38\u0d3e\u0d39\u0d1a\u0d30\u0d4d\u0d2f \u0d24\u0d3f\u0d30\u0d1e\u0d4d\u0d1e\u0d46\u0d1f\u0d41\u0d2a\u0d4d\u0d2a\u0d41\u0d15\u0d7e (Career Preference Scenarios)"
  },
  {
    "dimensionCode": "DIM_CAREER_SCEN",
    "languageCode": "hi",
    "name": "\u0915\u0930\u093f\u092f\u0930 \u092a\u0930\u093f\u0926\u0943\u0936\u094d\u092f \u0935\u093f\u0915\u0932\u094d\u092a (Career Preference Scenarios)"
  },
  {
    "dimensionCode": "DIM_CAREER_SCEN",
    "languageCode": "ta",
    "name": "\u0ba4\u0bca\u0bb4\u0bbf\u0bb2\u0bcd \u0b9a\u0bc2\u0bb4\u0bb2\u0bcd \u0ba4\u0bc7\u0bb0\u0bcd\u0bb5\u0bc1\u0b95\u0bb3\u0bcd (Career Preference Scenarios)"
  },
  {
    "dimensionCode": "DIM_CAREER_SCEN",
    "languageCode": "kn",
    "name": "\u0cb5\u0cc3\u0ca4\u0ccd\u0ca4\u0cbf \u0cb8\u0ca8\u0ccd\u0ca8\u0cbf\u0cb5\u0cc7\u0cb6\u0ca6 \u0c86\u0caf\u0ccd\u0c95\u0cc6\u0c97\u0cb3\u0cc1 (Career Preference Scenarios)"
  },
  {
    "dimensionCode": "DIM_CAREER_SCEN",
    "languageCode": "ar",
    "name": "\u0633\u064a\u0646\u0627\u0631\u064a\u0648\u0647\u0627\u062a \u0627\u0644\u062a\u0641\u0636\u064a\u0644 \u0627\u0644\u0645\u0647\u0646\u064a (Career Preference Scenarios)"
  }
];

export const HUMANITIES_CAREER_FINDER_LIKERT_OPTIONS: OptionTranslationSeed[] = [
  {
    "optionKey": "1",
    "languageCode": "ml",
    "optionText": "\u0d2a\u0d42\u0d7c\u0d23\u0d4d\u0d23\u0d2e\u0d3e\u0d2f\u0d41\u0d02 \u0d35\u0d3f\u0d2f\u0d4b\u0d1c\u0d3f\u0d15\u0d4d\u0d15\u0d41\u0d28\u0d4d\u0d28\u0d41"
  },
  {
    "optionKey": "1",
    "languageCode": "hi",
    "optionText": "\u092a\u0942\u0930\u0940 \u0924\u0930\u0939 \u0905\u0938\u0939\u092e\u0924"
  },
  {
    "optionKey": "1",
    "languageCode": "ta",
    "optionText": "\u0bae\u0bc1\u0bb1\u0bcd\u0bb1\u0bbf\u0bb2\u0bc1\u0bae\u0bcd \u0b89\u0b9f\u0ba9\u0bcd\u0baa\u0b9f\u0bb5\u0bbf\u0bb2\u0bcd\u0bb2\u0bc8"
  },
  {
    "optionKey": "1",
    "languageCode": "kn",
    "optionText": "\u0c96\u0c82\u0ca1\u0cbf\u0ca4\u0cb5\u0cbe\u0c97\u0cbf\u0caf\u0cc2 \u0c92\u0caa\u0ccd\u0caa\u0cc1\u0cb5\u0cc1\u0ca6\u0cbf\u0cb2\u0ccd\u0cb2"
  },
  {
    "optionKey": "1",
    "languageCode": "ar",
    "optionText": "\u0623\u0639\u0627\u0631\u0636 \u0628\u0634\u062f\u0629"
  },
  {
    "optionKey": "2",
    "languageCode": "ml",
    "optionText": "\u0d2f\u0d4b\u0d1c\u0d3f\u0d15\u0d4d\u0d15\u0d41\u0d28\u0d4d\u0d28\u0d3f\u0d32\u0d4d\u0d32"
  },
  {
    "optionKey": "2",
    "languageCode": "hi",
    "optionText": "\u0905\u0938\u0939\u092e\u0924"
  },
  {
    "optionKey": "2",
    "languageCode": "ta",
    "optionText": "\u0b89\u0b9f\u0ba9\u0bcd\u0baa\u0b9f\u0bb5\u0bbf\u0bb2\u0bcd\u0bb2\u0bc8"
  },
  {
    "optionKey": "2",
    "languageCode": "kn",
    "optionText": "\u0c92\u0caa\u0ccd\u0caa\u0cc1\u0cb5\u0cc1\u0ca6\u0cbf\u0cb2\u0ccd\u0cb2"
  },
  {
    "optionKey": "2",
    "languageCode": "ar",
    "optionText": "\u0623\u0639\u0627\u0631\u0636"
  },
  {
    "optionKey": "3",
    "languageCode": "ml",
    "optionText": "\u0d24\u0d40\u0d7c\u0d1a\u0d4d\u0d1a\u0d2f\u0d3f\u0d32\u0d4d\u0d32"
  },
  {
    "optionKey": "3",
    "languageCode": "hi",
    "optionText": "\u0928\u093f\u0936\u094d\u091a\u093f\u0924 \u0928\u0939\u0940\u0902"
  },
  {
    "optionKey": "3",
    "languageCode": "ta",
    "optionText": "\u0ba8\u0b9f\u0bc1\u0ba8\u0bbf\u0bb2\u0bc8"
  },
  {
    "optionKey": "3",
    "languageCode": "kn",
    "optionText": "\u0ca4\u0c9f\u0cb8\u0ccd\u0ca5"
  },
  {
    "optionKey": "3",
    "languageCode": "ar",
    "optionText": "\u0645\u062d\u0627\u064a\u062f"
  },
  {
    "optionKey": "4",
    "languageCode": "ml",
    "optionText": "\u0d2f\u0d4b\u0d1c\u0d3f\u0d15\u0d4d\u0d15\u0d41\u0d28\u0d4d\u0d28\u0d41"
  },
  {
    "optionKey": "4",
    "languageCode": "hi",
    "optionText": "\u0938\u0939\u092e\u0924"
  },
  {
    "optionKey": "4",
    "languageCode": "ta",
    "optionText": "\u0b89\u0b9f\u0ba9\u0bcd\u0baa\u0b9f\u0bc1\u0b95\u0bbf\u0bb1\u0bc7\u0ba9\u0bcd"
  },
  {
    "optionKey": "4",
    "languageCode": "kn",
    "optionText": "\u0c92\u0caa\u0ccd\u0caa\u0cc1\u0ca4\u0ccd\u0ca4\u0cc7\u0ca8\u0cc6"
  },
  {
    "optionKey": "4",
    "languageCode": "ar",
    "optionText": "\u0623\u0648\u0627\u0641\u0642"
  },
  {
    "optionKey": "5",
    "languageCode": "ml",
    "optionText": "\u0d2a\u0d42\u0d7c\u0d23\u0d4d\u0d23\u0d2e\u0d3e\u0d2f\u0d3f \u0d2f\u0d4b\u0d1c\u0d3f\u0d15\u0d4d\u0d15\u0d41\u0d28\u0d4d\u0d28\u0d41"
  },
  {
    "optionKey": "5",
    "languageCode": "hi",
    "optionText": "\u0926\u0943\u0922\u093c\u0924\u093e \u0938\u0947 \u0938\u0939\u092e\u0924"
  },
  {
    "optionKey": "5",
    "languageCode": "ta",
    "optionText": "\u0bae\u0bc1\u0bb1\u0bcd\u0bb1\u0bbf\u0bb2\u0bc1\u0bae\u0bcd \u0b89\u0b9f\u0ba9\u0bcd\u0baa\u0b9f\u0bc1\u0b95\u0bbf\u0bb1\u0bc7\u0ba9\u0bcd"
  },
  {
    "optionKey": "5",
    "languageCode": "kn",
    "optionText": "\u0c96\u0c82\u0ca1\u0cbf\u0ca4\u0cb5\u0cbe\u0c97\u0cbf\u0caf\u0cc2 \u0c92\u0caa\u0ccd\u0caa\u0cc1\u0ca4\u0ccd\u0ca4\u0cc7\u0ca8\u0cc6"
  },
  {
    "optionKey": "5",
    "languageCode": "ar",
    "optionText": "\u0623\u0648\u0627\u0641\u0642 \u0628\u0634\u062f\u0629"
  }
];

export const HUMANITIES_CAREER_FINDER_MCQ_OPTIONS: McqOptionTranslationSeed[] = [
  {
    "questionNumber": 61,
    "optionKey": "A",
    "languageCode": "ml",
    "optionText": "\u0d35\u0d3f\u0d15\u0d3e\u0d30\u0d19\u0d4d\u0d19\u0d33\u0d41\u0d02 \u0d2c\u0d28\u0d4d\u0d27\u0d19\u0d4d\u0d19\u0d33\u0d41\u0d02 \u0d06\u0d33\u0d41\u0d15\u0d33\u0d46 \u0d0e\u0d19\u0d4d\u0d19\u0d28\u0d46 \u0d38\u0d4d\u0d35\u0d3e\u0d27\u0d40\u0d28\u0d3f\u0d15\u0d4d\u0d15\u0d41\u0d28\u0d4d\u0d28\u0d41 \u0d0e\u0d28\u0d4d\u0d28\u0d24\u0d4d"
  },
  {
    "questionNumber": 61,
    "optionKey": "A",
    "languageCode": "hi",
    "optionText": "\u092d\u093e\u0935\u0928\u093e\u090f\u0902 \u0914\u0930 \u0938\u0902\u092c\u0902\u0927 \u0932\u094b\u0917\u094b\u0902 \u0915\u094b \u0915\u0948\u0938\u0947 \u092a\u094d\u0930\u092d\u093e\u0935\u093f\u0924 \u0915\u0930\u0924\u0947 \u0939\u0948\u0902"
  },
  {
    "questionNumber": 61,
    "optionKey": "A",
    "languageCode": "ta",
    "optionText": "\u0b89\u0ba3\u0bb0\u0bcd\u0b9a\u0bcd\u0b9a\u0bbf\u0b95\u0bb3\u0bc1\u0bae\u0bcd \u0b89\u0bb1\u0bb5\u0bc1\u0b95\u0bb3\u0bc1\u0bae\u0bcd \u0bae\u0b95\u0bcd\u0b95\u0bb3\u0bc8 \u0b8e\u0bb5\u0bcd\u0bb5\u0bbe\u0bb1\u0bc1 \u0baa\u0bbe\u0ba4\u0bbf\u0b95\u0bcd\u0b95\u0bbf\u0ba9\u0bcd\u0bb1\u0ba9 \u0b8e\u0ba9\u0bcd\u0baa\u0ba4\u0bc1"
  },
  {
    "questionNumber": 61,
    "optionKey": "A",
    "languageCode": "kn",
    "optionText": "\u0cad\u0cbe\u0cb5\u0ca8\u0cc6\u0c97\u0cb3\u0cc1 \u0cae\u0ca4\u0ccd\u0ca4\u0cc1 \u0cb8\u0c82\u0cac\u0c82\u0ca7\u0c97\u0cb3\u0cc1 \u0c9c\u0ca8\u0cb0 \u0cae\u0cc7\u0cb2\u0cc6 \u0cb9\u0cc7\u0c97\u0cc6 \u0caa\u0ccd\u0cb0\u0cad\u0cbe\u0cb5 \u0cac\u0cc0\u0cb0\u0cc1\u0ca4\u0ccd\u0ca4\u0cb5\u0cc6 \u0c8e\u0c82\u0cac\u0cc1\u0ca6\u0cc1"
  },
  {
    "questionNumber": 61,
    "optionKey": "A",
    "languageCode": "ar",
    "optionText": "\u0643\u064a\u0641 \u062a\u0624\u062b\u0631 \u0627\u0644\u0639\u0648\u0627\u0637\u0641 \u0648\u0627\u0644\u0639\u0644\u0627\u0642\u0627\u062a \u0639\u0644\u0649 \u0633\u0644\u0648\u0643 \u0648\u062a\u0637\u0648\u0631 \u0627\u0644\u0623\u0641\u0631\u0627\u062f"
  },
  {
    "questionNumber": 61,
    "optionKey": "B",
    "languageCode": "ml",
    "optionText": "\u0d12\u0d30\u0d41 \u0d2a\u0d4a\u0d24\u0d41\u0d24\u0d40\u0d30\u0d41\u0d2e\u0d3e\u0d28\u0d2e\u0d4b \u0d28\u0d3f\u0d2f\u0d2e\u0d2e\u0d4b \u0d2a\u0d57\u0d30\u0d28\u0d4d\u0d2e\u0d3e\u0d30\u0d46 \u0d0e\u0d19\u0d4d\u0d19\u0d28\u0d46 \u0d2c\u0d3e\u0d27\u0d3f\u0d15\u0d4d\u0d15\u0d41\u0d28\u0d4d\u0d28\u0d41 \u0d0e\u0d28\u0d4d\u0d28\u0d24\u0d4d"
  },
  {
    "questionNumber": 61,
    "optionKey": "B",
    "languageCode": "hi",
    "optionText": "\u0938\u093e\u0930\u094d\u0935\u091c\u0928\u093f\u0915 \u0928\u093f\u0930\u094d\u0923\u092f \u092f\u093e \u0928\u093f\u092f\u092e \u0928\u093e\u0917\u0930\u093f\u0915\u094b\u0902 \u0915\u094b \u0915\u0948\u0938\u0947 \u092a\u094d\u0930\u092d\u093e\u0935\u093f\u0924 \u0915\u0930\u0924\u093e \u0939\u0948"
  },
  {
    "questionNumber": 61,
    "optionKey": "B",
    "languageCode": "ta",
    "optionText": "\u0b92\u0bb0\u0bc1 \u0baa\u0bca\u0ba4\u0bc1 \u0bae\u0bc1\u0b9f\u0bbf\u0bb5\u0bc1 \u0b85\u0bb2\u0bcd\u0bb2\u0ba4\u0bc1 \u0bb5\u0bbf\u0ba4\u0bbf \u0b95\u0bc1\u0b9f\u0bbf\u0bae\u0b95\u0bcd\u0b95\u0bb3\u0bc8 \u0b8e\u0bb5\u0bcd\u0bb5\u0bbe\u0bb1\u0bc1 \u0baa\u0bbe\u0ba4\u0bbf\u0b95\u0bcd\u0b95\u0bbf\u0bb1\u0ba4\u0bc1 \u0b8e\u0ba9\u0bcd\u0baa\u0ba4\u0bc1"
  },
  {
    "questionNumber": 61,
    "optionKey": "B",
    "languageCode": "kn",
    "optionText": "\u0cb8\u0cbe\u0cb0\u0ccd\u0cb5\u0c9c\u0ca8\u0cbf\u0c95 \u0ca8\u0cbf\u0cb0\u0ccd\u0ca7\u0cbe\u0cb0 \u0c85\u0ca5\u0cb5\u0cbe \u0ca8\u0cbf\u0caf\u0cae\u0cb5\u0cc1 \u0ca8\u0cbe\u0c97\u0cb0\u0cbf\u0c95\u0cb0 \u0cae\u0cc7\u0cb2\u0cc6 \u0cb9\u0cc7\u0c97\u0cc6 \u0caa\u0cb0\u0cbf\u0ca3\u0cbe\u0cae \u0cac\u0cc0\u0cb0\u0cc1\u0ca4\u0ccd\u0ca4\u0ca6\u0cc6 \u0c8e\u0c82\u0cac\u0cc1\u0ca6\u0cc1"
  },
  {
    "questionNumber": 61,
    "optionKey": "B",
    "languageCode": "ar",
    "optionText": "\u0643\u064a\u0641 \u064a\u0624\u062b\u0631 \u0642\u0631\u0627\u0631 \u0639\u0627\u0645 \u0623\u0648 \u0642\u0627\u0639\u062f\u0629 \u0642\u0627\u0646\u0648\u0646\u064a\u0629 \u0639\u0644\u0649 \u062d\u064a\u0627\u0629 \u0627\u0644\u0645\u0648\u0627\u0637\u0646\u064a\u0646"
  },
  {
    "questionNumber": 61,
    "optionKey": "C",
    "languageCode": "ml",
    "optionText": "\u0d12\u0d30\u0d41 \u0d15\u0d25\u0d2f\u0d4b \u0d38\u0d28\u0d4d\u0d26\u0d47\u0d36\u0d2e\u0d4b \u0d2e\u0d3e\u0d27\u0d4d\u0d2f\u0d2e\u0d2e\u0d4b \u0d2a\u0d4d\u0d30\u0d47\u0d15\u0d4d\u0d37\u0d15\u0d30\u0d46 \u0d0e\u0d19\u0d4d\u0d19\u0d28\u0d46 \u0d06\u0d15\u0d7c\u0d37\u0d3f\u0d15\u0d4d\u0d15\u0d41\u0d28\u0d4d\u0d28\u0d41 \u0d0e\u0d28\u0d4d\u0d28\u0d24\u0d4d"
  },
  {
    "questionNumber": 61,
    "optionKey": "C",
    "languageCode": "hi",
    "optionText": "\u090f\u0915 \u0915\u0939\u093e\u0928\u0940, \u0938\u0902\u0926\u0947\u0936 \u092f\u093e \u092e\u0940\u0921\u093f\u092f\u093e \u0926\u0930\u094d\u0936\u0915\u094b\u0902 \u0915\u094b \u0915\u0948\u0938\u0947 \u092a\u094d\u0930\u092d\u093e\u0935\u093f\u0924 \u0915\u0930\u0924\u093e \u0939\u0948"
  },
  {
    "questionNumber": 61,
    "optionKey": "C",
    "languageCode": "ta",
    "optionText": "\u0b92\u0bb0\u0bc1 \u0b95\u0ba4\u0bc8, \u0b9a\u0bc6\u0baf\u0bcd\u0ba4\u0bbf \u0b85\u0bb2\u0bcd\u0bb2\u0ba4\u0bc1 \u0b8a\u0b9f\u0b95\u0bae\u0bcd \u0baa\u0bbe\u0bb0\u0bcd\u0bb5\u0bc8\u0baf\u0bbe\u0bb3\u0bb0\u0bcd\u0b95\u0bb3\u0bc8 \u0b8e\u0bb5\u0bcd\u0bb5\u0bbe\u0bb1\u0bc1 \u0b88\u0bb0\u0bcd\u0b95\u0bcd\u0b95\u0bbf\u0bb1\u0ba4\u0bc1 \u0b8e\u0ba9\u0bcd\u0baa\u0ba4\u0bc1"
  },
  {
    "questionNumber": 61,
    "optionKey": "C",
    "languageCode": "kn",
    "optionText": "\u0c92\u0c82\u0ca6\u0cc1 \u0c95\u0ca5\u0cc6, \u0cb8\u0c82\u0ca6\u0cc7\u0cb6 \u0c85\u0ca5\u0cb5\u0cbe \u0cae\u0cbe\u0ca7\u0ccd\u0caf\u0cae\u0cb5\u0cc1 \u0caa\u0ccd\u0cb0\u0cc7\u0c95\u0ccd\u0cb7\u0c95\u0cb0\u0ca8\u0ccd\u0ca8\u0cc1 \u0cb9\u0cc7\u0c97\u0cc6 \u0caa\u0ccd\u0cb0\u0cad\u0cbe\u0cb5\u0cbf\u0cb8\u0cc1\u0ca4\u0ccd\u0ca4\u0ca6\u0cc6 \u0c8e\u0c82\u0cac\u0cc1\u0ca6\u0cc1"
  },
  {
    "questionNumber": 61,
    "optionKey": "C",
    "languageCode": "ar",
    "optionText": "\u0643\u064a\u0641 \u062a\u0624\u062b\u0631 \u0642\u0635\u0629 \u0623\u0648 \u0631\u0633\u0627\u0644\u0629 \u0623\u0648 \u0645\u062d\u062a\u0648\u0649 \u0625\u0639\u0644\u0627\u0645\u064a \u0639\u0644\u0649 \u0627\u0644\u062c\u0645\u0647\u0648\u0631"
  },
  {
    "questionNumber": 61,
    "optionKey": "D",
    "languageCode": "ml",
    "optionText": "\u0d12\u0d30\u0d41 \u0d38\u0d3e\u0d2e\u0d42\u0d39\u0d3f\u0d15 \u0d2a\u0d4d\u0d30\u0d36\u0d4d\u0d28\u0d02 \u0d0e\u0d19\u0d4d\u0d19\u0d28\u0d46 \u0d17\u0d35\u0d47\u0d37\u0d23\u0d02 \u0d1a\u0d46\u0d2f\u0d4d\u0d24\u0d4d \u0d35\u0d3f\u0d36\u0d15\u0d32\u0d28\u0d02 \u0d1a\u0d46\u0d2f\u0d4d\u0d2f\u0d3e\u0d02 \u0d0e\u0d28\u0d4d\u0d28\u0d24\u0d4d"
  },
  {
    "questionNumber": 61,
    "optionKey": "D",
    "languageCode": "hi",
    "optionText": "\u0915\u093f\u0938\u0940 \u0938\u093e\u092e\u093e\u091c\u093f\u0915 \u092e\u0941\u0926\u094d\u0926\u0947 \u092a\u0930 \u0936\u094b\u0927 \u0914\u0930 \u0935\u094d\u092f\u093e\u0916\u094d\u092f\u093e \u0915\u0948\u0938\u0947 \u0915\u0940 \u091c\u093e \u0938\u0915\u0924\u0940 \u0939\u0948"
  },
  {
    "questionNumber": 61,
    "optionKey": "D",
    "languageCode": "ta",
    "optionText": "\u0b92\u0bb0\u0bc1 \u0b9a\u0bae\u0bc2\u0b95\u0baa\u0bcd \u0baa\u0bbf\u0bb0\u0b9a\u0bcd\u0b9a\u0bbf\u0ba9\u0bc8\u0baf\u0bc8 \u0b8e\u0bb5\u0bcd\u0bb5\u0bbe\u0bb1\u0bc1 \u0b86\u0baf\u0bcd\u0bb5\u0bc1 \u0b9a\u0bc6\u0baf\u0bcd\u0ba4\u0bc1 \u0bb5\u0bbf\u0bb3\u0b95\u0bcd\u0b95\u0bb2\u0bbe\u0bae\u0bcd \u0b8e\u0ba9\u0bcd\u0baa\u0ba4\u0bc1"
  },
  {
    "questionNumber": 61,
    "optionKey": "D",
    "languageCode": "kn",
    "optionText": "\u0c92\u0c82\u0ca6\u0cc1 \u0cb8\u0cbe\u0cae\u0cbe\u0c9c\u0cbf\u0c95 \u0cb8\u0cae\u0cb8\u0ccd\u0caf\u0cc6\u0caf\u0ca8\u0ccd\u0ca8\u0cc1 \u0cb9\u0cc7\u0c97\u0cc6 \u0cb8\u0c82\u0cb6\u0ccb\u0ca7\u0cbf\u0cb8\u0cbf \u0cb5\u0cbf\u0cb5\u0cb0\u0cbf\u0cb8\u0cac\u0cb9\u0cc1\u0ca6\u0cc1 \u0c8e\u0c82\u0cac\u0cc1\u0ca6\u0cc1"
  },
  {
    "questionNumber": 61,
    "optionKey": "D",
    "languageCode": "ar",
    "optionText": "\u0643\u064a\u0641 \u064a\u0645\u0643\u0646 \u0628\u062d\u062b \u0642\u0636\u064a\u0629 \u0627\u062c\u062a\u0645\u0627\u0639\u064a\u0629 \u0645\u0639\u0642\u062f\u0629 \u0648\u062a\u0641\u0633\u064a\u0631\u0647\u0627 \u0628\u0627\u0644\u0623\u062f\u0644\u0629"
  },
  {
    "questionNumber": 62,
    "optionKey": "A",
    "languageCode": "ml",
    "optionText": "\u0d38\u0d2e\u0d4d\u0d2e\u0d7c\u0d26\u0d4d\u0d26\u0d19\u0d4d\u0d19\u0d33\u0d4b\u0d1f\u0d4d \u0d06\u0d33\u0d41\u0d15\u0d7e \u0d0e\u0d19\u0d4d\u0d19\u0d28\u0d46 \u0d2a\u0d4d\u0d30\u0d24\u0d3f\u0d15\u0d30\u0d3f\u0d15\u0d4d\u0d15\u0d41\u0d28\u0d4d\u0d28\u0d41 \u0d0e\u0d28\u0d4d\u0d28\u0d4d \u0d2e\u0d28\u0d38\u0d4d\u0d38\u0d3f\u0d32\u0d3e\u0d15\u0d4d\u0d15\u0d41\u0d15"
  },
  {
    "questionNumber": 62,
    "optionKey": "A",
    "languageCode": "hi",
    "optionText": "\u0932\u094b\u0917 \u0924\u0928\u093e\u0935 \u0914\u0930 \u0926\u092c\u093e\u0935 \u092e\u0947\u0902 \u0915\u0948\u0938\u0947 \u092a\u094d\u0930\u0924\u093f\u0915\u094d\u0930\u093f\u092f\u093e \u0926\u0947\u0924\u0947 \u0939\u0948\u0902, \u092f\u0939 \u0938\u092e\u091d\u0928\u093e"
  },
  {
    "questionNumber": 62,
    "optionKey": "A",
    "languageCode": "ta",
    "optionText": "\u0bae\u0ba9 \u0b85\u0bb4\u0bc1\u0ba4\u0bcd\u0ba4\u0ba4\u0bcd\u0ba4\u0bbf\u0bb1\u0bcd\u0b95\u0bc1 \u0bae\u0b95\u0bcd\u0b95\u0bb3\u0bcd \u0b8e\u0bb5\u0bcd\u0bb5\u0bbe\u0bb1\u0bc1 \u0baa\u0ba4\u0bbf\u0bb2\u0bb3\u0bbf\u0b95\u0bcd\u0b95\u0bbf\u0bb1\u0bbe\u0bb0\u0bcd\u0b95\u0bb3\u0bcd \u0b8e\u0ba9\u0bcd\u0baa\u0ba4\u0bc8\u0baa\u0bcd \u0baa\u0bc1\u0bb0\u0bbf\u0ba8\u0bcd\u0ba4\u0bc1\u0b95\u0bca\u0bb3\u0bcd\u0bb5\u0ba4\u0bc1"
  },
  {
    "questionNumber": 62,
    "optionKey": "A",
    "languageCode": "kn",
    "optionText": "\u0c9c\u0ca8\u0cb0\u0cc1 \u0c92\u0ca4\u0ccd\u0ca4\u0ca1\u0c95\u0ccd\u0c95\u0cc6 \u0cb9\u0cc7\u0c97\u0cc6 \u0caa\u0ccd\u0cb0\u0ca4\u0cbf\u0c95\u0ccd\u0cb0\u0cbf\u0caf\u0cbf\u0cb8\u0cc1\u0ca4\u0ccd\u0ca4\u0cbe\u0cb0\u0cc6 \u0c8e\u0c82\u0cac\u0cc1\u0ca6\u0ca8\u0ccd\u0ca8\u0cc1 \u0c85\u0cb0\u0ccd\u0ca5\u0cae\u0cbe\u0ca1\u0cbf\u0c95\u0cca\u0cb3\u0ccd\u0cb3\u0cc1\u0cb5\u0cc1\u0ca6\u0cc1"
  },
  {
    "questionNumber": 62,
    "optionKey": "A",
    "languageCode": "ar",
    "optionText": "\u0641\u0647\u0645 \u0643\u064a\u0641\u064a\u0629 \u062a\u0639\u0627\u0645\u0644 \u0627\u0644\u0623\u0641\u0631\u0627\u062f \u0645\u0639 \u0627\u0644\u0636\u063a\u0648\u0637 \u0648\u0627\u0644\u0645\u0648\u0627\u0642\u0641 \u0627\u0644\u0635\u0639\u0628\u0629"
  },
  {
    "questionNumber": 62,
    "optionKey": "B",
    "languageCode": "ml",
    "optionText": "\u0d12\u0d30\u0d41 \u0d38\u0d4d\u0d15\u0d42\u0d7e \u0d05\u0d32\u0d4d\u0d32\u0d46\u0d19\u0d4d\u0d15\u0d3f\u0d7d \u0d15\u0d2e\u0d4d\u0d2e\u0d4d\u0d2f\u0d42\u0d23\u0d3f\u0d31\u0d4d\u0d31\u0d3f \u0d28\u0d3f\u0d2f\u0d2e\u0d02 \u0d28\u0d40\u0d24\u0d3f\u0d2f\u0d41\u0d15\u0d4d\u0d24\u0d2e\u0d3e\u0d23\u0d4b \u0d0e\u0d28\u0d4d\u0d28\u0d4d \u0d2a\u0d30\u0d3f\u0d36\u0d4b\u0d27\u0d3f\u0d15\u0d4d\u0d15\u0d41\u0d15"
  },
  {
    "questionNumber": 62,
    "optionKey": "B",
    "languageCode": "hi",
    "optionText": "\u092f\u0939 \u091c\u093e\u0902\u091a\u0928\u093e \u0915\u093f \u0915\u094d\u092f\u093e \u0915\u094b\u0908 \u0938\u094d\u0915\u0942\u0932 \u092f\u093e \u0938\u093e\u092e\u0941\u0926\u093e\u092f\u093f\u0915 \u0928\u093f\u092f\u092e \u0928\u093f\u0937\u094d\u092a\u0915\u094d\u0937 \u0939\u0948"
  },
  {
    "questionNumber": 62,
    "optionKey": "B",
    "languageCode": "ta",
    "optionText": "\u0baa\u0bb3\u0bcd\u0bb3\u0bbf \u0b85\u0bb2\u0bcd\u0bb2\u0ba4\u0bc1 \u0b9a\u0bae\u0bc2\u0b95 \u0bb5\u0bbf\u0ba4\u0bbf \u0ba8\u0bbf\u0baf\u0bbe\u0baf\u0bae\u0bbe\u0ba9\u0ba4\u0bbe \u0b8e\u0ba9\u0bcd\u0bb1\u0bc1 \u0b86\u0bb0\u0bbe\u0baf\u0bcd\u0bb5\u0ba4\u0bc1"
  },
  {
    "questionNumber": 62,
    "optionKey": "B",
    "languageCode": "kn",
    "optionText": "\u0cb6\u0cbe\u0cb2\u0cc6\u0caf \u0c85\u0ca5\u0cb5\u0cbe \u0cb8\u0cae\u0cc1\u0ca6\u0cbe\u0caf\u0ca6 \u0ca8\u0cbf\u0caf\u0cae\u0cb5\u0cc1 \u0ca8\u0ccd\u0caf\u0cbe\u0caf\u0caf\u0cc1\u0ca4\u0cb5\u0cbe\u0c97\u0cbf\u0ca6\u0cc6\u0caf\u0cc7 \u0c8e\u0c82\u0ca6\u0cc1 \u0caa\u0cb0\u0cbf\u0cb6\u0cc0\u0cb2\u0cbf\u0cb8\u0cc1\u0cb5\u0cc1\u0ca6\u0cc1"
  },
  {
    "questionNumber": 62,
    "optionKey": "B",
    "languageCode": "ar",
    "optionText": "\u062f\u0631\u0627\u0633\u0629 \u0645\u062f\u0649 \u0639\u062f\u0627\u0644\u0629 \u0644\u0627\u0626\u062d\u0629 \u0645\u062f\u0631\u0633\u064a\u0629 \u0623\u0648 \u0642\u0627\u0639\u062f\u0629 \u0645\u062c\u062a\u0645\u0639\u064a\u0629 \u0648\u062a\u0623\u062b\u064a\u0631\u0647\u0627"
  },
  {
    "questionNumber": 62,
    "optionKey": "C",
    "languageCode": "ml",
    "optionText": "\u0d2a\u0d4d\u0d30\u0d47\u0d15\u0d4d\u0d37\u0d15\u0d7c\u0d15\u0d4d\u0d15\u0d3e\u0d2f\u0d3f \u0d12\u0d30\u0d41 \u0d38\u0d28\u0d4d\u0d26\u0d47\u0d36 \u0d15\u0d3e\u0d2e\u0d4d\u0d2a\u0d2f\u0d3f\u0d28\u0d4b \u0d15\u0d25\u0d2f\u0d4b \u0d30\u0d42\u0d2a\u0d15\u0d7d\u0d2a\u0d4d\u0d2a\u0d28 \u0d1a\u0d46\u0d2f\u0d4d\u0d2f\u0d41\u0d15"
  },
  {
    "questionNumber": 62,
    "optionKey": "C",
    "languageCode": "hi",
    "optionText": "\u0926\u0930\u094d\u0936\u0915\u094b\u0902 \u0915\u0947 \u0932\u093f\u090f \u090f\u0915 \u0938\u0902\u0926\u0947\u0936 \u0905\u092d\u093f\u092f\u093e\u0928 \u092f\u093e \u0915\u0939\u093e\u0928\u0940 \u0924\u0948\u092f\u093e\u0930 \u0915\u0930\u0928\u093e"
  },
  {
    "questionNumber": 62,
    "optionKey": "C",
    "languageCode": "ta",
    "optionText": "\u0baa\u0bbe\u0bb0\u0bcd\u0bb5\u0bc8\u0baf\u0bbe\u0bb3\u0bb0\u0bcd\u0b95\u0bb3\u0bc1\u0b95\u0bcd\u0b95\u0bbe\u0b95 \u0b92\u0bb0\u0bc1 \u0baa\u0bbf\u0bb0\u0b9a\u0bcd\u0b9a\u0bbe\u0bb0\u0bae\u0bcd \u0b85\u0bb2\u0bcd\u0bb2\u0ba4\u0bc1 \u0b95\u0ba4\u0bc8\u0baf\u0bc8 \u0b89\u0bb0\u0bc1\u0bb5\u0bbe\u0b95\u0bcd\u0b95\u0bc1\u0bb5\u0ba4\u0bc1"
  },
  {
    "questionNumber": 62,
    "optionKey": "C",
    "languageCode": "kn",
    "optionText": "\u0caa\u0ccd\u0cb0\u0cc7\u0c95\u0ccd\u0cb7\u0c95\u0cb0\u0cbf\u0c97\u0cbe\u0c97\u0cbf \u0c85\u0cad\u0cbf\u0caf\u0cbe\u0ca8 \u0c85\u0ca5\u0cb5\u0cbe \u0c95\u0ca5\u0cc6\u0caf\u0ca8\u0ccd\u0ca8\u0cc1 \u0cb8\u0cc3\u0cb7\u0ccd\u0c9f\u0cbf\u0cb8\u0cc1\u0cb5\u0cc1\u0ca6\u0cc1"
  },
  {
    "questionNumber": 62,
    "optionKey": "C",
    "languageCode": "ar",
    "optionText": "\u062a\u0635\u0645\u064a\u0645 \u062d\u0645\u0644\u0629 \u062a\u0648\u0639\u0648\u064a\u0629 \u0623\u0648 \u0645\u062d\u062a\u0648\u0649 \u0642\u0635\u0635\u064a \u062c\u0630\u0627\u0628 \u0648\u0645\u0624\u062b\u0631 \u0644\u0644\u062c\u0645\u0647\u0648\u0631"
  },
  {
    "questionNumber": 62,
    "optionKey": "D",
    "languageCode": "ml",
    "optionText": "\u0d35\u0d3f\u0d35\u0d3f\u0d27 \u0d38\u0d4d\u0d30\u0d4b\u0d24\u0d38\u0d4d\u0d38\u0d41\u0d15\u0d33\u0d3f\u0d7d \u0d28\u0d3f\u0d28\u0d4d\u0d28\u0d41\u0d33\u0d4d\u0d33 \u0d24\u0d46\u0d33\u0d3f\u0d35\u0d41\u0d15\u0d7e \u0d09\u0d2a\u0d2f\u0d4b\u0d17\u0d3f\u0d1a\u0d4d\u0d1a\u0d4d \u0d12\u0d30\u0d41 \u0d38\u0d3e\u0d2e\u0d42\u0d39\u0d3f\u0d15 \u0d2a\u0d4d\u0d30\u0d36\u0d4d\u0d28\u0d02 \u0d2a\u0d20\u0d3f\u0d15\u0d4d\u0d15\u0d41\u0d15"
  },
  {
    "questionNumber": 62,
    "optionKey": "D",
    "languageCode": "hi",
    "optionText": "\u0935\u093f\u092d\u093f\u0928\u094d\u0928 \u0938\u094d\u0930\u094b\u0924\u094b\u0902 \u0938\u0947 \u0938\u093e\u0915\u094d\u0937\u094d\u092f \u091c\u0941\u091f\u093e\u0915\u0930 \u0915\u093f\u0938\u0940 \u0938\u093e\u092e\u093e\u091c\u093f\u0915 \u092e\u0941\u0926\u094d\u0926\u0947 \u0915\u093e \u0905\u0927\u094d\u092f\u092f\u0928 \u0915\u0930\u0928\u093e"
  },
  {
    "questionNumber": 62,
    "optionKey": "D",
    "languageCode": "ta",
    "optionText": "\u0baa\u0bb2\u0bcd\u0bb5\u0bc7\u0bb1\u0bc1 \u0b86\u0ba4\u0bbe\u0bb0\u0b99\u0bcd\u0b95\u0bb3\u0bbf\u0bb2\u0bcd \u0b87\u0bb0\u0bc1\u0ba8\u0bcd\u0ba4\u0bc1 \u0ba4\u0b95\u0bb5\u0bb2\u0bcd\u0b95\u0bb3\u0bc8\u0baa\u0bcd \u0baa\u0bc6\u0bb1\u0bcd\u0bb1\u0bc1 \u0b9a\u0bae\u0bc2\u0b95\u0baa\u0bcd \u0baa\u0bbf\u0bb0\u0b9a\u0bcd\u0b9a\u0bbf\u0ba9\u0bc8\u0baf\u0bc8\u0baa\u0bcd \u0baa\u0b9f\u0bbf\u0baa\u0bcd\u0baa\u0ba4\u0bc1"
  },
  {
    "questionNumber": 62,
    "optionKey": "D",
    "languageCode": "kn",
    "optionText": "\u0cb5\u0cbf\u0cb5\u0cbf\u0ca7 \u0cae\u0cc2\u0cb2\u0c97\u0cb3 \u0caa\u0cc1\u0cb0\u0cbe\u0cb5\u0cc6\u0c97\u0cb3\u0ca8\u0ccd\u0ca8\u0cc1 \u0cac\u0cb3\u0cb8\u0cbf \u0cb8\u0cbe\u0cae\u0cbe\u0c9c\u0cbf\u0c95 \u0cb8\u0cae\u0cb8\u0ccd\u0caf\u0cc6\u0caf\u0ca8\u0ccd\u0ca8\u0cc1 \u0c85\u0ca7\u0ccd\u0caf\u0caf\u0ca8 \u0cae\u0cbe\u0ca1\u0cc1\u0cb5\u0cc1\u0ca6\u0cc1"
  },
  {
    "questionNumber": 62,
    "optionKey": "D",
    "languageCode": "ar",
    "optionText": "\u062f\u0631\u0627\u0633\u0629 \u0642\u0636\u064a\u0629 \u0645\u062c\u062a\u0645\u0639\u064a\u0629 \u0628\u0627\u0633\u062a\u062e\u062f\u0627\u0645 \u0623\u062f\u0644\u0629 \u0645\u0646 \u0645\u0635\u0627\u062f\u0631 \u0645\u062a\u0639\u062f\u062f\u0629 \u0648\u0645\u0648\u062b\u0648\u0642\u0629"
  },
  {
    "questionNumber": 63,
    "optionKey": "A",
    "languageCode": "ml",
    "optionText": "\u0d0e\u0d28\u0d4d\u0d24\u0d41\u0d15\u0d4a\u0d23\u0d4d\u0d1f\u0d3e\u0d23\u0d4d \u0d08 \u0d35\u0d4d\u0d2f\u0d15\u0d4d\u0d24\u0d3f \u0d07\u0d24\u0d4d\u0d24\u0d30\u0d24\u0d4d\u0d24\u0d3f\u0d7d \u0d2a\u0d4d\u0d30\u0d24\u0d3f\u0d15\u0d30\u0d3f\u0d15\u0d4d\u0d15\u0d41\u0d28\u0d4d\u0d28\u0d24\u0d4d?"
  },
  {
    "questionNumber": 63,
    "optionKey": "A",
    "languageCode": "hi",
    "optionText": "\u092f\u0939 \u0935\u094d\u092f\u0915\u094d\u0924\u093f \u0907\u0938 \u0924\u0930\u0939 \u0938\u0947 \u092a\u094d\u0930\u0924\u093f\u0915\u094d\u0930\u093f\u092f\u093e \u0915\u094d\u092f\u094b\u0902 \u0926\u0947 \u0930\u0939\u093e \u0939\u0948?"
  },
  {
    "questionNumber": 63,
    "optionKey": "A",
    "languageCode": "ta",
    "optionText": "\u0b87\u0ba8\u0bcd\u0ba4 \u0ba8\u0baa\u0bb0\u0bcd \u0b8f\u0ba9\u0bcd \u0b87\u0baa\u0bcd\u0baa\u0b9f\u0bbf \u0ba8\u0b9f\u0ba8\u0bcd\u0ba4\u0bc1\u0b95\u0bca\u0bb3\u0bcd\u0b95\u0bbf\u0bb1\u0bbe\u0bb0\u0bcd?"
  },
  {
    "questionNumber": 63,
    "optionKey": "A",
    "languageCode": "kn",
    "optionText": "\u0c88 \u0cb5\u0ccd\u0caf\u0c95\u0ccd\u0ca4\u0cbf\u0caf\u0cc1 \u0c88 \u0cb0\u0cc0\u0ca4\u0cbf \u0c8f\u0c95\u0cc6 \u0caa\u0ccd\u0cb0\u0ca4\u0cbf\u0c95\u0ccd\u0cb0\u0cbf\u0caf\u0cbf\u0cb8\u0cc1\u0ca4\u0ccd\u0ca4\u0cbf\u0ca6\u0ccd\u0ca6\u0cbe\u0ca8\u0cc6?"
  },
  {
    "questionNumber": 63,
    "optionKey": "A",
    "languageCode": "ar",
    "optionText": "\u0644\u0645\u0627\u0630\u0627 \u064a\u062a\u0635\u0631\u0641 \u0647\u0630\u0627 \u0627\u0644\u0634\u062e\u0635 \u0623\u0648 \u064a\u0634\u0639\u0631 \u0628\u0647\u0630\u0647 \u0627\u0644\u0637\u0631\u064a\u0642\u0629 \u0627\u0644\u0645\u062d\u062f\u062f\u0629\u061f"
  },
  {
    "questionNumber": 63,
    "optionKey": "B",
    "languageCode": "ml",
    "optionText": "\u0d07\u0d35\u0d3f\u0d1f\u0d46 \u0d2c\u0d3e\u0d27\u0d15\u0d2e\u0d3e\u0d15\u0d41\u0d28\u0d4d\u0d28 \u0d05\u0d35\u0d15\u0d3e\u0d36\u0d19\u0d4d\u0d19\u0d33\u0d41\u0d02 \u0d28\u0d3f\u0d2f\u0d2e\u0d19\u0d4d\u0d19\u0d33\u0d41\u0d02 \u0d09\u0d24\u0d4d\u0d24\u0d30\u0d35\u0d3e\u0d26\u0d3f\u0d24\u0d4d\u0d24\u0d19\u0d4d\u0d19\u0d33\u0d41\u0d02 \u0d0e\u0d28\u0d4d\u0d24\u0d4a\u0d15\u0d4d\u0d15\u0d46\u0d2f\u0d3e\u0d23\u0d4d?"
  },
  {
    "questionNumber": 63,
    "optionKey": "B",
    "languageCode": "hi",
    "optionText": "\u092f\u0939\u093e\u0901 \u0915\u094c\u0928 \u0938\u0947 \u0905\u0927\u093f\u0915\u093e\u0930, \u0928\u093f\u092f\u092e \u092f\u093e \u091c\u093f\u092e\u094d\u092e\u0947\u0926\u093e\u0930\u093f\u092f\u093e\u0901 \u0932\u093e\u0917\u0942 \u0939\u094b\u0924\u0940 \u0939\u0948\u0902?"
  },
  {
    "questionNumber": 63,
    "optionKey": "B",
    "languageCode": "ta",
    "optionText": "\u0b87\u0b99\u0bcd\u0b95\u0bc1 \u0b8e\u0ba9\u0bcd\u0ba9 \u0b89\u0bb0\u0bbf\u0bae\u0bc8\u0b95\u0bb3\u0bcd, \u0bb5\u0bbf\u0ba4\u0bbf\u0b95\u0bb3\u0bcd \u0bae\u0bb1\u0bcd\u0bb1\u0bc1\u0bae\u0bcd \u0baa\u0bca\u0bb1\u0bc1\u0baa\u0bcd\u0baa\u0bc1\u0b95\u0bb3\u0bcd \u0baa\u0bca\u0bb0\u0bc1\u0ba8\u0bcd\u0ba4\u0bc1\u0bae\u0bcd?"
  },
  {
    "questionNumber": 63,
    "optionKey": "B",
    "languageCode": "kn",
    "optionText": "\u0c87\u0cb2\u0ccd\u0cb2\u0cbf \u0caf\u0cbe\u0cb5 \u0cb9\u0c95\u0ccd\u0c95\u0cc1\u0c97\u0cb3\u0cc1, \u0ca8\u0cbf\u0caf\u0cae\u0c97\u0cb3\u0cc1 \u0cae\u0ca4\u0ccd\u0ca4\u0cc1 \u0c9c\u0cb5\u0cbe\u0cac\u0ccd\u0ca6\u0cbe\u0cb0\u0cbf\u0c97\u0cb3\u0cc1 \u0c85\u0ca8\u0ccd\u0cb5\u0caf\u0cbf\u0cb8\u0cc1\u0ca4\u0ccd\u0ca4\u0cb5\u0cc6?"
  },
  {
    "questionNumber": 63,
    "optionKey": "B",
    "languageCode": "ar",
    "optionText": "\u0645\u0627 \u0647\u064a \u0627\u0644\u062d\u0642\u0648\u0642 \u0648\u0627\u0644\u0642\u0648\u0627\u0639\u062f \u0648\u0627\u0644\u0645\u0633\u0624\u0648\u0644\u064a\u0627\u062a \u0627\u0644\u062a\u064a \u062a\u0646\u0637\u0628\u0642 \u0641\u064a \u0647\u0630\u0627 \u0627\u0644\u0645\u0648\u0642\u0641\u061f"
  },
  {
    "questionNumber": 63,
    "optionKey": "C",
    "languageCode": "ml",
    "optionText": "\u0d08 \u0d06\u0d36\u0d2f\u0d02 \u0d0e\u0d19\u0d4d\u0d19\u0d28\u0d46 \u0d06\u0d15\u0d7c\u0d37\u0d15\u0d2e\u0d3e\u0d2f \u0d30\u0d40\u0d24\u0d3f\u0d2f\u0d3f\u0d7d \u0d06\u0d36\u0d2f\u0d35\u0d3f\u0d28\u0d3f\u0d2e\u0d2f\u0d02 \u0d28\u0d1f\u0d24\u0d4d\u0d24\u0d3e\u0d02?"
  },
  {
    "questionNumber": 63,
    "optionKey": "C",
    "languageCode": "hi",
    "optionText": "\u0907\u0938 \u0935\u093f\u091a\u093e\u0930 \u0915\u094b \u092a\u094d\u0930\u092d\u093e\u0935\u0936\u093e\u0932\u0940 \u0914\u0930 \u0906\u0915\u0930\u094d\u0937\u0915 \u0924\u0930\u0940\u0915\u0947 \u0938\u0947 \u0915\u0948\u0938\u0947 \u0938\u0902\u092a\u094d\u0930\u0947\u0937\u093f\u0924 \u0915\u093f\u092f\u093e \u091c\u093e\u090f?"
  },
  {
    "questionNumber": 63,
    "optionKey": "C",
    "languageCode": "ta",
    "optionText": "\u0b87\u0ba8\u0bcd\u0ba4\u0b95\u0bcd \u0b95\u0bb0\u0bc1\u0ba4\u0bcd\u0ba4\u0bc8 \u0b8e\u0bb5\u0bcd\u0bb5\u0bbe\u0bb1\u0bc1 \u0b88\u0bb0\u0bcd\u0b95\u0bcd\u0b95\u0b95\u0bcd\u0b95\u0bc2\u0b9f\u0bbf\u0baf \u0bb5\u0b95\u0bc8\u0baf\u0bbf\u0bb2\u0bcd \u0ba4\u0bca\u0b9f\u0bb0\u0bcd\u0baa\u0bc1\u0b95\u0bca\u0bb3\u0bcd\u0bb3\u0bb2\u0bbe\u0bae\u0bcd?"
  },
  {
    "questionNumber": 63,
    "optionKey": "C",
    "languageCode": "kn",
    "optionText": "\u0c88 \u0c95\u0cb2\u0ccd\u0caa\u0ca8\u0cc6\u0caf\u0ca8\u0ccd\u0ca8\u0cc1 \u0c86\u0c95\u0cb0\u0ccd\u0cb7\u0c95\u0cb5\u0cbe\u0c97\u0cbf \u0cb9\u0cc7\u0c97\u0cc6 \u0cb8\u0c82\u0cb5\u0cb9\u0ca8 \u0cae\u0cbe\u0ca1\u0cac\u0cb9\u0cc1\u0ca6\u0cc1?"
  },
  {
    "questionNumber": 63,
    "optionKey": "C",
    "languageCode": "ar",
    "optionText": "\u0643\u064a\u0641 \u064a\u0645\u0643\u0646 \u0635\u064a\u0627\u063a\u0629 \u0647\u0630\u0647 \u0627\u0644\u0641\u0643\u0631\u0629 \u0648\u062a\u0642\u062f\u064a\u0645\u0647\u0627 \u0628\u0623\u0633\u0644\u0648\u0628 \u0625\u0639\u0644\u0627\u0645\u064a \u0645\u0634\u0648\u0642\u061f"
  },
  {
    "questionNumber": 63,
    "optionKey": "D",
    "languageCode": "ml",
    "optionText": "\u0d08 \u0d35\u0d3f\u0d37\u0d2f\u0d24\u0d4d\u0d24\u0d3f\u0d7b\u0d4d\u0d31\u0d46 \u0d06\u0d34\u0d02 \u0d2e\u0d28\u0d38\u0d4d\u0d38\u0d3f\u0d32\u0d3e\u0d15\u0d4d\u0d15\u0d3e\u0d7b \u0d0f\u0d24\u0d4a\u0d15\u0d4d\u0d15\u0d46 \u0d24\u0d46\u0d33\u0d3f\u0d35\u0d41\u0d15\u0d33\u0d3e\u0d23\u0d4d \u0d38\u0d39\u0d3e\u0d2f\u0d3f\u0d15\u0d4d\u0d15\u0d41\u0d15?"
  },
  {
    "questionNumber": 63,
    "optionKey": "D",
    "languageCode": "hi",
    "optionText": "\u0935\u094d\u092f\u093e\u092a\u0915 \u092e\u0941\u0926\u094d\u0926\u0947 \u0915\u094b \u0938\u092e\u091d\u0928\u0947 \u092e\u0947\u0902 \u0915\u094c\u0928 \u0938\u0947 \u0938\u093e\u0915\u094d\u0937\u094d\u092f \u0939\u092e\u093e\u0930\u0940 \u092e\u0926\u0926 \u0915\u0930\u0947\u0902\u0917\u0947?"
  },
  {
    "questionNumber": 63,
    "optionKey": "D",
    "languageCode": "ta",
    "optionText": "\u0baa\u0bb0\u0ba8\u0bcd\u0ba4 \u0baa\u0bbf\u0bb0\u0b9a\u0bcd\u0b9a\u0bbf\u0ba9\u0bc8\u0baf\u0bc8\u0baa\u0bcd \u0baa\u0bc1\u0bb0\u0bbf\u0ba8\u0bcd\u0ba4\u0bc1\u0b95\u0bca\u0bb3\u0bcd\u0bb3 \u0b8e\u0ba8\u0bcd\u0ba4 \u0b9a\u0bbe\u0ba9\u0bcd\u0bb1\u0bc1\u0b95\u0bb3\u0bcd \u0b89\u0ba4\u0bb5\u0bc1\u0bae\u0bcd?"
  },
  {
    "questionNumber": 63,
    "optionKey": "D",
    "languageCode": "kn",
    "optionText": "\u0cb5\u0ccd\u0caf\u0cbe\u0caa\u0c95 \u0cb8\u0cae\u0cb8\u0ccd\u0caf\u0cc6\u0caf\u0ca8\u0ccd\u0ca8\u0cc1 \u0c85\u0cb0\u0ccd\u0ca5\u0cae\u0cbe\u0ca1\u0cbf\u0c95\u0cca\u0cb3\u0ccd\u0cb3\u0cb2\u0cc1 \u0caf\u0cbe\u0cb5 \u0caa\u0cc1\u0cb0\u0cbe\u0cb5\u0cc6\u0c97\u0cb3\u0cc1 \u0cb8\u0cb9\u0cbe\u0caf \u0cae\u0cbe\u0ca1\u0cc1\u0ca4\u0ccd\u0ca4\u0cb5\u0cc6?"
  },
  {
    "questionNumber": 63,
    "optionKey": "D",
    "languageCode": "ar",
    "optionText": "\u0645\u0627 \u0647\u064a \u0627\u0644\u0623\u062f\u0644\u0629 \u0648\u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a \u0627\u0644\u062a\u064a \u062a\u0648\u0636\u062d \u0627\u0644\u0623\u0628\u0639\u0627\u062f \u0627\u0644\u0623\u0648\u0633\u0639 \u0644\u0647\u0630\u0647 \u0627\u0644\u0642\u0636\u064a\u0629\u061f"
  },
  {
    "questionNumber": 64,
    "optionKey": "A",
    "languageCode": "ml",
    "optionText": "\u0d06\u0d33\u0d41\u0d15\u0d33\u0d46 \u0d36\u0d4d\u0d30\u0d26\u0d4d\u0d27\u0d2f\u0d4b\u0d1f\u0d46 \u0d15\u0d47\u0d7e\u0d15\u0d4d\u0d15\u0d41\u0d15\u0d2f\u0d41\u0d02 \u0d05\u0d35\u0d30\u0d41\u0d1f\u0d46 \u0d05\u0d28\u0d41\u0d2d\u0d35\u0d19\u0d4d\u0d19\u0d7e \u0d2e\u0d28\u0d38\u0d4d\u0d38\u0d3f\u0d32\u0d3e\u0d15\u0d4d\u0d15\u0d41\u0d15\u0d2f\u0d41\u0d02 \u0d1a\u0d46\u0d2f\u0d4d\u0d2f\u0d41\u0d15"
  },
  {
    "questionNumber": 64,
    "optionKey": "A",
    "languageCode": "hi",
    "optionText": "\u0932\u094b\u0917\u094b\u0902 \u0915\u094b \u0927\u094d\u092f\u093e\u0928 \u0938\u0947 \u0938\u0941\u0928\u0928\u093e \u0914\u0930 \u0909\u0928\u0915\u0947 \u0905\u0928\u0941\u092d\u0935\u094b\u0902 \u0915\u094b \u0938\u092e\u091d\u0928\u093e"
  },
  {
    "questionNumber": 64,
    "optionKey": "A",
    "languageCode": "ta",
    "optionText": "\u0bae\u0b95\u0bcd\u0b95\u0bb3\u0bc8\u0b95\u0bcd \u0b95\u0bb5\u0ba9\u0bbf\u0ba4\u0bcd\u0ba4\u0bc1\u0b95\u0bcd \u0b95\u0bc7\u0b9f\u0bcd\u0b9f\u0bc1 \u0b85\u0bb5\u0bb0\u0bcd\u0b95\u0bb3\u0bbf\u0ba9\u0bcd \u0b85\u0ba9\u0bc1\u0baa\u0bb5\u0b99\u0bcd\u0b95\u0bb3\u0bc8\u0baa\u0bcd \u0baa\u0bc1\u0bb0\u0bbf\u0ba8\u0bcd\u0ba4\u0bc1\u0b95\u0bca\u0bb3\u0bcd\u0bb5\u0ba4\u0bc1"
  },
  {
    "questionNumber": 64,
    "optionKey": "A",
    "languageCode": "kn",
    "optionText": "\u0c9c\u0ca8\u0cb0 \u0cae\u0cbe\u0ca4\u0cc1\u0c97\u0cb3\u0ca8\u0ccd\u0ca8\u0cc1 \u0c86\u0cb2\u0cbf\u0cb8\u0cc1\u0cb5\u0cc1\u0ca6\u0cc1 \u0cae\u0ca4\u0ccd\u0ca4\u0cc1 \u0c85\u0cb5\u0cb0 \u0c85\u0ca8\u0cc1\u0cad\u0cb5\u0c97\u0cb3\u0ca8\u0ccd\u0ca8\u0cc1 \u0c85\u0cb0\u0ccd\u0ca5\u0cae\u0cbe\u0ca1\u0cbf\u0c95\u0cca\u0cb3\u0ccd\u0cb3\u0cc1\u0cb5\u0cc1\u0ca6\u0cc1"
  },
  {
    "questionNumber": 64,
    "optionKey": "A",
    "languageCode": "ar",
    "optionText": "\u0627\u0644\u0627\u0633\u062a\u0645\u0627\u0639 \u0625\u0644\u0649 \u0627\u0644\u0646\u0627\u0633 \u0628\u0639\u0645\u0642 \u0648\u0641\u0647\u0645 \u062a\u062c\u0627\u0631\u0628\u0647\u0645 \u0648\u0645\u0634\u0627\u0639\u0631\u0647\u0645 \u0648\u062f\u0639\u0645\u0647\u0645"
  },
  {
    "questionNumber": 64,
    "optionKey": "B",
    "languageCode": "ml",
    "optionText": "\u0d12\u0d30\u0d41 \u0d38\u0d19\u0d4d\u0d15\u0d40\u0d7c\u0d23\u0d4d\u0d23 \u0d2a\u0d4a\u0d24\u0d41\u0d35\u0d3f\u0d37\u0d2f\u0d24\u0d4d\u0d24\u0d3f\u0d7d \u0d2f\u0d41\u0d15\u0d4d\u0d24\u0d3f\u0d38\u0d39\u0d2e\u0d3e\u0d2f \u0d35\u0d3e\u0d26\u0d19\u0d4d\u0d19\u0d7e \u0d28\u0d3f\u0d30\u0d24\u0d4d\u0d24\u0d41\u0d15"
  },
  {
    "questionNumber": 64,
    "optionKey": "B",
    "languageCode": "hi",
    "optionText": "\u090f\u0915 \u0915\u0920\u093f\u0928 \u0938\u093e\u0930\u094d\u0935\u091c\u0928\u093f\u0915 \u092e\u0941\u0926\u094d\u0926\u0947 \u092a\u0930 \u0924\u0930\u094d\u0915\u0938\u0902\u0917\u0924 \u0914\u0930 \u0920\u094b\u0938 \u092a\u0915\u094d\u0937 \u0924\u0948\u092f\u093e\u0930 \u0915\u0930\u0928\u093e"
  },
  {
    "questionNumber": 64,
    "optionKey": "B",
    "languageCode": "ta",
    "optionText": "\u0b92\u0bb0\u0bc1 \u0b95\u0b9f\u0bbf\u0ba9\u0bae\u0bbe\u0ba9 \u0baa\u0bca\u0ba4\u0bc1\u0baa\u0bcd \u0baa\u0bbf\u0bb0\u0b9a\u0bcd\u0b9a\u0bbf\u0ba9\u0bc8\u0baf\u0bbf\u0bb2\u0bcd \u0b86\u0ba4\u0bbe\u0bb0\u0b99\u0bcd\u0b95\u0bb3\u0bc1\u0b9f\u0ba9\u0bcd \u0bb5\u0bbe\u0ba4\u0ba4\u0bcd\u0ba4\u0bc8 \u0b89\u0bb0\u0bc1\u0bb5\u0bbe\u0b95\u0bcd\u0b95\u0bc1\u0bb5\u0ba4\u0bc1"
  },
  {
    "questionNumber": 64,
    "optionKey": "B",
    "languageCode": "kn",
    "optionText": "\u0cb8\u0c82\u0c95\u0cc0\u0cb0\u0ccd\u0ca3 \u0cb8\u0cbe\u0cb0\u0ccd\u0cb5\u0c9c\u0ca8\u0cbf\u0c95 \u0cb5\u0cbf\u0cb7\u0caf\u0ca6 \u0c95\u0cc1\u0cb0\u0cbf\u0ca4\u0cc1 \u0ca4\u0cbe\u0cb0\u0ccd\u0c95\u0cbf\u0c95 \u0cb5\u0cbe\u0ca6\u0cb5\u0ca8\u0ccd\u0ca8\u0cc1 \u0cae\u0c82\u0ca1\u0cbf\u0cb8\u0cc1\u0cb5\u0cc1\u0ca6\u0cc1"
  },
  {
    "questionNumber": 64,
    "optionKey": "B",
    "languageCode": "ar",
    "optionText": "\u0628\u0646\u0627\u0621 \u062d\u062c\u0629 \u0639\u0642\u0644\u0627\u0646\u064a\u0629 \u0648\u0642\u0627\u0646\u0648\u0646\u064a\u0629 \u0645\u062f\u0631\u0648\u0633\u0629 \u062d\u0648\u0644 \u0642\u0636\u064a\u0629 \u0639\u0627\u0645\u0629 \u0634\u0627\u0626\u0643\u0629"
  },
  {
    "questionNumber": 64,
    "optionKey": "C",
    "languageCode": "ml",
    "optionText": "\u0d06\u0d33\u0d41\u0d15\u0d33\u0d46 \u0d1a\u0d3f\u0d28\u0d4d\u0d24\u0d3f\u0d2a\u0d4d\u0d2a\u0d3f\u0d15\u0d4d\u0d15\u0d41\u0d15\u0d2f\u0d4b \u0d38\u0d4d\u0d35\u0d3e\u0d27\u0d40\u0d28\u0d3f\u0d15\u0d4d\u0d15\u0d41\u0d15\u0d2f\u0d4b \u0d1a\u0d46\u0d2f\u0d4d\u0d2f\u0d41\u0d28\u0d4d\u0d28 \u0d09\u0d33\u0d4d\u0d33\u0d1f\u0d15\u0d4d\u0d15\u0d02 \u0d28\u0d3f\u0d7c\u0d2e\u0d4d\u0d2e\u0d3f\u0d15\u0d4d\u0d15\u0d41\u0d15"
  },
  {
    "questionNumber": 64,
    "optionKey": "C",
    "languageCode": "hi",
    "optionText": "\u0910\u0938\u0940 \u0938\u093e\u092e\u0917\u094d\u0930\u0940 \u092c\u0928\u093e\u0928\u093e \u091c\u094b \u0932\u094b\u0917\u094b\u0902 \u0915\u094b \u0938\u094b\u091a\u0928\u0947 \u092a\u0930 \u092e\u091c\u092c\u0942\u0930 \u0915\u0930\u0947 \u092f\u093e \u092a\u094d\u0930\u0947\u0930\u093f\u0924 \u0915\u0930\u0947"
  },
  {
    "questionNumber": 64,
    "optionKey": "C",
    "languageCode": "ta",
    "optionText": "\u0bae\u0b95\u0bcd\u0b95\u0bb3\u0bc8 \u0b9a\u0bbf\u0ba8\u0bcd\u0ba4\u0bbf\u0b95\u0bcd\u0b95 \u0bb5\u0bc8\u0b95\u0bcd\u0b95\u0bc1\u0bae\u0bcd \u0b85\u0bb2\u0bcd\u0bb2\u0ba4\u0bc1 \u0b89\u0ba3\u0bb0\u0bcd\u0ba4\u0bcd\u0ba4\u0bc1\u0bae\u0bcd \u0b89\u0bb3\u0bcd\u0bb3\u0b9f\u0b95\u0bcd\u0b95\u0ba4\u0bcd\u0ba4\u0bc8 \u0b89\u0bb0\u0bc1\u0bb5\u0bbe\u0b95\u0bcd\u0b95\u0bc1\u0bb5\u0ba4\u0bc1"
  },
  {
    "questionNumber": 64,
    "optionKey": "C",
    "languageCode": "kn",
    "optionText": "\u0c9c\u0ca8\u0cb0\u0ca8\u0ccd\u0ca8\u0cc1 \u0caf\u0ccb\u0c9a\u0cbf\u0cb8\u0cc1\u0cb5\u0c82\u0ca4\u0cc6 \u0c85\u0ca5\u0cb5\u0cbe \u0caa\u0ccd\u0cb0\u0cc7\u0cb0\u0cc7\u0caa\u0cbf\u0cb8\u0cc1\u0cb5\u0c82\u0ca4\u0cc6 \u0cae\u0cbe\u0ca1\u0cc1\u0cb5 \u0cb5\u0cbf\u0cb7\u0caf\u0cb5\u0ca8\u0ccd\u0ca8\u0cc1 \u0cb8\u0cc3\u0cb7\u0ccd\u0c9f\u0cbf\u0cb8\u0cc1\u0cb5\u0cc1\u0ca6\u0cc1"
  },
  {
    "questionNumber": 64,
    "optionKey": "C",
    "languageCode": "ar",
    "optionText": "\u0625\u0646\u062a\u0627\u062c \u0645\u062d\u062a\u0648\u0649 \u0625\u0628\u062f\u0627\u0639\u064a \u064a\u062b\u064a\u0631 \u0627\u0644\u062a\u0641\u0643\u064a\u0631 \u0648\u064a\u062d\u0631\u0643 \u0627\u0644\u0645\u0634\u0627\u0639\u0631 \u0644\u062f\u0649 \u0627\u0644\u062c\u0645\u0647\u0648\u0631"
  },
  {
    "questionNumber": 64,
    "optionKey": "D",
    "languageCode": "ml",
    "optionText": "\u0d35\u0d3f\u0d35\u0d30\u0d19\u0d4d\u0d19\u0d7e \u0d24\u0d3e\u0d30\u0d24\u0d2e\u0d4d\u0d2f\u0d02 \u0d1a\u0d46\u0d2f\u0d4d\u0d24\u0d4d \u0d15\u0d43\u0d24\u0d4d\u0d2f\u0d2e\u0d3e\u0d2f \u0d28\u0d3f\u0d17\u0d2e\u0d28\u0d19\u0d4d\u0d19\u0d33\u0d3f\u0d32\u0d46\u0d24\u0d4d\u0d24\u0d41\u0d15"
  },
  {
    "questionNumber": 64,
    "optionKey": "D",
    "languageCode": "hi",
    "optionText": "\u091c\u093e\u0928\u0915\u093e\u0930\u0940 \u0915\u0940 \u0924\u0941\u0932\u0928\u093e \u0915\u0930\u0915\u0947 \u092a\u0948\u091f\u0930\u094d\u0928 \u092f\u093e \u0938\u094d\u092a\u0937\u094d\u091f \u0935\u094d\u092f\u093e\u0916\u094d\u092f\u093e \u0916\u094b\u091c\u0928\u093e"
  },
  {
    "questionNumber": 64,
    "optionKey": "D",
    "languageCode": "ta",
    "optionText": "\u0ba4\u0b95\u0bb5\u0bb2\u0bcd\u0b95\u0bb3\u0bc8 \u0b92\u0baa\u0bcd\u0baa\u0bbf\u0b9f\u0bcd\u0b9f\u0bc1 \u0b9a\u0bb0\u0bbf\u0baf\u0bbe\u0ba9 \u0bb5\u0bbf\u0bb3\u0b95\u0bcd\u0b95\u0bae\u0bcd \u0b85\u0bb2\u0bcd\u0bb2\u0ba4\u0bc1 \u0bae\u0bc1\u0bb1\u0bc8\u0baf\u0bc8\u0b95\u0bcd \u0b95\u0ba3\u0bcd\u0b9f\u0bb1\u0bbf\u0bb5\u0ba4\u0bc1"
  },
  {
    "questionNumber": 64,
    "optionKey": "D",
    "languageCode": "kn",
    "optionText": "\u0cae\u0cbe\u0cb9\u0cbf\u0ca4\u0cbf\u0caf\u0ca8\u0ccd\u0ca8\u0cc1 \u0cb9\u0ccb\u0cb2\u0cbf\u0cb8\u0cbf \u0cb8\u0cc2\u0c95\u0ccd\u0ca4 \u0cb5\u0cbf\u0cb5\u0cb0\u0ca3\u0cc6 \u0c85\u0ca5\u0cb5\u0cbe \u0cae\u0cbe\u0ca6\u0cb0\u0cbf\u0caf\u0ca8\u0ccd\u0ca8\u0cc1 \u0c95\u0c82\u0ca1\u0cc1\u0cb9\u0cbf\u0ca1\u0cbf\u0caf\u0cc1\u0cb5\u0cc1\u0ca6\u0cc1"
  },
  {
    "questionNumber": 64,
    "optionKey": "D",
    "languageCode": "ar",
    "optionText": "\u0645\u0642\u0627\u0631\u0646\u0629 \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a \u0648\u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062a \u0644\u0627\u0633\u062a\u062e\u0644\u0627\u0635 \u062a\u0641\u0633\u064a\u0631 \u0645\u0646\u0647\u062c\u064a \u062f\u0642\u064a\u0642"
  },
  {
    "questionNumber": 65,
    "optionKey": "A",
    "languageCode": "ml",
    "optionText": "\u0d38\u0d57\u0d39\u0d43\u0d26\u0d19\u0d4d\u0d19\u0d7e, \u0d2a\u0d46\u0d30\u0d41\u0d2e\u0d3e\u0d31\u0d4d\u0d31\u0d02 \u0d05\u0d32\u0d4d\u0d32\u0d46\u0d19\u0d4d\u0d15\u0d3f\u0d7d \u0d15\u0d4d\u0d37\u0d47\u0d2e\u0d02 \u0d0e\u0d28\u0d4d\u0d28\u0d3f\u0d35\u0d2f\u0d46\u0d15\u0d4d\u0d15\u0d41\u0d31\u0d3f\u0d1a\u0d4d\u0d1a\u0d41\u0d33\u0d4d\u0d33 \u0d12\u0d30\u0d41 \u0d2a\u0d20\u0d28\u0d02"
  },
  {
    "questionNumber": 65,
    "optionKey": "A",
    "languageCode": "hi",
    "optionText": "\u0926\u094b\u0938\u094d\u0924\u0940, \u0935\u094d\u092f\u0935\u0939\u093e\u0930 \u092f\u093e \u0935\u094d\u092f\u0915\u094d\u0924\u093f\u0917\u0924 \u0915\u0932\u094d\u092f\u093e\u0923 \u092a\u0930 \u090f\u0915 \u0905\u0927\u094d\u092f\u092f\u0928"
  },
  {
    "questionNumber": 65,
    "optionKey": "A",
    "languageCode": "ta",
    "optionText": "\u0ba8\u0b9f\u0bcd\u0baa\u0bc1, \u0ba8\u0b9f\u0ba4\u0bcd\u0ba4\u0bc8 \u0b85\u0bb2\u0bcd\u0bb2\u0ba4\u0bc1 \u0ba8\u0bb2\u0bcd\u0bb5\u0bbe\u0bb4\u0bcd\u0bb5\u0bc1 \u0baa\u0bb1\u0bcd\u0bb1\u0bbf\u0baf \u0b92\u0bb0\u0bc1 \u0b86\u0baf\u0bcd\u0bb5\u0bc1"
  },
  {
    "questionNumber": 65,
    "optionKey": "A",
    "languageCode": "kn",
    "optionText": "\u0cb8\u0ccd\u0ca8\u0cc7\u0cb9, \u0ca8\u0ca1\u0cb5\u0cb3\u0cbf\u0c95\u0cc6 \u0c85\u0ca5\u0cb5\u0cbe \u0caf\u0ccb\u0c97\u0c95\u0ccd\u0cb7\u0cc7\u0cae\u0ca6 \u0cac\u0c97\u0cc6\u0c97\u0cbf\u0ca8 \u0c85\u0ca7\u0ccd\u0caf\u0caf\u0ca8"
  },
  {
    "questionNumber": 65,
    "optionKey": "A",
    "languageCode": "ar",
    "optionText": "\u062f\u0631\u0627\u0633\u0629 \u0645\u064a\u062f\u0627\u0646\u064a\u0629 \u062d\u0648\u0644 \u0627\u0644\u0639\u0644\u0627\u0642\u0627\u062a \u0627\u0644\u0625\u0646\u0633\u0627\u0646\u064a\u0629 \u0623\u0648 \u0627\u0644\u0633\u0644\u0648\u0643 \u0623\u0648 \u0627\u0644\u0635\u062d\u0629 \u0627\u0644\u0646\u0641\u0633\u064a\u0629"
  },
  {
    "questionNumber": 65,
    "optionKey": "B",
    "languageCode": "ml",
    "optionText": "\u0d2a\u0d57\u0d30\u0d24\u0d4d\u0d35\u0d02, \u0d05\u0d35\u0d15\u0d3e\u0d36\u0d19\u0d4d\u0d19\u0d7e, \u0d2d\u0d30\u0d23\u0d38\u0d02\u0d35\u0d3f\u0d27\u0d3e\u0d28\u0d02 \u0d0e\u0d28\u0d4d\u0d28\u0d3f\u0d35\u0d2f\u0d46\u0d15\u0d4d\u0d15\u0d41\u0d31\u0d3f\u0d1a\u0d4d\u0d1a\u0d41\u0d33\u0d4d\u0d33 \u0d2a\u0d4d\u0d30\u0d4b\u0d1c\u0d15\u0d4d\u0d31\u0d4d\u0d31\u0d4d"
  },
  {
    "questionNumber": 65,
    "optionKey": "B",
    "languageCode": "hi",
    "optionText": "\u0905\u0927\u093f\u0915\u093e\u0930, \u0928\u093e\u0917\u0930\u093f\u0915\u0924\u093e \u092f\u093e \u0938\u093e\u0930\u094d\u0935\u091c\u0928\u093f\u0915 \u0938\u0902\u0938\u094d\u0925\u093e\u0928\u094b\u0902 \u092a\u0930 \u090f\u0915 \u092a\u0930\u093f\u092f\u094b\u091c\u0928\u093e"
  },
  {
    "questionNumber": 65,
    "optionKey": "B",
    "languageCode": "ta",
    "optionText": "\u0b89\u0bb0\u0bbf\u0bae\u0bc8\u0b95\u0bb3\u0bcd, \u0b95\u0bc1\u0b9f\u0bbf\u0baf\u0bc1\u0bb0\u0bbf\u0bae\u0bc8 \u0b85\u0bb2\u0bcd\u0bb2\u0ba4\u0bc1 \u0baa\u0bca\u0ba4\u0bc1 \u0ba8\u0bbf\u0bb1\u0bc1\u0bb5\u0ba9\u0b99\u0bcd\u0b95\u0bb3\u0bcd \u0baa\u0bb1\u0bcd\u0bb1\u0bbf\u0baf \u0ba4\u0bbf\u0b9f\u0bcd\u0b9f\u0bae\u0bcd"
  },
  {
    "questionNumber": 65,
    "optionKey": "B",
    "languageCode": "kn",
    "optionText": "\u0cb9\u0c95\u0ccd\u0c95\u0cc1\u0c97\u0cb3\u0cc1, \u0caa\u0ccc\u0cb0\u0ca4\u0ccd\u0cb5 \u0c85\u0ca5\u0cb5\u0cbe \u0cb8\u0cbe\u0cb0\u0ccd\u0cb5\u0c9c\u0ca8\u0cbf\u0c95 \u0cb8\u0c82\u0cb8\u0ccd\u0ca5\u0cc6\u0c97\u0cb3 \u0c95\u0cc1\u0cb0\u0cbf\u0ca4 \u0caf\u0ccb\u0c9c\u0ca8\u0cc6"
  },
  {
    "questionNumber": 65,
    "optionKey": "B",
    "languageCode": "ar",
    "optionText": "\u0645\u0634\u0631\u0648\u0639 \u062d\u0648\u0644 \u0627\u0644\u062d\u0642\u0648\u0642 \u0627\u0644\u062f\u0633\u062a\u0648\u0631\u064a\u0629 \u0623\u0648 \u0627\u0644\u0645\u0648\u0627\u0637\u0646\u0629 \u0623\u0648 \u0627\u0644\u0645\u0624\u0633\u0633\u0627\u062a \u0627\u0644\u0639\u0627\u0645\u0629"
  },
  {
    "questionNumber": 65,
    "optionKey": "C",
    "languageCode": "ml",
    "optionText": "\u0d2a\u0d4b\u0d21\u0d4d\u200c\u0d15\u0d3e\u0d38\u0d4d\u0d31\u0d4d\u0d31\u0d4d, \u0d2e\u0d3e\u0d17\u0d38\u0d3f\u0d7b, \u0d35\u0d40\u0d21\u0d3f\u0d2f\u0d4b \u0d05\u0d32\u0d4d\u0d32\u0d46\u0d19\u0d4d\u0d15\u0d3f\u0d7d \u0d38\u0d7c\u0d17\u0d4d\u0d17\u0d3e\u0d24\u0d4d\u0d2e\u0d15 \u0d06\u0d36\u0d2f\u0d35\u0d3f\u0d28\u0d3f\u0d2e\u0d2f \u0d2a\u0d4d\u0d30\u0d4b\u0d1c\u0d15\u0d4d\u0d31\u0d4d\u0d31\u0d4d"
  },
  {
    "questionNumber": 65,
    "optionKey": "C",
    "languageCode": "hi",
    "optionText": "\u090f\u0915 \u092a\u0949\u0921\u0915\u093e\u0938\u094d\u091f, \u092a\u0924\u094d\u0930\u093f\u0915\u093e, \u0935\u0940\u0921\u093f\u092f\u094b \u092f\u093e \u0930\u091a\u0928\u093e\u0924\u094d\u092e\u0915 \u0938\u0902\u091a\u093e\u0930 \u092a\u0930\u093f\u092f\u094b\u091c\u0928\u093e"
  },
  {
    "questionNumber": 65,
    "optionKey": "C",
    "languageCode": "ta",
    "optionText": "\u0baa\u0bbe\u0b9f\u0bcd\u0b95\u0bbe\u0bb8\u0bcd\u0b9f\u0bcd, \u0b87\u0ba4\u0bb4\u0bcd, \u0bb5\u0bc0\u0b9f\u0bbf\u0baf\u0bcb \u0b85\u0bb2\u0bcd\u0bb2\u0ba4\u0bc1 \u0baa\u0b9f\u0bc8\u0baa\u0bcd\u0baa\u0bc1\u0ba4\u0bcd \u0ba4\u0bca\u0b9f\u0bb0\u0bcd\u0baa\u0bc1\u0ba4\u0bcd \u0ba4\u0bbf\u0b9f\u0bcd\u0b9f\u0bae\u0bcd"
  },
  {
    "questionNumber": 65,
    "optionKey": "C",
    "languageCode": "kn",
    "optionText": "\u0caa\u0cbe\u0ca1\u0ccd\u200c\u0c95\u0ccd\u0caf\u0cbe\u0cb8\u0ccd\u0c9f\u0ccd, \u0caa\u0ca4\u0ccd\u0cb0\u0cbf\u0c95\u0cc6, \u0cb5\u0cc0\u0ca1\u0cbf\u0caf\u0cca \u0c85\u0ca5\u0cb5\u0cbe \u0cb8\u0cc3\u0c9c\u0ca8\u0cb6\u0cc0\u0cb2 \u0cb8\u0c82\u0cb5\u0cb9\u0ca8 \u0caf\u0ccb\u0c9c\u0ca8\u0cc6"
  },
  {
    "questionNumber": 65,
    "optionKey": "C",
    "languageCode": "ar",
    "optionText": "\u0625\u0646\u062a\u0627\u062c \u0628\u0648\u062f\u0643\u0627\u0633\u062a \u0623\u0648 \u0645\u062c\u0644\u0629 \u0623\u0648 \u0641\u064a\u0644\u0645 \u0648\u062b\u0627\u0626\u0642\u064a \u0623\u0648 \u0645\u062d\u062a\u0648\u0649 \u0625\u0639\u0644\u0627\u0645\u064a \u0645\u0628\u062a\u0643\u0631"
  },
  {
    "questionNumber": 65,
    "optionKey": "D",
    "languageCode": "ml",
    "optionText": "\u0d38\u0d2e\u0d42\u0d39\u0d02, \u0d28\u0d2f\u0d02 \u0d05\u0d32\u0d4d\u0d32\u0d46\u0d19\u0d4d\u0d15\u0d3f\u0d7d \u0d06\u0d17\u0d4b\u0d33 \u0d2a\u0d4d\u0d30\u0d36\u0d4d\u0d28\u0d19\u0d4d\u0d19\u0d7e \u0d0e\u0d28\u0d4d\u0d28\u0d3f\u0d35\u0d2f\u0d46\u0d15\u0d4d\u0d15\u0d41\u0d31\u0d3f\u0d1a\u0d4d\u0d1a\u0d41\u0d33\u0d4d\u0d33 \u0d17\u0d35\u0d47\u0d37\u0d23 \u0d2a\u0d4d\u0d30\u0d4b\u0d1c\u0d15\u0d4d\u0d31\u0d4d\u0d31\u0d4d"
  },
  {
    "questionNumber": 65,
    "optionKey": "D",
    "languageCode": "hi",
    "optionText": "\u0938\u092e\u093e\u091c, \u0928\u0940\u0924\u093f \u092f\u093e \u0935\u0948\u0936\u094d\u0935\u093f\u0915 \u092e\u0941\u0926\u094d\u0926\u094b\u0902 \u092a\u0930 \u090f\u0915 \u0936\u094b\u0927 \u092a\u0930\u093f\u092f\u094b\u091c\u0928\u093e"
  },
  {
    "questionNumber": 65,
    "optionKey": "D",
    "languageCode": "ta",
    "optionText": "\u0b9a\u0bae\u0bc2\u0b95\u0bae\u0bcd, \u0b95\u0bca\u0bb3\u0bcd\u0b95\u0bc8 \u0b85\u0bb2\u0bcd\u0bb2\u0ba4\u0bc1 \u0b89\u0bb2\u0b95\u0bb3\u0bbe\u0bb5\u0bbf\u0baf \u0baa\u0bbf\u0bb0\u0b9a\u0bcd\u0b9a\u0bbf\u0ba9\u0bc8\u0b95\u0bb3\u0bcd \u0baa\u0bb1\u0bcd\u0bb1\u0bbf\u0baf \u0b86\u0bb0\u0bbe\u0baf\u0bcd\u0b9a\u0bcd\u0b9a\u0bbf\u0ba4\u0bcd \u0ba4\u0bbf\u0b9f\u0bcd\u0b9f\u0bae\u0bcd"
  },
  {
    "questionNumber": 65,
    "optionKey": "D",
    "languageCode": "kn",
    "optionText": "\u0cb8\u0cae\u0cbe\u0c9c, \u0ca8\u0cc0\u0ca4\u0cbf \u0c85\u0ca5\u0cb5\u0cbe \u0c9c\u0cbe\u0c97\u0ca4\u0cbf\u0c95 \u0cb5\u0cbf\u0cb7\u0caf\u0c97\u0cb3 \u0cac\u0c97\u0cc6\u0c97\u0cbf\u0ca8 \u0cb8\u0c82\u0cb6\u0ccb\u0ca7\u0ca8\u0cbe \u0caf\u0ccb\u0c9c\u0ca8\u0cc6"
  },
  {
    "questionNumber": 65,
    "optionKey": "D",
    "languageCode": "ar",
    "optionText": "\u0645\u0634\u0631\u0648\u0639 \u0628\u062d\u062b\u064a \u0623\u0643\u0627\u062f\u064a\u0645\u064a \u062d\u0648\u0644 \u0627\u0644\u0633\u064a\u0627\u0633\u0627\u062a \u0627\u0644\u0627\u062c\u062a\u0645\u0627\u0639\u064a\u0629 \u0623\u0648 \u0627\u0644\u0642\u0636\u0627\u064a\u0627 \u0627\u0644\u0639\u0627\u0644\u0645\u064a\u0629"
  },
  {
    "questionNumber": 66,
    "optionKey": "A",
    "languageCode": "hi",
    "optionText": "Understanding people and supporting their development"
  },
  {
    "questionNumber": 66,
    "optionKey": "A",
    "languageCode": "ml",
    "optionText": "Understanding people and supporting their development"
  },
  {
    "questionNumber": 66,
    "optionKey": "A",
    "languageCode": "ta",
    "optionText": "Understanding people and supporting their development"
  },
  {
    "questionNumber": 66,
    "optionKey": "A",
    "languageCode": "kn",
    "optionText": "Understanding people and supporting their development"
  },
  {
    "questionNumber": 66,
    "optionKey": "A",
    "languageCode": "ar",
    "optionText": "Understanding people and supporting their development"
  },
  {
    "questionNumber": 66,
    "optionKey": "B",
    "languageCode": "hi",
    "optionText": "Reasoning about fairness, rules and evidence"
  },
  {
    "questionNumber": 66,
    "optionKey": "B",
    "languageCode": "ml",
    "optionText": "Reasoning about fairness, rules and evidence"
  },
  {
    "questionNumber": 66,
    "optionKey": "B",
    "languageCode": "ta",
    "optionText": "Reasoning about fairness, rules and evidence"
  },
  {
    "questionNumber": 66,
    "optionKey": "B",
    "languageCode": "kn",
    "optionText": "Reasoning about fairness, rules and evidence"
  },
  {
    "questionNumber": 66,
    "optionKey": "B",
    "languageCode": "ar",
    "optionText": "Reasoning about fairness, rules and evidence"
  },
  {
    "questionNumber": 66,
    "optionKey": "C",
    "languageCode": "hi",
    "optionText": "Storytelling and communicating ideas to different audiences"
  },
  {
    "questionNumber": 66,
    "optionKey": "C",
    "languageCode": "ml",
    "optionText": "Storytelling and communicating ideas to different audiences"
  },
  {
    "questionNumber": 66,
    "optionKey": "C",
    "languageCode": "ta",
    "optionText": "Storytelling and communicating ideas to different audiences"
  },
  {
    "questionNumber": 66,
    "optionKey": "C",
    "languageCode": "kn",
    "optionText": "Storytelling and communicating ideas to different audiences"
  },
  {
    "questionNumber": 66,
    "optionKey": "C",
    "languageCode": "ar",
    "optionText": "Storytelling and communicating ideas to different audiences"
  },
  {
    "questionNumber": 66,
    "optionKey": "D",
    "languageCode": "hi",
    "optionText": "Researching complex issues and drawing evidence-based conclusions"
  },
  {
    "questionNumber": 66,
    "optionKey": "D",
    "languageCode": "ml",
    "optionText": "Researching complex issues and drawing evidence-based conclusions"
  },
  {
    "questionNumber": 66,
    "optionKey": "D",
    "languageCode": "ta",
    "optionText": "Researching complex issues and drawing evidence-based conclusions"
  },
  {
    "questionNumber": 66,
    "optionKey": "D",
    "languageCode": "kn",
    "optionText": "Researching complex issues and drawing evidence-based conclusions"
  },
  {
    "questionNumber": 66,
    "optionKey": "D",
    "languageCode": "ar",
    "optionText": "Researching complex issues and drawing evidence-based conclusions"
  },
  {
    "questionNumber": 67,
    "optionKey": "A",
    "languageCode": "hi",
    "optionText": "Interviews or observations about people's experiences"
  },
  {
    "questionNumber": 67,
    "optionKey": "A",
    "languageCode": "ml",
    "optionText": "Interviews or observations about people's experiences"
  },
  {
    "questionNumber": 67,
    "optionKey": "A",
    "languageCode": "ta",
    "optionText": "Interviews or observations about people's experiences"
  },
  {
    "questionNumber": 67,
    "optionKey": "A",
    "languageCode": "kn",
    "optionText": "Interviews or observations about people's experiences"
  },
  {
    "questionNumber": 67,
    "optionKey": "A",
    "languageCode": "ar",
    "optionText": "Interviews or observations about people's experiences"
  },
  {
    "questionNumber": 67,
    "optionKey": "B",
    "languageCode": "hi",
    "optionText": "A case involving conflicting rights or responsibilities"
  },
  {
    "questionNumber": 67,
    "optionKey": "B",
    "languageCode": "ml",
    "optionText": "A case involving conflicting rights or responsibilities"
  },
  {
    "questionNumber": 67,
    "optionKey": "B",
    "languageCode": "ta",
    "optionText": "A case involving conflicting rights or responsibilities"
  },
  {
    "questionNumber": 67,
    "optionKey": "B",
    "languageCode": "kn",
    "optionText": "A case involving conflicting rights or responsibilities"
  },
  {
    "questionNumber": 67,
    "optionKey": "B",
    "languageCode": "ar",
    "optionText": "A case involving conflicting rights or responsibilities"
  },
  {
    "questionNumber": 67,
    "optionKey": "C",
    "languageCode": "hi",
    "optionText": "A film, article, advertisement or social-media campaign"
  },
  {
    "questionNumber": 67,
    "optionKey": "C",
    "languageCode": "ml",
    "optionText": "A film, article, advertisement or social-media campaign"
  },
  {
    "questionNumber": 67,
    "optionKey": "C",
    "languageCode": "ta",
    "optionText": "A film, article, advertisement or social-media campaign"
  },
  {
    "questionNumber": 67,
    "optionKey": "C",
    "languageCode": "kn",
    "optionText": "A film, article, advertisement or social-media campaign"
  },
  {
    "questionNumber": 67,
    "optionKey": "C",
    "languageCode": "ar",
    "optionText": "A film, article, advertisement or social-media campaign"
  },
  {
    "questionNumber": 67,
    "optionKey": "D",
    "languageCode": "hi",
    "optionText": "Reports, datasets or multiple sources about a social issue"
  },
  {
    "questionNumber": 67,
    "optionKey": "D",
    "languageCode": "ml",
    "optionText": "Reports, datasets or multiple sources about a social issue"
  },
  {
    "questionNumber": 67,
    "optionKey": "D",
    "languageCode": "ta",
    "optionText": "Reports, datasets or multiple sources about a social issue"
  },
  {
    "questionNumber": 67,
    "optionKey": "D",
    "languageCode": "kn",
    "optionText": "Reports, datasets or multiple sources about a social issue"
  },
  {
    "questionNumber": 67,
    "optionKey": "D",
    "languageCode": "ar",
    "optionText": "Reports, datasets or multiple sources about a social issue"
  },
  {
    "questionNumber": 68,
    "optionKey": "A",
    "languageCode": "hi",
    "optionText": "Helping someone understand a difficult personal situation"
  },
  {
    "questionNumber": 68,
    "optionKey": "A",
    "languageCode": "ml",
    "optionText": "Helping someone understand a difficult personal situation"
  },
  {
    "questionNumber": 68,
    "optionKey": "A",
    "languageCode": "ta",
    "optionText": "Helping someone understand a difficult personal situation"
  },
  {
    "questionNumber": 68,
    "optionKey": "A",
    "languageCode": "kn",
    "optionText": "Helping someone understand a difficult personal situation"
  },
  {
    "questionNumber": 68,
    "optionKey": "A",
    "languageCode": "ar",
    "optionText": "Helping someone understand a difficult personal situation"
  },
  {
    "questionNumber": 68,
    "optionKey": "B",
    "languageCode": "hi",
    "optionText": "Working through competing arguments about a community decision"
  },
  {
    "questionNumber": 68,
    "optionKey": "B",
    "languageCode": "ml",
    "optionText": "Working through competing arguments about a community decision"
  },
  {
    "questionNumber": 68,
    "optionKey": "B",
    "languageCode": "ta",
    "optionText": "Working through competing arguments about a community decision"
  },
  {
    "questionNumber": 68,
    "optionKey": "B",
    "languageCode": "kn",
    "optionText": "Working through competing arguments about a community decision"
  },
  {
    "questionNumber": 68,
    "optionKey": "B",
    "languageCode": "ar",
    "optionText": "Working through competing arguments about a community decision"
  },
  {
    "questionNumber": 68,
    "optionKey": "C",
    "languageCode": "hi",
    "optionText": "Turning a complicated idea into an engaging public message"
  },
  {
    "questionNumber": 68,
    "optionKey": "C",
    "languageCode": "ml",
    "optionText": "Turning a complicated idea into an engaging public message"
  },
  {
    "questionNumber": 68,
    "optionKey": "C",
    "languageCode": "ta",
    "optionText": "Turning a complicated idea into an engaging public message"
  },
  {
    "questionNumber": 68,
    "optionKey": "C",
    "languageCode": "kn",
    "optionText": "Turning a complicated idea into an engaging public message"
  },
  {
    "questionNumber": 68,
    "optionKey": "C",
    "languageCode": "ar",
    "optionText": "Turning a complicated idea into an engaging public message"
  },
  {
    "questionNumber": 68,
    "optionKey": "D",
    "languageCode": "hi",
    "optionText": "Finding out why a social problem is happening"
  },
  {
    "questionNumber": 68,
    "optionKey": "D",
    "languageCode": "ml",
    "optionText": "Finding out why a social problem is happening"
  },
  {
    "questionNumber": 68,
    "optionKey": "D",
    "languageCode": "ta",
    "optionText": "Finding out why a social problem is happening"
  },
  {
    "questionNumber": 68,
    "optionKey": "D",
    "languageCode": "kn",
    "optionText": "Finding out why a social problem is happening"
  },
  {
    "questionNumber": 68,
    "optionKey": "D",
    "languageCode": "ar",
    "optionText": "Finding out why a social problem is happening"
  },
  {
    "questionNumber": 69,
    "optionKey": "A",
    "languageCode": "hi",
    "optionText": "Helping someone make positive progress"
  },
  {
    "questionNumber": 69,
    "optionKey": "A",
    "languageCode": "ml",
    "optionText": "Helping someone make positive progress"
  },
  {
    "questionNumber": 69,
    "optionKey": "A",
    "languageCode": "ta",
    "optionText": "Helping someone make positive progress"
  },
  {
    "questionNumber": 69,
    "optionKey": "A",
    "languageCode": "kn",
    "optionText": "Helping someone make positive progress"
  },
  {
    "questionNumber": 69,
    "optionKey": "A",
    "languageCode": "ar",
    "optionText": "Helping someone make positive progress"
  },
  {
    "questionNumber": 69,
    "optionKey": "B",
    "languageCode": "hi",
    "optionText": "Contributing to a fairer decision or system"
  },
  {
    "questionNumber": 69,
    "optionKey": "B",
    "languageCode": "ml",
    "optionText": "Contributing to a fairer decision or system"
  },
  {
    "questionNumber": 69,
    "optionKey": "B",
    "languageCode": "ta",
    "optionText": "Contributing to a fairer decision or system"
  },
  {
    "questionNumber": 69,
    "optionKey": "B",
    "languageCode": "kn",
    "optionText": "Contributing to a fairer decision or system"
  },
  {
    "questionNumber": 69,
    "optionKey": "B",
    "languageCode": "ar",
    "optionText": "Contributing to a fairer decision or system"
  },
  {
    "questionNumber": 69,
    "optionKey": "C",
    "languageCode": "hi",
    "optionText": "Creating something that reaches and influences people"
  },
  {
    "questionNumber": 69,
    "optionKey": "C",
    "languageCode": "ml",
    "optionText": "Creating something that reaches and influences people"
  },
  {
    "questionNumber": 69,
    "optionKey": "C",
    "languageCode": "ta",
    "optionText": "Creating something that reaches and influences people"
  },
  {
    "questionNumber": 69,
    "optionKey": "C",
    "languageCode": "kn",
    "optionText": "Creating something that reaches and influences people"
  },
  {
    "questionNumber": 69,
    "optionKey": "C",
    "languageCode": "ar",
    "optionText": "Creating something that reaches and influences people"
  },
  {
    "questionNumber": 69,
    "optionKey": "D",
    "languageCode": "hi",
    "optionText": "Producing research that helps others understand an important issue"
  },
  {
    "questionNumber": 69,
    "optionKey": "D",
    "languageCode": "ml",
    "optionText": "Producing research that helps others understand an important issue"
  },
  {
    "questionNumber": 69,
    "optionKey": "D",
    "languageCode": "ta",
    "optionText": "Producing research that helps others understand an important issue"
  },
  {
    "questionNumber": 69,
    "optionKey": "D",
    "languageCode": "kn",
    "optionText": "Producing research that helps others understand an important issue"
  },
  {
    "questionNumber": 69,
    "optionKey": "D",
    "languageCode": "ar",
    "optionText": "Producing research that helps others understand an important issue"
  },
  {
    "questionNumber": 70,
    "optionKey": "A",
    "languageCode": "hi",
    "optionText": "Why people think, feel and behave differently"
  },
  {
    "questionNumber": 70,
    "optionKey": "A",
    "languageCode": "ml",
    "optionText": "Why people think, feel and behave differently"
  },
  {
    "questionNumber": 70,
    "optionKey": "A",
    "languageCode": "ta",
    "optionText": "Why people think, feel and behave differently"
  },
  {
    "questionNumber": 70,
    "optionKey": "A",
    "languageCode": "kn",
    "optionText": "Why people think, feel and behave differently"
  },
  {
    "questionNumber": 70,
    "optionKey": "A",
    "languageCode": "ar",
    "optionText": "Why people think, feel and behave differently"
  },
  {
    "questionNumber": 70,
    "optionKey": "B",
    "languageCode": "hi",
    "optionText": "How laws and public institutions should respond to a problem"
  },
  {
    "questionNumber": 70,
    "optionKey": "B",
    "languageCode": "ml",
    "optionText": "How laws and public institutions should respond to a problem"
  },
  {
    "questionNumber": 70,
    "optionKey": "B",
    "languageCode": "ta",
    "optionText": "How laws and public institutions should respond to a problem"
  },
  {
    "questionNumber": 70,
    "optionKey": "B",
    "languageCode": "kn",
    "optionText": "How laws and public institutions should respond to a problem"
  },
  {
    "questionNumber": 70,
    "optionKey": "B",
    "languageCode": "ar",
    "optionText": "How laws and public institutions should respond to a problem"
  },
  {
    "questionNumber": 70,
    "optionKey": "C",
    "languageCode": "hi",
    "optionText": "Why certain stories and messages influence audiences"
  },
  {
    "questionNumber": 70,
    "optionKey": "C",
    "languageCode": "ml",
    "optionText": "Why certain stories and messages influence audiences"
  },
  {
    "questionNumber": 70,
    "optionKey": "C",
    "languageCode": "ta",
    "optionText": "Why certain stories and messages influence audiences"
  },
  {
    "questionNumber": 70,
    "optionKey": "C",
    "languageCode": "kn",
    "optionText": "Why certain stories and messages influence audiences"
  },
  {
    "questionNumber": 70,
    "optionKey": "C",
    "languageCode": "ar",
    "optionText": "Why certain stories and messages influence audiences"
  },
  {
    "questionNumber": 70,
    "optionKey": "D",
    "languageCode": "hi",
    "optionText": "How evidence can explain a complex social problem"
  },
  {
    "questionNumber": 70,
    "optionKey": "D",
    "languageCode": "ml",
    "optionText": "How evidence can explain a complex social problem"
  },
  {
    "questionNumber": 70,
    "optionKey": "D",
    "languageCode": "ta",
    "optionText": "How evidence can explain a complex social problem"
  },
  {
    "questionNumber": 70,
    "optionKey": "D",
    "languageCode": "kn",
    "optionText": "How evidence can explain a complex social problem"
  },
  {
    "questionNumber": 70,
    "optionKey": "D",
    "languageCode": "ar",
    "optionText": "How evidence can explain a complex social problem"
  },
  {
    "questionNumber": 71,
    "optionKey": "A",
    "languageCode": "hi",
    "optionText": "Interviewing people and understanding their experiences"
  },
  {
    "questionNumber": 71,
    "optionKey": "A",
    "languageCode": "ml",
    "optionText": "Interviewing people and understanding their experiences"
  },
  {
    "questionNumber": 71,
    "optionKey": "A",
    "languageCode": "ta",
    "optionText": "Interviewing people and understanding their experiences"
  },
  {
    "questionNumber": 71,
    "optionKey": "A",
    "languageCode": "kn",
    "optionText": "Interviewing people and understanding their experiences"
  },
  {
    "questionNumber": 71,
    "optionKey": "A",
    "languageCode": "ar",
    "optionText": "Interviewing people and understanding their experiences"
  },
  {
    "questionNumber": 71,
    "optionKey": "B",
    "languageCode": "hi",
    "optionText": "Checking the fairness of the rules and arguments"
  },
  {
    "questionNumber": 71,
    "optionKey": "B",
    "languageCode": "ml",
    "optionText": "Checking the fairness of the rules and arguments"
  },
  {
    "questionNumber": 71,
    "optionKey": "B",
    "languageCode": "ta",
    "optionText": "Checking the fairness of the rules and arguments"
  },
  {
    "questionNumber": 71,
    "optionKey": "B",
    "languageCode": "kn",
    "optionText": "Checking the fairness of the rules and arguments"
  },
  {
    "questionNumber": 71,
    "optionKey": "B",
    "languageCode": "ar",
    "optionText": "Checking the fairness of the rules and arguments"
  },
  {
    "questionNumber": 71,
    "optionKey": "C",
    "languageCode": "hi",
    "optionText": "Planning the story, presentation or media output"
  },
  {
    "questionNumber": 71,
    "optionKey": "C",
    "languageCode": "ml",
    "optionText": "Planning the story, presentation or media output"
  },
  {
    "questionNumber": 71,
    "optionKey": "C",
    "languageCode": "ta",
    "optionText": "Planning the story, presentation or media output"
  },
  {
    "questionNumber": 71,
    "optionKey": "C",
    "languageCode": "kn",
    "optionText": "Planning the story, presentation or media output"
  },
  {
    "questionNumber": 71,
    "optionKey": "C",
    "languageCode": "ar",
    "optionText": "Planning the story, presentation or media output"
  },
  {
    "questionNumber": 71,
    "optionKey": "D",
    "languageCode": "hi",
    "optionText": "Finding evidence and organising the research"
  },
  {
    "questionNumber": 71,
    "optionKey": "D",
    "languageCode": "ml",
    "optionText": "Finding evidence and organising the research"
  },
  {
    "questionNumber": 71,
    "optionKey": "D",
    "languageCode": "ta",
    "optionText": "Finding evidence and organising the research"
  },
  {
    "questionNumber": 71,
    "optionKey": "D",
    "languageCode": "kn",
    "optionText": "Finding evidence and organising the research"
  },
  {
    "questionNumber": 71,
    "optionKey": "D",
    "languageCode": "ar",
    "optionText": "Finding evidence and organising the research"
  },
  {
    "questionNumber": 72,
    "optionKey": "A",
    "languageCode": "hi",
    "optionText": "Listen to the people affected and understand their experiences"
  },
  {
    "questionNumber": 72,
    "optionKey": "A",
    "languageCode": "ml",
    "optionText": "Listen to the people affected and understand their experiences"
  },
  {
    "questionNumber": 72,
    "optionKey": "A",
    "languageCode": "ta",
    "optionText": "Listen to the people affected and understand their experiences"
  },
  {
    "questionNumber": 72,
    "optionKey": "A",
    "languageCode": "kn",
    "optionText": "Listen to the people affected and understand their experiences"
  },
  {
    "questionNumber": 72,
    "optionKey": "A",
    "languageCode": "ar",
    "optionText": "Listen to the people affected and understand their experiences"
  },
  {
    "questionNumber": 72,
    "optionKey": "B",
    "languageCode": "hi",
    "optionText": "Identify the rights, responsibilities and rules involved"
  },
  {
    "questionNumber": 72,
    "optionKey": "B",
    "languageCode": "ml",
    "optionText": "Identify the rights, responsibilities and rules involved"
  },
  {
    "questionNumber": 72,
    "optionKey": "B",
    "languageCode": "ta",
    "optionText": "Identify the rights, responsibilities and rules involved"
  },
  {
    "questionNumber": 72,
    "optionKey": "B",
    "languageCode": "kn",
    "optionText": "Identify the rights, responsibilities and rules involved"
  },
  {
    "questionNumber": 72,
    "optionKey": "B",
    "languageCode": "ar",
    "optionText": "Identify the rights, responsibilities and rules involved"
  },
  {
    "questionNumber": 72,
    "optionKey": "C",
    "languageCode": "hi",
    "optionText": "Create a clear message that helps people understand the issue"
  },
  {
    "questionNumber": 72,
    "optionKey": "C",
    "languageCode": "ml",
    "optionText": "Create a clear message that helps people understand the issue"
  },
  {
    "questionNumber": 72,
    "optionKey": "C",
    "languageCode": "ta",
    "optionText": "Create a clear message that helps people understand the issue"
  },
  {
    "questionNumber": 72,
    "optionKey": "C",
    "languageCode": "kn",
    "optionText": "Create a clear message that helps people understand the issue"
  },
  {
    "questionNumber": 72,
    "optionKey": "C",
    "languageCode": "ar",
    "optionText": "Create a clear message that helps people understand the issue"
  },
  {
    "questionNumber": 72,
    "optionKey": "D",
    "languageCode": "hi",
    "optionText": "Gather evidence and investigate possible causes"
  },
  {
    "questionNumber": 72,
    "optionKey": "D",
    "languageCode": "ml",
    "optionText": "Gather evidence and investigate possible causes"
  },
  {
    "questionNumber": 72,
    "optionKey": "D",
    "languageCode": "ta",
    "optionText": "Gather evidence and investigate possible causes"
  },
  {
    "questionNumber": 72,
    "optionKey": "D",
    "languageCode": "kn",
    "optionText": "Gather evidence and investigate possible causes"
  },
  {
    "questionNumber": 72,
    "optionKey": "D",
    "languageCode": "ar",
    "optionText": "Gather evidence and investigate possible causes"
  },
  {
    "questionNumber": 73,
    "optionKey": "A",
    "languageCode": "hi",
    "optionText": "A people-support or wellbeing organisation"
  },
  {
    "questionNumber": 73,
    "optionKey": "A",
    "languageCode": "ml",
    "optionText": "A people-support or wellbeing organisation"
  },
  {
    "questionNumber": 73,
    "optionKey": "A",
    "languageCode": "ta",
    "optionText": "A people-support or wellbeing organisation"
  },
  {
    "questionNumber": 73,
    "optionKey": "A",
    "languageCode": "kn",
    "optionText": "A people-support or wellbeing organisation"
  },
  {
    "questionNumber": 73,
    "optionKey": "A",
    "languageCode": "ar",
    "optionText": "A people-support or wellbeing organisation"
  },
  {
    "questionNumber": 73,
    "optionKey": "B",
    "languageCode": "hi",
    "optionText": "A legal, civic or public-service organisation"
  },
  {
    "questionNumber": 73,
    "optionKey": "B",
    "languageCode": "ml",
    "optionText": "A legal, civic or public-service organisation"
  },
  {
    "questionNumber": 73,
    "optionKey": "B",
    "languageCode": "ta",
    "optionText": "A legal, civic or public-service organisation"
  },
  {
    "questionNumber": 73,
    "optionKey": "B",
    "languageCode": "kn",
    "optionText": "A legal, civic or public-service organisation"
  },
  {
    "questionNumber": 73,
    "optionKey": "B",
    "languageCode": "ar",
    "optionText": "A legal, civic or public-service organisation"
  },
  {
    "questionNumber": 73,
    "optionKey": "C",
    "languageCode": "hi",
    "optionText": "A media, communication or creative organisation"
  },
  {
    "questionNumber": 73,
    "optionKey": "C",
    "languageCode": "ml",
    "optionText": "A media, communication or creative organisation"
  },
  {
    "questionNumber": 73,
    "optionKey": "C",
    "languageCode": "ta",
    "optionText": "A media, communication or creative organisation"
  },
  {
    "questionNumber": 73,
    "optionKey": "C",
    "languageCode": "kn",
    "optionText": "A media, communication or creative organisation"
  },
  {
    "questionNumber": 73,
    "optionKey": "C",
    "languageCode": "ar",
    "optionText": "A media, communication or creative organisation"
  },
  {
    "questionNumber": 73,
    "optionKey": "D",
    "languageCode": "hi",
    "optionText": "A research, policy or social-development organisation"
  },
  {
    "questionNumber": 73,
    "optionKey": "D",
    "languageCode": "ml",
    "optionText": "A research, policy or social-development organisation"
  },
  {
    "questionNumber": 73,
    "optionKey": "D",
    "languageCode": "ta",
    "optionText": "A research, policy or social-development organisation"
  },
  {
    "questionNumber": 73,
    "optionKey": "D",
    "languageCode": "kn",
    "optionText": "A research, policy or social-development organisation"
  },
  {
    "questionNumber": 73,
    "optionKey": "D",
    "languageCode": "ar",
    "optionText": "A research, policy or social-development organisation"
  },
  {
    "questionNumber": 74,
    "optionKey": "A",
    "languageCode": "hi",
    "optionText": "Try to understand the experiences and concerns behind each side"
  },
  {
    "questionNumber": 74,
    "optionKey": "A",
    "languageCode": "ml",
    "optionText": "Try to understand the experiences and concerns behind each side"
  },
  {
    "questionNumber": 74,
    "optionKey": "A",
    "languageCode": "ta",
    "optionText": "Try to understand the experiences and concerns behind each side"
  },
  {
    "questionNumber": 74,
    "optionKey": "A",
    "languageCode": "kn",
    "optionText": "Try to understand the experiences and concerns behind each side"
  },
  {
    "questionNumber": 74,
    "optionKey": "A",
    "languageCode": "ar",
    "optionText": "Try to understand the experiences and concerns behind each side"
  },
  {
    "questionNumber": 74,
    "optionKey": "B",
    "languageCode": "hi",
    "optionText": "Compare the arguments with the relevant rules and rights"
  },
  {
    "questionNumber": 74,
    "optionKey": "B",
    "languageCode": "ml",
    "optionText": "Compare the arguments with the relevant rules and rights"
  },
  {
    "questionNumber": 74,
    "optionKey": "B",
    "languageCode": "ta",
    "optionText": "Compare the arguments with the relevant rules and rights"
  },
  {
    "questionNumber": 74,
    "optionKey": "B",
    "languageCode": "kn",
    "optionText": "Compare the arguments with the relevant rules and rights"
  },
  {
    "questionNumber": 74,
    "optionKey": "B",
    "languageCode": "ar",
    "optionText": "Compare the arguments with the relevant rules and rights"
  },
  {
    "questionNumber": 74,
    "optionKey": "C",
    "languageCode": "hi",
    "optionText": "Find a way to communicate the issue so both sides can understand it"
  },
  {
    "questionNumber": 74,
    "optionKey": "C",
    "languageCode": "ml",
    "optionText": "Find a way to communicate the issue so both sides can understand it"
  },
  {
    "questionNumber": 74,
    "optionKey": "C",
    "languageCode": "ta",
    "optionText": "Find a way to communicate the issue so both sides can understand it"
  },
  {
    "questionNumber": 74,
    "optionKey": "C",
    "languageCode": "kn",
    "optionText": "Find a way to communicate the issue so both sides can understand it"
  },
  {
    "questionNumber": 74,
    "optionKey": "C",
    "languageCode": "ar",
    "optionText": "Find a way to communicate the issue so both sides can understand it"
  },
  {
    "questionNumber": 74,
    "optionKey": "D",
    "languageCode": "hi",
    "optionText": "Look for evidence that explains why the disagreement developed"
  },
  {
    "questionNumber": 74,
    "optionKey": "D",
    "languageCode": "ml",
    "optionText": "Look for evidence that explains why the disagreement developed"
  },
  {
    "questionNumber": 74,
    "optionKey": "D",
    "languageCode": "ta",
    "optionText": "Look for evidence that explains why the disagreement developed"
  },
  {
    "questionNumber": 74,
    "optionKey": "D",
    "languageCode": "kn",
    "optionText": "Look for evidence that explains why the disagreement developed"
  },
  {
    "questionNumber": 74,
    "optionKey": "D",
    "languageCode": "ar",
    "optionText": "Look for evidence that explains why the disagreement developed"
  },
  {
    "questionNumber": 75,
    "optionKey": "A",
    "languageCode": "hi",
    "optionText": "How people develop, cope and form relationships"
  },
  {
    "questionNumber": 75,
    "optionKey": "A",
    "languageCode": "ml",
    "optionText": "How people develop, cope and form relationships"
  },
  {
    "questionNumber": 75,
    "optionKey": "A",
    "languageCode": "ta",
    "optionText": "How people develop, cope and form relationships"
  },
  {
    "questionNumber": 75,
    "optionKey": "A",
    "languageCode": "kn",
    "optionText": "How people develop, cope and form relationships"
  },
  {
    "questionNumber": 75,
    "optionKey": "A",
    "languageCode": "ar",
    "optionText": "How people develop, cope and form relationships"
  },
  {
    "questionNumber": 75,
    "optionKey": "B",
    "languageCode": "hi",
    "optionText": "How courts, governments or public institutions work"
  },
  {
    "questionNumber": 75,
    "optionKey": "B",
    "languageCode": "ml",
    "optionText": "How courts, governments or public institutions work"
  },
  {
    "questionNumber": 75,
    "optionKey": "B",
    "languageCode": "ta",
    "optionText": "How courts, governments or public institutions work"
  },
  {
    "questionNumber": 75,
    "optionKey": "B",
    "languageCode": "kn",
    "optionText": "How courts, governments or public institutions work"
  },
  {
    "questionNumber": 75,
    "optionKey": "B",
    "languageCode": "ar",
    "optionText": "How courts, governments or public institutions work"
  },
  {
    "questionNumber": 75,
    "optionKey": "C",
    "languageCode": "hi",
    "optionText": "How media and storytelling shape culture"
  },
  {
    "questionNumber": 75,
    "optionKey": "C",
    "languageCode": "ml",
    "optionText": "How media and storytelling shape culture"
  },
  {
    "questionNumber": 75,
    "optionKey": "C",
    "languageCode": "ta",
    "optionText": "How media and storytelling shape culture"
  },
  {
    "questionNumber": 75,
    "optionKey": "C",
    "languageCode": "kn",
    "optionText": "How media and storytelling shape culture"
  },
  {
    "questionNumber": 75,
    "optionKey": "C",
    "languageCode": "ar",
    "optionText": "How media and storytelling shape culture"
  },
  {
    "questionNumber": 75,
    "optionKey": "D",
    "languageCode": "hi",
    "optionText": "How societies respond to major global challenges"
  },
  {
    "questionNumber": 75,
    "optionKey": "D",
    "languageCode": "ml",
    "optionText": "How societies respond to major global challenges"
  },
  {
    "questionNumber": 75,
    "optionKey": "D",
    "languageCode": "ta",
    "optionText": "How societies respond to major global challenges"
  },
  {
    "questionNumber": 75,
    "optionKey": "D",
    "languageCode": "kn",
    "optionText": "How societies respond to major global challenges"
  },
  {
    "questionNumber": 75,
    "optionKey": "D",
    "languageCode": "ar",
    "optionText": "How societies respond to major global challenges"
  },
  {
    "questionNumber": 76,
    "optionKey": "A",
    "languageCode": "hi",
    "optionText": "Interview people and explore their lived experiences"
  },
  {
    "questionNumber": 76,
    "optionKey": "A",
    "languageCode": "ml",
    "optionText": "Interview people and explore their lived experiences"
  },
  {
    "questionNumber": 76,
    "optionKey": "A",
    "languageCode": "ta",
    "optionText": "Interview people and explore their lived experiences"
  },
  {
    "questionNumber": 76,
    "optionKey": "A",
    "languageCode": "kn",
    "optionText": "Interview people and explore their lived experiences"
  },
  {
    "questionNumber": 76,
    "optionKey": "A",
    "languageCode": "ar",
    "optionText": "Interview people and explore their lived experiences"
  },
  {
    "questionNumber": 76,
    "optionKey": "B",
    "languageCode": "hi",
    "optionText": "Examine the laws, rights and institutions connected to it"
  },
  {
    "questionNumber": 76,
    "optionKey": "B",
    "languageCode": "ml",
    "optionText": "Examine the laws, rights and institutions connected to it"
  },
  {
    "questionNumber": 76,
    "optionKey": "B",
    "languageCode": "ta",
    "optionText": "Examine the laws, rights and institutions connected to it"
  },
  {
    "questionNumber": 76,
    "optionKey": "B",
    "languageCode": "kn",
    "optionText": "Examine the laws, rights and institutions connected to it"
  },
  {
    "questionNumber": 76,
    "optionKey": "B",
    "languageCode": "ar",
    "optionText": "Examine the laws, rights and institutions connected to it"
  },
  {
    "questionNumber": 76,
    "optionKey": "C",
    "languageCode": "hi",
    "optionText": "Create a visual or written story to communicate the issue"
  },
  {
    "questionNumber": 76,
    "optionKey": "C",
    "languageCode": "ml",
    "optionText": "Create a visual or written story to communicate the issue"
  },
  {
    "questionNumber": 76,
    "optionKey": "C",
    "languageCode": "ta",
    "optionText": "Create a visual or written story to communicate the issue"
  },
  {
    "questionNumber": 76,
    "optionKey": "C",
    "languageCode": "kn",
    "optionText": "Create a visual or written story to communicate the issue"
  },
  {
    "questionNumber": 76,
    "optionKey": "C",
    "languageCode": "ar",
    "optionText": "Create a visual or written story to communicate the issue"
  },
  {
    "questionNumber": 76,
    "optionKey": "D",
    "languageCode": "hi",
    "optionText": "Compare research and evidence to identify possible solutions"
  },
  {
    "questionNumber": 76,
    "optionKey": "D",
    "languageCode": "ml",
    "optionText": "Compare research and evidence to identify possible solutions"
  },
  {
    "questionNumber": 76,
    "optionKey": "D",
    "languageCode": "ta",
    "optionText": "Compare research and evidence to identify possible solutions"
  },
  {
    "questionNumber": 76,
    "optionKey": "D",
    "languageCode": "kn",
    "optionText": "Compare research and evidence to identify possible solutions"
  },
  {
    "questionNumber": 76,
    "optionKey": "D",
    "languageCode": "ar",
    "optionText": "Compare research and evidence to identify possible solutions"
  },
  {
    "questionNumber": 77,
    "optionKey": "A",
    "languageCode": "hi",
    "optionText": "A participant says the project helped them feel understood"
  },
  {
    "questionNumber": 77,
    "optionKey": "A",
    "languageCode": "ml",
    "optionText": "A participant says the project helped them feel understood"
  },
  {
    "questionNumber": 77,
    "optionKey": "A",
    "languageCode": "ta",
    "optionText": "A participant says the project helped them feel understood"
  },
  {
    "questionNumber": 77,
    "optionKey": "A",
    "languageCode": "kn",
    "optionText": "A participant says the project helped them feel understood"
  },
  {
    "questionNumber": 77,
    "optionKey": "A",
    "languageCode": "ar",
    "optionText": "A participant says the project helped them feel understood"
  },
  {
    "questionNumber": 77,
    "optionKey": "B",
    "languageCode": "hi",
    "optionText": "The final recommendation is fair and well reasoned"
  },
  {
    "questionNumber": 77,
    "optionKey": "B",
    "languageCode": "ml",
    "optionText": "The final recommendation is fair and well reasoned"
  },
  {
    "questionNumber": 77,
    "optionKey": "B",
    "languageCode": "ta",
    "optionText": "The final recommendation is fair and well reasoned"
  },
  {
    "questionNumber": 77,
    "optionKey": "B",
    "languageCode": "kn",
    "optionText": "The final recommendation is fair and well reasoned"
  },
  {
    "questionNumber": 77,
    "optionKey": "B",
    "languageCode": "ar",
    "optionText": "The final recommendation is fair and well reasoned"
  },
  {
    "questionNumber": 77,
    "optionKey": "C",
    "languageCode": "hi",
    "optionText": "The final product communicates the idea powerfully"
  },
  {
    "questionNumber": 77,
    "optionKey": "C",
    "languageCode": "ml",
    "optionText": "The final product communicates the idea powerfully"
  },
  {
    "questionNumber": 77,
    "optionKey": "C",
    "languageCode": "ta",
    "optionText": "The final product communicates the idea powerfully"
  },
  {
    "questionNumber": 77,
    "optionKey": "C",
    "languageCode": "kn",
    "optionText": "The final product communicates the idea powerfully"
  },
  {
    "questionNumber": 77,
    "optionKey": "C",
    "languageCode": "ar",
    "optionText": "The final product communicates the idea powerfully"
  },
  {
    "questionNumber": 77,
    "optionKey": "D",
    "languageCode": "hi",
    "optionText": "The project produces a clear evidence-based explanation"
  },
  {
    "questionNumber": 77,
    "optionKey": "D",
    "languageCode": "ml",
    "optionText": "The project produces a clear evidence-based explanation"
  },
  {
    "questionNumber": 77,
    "optionKey": "D",
    "languageCode": "ta",
    "optionText": "The project produces a clear evidence-based explanation"
  },
  {
    "questionNumber": 77,
    "optionKey": "D",
    "languageCode": "kn",
    "optionText": "The project produces a clear evidence-based explanation"
  },
  {
    "questionNumber": 77,
    "optionKey": "D",
    "languageCode": "ar",
    "optionText": "The project produces a clear evidence-based explanation"
  },
  {
    "questionNumber": 78,
    "optionKey": "A",
    "languageCode": "hi",
    "optionText": "A counselling, youth or wellbeing setting"
  },
  {
    "questionNumber": 78,
    "optionKey": "A",
    "languageCode": "ml",
    "optionText": "A counselling, youth or wellbeing setting"
  },
  {
    "questionNumber": 78,
    "optionKey": "A",
    "languageCode": "ta",
    "optionText": "A counselling, youth or wellbeing setting"
  },
  {
    "questionNumber": 78,
    "optionKey": "A",
    "languageCode": "kn",
    "optionText": "A counselling, youth or wellbeing setting"
  },
  {
    "questionNumber": 78,
    "optionKey": "A",
    "languageCode": "ar",
    "optionText": "A counselling, youth or wellbeing setting"
  },
  {
    "questionNumber": 78,
    "optionKey": "B",
    "languageCode": "hi",
    "optionText": "A court, public office or civic institution"
  },
  {
    "questionNumber": 78,
    "optionKey": "B",
    "languageCode": "ml",
    "optionText": "A court, public office or civic institution"
  },
  {
    "questionNumber": 78,
    "optionKey": "B",
    "languageCode": "ta",
    "optionText": "A court, public office or civic institution"
  },
  {
    "questionNumber": 78,
    "optionKey": "B",
    "languageCode": "kn",
    "optionText": "A court, public office or civic institution"
  },
  {
    "questionNumber": 78,
    "optionKey": "B",
    "languageCode": "ar",
    "optionText": "A court, public office or civic institution"
  },
  {
    "questionNumber": 78,
    "optionKey": "C",
    "languageCode": "hi",
    "optionText": "A newsroom, studio, cultural organisation or media team"
  },
  {
    "questionNumber": 78,
    "optionKey": "C",
    "languageCode": "ml",
    "optionText": "A newsroom, studio, cultural organisation or media team"
  },
  {
    "questionNumber": 78,
    "optionKey": "C",
    "languageCode": "ta",
    "optionText": "A newsroom, studio, cultural organisation or media team"
  },
  {
    "questionNumber": 78,
    "optionKey": "C",
    "languageCode": "kn",
    "optionText": "A newsroom, studio, cultural organisation or media team"
  },
  {
    "questionNumber": 78,
    "optionKey": "C",
    "languageCode": "ar",
    "optionText": "A newsroom, studio, cultural organisation or media team"
  },
  {
    "questionNumber": 78,
    "optionKey": "D",
    "languageCode": "hi",
    "optionText": "A research centre, policy group or international organisation"
  },
  {
    "questionNumber": 78,
    "optionKey": "D",
    "languageCode": "ml",
    "optionText": "A research centre, policy group or international organisation"
  },
  {
    "questionNumber": 78,
    "optionKey": "D",
    "languageCode": "ta",
    "optionText": "A research centre, policy group or international organisation"
  },
  {
    "questionNumber": 78,
    "optionKey": "D",
    "languageCode": "kn",
    "optionText": "A research centre, policy group or international organisation"
  },
  {
    "questionNumber": 78,
    "optionKey": "D",
    "languageCode": "ar",
    "optionText": "A research centre, policy group or international organisation"
  },
  {
    "questionNumber": 79,
    "optionKey": "A",
    "languageCode": "hi",
    "optionText": "How it affects people's emotions and behaviour"
  },
  {
    "questionNumber": 79,
    "optionKey": "A",
    "languageCode": "ml",
    "optionText": "How it affects people's emotions and behaviour"
  },
  {
    "questionNumber": 79,
    "optionKey": "A",
    "languageCode": "ta",
    "optionText": "How it affects people's emotions and behaviour"
  },
  {
    "questionNumber": 79,
    "optionKey": "A",
    "languageCode": "kn",
    "optionText": "How it affects people's emotions and behaviour"
  },
  {
    "questionNumber": 79,
    "optionKey": "A",
    "languageCode": "ar",
    "optionText": "How it affects people's emotions and behaviour"
  },
  {
    "questionNumber": 79,
    "optionKey": "B",
    "languageCode": "hi",
    "optionText": "What rules, rights and public responsibilities are involved"
  },
  {
    "questionNumber": 79,
    "optionKey": "B",
    "languageCode": "ml",
    "optionText": "What rules, rights and public responsibilities are involved"
  },
  {
    "questionNumber": 79,
    "optionKey": "B",
    "languageCode": "ta",
    "optionText": "What rules, rights and public responsibilities are involved"
  },
  {
    "questionNumber": 79,
    "optionKey": "B",
    "languageCode": "kn",
    "optionText": "What rules, rights and public responsibilities are involved"
  },
  {
    "questionNumber": 79,
    "optionKey": "B",
    "languageCode": "ar",
    "optionText": "What rules, rights and public responsibilities are involved"
  },
  {
    "questionNumber": 79,
    "optionKey": "C",
    "languageCode": "hi",
    "optionText": "How the issue is being framed and communicated to the public"
  },
  {
    "questionNumber": 79,
    "optionKey": "C",
    "languageCode": "ml",
    "optionText": "How the issue is being framed and communicated to the public"
  },
  {
    "questionNumber": 79,
    "optionKey": "C",
    "languageCode": "ta",
    "optionText": "How the issue is being framed and communicated to the public"
  },
  {
    "questionNumber": 79,
    "optionKey": "C",
    "languageCode": "kn",
    "optionText": "How the issue is being framed and communicated to the public"
  },
  {
    "questionNumber": 79,
    "optionKey": "C",
    "languageCode": "ar",
    "optionText": "How the issue is being framed and communicated to the public"
  },
  {
    "questionNumber": 79,
    "optionKey": "D",
    "languageCode": "hi",
    "optionText": "What evidence explains its causes and possible long-term effects"
  },
  {
    "questionNumber": 79,
    "optionKey": "D",
    "languageCode": "ml",
    "optionText": "What evidence explains its causes and possible long-term effects"
  },
  {
    "questionNumber": 79,
    "optionKey": "D",
    "languageCode": "ta",
    "optionText": "What evidence explains its causes and possible long-term effects"
  },
  {
    "questionNumber": 79,
    "optionKey": "D",
    "languageCode": "kn",
    "optionText": "What evidence explains its causes and possible long-term effects"
  },
  {
    "questionNumber": 79,
    "optionKey": "D",
    "languageCode": "ar",
    "optionText": "What evidence explains its causes and possible long-term effects"
  },
  {
    "questionNumber": 80,
    "optionKey": "A",
    "languageCode": "hi",
    "optionText": "Work centred on people, behaviour and wellbeing"
  },
  {
    "questionNumber": 80,
    "optionKey": "A",
    "languageCode": "ml",
    "optionText": "Work centred on people, behaviour and wellbeing"
  },
  {
    "questionNumber": 80,
    "optionKey": "A",
    "languageCode": "ta",
    "optionText": "Work centred on people, behaviour and wellbeing"
  },
  {
    "questionNumber": 80,
    "optionKey": "A",
    "languageCode": "kn",
    "optionText": "Work centred on people, behaviour and wellbeing"
  },
  {
    "questionNumber": 80,
    "optionKey": "A",
    "languageCode": "ar",
    "optionText": "Work centred on people, behaviour and wellbeing"
  },
  {
    "questionNumber": 80,
    "optionKey": "B",
    "languageCode": "hi",
    "optionText": "Work centred on law, justice and public affairs"
  },
  {
    "questionNumber": 80,
    "optionKey": "B",
    "languageCode": "ml",
    "optionText": "Work centred on law, justice and public affairs"
  },
  {
    "questionNumber": 80,
    "optionKey": "B",
    "languageCode": "ta",
    "optionText": "Work centred on law, justice and public affairs"
  },
  {
    "questionNumber": 80,
    "optionKey": "B",
    "languageCode": "kn",
    "optionText": "Work centred on law, justice and public affairs"
  },
  {
    "questionNumber": 80,
    "optionKey": "B",
    "languageCode": "ar",
    "optionText": "Work centred on law, justice and public affairs"
  },
  {
    "questionNumber": 80,
    "optionKey": "C",
    "languageCode": "hi",
    "optionText": "Work centred on communication, culture and creative expression"
  },
  {
    "questionNumber": 80,
    "optionKey": "C",
    "languageCode": "ml",
    "optionText": "Work centred on communication, culture and creative expression"
  },
  {
    "questionNumber": 80,
    "optionKey": "C",
    "languageCode": "ta",
    "optionText": "Work centred on communication, culture and creative expression"
  },
  {
    "questionNumber": 80,
    "optionKey": "C",
    "languageCode": "kn",
    "optionText": "Work centred on communication, culture and creative expression"
  },
  {
    "questionNumber": 80,
    "optionKey": "C",
    "languageCode": "ar",
    "optionText": "Work centred on communication, culture and creative expression"
  },
  {
    "questionNumber": 80,
    "optionKey": "D",
    "languageCode": "hi",
    "optionText": "Work centred on research, policy and social analysis"
  },
  {
    "questionNumber": 80,
    "optionKey": "D",
    "languageCode": "ml",
    "optionText": "Work centred on research, policy and social analysis"
  },
  {
    "questionNumber": 80,
    "optionKey": "D",
    "languageCode": "ta",
    "optionText": "Work centred on research, policy and social analysis"
  },
  {
    "questionNumber": 80,
    "optionKey": "D",
    "languageCode": "kn",
    "optionText": "Work centred on research, policy and social analysis"
  },
  {
    "questionNumber": 80,
    "optionKey": "D",
    "languageCode": "ar",
    "optionText": "Work centred on research, policy and social analysis"
  }
];

export const HUMANITIES_CAREER_FINDER_QUESTION_TRANSLATIONS: QuestionTranslationSeed[] = [
  {
    "questionNumber": 1,
    "languageCode": "en",
    "questionText": "I am curious about why people behave differently in similar situations."
  },
  {
    "questionNumber": 1,
    "languageCode": "hi",
    "questionText": "\u092e\u0941\u091d\u0947 \u092f\u0939 \u091c\u093e\u0928\u0928\u0947 \u092e\u0947\u0902 \u0909\u0924\u094d\u0938\u0941\u0915\u0924\u093e \u0930\u0939\u0924\u0940 \u0939\u0948 \u0915\u093f \u0938\u092e\u093e\u0928 \u092a\u0930\u093f\u0938\u094d\u0925\u093f\u0924\u093f\u092f\u094b\u0902 \u092e\u0947\u0902 \u0932\u094b\u0917 \u0905\u0932\u0917-\u0905\u0932\u0917 \u0935\u094d\u092f\u0935\u0939\u093e\u0930 \u0915\u094d\u092f\u094b\u0902 \u0915\u0930\u0924\u0947 \u0939\u0948\u0902\u0964"
  },
  {
    "questionNumber": 1,
    "languageCode": "ml",
    "questionText": "\u0d38\u0d2e\u0d3e\u0d28\u0d2e\u0d3e\u0d2f \u0d38\u0d3e\u0d39\u0d1a\u0d30\u0d4d\u0d2f\u0d19\u0d4d\u0d19\u0d33\u0d3f\u0d7d \u0d06\u0d33\u0d41\u0d15\u0d7e \u0d0e\u0d28\u0d4d\u0d24\u0d3f\u0d28\u0d3e\u0d23\u0d4d \u0d35\u0d4d\u0d2f\u0d24\u0d4d\u0d2f\u0d38\u0d4d\u0d24\u0d2e\u0d3e\u0d2f\u0d3f \u0d2a\u0d46\u0d30\u0d41\u0d2e\u0d3e\u0d31\u0d41\u0d28\u0d4d\u0d28\u0d24\u0d4d \u0d0e\u0d28\u0d4d\u0d28\u0d4d \u0d05\u0d31\u0d3f\u0d2f\u0d3e\u0d7b \u0d0e\u0d28\u0d3f\u0d15\u0d4d\u0d15\u0d4d \u0d06\u0d15\u0d3e\u0d02\u0d15\u0d4d\u0d37\u0d2f\u0d41\u0d23\u0d4d\u0d1f\u0d4d."
  },
  {
    "questionNumber": 1,
    "languageCode": "ta",
    "questionText": "I am curious about why people behave differently in similar situations."
  },
  {
    "questionNumber": 1,
    "languageCode": "kn",
    "questionText": "I am curious about why people behave differently in similar situations."
  },
  {
    "questionNumber": 1,
    "languageCode": "ar",
    "questionText": "I am curious about why people behave differently in similar situations."
  },
  {
    "questionNumber": 2,
    "languageCode": "en",
    "questionText": "I like listening carefully when someone explains how they feel or what they are experiencing."
  },
  {
    "questionNumber": 2,
    "languageCode": "hi",
    "questionText": "\u091c\u092c \u0915\u094b\u0908 \u0905\u092a\u0928\u0940 \u092d\u093e\u0935\u0928\u093e\u090f\u0902 \u092f\u093e \u0905\u0928\u0941\u092d\u0935 \u0938\u093e\u091d\u093e \u0915\u0930\u0924\u093e \u0939\u0948, \u0924\u094b \u092e\u0941\u091d\u0947 \u0927\u094d\u092f\u093e\u0928 \u0938\u0947 \u0938\u0941\u0928\u0928\u093e \u0905\u091a\u094d\u091b\u093e \u0932\u0917\u0924\u093e \u0939\u0948\u0964"
  },
  {
    "questionNumber": 2,
    "languageCode": "ml",
    "questionText": "\u0d06\u0d30\u0d46\u0d19\u0d4d\u0d15\u0d3f\u0d32\u0d41\u0d02 \u0d05\u0d35\u0d30\u0d41\u0d1f\u0d46 \u0d35\u0d3f\u0d15\u0d3e\u0d30\u0d19\u0d4d\u0d19\u0d33\u0d4b \u0d05\u0d28\u0d41\u0d2d\u0d35\u0d19\u0d4d\u0d19\u0d33\u0d4b \u0d2a\u0d19\u0d4d\u0d15\u0d41\u0d35\u0d46\u0d15\u0d4d\u0d15\u0d41\u0d2e\u0d4d\u0d2a\u0d4b\u0d7e \u0d05\u0d24\u0d4d \u0d36\u0d4d\u0d30\u0d26\u0d4d\u0d27\u0d2f\u0d4b\u0d1f\u0d46 \u0d15\u0d47\u0d7e\u0d15\u0d4d\u0d15\u0d3e\u0d7b \u0d0e\u0d28\u0d3f\u0d15\u0d4d\u0d15\u0d4d \u0d07\u0d37\u0d4d\u0d1f\u0d2e\u0d3e\u0d23\u0d4d."
  },
  {
    "questionNumber": 2,
    "languageCode": "ta",
    "questionText": "I like listening carefully when someone explains how they feel or what they are experiencing."
  },
  {
    "questionNumber": 2,
    "languageCode": "kn",
    "questionText": "I like listening carefully when someone explains how they feel or what they are experiencing."
  },
  {
    "questionNumber": 2,
    "languageCode": "ar",
    "questionText": "I like listening carefully when someone explains how they feel or what they are experiencing."
  },
  {
    "questionNumber": 3,
    "languageCode": "en",
    "questionText": "I enjoy noticing patterns in people's behaviour and interactions."
  },
  {
    "questionNumber": 3,
    "languageCode": "hi",
    "questionText": "\u092e\u0941\u091d\u0947 \u0932\u094b\u0917\u094b\u0902 \u0915\u0947 \u0935\u094d\u092f\u0935\u0939\u093e\u0930 \u0914\u0930 \u0909\u0928\u0915\u0947 \u0906\u092a\u0938\u0940 \u0938\u0902\u092c\u0902\u0927\u094b\u0902 \u0915\u0947 \u092a\u0948\u091f\u0930\u094d\u0928 \u0915\u094b \u0938\u092e\u091d\u0928\u093e \u092a\u0938\u0902\u0926 \u0939\u0948\u0964"
  },
  {
    "questionNumber": 3,
    "languageCode": "ml",
    "questionText": "\u0d06\u0d33\u0d41\u0d15\u0d33\u0d41\u0d1f\u0d46 \u0d2a\u0d46\u0d30\u0d41\u0d2e\u0d3e\u0d31\u0d4d\u0d31\u0d24\u0d4d\u0d24\u0d3f\u0d32\u0d46\u0d2f\u0d41\u0d02 \u0d07\u0d1f\u0d2a\u0d46\u0d1f\u0d32\u0d41\u0d15\u0d33\u0d3f\u0d32\u0d46\u0d2f\u0d41\u0d02 \u0d2a\u0d3e\u0d31\u0d4d\u0d31\u0d47\u0d23\u0d41\u0d15\u0d7e \u0d36\u0d4d\u0d30\u0d26\u0d4d\u0d27\u0d3f\u0d15\u0d4d\u0d15\u0d41\u0d28\u0d4d\u0d28\u0d24\u0d4d \u0d1e\u0d3e\u0d7b \u0d06\u0d38\u0d4d\u0d35\u0d26\u0d3f\u0d15\u0d4d\u0d15\u0d41\u0d28\u0d4d\u0d28\u0d41."
  },
  {
    "questionNumber": 3,
    "languageCode": "ta",
    "questionText": "I enjoy noticing patterns in people's behaviour and interactions."
  },
  {
    "questionNumber": 3,
    "languageCode": "kn",
    "questionText": "I enjoy noticing patterns in people's behaviour and interactions."
  },
  {
    "questionNumber": 3,
    "languageCode": "ar",
    "questionText": "I enjoy noticing patterns in people's behaviour and interactions."
  },
  {
    "questionNumber": 4,
    "languageCode": "en",
    "questionText": "I am interested in how thoughts, emotions and experiences can influence behaviour."
  },
  {
    "questionNumber": 4,
    "languageCode": "hi",
    "questionText": "\u092e\u0948\u0902 \u0907\u0938 \u092c\u093e\u0924 \u092e\u0947\u0902 \u0930\u0941\u091a\u093f \u0930\u0916\u0924\u093e \u0939\u0942\u0901 \u0915\u093f \u0935\u093f\u091a\u093e\u0930, \u092d\u093e\u0935\u0928\u093e\u090f\u0902 \u0914\u0930 \u0905\u0928\u0941\u092d\u0935 \u0935\u094d\u092f\u0935\u0939\u093e\u0930 \u0915\u094b \u0915\u0948\u0938\u0947 \u092a\u094d\u0930\u092d\u093e\u0935\u093f\u0924 \u0915\u0930\u0924\u0947 \u0939\u0948\u0902\u0964"
  },
  {
    "questionNumber": 4,
    "languageCode": "ml",
    "questionText": "\u0d1a\u0d3f\u0d28\u0d4d\u0d24\u0d15\u0d33\u0d41\u0d02 \u0d35\u0d3f\u0d15\u0d3e\u0d30\u0d19\u0d4d\u0d19\u0d33\u0d41\u0d02 \u0d05\u0d28\u0d41\u0d2d\u0d35\u0d19\u0d4d\u0d19\u0d33\u0d41\u0d02 \u0d12\u0d30\u0d41 \u0d35\u0d4d\u0d2f\u0d15\u0d4d\u0d24\u0d3f\u0d2f\u0d41\u0d1f\u0d46 \u0d2a\u0d46\u0d30\u0d41\u0d2e\u0d3e\u0d31\u0d4d\u0d31\u0d24\u0d4d\u0d24\u0d46 \u0d0e\u0d19\u0d4d\u0d19\u0d28\u0d46 \u0d38\u0d4d\u0d35\u0d3e\u0d27\u0d40\u0d28\u0d3f\u0d15\u0d4d\u0d15\u0d41\u0d28\u0d4d\u0d28\u0d41 \u0d0e\u0d28\u0d4d\u0d28\u0d4d \u0d05\u0d31\u0d3f\u0d2f\u0d3e\u0d7b \u0d0e\u0d28\u0d3f\u0d15\u0d4d\u0d15\u0d4d \u0d24\u0d3e\u0d7d\u0d2a\u0d4d\u0d2a\u0d30\u0d4d\u0d2f\u0d2e\u0d41\u0d23\u0d4d\u0d1f\u0d4d."
  },
  {
    "questionNumber": 4,
    "languageCode": "ta",
    "questionText": "I am interested in how thoughts, emotions and experiences can influence behaviour."
  },
  {
    "questionNumber": 4,
    "languageCode": "kn",
    "questionText": "I am interested in how thoughts, emotions and experiences can influence behaviour."
  },
  {
    "questionNumber": 4,
    "languageCode": "ar",
    "questionText": "I am interested in how thoughts, emotions and experiences can influence behaviour."
  },
  {
    "questionNumber": 5,
    "languageCode": "en",
    "questionText": "I rarely find myself interested in why people behave differently in similar situations."
  },
  {
    "questionNumber": 5,
    "languageCode": "hi",
    "questionText": "\u092e\u0941\u091d\u0947 \u092f\u0939 \u091c\u093e\u0928\u0928\u0947 \u092e\u0947\u0902 \u092c\u0939\u0941\u0924 \u0915\u092e \u0930\u0941\u091a\u093f \u0939\u094b\u0924\u0940 \u0939\u0948 \u0915\u093f \u0938\u092e\u093e\u0928 \u092a\u0930\u093f\u0938\u094d\u0925\u093f\u0924\u093f\u092f\u094b\u0902 \u092e\u0947\u0902 \u0932\u094b\u0917 \u0905\u0932\u0917-\u0905\u0932\u0917 \u0935\u094d\u092f\u0935\u0939\u093e\u0930 \u0915\u094d\u092f\u094b\u0902 \u0915\u0930\u0924\u0947 \u0939\u0948\u0902\u0964"
  },
  {
    "questionNumber": 5,
    "languageCode": "ml",
    "questionText": "\u0d38\u0d2e\u0d3e\u0d28 \u0d38\u0d3e\u0d39\u0d1a\u0d30\u0d4d\u0d2f\u0d19\u0d4d\u0d19\u0d33\u0d3f\u0d7d \u0d06\u0d33\u0d41\u0d15\u0d7e \u0d35\u0d4d\u0d2f\u0d24\u0d4d\u0d2f\u0d38\u0d4d\u0d24\u0d2e\u0d3e\u0d2f\u0d3f \u0d2a\u0d46\u0d30\u0d41\u0d2e\u0d3e\u0d31\u0d41\u0d28\u0d4d\u0d28\u0d24\u0d4d \u0d0e\u0d28\u0d4d\u0d24\u0d41\u0d15\u0d4a\u0d23\u0d4d\u0d1f\u0d3e\u0d23\u0d46\u0d28\u0d4d\u0d28\u0d4d \u0d1a\u0d3f\u0d28\u0d4d\u0d24\u0d3f\u0d15\u0d4d\u0d15\u0d3e\u0d7b \u0d0e\u0d28\u0d3f\u0d15\u0d4d\u0d15\u0d4d \u0d24\u0d3e\u0d32\u0d4d\u0d2a\u0d30\u0d4d\u0d2f\u0d02 \u0d24\u0d4b\u0d28\u0d4d\u0d28\u0d3e\u0d31\u0d3f\u0d32\u0d4d\u0d32."
  },
  {
    "questionNumber": 5,
    "languageCode": "ta",
    "questionText": "I rarely find myself interested in why people behave differently in similar situations."
  },
  {
    "questionNumber": 5,
    "languageCode": "kn",
    "questionText": "I rarely find myself interested in why people behave differently in similar situations."
  },
  {
    "questionNumber": 5,
    "languageCode": "ar",
    "questionText": "I rarely find myself interested in why people behave differently in similar situations."
  },
  {
    "questionNumber": 6,
    "languageCode": "en",
    "questionText": "I like exploring how family, friendships and environment shape a person's development."
  },
  {
    "questionNumber": 6,
    "languageCode": "hi",
    "questionText": "I like exploring how family, friendships and environment shape a person's development."
  },
  {
    "questionNumber": 6,
    "languageCode": "ml",
    "questionText": "I like exploring how family, friendships and environment shape a person's development."
  },
  {
    "questionNumber": 6,
    "languageCode": "ta",
    "questionText": "I like exploring how family, friendships and environment shape a person's development."
  },
  {
    "questionNumber": 6,
    "languageCode": "kn",
    "questionText": "I like exploring how family, friendships and environment shape a person's development."
  },
  {
    "questionNumber": 6,
    "languageCode": "ar",
    "questionText": "I like exploring how family, friendships and environment shape a person's development."
  },
  {
    "questionNumber": 7,
    "languageCode": "en",
    "questionText": "I can stay interested in a discussion even when the people involved have very different viewpoints."
  },
  {
    "questionNumber": 7,
    "languageCode": "hi",
    "questionText": "I can stay interested in a discussion even when the people involved have very different viewpoints."
  },
  {
    "questionNumber": 7,
    "languageCode": "ml",
    "questionText": "I can stay interested in a discussion even when the people involved have very different viewpoints."
  },
  {
    "questionNumber": 7,
    "languageCode": "ta",
    "questionText": "I can stay interested in a discussion even when the people involved have very different viewpoints."
  },
  {
    "questionNumber": 7,
    "languageCode": "kn",
    "questionText": "I can stay interested in a discussion even when the people involved have very different viewpoints."
  },
  {
    "questionNumber": 7,
    "languageCode": "ar",
    "questionText": "I can stay interested in a discussion even when the people involved have very different viewpoints."
  },
  {
    "questionNumber": 8,
    "languageCode": "en",
    "questionText": "I am curious about how people cope with stress, change or difficult situations."
  },
  {
    "questionNumber": 8,
    "languageCode": "hi",
    "questionText": "I am curious about how people cope with stress, change or difficult situations."
  },
  {
    "questionNumber": 8,
    "languageCode": "ml",
    "questionText": "I am curious about how people cope with stress, change or difficult situations."
  },
  {
    "questionNumber": 8,
    "languageCode": "ta",
    "questionText": "I am curious about how people cope with stress, change or difficult situations."
  },
  {
    "questionNumber": 8,
    "languageCode": "kn",
    "questionText": "I am curious about how people cope with stress, change or difficult situations."
  },
  {
    "questionNumber": 8,
    "languageCode": "ar",
    "questionText": "I am curious about how people cope with stress, change or difficult situations."
  },
  {
    "questionNumber": 9,
    "languageCode": "en",
    "questionText": "I enjoy expressing my ideas clearly in speaking or writing."
  },
  {
    "questionNumber": 9,
    "languageCode": "hi",
    "questionText": "\u092e\u0941\u091d\u0947 \u0905\u092a\u0928\u0947 \u0935\u093f\u091a\u093e\u0930\u094b\u0902 \u0915\u094b \u092c\u094b\u0932\u0915\u0930 \u092f\u093e \u0932\u093f\u0916\u0915\u0930 \u0938\u094d\u092a\u0937\u094d\u091f \u0930\u0942\u092a \u0938\u0947 \u0935\u094d\u092f\u0915\u094d\u0924 \u0915\u0930\u0928\u093e \u092a\u0938\u0902\u0926 \u0939\u0948\u0964"
  },
  {
    "questionNumber": 9,
    "languageCode": "ml",
    "questionText": "\u0d38\u0d02\u0d38\u0d3e\u0d30\u0d24\u0d4d\u0d24\u0d3f\u0d32\u0d42\u0d1f\u0d46\u0d2f\u0d4b \u0d0e\u0d34\u0d41\u0d24\u0d4d\u0d24\u0d3f\u0d32\u0d42\u0d1f\u0d46\u0d2f\u0d4b \u0d0e\u0d7b\u0d4d\u0d31\u0d46 \u0d06\u0d36\u0d2f\u0d19\u0d4d\u0d19\u0d7e \u0d35\u0d4d\u0d2f\u0d15\u0d4d\u0d24\u0d2e\u0d3e\u0d2f\u0d3f \u0d2a\u0d4d\u0d30\u0d15\u0d1f\u0d3f\u0d2a\u0d4d\u0d2a\u0d3f\u0d15\u0d4d\u0d15\u0d3e\u0d7b \u0d1e\u0d3e\u0d7b \u0d06\u0d38\u0d4d\u0d35\u0d26\u0d3f\u0d15\u0d4d\u0d15\u0d41\u0d28\u0d4d\u0d28\u0d41."
  },
  {
    "questionNumber": 9,
    "languageCode": "ta",
    "questionText": "I enjoy expressing my ideas clearly in speaking or writing."
  },
  {
    "questionNumber": 9,
    "languageCode": "kn",
    "questionText": "I enjoy expressing my ideas clearly in speaking or writing."
  },
  {
    "questionNumber": 9,
    "languageCode": "ar",
    "questionText": "I enjoy expressing my ideas clearly in speaking or writing."
  },
  {
    "questionNumber": 10,
    "languageCode": "en",
    "questionText": "I like reading articles, stories or essays and thinking about what the writer is trying to communicate."
  },
  {
    "questionNumber": 10,
    "languageCode": "hi",
    "questionText": "\u092e\u0941\u091d\u0947 \u0910\u0938\u0947 \u0932\u0947\u0916, \u0915\u0939\u093e\u0928\u093f\u092f\u093e\u0902 \u092f\u093e \u0928\u093f\u092c\u0902\u0927 \u092a\u0922\u093c\u0928\u093e \u092a\u0938\u0902\u0926 \u0939\u0948 \u091c\u094b \u0935\u093f\u092d\u093f\u0928\u094d\u0928 \u0926\u0943\u0937\u094d\u091f\u093f\u0915\u094b\u0923 \u092a\u094d\u0930\u0938\u094d\u0924\u0941\u0924 \u0915\u0930\u0924\u0947 \u0939\u0948\u0902\u0964"
  },
  {
    "questionNumber": 10,
    "languageCode": "ml",
    "questionText": "\u0d35\u0d4d\u0d2f\u0d24\u0d4d\u0d2f\u0d38\u0d4d\u0d24 \u0d35\u0d40\u0d15\u0d4d\u0d37\u0d23\u0d19\u0d4d\u0d19\u0d7e \u0d1a\u0d7c\u0d1a\u0d4d\u0d1a \u0d1a\u0d46\u0d2f\u0d4d\u0d2f\u0d41\u0d28\u0d4d\u0d28 \u0d32\u0d47\u0d16\u0d28\u0d19\u0d4d\u0d19\u0d33\u0d41\u0d02 \u0d15\u0d25\u0d15\u0d33\u0d41\u0d02 \u0d09\u0d2a\u0d28\u0d4d\u0d2f\u0d3e\u0d38\u0d19\u0d4d\u0d19\u0d33\u0d41\u0d02 \u0d35\u0d3e\u0d2f\u0d3f\u0d15\u0d4d\u0d15\u0d3e\u0d7b \u0d0e\u0d28\u0d3f\u0d15\u0d4d\u0d15\u0d4d \u0d07\u0d37\u0d4d\u0d1f\u0d2e\u0d3e\u0d23\u0d4d."
  },
  {
    "questionNumber": 10,
    "languageCode": "ta",
    "questionText": "I like reading articles, stories or essays and thinking about what the writer is trying to communicate."
  },
  {
    "questionNumber": 10,
    "languageCode": "kn",
    "questionText": "I like reading articles, stories or essays and thinking about what the writer is trying to communicate."
  },
  {
    "questionNumber": 10,
    "languageCode": "ar",
    "questionText": "I like reading articles, stories or essays and thinking about what the writer is trying to communicate."
  },
  {
    "questionNumber": 11,
    "languageCode": "en",
    "questionText": "I enjoy choosing words carefully to make an explanation easier to understand."
  },
  {
    "questionNumber": 11,
    "languageCode": "hi",
    "questionText": "\u092e\u0941\u091d\u0947 \u0905\u092a\u0928\u0947 \u0938\u0902\u0926\u0947\u0936 \u0915\u094b \u092a\u094d\u0930\u092d\u093e\u0935\u0940 \u0914\u0930 \u0938\u091f\u0940\u0915 \u092c\u0928\u093e\u0928\u0947 \u0915\u0947 \u0932\u093f\u090f \u0936\u092c\u094d\u0926\u094b\u0902 \u0915\u093e \u0938\u093e\u0935\u0927\u093e\u0928\u0940\u092a\u0942\u0930\u094d\u0935\u0915 \u091a\u092f\u0928 \u0915\u0930\u0928\u093e \u0905\u091a\u094d\u091b\u093e \u0932\u0917\u0924\u093e \u0939\u0948\u0964"
  },
  {
    "questionNumber": 11,
    "languageCode": "ml",
    "questionText": "\u0d06\u0d36\u0d2f\u0d35\u0d3f\u0d28\u0d3f\u0d2e\u0d2f\u0d02 \u0d35\u0d4d\u0d2f\u0d15\u0d4d\u0d24\u0d35\u0d41\u0d02 \u0d15\u0d43\u0d24\u0d4d\u0d2f\u0d35\u0d41\u0d2e\u0d3e\u0d15\u0d4d\u0d15\u0d3e\u0d7b \u0d35\u0d3e\u0d15\u0d4d\u0d15\u0d41\u0d15\u0d7e \u0d36\u0d4d\u0d30\u0d26\u0d4d\u0d27\u0d3e\u0d2a\u0d42\u0d7c\u0d35\u0d4d\u0d35\u0d02 \u0d24\u0d3f\u0d30\u0d1e\u0d4d\u0d1e\u0d46\u0d1f\u0d41\u0d15\u0d4d\u0d15\u0d41\u0d28\u0d4d\u0d28\u0d24\u0d4d \u0d1e\u0d3e\u0d7b \u0d07\u0d37\u0d4d\u0d1f\u0d2a\u0d4d\u0d2a\u0d46\u0d1f\u0d41\u0d28\u0d4d\u0d28\u0d41."
  },
  {
    "questionNumber": 11,
    "languageCode": "ta",
    "questionText": "I enjoy choosing words carefully to make an explanation easier to understand."
  },
  {
    "questionNumber": 11,
    "languageCode": "kn",
    "questionText": "I enjoy choosing words carefully to make an explanation easier to understand."
  },
  {
    "questionNumber": 11,
    "languageCode": "ar",
    "questionText": "I enjoy choosing words carefully to make an explanation easier to understand."
  },
  {
    "questionNumber": 12,
    "languageCode": "en",
    "questionText": "I feel comfortable presenting an idea to a group when I have prepared for it."
  },
  {
    "questionNumber": 12,
    "languageCode": "hi",
    "questionText": "\u092e\u0941\u091d\u0947 \u0915\u093f\u0938\u0940 \u0938\u092e\u0942\u0939 \u092f\u093e \u0915\u0915\u094d\u0937\u093e \u0915\u0947 \u0938\u093e\u092e\u0928\u0947 \u0915\u093f\u0938\u0940 \u0935\u093f\u091a\u093e\u0930 \u0915\u094b \u092a\u094d\u0930\u0938\u094d\u0924\u0941\u0924 \u0915\u0930\u0928\u0947 \u092e\u0947\u0902 \u0938\u0939\u091c\u0924\u093e \u092e\u0939\u0938\u0942\u0938 \u0939\u094b\u0924\u0940 \u0939\u0948\u0964"
  },
  {
    "questionNumber": 12,
    "languageCode": "ml",
    "questionText": "\u0d12\u0d30\u0d41 \u0d17\u0d4d\u0d30\u0d42\u0d2a\u0d4d\u0d2a\u0d3f\u0d7b\u0d4d\u0d31\u0d46\u0d2f\u0d4b \u0d15\u0d4d\u0d32\u0d3e\u0d38\u0d4d\u0d38\u0d3f\u0d7b\u0d4d\u0d31\u0d46\u0d2f\u0d4b \u0d2e\u0d41\u0d28\u0d4d\u0d28\u0d3f\u0d7d \u0d12\u0d30\u0d41 \u0d06\u0d36\u0d2f\u0d02 \u0d05\u0d35\u0d24\u0d30\u0d3f\u0d2a\u0d4d\u0d2a\u0d3f\u0d15\u0d4d\u0d15\u0d3e\u0d7b \u0d0e\u0d28\u0d3f\u0d15\u0d4d\u0d15\u0d4d \u0d06\u0d24\u0d4d\u0d2e\u0d35\u0d3f\u0d36\u0d4d\u0d35\u0d3e\u0d38\u0d2e\u0d41\u0d23\u0d4d\u0d1f\u0d4d."
  },
  {
    "questionNumber": 12,
    "languageCode": "ta",
    "questionText": "I feel comfortable presenting an idea to a group when I have prepared for it."
  },
  {
    "questionNumber": 12,
    "languageCode": "kn",
    "questionText": "I feel comfortable presenting an idea to a group when I have prepared for it."
  },
  {
    "questionNumber": 12,
    "languageCode": "ar",
    "questionText": "I feel comfortable presenting an idea to a group when I have prepared for it."
  },
  {
    "questionNumber": 13,
    "languageCode": "en",
    "questionText": "I usually avoid situations where I have to explain my ideas clearly to other people."
  },
  {
    "questionNumber": 13,
    "languageCode": "hi",
    "questionText": "\u092e\u0948\u0902 \u0906\u092e\u0924\u094c\u0930 \u092a\u0930 \u0910\u0938\u0940 \u0938\u094d\u0925\u093f\u0924\u093f\u092f\u094b\u0902 \u0938\u0947 \u092c\u091a\u0924\u093e \u0939\u0942\u0901 \u091c\u0939\u093e\u0901 \u092e\u0941\u091d\u0947 \u0915\u093f\u0938\u0940 \u0935\u093f\u091a\u093e\u0930 \u0915\u094b \u0935\u093f\u0938\u094d\u0924\u093e\u0930 \u0938\u0947 \u0938\u092e\u091d\u093e\u0928\u093e \u092f\u093e \u0932\u093f\u0916\u0928\u093e \u092a\u0921\u093c\u0947\u0964"
  },
  {
    "questionNumber": 13,
    "languageCode": "ml",
    "questionText": "\u0d12\u0d30\u0d41 \u0d06\u0d36\u0d2f\u0d24\u0d4d\u0d24\u0d46\u0d15\u0d4d\u0d15\u0d41\u0d31\u0d3f\u0d1a\u0d4d\u0d1a\u0d4d \u0d35\u0d3f\u0d36\u0d26\u0d2e\u0d3e\u0d2f\u0d3f \u0d0e\u0d34\u0d41\u0d24\u0d47\u0d23\u0d4d\u0d1f\u0d3f\u0d35\u0d30\u0d41\u0d28\u0d4d\u0d28 \u0d38\u0d3e\u0d39\u0d1a\u0d30\u0d4d\u0d2f\u0d19\u0d4d\u0d19\u0d7e \u0d1e\u0d3e\u0d7b \u0d38\u0d3e\u0d27\u0d3e\u0d30\u0d23\u0d2f\u0d3e\u0d2f\u0d3f \u0d12\u0d34\u0d3f\u0d35\u0d3e\u0d15\u0d4d\u0d15\u0d3e\u0d31\u0d41\u0d23\u0d4d\u0d1f\u0d4d."
  },
  {
    "questionNumber": 13,
    "languageCode": "ta",
    "questionText": "I usually avoid situations where I have to explain my ideas clearly to other people."
  },
  {
    "questionNumber": 13,
    "languageCode": "kn",
    "questionText": "I usually avoid situations where I have to explain my ideas clearly to other people."
  },
  {
    "questionNumber": 13,
    "languageCode": "ar",
    "questionText": "I usually avoid situations where I have to explain my ideas clearly to other people."
  },
  {
    "questionNumber": 14,
    "languageCode": "en",
    "questionText": "I enjoy writing when I can develop an argument, story or explanation."
  },
  {
    "questionNumber": 14,
    "languageCode": "hi",
    "questionText": "I enjoy writing when I can develop an argument, story or explanation."
  },
  {
    "questionNumber": 14,
    "languageCode": "ml",
    "questionText": "I enjoy writing when I can develop an argument, story or explanation."
  },
  {
    "questionNumber": 14,
    "languageCode": "ta",
    "questionText": "I enjoy writing when I can develop an argument, story or explanation."
  },
  {
    "questionNumber": 14,
    "languageCode": "kn",
    "questionText": "I enjoy writing when I can develop an argument, story or explanation."
  },
  {
    "questionNumber": 14,
    "languageCode": "ar",
    "questionText": "I enjoy writing when I can develop an argument, story or explanation."
  },
  {
    "questionNumber": 15,
    "languageCode": "en",
    "questionText": "I notice when the wording of a message changes its meaning or impact."
  },
  {
    "questionNumber": 15,
    "languageCode": "hi",
    "questionText": "I notice when the wording of a message changes its meaning or impact."
  },
  {
    "questionNumber": 15,
    "languageCode": "ml",
    "questionText": "I notice when the wording of a message changes its meaning or impact."
  },
  {
    "questionNumber": 15,
    "languageCode": "ta",
    "questionText": "I notice when the wording of a message changes its meaning or impact."
  },
  {
    "questionNumber": 15,
    "languageCode": "kn",
    "questionText": "I notice when the wording of a message changes its meaning or impact."
  },
  {
    "questionNumber": 15,
    "languageCode": "ar",
    "questionText": "I notice when the wording of a message changes its meaning or impact."
  },
  {
    "questionNumber": 16,
    "languageCode": "en",
    "questionText": "I enjoy conversations where people exchange ideas and explain different viewpoints."
  },
  {
    "questionNumber": 16,
    "languageCode": "hi",
    "questionText": "I enjoy conversations where people exchange ideas and explain different viewpoints."
  },
  {
    "questionNumber": 16,
    "languageCode": "ml",
    "questionText": "I enjoy conversations where people exchange ideas and explain different viewpoints."
  },
  {
    "questionNumber": 16,
    "languageCode": "ta",
    "questionText": "I enjoy conversations where people exchange ideas and explain different viewpoints."
  },
  {
    "questionNumber": 16,
    "languageCode": "kn",
    "questionText": "I enjoy conversations where people exchange ideas and explain different viewpoints."
  },
  {
    "questionNumber": 16,
    "languageCode": "ar",
    "questionText": "I enjoy conversations where people exchange ideas and explain different viewpoints."
  },
  {
    "questionNumber": 17,
    "languageCode": "en",
    "questionText": "I am curious about how communities develop their customs and traditions."
  },
  {
    "questionNumber": 17,
    "languageCode": "hi",
    "questionText": "\u092e\u0941\u091d\u0947 \u092f\u0939 \u091c\u093e\u0928\u0928\u0947 \u092e\u0947\u0902 \u0909\u0924\u094d\u0938\u0941\u0915\u0924\u093e \u0930\u0939\u0924\u0940 \u0939\u0948 \u0915\u093f \u0938\u092e\u0941\u0926\u093e\u092f \u0905\u092a\u0928\u0940 \u092a\u0930\u0902\u092a\u0930\u093e\u090f\u0902, \u092e\u0942\u0932\u094d\u092f \u0914\u0930 \u092a\u0939\u091a\u093e\u0928 \u0915\u0948\u0938\u0947 \u0935\u093f\u0915\u0938\u093f\u0924 \u0915\u0930\u0924\u0947 \u0939\u0948\u0902\u0964"
  },
  {
    "questionNumber": 17,
    "languageCode": "ml",
    "questionText": "\u0d38\u0d2e\u0d42\u0d39\u0d19\u0d4d\u0d19\u0d7e \u0d05\u0d35\u0d30\u0d41\u0d1f\u0d46 \u0d2a\u0d3e\u0d30\u0d2e\u0d4d\u0d2a\u0d30\u0d4d\u0d2f\u0d19\u0d4d\u0d19\u0d33\u0d41\u0d02 \u0d38\u0d4d\u0d35\u0d24\u0d4d\u0d35\u0d35\u0d41\u0d02 \u0d0e\u0d19\u0d4d\u0d19\u0d28\u0d46 \u0d30\u0d42\u0d2a\u0d2a\u0d4d\u0d2a\u0d46\u0d1f\u0d41\u0d24\u0d4d\u0d24\u0d41\u0d28\u0d4d\u0d28\u0d41 \u0d0e\u0d28\u0d4d\u0d28\u0d4d \u0d05\u0d31\u0d3f\u0d2f\u0d3e\u0d7b \u0d0e\u0d28\u0d3f\u0d15\u0d4d\u0d15\u0d4d \u0d15\u0d57\u0d24\u0d41\u0d15\u0d2e\u0d41\u0d23\u0d4d\u0d1f\u0d4d."
  },
  {
    "questionNumber": 17,
    "languageCode": "ta",
    "questionText": "I am curious about how communities develop their customs and traditions."
  },
  {
    "questionNumber": 17,
    "languageCode": "kn",
    "questionText": "I am curious about how communities develop their customs and traditions."
  },
  {
    "questionNumber": 17,
    "languageCode": "ar",
    "questionText": "I am curious about how communities develop their customs and traditions."
  },
  {
    "questionNumber": 18,
    "languageCode": "en",
    "questionText": "I enjoy learning how culture can influence the way people think and live."
  },
  {
    "questionNumber": 18,
    "languageCode": "hi",
    "questionText": "\u092e\u0941\u091d\u0947 \u092f\u0939 \u0938\u0940\u0916\u0928\u0947 \u092e\u0947\u0902 \u0906\u0928\u0902\u0926 \u0906\u0924\u093e \u0939\u0948 \u0915\u093f \u0938\u0902\u0938\u094d\u0915\u0943\u0924\u093f \u0932\u094b\u0917\u094b\u0902 \u0915\u0947 \u0938\u094b\u091a\u0928\u0947 \u0915\u0947 \u0924\u0930\u0940\u0915\u0947 \u0914\u0930 \u0935\u093f\u0936\u094d\u0935\u0926\u0943\u0937\u094d\u091f\u093f \u0915\u094b \u0915\u0948\u0938\u0947 \u092a\u094d\u0930\u092d\u093e\u0935\u093f\u0924 \u0915\u0930\u0924\u0940 \u0939\u0948\u0964"
  },
  {
    "questionNumber": 18,
    "languageCode": "ml",
    "questionText": "\u0d38\u0d02\u0d38\u0d4d\u0d15\u0d3e\u0d30\u0d02 \u0d06\u0d33\u0d41\u0d15\u0d33\u0d41\u0d1f\u0d46 \u0d1a\u0d3f\u0d28\u0d4d\u0d24\u0d3e\u0d17\u0d24\u0d3f\u0d2f\u0d46\u0d2f\u0d41\u0d02 \u0d15\u0d3e\u0d34\u0d4d\u0d1a\u0d2a\u0d4d\u0d2a\u0d3e\u0d1f\u0d41\u0d15\u0d33\u0d46\u0d2f\u0d41\u0d02 \u0d0e\u0d19\u0d4d\u0d19\u0d28\u0d46 \u0d38\u0d4d\u0d35\u0d3e\u0d27\u0d40\u0d28\u0d3f\u0d15\u0d4d\u0d15\u0d41\u0d28\u0d4d\u0d28\u0d41 \u0d0e\u0d28\u0d4d\u0d28\u0d4d \u0d2a\u0d20\u0d3f\u0d15\u0d4d\u0d15\u0d3e\u0d7b \u0d0e\u0d28\u0d3f\u0d15\u0d4d\u0d15\u0d4d \u0d07\u0d37\u0d4d\u0d1f\u0d2e\u0d3e\u0d23\u0d4d."
  },
  {
    "questionNumber": 18,
    "languageCode": "ta",
    "questionText": "I enjoy learning how culture can influence the way people think and live."
  },
  {
    "questionNumber": 18,
    "languageCode": "kn",
    "questionText": "I enjoy learning how culture can influence the way people think and live."
  },
  {
    "questionNumber": 18,
    "languageCode": "ar",
    "questionText": "I enjoy learning how culture can influence the way people think and live."
  },
  {
    "questionNumber": 19,
    "languageCode": "en",
    "questionText": "I like exploring why social groups may have different values or expectations."
  },
  {
    "questionNumber": 19,
    "languageCode": "hi",
    "questionText": "\u092e\u0941\u091d\u0947 \u092f\u0939 \u0938\u092e\u091d\u0928\u093e \u092a\u0938\u0902\u0926 \u0939\u0948 \u0915\u093f \u0935\u093f\u092d\u093f\u0928\u094d\u0928 \u0938\u093e\u092e\u093e\u091c\u093f\u0915 \u0938\u092e\u0942\u0939\u094b\u0902 \u0915\u0947 \u0926\u0943\u0937\u094d\u091f\u093f\u0915\u094b\u0923 \u0905\u0932\u0917-\u0905\u0932\u0917 \u0915\u094d\u092f\u094b\u0902 \u0939\u094b\u0924\u0947 \u0939\u0948\u0902\u0964"
  },
  {
    "questionNumber": 19,
    "languageCode": "ml",
    "questionText": "\u0d35\u0d4d\u0d2f\u0d24\u0d4d\u0d2f\u0d38\u0d4d\u0d24 \u0d38\u0d3e\u0d2e\u0d42\u0d39\u0d3f\u0d15 \u0d35\u0d3f\u0d2d\u0d3e\u0d17\u0d19\u0d4d\u0d19\u0d7e\u0d15\u0d4d\u0d15\u0d4d \u0d35\u0d4d\u0d2f\u0d24\u0d4d\u0d2f\u0d38\u0d4d\u0d24 \u0d35\u0d40\u0d15\u0d4d\u0d37\u0d23\u0d19\u0d4d\u0d19\u0d7e \u0d09\u0d23\u0d4d\u0d1f\u0d3e\u0d15\u0d41\u0d28\u0d4d\u0d28\u0d24\u0d4d \u0d0e\u0d28\u0d4d\u0d24\u0d41\u0d15\u0d4a\u0d23\u0d4d\u0d1f\u0d3e\u0d23\u0d46\u0d28\u0d4d\u0d28\u0d4d \u0d2e\u0d28\u0d38\u0d4d\u0d38\u0d3f\u0d32\u0d3e\u0d15\u0d4d\u0d15\u0d3e\u0d7b \u0d1e\u0d3e\u0d7b \u0d06\u0d17\u0d4d\u0d30\u0d39\u0d3f\u0d15\u0d4d\u0d15\u0d41\u0d28\u0d4d\u0d28\u0d41."
  },
  {
    "questionNumber": 19,
    "languageCode": "ta",
    "questionText": "I like exploring why social groups may have different values or expectations."
  },
  {
    "questionNumber": 19,
    "languageCode": "kn",
    "questionText": "I like exploring why social groups may have different values or expectations."
  },
  {
    "questionNumber": 19,
    "languageCode": "ar",
    "questionText": "I like exploring why social groups may have different values or expectations."
  },
  {
    "questionNumber": 20,
    "languageCode": "en",
    "questionText": "I am interested in how societies change over time."
  },
  {
    "questionNumber": 20,
    "languageCode": "hi",
    "questionText": "\u092e\u0941\u091d\u0947 \u0907\u0938 \u092c\u093e\u0924 \u092e\u0947\u0902 \u0930\u0941\u091a\u093f \u0939\u0948 \u0915\u093f \u0938\u092e\u093e\u091c \u0938\u092e\u092f \u0915\u0947 \u0938\u093e\u0925 \u0915\u0948\u0938\u0947 \u092c\u0926\u0932\u0924\u0947 \u0939\u0948\u0902 \u0914\u0930 \u0907\u0924\u093f\u0939\u093e\u0938 \u0906\u091c \u0915\u094b \u0915\u0948\u0938\u0947 \u092a\u094d\u0930\u092d\u093e\u0935\u093f\u0924 \u0915\u0930\u0924\u093e \u0939\u0948\u0964"
  },
  {
    "questionNumber": 20,
    "languageCode": "ml",
    "questionText": "\u0d38\u0d2e\u0d42\u0d39\u0d19\u0d4d\u0d19\u0d7e \u0d15\u0d3e\u0d32\u0d15\u0d4d\u0d30\u0d2e\u0d47\u0d23 \u0d0e\u0d19\u0d4d\u0d19\u0d28\u0d46 \u0d2e\u0d3e\u0d31\u0d41\u0d28\u0d4d\u0d28\u0d41\u0d35\u0d46\u0d28\u0d4d\u0d28\u0d41\u0d02 \u0d1a\u0d30\u0d3f\u0d24\u0d4d\u0d30\u0d02 \u0d35\u0d7c\u0d24\u0d4d\u0d24\u0d2e\u0d3e\u0d28\u0d15\u0d3e\u0d32\u0d24\u0d4d\u0d24\u0d46 \u0d0e\u0d19\u0d4d\u0d19\u0d28\u0d46 \u0d38\u0d4d\u0d35\u0d3e\u0d27\u0d40\u0d28\u0d3f\u0d15\u0d4d\u0d15\u0d41\u0d28\u0d4d\u0d28\u0d41\u0d35\u0d46\u0d28\u0d4d\u0d28\u0d41\u0d02 \u0d05\u0d31\u0d3f\u0d2f\u0d3e\u0d7b \u0d0e\u0d28\u0d3f\u0d15\u0d4d\u0d15\u0d4d \u0d24\u0d3e\u0d32\u0d4d\u0d2a\u0d30\u0d4d\u0d2f\u0d2e\u0d41\u0d23\u0d4d\u0d1f\u0d4d."
  },
  {
    "questionNumber": 20,
    "languageCode": "ta",
    "questionText": "I am interested in how societies change over time."
  },
  {
    "questionNumber": 20,
    "languageCode": "kn",
    "questionText": "I am interested in how societies change over time."
  },
  {
    "questionNumber": 20,
    "languageCode": "ar",
    "questionText": "I am interested in how societies change over time."
  },
  {
    "questionNumber": 21,
    "languageCode": "en",
    "questionText": "I usually have little interest in how culture and community shape people's lives."
  },
  {
    "questionNumber": 21,
    "languageCode": "hi",
    "questionText": "\u092e\u0941\u091d\u0947 \u0906\u092e\u0924\u094c\u0930 \u092a\u0930 \u0907\u0938 \u092c\u093e\u0924 \u092e\u0947\u0902 \u092c\u0939\u0941\u0924 \u0915\u092e \u0930\u0941\u091a\u093f \u0939\u094b\u0924\u0940 \u0939\u0948 \u0915\u093f \u0938\u0902\u0938\u094d\u0915\u0943\u0924\u093f \u0914\u0930 \u0938\u092e\u093e\u091c \u0932\u094b\u0917\u094b\u0902 \u0915\u0940 \u0938\u094b\u091a \u0915\u094b \u0915\u0948\u0938\u0947 \u092a\u094d\u0930\u092d\u093e\u0935\u093f\u0924 \u0915\u0930\u0924\u0947 \u0939\u0948\u0902\u0964"
  },
  {
    "questionNumber": 21,
    "languageCode": "ml",
    "questionText": "\u0d38\u0d02\u0d38\u0d4d\u0d15\u0d3e\u0d30\u0d35\u0d41\u0d02 \u0d38\u0d2e\u0d42\u0d39\u0d35\u0d41\u0d02 \u0d06\u0d33\u0d41\u0d15\u0d33\u0d46 \u0d0e\u0d19\u0d4d\u0d19\u0d28\u0d46 \u0d38\u0d4d\u0d35\u0d3e\u0d27\u0d40\u0d28\u0d3f\u0d15\u0d4d\u0d15\u0d41\u0d28\u0d4d\u0d28\u0d41 \u0d0e\u0d28\u0d4d\u0d28\u0d4d \u0d05\u0d31\u0d3f\u0d2f\u0d3e\u0d7b \u0d0e\u0d28\u0d3f\u0d15\u0d4d\u0d15\u0d4d \u0d24\u0d3e\u0d32\u0d4d\u0d2a\u0d30\u0d4d\u0d2f\u0d02 \u0d15\u0d41\u0d31\u0d35\u0d3e\u0d23\u0d4d."
  },
  {
    "questionNumber": 21,
    "languageCode": "ta",
    "questionText": "I usually have little interest in how culture and community shape people's lives."
  },
  {
    "questionNumber": 21,
    "languageCode": "kn",
    "questionText": "I usually have little interest in how culture and community shape people's lives."
  },
  {
    "questionNumber": 21,
    "languageCode": "ar",
    "questionText": "I usually have little interest in how culture and community shape people's lives."
  },
  {
    "questionNumber": 22,
    "languageCode": "en",
    "questionText": "I like learning about different cultures without assuming that one is automatically better than another."
  },
  {
    "questionNumber": 22,
    "languageCode": "hi",
    "questionText": "I like learning about different cultures without assuming that one is automatically better than another."
  },
  {
    "questionNumber": 22,
    "languageCode": "ml",
    "questionText": "I like learning about different cultures without assuming that one is automatically better than another."
  },
  {
    "questionNumber": 22,
    "languageCode": "ta",
    "questionText": "I like learning about different cultures without assuming that one is automatically better than another."
  },
  {
    "questionNumber": 22,
    "languageCode": "kn",
    "questionText": "I like learning about different cultures without assuming that one is automatically better than another."
  },
  {
    "questionNumber": 22,
    "languageCode": "ar",
    "questionText": "I like learning about different cultures without assuming that one is automatically better than another."
  },
  {
    "questionNumber": 23,
    "languageCode": "en",
    "questionText": "I am curious about how family, community and social environment influence opportunities."
  },
  {
    "questionNumber": 23,
    "languageCode": "hi",
    "questionText": "I am curious about how family, community and social environment influence opportunities."
  },
  {
    "questionNumber": 23,
    "languageCode": "ml",
    "questionText": "I am curious about how family, community and social environment influence opportunities."
  },
  {
    "questionNumber": 23,
    "languageCode": "ta",
    "questionText": "I am curious about how family, community and social environment influence opportunities."
  },
  {
    "questionNumber": 23,
    "languageCode": "kn",
    "questionText": "I am curious about how family, community and social environment influence opportunities."
  },
  {
    "questionNumber": 23,
    "languageCode": "ar",
    "questionText": "I am curious about how family, community and social environment influence opportunities."
  },
  {
    "questionNumber": 24,
    "languageCode": "en",
    "questionText": "I enjoy exploring how social attitudes change across generations."
  },
  {
    "questionNumber": 24,
    "languageCode": "hi",
    "questionText": "I enjoy exploring how social attitudes change across generations."
  },
  {
    "questionNumber": 24,
    "languageCode": "ml",
    "questionText": "I enjoy exploring how social attitudes change across generations."
  },
  {
    "questionNumber": 24,
    "languageCode": "ta",
    "questionText": "I enjoy exploring how social attitudes change across generations."
  },
  {
    "questionNumber": 24,
    "languageCode": "kn",
    "questionText": "I enjoy exploring how social attitudes change across generations."
  },
  {
    "questionNumber": 24,
    "languageCode": "ar",
    "questionText": "I enjoy exploring how social attitudes change across generations."
  },
  {
    "questionNumber": 25,
    "languageCode": "en",
    "questionText": "I enjoy thinking about whether a rule is fair and why it exists."
  },
  {
    "questionNumber": 25,
    "languageCode": "hi",
    "questionText": "\u092e\u0941\u091d\u0947 \u092f\u0939 \u0938\u094b\u091a\u0928\u0947 \u092e\u0947\u0902 \u0906\u0928\u0902\u0926 \u0906\u0924\u093e \u0939\u0948 \u0915\u093f \u0915\u094b\u0908 \u0928\u093f\u092f\u092e \u0928\u093f\u0937\u094d\u092a\u0915\u094d\u0937 \u0939\u0948 \u092f\u093e \u0909\u0938\u092e\u0947\u0902 \u092c\u0926\u0932\u093e\u0935 \u0915\u0940 \u0906\u0935\u0936\u094d\u092f\u0915\u0924\u093e \u0939\u0948\u0964"
  },
  {
    "questionNumber": 25,
    "languageCode": "ml",
    "questionText": "\u0d12\u0d30\u0d41 \u0d28\u0d3f\u0d2f\u0d2e\u0d02 \u0d28\u0d40\u0d24\u0d3f\u0d2f\u0d41\u0d15\u0d4d\u0d24\u0d2e\u0d3e\u0d23\u0d4b \u0d05\u0d24\u0d4b \u0d2e\u0d3e\u0d31\u0d4d\u0d31\u0d02 \u0d06\u0d35\u0d36\u0d4d\u0d2f\u0d2e\u0d3e\u0d23\u0d4b \u0d0e\u0d28\u0d4d\u0d28\u0d4d \u0d06\u0d34\u0d24\u0d4d\u0d24\u0d3f\u0d7d \u0d1a\u0d3f\u0d28\u0d4d\u0d24\u0d3f\u0d15\u0d4d\u0d15\u0d3e\u0d7b \u0d1e\u0d3e\u0d7b \u0d06\u0d17\u0d4d\u0d30\u0d39\u0d3f\u0d15\u0d4d\u0d15\u0d41\u0d28\u0d4d\u0d28\u0d41."
  },
  {
    "questionNumber": 25,
    "languageCode": "ta",
    "questionText": "I enjoy thinking about whether a rule is fair and why it exists."
  },
  {
    "questionNumber": 25,
    "languageCode": "kn",
    "questionText": "I enjoy thinking about whether a rule is fair and why it exists."
  },
  {
    "questionNumber": 25,
    "languageCode": "ar",
    "questionText": "I enjoy thinking about whether a rule is fair and why it exists."
  },
  {
    "questionNumber": 26,
    "languageCode": "en",
    "questionText": "I am interested in how rights and responsibilities work in society."
  },
  {
    "questionNumber": 26,
    "languageCode": "hi",
    "questionText": "\u092e\u0947\u0930\u0940 \u0930\u0941\u091a\u093f \u0907\u0938 \u092c\u093e\u0924 \u092e\u0947\u0902 \u0939\u0948 \u0915\u093f \u0938\u092e\u093e\u091c \u092e\u0947\u0902 \u0905\u0927\u093f\u0915\u093e\u0930 \u0914\u0930 \u091c\u093f\u092e\u094d\u092e\u0947\u0926\u093e\u0930\u093f\u092f\u093e\u0902 \u0915\u0948\u0938\u0947 \u0938\u0902\u0924\u0941\u0932\u093f\u0924 \u0939\u094b\u0924\u0940 \u0939\u0948\u0902\u0964"
  },
  {
    "questionNumber": 26,
    "languageCode": "ml",
    "questionText": "\u0d38\u0d2e\u0d42\u0d39\u0d24\u0d4d\u0d24\u0d3f\u0d7d \u0d05\u0d35\u0d15\u0d3e\u0d36\u0d19\u0d4d\u0d19\u0d33\u0d41\u0d02 \u0d09\u0d24\u0d4d\u0d24\u0d30\u0d35\u0d3e\u0d26\u0d3f\u0d24\u0d4d\u0d24\u0d19\u0d4d\u0d19\u0d33\u0d41\u0d02 \u0d0e\u0d19\u0d4d\u0d19\u0d28\u0d46 \u0d38\u0d28\u0d4d\u0d24\u0d41\u0d32\u0d3f\u0d24\u0d2e\u0d3e\u0d15\u0d4d\u0d15\u0d2a\u0d4d\u0d2a\u0d46\u0d1f\u0d41\u0d28\u0d4d\u0d28\u0d41 \u0d0e\u0d28\u0d4d\u0d28\u0d24\u0d3f\u0d7d \u0d0e\u0d28\u0d3f\u0d15\u0d4d\u0d15\u0d4d \u0d24\u0d3e\u0d32\u0d4d\u0d2a\u0d30\u0d4d\u0d2f\u0d2e\u0d41\u0d23\u0d4d\u0d1f\u0d4d."
  },
  {
    "questionNumber": 26,
    "languageCode": "ta",
    "questionText": "I am interested in how rights and responsibilities work in society."
  },
  {
    "questionNumber": 26,
    "languageCode": "kn",
    "questionText": "I am interested in how rights and responsibilities work in society."
  },
  {
    "questionNumber": 26,
    "languageCode": "ar",
    "questionText": "I am interested in how rights and responsibilities work in society."
  },
  {
    "questionNumber": 27,
    "languageCode": "en",
    "questionText": "I like examining both sides of an argument before deciding what I think."
  },
  {
    "questionNumber": 27,
    "languageCode": "hi",
    "questionText": "\u0928\u093f\u0937\u094d\u0915\u0930\u094d\u0937 \u092a\u0930 \u092a\u0939\u0941\u0901\u091a\u0928\u0947 \u0938\u0947 \u092a\u0939\u0932\u0947 \u092e\u0941\u091d\u0947 \u0915\u093f\u0938\u0940 \u092e\u0941\u0926\u094d\u0926\u0947 \u0915\u0947 \u0926\u094b\u0928\u094b\u0902 \u092a\u0915\u094d\u0937\u094b\u0902 \u0915\u0940 \u0928\u093f\u0937\u094d\u092a\u0915\u094d\u0937 \u091c\u093e\u0902\u091a \u0915\u0930\u0928\u093e \u092a\u0938\u0902\u0926 \u0939\u0948\u0964"
  },
  {
    "questionNumber": 27,
    "languageCode": "ml",
    "questionText": "\u0d12\u0d30\u0d41 \u0d24\u0d40\u0d30\u0d41\u0d2e\u0d3e\u0d28\u0d24\u0d4d\u0d24\u0d3f\u0d32\u0d46\u0d24\u0d4d\u0d24\u0d41\u0d28\u0d4d\u0d28\u0d24\u0d3f\u0d28\u0d4d \u0d2e\u0d41\u0d7b\u0d2a\u0d4d \u0d12\u0d30\u0d41 \u0d35\u0d3f\u0d37\u0d2f\u0d24\u0d4d\u0d24\u0d3f\u0d7b\u0d4d\u0d31\u0d46 \u0d07\u0d30\u0d41\u0d35\u0d36\u0d19\u0d4d\u0d19\u0d33\u0d41\u0d02 \u0d28\u0d3f\u0d37\u0d4d\u0d2a\u0d15\u0d4d\u0d37\u0d2e\u0d3e\u0d2f\u0d3f \u0d2a\u0d30\u0d3f\u0d36\u0d4b\u0d27\u0d3f\u0d15\u0d4d\u0d15\u0d3e\u0d7b \u0d1e\u0d3e\u0d7b \u0d07\u0d37\u0d4d\u0d1f\u0d2a\u0d4d\u0d2a\u0d46\u0d1f\u0d41\u0d28\u0d4d\u0d28\u0d41."
  },
  {
    "questionNumber": 27,
    "languageCode": "ta",
    "questionText": "I like examining both sides of an argument before deciding what I think."
  },
  {
    "questionNumber": 27,
    "languageCode": "kn",
    "questionText": "I like examining both sides of an argument before deciding what I think."
  },
  {
    "questionNumber": 27,
    "languageCode": "ar",
    "questionText": "I like examining both sides of an argument before deciding what I think."
  },
  {
    "questionNumber": 28,
    "languageCode": "en",
    "questionText": "I enjoy situations where evidence must be considered before reaching a conclusion."
  },
  {
    "questionNumber": 28,
    "languageCode": "hi",
    "questionText": "\u092e\u0941\u091d\u0947 \u0910\u0938\u0940 \u0938\u094d\u0925\u093f\u0924\u093f\u092f\u093e\u0902 \u092a\u0938\u0902\u0926 \u0939\u0948\u0902 \u091c\u0939\u093e\u0901 \u0928\u093f\u0930\u094d\u0923\u092f \u0932\u0947\u0928\u0947 \u0915\u0947 \u0932\u093f\u090f \u0924\u0930\u094d\u0915\u094b\u0902 \u0914\u0930 \u0938\u093e\u0915\u094d\u0937\u094d\u092f\u094b\u0902 \u0915\u093e \u092e\u0942\u0932\u094d\u092f\u093e\u0902\u0915\u0928 \u0915\u0930\u0928\u093e \u092a\u0921\u093c\u0924\u093e \u0939\u0948\u0964"
  },
  {
    "questionNumber": 28,
    "languageCode": "ml",
    "questionText": "\u0d24\u0d46\u0d33\u0d3f\u0d35\u0d41\u0d15\u0d33\u0d41\u0d1f\u0d46\u0d2f\u0d41\u0d02 \u0d35\u0d3e\u0d26\u0d19\u0d4d\u0d19\u0d33\u0d41\u0d1f\u0d46\u0d2f\u0d41\u0d02 \u0d05\u0d1f\u0d3f\u0d38\u0d4d\u0d25\u0d3e\u0d28\u0d24\u0d4d\u0d24\u0d3f\u0d7d \u0d24\u0d40\u0d30\u0d41\u0d2e\u0d3e\u0d28\u0d2e\u0d46\u0d1f\u0d41\u0d15\u0d4d\u0d15\u0d47\u0d23\u0d4d\u0d1f \u0d38\u0d3e\u0d39\u0d1a\u0d30\u0d4d\u0d2f\u0d19\u0d4d\u0d19\u0d7e \u0d1e\u0d3e\u0d7b \u0d06\u0d38\u0d4d\u0d35\u0d26\u0d3f\u0d15\u0d4d\u0d15\u0d41\u0d28\u0d4d\u0d28\u0d41."
  },
  {
    "questionNumber": 28,
    "languageCode": "ta",
    "questionText": "I enjoy situations where evidence must be considered before reaching a conclusion."
  },
  {
    "questionNumber": 28,
    "languageCode": "kn",
    "questionText": "I enjoy situations where evidence must be considered before reaching a conclusion."
  },
  {
    "questionNumber": 28,
    "languageCode": "ar",
    "questionText": "I enjoy situations where evidence must be considered before reaching a conclusion."
  },
  {
    "questionNumber": 29,
    "languageCode": "en",
    "questionText": "I prefer to accept a rule as it is without thinking about whether it is fair or reasonable."
  },
  {
    "questionNumber": 29,
    "languageCode": "hi",
    "questionText": "\u092e\u0948\u0902 \u0915\u093f\u0938\u0940 \u0928\u093f\u092f\u092e \u092a\u0930 \u0938\u0935\u093e\u0932 \u0909\u0920\u093e\u090f \u092c\u093f\u0928\u093e \u0909\u0938\u0947 \u0935\u0948\u0938\u0947 \u0939\u0940 \u0938\u094d\u0935\u0940\u0915\u093e\u0930 \u0915\u0930\u0928\u093e \u092a\u0938\u0902\u0926 \u0915\u0930\u0924\u093e \u0939\u0942\u0901 \u091c\u0948\u0938\u093e \u0935\u0939 \u0939\u0948\u0964"
  },
  {
    "questionNumber": 29,
    "languageCode": "ml",
    "questionText": "\u0d12\u0d30\u0d41 \u0d28\u0d3f\u0d2f\u0d2e\u0d24\u0d4d\u0d24\u0d46\u0d15\u0d4d\u0d15\u0d41\u0d31\u0d3f\u0d1a\u0d4d\u0d1a\u0d4d \u0d15\u0d42\u0d1f\u0d41\u0d24\u0d7d \u0d1a\u0d4b\u0d26\u0d4d\u0d2f\u0d02 \u0d1a\u0d46\u0d2f\u0d4d\u0d2f\u0d3e\u0d24\u0d46 \u0d05\u0d24\u0d4d \u0d28\u0d3f\u0d32\u0d35\u0d3f\u0d32\u0d41\u0d33\u0d4d\u0d33\u0d24\u0d41\u0d2a\u0d4b\u0d32\u0d46 \u0d05\u0d02\u0d17\u0d40\u0d15\u0d30\u0d3f\u0d15\u0d4d\u0d15\u0d3e\u0d28\u0d3e\u0d23\u0d4d \u0d1e\u0d3e\u0d7b \u0d24\u0d3e\u0d32\u0d4d\u0d2a\u0d30\u0d4d\u0d2f\u0d2a\u0d4d\u0d2a\u0d46\u0d1f\u0d41\u0d28\u0d4d\u0d28\u0d24\u0d4d."
  },
  {
    "questionNumber": 29,
    "languageCode": "ta",
    "questionText": "I prefer to accept a rule as it is without thinking about whether it is fair or reasonable."
  },
  {
    "questionNumber": 29,
    "languageCode": "kn",
    "questionText": "I prefer to accept a rule as it is without thinking about whether it is fair or reasonable."
  },
  {
    "questionNumber": 29,
    "languageCode": "ar",
    "questionText": "I prefer to accept a rule as it is without thinking about whether it is fair or reasonable."
  },
  {
    "questionNumber": 30,
    "languageCode": "en",
    "questionText": "I like identifying inconsistencies in an argument or set of rules."
  },
  {
    "questionNumber": 30,
    "languageCode": "hi",
    "questionText": "I like identifying inconsistencies in an argument or set of rules."
  },
  {
    "questionNumber": 30,
    "languageCode": "ml",
    "questionText": "I like identifying inconsistencies in an argument or set of rules."
  },
  {
    "questionNumber": 30,
    "languageCode": "ta",
    "questionText": "I like identifying inconsistencies in an argument or set of rules."
  },
  {
    "questionNumber": 30,
    "languageCode": "kn",
    "questionText": "I like identifying inconsistencies in an argument or set of rules."
  },
  {
    "questionNumber": 30,
    "languageCode": "ar",
    "questionText": "I like identifying inconsistencies in an argument or set of rules."
  },
  {
    "questionNumber": 31,
    "languageCode": "en",
    "questionText": "I would enjoy discussing how laws can affect different groups of people."
  },
  {
    "questionNumber": 31,
    "languageCode": "hi",
    "questionText": "I would enjoy discussing how laws can affect different groups of people."
  },
  {
    "questionNumber": 31,
    "languageCode": "ml",
    "questionText": "I would enjoy discussing how laws can affect different groups of people."
  },
  {
    "questionNumber": 31,
    "languageCode": "ta",
    "questionText": "I would enjoy discussing how laws can affect different groups of people."
  },
  {
    "questionNumber": 31,
    "languageCode": "kn",
    "questionText": "I would enjoy discussing how laws can affect different groups of people."
  },
  {
    "questionNumber": 31,
    "languageCode": "ar",
    "questionText": "I would enjoy discussing how laws can affect different groups of people."
  },
  {
    "questionNumber": 32,
    "languageCode": "en",
    "questionText": "I am interested in how public decisions can balance individual rights and community needs."
  },
  {
    "questionNumber": 32,
    "languageCode": "hi",
    "questionText": "I am interested in how public decisions can balance individual rights and community needs."
  },
  {
    "questionNumber": 32,
    "languageCode": "ml",
    "questionText": "I am interested in how public decisions can balance individual rights and community needs."
  },
  {
    "questionNumber": 32,
    "languageCode": "ta",
    "questionText": "I am interested in how public decisions can balance individual rights and community needs."
  },
  {
    "questionNumber": 32,
    "languageCode": "kn",
    "questionText": "I am interested in how public decisions can balance individual rights and community needs."
  },
  {
    "questionNumber": 32,
    "languageCode": "ar",
    "questionText": "I am interested in how public decisions can balance individual rights and community needs."
  },
  {
    "questionNumber": 33,
    "languageCode": "en",
    "questionText": "I enjoy understanding what happened in the past and why it mattered."
  },
  {
    "questionNumber": 33,
    "languageCode": "hi",
    "questionText": "\u092e\u0941\u091d\u0947 \u092f\u0939 \u0938\u092e\u091d\u0928\u0947 \u092e\u0947\u0902 \u0906\u0928\u0902\u0926 \u0906\u0924\u093e \u0939\u0948 \u0915\u093f \u0905\u0924\u0940\u0924 \u092e\u0947\u0902 \u0915\u094d\u092f\u093e \u0939\u0941\u0906 \u0914\u0930 \u0909\u0938\u0928\u0947 \u0906\u091c \u0915\u0940 \u0926\u0941\u0928\u093f\u092f\u093e \u0915\u094b \u0915\u0948\u0938\u0947 \u0906\u0915\u093e\u0930 \u0926\u093f\u092f\u093e\u0964"
  },
  {
    "questionNumber": 33,
    "languageCode": "ml",
    "questionText": "\u0d2d\u0d42\u0d24\u0d15\u0d3e\u0d32\u0d24\u0d4d\u0d24\u0d3f\u0d7d \u0d0e\u0d28\u0d4d\u0d24\u0d3e\u0d23\u0d4d \u0d38\u0d02\u0d2d\u0d35\u0d3f\u0d1a\u0d4d\u0d1a\u0d24\u0d46\u0d28\u0d4d\u0d28\u0d41\u0d02 \u0d05\u0d24\u0d4d \u0d07\u0d28\u0d4d\u0d28\u0d24\u0d4d\u0d24\u0d46 \u0d32\u0d4b\u0d15\u0d24\u0d4d\u0d24\u0d46 \u0d0e\u0d19\u0d4d\u0d19\u0d28\u0d46 \u0d2e\u0d3e\u0d31\u0d4d\u0d31\u0d3f\u0d2e\u0d31\u0d3f\u0d1a\u0d4d\u0d1a\u0d41\u0d35\u0d46\u0d28\u0d4d\u0d28\u0d41\u0d02 \u0d05\u0d31\u0d3f\u0d2f\u0d3e\u0d7b \u0d1e\u0d3e\u0d7b \u0d06\u0d38\u0d4d\u0d35\u0d26\u0d3f\u0d15\u0d4d\u0d15\u0d41\u0d28\u0d4d\u0d28\u0d41."
  },
  {
    "questionNumber": 33,
    "languageCode": "ta",
    "questionText": "I enjoy understanding what happened in the past and why it mattered."
  },
  {
    "questionNumber": 33,
    "languageCode": "kn",
    "questionText": "I enjoy understanding what happened in the past and why it mattered."
  },
  {
    "questionNumber": 33,
    "languageCode": "ar",
    "questionText": "I enjoy understanding what happened in the past and why it mattered."
  },
  {
    "questionNumber": 34,
    "languageCode": "en",
    "questionText": "I like connecting events from different periods to understand how one change can influence another."
  },
  {
    "questionNumber": 34,
    "languageCode": "hi",
    "questionText": "\u092e\u0941\u091d\u0947 \u0935\u093f\u092d\u093f\u0928\u094d\u0928 \u0910\u0924\u093f\u0939\u093e\u0938\u093f\u0915 \u0905\u0935\u0927\u093f\u092f\u094b\u0902 \u092f\u093e \u0935\u093f\u092d\u093f\u0928\u094d\u0928 \u0915\u094d\u0937\u0947\u0924\u094d\u0930\u094b\u0902 \u0915\u0940 \u0918\u091f\u0928\u093e\u0913\u0902 \u0915\u094b \u091c\u094b\u0921\u093c\u0915\u0930 \u0926\u0947\u0916\u0928\u093e \u092a\u0938\u0902\u0926 \u0939\u0948\u0964"
  },
  {
    "questionNumber": 34,
    "languageCode": "ml",
    "questionText": "\u0d35\u0d3f\u0d35\u0d3f\u0d27 \u0d1a\u0d30\u0d3f\u0d24\u0d4d\u0d30 \u0d15\u0d3e\u0d32\u0d18\u0d1f\u0d4d\u0d1f\u0d19\u0d4d\u0d19\u0d33\u0d3f\u0d32\u0d46 \u0d05\u0d32\u0d4d\u0d32\u0d46\u0d19\u0d4d\u0d15\u0d3f\u0d7d \u0d2a\u0d4d\u0d30\u0d26\u0d47\u0d36\u0d19\u0d4d\u0d19\u0d33\u0d3f\u0d32\u0d46 \u0d38\u0d02\u0d2d\u0d35\u0d19\u0d4d\u0d19\u0d33\u0d46 \u0d2a\u0d30\u0d38\u0d4d\u0d2a\u0d30\u0d02 \u0d2c\u0d28\u0d4d\u0d27\u0d3f\u0d2a\u0d4d\u0d2a\u0d3f\u0d1a\u0d4d\u0d1a\u0d41 \u0d28\u0d4b\u0d15\u0d4d\u0d15\u0d3e\u0d7b \u0d0e\u0d28\u0d3f\u0d15\u0d4d\u0d15\u0d4d \u0d07\u0d37\u0d4d\u0d1f\u0d2e\u0d3e\u0d23\u0d4d."
  },
  {
    "questionNumber": 34,
    "languageCode": "ta",
    "questionText": "I like connecting events from different periods to understand how one change can influence another."
  },
  {
    "questionNumber": 34,
    "languageCode": "kn",
    "questionText": "I like connecting events from different periods to understand how one change can influence another."
  },
  {
    "questionNumber": 34,
    "languageCode": "ar",
    "questionText": "I like connecting events from different periods to understand how one change can influence another."
  },
  {
    "questionNumber": 35,
    "languageCode": "en",
    "questionText": "I enjoy comparing different accounts of the same historical event."
  },
  {
    "questionNumber": 35,
    "languageCode": "hi",
    "questionText": "\u092e\u0941\u091d\u0947 \u090f\u0915 \u0939\u0940 \u0910\u0924\u093f\u0939\u093e\u0938\u093f\u0915 \u0918\u091f\u0928\u093e \u0915\u0947 \u0935\u093f\u092d\u093f\u0928\u094d\u0928 \u0935\u093f\u0935\u0930\u0923\u094b\u0902 \u092f\u093e \u0926\u0943\u0937\u094d\u091f\u093f\u0915\u094b\u0923\u094b\u0902 \u0915\u0940 \u0924\u0941\u0932\u0928\u093e \u0915\u0930\u0928\u093e \u092a\u0938\u0902\u0926 \u0939\u0948\u0964"
  },
  {
    "questionNumber": 35,
    "languageCode": "ml",
    "questionText": "\u0d12\u0d30\u0d47 \u0d1a\u0d30\u0d3f\u0d24\u0d4d\u0d30\u0d38\u0d02\u0d2d\u0d35\u0d24\u0d4d\u0d24\u0d46\u0d15\u0d4d\u0d15\u0d41\u0d31\u0d3f\u0d1a\u0d4d\u0d1a\u0d41\u0d33\u0d4d\u0d33 \u0d35\u0d4d\u0d2f\u0d24\u0d4d\u0d2f\u0d38\u0d4d\u0d24 \u0d35\u0d3f\u0d35\u0d30\u0d23\u0d19\u0d4d\u0d19\u0d33\u0d41\u0d02 \u0d15\u0d3e\u0d34\u0d4d\u0d1a\u0d2a\u0d4d\u0d2a\u0d3e\u0d1f\u0d41\u0d15\u0d33\u0d41\u0d02 \u0d24\u0d3e\u0d30\u0d24\u0d2e\u0d4d\u0d2f\u0d02 \u0d1a\u0d46\u0d2f\u0d4d\u0d2f\u0d3e\u0d7b \u0d1e\u0d3e\u0d7b \u0d06\u0d17\u0d4d\u0d30\u0d39\u0d3f\u0d15\u0d4d\u0d15\u0d41\u0d28\u0d4d\u0d28\u0d41."
  },
  {
    "questionNumber": 35,
    "languageCode": "ta",
    "questionText": "I enjoy comparing different accounts of the same historical event."
  },
  {
    "questionNumber": 35,
    "languageCode": "kn",
    "questionText": "I enjoy comparing different accounts of the same historical event."
  },
  {
    "questionNumber": 35,
    "languageCode": "ar",
    "questionText": "I enjoy comparing different accounts of the same historical event."
  },
  {
    "questionNumber": 36,
    "languageCode": "en",
    "questionText": "I am interested in how historians use documents, objects or other evidence to interpret the past."
  },
  {
    "questionNumber": 36,
    "languageCode": "hi",
    "questionText": "\u092e\u0947\u0930\u0940 \u0930\u0941\u091a\u093f \u0907\u0938 \u092c\u093e\u0924 \u092e\u0947\u0902 \u0939\u0948 \u0915\u093f \u0907\u0924\u093f\u0939\u093e\u0938\u0915\u093e\u0930 \u0905\u0924\u0940\u0924 \u0915\u094b \u0938\u092e\u091d\u0928\u0947 \u0915\u0947 \u0932\u093f\u090f \u0926\u0938\u094d\u0924\u093e\u0935\u0947\u091c\u094b\u0902 \u0914\u0930 \u0915\u0932\u093e\u0915\u0943\u0924\u093f\u092f\u094b\u0902 \u0915\u093e \u0909\u092a\u092f\u094b\u0917 \u0915\u0948\u0938\u0947 \u0915\u0930\u0924\u0947 \u0939\u0948\u0902\u0964"
  },
  {
    "questionNumber": 36,
    "languageCode": "ml",
    "questionText": "\u0d2d\u0d42\u0d24\u0d15\u0d3e\u0d32\u0d02 \u0d2a\u0d41\u0d28\u0d7c\u0d28\u0d3f\u0d7c\u0d2e\u0d4d\u0d2e\u0d3f\u0d15\u0d4d\u0d15\u0d3e\u0d7b \u0d1a\u0d30\u0d3f\u0d24\u0d4d\u0d30\u0d15\u0d3e\u0d30\u0d28\u0d4d\u0d2e\u0d3e\u0d7c \u0d30\u0d47\u0d16\u0d15\u0d33\u0d41\u0d02 \u0d24\u0d46\u0d33\u0d3f\u0d35\u0d41\u0d15\u0d33\u0d41\u0d02 \u0d0e\u0d19\u0d4d\u0d19\u0d28\u0d46 \u0d09\u0d2a\u0d2f\u0d4b\u0d17\u0d3f\u0d15\u0d4d\u0d15\u0d41\u0d28\u0d4d\u0d28\u0d41 \u0d0e\u0d28\u0d4d\u0d28\u0d4d \u0d05\u0d31\u0d3f\u0d2f\u0d3e\u0d7b \u0d0e\u0d28\u0d3f\u0d15\u0d4d\u0d15\u0d4d \u0d24\u0d3e\u0d32\u0d4d\u0d2a\u0d30\u0d4d\u0d2f\u0d2e\u0d41\u0d23\u0d4d\u0d1f\u0d4d."
  },
  {
    "questionNumber": 36,
    "languageCode": "ta",
    "questionText": "I am interested in how historians use documents, objects or other evidence to interpret the past."
  },
  {
    "questionNumber": 36,
    "languageCode": "kn",
    "questionText": "I am interested in how historians use documents, objects or other evidence to interpret the past."
  },
  {
    "questionNumber": 36,
    "languageCode": "ar",
    "questionText": "I am interested in how historians use documents, objects or other evidence to interpret the past."
  },
  {
    "questionNumber": 37,
    "languageCode": "en",
    "questionText": "I usually lose interest when I have to compare evidence from different historical accounts."
  },
  {
    "questionNumber": 37,
    "languageCode": "hi",
    "questionText": "\u091c\u092c \u092e\u0941\u091d\u0947 \u0910\u0924\u093f\u0939\u093e\u0938\u093f\u0915 \u0938\u093e\u0915\u094d\u0937\u094d\u092f\u094b\u0902 \u0915\u0940 \u0924\u0941\u0932\u0928\u093e \u092f\u093e \u0906\u0932\u094b\u091a\u0928\u093e\u0924\u094d\u092e\u0915 \u0935\u093f\u0936\u094d\u0932\u0947\u0937\u0923 \u0915\u0930\u0928\u093e \u092a\u0921\u093c\u0924\u093e \u0939\u0948, \u0924\u094b \u092e\u0948\u0902 \u0905\u092a\u0928\u0940 \u0930\u0941\u091a\u093f \u0916\u094b \u0926\u0947\u0924\u093e \u0939\u0942\u0901\u0964"
  },
  {
    "questionNumber": 37,
    "languageCode": "ml",
    "questionText": "\u0d1a\u0d30\u0d3f\u0d24\u0d4d\u0d30\u0d2a\u0d30\u0d2e\u0d3e\u0d2f \u0d24\u0d46\u0d33\u0d3f\u0d35\u0d41\u0d15\u0d7e \u0d24\u0d3e\u0d30\u0d24\u0d2e\u0d4d\u0d2f\u0d02 \u0d1a\u0d46\u0d2f\u0d4d\u0d2f\u0d47\u0d23\u0d4d\u0d1f\u0d3f \u0d35\u0d30\u0d41\u0d2e\u0d4d\u0d2a\u0d4b\u0d7e \u0d0e\u0d28\u0d3f\u0d15\u0d4d\u0d15\u0d4d \u0d38\u0d3e\u0d27\u0d3e\u0d30\u0d23\u0d2f\u0d3e\u0d2f\u0d3f \u0d24\u0d3e\u0d32\u0d4d\u0d2a\u0d30\u0d4d\u0d2f\u0d02 \u0d28\u0d37\u0d4d\u0d1f\u0d2a\u0d4d\u0d2a\u0d46\u0d1f\u0d3e\u0d31\u0d41\u0d23\u0d4d\u0d1f\u0d4d."
  },
  {
    "questionNumber": 37,
    "languageCode": "ta",
    "questionText": "I usually lose interest when I have to compare evidence from different historical accounts."
  },
  {
    "questionNumber": 37,
    "languageCode": "kn",
    "questionText": "I usually lose interest when I have to compare evidence from different historical accounts."
  },
  {
    "questionNumber": 37,
    "languageCode": "ar",
    "questionText": "I usually lose interest when I have to compare evidence from different historical accounts."
  },
  {
    "questionNumber": 38,
    "languageCode": "en",
    "questionText": "I enjoy learning how political, economic and cultural changes are connected across time."
  },
  {
    "questionNumber": 38,
    "languageCode": "hi",
    "questionText": "I enjoy learning how political, economic and cultural changes are connected across time."
  },
  {
    "questionNumber": 38,
    "languageCode": "ml",
    "questionText": "I enjoy learning how political, economic and cultural changes are connected across time."
  },
  {
    "questionNumber": 38,
    "languageCode": "ta",
    "questionText": "I enjoy learning how political, economic and cultural changes are connected across time."
  },
  {
    "questionNumber": 38,
    "languageCode": "kn",
    "questionText": "I enjoy learning how political, economic and cultural changes are connected across time."
  },
  {
    "questionNumber": 38,
    "languageCode": "ar",
    "questionText": "I enjoy learning how political, economic and cultural changes are connected across time."
  },
  {
    "questionNumber": 39,
    "languageCode": "en",
    "questionText": "I am curious about how historical memory can differ between communities."
  },
  {
    "questionNumber": 39,
    "languageCode": "hi",
    "questionText": "I am curious about how historical memory can differ between communities."
  },
  {
    "questionNumber": 39,
    "languageCode": "ml",
    "questionText": "I am curious about how historical memory can differ between communities."
  },
  {
    "questionNumber": 39,
    "languageCode": "ta",
    "questionText": "I am curious about how historical memory can differ between communities."
  },
  {
    "questionNumber": 39,
    "languageCode": "kn",
    "questionText": "I am curious about how historical memory can differ between communities."
  },
  {
    "questionNumber": 39,
    "languageCode": "ar",
    "questionText": "I am curious about how historical memory can differ between communities."
  },
  {
    "questionNumber": 40,
    "languageCode": "en",
    "questionText": "I enjoy creating stories, scripts, visual concepts or other forms of creative expression."
  },
  {
    "questionNumber": 40,
    "languageCode": "hi",
    "questionText": "\u092e\u0941\u091d\u0947 \u0910\u0938\u0940 \u0915\u0939\u093e\u0928\u093f\u092f\u093e\u0902, \u0906\u0932\u0947\u0916 \u092f\u093e \u0926\u0943\u0936\u094d\u092f \u0938\u093e\u092e\u0917\u094d\u0930\u0940 \u092c\u0928\u093e\u0928\u093e \u092a\u0938\u0902\u0926 \u0939\u0948 \u091c\u094b \u0915\u093f\u0938\u0940 \u0935\u093f\u091a\u093e\u0930 \u0915\u094b \u0938\u091c\u0940\u0935 \u0930\u0942\u092a \u0938\u0947 \u0935\u094d\u092f\u0915\u094d\u0924 \u0915\u0930\u0947\u0902\u0964"
  },
  {
    "questionNumber": 40,
    "languageCode": "ml",
    "questionText": "\u0d06\u0d36\u0d2f\u0d19\u0d4d\u0d19\u0d7e \u0d2b\u0d32\u0d2a\u0d4d\u0d30\u0d26\u0d2e\u0d3e\u0d2f\u0d3f \u0d38\u0d02\u0d35\u0d26\u0d3f\u0d15\u0d4d\u0d15\u0d41\u0d28\u0d4d\u0d28 \u0d15\u0d25\u0d15\u0d33\u0d4b \u0d26\u0d43\u0d36\u0d4d\u0d2f\u0d19\u0d4d\u0d19\u0d33\u0d4b \u0d09\u0d33\u0d4d\u0d33\u0d1f\u0d15\u0d4d\u0d15\u0d19\u0d4d\u0d19\u0d33\u0d4b \u0d28\u0d3f\u0d7c\u0d2e\u0d4d\u0d2e\u0d3f\u0d15\u0d4d\u0d15\u0d3e\u0d7b \u0d1e\u0d3e\u0d7b \u0d07\u0d37\u0d4d\u0d1f\u0d2a\u0d4d\u0d2a\u0d46\u0d1f\u0d41\u0d28\u0d4d\u0d28\u0d41."
  },
  {
    "questionNumber": 40,
    "languageCode": "ta",
    "questionText": "I enjoy creating stories, scripts, visual concepts or other forms of creative expression."
  },
  {
    "questionNumber": 40,
    "languageCode": "kn",
    "questionText": "I enjoy creating stories, scripts, visual concepts or other forms of creative expression."
  },
  {
    "questionNumber": 40,
    "languageCode": "ar",
    "questionText": "I enjoy creating stories, scripts, visual concepts or other forms of creative expression."
  },
  {
    "questionNumber": 41,
    "languageCode": "en",
    "questionText": "I like thinking about how images, sound or words can influence an audience."
  },
  {
    "questionNumber": 41,
    "languageCode": "hi",
    "questionText": "\u092e\u0941\u091d\u0947 \u092f\u0939 \u0938\u094b\u091a\u0928\u0947 \u092e\u0947\u0902 \u0906\u0928\u0902\u0926 \u0906\u0924\u093e \u0939\u0948 \u0915\u093f \u091a\u093f\u0924\u094d\u0930, \u0927\u094d\u0935\u0928\u093f \u0914\u0930 \u0936\u092c\u094d\u0926 \u0915\u093f\u0938\u0940 \u0938\u0902\u0926\u0947\u0936 \u0915\u094b \u0905\u0927\u093f\u0915 \u092a\u094d\u0930\u092d\u093e\u0935\u0936\u093e\u0932\u0940 \u0915\u0948\u0938\u0947 \u092c\u0928\u093e \u0938\u0915\u0924\u0947 \u0939\u0948\u0902\u0964"
  },
  {
    "questionNumber": 41,
    "languageCode": "ml",
    "questionText": "\u0d1a\u0d3f\u0d24\u0d4d\u0d30\u0d19\u0d4d\u0d19\u0d33\u0d41\u0d02 \u0d36\u0d2c\u0d4d\u0d26\u0d19\u0d4d\u0d19\u0d33\u0d41\u0d02 \u0d35\u0d3e\u0d15\u0d4d\u0d15\u0d41\u0d15\u0d33\u0d41\u0d02 \u0d12\u0d30\u0d41 \u0d38\u0d28\u0d4d\u0d26\u0d47\u0d36\u0d24\u0d4d\u0d24\u0d46 \u0d0e\u0d19\u0d4d\u0d19\u0d28\u0d46 \u0d15\u0d42\u0d1f\u0d41\u0d24\u0d7d \u0d36\u0d15\u0d4d\u0d24\u0d2e\u0d3e\u0d15\u0d4d\u0d15\u0d41\u0d28\u0d4d\u0d28\u0d41 \u0d0e\u0d28\u0d4d\u0d28\u0d4d \u0d1a\u0d3f\u0d28\u0d4d\u0d24\u0d3f\u0d15\u0d4d\u0d15\u0d3e\u0d7b \u0d0e\u0d28\u0d3f\u0d15\u0d4d\u0d15\u0d4d \u0d07\u0d37\u0d4d\u0d1f\u0d2e\u0d3e\u0d23\u0d4d."
  },
  {
    "questionNumber": 41,
    "languageCode": "ta",
    "questionText": "I like thinking about how images, sound or words can influence an audience."
  },
  {
    "questionNumber": 41,
    "languageCode": "kn",
    "questionText": "I like thinking about how images, sound or words can influence an audience."
  },
  {
    "questionNumber": 41,
    "languageCode": "ar",
    "questionText": "I like thinking about how images, sound or words can influence an audience."
  },
  {
    "questionNumber": 42,
    "languageCode": "en",
    "questionText": "I am interested in how news, films, social media or other media shape public understanding."
  },
  {
    "questionNumber": 42,
    "languageCode": "hi",
    "questionText": "\u092e\u0947\u0930\u0940 \u0930\u0941\u091a\u093f \u0907\u0938 \u092c\u093e\u0924 \u092e\u0947\u0902 \u0939\u0948 \u0915\u093f \u0938\u092e\u093e\u091a\u093e\u0930, \u092b\u093f\u0932\u094d\u092e\u0947\u0902 \u0914\u0930 \u0938\u094b\u0936\u0932 \u092e\u0940\u0921\u093f\u092f\u093e \u091c\u0928\u092e\u0924 \u0914\u0930 \u0938\u0902\u0938\u094d\u0915\u0943\u0924\u093f \u0915\u094b \u0915\u0948\u0938\u0947 \u0906\u0915\u093e\u0930 \u0926\u0947\u0924\u0947 \u0939\u0948\u0902\u0964"
  },
  {
    "questionNumber": 42,
    "languageCode": "ml",
    "questionText": "\u0d35\u0d3e\u0d7c\u0d24\u0d4d\u0d24\u0d15\u0d33\u0d41\u0d02 \u0d38\u0d3f\u0d28\u0d3f\u0d2e\u0d15\u0d33\u0d41\u0d02 \u0d38\u0d4b\u0d37\u0d4d\u0d2f\u0d7d \u0d2e\u0d40\u0d21\u0d3f\u0d2f\u0d2f\u0d41\u0d02 \u0d2a\u0d4a\u0d24\u0d41\u0d1c\u0d28\u0d3e\u0d2d\u0d3f\u0d2a\u0d4d\u0d30\u0d3e\u0d2f\u0d24\u0d4d\u0d24\u0d46 \u0d0e\u0d19\u0d4d\u0d19\u0d28\u0d46 \u0d30\u0d42\u0d2a\u0d2a\u0d4d\u0d2a\u0d46\u0d1f\u0d41\u0d24\u0d4d\u0d24\u0d41\u0d28\u0d4d\u0d28\u0d41 \u0d0e\u0d28\u0d4d\u0d28\u0d4d \u0d05\u0d31\u0d3f\u0d2f\u0d3e\u0d7b \u0d0e\u0d28\u0d3f\u0d15\u0d4d\u0d15\u0d4d \u0d24\u0d3e\u0d7d\u0d2a\u0d4d\u0d2a\u0d30\u0d4d\u0d2f\u0d2e\u0d41\u0d23\u0d4d\u0d1f\u0d4d."
  },
  {
    "questionNumber": 42,
    "languageCode": "ta",
    "questionText": "I am interested in how news, films, social media or other media shape public understanding."
  },
  {
    "questionNumber": 42,
    "languageCode": "kn",
    "questionText": "I am interested in how news, films, social media or other media shape public understanding."
  },
  {
    "questionNumber": 42,
    "languageCode": "ar",
    "questionText": "I am interested in how news, films, social media or other media shape public understanding."
  },
  {
    "questionNumber": 43,
    "languageCode": "en",
    "questionText": "I enjoy developing an idea into content that other people can experience."
  },
  {
    "questionNumber": 43,
    "languageCode": "hi",
    "questionText": "\u092e\u0941\u091d\u0947 \u0915\u093f\u0938\u0940 \u0935\u093f\u091a\u093e\u0930 \u0915\u094b \u0926\u0930\u094d\u0936\u0915\u094b\u0902 \u0915\u0947 \u0932\u093f\u090f \u0906\u0915\u0930\u094d\u0937\u0915 \u0932\u0947\u0916, \u0935\u0940\u0921\u093f\u092f\u094b \u092f\u093e \u092a\u0949\u0921\u0915\u093e\u0938\u094d\u091f \u092e\u0947\u0902 \u0935\u093f\u0915\u0938\u093f\u0924 \u0915\u0930\u0928\u0947 \u092e\u0947\u0902 \u0906\u0928\u0902\u0926 \u0906\u0924\u093e \u0939\u0948\u0964"
  },
  {
    "questionNumber": 43,
    "languageCode": "ml",
    "questionText": "\u0d12\u0d30\u0d41 \u0d06\u0d36\u0d2f\u0d24\u0d4d\u0d24\u0d46 \u0d2a\u0d4d\u0d30\u0d47\u0d15\u0d4d\u0d37\u0d15\u0d7c\u0d15\u0d4d\u0d15\u0d3e\u0d2f\u0d3f \u0d06\u0d15\u0d7c\u0d37\u0d15\u0d2e\u0d3e\u0d2f \u0d32\u0d47\u0d16\u0d28\u0d2e\u0d4b \u0d35\u0d40\u0d21\u0d3f\u0d2f\u0d4b\u0d2f\u0d4b \u0d2a\u0d4b\u0d21\u0d4d\u200c\u0d15\u0d3e\u0d38\u0d4d\u0d31\u0d4d\u0d31\u0d4b \u0d06\u0d2f\u0d3f \u0d35\u0d3f\u0d15\u0d38\u0d3f\u0d2a\u0d4d\u0d2a\u0d3f\u0d15\u0d4d\u0d15\u0d3e\u0d7b \u0d1e\u0d3e\u0d7b \u0d06\u0d17\u0d4d\u0d30\u0d39\u0d3f\u0d15\u0d4d\u0d15\u0d41\u0d28\u0d4d\u0d28\u0d41."
  },
  {
    "questionNumber": 43,
    "languageCode": "ta",
    "questionText": "I enjoy developing an idea into content that other people can experience."
  },
  {
    "questionNumber": 43,
    "languageCode": "kn",
    "questionText": "I enjoy developing an idea into content that other people can experience."
  },
  {
    "questionNumber": 43,
    "languageCode": "ar",
    "questionText": "I enjoy developing an idea into content that other people can experience."
  },
  {
    "questionNumber": 44,
    "languageCode": "en",
    "questionText": "I would rather follow a fixed format than experiment with different ways of expressing an idea."
  },
  {
    "questionNumber": 44,
    "languageCode": "hi",
    "questionText": "\u092e\u0948\u0902 \u0930\u091a\u0928\u093e\u0924\u094d\u092e\u0915 \u0930\u0942\u092a \u0938\u0947 \u0915\u0941\u091b \u0928\u092f\u093e \u092c\u0928\u093e\u0928\u0947 \u0915\u0947 \u092c\u091c\u093e\u092f \u090f\u0915 \u0928\u093f\u0936\u094d\u091a\u093f\u0924 \u0914\u0930 \u092a\u0942\u0930\u094d\u0935-\u0928\u093f\u0930\u094d\u0927\u093e\u0930\u093f\u0924 \u092a\u094d\u0930\u093e\u0930\u0942\u092a \u0915\u093e \u092a\u093e\u0932\u0928 \u0915\u0930\u0928\u093e \u092a\u0938\u0902\u0926 \u0915\u0930\u0924\u093e \u0939\u0942\u0901\u0964"
  },
  {
    "questionNumber": 44,
    "languageCode": "ml",
    "questionText": "\u0d38\u0d4d\u0d35\u0d28\u0d4d\u0d24\u0d2e\u0d3e\u0d2f\u0d3f \u0d38\u0d7c\u0d17\u0d4d\u0d17\u0d3e\u0d24\u0d4d\u0d2e\u0d15\u0d2e\u0d3e\u0d2f\u0d3f \u0d0e\u0d28\u0d4d\u0d24\u0d46\u0d19\u0d4d\u0d15\u0d3f\u0d32\u0d41\u0d02 \u0d1a\u0d46\u0d2f\u0d4d\u0d2f\u0d41\u0d28\u0d4d\u0d28\u0d24\u0d3f\u0d28\u0d47\u0d15\u0d4d\u0d15\u0d3e\u0d7e \u0d28\u0d3f\u0d32\u0d35\u0d3f\u0d32\u0d41\u0d33\u0d4d\u0d33 \u0d2e\u0d3e\u0d24\u0d43\u0d15 \u0d2a\u0d3f\u0d28\u0d4d\u0d24\u0d41\u0d1f\u0d30\u0d3e\u0d28\u0d3e\u0d23\u0d4d \u0d1e\u0d3e\u0d7b \u0d24\u0d3e\u0d32\u0d4d\u0d2a\u0d30\u0d4d\u0d2f\u0d2a\u0d4d\u0d2a\u0d46\u0d1f\u0d41\u0d28\u0d4d\u0d28\u0d24\u0d4d."
  },
  {
    "questionNumber": 44,
    "languageCode": "ta",
    "questionText": "I would rather follow a fixed format than experiment with different ways of expressing an idea."
  },
  {
    "questionNumber": 44,
    "languageCode": "kn",
    "questionText": "I would rather follow a fixed format than experiment with different ways of expressing an idea."
  },
  {
    "questionNumber": 44,
    "languageCode": "ar",
    "questionText": "I would rather follow a fixed format than experiment with different ways of expressing an idea."
  },
  {
    "questionNumber": 45,
    "languageCode": "en",
    "questionText": "I am curious about why some stories or media messages attract people's attention."
  },
  {
    "questionNumber": 45,
    "languageCode": "hi",
    "questionText": "I am curious about why some stories or media messages attract people's attention."
  },
  {
    "questionNumber": 45,
    "languageCode": "ml",
    "questionText": "I am curious about why some stories or media messages attract people's attention."
  },
  {
    "questionNumber": 45,
    "languageCode": "ta",
    "questionText": "I am curious about why some stories or media messages attract people's attention."
  },
  {
    "questionNumber": 45,
    "languageCode": "kn",
    "questionText": "I am curious about why some stories or media messages attract people's attention."
  },
  {
    "questionNumber": 45,
    "languageCode": "ar",
    "questionText": "I am curious about why some stories or media messages attract people's attention."
  },
  {
    "questionNumber": 46,
    "languageCode": "en",
    "questionText": "I enjoy analysing how a film, advertisement, article or social-media post creates a particular impression."
  },
  {
    "questionNumber": 46,
    "languageCode": "hi",
    "questionText": "I enjoy analysing how a film, advertisement, article or social-media post creates a particular impression."
  },
  {
    "questionNumber": 46,
    "languageCode": "ml",
    "questionText": "I enjoy analysing how a film, advertisement, article or social-media post creates a particular impression."
  },
  {
    "questionNumber": 46,
    "languageCode": "ta",
    "questionText": "I enjoy analysing how a film, advertisement, article or social-media post creates a particular impression."
  },
  {
    "questionNumber": 46,
    "languageCode": "kn",
    "questionText": "I enjoy analysing how a film, advertisement, article or social-media post creates a particular impression."
  },
  {
    "questionNumber": 46,
    "languageCode": "ar",
    "questionText": "I enjoy analysing how a film, advertisement, article or social-media post creates a particular impression."
  },
  {
    "questionNumber": 47,
    "languageCode": "en",
    "questionText": "I enjoy explaining a difficult idea in a simpler way."
  },
  {
    "questionNumber": 47,
    "languageCode": "hi",
    "questionText": "\u092e\u0941\u091d\u0947 \u0915\u093f\u0938\u0940 \u0915\u0920\u093f\u0928 \u0935\u093f\u091a\u093e\u0930 \u0915\u094b \u0910\u0938\u0947 \u0924\u0930\u0940\u0915\u0947 \u0938\u0947 \u0938\u092e\u091d\u093e\u0928\u0947 \u092e\u0947\u0902 \u0906\u0928\u0902\u0926 \u0906\u0924\u093e \u0939\u0948 \u091c\u093f\u0938\u0938\u0947 \u0926\u0942\u0938\u0930\u0947 \u0909\u0938\u0947 \u0906\u0938\u093e\u0928\u0940 \u0938\u0947 \u0938\u092e\u091d \u0938\u0915\u0947\u0902\u0964"
  },
  {
    "questionNumber": 47,
    "languageCode": "ml",
    "questionText": "\u0d12\u0d30\u0d41 \u0d2a\u0d4d\u0d30\u0d2f\u0d3e\u0d38\u0d15\u0d30\u0d2e\u0d3e\u0d2f \u0d06\u0d36\u0d2f\u0d02 \u0d2e\u0d31\u0d4d\u0d31\u0d41\u0d33\u0d4d\u0d33\u0d35\u0d7c\u0d15\u0d4d\u0d15\u0d4d \u0d0e\u0d33\u0d41\u0d2a\u0d4d\u0d2a\u0d24\u0d4d\u0d24\u0d3f\u0d7d \u0d2e\u0d28\u0d38\u0d4d\u0d38\u0d3f\u0d32\u0d3e\u0d15\u0d41\u0d28\u0d4d\u0d28 \u0d30\u0d40\u0d24\u0d3f\u0d2f\u0d3f\u0d7d \u0d35\u0d3f\u0d36\u0d26\u0d40\u0d15\u0d30\u0d3f\u0d1a\u0d4d\u0d1a\u0d41 \u0d28\u0d7d\u0d15\u0d3e\u0d7b \u0d1e\u0d3e\u0d7b \u0d06\u0d38\u0d4d\u0d35\u0d26\u0d3f\u0d15\u0d4d\u0d15\u0d41\u0d28\u0d4d\u0d28\u0d41."
  },
  {
    "questionNumber": 47,
    "languageCode": "ta",
    "questionText": "I enjoy explaining a difficult idea in a simpler way."
  },
  {
    "questionNumber": 47,
    "languageCode": "kn",
    "questionText": "I enjoy explaining a difficult idea in a simpler way."
  },
  {
    "questionNumber": 47,
    "languageCode": "ar",
    "questionText": "I enjoy explaining a difficult idea in a simpler way."
  },
  {
    "questionNumber": 48,
    "languageCode": "en",
    "questionText": "I feel satisfied when someone understands something because I helped them learn it."
  },
  {
    "questionNumber": 48,
    "languageCode": "hi",
    "questionText": "\u091c\u092c \u092e\u0947\u0930\u0947 \u0938\u092e\u091d\u093e\u0928\u0947 \u0938\u0947 \u0915\u093f\u0938\u0940 \u0915\u094b \u0915\u094b\u0908 \u0915\u0920\u093f\u0928 \u0935\u093f\u0937\u092f \u092f\u093e \u0935\u093f\u091a\u093e\u0930 \u0938\u092e\u091d \u092e\u0947\u0902 \u0906 \u091c\u093e\u0924\u093e \u0939\u0948, \u0924\u094b \u092e\u0941\u091d\u0947 \u0938\u0902\u0924\u094b\u0937 \u092e\u093f\u0932\u0924\u093e \u0939\u0948\u0964"
  },
  {
    "questionNumber": 48,
    "languageCode": "ml",
    "questionText": "\u0d0e\u0d7b\u0d4d\u0d31\u0d46 \u0d35\u0d3f\u0d36\u0d26\u0d40\u0d15\u0d30\u0d23\u0d02 \u0d35\u0d34\u0d3f \u0d2e\u0d31\u0d4d\u0d31\u0d4a\u0d30\u0d3e\u0d7e\u0d15\u0d4d\u0d15\u0d4d \u0d12\u0d30\u0d41 \u0d35\u0d3f\u0d37\u0d2f\u0d02 \u0d35\u0d4d\u0d2f\u0d15\u0d4d\u0d24\u0d2e\u0d3e\u0d2f\u0d3f \u0d2e\u0d28\u0d38\u0d4d\u0d38\u0d3f\u0d32\u0d3e\u0d15\u0d41\u0d2e\u0d4d\u0d2a\u0d4b\u0d7e \u0d0e\u0d28\u0d3f\u0d15\u0d4d\u0d15\u0d4d \u0d38\u0d02\u0d24\u0d43\u0d2a\u0d4d\u0d24\u0d3f \u0d24\u0d4b\u0d28\u0d4d\u0d28\u0d41\u0d28\u0d4d\u0d28\u0d41."
  },
  {
    "questionNumber": 48,
    "languageCode": "ta",
    "questionText": "I feel satisfied when someone understands something because I helped them learn it."
  },
  {
    "questionNumber": 48,
    "languageCode": "kn",
    "questionText": "I feel satisfied when someone understands something because I helped them learn it."
  },
  {
    "questionNumber": 48,
    "languageCode": "ar",
    "questionText": "I feel satisfied when someone understands something because I helped them learn it."
  },
  {
    "questionNumber": 49,
    "languageCode": "en",
    "questionText": "I like adapting the way I explain something when another person does not understand it the first time."
  },
  {
    "questionNumber": 49,
    "languageCode": "hi",
    "questionText": "\u092e\u0941\u091d\u0947 \u0915\u093f\u0938\u0940 \u0935\u093f\u0937\u092f \u0915\u094b \u0938\u092e\u091d\u093e\u0928\u0947 \u0915\u093e \u0905\u092a\u0928\u093e \u0924\u0930\u0940\u0915\u093e \u0938\u0941\u0928\u0928\u0947 \u0935\u093e\u0932\u0947 \u0935\u094d\u092f\u0915\u094d\u0924\u093f \u0915\u0940 \u0906\u0935\u0936\u094d\u092f\u0915\u0924\u093e \u0915\u0947 \u0905\u0928\u0941\u0938\u093e\u0930 \u092c\u0926\u0932\u0928\u093e \u092a\u0938\u0902\u0926 \u0939\u0948\u0964"
  },
  {
    "questionNumber": 49,
    "languageCode": "ml",
    "questionText": "\u0d15\u0d47\u0d7e\u0d15\u0d4d\u0d15\u0d41\u0d28\u0d4d\u0d28 \u0d06\u0d33\u0d41\u0d1f\u0d46 \u0d06\u0d35\u0d36\u0d4d\u0d2f\u0d24\u0d4d\u0d24\u0d3f\u0d28\u0d28\u0d41\u0d38\u0d30\u0d3f\u0d1a\u0d4d\u0d1a\u0d4d \u0d15\u0d3e\u0d30\u0d4d\u0d2f\u0d02 \u0d35\u0d3f\u0d36\u0d26\u0d40\u0d15\u0d30\u0d3f\u0d15\u0d4d\u0d15\u0d41\u0d28\u0d4d\u0d28 \u0d30\u0d40\u0d24\u0d3f \u0d2e\u0d3e\u0d31\u0d4d\u0d31\u0d3e\u0d7b \u0d0e\u0d28\u0d3f\u0d15\u0d4d\u0d15\u0d4d \u0d07\u0d37\u0d4d\u0d1f\u0d2e\u0d3e\u0d23\u0d4d."
  },
  {
    "questionNumber": 49,
    "languageCode": "ta",
    "questionText": "I like adapting the way I explain something when another person does not understand it the first time."
  },
  {
    "questionNumber": 49,
    "languageCode": "kn",
    "questionText": "I like adapting the way I explain something when another person does not understand it the first time."
  },
  {
    "questionNumber": 49,
    "languageCode": "ar",
    "questionText": "I like adapting the way I explain something when another person does not understand it the first time."
  },
  {
    "questionNumber": 50,
    "languageCode": "en",
    "questionText": "I enjoy helping classmates organise their learning or prepare for a task."
  },
  {
    "questionNumber": 50,
    "languageCode": "hi",
    "questionText": "\u092e\u0941\u091d\u0947 \u0938\u0939\u092a\u093e\u0920\u093f\u092f\u094b\u0902 \u0915\u094b \u0909\u0928\u0915\u0947 \u0935\u093f\u091a\u093e\u0930\u094b\u0902 \u0915\u094b \u0935\u094d\u092f\u0935\u0938\u094d\u0925\u093f\u0924 \u0915\u0930\u0928\u0947 \u092f\u093e \u0915\u093f\u0938\u0940 \u0938\u092e\u0938\u094d\u092f\u093e \u0915\u094b \u091a\u0930\u0923\u092c\u0926\u094d\u0927 \u0930\u0942\u092a \u0938\u0947 \u0939\u0932 \u0915\u0930\u0928\u0947 \u092e\u0947\u0902 \u092e\u0926\u0926 \u0915\u0930\u0928\u093e \u092a\u0938\u0902\u0926 \u0939\u0948\u0964"
  },
  {
    "questionNumber": 50,
    "languageCode": "ml",
    "questionText": "\u0d38\u0d39\u0d2a\u0d3e\u0d20\u0d3f\u0d15\u0d33\u0d46 \u0d05\u0d35\u0d30\u0d41\u0d1f\u0d46 \u0d06\u0d36\u0d2f\u0d19\u0d4d\u0d19\u0d7e \u0d15\u0d4d\u0d30\u0d2e\u0d40\u0d15\u0d30\u0d3f\u0d15\u0d4d\u0d15\u0d3e\u0d28\u0d41\u0d02 \u0d2a\u0d4d\u0d30\u0d36\u0d4d\u0d28\u0d19\u0d4d\u0d19\u0d7e \u0d18\u0d1f\u0d4d\u0d1f\u0d19\u0d4d\u0d19\u0d33\u0d3e\u0d2f\u0d3f \u0d2a\u0d30\u0d3f\u0d39\u0d30\u0d3f\u0d15\u0d4d\u0d15\u0d3e\u0d28\u0d41\u0d02 \u0d38\u0d39\u0d3e\u0d2f\u0d3f\u0d15\u0d4d\u0d15\u0d3e\u0d7b \u0d1e\u0d3e\u0d7b \u0d06\u0d17\u0d4d\u0d30\u0d39\u0d3f\u0d15\u0d4d\u0d15\u0d41\u0d28\u0d4d\u0d28\u0d41."
  },
  {
    "questionNumber": 50,
    "languageCode": "ta",
    "questionText": "I enjoy helping classmates organise their learning or prepare for a task."
  },
  {
    "questionNumber": 50,
    "languageCode": "kn",
    "questionText": "I enjoy helping classmates organise their learning or prepare for a task."
  },
  {
    "questionNumber": 50,
    "languageCode": "ar",
    "questionText": "I enjoy helping classmates organise their learning or prepare for a task."
  },
  {
    "questionNumber": 51,
    "languageCode": "en",
    "questionText": "I become frustrated when I need to explain something more than once for another person to understand."
  },
  {
    "questionNumber": 51,
    "languageCode": "hi",
    "questionText": "\u091c\u092c \u092e\u0941\u091d\u0947 \u0915\u093f\u0938\u0940 \u0915\u094b \u0915\u094b\u0908 \u0935\u093f\u091a\u093e\u0930 \u092c\u093e\u0930-\u092c\u093e\u0930 \u0938\u092e\u091d\u093e\u0928\u093e \u092a\u0921\u093c\u0924\u093e \u0939\u0948, \u0924\u094b \u092e\u0948\u0902 \u091c\u0932\u094d\u0926\u0940 \u0928\u093f\u0930\u093e\u0936 \u0939\u094b \u091c\u093e\u0924\u093e \u0939\u0942\u0901\u0964"
  },
  {
    "questionNumber": 51,
    "languageCode": "ml",
    "questionText": "\u0d12\u0d30\u0d47 \u0d15\u0d3e\u0d30\u0d4d\u0d2f\u0d02 \u0d2a\u0d32\u0d24\u0d35\u0d23 \u0d2e\u0d31\u0d4d\u0d31\u0d4a\u0d30\u0d3e\u0d7e\u0d15\u0d4d\u0d15\u0d4d \u0d35\u0d3f\u0d36\u0d26\u0d40\u0d15\u0d30\u0d3f\u0d1a\u0d4d\u0d1a\u0d41 \u0d15\u0d4a\u0d1f\u0d41\u0d15\u0d4d\u0d15\u0d47\u0d23\u0d4d\u0d1f\u0d3f \u0d35\u0d30\u0d41\u0d2e\u0d4d\u0d2a\u0d4b\u0d7e \u0d0e\u0d28\u0d3f\u0d15\u0d4d\u0d15\u0d4d \u0d2a\u0d46\u0d1f\u0d4d\u0d1f\u0d46\u0d28\u0d4d\u0d28\u0d4d \u0d05\u0d24\u0d43\u0d2a\u0d4d\u0d24\u0d3f \u0d24\u0d4b\u0d28\u0d4d\u0d28\u0d3e\u0d31\u0d41\u0d23\u0d4d\u0d1f\u0d4d."
  },
  {
    "questionNumber": 51,
    "languageCode": "ta",
    "questionText": "I become frustrated when I need to explain something more than once for another person to understand."
  },
  {
    "questionNumber": 51,
    "languageCode": "kn",
    "questionText": "I become frustrated when I need to explain something more than once for another person to understand."
  },
  {
    "questionNumber": 51,
    "languageCode": "ar",
    "questionText": "I become frustrated when I need to explain something more than once for another person to understand."
  },
  {
    "questionNumber": 52,
    "languageCode": "en",
    "questionText": "I like encouraging people when they are struggling to learn something new."
  },
  {
    "questionNumber": 52,
    "languageCode": "hi",
    "questionText": "I like encouraging people when they are struggling to learn something new."
  },
  {
    "questionNumber": 52,
    "languageCode": "ml",
    "questionText": "I like encouraging people when they are struggling to learn something new."
  },
  {
    "questionNumber": 52,
    "languageCode": "ta",
    "questionText": "I like encouraging people when they are struggling to learn something new."
  },
  {
    "questionNumber": 52,
    "languageCode": "kn",
    "questionText": "I like encouraging people when they are struggling to learn something new."
  },
  {
    "questionNumber": 52,
    "languageCode": "ar",
    "questionText": "I like encouraging people when they are struggling to learn something new."
  },
  {
    "questionNumber": 53,
    "languageCode": "en",
    "questionText": "I enjoy designing activities that help people understand or practise an idea."
  },
  {
    "questionNumber": 53,
    "languageCode": "hi",
    "questionText": "I enjoy designing activities that help people understand or practise an idea."
  },
  {
    "questionNumber": 53,
    "languageCode": "ml",
    "questionText": "I enjoy designing activities that help people understand or practise an idea."
  },
  {
    "questionNumber": 53,
    "languageCode": "ta",
    "questionText": "I enjoy designing activities that help people understand or practise an idea."
  },
  {
    "questionNumber": 53,
    "languageCode": "kn",
    "questionText": "I enjoy designing activities that help people understand or practise an idea."
  },
  {
    "questionNumber": 53,
    "languageCode": "ar",
    "questionText": "I enjoy designing activities that help people understand or practise an idea."
  },
  {
    "questionNumber": 54,
    "languageCode": "en",
    "questionText": "I enjoy investigating a social issue before forming an opinion about it."
  },
  {
    "questionNumber": 54,
    "languageCode": "hi",
    "questionText": "\u092e\u0941\u091d\u0947 \u0915\u093f\u0938\u0940 \u0938\u093e\u092e\u093e\u091c\u093f\u0915 \u092e\u0941\u0926\u094d\u0926\u0947 \u092a\u0930 \u0915\u094b\u0908 \u0930\u093e\u092f \u092c\u0928\u093e\u0928\u0947 \u0938\u0947 \u092a\u0939\u0932\u0947 \u0909\u0938\u0915\u0940 \u0917\u0939\u0930\u093e\u0908 \u0938\u0947 \u091c\u093e\u0902\u091a-\u092a\u0921\u093c\u0924\u093e\u0932 \u0915\u0930\u0928\u093e \u092a\u0938\u0902\u0926 \u0939\u0948\u0964"
  },
  {
    "questionNumber": 54,
    "languageCode": "ml",
    "questionText": "\u0d12\u0d30\u0d41 \u0d38\u0d3e\u0d2e\u0d42\u0d39\u0d3f\u0d15 \u0d2a\u0d4d\u0d30\u0d36\u0d4d\u0d28\u0d24\u0d4d\u0d24\u0d3f\u0d7d \u0d05\u0d2d\u0d3f\u0d2a\u0d4d\u0d30\u0d3e\u0d2f\u0d02 \u0d2a\u0d31\u0d2f\u0d41\u0d28\u0d4d\u0d28\u0d24\u0d3f\u0d28\u0d4d \u0d2e\u0d41\u0d7b\u0d2a\u0d4d \u0d05\u0d24\u0d3f\u0d28\u0d46\u0d15\u0d4d\u0d15\u0d41\u0d31\u0d3f\u0d1a\u0d4d\u0d1a\u0d4d \u0d28\u0d28\u0d4d\u0d28\u0d3e\u0d2f\u0d3f \u0d05\u0d28\u0d4d\u0d35\u0d47\u0d37\u0d3f\u0d15\u0d4d\u0d15\u0d3e\u0d7b \u0d1e\u0d3e\u0d7b \u0d06\u0d17\u0d4d\u0d30\u0d39\u0d3f\u0d15\u0d4d\u0d15\u0d41\u0d28\u0d4d\u0d28\u0d41."
  },
  {
    "questionNumber": 54,
    "languageCode": "ta",
    "questionText": "I enjoy investigating a social issue before forming an opinion about it."
  },
  {
    "questionNumber": 54,
    "languageCode": "kn",
    "questionText": "I enjoy investigating a social issue before forming an opinion about it."
  },
  {
    "questionNumber": 54,
    "languageCode": "ar",
    "questionText": "I enjoy investigating a social issue before forming an opinion about it."
  },
  {
    "questionNumber": 55,
    "languageCode": "en",
    "questionText": "I like comparing evidence from different sources before reaching a conclusion."
  },
  {
    "questionNumber": 55,
    "languageCode": "hi",
    "questionText": "\u092e\u0941\u091d\u0947 \u0915\u093f\u0938\u0940 \u091c\u091f\u093f\u0932 \u0938\u092e\u0938\u094d\u092f\u093e \u0915\u094b \u0938\u092e\u091d\u0928\u0947 \u0915\u0947 \u0932\u093f\u090f \u0935\u093f\u092d\u093f\u0928\u094d\u0928 \u0938\u094d\u0930\u094b\u0924\u094b\u0902 \u0938\u0947 \u092e\u093f\u0932\u0947 \u0938\u093e\u0915\u094d\u0937\u094d\u092f\u094b\u0902 \u0915\u0940 \u0924\u0941\u0932\u0928\u093e \u0915\u0930\u0928\u093e \u092a\u0938\u0902\u0926 \u0939\u0948\u0964"
  },
  {
    "questionNumber": 55,
    "languageCode": "ml",
    "questionText": "\u0d12\u0d30\u0d41 \u0d38\u0d19\u0d4d\u0d15\u0d40\u0d7c\u0d23\u0d4d\u0d23 \u0d2a\u0d4d\u0d30\u0d36\u0d4d\u0d28\u0d02 \u0d2e\u0d28\u0d38\u0d4d\u0d38\u0d3f\u0d32\u0d3e\u0d15\u0d4d\u0d15\u0d3e\u0d7b \u0d35\u0d3f\u0d35\u0d3f\u0d27 \u0d38\u0d4d\u0d30\u0d4b\u0d24\u0d38\u0d4d\u0d38\u0d41\u0d15\u0d33\u0d3f\u0d7d \u0d28\u0d3f\u0d28\u0d4d\u0d28\u0d41\u0d33\u0d4d\u0d33 \u0d24\u0d46\u0d33\u0d3f\u0d35\u0d41\u0d15\u0d7e \u0d24\u0d3e\u0d30\u0d24\u0d2e\u0d4d\u0d2f\u0d02 \u0d1a\u0d46\u0d2f\u0d4d\u0d2f\u0d3e\u0d7b \u0d0e\u0d28\u0d3f\u0d15\u0d4d\u0d15\u0d4d \u0d07\u0d37\u0d4d\u0d1f\u0d2e\u0d3e\u0d23\u0d4d."
  },
  {
    "questionNumber": 55,
    "languageCode": "ta",
    "questionText": "I like comparing evidence from different sources before reaching a conclusion."
  },
  {
    "questionNumber": 55,
    "languageCode": "kn",
    "questionText": "I like comparing evidence from different sources before reaching a conclusion."
  },
  {
    "questionNumber": 55,
    "languageCode": "ar",
    "questionText": "I like comparing evidence from different sources before reaching a conclusion."
  },
  {
    "questionNumber": 56,
    "languageCode": "en",
    "questionText": "I am interested in how public policies can change people's lives."
  },
  {
    "questionNumber": 56,
    "languageCode": "hi",
    "questionText": "\u092e\u0947\u0930\u0940 \u0930\u0941\u091a\u093f \u0907\u0938 \u092c\u093e\u0924 \u092e\u0947\u0902 \u0939\u0948 \u0915\u093f \u0938\u0930\u0915\u093e\u0930\u0940 \u0928\u0940\u0924\u093f\u092f\u093e\u0902 \u0914\u0930 \u0905\u0902\u0924\u0930\u094d\u0930\u093e\u0937\u094d\u091f\u094d\u0930\u0940\u092f \u0928\u093f\u0930\u094d\u0923\u092f \u0932\u094b\u0917\u094b\u0902 \u0915\u0947 \u091c\u0940\u0935\u0928 \u0915\u094b \u0915\u0948\u0938\u0947 \u092a\u094d\u0930\u092d\u093e\u0935\u093f\u0924 \u0915\u0930\u0924\u0947 \u0939\u0948\u0902\u0964"
  },
  {
    "questionNumber": 56,
    "languageCode": "ml",
    "questionText": "\u0d38\u0d7c\u0d15\u0d4d\u0d15\u0d3e\u0d7c \u0d28\u0d2f\u0d19\u0d4d\u0d19\u0d33\u0d41\u0d02 \u0d06\u0d17\u0d4b\u0d33 \u0d24\u0d40\u0d30\u0d41\u0d2e\u0d3e\u0d28\u0d19\u0d4d\u0d19\u0d33\u0d41\u0d02 \u0d1c\u0d28\u0d19\u0d4d\u0d19\u0d33\u0d41\u0d1f\u0d46 \u0d1c\u0d40\u0d35\u0d3f\u0d24\u0d24\u0d4d\u0d24\u0d46 \u0d0e\u0d19\u0d4d\u0d19\u0d28\u0d46 \u0d38\u0d4d\u0d35\u0d3e\u0d27\u0d40\u0d28\u0d3f\u0d15\u0d4d\u0d15\u0d41\u0d28\u0d4d\u0d28\u0d41 \u0d0e\u0d28\u0d4d\u0d28\u0d4d \u0d05\u0d31\u0d3f\u0d2f\u0d3e\u0d7b \u0d0e\u0d28\u0d3f\u0d15\u0d4d\u0d15\u0d4d \u0d24\u0d3e\u0d32\u0d4d\u0d2a\u0d30\u0d4d\u0d2f\u0d2e\u0d41\u0d23\u0d4d\u0d1f\u0d4d."
  },
  {
    "questionNumber": 56,
    "languageCode": "ta",
    "questionText": "I am interested in how public policies can change people's lives."
  },
  {
    "questionNumber": 56,
    "languageCode": "kn",
    "questionText": "I am interested in how public policies can change people's lives."
  },
  {
    "questionNumber": 56,
    "languageCode": "ar",
    "questionText": "I am interested in how public policies can change people's lives."
  },
  {
    "questionNumber": 57,
    "languageCode": "en",
    "questionText": "I enjoy exploring issues that involve several connected causes rather than one simple answer."
  },
  {
    "questionNumber": 57,
    "languageCode": "hi",
    "questionText": "\u092e\u0941\u091d\u0947 \u0910\u0938\u0947 \u092e\u0941\u0926\u094d\u0926\u094b\u0902 \u0915\u094b \u0924\u0932\u093e\u0936\u0928\u093e \u092a\u0938\u0902\u0926 \u0939\u0948 \u091c\u093f\u0928\u092e\u0947\u0902 \u0930\u093e\u091c\u0928\u0940\u0924\u093f, \u0905\u0930\u094d\u0925\u0936\u093e\u0938\u094d\u0924\u094d\u0930 \u0914\u0930 \u0938\u092e\u093e\u091c \u0915\u0947 \u092c\u0940\u091a \u091c\u091f\u093f\u0932 \u0938\u0902\u092c\u0902\u0927 \u0936\u093e\u092e\u093f\u0932 \u0939\u094b\u0902\u0964"
  },
  {
    "questionNumber": 57,
    "languageCode": "ml",
    "questionText": "\u0d30\u0d3e\u0d37\u0d4d\u0d1f\u0d4d\u0d30\u0d40\u0d2f\u0d02, \u0d38\u0d3e\u0d2e\u0d4d\u0d2a\u0d24\u0d4d\u0d24\u0d3f\u0d15 \u0d36\u0d3e\u0d38\u0d4d\u0d24\u0d4d\u0d30\u0d02, \u0d38\u0d2e\u0d42\u0d39\u0d02 \u0d0e\u0d28\u0d4d\u0d28\u0d3f\u0d35 \u0d2a\u0d30\u0d38\u0d4d\u0d2a\u0d30\u0d02 \u0d2c\u0d28\u0d4d\u0d27\u0d2a\u0d4d\u0d2a\u0d46\u0d1f\u0d4d\u0d1f\u0d41 \u0d15\u0d3f\u0d1f\u0d15\u0d4d\u0d15\u0d41\u0d28\u0d4d\u0d28 \u0d35\u0d3f\u0d37\u0d2f\u0d19\u0d4d\u0d19\u0d7e \u0d2a\u0d30\u0d3f\u0d36\u0d4b\u0d27\u0d3f\u0d15\u0d4d\u0d15\u0d3e\u0d7b \u0d1e\u0d3e\u0d7b \u0d06\u0d17\u0d4d\u0d30\u0d39\u0d3f\u0d15\u0d4d\u0d15\u0d41\u0d28\u0d4d\u0d28\u0d41."
  },
  {
    "questionNumber": 57,
    "languageCode": "ta",
    "questionText": "I enjoy exploring issues that involve several connected causes rather than one simple answer."
  },
  {
    "questionNumber": 57,
    "languageCode": "kn",
    "questionText": "I enjoy exploring issues that involve several connected causes rather than one simple answer."
  },
  {
    "questionNumber": 57,
    "languageCode": "ar",
    "questionText": "I enjoy exploring issues that involve several connected causes rather than one simple answer."
  },
  {
    "questionNumber": 58,
    "languageCode": "en",
    "questionText": "I prefer forming a quick opinion rather than spending time investigating evidence about a social issue."
  },
  {
    "questionNumber": 58,
    "languageCode": "hi",
    "questionText": "\u092e\u0948\u0902 \u0938\u093e\u0915\u094d\u0937\u094d\u092f\u094b\u0902 \u0915\u0940 \u0924\u0941\u0932\u0928\u093e \u0915\u0930\u0928\u0947 \u0915\u0947 \u092c\u091c\u093e\u092f \u091c\u0932\u094d\u0926\u0940 \u0930\u093e\u092f \u092c\u0928\u093e\u0928\u093e \u0914\u0930 \u0938\u0930\u0932 \u0928\u093f\u0937\u094d\u0915\u0930\u094d\u0937\u094b\u0902 \u092a\u0930 \u092a\u0939\u0941\u0901\u091a\u0928\u093e \u092a\u0938\u0902\u0926 \u0915\u0930\u0924\u093e \u0939\u0942\u0901\u0964"
  },
  {
    "questionNumber": 58,
    "languageCode": "ml",
    "questionText": "\u0d24\u0d46\u0d33\u0d3f\u0d35\u0d41\u0d15\u0d7e \u0d2a\u0d30\u0d3f\u0d36\u0d4b\u0d27\u0d3f\u0d1a\u0d4d\u0d1a\u0d4d \u0d38\u0d2e\u0d2f\u0d02 \u0d15\u0d33\u0d2f\u0d41\u0d28\u0d4d\u0d28\u0d24\u0d3f\u0d28\u0d47\u0d15\u0d4d\u0d15\u0d3e\u0d7e \u0d35\u0d47\u0d17\u0d24\u0d4d\u0d24\u0d3f\u0d7d \u0d12\u0d30\u0d41 \u0d05\u0d2d\u0d3f\u0d2a\u0d4d\u0d30\u0d3e\u0d2f\u0d24\u0d4d\u0d24\u0d3f\u0d7d \u0d0e\u0d24\u0d4d\u0d24\u0d3f\u0d1a\u0d4d\u0d1a\u0d47\u0d30\u0d3e\u0d28\u0d3e\u0d23\u0d4d \u0d1e\u0d3e\u0d7b \u0d24\u0d3e\u0d32\u0d4d\u0d2a\u0d30\u0d4d\u0d2f\u0d2a\u0d4d\u0d2a\u0d46\u0d1f\u0d41\u0d28\u0d4d\u0d28\u0d24\u0d4d."
  },
  {
    "questionNumber": 58,
    "languageCode": "ta",
    "questionText": "I prefer forming a quick opinion rather than spending time investigating evidence about a social issue."
  },
  {
    "questionNumber": 58,
    "languageCode": "kn",
    "questionText": "I prefer forming a quick opinion rather than spending time investigating evidence about a social issue."
  },
  {
    "questionNumber": 58,
    "languageCode": "ar",
    "questionText": "I prefer forming a quick opinion rather than spending time investigating evidence about a social issue."
  },
  {
    "questionNumber": 59,
    "languageCode": "en",
    "questionText": "I like asking what data or evidence would help test a claim about society."
  },
  {
    "questionNumber": 59,
    "languageCode": "hi",
    "questionText": "I like asking what data or evidence would help test a claim about society."
  },
  {
    "questionNumber": 59,
    "languageCode": "ml",
    "questionText": "I like asking what data or evidence would help test a claim about society."
  },
  {
    "questionNumber": 59,
    "languageCode": "ta",
    "questionText": "I like asking what data or evidence would help test a claim about society."
  },
  {
    "questionNumber": 59,
    "languageCode": "kn",
    "questionText": "I like asking what data or evidence would help test a claim about society."
  },
  {
    "questionNumber": 59,
    "languageCode": "ar",
    "questionText": "I like asking what data or evidence would help test a claim about society."
  },
  {
    "questionNumber": 60,
    "languageCode": "en",
    "questionText": "I enjoy thinking about how a decision may affect different groups over time."
  },
  {
    "questionNumber": 60,
    "languageCode": "hi",
    "questionText": "I enjoy thinking about how a decision may affect different groups over time."
  },
  {
    "questionNumber": 60,
    "languageCode": "ml",
    "questionText": "I enjoy thinking about how a decision may affect different groups over time."
  },
  {
    "questionNumber": 60,
    "languageCode": "ta",
    "questionText": "I enjoy thinking about how a decision may affect different groups over time."
  },
  {
    "questionNumber": 60,
    "languageCode": "kn",
    "questionText": "I enjoy thinking about how a decision may affect different groups over time."
  },
  {
    "questionNumber": 60,
    "languageCode": "ar",
    "questionText": "I enjoy thinking about how a decision may affect different groups over time."
  },
  {
    "questionNumber": 61,
    "languageCode": "en",
    "questionText": "You are given a free afternoon to explore one topic. Which would you choose?"
  },
  {
    "questionNumber": 61,
    "languageCode": "hi",
    "questionText": "\u0906\u092a\u0915\u094b \u090f\u0915 \u0935\u093f\u0937\u092f \u092a\u0930 \u0936\u094b\u0927 \u092f\u093e \u0905\u0927\u094d\u092f\u092f\u0928 \u0915\u0930\u0928\u0947 \u0915\u0947 \u0932\u093f\u090f \u090f\u0915 \u0916\u093e\u0932\u0940 \u0926\u094b\u092a\u0939\u0930 \u0926\u0940 \u091c\u093e\u0924\u0940 \u0939\u0948\u0964 \u0906\u092a \u0915\u093f\u0938\u0947 \u091a\u0941\u0928\u0947\u0902\u0917\u0947?"
  },
  {
    "questionNumber": 61,
    "languageCode": "ml",
    "questionText": "\u0d12\u0d30\u0d41 \u0d35\u0d3f\u0d37\u0d2f\u0d02 \u0d38\u0d4d\u0d35\u0d24\u0d28\u0d4d\u0d24\u0d4d\u0d30\u0d2e\u0d3e\u0d2f\u0d3f \u0d2a\u0d20\u0d3f\u0d15\u0d4d\u0d15\u0d3e\u0d7b \u0d28\u0d3f\u0d19\u0d4d\u0d19\u0d7e\u0d15\u0d4d\u0d15\u0d4d \u0d12\u0d30\u0d41 \u0d09\u0d1a\u0d4d\u0d1a\u0d38\u0d2e\u0d2f\u0d02 \u0d32\u0d2d\u0d3f\u0d1a\u0d4d\u0d1a\u0d3e\u0d7d, \u0d28\u0d3f\u0d19\u0d4d\u0d19\u0d7e \u0d0f\u0d24\u0d3e\u0d23\u0d4d \u0d24\u0d3f\u0d30\u0d1e\u0d4d\u0d1e\u0d46\u0d1f\u0d41\u0d15\u0d4d\u0d15\u0d41\u0d15?"
  },
  {
    "questionNumber": 61,
    "languageCode": "ta",
    "questionText": "You are given a free afternoon to explore one topic. Which would you choose?"
  },
  {
    "questionNumber": 61,
    "languageCode": "kn",
    "questionText": "You are given a free afternoon to explore one topic. Which would you choose?"
  },
  {
    "questionNumber": 61,
    "languageCode": "ar",
    "questionText": "You are given a free afternoon to explore one topic. Which would you choose?"
  },
  {
    "questionNumber": 62,
    "languageCode": "en",
    "questionText": "Which project would you most enjoy working on?"
  },
  {
    "questionNumber": 62,
    "languageCode": "hi",
    "questionText": "\u0906\u092a\u0915\u094b \u0905\u092a\u0928\u0947 \u0938\u0939\u092a\u093e\u0920\u093f\u092f\u094b\u0902 \u0915\u0947 \u0938\u093e\u0925 \u090f\u0915 \u092a\u0930\u093f\u092f\u094b\u091c\u0928\u093e \u092a\u0930 \u0915\u093e\u092e \u0915\u0930\u0928\u0947 \u0915\u093e \u0905\u0935\u0938\u0930 \u092e\u093f\u0932\u0924\u093e \u0939\u0948\u0964 \u0906\u092a\u0915\u094b \u0915\u093f\u0938\u092e\u0947\u0902 \u0938\u092c\u0938\u0947 \u0905\u0927\u093f\u0915 \u0906\u0928\u0902\u0926 \u0906\u090f\u0917\u093e?"
  },
  {
    "questionNumber": 62,
    "languageCode": "ml",
    "questionText": "\u0d38\u0d39\u0d2a\u0d3e\u0d20\u0d3f\u0d15\u0d33\u0d4b\u0d1f\u0d4a\u0d2a\u0d4d\u0d2a\u0d02 \u0d12\u0d30\u0d41 \u0d2a\u0d4d\u0d30\u0d4b\u0d1c\u0d15\u0d4d\u0d31\u0d4d\u0d31\u0d3f\u0d7d \u0d2a\u0d4d\u0d30\u0d35\u0d7c\u0d24\u0d4d\u0d24\u0d3f\u0d15\u0d4d\u0d15\u0d3e\u0d7b \u0d05\u0d35\u0d38\u0d30\u0d02 \u0d32\u0d2d\u0d3f\u0d1a\u0d4d\u0d1a\u0d3e\u0d7d, \u0d0f\u0d24\u0d4d \u0d2e\u0d47\u0d16\u0d32\u0d2f\u0d3f\u0d7d \u0d2a\u0d4d\u0d30\u0d35\u0d7c\u0d24\u0d4d\u0d24\u0d3f\u0d15\u0d4d\u0d15\u0d3e\u0d28\u0d3e\u0d23\u0d4d \u0d15\u0d42\u0d1f\u0d41\u0d24\u0d7d \u0d07\u0d37\u0d4d\u0d1f\u0d02?"
  },
  {
    "questionNumber": 62,
    "languageCode": "ta",
    "questionText": "Which project would you most enjoy working on?"
  },
  {
    "questionNumber": 62,
    "languageCode": "kn",
    "questionText": "Which project would you most enjoy working on?"
  },
  {
    "questionNumber": 62,
    "languageCode": "ar",
    "questionText": "Which project would you most enjoy working on?"
  },
  {
    "questionNumber": 63,
    "languageCode": "en",
    "questionText": "Which question would you most naturally ask first?"
  },
  {
    "questionNumber": 63,
    "languageCode": "hi",
    "questionText": "\u0915\u093f\u0938\u0940 \u0938\u094d\u0925\u093f\u0924\u093f \u0915\u093e \u0938\u093e\u092e\u0928\u093e \u0915\u0930\u0924\u0947 \u0938\u092e\u092f \u0906\u092a\u0915\u0947 \u092e\u0928 \u092e\u0947\u0902 \u0938\u092c\u0938\u0947 \u092a\u0939\u0932\u0947 \u0915\u094c\u0928 \u0938\u093e \u092a\u094d\u0930\u0936\u094d\u0928 \u0938\u094d\u0935\u093e\u092d\u093e\u0935\u093f\u0915 \u0930\u0942\u092a \u0938\u0947 \u0906\u090f\u0917\u093e?"
  },
  {
    "questionNumber": 63,
    "languageCode": "ml",
    "questionText": "\u0d12\u0d30\u0d41 \u0d2a\u0d41\u0d24\u0d3f\u0d2f \u0d38\u0d3e\u0d39\u0d1a\u0d30\u0d4d\u0d2f\u0d02 \u0d15\u0d3e\u0d23\u0d41\u0d2e\u0d4d\u0d2a\u0d4b\u0d7e \u0d28\u0d3f\u0d19\u0d4d\u0d19\u0d33\u0d41\u0d1f\u0d46 \u0d2e\u0d28\u0d38\u0d4d\u0d38\u0d3f\u0d7d \u0d38\u0d4d\u0d35\u0d3e\u0d2d\u0d3e\u0d35\u0d3f\u0d15\u0d2e\u0d3e\u0d2f\u0d3f \u0d06\u0d26\u0d4d\u0d2f\u0d02 \u0d09\u0d2f\u0d7c\u0d28\u0d4d\u0d28\u0d41\u0d35\u0d30\u0d41\u0d28\u0d4d\u0d28 \u0d1a\u0d4b\u0d26\u0d4d\u0d2f\u0d02 \u0d0f\u0d24\u0d3e\u0d23\u0d4d?"
  },
  {
    "questionNumber": 63,
    "languageCode": "ta",
    "questionText": "Which question would you most naturally ask first?"
  },
  {
    "questionNumber": 63,
    "languageCode": "kn",
    "questionText": "Which question would you most naturally ask first?"
  },
  {
    "questionNumber": 63,
    "languageCode": "ar",
    "questionText": "Which question would you most naturally ask first?"
  },
  {
    "questionNumber": 64,
    "languageCode": "en",
    "questionText": "Which type of activity sounds most satisfying?"
  },
  {
    "questionNumber": 64,
    "languageCode": "hi",
    "questionText": "\u0906\u092a\u0915\u094b \u0915\u093f\u0938 \u092a\u094d\u0930\u0915\u093e\u0930 \u0915\u0940 \u0917\u0924\u093f\u0935\u093f\u0927\u093f \u0938\u092c\u0938\u0947 \u0905\u0927\u093f\u0915 \u0938\u093e\u0930\u094d\u0925\u0915 \u0914\u0930 \u0938\u0902\u0924\u094b\u0937\u091c\u0928\u0915 \u0932\u0917\u0924\u0940 \u0939\u0948?"
  },
  {
    "questionNumber": 64,
    "languageCode": "ml",
    "questionText": "\u0d0f\u0d24\u0d41 \u0d24\u0d30\u0d24\u0d4d\u0d24\u0d3f\u0d32\u0d41\u0d33\u0d4d\u0d33 \u0d2a\u0d4d\u0d30\u0d35\u0d7c\u0d24\u0d4d\u0d24\u0d28\u0d2e\u0d3e\u0d23\u0d4d \u0d28\u0d3f\u0d19\u0d4d\u0d19\u0d7e\u0d15\u0d4d\u0d15\u0d4d \u0d15\u0d42\u0d1f\u0d41\u0d24\u0d7d \u0d38\u0d02\u0d24\u0d43\u0d2a\u0d4d\u0d24\u0d3f\u0d2f\u0d41\u0d02 \u0d05\u0d7c\u0d24\u0d4d\u0d25\u0d35\u0d24\u0d4d\u0d24\u0d41\u0d02 \u0d06\u0d2f\u0d3f \u0d24\u0d4b\u0d28\u0d4d\u0d28\u0d41\u0d28\u0d4d\u0d28\u0d24\u0d4d?"
  },
  {
    "questionNumber": 64,
    "languageCode": "ta",
    "questionText": "Which type of activity sounds most satisfying?"
  },
  {
    "questionNumber": 64,
    "languageCode": "kn",
    "questionText": "Which type of activity sounds most satisfying?"
  },
  {
    "questionNumber": 64,
    "languageCode": "ar",
    "questionText": "Which type of activity sounds most satisfying?"
  },
  {
    "questionNumber": 65,
    "languageCode": "en",
    "questionText": "Which school project would you be most likely to volunteer for?"
  },
  {
    "questionNumber": 65,
    "languageCode": "hi",
    "questionText": "\u0906\u092a \u0915\u093f\u0938 \u0938\u094d\u0915\u0942\u0932 \u092f\u093e \u0915\u0949\u0932\u0947\u091c \u092a\u094d\u0930\u094b\u091c\u0947\u0915\u094d\u091f \u0915\u0947 \u0932\u093f\u090f \u0938\u092c\u0938\u0947 \u092a\u0939\u0932\u0947 \u0938\u094d\u0935\u0947\u091a\u094d\u091b\u093e \u0938\u0947 \u0906\u0917\u0947 \u0906\u090f\u0902\u0917\u0947?"
  },
  {
    "questionNumber": 65,
    "languageCode": "ml",
    "questionText": "\u0d38\u0d4d\u0d15\u0d42\u0d33\u0d3f\u0d32\u0d4b \u0d15\u0d4b\u0d33\u0d47\u0d1c\u0d3f\u0d32\u0d4b \u0d24\u0d3e\u0d34\u0d46 \u0d2a\u0d31\u0d2f\u0d41\u0d28\u0d4d\u0d28\u0d35\u0d2f\u0d3f\u0d7d \u0d0f\u0d24\u0d4d \u0d2a\u0d4d\u0d30\u0d4b\u0d1c\u0d15\u0d4d\u0d31\u0d4d\u0d31\u0d3f\u0d28\u0d3e\u0d23\u0d4d \u0d28\u0d3f\u0d19\u0d4d\u0d19\u0d7e \u0d38\u0d4d\u0d35\u0d2e\u0d47\u0d27\u0d2f\u0d3e \u0d2e\u0d41\u0d28\u0d4d\u0d28\u0d4b\u0d1f\u0d4d\u0d1f\u0d4d \u0d35\u0d30\u0d41\u0d28\u0d4d\u0d28\u0d24\u0d4d?"
  },
  {
    "questionNumber": 65,
    "languageCode": "ta",
    "questionText": "Which school project would you be most likely to volunteer for?"
  },
  {
    "questionNumber": 65,
    "languageCode": "kn",
    "questionText": "Which school project would you be most likely to volunteer for?"
  },
  {
    "questionNumber": 65,
    "languageCode": "ar",
    "questionText": "Which school project would you be most likely to volunteer for?"
  },
  {
    "questionNumber": 66,
    "languageCode": "en",
    "questionText": "Which skill would you most like to become excellent at?"
  },
  {
    "questionNumber": 66,
    "languageCode": "hi",
    "questionText": "Which skill would you most like to become excellent at?"
  },
  {
    "questionNumber": 66,
    "languageCode": "ml",
    "questionText": "Which skill would you most like to become excellent at?"
  },
  {
    "questionNumber": 66,
    "languageCode": "ta",
    "questionText": "Which skill would you most like to become excellent at?"
  },
  {
    "questionNumber": 66,
    "languageCode": "kn",
    "questionText": "Which skill would you most like to become excellent at?"
  },
  {
    "questionNumber": 66,
    "languageCode": "ar",
    "questionText": "Which skill would you most like to become excellent at?"
  },
  {
    "questionNumber": 67,
    "languageCode": "en",
    "questionText": "Which type of material would you most enjoy analysing?"
  },
  {
    "questionNumber": 67,
    "languageCode": "hi",
    "questionText": "Which type of material would you most enjoy analysing?"
  },
  {
    "questionNumber": 67,
    "languageCode": "ml",
    "questionText": "Which type of material would you most enjoy analysing?"
  },
  {
    "questionNumber": 67,
    "languageCode": "ta",
    "questionText": "Which type of material would you most enjoy analysing?"
  },
  {
    "questionNumber": 67,
    "languageCode": "kn",
    "questionText": "Which type of material would you most enjoy analysing?"
  },
  {
    "questionNumber": 67,
    "languageCode": "ar",
    "questionText": "Which type of material would you most enjoy analysing?"
  },
  {
    "questionNumber": 68,
    "languageCode": "en",
    "questionText": "Which challenge would you choose?"
  },
  {
    "questionNumber": 68,
    "languageCode": "hi",
    "questionText": "Which challenge would you choose?"
  },
  {
    "questionNumber": 68,
    "languageCode": "ml",
    "questionText": "Which challenge would you choose?"
  },
  {
    "questionNumber": 68,
    "languageCode": "ta",
    "questionText": "Which challenge would you choose?"
  },
  {
    "questionNumber": 68,
    "languageCode": "kn",
    "questionText": "Which challenge would you choose?"
  },
  {
    "questionNumber": 68,
    "languageCode": "ar",
    "questionText": "Which challenge would you choose?"
  },
  {
    "questionNumber": 69,
    "languageCode": "en",
    "questionText": "Which achievement would feel most meaningful?"
  },
  {
    "questionNumber": 69,
    "languageCode": "hi",
    "questionText": "Which achievement would feel most meaningful?"
  },
  {
    "questionNumber": 69,
    "languageCode": "ml",
    "questionText": "Which achievement would feel most meaningful?"
  },
  {
    "questionNumber": 69,
    "languageCode": "ta",
    "questionText": "Which achievement would feel most meaningful?"
  },
  {
    "questionNumber": 69,
    "languageCode": "kn",
    "questionText": "Which achievement would feel most meaningful?"
  },
  {
    "questionNumber": 69,
    "languageCode": "ar",
    "questionText": "Which achievement would feel most meaningful?"
  },
  {
    "questionNumber": 70,
    "languageCode": "en",
    "questionText": "Which conversation would hold your attention longest?"
  },
  {
    "questionNumber": 70,
    "languageCode": "hi",
    "questionText": "Which conversation would hold your attention longest?"
  },
  {
    "questionNumber": 70,
    "languageCode": "ml",
    "questionText": "Which conversation would hold your attention longest?"
  },
  {
    "questionNumber": 70,
    "languageCode": "ta",
    "questionText": "Which conversation would hold your attention longest?"
  },
  {
    "questionNumber": 70,
    "languageCode": "kn",
    "questionText": "Which conversation would hold your attention longest?"
  },
  {
    "questionNumber": 70,
    "languageCode": "ar",
    "questionText": "Which conversation would hold your attention longest?"
  },
  {
    "questionNumber": 71,
    "languageCode": "en",
    "questionText": "Your group must choose a project. Which role would you naturally prefer?"
  },
  {
    "questionNumber": 71,
    "languageCode": "hi",
    "questionText": "Your group must choose a project. Which role would you naturally prefer?"
  },
  {
    "questionNumber": 71,
    "languageCode": "ml",
    "questionText": "Your group must choose a project. Which role would you naturally prefer?"
  },
  {
    "questionNumber": 71,
    "languageCode": "ta",
    "questionText": "Your group must choose a project. Which role would you naturally prefer?"
  },
  {
    "questionNumber": 71,
    "languageCode": "kn",
    "questionText": "Your group must choose a project. Which role would you naturally prefer?"
  },
  {
    "questionNumber": 71,
    "languageCode": "ar",
    "questionText": "Your group must choose a project. Which role would you naturally prefer?"
  },
  {
    "questionNumber": 72,
    "languageCode": "en",
    "questionText": "A community has a difficult problem. What would you want to do first?"
  },
  {
    "questionNumber": 72,
    "languageCode": "hi",
    "questionText": "A community has a difficult problem. What would you want to do first?"
  },
  {
    "questionNumber": 72,
    "languageCode": "ml",
    "questionText": "A community has a difficult problem. What would you want to do first?"
  },
  {
    "questionNumber": 72,
    "languageCode": "ta",
    "questionText": "A community has a difficult problem. What would you want to do first?"
  },
  {
    "questionNumber": 72,
    "languageCode": "kn",
    "questionText": "A community has a difficult problem. What would you want to do first?"
  },
  {
    "questionNumber": 72,
    "languageCode": "ar",
    "questionText": "A community has a difficult problem. What would you want to do first?"
  },
  {
    "questionNumber": 73,
    "languageCode": "en",
    "questionText": "Which internship environment sounds most appealing?"
  },
  {
    "questionNumber": 73,
    "languageCode": "hi",
    "questionText": "Which internship environment sounds most appealing?"
  },
  {
    "questionNumber": 73,
    "languageCode": "ml",
    "questionText": "Which internship environment sounds most appealing?"
  },
  {
    "questionNumber": 73,
    "languageCode": "ta",
    "questionText": "Which internship environment sounds most appealing?"
  },
  {
    "questionNumber": 73,
    "languageCode": "kn",
    "questionText": "Which internship environment sounds most appealing?"
  },
  {
    "questionNumber": 73,
    "languageCode": "ar",
    "questionText": "Which internship environment sounds most appealing?"
  },
  {
    "questionNumber": 74,
    "languageCode": "en",
    "questionText": "You discover two groups strongly disagree. What would you most likely do?"
  },
  {
    "questionNumber": 74,
    "languageCode": "hi",
    "questionText": "You discover two groups strongly disagree. What would you most likely do?"
  },
  {
    "questionNumber": 74,
    "languageCode": "ml",
    "questionText": "You discover two groups strongly disagree. What would you most likely do?"
  },
  {
    "questionNumber": 74,
    "languageCode": "ta",
    "questionText": "You discover two groups strongly disagree. What would you most likely do?"
  },
  {
    "questionNumber": 74,
    "languageCode": "kn",
    "questionText": "You discover two groups strongly disagree. What would you most likely do?"
  },
  {
    "questionNumber": 74,
    "languageCode": "ar",
    "questionText": "You discover two groups strongly disagree. What would you most likely do?"
  },
  {
    "questionNumber": 75,
    "languageCode": "en",
    "questionText": "Which documentary would you choose first?"
  },
  {
    "questionNumber": 75,
    "languageCode": "hi",
    "questionText": "Which documentary would you choose first?"
  },
  {
    "questionNumber": 75,
    "languageCode": "ml",
    "questionText": "Which documentary would you choose first?"
  },
  {
    "questionNumber": 75,
    "languageCode": "ta",
    "questionText": "Which documentary would you choose first?"
  },
  {
    "questionNumber": 75,
    "languageCode": "kn",
    "questionText": "Which documentary would you choose first?"
  },
  {
    "questionNumber": 75,
    "languageCode": "ar",
    "questionText": "Which documentary would you choose first?"
  },
  {
    "questionNumber": 76,
    "languageCode": "en",
    "questionText": "Your teacher asks you to investigate a social issue. Which approach attracts you most?"
  },
  {
    "questionNumber": 76,
    "languageCode": "hi",
    "questionText": "Your teacher asks you to investigate a social issue. Which approach attracts you most?"
  },
  {
    "questionNumber": 76,
    "languageCode": "ml",
    "questionText": "Your teacher asks you to investigate a social issue. Which approach attracts you most?"
  },
  {
    "questionNumber": 76,
    "languageCode": "ta",
    "questionText": "Your teacher asks you to investigate a social issue. Which approach attracts you most?"
  },
  {
    "questionNumber": 76,
    "languageCode": "kn",
    "questionText": "Your teacher asks you to investigate a social issue. Which approach attracts you most?"
  },
  {
    "questionNumber": 76,
    "languageCode": "ar",
    "questionText": "Your teacher asks you to investigate a social issue. Which approach attracts you most?"
  },
  {
    "questionNumber": 77,
    "languageCode": "en",
    "questionText": "Which outcome would make you most proud after a team project?"
  },
  {
    "questionNumber": 77,
    "languageCode": "hi",
    "questionText": "Which outcome would make you most proud after a team project?"
  },
  {
    "questionNumber": 77,
    "languageCode": "ml",
    "questionText": "Which outcome would make you most proud after a team project?"
  },
  {
    "questionNumber": 77,
    "languageCode": "ta",
    "questionText": "Which outcome would make you most proud after a team project?"
  },
  {
    "questionNumber": 77,
    "languageCode": "kn",
    "questionText": "Which outcome would make you most proud after a team project?"
  },
  {
    "questionNumber": 77,
    "languageCode": "ar",
    "questionText": "Which outcome would make you most proud after a team project?"
  },
  {
    "questionNumber": 78,
    "languageCode": "en",
    "questionText": "If you could spend a day observing one setting, which would you choose?"
  },
  {
    "questionNumber": 78,
    "languageCode": "hi",
    "questionText": "If you could spend a day observing one setting, which would you choose?"
  },
  {
    "questionNumber": 78,
    "languageCode": "ml",
    "questionText": "If you could spend a day observing one setting, which would you choose?"
  },
  {
    "questionNumber": 78,
    "languageCode": "ta",
    "questionText": "If you could spend a day observing one setting, which would you choose?"
  },
  {
    "questionNumber": 78,
    "languageCode": "kn",
    "questionText": "If you could spend a day observing one setting, which would you choose?"
  },
  {
    "questionNumber": 78,
    "languageCode": "ar",
    "questionText": "If you could spend a day observing one setting, which would you choose?"
  },
  {
    "questionNumber": 79,
    "languageCode": "en",
    "questionText": "A new social issue appears in the news. What would you be most curious to understand?"
  },
  {
    "questionNumber": 79,
    "languageCode": "hi",
    "questionText": "A new social issue appears in the news. What would you be most curious to understand?"
  },
  {
    "questionNumber": 79,
    "languageCode": "ml",
    "questionText": "A new social issue appears in the news. What would you be most curious to understand?"
  },
  {
    "questionNumber": 79,
    "languageCode": "ta",
    "questionText": "A new social issue appears in the news. What would you be most curious to understand?"
  },
  {
    "questionNumber": 79,
    "languageCode": "kn",
    "questionText": "A new social issue appears in the news. What would you be most curious to understand?"
  },
  {
    "questionNumber": 79,
    "languageCode": "ar",
    "questionText": "A new social issue appears in the news. What would you be most curious to understand?"
  },
  {
    "questionNumber": 80,
    "languageCode": "en",
    "questionText": "If all four options had the same status and salary, which type of work would you choose?"
  },
  {
    "questionNumber": 80,
    "languageCode": "hi",
    "questionText": "If all four options had the same status and salary, which type of work would you choose?"
  },
  {
    "questionNumber": 80,
    "languageCode": "ml",
    "questionText": "If all four options had the same status and salary, which type of work would you choose?"
  },
  {
    "questionNumber": 80,
    "languageCode": "ta",
    "questionText": "If all four options had the same status and salary, which type of work would you choose?"
  },
  {
    "questionNumber": 80,
    "languageCode": "kn",
    "questionText": "If all four options had the same status and salary, which type of work would you choose?"
  },
  {
    "questionNumber": 80,
    "languageCode": "ar",
    "questionText": "If all four options had the same status and salary, which type of work would you choose?"
  }
];
