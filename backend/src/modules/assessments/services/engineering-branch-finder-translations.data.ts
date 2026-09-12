/**
 * 3G MELIFE | ENGINEERING BRANCH FINDER TRANSLATION DICTIONARIES
 * Multilingual Engine (en, ml, hi, ta, kn, ar)
 */

export interface EngineeringSectionTranslationDTO {
  sectionCode: string;
  languageCode: string;
  name: string;
  description: string;
}

export interface EngineeringDimensionTranslationDTO {
  dimensionCode: string;
  languageCode: string;
  name: string;
}

export interface EngineeringOptionTranslationDTO {
  optionKey: string;
  languageCode: string;
  optionText: string;
}

export interface EngineeringQuestionTranslationDTO {
  questionNumber: number;
  itemId: string;
  languageCode: string;
  questionText: string;
}

export const ENGINEERING_SECTION_TRANSLATIONS: EngineeringSectionTranslationDTO[] = [
  {
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "languageCode": "ml",
    "name": "എഞ്ചിനീയറിംഗ് ബ്രാഞ്ച് താല്പര്യങ്ങൾ",
    "description": "വിവിധ എഞ്ചിനീയറിംഗ് മേഖലകളിലെ നിങ്ങളുടെ താല്പര്യങ്ങളും മുൻഗണനകളും വിലയിരുത്തുന്നു."
  },
  {
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "languageCode": "hi",
    "name": "इंजीनियरिंग शाखा प्राथमिकताएं",
    "description": "विभिन्न इंजीनियरिंग क्षेत्रों में आपकी रुचि और प्राथमिकताओं का मूल्यांकन।"
  },
  {
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "languageCode": "ta",
    "name": "பொறியியல் துறை விருப்பத்தேர்வுகள்",
    "description": "பல்வேறு பொறியியல் துறைகளில் உங்கள் ஆர்வம் மற்றும் விருப்பங்களை மதிப்பிடுகிறது."
  },
  {
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "languageCode": "kn",
    "name": "ಇಂಜಿನಿಯರಿಂಗ್ ಶಾಖೆಯ ಆದ್ಯತೆಗಳು",
    "description": "ವಿವಿಧ ಇಂಜಿನಿಯರಿಂಗ್ ಕ್ಷೇತ್ರಗಳಲ್ಲಿ ನಿಮ್ಮ ಆಸಕ್ತಿ ಮತ್ತು ಒಲವನ್ನು ಮೌಲ್ಯಮಾಪನ ಮಾಡುತ್ತದೆ."
  },
  {
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "languageCode": "ar",
    "name": "تفضيلات فروع الهندسة",
    "description": "يستكشف اهتماماتك وتفضيلاتك عبر مجالات الهندسة المختلفة."
  },
  {
    "sectionCode": "FORCED_CHOICE_SCENARIOS",
    "languageCode": "ml",
    "name": "എഞ്ചിനീയറിംഗ് പ്രോജക്ട് സാഹചര്യങ്ങൾ",
    "description": "നിങ്ങൾക്ക് ഏറ്റവും ആകർഷകമായി തോന്നുന്ന പ്രായോഗിക എഞ്ചിനീയറിംഗ് പ്രോജക്ടുകൾ തിരഞ്ഞെടുക്കുക."
  },
  {
    "sectionCode": "FORCED_CHOICE_SCENARIOS",
    "languageCode": "hi",
    "name": "इंजीनियरिंग परियोजना परिदृश्य",
    "description": "व्यावहारिक इंजीनियरिंग प्रोजेक्ट्स और स्थितियों में अपनी पसंदीदा गतिविधियां चुनें।"
  },
  {
    "sectionCode": "FORCED_CHOICE_SCENARIOS",
    "languageCode": "ta",
    "name": "பொறியியல் திட்டச் சூழல்கள்",
    "description": "உங்களுக்கு மிகவும் விருப்பமான நடைமுறை பொறியியல் திட்டங்களைத் தேர்வு செய்யவும்."
  },
  {
    "sectionCode": "FORCED_CHOICE_SCENARIOS",
    "languageCode": "kn",
    "name": "ಇಂಜಿನಿಯರಿಂಗ್ ಯೋಜನೆ ಸನ್ನಿವೇಶಗಳು",
    "description": "ನಿಮಗೆ ಹೆಚ್ಚು ಆಸಕ್ತಿದಾಯಕವಾಗಿರುವ ಪ್ರಾಯೋಗಿಕ ಇಂಜಿನಿಯರಿಂಗ್ ಯೋಜನೆಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ."
  },
  {
    "sectionCode": "FORCED_CHOICE_SCENARIOS",
    "languageCode": "ar",
    "name": "سيناريوهات المشاريع الهندسية",
    "description": "اختر الأنشطة والمشاريع الهندسية العملية التي تفضلها حقاً."
  }
];

export const ENGINEERING_DIMENSION_TRANSLATIONS: EngineeringDimensionTranslationDTO[] = [
  {
    "dimensionCode": "CSE_ENGINEERING_INTEREST",
    "languageCode": "ml",
    "name": "കമ്പ്യൂട്ടർ സയൻസ് - എഞ്ചിനീയറിംഗ് താല്പര്യം"
  },
  {
    "dimensionCode": "CSE_ENGINEERING_INTEREST",
    "languageCode": "hi",
    "name": "कंप्यूटर साइंस - इंजीनियरिंग रुचि"
  },
  {
    "dimensionCode": "CSE_ENGINEERING_INTEREST",
    "languageCode": "ta",
    "name": "கணினி அறிவியல் - பொறியியல் ஆர்வம்"
  },
  {
    "dimensionCode": "CSE_ENGINEERING_INTEREST",
    "languageCode": "kn",
    "name": "ಕಂಪ್ಯೂಟರ್ ಸೈನ್ಸ್ - ಇಂಜಿನಿಯರಿಂಗ್ ಆಸಕ್ತಿ"
  },
  {
    "dimensionCode": "CSE_ENGINEERING_INTEREST",
    "languageCode": "ar",
    "name": "علوم الحاسوب - الاهتمام الهندسي"
  },
  {
    "dimensionCode": "CSE_ANALYTICAL_&_MATHEMATICAL_THINKING",
    "languageCode": "ml",
    "name": "കമ്പ്യൂട്ടർ സയൻസ് - അനലിറ്റിക്കൽ ചിന്താഗതി"
  },
  {
    "dimensionCode": "CSE_ANALYTICAL_&_MATHEMATICAL_THINKING",
    "languageCode": "hi",
    "name": "कंप्यूटर साइंस - विश्लेषणात्मक सोच"
  },
  {
    "dimensionCode": "CSE_ANALYTICAL_&_MATHEMATICAL_THINKING",
    "languageCode": "ta",
    "name": "கணினி அறிவியல் - பகுப்பாய்வு சிந்தனை"
  },
  {
    "dimensionCode": "CSE_ANALYTICAL_&_MATHEMATICAL_THINKING",
    "languageCode": "kn",
    "name": "ಕಂಪ್ಯೂಟರ್ ಸೈನ್ಸ್ - ವಿಶ್ಲೇಷಣಾತ್ಮಕ ಚಿಂತನೆ"
  },
  {
    "dimensionCode": "CSE_ANALYTICAL_&_MATHEMATICAL_THINKING",
    "languageCode": "ar",
    "name": "علوم الحاسوب - التفكير التحليلي"
  },
  {
    "dimensionCode": "FORCED_CHOICE_SCENARIOS",
    "languageCode": "ml",
    "name": "എഞ്ചിനീയറിംഗ് പ്രോജക്ട് സാഹചര്യങ്ങൾ"
  },
  {
    "dimensionCode": "FORCED_CHOICE_SCENARIOS",
    "languageCode": "hi",
    "name": "इंजीनियरिंग परियोजना परिदृश्य"
  },
  {
    "dimensionCode": "FORCED_CHOICE_SCENARIOS",
    "languageCode": "ta",
    "name": "பொறியியல் திட்டச் சூழல்கள்"
  },
  {
    "dimensionCode": "FORCED_CHOICE_SCENARIOS",
    "languageCode": "kn",
    "name": "ಇಂಜಿನಿಯರಿಂಗ್ ಯೋಜನೆ ಸನ್ನಿವೇಶಗಳು"
  },
  {
    "dimensionCode": "FORCED_CHOICE_SCENARIOS",
    "languageCode": "ar",
    "name": "سيناريوهات المشاريع الهندسية"
  }
];

export const ENGINEERING_LIKERT_OPTIONS: EngineeringOptionTranslationDTO[] = [
  {
    "optionKey": "1",
    "languageCode": "ml",
    "optionText": "എന്നെപ്പോലെയല്ല"
  },
  {
    "optionKey": "1",
    "languageCode": "hi",
    "optionText": "बिल्कुल मेरे जैसा नहीं"
  },
  {
    "optionKey": "1",
    "languageCode": "ta",
    "optionText": "என்னைப்போல் இல்லை"
  },
  {
    "optionKey": "1",
    "languageCode": "kn",
    "optionText": "ನನ್ನಂತಲ್ಲ"
  },
  {
    "optionKey": "1",
    "languageCode": "ar",
    "optionText": "لا يشبهني على الإطلاق"
  },
  {
    "optionKey": "2",
    "languageCode": "ml",
    "optionText": "കുറച്ചൊക്കെ എന്നെപ്പോലെയാണ്"
  },
  {
    "optionKey": "2",
    "languageCode": "hi",
    "optionText": "थोड़ा बहुत मेरे जैसा"
  },
  {
    "optionKey": "2",
    "languageCode": "ta",
    "optionText": "கொஞ்சம் என்னைப்போல் உள்ளது"
  },
  {
    "optionKey": "2",
    "languageCode": "kn",
    "optionText": "ಸ್ವಲ್ಪ ನನ್ನಂತೆ"
  },
  {
    "optionKey": "2",
    "languageCode": "ar",
    "optionText": "يشبهني قليلاً"
  },
  {
    "optionKey": "3",
    "languageCode": "ml",
    "optionText": "ഏറെക്കുറെ എന്നെപ്പോലെയാണ്"
  },
  {
    "optionKey": "3",
    "languageCode": "hi",
    "optionText": "काफ़ी हद तक मेरे जैसा"
  },
  {
    "optionKey": "3",
    "languageCode": "ta",
    "optionText": "பெரும்பாலும் என்னைப்போல் உள்ளது"
  },
  {
    "optionKey": "3",
    "languageCode": "kn",
    "optionText": "ಹೆಚ್ಚಾಗಿ ನನ್ನಂತೆ"
  },
  {
    "optionKey": "3",
    "languageCode": "ar",
    "optionText": "يشبهني إلى حد كبير"
  },
  {
    "optionKey": "4",
    "languageCode": "ml",
    "optionText": "തീർച്ചയായും എന്നെപ്പോലെ തന്നെയാണ്"
  },
  {
    "optionKey": "4",
    "languageCode": "hi",
    "optionText": "बिल्कुल मेरे जैसा"
  },
  {
    "optionKey": "4",
    "languageCode": "ta",
    "optionText": "முற்றிலும் என்னைப்போல் உள்ளது"
  },
  {
    "optionKey": "4",
    "languageCode": "kn",
    "optionText": "ಸಂಪೂರ್ಣವಾಗಿ ನನ್ನಂತೆ"
  },
  {
    "optionKey": "4",
    "languageCode": "ar",
    "optionText": "يشبهني تماماً"
  }
];

