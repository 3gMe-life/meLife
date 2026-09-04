import { PoolClient } from "pg";
import { pool } from "../../../config/database";
import { logger } from "../../../common/utils/logger";
import { SupportedLanguageDTO } from "../assessment-runner.types";

export const SUPPORTED_ASSESSMENT_LANGUAGES: SupportedLanguageDTO[] = [
  { code: "en", name: "English", nativeName: "English", dir: "ltr" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", dir: "ltr" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", dir: "ltr" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", dir: "ltr" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", dir: "ltr" },
  { code: "ar", name: "Arabic", nativeName: "العربية", dir: "rtl" },
];

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

// 1. SECTION TRANSLATIONS
export const SECTION_TRANSLATIONS: SectionTranslationSeed[] = [
  // Malayalam
  {
    sectionCode: "SECTION_A",
    languageCode: "ml",
    name: "വിഭാഗം A: തൊഴിൽ താല്പര്യങ്ങൾ (Interest Discovery)",
    description: "നിങ്ങൾക്ക് ഏറ്റവും ഇഷ്ടമുള്ള പ്രവർത്തനങ്ങൾ തിരഞ്ഞെടുക്കുക. തെറ്റോ ശരിയോ ആയ ഉത്തരങ്ങളില്ല.",
  },
  {
    sectionCode: "SECTION_B",
    languageCode: "ml",
    name: "വിഭാഗം B: നൈപുണ്യ സ്വഭാവങ്ങൾ (Skill Behaviours)",
    description: "നിങ്ങളുടെ ദൈനംദിന ചിന്താരീതികളും പ്രശ്നപരിഹാര സമീപനങ്ങളും പങ്കുവെക്കുക.",
  },
  {
    sectionCode: "SECTION_C",
    languageCode: "ml",
    name: "വിഭാഗം C: അഭിരുചി വിലയിരുത്തൽ (Demonstrated Aptitude)",
    description: "യുക്തിചിന്ത, ഗണിത വിശകലനം, പാറ്റേൺ കണ്ടെത്തൽ എന്നിവ അളക്കുന്ന ചോദ്യങ്ങൾ.",
  },
  {
    sectionCode: "SECTION_D",
    languageCode: "ml",
    name: "വിഭാഗം D: വ്യക്തിത്വ കരുത്തുകൾ (Developmental Strengths)",
    description: "നിങ്ങളുടെ പഠനരീതികളും സ്വഭാവഗുണങ്ങളും മനസ്സിലാക്കാൻ സഹായിക്കുന്ന ചോദ്യങ്ങൾ.",
  },
  {
    sectionCode: "SECTION_E",
    languageCode: "ml",
    name: "വിഭാഗം E: ശ്രദ്ധാ സ്ഥിരത (Response Quality & Attention)",
    description: "നിങ്ങളുടെ പ്രതികരണ സ്ഥിരത ഉറപ്പാക്കാനുള്ള ചോദ്യങ്ങൾ.",
  },

  // Hindi
  {
    sectionCode: "SECTION_A",
    languageCode: "hi",
    name: "भाग A: व्यावसायिक रुचियाँ (Interest Discovery)",
    description: "अपनी पसंदीदा गतिविधियों का चयन करें। यहाँ कोई सही या गलत उत्तर नहीं है।",
  },
  {
    sectionCode: "SECTION_B",
    languageCode: "hi",
    name: "भाग B: कौशल व्यवहार (Skill Behaviours)",
    description: "अपनी समस्या-समाधान शैली और दैनिक कार्य व्यवहार को साझा करें।",
  },
  {
    sectionCode: "SECTION_C",
    languageCode: "hi",
    name: "भाग C: प्रदर्शित योग्यता (Demonstrated Aptitude)",
    description: "तर्कशक्ति, गणितीय समझ और पैटर्न पहेलियों से संबंधित प्रश्न।",
  },
  {
    sectionCode: "SECTION_D",
    languageCode: "hi",
    name: "भाग D: विकासात्मक ताकत (Developmental Strengths)",
    description: "आपकी सीखने की आदतें और निरंतरता को समझने वाले प्रश्न।",
  },
  {
    sectionCode: "SECTION_E",
    languageCode: "hi",
    name: "भाग E: प्रतिक्रिया गुणवत्ता (Response Quality & Attention)",
    description: "सटीकता और निरंतरता की पुष्टि हेतु प्रश्न।",
  },

  // Tamil
  {
    sectionCode: "SECTION_A",
    languageCode: "ta",
    name: "பிரிவு A: தொழில் ஆர்வங்கள் (Interest Discovery)",
    description: "உங்களுக்கு பிடித்த செயல்பாடுகளைத் தேர்வுசெய்க. இதில் தவறான பதில் எதுவும் இல்லை.",
  },
  {
    sectionCode: "SECTION_B",
    languageCode: "ta",
    name: "பிரிவு B: திறன் நடத்தைகள் (Skill Behaviours)",
    description: "உங்கள் சிக்கல் தீர்க்கும் பாணி மற்றும் சிந்தனை வழிகளை விவரிக்கவும்.",
  },
  {
    sectionCode: "SECTION_C",
    languageCode: "ta",
    name: "பிரிவு C: அறிவாற்றல் திறன் (Demonstrated Aptitude)",
    description: "தருக்க சிந்தனை, கணித பகுப்பாய்வு மற்றும் வடிவ புதிர் வினாக்கள்.",
  },
  {
    sectionCode: "SECTION_D",
    languageCode: "ta",
    name: "பிரிவு D: வளர்ச்சி பலங்கள் (Developmental Strengths)",
    description: "உங்கள் கற்றல் பழக்கவழக்கங்கள் மற்றும் விடாமுயற்சியை அளவிடும் கேள்விகள்.",
  },
  {
    sectionCode: "SECTION_E",
    languageCode: "ta",
    name: "பிரிவு E: பதில் தரம் (Response Quality & Attention)",
    description: "கவனமுடன் அளித்த பதில்களை உறுதிப்படுத்தும் கேள்விகள்.",
  },

  // Kannada
  {
    sectionCode: "SECTION_A",
    languageCode: "kn",
    name: "ವಿಭಾಗ A: ವೃತ್ತಿಪರ ಆಸಕ್ತಿಗಳು (Interest Discovery)",
    description: "ನಿಮಗೆ ಇಷ್ಟವಾದ ಚಟುವಟಿಕೆಗಳನ್ನು ಆರಿಸಿ. ಯಾವುದೇ ಸರಿ ಅಥವಾ ತಪ್ಪು ಉತ್ತರಗಳಿಲ್ಲ.",
  },
  {
    sectionCode: "SECTION_B",
    languageCode: "kn",
    name: "ವಿಭಾಗ B: ಕೌಶಲ್ಯ ನಡವಳಿಕೆಗಳು (Skill Behaviours)",
    description: "ನಿಮ್ಮ ಸಮಸ್ಯೆ ಪರಿಹಾರ ವಿಧಾನಗಳು ಮತ್ತು ದೈನಂದಿನ ಚಿಂತನೆಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳಿ.",
  },
  {
    sectionCode: "SECTION_C",
    languageCode: "kn",
    name: "ವಿಭಾಗ C: ಪ್ರದರ್ಶಿತ ಸಾಮರ್ಥ್ಯ (Demonstrated Aptitude)",
    description: "ತಾರ್ಕಿಕ ಚಿಂತನೆ, ಗಣಿತ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಮಾದರಿ ಒಗಟುಗಳ ಪ್ರಶ್ನೆಗಳು.",
  },
  {
    sectionCode: "SECTION_D",
    languageCode: "kn",
    name: "ವಿಭಾಗ D: ಬೆಳವಣಿಗೆಯ ಸಾಮರ್ಥ್ಯಗಳು (Developmental Strengths)",
    description: "ನಿಮ್ಮ ಕಲಿಕೆಯ ಅಭ್ಯಾಸಗಳು ಮತ್ತು ಪರಿಶ್ರಮವನ್ನು ತಿಳಿಯಲು ಪ್ರಶ್ನೆಗಳು.",
  },
  {
    sectionCode: "SECTION_E",
    languageCode: "kn",
    name: "ವಿಭಾಗ E: ಪ್ರತಿಕ್ರಿಯೆ ಗುಣಮಟ್ಟ (Response Quality & Attention)",
    description: "ನಿಮ್ಮ ಗಮನ ಮತ್ತು ಸ್ಥಿರತೆಯನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳುವ ಪ್ರಶ್ನೆಗಳು.",
  },

  // Arabic
  {
    sectionCode: "SECTION_A",
    languageCode: "ar",
    name: "القسم أ: استكشاف الاهتمامات المهنية (Interest Discovery)",
    description: "اختر الأنشطة التي تناسبك وتستمتع بها أكثر. لا توجد إجابات صحيحة أو خاطئة.",
  },
  {
    sectionCode: "SECTION_B",
    languageCode: "ar",
    name: "القسم ب: السلوكيات والمهارات (Skill Behaviours)",
    description: "شارك أسلوبك في حل المشكلات وطرق التفكير والتنفيذ اليومية.",
  },
  {
    sectionCode: "SECTION_C",
    languageCode: "ar",
    name: "القسم ج: القدرات المعرفية والاستدلال (Demonstrated Aptitude)",
    description: "أسئلة مخصصة لقياس التفكير المنطقي والتحليل الرياضي وإدراك الأنماط.",
  },
  {
    sectionCode: "SECTION_D",
    languageCode: "ar",
    name: "القسم د: نقاط القوة النمائية وعادات التعلم (Developmental Strengths)",
    description: "استكشف عادات التعلم والفضول المعرفي والإصرار والعمل الجماعي.",
  },
  {
    sectionCode: "SECTION_E",
    languageCode: "ar",
    name: "القسم هـ: جودة الاستجابة والانتباه (Response Quality & Attention)",
    description: "أسئلة مصممة للتحقق من الانتباه والاتساق في الإجابات.",
  },
];

