/**
 * 3G MeLife — Skill Finder Assessment Multilingual Translation Seed Data
 * Full comprehensive translations for all 104 questions, 33 dimensions, sections, and options
 * across Malayalam (ml), Hindi (hi), Tamil (ta), Kannada (kn), and Arabic (ar).
 */

export interface SectionTranslationSeed {
  sectionCode: string;
  languageCode: string;
  name: string;
  description: string;
}

export interface OptionTranslationSeed {
  optionKey: string;
  languageCode: string;
  optionText: string;
}

export interface QuestionTranslationSeed {
  questionNumber: number;
  languageCode: string;
  questionText: string;
}

export interface DimensionTranslationSeed {
  dimensionCode: string;
  languageCode: string;
  name: string;
}

export interface McqOptionTranslationSeed {
  questionNumber: number;
  optionKey: string;
  languageCode: string;
  optionText: string;
}

export const SECTION_TRANSLATIONS: SectionTranslationSeed[] = [
  {
    "sectionCode": "SECTION_A",
    "languageCode": "ml",
    "name": "വിഭാഗം A: തൊഴിൽ താല്പര്യങ്ങൾ (Interest Discovery)",
    "description": "നിങ്ങൾക്ക് ഏറ്റവും ഇഷ്ടമുള്ള പ്രവർത്തനങ്ങൾ തിരഞ്ഞെടുക്കുക. തെറ്റോ ശരിയോ ആയ ഉത്തരങ്ങളില്ല."
  },
  {
    "sectionCode": "SECTION_B",
    "languageCode": "ml",
    "name": "വിഭാഗം B: നൈപുണ്യ സ്വഭാവങ്ങൾ (Skill Behaviours)",
    "description": "നിങ്ങളുടെ ദൈനംദിന ചിന്താരീതികളും പ്രശ്നപരിഹാര സമീപനങ്ങളും പങ്കുവെക്കുക."
  },
  {
    "sectionCode": "SECTION_C",
    "languageCode": "ml",
    "name": "വിഭാഗം C: അഭിരുചി വിലയിരുത്തൽ (Demonstrated Aptitude)",
    "description": "യുക്തിചിന്ത, ഗണിത വിശകലനം, പാറ്റേൺ കണ്ടെത്തൽ എന്നിവ അളക്കുന്ന ചോദ്യങ്ങൾ."
  },
  {
    "sectionCode": "SECTION_D",
    "languageCode": "ml",
    "name": "വിഭാഗം D: വ്യക്തിത്വ കരുത്തുകൾ (Developmental Strengths)",
    "description": "നിങ്ങളുടെ പഠനരീതികളും സ്വഭാവഗുണങ്ങളും മനസ്സിലാക്കാൻ സഹായിക്കുന്ന ചോദ്യങ്ങൾ."
  },
  {
    "sectionCode": "SECTION_E",
    "languageCode": "ml",
    "name": "വിഭാഗം E: ശ്രദ്ധാ സ്ഥിരത (Response Quality & Attention)",
    "description": "നിങ്ങളുടെ പ്രതികരണ സ്ഥിരത ഉറപ്പാക്കാനുള്ള ചോദ്യങ്ങൾ."
  },
  {
    "sectionCode": "SECTION_A",
    "languageCode": "hi",
    "name": "भाग A: व्यावसायिक रुचियाँ (Interest Discovery)",
    "description": "अपनी पसंदीदा गतिविधियों का चयन करें। यहाँ कोई सही या गलत उत्तर नहीं है।"
  },
  {
    "sectionCode": "SECTION_B",
    "languageCode": "hi",
    "name": "भाग B: कौशल व्यवहार (Skill Behaviours)",
    "description": "अपनी समस्या-समाधान शैली और दैनिक कार्य व्यवहार को साझा करें।"
  },
  {
    "sectionCode": "SECTION_C",
    "languageCode": "hi",
    "name": "भाग C: प्रदर्शित योग्यता (Demonstrated Aptitude)",
    "description": "तर्कशक्ति, गणितीय समझ और पैटर्न पहेलियों से संबंधित प्रश्न।"
  },
  {
    "sectionCode": "SECTION_D",
    "languageCode": "hi",
    "name": "भाग D: विकासात्मक ताकत (Developmental Strengths)",
    "description": "आपकी सीखने की आदतें और निरंतरता को समझने वाले प्रश्न।"
  },
  {
    "sectionCode": "SECTION_E",
    "languageCode": "hi",
    "name": "भाग E: प्रतिक्रिया गुणवत्ता (Response Quality & Attention)",
    "description": "सटीकता और निरंतरता की पुष्टि हेतु प्रश्न।"
  },
  {
    "sectionCode": "SECTION_A",
    "languageCode": "ta",
    "name": "பிரிவு A: தொழில் ஆர்வங்கள் (Interest Discovery)",
    "description": "உங்களுக்கு மிகவும் பிடித்த செயல்பாடுகளைத் தேர்வுசெய்க. தவறான பதில்கள் எதுவும் இல்லை."
  },
  {
    "sectionCode": "SECTION_B",
    "languageCode": "ta",
    "name": "பிரிவு B: திறன் நடத்தைகள் (Skill Behaviours)",
    "description": "உங்கள் சிக்கல் தீர்க்கும் பாணி மற்றும் தினசரி செயல்பாடுகளைப் பகிரவும்."
  },
  {
    "sectionCode": "SECTION_C",
    "languageCode": "ta",
    "name": "பிரிவு C: நிரூபிக்கப்பட்ட திறன் (Demonstrated Aptitude)",
    "description": "தருக்க சிந்தனை, கணித பகுப்பாய்வு மற்றும் வடிவமைப்பு புதிர்கள்."
  },
  {
    "sectionCode": "SECTION_D",
    "languageCode": "ta",
    "name": "பிரிவு D: வளர்ச்சி பலங்கள் (Developmental Strengths)",
    "description": "உங்கள் கற்றல் பழக்கவழக்கங்கள் மற்றும் விடாமுயற்சியை அளவிடும் கேள்விகள்."
  },
  {
    "sectionCode": "SECTION_E",
    "languageCode": "ta",
    "name": "பிரிவு E: பதில் தரம் (Response Quality & Attention)",
    "description": "பதில்களின் துல்லியம் மற்றும் நிலைத்தன்மையை உறுதிப்படுத்தும் பிரிவு."
  },
  {
    "sectionCode": "SECTION_A",
    "languageCode": "kn",
    "name": "ವಿಭಾಗ A: ವೃತ್ತಿಪರ ಆಸಕ್ತಿಗಳು (Interest Discovery)",
    "description": "ನಿಮ್ಮ ಮೆಚ್ಚಿನ ಚಟುವಟಿಕೆಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ. ಇಲ್ಲಿ ಯಾವುದೇ ಸರಿ ಅಥವಾ ತಪ್ಪು ಉತ್ತರಗಳಿಲ್ಲ."
  },
  {
    "sectionCode": "SECTION_B",
    "languageCode": "kn",
    "name": "ವಿಭಾಗ B: ಕೌಶಲ್ಯ ನಡವಳಿಕೆಗಳು (Skill Behaviours)",
    "description": "ನಿಮ್ಮ ಸಮಸ್ಯೆ-ಪರಿಹರಿಸುವ ಶೈಲಿ ಮತ್ತು ದೈನಂದಿನ ಕಾರ್ಯ ನಡವಳಿಕೆಯನ್ನು ಹಂಚಿಕೊಳ್ಳಿ."
  },
  {
    "sectionCode": "SECTION_C",
    "languageCode": "kn",
    "name": "ವಿಭಾಗ C: ಪ್ರದರ್ಶಿತ ಸಾಮರ್ಥ್ಯ (Demonstrated Aptitude)",
    "description": "ತಾರ್ಕಿಕ ಚಿಂತನೆ, ಗಣಿತ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಮಾದರಿ ಒಗಟುಗಳು."
  },
  {
    "sectionCode": "SECTION_D",
    "languageCode": "kn",
    "name": "ವಿಭಾಗ D: ಬೆಳವಣಿಗೆಯ ಸಾಮರ್ಥ್ಯಗಳು (Developmental Strengths)",
    "description": "ನಿಮ್ಮ ಕಲಿಕೆಯ ಅಭ್ಯಾಸಗಳು ಮತ್ತು ಪರಿಶ್ರಮವನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವ ಪ್ರಶ್ನೆಗಳು."
  },
  {
    "sectionCode": "SECTION_E",
    "languageCode": "kn",
    "name": "ವಿಭಾಗ E: ಪ್ರತಿಕ್ರಿಯೆ ಗುಣಮಟ್ಟ (Response Quality & Attention)",
    "description": "ನಿಖರತೆ ಮತ್ತು ಸ್ಥಿರತೆಯನ್ನು ಖಚಿತಪಡಿಸುವ ಪ್ರಶ್ನೆಗಳು."
  },
  {
    "sectionCode": "SECTION_A",
    "languageCode": "ar",
    "name": "القسم A: استكشاف الاهتمامات المهنية (Interest Discovery)",
    "description": "اختر الأنشطة التي تعبر عن اهتماماتك الحقيقية. لا توجد إجابات صحيحة أو خاطئة."
  },
  {
    "sectionCode": "SECTION_B",
    "languageCode": "ar",
    "name": "القسم B: السلوكيات والمهارات التطبيقية (Skill Behaviours)",
    "description": "شارك أسلوبك في حل المشكلات وطريقتك المعتادة في التعامل مع التحديات اليومية."
  },
  {
    "sectionCode": "SECTION_C",
    "languageCode": "ar",
    "name": "القسم C: القدرات المعرفية والإدراكية (Demonstrated Aptitude)",
    "description": "مهام تفاعلية تقيس الاستدلال المنطقي والتحليل الرياضي والتفكير المكاني."
  },
  {
    "sectionCode": "SECTION_D",
    "languageCode": "ar",
    "name": "القسم D: السمات والعادات التطويرية (Developmental Strengths)",
    "description": "استكشاف عادات التعلم والشغف المعرفي والمثابرة والاستقلالية."
  },
  {
    "sectionCode": "SECTION_E",
    "languageCode": "ar",
    "name": "القسم E: جودة وموثوقية الاستجابة (Response Quality & Attention)",
    "description": "أسئلة معيارية تضمن موثوقية وجودة التقييم السيكومتري."
  }
];

export const LIKERT_OPTION_TRANSLATIONS: OptionTranslationSeed[] = [
  {
    "optionKey": "1",
    "languageCode": "ml",
    "optionText": "എനിക്ക് ബാധകമല്ല (Not like me)"
  },
  {
    "optionKey": "2",
    "languageCode": "ml",
    "optionText": "കുറച്ച് ബാധകം (A little like me)"
  },
  {
    "optionKey": "3",
    "languageCode": "ml",
    "optionText": "കൂടുതലും ബാധകം (Mostly like me)"
  },
  {
    "optionKey": "4",
    "languageCode": "ml",
    "optionText": "തികച്ചും ബാധകം (Very much like me)"
  },
  {
    "optionKey": "1",
    "languageCode": "hi",
    "optionText": "बिल्कुल मुझ जैसा नहीं (Not like me)"
  },
  {
    "optionKey": "2",
    "languageCode": "hi",
    "optionText": "थोड़ा मुझ जैसा (A little like me)"
  },
  {
    "optionKey": "3",
    "languageCode": "hi",
    "optionText": "काफी हद तक मुझ जैसा (Mostly like me)"
  },
  {
    "optionKey": "4",
    "languageCode": "hi",
    "optionText": "पूरी तरह मुझ जैसा (Very much like me)"
  },
  {
    "optionKey": "1",
    "languageCode": "ta",
    "optionText": "என்னை போன்றது அல்ல (Not like me)"
  },
  {
    "optionKey": "2",
    "languageCode": "ta",
    "optionText": "சற்று என்னை போன்றது (A little like me)"
  },
  {
    "optionKey": "3",
    "languageCode": "ta",
    "optionText": "பெரும்பாலும் என்னை போன்றது (Mostly like me)"
  },
  {
    "optionKey": "4",
    "languageCode": "ta",
    "optionText": "முற்றிலும் என்னை போன்றது (Very much like me)"
  },
  {
    "optionKey": "1",
    "languageCode": "kn",
    "optionText": "ನನ್ನಂತಲ್ಲ (Not like me)"
  },
  {
    "optionKey": "2",
    "languageCode": "kn",
    "optionText": "ಸ್ವಲ್ಪ ನನ್ನಂತೆ (A little like me)"
  },
  {
    "optionKey": "3",
    "languageCode": "kn",
    "optionText": "ಹೆಚ್ಚಾಗಿ ನನ್ನಂತೆ (Mostly like me)"
  },
  {
    "optionKey": "4",
    "languageCode": "kn",
    "optionText": "ಸಂಪೂರ್ಣವಾಗಿ ನನ್ನಂತೆ (Very much like me)"
  },
  {
    "optionKey": "1",
    "languageCode": "ar",
    "optionText": "لا ينطبق عليّ إطلاقاً (Not like me)"
  },
  {
    "optionKey": "2",
    "languageCode": "ar",
    "optionText": "ينطبق عليّ قليلاً (A little like me)"
  },
  {
    "optionKey": "3",
    "languageCode": "ar",
    "optionText": "ينطبق عليّ غالباً (Mostly like me)"
  },
  {
    "optionKey": "4",
    "languageCode": "ar",
    "optionText": "ينطبق عليّ تماماً (Very much like me)"
  }
];

export const MCQ_OPTION_TRANSLATIONS: McqOptionTranslationSeed[] = [
  {
    "questionNumber": 56,
    "optionKey": "A",
    "languageCode": "ml",
    "optionText": "ചില റിനോകൾ മഞ്ഞയാണ് (Some Rinos are yellow)"
  },
  {
    "questionNumber": 56,
    "optionKey": "B",
    "languageCode": "ml",
    "optionText": "ഒരു റിനോയും മഞ്ഞയല്ല (No Rino is yellow)"
  },
  {
    "questionNumber": 56,
    "optionKey": "C",
    "languageCode": "ml",
    "optionText": "എല്ലാ മഞ്ഞ വസ്തുക്കളും റിനോകളാണ് (All yellow things are Rinos)"
  },
  {
    "questionNumber": 56,
    "optionKey": "D",
    "languageCode": "ml",
    "optionText": "റിനോകളെക്കുറിച്ച് ഒന്നും പറയാൻ കഴിയില്ല (We cannot know anything about Rinos)"
  },
  {
    "questionNumber": 63,
    "optionKey": "A",
    "languageCode": "ml",
    "optionText": "വരയ്ക്കൽ (Drawing)"
  },
  {
    "questionNumber": 63,
    "optionKey": "B",
    "languageCode": "ml",
    "optionText": "ഭക്ഷണം കഴിക്കൽ (Eating)"
  },
  {
    "questionNumber": 63,
    "optionKey": "C",
    "languageCode": "ml",
    "optionText": "ഓട്ടം (Running)"
  },
  {
    "questionNumber": 63,
    "optionKey": "D",
    "languageCode": "ml",
    "optionText": "എഴുത്ത് (Writing)"
  },
  {
    "questionNumber": 64,
    "optionKey": "A",
    "languageCode": "ml",
    "optionText": "അരുൺ മഴയത്ത് കളിച്ചു (Arun played during rain)"
  },
  {
    "questionNumber": 64,
    "optionKey": "B",
    "languageCode": "ml",
    "optionText": "രാത്രിയിൽ കനത്ത മഴ പെയ്തു (Heavy rain happened during the night)"
  },
  {
    "questionNumber": 64,
    "optionKey": "C",
    "languageCode": "ml",
    "optionText": "മൈതാനം എപ്പോഴും നനഞ്ഞിരിക്കും (The field is always wet)"
  },
  {
    "questionNumber": 64,
    "optionKey": "D",
    "languageCode": "ml",
    "optionText": "മത്സരം റദ്ദാക്കി (The match was cancelled)"
  },
  {
    "questionNumber": 65,
    "optionKey": "A",
    "languageCode": "ml",
    "optionText": "തല (Head)"
  },
  {
    "questionNumber": 65,
    "optionKey": "B",
    "languageCode": "ml",
    "optionText": "കൈ (Arm)"
  },
  {
    "questionNumber": 65,
    "optionKey": "C",
    "languageCode": "ml",
    "optionText": "കാൽ (Foot)"
  },
  {
    "questionNumber": 65,
    "optionKey": "D",
    "languageCode": "ml",
    "optionText": "മുട്ട് (Knee)"
  },
  {
    "questionNumber": 66,
    "optionKey": "A",
    "languageCode": "ml",
    "optionText": "മായയ്ക്ക് വായന ഇഷ്ടമല്ല (Maya dislikes reading)"
  },
  {
    "questionNumber": 66,
    "optionKey": "B",
    "languageCode": "ml",
    "optionText": "മായയ്ക്ക് പുസ്തകം നഷ്ടപ്പെട്ടു (Maya lost the book)"
  },
  {
    "questionNumber": 66,
    "optionKey": "C",
    "languageCode": "ml",
    "optionText": "മായ സമയപരിധി കൃത്യമായി പാലിച്ചു (Maya paid attention to the return deadline)"
  },
  {
    "questionNumber": 66,
    "optionKey": "D",
    "languageCode": "ml",
    "optionText": "ലൈബ്രറി വെള്ളിയാഴ്ച അടയ്ക്കും (The library closes on Friday)"
  },
  {
    "questionNumber": 67,
    "optionKey": "A",
    "languageCode": "ml",
    "optionText": "വടക്ക് (North)"
  },
  {
    "questionNumber": 67,
    "optionKey": "B",
    "languageCode": "ml",
    "optionText": "തെക്ക് (South)"
  },
  {
    "questionNumber": 67,
    "optionKey": "C",
    "languageCode": "ml",
    "optionText": "കിഴക്ക് (East)"
  },
  {
    "questionNumber": 67,
    "optionKey": "D",
    "languageCode": "ml",
    "optionText": "പടിഞ്ഞാറ് (West)"
  },
  {
    "questionNumber": 70,
    "optionKey": "A",
    "languageCode": "ml",
    "optionText": "തെക്ക്-പടിഞ്ഞാറ് (South-West)"
  },
  {
    "questionNumber": 70,
    "optionKey": "B",
    "languageCode": "ml",
    "optionText": "വടക്ക്-പടിഞ്ഞാറ് (North-West)"
  },
  {
    "questionNumber": 70,
    "optionKey": "C",
    "languageCode": "ml",
    "optionText": "വടക്ക്-കിഴക്ക് (North-East)"
  },
  {
    "questionNumber": 70,
    "optionKey": "D",
    "languageCode": "ml",
    "optionText": "തെക്ക്-കിഴക്ക് (South-East)"
  },
  {
    "questionNumber": 71,
    "optionKey": "A",
    "languageCode": "ml",
    "optionText": "ബൾബ് ഉടനടി മാറ്റുക (Replace the bulb immediately)"
  },
  {
    "questionNumber": 71,
    "optionKey": "B",
    "languageCode": "ml",
    "optionText": "ബാറ്ററിയും അവയുടെ ക്രമീകരണവും പരിശോധിക്കുക (Check batteries & placement)"
  },
  {
    "questionNumber": 71,
    "optionKey": "C",
    "languageCode": "ml",
    "optionText": "സ്വിച്ച് തുടർച്ചയായി അമർത്തുക (Press switch repeatedly)"
  },
  {
    "questionNumber": 71,
    "optionKey": "D",
    "languageCode": "ml",
    "optionText": "പുറംഭാഗം വൃത്തിയാക്കുക (Clean outside)"
  },
  {
    "questionNumber": 72,
    "optionKey": "A",
    "languageCode": "ml",
    "optionText": "ചെയിൻ പെയിന്റ് ചെയ്യുക (Paint the chain)"
  },
  {
    "questionNumber": 72,
    "optionKey": "B",
    "languageCode": "ml",
    "optionText": "ചെയിൻ ഗിയറിൽ കൃത്യമായി ഇരിക്കുന്നുണ്ടോ എന്നും ലൂസാണോ എന്നും പരിശോധിക്കുക (Check chain tension and gear seating)"
  },
  {
    "questionNumber": 72,
    "optionKey": "C",
    "languageCode": "ml",
    "optionText": "ബ്രേക്കുകൾ നീക്കം ചെയ്യുക (Remove the brakes)"
  },
  {
    "questionNumber": 72,
    "optionKey": "D",
    "languageCode": "ml",
    "optionText": "ചെയിനിൽ വെള്ളമൊഴിക്കുക (Add water to the chain)"
  },
  {
    "questionNumber": 75,
    "optionKey": "A",
    "languageCode": "ml",
    "optionText": "എല്ലാവരോടും ഉടൻ വോട്ട് ചെയ്യാൻ ആവശ്യപ്പെടുക (Ask everyone to vote immediately)"
  },
  {
    "questionNumber": 75,
    "optionKey": "B",
    "languageCode": "ml",
    "optionText": "രണ്ടുപേർക്കും വിശദീകരിക്കാൻ അവസരം നൽകുകയും ലക്ഷ്യവുമായി താരതമ്യം ചെയ്യുകയും ചെയ്യുക (Let both explain and compare with goal)"
  },
  {
    "questionNumber": 75,
    "optionKey": "C",
    "languageCode": "ml",
    "optionText": "ഒരാളോട് ആശയം ഉപേക്ഷിക്കാൻ ആവശ്യപ്പെടുക (Ask one person to give up)"
  },
  {
    "questionNumber": 75,
    "optionKey": "D",
    "languageCode": "ml",
    "optionText": "ചർച്ച ചെയ്യാതെ രണ്ടു ആശയങ്ങളുടെയും ഭാഗങ്ങൾ ഉപയോഗിക്കുക (Use parts of both without discussion)"
  },
  {
    "questionNumber": 76,
    "optionKey": "A",
    "languageCode": "ml",
    "optionText": "വിദ്യാർത്ഥി തനിയെ ഇരിക്കാൻ ആഗ്രഹിക്കുന്നുണ്ടാകും എന്ന് കരുതി അവഗണിക്കുക (Ignore because student may prefer solitude)"
  },
  {
    "questionNumber": 76,
    "optionKey": "B",
    "languageCode": "ml",
    "optionText": "ആ വിദ്യാർത്ഥിയുമായി ഒന്നിച്ച് പ്രവർത്തിക്കാൻ കഴിയില്ലെന്ന് ടീച്ചറോട് പറയുക (Tell teacher group cannot work together)"
  },
  {
    "questionNumber": 76,
    "optionKey": "C",
    "languageCode": "ml",
    "optionText": "ആ വിദ്യാർത്ഥിയെ ഗ്രൂപ്പിലേക്ക് ക്ഷണിക്കുകയും ഏത് ഭാഗം ചെയ്യാനാണ് താല്പര്യമെന്ന് ചോദിക്കുകയും ചെയ്യുക (Invite student & ask preferred part)"
  },
  {
    "questionNumber": 76,
    "optionKey": "D",
    "languageCode": "ml",
    "optionText": "ഏറ്റവും എളുപ്പമുള്ള ജോലികൾ മാത്രം ആ വിദ്യാർത്ഥിക്ക് നൽകുക (Give student only easiest work)"
  },
  {
    "questionNumber": 77,
    "optionKey": "A",
    "languageCode": "ml",
    "optionText": "ഏറ്റവും എളുപ്പമുള്ള ജോലി മാത്രം ആദ്യം ചെയ്യുക (Start only easiest task)"
  },
  {
    "questionNumber": 77,
    "optionKey": "B",
    "languageCode": "ml",
    "optionText": "പ്രാധാന്യവും ലഭ്യമായ സമയവും കണക്കിലെടുത്ത് മുൻഗണന നിശ്ചയിക്കുക (Plan by urgency and available time)"
  },
  {
    "questionNumber": 77,
    "optionKey": "C",
    "languageCode": "ml",
    "optionText": "എല്ലാം നാളത്തേക്ക് മാറ്റിവെക്കുക (Leave everything until tomorrow)"
  },
  {
    "questionNumber": 77,
    "optionKey": "D",
    "languageCode": "ml",
    "optionText": "അടുത്ത ആഴ്ചയിലെ പ്രോജക്റ്റിൽ മാത്രം പ്രവർത്തിക്കുക (Work only on next-week project)"
  },
  {
    "questionNumber": 78,
    "optionKey": "A",
    "languageCode": "ml",
    "optionText": "താല്പര്യമുള്ള വായന ആദ്യം ചെയ്യുക (Do optional reading first)"
  },
  {
    "questionNumber": 78,
    "optionKey": "B",
    "languageCode": "ml",
    "optionText": "60 മിനിറ്റും അസൈൻമെന്റിനായി മാത്രം ചെലവഴിക്കുക (Spend all 60 minutes on assignment)"
  },
  {
    "questionNumber": 78,
    "optionKey": "C",
    "languageCode": "ml",
    "optionText": "നാളത്തേക്കുള്ള റിവിഷൻ ആദ്യം പൂർത്തിയാക്കുക, ബാക്കി സമയത്ത് അസൈൻമെന്റ് ചെയ്യുക (Finish urgent revision, then do assignment)"
  },
  {
    "questionNumber": 78,
    "optionKey": "D",
    "languageCode": "ml",
    "optionText": "സമയം തികയില്ലെന്ന് കരുതി പഠനം മാറ്റിവെക്കുക (Wait because not enough time)"
  }
];

