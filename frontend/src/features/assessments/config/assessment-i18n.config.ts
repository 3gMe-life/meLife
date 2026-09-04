import { SupportedLanguage } from "../types/assessment.types";

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: "en", name: "English", nativeName: "English", dir: "ltr" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", dir: "ltr" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", dir: "ltr" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", dir: "ltr" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", dir: "ltr" },
  { code: "ar", name: "Arabic", nativeName: "العربية", dir: "rtl" },
];

export type TranslationKey =
  | "overview"
  | "saving"
  | "saved"
  | "question"
  | "section"
  | "of"
  | "answered"
  | "unanswered"
  | "previous"
  | "next"
  | "reviewAndSubmit"
  | "beginAssessment"
  | "welcomeTitle"
  | "welcomeSubtitle"
  | "welcomeDesc"
  | "inst1Title"
  | "inst1Desc"
  | "inst2Title"
  | "inst2Desc"
  | "inst3Title"
  | "inst3Desc"
  | "backToDashboard"
  | "exitModalTitle"
  | "exitModalDesc"
  | "continueAssessment"
  | "exitToPortal"
  | "submitModalTitle"
  | "submitModalDesc"
  | "submitNow"
  | "keepReviewing"
  | "allAnsweredReady"
  | "unansweredNotice"
  | "questionPaletteTitle"
  | "close"
  | "language"
  | "changeLanguage"
  | "visualQuestion"
  | "clickToExpand"
  | "timeRemaining";