// 2. LIKERT SCALE OPTION TRANSLATIONS (Options 1, 2, 3, 4)
export const LIKERT_OPTION_TRANSLATIONS: OptionTranslationSeed[] = [
  // Malayalam
  { optionKey: "1", languageCode: "ml", optionText: "എനിക്ക് ബാധകമല്ല (Not like me)" },
  { optionKey: "2", languageCode: "ml", optionText: "കുറച്ച് ബാധകം (A little like me)" },
  { optionKey: "3", languageCode: "ml", optionText: "കൂടുതലും ബാധകം (Mostly like me)" },
  { optionKey: "4", languageCode: "ml", optionText: "തികച്ചും ബാധകം (Very much like me)" },

  // Hindi
  { optionKey: "1", languageCode: "hi", optionText: "मुझ जैसा नहीं (Not like me)" },
  { optionKey: "2", languageCode: "hi", optionText: "थोड़ा मुझ जैसा (A little like me)" },
  { optionKey: "3", languageCode: "hi", optionText: "काफ़ी हद तक मुझ जैसा (Mostly like me)" },
  { optionKey: "4", languageCode: "hi", optionText: "बिल्कुल मुझ जैसा (Very much like me)" },

  // Tamil
  { optionKey: "1", languageCode: "ta", optionText: "என்னை போல் இல்லை (Not like me)" },
  { optionKey: "2", languageCode: "ta", optionText: "சற்று என்னை போன்றது (A little like me)" },
  { optionKey: "3", languageCode: "ta", optionText: "பெரும்பாலும் என்னை போன்றது (Mostly like me)" },
  { optionKey: "4", languageCode: "ta", optionText: "முற்றிலும் என்னை போன்றது (Very much like me)" },

  // Kannada
  { optionKey: "1", languageCode: "kn", optionText: "ನನ್ನಂತಿಲ್ಲ (Not like me)" },
  { optionKey: "2", languageCode: "kn", optionText: "ಸ್ವಲ್ಪ ನನ್ನಂತೆ (A little like me)" },
  { optionKey: "3", languageCode: "kn", optionText: "ಹೆಚ್ಚಾಗಿ ನನ್ನಂತೆ (Mostly like me)" },
  { optionKey: "4", languageCode: "kn", optionText: "ಸಂಪೂರ್ಣವಾಗಿ ನನ್ನಂತೆ (Very much like me)" },

  // Arabic
  { optionKey: "1", languageCode: "ar", optionText: "لا ينطبق عليّ إطلاقاً (Not like me)" },
  { optionKey: "2", languageCode: "ar", optionText: "ينطبق عليّ قليلاً (A little like me)" },
  { optionKey: "3", languageCode: "ar", optionText: "ينطبق عليّ غالباً (Mostly like me)" },
  { optionKey: "4", languageCode: "ar", optionText: "ينطبق عليّ تماماً (Very much like me)" },
];