export const DIMENSION_TRANSLATIONS: DimensionTranslationSeed[] = [
  {
    "dimensionCode": "BUILDER_R",
    "languageCode": "ml",
    "name": "ബിൽഡർ / നിർമ്മാണം (Builder - R)"
  },
  {
    "dimensionCode": "BUILDER_R",
    "languageCode": "hi",
    "name": "बिल्डर / निर्माण (Builder - R)"
  },
  {
    "dimensionCode": "BUILDER_R",
    "languageCode": "ta",
    "name": "உருவாக்குநர் (Builder - R)"
  },
  {
    "dimensionCode": "BUILDER_R",
    "languageCode": "kn",
    "name": "ನಿರ್ಮಾಣಕಾರ (Builder - R)"
  },
  {
    "dimensionCode": "BUILDER_R",
    "languageCode": "ar",
    "name": "البنّاء / التطبيقي (Builder - R)"
  },
  {
    "dimensionCode": "EXPLORER_I",
    "languageCode": "ml",
    "name": "എക്സ്പ്ലോറർ / ഗവേഷണം (Explorer - I)"
  },
  {
    "dimensionCode": "EXPLORER_I",
    "languageCode": "hi",
    "name": "अन्वेषक / अनुसंधान (Explorer - I)"
  },
  {
    "dimensionCode": "EXPLORER_I",
    "languageCode": "ta",
    "name": "ஆராய்ச்சியாளர் (Explorer - I)"
  },
  {
    "dimensionCode": "EXPLORER_I",
    "languageCode": "kn",
    "name": "ಅನ್ವೇಷಕ (Explorer - I)"
  },
  {
    "dimensionCode": "EXPLORER_I",
    "languageCode": "ar",
    "name": "المستكشف / البحثي (Explorer - I)"
  },
  {
    "dimensionCode": "CREATOR_A",
    "languageCode": "ml",
    "name": "ക്രിയേറ്റർ / സർഗ്ഗാത്മകം (Creator - A)"
  },
  {
    "dimensionCode": "CREATOR_A",
    "languageCode": "hi",
    "name": "रचनाकार / सृजनात्मक (Creator - A)"
  },
  {
    "dimensionCode": "CREATOR_A",
    "languageCode": "ta",
    "name": "படைப்பாளர் (Creator - A)"
  },
  {
    "dimensionCode": "CREATOR_A",
    "languageCode": "kn",
    "name": "ಸೃಜನಶೀಲ (Creator - A)"
  },
  {
    "dimensionCode": "CREATOR_A",
    "languageCode": "ar",
    "name": "المبتكر / الفني (Creator - A)"
  },
  {
    "dimensionCode": "HELPER_S",
    "languageCode": "ml",
    "name": "ഹെൽപ്പർ / സാമൂഹിക സേവനം (Helper - S)"
  },
  {
    "dimensionCode": "HELPER_S",
    "languageCode": "hi",
    "name": "सहायक / सामाजिक (Helper - S)"
  },
  {
    "dimensionCode": "HELPER_S",
    "languageCode": "ta",
    "name": "உதவியாளர் (Helper - S)"
  },
  {
    "dimensionCode": "HELPER_S",
    "languageCode": "kn",
    "name": "ಸಹಾಯಕ (Helper - S)"
  },
  {
    "dimensionCode": "HELPER_S",
    "languageCode": "ar",
    "name": "المساعد / الاجتماعي (Helper - S)"
  },
  {
    "dimensionCode": "LEADER_E",
    "languageCode": "ml",
    "name": "ലീഡർ / സംരംഭകത്വം (Leader - E)"
  },
  {
    "dimensionCode": "LEADER_E",
    "languageCode": "hi",
    "name": "नेता / उद्यमशीलता (Leader - E)"
  },
  {
    "dimensionCode": "LEADER_E",
    "languageCode": "ta",
    "name": "தலைவர் (Leader - E)"
  },
  {
    "dimensionCode": "LEADER_E",
    "languageCode": "kn",
    "name": "ನಾಯಕ (Leader - E)"
  },
  {
    "dimensionCode": "LEADER_E",
    "languageCode": "ar",
    "name": "القائد / الريادي (Leader - E)"
  },
  {
    "dimensionCode": "ORGANISER_C",
    "languageCode": "ml",
    "name": "ഓർഗനൈസർ / കാര്യനിർവ്വഹണം (Organiser - C)"
  },
  {
    "dimensionCode": "ORGANISER_C",
    "languageCode": "hi",
    "name": "प्रबंधक / व्यवस्थापक (Organiser - C)"
  },
  {
    "dimensionCode": "ORGANISER_C",
    "languageCode": "ta",
    "name": "ஒருங்கிணைப்பாளர் (Organiser - C)"
  },
  {
    "dimensionCode": "ORGANISER_C",
    "languageCode": "kn",
    "name": "ವ್ಯವಸ್ಥಾಪಕ (Organiser - C)"
  },
  {
    "dimensionCode": "ORGANISER_C",
    "languageCode": "ar",
    "name": "المنظم / المنهجي (Organiser - C)"
  },
  {
    "dimensionCode": "LOGICAL_PROBLEM_SOLVING",
    "languageCode": "ml",
    "name": "യുക്തിചിന്ത & പ്രശ്നപരിഹാരം"
  },
  {
    "dimensionCode": "LOGICAL_PROBLEM_SOLVING",
    "languageCode": "hi",
    "name": "तार्किक सोच और समस्या समाधान"
  },
  {
    "dimensionCode": "LOGICAL_PROBLEM_SOLVING",
    "languageCode": "ta",
    "name": "தருக்க சிந்தனை மற்றும் சிக்கல் தீர்வு"
  },
  {
    "dimensionCode": "LOGICAL_PROBLEM_SOLVING",
    "languageCode": "kn",
    "name": "ತಾರ್ಕಿಕ ಚಿಂತನೆ ಮತ್ತು ಸಮಸ್ಯೆ ಪರಿಹಾರ"
  },
  {
    "dimensionCode": "LOGICAL_PROBLEM_SOLVING",
    "languageCode": "ar",
    "name": "التفكير المنطقي وحل المشكلات"
  },
  {
    "dimensionCode": "COMMUNICATION",
    "languageCode": "ml",
    "name": "ആശയവിനിമയം & പ്രകടനം"
  },
  {
    "dimensionCode": "COMMUNICATION",
    "languageCode": "hi",
    "name": "संचार एवं अभिव्यक्ति"
  },
  {
    "dimensionCode": "COMMUNICATION",
    "languageCode": "ta",
    "name": "தொடர்பு மற்றும் வெளிப்பாடு"
  },
  {
    "dimensionCode": "COMMUNICATION",
    "languageCode": "kn",
    "name": "ಸಂವಹನ ಮತ್ತು ಅಭಿವ್ಯಕ್ತಿ"
  },
  {
    "dimensionCode": "COMMUNICATION",
    "languageCode": "ar",
    "name": "التواصل والتعبير الفعّال"
  },
  {
    "dimensionCode": "CREATIVE_THINKING",
    "languageCode": "ml",
    "name": "സർഗ്ഗാത്മക ചിന്ത"
  },
  {
    "dimensionCode": "CREATIVE_THINKING",
    "languageCode": "hi",
    "name": "रचनात्मक सोच"
  },
  {
    "dimensionCode": "CREATIVE_THINKING",
    "languageCode": "ta",
    "name": "படைப்பு சிந்தனை"
  },
  {
    "dimensionCode": "CREATIVE_THINKING",
    "languageCode": "kn",
    "name": "ಸೃಜನಶೀಲ ಚಿಂತನೆ"
  },
  {
    "dimensionCode": "CREATIVE_THINKING",
    "languageCode": "ar",
    "name": "التفكير الإبداعي والابتكاري"
  },
  {
    "dimensionCode": "VISUAL_SPATIAL_THINKING",
    "languageCode": "ml",
    "name": "വിഷ്വൽ-സ്പേഷ്യൽ ചിന്ത"
  },
  {
    "dimensionCode": "VISUAL_SPATIAL_THINKING",
    "languageCode": "hi",
    "name": "दृश्य-स्थानिक सोच"
  },
  {
    "dimensionCode": "VISUAL_SPATIAL_THINKING",
    "languageCode": "ta",
    "name": "காட்சி-வெளிசார் சிந்தனை"
  },
  {
    "dimensionCode": "VISUAL_SPATIAL_THINKING",
    "languageCode": "kn",
    "name": "ದೃಶ್ಯ-ಸ್ಥಳೀಯ ಚಿಂತನೆ"
  },
  {
    "dimensionCode": "VISUAL_SPATIAL_THINKING",
    "languageCode": "ar",
    "name": "التفكير البصري والمكاني"
  },
  {
    "dimensionCode": "PRACTICAL_TECHNICAL_SKILL",
    "languageCode": "ml",
    "name": "പ്രായോഗിക സാങ്കേതിക നൈപുണ്യം"
  },
  {
    "dimensionCode": "PRACTICAL_TECHNICAL_SKILL",
    "languageCode": "hi",
    "name": "व्यावहारिक तकनीकी कौशल"
  },
  {
    "dimensionCode": "PRACTICAL_TECHNICAL_SKILL",
    "languageCode": "ta",
    "name": "நடைமுறை தொழில்நுட்ப திறன்"
  },
  {
    "dimensionCode": "PRACTICAL_TECHNICAL_SKILL",
    "languageCode": "kn",
    "name": "ಪ್ರಾಯೋಗಿಕ ತಾಂತ್ರಿಕ ಕೌಶಲ್ಯ"
  },
  {
    "dimensionCode": "PRACTICAL_TECHNICAL_SKILL",
    "languageCode": "ar",
    "name": "المهارات العملية والتقنية"
  },
  {
    "dimensionCode": "SOCIAL_TEAMWORK",
    "languageCode": "ml",
    "name": "സാമൂഹിക ഒത്തൊരുമ & ടീംവർക്ക്"
  },
  {
    "dimensionCode": "SOCIAL_TEAMWORK",
    "languageCode": "hi",
    "name": "सामाजिक सहयोग एवं टीमवर्क"
  },
  {
    "dimensionCode": "SOCIAL_TEAMWORK",
    "languageCode": "ta",
    "name": "சமூக ஒத்துழைப்பு மற்றும் குழுப்பணி"
  },
  {
    "dimensionCode": "SOCIAL_TEAMWORK",
    "languageCode": "kn",
    "name": "ಸಾಮಾಜಿಕ ಸಹಯೋಗ ಮತ್ತು ತಂಡದ ಕೆಲಸ"
  },
  {
    "dimensionCode": "SOCIAL_TEAMWORK",
    "languageCode": "ar",
    "name": "التفاعل الاجتماعي والعمل الجماعي"
  },
  {
    "dimensionCode": "LEADERSHIP_INITIATIVE",
    "languageCode": "ml",
    "name": "നേതൃത്വം & മുൻകൈയെടുക്കൽ"
  },
  {
    "dimensionCode": "LEADERSHIP_INITIATIVE",
    "languageCode": "hi",
    "name": "नेतृत्व एवं पहल"
  },
  {
    "dimensionCode": "LEADERSHIP_INITIATIVE",
    "languageCode": "ta",
    "name": "தலைமைத்துவம் மற்றும் முன்முயற்சி"
  },
  {
    "dimensionCode": "LEADERSHIP_INITIATIVE",
    "languageCode": "kn",
    "name": "ನಾಯಕತ್ವ ಮತ್ತು ಉಪಕ್ರಮ"
  },
  {
    "dimensionCode": "LEADERSHIP_INITIATIVE",
    "languageCode": "ar",
    "name": "القيادة والمبادرة الذاتية"
  },
  {
    "dimensionCode": "SELF_MANAGEMENT",
    "languageCode": "ml",
    "name": "ആത്മനിയന്ത്രണം & ചിട്ട"
  },
  {
    "dimensionCode": "SELF_MANAGEMENT",
    "languageCode": "hi",
    "name": "आत्म-प्रबंधन एवं एकाग्रता"
  },
  {
    "dimensionCode": "SELF_MANAGEMENT",
    "languageCode": "ta",
    "name": "சுய மேலாண்மை மற்றும் கவனம்"
  },
  {
    "dimensionCode": "SELF_MANAGEMENT",
    "languageCode": "kn",
    "name": "ಸ್ವಯಂ ನಿರ್ವಹಣೆ ಮತ್ತು ಏಕಾಗ್ರತೆ"
  },
  {
    "dimensionCode": "SELF_MANAGEMENT",
    "languageCode": "ar",
    "name": "إدارة الذات والتركيز"
  },
  {
    "dimensionCode": "PATTERN_LOGIC",
    "languageCode": "ml",
    "name": "പാറ്റേൺ & ലോജിക്"
  },
  {
    "dimensionCode": "PATTERN_LOGIC",
    "languageCode": "hi",
    "name": "पैटर्न एवं तर्कशक्ति"
  },
  {
    "dimensionCode": "PATTERN_LOGIC",
    "languageCode": "ta",
    "name": "வடிவமைப்பு மற்றும் தருக்கம்"
  },
  {
    "dimensionCode": "PATTERN_LOGIC",
    "languageCode": "kn",
    "name": "ಮಾದರಿ ಮತ್ತು ತರ್ಕ"
  },
  {
    "dimensionCode": "PATTERN_LOGIC",
    "languageCode": "ar",
    "name": "الأنماط والاستدلال المنطقي"
  },
  {
    "dimensionCode": "NUMERICAL_REASONING",
    "languageCode": "ml",
    "name": "ഗണിത വിശകലനം"
  },
  {
    "dimensionCode": "NUMERICAL_REASONING",
    "languageCode": "hi",
    "name": "संख्यात्मक तर्क"
  },
  {
    "dimensionCode": "NUMERICAL_REASONING",
    "languageCode": "ta",
    "name": "எண் கணித பகுப்பாய்வு"
  },
  {
    "dimensionCode": "NUMERICAL_REASONING",
    "languageCode": "kn",
    "name": "ಸಂಖ್ಯಾತ್ಮಕ ತಾರ್ಕಿಕತೆ"
  },
  {
    "dimensionCode": "NUMERICAL_REASONING",
    "languageCode": "ar",
    "name": "الاستدلال الحسابي والرقمي"
  },
  {
    "dimensionCode": "VERBAL_REASONING",
    "languageCode": "ml",
    "name": "ഭാഷാപരമായ യുക്തിചിന്ത"
  },
  {
    "dimensionCode": "VERBAL_REASONING",
    "languageCode": "hi",
    "name": "मौखिक तर्कशक्ति"
  },
  {
    "dimensionCode": "VERBAL_REASONING",
    "languageCode": "ta",
    "name": "மொழிசார் தருக்கம்"
  },
  {
    "dimensionCode": "VERBAL_REASONING",
    "languageCode": "kn",
    "name": "ಮೌಖಿಕ ತಾರ್ಕಿಕತೆ"
  },
  {
    "dimensionCode": "VERBAL_REASONING",
    "languageCode": "ar",
    "name": "الاستدلال اللغوي واللفظي"
  },
  {
    "dimensionCode": "SPATIAL_REASONING",
    "languageCode": "ml",
    "name": "സ്പേഷ്യൽ റീസണിംഗ്"
  },
  {
    "dimensionCode": "SPATIAL_REASONING",
    "languageCode": "hi",
    "name": "स्थानिक समझ एवं घूर्णन"
  },
  {
    "dimensionCode": "SPATIAL_REASONING",
    "languageCode": "ta",
    "name": "வெளிசார் பகுப்பாய்வு"
  },
  {
    "dimensionCode": "SPATIAL_REASONING",
    "languageCode": "kn",
    "name": "ಸ್ಥಳೀಯ ತಾರ್ಕಿಕತೆ"
  },
  {
    "dimensionCode": "SPATIAL_REASONING",
    "languageCode": "ar",
    "name": "التفكير والتصور المكاني"
  },
  {
    "dimensionCode": "PRACTICAL_PROBLEM_SOLVING",
    "languageCode": "ml",
    "name": "പ്രായോഗിക പ്രശ്നപരിഹാരം"
  },
  {
    "dimensionCode": "PRACTICAL_PROBLEM_SOLVING",
    "languageCode": "hi",
    "name": "व्यावहारिक समस्या समाधान"
  },
  {
    "dimensionCode": "PRACTICAL_PROBLEM_SOLVING",
    "languageCode": "ta",
    "name": "நடைமுறை சிக்கல் தீர்வு"
  },
  {
    "dimensionCode": "PRACTICAL_PROBLEM_SOLVING",
    "languageCode": "kn",
    "name": "ಪ್ರಾಯೋಗಿಕ ಸಮಸ್ಯೆ ನಿವಾರಣೆ"
  },
  {
    "dimensionCode": "PRACTICAL_PROBLEM_SOLVING",
    "languageCode": "ar",
    "name": "حل المشكلات العملية والفنية"
  },
  {
    "dimensionCode": "SOCIAL_JUDGMENT",
    "languageCode": "ml",
    "name": "സാമൂഹിക വിവേചനാധികാരം"
  },
  {
    "dimensionCode": "SOCIAL_JUDGMENT",
    "languageCode": "hi",
    "name": "सामाजिक निर्णय क्षमता"
  },
  {
    "dimensionCode": "SOCIAL_JUDGMENT",
    "languageCode": "ta",
    "name": "சமூக முடிவெடுக்கும் திறன்"
  },
  {
    "dimensionCode": "SOCIAL_JUDGMENT",
    "languageCode": "kn",
    "name": "ಸಾಮಾಜಿಕ ನಿರ್ಣಯ"
  },
  {
    "dimensionCode": "SOCIAL_JUDGMENT",
    "languageCode": "ar",
    "name": "الحكمة والتقدير الاجتماعي"
  },
  {
    "dimensionCode": "PLANNING",
    "languageCode": "ml",
    "name": "ആസൂത്രണം & സമയക്രമം"
  },
  {
    "dimensionCode": "PLANNING",
    "languageCode": "hi",
    "name": "योजना एवं समय प्रबंधन"
  },
  {
    "dimensionCode": "PLANNING",
    "languageCode": "ta",
    "name": "திட்டமிடல் மற்றும் மதிப்பீடு"
  },
  {
    "dimensionCode": "PLANNING",
    "languageCode": "kn",
    "name": "ಯೋಜನೆ ಮತ್ತು ಸಮಯ ನಿರ್ವಹಣೆ"
  },
  {
    "dimensionCode": "PLANNING",
    "languageCode": "ar",
    "name": "التخطيط والتقدير الزمني"
  },
  {
    "dimensionCode": "CURIOSITY",
    "languageCode": "ml",
    "name": "ജിജ്ഞാസ & അന്വേഷണ താല്പര്യം"
  },
  {
    "dimensionCode": "CURIOSITY",
    "languageCode": "hi",
    "name": "जिज्ञासा एवं खोज प्रवृत्ति"
  },
  {
    "dimensionCode": "CURIOSITY",
    "languageCode": "ta",
    "name": "ஆர்வமும் தேடலும்"
  },
  {
    "dimensionCode": "CURIOSITY",
    "languageCode": "kn",
    "name": "ಕುತೂಹಲ ಮತ್ತು ವಿಚಾರಣೆ"
  },
  {
    "dimensionCode": "CURIOSITY",
    "languageCode": "ar",
    "name": "الفضول والشغف المعرفي"
  },
  {
    "dimensionCode": "PERSISTENCE",
    "languageCode": "ml",
    "name": "സ്ഥിരോത്സാഹം & പരിശ്രമം"
  },
  {
    "dimensionCode": "PERSISTENCE",
    "languageCode": "hi",
    "name": "दृढ़ता एवं निरंतर प्रयास"
  },
  {
    "dimensionCode": "PERSISTENCE",
    "languageCode": "ta",
    "name": "விடாமுயற்சி"
  },
  {
    "dimensionCode": "PERSISTENCE",
    "languageCode": "kn",
    "name": "ಸ್ಥಿರತೆ ಮತ್ತು ಪರಿಶ್ರಮ"
  },
  {
    "dimensionCode": "PERSISTENCE",
    "languageCode": "ar",
    "name": "المثابرة والإصرار"
  },
  {
    "dimensionCode": "ADAPTABILITY",
    "languageCode": "ml",
    "name": "പൊരുത്തപ്പെടാനുള്ള കഴിവ്"
  },
  {
    "dimensionCode": "ADAPTABILITY",
    "languageCode": "hi",
    "name": "अनुकूलनशीलता"
  },
  {
    "dimensionCode": "ADAPTABILITY",
    "languageCode": "ta",
    "name": "மாற்றங்களை ஏற்கும் திறன்"
  },
  {
    "dimensionCode": "ADAPTABILITY",
    "languageCode": "kn",
    "name": "ಹೊಂದಾಣಿಕೆಯ ಸಾಮರ್ಥ್ಯ"
  },
  {
    "dimensionCode": "ADAPTABILITY",
    "languageCode": "ar",
    "name": "المرونة والتكيف السريع"
  },
  {
    "dimensionCode": "INITIATIVE",
    "languageCode": "ml",
    "name": "സ്വയം മുൻകൈയെടുക്കൽ"
  },
  {
    "dimensionCode": "INITIATIVE",
    "languageCode": "hi",
    "name": "स्वतः पहल"
  },
  {
    "dimensionCode": "INITIATIVE",
    "languageCode": "ta",
    "name": "சுய முன்முயற்சி"
  },
  {
    "dimensionCode": "INITIATIVE",
    "languageCode": "kn",
    "name": "ಸ್ವಯಂ ಉಪಕ್ರಮ"
  },
  {
    "dimensionCode": "INITIATIVE",
    "languageCode": "ar",
    "name": "المبادرة والدافع الذاتي"
  },
  {
    "dimensionCode": "COLLABORATION",
    "languageCode": "ml",
    "name": "കൂട്ടായ സഹകരണം"
  },
  {
    "dimensionCode": "COLLABORATION",
    "languageCode": "hi",
    "name": "सहयोगात्मक कार्य"
  },
  {
    "dimensionCode": "COLLABORATION",
    "languageCode": "ta",
    "name": "கூட்டு ஒத்துழைப்பு"
  },
  {
    "dimensionCode": "COLLABORATION",
    "languageCode": "kn",
    "name": "ಸಹಯೋಗ"
  },
  {
    "dimensionCode": "COLLABORATION",
    "languageCode": "ar",
    "name": "التعاون والشراكة"
  },
  {
    "dimensionCode": "ATTENTION_TO_DETAIL",
    "languageCode": "ml",
    "name": "സൂക്ഷ്മ കാര്യങ്ങളിലെ ശ്രദ്ധ"
  },
  {
    "dimensionCode": "ATTENTION_TO_DETAIL",
    "languageCode": "hi",
    "name": "सूक्ष्म विवरणों पर ध्यान"
  },
  {
    "dimensionCode": "ATTENTION_TO_DETAIL",
    "languageCode": "ta",
    "name": "நுட்பமான கவனம்"
  },
  {
    "dimensionCode": "ATTENTION_TO_DETAIL",
    "languageCode": "kn",
    "name": "ಸೂಕ್ಷ್ಮ ವಿವರಗಳ ಗಮನ"
  },
  {
    "dimensionCode": "ATTENTION_TO_DETAIL",
    "languageCode": "ar",
    "name": "الدقة والاهتمام بالتفاصيل"
  },
  {
    "dimensionCode": "LEARNING_INDEPENDENCE",
    "languageCode": "ml",
    "name": "സ്വയം പഠന ശേഷി"
  },
  {
    "dimensionCode": "LEARNING_INDEPENDENCE",
    "languageCode": "hi",
    "name": "स्वायत्त शिक्षण क्षमता"
  },
  {
    "dimensionCode": "LEARNING_INDEPENDENCE",
    "languageCode": "ta",
    "name": "சுயாதீன கற்றல்"
  },
  {
    "dimensionCode": "LEARNING_INDEPENDENCE",
    "languageCode": "kn",
    "name": "ಸ್ವತಂತ್ರ ಕಲಿಕೆ"
  },
  {
    "dimensionCode": "LEARNING_INDEPENDENCE",
    "languageCode": "ar",
    "name": "الاستقلالية في التعلّم"
  },
  {
    "dimensionCode": "CONSISTENCY_LEADERSHIP",
    "languageCode": "ml",
    "name": "സ്ഥിരത — നേതൃത്വം"
  },
  {
    "dimensionCode": "CONSISTENCY_LEADERSHIP",
    "languageCode": "hi",
    "name": "निरंतरता — नेतृत्व"
  },
  {
    "dimensionCode": "CONSISTENCY_LEADERSHIP",
    "languageCode": "ta",
    "name": "நிலையான தலைமைத்துவம்"
  },
  {
    "dimensionCode": "CONSISTENCY_LEADERSHIP",
    "languageCode": "kn",
    "name": "ಸ್ಥಿರತೆ — ನಾಯಕತ್ವ"
  },
  {
    "dimensionCode": "CONSISTENCY_LEADERSHIP",
    "languageCode": "ar",
    "name": "الموثوقية — القيادة"
  },
  {
    "dimensionCode": "CONSISTENCY_PERSISTENCE",
    "languageCode": "ml",
    "name": "സ്ഥിരത — പരിശ്രമം"
  },
  {
    "dimensionCode": "CONSISTENCY_PERSISTENCE",
    "languageCode": "hi",
    "name": "निरंतरता — दृढ़ता"
  },
  {
    "dimensionCode": "CONSISTENCY_PERSISTENCE",
    "languageCode": "ta",
    "name": "நிலையான விடாமுயற்சி"
  },
  {
    "dimensionCode": "CONSISTENCY_PERSISTENCE",
    "languageCode": "kn",
    "name": "ಸ್ಥಿರತೆ — ಪರಿಶ್ರಮ"
  },
  {
    "dimensionCode": "CONSISTENCY_PERSISTENCE",
    "languageCode": "ar",
    "name": "الموثوقية — المثابرة"
  },
  {
    "dimensionCode": "CONSISTENCY_EXPLORER",
    "languageCode": "ml",
    "name": "സ്ഥിരത — ഗവേഷണം"
  },
  {
    "dimensionCode": "CONSISTENCY_EXPLORER",
    "languageCode": "hi",
    "name": "निरंतरता — अन्वेषण"
  },
  {
    "dimensionCode": "CONSISTENCY_EXPLORER",
    "languageCode": "ta",
    "name": "நிலையான ஆராய்ச்சி"
  },
  {
    "dimensionCode": "CONSISTENCY_EXPLORER",
    "languageCode": "kn",
    "name": "ಸ್ಥಿರತೆ — ಅನ್ವೇಷಣೆ"
  },
  {
    "dimensionCode": "CONSISTENCY_EXPLORER",
    "languageCode": "ar",
    "name": "الموثوقية — الاستكشاف"
  },
  {
    "dimensionCode": "CONSISTENCY_PLANNING",
    "languageCode": "ml",
    "name": "സ്ഥിരത — ആസൂത്രണം"
  },
  {
    "dimensionCode": "CONSISTENCY_PLANNING",
    "languageCode": "hi",
    "name": "निरंतरता — योजना"
  },
  {
    "dimensionCode": "CONSISTENCY_PLANNING",
    "languageCode": "ta",
    "name": "நிலையான திட்டமிடல்"
  },
  {
    "dimensionCode": "CONSISTENCY_PLANNING",
    "languageCode": "kn",
    "name": "ಸ್ಥಿರತೆ — ಯೋಜನೆ"
  },
  {
    "dimensionCode": "CONSISTENCY_PLANNING",
    "languageCode": "ar",
    "name": "الموثوقية — التخطيط"
  },
  {
    "dimensionCode": "ATTENTION_CHECK",
    "languageCode": "ml",
    "name": "ശ്രദ്ധ പരിശോധന"
  },
  {
    "dimensionCode": "ATTENTION_CHECK",
    "languageCode": "hi",
    "name": "ध्यान जाँच"
  },
  {
    "dimensionCode": "ATTENTION_CHECK",
    "languageCode": "ta",
    "name": "கவனச் சோதனை"
  },
  {
    "dimensionCode": "ATTENTION_CHECK",
    "languageCode": "kn",
    "name": "ಗಮನ ಪರೀಕ್ಷೆ"
  },
  {
    "dimensionCode": "ATTENTION_CHECK",
    "languageCode": "ar",
    "name": "فحص الانتباه والدقة"
  }
];