export const RUNNER_TRANSLATIONS: Record<string, Record<TranslationKey, string>> = {
  en: {
    overview: "Overview",
    saving: "Saving...",
    saved: "Saved",
    question: "Question",
    section: "Section",
    of: "of",
    answered: "Answered",
    unanswered: "Unanswered",
    previous: "Previous",
    next: "Next",
    reviewAndSubmit: "Review & Submit",
    beginAssessment: "Begin Assessment",
    welcomeTitle: "Skill Finder Assessment",
    welcomeSubtitle: "Interactive Psychometric Evaluation",
    welcomeDesc:
      "Discover your verified career interests, cognitive strengths, and personalized learning pathways through this calibrated evaluation.",
    inst1Title: "Authentic Preferences",
    inst1Desc: "There are no right or wrong answers in the interest discovery section. Answer naturally based on what you enjoy.",
    inst2Title: "Visual & Logic Challenges",
    inst2Desc: "Some questions include diagrams, spatial patterns, and reasoning tasks. Take your time to review each visual carefully.",
    inst3Title: "Continuous Autosave",
    inst3Desc: "Every response is securely synced to PostgreSQL in real-time. You can pause, switch languages, or resume anytime.",
    backToDashboard: "Back to Dashboard",
    exitModalTitle: "Pause & Return to Dashboard?",
    exitModalDesc:
      "All your answered questions are securely saved. You can return and continue your assessment at any time.",
    continueAssessment: "Continue Assessment",
    exitToPortal: "Exit to Dashboard",
    submitModalTitle: "Ready to Complete Assessment?",
    submitModalDesc:
      "Once submitted, your responses will be processed by our psychometric scoring engine to calculate your RIASEC profile and aptitude percentiles.",
    submitNow: "Submit Assessment",
    keepReviewing: "Keep Reviewing",
    allAnsweredReady: "All questions completed! You are ready to view your psychometric evaluation.",
    unansweredNotice: "You have unanswered questions remaining. You can submit now or review them first.",
    questionPaletteTitle: "Question Overview Palette",
    close: "Close",
    language: "Language",
    changeLanguage: "Select Assessment Language",
    visualQuestion: "Visual Question",
    clickToExpand: "Click to expand",
    timeRemaining: "Time",
  },
  ml: {
    overview: "അവലോകനം",
    saving: "സൂക്ഷിക്കുന്നു...",
    saved: "സൂക്ഷിച്ചു",
    question: "ചോദ്യം",
    section: "വിഭാഗം",
    of: "ഇൽ",
    answered: "പൂർത്തിയായി",
    unanswered: "ബാക്കി",
    previous: "മുമ്പത്തേത്",
    next: "അടുത്തത്",
    reviewAndSubmit: "വിലയിരുത്തി സമർപ്പിക്കുക",
    beginAssessment: "പരീക്ഷ ആരംഭിക്കുക",
    welcomeTitle: "സ്കിൽ ഫൈൻഡർ അസസ്സ്മെന്റ്",
    welcomeSubtitle: "സൈക്കോമെട്രിക് കരിയർ മൂല്യനിർണ്ണയം",
    welcomeDesc:
      "നിങ്ങളുടെ താല്പര്യങ്ങൾ, യുക്തിചിന്ത, പഠനരീതികൾ എന്നിവ കൃത്യമായി തിരിച്ചറിഞ്ഞ് അനുയോജ്യമായ കരിയർ പാത കണ്ടെത്തുക.",
    inst1Title: "ശരിയായ ഉത്തരങ്ങളില്ല",
    inst1Desc: "താല്പര്യ വിഭാഗത്തിൽ തെറ്റോ ശരിയോ ആയ ഉത്തരങ്ങളില്ല. നിങ്ങൾക്ക് ഇഷ്ടമുള്ളത് സ്വാഭാവികമായി തിരഞ്ഞെടുക്കുക.",
    inst2Title: "ചിത്രങ്ങളും യുക്തിചിന്തയും",
    inst2Desc: "ചില ചോദ്യങ്ങളിൽ ചിത്രങ്ങളും പാറ്റേൺ പസിലുകളുമുണ്ട്. ശ്രദ്ധയോടെ കണ്ട് ഉത്തരം നൽകുക.",
    inst3Title: "ഓട്ടോ സേവ് സംവിധാനം",
    inst3Desc: "നിങ്ങൾ നൽകുന്ന ഓരോ ഉത്തരവും തത്സമയം സുരക്ഷിതമായി സേവ് ചെയ്യപ്പെടും. ഭാഷ മാറ്റിയാലും ഉത്തരങ്ങൾ നഷ്ടപ്പെടില്ല.",
    backToDashboard: "ഡാഷ്‌ബോർഡിലേക്ക്",
    exitModalTitle: "പരീക്ഷ താല്കാലികമായി നിർത്തണോ?",
    exitModalDesc: "നിങ്ങൾ നൽകിയ ഉത്തരങ്ങൾ സുരക്ഷിതമായി സൂക്ഷിച്ചിട്ടുണ്ട്. എപ്പോൾ വേണമെങ്കിലും തുടർന്ന് എഴുതാവുന്നതാണ്.",
    continueAssessment: "പരീക്ഷ തുടരുക",
    exitToPortal: "ഡാഷ്‌ബോർഡിലേക്ക് മടങ്ങുക",
    submitModalTitle: "പരീക്ഷ സമർപ്പിക്കാൻ തയ്യാറാണോ?",
    submitModalDesc: "സമർപ്പിച്ചുകഴിഞ്ഞാൽ നിങ്ങളുടെ സൈക്കോമെട്രിക് സ്കോറുകളും അനുയോജ്യമായ കരിയർ റിപ്പോർട്ടും ലഭ്യമാകും.",
    submitNow: "സമർപ്പിക്കുക",
    keepReviewing: "വീണ്ടും പരിശോധിക്കുക",
    allAnsweredReady: "എല്ലാ ചോദ്യങ്ങൾക്കും ഉത്തരം നൽകി! നിങ്ങളുടെ ഫലങ്ങൾ കാണാൻ സമർപ്പിക്കാം.",
    unansweredNotice: "ചില ചോദ്യങ്ങൾക്ക് ഇനിയും ഉത്തരം നൽകാനുണ്ട്. നിങ്ങൾക്ക് ഇപ്പോൾ സമർപ്പിക്കുകയോ പരിശോധിച്ച് പൂർത്തിയാക്കുകയോ ചെയ്യാം.",
    questionPaletteTitle: "ചോദ്യങ്ങളുടെ ക്രമം",
    close: "അടയ്ക്കുക",
    language: "ഭാഷ",
    changeLanguage: "പരീക്ഷ ഭാഷ തിരഞ്ഞെടുക്കുക",
    visualQuestion: "ചിത്ര ചോദ്യം",
    clickToExpand: "വലുതാക്കി കാണുക",
    timeRemaining: "സമയം",
  },
  hi: {
    overview: "अवलोकन",
    saving: "सहेज रहा है...",
    saved: "सहेजा गया",
    question: "प्रश्न",
    section: "भाग",
    of: "का",
    answered: "उत्तर दिया",
    unanswered: "शेष",
    previous: "पिछला",
    next: "अगला",
    reviewAndSubmit: "समीक्षा और जमा करें",
    beginAssessment: "मूल्यांकन शुरू करें",
    welcomeTitle: "स्किल फाइंडर मूल्यांकन",
    welcomeSubtitle: "व्यापक साइकोमेट्रिक मूल्यांकन",
    welcomeDesc:
      "अपनी वास्तविक रुचियों, तार्किक क्षमताओं और व्यक्तिगत करियर मार्गदर्शन को अनलॉक करने के लिए यह मूल्यांकन पूरा करें।",
    inst1Title: "प्रामाणिक प्राथमिकताएं",
    inst1Desc: "रुचि खंड में कोई सही या गलत उत्तर नहीं है। अपनी पसंद के अनुसार स्वाभाविक रूप से उत्तर दें।",
    inst2Title: "दृश्य और तार्किक चुनौतियाँ",
    inst2Desc: "कुछ प्रश्नों में आरेख और पहेलियाँ शामिल हैं। प्रत्येक प्रश्न को ध्यान से देखें।",
    inst3Title: "निरंतर ऑटो-सेव",
    inst3Desc: "प्रत्येक उत्तर वास्तविक समय में सुरक्षित रूप से सहेजा जाता है। आप कभी भी भाषा बदल सकते हैं।",
    backToDashboard: "डैशबोर्ड पर वापस जाएँ",
    exitModalTitle: "सत्र रोकें और डैशबोर्ड पर जाएँ?",
    exitModalDesc: "आपके सभी उत्तर सुरक्षित हैं। आप किसी भी समय वापस आकर जारी रख सकते हैं।",
    continueAssessment: "मूल्यांकन जारी रखें",
    exitToPortal: "डैशबोर्ड पर जाएँ",
    submitModalTitle: "क्या आप मूल्यांकन पूरा करने के लिए तैयार हैं?",
    submitModalDesc: "जमा करने के बाद आपका RIASEC प्रोफ़ाइल और योग्यता विश्लेषण तैयार किया जाएगा।",
    submitNow: "मूल्यांकन जमा करें",
    keepReviewing: "समीक्षा जारी रखें",
    allAnsweredReady: "सभी प्रश्न पूरे हो चुके हैं! अब आप अपना परिणाम देख सकते हैं।",
    unansweredNotice: "कुछ प्रश्न अनुत्तरित हैं। आप अभी जमा कर सकते हैं या पहले उनकी समीक्षा कर सकते हैं।",
    questionPaletteTitle: "प्रश्न अवलोकन पैलेट",
    close: "बंद करें",
    language: "भाषा",
    changeLanguage: "मूल्यांकन भाषा चुनें",
    visualQuestion: "चित्र प्रश्न",
    clickToExpand: "बड़ा करके देखें",
    timeRemaining: "समय",
  },
  ta: {
    overview: "மேலோட்டம்",
    saving: "சேமிக்கிறது...",
    saved: "சேமிக்கப்பட்டது",
    question: "கேள்வி",
    section: "பிரிவு",
    of: "இல்",
    answered: "பதிலளிக்கப்பட்டது",
    unanswered: "மீதமுள்ளது",
    previous: "முந்தையது",
    next: "அடுத்தது",
    reviewAndSubmit: "மதிப்பாய்வு செய்து சமர்ப்பிக்கவும்",
    beginAssessment: "மதிப்பீட்டைத் தொடங்குங்கள்",
    welcomeTitle: "ஸ்கில் ஃபைண்டர் மதிப்பீடு",
    welcomeSubtitle: "உளவியல் மதிப்பீட்டுத் தளம்",
    welcomeDesc: "உங்கள் ஆர்வங்கள் மற்றும் அறிவாற்றல் பலங்களைக் கண்டறிய இந்த மதிப்பீட்டை முடிக்கவும்.",
    inst1Title: "தவறான பதில்கள் இல்லை",
    inst1Desc: "ஆர்வப் பிரிவில் தவறான பதில் எதுவும் இல்லை. உங்களுக்குப் பிடித்ததை சுதந்திரமாகத் தேர்வுசெய்க.",
    inst2Title: "படங்கள் மற்றும் தருக்க சிந்தனை",
    inst2Desc: "சில கேள்விகளில் வரைபடங்கள் உள்ளன. கவனமாகப் பார்த்து பதிலளிக்கவும்.",
    inst3Title: "தானியங்கி சேமிப்பு",
    inst3Desc: "உங்கள் பதில்கள் உடனுக்குடன் சேமிக்கப்படும். மொழி மாறினாலும் பதில்கள் பாதுகாக்கப்படும்.",
    backToDashboard: "டாஷ்போர்டிற்குத் திரும்பு",
    exitModalTitle: "மதிப்பீட்டை இடைநிறுத்தவா?",
    exitModalDesc: "உங்கள் பதில்கள் பாதுகாப்பாக சேமிக்கப்பட்டுள்ளன. எப்போது வேண்டுமானாலும் தொடரலாம்.",
    continueAssessment: "மதிப்பீட்டைத் தொடர்க",
    exitToPortal: "வெளியேறு",
    submitModalTitle: "மதிப்பீட்டை சமர்ப்பிக்க தயாரா?",
    submitModalDesc: "சமர்ப்பித்தவுடன் உங்கள் உளவியல் பகுப்பாய்வு அறிக்கை உருவாக்கப்படும்.",
    submitNow: "சமர்ப்பிக்கவும்",
    keepReviewing: "மதிப்பாய்வு செய்க",
    allAnsweredReady: "அனைத்து கேள்விகளுக்கும் பதிலளிக்கப்பட்டது!",
    unansweredNotice: "சில கேள்விகள் இன்னும் பதிலளிக்கப்படாமல் உள்ளன.",
    questionPaletteTitle: "கேள்வி மேலோட்டம்",
    close: "மூடு",
    language: "மொழி",
    changeLanguage: "மொழியைத் தேர்ந்தெடுக்கவும்",
    visualQuestion: "படக் கேள்வி",
    clickToExpand: "பெரிதாக்கு",
    timeRemaining: "நேரம்",
  },
  kn: {
    overview: "ಅವಲೋಕನ",
    saving: "ಉಳಿಸಲಾಗುತ್ತಿದೆ...",
    saved: "ಉಳಿಸಲಾಗಿದೆ",
    question: "ಪ್ರಶ್ನೆ",
    section: "ವಿಭಾಗ",
    of: "ರ",
    answered: "ಉತ್ತರಿಸಲಾಗಿದೆ",
    unanswered: "ಉಳಿದಿದೆ",
    previous: "ಹಿಂದಿನದು",
    next: "ಮುಂದಿನದು",
    reviewAndSubmit: "ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಸಲ್ಲಿಸಿ",
    beginAssessment: "ಮೌಲ್ಯಮಾಪನ ಪ್ರಾರಂಭಿಸಿ",
    welcomeTitle: "ಸ್ಕಿಲ್ ಫೈಂಡರ್ ಮೌಲ್ಯಮಾಪನ",
    welcomeSubtitle: "ಮಾನಸಿಕ ಸಾಮರ್ಥ್ಯ ಮೌಲ್ಯಮಾಪನ",
    welcomeDesc: "ನಿಮ್ಮ ಆಸಕ್ತಿಗಳು ಮತ್ತು ಸಾಮರ್ಥ್ಯಗಳನ್ನು ಗುರುತಿಸಿ ಸೂಕ್ತ ವೃತ್ತಿ ಮಾರ್ಗವನ್ನು ಕಂಡುಕೊಳ್ಳಿ.",
    inst1Title: "ತಪ್ಪು ಉತ್ತರಗಳಿಲ್ಲ",
    inst1Desc: "ಆಸಕ್ತಿ ವಿಭಾಗದಲ್ಲಿ ಯಾವುದೇ ಸರಿ ಅಥವಾ ತಪ್ಪು ಉತ್ತರಗಳಿಲ್ಲ. ನಿಮ್ಮ ಇಷ್ಟದಂತೆ ಆರಿಸಿ.",
    inst2Title: "ಚಿತ್ರಗಳು ಮತ್ತು ತಾರ್ಕಿಕತೆ",
    inst2Desc: "ಕೆಲವು ಪ್ರಶ್ನೆಗಳು ಚಿತ್ರಗಳನ್ನು ಹೊಂದಿವೆ. ಗಮನವಿಟ್ಟು ನೋಡಿ ಉತ್ತರಿಸಿ.",
    inst3Title: "ಸ್ವಯಂಚಾಲಿತ ಉಳಿಸುವಿಕೆ",
    inst3Desc: "ನಿಮ್ಮ ಎಲ್ಲಾ ಉತ್ತರಗಳು ತಕ್ಷಣ ಸುರಕ್ಷಿತವಾಗಿ ಉಳಿಸಲ್ಪಡುತ್ತವೆ.",
    backToDashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹಿಂತಿರುಗಿ",
    exitModalTitle: "ಮೌಲ್ಯಮಾಪನವನ್ನು ವಿರಾಮಗೊಳಿಸುವುದೇ?",
    exitModalDesc: "ನಿಮ್ಮ ಉತ್ತರಗಳು ಸುರಕ್ಷಿತವಾಗಿವೆ. ನೀವು ಯಾವಾಗ ಬೇಕಾದರೂ ಮುಂದುವರಿಸಬಹುದು.",
    continueAssessment: "ಮೌಲ್ಯಮಾಪನ ಮುಂದುವರಿಸಿ",
    exitToPortal: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹೋಗಿ",
    submitModalTitle: "ಮೌಲ್ಯಮಾಪನ ಸಲ್ಲಿಸಲು ಸಿದ್ಧರಿದ್ದೀರಾ?",
    submitModalDesc: "ಸಲ್ಲಿಸಿದ ನಂತರ ನಿಮ್ಮ ವೃತ್ತಿ ಮಾರ್ಗದರ್ಶನ ವರದಿ ಸಿದ್ಧವಾಗುತ್ತದೆ.",
    submitNow: "ಈಗ ಸಲ್ಲಿಸಿ",
    keepReviewing: "ಪರಿಶೀಲನೆ ಮುಂದುವರಿಸಿ",
    allAnsweredReady: "ಎಲ್ಲಾ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಲಾಗಿದೆ!",
    unansweredNotice: "ಕೆಲವು ಪ್ರಶ್ನೆಗಳು ಉತ್ತರಿಸಲು ಬಾಕಿ ಇವೆ.",
    questionPaletteTitle: "ಪ್ರಶ್ನೆಗಳ ಅವಲೋಕನ",
    close: "ಮುಚ್ಚಿ",
    language: "ಭಾಷೆ",
    changeLanguage: "ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    visualQuestion: "ಚಿತ್ರದ ಪ್ರಶ್ನೆ",
    clickToExpand: "ದೊಡ್ಡದಾಗಿ ನೋಡಿ",
    timeRemaining: "ಸಮಯ",
  },
  ar: {
    overview: "نظرة عامة",
    saving: "جارٍ الحفظ...",
    saved: "تم الحفظ",
    question: "السؤال",
    section: "القسم",
    of: "من",
    answered: "تمت الإجابة",
    unanswered: "متبقي",
    previous: "السابق",
    next: "التالي",
    reviewAndSubmit: "مراجعة وإرسال",
    beginAssessment: "بدء التقييم",
    welcomeTitle: "تقييم مكتشف المهارات (Skill Finder)",
    welcomeSubtitle: "التقييم السيكومتري التفاعلي الشامل",
    welcomeDesc: "اكتشف ميولك المهنية وقدراتك الإدراكية ومساراتك التعليمية المخصصة بدقة وموثوقية عالية.",
    inst1Title: "تفضيلات صادقة",
    inst1Desc: "لا توجد إجابات صحيحة أو خاطئة في قسم الاهتمامات. أجب بحرية وفق ما يعبر عنك.",
    inst2Title: "تحديات بصرية ومنطقية",
    inst2Desc: "تتضمن بعض الأسئلة أنماطاً بصرية وتفكيراً مكانياً. خذ وقتك لمراجعة كل رسم بدقة.",
    inst3Title: "حفظ تلقائي مستمر",
    inst3Desc: "يتم حفظ وتحديث كل إجابة في الوقت الفعلي بأمان. يمكنك تغيير اللغة أو الاستئناف في أي وقت.",
    backToDashboard: "العودة إلى لوحة التحكم",
    exitModalTitle: "إيقاف مؤقت والعودة للوحة التحكم؟",
    exitModalDesc: "جميع إجاباتك محفوظة بشكل آمن. يمكنك العودة واستكمال التقييم في أي وقت تشاء.",
    continueAssessment: "متابعة التقييم",
    exitToPortal: "الخروج إلى لوحة التحكم",
    submitModalTitle: "هل أنت مستعد لتسليم التقييم؟",
    submitModalDesc: "بمجرد التسليم، ستتم معالجة إجاباتك بواسطة محرك التحليل النفسي لحساب درجات RIASEC ونتائجك المعتمدة.",
    submitNow: "تسليم التقييم",
    keepReviewing: "متابعة المراجعة",
    allAnsweredReady: "اكتملت جميع الأسئلة! أنت الآن جاهز للاطلاع على تقريرك النفسي والمهني.",
    unansweredNotice: "توجد أسئلة لم تتم الإجابة عليها بعد. يمكنك التسليم الآن أو مراجعتها أولاً.",
    questionPaletteTitle: "لوحة استعراض الأسئلة",
    close: "إغلاق",
    language: "اللغة",
    changeLanguage: "اختر لغة التقييم",
    visualQuestion: "سؤال مرئي",
    clickToExpand: "انقر للتكبير",
    timeRemaining: "الوقت",
  },
};

/**
 * Returns translated label for the given key and language, falling back to English seamlessly.
 */
export function getRunnerTranslation(key: TranslationKey, languageCode = "en"): string {
  const lang = (languageCode || "en").toLowerCase();
  const dict = RUNNER_TRANSLATIONS[lang] || RUNNER_TRANSLATIONS.en;
  return dict[key] || RUNNER_TRANSLATIONS.en[key] || key;
}