// 3. SAMPLE MULTILINGUAL QUESTION TRANSLATIONS
export const QUESTION_TRANSLATIONS: QuestionTranslationSeed[] = [
  // --- Malayalam Translations ---
  { questionNumber: 1, languageCode: "ml", questionText: "യന്ത്രഭാഗങ്ങൾ അഴിച്ചുവെച്ച് അവ എങ്ങനെ പ്രവർത്തിക്കുന്നു എന്ന് പരിശോധിക്കുന്നത് എനിക്ക് ഇഷ്ടമാണ്." },
  { questionNumber: 2, languageCode: "ml", questionText: "കാര്യങ്ങൾ എന്തുകൊണ്ട് സംഭവിക്കുന്നു എന്ന് ആഴത്തിൽ മനസ്സിലാക്കാനും പരീക്ഷണങ്ങൾ ചെയ്യാനും ഞാൻ ആഗ്രഹിക്കുന്നു." },
  { questionNumber: 3, languageCode: "ml", questionText: "ചിത്രങ്ങൾ വരയ്ക്കാനും, പുതിയ ഡിസൈനുകൾ ഉണ്ടാക്കാനും, സ്വന്തം ആശയങ്ങൾ സൃഷ്ടിക്കാനും ഞാൻ ഇഷ്ടപ്പെടുന്നു." },
  { questionNumber: 4, languageCode: "ml", questionText: "മറ്റുള്ളവരെ സഹായിക്കാനും അവർക്ക് കാര്യങ്ങൾ പറഞ്ഞുകൊടുക്കാനും ഞാൻ എപ്പോഴും തയ്യാറാണ്." },
  { questionNumber: 5, languageCode: "ml", questionText: "ഒരു ടീമിനെ നയിക്കാനും, ആളുകളോട് സംസാരിച്ച് കാര്യങ്ങൾ തീരുമാനിക്കാനും എനിക്ക് ആത്മവിശ്വാസമുണ്ട്." },
  { questionNumber: 6, languageCode: "ml", questionText: "എന്റെ പുസ്തകങ്ങളും കാര്യങ്ങളും ചിട്ടയായും അടുക്കോടും കൂടി സൂക്ഷിക്കാൻ ഞാൻ ശ്രദ്ധിക്കാറുണ്ട്." },
  { questionNumber: 7, languageCode: "ml", questionText: "ടൂളുകൾ ഉപയോഗിച്ച് കളിപ്പാട്ടങ്ങളോ മോഡലുകളോ നിർമ്മിക്കുന്നത് എനിക്ക് വലിയ താല്പര്യമാണ്." },
  { questionNumber: 8, languageCode: "ml", questionText: "ശാസ്ത്ര വിഷയങ്ങളെക്കുറിച്ചും ശാസ്ത്രജ്ഞരുടെ കണ്ടുപിടുത്തങ്ങളെക്കുറിച്ചും വായിക്കാൻ ഞാൻ ഇഷ്ടപ്പെടുന്നു." },
  { questionNumber: 31, languageCode: "ml", questionText: "ഒരു സങ്കീർണ്ണമായ പസിൽ കാണുമ്പോൾ അത് പൂർത്തിയാക്കുന്നത് വരെ ഞാൻ വിടാതെ ശ്രമിക്കാറുണ്ട്." },
  { questionNumber: 32, languageCode: "ml", questionText: "എന്റെ ആശയങ്ങൾ മറ്റുള്ളവർക്ക് വ്യക്തമായി മനസ്സിലാകുന്ന രീതിയിൽ ലളിതമായി വിശദീകരിക്കാൻ എനിക്ക് കഴിയും." },
  { questionNumber: 55, languageCode: "ml", questionText: "ശ്രേണിയിലെ അടുത്ത സംഖ്യ കണ്ടെത്തുക: 3, 7, 15, 31, __?" },
  { questionNumber: 57, languageCode: "ml", questionText: "നൽകിയിട്ടുള്ള പാറ്റേൺ ഡയഗ്രം പരിശോധിച്ച് ചോദ്യചിഹ്നത്തിന് അനുയോജ്യമായ അടുത്ത ചിത്രം കണ്ടെത്തുക." },
  { questionNumber: 67, languageCode: "ml", questionText: "ഒരു സമചതുര കടലാസ് പകുതിയായി മടക്കി മുറിച്ചാൽ, അത് നിവർത്തുമ്പോൾ ഏത് രൂപമായിരിക്കും ലഭിക്കുക?" },
  { questionNumber: 68, languageCode: "ml", questionText: "നൽകിയിരിക്കുന്ന 3D ബ്ലോക്ക് ഘടന 90 ഡിഗ്രി ഘടികാരദിശയിൽ തിരിക്കുമ്പോൾ എങ്ങനെ കാണപ്പെടും?" },
  { questionNumber: 73, languageCode: "ml", questionText: "പഴയ ന്യൂസ്‌പേപ്പറുകൾ ഉപയോഗിച്ച് ചെയ്യാൻ കഴിയുന്ന 4 വ്യത്യസ്തവും ഉപകാരപ്രദവുമായ കാര്യങ്ങൾ എഴുതുക." },
  { questionNumber: 104, languageCode: "ml", questionText: "ശ്രദ്ധ പരിശോധന: കൃത്യതയ്ക്കായി ദയവായി ഓപ്ഷൻ 2 ('കുറച്ച് ബാധകം') തിരഞ്ഞെടുക്കുക." },

  // --- Hindi Translations ---
  { questionNumber: 1, languageCode: "hi", questionText: "मुझे मशीनों और उपकरणों को खोलकर यह देखना पसंद है कि वे कैसे काम करते हैं।" },
  { questionNumber: 2, languageCode: "hi", questionText: "मुझे चीज़ों के पीछे के कारणों को गहराई से जानने और प्रयोग करने में रुचि है।" },
  { questionNumber: 3, languageCode: "hi", questionText: "मुझे चित्रकारी, नई कहानियाँ गढ़ने और अपनी रचनात्मक सोच को व्यक्त करने में आनंद आता है।" },
  { questionNumber: 4, languageCode: "hi", questionText: "मुझे दूसरों की मदद करना और उन्हें नई बातें सिखाना बहुत अच्छा लगता है।" },
  { questionNumber: 5, languageCode: "hi", questionText: "मुझे समूह का नेतृत्व करने और महत्वपूर्ण निर्णय लेने में आत्मविश्वास महसूस होता है।" },
  { questionNumber: 6, languageCode: "hi", questionText: "मैं अपनी पुस्तकों और दैनिक समय-सारणी को व्यवस्थित रखना पसंद करता हूँ।" },
  { questionNumber: 7, languageCode: "hi", questionText: "मुझे औज़ारों की सहायता से मॉडल और प्रोजेक्ट्स बनाना बहुत पसंद है।" },
  { questionNumber: 8, languageCode: "hi", questionText: "मुझे विज्ञान की नई खोजों और तथ्यों के बारे में पढ़ना रोमांचक लगता है।" },
  { questionNumber: 31, languageCode: "hi", questionText: "जब मेरे सामने कोई कठिन पहेली आती है, तो मैं उसे हल करने के लिए लगातार प्रयास करता हूँ।" },
  { questionNumber: 32, languageCode: "hi", questionText: "मैं अपने विचारों को दूसरों के सामने स्पष्ट और प्रभावी ढंग से रख सकता हूँ।" },
  { questionNumber: 55, languageCode: "hi", questionText: "श्रृंखला में अगली संख्या खोजें: 3, 7, 15, 31, __?" },
  { questionNumber: 57, languageCode: "hi", questionText: "दिए गए पैटर्न आरेख का विश्लेषण करें और प्रश्नवाचक चिन्ह के स्थान पर सही आकृति चुनें।" },
  { questionNumber: 67, languageCode: "hi", questionText: "यदि एक वर्गाकार कागज़ को मोड़कर काटा जाए, तो खोलने पर वह कैसा दिखेगा?" },
  { questionNumber: 68, languageCode: "hi", questionText: "दिए गए 3D ब्लॉक को 90 डिग्री दक्षिणावर्त घुमाने पर कौन सी छवि सही है?" },
  { questionNumber: 73, languageCode: "hi", questionText: "पुराने अख़बारों के 4 नए और रचनात्मक उपयोगों की सूची बनाएँ।" },
  { questionNumber: 104, languageCode: "hi", questionText: "ध्यान जाँच: कृपया इस प्रश्न के लिए विकल्प 2 ('थोड़ा मुझ जैसा') का चयन करें।" },

  // --- Tamil Translations ---
  { questionNumber: 1, languageCode: "ta", questionText: "இயந்திரங்கள் மற்றும் பாகங்கள் எவ்வாறு இயங்குகின்றன என்பதைப் பிரித்துப் பார்க்க நான் விரும்புகிறேன்." },
  { questionNumber: 2, languageCode: "ta", questionText: "விஷயங்கள் ஏன் நிகழ்கின்றன என்பதை ஆராய்ந்து சோதனைகள் செய்ய விரும்புகிறேன்." },
  { questionNumber: 3, languageCode: "ta", questionText: "வரைபடங்கள் வரையவும் புதிய வடிவங்களை உருவாக்கவும் நான் விரும்புகிறேன்." },
  { questionNumber: 4, languageCode: "ta", questionText: "மற்றவர்களுக்கு உதவி செய்யவும் அவர்களுக்குக் கற்பிக்கவும் நான் எப்போதும் தயாராக உள்ளேன்." },
  { questionNumber: 5, languageCode: "ta", questionText: "குழுவை வழிநடத்தவும் புதிய முடிவுகளை எடுக்கவும் எனக்கு நம்பிக்கை உண்டு." },
  { questionNumber: 6, languageCode: "ta", questionText: "எனது புத்தகங்களையும் பணிகளையும் திட்டமிட்டு ஒழுங்காக வைத்திருக்க விரும்புகிறேன்." },
  { questionNumber: 55, languageCode: "ta", questionText: "வரிசையில் அடுத்த எண்ணைக் கண்டறியவும்: 3, 7, 15, 31, __?" },
  { questionNumber: 57, languageCode: "ta", questionText: "கொடுக்கப்பட்ட வடிவ வரைபடத்தை ஆராய்ந்து அடுத்த சரியான படத்தைத் தேர்வுசெய்க." },
  { questionNumber: 104, languageCode: "ta", questionText: "கவனச் சோதனை: துல்லியத்திற்காக விருப்பம் 2 ('சற்று என்னை போன்றது') ஐத் தேர்ந்தெடுக்கவும்." },

  // --- Kannada Translations ---
  { questionNumber: 1, languageCode: "kn", questionText: "ಯಂತ್ರಗಳು ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತವೆ ಎಂದು ಬಿಡಿಸಿ ನೋಡಲು ನಾನು ಇಷ್ಟಪಡುತ್ತೇನೆ." },
  { questionNumber: 2, languageCode: "kn", questionText: "ವಿಷಯಗಳು ಏಕೆ ಸಂಭವಿಸುತ್ತವೆ ಎಂದು ತಿಳಿಯಲು ಮತ್ತು ಪ್ರಯೋಗ ಮಾಡಲು ನಾನು ಉತ್ಸುಕನಾಗಿದ್ದೇನೆ." },
  { questionNumber: 3, languageCode: "kn", questionText: "ಚಿತ್ರಗಳನ್ನು ಬಿಡಿಸಲು ಮತ್ತು ಹೊಸ ಆಲೋಚನೆಗಳನ್ನು ಸೃಷ್ಟಿಸಲು ನಾನು ಆನಂದಿಸುತ್ತೇನೆ." },
  { questionNumber: 4, languageCode: "kn", questionText: "ಇತರರಿಗೆ ಸಹಾಯ ಮಾಡಲು ಮತ್ತು ವಿಷಯಗಳನ್ನು ವಿವರಿಸಲು ನಾನು ಸದಾ ಸಿದ್ಧ." },
  { questionNumber: 5, languageCode: "kn", questionText: "ತಂಡವನ್ನು ಮುನ್ನಡೆಸಲು ಮತ್ತು ನಿರ್ಧಾರಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳಲು ನನಗೆ ಆತ್ಮವಿಶ್ವಾಸವಿದೆ." },
  { questionNumber: 55, languageCode: "kn", questionText: "ಸರಣಿಯಲ್ಲಿ ಮುಂದಿನ ಸಂಖ್ಯೆಯನ್ನು ಕಂಡುಹಿಡಿಯಿರಿ: 3, 7, 15, 31, __?" },
  { questionNumber: 57, languageCode: "kn", questionText: "ನೀಡಿರುವ ಮಾದರಿ ಚಿತ್ರವನ್ನು ಪರಿಶೀಲಿಸಿ ಮುಂದಿನ ಸರಿಯಾದ ಚಿತ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ." },
  { questionNumber: 104, languageCode: "kn", questionText: "ಗಮನ ಪರೀಕ್ಷೆ: ದಯವಿಟ್ಟು ಆಯ್ಕೆ 2 ('ಸ್ವಲ್ಪ ನನ್ನಂತೆ') ಅನ್ನು ಆಯ್ಕೆಮಾಡಿ." },

  // --- Arabic Translations (RTL) ---
  { questionNumber: 1, languageCode: "ar", questionText: "أستمتع بتفكيك الأجهزة الميكانيكية والقطع لفهم كيفية عملها بالتفصيل." },
  { questionNumber: 2, languageCode: "ar", questionText: "أحب إجراء التجارب واستكشاف الأسباب العلمية وراء حدوث الظواهر المختلفة." },
  { questionNumber: 3, languageCode: "ar", questionText: "أستمتع بالرسم وتصميم الأفكار الإبداعية والتعبير عن خيالي بحرية." },
  { questionNumber: 4, languageCode: "ar", questionText: "أشعر بالسعادة عند مساعدة الآخرين وشرح الدروس والمفاهيم لهم." },
  { questionNumber: 5, languageCode: "ar", questionText: "أتحلى بالثقة في قيادة فرق العمل وتنظيم المشاريع والتحدث أمام الجمهور." },
  { questionNumber: 6, languageCode: "ar", questionText: "أهتم بتنظيم جداولي وكتبي وملفاتي بدقة وترتيب واضح." },
  { questionNumber: 55, languageCode: "ar", questionText: "أوجد الرقم التالي في المتتالية الحسابية: 3، 7، 15، 31، __؟" },
  { questionNumber: 57, languageCode: "ar", questionText: "حلل نمط الأشكال الهندسية التالي واختر الشكل المكمل لعلامة الاستفهام." },
  { questionNumber: 67, languageCode: "ar", questionText: "إذا طويت ورقة مربعة الشكل وقصصت أحد أطرافها، كيف ستبدو عند فردها؟" },
  { questionNumber: 68, languageCode: "ar", questionText: "أي الأشكال التالية تمثل دوران النموذج ثلاثي الأبعاد بزاوية 90 درجة مع عقارب الساعة؟" },
  { questionNumber: 73, languageCode: "ar", questionText: "اذكر 4 استخدامات جديدة ومفيدة للصحف الورقية القديمة." },
  { questionNumber: 104, languageCode: "ar", questionText: "فحص الانتباه: لضمان دقة الاستجابة، يرجى اختيار الخيار 2 ('ينطبق عليّ قليلاً')." },
];