export const QUESTION_TRANSLATIONS: QuestionTranslationSeed[] = [
  {
    "questionNumber": 1,
    "languageCode": "ml",
    "questionText": "വസ്തുക്കൾ നിർമ്മിക്കാനും, കൂട്ടിച്ചേർക്കാനും, കേടുപാടുകൾ തീർക്കാനും എനിക്ക് ഇഷ്ടമാണ്."
  },
  {
    "questionNumber": 1,
    "languageCode": "hi",
    "questionText": "मुझे मशीनों और उपकरणों को खोलकर यह देखना पसंद है कि वे कैसे काम करते हैं।"
  },
  {
    "questionNumber": 1,
    "languageCode": "ta",
    "questionText": "இயந்திரங்கள் மற்றும் பாகங்கள் எவ்வாறு இயங்குகின்றன என்பதைப் பிரித்துப் பார்க்க நான் விரும்புகிறேன்."
  },
  {
    "questionNumber": 1,
    "languageCode": "kn",
    "questionText": "ಯಂತ್ರಗಳು ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತವೆ ಎಂದು ಬಿಡಿಸಿ ನೋಡಲು ನಾನು ಇಷ್ಟಪಡುತ್ತೇನೆ."
  },
  {
    "questionNumber": 1,
    "languageCode": "ar",
    "questionText": "أستمتع بتفكيك الأجهزة الميكانيكية والقطع لفهم كيفية عملها بالتفصيل."
  },
  {
    "questionNumber": 2,
    "languageCode": "ml",
    "questionText": "കാര്യങ്ങൾ എന്തുകൊണ്ട് സംഭവിക്കുന്നു എന്നും അവ എങ്ങനെ പ്രവർത്തിക്കുന്നു എന്നും അറിയാൻ ഞാൻ ഇഷ്ടപ്പെടുന്നു."
  },
  {
    "questionNumber": 2,
    "languageCode": "hi",
    "questionText": "मुझे चीज़ों के पीछे के कारणों को गहराई से जानने और प्रयोग करने में रुचि है।"
  },
  {
    "questionNumber": 2,
    "languageCode": "ta",
    "questionText": "விஷயங்கள் ஏன் நிகழ்கின்றன என்பதை ஆராய்ந்து சோதனைகள் செய்ய விரும்புகிறேன்."
  },
  {
    "questionNumber": 2,
    "languageCode": "kn",
    "questionText": "ವಿಷಯಗಳು ಏಕೆ ಸಂಭವಿಸುತ್ತವೆ ಎಂದು ತಿಳಿಯಲು ಮತ್ತು ಪ್ರಯೋಗ ಮಾಡಲು ನಾನು ಉತ್ಸುಕನಾಗಿದ್ದೇನೆ."
  },
  {
    "questionNumber": 2,
    "languageCode": "ar",
    "questionText": "أحب إجراء التجارب واستكشاف الأسباب العلمية وراء حدوث الظواهر المختلفة."
  },
  {
    "questionNumber": 3,
    "languageCode": "ml",
    "questionText": "ചിത്രങ്ങൾ വരയ്ക്കാനും, പുതിയ ഡിസൈനുകൾ ഉണ്ടാക്കാനും, സ്വന്തം ആശയങ്ങൾ സൃഷ്ടിക്കാനും ഞാൻ ഇഷ്ടപ്പെടുന്നു."
  },
  {
    "questionNumber": 3,
    "languageCode": "hi",
    "questionText": "मुझे चित्रकारी, नई कहानियाँ गढ़ने और अपनी रचनात्मक सोच को व्यक्त करने में आनंद आता है।"
  },
  {
    "questionNumber": 3,
    "languageCode": "ta",
    "questionText": "வரைபடங்கள் வரையவும் புதிய வடிவங்களை உருவாக்கவும் நான் விரும்புகிறேன்."
  },
  {
    "questionNumber": 3,
    "languageCode": "kn",
    "questionText": "ಚಿತ್ರಗಳನ್ನು ಬಿಡಿಸಲು ಮತ್ತು ಹೊಸ ಆಲೋಚನೆಗಳನ್ನು ಸೃಷ್ಟಿಸಲು ನಾನು ಆನಂದಿಸುತ್ತೇನೆ."
  },
  {
    "questionNumber": 3,
    "languageCode": "ar",
    "questionText": "أستمتع بالرسم وتصميم الأفكار الإبداعية والتعبير عن خيالي بحرية."
  },
  {
    "questionNumber": 4,
    "languageCode": "ml",
    "questionText": "ബുദ്ധിമുട്ട് അനുഭവിക്കുന്ന ഒരാളെ സഹായിക്കാൻ എനിക്ക് സന്തോഷമാണ്."
  },
  {
    "questionNumber": 4,
    "languageCode": "hi",
    "questionText": "मुझे दूसरों की मदद करना और उन्हें नई बातें सिखाना बहुत अच्छा लगता है।"
  },
  {
    "questionNumber": 4,
    "languageCode": "ta",
    "questionText": "மற்றவர்களுக்கு உதவி செய்யவும் அவர்களுக்குக் கற்பிக்கவும் நான் எப்போதும் தயாராக உள்ளேன்."
  },
  {
    "questionNumber": 4,
    "languageCode": "kn",
    "questionText": "ಇತರರಿಗೆ ಸಹಾಯ ಮಾಡಲು ಮತ್ತು ವಿಷಯಗಳನ್ನು ವಿವರಿಸಲು ನಾನು ಸದಾ ಸಿದ್ಧ."
  },
  {
    "questionNumber": 4,
    "languageCode": "ar",
    "questionText": "أشعر بالسعادة عند مساعدة الآخرين وشرح الدروس والمفاهيم لهم."
  },
  {
    "questionNumber": 5,
    "languageCode": "ml",
    "questionText": "ഒരു ഗ്രൂപ്പിൽ ഒരുമിച്ച് തീരുമാനമെടുക്കേണ്ടി വരുമ്പോൾ നേതൃത്വം നൽകാൻ ഞാൻ ഇഷ്ടപ്പെടുന്നു."
  },
  {
    "questionNumber": 5,
    "languageCode": "hi",
    "questionText": "मुझे समूह का नेतृत्व करने और महत्वपूर्ण निर्णय लेने में आत्मविश्वास महसूस होता है।"
  },
  {
    "questionNumber": 5,
    "languageCode": "ta",
    "questionText": "குழுவை வழிநடத்தவும் புதிய முடிவுகளை எடுக்கவும் எனக்கு நம்பிக்கை உண்டு."
  },
  {
    "questionNumber": 5,
    "languageCode": "kn",
    "questionText": "ತಂಡವನ್ನು ಮುನ್ನಡೆಸಲು ಮತ್ತು ನಿರ್ಧಾರಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳಲು ನನಗೆ ಆತ್ಮವಿಶ್ವಾಸವಿದೆ."
  },
  {
    "questionNumber": 5,
    "languageCode": "ar",
    "questionText": "أتحلى بالثقة في قيادة فرق العمل وتنظيم المشاريع والتحدث أمام الجمهور."
  },
  {
    "questionNumber": 6,
    "languageCode": "ml",
    "questionText": "കാര്യങ്ങൾ അടുക്കോടും ചിട്ടയോടും കൂടി സൂക്ഷിക്കാൻ എനിക്ക് ഇഷ്ടമാണ്."
  },
  {
    "questionNumber": 6,
    "languageCode": "hi",
    "questionText": "मैं अपनी पुस्तकों और दैनिक समय-सारणी को व्यवस्थित रखना पसंद करता हूँ।"
  },
  {
    "questionNumber": 6,
    "languageCode": "ta",
    "questionText": "எனது புத்தகங்களையும் பணிகளையும் திட்டமிட்டு ஒழுங்காக வைத்திருக்க விரும்புகிறேன்."
  },
  {
    "questionNumber": 6,
    "languageCode": "kn",
    "questionText": "ನನ್ನ ಪುಸ್ತಕಗಳನ್ನು ಮತ್ತು ಕೆಲಸಗಳನ್ನು ಕ್ರಮಬದ್ಧವಾಗಿ ಇಡಲು ನಾನು ಇಷ್ಟಪಡುತ್ತೇನೆ."
  },
  {
    "questionNumber": 6,
    "languageCode": "ar",
    "questionText": "أهتم بتنظيم جداولي وكتبي وملفاتي بدقة وترتيب واضح."
  },
  {
    "questionNumber": 7,
    "languageCode": "ml",
    "questionText": "ടൂളുകളും ഉപകരണങ്ങളും ഉപയോഗിച്ച് എന്തെങ്കിലും നിർമ്മിക്കുന്നത് എനിക്ക് താല്പര്യമുള്ള കാര്യമാണ്."
  },
  {
    "questionNumber": 7,
    "languageCode": "hi",
    "questionText": "मुझे औज़ारों की सहायता से मॉडल और प्रोजेक्ट्स बनाना बहुत पसंद है।"
  },
  {
    "questionNumber": 7,
    "languageCode": "ta",
    "questionText": "கருவிகளைப் பயன்படுத்தி புதிய பொருட்களை உருவாக்க நான் விரும்புகிறேன்."
  },
  {
    "questionNumber": 7,
    "languageCode": "kn",
    "questionText": "ಉಪಕರಣಗಳನ್ನು ಬಳಸಿ ಹೊಸ ಮಾದರಿಗಳನ್ನು ತಯಾರಿಸಲು ನನಗೆ ಆಸಕ್ತಿ ಇದೆ."
  },
  {
    "questionNumber": 7,
    "languageCode": "ar",
    "questionText": "أستمتع باستخدام الأدوات والمعدات لابتكار وصنع أشياء ملموسة."
  },
  {
    "questionNumber": 8,
    "languageCode": "ml",
    "questionText": "പരീക്ഷണങ്ങൾ ചെയ്യാനും പുതിയ ഉത്തരങ്ങൾ കണ്ടെത്താനും എനിക്ക് വലിയ താല്പര്യമാണ്."
  },
  {
    "questionNumber": 8,
    "languageCode": "hi",
    "questionText": "मुझे विज्ञान की नई खोजों और तथ्यों के बारे में पढ़ना रोमांचक लगता है।"
  },
  {
    "questionNumber": 8,
    "languageCode": "ta",
    "questionText": "அறிவியல் கண்டுபிடிப்புகள் மற்றும் சோதனைகளைப் பற்றி அறிய விரும்புகிறேன்."
  },
  {
    "questionNumber": 8,
    "languageCode": "kn",
    "questionText": "ವೈಜ್ಞಾನಿಕ ಆವಿಷ್ಕಾರಗಳು ಮತ್ತು ಹೊಸ ಉತ್ತರಗಳನ್ನು ಹುಡುಕುವುದು ನನಗೆ ಇಷ್ಟ."
  },
  {
    "questionNumber": 8,
    "languageCode": "ar",
    "questionText": "أحب الاكتشافات العلمية والبحث عن إجابات للتساؤلات المعقدة."
  },
  {
    "questionNumber": 9,
    "languageCode": "ml",
    "questionText": "പുതിയ ഡിസൈനുകളും കഥകളും ആശയങ്ങളും ഭാവനയിൽ സൃഷ്ടിക്കാൻ ഞാൻ ആഗ്രഹിക്കുന്നു."
  },
  {
    "questionNumber": 9,
    "languageCode": "hi",
    "questionText": "मुझे नए डिज़ाइन, कहानियाँ, पात्र और विचार गढ़ने में आनंद आता है।"
  },
  {
    "questionNumber": 9,
    "languageCode": "ta",
    "questionText": "புதிய கதைகள் மற்றும் கற்பனை யோசனைகளை உருவாக்க நான் விரும்புகிறேன்."
  },
  {
    "questionNumber": 9,
    "languageCode": "kn",
    "questionText": "ಹೊಸ ಕಥೆಗಳು, ವಿನ್ಯಾಸಗಳು ಮತ್ತು ಆಲೋಚನೆಗಳನ್ನು ಕಲ್ಪಿಸಲು ನಾನು ಇಷ್ಟಪಡುತ್ತೇನೆ."
  },
  {
    "questionNumber": 9,
    "languageCode": "ar",
    "questionText": "أستمتع بابتكار تصاميم وقصص وشخصيات وأفكار جديدة ومبتكرة."
  },
  {
    "questionNumber": 10,
    "languageCode": "ml",
    "questionText": "മറ്റൊരാൾക്ക് മനസ്സിലാകുന്ന രീതിയിൽ കാര്യങ്ങൾ ലളിതമായി വിശദീകരിച്ചു കൊടുക്കാൻ എനിക്ക് സന്തോഷമാണ്."
  },
  {
    "questionNumber": 10,
    "languageCode": "hi",
    "questionText": "मुझे दूसरों को इस तरह समझाना अच्छा लगता है कि उन्हें बात आसानी से समझ आ जाए।"
  },
  {
    "questionNumber": 10,
    "languageCode": "ta",
    "questionText": "மற்றவர்களுக்குப் புரியும் வகையில் எளிய முறையில் விளக்கிக் கூற விரும்புகிறேன்."
  },
  {
    "questionNumber": 10,
    "languageCode": "kn",
    "questionText": "ಇತರರಿಗೆ ಅರ್ಥವಾಗುವಂತೆ ಸರಳವಾಗಿ ವಿವರಿಸಲು ನಾನು ಸಂತೋಷಪಡುತ್ತೇನೆ."
  },
  {
    "questionNumber": 10,
    "languageCode": "ar",
    "questionText": "أحب تبسيط المفاهيم الصعبة وشرحها للآخرين بوضوح."
  },
  {
    "questionNumber": 11,
    "languageCode": "ml",
    "questionText": "എന്റെ ആശയങ്ങൾ മറ്റുള്ളവർക്ക് മുന്നിൽ അവതരിപ്പിക്കാനും അവരെ പ്രോത്സാഹിപ്പിക്കാനും ഞാൻ ഇഷ്ടപ്പെടുന്നു."
  },
  {
    "questionNumber": 11,
    "languageCode": "hi",
    "questionText": "मुझे नए विचारों को प्रस्तुत करना और दूसरों को प्रेरित करना पसंद है।"
  },
  {
    "questionNumber": 11,
    "languageCode": "ta",
    "questionText": "எனது யோசனைகளை மற்றவர்களிடம் பகிர்ந்து அவர்களை ஊக்குவிக்க விரும்புகிறேன்."
  },
  {
    "questionNumber": 11,
    "languageCode": "kn",
    "questionText": "ನನ್ನ ಆಲೋಚನೆಗಳನ್ನು ಮಂಡಿಸಲು ಮತ್ತು ಇತರರನ್ನು ಪ್ರೇರೇಪಿಸಲು ನನಗೆ ಇಷ್ಟ."
  },
  {
    "questionNumber": 11,
    "languageCode": "ar",
    "questionText": "أستمتع بعرض أفكاري وإقناع الآخرين بدعمها والمشاركة فيها."
  },
  {
    "questionNumber": 12,
    "languageCode": "ml",
    "questionText": "ലിസ്റ്റുകളും ടൈംടേബിളുകളും കൃത്യമായ പദ്ധതികളും തയ്യാറാക്കാൻ എനിക്ക് ഇഷ്ടമാണ്."
  },
  {
    "questionNumber": 12,
    "languageCode": "hi",
    "questionText": "मुझे दैनिक सूचियाँ, समय सारिणी और योजनाएँ बनाना पसंद है।"
  },
  {
    "questionNumber": 12,
    "languageCode": "ta",
    "questionText": "திட்டங்கள் மற்றும் நேர அட்டவணைகளைத் தயாரிப்பது எனக்குப் பிடிக்கும்."
  },
  {
    "questionNumber": 12,
    "languageCode": "kn",
    "questionText": "ವೇಳಾಪಟ್ಟಿ ಮತ್ತು ದಿನಚರಿ ಯೋಜನೆಗಳನ್ನು ತಯಾರಿಸಲು ನಾನು ಇಷ್ಟಪಡುತ್ತೇನೆ."
  },
  {
    "questionNumber": 12,
    "languageCode": "ar",
    "questionText": "أحب إعداد القوائم والجداول الزمنية وخطط العمل المنظمة."
  },
  {
    "questionNumber": 13,
    "languageCode": "ml",
    "questionText": "വസ്തുക്കൾ കൂട്ടിയോജിപ്പിക്കാനും, നന്നാക്കാനും, നിർമ്മിക്കാനും ഉള്ള പ്രായോഗിക പ്രവർത്തനങ്ങൾ എനിക്ക് ഇഷ്ടമാണ്."
  },
  {
    "questionNumber": 13,
    "languageCode": "hi",
    "questionText": "मुझे व्यावहारिक गतिविधियों में भाग लेना पसंद है जहाँ मैं चीज़ों को बना, सुधार या जोड़ सकूँ।"
  },
  {
    "questionNumber": 13,
    "languageCode": "ta",
    "questionText": "பொருட்களை பழுதுபார்க்கவும் இணைக்கவும் கூடிய நடைமுறைப் பணிகளில் ஈடுபட விரும்புகிறேன்."
  },
  {
    "questionNumber": 13,
    "languageCode": "kn",
    "questionText": "ವಸ್ತುಗಳನ್ನು ಜೋಡಿಸುವ ಮತ್ತು ದುರಸ್ತಿ ಮಾಡುವ ಪ್ರಾಯೋಗಿಕ ಚಟುವಟಿಕೆಗಳು ನನಗೆ ಇಷ್ಟ."
  },
  {
    "questionNumber": 13,
    "languageCode": "ar",
    "questionText": "أستمتع بالأنشطة العملية التي تتيح لي البناء أو الإصلاح أو التعامل مع أدوات حقيقية."
  },
  {
    "questionNumber": 14,
    "languageCode": "ml",
    "questionText": "ചിന്തിക്കാൻ പ്രേരിപ്പിക്കുന്ന കഠിനമായ പസിലുകളും കണക്കുകളും പരിഹരിക്കാൻ ഞാൻ ഇഷ്ടപ്പെടുന്നു."
  },
  {
    "questionNumber": 14,
    "languageCode": "hi",
    "questionText": "मुझे कठिन पहेलियाँ और तार्किक समस्याएँ हल करना पसंद है जो सोचने पर मजबूर करें।"
  },
  {
    "questionNumber": 14,
    "languageCode": "ta",
    "questionText": "கடினமான புதிர்களையும் கணக்குகளையும் தீர்ப்பதில் எனக்கு ஆர்வம் உண்டு."
  },
  {
    "questionNumber": 14,
    "languageCode": "kn",
    "questionText": "ಬುದ್ಧಿಗೆ ಕಸರತ್ತು ನೀಡುವ ಕಠಿಣ ಒಗಟುಗಳನ್ನು ಬಿಡಿಸಲು ನಾನು ಇಷ್ಟಪಡುತ್ತೇನೆ."
  },
  {
    "questionNumber": 14,
    "languageCode": "ar",
    "questionText": "أحب حل الألغاز المعقدة والمسائل التي تتطلب تفكيراً عميقاً."
  },
  {
    "questionNumber": 15,
    "languageCode": "ml",
    "questionText": "കാര്യങ്ങൾ ചെയ്യാൻ പുതിയതും വ്യത്യസ്തവുമായ വഴികൾ കണ്ടെത്താൻ ഞാൻ ആഗ്രഹിക്കുന്നു."
  },
  {
    "questionNumber": 15,
    "languageCode": "hi",
    "questionText": "मुझे कार्यों को करने के नए और अनूठे तरीके खोजना पसंद है।"
  },
  {
    "questionNumber": 15,
    "languageCode": "ta",
    "questionText": "பணிகளைச் செய்ய புதிய மற்றும் வித்தியாசமான வழிகளைத் தேட விரும்புகிறேன்."
  },
  {
    "questionNumber": 15,
    "languageCode": "kn",
    "questionText": "ಕೆಲಸಗಳನ್ನು ಮಾಡಲು ಹೊಸ ಮತ್ತು ವಿಭಿನ್ನ ಮಾರ್ಗಗಳನ್ನು ಹುಡುಕಲು ನಾನು ಇಷ್ಟಪಡುತ್ತೇನೆ."
  },
  {
    "questionNumber": 15,
    "languageCode": "ar",
    "questionText": "أحب التفكير في طرق جديدة وغير تقليدية لإنجاز المهام."
  },
  {
    "questionNumber": 16,
    "languageCode": "ml",
    "questionText": "ആളുകളുമായി ഒത്തൊരുമിച്ച് പ്രവർത്തിക്കാനും ടീമിനെ വിജയിപ്പിക്കാൻ സഹായിക്കാനും എനിക്ക് ഇഷ്ടമാണ്."
  },
  {
    "questionNumber": 16,
    "languageCode": "hi",
    "questionText": "मुझे लोगों के साथ मिलकर काम करना और टीम को सफल बनाना पसंद है।"
  },
  {
    "questionNumber": 16,
    "languageCode": "ta",
    "questionText": "குழுவில் இணைந்து பணியாற்றி வெற்றியை அடைய உதவ விரும்புகிறேன்."
  },
  {
    "questionNumber": 16,
    "languageCode": "kn",
    "questionText": "ಜನರೊಂದಿಗೆ ಒಟ್ಟಾಗಿ ಕೆಲಸ ಮಾಡಲು ಮತ್ತು ತಂಡದ ಯಶಸ್ಸಿಗೆ ಶ್ರಮಿಸಲು ನಾನು ಇಷ್ಟಪಡುತ್ತೇನೆ."
  },
  {
    "questionNumber": 16,
    "languageCode": "ar",
    "questionText": "أحب العمل الجماعي والمساهمة في تحقيق نجاح الفريق."
  },
  {
    "questionNumber": 17,
    "languageCode": "ml",
    "questionText": "പുതിയ പ്രോജക്റ്റുകളോ ക്ലബ്ബുകളോ ടീം പ്രവർത്തനങ്ങളോ ആരംഭിക്കാൻ ഞാൻ താല്പര്യപ്പെടുന്നു."
  },
  {
    "questionNumber": 17,
    "languageCode": "hi",
    "questionText": "मुझे नया प्रोजेक्ट, क्लब या समूह गतिविधि शुरू करने में आनंद आता है।"
  },
  {
    "questionNumber": 17,
    "languageCode": "ta",
    "questionText": "புதிய திட்டம் அல்லது மன்றப் பணிகளைத் தொடங்க நான் ஆர்வமாக உள்ளேன்."
  },
  {
    "questionNumber": 17,
    "languageCode": "kn",
    "questionText": "ಹೊಸ ಯೋಜನೆ ಅಥವಾ ಕ್ಲಬ್ ಚಟುವಟಿಕೆಗಳನ್ನು ಪ್ರಾರಂಭಿಸಲು ನಾನು ಉತ್ಸುಕನಾಗಿದ್ದೇನೆ."
  },
  {
    "questionNumber": 17,
    "languageCode": "ar",
    "questionText": "أستمتع ببدء مشاريع جديدة أو قيادة أنشطة ومبادرات طلابية."
  },
  {
    "questionNumber": 18,
    "languageCode": "ml",
    "questionText": "വിവരങ്ങൾ ശരിയാണോ എന്ന് പരിശോധിക്കാനും കാര്യങ്ങൾ കൃത്യമായ സ്ഥാനത്ത് വെക്കാനും ഞാൻ ശ്രദ്ധിക്കാറുണ്ട്."
  },
  {
    "questionNumber": 18,
    "languageCode": "hi",
    "questionText": "मुझे जानकारियों की जाँच करना और चीज़ों को सही जगह रखना पसंद है।"
  },
  {
    "questionNumber": 18,
    "languageCode": "ta",
    "questionText": "விவரங்களைச் சரிபார்த்து பொருட்களைச் சரியான இடத்தில் வைக்க விரும்புகிறேன்."
  },
  {
    "questionNumber": 18,
    "languageCode": "kn",
    "questionText": "ಮಾಹಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಲು ಮತ್ತು ವಸ್ತುಗಳನ್ನು ಸರಿಯಾದ ಜಾಗದಲ್ಲಿ ಇಡಲು ನಾನು ಇಷ್ಟಪಡುತ್ತೇನೆ."
  },
  {
    "questionNumber": 18,
    "languageCode": "ar",
    "questionText": "أحب مراجعة البيانات والتأكد من ترتيب الأشياء في أماكنها الصحيحة."
  },
  {
    "questionNumber": 19,
    "languageCode": "ml",
    "questionText": "ചെടികൾ വളർത്തുക, പരിപാലിക്കുക, പുറംപണികൾ ചെയ്യുക തുടങ്ങിയ പ്രായോഗിക കാര്യങ്ങൾ എനിക്ക് ഇഷ്ടമാണ്."
  },
  {
    "questionNumber": 19,
    "languageCode": "hi",
    "questionText": "मुझे बाहरी व्यावहारिक गतिविधियाँ जैसे पौधे लगाना, वस्तुओं की देखभाल और सुधार करना पसंद है।"
  },
  {
    "questionNumber": 19,
    "languageCode": "ta",
    "questionText": "செடிகளை வளர்ப்பது மற்றும் வெளிப்புற நடைமுறை வேலைகளைச் செய்வது எனக்குப் பிடிக்கும்."
  },
  {
    "questionNumber": 19,
    "languageCode": "kn",
    "questionText": "ಗಿಡಗಳನ್ನು ಬೆಳೆಸುವುದು ಮತ್ತು ಹೊರಾಂಗಣ ಪ್ರಾಯೋಗಿಕ ಕೆಲಸಗಳು ನನಗೆ ಇಷ್ಟ."
  },
  {
    "questionNumber": 19,
    "languageCode": "ar",
    "questionText": "أستمتع بالأنشطة الخارجية التطبيقية مثل الزراعة والصيانة وتحسين البيئة."
  },
  {
    "questionNumber": 20,
    "languageCode": "ml",
    "questionText": "ഒരു ചോദ്യത്തിന് ഉത്തരം അറിയാത്തപ്പോൾ, അത് കണ്ടെത്താൻ വിവരങ്ങൾ തിരയാൻ ഞാൻ ഇഷ്ടപ്പെടുന്നു."
  },
  {
    "questionNumber": 20,
    "languageCode": "hi",
    "questionText": "जब मुझे उत्तर नहीं पता होता, तो मैं समाधान खोजने के लिए जानकारी जुटाना पसंद करता हूँ।"
  },
  {
    "questionNumber": 20,
    "languageCode": "ta",
    "questionText": "பதில் தெரியாதபோது தகவல்களைத் தேடிக் கண்டறிய விரும்புகிறேன்."
  },
  {
    "questionNumber": 20,
    "languageCode": "kn",
    "questionText": "ಉತ್ತರ ತಿಳಿಯದಿದ್ದಾಗ ಮಾಹಿತಿಯನ್ನು ಹುಡುಕಲು ನಾನು ಇಷ್ಟಪಡುತ್ತೇನೆ."
  },
  {
    "questionNumber": 20,
    "languageCode": "ar",
    "questionText": "عندما أجهل إجابة سؤال ما، أستمتع بالبحث عن المعلومات لحله."
  },
  {
    "questionNumber": 21,
    "languageCode": "ml",
    "questionText": "കല, എഴുത്ത്, സംഗീതം, ഡിസൈൻ എന്നിവയിലൂടെ എന്റെ ആശയങ്ങൾ പ്രകടിപ്പിക്കാൻ ഞാൻ ആഗ്രഹിക്കുന്നു."
  },
  {
    "questionNumber": 21,
    "languageCode": "hi",
    "questionText": "मुझे कला, लेखन, संगीत, डिज़ाइन या मीडिया के माध्यम से विचार व्यक्त करना पसंद है।"
  },
  {
    "questionNumber": 21,
    "languageCode": "ta",
    "questionText": "கலை, எழுத்து, இசை அல்லது வடிவமைப்பு மூலம் யோசனைகளை வெளிப்படுத்த விரும்புகிறேன்."
  },
  {
    "questionNumber": 21,
    "languageCode": "kn",
    "questionText": "ಕಲೆ, ಬರವಣಿಗೆ, ಸಂಗೀತ ಅಥವಾ ಮಾಧ್ಯಮದ ಮೂಲಕ ಆಲೋಚನೆಗಳನ್ನು ವ್ಯಕ್ತಪಡಿಸಲು ನನಗೆ ಇಷ್ಟ."
  },
  {
    "questionNumber": 21,
    "languageCode": "ar",
    "questionText": "أحب التعبير عن أفكاري عبر الفنون أو الكتابة أو التصميم أو الوسائط الرقمية."
  },
  {
    "questionNumber": 22,
    "languageCode": "ml",
    "questionText": "മറ്റുള്ളവരുടെ സങ്കടങ്ങളും ആവശ്യങ്ങളും ക്ഷമയോടെ കേൾക്കാനും അവരെ ആശ്വസിപ്പിക്കാനും ഞാൻ ശ്രദ്ധിക്കാറുണ്ട്."
  },
  {
    "questionNumber": 22,
    "languageCode": "hi",
    "questionText": "मुझे दूसरों की बातें ध्यान से सुनना और उन्हें सहारा देना अच्छा लगता है।"
  },
  {
    "questionNumber": 22,
    "languageCode": "ta",
    "questionText": "மற்றவர்களின் குறைகளைக் கேட்டு அவர்களுக்கு ஆதரவளிக்க விரும்புகிறேன்."
  },
  {
    "questionNumber": 22,
    "languageCode": "kn",
    "questionText": "ಇತರರ ಸಮಸ್ಯೆಗಳನ್ನು ಆಲಿಸಲು ಮತ್ತು ಬೆಂಬಲ ನೀಡಲು ನಾನು ಇಷ್ಟಪಡುತ್ತೇನೆ."
  },
  {
    "questionNumber": 22,
    "languageCode": "ar",
    "questionText": "أستمع للآخرين بتعاطف وأسعى لمساعدتهم وتقديم الدعم لهم."
  },
  {
    "questionNumber": 23,
    "languageCode": "ml",
    "questionText": "ഒരു പൊതു ലക്ഷ്യത്തിനായി ആളുകളെ ഒന്നിപ്പിക്കാനും നയിക്കാനും എനിക്ക് സന്തോഷമാണ്."
  },
  {
    "questionNumber": 23,
    "languageCode": "hi",
    "questionText": "मुझे समूह को एक साझे लक्ष्य की ओर संगठित करना और मार्गदर्शन देना पसंद है।"
  },
  {
    "questionNumber": 23,
    "languageCode": "ta",
    "questionText": "ஒரு பொதுவான இலக்கை அடைய குழுவை ஒருங்கிணைக்க விரும்புகிறேன்."
  },
  {
    "questionNumber": 23,
    "languageCode": "kn",
    "questionText": "ಸಾಮಾನ್ಯ ಗುರಿಯನ್ನು ತಲುಪಲು ಜನರನ್ನು ಒಗ್ಗೂಡಿಸಲು ನನಗೆ ಇಷ್ಟ."
  },
  {
    "questionNumber": 23,
    "languageCode": "ar",
    "questionText": "أستمتع بتوجيه الأفراد وتنظيم جهودهم لتحقيق هدف مشترك."
  },
  {
    "questionNumber": 24,
    "languageCode": "ml",
    "questionText": "ഒരു ജോലി കൃത്യമായി പൂർത്തിയാക്കാൻ ചിട്ടയായ നിയമങ്ങളും രീതികളും പിന്തുടരാൻ ഞാൻ ആഗ്രഹിക്കുന്നു."
  },
  {
    "questionNumber": 24,
    "languageCode": "hi",
    "questionText": "मुझे स्पष्ट नियमों और विधियों का पालन करके कार्य को सही ढंग से पूरा करना पसंद है।"
  },
  {
    "questionNumber": 24,
    "languageCode": "ta",
    "questionText": "முறையான விதிகளைப் பின்பற்றி பணியைச் சரியாக முடிக்க விரும்புகிறேன்."
  },
  {
    "questionNumber": 24,
    "languageCode": "kn",
    "questionText": "ನಿಯಮಗಳನ್ನು ಪಾಲಿಸಿ ಕೆಲಸವನ್ನು ನಿಖರವಾಗಿ ಪೂರ್ಣಗೊಳಿಸಲು ನಾನು ಬಯಸುತ್ತೇನೆ."
  },
  {
    "questionNumber": 24,
    "languageCode": "ar",
    "questionText": "أفضل اتباع منهجية واضحة لضمان تنفيذ المهام بأعلى درجات الدقة."
  },
  {
    "questionNumber": 25,
    "languageCode": "ml",
    "questionText": "യന്ത്രഭാഗങ്ങൾ അഴിച്ചുവെച്ച് അവ എങ്ങനെ പ്രവർത്തിക്കുന്നു എന്ന് പരിശോധിക്കുന്നത് എനിക്ക് ഇഷ്ടമാണ്."
  },
  {
    "questionNumber": 25,
    "languageCode": "hi",
    "questionText": "मुझे सरल वस्तुओं को खोलकर यह समझना अच्छा लगता है कि वे कैसे काम करती हैं।"
  },
  {
    "questionNumber": 25,
    "languageCode": "ta",
    "questionText": "பொருட்கள் எவ்வாறு செயல்படுகின்றன என்பதை ஆராய அவற்றைப் பிரித்துப் பார்க்க விரும்புகிறேன்."
  },
  {
    "questionNumber": 25,
    "languageCode": "kn",
    "questionText": "ವಸ್ತುಗಳು ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತವೆ ಎಂದು ತಿಳಿಯಲು ಅವುಗಳನ್ನು ಬಿಡಿಸಿ ಪರೀಕ್ಷಿಸಲು ನನಗೆ ಇಷ್ಟ."
  },
  {
    "questionNumber": 25,
    "languageCode": "ar",
    "questionText": "أستمتع بفحص الأجهزة البسيطة وتفكيكها لمعرفة طريقة عملها."
  },
  {
    "questionNumber": 26,
    "languageCode": "ml",
    "questionText": "ഒരു തീരുമാനത്തിൽ എത്തുന്നതിന് മുൻപ് തെളിവുകളും വിവരങ്ങളും താരതമ്യം ചെയ്തു നോക്കാൻ ഞാൻ ഇഷ്ടപ്പെടുന്നു."
  },
  {
    "questionNumber": 26,
    "languageCode": "hi",
    "questionText": "किसी निष्कर्ष पर पहुँचने से पहले मैं विभिन्न तथ्यों और सबूतों की तुलना करना पसंद करता हूँ।"
  },
  {
    "questionNumber": 26,
    "languageCode": "ta",
    "questionText": "முடிவு எடுப்பதற்கு முன் சான்றுகளையும் ஆதாரங்களையும் ஒப்பிட விரும்புகிறேன்."
  },
  {
    "questionNumber": 26,
    "languageCode": "kn",
    "questionText": "ನಿರ್ಧಾರಕ್ಕೆ ಬರುವ ಮುನ್ನ ಸಾಕ್ಷ್ಯಗಳನ್ನು ಮತ್ತು ವಿವರಗಳನ್ನು ಹೋಲಿಸಲು ನಾನು ಇಷ್ಟಪಡುತ್ತೇನೆ."
  },
  {
    "questionNumber": 26,
    "languageCode": "ar",
    "questionText": "أحب مقارنة الأدلة والحقائق بعناية قبل اتخاذ أي قرار."
  },
  {
    "questionNumber": 27,
    "languageCode": "ml",
    "questionText": "ഒരു വസ്തുവിനെ കൂടുതൽ മനോഹരവും ആകർഷകവുമാക്കാൻ അതിൽ മാറ്റങ്ങൾ വരുത്താൻ ഞാൻ ആഗ്രഹിക്കുന്നു."
  },
  {
    "questionNumber": 27,
    "languageCode": "hi",
    "questionText": "मुझे चीज़ों में सुधार करना पसंद है ताकि वे अधिक रचनात्मक और प्रभावशाली दिखें।"
  },
  {
    "questionNumber": 27,
    "languageCode": "ta",
    "questionText": "பொருட்களை மேலும் அழகாகவும் புதுமையாகவும் மாற்ற விரும்புகிறேன்."
  },
  {
    "questionNumber": 27,
    "languageCode": "kn",
    "questionText": "ವಸ್ತುಗಳನ್ನು ಇನ್ನಷ್ಟು ಆಕರ್ಷಕವಾಗಿ ಮತ್ತು ಸೃಜನಶೀಲವಾಗಿ ಬದಲಾಯಿಸಲು ನಾನು ಬಯಸುತ್ತೇನೆ."
  },
  {
    "questionNumber": 27,
    "languageCode": "ar",
    "questionText": "أستمتع بتحسين الأشياء وتطويرها لتصبح أكثر جاذبية وإبداعاً."
  },
  {
    "questionNumber": 28,
    "languageCode": "ml",
    "questionText": "എനിക്ക് അറിയാവുന്ന കാര്യങ്ങൾ എന്നേക്കാൾ പ്രായം കുറഞ്ഞ കുട്ടികളെ പഠിപ്പിക്കാൻ ഞാൻ ഇഷ്ടപ്പെടുന്നു."
  },
  {
    "questionNumber": 28,
    "languageCode": "hi",
    "questionText": "मुझे छोटे छात्रों को वह चीज़ें सिखाना और मार्गदर्शन देना पसंद है जो मैं जानता हूँ।"
  },
  {
    "questionNumber": 28,
    "languageCode": "ta",
    "questionText": "எனக்குத் தெரிந்தவற்றை இளைய மாணவர்களுக்குக் கற்றுத்தர விரும்புகிறேன்."
  },
  {
    "questionNumber": 28,
    "languageCode": "kn",
    "questionText": "ನನಗೆ ತಿಳಿದಿರುವ ವಿಷಯಗಳನ್ನು ಕಿರಿಯ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಕಲಿಸಲು ನನಗೆ ಇಷ್ಟ."
  },
  {
    "questionNumber": 28,
    "languageCode": "ar",
    "questionText": "يسعدني تعليم الطلاب الأصغر سناً وتقديم الإرشاد لهم في المواد التي أتقنها."
  },
  {
    "questionNumber": 29,
    "languageCode": "ml",
    "questionText": "ഗ്രൂപ്പ് പ്രവർത്തനങ്ങളിൽ ഉത്തരവാദിത്തം ഏറ്റെടുക്കാനും പ്രധാന തീരുമാനങ്ങൾ എടുക്കാനും എനിക്ക് താല്പര്യമുണ്ട്."
  },
  {
    "questionNumber": 29,
    "languageCode": "hi",
    "questionText": "मुझे समूह कार्यों में ज़िम्मेदारी लेना और महत्वपूर्ण निर्णय लेना पसंद है।"
  },
  {
    "questionNumber": 29,
    "languageCode": "ta",
    "questionText": "குழுப் பணிகளில் பொறுப்பேற்கவும் முக்கிய முடிவுகளை எடுக்கவும் விரும்புகிறேன்."
  },
  {
    "questionNumber": 29,
    "languageCode": "kn",
    "questionText": "ತಂಡದ ಕೆಲಸಗಳಲ್ಲಿ ಜವಾಬ್ದಾರಿ ವಹಿಸಲು ಮತ್ತು ಪ್ರಮುಖ ನಿರ್ಧಾರಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳಲು ನನಗೆ ಆಸಕ್ತಿ ಇದೆ."
  },
  {
    "questionNumber": 29,
    "languageCode": "ar",
    "questionText": "أتحمل مسؤولية اتخاذ القرارات المهمة في المهام الجماعية بثقة."
  },
  {
    "questionNumber": 30,
    "languageCode": "ml",
    "questionText": "വിവരങ്ങളും ശേഖരങ്ങളും പ്രയോജനപ്രദമായ രീതിയിൽ തരംതിരിച്ചു വെക്കാൻ എനിക്ക് ഇഷ്ടമാണ്."
  },
  {
    "questionNumber": 30,
    "languageCode": "hi",
    "questionText": "मुझे जानकारियों, अभिलेखों और संग्रहों को उपयोगी क्रम में व्यवस्थित करना पसंद है।"
  },
  {
    "questionNumber": 30,
    "languageCode": "ta",
    "questionText": "தகவல்களையும் கோப்புகளையும் பயனுள்ள முறையில் வரிசைப்படுத்த விரும்புகிறேன்."
  },
  {
    "questionNumber": 30,
    "languageCode": "kn",
    "questionText": "ಮಾಹಿತಿಗಳನ್ನು ಮತ್ತು ಸಂಗ್ರಹಗಳನ್ನು ಉಪಯುಕ್ತ ಕ್ರಮದಲ್ಲಿ ಜೋಡಿಸಲು ನನಗೆ ಇಷ್ಟ."
  },
  {
    "questionNumber": 30,
    "languageCode": "ar",
    "questionText": "أستمتع بفرز البيانات والمعلومات في جداول وسجلات منظمة ومفيدة."
  },
  {
    "questionNumber": 31,
    "languageCode": "ml",
    "questionText": "ഒരു സങ്കീർണ്ണമായ പ്രശ്നം വരുമ്പോൾ, അതിനെ ചെറിയ ഭാഗങ്ങളാക്കി മാറ്റി പരിഹരിക്കാൻ എനിക്ക് കഴിയും."
  },
  {
    "questionNumber": 31,
    "languageCode": "hi",
    "questionText": "जब मेरे सामने कोई कठिन पहेली आती है, तो मैं उसे छोटे चरणों में बाँटकर हल करता हूँ।"
  },
  {
    "questionNumber": 31,
    "languageCode": "ta",
    "questionText": "கடினமான சிக்கலை எதிர்கொள்ளும்போது, அதைச் சிறிய படிகளாகப் பிரித்து தீர்க்க என்னால் முடியும்."
  },
  {
    "questionNumber": 31,
    "languageCode": "kn",
    "questionText": "ಕಠಿಣ ಸಮಸ್ಯೆಯನ್ನು ಎದುರಿಸಿದಾಗ, ಅದನ್ನು ಸಣ್ಣ ಹಂತಗಳಾಗಿ ವಿಂಗಡಿಸಿ ಪರಿಹರಿಸಲು ನನಗೆ ಸಾಧ್ಯವಾಗುತ್ತದೆ."
  },
  {
    "questionNumber": 31,
    "languageCode": "ar",
    "questionText": "عند مواجهة مسألة معقدة، يمكنني تقسيمها إلى خطوات مرحلية لتسهيل حلها."
  },
  {
    "questionNumber": 32,
    "languageCode": "ml",
    "questionText": "എന്റെ ആശയങ്ങൾ മറ്റുള്ളവർക്ക് വ്യക്തമായി മനസ്സിലാകുന്ന രീതിയിൽ ലളിതമായി വിശദീകരിക്കാൻ എനിക്ക് കഴിയും."
  },
  {
    "questionNumber": 32,
    "languageCode": "hi",
    "questionText": "मैं अपने विचारों को दूसरों के सामने स्पष्ट और प्रभावी ढंग से रख सकता हूँ।"
  },
  {
    "questionNumber": 32,
    "languageCode": "ta",
    "questionText": "எனது யோசனைகளை மற்றவர்களுக்குத் தெளிவாகப் புரிய வைக்க என்னால் முடியும்."
  },
  {
    "questionNumber": 32,
    "languageCode": "kn",
    "questionText": "ನನ್ನ ಆಲೋಚನೆಗಳನ್ನು ಇತರರಿಗೆ ಸ್ಪಷ್ಟವಾಗಿ ಅರ್ಥವಾಗುವಂತೆ ವಿವರಿಸಲು ನನಗೆ ಸಾಧ್ಯ."
  },
  {
    "questionNumber": 32,
    "languageCode": "ar",
    "questionText": "أستطيع توضيح أفكاري وشرحها للآخرين بأسلوب سلس ومقنع."
  },
  {
    "questionNumber": 33,
    "languageCode": "ml",
    "questionText": "ഒരു പ്രശ്നത്തിന് ഒന്നിലധികം പരിഹാരമാർഗ്ഗങ്ങൾ ചിന്തിച്ചു കണ്ടെത്താൻ എനിക്ക് സാധിക്കാറുണ്ട്."
  },
  {
    "questionNumber": 33,
    "languageCode": "hi",
    "questionText": "मैं आमतौर पर किसी समस्या के एक से अधिक समाधान सोच सकता हूँ।"
  },
  {
    "questionNumber": 33,
    "languageCode": "ta",
    "questionText": "ஒரு பிரச்சனைக்கு ஒன்றுக்கும் மேற்பட்ட தீர்வுகளை என்னால் சிந்திக்க முடியும்."
  },
  {
    "questionNumber": 33,
    "languageCode": "kn",
    "questionText": "ಒಂದು ಸಮಸ್ಯೆಗೆ ಒಂದಕ್ಕಿಂತ ಹೆಚ್ಚು ಪರಿಹಾರಗಳನ್ನು ಯೋಚಿಸಲು ನನಗೆ ಸಾಧ್ಯವಾಗುತ್ತದೆ."
  },
  {
    "questionNumber": 33,
    "languageCode": "ar",
    "questionText": "أستطيع التفكير في أكثر من حل بديل عند مواجهة تحدٍ معين."
  },
  {
    "questionNumber": 34,
    "languageCode": "ml",
    "questionText": "ഒരു വസ്തു വരയ്ക്കുകയോ ഉണ്ടാക്കുകയോ ചെയ്യുന്നതിന് മുൻപ് അത് എങ്ങനെ കാണപ്പെടുമെന്ന് മനസ്സിൽ സങ്കൽപ്പിക്കാൻ എനിക്ക് കഴിയും."
  },
  {
    "questionNumber": 34,
    "languageCode": "hi",
    "questionText": "किसी चीज़ को बनाने या चित्रित करने से पहले मैं कल्पना कर सकता हूँ कि वह कैसी दिखेगी।"
  },
  {
    "questionNumber": 34,
    "languageCode": "ta",
    "questionText": "ஒரு பொருளை உருவாக்குவதற்கு முன் அது எவ்வாறு இருக்கும் என்பதை மனதளவில் கற்பனை செய்ய முடியும்."
  },
  {
    "questionNumber": 34,
    "languageCode": "kn",
    "questionText": "ಯಾವುದಾದರೂ ವಸ್ತುವನ್ನು ರಚಿಸುವ ಮುನ್ನ ಅದು ಹೇಗೆ ಕಾಣುತ್ತದೆ ಎಂದು ಮನಸ್ಸಿನಲ್ಲಿ ಕಲ್ಪಿಸಿಕೊಳ್ಳಬಲ್ಲೆ."
  },
  {
    "questionNumber": 34,
    "languageCode": "ar",
    "questionText": "يمكنني تخيل الشكل النهائي للمجسم أو الرسم قبل تنفيذه على أرض الواقع."
  },
  {
    "questionNumber": 35,
    "languageCode": "ml",
    "questionText": "ഘട്ടങ്ങൾ കൃത്യമായി പാലിച്ച് ലളിതമായ പ്രോജക്റ്റുകളോ മോഡലുകളോ നിർമ്മിക്കാൻ എനിക്ക് സാധിക്കും."
  },
  {
    "questionNumber": 35,
    "languageCode": "hi",
    "questionText": "मैं निर्देशों का पालन करके सरल मॉडल या प्रोजेक्ट्स बना और परख सकता हूँ।"
  },
  {
    "questionNumber": 35,
    "languageCode": "ta",
    "questionText": "வழிமுறைகளைப் பின்பற்றி எளிய மாதிரிகளை உருவாக்கவும் சோதிக்கவும் முடியும்."
  },
  {
    "questionNumber": 35,
    "languageCode": "kn",
    "questionText": "ಹಂತಗಳನ್ನು ಪಾಲಿಸಿ ಸರಳ ಮಾದರಿಗಳನ್ನು ನಿರ್ಮಿಸಲು ಮತ್ತು ಪರೀಕ್ಷಿಸಲು ನನಗೆ ಸಾಧ್ಯ."
  },
  {
    "questionNumber": 35,
    "languageCode": "ar",
    "questionText": "أستطيع اتباع التعليمات لتركيب النماذج واختبار أدائها بنجاح."
  },
  {
    "questionNumber": 36,
    "languageCode": "ml",
    "questionText": "മറ്റൊരാൾ വിഷമത്തിലാണെങ്കിലോ ഒറ്റപ്പെട്ടു നിൽക്കുകയാണെങ്കിലോ അത് തിരിച്ചറിയാൻ എനിക്ക് സാധിക്കാറുണ്ട്."
  },
  {
    "questionNumber": 36,
    "languageCode": "hi",
    "questionText": "जब कोई व्यक्ति असहज या उदास होता है, तो मैं इसे आसानी से भाँप लेता हूँ।"
  },
  {
    "questionNumber": 36,
    "languageCode": "ta",
    "questionText": "மற்றவர்கள் வருத்தமாக அல்லது தனிமையாக இருப்பதை என்னால் எளிதில் உணர முடியும்."
  },
  {
    "questionNumber": 36,
    "languageCode": "kn",
    "questionText": "ಇತರರು ಸಂಕಷ್ಟದಲ್ಲಿದ್ದಾಗ ಅಥವಾ ಒಂಟಿಯಾಗಿದ್ದಾಗ ಅದನ್ನು ಸುಲಭವಾಗಿ ಗ್ರಹಿಸಬಲ್ಲೆ."
  },
  {
    "questionNumber": 36,
    "languageCode": "ar",
    "questionText": "ألاحظ بسهولة عندما يمر شخص ما بضيق أو يشعر بالعزلة."
  },
  {
    "questionNumber": 37,
    "languageCode": "ml",
    "questionText": "ഒരു ഗ്രൂപ്പിന് പ്രവർത്തനം എങ്ങനെ തുടങ്ങണമെന്ന് അറിയാതെ വരുമ്പോൾ, അവർക്ക് തുടക്കമിടാൻ സഹായിക്കാൻ എനിക്ക് കഴിയും."
  },
  {
    "questionNumber": 37,
    "languageCode": "hi",
    "questionText": "जब समूह को शुरुआत करने में परेशानी हो, तो मैं सभी को आगे बढ़ने में मदद कर सकता हूँ।"
  },
  {
    "questionNumber": 37,
    "languageCode": "ta",
    "questionText": "குழுவிற்குத் தொடக்கம் தெரியாதபோது, வழிநடத்தித் தொடங்க உதவ முடியும்."
  },
  {
    "questionNumber": 37,
    "languageCode": "kn",
    "questionText": "ತಂಡಕ್ಕೆ ಎಲ್ಲಿಂದ ಪ್ರಾರಂಭಿಸಬೇಕೆಂದು ತಿಳಿಯದಿದ್ದಾಗ, ಅವರಿಗೆ ಪ್ರಾರಂಭಿಸಲು ಸಹಾಯ ಮಾಡಬಲ್ಲೆ."
  },
  {
    "questionNumber": 37,
    "languageCode": "ar",
    "questionText": "عندما يتردد الفريق في البداية، يمكنني المبادرة ومساعدة الجميع على الانطلاق."
  },
  {
    "questionNumber": 38,
    "languageCode": "ml",
    "questionText": "ഒരേസമയം പല കാര്യങ്ങൾ ചെയ്തു തീർക്കാനുണ്ടെങ്കിൽ എന്റെ ജോലി ചിട്ടയോടെ ക്രമീകരിക്കാൻ എനിക്ക് സാധിക്കും."
  },
  {
    "questionNumber": 38,
    "languageCode": "hi",
    "questionText": "जब कई कार्य पूरे करने हों, तो मैं अपने समय और काम को व्यवस्थित कर सकता हूँ।"
  },
  {
    "questionNumber": 38,
    "languageCode": "ta",
    "questionText": "பல வேலைகள் இருக்கும்போது பணிகளைத் திட்டமிட்டு ஒழுங்கமைக்க முடியும்."
  },
  {
    "questionNumber": 38,
    "languageCode": "kn",
    "questionText": "ಹಲವಾರು ಕೆಲಸಗಳಿರುವಾಗ ನನ್ನ ಸಮಯ ಮತ್ತು ಕೆಲಸವನ್ನು ಸುಲಭವಾಗಿ ಸಂಘಟಿಸಬಲ್ಲೆ."
  },
  {
    "questionNumber": 38,
    "languageCode": "ar",
    "questionText": "أستطيع تنظيم أولويات عملي بمهارة عند تراكم عدة مهام."
  },
  {
    "questionNumber": 39,
    "languageCode": "ml",
    "questionText": "ആദ്യത്തെ പരിഹാരം വിജയിച്ചില്ലെങ്കിൽ, മറ്റൊരു രീതി പരീക്ഷിക്കാൻ എനിക്ക് കഴിയും."
  },
  {
    "questionNumber": 39,
    "languageCode": "hi",
    "questionText": "यदि पहला उपाय काम न करे, तो मैं दूसरा दृष्टिकोण आज़माने के लिए तैयार रहता हूँ।"
  },
  {
    "questionNumber": 39,
    "languageCode": "ta",
    "questionText": "முதல் தீர்வு பலனளிக்கவில்லை என்றால், மாற்று வழியை முயற்சிக்க முடியும்."
  },
  {
    "questionNumber": 39,
    "languageCode": "kn",
    "questionText": "ಮೊದಲ ಪರಿಹಾರ ವಿಫಲವಾದರೆ, ಬೇರೆ ವಿಧಾನವನ್ನು ಪ್ರಯತ್ನಿಸಲು ನಾನು ಸಿದ್ಧ."
  },
  {
    "questionNumber": 39,
    "languageCode": "ar",
    "questionText": "إذا لم ينجح الحل الأول، أسارع لتجربة أسلوب آخر بمرونة."
  },
  {
    "questionNumber": 40,
    "languageCode": "ml",
    "questionText": "വിവരങ്ങൾ വ്യക്തമായ ക്രമത്തിൽ പറയുവാനോ എഴുതുവാനോ എനിക്ക് സാധിക്കാറുണ്ട്."
  },
  {
    "questionNumber": 40,
    "languageCode": "hi",
    "questionText": "मैं जानकारियों को स्पष्ट और तार्किक क्रम में बता या लिख सकता हूँ।"
  },
  {
    "questionNumber": 40,
    "languageCode": "ta",
    "questionText": "தகவல்களைத் தெளிவான வரிசையில் விவரிக்க அல்லது எழுத முடியும்."
  },
  {
    "questionNumber": 40,
    "languageCode": "kn",
    "questionText": "ಮಾಹಿತಿಯನ್ನು ಸ್ಪಷ್ಟವಾದ ಕ್ರಮದಲ್ಲಿ ಹೇಳಲು ಅಥವಾ ಬರೆಯಲು ನನಗೆ ಸಾಧ್ಯ."
  },
  {
    "questionNumber": 40,
    "languageCode": "ar",
    "questionText": "أستطيع صياغة المعلومات وكتابتها بتسلسل منطقي واضح."
  },
  {
    "questionNumber": 41,
    "languageCode": "ml",
    "questionText": "ഒരു സാധാരണ ആശയത്തെ കൂടുതൽ മികച്ചതാക്കാനോ പുതിയ രീതിയിൽ ഉപയോഗിക്കാനോ എനിക്ക് ചിന്തിക്കാൻ കഴിയും."
  },
  {
    "questionNumber": 41,
    "languageCode": "hi",
    "questionText": "मैं अक्सर किसी साधारण विचार को बेहतर और उपयोगी बनाने का नया तरीका सोच लेता हूँ।"
  },
  {
    "questionNumber": 41,
    "languageCode": "ta",
    "questionText": "சாதாரண யோசனையை மேம்படுத்திப் புதிய முறையில் பயன்படுத்த முடியும்."
  },
  {
    "questionNumber": 41,
    "languageCode": "kn",
    "questionText": "ಸಾಮಾನ್ಯ ಕಲ್ಪನೆಯನ್ನು ಸುಧಾರಿಸಿ ಹೊಸ ರೀತಿಯಲ್ಲಿ ಬಳಸಲು ನಾನು ಯೋಚಿಸಬಲ್ಲೆ."
  },
  {
    "questionNumber": 41,
    "languageCode": "ar",
    "questionText": "أستطيع تطوير الأفكار العادية وتحويلها إلى ابتكارات أكثر فاعلية."
  },
  {
    "questionNumber": 42,
    "languageCode": "ml",
    "questionText": "മാപ്പുകൾ, ഡയഗ്രമുകൾ, രൂപങ്ങൾ എന്നിവ എളുപ്പത്തിൽ മനസ്സിലാക്കാൻ എനിക്ക് സാധിക്കാറുണ്ട്."
  },
  {
    "questionNumber": 42,
    "languageCode": "hi",
    "questionText": "नक्शे, आरेख, आकृतियाँ और लेआउट समझना मेरे लिए आमतौर पर आसान होता है।"
  },
  {
    "questionNumber": 42,
    "languageCode": "ta",
    "questionText": "வரைபடங்கள் மற்றும் வடிவங்களை எளிதில் புரிந்துகொள்ள முடியும்."
  },
  {
    "questionNumber": 42,
    "languageCode": "kn",
    "questionText": "ನಕ್ಷೆಗಳು, ರೇಖಾಚಿತ್ರಗಳು ಮತ್ತು ಆಕಾರಗಳನ್ನು ಸುಲಭವಾಗಿ ಅರ್ಥಮಾಡಿಕೊಳ್ಳಬಲ್ಲೆ."
  },
  {
    "questionNumber": 42,
    "languageCode": "ar",
    "questionText": "يسهل عليّ قراءة الخرائط والمخططات وفهم العلاقات المكانية."
  },
  {
    "questionNumber": 43,
    "languageCode": "ml",
    "questionText": "ഒരു ചെറിയ ഉപകരണം പ്രവർത്തിക്കാതെ വരുമ്പോൾ, ആദ്യം എന്താണ് പരിശോധിക്കേണ്ടതെന്ന് ചിന്തിക്കാൻ എനിക്ക് കഴിയും."
  },
  {
    "questionNumber": 43,
    "languageCode": "hi",
    "questionText": "जब कोई उपकरण काम न करे, तो मैं पहले जाँची जाने वाली ज़रूरी चीज़ों के बारे में सोच सकता हूँ।"
  },
  {
    "questionNumber": 43,
    "languageCode": "ta",
    "questionText": "ஒரு சாதனம் பழுதடையும்போது முதலில் எதைச் சோதிக்க வேண்டும் என்பதைச் சிந்திக்க முடியும்."
  },
  {
    "questionNumber": 43,
    "languageCode": "kn",
    "questionText": "ಯಂತ್ರವು ಕೆಲಸ ಮಾಡದಿದ್ದಾಗ ಮೊದಲು ಏನನ್ನು ಪರೀಕ್ಷಿಸಬೇಕೆಂದು ಯೋಚಿಸಬಲ್ಲೆ."
  },
  {
    "questionNumber": 43,
    "languageCode": "ar",
    "questionText": "عند تعطل جهاز بسيط، يمكنني تحديد النقاط الأساسية الواجب فحصها أولاً."
  },
  {
    "questionNumber": 44,
    "languageCode": "ml",
    "questionText": "എന്റേതിൽ നിന്ന് വ്യത്യസ്തമായ അഭിപ്രായമുള്ള ആളുകളോടൊപ്പം നല്ല രീതിയിൽ പ്രവർത്തിക്കാൻ എനിക്ക് സാധിക്കും."
  },
  {
    "questionNumber": 44,
    "languageCode": "hi",
    "questionText": "मैं उन लोगों के साथ भी मिलकर अच्छा काम कर सकता हूँ जिनके विचार मुझसे अलग हैं।"
  },
  {
    "questionNumber": 44,
    "languageCode": "ta",
    "questionText": "மாறுபட்ட கருத்துக்கள் கொண்டவர்களுடன் இணைந்து சிறப்பாகப் பணியாற்ற முடியும்."
  },
  {
    "questionNumber": 44,
    "languageCode": "kn",
    "questionText": "ನನಗಿಂತ ಭಿನ್ನ ಅಭಿಪ್ರಾಯ ಹೊಂದಿರುವ ಜನರೊಂದಿಗೆ ಉತ್ತಮವಾಗಿ ಕೆಲಸ ಮಾಡಬಲ್ಲೆ."
  },
  {
    "questionNumber": 44,
    "languageCode": "ar",
    "questionText": "أتعاون بمرونة مع أصحاب الآراء والتوجهات المختلفة عني."
  },
  {
    "questionNumber": 45,
    "languageCode": "ml",
    "questionText": "ഒരു പൊതു ലക്ഷ്യത്തിനായി ഒന്നിച്ച് പ്രവർത്തിക്കാൻ മറ്റുള്ളവരെ പ്രോത്സാഹിപ്പിക്കാൻ എനിക്ക് കഴിയും."
  },
  {
    "questionNumber": 45,
    "languageCode": "hi",
    "questionText": "मैं साझे लक्ष्य को प्राप्त करने के लिए अन्य लोगों को प्रोत्साहित कर सकता हूँ।"
  },
  {
    "questionNumber": 45,
    "languageCode": "ta",
    "questionText": "பொதுவான இலக்கை நோக்கி மற்றவர்களை ஊக்குவித்து வழிநடத்த முடியும்."
  },
  {
    "questionNumber": 45,
    "languageCode": "kn",
    "questionText": "ಸಾಮಾನ್ಯ ಗುರಿಗಾಗಿ ಇತರರನ್ನು ಪ್ರೋತ್ಸಾಹಿಸಲು ನನಗೆ ಸಾಧ್ಯ."
  },
  {
    "questionNumber": 45,
    "languageCode": "ar",
    "questionText": "أستطيع تحفيز الآخرين وتوحيد طاقاتهم نحو هدف مشترك."
  },
  {
    "questionNumber": 46,
    "languageCode": "ml",
    "questionText": "ചുറ്റും ശ്രദ്ധ തിരിക്കുന്ന കാര്യങ്ങൾ ഉണ്ടായാലും എന്റെ ജോലിയിൽ ശ്രദ്ധ കേന്ദ്രീകരിക്കാൻ എനിക്ക് സാധിക്കാറുണ്ട്."
  },
  {
    "questionNumber": 46,
    "languageCode": "hi",
    "questionText": "आसपास ध्यान भटकाने वाली चीज़ें होने पर भी मैं अपने काम पर ध्यान केंद्रित रख सकता हूँ।"
  },
  {
    "questionNumber": 46,
    "languageCode": "ta",
    "questionText": "கவனச்சிதறல்கள் இருந்தாலும் பணியில் கவனம் செலுத்த முடியும்."
  },
  {
    "questionNumber": 46,
    "languageCode": "kn",
    "questionText": "ಗೊಂದಲಗಳ ನಡುವೆಯೂ ನನ್ನ ಕೆಲಸದ ಮೇಲೆ ಏಕಾಗ್ರತೆ ಕಾಪಾಡಿಕೊಳ್ಳಬಲ್ಲೆ."
  },
  {
    "questionNumber": 46,
    "languageCode": "ar",
    "questionText": "أحافظ على تركيزي التام في العمل حتى في وجود مشتتات حولي."
  },
  {
    "questionNumber": 47,
    "languageCode": "ml",
    "questionText": "ഒരു തീരുമാനം എടുക്കുന്നതിന് മുൻപ്, വ്യത്യസ്ത ഓപ്ഷനുകൾ പരിശോധിച്ച് അവയുടെ ഫലം എന്തായിരിക്കുമെന്ന് ചിന്തിക്കാൻ എനിക്ക് കഴിയും."
  },
  {
    "questionNumber": 47,
    "languageCode": "hi",
    "questionText": "कोई समाधान चुनने से पहले मैं विभिन्न विकल्पों की तुलना करता हूँ और परिणामों पर विचार करता हूँ।"
  },
  {
    "questionNumber": 47,
    "languageCode": "ta",
    "questionText": "முடிவெடுப்பதற்கு முன் பல்வேறு வாய்ப்புகளையும் அவற்றின் விளைவுகளையும் ஒப்பிட்டுப் பார்க்க முடியும்."
  },
  {
    "questionNumber": 47,
    "languageCode": "kn",
    "questionText": "ನಿರ್ಧಾರ ತೆಗೆದುಕೊಳ್ಳುವ ಮುನ್ನ ವಿವಿಧ ಆಯ್ಕೆಗಳನ್ನು ಮತ್ತು ಅವುಗಳ ಪರಿಣಾಮಗಳನ್ನು ಹೋಲಿಸಬಲ್ಲೆ."
  },
  {
    "questionNumber": 47,
    "languageCode": "ar",
    "questionText": "أقارن بين البدائل وأدرس نتائجها المتوقعة قبل اختيار الحل الأنسب."
  },
  {
    "questionNumber": 48,
    "languageCode": "ml",
    "questionText": "മറ്റൊരാൾ പറയുന്നത് വ്യക്തമായില്ലെങ്കിൽ, സംശയങ്ങൾ ചോദിച്ച് കാര്യം വ്യക്തമാക്കാൻ ഞാൻ മടിക്കാറില്ല."
  },
  {
    "questionNumber": 48,
    "languageCode": "hi",
    "questionText": "जब मुझे किसी की बात समझ नहीं आती, तो मैं स्पष्टता के लिए प्रश्न पूछने में नहीं हिचकिचाता।"
  },
  {
    "questionNumber": 48,
    "languageCode": "ta",
    "questionText": "புரியாதபோது தெளிவுபடுத்த கேள்விகளைக் கேட்க நான் தயங்குவதில்லை."
  },
  {
    "questionNumber": 48,
    "languageCode": "kn",
    "questionText": "ಅರ್ಥವಾಗದಿದ್ದಾಗ ಸ್ಪಷ್ಟತೆಗಾಗಿ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಲು ನಾನು ಹಿಂಜರಿಯುವುದಿಲ್ಲ."
  },
  {
    "questionNumber": 48,
    "languageCode": "ar",
    "questionText": "عندما لا يتضح لي مقصد شخص ما، أبادر بالسؤال والاستفسار للتوضيح."
  },
  {
    "questionNumber": 49,
    "languageCode": "ml",
    "questionText": "വ്യത്യസ്ത മേഖലകളിലെ ആശയങ്ങൾ സംയോജിപ്പിച്ച് പുതിയ ഒന്ന് സൃഷ്ടിക്കാൻ എനിക്ക് താല്പര്യമുണ്ട്."
  },
  {
    "questionNumber": 49,
    "languageCode": "hi",
    "questionText": "मैं अलग-अलग क्षेत्रों के विचारों को जोड़कर कुछ नया और उपयोगी बना सकता हूँ।"
  },
  {
    "questionNumber": 49,
    "languageCode": "ta",
    "questionText": "வெவ்வேறு துறை யோசனைகளை இணைத்துப் புதிய ஒன்றை உருவாக்க முடியும்."
  },
  {
    "questionNumber": 49,
    "languageCode": "kn",
    "questionText": "ವಿವಿಧ ಕ್ಷೇತ್ರಗಳ ಕಲ್ಪನೆಗಳನ್ನು ಸಂಯೋಜಿಸಿ ಹೊಸದನ್ನು ರಚಿಸಬಲ್ಲೆ."
  },
  {
    "questionNumber": 49,
    "languageCode": "ar",
    "questionText": "أستطيع الربط بين مجالات معرفية مختلفة لابتكار فكرة جديدة."
  },
  {
    "questionNumber": 50,
    "languageCode": "ml",
    "questionText": "ഭാഗങ്ങളും രൂപങ്ങളും എങ്ങനെ പരസ്പരം യോജിക്കുമെന്ന് മനസ്സിൽ സങ്കൽപ്പിക്കാൻ എനിക്ക് കഴിയും."
  },
  {
    "questionNumber": 50,
    "languageCode": "hi",
    "questionText": "मैं मानसिक रूप से कल्पना कर सकता हूँ कि पुर्जे और आकृतियाँ आपस में कैसे फिट होंगी।"
  },
  {
    "questionNumber": 50,
    "languageCode": "ta",
    "questionText": "பாகங்கள் எவ்வாறு இணையும் என்பதை மனதளவில் காட்சிப்படுத்த முடியும்."
  },
  {
    "questionNumber": 50,
    "languageCode": "kn",
    "questionText": "ಭಾಗಗಳು ಹೇಗೆ ಹೊಂದಿಕೊಳ್ಳುತ್ತವೆ ಎಂದು ಮನಸ್ಸಿನಲ್ಲಿ ಊಹಿಸಬಲ್ಲೆ."
  },
  {
    "questionNumber": 50,
    "languageCode": "ar",
    "questionText": "يمكنني تصور كيفية تطابق الأجزاء والأشكال الهندسية في ذهني بدقة."
  },
  {
    "questionNumber": 51,
    "languageCode": "ml",
    "questionText": "സുരക്ഷാ നിർദ്ദേശങ്ങൾ പാലിച്ച് ഉപകരണങ്ങളും വസ്തുക്കളും ശ്രദ്ധയോടെ ഉപയോഗിക്കാൻ എനിക്ക് അറിയാം."
  },
  {
    "questionNumber": 51,
    "languageCode": "hi",
    "questionText": "मैं सुरक्षा नियमों का पालन करते हुए उपकरणों और सामग्रियों का सावधानीपूर्वक उपयोग कर सकता हूँ।"
  },
  {
    "questionNumber": 51,
    "languageCode": "ta",
    "questionText": "பாதுகாப்பு விதிகளைப் பின்பற்றி கருவிகளைப் பயன்படுத்த முடியும்."
  },
  {
    "questionNumber": 51,
    "languageCode": "kn",
    "questionText": "ಸುರಕ್ಷತಾ ನಿಯಮಗಳನ್ನು ಪಾಲಿಸಿ ಉಪಕರಣಗಳನ್ನು ಬಳಸಬಲ್ಲೆ."
  },
  {
    "questionNumber": 51,
    "languageCode": "ar",
    "questionText": "أستخدم الأدوات بحرص واهتمام مع الالتزام التام بإرشادات السلامة."
  },
  {
    "questionNumber": 52,
    "languageCode": "ml",
    "questionText": "ഒരു ടീമിൽ പ്രവർത്തിക്കുമ്പോൾ ഉത്തരവാദിത്തങ്ങൾ തുല്യമായി പങ്കിട്ട് എന്റെ പങ്ക് ഭംഗിയായി ചെയ്യാൻ എനിക്ക് സാധിക്കും."
  },
  {
    "questionNumber": 52,
    "languageCode": "hi",
    "questionText": "टीम में काम करते समय मैं ज़िम्मेदारियाँ साझा करता हूँ और अपना योगदान पूरी निष्ठा से देता हूँ।"
  },
  {
    "questionNumber": 52,
    "languageCode": "ta",
    "questionText": "குழுவில் பொறுப்புகளைப் பகிர்ந்து எனது பங்கைச் சிறப்பாகச் செய்ய முடியும்."
  },
  {
    "questionNumber": 52,
    "languageCode": "kn",
    "questionText": "ತಂಡದಲ್ಲಿ ಜವಾಬ್ದಾರಿಗಳನ್ನು ಹಂಚಿಕೊಂಡು ನನ್ನ ಪಾಲಿನ ಕೆಲಸವನ್ನು ನಿಷ್ಠೆಯಿಂದ ಮಾಡಬಲ್ಲೆ."
  },
  {
    "questionNumber": 52,
    "languageCode": "ar",
    "questionText": "أتقاسم المسؤوليات بعدالة وأقدم مساهمتي الفعالة في العمل الجماعي."
  },
  {
    "questionNumber": 53,
    "languageCode": "ml",
    "questionText": "പ്രയോജനപ്രദമായ എന്തെങ്കിലും ചെയ്യാനുണ്ടെങ്കിൽ, മറ്റുള്ളവർ പറയുന്നതുവരെ കാത്തുനിൽക്കാതെ അടുത്ത പടി നിർദ്ദേശിക്കാൻ എനിക്ക് കഴിയും."
  },
  {
    "questionNumber": 53,
    "languageCode": "hi",
    "questionText": "यदि कोई उपयोगी काम होना है, तो मैं दूसरों की प्रतीक्षा किए बिना अगला कदम सुझा सकता हूँ।"
  },
  {
    "questionNumber": 53,
    "languageCode": "ta",
    "questionText": "பயனுள்ள காரியம் எனில் மற்றவர்களுக்காகக் காத்திருக்காமல் அடுத்த படியை முன்மொழிய முடியும்."
  },
  {
    "questionNumber": 53,
    "languageCode": "kn",
    "questionText": "ಉಪಯುಕ್ತ ಕೆಲಸವಿದ್ದರೆ ಇತರರಿಗಾಗಿ ಕಾಯದೆ ಮುಂದಿನ ಹಂತವನ್ನು ಸೂಚಿಸಬಲ್ಲೆ."
  },
  {
    "questionNumber": 53,
    "languageCode": "ar",
    "questionText": "عند وجود مهمة مفيدة، أقترح الخطوة التالية فوراً دون انتظار توجيه من أحد."
  },
  {
    "questionNumber": 54,
    "languageCode": "ml",
    "questionText": "പ്രധാനപ്പെട്ട സ്കൂൾ പ്രവർത്തനങ്ങൾ സമയബന്ധിതമായി തീർക്കാൻ സമയം കൃത്യമായി പ്ലാൻ ചെയ്യാൻ എനിക്ക് സാധിക്കും."
  },
  {
    "questionNumber": 54,
    "languageCode": "hi",
    "questionText": "मैं अपने समय की ऐसी योजना बनाता हूँ जिससे स्कूल के ज़रूरी काम समय पर पूरे हो जाएँ।"
  },
  {
    "questionNumber": 54,
    "languageCode": "ta",
    "questionText": "பள்ளிப் பணிகளை உரிய நேரத்தில் முடிக்க நேரத்தைத் திட்டமிட முடியும்."
  },
  {
    "questionNumber": 54,
    "languageCode": "kn",
    "questionText": "ಶಾಲಾ ಕೆಲಸಗಳನ್ನು ಸಮಯಕ್ಕೆ ಸರಿಯಾಗಿ ಮುಗಿಸಲು ಸಮಯವನ್ನು ಯೋಜಿಸಬಲ್ಲೆ."
  },
  {
    "questionNumber": 54,
    "languageCode": "ar",
    "questionText": "أنظم وقتي بعناية لتسليم الواجبات المدرسية قبل موعدها المحدد."
  },
  {
    "questionNumber": 55,
    "languageCode": "ml",
    "questionText": "ശ്രേണിയിലെ അടുത്ത സംഖ്യ ഏതാണ്? 2, 5, 11, 23, 47, ?"
  },
  {
    "questionNumber": 55,
    "languageCode": "hi",
    "questionText": "श्रृंखला में अगली संख्या खोजें: 2, 5, 11, 23, 47, ?"
  },
  {
    "questionNumber": 55,
    "languageCode": "ta",
    "questionText": "வரிசையில் அடுத்த எண்ணைக் கண்டறியவும்: 2, 5, 11, 23, 47, ?"
  },
  {
    "questionNumber": 55,
    "languageCode": "kn",
    "questionText": "ಸರಣಿಯಲ್ಲಿ ಮುಂದಿನ ಸಂಖ್ಯೆಯನ್ನು ಕಂಡುಹಿಡಿಯಿರಿ: 2, 5, 11, 23, 47, ?"
  },
  {
    "questionNumber": 55,
    "languageCode": "ar",
    "questionText": "ما هو الرقم التالي في المتتالية: 2، 5، 11، 23، 47، ؟"
  },
  {
    "questionNumber": 56,
    "languageCode": "ml",
    "questionText": "എല്ലാ റിനോകളും നീലയാണ്. നീലയായ ഒരു വസ്തുവും മഞ്ഞയല്ല. താഴെ പറയുന്നവയിൽ ഏതാണ് തീർച്ചയായും ശരി?"
  },
  {
    "questionNumber": 56,
    "languageCode": "hi",
    "questionText": "सभी राइनो नीले हैं। कोई भी नीली वस्तु पीली नहीं है। निम्नलिखित में से क्या अनिवार्य रूप से सत्य है?"
  },
  {
    "questionNumber": 56,
    "languageCode": "ta",
    "questionText": "அனைத்து ரினோக்களும் நீல நிறம். எந்த நீல நிறப் பொருளும் மஞ்சள் அல்ல. இதில் எது உண்மை?"
  },
  {
    "questionNumber": 56,
    "languageCode": "kn",
    "questionText": "ಎಲ್ಲಾ ರಿನೋಗಳು ನೀಲಿ. ಯಾವುದೇ ನೀಲಿ ವಸ್ತು ಹಳದಿ ಅಲ್ಲ. ಇದರಲ್ಲಿ ಯಾವುದು ಸತ್ಯ?"
  },
  {
    "questionNumber": 56,
    "languageCode": "ar",
    "questionText": "جميع طيور الرينو زرقاء. لا يوجد أي مجسم أزرق لونه أصفر. أي العبارات التالية صحيحة حتماً؟"
  },
  {
    "questionNumber": 57,
    "languageCode": "ml",
    "questionText": "ചിത്ര ചോദ്യം — നൽകിയിട്ടുള്ള ചിഹ്നങ്ങളുടെ ക്രമം നിരീക്ഷിച്ച് അടുത്തതായി വരുന്ന ചിഹ്നം തിരഞ്ഞെടുക്കുക."
  },
  {
    "questionNumber": 57,
    "languageCode": "hi",
    "questionText": "चित्र प्रश्न — दृश्य अनुक्रम का विश्लेषण करें और अगली सही आकृति चुनें।"
  },
  {
    "questionNumber": 57,
    "languageCode": "ta",
    "questionText": "படக் கேள்வி — வடிவங்களின் வரிசையை ஆராய்ந்து அடுத்த சரியான படத்தைத் தேர்வுசெய்க."
  },
  {
    "questionNumber": 57,
    "languageCode": "kn",
    "questionText": "ಚಿತ್ರದ ಪ್ರಶ್ನೆ — ಮಾದರಿ ಚಿತ್ರವನ್ನು ಪರಿಶೀಲಿಸಿ ಮುಂದಿನ ಸರಿಯಾದ ಚಿತ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ."
  },
  {
    "questionNumber": 57,
    "languageCode": "ar",
    "questionText": "سؤال مرئي — حلل نمط الأشكال الهندسية التالي واختر الشكل المكمل لعلامة الاستفهام."
  },
  {
    "questionNumber": 58,
    "languageCode": "ml",
    "questionText": "ചിത്ര ചോദ്യം — വിഷ്വൽ മാട്രിക്സ് പരിശോധിച്ച് വിട്ടുപോയ കള്ളിക്ക് അനുയോജ്യമായ ചിത്രം തിരഞ്ഞെടുക്കുക."
  },
  {
    "questionNumber": 58,
    "languageCode": "hi",
    "questionText": "चित्र प्रश्न — दृश्य मैट्रिक्स का विश्लेषण करें और लुप्त बॉक्स के लिए सही आकृति चुनें।"
  },
  {
    "questionNumber": 58,
    "languageCode": "ta",
    "questionText": "படக் கேள்வி — கட்டக் காட்சியை ஆராய்ந்து விடுபட்ட சரியான கட்டத்தைத் தேர்வுசெய்க."
  },
  {
    "questionNumber": 58,
    "languageCode": "kn",
    "questionText": "ಚಿತ್ರದ ಪ್ರಶ್ನೆ — ವಿನ್ಯಾಸ ಮಾಟ್ರಿಕ್ಸ್ ಪರಿಶೀಲಿಸಿ ಬಿಟ್ಟುಹೋದ ಚೌಕಕ್ಕೆ ಸರಿಯಾದ ಚಿತ್ರವನ್ನು ಆರಿಸಿ."
  },
  {
    "questionNumber": 58,
    "languageCode": "ar",
    "questionText": "سؤال مرئي — حلل المصفوفة البصرية واختر المربع الصحيح المكمل للنمط."
  },
  {
    "questionNumber": 59,
    "languageCode": "ml",
    "questionText": "ഒരു പെട്ടിയിൽ 24 പെൻസിലുകളുണ്ട്. അതിൽ മൂന്നിലൊന്ന് (1/3) ചുവപ്പാണ്. എങ്കിൽ എത്ര ചുവപ്പ് പെൻസിലുകളുണ്ട്?"
  },
  {
    "questionNumber": 59,
    "languageCode": "hi",
    "questionText": "एक डिब्बे में 24 पेंसिलें हैं। एक तिहाई (1/3) लाल हैं। कुल कितनी लाल पेंसिलें हैं?"
  },
  {
    "questionNumber": 59,
    "languageCode": "ta",
    "questionText": "ஒரு பெட்டியில் 24 பென்சில்கள் உள்ளன. மூன்றில் ஒரு பங்கு (1/3) சிவப்பு எனில் எத்தனை சிவப்பு பென்சில்கள்?"
  },
  {
    "questionNumber": 59,
    "languageCode": "kn",
    "questionText": "ಒಂದು ಪೆಟ್ಟಿಗೆಯಲ್ಲಿ 24 ಪೆನ್ಸಿಲ್‌ಗಳಿವೆ. ಮೂರನೇ ಒಂದು ಭಾಗ (1/3) ಕೆಂಪು ಬಣ್ಣದ್ದಾಗಿದೆ. ಒಟ್ಟು ಎಷ್ಟು ಕೆಂಪು ಪೆನ್ಸಿಲ್‌ಗಳಿವೆ?"
  },
  {
    "questionNumber": 59,
    "languageCode": "ar",
    "questionText": "صندوق يحتوي على 24 قلماً، ثلثها (1/3) أحمر. كم عدد الأقلام الحمراء؟"
  },
  {
    "questionNumber": 60,
    "languageCode": "ml",
    "questionText": "നാല് നോട്ടുപുസ്തകങ്ങൾക്ക് ₹120 വിലയുണ്ട്. ഇതേ നിരക്കിൽ ഏഴ് നോട്ടുപുസ്തകങ്ങൾക്ക് എത്ര രൂപയാകും?"
  },
  {
    "questionNumber": 60,
    "languageCode": "hi",
    "questionText": "चार कॉपियों की कीमत ₹120 है। इसी दर पर सात कॉपियों की कीमत कितनी होगी?"
  },
  {
    "questionNumber": 60,
    "languageCode": "ta",
    "questionText": "நான்கு நோட்டுப் புத்தகங்களின் விலை ₹120. அதே விலையில் ஏழு நோட்டுப் புத்தகங்களின் விலை என்ன?"
  },
  {
    "questionNumber": 60,
    "languageCode": "kn",
    "questionText": "ನಾಲ್ಕು ಪುಸ್ತಕಗಳ ಬೆಲೆ ₹120. ಅದೇ ದರದಲ್ಲಿ ಏಳು ಪುಸ್ತಕಗಳ ಬೆಲೆ ಎಷ್ಟು?"
  },
  {
    "questionNumber": 60,
    "languageCode": "ar",
    "questionText": "أربعة دفاتر سعرها 120 جنيهاً/ريالاً. بنفس السعر، كم تكلفة سبعة دفاتر؟"
  },
  {
    "questionNumber": 61,
    "languageCode": "ml",
    "questionText": "40 വിദ്യാർത്ഥികളിൽ അഞ്ചിൽ മൂന്ന് (3/5) ഭാഗം കുട്ടികൾ ഒരു ക്ലബ്ബിൽ ചേർന്നു. എങ്കിൽ എത്ര കുട്ടികളാണ് ചേർന്നത്?"
  },
  {
    "questionNumber": 61,
    "languageCode": "hi",
    "questionText": "40 छात्रों में से 3/5 छात्र एक क्लब में शामिल हुए। कुल कितने छात्र शामिल हुए?"
  },
  {
    "questionNumber": 61,
    "languageCode": "ta",
    "questionText": "40 மாணவர்களில் 3/5 பங்கு மாணவர்கள் மன்றத்தில் இணைந்தனர். எத்தனை பேர் இணைந்தனர்?"
  },
  {
    "questionNumber": 61,
    "languageCode": "kn",
    "questionText": "40 ವಿದ್ಯಾರ್ಥಿಗಳಲ್ಲಿ 3/5 ರಷ್ಟು ವಿದ್ಯಾರ್ಥಿಗಳು ಕ್ಲಬ್‌ಗೆ ಸೇರಿದರು. ಎಷ್ಟು ವಿದ್ಯಾರ್ಥಿಗಳು ಸೇರಿದರು?"
  },
  {
    "questionNumber": 61,
    "languageCode": "ar",
    "questionText": "اشترك ثلاثة أخماس (3/5) من أصل 40 طالباً في نادٍ مدرسي. كم عدد الطلاب المشتركين؟"
  },
  {
    "questionNumber": 62,
    "languageCode": "ml",
    "questionText": "ഒരേപോലെയുള്ള 6 സ്റ്റിക്കറുകൾക്ക് ₹90 ആണ് വില. ഇതേ നിരക്കിൽ 10 സ്റ്റിക്കറുകൾക്ക് എത്ര രൂപയാകും?"
  },
  {
    "questionNumber": 62,
    "languageCode": "hi",
    "questionText": "छह समान स्टिकर ₹90 के आते हैं। इसी दर पर दस स्टिकर कितने के होंगे?"
  },
  {
    "questionNumber": 62,
    "languageCode": "ta",
    "questionText": "6 ஸ்டிக்கர்களின் விலை ₹90 எனில் 10 ஸ்டிக்கர்களின் விலை என்ன?"
  },
  {
    "questionNumber": 62,
    "languageCode": "kn",
    "questionText": "6 ಸ್ಟಿಕ್ಕರ್‌ಗಳ ಬೆಲೆ ₹90 ಆದರೆ 10 ಸ್ಟಿಕ್ಕರ್‌ಗಳ ಬೆಲೆ ಎಷ್ಟು?"
  },
  {
    "questionNumber": 62,
    "languageCode": "ar",
    "questionText": "ست ملصقات متطابقة تكلف 90 ريالاً. بنفس المعدل، كم تكلفة عشرة ملصقات؟"
  },
  {
    "questionNumber": 63,
    "languageCode": "ml",
    "questionText": "പുസ്തകം വായനയുമായി ബന്ധപ്പെട്ടിരിക്കുന്നു. എങ്കിൽ ഫോർക്ക് (FORK) എന്തുമായി ബന്ധപ്പെട്ടിരിക്കുന്നു?"
  },
  {
    "questionNumber": 63,
    "languageCode": "hi",
    "questionText": "किताब का संबंध पढ़ने से है। काँटे (FORK) का संबंध किससे है?"
  },
  {
    "questionNumber": 63,
    "languageCode": "ta",
    "questionText": "புத்தகம் வாசிப்புடன் தொடர்புடையது. முட்கரண்டி (FORK) எதனுடன் தொடர்புடையது?"
  },
  {
    "questionNumber": 63,
    "languageCode": "kn",
    "questionText": "ಪುಸ್ತಕವು ಓದುವಿಕೆಗೆ ಸಂಬಂಧಿಸಿದೆ. ಫೋರ್ಕ್ (FORK) ಯಾವುದಕ್ಕೆ ಸಂಬಂಧಿಸಿದೆ?"
  },
  {
    "questionNumber": 63,
    "languageCode": "ar",
    "questionText": "الكتاب يرتبط بالقراءة. الشوكة (FORK) ترتبط بـ:"
  },
  {
    "questionNumber": 64,
    "languageCode": "ml",
    "questionText": "അരുൺ പറഞ്ഞു: 'രാത്രിയിൽ കനത്ത മഴ പെയ്തതുകൊണ്ടാണ് ഫുട്ബോൾ മൈതാനം നനഞ്ഞിരിക്കുന്നത്.' താഴെ പറയുന്നവയിൽ ഏത് പ്രസ്താവനയാണ് ശരി?"
  },
  {
    "questionNumber": 64,
    "languageCode": "hi",
    "questionText": "अरुण ने कहा: 'रात में भारी बारिश होने के कारण फुटबॉल मैदान गीला है।' कौन सा कथन सत्य है?"
  },
  {
    "questionNumber": 64,
    "languageCode": "ta",
    "questionText": "அருண்: 'இரவில் கனமழை பெய்ததால் மைதானம் ஈரமாக உள்ளது.' எந்தக் கூற்று சரியானது?"
  },
  {
    "questionNumber": 64,
    "languageCode": "kn",
    "questionText": "ಅರುಣ್: 'ರಾತ್ರಿ ಭಾರಿ ಮಳೆಯಾದ ಕಾರಣ ಫುಟ್ಬಾಲ್ ಮೈದಾನ ಒದ್ದೆಯಾಗಿದೆ.' ಯಾವ ಹೇಳಿಕೆ ಸರಿ?"
  },
  {
    "questionNumber": 64,
    "languageCode": "ar",
    "questionText": "قال أحمد: 'ملعب كرة القدم مبلل لأن الأمطار هطلت بغزارة أثناء الليل.' أي استنتاج مدعوم؟"
  },
  {
    "questionNumber": 65,
    "languageCode": "ml",
    "questionText": "കയ്യുറ (GLOVE) കൈയ്യുമായി ബന്ധപ്പെട്ടിരിക്കുന്നു. എങ്കിൽ ഷൂ (SHOE) എന്തുമായി ബന്ധപ്പെട്ടിരിക്കുന്നു?"
  },
  {
    "questionNumber": 65,
    "languageCode": "hi",
    "questionText": "दस्ताने (GLOVE) का संबंध हाथ से है। जूते (SHOE) का संबंध किससे है?"
  },
  {
    "questionNumber": 65,
    "languageCode": "ta",
    "questionText": "கையுறை கைக்குரியது. காலணி (SHOE) எதற்குரியது?"
  },
  {
    "questionNumber": 65,
    "languageCode": "kn",
    "questionText": "ಕೈಗವಸು ಕೈಗೆ ಸಂಬಂಧಿಸಿದೆ. ಶೂ (SHOE) ಯಾವುದಕ್ಕೆ ಸಂಬಂಧಿಸಿದೆ?"
  },
  {
    "questionNumber": 65,
    "languageCode": "ar",
    "questionText": "القفاز يرتبط باليد. الحذاء يرتبط بـ:"
  },
  {
    "questionNumber": 66,
    "languageCode": "ml",
    "questionText": "ലൈബ്രറി പുസ്തകം സമയത്തിന് തിരികെ നൽകണം എന്നതുകൊണ്ട് മായ വെള്ളിയാഴ്ചയ്ക്ക് മുൻപ് പുസ്തകം വായിച്ചുതീർത്തു. ഇതിൽ നിന്ന് മനസ്സിലാക്കാവുന്ന ഏറ്റവും ശരിയായ കാര്യം ഏതാണ്?"
  },
  {
    "questionNumber": 66,
    "languageCode": "hi",
    "questionText": "माया ने समय पर लौटाने के लिए शुक्रवार से पहले ही अपनी लाइब्रेरी की किताब पढ़ ली। सबसे सटीक निष्कर्ष क्या है?"
  },
  {
    "questionNumber": 66,
    "languageCode": "ta",
    "questionText": "மாயா நூலகப் புத்தகத்தை உரிய நேரத்தில் திருப்பியளிக்க வெள்ளிக்கிழமைக்கு முன்பே படித்து முடித்தார். சரியான முடிவு என்ன?"
  },
  {
    "questionNumber": 66,
    "languageCode": "kn",
    "questionText": "ಮಾಯಾ ಗ್ರಂಥಾಲಯದ ಪುಸ್ತಕವನ್ನು ಸಮಯಕ್ಕೆ ಹಿಂತಿರುಗಿಸಲು ಶುಕ್ರವಾರದ ಮುಂಚೆಯೇ ಓದಿ ಮುಗಿಸಿದಳು. ಸರಿಯಾದ ತೀರ್ಮಾನ ಯಾವುದು?"
  },
  {
    "questionNumber": 66,
    "languageCode": "ar",
    "questionText": "أنهت مريم قراءة كتاب المكتبة قبل يوم الجمعة لرغبتها في إعادته في الوقت المحدد. ما هو أفضل استنتاج؟"
  },
  {
    "questionNumber": 67,
    "languageCode": "ml",
    "questionText": "നിങ്ങൾ വടക്കോട്ട് (North) നോക്കി നിൽക്കുന്നു. വലത്തോട്ട് തിരിയുക, പിന്നീട് ഇടത്തോട്ട്, വീണ്ടും ഇടത്തോട്ട് തിരിയുക. ഇപ്പോൾ നിങ്ങൾ ഏത് ദിശയിലേക്കാണ് നോക്കുന്നത്?"
  },
  {
    "questionNumber": 67,
    "languageCode": "hi",
    "questionText": "आप उत्तर (North) की ओर मुँह करके खड़े हैं। दाएँ मुड़ें, फिर बाएँ, फिर दोबारा बाएँ मुड़ें। अब आपका मुँह किस दिशा में है?"
  },
  {
    "questionNumber": 67,
    "languageCode": "ta",
    "questionText": "நீங்கள் வடக்கு நோக்கி நிற்கிறீர்கள். வலதுபுறம் திரும்பி, பின் இடது, மீண்டும் இடதுபுறம் திரும்பினால் எந்த திசையை நோக்குகிறீர்கள்?"
  },
  {
    "questionNumber": 67,
    "languageCode": "kn",
    "questionText": "ನೀವು ಉತ್ತರಕ್ಕೆ ಮುಖ ಮಾಡಿ ನಿಂತಿದ್ದೀರಿ. ಬಲಕ್ಕೆ ತಿರುಗಿ, ನಂತರ ಎಡಕ್ಕೆ, ಮತ್ತೆ ಎಡಕ್ಕೆ ತಿರುಗಿದರೆ ಈಗ ಯಾವ ದಿಕ್ಕಿನಲ್ಲಿದ್ದೀರಿ?"
  },
  {
    "questionNumber": 67,
    "languageCode": "ar",
    "questionText": "أنت تواجه الشمال. اتجهت يميناً، ثم يساراً، ثم يساراً مرة أخرى. إلى أي اتجاه تنظر الآن؟"
  },
  {
    "questionNumber": 68,
    "languageCode": "ml",
    "questionText": "ചിത്ര ചോദ്യം — നൽകിയിട്ടുള്ള ചിത്രം തിരിച്ചുവെച്ചാൽ (Rotation) മാത്രം ലഭിക്കുന്ന രൂപം ഏതാണ്? (കണ്ണാടി പ്രതിബിംബം ആകരുത്)"
  },
  {
    "questionNumber": 68,
    "languageCode": "hi",
    "questionText": "चित्र प्रश्न — दिए गए 3D ब्लॉक को केवल घूर्णन (Rotation) के बाद कौन सी छवि सही दर्शाती है?"
  },
  {
    "questionNumber": 68,
    "languageCode": "ta",
    "questionText": "படக் கேள்வி — கொடுக்கப்பட்ட 3D உருவத்தை சுழற்றினால் மட்டும் கிடைக்கும் வடிவம் எது?"
  },
  {
    "questionNumber": 68,
    "languageCode": "kn",
    "questionText": "ಚಿತ್ರದ ಪ್ರಶ್ನೆ — ನೀಡಲಾದ 3D ಚಿತ್ರವನ್ನು ತಿರುಗಿಸಿದಾಗ ಮಾತ್ರ ಸಿಗುವ ಚಿತ್ರ ಯಾವುದು?"
  },
  {
    "questionNumber": 68,
    "languageCode": "ar",
    "questionText": "سؤال مرئي — أي الخيارات يمثل دوران المجسم ثلاثي الأبعاد فقط بزاوية 90 درجة (وليس انعكاساً)؟"
  },
  {
    "questionNumber": 69,
    "languageCode": "ml",
    "questionText": "ചിത്ര ചോദ്യം — ഒരു കടലാസ് മടക്കി തുളയിട്ടിരിക്കുന്നു. കടലാസ് നിവർത്തുമ്പോൾ ഏത് രൂപമായിരിക്കും ലഭിക്കുക?"
  },
  {
    "questionNumber": 69,
    "languageCode": "hi",
    "questionText": "चित्र प्रश्न — एक कागज़ को मोड़कर उसमें छेद किया गया। खोलने पर कौन सा पैटर्न दिखाई देगा?"
  },
  {
    "questionNumber": 69,
    "languageCode": "ta",
    "questionText": "படக் கேள்வி — காகிதத்தை மடித்து துளையிட்டால் விரிக்கும்போது எந்த வடிவம் கிடைக்கும்?"
  },
  {
    "questionNumber": 69,
    "languageCode": "kn",
    "questionText": "ಚಿತ್ರದ ಪ್ರಶ್ನೆ — ಕಾಗದವನ್ನು ಮಡಚಿ ರಂಧ್ರ ಕೊರೆದರೆ, ಬಿಡಿಸಿದಾಗ ಯಾವ ಮಾದರಿ ಕಾಣುತ್ತದೆ?"
  },
  {
    "questionNumber": 69,
    "languageCode": "ar",
    "questionText": "سؤال مرئي — طويت ورقة مربعة وثُقبت. أي الأشكال يمثل الورقة بعد فتحها؟"
  },
  {
    "questionNumber": 70,
    "languageCode": "ml",
    "questionText": "ഒരു റോബോട്ട് ഒരു ഗ്രിഡിന്റെ മധ്യത്തിൽ നിന്ന് 2 കള്ളികൾ കിഴക്കോട്ടും (East) പിന്നീട് 1 കള്ളി വടക്കോട്ടും (North) നീങ്ങി. തുടക്ക സ്ഥാനവുമായി താരതമ്യം ചെയ്യുമ്പോൾ ഇപ്പോൾ റോബോട്ട് ഏത് ദിശയിലാണ്?"
  },
  {
    "questionNumber": 70,
    "languageCode": "hi",
    "questionText": "एक रोबोट ग्रिड के केंद्र से 2 वर्ग पूर्व (East) और फिर 1 वर्ग उत्तर (North) चलता है। प्रारंभिक बिंदु से वह किस दिशा में है?"
  },
  {
    "questionNumber": 70,
    "languageCode": "ta",
    "questionText": "ஒரு ரோபோ நடுவிலிருந்து 2 கட்டங்கள் கிழக்கு நோக்கியும் 1 கட்டம் வடக்கு நோக்கியும் நகர்ந்தால் அது எங்குள்ளது?"
  },
  {
    "questionNumber": 70,
    "languageCode": "kn",
    "questionText": "ರೋಬೋಟ್ ಮಧ್ಯದಿಂದ 2 ಚೌಕ ಪೂರ್ವಕ್ಕೆ ಮತ್ತು 1 ಚೌಕ ಉತ್ತರಕ್ಕೆ ಚಲಿಸಿದರೆ ಪ್ರಾರಂಭದ ಬಿಂದುವಿನಿಂದ ಯಾವ ದಿಕ್ಕಿನಲ್ಲಿದೆ?"
  },
  {
    "questionNumber": 70,
    "languageCode": "ar",
    "questionText": "تحرك روبوت من منتصف الشبكة مربعين نحو الشرق (East) ثم مربعاً نحو الشمال (North). أين موقعه مقارنة بالبداية؟"
  },
  {
    "questionNumber": 71,
    "languageCode": "ml",
    "questionText": "ബാറ്ററി ഉപയോഗിച്ച് പ്രവർത്തിക്കുന്ന ഒരു ടോർച്ച് പെട്ടെന്ന് പ്രവർത്തനരഹിതമായി. നിങ്ങൾ ആദ്യം എന്താണ് പരിശോധിക്കേണ്ടത്?"
  },
  {
    "questionNumber": 71,
    "languageCode": "hi",
    "questionText": "एक टॉर्च अचानक काम करना बंद कर देती है। आपको सबसे पहले क्या जाँचना चाहिए?"
  },
  {
    "questionNumber": 71,
    "languageCode": "ta",
    "questionText": "டார்ச் லைட் திடீரென அணைந்துவிட்டால் முதலில் எதைச் சோதிக்க வேண்டும்?"
  },
  {
    "questionNumber": 71,
    "languageCode": "kn",
    "questionText": "ಟಾರ್ಚ್ ಇದ್ದಕ್ಕಿದ್ದಂತೆ ಕೆಲಸ ಮಾಡುವುದನ್ನು ನಿಲ್ಲಿಸಿದರೆ ಮೊದಲು ಏನನ್ನು ಪರಿಶೀಲಿಸಬೇಕು?"
  },
  {
    "questionNumber": 71,
    "languageCode": "ar",
    "questionText": "توقف مصباح يدوي يعمل بالبطارية عن العمل فجأة. ما هو أول شيء يجب فحصه؟"
  },
  {
    "questionNumber": 72,
    "languageCode": "ml",
    "questionText": "സൈക്കിൾ ചെയിൻ ഇടയ്ക്കിടെ ഊരിപ്പോകുന്നു. ഇത് പരിഹരിക്കാനുള്ള ഏറ്റവും നല്ല ആദ്യ പടി എന്താണ്?"
  },
  {
    "questionNumber": 72,
    "languageCode": "hi",
    "questionText": "साइकिल की चेन बार-बार फिसल कर उतर जाती है। सबसे पहला सही कदम क्या है?"
  },
  {
    "questionNumber": 72,
    "languageCode": "ta",
    "questionText": "சைக்கிள் செயின் அடிக்கடி கழன்று விடுகிறது. சரியான முதல் படி என்ன?"
  },
  {
    "questionNumber": 72,
    "languageCode": "kn",
    "questionText": "ಸೈಕಲ್ ಚೈನ್ ಪದೇ ಪದೇ ಜಾರುತ್ತಿದ್ದರೆ ಮೊದಲು ಮಾಡಬೇಕಾದ ಸರಿಯಾದ ಕ್ರಮ ಯಾವುದು?"
  },
  {
    "questionNumber": 72,
    "languageCode": "ar",
    "questionText": "سلسلة الدراجة تنفلت باستمرار. ما هي أفضل خطوة أولى للإصلاح؟"
  },
  {
    "questionNumber": 73,
    "languageCode": "ml",
    "questionText": "60 സെക്കൻഡ് ചലഞ്ച്: ഒരു പേപ്പർ കപ്പ് ഉപയോഗിച്ച് ചെയ്യാൻ കഴിയുന്ന വ്യത്യസ്തവും വിചിത്രവുമായ ഉപയോഗങ്ങൾ കഴിയുന്നത്ര എഴുതുക."
  },
  {
    "questionNumber": 73,
    "languageCode": "hi",
    "questionText": "60 सेकंड की चुनौती: एक खाली कागज़ के कप के जितने संभव हो उतने नए और रचनात्मक उपयोग लिखें।"
  },
  {
    "questionNumber": 73,
    "languageCode": "ta",
    "questionText": "60 வினாடி சவால்: காகிதக் குவளையின் 4 புதிய மற்றும் பயனுள்ள பயன்பாடுகளை எழுதுக."
  },
  {
    "questionNumber": 73,
    "languageCode": "kn",
    "questionText": "60 ಸೆಕೆಂಡುಗಳ ಸವಾಲು: ಪೇಪರ್ ಕಪ್‌ನ 4 ಹೊಸ ಮತ್ತು ಉಪಯುಕ್ತ ಉಪಯೋಗಗಳನ್ನು ಬರೆಯಿರಿ."
  },
  {
    "questionNumber": 73,
    "languageCode": "ar",
    "questionText": "تحدي 60 ثانية: اذكر 4 استخدامات جديدة ومبتكرة للأكواب الورقية المستعملة."
  },
  {
    "questionNumber": 74,
    "languageCode": "ml",
    "questionText": "60 സെക്കൻഡ് ചലഞ്ച്: ഉപയോഗശൂന്യമായ ഒരു കാർഡ്ബോർഡ് പെട്ടി ഉപയോഗിച്ച് നിർമ്മിക്കാൻ കഴിയുന്ന വ്യത്യസ്തവും ഉപകാരപ്രദവുമായ കാര്യങ്ങൾ എഴുതുക."
  },
  {
    "questionNumber": 74,
    "languageCode": "hi",
    "questionText": "60 सेकंड की चुनौती: एक खाली गत्ते के डिब्बे से बनाई जा सकने वाली उपयोगी वस्तुओं की सूची बनाएँ।"
  },
  {
    "questionNumber": 74,
    "languageCode": "ta",
    "questionText": "60 வினாடி சவால்: அட்டைப் பெட்டியிலிருந்து உருவாக்கக்கூடிய பயனுள்ள பொருட்களைப் பட்டியலிடுக."
  },
  {
    "questionNumber": 74,
    "languageCode": "kn",
    "questionText": "60 ಸೆಕೆಂಡುಗಳ ಸವಾಲು: ರಟ್ಟಿನ ಪೆಟ್ಟಿಗೆಯಿಂದ ಮಾಡಬಹುದಾದ ಉಪಯುಕ್ತ ವಸ್ತುಗಳನ್ನು ಪಟ್ಟಿ ಮಾಡಿ."
  },
  {
    "questionNumber": 74,
    "languageCode": "ar",
    "questionText": "تحدي 60 ثانية: فكر في أشياء مفيدة يمكن ابتكارها من صندوق كرتوني فارغ."
  },
  {
    "questionNumber": 75,
    "languageCode": "ml",
    "questionText": "ഒരു ഗ്രൂപ്പിലെ രണ്ട് അംഗങ്ങൾ തമ്മിൽ തങ്ങളുടെ ആശയത്തെച്ചൊല്ലി ശക്തമായി വിയോജിക്കുന്നു. ഇവിടെ ചെയ്യേണ്ട ഏറ്റവും നല്ല ആദ്യ പടി എന്താണ്?"
  },
  {
    "questionNumber": 75,
    "languageCode": "hi",
    "questionText": "समूह के दो सदस्य असहमत हैं और दोनों चाहते हैं कि उनका विचार चुना जाए। सबसे पहला सही कदम क्या है?"
  },
  {
    "questionNumber": 75,
    "languageCode": "ta",
    "questionText": "இரு குழு உறுப்பினர்கள் தங்கள் யோசனையைத் தேர்வுசெய்ய வாதிடுகின்றனர். சிறந்த முதல் நடவடிக்கை என்ன?"
  },
  {
    "questionNumber": 75,
    "languageCode": "kn",
    "questionText": "ತಂಡದ ಇಬ್ಬರು ಸದಸ್ಯರು ಭಿನ್ನಾಭಿಪ್ರಾಯ ಹೊಂದಿದ್ದರೆ ಮಾಡಬೇಕಾದ ಅತ್ಯುತ್ತಮ ಮೊದಲ ಕ್ರಮ ಯಾವುದು?"
  },
  {
    "questionNumber": 75,
    "languageCode": "ar",
    "questionText": "اختلف عضوان في الفريق حول فكرتيهما. ما هو أفضل تصرف أولي؟"
  },
  {
    "questionNumber": 76,
    "languageCode": "ml",
    "questionText": "ക്ലാസ്സിൽ പുതുതായി വന്ന ഒരു വിദ്യാർത്ഥി മിണ്ടാതിരിക്കുകയും ഗ്രൂപ്പ് പ്രവർത്തനത്തിൽ നിന്ന് ഒഴിവാക്കപ്പെടുകയും ചെയ്യുന്നു. നിങ്ങളുടെ ഏറ്റവും നല്ല പ്രതികരണം എന്തായിരിക്കണം?"
  },
  {
    "questionNumber": 76,
    "languageCode": "hi",
    "questionText": "एक नया छात्र शांत है और समूह गतिविधि में शामिल नहीं हो पा रहा है। सबसे अच्छी प्रतिक्रिया क्या होगी?"
  },
  {
    "questionNumber": 76,
    "languageCode": "ta",
    "questionText": "ஒரு புதிய மாணவர் அமைதியாகத் தனித்து விடப்பட்டுள்ளார். சிறந்த பதில் என்ன?"
  },
  {
    "questionNumber": 76,
    "languageCode": "kn",
    "questionText": "ಹೊಸ ವಿದ್ಯಾರ್ಥಿ ಶಾಂತವಾಗಿದ್ದು ತಂಡದ ಚಟುವಟಿಕೆಯಿಂದ ಹೊರಗುಳಿದಿದ್ದರೆ ಅತ್ಯುತ್ತಮ ಪ್ರತಿಕ್ರಿಯೆ ಯಾವುದು?"
  },
  {
    "questionNumber": 76,
    "languageCode": "ar",
    "questionText": "طالب جديد في الصف يشعر بالخجل وتم استبعاده من النشاط الجماعي. ما هي أفضل استجابة؟"
  },
  {
    "questionNumber": 77,
    "languageCode": "ml",
    "questionText": "നാളെ സമർപ്പിക്കേണ്ട ഗൃഹപാഠം, ഇന്ന് രാത്രിയുള്ള കായിക പരിശീലനം, അടുത്ത ആഴ്ച സമർപ്പിക്കേണ്ട പ്രോജക്റ്റ് എന്നിവയുണ്ട്. ഏറ്റവും മികച്ച സമീപനം ഏതാണ്?"
  },
  {
    "questionNumber": 77,
    "languageCode": "hi",
    "questionText": "कल गृहकार्य जमा करना है, आज रात खेल अभ्यास है और अगले सप्ताह प्रोजेक्ट जमा करना है। सबसे अच्छा तरीका क्या है?"
  },
  {
    "questionNumber": 77,
    "languageCode": "ta",
    "questionText": "நாளை வீட்டுப்பாடம், இன்று விளையாட்டுப் பயிற்சி, அடுத்த வாரம் திட்டப்பணி உள்ளது. சிறந்த அணுகுமுறை எது?"
  },
  {
    "questionNumber": 77,
    "languageCode": "kn",
    "questionText": "ನಾಳೆ ಮನೆಗೆಲಸ, ಇಂದು ರಾತ್ರಿ ಕ್ರೀಡಾ ತಾಲೀಮು, ಮುಂದಿನ ವಾರ ಪ್ರಾಜೆಕ್ಟ್ ಇದೆ. ಅತ್ಯುತ್ತಮ ವಿಧಾನ ಯಾವುದು?"
  },
  {
    "questionNumber": 77,
    "languageCode": "ar",
    "questionText": "لديك واجب دراسي لغد، وتدريب رياضي الليلة، ومشروع للأسبوع القادم. ما هو أفضل تصرف؟"
  },
  {
    "questionNumber": 78,
    "languageCode": "ml",
    "questionText": "പഠിക്കാൻ നിങ്ങൾക്ക് 60 മിനിറ്റുണ്ട്: നാളത്തേക്കുള്ള 20 മിനിറ്റ് പുനരവലോകനം (Revision), രണ്ടു ദിവസത്തിനകം സമർപ്പിക്കേണ്ട 25 മിനിറ്റ് അസൈൻമെന്റ്, താല്പര്യമുള്ള വായന എന്നിവ. ഇതിൽ ഏറ്റവും മികച്ച പ്ലാൻ ഏതാണ്?"
  },
  {
    "questionNumber": 78,
    "languageCode": "hi",
    "questionText": "पढ़ाई के लिए 60 मिनट हैं: कल के लिए 20 मिनट का दोहराव, दो दिन में जमा होने वाला 25 मिनट का असाइनमेंट। सबसे अच्छी योजना क्या है?"
  },
  {
    "questionNumber": 78,
    "languageCode": "ta",
    "questionText": "படிக்க 60 நிமிடங்கள் உள்ளன: அவசரப் பாடம் 20 நிமிடம், வீட்டுப்பாடம் 25 நிமிடம். சிறந்த திட்டம் எது?"
  },
  {
    "questionNumber": 78,
    "languageCode": "kn",
    "questionText": "ಓದಲು 60 ನಿಮಿಷಗಳಿವೆ: ತುರ್ತು ರಿವಿಷನ್ 20 ನಿಮಿಷ, ಅಸೈನ್‌ಮೆಂಟ್ 25 ನಿಮಿಷ. ಅತ್ಯುತ್ತಮ ಯೋಜನೆ ಯಾವುದು?"
  },
  {
    "questionNumber": 78,
    "languageCode": "ar",
    "questionText": "لديك 60 دقيقة للدراسة: مراجعة عاجلة 20 دقيقة، وواجب يستغرق 25 دقيقة. ما هي أفضل خطة؟"
  },
  {
    "questionNumber": 79,
    "languageCode": "ml",
    "questionText": "എനിക്ക് താല്പര്യമുള്ള എന്തെങ്കിലും കണ്ടാൽ, അതിനെക്കുറിച്ച് കൂടുതൽ അറിയാൻ ഞാൻ ആഗ്രഹിക്കുന്നു."
  },
  {
    "questionNumber": 79,
    "languageCode": "hi",
    "questionText": "जब किसी चीज़ में मेरी रुचि होती है, तो मैं उसके बारे में अधिक से अधिक जानना चाहता हूँ।"
  },
  {
    "questionNumber": 79,
    "languageCode": "ta",
    "questionText": "ஆர்வமுள்ள தலைப்பைப் பற்றி அதிகம் தெரிந்துகொள்ள விரும்புகிறேன்."
  },
  {
    "questionNumber": 79,
    "languageCode": "kn",
    "questionText": "ಆಸಕ್ತಿದಾಯಕ ವಿಷಯದ ಬಗ್ಗೆ ಹೆಚ್ಚು ತಿಳಿದುಕೊಳ್ಳಲು ಬಯಸುತ್ತೇನೆ."
  },
  {
    "questionNumber": 79,
    "languageCode": "ar",
    "questionText": "عندما يثير موضوع ما اهتمامي، أسعى لمعرفة المزيد عنه بحماس."
  },
  {
    "questionNumber": 80,
    "languageCode": "ml",
    "questionText": "ഒരു കാര്യം പ്രയാസകരമാണെങ്കിലും, അത് പൂർത്തിയാക്കാൻ ഞാൻ വീണ്ടും വീണ്ടും പരിശ്രമിക്കാറുണ്ട്."
  },
  {
    "questionNumber": 80,
    "languageCode": "hi",
    "questionText": "जब कोई कार्य कठिन होता है, तो मैं लगातार प्रयास करता रहता हूँ।"
  },
  {
    "questionNumber": 80,
    "languageCode": "ta",
    "questionText": "கடினமான பணிகளிலும் தொடர்ந்து முயற்சி செய்ய விரும்புகிறேன்."
  },
  {
    "questionNumber": 80,
    "languageCode": "kn",
    "questionText": "ಕಷ್ಟಕರವಾದ ಕೆಲಸಗಳಲ್ಲೂ ನಿರಂತರ ಪ್ರಯತ್ನ ಮುಂದುವರಿಸುತ್ತೇನೆ."
  },
  {
    "questionNumber": 80,
    "languageCode": "ar",
    "questionText": "عندما تكون المهمة صعبة، أواصل المحاولة بإصرار حتى أنجزها."
  },
  {
    "questionNumber": 81,
    "languageCode": "ml",
    "questionText": "ഒരു വഴി വിജയിച്ചില്ലെങ്കിൽ, മറ്റൊരു രീതി സ്വീകരിക്കാൻ എനിക്ക് എളുപ്പമാണ്."
  },
  {
    "questionNumber": 81,
    "languageCode": "hi",
    "questionText": "यदि एक तरीका काम नहीं करता, तो मैं आसानी से अपना दृष्टिकोण बदल लेता हूँ।"
  },
  {
    "questionNumber": 81,
    "languageCode": "ta",
    "questionText": "ஒரு வழி பலனளிக்கவில்லை என்றால் மாற்று வழியை எளிதில் ஏற்பேன்."
  },
  {
    "questionNumber": 81,
    "languageCode": "kn",
    "questionText": "ಒಂದು ವಿಧಾನ ಫಲ ನೀಡದಿದ್ದರೆ ಬೇರೆ ವಿಧಾನವನ್ನು ಸುಲಭವಾಗಿ ಅಳವಡಿಸಿಕೊಳ್ಳುತ್ತೇನೆ."
  },
  {
    "questionNumber": 81,
    "languageCode": "ar",
    "questionText": "إذا لم تنجح طريقة معينة، أغيّر أسلوبي بمرونة وسرعة."
  },
  {
    "questionNumber": 82,
    "languageCode": "ml",
    "questionText": "ഉപകാരപ്രദമായ എന്തെങ്കിലും ചെയ്യാനുണ്ടെങ്കിൽ, ആരും പറയാതെ തന്നെ സ്വന്തമായി തുടങ്ങാൻ എനിക്ക് കഴിയും."
  },
  {
    "questionNumber": 82,
    "languageCode": "hi",
    "questionText": "यदि मुझे कोई उपयोगी काम दिखाई दे, तो मैं बिना कहे ही उसे शुरू कर सकता हूँ।"
  },
  {
    "questionNumber": 82,
    "languageCode": "ta",
    "questionText": "பயனுள்ள பணியை யாரும் கூறாமலே சுயமாகத் தொடங்க முடியும்."
  },
  {
    "questionNumber": 82,
    "languageCode": "kn",
    "questionText": "ಉಪಯುಕ್ತ ಕೆಲಸವನ್ನು ಯಾರೂ ಹೇಳದಿದ್ದರೂ ನಾನೇ ಪ್ರಾರಂಭಿಸಬಲ್ಲೆ."
  },
  {
    "questionNumber": 82,
    "languageCode": "ar",
    "questionText": "إذا رأيت عملاً مفيداً، أبدأ في تنفيذه ذاتياً دون انتظار طلب من أحد."
  },
  {
    "questionNumber": 83,
    "languageCode": "ml",
    "questionText": "മറ്റുള്ളവരുടെ ആശയങ്ങൾ എന്റേതിൽ നിന്ന് വ്യത്യസ്തമാണെങ്കിലും ഞാൻ ശ്രദ്ധയോടെ കേൾക്കാറുണ്ട്."
  },
  {
    "questionNumber": 83,
    "languageCode": "hi",
    "questionText": "मैं दूसरों के विचारों को ध्यान से सुनता हूँ, भले ही वे मेरे विचारों से अलग हों।"
  },
  {
    "questionNumber": 83,
    "languageCode": "ta",
    "questionText": "மாறுபட்ட கருத்துக்களையும் கவனமாகக் கேட்பேன்."
  },
  {
    "questionNumber": 83,
    "languageCode": "kn",
    "questionText": "ಭಿನ್ನ ಅಭಿಪ್ರಾಯಗಳನ್ನೂ ಗಮನವಿಟ್ಟು ಆಲಿಸುತ್ತೇನೆ."
  },
  {
    "questionNumber": 83,
    "languageCode": "ar",
    "questionText": "أستمع لآراء الآخرين باهتمام حتى عندما تختلف عن وجهة نظري."
  },
  {
    "questionNumber": 84,
    "languageCode": "ml",
    "questionText": "ഒരു ജോലി പൂർത്തിയായി എന്ന് പറയുന്നതിന് മുൻപ് അത് ശരിയാണോ എന്ന് ഞാൻ പരിശോധിക്കാറുണ്ട്."
  },
  {
    "questionNumber": 84,
    "languageCode": "hi",
    "questionText": "काम पूरा कहने से पहले मैं आमतौर पर अपनी गलतियों की दोबारा जाँच करता हूँ।"
  },
  {
    "questionNumber": 84,
    "languageCode": "ta",
    "questionText": "பணியை முடிப்பதற்கு முன் பிழைகளைச் சரிபார்க்கிறேன்."
  },
  {
    "questionNumber": 84,
    "languageCode": "kn",
    "questionText": "ಕೆಲಸ ಮುಗಿಸುವ ಮುನ್ನ ತಪ್ಪುಗಳನ್ನು ಪರಿಶೀಲಿಸುತ್ತೇನೆ."
  },
  {
    "questionNumber": 84,
    "languageCode": "ar",
    "questionText": "أراجع عملي بعناية للتأكد من دقته قبل تسليمه واعتماده."
  },
  {
    "questionNumber": 85,
    "languageCode": "ml",
    "questionText": "ഉദാഹരണങ്ങളും വിവരങ്ങളും സ്വന്തമായി കണ്ടെത്തി പുതിയ കാര്യങ്ങൾ പഠിക്കാൻ എനിക്ക് കഴിയും."
  },
  {
    "questionNumber": 85,
    "languageCode": "hi",
    "questionText": "मैं उदाहरणों और संसाधनों की सहायता से स्वयं नई चीज़ें सीख सकता हूँ।"
  },
  {
    "questionNumber": 85,
    "languageCode": "ta",
    "questionText": "சுயவளங்களைப் பயன்படுத்திப் புதியவற்றைக் கற்க முடியும்."
  },
  {
    "questionNumber": 85,
    "languageCode": "kn",
    "questionText": "ಸ್ವಂತ ಸಂಪನ್ಮೂಲಗಳನ್ನು ಬಳಸಿ ಹೊಸ ವಿಷಯಗಳನ್ನು ಕಲಿಯಬಲ್ಲೆ."
  },
  {
    "questionNumber": 85,
    "languageCode": "ar",
    "questionText": "أستطيع تعلم مفاهيم جديدة بالبحث الذاتي واستكشاف الموارد المتاحة."
  },
  {
    "questionNumber": 86,
    "languageCode": "ml",
    "questionText": "കാര്യങ്ങൾ നന്നായി മനസ്സിലാക്കാൻ 'എന്തുകൊണ്ട്?', 'എങ്ങനെ?' എന്നിങ്ങനെയുള്ള ചോദ്യങ്ങൾ ഞാൻ ചോദിക്കാറുണ്ട്."
  },
  {
    "questionNumber": 86,
    "languageCode": "hi",
    "questionText": "चीज़ों को गहराई से समझने के लिए मैं अक्सर 'क्यों?' और 'कैसे?' जैसे प्रश्न पूछता हूँ।"
  },
  {
    "questionNumber": 86,
    "languageCode": "ta",
    "questionText": "நன்றாகப் புரிந்துகொள்ள 'ஏன்?', 'எப்படி?' போன்ற கேள்விகளைக் கேட்கிறேன்."
  },
  {
    "questionNumber": 86,
    "languageCode": "kn",
    "questionText": "ಚೆನ್ನಾಗಿ ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು 'ಏಕೆ?', 'ಹೇಗೆ?' ಎಂದು ಪ್ರಶ್ನಿಸುತ್ತೇನೆ."
  },
  {
    "questionNumber": 86,
    "languageCode": "ar",
    "questionText": "أسأل كثيراً عن 'لماذا؟' و'كيف؟' لأفهم الأمور بعمق واكتمال."
  },
  {
    "questionNumber": 87,
    "languageCode": "ml",
    "questionText": "തെറ്റുകൾ സംഭവിച്ചാലോ പരാജയപ്പെട്ടാലോ തളരാതെ വീണ്ടും ശ്രമിക്കാൻ ഞാൻ തയ്യാറാകാറുണ്ട്."
  },
  {
    "questionNumber": 87,
    "languageCode": "hi",
    "questionText": "गलती होने या असफल होने के बाद मैं हार मानने के बजाय दोबारा कोशिश करता हूँ।"
  },
  {
    "questionNumber": 87,
    "languageCode": "ta",
    "questionText": "தோல்வி அடைந்தாலும் மீண்டும் முயற்சி செய்கிறேன்."
  },
  {
    "questionNumber": 87,
    "languageCode": "kn",
    "questionText": "ತಪ್ಪಾದರೂ ಎದೆಗುಂದದೆ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸುತ್ತೇನೆ."
  },
  {
    "questionNumber": 87,
    "languageCode": "ar",
    "questionText": "عند ارتكاب خطأ أو التعرض لإخفاق، أكرر المحاولة بتعلم وإصرار."
  },
  {
    "questionNumber": 88,
    "languageCode": "ml",
    "questionText": "പദ്ധതികളിലോ സാഹചര്യങ്ങളിലോ അപ്രതീക്ഷിത മാറ്റങ്ങൾ വരുമ്പോൾ അതിനനുസരിച്ച് പൊരുത്തപ്പെടാൻ എനിക്ക് കഴിയും."
  },
  {
    "questionNumber": 88,
    "languageCode": "hi",
    "questionText": "जब नियमों या योजनाओं में अचानक बदलाव आता है, तो मैं खुद को आसानी से ढाल लेता हूँ।"
  },
  {
    "questionNumber": 88,
    "languageCode": "ta",
    "questionText": "திடீர் மாற்றங்களுக்கு ஏற்ப என்னை மாற்றிக்கொள்கிறேன்."
  },
  {
    "questionNumber": 88,
    "languageCode": "kn",
    "questionText": "ಹಠಾತ್ ಬದಲಾವಣೆಗಳಿಗೆ ನನ್ನನ್ನು ಸುಲಭವಾಗಿ ಹೊಂದಿಸಿಕೊಳ್ಳುತ್ತೇನೆ."
  },
  {
    "questionNumber": 88,
    "languageCode": "ar",
    "questionText": "أتكيف بسرعة عند حدوث تغييرات غير متوقعة في الخطط أو الظروف."
  },
  {
    "questionNumber": 89,
    "languageCode": "ml",
    "questionText": "ഒരു ഗ്രൂപ്പിൽ പുതിയ ആശയങ്ങൾ ആവശ്യമായി വരുമ്പോൾ ധൈര്യത്തോടെ അഭിപ്രായം പറയാൻ എനിക്ക് സാധിക്കാറുണ്ട്."
  },
  {
    "questionNumber": 89,
    "languageCode": "hi",
    "questionText": "जब समूह को नए विचारों की ज़रूरत होती है, तो मैं सुझाव देने में सहज महसूस करता हूँ।"
  },
  {
    "questionNumber": 89,
    "languageCode": "ta",
    "questionText": "குழுவில் புதிய யோசனைகளை முன்வைக்கத் தயங்குவதில்லை."
  },
  {
    "questionNumber": 89,
    "languageCode": "kn",
    "questionText": "ತಂಡದಲ್ಲಿ ಹೊಸ ಕಲ್ಪನೆಗಳನ್ನು ನೀಡಲು ಹಿಂಜರಿಯುವುದಿಲ್ಲ."
  },
  {
    "questionNumber": 89,
    "languageCode": "ar",
    "questionText": "أشعر بالثقة في طرح أفكاري عندما يحتاج الفريق إلى مقترحات جديدة."
  },
  {
    "questionNumber": 90,
    "languageCode": "ml",
    "questionText": "എന്റെ മാത്രം വിജയമല്ല, എന്റെ സഹപ്രവർത്തകരും വിജയിക്കണമെന്ന് ഞാൻ ആഗ്രഹിക്കുകയും സഹായിക്കുകയും ചെയ്യുന്നു."
  },
  {
    "questionNumber": 90,
    "languageCode": "hi",
    "questionText": "मैं केवल अपनी ही नहीं, बल्कि अपने साथियों की सफलता में भी योगदान देने का प्रयास करता हूँ।"
  },
  {
    "questionNumber": 90,
    "languageCode": "ta",
    "questionText": "எனது குழுவினரின் வெற்றிக்கும் உதவுகிறேன்."
  },
  {
    "questionNumber": 90,
    "languageCode": "kn",
    "questionText": "ತಂಡದ ಸಹಪಾಠಿಗಳ ಯಶಸ್ಸಿಗೂ ಸಹಾಯ ಮಾಡುತ್ತೇನೆ."
  },
  {
    "questionNumber": 90,
    "languageCode": "ar",
    "questionText": "أحرص على مساعدة زملائي لتحقيق نجاح الفريق بأكمله."
  },
  {
    "questionNumber": 91,
    "languageCode": "ml",
    "questionText": "മറ്റുള്ളവർ ശ്രദ്ധിക്കാതെ പോകുന്ന ചെറിയ തെറ്റുകളോ സൂക്ഷ്മ വിവരങ്ങളോ ഞാൻ പലപ്പോഴും ശ്രദ്ധിക്കാറുണ്ട്."
  },
  {
    "questionNumber": 91,
    "languageCode": "hi",
    "questionText": "मैं अक्सर उन छोटी गलतियों और बारीकियों को पकड़ लेता हूँ जिन्हें अन्य लोग अनदेखा कर देते हैं।"
  },
  {
    "questionNumber": 91,
    "languageCode": "ta",
    "questionText": "மற்றவர்கள் தவறவிடும் சிறு விவரங்களையும் கவனிக்கிறேன்."
  },
  {
    "questionNumber": 91,
    "languageCode": "kn",
    "questionText": "ಇತರರು ಗಮನಿಸದ ಸಣ್ಣ ವಿವರಗಳನ್ನು ನಾನು ಗಮನಿಸುತ್ತೇನೆ."
  },
  {
    "questionNumber": 91,
    "languageCode": "ar",
    "questionText": "ألاحظ التفاصيل الدقيقة والأخطاء الصغيرة التي قد يغفل عنها الآخرون."
  },
  {
    "questionNumber": 92,
    "languageCode": "ml",
    "questionText": "ഒരു കാര്യം മനസ്സിലാകാതെ വരുമ്പോൾ പെട്ടെന്ന് ഉപേക്ഷിക്കാതെ പുസ്തകങ്ങളും വീഡിയോകളും പരിശോധിച്ച് പഠിക്കാൻ ഞാൻ ശ്രമിക്കാറുണ്ട്."
  },
  {
    "questionNumber": 92,
    "languageCode": "hi",
    "questionText": "जब मुझे कुछ समझ नहीं आता, तो मैं छोड़ने से पहले किताबों, वीडियो या अन्य स्रोतों की मदद लेता हूँ।"
  },
  {
    "questionNumber": 92,
    "languageCode": "ta",
    "questionText": "புரியாதபோது புத்தகங்கள் மற்றும் வீடியோக்களைப் பார்த்துப் பயில்கிறேன்."
  },
  {
    "questionNumber": 92,
    "languageCode": "kn",
    "questionText": "ಅರ್ಥವಾಗದಿದ್ದಾಗ ಪುಸ್ತಕಗಳು ಮತ್ತು ವೀಡಿಯೊಗಳನ್ನು ನೋಡಿ ಕಲಿಯುತ್ತೇನೆ."
  },
  {
    "questionNumber": 92,
    "languageCode": "ar",
    "questionText": "عندما أواجه صعوبة في فهم شيء ما، أستعين بالكتب والمصادر قبل الاستسلام."
  },
  {
    "questionNumber": 93,
    "languageCode": "ml",
    "questionText": "ഒരു വിഷയത്തെക്കുറിച്ച് ആഴത്തിൽ മനസ്സിലാക്കാൻ സഹായിക്കുന്ന ചോദ്യങ്ങൾ ചോദിക്കാൻ എനിക്ക് ഇഷ്ടമാണ്."
  },
  {
    "questionNumber": 93,
    "languageCode": "hi",
    "questionText": "मुझे ऐसे प्रश्न पूछना पसंद है जो मुझे किसी विषय की गहरी समझ हासिल करने में मदद करें।"
  },
  {
    "questionNumber": 93,
    "languageCode": "ta",
    "questionText": "ஆழமாகப் புரிந்துகொள்ள உதவும் கேள்விகளைக் கேட்க விரும்புகிறேன்."
  },
  {
    "questionNumber": 93,
    "languageCode": "kn",
    "questionText": "ಆಳವಾದ ತಿಳುವಳಿಕೆಗೆ ಸಹಾಯ ಮಾಡುವ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಲು ಇಷ್ಟಪಡುತ್ತೇನೆ."
  },
  {
    "questionNumber": 93,
    "languageCode": "ar",
    "questionText": "أستمتع بطرح الأسئلة التي تقودني لفهم جوهر الموضوع بشكل أعمق."
  },
  {
    "questionNumber": 94,
    "languageCode": "ml",
    "questionText": "പ്രതീക്ഷിച്ചതിലും കൂടുതൽ സമയം എടുത്താലും പുരോഗതി കാണുന്നതുവരെ ജോലിയിൽ തുടരാൻ എനിക്ക് കഴിയും."
  },
  {
    "questionNumber": 94,
    "languageCode": "hi",
    "questionText": "यदि किसी कार्य में उम्मीद से ज़्यादा समय लगे, तो भी मैं प्रगति होने तक उसमें जुटा रहता हूँ।"
  },
  {
    "questionNumber": 94,
    "languageCode": "ta",
    "questionText": "அதிக நேரம் எடுத்தாலும் பணியை முடிக்கும்வரை தொடர்வேன்."
  },
  {
    "questionNumber": 94,
    "languageCode": "kn",
    "questionText": "ಹೆಚ್ಚು ಸಮಯ ತೆಗೆದುಕೊಂಡರೂ ಕೆಲಸ ಪೂರ್ಣಗೊಳ್ಳುವವರೆಗೆ ಮುಂದುವರಿಯುತ್ತೇನೆ."
  },
  {
    "questionNumber": 94,
    "languageCode": "ar",
    "questionText": "إذا استغرقت المهمة وقتاً أطول من المتوقع، أواصل العمل حتى أحقق تقدماً ملموساً."
  },
  {
    "questionNumber": 95,
    "languageCode": "ml",
    "questionText": "നല്ല ഉപദേശങ്ങളോ നിർദ്ദേശങ്ങളോ ലഭിക്കുമ്പോൾ എന്റെ രീതികളിൽ മാറ്റം വരുത്താൻ ഞാൻ തയ്യാറാകാറുണ്ട്."
  },
  {
    "questionNumber": 95,
    "languageCode": "hi",
    "questionText": "जब मुझे उपयोगी सुझाव मिलते हैं, तो मैं अपने तौर-तरीकों में सुधार करके दोबारा प्रयास करता हूँ।"
  },
  {
    "questionNumber": 95,
    "languageCode": "ta",
    "questionText": "பயனுள்ள ஆலோசனைகளைப் பெற்று எனது முறைகளை மாற்றிக்கொள்வேன்."
  },
  {
    "questionNumber": 95,
    "languageCode": "kn",
    "questionText": "ಉಪಯುಕ್ತ ಸಲಹೆಗಳನ್ನು ಪಡೆದು ನನ್ನ ವಿಧಾನಗಳನ್ನು ಬದಲಾಯಿಸಿಕೊಳ್ಳುತ್ತೇನೆ."
  },
  {
    "questionNumber": 95,
    "languageCode": "ar",
    "questionText": "عند تلقي ملاحظات بناءة، أعدل أسلوبي وأكرر المحاولة بإيجابية."
  },
  {
    "questionNumber": 96,
    "languageCode": "ml",
    "questionText": "ഒരു പ്രശ്നം കണ്ടാൽ മറ്റുള്ളവർ ചെയ്യട്ടെ എന്ന് വെക്കാതെ നല്ലൊരു പരിഹാരം നിർദ്ദേശിക്കാൻ എനിക്ക് സാധിക്കാറുണ്ട്."
  },
  {
    "questionNumber": 96,
    "languageCode": "hi",
    "questionText": "समस्या दिखने पर मैं केवल दूसरों का इंतज़ार करने के बजाय समझदारी भरा कदम सुझाता हूँ।"
  },
  {
    "questionNumber": 96,
    "languageCode": "ta",
    "questionText": "சிக்கலைக் கண்டால் சரியான தீர்வை முன்மொழிவேன்."
  },
  {
    "questionNumber": 96,
    "languageCode": "kn",
    "questionText": "ಸಮಸ್ಯೆ ಕಂಡಾಗ ಸೂಕ್ತ ಪರಿಹಾರವನ್ನು ಸೂಚಿಸುತ್ತೇನೆ."
  },
  {
    "questionNumber": 96,
    "languageCode": "ar",
    "questionText": "عند ملاحظة مشكلة، أقترح إجراءً عملياً مفيداً بدلاً من الاكتفاء بالانتظار."
  },
  {
    "questionNumber": 97,
    "languageCode": "ml",
    "questionText": "ഗ്രൂപ്പിൽ പ്രവർത്തിക്കുമ്പോൾ മറ്റൊരാളുടെ ആശയം കൂടുതൽ മികച്ചതാണെങ്കിൽ എന്റെ ആശയം മാറ്റാൻ ഞാൻ മടിക്കാറില്ല."
  },
  {
    "questionNumber": 97,
    "languageCode": "hi",
    "questionText": "समूह में काम करते समय यदि किसी और का विचार बेहतर हो, तो मैं अपने विचार बदलने में संकोच नहीं करता।"
  },
  {
    "questionNumber": 97,
    "languageCode": "ta",
    "questionText": "குழுவில் மற்றவரின் யோசனை சிறந்ததாக இருந்தால் எனது யோசனையை மாற்றுவேன்."
  },
  {
    "questionNumber": 97,
    "languageCode": "kn",
    "questionText": "ತಂಡದಲ್ಲಿ ಇತರರ ಕಲ್ಪನೆ ಉತ್ತಮವಾಗಿದ್ದರೆ ನನ್ನ ಕಲ್ಪನೆಯನ್ನು ಬದಲಾಯಿಸಲು ಸಿದ್ಧ."
  },
  {
    "questionNumber": 97,
    "languageCode": "ar",
    "questionText": "في العمل الجماعي، أقبل تعديل فكرتي إذا كانت فكرة زميلي أكثر ملاءمة."
  },
  {
    "questionNumber": 98,
    "languageCode": "ml",
    "questionText": "ജോലികൾ സമർപ്പിക്കുന്നതിന് മുൻപ് പ്രധാന നിർദ്ദേശങ്ങളും ചെറിയ കാര്യങ്ങളും ഞാൻ ഒത്തുനോക്കാറുണ്ട്."
  },
  {
    "questionNumber": 98,
    "languageCode": "hi",
    "questionText": "काम जमा करने से पहले मैं महत्त्वपूर्ण निर्देशों और बारीक विवरणों की सावधानी से जाँच करता हूँ।"
  },
  {
    "questionNumber": 98,
    "languageCode": "ta",
    "questionText": "பணிகளைச் சமர்ப்பிக்கும் முன் வழிமுறைகளைச் சரிபார்க்கிறேன்."
  },
  {
    "questionNumber": 98,
    "languageCode": "kn",
    "questionText": "ಕೆಲಸ ಸಲ್ಲಿಸುವ ಮುನ್ನ ಪ್ರಮುಖ ಸೂಚನೆಗಳನ್ನು ಪರಿಶೀಲಿಸುತ್ತೇನೆ."
  },
  {
    "questionNumber": 98,
    "languageCode": "ar",
    "questionText": "قبل تسليم أي مهمة، أتحقق من تطبيق التعليمات والتفاصيل الدقيقة."
  },
  {
    "questionNumber": 99,
    "languageCode": "ml",
    "questionText": "എന്തെങ്കിലും കാര്യത്തിൽ താല്പര്യം തോന്നിയാൽ അത് സ്വന്തമായി പഠിക്കാൻ അനുയോജ്യമായ വഴി കണ്ടെത്താൻ എനിക്ക് കഴിയും."
  },
  {
    "questionNumber": 99,
    "languageCode": "hi",
    "questionText": "यदि किसी विषय में मेरी जिज्ञासा हो, तो मैं उसके बारे में सीखने का उपयुक्त साधन खोज लेता हूँ।"
  },
  {
    "questionNumber": 99,
    "languageCode": "ta",
    "questionText": "ஆர்வமுள்ள தலைப்பைச் சுயமாகக் கற்றுக்கொள்ள வழி தேடுவேன்."
  },
  {
    "questionNumber": 99,
    "languageCode": "kn",
    "questionText": "ಕುತೂಹಲವಿರುವ ವಿಷಯವನ್ನು ಕಲಿಯಲು ಸೂಕ್ತ ಮಾರ್ಗವನ್ನು ಕಂಡುಕೊಳ್ಳುತ್ತೇನೆ."
  },
  {
    "questionNumber": 99,
    "languageCode": "ar",
    "questionText": "عندما يثير شيء فضولي، أجد الوسيلة المناسبة لاستكشافه والتعلم عنه."
  },
  {
    "questionNumber": 100,
    "languageCode": "ml",
    "questionText": "ഒരു ടീമിന് അടുത്തതായി എന്ത് ചെയ്യണമെന്ന് വ്യക്തമല്ലാത്തപ്പോൾ, ശരിയായ വഴി തിരഞ്ഞെടുക്കാൻ സഹായിക്കാൻ എനിക്ക് സാധിക്കും."
  },
  {
    "questionNumber": 100,
    "languageCode": "hi",
    "questionText": "जब टीम को समझ न आ रहा हो कि आगे क्या करना है, तो मैं दिशा चुनने में मदद करने में सहज महसूस करता हूँ।"
  },
  {
    "questionNumber": 100,
    "languageCode": "ta",
    "questionText": "குழுவிற்குத் தயக்கம் இருக்கும்போது திசையைக் காட்ட உதவ முடியும்."
  },
  {
    "questionNumber": 100,
    "languageCode": "kn",
    "questionText": "ತಂಡಕ್ಕೆ ಗೊಂದಲವಿದ್ದಾಗ ದಿಕ್ಕು ತೋರಿಸಲು ಸಹಾಯ ಮಾಡಬಲ್ಲೆ."
  },
  {
    "questionNumber": 100,
    "languageCode": "ar",
    "questionText": "عندما يسود التردد في الفريق، أساعد المجموعة في تحديد اتجاه العمل بثقة."
  },
  {
    "questionNumber": 101,
    "languageCode": "ml",
    "questionText": "തടസ്സങ്ങൾ ഉണ്ടായാൽ ഉടൻ പിന്മാറാതെ വീണ്ടും ഒരു ശ്രമം കൂടി നടത്താൻ ഞാൻ ശ്രദ്ധിക്കാറുണ്ട്."
  },
  {
    "questionNumber": 101,
    "languageCode": "hi",
    "questionText": "किसी असफलता के बाद मैं तुरंत रुकने के बजाय एक और प्रयास करना पसंद करता हूँ।"
  },
  {
    "questionNumber": 101,
    "languageCode": "ta",
    "questionText": "தடை வந்தாலும் மீண்டும் முயற்சிப்பேன்."
  },
  {
    "questionNumber": 101,
    "languageCode": "kn",
    "questionText": "ಹಿನ್ನಡೆಯಾದರೂ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸುತ್ತೇನೆ."
  },
  {
    "questionNumber": 101,
    "languageCode": "ar",
    "questionText": "بعد أي تعثر، أقوم بمحاولة جديدة بدلاً من التوقف والانسحاب."
  },
  {
    "questionNumber": 102,
    "languageCode": "ml",
    "questionText": "അത്ഭുതപ്പെടുത്തുന്ന എന്തെങ്കിലും കണ്ടാൽ അതിന്റെ കാരണം കണ്ടെത്താൻ ഞാൻ ശ്രമിക്കാറുണ്ട്."
  },
  {
    "questionNumber": 102,
    "languageCode": "hi",
    "questionText": "जब कोई बात मुझे चौंकाती है, तो मैं उसके पीछे के कारण की पड़ताल करना चाहता हूँ।"
  },
  {
    "questionNumber": 102,
    "languageCode": "ta",
    "questionText": "வியப்பானவற்றின் காரணத்தை அறிய முற்படுவேன்."
  },
  {
    "questionNumber": 102,
    "languageCode": "kn",
    "questionText": "ಆಶ್ಚರ್ಯಕರ ವಿಷಯಗಳ ಹಿಂದಿನ ಕಾರಣವನ್ನು ತಿಳಿಯಲು ಬಯಸುತ್ತೇನೆ."
  },
  {
    "questionNumber": 102,
    "languageCode": "ar",
    "questionText": "عندما يفاجئني أمر غير معتاد، أسعى للبحث عن أسبابه العميقة."
  },
  {
    "questionNumber": 103,
    "languageCode": "ml",
    "questionText": "പല ജോലികൾ തുടങ്ങുന്നതിന് മുൻപ്, ആദ്യം ഏതാണ് ചെയ്യേണ്ടത് എന്ന് ഞാൻ തീരുമാനിക്കാറുണ്ട്."
  },
  {
    "questionNumber": 103,
    "languageCode": "hi",
    "questionText": "कई कार्य शुरू करने से पहले मैं यह तय कर लेता हूँ कि सबसे पहले क्या करना ज़रूरी है।"
  },
  {
    "questionNumber": 103,
    "languageCode": "ta",
    "questionText": "பணிகளைத் தொடங்கும் முன் முன்னுரிமையைத் தீர்மானிக்கிறேன்."
  },
  {
    "questionNumber": 103,
    "languageCode": "kn",
    "questionText": "ಕೆಲಸಗಳನ್ನು ಪ್ರಾರಂಭಿಸುವ ಮುನ್ನ ಆದ್ಯತೆಗಳನ್ನು ನಿರ್ಧರಿಸುತ್ತೇನೆ."
  },
  {
    "questionNumber": 103,
    "languageCode": "ar",
    "questionText": "قبل البدء في مهام متعددة، أحدد الأولويات والترتيب المنطقي لتنفيذها."
  },
  {
    "questionNumber": 104,
    "languageCode": "ml",
    "questionText": "ശ്രദ്ധ പരിശോധന: കൃത്യതയ്ക്കായി ദയവായി ഈ ചോദ്യത്തിന് 'കുറച്ച് ബാധകം' (A little like me) തിരഞ്ഞെടുക്കുക."
  },
  {
    "questionNumber": 104,
    "languageCode": "hi",
    "questionText": "ध्यान जाँच: कृपया सटीकता पुष्टि के लिए इस प्रश्न के लिए विकल्प 'थोड़ा मुझ जैसा' (A little like me) चुनें।"
  },
  {
    "questionNumber": 104,
    "languageCode": "ta",
    "questionText": "கவனச் சோதனை: துல்லியத்திற்காக தயவுசெய்து விருப்பம் 'சற்று என்னை போன்றது' (A little like me) ஐத் தேர்ந்தெடுக்கவும்."
  },
  {
    "questionNumber": 104,
    "languageCode": "kn",
    "questionText": "ಗಮನ ಪರೀಕ್ಷೆ: ದಯವಿಟ್ಟು ನಿಖರತೆಗಾಗಿ 'ಸ್ವಲ್ಪ ನನ್ನಂತೆ' (A little like me) ಆಯ್ಕೆಯನ್ನು ಆರಿಸಿ."
  },
  {
    "questionNumber": 104,
    "languageCode": "ar",
    "questionText": "فحص الانتباه: لضمان دقة الاستجابة، يرجى اختيار الخيار 'ينطبق عليّ قليلاً' (A little like me)."
  }
];