export const ENGINEERING_QUESTION_TRANSLATIONS: EngineeringQuestionTranslationDTO[] = [
  {
    "questionNumber": 1,
    "itemId": "E01",
    "languageCode": "ml",
    "questionText": "സോഫ്റ്റ്‌വെയറുകൾ, അൽഗോരിതങ്ങൾ, അല്ലെങ്കിൽ ഡിജിറ്റൽ സംവിധാനങ്ങൾ എങ്ങനെ പ്രശ്നങ്ങൾ പരിഹരിക്കുന്നു എന്ന് ചിന്തിക്കാൻ ഞാൻ ഇഷ്ടപ്പെടുന്നു."
  },
  {
    "questionNumber": 1,
    "itemId": "E01",
    "languageCode": "hi",
    "questionText": "मुझे यह सोचना अच्छा लगता है कि सॉफ्टवेयर, एल्गोरिदम या डिजिटल सिस्टम समस्याओं को कैसे हल कर सकते हैं।"
  },
  {
    "questionNumber": 1,
    "itemId": "E01",
    "languageCode": "ta",
    "questionText": "மென்பொருள், அல்காரிதம்கள் அல்லது டிஜிட்டல் அமைப்புகள் எவ்வாறு சிக்கல்களைத் தீர்க்கின்றன என்பதைப் பற்றி சிந்திக்க விரும்புகிறேன்."
  },
  {
    "questionNumber": 1,
    "itemId": "E01",
    "languageCode": "kn",
    "questionText": "ಸಾಫ್ಟ್‌ವೇರ್, ಅಲ್ಗಾರಿದಮ್‌ಗಳು ಅಥವಾ ಡಿಜಿಟಲ್ ವ್ಯವಸ್ಥೆಗಳು ಸಮಸ್ಯೆಗಳನ್ನು ಹೇಗೆ ಪರಿಹರಿಸುತ್ತವೆ ಎಂದು ಯೋಚಿಸಲು ನಾನು ಇಷ್ಟಪಡುತ್ತೇನೆ."
  },
  {
    "questionNumber": 1,
    "itemId": "E01",
    "languageCode": "ar",
    "questionText": "أستمتع بالتفكير في كيفية مساهمة البرمجيات والخوارزميات والأنظمة الرقمية في حل المشكلات."
  },
  {
    "questionNumber": 2,
    "itemId": "E02",
    "languageCode": "ml",
    "questionText": "സങ്കീർണ്ണമായ ഒരു കാര്യത്തെ വ്യക്തമായ ലോജിക്കൽ നിർദ്ദേശങ്ങളായി വിഭജിക്കാൻ ഞാൻ ഇഷ്ടപ്പെടുന്നു."
  },
  {
    "questionNumber": 2,
    "itemId": "E02",
    "languageCode": "hi",
    "questionText": "मुझे किसी जटिल कार्य को स्पष्ट तार्किक निर्देशों में विभाजित करना पसंद है।"
  },
  {
    "questionNumber": 2,
    "itemId": "E02",
    "languageCode": "ta",
    "questionText": "ஒரு சிக்கலான பணியை தெளிவான தர்க்கரீதியான வழிமுறைகளாகப் பிரிப்பதை நான் விரும்புகிறேன்."
  },
  {
    "questionNumber": 2,
    "itemId": "E02",
    "languageCode": "kn",
    "questionText": "ಸಂಕೀರ್ಣ ಕಾರ್ಯವನ್ನು ಸ್ಪಷ್ಟ ತಾರ್ಕಿಕ ಸೂಚನೆಗಳಾಗಿ ವಿಂಗಡಿಸಲು ನಾನು ಇಷ್ಟಪಡುತ್ತೇನೆ."
  },
  {
    "questionNumber": 2,
    "itemId": "E02",
    "languageCode": "ar",
    "questionText": "أحب تفكيك المهام المعقدة إلى تعليمات منطقية متسلسلة وواضحة."
  },
  {
    "questionNumber": 3,
    "itemId": "E03",
    "languageCode": "ml",
    "questionText": "വിവരങ്ങൾ ചിട്ടപ്പെടുത്തുന്നതിനും പ്രോസസ്സ് ചെയ്യുന്നതിനും കാര്യക്ഷമമായ വഴികൾ കണ്ടെത്തുന്നത് ഞാൻ ആസ്വദിക്കുന്നു."
  },
  {
    "questionNumber": 3,
    "itemId": "E03",
    "languageCode": "hi",
    "questionText": "मुझे जानकारी को व्यवस्थित या संसाधित करने के कुशल तरीके खोजना अच्छा लगता है।"
  },
  {
    "questionNumber": 3,
    "itemId": "E03",
    "languageCode": "ta",
    "questionText": "தகவல்களை திறம்பட ஒழுங்கமைக்க அல்லது செயலாக்க புதிய வழிகளைக் கண்டறிவதை நான் ரசிக்கிறேன்."
  },
  {
    "questionNumber": 3,
    "itemId": "E03",
    "languageCode": "kn",
    "questionText": "ಮಾಹಿತಿಯನ್ನು ಸಂಘಟಿಸಲು ಅಥವಾ ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲು ಸಮರ್ಥ ಮಾರ್ಗಗಳನ್ನು ಕಂಡುಹಿಡಿಯುವುದನ್ನು ನಾನು ಆನಂದಿಸುತ್ತೇನೆ."
  },
  {
    "questionNumber": 3,
    "itemId": "E03",
    "languageCode": "ar",
    "questionText": "أستمتع بإيجاد طرق فعالة ومبتكرة لتنظيم البيانات ومعالجة المعلومات."
  },
  {
    "questionNumber": 4,
    "itemId": "E04",
    "languageCode": "ml",
    "questionText": "ആപ്പുകൾ, വെബ്‌സൈറ്റുകൾ, എഐ സിസ്റ്റങ്ങൾ, അല്ലെങ്കിൽ കമ്പ്യൂട്ടർ പ്രോഗ്രാമുകൾ എങ്ങനെ പ്രവർത്തിക്കുന്നു എന്നതിൽ എനിക്ക് കൗതുകമുണ്ട്."
  },
  {
    "questionNumber": 4,
    "itemId": "E04",
    "languageCode": "hi",
    "questionText": "मुझे यह जानने की उत्सुकता है कि ऐप्स, वेबसाइट्स, एआई सिस्टम या कंप्यूटर प्रोग्राम कैसे काम करते हैं।"
  },
  {
    "questionNumber": 4,
    "itemId": "E04",
    "languageCode": "ta",
    "questionText": "செயலிகள், வலைத்தளங்கள், AI அமைப்புகள் அல்லது கணினி நிரல்கள் எவ்வாறு செயல்படுகின்றன என்பதில் எனக்கு ஆர்வம் உள்ளது."
  },
  {
    "questionNumber": 4,
    "itemId": "E04",
    "languageCode": "kn",
    "questionText": "ಆ್ಯಪ್‌ಗಳು, ವೆಬ್‌ಸೈಟ್‌ಗಳು, ಎಐ ಸಿಸ್ಟಮ್‌ಗಳು ಅಥವಾ ಕಂಪ್ಯೂಟರ್ ಪ್ರೋಗ್ರಾಂಗಳು ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತವೆ ಎಂಬುದರ ಬಗ್ಗೆ ನನಗೆ ಕುತೂಹಲವಿದೆ."
  },
  {
    "questionNumber": 4,
    "itemId": "E04",
    "languageCode": "ar",
    "questionText": "لدي فضول كبير لمعرفة كيفية عمل التطبيقات والمواقع الإلكترونية وأنظمة الذكاء الاصطناعي والبرمجيات."
  },
  {
    "questionNumber": 5,
    "itemId": "E05",
    "languageCode": "ml",
    "questionText": "സാധ്യമായ ഓരോ കാരണങ്ങളും ഒന്നൊന്നായി പരിശോധിച്ച് ഒരു പ്രശ്നം പരിഹരിക്കാൻ (debug ചെയ്യാൻ) ഞാൻ ഇഷ്ടപ്പെടുന്നു."
  },
  {
    "questionNumber": 5,
    "itemId": "E05",
    "languageCode": "hi",
    "questionText": "मुझे एक समय में एक संभावित कारण का परीक्षण करके किसी समस्या का समाधान (डिबग) करना पसंद है।"
  },
  {
    "questionNumber": 5,
    "itemId": "E05",
    "languageCode": "ta",
    "questionText": "சாத்தியமான ஒவ்வொரு காரணத்தையும் ஒவ்வொன்றாக சோதித்து ஒரு பிழையை (Debug) சரிசெய்வதை நான் விரும்புகிறேன்."
  },
  {
    "questionNumber": 5,
    "itemId": "E05",
    "languageCode": "kn",
    "questionText": "ಒಂದೊಂದೇ ಸಂಭಾವ್ಯ ಕಾರಣವನ್ನು ಪರೀಕ್ಷಿಸುವ ಮೂಲಕ ಸಮಸ್ಯೆಯನ್ನು ಪರಿಹರಿಸಲು (debug ಮಾಡಲು) ನಾನು ಇಷ್ಟಪಡುತ್ತೇನೆ."
  },
  {
    "questionNumber": 5,
    "itemId": "E05",
    "languageCode": "ar",
    "questionText": "أحب استكشاف الأخطاء وإصلاحها عن طريق اختبار سبب محتمل واحد في كل مرة."
  },
  {
    "questionNumber": 6,
    "itemId": "E06",
    "languageCode": "ml",
    "questionText": "ആവർത്തിച്ചു ചെയ്യേണ്ട ജോലികൾ സ്വയം ചെയ്യാൻ സഹായിക്കുന്ന (automate ചെയ്യുന്ന) ഡിജിറ്റൽ ടൂളുകൾ നിർമ്മിക്കാൻ ഞാൻ ആഗ്രഹിക്കുന്നു."
  },
  {
    "questionNumber": 6,
    "itemId": "E06",
    "languageCode": "hi",
    "questionText": "मुझे ऐसे डिजिटल उपकरण बनाना पसंद आएगा जो बार-बार दोहराए जाने वाले काम को स्वचालित (ऑटोमेट) कर सकें।"
  },
  {
    "questionNumber": 6,
    "itemId": "E06",
    "languageCode": "ta",
    "questionText": "மீண்டும் மீண்டும் செய்யப்படும் வேலைகளைத் தானியங்குபடுத்தும் (Automate) டிஜிட்டல் கருவிகளை உருவாக்க நான் விரும்புவேன்."
  },
  {
    "questionNumber": 6,
    "itemId": "E06",
    "languageCode": "kn",
    "questionText": "ಪುನರಾವರ್ತಿತ ಕೆಲಸವನ್ನು ಸ್ವಯಂಚಾಲಿತಗೊಳಿಸುವ (automate ಮಾಡುವ) ಡಿಜಿಟಲ್ ಪರಿಕರಗಳನ್ನು ರಚಿಸಲು ನಾನು ಬಯಸುತ್ತೇನೆ."
  },
  {
    "questionNumber": 6,
    "itemId": "E06",
    "languageCode": "ar",
    "questionText": "سأستمتع بتطوير أدوات رقمية تعمل على أتمتة الأعمال والمهام المتكررة."
  },
  {
    "questionNumber": 7,
    "itemId": "E07",
    "languageCode": "ml",
    "questionText": "കമ്പ്യൂട്ടറിൽ ഡിസൈൻ ചെയ്യാനും പരീക്ഷിക്കാനും കഴിയുന്ന പ്രശ്നങ്ങളിൽ പ്രവർത്തിക്കാനാണ് ഞാൻ കൂടുതൽ മുൻഗണന നൽകുന്നത്."
  },
  {
    "questionNumber": 7,
    "itemId": "E07",
    "languageCode": "hi",
    "questionText": "मैं उन समस्याओं पर काम करना पसंद करता हूँ जिनका समाधान कंप्यूटर पर डिज़ाइन और परीक्षण किया जा सके।"
  },
  {
    "questionNumber": 7,
    "itemId": "E07",
    "languageCode": "ta",
    "questionText": "கணினியிலேயே தீர்வினை வடிவமைத்து சோதிக்கக்கூடிய சிக்கல்களில் பணியாற்றுவதையே நான் அதிகம் விரும்புகிறேன்."
  },
  {
    "questionNumber": 7,
    "itemId": "E07",
    "languageCode": "kn",
    "questionText": "ಕಂಪ್ಯೂಟರ್‌ನಲ್ಲಿ ಪರಿಹಾರವನ್ನು ವಿನ್ಯಾಸಗೊಳಿಸಿ ಪರೀಕ್ಷಿಸಬಹುದಾದ ಸಮಸ್ಯೆಗಳ ಮೇಲೆ ಕೆಲಸ ಮಾಡಲು ನಾನು ಬಯಸುತ್ತೇನೆ."
  },
  {
    "questionNumber": 7,
    "itemId": "E07",
    "languageCode": "ar",
    "questionText": "أفضل العمل على المشكلات التي يمكن تصميم واختبار حلولها رقمياً على أجهزة الحاسوب."
  },
  {
    "questionNumber": 8,
    "itemId": "E08",
    "languageCode": "ml",
    "questionText": "സൈബർ സുരക്ഷ, ഡാറ്റാ സയൻസ്, അല്ലെങ്കിൽ ഇന്റലിജന്റ് സോഫ്റ്റ്‌വെയറുകൾ ദൈനംദിന ജീവിതത്തെ എങ്ങനെ സ്വാധീനിക്കുന്നു എന്നതിൽ എനിക്ക് താല്പര്യമുണ്ട്."
  },
  {
    "questionNumber": 8,
    "itemId": "E08",
    "languageCode": "hi",
    "questionText": "मुझे इसमें रुचि है कि साइबर सुरक्षा, डेटा विज्ञान या इंटेलिजेंट सॉफ्टवेयर रोज़मर्रा की ज़िंदगी को कैसे प्रभावित करते हैं।"
  },
  {
    "questionNumber": 8,
    "itemId": "E08",
    "languageCode": "ta",
    "questionText": "சைபர் பாதுகாப்பு, தரவு அறிவியல் அல்லது நுண்ணறிவு மென்பொருள்கள் அன்றாட வாழ்க்கையை எவ்வாறு பாதிக்கின்றன என்பதில் ஆர்வமாக உள்ளேன்."
  },
  {
    "questionNumber": 8,
    "itemId": "E08",
    "languageCode": "kn",
    "questionText": "ಸೈಬರ್ ಭದ್ರತೆ, ಡೇಟಾ ಸೈನ್ಸ್ ಅಥವಾ ಬುದ್ಧಿವಂತ ಸಾಫ್ಟ್‌ವೇರ್ ದೈನಂದಿನ ಜೀವನದ ಮೇಲೆ ಹೇಗೆ ಪ್ರಭಾವ ಬೀರುತ್ತದೆ ಎಂಬುದರಲ್ಲಿ ನನಗೆ ಆಸಕ್ತಿಯಿದೆ."
  },
  {
    "questionNumber": 8,
    "itemId": "E08",
    "languageCode": "ar",
    "questionText": "يهمني فهم أثر الأمن السيبراني وعلم البيانات والبرمجيات الذكية على حياتنا اليومية."
  },
  {
    "questionNumber": 9,
    "itemId": "E09",
    "languageCode": "ml",
    "questionText": "വയർലെസ് ഉപകരണങ്ങളും സിഗ്നലുകളും ആന്റിനകളും തമ്മിൽ എങ്ങനെ ആശയവിനിമയം നടത്തുന്നു എന്ന് മനസ്സിലാക്കാൻ എനിക്ക് കൗതുകമുണ്ട്."
  },
  {
    "questionNumber": 9,
    "itemId": "E09",
    "languageCode": "hi",
    "questionText": "मुझे यह जानने की उत्सुकता है कि वायरलेस डिवाइस, सिग्नल और एंटेना कैसे संचार करते हैं।"
  },
  {
    "questionNumber": 9,
    "itemId": "E09",
    "languageCode": "ta",
    "questionText": "வயர்லெஸ் சாதனங்கள், சிக்னல்கள் மற்றும் ஆண்டெனாக்கள் எவ்வாறு தொடர்பு கொள்கின்றன என்பதைப் பற்றி அறிய ஆர்வமாக உள்ளேன்."
  },
  {
    "questionNumber": 9,
    "itemId": "E09",
    "languageCode": "kn",
    "questionText": "ವೈರ್‌ಲೆಸ್ ಸಾಧನಗಳು, ಸಿಗ್ನಲ್‌ಗಳು ಮತ್ತು ಆಂಟೆನಾಗಳು ಹೇಗೆ ಸಂವಹನ ನಡೆಸುತ್ತವೆ ಎಂಬುದನ್ನು ತಿಳಿದುಕೊಳ್ಳಲು ನನಗೆ ಕುತೂಹಲವಿದೆ."
  },
  {
    "questionNumber": 9,
    "itemId": "E09",
    "languageCode": "ar",
    "questionText": "لدي فضول لمعرفة كيفية اتصال الأجهزة اللاسلكية والإشارات الهوائية ببعضها."
  },
  {
    "questionNumber": 10,
    "itemId": "E10",
    "languageCode": "ml",
    "questionText": "സെൻസറുകൾ എങ്ങനെ ശബ്ദം, വെളിച്ചം, താപനില, അല്ലെങ്കിൽ ചലനം എന്നിവ കണ്ടെത്തുന്നു എന്ന് പഠിക്കാൻ ഞാൻ ഇഷ്ടപ്പെടുന്നു."
  },
  {
    "questionNumber": 10,
    "itemId": "E10",
    "languageCode": "hi",
    "questionText": "मुझे यह सीखना अच्छा लगता है कि सेंसर ध्वनि, प्रकाश, तापमान या गति का पता कैसे लगाते हैं।"
  },
  {
    "questionNumber": 10,
    "itemId": "E10",
    "languageCode": "ta",
    "questionText": "சென்சார்கள் எவ்வாறு ஒலி, ஒளி, வெப்பநிலை அல்லது அசைவைக் கண்டறிகின்றன என்பதைப் பற்றி அறிய விரும்புகிறேன்."
  },
  {
    "questionNumber": 10,
    "itemId": "E10",
    "languageCode": "kn",
    "questionText": "ಸಂವೇದಕಗಳು (Sensors) ಶಬ್ದ, ಬೆಳಕು, ತಾಪಮಾನ ಅಥವಾ ಚಲನೆಯನ್ನು ಹೇಗೆ ಪತ್ತೆಹಚ್ಚುತ್ತವೆ ಎಂದು ಕಲಿಯಲು ನಾನು ಇಷ್ಟಪಡುತ್ತೇನೆ."
  },
  {
    "questionNumber": 10,
    "itemId": "E10",
    "languageCode": "ar",
    "questionText": "أستمتع بمعرفة كيفية استشعار الحساسات للصوت والضوء ودرجة الحرارة والحركة."
  },
  {
    "questionNumber": 11,
    "itemId": "E11",
    "languageCode": "ml",
    "questionText": "മൈക്രോകൺട്രോളറുകൾ, സർക്യൂട്ട് ബോർഡുകൾ, ഇലക്ട്രോണിക് ഘടകങ്ങൾ എന്നിവ ഉപയോഗിച്ച് പ്രവർത്തിക്കാൻ ഞാൻ ഇഷ്ടപ്പെടുന്നു."
  },
  {
    "questionNumber": 11,
    "itemId": "E11",
    "languageCode": "hi",
    "questionText": "मुझे माइक्रोकंट्रोलर, सर्किट बोर्ड और इलेक्ट्रॉनिक उपकरणों के साथ काम करना पसंद है।"
  },
  {
    "questionNumber": 11,
    "itemId": "E11",
    "languageCode": "ta",
    "questionText": "மைக்ரோகண்ட்ரோலர்கள், சர்க்யூட் போர்டுகள் மற்றும் மின்னணுக் கூறுகளுடன் வேலை செய்வதை நான் விரும்புகிறேன்."
  },
  {
    "questionNumber": 11,
    "itemId": "E11",
    "languageCode": "kn",
    "questionText": "ಮೈಕ್ರೋಕಂಟ್ರೋಲರ್‌ಗಳು, ಸರ್ಕ್ಯೂಟ್ ಬೋರ್ಡ್‌ಗಳು ಮತ್ತು ಎಲೆಕ್ಟ್ರಾನಿಕ್ ಘಟಕಗಳೊಂದಿಗೆ ಕೆಲಸ ಮಾಡಲು ನಾನು ಇಷ್ಟಪಡುತ್ತೇನೆ."
  },
  {
    "questionNumber": 11,
    "itemId": "E11",
    "languageCode": "ar",
    "questionText": "أحب العمل مع المتحكمات الدقيقة، واللوحات الإلكترونية، والقطع الإلكترونية المتنوعة."
  },
  {
    "questionNumber": 12,
    "itemId": "E12",
    "languageCode": "ml",
    "questionText": "സ്മാർട്ട്‌ഫോണുകൾ, ഉപഗ്രഹ വിനിമയം, റഡാർ സംവിധാനങ്ങൾ എന്നിവ എങ്ങനെ പ്രവർത്തിക്കുന്നു എന്നതിൽ എനിക്ക് താല്പര്യമുണ്ട്."
  },
  {
    "questionNumber": 12,
    "itemId": "E12",
    "languageCode": "hi",
    "questionText": "स्मार्टफोन, सैटेलाइट संचार और रडार सिस्टम कैसे काम करते हैं, इसमें मेरी रुचि है।"
  },
  {
    "questionNumber": 12,
    "itemId": "E12",
    "languageCode": "ta",
    "questionText": "ஸ்மார்ட்போன்கள், செயற்கைக்கோள் தகவல் தொடர்பு மற்றும் ரேடார் அமைப்புகள் எவ்வாறு செயல்படுகின்றன என்பதில் ஆர்வமாக உள்ளேன்."
  },
  {
    "questionNumber": 12,
    "itemId": "E12",
    "languageCode": "kn",
    "questionText": "ಸ್ಮಾರ್ಟ್‌ಫೋನ್‌ಗಳು, ಉಪಗ್ರಹ ಸಂವಹನ ಮತ್ತು ರೇಡಾರ್ ವ್ಯವಸ್ಥೆಗಳು ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತವೆ ಎಂಬುದರಲ್ಲಿ ನನಗೆ ಆಸಕ್ತಿಯಿದೆ."
  },
  {
    "questionNumber": 12,
    "itemId": "E12",
    "languageCode": "ar",
    "questionText": "أهتم بمعرفة كيفية عمل الهواتف الذكية، والاتصالات الفضائية عبر الأقمار الصناعية، وأنظمة الرادار."
  },
  {
    "questionNumber": 13,
    "itemId": "E13",
    "languageCode": "ml",
    "questionText": "ഒരു ഇലക്ട്രോണിക് ഉപകരണമോ ആശയവിനിമയ സിഗ്നലോ പ്രവർത്തിക്കാത്തതിന്റെ കാരണം കണ്ടെത്തുന്നത് ഞാൻ ആസ്വദിക്കുന്നു."
  },
  {
    "questionNumber": 13,
    "itemId": "E13",
    "languageCode": "hi",
    "questionText": "कोई इलेक्ट्रॉनिक उपकरण या संचार सिग्नल काम क्यों नहीं कर रहा है, इसका पता लगाने में मुझे आनंद आता है।"
  },
  {
    "questionNumber": 13,
    "itemId": "E13",
    "languageCode": "ta",
    "questionText": "ஒரு மின்னணு சாதனம் அல்லது தகவல் தொடர்பு சிக்னல் ஏன் வேலை செய்யவில்லை என்பதைக் கண்டறிவதை நான் ரசிக்கிறேன்."
  },
  {
    "questionNumber": 13,
    "itemId": "E13",
    "languageCode": "kn",
    "questionText": "ಎಲೆಕ್ಟ್ರಾನಿಕ್ ಸಾಧನ ಅಥವಾ ಸಂವಹನ ಸಿಗ್ನಲ್ ಏಕೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತಿಲ್ಲ ಎಂಬುದನ್ನು ಪತ್ತೆಹಚ್ಚುವುದನ್ನು ನಾನು ಆನಂದಿಸುತ್ತೇನೆ."
  },
  {
    "questionNumber": 13,
    "itemId": "E13",
    "languageCode": "ar",
    "questionText": "أستمتع بتشخيص وتحليل أسباب تعطل الأجهزة الإلكترونية أو انقطاع إشارات الاتصال."
  },
  {
    "questionNumber": 14,
    "itemId": "E14",
    "languageCode": "ml",
    "questionText": "ഓഡിയോ, വീഡിയോ, അല്ലെങ്കിൽ ഡാറ്റാ സിഗ്നലുകളുടെ ഗുണനിലവാരം മെച്ചപ്പെടുത്താൻ പരീക്ഷണങ്ങൾ നടത്താൻ ഞാൻ ഇഷ്ടപ്പെടുന്നു."
  },
  {
    "questionNumber": 14,
    "itemId": "E14",
    "languageCode": "hi",
    "questionText": "मुझे गुणवत्ता सुधारने के लिए ऑडियो, वीडियो या डेटा सिग्नल के साथ प्रयोग करना पसंद है।"
  },
  {
    "questionNumber": 14,
    "itemId": "E14",
    "languageCode": "ta",
    "questionText": "ஆடியோ, வீடியோ அல்லது தரவு சிக்னல்களின் தரத்தை மேம்படுத்த சோதனைகள் செய்வதை நான் விரும்புகிறேன்."
  },
  {
    "questionNumber": 14,
    "itemId": "E14",
    "languageCode": "kn",
    "questionText": "ಆಡಿಯೋ, ವೀಡಿಯೋ ಅಥವಾ ಡೇಟಾ ಸಿಗ್ನಲ್‌ಗಳ ಗುಣಮಟ್ಟವನ್ನು ಸುಧಾರಿಸಲು ಪ್ರಯೋಗಗಳನ್ನು ಮಾಡಲು ನಾನು ಇಷ್ಟಪಡುತ್ತೇನೆ."
  },
  {
    "questionNumber": 14,
    "itemId": "E14",
    "languageCode": "ar",
    "questionText": "أحب إجراء تجارب لتحسين جودة ونقاء إشارات الصوت والفيديو ونقل البيانات."
  },
  {
    "questionNumber": 15,
    "itemId": "E15",
    "languageCode": "ml",
    "questionText": "എംബഡഡ് ചിപ്പുകൾ ഉൾപ്പെടുത്തിയ ധരിക്കാവുന്ന ഉപകരണങ്ങളോ (wearables) സ്മാർട്ട് ഗാഡ്‌ജെറ്റുകളോ രൂപകൽപ്പന ചെയ്യുന്നത് ഞാൻ ആസ്വദിക്കും."
  },
  {
    "questionNumber": 15,
    "itemId": "E15",
    "languageCode": "hi",
    "questionText": "मुझे एम्बेडेड चिप्स वाले पहनने योग्य उपकरण (wearables) या स्मार्ट गैजेट डिज़ाइन करने में मज़ा आएगा।"
  },
  {
    "questionNumber": 15,
    "itemId": "E15",
    "languageCode": "ta",
    "questionText": "எம்படட் சிப்கள் கொண்ட அணியக்கூடிய சாதனங்கள் (Wearables) அல்லது ஸ்மார்ட் கேஜெட்களை வடிவமைப்பதை நான் ரசிப்பேன்."
  },
  {
    "questionNumber": 15,
    "itemId": "E15",
    "languageCode": "kn",
    "questionText": "ಎಂಬೆಡೆಡ್ ಚಿಪ್‌ಗಳನ್ನು ಹೊಂದಿರುವ ಧರಿಸಬಹುದಾದ ಸಾಧನಗಳು ಅಥವಾ ಸ್ಮಾರ್ಟ್ ಗ್ಯಾಜೆಟ್‌ಗಳನ್ನು ವಿನ್ಯಾಸಗೊಳಿಸುವುದನ್ನು ನಾನು ಆನಂದಿಸುತ್ತೇನೆ."
  },
  {
    "questionNumber": 15,
    "itemId": "E15",
    "languageCode": "ar",
    "questionText": "سأستمتع بتصميم الأجهزة القابلة للارتداء والأدوات الذكية المزودة بشرائح إلكترونية مدمجة."
  },
  {
    "questionNumber": 16,
    "itemId": "E16",
    "languageCode": "ml",
    "questionText": "5G/6G, ഐഒടി (IoT), അതിവേഗ കമ്മ്യൂണിക്കേഷൻ നെറ്റ്‌വർക്കുകൾ എന്നിവയുടെ പിന്നിലെ സാങ്കേതികവിദ്യ എന്നെ ആകർഷിക്കുന്നു."
  },
  {
    "questionNumber": 16,
    "itemId": "E16",
    "languageCode": "hi",
    "questionText": "5G/6G, IoT और हाई-स्पीड संचार नेटवर्क के पीछे की तकनीक मुझे रोमांचित करती है।"
  },
  {
    "questionNumber": 16,
    "itemId": "E16",
    "languageCode": "ta",
    "questionText": "5G/6G, IoT மற்றும் அதிவேக தகவல் தொடர்பு நெட்வொர்க்குகளுக்குப் பின்னால் உள்ள தொழில்நுட்பம் என்னை உற்சாகப்படுத்துகிறது."
  },
  {
    "questionNumber": 16,
    "itemId": "E16",
    "languageCode": "kn",
    "questionText": "5G/6G, IoT ಮತ್ತು ಹೈ-ಸ್ಪೀಡ್ ಸಂವಹನ ಜಾಲಗಳ ಹಿಂದಿನ ತಂತ್ರಜ್ಞಾನವು ನನ್ನನ್ನು ಆಕರ್ಷಿಸುತ್ತದೆ."
  },
  {
    "questionNumber": 16,
    "itemId": "E16",
    "languageCode": "ar",
    "questionText": "تبهرني التقنيات المتقدمة الكامنة وراء شبكات الجيل الخامس والسادس وإنترنت الأشياء والاتصالات الفائقة."
  },
  {
    "questionNumber": 17,
    "itemId": "E17",
    "languageCode": "ml",
    "questionText": "വൻതോതിൽ വൈദ്യുതി എങ്ങനെ ഉത്പാദിപ്പിക്കപ്പെടുന്നു, പ്രസരണം ചെയ്യപ്പെടുന്നു, വിതരണം ചെയ്യപ്പെടുന്നു എന്ന് അറിയാൻ ഞാൻ ആഗ്രഹിക്കുന്നു."
  },
  {
    "questionNumber": 17,
    "itemId": "E17",
    "languageCode": "hi",
    "questionText": "मुझे यह जानने की उत्सुकता है कि बड़े पैमाने पर बिजली कैसे उत्पन्न, संचारित और वितरित की जाती है।"
  },
  {
    "questionNumber": 17,
    "itemId": "E17",
    "languageCode": "ta",
    "questionText": "பெரிய அளவில் மின்சாரம் எவ்வாறு உற்பத்தி செய்யப்படுகிறது, கடத்தப்படுகிறது மற்றும் விநியோகிக்கப்படுகிறது என்பதை அறிய விரும்புகிறேன்."
  },
  {
    "questionNumber": 17,
    "itemId": "E17",
    "languageCode": "kn",
    "questionText": "ದೊಡ್ಡ ಪ್ರಮಾಣದಲ್ಲಿ ವಿದ್ಯುತ್ ಹೇಗೆ ಉತ್ಪತ್ತಿಯಾಗುತ್ತದೆ, ಪ್ರಸರಣಗೊಳ್ಳುತ್ತದೆ ಮತ್ತು ವಿತರಿಸಲ್ಪಡುತ್ತದೆ ಎಂಬುದನ್ನು ತಿಳಿಯಲು ನನಗೆ ಕುತೂಹಲವಿದೆ."
  },
  {
    "questionNumber": 17,
    "itemId": "E17",
    "languageCode": "ar",
    "questionText": "لدي فضول لمعرفة كيفية توليد الكهرباء ونقلها وتوزيعها على نطاق واسع في المدن."
  },
  {
    "questionNumber": 18,
    "itemId": "E18",
    "languageCode": "ml",
    "questionText": "ഇലക്ട്രിക് മോട്ടോറുകൾ, ട്രാൻസ്ഫോർമറുകൾ, പവർ ജനറേറ്ററുകൾ എന്നിവയെക്കുറിച്ച് പഠിക്കാൻ ഞാൻ ഇഷ്ടപ്പെടുന്നു."
  },
  {
    "questionNumber": 18,
    "itemId": "E18",
    "languageCode": "hi",
    "questionText": "मुझे इलेक्ट्रिक मोटर, ट्रांसफार्मर और पावर जनरेटर के बारे में सीखना अच्छा लगता है।"
  },
  {
    "questionNumber": 18,
    "itemId": "E18",
    "languageCode": "ta",
    "questionText": "மின்சார மோட்டார்கள், டிரான்ஸ்பார்மர்கள் மற்றும் மின் உற்பத்திக் கருவிகளைப் பற்றி படிக்க விரும்புகிறேன்."
  },
  {
    "questionNumber": 18,
    "itemId": "E18",
    "languageCode": "kn",
    "questionText": "ಎಲೆಕ್ಟ್ರಿಕ್ ಮೋಟಾರ್‌ಗಳು, ಟ್ರಾನ್ಸ್‌ಫಾರ್ಮರ್‌ಗಳು ಮತ್ತು ಪವರ್ ಜನರೇಟರ್‌ಗಳ ಬಗ್ಗೆ ಕಲಿಯಲು ನಾನು ಇಷ್ಟಪಡುತ್ತೇನೆ."
  },
  {
    "questionNumber": 18,
    "itemId": "E18",
    "languageCode": "ar",
    "questionText": "أستمتع بالتعرف على المحركات الكهربائية والمحولات ومولدات الطاقة الكبرى."
  },
  {
    "questionNumber": 19,
    "itemId": "E19",
    "languageCode": "ml",
    "questionText": "സോളാർ പാനലുകൾ, വിൻഡ് ടർബൈനുകൾ തുടങ്ങിയ പുനരുപയോഗ ഊർജ്ജ സംവിധാനങ്ങളിൽ എനിക്ക് താല്പര്യമുണ്ട്."
  },
  {
    "questionNumber": 19,
    "itemId": "E19",
    "languageCode": "hi",
    "questionText": "सौर पैनल और पवन टरबाइन जैसे नवीकरणीय ऊर्जा प्रणालियों में मेरी गहरी रुचि है।"
  },
  {
    "questionNumber": 19,
    "itemId": "E19",
    "languageCode": "ta",
    "questionText": "சூரிய மின் தகடுகள் மற்றும் காற்றாலைகள் போன்ற புதுப்பிக்கத்தக்க ஆற்றல் அமைப்புகளில் ஆர்வமாக உள்ளேன்."
  },
  {
    "questionNumber": 19,
    "itemId": "E19",
    "languageCode": "kn",
    "questionText": "ಸೌರ ಫಲಕಗಳು ಮತ್ತು ಗಾಳಿ ಟರ್ಬೈನ್‌ಗಳಂತಹ ನವೀಕರಿಸಬಹುದಾದ ಇಂಧನ ವ್ಯವಸ್ಥೆಗಳಲ್ಲಿ ನನಗೆ ಆಸಕ್ತಿಯಿದೆ."
  },
  {
    "questionNumber": 19,
    "itemId": "E19",
    "languageCode": "ar",
    "questionText": "أهتم بأنظمة الطاقة المتجددة والنظيفة مثل الألواح الشمسية وتوربينات الرياح."
  },
  {
    "questionNumber": 20,
    "itemId": "E20",
    "languageCode": "ml",
    "questionText": "ഇലക്ട്രിക് വാഹനങ്ങൾ (EVs) എങ്ങനെയാണ് വൈദ്യുതോർജ്ജം സംഭരിക്കുന്നതും നിയന്ത്രിക്കുന്നതും എന്ന് മനസ്സിലാക്കാൻ ഞാൻ ഇഷ്ടപ്പെടുന്നു."
  },
  {
    "questionNumber": 20,
    "itemId": "E20",
    "languageCode": "hi",
    "questionText": "मुझे यह समझना पसंद है कि इलेक्ट्रिक वाहन (EVs) विद्युत ऊर्जा को कैसे स्टोर और प्रबंधित करते हैं।"
  },
  {
    "questionNumber": 20,
    "itemId": "E20",
    "languageCode": "ta",
    "questionText": "மின்சார வாகனங்கள் (EVs) எவ்வாறு மின் ஆற்றலைச் சேமித்து நிர்வகிக்கின்றன என்பதைப் புரிந்து கொள்ள விரும்புகிறேன்."
  },
  {
    "questionNumber": 20,
    "itemId": "E20",
    "languageCode": "kn",
    "questionText": "ಎಲೆಕ್ಟ್ರಿಕ್ ವಾಹನಗಳು (EVs) ವಿದ್ಯುತ್ ಶಕ್ತಿಯನ್ನು ಹೇಗೆ ಸಂಗ್ರಹಿಸುತ್ತವೆ ಮತ್ತು ನಿರ್ವಹಿಸುತ್ತವೆ ಎಂಬುದನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ನಾನು ಇಷ್ಟಪಡುತ್ತೇನೆ."
  },
  {
    "questionNumber": 20,
    "itemId": "E20",
    "languageCode": "ar",
    "questionText": "أحب فهم كيفية قيام المركبات الكهربائية (EVs) بتخزين وإدارة الطاقة الكهربائية بكفاءة."
  },
  {
    "questionNumber": 21,
    "itemId": "E21",
    "languageCode": "ml",
    "questionText": "പവർ സർക്യൂട്ടുകൾ, വൈദ്യുത സുരക്ഷാ സംവിധാനങ്ങൾ, ഓട്ടോമേറ്റഡ് കൺട്രോളുകൾ എന്നിവയിൽ പ്രവർത്തിക്കുന്നത് ഞാൻ ആസ്വദിക്കുന്നു."
  },
  {
    "questionNumber": 21,
    "itemId": "E21",
    "languageCode": "hi",
    "questionText": "मुझे पावर सर्किट, विद्युत सुरक्षा प्रणाली और स्वचालित नियंत्रणों पर काम करने में आनंद आता है।"
  },
  {
    "questionNumber": 21,
    "itemId": "E21",
    "languageCode": "ta",
    "questionText": "பவர் சர்க்யூட்டுகள், மின் பாதுகாப்பு அமைப்புகள் மற்றும் தானியங்கி கட்டுப்பாடுகளில் பணியாற்றுவதை நான் ரசிக்கிறேன்."
  },
  {
    "questionNumber": 21,
    "itemId": "E21",
    "languageCode": "kn",
    "questionText": "ಪವರ್ ಸರ್ಕ್ಯೂಟ್‌ಗಳು, ವಿದ್ಯುತ್ ಸುರಕ್ಷತಾ ವ್ಯವಸ್ಥೆಗಳು ಮತ್ತು ಸ್ವಯಂಚಾಲಿತ ನಿಯಂತ್ರಣಗಳಲ್ಲಿ ಕೆಲಸ ಮಾಡುವುದನ್ನು ನಾನು ಆನಂದಿಸುತ್ತೇನೆ."
  },
  {
    "questionNumber": 21,
    "itemId": "E21",
    "languageCode": "ar",
    "questionText": "أستمتع بالعمل على دوائر الطاقة الكهربائية وأنظمة السلامة الكهربائية والتحكم الآلي."
  },
  {
    "questionNumber": 22,
    "itemId": "E22",
    "languageCode": "ml",
    "questionText": "ഊർജ്ജ പാഴാക്കൽ കുറയ്ക്കുകയും പവർകട്ട് തടയുകയും ചെയ്യുന്ന സ്മാർട്ട് പവർ ഗ്രിഡുകൾ രൂപകൽപ്പന ചെയ്യാൻ ഞാൻ ആഗ്രഹിക്കുന്നു."
  },
  {
    "questionNumber": 22,
    "itemId": "E22",
    "languageCode": "hi",
    "questionText": "मैं ऐसे स्मार्ट पावर ग्रिड डिज़ाइन करना चाहूँगा जो ऊर्जा की बर्बादी को कम करें और बिजली कटौती को रोकें।"
  },
  {
    "questionNumber": 22,
    "itemId": "E22",
    "languageCode": "ta",
    "questionText": "ஆற்றல் விரயத்தைக் குறைத்து மின்வெட்டைத் தடுக்கும் ஸ்மார்ட் பவர் கிரிட்களை வடிவமைக்க விரும்புகிறேன்."
  },
  {
    "questionNumber": 22,
    "itemId": "E22",
    "languageCode": "kn",
    "questionText": "ಶಕ್ತಿಯ ಪೋಲಾಗುವುದನ್ನು ಕಡಿಮೆ ಮಾಡುವ ಮತ್ತು ವಿದ್ಯುತ್ ಕಡಿತವನ್ನು ತಡೆಯುವ ಸ್ಮಾರ್ಟ್ ಪವರ್ ಗ್ರಿಡ್‌ಗಳನ್ನು ವಿನ್ಯಾಸಗೊಳಿಸಲು ನಾನು ಬಯಸುತ್ತೇನೆ."
  },
  {
    "questionNumber": 22,
    "itemId": "E22",
    "languageCode": "ar",
    "questionText": "أود تصميم شبكات كهربائية ذكية تقلل من هدر الطاقة وتمنع الانقطاعات المفاجئة للتيار."
  },
  {
    "questionNumber": 23,
    "itemId": "E23",
    "languageCode": "ml",
    "questionText": "പവർ ഇലക്ട്രോണിക്സും ഊർജ്ജ പരിവർത്തന സാങ്കേതികവിദ്യകളും എനിക്ക് വളരെ ആകർഷകമായി തോന്നുന്നു."
  },
  {
    "questionNumber": 23,
    "itemId": "E23",
    "languageCode": "hi",
    "questionText": "पावर इलेक्ट्रॉनिक्स और ऊर्जा रूपांतरण प्रौद्योगिकियां मुझे अत्यंत आकर्षक लगती हैं।"
  },
  {
    "questionNumber": 23,
    "itemId": "E23",
    "languageCode": "ta",
    "questionText": "பவர் எலக்ட்ரானிக்ஸ் மற்றும் ஆற்றல் மாற்ற தொழில்நுட்பங்கள் எனக்கு மிகவும் சுவாரஸ்யமாக உள்ளன."
  },
  {
    "questionNumber": 23,
    "itemId": "E23",
    "languageCode": "kn",
    "questionText": "ಪವರ್ ಎಲೆಕ್ಟ್ರಾನಿಕ್ಸ್ ಮತ್ತು ಶಕ್ತಿ ಪರಿವರ್ತನೆ ತಂತ್ರಜ್ಞಾನಗಳು ನನಗೆ ಅತ್ಯಂತ ಆಕರ್ಷಕವಾಗಿವೆ."
  },
  {
    "questionNumber": 23,
    "itemId": "E23",
    "languageCode": "ar",
    "questionText": "أجد تقنيات إلكترونيات القوى وتحويل الطاقة الكهربائية مثيرة للإعجاب والاهتمام."
  },
  {
    "questionNumber": 24,
    "itemId": "E24",
    "languageCode": "ml",
    "questionText": "ഫോസിൽ ഇന്ധനങ്ങൾക്ക് പകരമായി സുസ്ഥിര ഊർജ്ജ സാങ്കേതികവിദ്യകൾ എങ്ങനെ വികസിപ്പിക്കാം എന്നതിനെക്കുറിച്ച് ഞാൻ ചിന്തിക്കാറുണ്ട്."
  },
  {
    "questionNumber": 24,
    "itemId": "E24",
    "languageCode": "hi",
    "questionText": "मुझे इस बात की चिंता है कि जीवाश्म ईंधन की जगह टिकाऊ ऊर्जा प्रौद्योगिकियों का विकास कैसे किया जाए।"
  },
  {
    "questionNumber": 24,
    "itemId": "E24",
    "languageCode": "ta",
    "questionText": "புதைபடிவ எரிபொருட்களுக்குப் பதிலாக நிலையான ஆற்றல் தொழில்நுட்பங்களை எவ்வாறு உருவாக்குவது என்பதில் அக்கறை கொண்டுள்ளேன்."
  },
  {
    "questionNumber": 24,
    "itemId": "E24",
    "languageCode": "kn",
    "questionText": "ಪಳೆಯುಳಿಕೆ ಇಂಧನಗಳ ಬದಲಿಗೆ ಸುಸ್ಥಿರ ಇಂಧನ ತಂತ್ರಜ್ಞಾನಗಳನ್ನು ಹೇಗೆ ಅಭಿವೃದ್ಧಿಪಡಿಸಬಹುದು ಎಂಬುದರ ಬಗ್ಗೆ ನಾನು ಕಾಳಜಿ ವಹಿಸುತ್ತೇನೆ."
  },
  {
    "questionNumber": 24,
    "itemId": "E24",
    "languageCode": "ar",
    "questionText": "يهمني كثيراً تطوير تقنيات الطاقة المستدامة لتكون بديلاً فعالاً للوقود الأحفوري."
  },
  {
    "questionNumber": 25,
    "itemId": "E25",
    "languageCode": "ml",
    "questionText": "എഞ്ചിനുകൾ, ഗിയറുകൾ, യന്ത്രങ്ങൾ, മെക്കാനിക്കൽ ഉപകരണങ്ങൾ എന്നിവ എങ്ങനെ പ്രവർത്തിക്കുന്നു എന്ന് മനസ്സിലാക്കാൻ ഞാൻ ഇഷ്ടപ്പെടുന്നു."
  },
  {
    "questionNumber": 25,
    "itemId": "E25",
    "languageCode": "hi",
    "questionText": "मुझे यह समझना अच्छा लगता है कि इंजन, गियर, मशीनें और मैकेनिकल उपकरण कैसे काम करते हैं।"
  },
  {
    "questionNumber": 25,
    "itemId": "E25",
    "languageCode": "ta",
    "questionText": "என்ஜின்கள், கியர்கள், இயந்திரங்கள் மற்றும் மெக்கானிக்கல் கருவிகள் எவ்வாறு செயல்படுகின்றன என்பதைப் புரிந்து கொள்ள விரும்புகிறேன்."
  },
  {
    "questionNumber": 25,
    "itemId": "E25",
    "languageCode": "kn",
    "questionText": "ಎಂಜಿನ್‌ಗಳು, ಗೇರ್‌ಗಳು, ಯಂತ್ರಗಳು ಮತ್ತು ಮೆಕ್ಯಾನಿಕಲ್ ಉಪಕರಣಗಳು ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತವೆ ಎಂಬುದನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ನಾನು ಇಷ್ಟಪಡುತ್ತೇನೆ."
  },
  {
    "questionNumber": 25,
    "itemId": "E25",
    "languageCode": "ar",
    "questionText": "أستمتع بفهم كيفية عمل المحركات والتروس والآلات والأدوات الميكانيكية."
  },
  {
    "questionNumber": 26,
    "itemId": "E26",
    "languageCode": "ml",
    "questionText": "ഘടകങ്ങൾ ഒരുമിച്ച് എങ്ങനെ ചലിക്കുന്നു എന്ന് കാണാൻ ഫിസിക്കൽ പാർട്ടുകൾ രൂപകൽപ്പന ചെയ്യാനും കൂട്ടിയോജിപ്പിക്കാനും ഞാൻ ഇഷ്ടപ്പെടുന്നു."
  },
  {
    "questionNumber": 26,
    "itemId": "E26",
    "languageCode": "hi",
    "questionText": "मुझे भौतिक भागों को डिज़ाइन या असेंबल करना पसंद है ताकि यह देखा जा सके कि वे एक साथ कैसे चलते हैं।"
  },
  {
    "questionNumber": 26,
    "itemId": "E26",
    "languageCode": "ta",
    "questionText": "பாகங்கள் எவ்வாறு ஒன்றாக இயங்குகின்றன என்பதைப் பார்க்க அவற்றை வடிவமைக்க அல்லது இணைக்க விரும்புகிறேன்."
  },
  {
    "questionNumber": 26,
    "itemId": "E26",
    "languageCode": "kn",
    "questionText": "ಘಟಕಗಳು ಹೇಗೆ ಒಟ್ಟಿಗೆ ಚಲಿಸುತ್ತವೆ ಎಂಬುದನ್ನು ನೋಡಲು ಭೌತಿಕ ಭಾಗಗಳನ್ನು ವಿನ್ಯಾಸಗೊಳಿಸಲು ಅಥವಾ ಜೋಡಿಸಲು ನಾನು ಇಷ್ಟಪಡುತ್ತೇನೆ."
  },
  {
    "questionNumber": 26,
    "itemId": "E26",
    "languageCode": "ar",
    "questionText": "أحب تصميم وتجميع الأجزاء الميكانيكية لرؤية كيفية تحركها وتفاعلها معاً."
  },
  {
    "questionNumber": 27,
    "itemId": "E27",
    "languageCode": "ml",
    "questionText": "റോബോട്ടിക്സ്, ഓട്ടോമേറ്റഡ് യന്ത്രങ്ങൾ, നിർമ്മാണ പ്രക്രിയകൾ എന്നിവയിൽ എനിക്ക് താല്പര്യമുണ്ട്."
  },
  {
    "questionNumber": 27,
    "itemId": "E27",
    "languageCode": "hi",
    "questionText": "रोबोटिक्स, स्वचालित मशीनरी और विनिर्माण प्रक्रियाओं में मेरी रुचि है।"
  },
  {
    "questionNumber": 27,
    "itemId": "E27",
    "languageCode": "ta",
    "questionText": "ரோபாட்டிக்ஸ், தானியங்கி இயந்திரங்கள் மற்றும் உற்பத்தி செயல்முறைகளில் ஆர்வமாக உள்ளேன்."
  },
  {
    "questionNumber": 27,
    "itemId": "E27",
    "languageCode": "kn",
    "questionText": "ರೋಬೋಟಿಕ್ಸ್, ಸ್ವಯಂಚಾಲಿತ ಯಂತ್ರೋಪಕರಣಗಳು ಮತ್ತು ಉತ್ಪಾದನಾ ಪ್ರಕ್ರಿಯೆಗಳಲ್ಲಿ ನನಗೆ ಆಸಕ್ತಿಯಿದೆ."
  },
  {
    "questionNumber": 27,
    "itemId": "E27",
    "languageCode": "ar",
    "questionText": "أهتم بمجالات الروبوتات والآلات المؤتمتة وعمليات التصنيع المتقدمة."
  },
  {
    "questionNumber": 28,
    "itemId": "E28",
    "languageCode": "ml",
    "questionText": "ബലങ്ങൾ, ചലനം, താപം, ഘടനാപരമായ ബലം എന്നിവയുമായി ബന്ധപ്പെട്ട പ്രശ്നങ്ങൾ പരിഹരിക്കുന്നത് ഞാൻ ആസ്വദിക്കുന്നു."
  },
  {
    "questionNumber": 28,
    "itemId": "E28",
    "languageCode": "hi",
    "questionText": "मुझे बल, गति, ताप और संरचनात्मक मजबूती से संबंधित समस्याओं को हल करने में मज़ा आता है।"
  },
  {
    "questionNumber": 28,
    "itemId": "E28",
    "languageCode": "ta",
    "questionText": "விசைகள், இயக்கம், வெப்பம் மற்றும் கட்டமைப்பு வலிமை தொடர்பான சிக்கல்களைத் தீர்ப்பதை நான் ரசிக்கிறேன்."
  },
  {
    "questionNumber": 28,
    "itemId": "E28",
    "languageCode": "kn",
    "questionText": "ಬಲ, ಚಲನೆ, ತಾಪ ಮತ್ತು ರಚನಾತ್ಮಕ ಬಲಕ್ಕೆ ಸಂಬಂಧಿಸಿದ ಸಮಸ್ಯೆಗಳನ್ನು ಪರಿಹರಿಸುವುದನ್ನು ನಾನು ಆನಂದಿಸುತ್ತೇನೆ."
  },
  {
    "questionNumber": 28,
    "itemId": "E28",
    "languageCode": "ar",
    "questionText": "أستمتع بحل المسائل المتعلقة بالقوى والحركة والديناميكا الحرارية ومتانة الهياكل."
  },
  {
    "questionNumber": 29,
    "itemId": "E29",
    "languageCode": "ml",
    "questionText": "മെക്കാനിക്കൽ പ്രോട്ടോടൈപ്പുകൾ നിർമ്മിക്കാൻ 3D മോഡലിംഗ് (CAD) സോഫ്റ്റ്‌വെയറുകൾ ഉപയോഗിക്കുന്നത് ഞാൻ ഇഷ്ടപ്പെടുന്നു."
  },
  {
    "questionNumber": 29,
    "itemId": "E29",
    "languageCode": "hi",
    "questionText": "मैकेनिकल प्रोटोटाइप बनाने के लिए मुझे 3D मॉडलिंग (CAD) सॉफ्टवेयर का उपयोग करना पसंद है।"
  },
  {
    "questionNumber": 29,
    "itemId": "E29",
    "languageCode": "ta",
    "questionText": "மெக்கானிக்கல் மாதிரிகளை உருவாக்க 3D மாடலிங் (CAD) மென்பொருளைப் பயன்படுத்துவதை விரும்புகிறேன்."
  },
  {
    "questionNumber": 29,
    "itemId": "E29",
    "languageCode": "kn",
    "questionText": "ಮೆಕ್ಯಾನಿಕಲ್ ಮಾದರಿಗಳನ್ನು ರಚಿಸಲು 3D ಮಾಡೆಲಿಂಗ್ (CAD) ಸಾಫ್ಟ್‌ವೇರ್ ಬಳಸುವುದನ್ನು ನಾನು ಇಷ್ಟಪಡುತ್ತೇನೆ."
  },
  {
    "questionNumber": 29,
    "itemId": "E29",
    "languageCode": "ar",
    "questionText": "أحب استخدام برامج النمذجة ثلاثية الأبعاد (CAD) لتصميم النماذج الأولية الميكانيكية."
  },
  {
    "questionNumber": 30,
    "itemId": "E30",
    "languageCode": "ml",
    "questionText": "വാഹനങ്ങൾ, വ്യാവസായിക യന്ത്രങ്ങൾ, അല്ലെങ്കിൽ ഉപഭോക്തൃ ഹാർഡ്‌വെയറുകൾ രൂപകൽപ്പന ചെയ്യുന്നത് ഞാൻ ആസ്വദിക്കും."
  },
  {
    "questionNumber": 30,
    "itemId": "E30",
    "languageCode": "hi",
    "questionText": "वाहनों, औद्योगिक मशीनों या उपभोक्ता हार्डवेयर को डिज़ाइन करने में मुझे मज़ा आएगा।"
  },
  {
    "questionNumber": 30,
    "itemId": "E30",
    "languageCode": "ta",
    "questionText": "வாகனங்கள், தொழில்துறை இயந்திரங்கள் அல்லது வன்பொருட்களை வடிவமைப்பதை நான் ரசிப்பேன்."
  },
  {
    "questionNumber": 30,
    "itemId": "E30",
    "languageCode": "kn",
    "questionText": "ವಾಹನಗಳು, ಕೈಗಾರಿಕಾ ಯಂತ್ರಗಳು ಅಥವಾ ಗ್ರಾಹಕ ಹಾರ್ಡ್‌ವೇರ್ ವಿನ್ಯಾಸಗೊಳಿಸುವುದನ್ನು ನಾನು ಆನಂದಿಸುತ್ತೇನೆ."
  },
  {
    "questionNumber": 30,
    "itemId": "E30",
    "languageCode": "ar",
    "questionText": "سأستمتع بتصميم المركبات أو الآلات الصناعية أو الأجهزة الاستهلاكية الميكانيكية."
  },
  {
    "questionNumber": 31,
    "itemId": "E31",
    "languageCode": "ml",
    "questionText": "തെർമോഡൈനാമിക്സ്, ഫ്ലൂയിഡ് ഫ്ലോ, കൂളിംഗ് സംവിധാനങ്ങൾ എന്നിവ എനിക്ക് കൗതുകമുണർത്തുന്ന വിഷയങ്ങളാണ്."
  },
  {
    "questionNumber": 31,
    "itemId": "E31",
    "languageCode": "hi",
    "questionText": "थर्मोडायनामिक्स, द्रव प्रवाह (Fluid flow) और कूलिंग सिस्टम मुझे दिलचस्प लगते हैं।"
  },
  {
    "questionNumber": 31,
    "itemId": "E31",
    "languageCode": "ta",
    "questionText": "தெர்மோடைனமிக்ஸ், திரவ ஓட்டம் மற்றும் குளிரூட்டும் அமைப்புகள் எனக்கு சுவாரஸ்யமானவை."
  },
  {
    "questionNumber": 31,
    "itemId": "E31",
    "languageCode": "kn",
    "questionText": "ಥರ್ಮೋಡೈನಾಮಿಕ್ಸ್, ದ್ರವದ ಹರಿವು ಮತ್ತು ಕೂಲಿಂಗ್ ವ್ಯವಸ್ಥೆಗಳು ನನಗೆ ಕುತೂಹಲಕಾರಿಯಾಗಿವೆ."
  },
  {
    "questionNumber": 31,
    "itemId": "E31",
    "languageCode": "ar",
    "questionText": "أجد الديناميكا الحرارية وتدفق السوائل وأنظمة التبريد مجالات جذابة للغاية."
  },
  {
    "questionNumber": 32,
    "itemId": "E32",
    "languageCode": "ml",
    "questionText": "മെക്കാനിക്കൽ പ്രോട്ടോടൈപ്പുകൾ നേരിട്ട് പരീക്ഷിച്ച് അവയുടെ തകരാറുകളും തേയ്മാനങ്ങളും കണ്ടെത്താൻ ഞാൻ ഇഷ്ടപ്പെടുന്നു."
  },
  {
    "questionNumber": 32,
    "itemId": "E32",
    "languageCode": "hi",
    "questionText": "मैकेनिकल प्रोटोटाइप का व्यावहारिक परीक्षण करके उनकी कमज़ोरियों और घिसाव का पता लगाना मुझे पसंद है।"
  },
  {
    "questionNumber": 32,
    "itemId": "E32",
    "languageCode": "ta",
    "questionText": "மெக்கானிக்கல் மாதிரிகளை நேரில் சோதித்து அவற்றின் தேய்மானம் மற்றும் குறைபாடுகளைக் கண்டறிய விரும்புகிறேன்."
  },
  {
    "questionNumber": 32,
    "itemId": "E32",
    "languageCode": "kn",
    "questionText": "ಮೆಕ್ಯಾನಿಕಲ್ ಮಾದರಿಗಳನ್ನು ಪ್ರಾಯೋಗಿಕವಾಗಿ ಪರೀಕ್ಷಿಸಿ ಅವುಗಳ ಸವೆತ ಮತ್ತು ದೋಷಗಳನ್ನು ಗುರುತಿಸಲು ನಾನು ಇಷ್ಟಪಡುತ್ತೇನೆ."
  },
  {
    "questionNumber": 32,
    "itemId": "E32",
    "languageCode": "ar",
    "questionText": "أحب الاختبار العملي للنماذج الميكانيكية لتحديد نقاط الضعف ونسب التآكل والأعطال."
  },
  {
    "questionNumber": 33,
    "itemId": "E33",
    "languageCode": "ml",
    "questionText": "പാലങ്ങൾ, വാനളവിലുള്ള കെട്ടിടങ്ങൾ, അണക്കെട്ടുകൾ, തുരങ്കങ്ങൾ എന്നിവ എങ്ങനെ രൂപകൽപ്പന ചെയ്തു നിർമ്മിക്കുന്നു എന്നത് എന്നെ വിസ്മയിപ്പിക്കുന്നു."
  },
  {
    "questionNumber": 33,
    "itemId": "E33",
    "languageCode": "hi",
    "questionText": "मुझे यह देखकर आश्चर्य होता है कि पुल, गगनचुंबी इमारतें, बांध और सुरंगें कैसे डिज़ाइन और बनाई जाती हैं।"
  },
  {
    "questionNumber": 33,
    "itemId": "E33",
    "languageCode": "ta",
    "questionText": "பாலங்கள், வானளாவிய கட்டிடங்கள், அணைகள் மற்றும் சுரங்கப்பாதைகள் எவ்வாறு வடிவமைக்கப்பட்டு கட்டப்படுகின்றன என்பது என்னை வியக்க வைக்கிறது."
  },
  {
    "questionNumber": 33,
    "itemId": "E33",
    "languageCode": "kn",
    "questionText": "ಸೇತುವೆಗಳು, ಗಗನಚುಂಬಿ ಕಟ್ಟಡಗಳು, ಅಣೆಕಟ್ಟುಗಳು ಮತ್ತು ಸುರಂಗಗಳನ್ನು ಹೇಗೆ ವಿನ್ಯಾಸಗೊಳಿಸಿ ನಿರ್ಮಿಸಲಾಗಿದೆ ಎಂಬುದು ನನಗೆ ವಿಸ್ಮಯ ಮೂಡಿಸುತ್ತದೆ."
  },
  {
    "questionNumber": 33,
    "itemId": "E33",
    "languageCode": "ar",
    "questionText": "تبهرني كيفية تصميم وتشييد الجسور وناطحات السحاب والسدود والأنفاق العملاقة."
  },
  {
    "questionNumber": 34,
    "itemId": "E34",
    "languageCode": "ml",
    "questionText": "നഗരങ്ങൾ എങ്ങനെ റോഡുകളും ഗതാഗത ശൃംഖലകളും പൊതുഗതാഗതവും ആസൂത്രണം ചെയ്യുന്നു എന്നതിൽ ഞാൻ താല്പര്യം കാണിക്കുന്നു."
  },
  {
    "questionNumber": 34,
    "itemId": "E34",
    "languageCode": "hi",
    "questionText": "शहर परिवहन नेटवर्क, सड़कों और पारगमन प्रणालियों की योजना कैसे बनाते हैं, इसमें मेरी रुचि है।"
  },
  {
    "questionNumber": 34,
    "itemId": "E34",
    "languageCode": "ta",
    "questionText": "நகரங்கள் எவ்வாறு போக்குவரத்து நெட்வொர்க்குகள், சாலைகள் மற்றும் பொதுப் போக்குவரத்தைத் திட்டமிடுகின்றன என்பதில் எனக்கு ஆர்வம் உண்டு."
  },
  {
    "questionNumber": 34,
    "itemId": "E34",
    "languageCode": "kn",
    "questionText": "ನಗರಗಳು ಸಾರಿಗೆ ಜಾಲಗಳು, ರಸ್ತೆಗಳು ಮತ್ತು ಸಂಚಾರ ವ್ಯವಸ್ಥೆಗಳನ್ನು ಹೇಗೆ ಯೋಜಿಸುತ್ತವೆ ಎಂಬುದರ ಬಗ್ಗೆ ನನಗೆ ಆಸಕ್ತಿಯಿದೆ."
  },
  {
    "questionNumber": 34,
    "itemId": "E34",
    "languageCode": "ar",
    "questionText": "أهتم بكيفية تخطيط المدن لشبكات النقل والطرق وأنظمة المواصلات العامة الحديثة."
  },
  {
    "questionNumber": 35,
    "itemId": "E35",
    "languageCode": "ml",
    "questionText": "മണ്ണിന്റെ ഘടന, അടിത്തറയുടെ ഉറപ്പ്, ഘടനാപരമായ ഭാരം താങ്ങാനുള്ള ശേഷി എന്നിവ മനസ്സിലാക്കാൻ ഞാൻ ഇഷ്ടപ്പെടുന്നു."
  },
  {
    "questionNumber": 35,
    "itemId": "E35",
    "languageCode": "hi",
    "questionText": "मुझे मिट्टी की बनावट, नींव की स्थिरता और संरचनात्मक भार क्षमता को समझना अच्छा लगता है।"
  },
  {
    "questionNumber": 35,
    "itemId": "E35",
    "languageCode": "ta",
    "questionText": "மண் இயக்கவியல், அடித்தளத்தின் உறுதித்தன்மை மற்றும் கட்டமைப்பு தாங்கும் திறன் ஆகியவற்றை அறிய விரும்புகிறேன்."
  },
  {
    "questionNumber": 35,
    "itemId": "E35",
    "languageCode": "kn",
    "questionText": "ಮಣ್ಣಿನ ವಿಜ್ಞಾನ, ಅಡಿಪಾಯದ ಸ್ಥಿರತೆ ಮತ್ತು ರಚನಾತ್ಮಕ ಭಾರವನ್ನು ಹೊರುವ ಸಾಮರ್ಥ್ಯವನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ನಾನು ಇಷ್ಟಪಡುತ್ತೇನೆ."
  },
  {
    "questionNumber": 35,
    "itemId": "E35",
    "languageCode": "ar",
    "questionText": "أستمتع بفهم ميكانيكا التربة وثبات الأساسات وقدرة الهياكل الإنشائية على تحمل الأحمال."
  },
  {
    "questionNumber": 36,
    "itemId": "E36",
    "languageCode": "ml",
    "questionText": "കുടിവെള്ള വിതരണ ശൃംഖലകൾ, മലിനജല ശുദ്ധീകരണം, ഡ്രെയിനേജ് സംവിധാനങ്ങൾ എന്നിവയിൽ എനിക്ക് താല്പര്യമുണ്ട്."
  },
  {
    "questionNumber": 36,
    "itemId": "E36",
    "languageCode": "hi",
    "questionText": "जल आपूर्ति नेटवर्क, अपशिष्ट जल उपचार और जल निकासी प्रणालियों में मेरी रुचि है।"
  },
  {
    "questionNumber": 36,
    "itemId": "E36",
    "languageCode": "ta",
    "questionText": "குடிநீர் விநியோகக் கட்டமைப்பு, கழிவுநீர் சுத்திகரிப்பு மற்றும் வடிகால் அமைப்புகளில் ஆர்வமாக உள்ளேன்."
  },
  {
    "questionNumber": 36,
    "itemId": "E36",
    "languageCode": "kn",
    "questionText": "ನೀರು ಸರಬರಾಜು ಜಾಲಗಳು, ತ್ಯಾಜ್ಯನೀರು ಸಂಸ್ಕರಣೆ ಮತ್ತು ಒಳಚರಂಡಿ ವ್ಯವಸ್ಥೆಗಳಲ್ಲಿ ನನಗೆ ಆಸಕ್ತಿಯಿದೆ."
  },
  {
    "questionNumber": 36,
    "itemId": "E36",
    "languageCode": "ar",
    "questionText": "أهتم بشبكات إمدادات المياه ومعالجة مياه الصرف الصحي وأنظمة تصريف السيول."
  },
  {
    "questionNumber": 37,
    "itemId": "E37",
    "languageCode": "ml",
    "questionText": "ഭൂകമ്പങ്ങളെയും പ്രതികൂല കാലാവസ്ഥകളെയും അതിജീവിക്കാൻ കഴിയുന്ന കെട്ടിടങ്ങൾ രൂപകൽപ്പന ചെയ്യാൻ ഞാൻ ആഗ്രഹിക്കുന്നു."
  },
  {
    "questionNumber": 37,
    "itemId": "E37",
    "languageCode": "hi",
    "questionText": "मैं भूकंप प्रतिरोधी और चरम मौसम को सहन करने वाली इमारतों को डिज़ाइन करना चाहूँगा।"
  },
  {
    "questionNumber": 37,
    "itemId": "E37",
    "languageCode": "ta",
    "questionText": "நிலநடுக்கம் மற்றும் தீவிர வானிலையைத் தாங்கக்கூடிய கட்டிடங்களை வடிவமைக்க விரும்புகிறேன்."
  },
  {
    "questionNumber": 37,
    "itemId": "E37",
    "languageCode": "kn",
    "questionText": "ಭೂಕಂಪ ನಿರೋಧಕ ಮತ್ತು ಪ್ರತಿಕೂಲ ಹವಾಮಾನವನ್ನು ತಡೆದುಕೊಳ್ಳುವ ಕಟ್ಟಡಗಳನ್ನು ವಿನ್ಯಾಸಗೊಳಿಸಲು ನಾನು ಬಯಸುತ್ತೇನೆ."
  },
  {
    "questionNumber": 37,
    "itemId": "E37",
    "languageCode": "ar",
    "questionText": "أود تصميم مبانٍ ومنشآت مقاومة للزلازل وقادرة على تحمل التقلبات المناخية القاسية."
  },
  {
    "questionNumber": 38,
    "itemId": "E38",
    "languageCode": "ml",
    "questionText": "ഭൂപടങ്ങൾ, സർവേയിംഗ് ഉപകരണങ്ങൾ, ഭൂമിശാസ്ത്രപരമായ ലേഔട്ട് പ്ലാനുകൾ എന്നിവ ഉപയോഗിച്ച് പ്രവർത്തിക്കുന്നത് ഞാൻ ആസ്വദിക്കുന്നു."
  },
  {
    "questionNumber": 38,
    "itemId": "E38",
    "languageCode": "hi",
    "questionText": "मुझे नक्शों, सर्वेक्षण उपकरणों और भौगोलिक लेआउट योजनाओं के साथ काम करने में मज़ा आता है।"
  },
  {
    "questionNumber": 38,
    "itemId": "E38",
    "languageCode": "ta",
    "questionText": "வரைபடங்கள், நில அளவீட்டுக் கருவிகள் மற்றும் புவியியல் திட்ட வரைபடங்களுடன் பணிபுரிவதை நான் ரசிக்கிறேன்."
  },
  {
    "questionNumber": 38,
    "itemId": "E38",
    "languageCode": "kn",
    "questionText": "ನಕ್ಷೆಗಳು, ಸರ್ವೇಕ್ಷಣಾ ಉಪಕರಣಗಳು ಮತ್ತು ಭೌಗೋಳಿಕ ವಿನ್ಯಾಸ ಯೋಜನೆಗಳೊಂದಿಗೆ ಕೆಲಸ ಮಾಡುವುದನ್ನು ನಾನು ಆನಂದಿಸುತ್ತೇನೆ."
  },
  {
    "questionNumber": 38,
    "itemId": "E38",
    "languageCode": "ar",
    "questionText": "أستمتع بالعمل مع الخرائط وأجهزة المساحة والمخططات الجغرافية والهندسية."
  },
  {
    "questionNumber": 39,
    "itemId": "E39",
    "languageCode": "ml",
    "questionText": "പരിസ്ഥിതി സൗഹൃദ നിർമ്മാണ സാമഗ്രികൾ എങ്ങനെ പരിസ്ഥിതി ആഘാതം കുറയ്ക്കുന്നു എന്നതിൽ ഞാൻ ശ്രദ്ധ ചെലുത്താറുണ്ട്."
  },
  {
    "questionNumber": 39,
    "itemId": "E39",
    "languageCode": "hi",
    "questionText": "टिकाऊ निर्माण सामग्री पर्यावरणीय प्रभाव को कैसे कम करती है, इस पर मैं ध्यान देता हूँ।"
  },
  {
    "questionNumber": 39,
    "itemId": "E39",
    "languageCode": "ta",
    "questionText": "நிலையான கட்டுமானப் பொருட்கள் சுற்றுச்சூழல் பாதிப்பை எவ்வாறு குறைக்கின்றன என்பதில் அக்கறை கொண்டுள்ளேன்."
  },
  {
    "questionNumber": 39,
    "itemId": "E39",
    "languageCode": "kn",
    "questionText": "ಪರಿಸರಸ್ನೇಹಿ ನಿರ್ಮಾಣ ಸಾಮಗ್ರಿಗಳು ಪರಿಸರದ ಮೇಲಿನ ಪರಿಣಾಮವನ್ನು ಹೇಗೆ ಕಡಿಮೆ ಮಾಡುತ್ತವೆ ಎಂಬುದರ ಬಗ್ಗೆ ನಾನು ಕಾಳಜಿ ವಹಿಸುತ್ತೇನೆ."
  },
  {
    "questionNumber": 39,
    "itemId": "E39",
    "languageCode": "ar",
    "questionText": "يهمني كيف تساهم مواد البناء المستدامة في تقليل البصمة الكربونية والأثر البيئي."
  },
  {
    "questionNumber": 40,
    "itemId": "E40",
    "languageCode": "ml",
    "questionText": "സമൂഹത്തിന് പ്രയോജനപ്പെടുന്ന വൻകിട ഇൻഫ്രാസ്ട്രക്ചർ പ്രോജക്ടുകൾ നിയന്ത്രിക്കുന്നതിൽ ഞാൻ അഭിമാനം കൊള്ളും."
  },
  {
    "questionNumber": 40,
    "itemId": "E40",
    "languageCode": "hi",
    "questionText": "समाज की सेवा करने वाली बड़े पैमाने की बुनियादी ढांचा परियोजनाओं का प्रबंधन करने में मुझे गर्व होगा।"
  },
  {
    "questionNumber": 40,
    "itemId": "E40",
    "languageCode": "ta",
    "questionText": "சமூகத்திற்குப் பயன்படும் பெரிய அளவிலான உள்கட்டமைப்பு திட்டங்களை நிர்வகிப்பதில் நான் பெருமைப்படுவேன்."
  },
  {
    "questionNumber": 40,
    "itemId": "E40",
    "languageCode": "kn",
    "questionText": "ಸಮಾಜಕ್ಕೆ ಉಪಯುಕ್ತವಾಗುವ ದೊಡ್ಡ ಪ್ರಮಾಣದ ಮೂಲಸೌಕರ್ಯ ಯೋಜನೆಗಳನ್ನು ನಿರ್ವಹಿಸಲು ನಾನು ಹೆಮ್ಮೆಪಡುತ್ತೇನೆ."
  },
  {
    "questionNumber": 40,
    "itemId": "E40",
    "languageCode": "ar",
    "questionText": "سأفخر بإدارة وتشييد مشاريع البنية التحتية الكبرى التي تخدم المجتمع وتسهم في نهضته."
  },
  {
    "questionNumber": 41,
    "itemId": "E41",
    "languageCode": "ml",
    "questionText": "അസംസ്കൃത രാസവസ്തുക്കൾ എങ്ങനെ മൂല്യവത്തായ ഉൽപ്പന്നങ്ങളാക്കി മാറ്റപ്പെടുന്നു എന്ന് മനസ്സിലാക്കാൻ ഞാൻ ഇഷ്ടപ്പെടുന്നു."
  },
  {
    "questionNumber": 41,
    "itemId": "E41",
    "languageCode": "hi",
    "questionText": "मुझे यह समझना अच्छा लगता है कि कच्चे रासायनिक पदार्थों को मूल्यवान उत्पादों में कैसे बदला जाता है।"
  },
  {
    "questionNumber": 41,
    "itemId": "E41",
    "languageCode": "ta",
    "questionText": "மூல ரசாயனப் பொருட்கள் எவ்வாறு மதிப்புமிக்க பொருட்களாக மாற்றப்படுகின்றன என்பதை அறிய விரும்புகிறேன்."
  },
  {
    "questionNumber": 41,
    "itemId": "E41",
    "languageCode": "kn",
    "questionText": "ಕಚ್ಚಾ ರಾಸಾಯನಿಕ ವಸ್ತುಗಳನ್ನು ಮೌಲ್ಯಯುತ ಉತ್ಪನ್ನಗಳಾಗಿ ಹೇಗೆ ಪರಿವರ್ತಿಸಲಾಗುತ್ತದೆ ಎಂಬುದನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ನಾನು ಇಷ್ಟಪಡುತ್ತೇನೆ."
  },
  {
    "questionNumber": 41,
    "itemId": "E41",
    "languageCode": "ar",
    "questionText": "أستمتع بفهم كيفية تحويل المواد الكيميائية الخام إلى منتجات صناعية عالية القيمة."
  },
  {
    "questionNumber": 42,
    "itemId": "E42",
    "languageCode": "ml",
    "questionText": "രാസപ്രവർത്തനങ്ങൾ, ഉൽപ്രേരകങ്ങൾ (catalysts), തന്മാത്രാ മാറ്റങ്ങൾ എന്നിവയെക്കുറിച്ച് പഠിക്കാൻ ഞാൻ ഇഷ്ടപ്പെടുന്നു."
  },
  {
    "questionNumber": 42,
    "itemId": "E42",
    "languageCode": "hi",
    "questionText": "मुझे रासायनिक प्रतिक्रियाओं, उत्प्रेरकों (catalysts) और आणविक परिवर्तनों के बारे में सीखना पसंद है।"
  },
  {
    "questionNumber": 42,
    "itemId": "E42",
    "languageCode": "ta",
    "questionText": "வேதியியல் வினைகள், வினையூக்கிகள் (Catalysts) மற்றும் மூலக்கூறு மாற்றங்களைப் பற்றி படிக்க விரும்புகிறேன்."
  },
  {
    "questionNumber": 42,
    "itemId": "E42",
    "languageCode": "kn",
    "questionText": "ರಾಸಾಯನಿಕ ಕ್ರಿಯೆಗಳು, ವೇಗವರ್ಧಕಗಳು (catalysts) ಮತ್ತು ಆಣ್ವಿಕ ರೂಪಾಂತರಗಳ ಬಗ್ಗೆ ಕಲಿಯಲು ನಾನು ಇಷ್ಟಪಡುತ್ತೇನೆ."
  },
  {
    "questionNumber": 42,
    "itemId": "E42",
    "languageCode": "ar",
    "questionText": "أحب التعرف على التفاعلات الكيميائية والعوامل الحفازة والتحولات الجزيئية."
  },
  {
    "questionNumber": 43,
    "itemId": "E43",
    "languageCode": "ml",
    "questionText": "പെട്രോളിയം ശുദ്ധീകരണം, മരുന്നുകൾ, പോളിമർ പ്ലാന്റുകൾ എന്നിവ എങ്ങനെ പ്രവർത്തിക്കുന്നു എന്നതിൽ എനിക്ക് കൗതുകമുണ്ട്."
  },
  {
    "questionNumber": 43,
    "itemId": "E43",
    "languageCode": "hi",
    "questionText": "पेट्रोलियम रिफाइनिंग, फार्मास्यूटिकल्स और पॉलिमर प्लांट कैसे काम करते हैं, इसमें मेरी रुचि है।"
  },
  {
    "questionNumber": 43,
    "itemId": "E43",
    "languageCode": "ta",
    "questionText": "பெட்ரோலிய சுத்திகரிப்பு, மருந்துகள் மற்றும் பாலிமர் ஆலைகள் எவ்வாறு இயங்குகின்றன என்பதில் ஆர்வமாக உள்ளேன்."
  },
  {
    "questionNumber": 43,
    "itemId": "E43",
    "languageCode": "kn",
    "questionText": "ಪೆಟ್ರೋಲಿಯಂ ಸಂಸ್ಕರಣೆ, ಔಷಧಗಳು ಮತ್ತು ಪಾಲಿಮರ್ ಸ್ಥಾವರಗಳು ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತವೆ ಎಂಬುದರಲ್ಲಿ ನನಗೆ ಕುತೂಹಲವಿದೆ."
  },
  {
    "questionNumber": 43,
    "itemId": "E43",
    "languageCode": "ar",
    "questionText": "لدي فضول لمعرفة كيفية تشغيل مصافي النفط ومصانع الأدوية والبتروكيماويات والبوليمرات."
  },
  {
    "questionNumber": 44,
    "itemId": "E44",
    "languageCode": "ml",
    "questionText": "വാറ്റിയെടുക്കൽ (distillation), ഫിൽട്ടറേഷൻ, ക്രിസ്റ്റലൈസേഷൻ തുടങ്ങിയ വേർതിരിക്കൽ പ്രക്രിയകൾ രൂപകൽപ്പന ചെയ്യുന്നത് ഞാൻ ആസ്വദിക്കുന്നു."
  },
  {
    "questionNumber": 44,
    "itemId": "E44",
    "languageCode": "hi",
    "questionText": "आसवन (distillation), निस्पंदन (filtration) और क्रिस्टलीकरण जैसी पृथक्करण प्रक्रियाओं को डिज़ाइन करने में मुझे मज़ा आता है।"
  },
  {
    "questionNumber": 44,
    "itemId": "E44",
    "languageCode": "ta",
    "questionText": "வடித்திறக்குதல் (Distillation), வடிகட்டுதல் மற்றும் படிகமாக்கல் போன்ற பிரித்தெடுக்கும் செயல்முறைகளை வடிவமைப்பதை நான் ரசிக்கிறேன்."
  },
  {
    "questionNumber": 44,
    "itemId": "E44",
    "languageCode": "kn",
    "questionText": "ಬಟ್ಟಿ ಇಳಿಸುವಿಕೆ (distillation), ಶೋಧನೆ ಮತ್ತು ಸ್ಫಟಿಕೀಕರಣದಂತಹ ಪ್ರತ್ಯೇಕತೆಯ ಪ್ರಕ್ರಿಯೆಗಳನ್ನು ವಿನ್ಯಾಸಗೊಳಿಸುವುದನ್ನು ನಾನು ಆನಂದಿಸುತ್ತೇನೆ."
  },
  {
    "questionNumber": 44,
    "itemId": "E44",
    "languageCode": "ar",
    "questionText": "أستمتع بتصميم عمليات الفصل الكيميائي مثل التقطير والترشيح والبلورة."
  },
  {
    "questionNumber": 45,
    "itemId": "E45",
    "languageCode": "ml",
    "questionText": "ബയോപ്ലാസ്റ്റിക്കുകൾ, ആധുനിക ബാറ്ററികൾ, നൂതന പദാർത്ഥങ്ങൾ എന്നിവ വികസിപ്പിക്കുന്നതിൽ എനിക്ക് താല്പര്യമുണ്ട്."
  },
  {
    "questionNumber": 45,
    "itemId": "E45",
    "languageCode": "hi",
    "questionText": "बायोप्लास्टिक, उन्नत बैटरी और नवीन सामग्रियों को विकसित करने में मेरी रुचि है।"
  },
  {
    "questionNumber": 45,
    "itemId": "E45",
    "languageCode": "ta",
    "questionText": "மக்கும் பிளாஸ்டிக்குகள் (Bioplastics), பேட்டரிகள் மற்றும் மேம்பட்ட பொருட்களை உருவாக்குவதில் ஆர்வமாக உள்ளேன்."
  },
  {
    "questionNumber": 45,
    "itemId": "E45",
    "languageCode": "kn",
    "questionText": "ಬಯೋಪ್ಲಾಸ್ಟಿಕ್‌ಗಳು, ಸುಧಾರಿತ ಬ್ಯಾಟರಿಗಳು ಮತ್ತು ಹೊಸ ವಸ್ತುಗಳನ್ನು ಅಭಿವೃದ್ಧಿಪಡಿಸುವಲ್ಲಿ ನನಗೆ ಆಸಕ್ತಿಯಿದೆ."
  },
  {
    "questionNumber": 45,
    "itemId": "E45",
    "languageCode": "ar",
    "questionText": "أهتم بتطوير البلاستيك الحيوي والبطاريات المتقدمة والمواد النانوية والمركبة الحديثة."
  },
  {
    "questionNumber": 46,
    "itemId": "E46",
    "languageCode": "ml",
    "questionText": "വ്യാവസായിക കാർബൺ പുറന്തള്ളൽ, മലിനീകരണം, രാസമാലിന്യങ്ങൾ എന്നിവ കുറയ്ക്കുന്നതിൽ ഞാൻ ശ്രദ്ധിക്കാറുണ്ട്."
  },
  {
    "questionNumber": 46,
    "itemId": "E46",
    "languageCode": "hi",
    "questionText": "औद्योगिक कार्बन उत्सर्जन, प्रदूषण और रासायनिक कचरे को कम करने के प्रति मैं जागरूक हूँ।"
  },
  {
    "questionNumber": 46,
    "itemId": "E46",
    "languageCode": "ta",
    "questionText": "தொழில்துறை கார்பன் உமிழ்வு, மாசுபாடு மற்றும் ரசாயனக் கழிவுகளைக் குறைப்பதில் அக்கறை காட்டுகிறேன்."
  },
  {
    "questionNumber": 46,
    "itemId": "E46",
    "languageCode": "kn",
    "questionText": "ಕೈಗಾರಿಕಾ ಇಂಗಾಲದ ಹೊರಸೂಸುವಿಕೆ, ಮಾಲಿನ್ಯ ಮತ್ತು ರಾಸಾಯನಿಕ ತ್ಯಾಜ್ಯವನ್ನು ಕಡಿಮೆ ಮಾಡುವ ಬಗ್ಗೆ ನಾನು ಕಾಳಜಿ ವಹಿಸುತ್ತೇನೆ."
  },
  {
    "questionNumber": 46,
    "itemId": "E46",
    "languageCode": "ar",
    "questionText": "يهمني الحد من الانبعاثات الكربونية الصناعية والتلوث والتخلص الآمن من النفايات الكيميائية."
  },
  {
    "questionNumber": 47,
    "itemId": "E47",
    "languageCode": "ml",
    "questionText": "കെമിക്കൽ പ്ലാന്റുകളിലെ ഫ്ലൂയിഡ് ഡൈനാമിക്സ്, താപ കൈമാറ്റം, പ്രോസസ്സ് സുരക്ഷ എന്നിവ എനിക്ക് ആകർഷകമായി തോന്നുന്നു."
  },
  {
    "questionNumber": 47,
    "itemId": "E47",
    "languageCode": "hi",
    "questionText": "केमिकल प्लांट्स में द्रव गतिकी (Fluid dynamics), ताप विनिमय और प्रक्रिया सुरक्षा मुझे आकर्षक लगती है।"
  },
  {
    "questionNumber": 47,
    "itemId": "E47",
    "languageCode": "ta",
    "questionText": "வேதியியல் ஆலைகளில் திரவ இயக்கவியல், வெப்பப் பரிமாற்றம் மற்றும் செயல்முறைப் பாதுகாப்பு எனக்கு மிகவும் சுவாரஸ்யமானவை."
  },
  {
    "questionNumber": 47,
    "itemId": "E47",
    "languageCode": "kn",
    "questionText": "ರಾಸಾಯನಿಕ ಸ್ಥಾವರಗಳಲ್ಲಿ ದ್ರವ ಚಲನಶಾಸ್ತ್ರ, ಶಾಖ ವಿನಿಮಯ ಮತ್ತು ಪ್ರಕ್ರಿಯೆಯ ಸುರಕ್ಷತೆ ನನಗೆ ಆಕರ್ಷಕವಾಗಿವೆ."
  },
  {
    "questionNumber": 47,
    "itemId": "E47",
    "languageCode": "ar",
    "questionText": "أجد ديناميكا الموائع والتبادل الحراري وإجراءات السلامة في المصانع الكيميائية مثيرة للاهتمام."
  },
  {
    "questionNumber": 48,
    "itemId": "E48",
    "languageCode": "ml",
    "questionText": "ഒരു ലബോറട്ടറി കെമിക്കൽ പരീക്ഷണത്തെ വലിയ തോതിലുള്ള ഒരു വ്യാവസായിക ഉൽപ്പാദന പ്രക്രിയയാക്കി മാറ്റാൻ ഞാൻ ആഗ്രഹിക്കുന്നു."
  },
  {
    "questionNumber": 48,
    "itemId": "E48",
    "languageCode": "hi",
    "questionText": "प्रयोगशाला के किसी रासायनिक प्रयोग को बड़े पैमाने पर औद्योगिक विनिर्माण प्रक्रिया में बदलना मुझे पसंद आएगा।"
  },
  {
    "questionNumber": 48,
    "itemId": "E48",
    "languageCode": "ta",
    "questionText": "ஆய்வகத்தில் செய்யப்படும் வேதியியல் செயல்முறையை முழு அளவிலான தொழில்துறை உற்பத்தியாக மாற்றுவதை நான் விரும்புவேன்."
  },
  {
    "questionNumber": 48,
    "itemId": "E48",
    "languageCode": "kn",
    "questionText": "ಪ್ರಯೋಗಾಲಯದ ರಾಸಾಯನಿಕ ಪ್ರಯೋಗವನ್ನು ಪೂರ್ಣ ಪ್ರಮಾಣದ ಕೈಗಾರಿಕಾ ಪ್ರಕ್ರಿಯೆಯಾಗಿ ಪರಿವರ್ತಿಸಲು ನಾನು ಇಷ್ಟಪಡುತ್ತೇನೆ."
  },
  {
    "questionNumber": 48,
    "itemId": "E48",
    "languageCode": "ar",
    "questionText": "سأستمتع بنقل التفاعلات الكيميائية من النطاق المخبري إلى خطوط الإنتاج الصناعي الكبرى."
  },
  {
    "questionNumber": 49,
    "itemId": "E49",
    "languageCode": "ml",
    "questionText": "മനുഷ്യശരീരത്തെ സുഖപ്പെടുത്താനും സഹായിക്കാനും എഞ്ചിനീയറിംഗിന് എങ്ങനെ സാധിക്കുന്നു എന്നത് എന്നെ വിസ്മയിപ്പിക്കുന്നു."
  },
  {
    "questionNumber": 49,
    "itemId": "E49",
    "languageCode": "hi",
    "questionText": "इंजीनियरिंग मानव शरीर की मरम्मत, सहायता या सुधार कैसे कर सकती है, यह मुझे आश्चर्यचकित करता है।"
  },
  {
    "questionNumber": 49,
    "itemId": "E49",
    "languageCode": "ta",
    "questionText": "பொறியியல் தொழில்நுட்பம் எவ்வாறு மனித உடலை குணப்படுத்தவும் உதவவும் முடியும் என்பது என்னை வியக்க வைக்கிறது."
  },
  {
    "questionNumber": 49,
    "itemId": "E49",
    "languageCode": "kn",
    "questionText": "ಮಾನವ ದೇಹವನ್ನು ಸರಿಪಡಿಸಲು, ಸಹಾಯ ಮಾಡಲು ಅಥವಾ ಸುಧಾರಿಸಲು ಇಂಜಿನಿಯರಿಂಗ್ ಹೇಗೆ ಸಹಾಯ ಮಾಡುತ್ತದೆ ಎಂಬುದು ನನಗೆ ವಿಸ್ಮಯ ತರುತ್ತದೆ."
  },
  {
    "questionNumber": 49,
    "itemId": "E49",
    "languageCode": "ar",
    "questionText": "يبهرني كيف تسهم الهندسة في علاج ومساعدة وتطوير وظائف جسم الإنسان."
  },
  {
    "questionNumber": 50,
    "itemId": "E50",
    "languageCode": "ml",
    "questionText": "എംആർഐ (MRI), സിടി സ്കാനർ, അൾട്രാസൗണ്ട് തുടങ്ങിയ മെഡിക്കൽ ഇമേജിംഗ് ഉപകരണങ്ങളെക്കുറിച്ച് പഠിക്കാൻ ഞാൻ ഇഷ്ടപ്പെടുന്നു."
  },
  {
    "questionNumber": 50,
    "itemId": "E50",
    "languageCode": "hi",
    "questionText": "मुझे एमआरआई, सीटी स्कैनर और अल्ट्रासाउंड जैसे मेडिकल इमेजिंग उपकरणों के बारे में सीखना अच्छा लगता है।"
  },
  {
    "questionNumber": 50,
    "itemId": "E50",
    "languageCode": "ta",
    "questionText": "MRI, CT ஸ்கேனர் மற்றும் அல்ட்ராசவுண்ட் போன்ற மருத்துவ இமேஜிங் சாதனங்களைப் பற்றி படிக்க விரும்புகிறேன்."
  },
  {
    "questionNumber": 50,
    "itemId": "E50",
    "languageCode": "kn",
    "questionText": "MRI, CT ಸ್ಕ್ಯಾನರ್‌ಗಳು ಮತ್ತು ಅಲ್ಟ್ರಾಸೌಂಡ್‌ನಂತಹ ವೈದ್ಯಕೀಯ ಇಮೇಜಿಂಗ್ ಸಾಧನಗಳ ಬಗ್ಗೆ ಕಲಿಯಲು ನಾನು ಇಷ್ಟಪಡುತ್ತೇನೆ."
  },
  {
    "questionNumber": 50,
    "itemId": "E50",
    "languageCode": "ar",
    "questionText": "أستمتع بالتعرف على أجهزة التصوير الطبي المتقدمة مثل الرنين المغناطيسي والأشعة المقطعية والسونار."
  },
  {
    "questionNumber": 51,
    "itemId": "E51",
    "languageCode": "ml",
    "questionText": "രോഗികൾക്കായി കൃത്രിമ അവയവങ്ങളും (prosthetics) സഹായക ഉപകരണങ്ങളും രൂപകൽപ്പന ചെയ്യാൻ ഞാൻ ഇഷ്ടപ്പെടുന്നു."
  },
  {
    "questionNumber": 51,
    "itemId": "E51",
    "languageCode": "hi",
    "questionText": "मरीजों के लिए कृत्रिम अंग (prosthetics) और सहायक उपकरण डिज़ाइन करना मुझे पसंद है।"
  },
  {
    "questionNumber": 51,
    "itemId": "E51",
    "languageCode": "ta",
    "questionText": "நோயாளிகளுக்கு செயற்கை உறுப்புகள் (Prosthetics) மற்றும் உதவிகரமான மருத்துவ உபகரணங்களை வடிவமைக்க விரும்புகிறேன்."
  },
  {
    "questionNumber": 51,
    "itemId": "E51",
    "languageCode": "kn",
    "questionText": "ರೋಗಿಗಳಿಗೆ ಕೃತಕ ಅಂಗಗಳು (prosthetics) ಮತ್ತು ಸಹಾಯಕ ಸಾಧನಗಳನ್ನು ವಿನ್ಯಾಸಗೊಳಿಸಲು ನಾನು ಇಷ್ಟಪಡುತ್ತೇನೆ."
  },
  {
    "questionNumber": 51,
    "itemId": "E51",
    "languageCode": "ar",
    "questionText": "أحب تصميم الأطراف الاصطناعية والأجهزة التعويضية والتأهيلية المساعدة للمرضى."
  },
  {
    "questionNumber": 52,
    "itemId": "E52",
    "languageCode": "ml",
    "questionText": "ശരീരത്തിന്റെ ആരോഗ്യ സൂചകങ്ങൾ നിരന്തരം നിരീക്ഷിക്കുന്ന ബയോസെൻസറുകളിൽ എനിക്ക് താല്പര്യമുണ്ട്."
  },
  {
    "questionNumber": 52,
    "itemId": "E52",
    "languageCode": "hi",
    "questionText": "स्वास्थ्य के महत्वपूर्ण मापदंडों की लगातार निगरानी करने वाले बायोसेंसर में मेरी रुचि है।"
  },
  {
    "questionNumber": 52,
    "itemId": "E52",
    "languageCode": "ta",
    "questionText": "உடல் ஆரோக்கியத்தைக் கண்காணிக்கும் பயோசென்சார்கள் (Biosensors) தயாரிப்பில் ஆர்வமாக உள்ளேன்."
  },
  {
    "questionNumber": 52,
    "itemId": "E52",
    "languageCode": "kn",
    "questionText": "ಆರೋಗ್ಯದ ಪ್ರಮುಖ ಅಂಶಗಳನ್ನು ನಿರಂತರವಾಗಿ ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡುವ ಬಯೋಸೆನ್ಸರ್‌ಗಳಲ್ಲಿ ನನಗೆ ಆಸಕ್ತಿಯಿದೆ."
  },
  {
    "questionNumber": 52,
    "itemId": "E52",
    "languageCode": "ar",
    "questionText": "أهتم بالمستشعرات الحيوية التي ترصد العلامات الحيوية للجسم والصحة باستمرار."
  },
  {
    "questionNumber": 53,
    "itemId": "E53",
    "languageCode": "ml",
    "questionText": "ബയോകോംപാറ്റിബിൾ പദാർത്ഥങ്ങൾ മനുഷ്യന്റെ കോശങ്ങളുമായും എല്ലുകളുമായും എങ്ങനെ സംയോജിക്കുന്നു എന്ന് പര്യവേക്ഷണം ചെയ്യാൻ ഞാൻ ഇഷ്ടപ്പെടുന്നു."
  },
  {
    "questionNumber": 53,
    "itemId": "E53",
    "languageCode": "hi",
    "questionText": "बायोकम्पैटिबल सामग्रियां मानव ऊतकों और हड्डियों के साथ कैसे जुड़ती हैं, यह जानना मुझे पसंद है।"
  },
  {
    "questionNumber": 53,
    "itemId": "E53",
    "languageCode": "ta",
    "questionText": "மனித திசுக்கள் மற்றும் எலும்புகளுடன் இணக்கமான பொருட்கள் எவ்வாறு ஒன்றிணைகின்றன என்பதை ஆராய விரும்புகிறேன்."
  },
  {
    "questionNumber": 53,
    "itemId": "E53",
    "languageCode": "kn",
    "questionText": "ಜೈವಿಕ ಹೊಂದಾಣಿಕೆಯ ವಸ್ತುಗಳು ಮಾನವನ ಅಂಗಾಂಶಗಳು ಮತ್ತು ಮೂಳೆಗಳೊಂದಿಗೆ ಹೇಗೆ ಸಂಯೋಜನೆಗೊಳ್ಳುತ್ತವೆ ಎಂಬುದನ್ನು ಅನ್ವೇಷಿಸಲು ನಾನು ಇಷ್ಟಪಡುತ್ತೇನೆ."
  },
  {
    "questionNumber": 53,
    "itemId": "E53",
    "languageCode": "ar",
    "questionText": "أستمتع باكتشاف كيفية اندماج المواد المتوافقة حيوياً مع الأنسجة البشرية والعظام."
  },
  {
    "questionNumber": 54,
    "itemId": "E54",
    "languageCode": "ml",
    "questionText": "ശസ്ത്രക്രിയാ റോബോട്ടുകൾ, കൃത്രിമ അവയവങ്ങൾ, നൂതന മരുന്ന് വിതരണ സംവിധാനങ്ങൾ എന്നിവ വികസിപ്പിക്കാൻ ഞാൻ ആഗ്രഹിക്കുന്നു."
  },
  {
    "questionNumber": 54,
    "itemId": "E54",
    "languageCode": "hi",
    "questionText": "मैं सर्जिकल रोबोट, कृत्रिम अंग या उन्नत दवा वितरण प्रणाली विकसित करना चाहूँगा।"
  },
  {
    "questionNumber": 54,
    "itemId": "E54",
    "languageCode": "ta",
    "questionText": "அறுவைசிகிச்சை ரோபோக்கள், செயற்கை உறுப்புகள் அல்லது மேம்பட்ட மருந்து செலுத்தும் அமைப்புகளை உருவாக்க விரும்புகிறேன்."
  },
  {
    "questionNumber": 54,
    "itemId": "E54",
    "languageCode": "kn",
    "questionText": "ಶಸ್ತ್ರಚಿಕಿತ್ಸಾ ರೋಬೋಟ್‌ಗಳು, ಕೃತಕ ಅಂಗಗಳು ಅಥವಾ ಸುಧಾರಿತ ಔಷಧ ವಿತರಣಾ ವ್ಯವಸ್ಥೆಗಳನ್ನು ಅಭಿವೃದ್ಧಿಪಡಿಸಲು ನಾನು ಬಯಸುತ್ತೇನೆ."
  },
  {
    "questionNumber": 54,
    "itemId": "E54",
    "languageCode": "ar",
    "questionText": "أود المساهمة في تطوير الروبوتات الجراحية والأعضاء الاصطناعية وأنظمة إيصال الأدوية الذكية."
  },
  {
    "questionNumber": 55,
    "itemId": "E55",
    "languageCode": "ml",
    "questionText": "സാങ്കേതികവിദ്യയിലൂടെ രോഗനിർണ്ണയവും ആരോഗ്യ പരിപാലനവും മെച്ചപ്പെടുത്തുന്നതിൽ ഞാൻ ശ്രദ്ധ ചെലുത്തുന്നു."
  },
  {
    "questionNumber": 55,
    "itemId": "E55",
    "languageCode": "hi",
    "questionText": "प्रौद्योगिकी के माध्यम से रोगी निदान और स्वास्थ्य सेवा के परिणामों को बेहतर बनाने में मुझे रुचि है।"
  },
  {
    "questionNumber": 55,
    "itemId": "E55",
    "languageCode": "ta",
    "questionText": "தொழில்நுட்பத்தின் மூலம் நோயறிதல் மற்றும் சுகாதார சேவைகளை மேம்படுத்துவதில் அக்கறை கொண்டுள்ளேன்."
  },
  {
    "questionNumber": 55,
    "itemId": "E55",
    "languageCode": "kn",
    "questionText": "ತಂತ್ರಜ್ಞಾನದ ಮೂಲಕ ರೋಗನಿರ್ಣಯ ಮತ್ತು ಆರೋಗ್ಯ ಸೇವೆಯ ಗುಣಮಟ್ಟವನ್ನು ಸುಧಾರಿಸಲು ನಾನು ಕಾಳಜಿ ವಹಿಸುತ್ತೇನೆ."
  },
  {
    "questionNumber": 55,
    "itemId": "E55",
    "languageCode": "ar",
    "questionText": "يهمني تحسين دقة التشخيص الطبي ونتائج الرعاية الصحية من خلال الحلول التكنولوجية."
  },
  {
    "questionNumber": 56,
    "itemId": "E56",
    "languageCode": "ml",
    "questionText": "ന്യൂറൽ എഞ്ചിനീയറിംഗും ബ്രെയിൻ-കമ്പ്യൂട്ടർ ഇന്റർഫേസുകളും (BCI) എനിക്ക് വളരെ കൗതുകമുണർത്തുന്ന മേഖലകളാണ്."
  },
  {
    "questionNumber": 56,
    "itemId": "E56",
    "languageCode": "hi",
    "questionText": "न्यूरल इंजीनियरिंग और ब्रेन-कंप्यूटर इंटरफेस (BCI) मुझे बेहद दिलचस्प लगते हैं।"
  },
  {
    "questionNumber": 56,
    "itemId": "E56",
    "languageCode": "ta",
    "questionText": "நியூரல் இன்ஜினியரிங் மற்றும் மூளை-கணினி இடைமுகங்கள் (BCI) எனக்கு மிகவும் சுவாரஸ்யமானவை."
  },
  {
    "questionNumber": 56,
    "itemId": "E56",
    "languageCode": "kn",
    "questionText": "ನ್ಯೂರಲ್ ಇಂಜಿನಿಯರಿಂಗ್ ಮತ್ತು ಬ್ರೈನ್-ಕಂಪ್ಯೂಟರ್ ಇಂಟರ್ಫೇಸ್‌ಗಳು (BCI) ನನಗೆ ಆಳವಾದ ಕುತೂಹಲವನ್ನು ಉಂಟುಮಾಡುತ್ತವೆ."
  },
  {
    "questionNumber": 56,
    "itemId": "E56",
    "languageCode": "ar",
    "questionText": "أجد الهندسة العصبية وواجهات الدماغ الحاسوبية (BCI) مجالات مبهرة وعميقة للغاية."
  },
  {
    "questionNumber": 57,
    "itemId": "E57",
    "languageCode": "ml",
    "questionText": "വിമാനങ്ങൾ, റോക്കറ്റുകൾ, ഉപഗ്രഹങ്ങൾ, ബഹിരാകാശ വാഹനങ്ങൾ എന്നിവ എന്നെ എപ്പോഴും ആകർഷിക്കുന്നു."
  },
  {
    "questionNumber": 57,
    "itemId": "E57",
    "languageCode": "hi",
    "questionText": "हवाई जहाज़, रॉकेट, उपग्रह और अंतरिक्ष यान मुझे हमेशा आकर्षित करते हैं।"
  },
  {
    "questionNumber": 57,
    "itemId": "E57",
    "languageCode": "ta",
    "questionText": "விமானங்கள், ராக்கெட்டுகள், செயற்கைக்கோள்கள் மற்றும் விண்கலங்கள் எப்போதும் என்னை ஈர்க்கின்றன."
  },
  {
    "questionNumber": 57,
    "itemId": "E57",
    "languageCode": "kn",
    "questionText": "ವಿಮಾನಗಳು, ರಾಕೆಟ್‌ಗಳು, ಉಪಗ್ರಹಗಳು ಮತ್ತು ಬಾಹ್ಯಾಕಾಶ ನೌಕೆಗಳು ನನ್ನನ್ನು ಯಾವಾಗಲೂ ಆಕರ್ಷಿಸುತ್ತವೆ."
  },
  {
    "questionNumber": 57,
    "itemId": "E57",
    "languageCode": "ar",
    "questionText": "تأسرني الطائرات والصواريخ والأقمار الصناعية والمركبات الفضائية بشكل دائم."
  },
  {
    "questionNumber": 58,
    "itemId": "E58",
    "languageCode": "ml",
    "questionText": "എയറോഡൈനാമിക്സ്, ലിഫ്റ്റ്, ഡ്രാഗ്, സൂപ്പർസോണിക് വേഗതയിലുള്ള പറക്കൽ എന്നിവ മനസ്സിലാക്കാൻ ഞാൻ ഇഷ്ടപ്പെടുന്നു."
  },
  {
    "questionNumber": 58,
    "itemId": "E58",
    "languageCode": "hi",
    "questionText": "एरोडायनामिक्स, लिफ्ट, ड्रैग और सुपरसोनिक उड़ान को समझना मुझे अच्छा लगता है।"
  },
  {
    "questionNumber": 58,
    "itemId": "E58",
    "languageCode": "ta",
    "questionText": "காற்றியக்கவியல் (Aerodynamics), லிஃப்ட், இழுவிசை மற்றும் சூப்பர்சோனிக் விமானப் பயணத்தைப் புரிந்து கொள்ள விரும்புகிறேன்."
  },
  {
    "questionNumber": 58,
    "itemId": "E58",
    "languageCode": "kn",
    "questionText": "ಏರೋಡೈನಾಮಿಕ್ಸ್, ಲಿಫ್ಟ್, ಡ್ರ್ಯಾಗ್ ಮತ್ತು ಸೂಪರ್ಸಾನಿಕ್ ಹಾರಾಟವನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ನಾನು ಇಷ್ಟಪಡುತ್ತೇನೆ."
  },
  {
    "questionNumber": 58,
    "itemId": "E58",
    "languageCode": "ar",
    "questionText": "أستمتع بفهم الديناميكا الهوائية، وقوى الرفع والسحب، والطيران الأسرع من الصوت."
  },
  {
    "questionNumber": 59,
    "itemId": "E59",
    "languageCode": "ml",
    "questionText": "റോക്കറ്റ് പ്രൊപ്പൽഷൻ സിസ്റ്റങ്ങൾ, ജെറ്റ് എഞ്ചിനുകൾ, ഓർബിറ്റൽ മെക്കാനിക്സ് എന്നിവയിൽ എനിക്ക് കൗതുകമുണ്ട്."
  },
  {
    "questionNumber": 59,
    "itemId": "E59",
    "languageCode": "hi",
    "questionText": "रॉकेट प्रोपल्शन सिस्टम, जेट इंजन और ऑर्बिटल मैकेनिक्स के बारे में जानने की मुझे उत्सुकता है।"
  },
  {
    "questionNumber": 59,
    "itemId": "E59",
    "languageCode": "ta",
    "questionText": "ராக்கெட் உந்துவிசை அமைப்புகள், ஜெட் என்ஜின்கள் மற்றும் சுற்றுப்பாதை இயக்கவியல் ஆகியவற்றில் ஆர்வமாக உள்ளேன்."
  },
  {
    "questionNumber": 59,
    "itemId": "E59",
    "languageCode": "kn",
    "questionText": "ರಾಕೆಟ್ ಪ್ರೊಪಲ್ಷನ್ ಸಿಸ್ಟಮ್‌ಗಳು, ಜೆಟ್ ಎಂಜಿನ್‌ಗಳು ಮತ್ತು ಕಕ್ಷೀಯ ಯಂತ್ರಶಾಸ್ತ್ರದ ಬಗ್ಗೆ ನನಗೆ ಕುತೂಹಲವಿದೆ."
  },
  {
    "questionNumber": 59,
    "itemId": "E59",
    "languageCode": "ar",
    "questionText": "لدي شغف كبير بأنظمة دفع الصواريخ والمحركات النفاثة وميكانيكا المدارات الفضائية."
  },
  {
    "questionNumber": 60,
    "itemId": "E60",
    "languageCode": "ml",
    "questionText": "തീവ്രമായ പറക്കൽ പ്രതിസന്ധികളെ അതിജീവിക്കാൻ ശേഷിയുള്ള ഭാരം കുറഞ്ഞ കോമ്പോസിറ്റ് ഘടനകൾ രൂപകൽപ്പന ചെയ്യാൻ ഞാൻ ഇഷ്ടപ്പെടുന്നു."
  },
  {
    "questionNumber": 60,
    "itemId": "E60",
    "languageCode": "hi",
    "questionText": "उड़ान के अत्यधिक दबाव को झेलने में सक्षम हल्के मिश्रित (composite) ढांचे डिज़ाइन करना मुझे पसंद है।"
  },
  {
    "questionNumber": 60,
    "itemId": "E60",
    "languageCode": "ta",
    "questionText": "தீவிர விமான விசைகளைத் தாங்கக்கூடிய எடை குறைந்த கூட்டுக் கட்டமைப்புகளை வடிவமைக்க விரும்புகிறேன்."
  },
  {
    "questionNumber": 60,
    "itemId": "E60",
    "languageCode": "kn",
    "questionText": "ಹಾರಾಟದ ತೀವ್ರ ಒತ್ತಡವನ್ನು ತಡೆದುಕೊಳ್ಳುವ ಹಗುರವಾದ ಸಂಯೋಜಿತ (composite) ರಚನೆಗಳನ್ನು ವಿನ್ಯಾಸಗೊಳಿಸಲು ನಾನು ಇಷ್ಟಪಡುತ್ತೇನೆ."
  },
  {
    "questionNumber": 60,
    "itemId": "E60",
    "languageCode": "ar",
    "questionText": "أحب تصميم الهياكل المركبة خفيفة الوزن القادرة على تحمل أقصى إجهادات الطيران."
  },
  {
    "questionNumber": 61,
    "itemId": "E61",
    "languageCode": "ml",
    "questionText": "സ്വയം നിയന്ത്രിത ഡ്രോണുകൾ, ഫ്ലൈറ്റ് കൺട്രോൾ അൽഗോരിതങ്ങൾ, നാവിഗേഷൻ ഏവിയോണിക്സ് എന്നിവയിൽ എനിക്ക് താല്പര്യമുണ്ട്."
  },
  {
    "questionNumber": 61,
    "itemId": "E61",
    "languageCode": "hi",
    "questionText": "स्वायत्त ड्रोन, उड़ान नियंत्रण एल्गोरिदम और नेविगेशन एवियोनिक्स में मेरी रुचि है।"
  },
  {
    "questionNumber": 61,
    "itemId": "E61",
    "languageCode": "ta",
    "questionText": "தானியங்கி ட்ரோன்கள், விமானக் கட்டுப்பாட்டு அல்காரிதம்கள் மற்றும் ஏவியானிக்ஸ் அமைப்புகளில் ஆர்வமாக உள்ளேன்."
  },
  {
    "questionNumber": 61,
    "itemId": "E61",
    "languageCode": "kn",
    "questionText": "ಸ್ವಾಯತ್ತ ಡ್ರೋನ್‌ಗಳು, ಫ್ಲೈಟ್ ಕಂಟ್ರೋಲ್ ಅಲ್ಗಾರಿದಮ್‌ಗಳು ಮತ್ತು ನ್ಯಾವಿಗೇಷನ್ ಏವಿಯಾನಿಕ್ಸ್‌ನಲ್ಲಿ ನನಗೆ ಆಸಕ್ತಿಯಿದೆ."
  },
  {
    "questionNumber": 61,
    "itemId": "E61",
    "languageCode": "ar",
    "questionText": "أهتم بالطائرات المسيرة ذاتية القيادة وخوارزميات التحكم في الطيران وأنظمة الملاحة الجوية."
  },
  {
    "questionNumber": 62,
    "itemId": "E62",
    "languageCode": "ml",
    "questionText": "ചന്ദ്രനെയോ ചൊവ്വയെയോ വിദൂര ബഹിരാകാശത്തെയോ പര്യവേക്ഷണം ചെയ്യുന്ന ബഹിരാകാശ ദൗത്യങ്ങളിൽ പ്രവർത്തിക്കാൻ ഞാൻ ആഗ്രഹിക്കുന്നു."
  },
  {
    "questionNumber": 62,
    "itemId": "E62",
    "languageCode": "hi",
    "questionText": "चंद्रमा, मंगल या गहरे अंतरिक्ष की खोज करने वाले अंतरिक्ष अभियानों पर काम करने में मुझे मज़ा आएगा।"
  },
  {
    "questionNumber": 62,
    "itemId": "E62",
    "languageCode": "ta",
    "questionText": "நிலவு, செவ்வாய் அல்லது ஆழமான விண்வெளியை ஆராயும் விண்கலத் திட்டங்களில் பணியாற்ற விரும்புகிறேன்."
  },
  {
    "questionNumber": 62,
    "itemId": "E62",
    "languageCode": "kn",
    "questionText": "ಚಂದ್ರ, ಮಂಗಳ ಅಥವಾ ಬಾಹ್ಯಾಕಾಶವನ್ನು ಅನ್ವೇಷಿಸುವ ಬಾಹ್ಯಾಕಾಶ ನೌಕೆಯ ಯೋಜನೆಗಳಲ್ಲಿ ಕೆಲಸ ಮಾಡಲು ನಾನು ಇಷ್ಟಪಡುತ್ತೇನೆ."
  },
  {
    "questionNumber": 62,
    "itemId": "E62",
    "languageCode": "ar",
    "questionText": "سأستمتع بالعمل على مهمات المركبات الفضائية لاستكشاف القمر أو المريخ أو الفضاء السحيق."
  },
  {
    "questionNumber": 63,
    "itemId": "E63",
    "languageCode": "ml",
    "questionText": "ഓർബിറ്റൽ പാതകളുടെ സിമുലേഷനുകളും അന്തരീക്ഷ പുനഃപ്രവേശന താപ കവചങ്ങളും എനിക്ക് ആകർഷകമായി തോന്നുന്നു."
  },
  {
    "questionNumber": 63,
    "itemId": "E63",
    "languageCode": "hi",
    "questionText": "कक्षा प्रक्षेपवक्र (Orbital trajectory) सिमुलेशन और री-एंट्री थर्मल शील्ड मुझे दिलचस्प लगते हैं।"
  },
  {
    "questionNumber": 63,
    "itemId": "E63",
    "languageCode": "ta",
    "questionText": "விண்கலப் பாதை உருவகப்படுத்துதல்கள் மற்றும் வளிமண்டல மறுபிரவேச வெப்பக் கவசங்கள் எனக்கு மிகவும் சுவாரஸ்யமானவை."
  },
  {
    "questionNumber": 63,
    "itemId": "E63",
    "languageCode": "kn",
    "questionText": "ಕಕ್ಷೀಯ ಪಥದ ಸಿಮ್ಯುಲೇಶನ್‌ಗಳು ಮತ್ತು ಮರು-ಪ್ರವೇಶದ ಉಷ್ಣ ಕವಚಗಳು ನನಗೆ ಆಕರ್ಷಕವಾಗಿವೆ."
  },
  {
    "questionNumber": 63,
    "itemId": "E63",
    "languageCode": "ar",
    "questionText": "أجد محاكاة مسارات المدارات الفضائية والدروع الحرارية لدخول الغلاف الجوي مبهرة للغاية."
  },
  {
    "questionNumber": 64,
    "itemId": "E64",
    "languageCode": "ml",
    "questionText": "വാണിജ്യ വ്യോമയാനം, പ്രതിരോധ വ്യോമയാനം, അല്ലെങ്കിൽ ബഹിരാകാശ പര്യവേക്ഷണം എന്നിവയിൽ പങ്കാളിയാകാൻ ഞാൻ ആഗ്രഹിക്കുന്നു."
  },
  {
    "questionNumber": 64,
    "itemId": "E64",
    "languageCode": "hi",
    "questionText": "वाणिज्यिक विमानन, रक्षा एयरोस्पेस या अंतरिक्ष अन्वेषण में योगदान देने का मेरा सपना है।"
  },
  {
    "questionNumber": 64,
    "itemId": "E64",
    "languageCode": "ta",
    "questionText": "வணிக விமானப் போக்குவரத்து, பாதுகாப்பு விண்வெளி அல்லது விண்வெளி ஆய்வுகளில் பங்களிப்பதை நான் விரும்புகிறேன்."
  },
  {
    "questionNumber": 64,
    "itemId": "E64",
    "languageCode": "kn",
    "questionText": "ವಾಣಿಜ್ಯ ವಾಯುಯಾನ, ರಕ್ಷಣಾ ಏರೋಸ್ಪೇಸ್ ಅಥವಾ ಬಾಹ್ಯಾಕಾಶ ಪರಿಶೋಧನೆಗೆ ಕೊಡುಗೆ ನೀಡಲು ನಾನು ಬಯಸುತ್ತೇನೆ."
  },
  {
    "questionNumber": 64,
    "itemId": "E64",
    "languageCode": "ar",
    "questionText": "أطمح إلى المساهمة في قطاعات الطيران المدني، أو الصناعات الجوية الدفاعية، أو استكشاف الفضاء."
  },
  {
    "questionNumber": 65,
    "itemId": "E65",
    "languageCode": "ml",
    "questionText": "ഏത് തരത്തിലുള്ള പ്രോജക്ടിലാണ് പ്രവർത്തിക്കാൻ നിങ്ങൾ ഏറ്റവും കൂടുതൽ ആഗ്രഹിക്കുന്നത്?"
  },
  {
    "questionNumber": 65,
    "itemId": "E65",
    "languageCode": "hi",
    "questionText": "आप किस प्रकार के प्रोजेक्ट पर सबसे अधिक काम करना पसंद करेंगे?"
  },
  {
    "questionNumber": 65,
    "itemId": "E65",
    "languageCode": "ta",
    "questionText": "நீங்கள் எந்த வகையான திட்டத்தில் பணியாற்ற மிகவும் விரும்புவீர்கள்?"
  },
  {
    "questionNumber": 65,
    "itemId": "E65",
    "languageCode": "kn",
    "questionText": "ನೀವು ಯಾವ ರೀತಿಯ ಯೋಜನೆಯಲ್ಲಿ ಕೆಲಸ ಮಾಡಲು ಹೆಚ್ಚು ಬಯಸುತ್ತೀರಿ?"
  },
  {
    "questionNumber": 65,
    "itemId": "E65",
    "languageCode": "ar",
    "questionText": "ما نوع المشاريع الهندسية التي تفضل العمل عليها أكثر من غيرها؟"
  },
  {
    "questionNumber": 66,
    "itemId": "E66",
    "languageCode": "ml",
    "questionText": "ഏത് സാങ്കേതിക പ്രശ്നമാണ് നിങ്ങൾക്ക് ഏറ്റവും കൂടുതൽ താല്പര്യമുണർത്തുന്നത്?"
  },
  {
    "questionNumber": 66,
    "itemId": "E66",
    "languageCode": "hi",
    "questionText": "कौन सी तकनीकी समस्या आपको सबसे अधिक दिलचस्प लगती है?"
  },
  {
    "questionNumber": 66,
    "itemId": "E66",
    "languageCode": "ta",
    "questionText": "எந்த தொழில்நுட்ப சிக்கல் உங்களுக்கு மிகவும் சுவாரஸ்யமாகத் தோன்றுகிறது?"
  },
  {
    "questionNumber": 66,
    "itemId": "E66",
    "languageCode": "kn",
    "questionText": "ಯಾವ ತಾಂತ್ರಿಕ ಸಮಸ್ಯೆಯು ನಿಮಗೆ ಹೆಚ್ಚು ಆಸಕ್ತಿದಾಯಕವಾಗಿ ಕಾಣುತ್ತದೆ?"
  },
  {
    "questionNumber": 66,
    "itemId": "E66",
    "languageCode": "ar",
    "questionText": "أي من هذه المشكلات التقنية يبدو لك أكثر إثارة للاهتمام والتحدي؟"
  },
  {
    "questionNumber": 67,
    "itemId": "E67",
    "languageCode": "ml",
    "questionText": "ഏത് ലബോറട്ടറിയാണ് നിങ്ങൾ ഏറ്റവും കൂടുതൽ സന്ദർശിക്കാൻ ആഗ്രഹിക്കുന്നത്?"
  },
  {
    "questionNumber": 67,
    "itemId": "E67",
    "languageCode": "hi",
    "questionText": "आप किस प्रयोगशाला का सबसे अधिक अन्वेषण करना चाहेंगे?"
  },
  {
    "questionNumber": 67,
    "itemId": "E67",
    "languageCode": "ta",
    "questionText": "எந்த ஆய்வகத்தை நீங்கள் அதிகம் பார்வையிட விரும்புவீர்கள்?"
  },
  {
    "questionNumber": 67,
    "itemId": "E67",
    "languageCode": "kn",
    "questionText": "ನೀವು ಯಾವ ಪ್ರಯೋಗಾಲಯವನ್ನು ಹೆಚ್ಚು ಅನ್ವೇಷಿಸಲು ಬಯಸುತ್ತೀರಿ?"
  },
  {
    "questionNumber": 67,
    "itemId": "E67",
    "languageCode": "ar",
    "questionText": "أي من هذه المختبرات الهندسية تود استكشافها والعمل فيها أكثر؟"
  },
  {
    "questionNumber": 68,
    "itemId": "E68",
    "languageCode": "ml",
    "questionText": "ഏത് ഭാവി സാങ്കേതികവിദ്യയാണ് നിങ്ങളെ ഏറ്റവും കൂടുതൽ ആകർഷിക്കുന്നത്?"
  },
  {
    "questionNumber": 68,
    "itemId": "E68",
    "languageCode": "hi",
    "questionText": "कौन सी भविष्य की तकनीक आपको सबसे अधिक आकर्षित करती है?"
  },
  {
    "questionNumber": 68,
    "itemId": "E68",
    "languageCode": "ta",
    "questionText": "எதிர்கால தொழில்நுட்பங்களில் எது உங்களை மிகவும் ஈர்க்கிறது?"
  },
  {
    "questionNumber": 68,
    "itemId": "E68",
    "languageCode": "kn",
    "questionText": "ಯಾವ ಭವಿಷ್ಯದ ತಂತ್ರಜ್ಞಾನವು ನಿಮ್ಮನ್ನು ಹೆಚ್ಚು ಆಕರ್ಷಿಸುತ್ತದೆ?"
  },
  {
    "questionNumber": 68,
    "itemId": "E68",
    "languageCode": "ar",
    "questionText": "أي من هذه التقنيات المستقبلية يجذبك ويثير شغفك أكثر؟"
  },
  {
    "questionNumber": 69,
    "itemId": "E69",
    "languageCode": "ml",
    "questionText": "ഏത് എഞ്ചിനീയറിംഗ് ജോലിയാണ് നിങ്ങൾക്ക് ഏറ്റവും കൂടുതൽ സംതൃപ്തി നൽകുന്നത്?"
  },
  {
    "questionNumber": 69,
    "itemId": "E69",
    "languageCode": "hi",
    "questionText": "कौन सा इंजीनियरिंग कार्य आपको सबसे संतोषजनक लगता है?"
  },
  {
    "questionNumber": 69,
    "itemId": "E69",
    "languageCode": "ta",
    "questionText": "எந்த பொறியியல் பணி உங்களுக்கு மிகவும் மனநிறைவைத் தரும்?"
  },
  {
    "questionNumber": 69,
    "itemId": "E69",
    "languageCode": "kn",
    "questionText": "ಯಾವ ಇಂಜಿನಿಯರಿಂಗ್ ಕೆಲಸವು ನಿಮಗೆ ಹೆಚ್ಚು ತೃಪ್ತಿಕರವಾಗಿ ಕಾಣುತ್ತದೆ?"
  },
  {
    "questionNumber": 69,
    "itemId": "E69",
    "languageCode": "ar",
    "questionText": "أي من هذه المهام الهندسية تشعر أنها ستمنحك أعلى درجات الرضا والإنجاز؟"
  },
  {
    "questionNumber": 70,
    "itemId": "E70",
    "languageCode": "ml",
    "questionText": "നിങ്ങൾക്ക് ലഭിച്ചാൽ ഏത് ഇന്റേൺഷിപ്പാണ് നിങ്ങൾ തിരഞ്ഞെടുക്കുക?"
  },
  {
    "questionNumber": 70,
    "itemId": "E70",
    "languageCode": "hi",
    "questionText": "यदि आपको अवसर मिले, तो आप कौन सी इंटर्नशिप चुनेंगे?"
  },
  {
    "questionNumber": 70,
    "itemId": "E70",
    "languageCode": "ta",
    "questionText": "வாய்ப்பு கிடைத்தால் நீங்கள் எந்தப் பயிற்சிப் பணியை (Internship) தேர்ந்தெடுப்பீர்கள்?"
  },
  {
    "questionNumber": 70,
    "itemId": "E70",
    "languageCode": "kn",
    "questionText": "ಅವಕಾಶ ಸಿಕ್ಕರೆ ನೀವು ಯಾವ ಇಂಟರ್ನ್‌ಶಿಪ್ ಆಯ್ಕೆ ಮಾಡುತ್ತೀರಿ?"
  },
  {
    "questionNumber": 70,
    "itemId": "E70",
    "languageCode": "ar",
    "questionText": "إذا أتيحت لك الفرصة، أي فترة تدريب عملي (Internship) ستختار؟"
  },
  {
    "questionNumber": 71,
    "itemId": "E71",
    "languageCode": "ml",
    "questionText": "ഏത് വെല്ലുവിളിയാണ് നിങ്ങൾ കൂടുതൽ പരിഹരിക്കാൻ ആഗ്രഹിക്കുന്നത്?"
  },
  {
    "questionNumber": 71,
    "itemId": "E71",
    "languageCode": "hi",
    "questionText": "आप किस चुनौती को हल करना अधिक पसंद करेंगे?"
  },
  {
    "questionNumber": 71,
    "itemId": "E71",
    "languageCode": "ta",
    "questionText": "எந்த சவாலை நீங்கள் தீர்க்க விரும்புவீர்கள்?"
  },
  {
    "questionNumber": 71,
    "itemId": "E71",
    "languageCode": "kn",
    "questionText": "ನೀವು ಯಾವ ಸವಾಲನ್ನು ಪರಿಹರಿಸಲು ಬಯಸುತ್ತೀರಿ?"
  },
  {
    "questionNumber": 71,
    "itemId": "E71",
    "languageCode": "ar",
    "questionText": "أي من هذه التحديات الهندسية تفضل أن تبتكر حلاً له؟"
  },
  {
    "questionNumber": 72,
    "itemId": "E72",
    "languageCode": "ml",
    "questionText": "ഏത് ഉൽപ്പന്നം മെച്ചപ്പെടുത്തുന്നതാണ് നിങ്ങൾ ഏറ്റവും കൂടുതൽ ആസ്വദിക്കുക?"
  },
  {
    "questionNumber": 72,
    "itemId": "E72",
    "languageCode": "hi",
    "questionText": "किस उत्पाद को बेहतर बनाने में आपको सबसे अधिक आनंद आएगा?"
  },
  {
    "questionNumber": 72,
    "itemId": "E72",
    "languageCode": "ta",
    "questionText": "எந்தப் பொருளை மேம்படுத்துவதை நீங்கள் மிகவும் ரசிப்பீர்கள்?"
  },
  {
    "questionNumber": 72,
    "itemId": "E72",
    "languageCode": "kn",
    "questionText": "ಯಾವ ಉತ್ಪನ್ನವನ್ನು ಸುಧಾರಿಸುವುದನ್ನು ನೀವು ಹೆಚ್ಚು ಆನಂದಿಸುತ್ತೀರಿ?"
  },
  {
    "questionNumber": 72,
    "itemId": "E72",
    "languageCode": "ar",
    "questionText": "أي من هذه المنتجات ستستمتع أكثر بتطوير أدائه وتحسين كفاءته؟"
  },
  {
    "questionNumber": 73,
    "itemId": "E73",
    "languageCode": "ml",
    "questionText": "ഏത് തരത്തിലുള്ള എഞ്ചിനീയറിംഗ് പ്രവർത്തനമാണ് നിങ്ങൾ ഇഷ്ടപ്പെടുന്നത്?"
  },
  {
    "questionNumber": 73,
    "itemId": "E73",
    "languageCode": "hi",
    "questionText": "आप किस प्रकार के इंजीनियरिंग कार्य को प्राथमिकता देंगे?"
  },
  {
    "questionNumber": 73,
    "itemId": "E73",
    "languageCode": "ta",
    "questionText": "நீங்கள் எந்த வகையான பொறியியல் பணியை விரும்புவீர்கள்?"
  },
  {
    "questionNumber": 73,
    "itemId": "E73",
    "languageCode": "kn",
    "questionText": "ನೀವು ಯಾವ ರೀತಿಯ ಇಂಜಿನಿಯರಿಂಗ್ ಕೆಲಸವನ್ನು ಆದ್ಯತೆ ನೀಡುತ್ತೀರಿ?"
  },
  {
    "questionNumber": 73,
    "itemId": "E73",
    "languageCode": "ar",
    "questionText": "أي نوع من بيئات العمل الهندسية تفضل التخصص فيه؟"
  },
  {
    "questionNumber": 74,
    "itemId": "E74",
    "languageCode": "ml",
    "questionText": "ഏത് പ്രോജക്ട് ഫലമാണ് നിങ്ങളെ ഏറ്റവും കൂടുതൽ അഭിമാനം കൊള്ളിക്കുന്നത്?"
  },
  {
    "questionNumber": 74,
    "itemId": "E74",
    "languageCode": "hi",
    "questionText": "किस प्रोजेक्ट का परिणाम आपको सबसे अधिक गौरवान्वित करेगा?"
  },
  {
    "questionNumber": 74,
    "itemId": "E74",
    "languageCode": "ta",
    "questionText": "எந்தத் திட்டத்தின் முடிவு உங்களை மிகவும் பெருமைப்படுத்தும்?"
  },
  {
    "questionNumber": 74,
    "itemId": "E74",
    "languageCode": "kn",
    "questionText": "ಯಾವ ಯೋಜನೆಯ ಫಲಿತಾಂಶವು ನಿಮಗೆ ಹೆಚ್ಚು ಹೆಮ್ಮೆ ತರುತ್ತದೆ?"
  },
  {
    "questionNumber": 74,
    "itemId": "E74",
    "languageCode": "ar",
    "questionText": "أي نتيجة لمشروع هندسي ستجعلك تشعر بأكبر قدر من الفخر والاعتزاز؟"
  },
  {
    "questionNumber": 75,
    "itemId": "E75",
    "languageCode": "ml",
    "questionText": "ഒരു വ്യക്തിഗത പ്രോജക്റ്റിനായി ഏത് വിഷയമാണ് നിങ്ങൾ തിരഞ്ഞെടുക്കുക?"
  },
  {
    "questionNumber": 75,
    "itemId": "E75",
    "languageCode": "hi",
    "questionText": "एक व्यक्तिगत प्रोजेक्ट के लिए आप किस विषय का अन्वेषण करेंगे?"
  },
  {
    "questionNumber": 75,
    "itemId": "E75",
    "languageCode": "ta",
    "questionText": "தனிப்பட்ட திட்டத்திற்காக நீங்கள் எந்தத் தலைப்பை ஆராய்வீர்கள்?"
  },
  {
    "questionNumber": 75,
    "itemId": "E75",
    "languageCode": "kn",
    "questionText": "ವೈಯಕ್ತಿಕ ಯೋಜನೆಗಾಗಿ ನೀವು ಯಾವ ವಿಷಯವನ್ನು ಅನ್ವೇಷಿಸುತ್ತೀರಿ?"
  },
  {
    "questionNumber": 75,
    "itemId": "E75",
    "languageCode": "ar",
    "questionText": "أي موضوع ستختاره لتنفيذ مشروع هندسي وابتكاري شخصي؟"
  },
  {
    "questionNumber": 76,
    "itemId": "E76",
    "languageCode": "ml",
    "questionText": "ഏത് തൊഴിൽ അന്തരീക്ഷത്തിലാണ് പ്രവർത്തിക്കാൻ നിങ്ങൾ ഏറ്റവും കൂടുതൽ ആഗ്രഹിക്കുന്നത്?"
  },
  {
    "questionNumber": 76,
    "itemId": "E76",
    "languageCode": "hi",
    "questionText": "आप किस कार्य परिवेश में काम करने का सबसे अधिक आनंद लेंगे?"
  },
  {
    "questionNumber": 76,
    "itemId": "E76",
    "languageCode": "ta",
    "questionText": "எந்த பணிச்சூழலில் வேலை செய்வதை நீங்கள் மிகவும் விரும்புவீர்கள்?"
  },
  {
    "questionNumber": 76,
    "itemId": "E76",
    "languageCode": "kn",
    "questionText": "ಯಾವ ಕೆಲಸದ ವಾತಾವರಣದಲ್ಲಿ ಕೆಲಸ ಮಾಡಲು ನೀವು ಹೆಚ್ಚು ಆನಂದಿಸುತ್ತೀರಿ?"
  },
  {
    "questionNumber": 76,
    "itemId": "E76",
    "languageCode": "ar",
    "questionText": "أي بيئة عمل هندسية تشعر أنك ستستمتع بالعمل فيها أكثر؟"
  },
  {
    "questionNumber": 77,
    "itemId": "E77",
    "languageCode": "ml",
    "questionText": "ഏത് പ്രശ്നമാണ് നിങ്ങളിൽ കൂടുതൽ കാലം കൗതുകം നിലനിർത്തുന്നത്?"
  },
  {
    "questionNumber": 77,
    "itemId": "E77",
    "languageCode": "hi",
    "questionText": "कौन सी समस्या आपकी जिज्ञासा को लंबे समय तक बनाए रखेगी?"
  },
  {
    "questionNumber": 77,
    "itemId": "E77",
    "languageCode": "ta",
    "questionText": "எந்த சிக்கல் உங்கள் ஆர்வத்தை நீண்ட காலம் தக்கவைக்கும்?"
  },
  {
    "questionNumber": 77,
    "itemId": "E77",
    "languageCode": "kn",
    "questionText": "ಯಾವ ಸಮಸ್ಯೆಯು ನಿಮ್ಮ ಕುತೂಹಲವನ್ನು ಹೆಚ್ಚು ಕಾಲ ಉಳಿಸಿಕೊಳ್ಳುತ್ತದೆ?"
  },
  {
    "questionNumber": 77,
    "itemId": "E77",
    "languageCode": "ar",
    "questionText": "أي من هذه المشكلات التقنية سيحافظ على شغفك وفضولك للبحث لفترة أطول؟"
  },
  {
    "questionNumber": 78,
    "itemId": "E78",
    "languageCode": "ml",
    "questionText": "ഏത് എഞ്ചിനീയറിംഗ് റോളാണ് നിങ്ങൾക്ക് ഏറ്റവും ആകർഷകമായി തോന്നുന്നത്?"
  },
  {
    "questionNumber": 78,
    "itemId": "E78",
    "languageCode": "hi",
    "questionText": "कौन सी इंजीनियरिंग भूमिका आपको सबसे अधिक आकर्षक लगती है?"
  },
  {
    "questionNumber": 78,
    "itemId": "E78",
    "languageCode": "ta",
    "questionText": "எந்த பொறியியல் பதவி உங்களுக்கு மிகவும் கவர்ச்சிகரமானதாகத் தோன்றுகிறது?"
  },
  {
    "questionNumber": 78,
    "itemId": "E78",
    "languageCode": "kn",
    "questionText": "ಯಾವ ಇಂಜಿನಿಯರಿಂಗ್ ಪಾತ್ರವು ನಿಮಗೆ ಹೆಚ್ಚು ಆಕರ್ಷಕವಾಗಿ ಕಾಣುತ್ತದೆ?"
  },
  {
    "questionNumber": 78,
    "itemId": "E78",
    "languageCode": "ar",
    "questionText": "أي مسمى وظيفي أو دور هندسي يبدو لك أكثر جاذبية وملاءمة لطموحك؟"
  },
  {
    "questionNumber": 79,
    "itemId": "E79",
    "languageCode": "ml",
    "questionText": "ഏത് നൂതനാശയമാണ് വികസിപ്പിക്കാൻ നിങ്ങൾ സഹായിക്കാൻ ആഗ്രഹിക്കുന്നത്?"
  },
  {
    "questionNumber": 79,
    "itemId": "E79",
    "languageCode": "hi",
    "questionText": "आप किस नवाचार (Innovation) को विकसित करने में मदद करना चाहेंगे?"
  },
  {
    "questionNumber": 79,
    "itemId": "E79",
    "languageCode": "ta",
    "questionText": "எந்த புதுமையான கண்டுபிடிப்பை உருவாக்க உதவ விரும்புகிறீர்கள்?"
  },
  {
    "questionNumber": 79,
    "itemId": "E79",
    "languageCode": "kn",
    "questionText": "ಯಾವ ಹೊಸ ಆವಿಷ್ಕಾರವನ್ನು ಅಭಿವೃದ್ಧಿಪಡಿಸಲು ನೀವು ಸಹಾಯ ಮಾಡಲು ಬಯಸುತ್ತೀರಿ?"
  },
  {
    "questionNumber": 79,
    "itemId": "E79",
    "languageCode": "ar",
    "questionText": "أي ابتكار هندسي وتقني رائد تود المساهمة في تطويره وإطلاقه؟"
  },
  {
    "questionNumber": 80,
    "itemId": "E80",
    "languageCode": "ml",
    "questionText": "ഒരു എഞ്ചിനീയറിംഗ് പ്രോജക്ടിനായി നിങ്ങൾക്ക് ഒരു വർഷം ലഭിക്കുകയാണെങ്കിൽ, നിങ്ങൾ എന്ത് തിരഞ്ഞെടുക്കും?"
  },
  {
    "questionNumber": 80,
    "itemId": "E80",
    "languageCode": "hi",
    "questionText": "यदि आपको किसी इंजीनियरिंग प्रोजेक्ट के लिए एक वर्ष मिले, तो आप क्या चुनेंगे?"
  },
  {
    "questionNumber": 80,
    "itemId": "E80",
    "languageCode": "ta",
    "questionText": "ஒரு பொறியியல் திட்டத்திற்கு உங்களுக்கு ஒரு வருடம் கிடைத்தால், எதைத் தேர்ந்தெடுப்பீர்கள்?"
  },
  {
    "questionNumber": 80,
    "itemId": "E80",
    "languageCode": "kn",
    "questionText": "ಒಂದು ಇಂಜಿನಿಯರಿಂಗ್ ಯೋಜನೆಗಾಗಿ ನಿಮಗೆ ಒಂದು ವರ್ಷ ಸಿಕ್ಕರೆ, ನೀವು ಏನನ್ನು ಆಯ್ಕೆ ಮಾಡುತ್ತೀರಿ?"
  },
  {
    "questionNumber": 80,
    "itemId": "E80",
    "languageCode": "ar",
    "questionText": "إذا كان لديك عام كامل لتكريسه لمشروع هندسي كبير، فماذا ستختار؟"
  }
];