export class SkillFinderTranslationsService {
  /**
   * Seeds official section, option, and question translations idempotently.
   */
  async seedSkillFinderTranslations(client?: PoolClient): Promise<void> {
    const db = client || pool;

    // 1. Locate SKILL_FINDER assessment ID
    const assessRes = await db.query(
      `SELECT id FROM assessments WHERE code = 'SKILL_FINDER' LIMIT 1`
    );
    if (!assessRes.rows[0]) {
      logger.warn("SKILL_FINDER assessment not found, skipping translation seeding");
      return;
    }
    const assessmentId = assessRes.rows[0].id;

    // Fast check: if translations exist, skip
    const checkRes = await db.query(
      `SELECT COUNT(*) as count FROM question_translations WHERE language_code IN ('ml', 'hi', 'ta', 'kn', 'ar')`
    );
    if (parseInt(checkRes.rows[0]?.count, 10) >= QUESTION_TRANSLATIONS.length) {
      logger.info("✨ Skill Finder multilingual translations already seeded.");
      return;
    }

    // 2. Map sections by code
    const secRes = await db.query(
      `SELECT id, code FROM assessment_sections WHERE assessment_id = $1`,
      [assessmentId]
    );
    const secMap: Record<string, string> = {};
    for (const r of secRes.rows) {
      secMap[r.code] = r.id;
    }

    // Upsert Section Translations
    for (const s of SECTION_TRANSLATIONS) {
      const sectionId = secMap[s.sectionCode];
      if (!sectionId) continue;

      await db.query(
        `INSERT INTO section_translations (section_id, language_code, name, description, updated_at)
         VALUES ($1, $2, $3, $4, NOW())
         ON CONFLICT (section_id, language_code) DO UPDATE SET
           name = EXCLUDED.name,
           description = EXCLUDED.description,
           updated_at = NOW()`,
        [sectionId, s.languageCode, s.name, s.description]
      );
    }

    // 3. Upsert Likert Option Translations across all Likert questions
    const likertOptsRes = await db.query(
      `SELECT o.id, o.option_key
       FROM question_options o
       JOIN assessment_questions q ON o.question_id = q.id
       WHERE q.assessment_id = $1 AND q.question_type = 'likert_1_4'`,
      [assessmentId]
    );

    const optMapByKey: Record<string, string[]> = {};
    for (const row of likertOptsRes.rows) {
      if (!optMapByKey[row.option_key]) optMapByKey[row.option_key] = [];
      optMapByKey[row.option_key].push(row.id);
    }

    for (const t of LIKERT_OPTION_TRANSLATIONS) {
      const optionIds = optMapByKey[t.optionKey] || [];
      for (const optId of optionIds) {
        await db.query(
          `INSERT INTO option_translations (option_id, language_code, option_text, updated_at)
           VALUES ($1, $2, $3, NOW())
           ON CONFLICT (option_id, language_code) DO UPDATE SET
             option_text = EXCLUDED.option_text,
             updated_at = NOW()`,
          [optId, t.languageCode, t.optionText]
        );
      }
    }

    // 4. Map questions by question_number & upsert question translations
    const qRes = await db.query(
      `SELECT id, question_number FROM assessment_questions WHERE assessment_id = $1`,
      [assessmentId]
    );
    const qMapByNum: Record<number, string> = {};
    for (const r of qRes.rows) {
      qMapByNum[parseInt(r.question_number, 10)] = r.id;
    }

    for (const qt of QUESTION_TRANSLATIONS) {
      const questionId = qMapByNum[qt.questionNumber];
      if (!questionId) continue;

      await db.query(
        `INSERT INTO question_translations (question_id, language_code, question_text, updated_at)
         VALUES ($1, $2, $3, NOW())
         ON CONFLICT (question_id, language_code) DO UPDATE SET
           question_text = EXCLUDED.question_text,
           updated_at = NOW()`,
        [questionId, qt.languageCode, qt.questionText]
      );
    }

    logger.info(
      "✨ Skill Finder multilingual translations (ml, hi, ta, kn, ar) seeded successfully."
    );
  }
}

export const skillFinderTranslationsService = new SkillFinderTranslationsService();
