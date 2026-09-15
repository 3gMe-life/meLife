export interface SectionTranslationItem {
  sectionCode: string;
  languageCode: "ml" | "hi" | "ta" | "kn" | "ar";
  name: string;
  description: string;
}

export interface DimensionTranslationItem {
  dimensionCode: string;
  languageCode: "ml" | "hi" | "ta" | "kn" | "ar";
  name: string;
}

export interface LikertOptionTranslationItem {
  optionKey: "1" | "2" | "3" | "4" | "5";
  languageCode: "ml" | "hi" | "ta" | "kn" | "ar";
  optionText: string;
}

export interface QuestionTranslationItem {
  questionCode: string;
  languageCode: "ml" | "hi" | "ta" | "kn" | "ar";
  questionText: string;
}

export const AI_JOB_RISK_FINDER_SECTION_TRANSLATIONS: SectionTranslationItem[] = [
  // Malayalam
  {
    sectionCode: "SEC_TECH_EVOLUTION",
    languageCode: "ml",
    name: "സാങ്കേതികവിദ്യ സ്വീകരിക്കലും ഡിജിറ്റൽ പരിവർത്തനവും",
    description: "ഡിജിറ്റൽ ടൂളുകൾ, ആധുനിക വർക്ക്ഫ്ലോകൾ, തുടർച്ചയായ നൈപുണ്യ വികസനം എന്നിവയോടുള്ള സന്നദ്ധത വിലയിരുത്തുന്നു.",
  },
  {
    sectionCode: "SEC_COGNITIVE_AGILITY",
    languageCode: "ml",
    name: "ചിന്താപരമായ വഴക്കവും വിമർശനാത്മക ചിന്തയും",
    description: "വിശകലന ശേഷി, വിവരങ്ങളുടെ കൃത്യത പരിശോധിക്കൽ, യുക്തിസഹമായ ചിന്ത എന്നിവ പരിശോധിക്കുന്നു.",
  },
  {
    sectionCode: "SEC_HUMAN_SYNTHESIS",
    languageCode: "ml",
    name: "മാനവ സഹകരണവും ക്രിയാത്മക പ്രശ്നപരിഹാരവും",
    description: "ആശയവിനിമയം, സഹാനുഭൂതി, ടീംവർക്ക്, നൂതന ആശയങ്ങളുടെ രൂപീകരണം എന്നിവ അളക്കുന്നു.",
  },
  {
    sectionCode: "SEC_JUDGMENT_ETHICS",
    languageCode: "ml",
    name: "സങ്കീർണ്ണമായ വിവേചനവും ധാർമ്മിക അവബോധവും",
    description: "ധാർമ്മിക തീരുമാനങ്ങൾ, സാമൂഹിക ഉത്തരവാദിത്തം, ഡാറ്റ സ്വകാര്യത എന്നിവയോടുള്ള പ്രതിബദ്ധത വിലയിരുത്തുന്നു.",
  },

  // Hindi
  {
    sectionCode: "SEC_TECH_EVOLUTION",
    languageCode: "hi",
    name: "प्रौद्योगिकी अनुकूलन और डिजिटल विकास",
    description: "नए डिजिटल टूल्स, वर्कफ़्लो और निरंतर कौशल विकास के प्रति तत्परता का मूल्यांकन करता है।",
  },
  {
    sectionCode: "SEC_COGNITIVE_AGILITY",
    languageCode: "hi",
    name: "संज्ञानात्मक लचीलापन और आलोचनात्मक सोच",
    description: "विश्लेषणात्मक गहराई, स्वचालित परिणामों का सत्यापन और तार्किक विश्लेषण का परीक्षण करता है।",
  },
  {
    sectionCode: "SEC_HUMAN_SYNTHESIS",
    languageCode: "hi",
    name: "मानवीय सहयोग और रचनात्मक समस्या समाधान",
    description: "पारस्परिक संचार, सहानुभूति, टीमवर्क और नवीन समाधान तैयार करने की क्षमता का मापन करता है।",
  },
  {
    sectionCode: "SEC_JUDGMENT_ETHICS",
    languageCode: "hi",
    name: "जटिल निर्णय और नैतिक जागरूकता",
    description: "नैतिक निर्णय लेने, सामाजिक उत्तरदायित्व और डेटा गोपनीयता के प्रति सजगता का मूल्यांकन करता है।",
  },

  // Tamil
  {
    sectionCode: "SEC_TECH_EVOLUTION",
    languageCode: "ta",
    name: "தொழில்நுட்ப தழுவல் மற்றும் டிஜிட்டல் வளர்ச்சி",
    description: "புதிய டிஜிட்டல் கருவிகள், பணிப்பாய்வுகள் மற்றும் தொடர்ச்சியான மறுதிறன் பெறுவதற்கான தயார்நிலையை மதிப்பீடு செய்கிறது.",
  },
  {
    sectionCode: "SEC_COGNITIVE_AGILITY",
    languageCode: "ta",
    name: "அறிவாற்றல் நெகிழ்வுத்தன்மை மற்றும் விமர்சன சிந்தனை",
    description: "பகுப்பாய்வு ஆழம், தானியங்கி வெளியீடுகளை சரிபார்த்தல் மற்றும் தர்க்கரீதியான பகுப்பாய்வை மதிப்பிடுகிறது.",
  },
  {
    sectionCode: "SEC_HUMAN_SYNTHESIS",
    languageCode: "ta",
    name: "மனித ஒத்துழைப்பு மற்றும் ஆக்கபூர்வமான சிக்கல் தீர்வு",
    description: "தொடர்பாடல், பச்சாதாபம், குழுப்பணி மற்றும் புதிய அணுகுமுறைகளை உருவாக்கும் திறனை அளவிடுகிறது.",
  },
  {
    sectionCode: "SEC_JUDGMENT_ETHICS",
    languageCode: "ta",
    name: "சிக்கலான தீர்ப்பு மற்றும் நெறிமுறை விழிப்புணர்வு",
    description: "நெறிமுறை முடிவெடுத்தல், சமூகப் பொறுப்புணர்வு மற்றும் தரவு தனியுரிமையை மதிப்பிடுகிறது.",
  },

  // Kannada
  {
    sectionCode: "SEC_TECH_EVOLUTION",
    languageCode: "kn",
    name: "ತಂತ್ರಜ್ಞಾನ ಅಳವಡಿಕೆ ಮತ್ತು ಡಿಜಿಟಲ್ ಬೆಳವಣಿಗೆ",
    description: "ಹೊಸ ಡಿಜಿಟಲ್ ಉಪಕರಣಗಳು, ಕಾರ್ಯಪ್ರಕ್ರಿಯೆಗಳು ಮತ್ತು ನಿರಂತರ ಕೌಶಲ್ಯ ಸುಧಾರಣೆಯ ಸನ್ನದ್ಧತೆಯನ್ನು ಮೌಲ್ಯಮಾಪನ ಮಾಡುತ್ತದೆ.",
  },
  {
    sectionCode: "SEC_COGNITIVE_AGILITY",
    languageCode: "kn",
    name: "ಚಿಂತನಾ ನಮ್ಯತೆ ಮತ್ತು ವಿಮರ್ಶಾತ್ಮಕ ಚಿಂತನೆ",
    description: "ವಿಶ್ಲೇಷಣಾತ್ಮಕ ಆಳ, ಸ್ವಯಂಚಾಲಿತ ಫಲಿತಾಂಶಗಳ ಪರಿಶೀಲನೆ ಮತ್ತು ತಾರ್ಕಿಕ ವಿಶ್ಲೇಷಣೆಯನ್ನು ಪರೀಕ್ಷಿಸುತ್ತದೆ.",
  },
  {
    sectionCode: "SEC_HUMAN_SYNTHESIS",
    languageCode: "kn",
    name: "ಮಾನವ ಸಹಯೋಗ ಮತ್ತು ಸೃಜನಶೀಲ ಸಮಸ್ಯೆ ಪರಿಹಾರ",
    description: "ಸಂವಹನ, ಸಹಾನುಭೂತಿ, ತಂಡದ ಕೆಲಸ ಮತ್ತು ನವೀನ ಪರಿಹಾರಗಳನ್ನು ರೂಪಿಸುವ ಸಾಮರ್ಥ್ಯವನ್ನು ಅಳೆಯುತ್ತದೆ.",
  },
  {
    sectionCode: "SEC_JUDGMENT_ETHICS",
    languageCode: "kn",
    name: "ಸಂಕೀರ್ಣ ನಿರ್ಣಯ ಮತ್ತು ನೈತಿಕ ಜಾಗೃತಿ",
    description: "ನೈತಿಕ ನಿರ್ಧಾರ, ಸಾಮಾಜಿಕ ಜವಾಬ್ದಾರಿ ಮತ್ತು ಡೇಟಾ ಗೌಪ್ಯತೆಯ ಬದ್ಧತೆಯನ್ನು ಮೌಲ್ಯಮಾಪನ ಮಾಡುತ್ತದೆ.",
  },

  // Arabic
  {
    sectionCode: "SEC_TECH_EVOLUTION",
    languageCode: "ar",
    name: "التكيف التكنولوجي والتطور الرقمي",
    description: "يقيم الجاهزية لتبني الأدوات الرقمية الحديثة وتطوير المهارات المستمر.",
  },
  {
    sectionCode: "SEC_COGNITIVE_AGILITY",
    languageCode: "ar",
    name: "المرونة الإدراكية والتفكير النقدي",
    description: "يقيم العمق التحليلي والتحقق من المخرجات الآلية والتفكير المنطقي.",
  },
  {
    sectionCode: "SEC_HUMAN_SYNTHESIS",
    languageCode: "ar",
    name: "التعاون الإنساني وحل المشكلات الإبداعي",
    description: "يقيس التواصل والتعاطف والعمل الجماعي وتوليد الحلول المبتكرة.",
  },
  {
    sectionCode: "SEC_JUDGMENT_ETHICS",
    languageCode: "ar",
    name: "الحكم المعقد والوعي الأخلاقي",
    description: "يقيم اتخاذ القرارات الأخلاقية والمسؤولية الاجتماعية وحماية الخصوصية.",
  },
];

export const AI_JOB_RISK_FINDER_DIMENSION_TRANSLATIONS: DimensionTranslationItem[] = [
  // Malayalam
  { dimensionCode: "DIM_TECH_ADAPTABILITY", languageCode: "ml", name: "സാങ്കേതികവിദ്യ വഴക്കം" },
  { dimensionCode: "DIM_LEARNING_AGILITY", languageCode: "ml", name: "പഠന ചടുലത" },
  { dimensionCode: "DIM_CRITICAL_THINKING", languageCode: "ml", name: "വിമർശനാത്മക ചിന്ത" },
  { dimensionCode: "DIM_HUMAN_COLLABORATION", languageCode: "ml", name: "മാനവ സഹകരണം" },
  { dimensionCode: "DIM_CREATIVE_SYNTHESIS", languageCode: "ml", name: "ക്രിയാത്മക സംയോജനം" },
  { dimensionCode: "DIM_ETHICAL_AWARENESS", languageCode: "ml", name: "ധാർമ്മിക അവബോധം" },

  // Hindi
  { dimensionCode: "DIM_TECH_ADAPTABILITY", languageCode: "hi", name: "तकनीकी अनुकूलनशीलता" },
  { dimensionCode: "DIM_LEARNING_AGILITY", languageCode: "hi", name: "सीखने की तत्परता" },
  { dimensionCode: "DIM_CRITICAL_THINKING", languageCode: "hi", name: "आलोचनात्मक सोच" },
  { dimensionCode: "DIM_HUMAN_COLLABORATION", languageCode: "hi", name: "मानवीय सहयोग" },
  { dimensionCode: "DIM_CREATIVE_SYNTHESIS", languageCode: "hi", name: "रचनात्मक संश्लेषण" },
  { dimensionCode: "DIM_ETHICAL_AWARENESS", languageCode: "hi", name: "नैतिक जागरूकता" },

  // Tamil
  { dimensionCode: "DIM_TECH_ADAPTABILITY", languageCode: "ta", name: "தொழில்நுட்ப தகவமைப்பு" },
  { dimensionCode: "DIM_LEARNING_AGILITY", languageCode: "ta", name: "கற்றல் சுறுசுறுப்பு" },
  { dimensionCode: "DIM_CRITICAL_THINKING", languageCode: "ta", name: "விமர்சன சிந்தனை" },
  { dimensionCode: "DIM_HUMAN_COLLABORATION", languageCode: "ta", name: "மனித ஒத்துழைப்பு" },
  { dimensionCode: "DIM_CREATIVE_SYNTHESIS", languageCode: "ta", name: "ஆக்கபூர்வமான தொகுப்பு" },
  { dimensionCode: "DIM_ETHICAL_AWARENESS", languageCode: "ta", name: "நெறிமுறை விழிப்புணர்வு" },

  // Kannada
  { dimensionCode: "DIM_TECH_ADAPTABILITY", languageCode: "kn", name: "ತಾಂತ್ರಿಕ ಹೊಂದಾಣಿಕೆ" },
  { dimensionCode: "DIM_LEARNING_AGILITY", languageCode: "kn", name: "ಕಲಿಕೆಯ ಚುರುಕುತನ" },
  { dimensionCode: "DIM_CRITICAL_THINKING", languageCode: "kn", name: "ವಿಮರ್ಶಾತ್ಮಕ ಚಿಂತನೆ" },
  { dimensionCode: "DIM_HUMAN_COLLABORATION", languageCode: "kn", name: "ಮಾನವ ಸಹಯೋಗ" },
  { dimensionCode: "DIM_CREATIVE_SYNTHESIS", languageCode: "kn", name: "ಸೃಜನಶೀಲ ಸಂಶ್ಲೇಷಣೆ" },
  { dimensionCode: "DIM_ETHICAL_AWARENESS", languageCode: "kn", name: "ನೈತಿಕ ಜಾಗೃತಿ" },

  // Arabic
  { dimensionCode: "DIM_TECH_ADAPTABILITY", languageCode: "ar", name: "التكيف التكنولوجي" },
  { dimensionCode: "DIM_LEARNING_AGILITY", languageCode: "ar", name: "سرعة التعلم" },
  { dimensionCode: "DIM_CRITICAL_THINKING", languageCode: "ar", name: "التفكير النقدي" },
  { dimensionCode: "DIM_HUMAN_COLLABORATION", languageCode: "ar", name: "التعاون البشري" },
  { dimensionCode: "DIM_CREATIVE_SYNTHESIS", languageCode: "ar", name: "التركيب الإبداعي" },
  { dimensionCode: "DIM_ETHICAL_AWARENESS", languageCode: "ar", name: "الوعي الأخلاقي" },
];

export const AI_JOB_RISK_FINDER_LIKERT_OPTIONS: LikertOptionTranslationItem[] = [
  // Malayalam
  { optionKey: "1", languageCode: "ml", optionText: "പൂർണ്ണമായും വിയോജിക്കുന്നു" },
  { optionKey: "2", languageCode: "ml", optionText: "വിയോജിക്കുന്നു" },
  { optionKey: "3", languageCode: "ml", optionText: "തീർച്ചയില്ല / നിഷ്പക്ഷം" },
  { optionKey: "4", languageCode: "ml", optionText: "യോജിക്കുന്നു" },
  { optionKey: "5", languageCode: "ml", optionText: "പൂർണ്ണമായും യോജിക്കുന്നു" },

  // Hindi
  { optionKey: "1", languageCode: "hi", optionText: "दृढ़ता से असहमत" },
  { optionKey: "2", languageCode: "hi", optionText: "असहमत" },
  { optionKey: "3", languageCode: "hi", optionText: "तटस्थ / निश्चित नहीं" },
  { optionKey: "4", languageCode: "hi", optionText: "सहमत" },
  { optionKey: "5", languageCode: "hi", optionText: "दृढ़ता से सहमत" },

  // Tamil
  { optionKey: "1", languageCode: "ta", optionText: "முற்றிலும் உடன்படவில்லை" },
  { optionKey: "2", languageCode: "ta", optionText: "உடன்படவில்லை" },
  { optionKey: "3", languageCode: "ta", optionText: "நடுநிலை / உறுதியாக தெரியவில்லை" },
  { optionKey: "4", languageCode: "ta", optionText: "உடன்படுகிறேன்" },
  { optionKey: "5", languageCode: "ta", optionText: "முற்றிலும் உடன்படுகிறேன்" },

  // Kannada
  { optionKey: "1", languageCode: "kn", optionText: "ಖಂಡಿತವಾಗಿಯೂ ಒಪ್ಪುವುದಿಲ್ಲ" },
  { optionKey: "2", languageCode: "kn", optionText: "ಒಪ್ಪುವುದಿಲ್ಲ" },
  { optionKey: "3", languageCode: "kn", optionText: "ತಟಸ್ಥ / ಖಚಿತವಿಲ್ಲ" },
  { optionKey: "4", languageCode: "kn", optionText: "ಒಪ್ಪುತ್ತೇನೆ" },
  { optionKey: "5", languageCode: "kn", optionText: "ಖಂಡಿತವಾಗಿಯೂ ಒಪ್ಪುತ್ತೇನೆ" },

  // Arabic
  { optionKey: "1", languageCode: "ar", optionText: "أعارض بشدة" },
  { optionKey: "2", languageCode: "ar", optionText: "أعارض" },
  { optionKey: "3", languageCode: "ar", optionText: "محايد / غير متأكد" },
  { optionKey: "4", languageCode: "ar", optionText: "أوافق" },
  { optionKey: "5", languageCode: "ar", optionText: "أوافق بشدة" },
];

export const AI_JOB_RISK_FINDER_QUESTION_TRANSLATIONS: QuestionTranslationItem[] = [
  // -------------------------------------------------------------
  // Construct 1: Tech Adaptability (Q1 - Q8)
  // -------------------------------------------------------------
  {
    questionCode: "AIR_Q01",
    languageCode: "ml",
    questionText: "ഒരു പുതിയ ഡിജിറ്റൽ ആപ്പ് അല്ലെങ്കിൽ സോഫ്റ്റ്‌വെയർ ടൂൾ പരിചയപ്പെടുത്തുമ്പോൾ, അതിന്റെ സവിശേഷതകൾ സ്വന്തമായി പഠിക്കാൻ ഞാൻ ഇഷ്ടപ്പെടുന്നു.",
  },
  {
    questionCode: "AIR_Q01",
    languageCode: "hi",
    questionText: "जब कोई नया डिजिटल ऐप या सॉफ़्टवेयर टूल पेश किया जाता है, तो मुझे अपनी ओर से उसकी विशेषताओं को तलाशना अच्छा लगता है।",
  },
  {
    questionCode: "AIR_Q01",
    languageCode: "ta",
    questionText: "ஒரு புதிய டிஜிட்டல் பயன்பாடு அல்லது மென்பொருள் கருவி அறிமுகப்படுத்தப்படும்போது, அதன் அம்சங்களை நானே ஆராய்வதை விரும்புகிறேன்.",
  },
  {
    questionCode: "AIR_Q01",
    languageCode: "kn",
    questionText: "ಹೊಸ ಡಿಜಿಟಲ್ ಅಪ್ಲಿಕೇಶನ್ ಅಥವಾ ಸಾಫ್ಟ್‌ವೇರ್ ಉಪಕರಣ ಪರಿಚಯವಾದಾಗ, ಅದರ ವೈಶಿಷ್ಟ್ಯಗಳನ್ನು ನಾನೇ ಅನ್ವೇಷಿಸಲು ಇಷ್ಟಪಡುತ್ತೇನೆ.",
  },
  {
    questionCode: "AIR_Q01",
    languageCode: "ar",
    questionText: "عند تقديم تطبيق رقمي أو أداة برمجية جديدة، أستمتع باستكشاف ميزاتها بنفسي.",
  },

  {
    questionCode: "AIR_Q02",
    languageCode: "ml",
    questionText: "സ്കൂൾ അല്ലെങ്കിൽ വർക്ക് പ്രോജക്റ്റുകൾ വേഗത്തിൽ പൂർത്തിയാക്കാൻ കമ്പ്യൂട്ടർ ടൂളുകളും ഡിജിറ്റൽ അസിസ്റ്റന്റുകളും ഉപയോഗിക്കാൻ ഞാൻ ശ്രദ്ധിക്കുന്നു.",
  },
  {
    questionCode: "AIR_Q02",
    languageCode: "hi",
    questionText: "मैं स्कूल या काम के प्रोजेक्ट तेजी से पूरे करने के लिए कंप्यूटर टूल्स और डिजिटल सहायकों का उपयोग करने के तरीके तलाशता हूं।",
  },
  {
    questionCode: "AIR_Q02",
    languageCode: "ta",
    questionText: "பள்ளி அல்லது பணி திட்டங்களை விரைவாக முடிக்க கணினி கருவிகள் மற்றும் டிஜிட்டல் உதவியாளர்களைப் பயன்படுத்துவதற்கான வழிகளைத் தேடுகிறேன்.",
  },
  {
    questionCode: "AIR_Q02",
    languageCode: "kn",
    questionText: "ಶಾಲಾ ಅಥವಾ ಕೆಲಸದ ಯೋಜನೆಗಳನ್ನು ವೇಗವಾಗಿ ಪೂರ್ಣಗೊಳಿಸಲು ಕಂಪ್ಯೂಟರ್ ಉಪಕರಣಗಳು ಮತ್ತು ಡಿಜಿಟಲ್ ಸಹಾಯಕಗಳನ್ನು ಬಳಸುವ ಮಾರ್ಗಗಳನ್ನು ನಾನು ಸಕ್ರಿಯವಾಗಿ ಹುಡುಕುತ್ತೇನೆ.",
  },
  {
    questionCode: "AIR_Q02",
    languageCode: "ar",
    questionText: "أبحث بنشاط عن طرق لاستخدام أدوات الكمبيوتر والمساعدين الرقميين لإنجاز المشاريع المدرسية أو العملية بشكل أسرع.",
  },

  {
    questionCode: "AIR_Q03",
    languageCode: "ml",
    questionText: "ഞാൻ സ്ഥിരമായി ഉപയോഗിക്കുന്ന സോഫ്റ്റ്‌വെയറിന്റെ ഇന്റർഫേസ് മാറുമ്പോഴും എളുപ്പത്തിൽ പുതിയ രീതിയുമായി പൊരുത്തപ്പെടാൻ എനിക്ക് സാധിക്കുന്നു.",
  },
  {
    questionCode: "AIR_Q03",
    languageCode: "hi",
    questionText: "जब मेरे द्वारा नियमित रूप से उपयोग किए जाने वाले सॉफ़्टवेयर का इंटरफ़ेस बदलता है, तो मैं आसानी से नए तरीके से काम करने लगता हूं।",
  },
  {
    questionCode: "AIR_Q03",
    languageCode: "ta",
    questionText: "நான் வழக்கமாகப் பயன்படுத்தும் மென்பொருளின் இடைமுகம் மாறும்போது எளிதாக மாற்றியமைத்துக் கொள்ள முடிகிறது.",
  },
  {
    questionCode: "AIR_Q03",
    languageCode: "kn",
    questionText: "ನಾನು ನಿಯಮಿತವಾಗಿ ಬಳಸುವ ಸಾಫ್ಟ್‌ವೇರ್ ಇಂಟರ್‌ಫೇಸ್ ಬದಲಾದಾಗ ನನ್ನ ಕಾರ್ಯವಿಧಾನವನ್ನು ಸುಲಭವಾಗಿ ಹೊಂದಿಸಿಕೊಳ್ಳುತ್ತೇನೆ.",
  },
  {
    questionCode: "AIR_Q03",
    languageCode: "ar",
    questionText: "أشعر بالراحة في تكييف طريقة عملي عندما تتغير واجهة البرنامج الذي أستخدمه بانتظام.",
  },

  {
    questionCode: "AIR_Q04",
    languageCode: "ml",
    questionText: "സോഫ്റ്റ്‌വെയറിൽ സാങ്കേതിക തടസ്സങ്ങൾ ഉണ്ടാകുമ്പോൾ നിരാശപ്പെടാതെ സ്വയം പരിഹരിക്കാൻ ഞാൻ ശ്രമിക്കുന്നു.",
  },
  {
    questionCode: "AIR_Q04",
    languageCode: "hi",
    questionText: "सॉफ़्टवेयर में तकनीकी गड़बड़ी आने पर हार मानने के बजाय मैं उसे स्वयं हल करने का प्रयास करता हूं।",
  },
  {
    questionCode: "AIR_Q04",
    languageCode: "ta",
    questionText: "மென்பொருளில் தொழில்நுட்பக் கோளாறுகள் ஏற்படும்போது கைவிடாமல் தானாகவே சரிசெய்ய முயற்சிக்கிறேன்.",
  },
  {
    questionCode: "AIR_Q04",
    languageCode: "kn",
    questionText: "ಸಾಫ್ಟ್‌ವೇರ್‌ನಲ್ಲಿ ತಾಂತ್ರಿಕ ತೊಂದರೆ ಎದುರಾದಾಗ ಬಿಟ್ಟುಕೊಡದೆ ಸ್ವತಃ ಪರಿಹರಿಸಲು ಪ್ರಯತ್ನಿಸುತ್ತೇನೆ.",
  },
  {
    questionCode: "AIR_Q04",
    languageCode: "ar",
    questionText: "عند مواجهة خلل تقني في البرمجيات، أثابر على استكشاف الأخطاء وإصلاحها بدلاً من الاستسلام بسرعة.",
  },

  {
    questionCode: "AIR_Q05",
    languageCode: "ml",
    questionText: "പൂർണ്ണമായും പുതിയ ഡിജിറ്റൽ പ്ലാറ്റ്‌ഫോം പഠിക്കേണ്ടി വരുമ്പോൾ എനിക്ക് വലിയ സമ്മർദ്ദവും ഭയവും തോന്നാറുണ്ട്.",
  },
  {
    questionCode: "AIR_Q05",
    languageCode: "hi",
    questionText: "जब मुझे पूरी तरह से नया डिजिटल प्लेटफ़ॉर्म सीखना पड़ता है, तो मुझे बहुत तनाव और घबराहट महसूस होती है।",
  },
  {
    questionCode: "AIR_Q05",
    languageCode: "ta",
    questionText: "முற்றிலும் புதிய டிஜிட்டல் தளத்தைக் கற்றுக்கொள்ள வேண்டியிருக்கும்போது மிகுந்த மன அழுத்தத்தை உணர்கிறேன்.",
  },
  {
    questionCode: "AIR_Q05",
    languageCode: "kn",
    questionText: "ಸಂಪೂರ್ಣವಾಗಿ ಹೊಸ ಡಿಜಿಟಲ್ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಕಲಿಯಬೇಕಾದಾಗ ನನಗೆ ತುಂಬಾ ಒತ್ತಡ ಮತ್ತು ಆತಂಕ ಅನಿಸುತ್ತದೆ.",
  },
  {
    questionCode: "AIR_Q05",
    languageCode: "ar",
    questionText: "أشعر بالإرهاق والتوتر كلما توجب علي تعلم نظام أو منصة رقمية جديدة تماماً.",
  },

  {
    questionCode: "AIR_Q06",
    languageCode: "ml",
    questionText: "ടെക്സ്റ്റ്, ചിത്രം, കോഡിംഗ് എന്നിവയ്ക്കുള്ള ആധുനിക AI ടൂളുകൾ പരീക്ഷിക്കുന്നത് എനിക്ക് കൗതുകകരമാണ്.",
  },
  {
    questionCode: "AIR_Q06",
    languageCode: "hi",
    questionText: "टेक्स्ट, इमेज या कोडिंग के लिए नवीनतम AI टूल्स का परीक्षण करना मुझे बहुत रोमांचक लगता है।",
  },
  {
    questionCode: "AIR_Q06",
    languageCode: "ta",
    questionText: "உரை, படம் அல்லது குறியீட்டுக்கான அதிநவீன AI கருவிகளை பரிசோதிப்பது எனக்கு மிகவும் ஆர்வமூட்டுகிறது.",
  },
  {
    questionCode: "AIR_Q06",
    languageCode: "kn",
    questionText: "ಪಠ್ಯ, ಚಿತ್ರ ಅಥವಾ ಕೋಡಿಂಗ್‌ಗಾಗಿ ಹೊಸ AI ಉಪಕರಣಗಳನ್ನು ಪರೀಕ್ಷಿಸುವುದು ನನಗೆ ರೋಮಾಂಚನಕಾರಿ ಎನಿಸುತ್ತದೆ.",
  },
  {
    questionCode: "AIR_Q06",
    languageCode: "ar",
    questionText: "أجد أنه من المثير تجربة أدوات الذكاء الاصطناعي الناشئة مثل المساعدين النصيين أو منشئي الصور أو مساعدي البرمجة.",
  },

  {
    questionCode: "AIR_Q07",
    languageCode: "ml",
    questionText: "ഒരേപോലെയുള്ള ജോലികൾ ആവർത്തിച്ച് ചെയ്യുന്നതിന് പകരം കമ്പ്യൂട്ടർ വഴി ഓട്ടോമേറ്റ് ചെയ്യാനാണ് ഞാൻ താല്പര്യപ്പെടുന്നത്.",
  },
  {
    questionCode: "AIR_Q07",
    languageCode: "hi",
    questionText: "मैं दोहराव वाले कार्यों को बार-बार करने के बजाय कंप्यूटर के माध्यम से स्वचालित करना पसंद करता हूं।",
  },
  {
    questionCode: "AIR_Q07",
    languageCode: "ta",
    questionText: "மீண்டும் மீண்டும் செய்யப்படும் பணிகளை கைமுறையாக செய்வதற்குப் பதிலாக தானியக்கமாக்க விரும்புகிறேன்.",
  },
  {
    questionCode: "AIR_Q07",
    languageCode: "kn",
    questionText: "ಪುನರಾವರ್ತಿತ ಕೆಲಸಗಳನ್ನು ಪ್ರತಿ ಬಾರಿ ಕೈಯಿಂದ ಮಾಡುವ ಬದಲು ಕಂಪ್ಯೂಟರ್ ಮೂಲಕ ಸ್ವಯಂಚಾಲಿತಗೊಳಿಸಲು ಇಷ್ಟಪಡುತ್ತೇನೆ.",
  },
  {
    questionCode: "AIR_Q07",
    languageCode: "ar",
    questionText: "أفضل أتمتة المهام الروتينية المتكررة على جهاز الكمبيوتر بدلاً من أدائها يدوياً في كل مرة.",
  },

  {
    questionCode: "AIR_Q08",
    languageCode: "ml",
    questionText: "പുതിയ ഡിജിറ്റൽ ടൂളുകൾ വളരെ വേഗത്തിൽ കാര്യക്ഷമമായി ഉപയോഗിക്കാൻ എനിക്ക് സാധിക്കുമെന്ന ആത്മവിശ്വാസമുണ്ട്.",
  },
  {
    questionCode: "AIR_Q08",
    languageCode: "hi",
    questionText: "मुझे विश्वास है कि मैं नए डिजिटल प्लेटफ़ॉर्म पर बहुत तेजी से कुशल और उत्पादक बन सकता हूं।",
  },
  {
    questionCode: "AIR_Q08",
    languageCode: "ta",
    questionText: "புதிய டிஜிட்டல் கருவிகளில் விரைவாகத் தேர்ச்சி பெற்று திறம்பட செயல்பட முடியும் என்ற நம்பிக்கை எனக்கு உள்ளது.",
  },
  {
    questionCode: "AIR_Q08",
    languageCode: "kn",
    questionText: "ಹೊಸ ಡಿಜಿಟಲ್ ಉಪಕರಣಗಳಲ್ಲಿ ತ್ವರಿತವಾಗಿ ದಕ್ಷತೆಯಿಂದ ಕಾರ್ಯನಿರ್ವಹಿಸಬಲ್ಲೆ ಎಂಬ ಆತ್ಮವಿಶ್ವಾಸ ನನಗಿದೆ.",
  },
  {
    questionCode: "AIR_Q08",
    languageCode: "ar",
    questionText: "أنا واثق من قدرتي على أن أصبح منتجاً وسريعاً مع منصات الإنتاجية الرقمية الجديدة.",
  },

  // -------------------------------------------------------------
  // Construct 2: Learning Agility (Q9 - Q16)
  // -------------------------------------------------------------
  {
    questionCode: "AIR_Q09",
    languageCode: "ml",
    questionText: "പഠനവിഷയങ്ങൾക്ക് പുറത്തുള്ള പുതിയ മേഖലകളെക്കുറിച്ച് വായിക്കാനും പഠിക്കാനും ഞാൻ പലപ്പോഴും സമയം കണ്ടെത്താറുണ്ട്.",
  },
  {
    questionCode: "AIR_Q09",
    languageCode: "hi",
    questionText: "मैं अक्सर अपने पाठ्यक्रम से बाहर के विषयों के बारे में पढ़ने और सीखने के लिए समय निकालता हूं।",
  },
  {
    questionCode: "AIR_Q09",
    languageCode: "ta",
    questionText: "பாடத்திட்டத்திற்கு அப்பாற்பட்ட புதிய தலைப்புகளைப் பற்றி படிக்கவும் கற்றுக்கொள்ளவும் அடிக்கடி நேரம் ஒதுக்குகிறேன்.",
  },
  {
    questionCode: "AIR_Q09",
    languageCode: "kn",
    questionText: "ಪಠ್ಯಕ್ರಮದ ಹೊರತಾದ ಹೊಸ ವಿಷಯಗಳ ಬಗ್ಗೆ ಓದಲು ಮತ್ತು ಕಲಿಯಲು ನಾನು ಆಗಾಗ್ಗೆ ಸಮಯ ಮೀಸಲಿಡುತ್ತೇನೆ.",
  },
  {
    questionCode: "AIR_Q09",
    languageCode: "ar",
    questionText: "أقرأ أو أشاهد دروساً تعليمية بشكل متكرر لتعلم مواضيع خارج المنهج الدراسي الأساسي.",
  },

  {
    questionCode: "AIR_Q10",
    languageCode: "ml",
    questionText: "പരിചയമില്ലാത്ത പുതിയൊരു വിഷയത്തിൽ പ്രവർത്തിക്കുമ്പോൾ അടിസ്ഥാന കാര്യങ്ങൾ വേഗത്തിൽ ഗ്രഹിക്കാൻ എനിക്ക് സാധിക്കുന്നു.",
  },
  {
    questionCode: "AIR_Q10",
    languageCode: "hi",
    questionText: "जब मैं किसी अपरिचित क्षेत्र में काम करता हूं, तो मैं मुख्य अवधारणाओं को तुरंत समझकर लागू करना शुरू कर सकता हूं।",
  },
  {
    questionCode: "AIR_Q10",
    languageCode: "ta",
    questionText: "அறிமுகமில்லாத ஒரு துறையில் பணிபுரியும் போது முக்கிய கருத்துக்களை விரைவாகப் புரிந்துகொண்டு பயன்படுத்த முடிகிறது.",
  },
  {
    questionCode: "AIR_Q10",
    languageCode: "kn",
    questionText: "ಅಪರಿಚಿತ ಕ್ಷೇತ್ರದಲ್ಲಿ ಕೆಲಸ ಮಾಡುವಾಗ ಪ್ರಮುಖ ಪರಿಕಲ್ಪನೆಗಳನ್ನು ತ್ವರಿತವಾಗಿ ಗ್ರಹಿಸಿ ಅನ್ವಯಿಸಲು ಪ್ರಾರಂಭಿಸಬಲ್ಲೆ.",
  },
  {
    questionCode: "AIR_Q10",
    languageCode: "ar",
    questionText: "عند العمل في مجال غير مألوف، يمكنني استيعاب المفاهيم الأساسية بسرعة والبدء في تطبيقها.",
  },

  {
    questionCode: "AIR_Q11",
    languageCode: "ml",
    questionText: "കൂടുതൽ മികച്ചതും വേഗതയേറിയതുമായ പുതിയൊരു രീതി വരുമ്പോൾ പഴയ ശീലങ്ങൾ മാറ്റാൻ ഞാൻ തയ്യാറാണ്.",
  },
  {
    questionCode: "AIR_Q11",
    languageCode: "hi",
    questionText: "जब कोई बेहतर और अधिक कुशल तरीका सामने आता है, तो मैं पुरानी विधियों को छोड़ने के लिए तैयार रहता हूं।",
  },
  {
    questionCode: "AIR_Q11",
    languageCode: "ta",
    questionText: "ஒரு சிறந்த அல்லது திறமையான புதிய முறை வரும்போது பழைய பழக்கங்களை மாற்றிக்கொள்ள தயாராக இருக்கிறேன்.",
  },
  {
    questionCode: "AIR_Q11",
    languageCode: "kn",
    questionText: "ಹೆಚ್ಚು ಪರಿಣಾಮಕಾರಿ ವಿಧಾನ ಲಭ್ಯವಾದಾಗ ಹಳೆಯ ವಿಧಾನಗಳನ್ನು ಬದಲಾಯಿಸಲು ನಾನು ಸಿದ್ಧನಾಗಿದ್ದೇನೆ.",
  },
  {
    questionCode: "AIR_Q11",
    languageCode: "ar",
    questionText: "أنا على استعداد للتخلي عن الطرق القديمة عندما تتوفر تقنية أفضل أو أكثر كفاءة بكثير.",
  },

  {
    questionCode: "AIR_Q12",
    languageCode: "ml",
    questionText: "തൊഴിൽ രംഗത്തെ ദ്രുതഗതിയിലുള്ള മാറ്റങ്ങളെ ഭയപ്പെടാതെ പഠിക്കാനുള്ള നല്ലൊരു അവസരമായി ഞാൻ കാണുന്നു.",
  },
  {
    questionCode: "AIR_Q12",
    languageCode: "hi",
    questionText: "मैं करियर की आवश्यकताओं में तेजी से होने वाले बदलावों को खतरे के बजाय सीखने के रोमांचक अवसर के रूप में देखता हूं।",
  },
  {
    questionCode: "AIR_Q12",
    languageCode: "ta",
    questionText: "தொழில் தேவைகளில் ஏற்படும் மாற்றங்களை அச்சுறுத்தலாகப் பார்க்காமல் கற்றுக்கொள்வதற்கான வாய்ப்பாகப் பார்க்கிறேன்.",
  },
  {
    questionCode: "AIR_Q12",
    languageCode: "kn",
    questionText: "ವೃತ್ತಿಪರ ಕ್ಷೇತ್ರದಲ್ಲಿನ ತ್ವರಿತ ಬದಲಾವಣೆಗಳನ್ನು ಆತಂಕದ ಬದಲು ಕಲಿಯುವ ರೋಮಾಂಚಕಾರಿ ಅವಕಾಶವಾಗಿ ನೋಡುತ್ತೇನೆ.",
  },
  {
    questionCode: "AIR_Q12",
    languageCode: "ar",
    questionText: "أرى التغيرات السريعة في متطلبات المهن كفرص مثيرة للتعلم بدلاً من كونها تهديدات.",
  },

  {
    questionCode: "AIR_Q13",
    languageCode: "ml",
    questionText: "പുതിയ നൈപുണ്യങ്ങൾ പഠിക്കുന്നതിന് പകരം എനിക്ക് ഇതിനകം അറിയാവുന്ന കാര്യങ്ങളിൽ മാത്രം ഒതുങ്ങിനിൽക്കാനാണ് ഞാൻ താല്പര്യപ്പെടുന്നത്.",
  },
  {
    questionCode: "AIR_Q13",
    languageCode: "hi",
    questionText: "मैं नए कौशल सीखने के लिए प्रयास करने के बजाय केवल उसी काम में लगे रहना पसंद करता हूं जो मुझे पहले से आता है।",
  },
  {
    questionCode: "AIR_Q13",
    languageCode: "ta",
    questionText: "புதிய திறன்களைக் கற்றுக்கொள்வதற்குப் பதிலாக எனக்கு ஏற்கனவே தெரிந்தவற்றிலேயே தொடர்ந்து இருக்க விரும்புகிறேன்.",
  },
  {
    questionCode: "AIR_Q13",
    languageCode: "kn",
    questionText: "ಹೊಸ ಕೌಶಲ್ಯ ಕಲಿಯುವ ಬದಲು ನನಗೆ ಈಗಾಗಲೇ ತಿಳಿದಿರುವ ಕೆಲಸಗಳಲ್ಲೇ ಇರಲು ಇಷ್ಟಪಡುತ್ತೇನೆ.",
  },
  {
    questionCode: "AIR_Q13",
    languageCode: "ar",
    questionText: "أفضل التمسك الصارم بما أعرفه بالفعل بدلاً من بذل الجهد لإتقان مهارات جديدة.",
  },

  {
    questionCode: "AIR_Q14",
    languageCode: "ml",
    questionText: "എന്റെ പോരായ്മകൾ തിരുത്താനും മെച്ചപ്പെടാനുമായി മറ്റുള്ളവരിൽ നിന്നുള്ള ക്രിയാത്മക നിർദ്ദേശങ്ങൾ ഞാൻ സ്വീകരിക്കുന്നു.",
  },
  {
    questionCode: "AIR_Q14",
    languageCode: "hi",
    questionText: "मैं अपने काम में सुधार करने के लिए दूसरों से रचनात्मक प्रतिक्रिया और सुझाव सक्रिय रूप से मांगता हूं।",
  },
  {
    questionCode: "AIR_Q14",
    languageCode: "ta",
    questionText: "எனது பணியை மேம்படுத்த மற்றவர்களிடமிருந்து ஆக்கபூர்வமான கருத்துக்களையும் வழிகாட்டல்களையும் வரவேற்கிறேன்.",
  },
  {
    questionCode: "AIR_Q14",
    languageCode: "kn",
    questionText: "ನನ್ನ ಕೆಲಸವನ್ನು ಸುಧಾರಿಸಲು ಇತರರಿಂದ ರಚನಾತ್ಮಕ ಪ್ರತಿಕ್ರಿಯೆಯನ್ನು ನಾನು ಸಕ್ರಿಯವಾಗಿ ಬಯಸುತ್ತೇನೆ.",
  },
  {
    questionCode: "AIR_Q14",
    languageCode: "ar",
    questionText: "أطلب بنشاط ملاحظات بناءة على عملي لتحديد مجالات محددة أحتاج إلى تحسينها.",
  },

  {
    questionCode: "AIR_Q15",
    languageCode: "ml",
    questionText: "സങ്കീർണ്ണമായ ഒരു വിഷയം പഠിച്ചെടുക്കാൻ വ്യത്യസ്ത സ്രോതസ്സുകളിൽ നിന്നുള്ള വിവരങ്ങൾ സംയോജിപ്പിക്കാൻ എനിക്ക് കഴിയും.",
  },
  {
    questionCode: "AIR_Q15",
    languageCode: "hi",
    questionText: "कठिन विषय में महारत हासिल करने के लिए मैं कई लेखों या संसाधनों से जानकारी को स्वतंत्र रूप से समझ सकता हूं।",
  },
  {
    questionCode: "AIR_Q15",
    languageCode: "ta",
    questionText: "ஒரு கடினமான பாடத்தில் தேர்ச்சி பெற பல ஆதாரங்களிலிருந்து தகவல்களை ஒருங்கிணைத்து சுயமாக கற்றுக்கொள்ள முடியும்.",
  },
  {
    questionCode: "AIR_Q15",
    languageCode: "kn",
    questionText: "ಕಠಿಣ ವಿಷಯವನ್ನು ಕರಗತ ಮಾಡಿಕೊಳ್ಳಲು ವಿವಿಧ ಮೂಲಗಳಿಂದ ಮಾಹಿತಿಯನ್ನು ಸ್ವತಂತ್ರವಾಗಿ ಸಂಶ್ಲೇಷಿಸಬಲ್ಲೆ.",
  },
  {
    questionCode: "AIR_Q15",
    languageCode: "ar",
    questionText: "يمكنني توليف المعلومات بشكل مستقل من مقالات أو مصادر متعددة لإتقان موضوع صعب.",
  },

  {
    questionCode: "AIR_Q16",
    languageCode: "ml",
    questionText: "ഭാവിയിൽ ഉപകാരപ്പെടുന്ന പുതിയ കഴിവുകൾ നേടാനായി ഞാൻ സ്ഥിരമായി വ്യക്തിഗത സമയം മാറ്റിവെക്കാറുണ്ട്.",
  },
  {
    questionCode: "AIR_Q16",
    languageCode: "hi",
    questionText: "मैं भविष्य के लिए आवश्यक कौशल विकसित करने के लिए नियमित रूप से व्यक्तिगत समय समर्पित करता हूं।",
  },
  {
    questionCode: "AIR_Q16",
    languageCode: "ta",
    questionText: "எதிர்காலத்திற்குத் தேவையான திறன்களை வளர்த்துக்கொள்ள தொடர்ந்து எனது சொந்த நேரத்தை ஒதுக்குகிறேன்.",
  },
  {
    questionCode: "AIR_Q16",
    languageCode: "kn",
    questionText: "ಭವಿಷ್ಯದ ವೃತ್ತಿಜೀವನಕ್ಕೆ ಅಗತ್ಯವಿರುವ ಕೌಶಲ್ಯಗಳನ್ನು ಬೆಳೆಸಿಕೊಳ್ಳಲು ನಾನು ನಿಯಮಿತವಾಗಿ ವೈಯಕ್ತಿಕ ಸಮಯವನ್ನು ಮೀಸಲಿಡುತ್ತೇನೆ.",
  },
  {
    questionCode: "AIR_Q16",
    languageCode: "ar",
    questionText: "أخصص بانتظام وقتاً شخصياً لتطوير مهارات جاهزة للمستقبل تعزز جاهزيتي المهنية.",
  },

  // -------------------------------------------------------------
  // Construct 3: Critical Thinking (Q17 - Q24)
  // -------------------------------------------------------------
  {
    questionCode: "AIR_Q17",
    languageCode: "ml",
    questionText: "AI നൽകുന്ന ഉത്തരങ്ങളോ വിവരങ്ങളോ കാണുമ്പോൾ, അതിന്റെ നിജസ്ഥിതി വിശ്വസനീയമായ പ്രധാന സ്രോതസ്സുകളുമായി ഒത്തുനോക്കാറുണ്ട്.",
  },
  {
    questionCode: "AIR_Q17",
    languageCode: "hi",
    questionText: "जब मैं AI द्वारा तैयार किया गया सारांश या लेख पढ़ता हूं, तो मैं विश्वसनीय मूल स्रोतों से तथ्यों की दोबारा जांच करता हूं।",
  },
  {
    questionCode: "AIR_Q17",
    languageCode: "ta",
    questionText: "AI உருவாக்கிய தகவல்களைப் படிக்கும் போது, நம்பகமான மூலங்களிலிருந்து உண்மைகளை சரிபார்க்கிறேன்.",
  },
  {
    questionCode: "AIR_Q17",
    languageCode: "kn",
    questionText: "AI ಸಿದ್ಧಪಡಿಸಿದ ಸಾರಾಂಶವನ್ನು ಓದುವಾಗ, ಅಧಿಕೃತ ಮೂಲಗಳಿಂದ ಸತ್ಯಾಸತ್ಯತೆಯನ್ನು ಮರುಪರಿಶೀಲಿಸುತ್ತೇನೆ.",
  },
  {
    questionCode: "AIR_Q17",
    languageCode: "ar",
    questionText: "عند قراءة ملخص أو مقال تم إنشاؤه بواسطة الذكاء الاصطناعي، أتحقق من الحقائق بمقارنتها بالمصادر الأصلية الموثوقة.",
  },

  {
    questionCode: "AIR_Q18",
    languageCode: "ml",
    questionText: "ലേഖനങ്ങളിലോ പ്രസന്റേഷനുകളിലോ ഉള്ള ദുർബലമായ വാദങ്ങളും യുക്തിയില്ലായ്മയും എളുപ്പത്തിൽ കണ്ടെത്താൻ എനിക്ക് കഴിയും.",
  },
  {
    questionCode: "AIR_Q18",
    languageCode: "hi",
    questionText: "मैं लिखित तर्कों या प्रस्तुतियों में तार्किक कमजोरियों और त्रुटियों को आसानी से पहचान सकता हूं।",
  },
  {
    questionCode: "AIR_Q18",
    languageCode: "ta",
    questionText: "எழுதப்பட்ட வாதங்கள் அல்லது விளக்கக்காட்சிகளில் உள்ள பலவீனமான தர்க்கத்தை எளிதாகக் கண்டறிய முடிகிறது.",
  },
  {
    questionCode: "AIR_Q18",
    languageCode: "kn",
    questionText: "ದಾಖಲೆಗಳಲ್ಲಿ ಅಥವಾ ಪ್ರಸ್ತುತಿಗಳಲ್ಲಿನ ತರ್ಕಹೀನತೆ ಮತ್ತು ದೋಷಗಳನ್ನು ನಾನು ಸುಲಭವಾಗಿ ಗುರುತಿಸಬಲ್ಲೆ.",
  },
  {
    questionCode: "AIR_Q18",
    languageCode: "ar",
    questionText: "يمكنني بسهولة اكتشاف العيوب أو المنطق الضعيف أو الادعاءات غير المدعومة في الحجج أو العروض التقديمية.",
  },

  {
    questionCode: "AIR_Q19",
    languageCode: "ml",
    questionText: "ഒരു പഠനത്തിന്റെയോ ഡാറ്റയുടെയോ നിഗമനങ്ങൾ അംഗീകരിക്കുന്നതിന് മുമ്പ് അതിന്റെ രീതിശാസ്ത്രവും തെളിവുകളും ഞാൻ സൂക്ഷ്മമായി പരിശോധിക്കുന്നു.",
  },
  {
    questionCode: "AIR_Q19",
    languageCode: "hi",
    questionText: "डेटा या शोध के निष्कर्षों को स्वीकार करने से पहले, मैं अंतर्निहित कार्यप्रणाली और साक्ष्यों की सावधानीपूर्वक जांच करता हूं।",
  },
  {
    questionCode: "AIR_Q19",
    languageCode: "ta",
    questionText: "தரவு அல்லது ஆராய்ச்சியின் முடிவுகளை ஏற்கும் முன், அதன் முறை மற்றும் ஆதாரங்களை கவனமாக ஆய்வு செய்கிறேன்.",
  },
  {
    questionCode: "AIR_Q19",
    languageCode: "kn",
    questionText: "ದತ್ತಾಂಶ ಅಥವಾ ಸಂಶೋಧನೆಯ ತೀರ್ಮಾನಗಳನ್ನು ಒಪ್ಪಿಕೊಳ್ಳುವ ಮೊದಲು, ಅದರ ವಿಧಾನ ಮತ್ತು ಪುರಾವೆಗಳನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ಪರಿಶೀಲಿಸುತ್ತೇನೆ.",
  },
  {
    questionCode: "AIR_Q19",
    languageCode: "ar",
    questionText: "قبل قبول الاستنتاجات من البيانات أو الأبحاث، أفحص المنهجية والأدلة الأساسية بعناية.",
  },

  {
    questionCode: "AIR_Q20",
    languageCode: "ml",
    questionText: "വലിയ സങ്കീർണ്ണമായ പ്രശ്നങ്ങൾ വരുമ്പോൾ, അവയെ ചെറിയ ചോദ്യങ്ങളായി വിഭജിച്ചാണ് ഞാൻ പരിഹരിക്കാൻ ശ്രമിക്കുന്നത്.",
  },
  {
    questionCode: "AIR_Q20",
    languageCode: "hi",
    questionText: "बड़ी और जटिल समस्याओं को हल करने से पहले मैं उन्हें छोटे, परीक्षण योग्य प्रश्नों में विभाजित करता हूं।",
  },
  {
    questionCode: "AIR_Q20",
    languageCode: "ta",
    questionText: "பெரிய, சிக்கலான சிக்கல்களைத் தீர்ப்பதற்கு முன் அவற்றை சிறிய பகுதிகளாகப் பிரிக்கிறேன்.",
  },
  {
    questionCode: "AIR_Q20",
    languageCode: "kn",
    questionText: "ದೊಡ್ಡ ಮತ್ತು ಸಂಕೀರ್ಣ ಸಮಸ್ಯೆಗಳನ್ನು ಪರಿಹರಿಸುವ ಮೊದಲು ಸಣ್ಣ ಪ್ರಶ್ನೆಗಳಾಗಿ ವಿಂಗಡಿಸುತ್ತೇನೆ.",
  },
  {
    questionCode: "AIR_Q20",
    languageCode: "ar",
    questionText: "أقوم بتقسيم المشكلات الكبيرة والغامضة إلى أسئلة أصغر قابلة للاختبار قبل محاولة حلها.",
  },

  {
    questionCode: "AIR_Q21",
    languageCode: "ml",
    questionText: "കമ്പ്യൂട്ടർ അല്ലെങ്കിൽ ഓട്ടോമേറ്റഡ് ടൂൾ നൽകുന്ന ഉത്തരങ്ങൾ ശരിയാണോ എന്ന് ചിന്തിക്കാതെ ഞാൻ സാധാരണയായി പൂർണ്ണമായി വിശ്വസിക്കാറുണ്ട്.",
  },
  {
    questionCode: "AIR_Q21",
    languageCode: "hi",
    questionText: "यदि कोई स्वचालित उपकरण उत्तर देता है, तो मैं आमतौर पर उसकी सटीकता पर सवाल उठाए बिना उस पर भरोसा कर लेता हूं।",
  },
  {
    questionCode: "AIR_Q21",
    languageCode: "ta",
    questionText: "ஒரு தானியங்கி கருவி விடையளித்தால், அதன் துல்லியத்தை சந்தேகிக்காமல் பொதுவாக நம்பிவிடுவேன்.",
  },
  {
    questionCode: "AIR_Q21",
    languageCode: "kn",
    questionText: "ಸ್ವಯಂಚಾಲಿತ ಉಪಕರಣ ಉತ್ತರಿಸಿದರೆ, ಅದರ ನಿಖರತೆಯನ್ನು ಪ್ರಶ್ನಿಸದೆ ಸಾಮಾನ್ಯವಾಗಿ ನಂಬಿಬಿಡುತ್ತೇನೆ.",
  },
  {
    questionCode: "AIR_Q21",
    languageCode: "ar",
    questionText: "إذا أنتجت أداة آلية أو برنامج إجابة، فعادة ما أثق بها دون التشكيك في دقتها.",
  },

  {
    questionCode: "AIR_Q22",
    languageCode: "ml",
    questionText: "സങ്കീർണ്ണമായ കേസുകൾ പഠിക്കുമ്പോൾ മുൻധാരണകളെ ചോദ്യം ചെയ്യാനും ഇതര സാധ്യതകൾ അന്വേഷിക്കാനും ഞാൻ ശ്രമിക്കാറുണ്ട്.",
  },
  {
    questionCode: "AIR_Q22",
    languageCode: "hi",
    questionText: "जटिल मामलों का विश्लेषण करते समय मैं धारणाओं पर सवाल उठाता हूं और वैकल्पिक स्पष्टीकरण तलाशता हूं।",
  },
  {
    questionCode: "AIR_Q22",
    languageCode: "ta",
    questionText: "சிக்கலான தலைப்புகளை பகுப்பாய்வு செய்யும் போது அனுமானங்களை கேள்விக்குட்படுத்தி மாற்று விளக்கங்களை ஆராய்கிறேன்.",
  },
  {
    questionCode: "AIR_Q22",
    languageCode: "kn",
    questionText: "ಸಂಕೀರ್ಣ ವಿಷಯಗಳನ್ನು ವಿಶ್ಲೇಷಿಸುವಾಗ ಊಹೆಗಳನ್ನು ಪ್ರಶ್ನಿಸಿ ಪರ್ಯಾಯ ವಿವರಣೆಗಳನ್ನು ಹುಡುಕುತ್ತೇನೆ.",
  },
  {
    questionCode: "AIR_Q22",
    languageCode: "ar",
    questionText: "أقوم بمساءلة الافتراضات واستكشاف تفسيرات بديلة عند تحليل دراسات الحالة المعقدة.",
  },

  {
    questionCode: "AIR_Q23",
    languageCode: "ml",
    questionText: "വികാരപരമായ വാദങ്ങളും യഥാർത്ഥ വസ്തുതാപരമായ തെളിവുകളും തമ്മിൽ കൃത്യമായി വേർതിരിച്ചറിയാൻ എനിക്ക് സാധിക്കുന്നു.",
  },
  {
    questionCode: "AIR_Q23",
    languageCode: "hi",
    questionText: "मैं वस्तुनिष्ठ तथ्यात्मक साक्ष्य और भावनात्मक या प्रेरक भाषण के बीच स्पष्ट अंतर कर सकता हूं।",
  },
  {
    questionCode: "AIR_Q23",
    languageCode: "ta",
    questionText: "உண்மை ஆதாரங்களுக்கும் உணர்ச்சிபூர்வமான வாதங்களுக்கும் இடையே உள்ள வித்தியாசத்தை துல்லியமாக கண்டறிய முடிகிறது.",
  },
  {
    questionCode: "AIR_Q23",
    languageCode: "kn",
    questionText: "ವಾಸ್ತವಿಕ ಪುರಾವೆಗಳು ಮತ್ತು ಭಾವನಾತ್ಮಕ ವಾದಗಳ ನಡುವಿನ ವ್ಯತ್ಯಾಸವನ್ನು ನಿಖರವಾಗಿ ಗುರುತಿಸಬಲ್ಲೆ.",
  },
  {
    questionCode: "AIR_Q23",
    languageCode: "ar",
    questionText: "يمكنني التمييز بين الأدلة الواقعية الموضوعية والخطاب العاطفي أو المقنع.",
  },

  {
    questionCode: "AIR_Q24",
    languageCode: "ml",
    questionText: "വിവാദപരമായ വിഷയങ്ങളിൽ വ്യത്യസ്ത കാഴ്ചപ്പാടുകൾ പരിശോധിച്ച് സമതുലിതമായ ന്യായമായ തീരുമാനത്തിലെത്താൻ എനിക്ക് കഴിയും.",
  },
  {
    questionCode: "AIR_Q24",
    languageCode: "hi",
    questionText: "विवादास्पद विषय पर विभिन्न दृष्टिकोणों का मूल्यांकन करके संतुलित और तर्कसंगत निर्णय लेने में मुझे सहजता होती है।",
  },
  {
    questionCode: "AIR_Q24",
    languageCode: "ta",
    questionText: "முரண்பாடான தலைப்புகளில் மாறுபட்ட கருத்துக்களை ஆராய்ந்து சமநிலையான முடிவை எடுக்க முடிகிறது.",
  },
  {
    questionCode: "AIR_Q24",
    languageCode: "kn",
    questionText: "ವಿವಾದಾತ್ಮಕ ವಿಷಯಗಳಲ್ಲಿ ವಿಭಿನ್ನ ದೃಷ್ಟಿಕೋನಗಳನ್ನು ಮೌಲ್ಯಮಾಪನ ಮಾಡಿ ಸಮತೋಲಿತ ನಿರ್ಧಾರ ತೆಗೆದುಕೊಳ್ಳಲು ಸಶಕ್ತನಾಗಿದ್ದೇನೆ.",
  },
  {
    questionCode: "AIR_Q24",
    languageCode: "ar",
    questionText: "أشعر بالراحة في تقييم وجهات النظر المختلفة حول موضوع مثير للجدل للوصول إلى حكم متوازن ومبني على أسس سليمة.",
  },

  // -------------------------------------------------------------
  // Construct 4: Human Collaboration (Q25 - Q32)
  // -------------------------------------------------------------
  {
    questionCode: "AIR_Q25",
    languageCode: "ml",
    questionText: "മറ്റുള്ളവരുടെ അഭിപ്രായങ്ങൾ ശ്രദ്ധയോടെ കേൾക്കാനും അവരുടെ വികാരങ്ങൾ മനസ്സിലാക്കാനും എനിക്ക് സാധിക്കുന്നു.",
  },
  {
    questionCode: "AIR_Q25",
    languageCode: "hi",
    questionText: "मैं दूसरों के दृष्टिकोण को ध्यान से सुनने और उन्हें यह महसूस कराने में प्रभावी हूं कि उन्हें समझा गया है।",
  },
  {
    questionCode: "AIR_Q25",
    languageCode: "ta",
    questionText: "மற்றவர்களின் கருத்துக்களைக் கவனமாகக் கேட்டு அவர்களைப் புரிந்துகொள்வதில் நான் சிறந்து விளங்குகிறேன்.",
  },
  {
    questionCode: "AIR_Q25",
    languageCode: "kn",
    questionText: "ಇತರರ ದೃಷ್ಟಿಕೋನಗಳನ್ನು ಗಮನವಿಟ್ಟು ಕೇಳಿ ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವಲ್ಲಿ ನಾನು ಪರಿಣಾಮಕಾರಿಯಾಗಿದ್ದೇನೆ.",
  },
  {
    questionCode: "AIR_Q25",
    languageCode: "ar",
    questionText: "أنا فعال في الاستماع باهتمام لوجهات نظر الآخرين وجعلهم يشعرون بأنهم مفهومون.",
  },

  {
    questionCode: "AIR_Q26",
    languageCode: "ml",
    questionText: "ടീമിൽ അഭിപ്രായവ്യത്യാസങ്ങൾ ഉണ്ടാകുമ്പോൾ മധ്യസ്ഥത വഹിച്ച് എല്ലാവർക്കും സ്വീകാര്യമായ ഒത്തുതീർപ്പിലെത്താൻ ഞാൻ സഹായിക്കുന്നു.",
  },
  {
    questionCode: "AIR_Q26",
    languageCode: "hi",
    questionText: "जब टीम में असहमति होती है, तो मैं मध्यस्थता करने और सभी को संतुष्ट करने वाले समझौते खोजने में मदद करता हूं।",
  },
  {
    questionCode: "AIR_Q26",
    languageCode: "ta",
    questionText: "குழுவில் கருத்து வேறுபாடுகள் ஏற்படும்போது சமரசம் செய்து தீர்வு காண உதவுகிறேன்.",
  },
  {
    questionCode: "AIR_Q26",
    languageCode: "kn",
    questionText: "ತಂಡದಲ್ಲಿ ಭಿನ್ನಾಭಿಪ್ರಾಯ ಉಂಟಾದಾಗ ಮಧ್ಯಸ್ಥಿಕೆ ವಹಿಸಿ ಎಲ್ಲರಿಗೂ ಒಪ್ಪಿಗೆಯಾಗುವ ಹೊಂದಾಣಿಕೆ ತರಲು ಸಹಾಯ ಮಾಡುತ್ತೇನೆ.",
  },
  {
    questionCode: "AIR_Q26",
    languageCode: "ar",
    questionText: "عندما تنشأ خلافات في الفريق، أساعد في التوسط وإيجاد حلول وسط بناءة ترضي الجميع.",
  },

  {
    questionCode: "AIR_Q27",
    languageCode: "ml",
    questionText: "സങ്കീർണ്ണമായ കാര്യങ്ങൾ വ്യത്യസ്ത പശ്ചാത്തലമുള്ള സഹപാഠികൾക്ക് ലളിതമായി വിശദീകരിച്ചു നൽകാൻ എനിക്ക് സാധിക്കുന്നു.",
  },
  {
    questionCode: "AIR_Q27",
    languageCode: "hi",
    questionText: "मैं विभिन्न कौशल स्तरों या पृष्ठभूमियों वाले साथियों को जटिल अवधारणाएं स्पष्ट रूप से समझा सकता हूं।",
  },
  {
    questionCode: "AIR_Q27",
    languageCode: "ta",
    questionText: "சிக்கலான கருத்துக்களை வெவ்வேறு பின்னணி கொண்ட குழு உறுப்பினர்களுக்கு தெளிவாக விளக்க முடிகிறது.",
  },
  {
    questionCode: "AIR_Q27",
    languageCode: "kn",
    questionText: "ಸಂಕೀರ್ಣ ಪರಿಕಲ್ಪನೆಗಳನ್ನು ವಿಭಿನ್ನ ಹಿನ್ನೆಲೆಯ ತಂಡದ ಸದಸ್ಯರಿಗೆ ಸ್ಪಷ್ಟವಾಗಿ ವಿವರಿಸಬಲ್ಲೆ.",
  },
  {
    questionCode: "AIR_Q27",
    languageCode: "ar",
    questionText: "يمكنني شرح المفاهيم المعقدة بوضوح لزملائي في الفريق من مختلف المستويات والخلفيات.",
  },

  {
    questionCode: "AIR_Q28",
    languageCode: "ml",
    questionText: "ടീമിന്റെ പൊതുവായ ലക്ഷ്യം നേടാനായി സഹപ്രവർത്തകരെ പ്രോത്സാഹിപ്പിക്കാനും പിന്തുണയ്ക്കാനും ഞാൻ ഇഷ്ടപ്പെടുന്നു.",
  },
  {
    questionCode: "AIR_Q28",
    languageCode: "hi",
    questionText: "मैं अपने पूरे समूह को साझा लक्ष्य हासिल करने में मदद करने के लिए अपने साथियों को प्रेरित करना पसंद करता हूं।",
  },
  {
    questionCode: "AIR_Q28",
    languageCode: "ta",
    questionText: "குழுவின் பொதுவான இலக்கை அடைய சக உறுப்பினர்களை ஊக்குவிக்கவும் ஆதரிக்கவும் விரும்புகிறேன்.",
  },
  {
    questionCode: "AIR_Q28",
    languageCode: "kn",
    questionText: "ತಂಡದ ಗುರಿಯನ್ನು ಸಾಧಿಸಲು ಸಹಪಾಠಿಗಳನ್ನು ಪ್ರೇರೇಪಿಸಲು ಮತ್ತು ಬೆಂಬಲಿಸಲು ಇಷ್ಟಪಡುತ್ತೇನೆ.",
  },
  {
    questionCode: "AIR_Q28",
    languageCode: "ar",
    questionText: "أستمتع بتحفيز ودعم زملائي لمساعدة مجموعتنا بأكملها على تحقيق هدف مشترك.",
  },

  {
    questionCode: "AIR_Q29",
    languageCode: "ml",
    questionText: "മറ്റുള്ളവരുമായി ചേർന്ന് പ്രവർത്തിക്കുന്നത് ബുദ്ധിമുട്ടായി തോന്നുന്നതിനാൽ ഒറ്റയ്ക്ക് ജോലി ചെയ്യാനാണ് ഞാൻ എപ്പോഴും ആഗ്രഹിക്കുന്നത്.",
  },
  {
    questionCode: "AIR_Q29",
    languageCode: "hi",
    questionText: "मुझे दूसरों के साथ काम करना थका देने वाला लगता है और मैं जब भी संभव हो पूरी तरह से अकेले काम करना पसंद करता हूं।",
  },
  {
    questionCode: "AIR_Q29",
    languageCode: "ta",
    questionText: "மற்றவர்களுடன் பணிபுரிவது கடினமாக இருப்பதால் தனியாகவே அனைத்துப் பணிகளையும் செய்ய விரும்புகிறேன்.",
  },
  {
    questionCode: "AIR_Q29",
    languageCode: "kn",
    questionText: "ಇತರರೊಂದಿಗೆ ಕೆಲಸ ಮಾಡುವುದು ಆಯಾಸಕರ ಎನಿಸುವುದರಿಂದ ಸಾಧ್ಯವಾದಷ್ಟು ಒಬ್ಬನೇ ಕೆಲಸ ಮಾಡಲು ಇಷ್ಟಪಡುತ್ತೇನೆ.",
  },
  {
    questionCode: "AIR_Q29",
    languageCode: "ar",
    questionText: "أجد العمل مع الآخرين مرهقاً وأفضل القيام بجميع المهام بمفردي كلما أمكن ذلك.",
  },

  {
    questionCode: "AIR_Q30",
    languageCode: "ml",
    questionText: "ഒരു ടീം അംഗം വിഷമത്തിലാണെന്ന് കണ്ടാൽ സ്വമേധയാ അവരെ സഹായിക്കാൻ ഞാൻ മുന്നോട്ട് വരാറുണ്ട്.",
  },
  {
    questionCode: "AIR_Q30",
    languageCode: "hi",
    questionText: "मैं समझ सकता हूं कि जब कोई टीम सदस्य परेशानी में हो, और मैं आगे बढ़कर उसकी व्यावहारिक मदद करता हूं।",
  },
  {
    questionCode: "AIR_Q30",
    languageCode: "ta",
    questionText: "குழு உறுப்பினர் ஒருவர் சிரமப்படும்போது அதை உணர்ந்து முன்கூட்டியே உதவி செய்கிறேன்.",
  },
  {
    questionCode: "AIR_Q30",
    languageCode: "kn",
    questionText: "ತಂಡದ ಸದಸ್ಯರೊಬ್ಬರು ಕಷ್ಟದಲ್ಲಿದ್ದಾಗ ಅದನ್ನು ಗ್ರಹಿಸಿ ಸ್ವಯಂಪ್ರೇರಿತನಾಗಿ ಪ್ರಾಯೋಗಿಕ ನೆರವು ನೀಡುತ್ತೇನೆ.",
  },
  {
    questionCode: "AIR_Q30",
    languageCode: "ar",
    questionText: "يمكنني أن أشعر عندما يمر أحد أعضاء الفريق بصعوبة وأبادر بتقديم مساعدة عملية له.",
  },

  {
    questionCode: "AIR_Q31",
    languageCode: "ml",
    questionText: "പ്രോജക്റ്റുകളിൽ ജോലികളും ഉത്തരവാദിത്തങ്ങളും എല്ലാവർക്കും തുല്യമായി വീതിച്ചുനൽകാൻ ചർച്ച ചെയ്യാൻ എനിക്ക് എളുപ്പമാണ്.",
  },
  {
    questionCode: "AIR_Q31",
    languageCode: "hi",
    questionText: "उचित सहयोग सुनिश्चित करने के लिए मैं भूमिकाओं और समय-सीमाओं पर बातचीत करने में सहज हूं।",
  },
  {
    questionCode: "AIR_Q31",
    languageCode: "ta",
    questionText: "நியாயமான ஒத்துழைப்பை உறுதிப்படுத்த பொறுப்புகளையும் காலக்கெடுவையும் கலந்தாலோசித்து முடிவு செய்கிறேன்.",
  },
  {
    questionCode: "AIR_Q31",
    languageCode: "kn",
    questionText: "ನ್ಯಾಯಯುತ ಸಹಯೋಗವನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಲು ಜವಾಬ್ದಾರಿಗಳು ಮತ್ತು ಸಮಯವನ್ನು ಮಾತುಕತೆ ನಡೆಸಿ ನಿರ್ಧರಿಸಬಲ್ಲೆ.",
  },
  {
    questionCode: "AIR_Q31",
    languageCode: "ar",
    questionText: "أشعر بالراحة في التفاوض بشأن الأدوار والجداول الزمنية لضمان تعاون عادل بين الجميع.",
  },

  {
    questionCode: "AIR_Q32",
    languageCode: "ml",
    questionText: "സത്യസന്ധതയും വാക്കുപാലിക്കലും വഴി പുതിയ വ്യക്തികളുമായി പെട്ടെന്ന് നല്ലൊരു സൗഹൃദവും വിശ്വാസവും ഉണ്ടാക്കാൻ എനിക്ക് കഴിയും.",
  },
  {
    questionCode: "AIR_Q32",
    languageCode: "hi",
    questionText: "सहानुभूति, ईमानदारी और विश्वसनीयता दिखाकर मैं नए लोगों के साथ तेजी से विश्वास बना लेता हूं।",
  },
  {
    questionCode: "AIR_Q32",
    languageCode: "ta",
    questionText: "பச்சாதாபம் மற்றும் நம்பகத்தன்மையை வெளிப்படுத்துவதன் மூலம் புதியவர்களுடன் விரைவாக நம்பிக்கையை உருவாக்குகிறேன்.",
  },
  {
    questionCode: "AIR_Q32",
    languageCode: "kn",
    questionText: "ಪ್ರಾಮಾಣಿಕತೆ ಮತ್ತು ವಿಶ್ವಾಸಾರ್ಹತೆಯ ಮೂಲಕ ಹೊಸ ಜನರೊಂದಿಗೆ ತ್ವರಿತವಾಗಿ ನಂಬಿಕೆಯನ್ನು ಬೆಳೆಸಿಕೊಳ್ಳುತ್ತೇನೆ.",
  },
  {
    questionCode: "AIR_Q32",
    languageCode: "ar",
    questionText: "أبني الثقة بسرعة مع أشخاص جدد من خلال إظهار التعاطف والنزاهة والالتزام الموثوق به.",
  },

  // -------------------------------------------------------------
  // Construct 5: Creative Synthesis (Q33 - Q40)
  // -------------------------------------------------------------
  {
    questionCode: "AIR_Q33",
    languageCode: "ml",
    questionText: "വ്യത്യസ്ത വിഷയങ്ങളിൽ നിന്നുള്ള ആശയങ്ങൾ കൂട്ടിച്ചേർത്ത് പുതിയതും വ്യത്യസ്തവുമായ പരിഹാരങ്ങൾ കണ്ടെത്താൻ ഞാൻ ഇഷ്ടപ്പെടുന്നു.",
  },
  {
    questionCode: "AIR_Q33",
    languageCode: "hi",
    questionText: "मैं मूल प्रोजेक्ट समाधान तैयार करने के लिए पूरी तरह से अलग क्षेत्रों के विचारों को जोड़ता हूं।",
  },
  {
    questionCode: "AIR_Q33",
    languageCode: "ta",
    questionText: "புதிய தீர்வுகளை உருவாக்க முற்றிலும் மாறுபட்ட துறைகளிலிருந்து யோசனைகளை இணைக்கிறேன்.",
  },
  {
    questionCode: "AIR_Q33",
    languageCode: "kn",
    questionText: "ನವೀನ ಪರಿಹಾರಗಳನ್ನು ರೂಪಿಸಲು ವಿಭಿನ್ನ ಕ್ಷೇತ್ರಗಳ ವಿಚಾರಗಳನ್ನು ಸಂಯೋಜಿಸಲು ಇಷ್ಟಪಡುತ್ತೇನೆ.",
  },
  {
    questionCode: "AIR_Q33",
    languageCode: "ar",
    questionText: "كثيراً ما أربط بين أفكار من مجالات مختلفة تماماً للتوصل إلى حلول مبتكرة للمشاريع.",
  },

  {
    questionCode: "AIR_Q34",
    languageCode: "ml",
    questionText: "പഴയ രീതികൾ പരാജയപ്പെടുമ്പോൾ പുതിയതും ചിന്തിക്കാത്തതുമായ വഴികളിലൂടെ പ്രശ്നങ്ങൾ പരിഹരിക്കാൻ ഞാൻ ശ്രമിക്കാറുണ്ട്.",
  },
  {
    questionCode: "AIR_Q34",
    languageCode: "hi",
    questionText: "जब पारंपरिक तरीके विफल हो जाते हैं, तो मैं गैर-पारंपरिक विकल्पों पर विचार-मंथन करने का आनंद लेता हूं।",
  },
  {
    questionCode: "AIR_Q34",
    languageCode: "ta",
    questionText: "வழக்கமான அணுகுமுறைகள் பலனளிக்காதபோது வழக்கத்திற்கு மாறான புதிய வழிகளை யோசிக்கிறேன்.",
  },
  {
    questionCode: "AIR_Q34",
    languageCode: "kn",
    questionText: "ಸಾಂಪ್ರದಾಯಿಕ ವಿಧಾನಗಳು ವಿಫಲವಾದಾಗ ನವೀನ ಪರ್ಯಾಯಗಳನ್ನು ಹುಡುಕಲು ಇಷ್ಟಪಡುತ್ತೇನೆ.",
  },
  {
    questionCode: "AIR_Q34",
    languageCode: "ar",
    questionText: "عندما تفشل الطرق التقليدية في حل مشكلة ما، أستمتع بالعصف الذهني لبدائل غير تقليدية.",
  },

  {
    questionCode: "AIR_Q35",
    languageCode: "ml",
    questionText: "പുതിയ ഡിസൈനുകൾ, രചനകൾ, അല്ലെങ്കിൽ ഘടനകൾ സ്വന്തമായി രൂപകൽപ്പന ചെയ്യാൻ ഞാൻ ഇഷ്ടപ്പെടുന്നു.",
  },
  {
    questionCode: "AIR_Q35",
    languageCode: "hi",
    questionText: "मुझे शुरुआत से नए विज़ुअल लेआउट, लिखित आख्यान या ढाँचे डिज़ाइन करने में मज़ा आता है।",
  },
  {
    questionCode: "AIR_Q35",
    languageCode: "ta",
    questionText: "புதிய காட்சி தளவமைப்புகள், எழுத்துக்கள் அல்லது வடிவங்களை சுயமாக வடிவமைக்க விரும்புகிறேன்.",
  },
  {
    questionCode: "AIR_Q35",
    languageCode: "kn",
    questionText: "ಹೊಸ ವಿನ್ಯಾಸಗಳು, ಲೇಖನಗಳು ಅಥವಾ ಚೌಕಟ್ಟುಗಳನ್ನು ಮೊದಲಿನಿಂದಲೇ ಸ್ವತಃ ರೂಪಿಸಲು ಇಷ್ಟಪಡುತ್ತೇನೆ.",
  },
  {
    questionCode: "AIR_Q35",
    languageCode: "ar",
    questionText: "أستمتع بتصميم تخطيطات مرئية جديدة أو روايات مكتوبة أو أطر هيكلية من الصفر.",
  },

  {
    questionCode: "AIR_Q36",
    languageCode: "ml",
    questionText: "വ്യക്തതയില്ലാത്തതോ ആശയക്കുഴപ്പമുള്ളതോ ആയ സാഹചര്യങ്ങളെ ക്രിയാത്മകമായ പുതിയ അവസരങ്ങളാക്കി മാറ്റാൻ എനിക്ക് കഴിയും.",
  },
  {
    questionCode: "AIR_Q36",
    languageCode: "hi",
    questionText: "मैं अस्पष्ट स्थितियों को नवाचार के स्पष्ट, रचनात्मक अवसरों में बदल सकता हूं।",
  },
  {
    questionCode: "AIR_Q36",
    languageCode: "ta",
    questionText: "தெளிவற்ற சூழல்களை புதிய ஆக்கபூர்வமான வாய்ப்புகளாக மாற்ற முடிகிறது.",
  },
  {
    questionCode: "AIR_Q36",
    languageCode: "kn",
    questionText: "ಅಸ್ಪಷ್ಟ ಸಂದರ್ಭಗಳನ್ನು ಸೃಜನಶೀಲ ನಾವೀನ್ಯತೆಯ ಅವಕಾಶಗಳಾಗಿ ಪರಿವರ್ತಿಸಬಲ್ಲೆ.",
  },
  {
    questionCode: "AIR_Q36",
    languageCode: "ar",
    questionText: "يمكنني إعادة صياغة المواقف الغامضة أو المربكة إلى فرص إبداعية واضحة للابتكار.",
  },

  {
    questionCode: "AIR_Q37",
    languageCode: "ml",
    questionText: "കൃത്യമായ നിർദ്ദേശങ്ങളില്ലാത്ത സ്വതന്ത്രമായ അസൈൻമെന്റുകളിൽ ജോലി ചെയ്യുന്നത് എനിക്ക് വലിയ പ്രയാസമുണ്ടാക്കാറുണ്ട്.",
  },
  {
    questionCode: "AIR_Q37",
    languageCode: "hi",
    questionText: "मुझे ऐसे खुले असाइनमेंट पर काम करने में असहजता महसूस होती है जिनमें चरण-दर-चरण निर्देश नहीं होते।",
  },
  {
    questionCode: "AIR_Q37",
    languageCode: "ta",
    questionText: "துல்லியமான வழிகாட்டுதல்கள் இல்லாத திறந்தநிலை பணிகளில் ஈடுபடுவது எனக்கு அசௌகரியமாக இருக்கும்.",
  },
  {
    questionCode: "AIR_Q37",
    languageCode: "kn",
    questionText: "ಹಂತ-ಹಂತದ ನಿಖರ ಸೂಚನೆಗಳಿಲ್ಲದ ಮುಕ್ತ ಕಾರ್ಯಗಳಲ್ಲಿ ಕೆಲಸ ಮಾಡುವುದು ನನಗೆ ಅಸಹನೀಯ ಅನಿಸುತ್ತದೆ.",
  },
  {
    questionCode: "AIR_Q37",
    languageCode: "ar",
    questionText: "أشعر بعدم الارتياح عند العمل على مهام مفتوحة تفتقر إلى تعليمات دقيقة خطوة بخطوة.",
  },

  {
    questionCode: "AIR_Q38",
    languageCode: "ml",
    questionText: "കല, ശാസ്ത്രം, സാങ്കേതികവിദ്യ എന്നിവ ഒരുമിപ്പിച്ചു മികച്ച പ്രോജക്റ്റുകൾ ഉണ്ടാക്കാൻ ഞാൻ ആഗ്രഹിക്കുന്നു.",
  },
  {
    questionCode: "AIR_Q38",
    languageCode: "hi",
    questionText: "मुझे अद्वितीय परिणाम उत्पन्न करने के लिए कला, विज्ञान और प्रौद्योगिकी के विचारों को जोड़ना पसंद है।",
  },
  {
    questionCode: "AIR_Q38",
    languageCode: "ta",
    questionText: "கலை, அறிவியல் மற்றும் தொழில்நுட்பத்தை இணைத்து தனித்துவமான படைப்புகளை உருவாக்க விரும்புகிறேன்.",
  },
  {
    questionCode: "AIR_Q38",
    languageCode: "kn",
    questionText: "ಕಲೆ, ವಿಜ್ಞಾನ ಮತ್ತು ತಂತ್ರಜ್ಞಾನವನ್ನು ಸಂಯೋಜಿಸಿ ಅನನ್ಯ ಫಲಿತಾಂಶ ನೀಡಲು ಇಷ್ಟಪಡುತ್ತೇನೆ.",
  },
  {
    questionCode: "AIR_Q38",
    languageCode: "ar",
    questionText: "أحب الجمع بين الرؤى الفنية والعلمية والتكنولوجية لإنتاج مخرجات مشاريع فريدة.",
  },

  {
    questionCode: "AIR_Q39",
    languageCode: "ml",
    questionText: "മറ്റുള്ളവർക്ക് എളുപ്പത്തിൽ മനസ്സിലാകുന്ന രീതിയിൽ ഉപമകളിലൂടെയും മാതൃകകളിലൂടെയും ആശയങ്ങൾ അവതരിപ്പിക്കാൻ എനിക്ക് സാധിക്കുന്നു.",
  },
  {
    questionCode: "AIR_Q39",
    languageCode: "hi",
    questionText: "मैं आकर्षक उपमाओं और वैचारिक मॉडलों के माध्यम से विचारों को व्यक्त कर सकता हूं जो दूसरों को समझ आते हैं।",
  },
  {
    questionCode: "AIR_Q39",
    languageCode: "ta",
    questionText: "உதாரணங்கள் மற்றும் உருவகங்கள் மூலம் யோசனைகளை மற்றவர்கள் எளிதில் புரிந்துகொள்ளும் வகையில் விளக்க முடிகிறது.",
  },
  {
    questionCode: "AIR_Q39",
    languageCode: "kn",
    questionText: "ಉದಾಹರಣೆಗಳು ಮತ್ತು ಪರಿಕಲ್ಪನಾ ಮಾದರಿಗಳ ಮೂಲಕ ಇತರರಿಗೆ ಸುಲಭವಾಗಿ ಅರ್ಥವಾಗುವಂತೆ ವಿಚಾರಗಳನ್ನು ಪ್ರಸ್ತುತಪಡಿಸಬಲ್ಲೆ.",
  },
  {
    questionCode: "AIR_Q39",
    languageCode: "ar",
    questionText: "يمكنني التعبير عن الأفكار من خلال استعارات ونماذج مفاهيمية مقنعة يتردد صداها لدى الآخرين.",
  },

  {
    questionCode: "AIR_Q40",
    languageCode: "ml",
    questionText: "ഏറ്റവും മികച്ച രൂപകൽപ്പന തിരഞ്ഞെടുക്കുന്നതിന് മുൻപ് ഒരു ആശയത്തിന്റെ പലവിധ മാതൃകകൾ നിർമ്മിച്ചുനോക്കാൻ ഞാൻ സമയം കണ്ടെത്താറുണ്ട്.",
  },
  {
    questionCode: "AIR_Q40",
    languageCode: "hi",
    questionText: "मैं सबसे सुरुचिपूर्ण डिज़ाइन पर निर्णय लेने से पहले किसी विचार के कई प्रोटोटाइप संस्करण बनाता हूं।",
  },
  {
    questionCode: "AIR_Q40",
    languageCode: "ta",
    questionText: "சிறந்த வடிவமைப்பைத் தேர்ந்தெடுப்பதற்கு முன் ஒரு யோசனையின் பல மாதிரி வடிவங்களை உருவாக்குகிறேன்.",
  },
  {
    questionCode: "AIR_Q40",
    languageCode: "kn",
    questionText: "ಉತ್ತಮ ವಿನ್ಯಾಸವನ್ನು ಆಯ್ಕೆ ಮಾಡುವ ಮೊದಲು ಕಲ್ಪನೆಯ ಬಹು ಮೂಲಮಾದರಿಗಳನ್ನು ಸಿದ್ಧಪಡಿಸುತ್ತೇನೆ.",
  },
  {
    questionCode: "AIR_Q40",
    languageCode: "ar",
    questionText: "غالباً ما أقوم بإنشاء نماذج أولية متعددة لفكرة ما قبل الاستقرار على التصميم الأكثر أناقة.",
  },

  // -------------------------------------------------------------
  // Construct 6: Ethical Awareness (Q41 - Q48)
  // -------------------------------------------------------------
  {
    questionCode: "AIR_Q41",
    languageCode: "ml",
    questionText: "പുതിയ സാങ്കേതികവിദ്യകൾ ഉപയോഗിക്കാൻ തുടങ്ങുന്നതിന് മുമ്പ് അവയുടെ സാമൂഹികവും മാനുഷികവുമായ പ്രത്യാഘാതങ്ങളെക്കുറിച്ച് ഞാൻ ചിന്തിക്കാറുണ്ട്.",
  },
  {
    questionCode: "AIR_Q41",
    languageCode: "hi",
    questionText: "नई तकनीकों को अपनाने का समर्थन करने से पहले मैं उनके सामाजिक और मानवीय परिणामों के बारे में सोचता हूं।",
  },
  {
    questionCode: "AIR_Q41",
    languageCode: "ta",
    questionText: "புதிய தொழில்நுட்பங்களைப் பயன்படுத்துவதற்கு முன் அவற்றின் சமூக மற்றும் மனித தாக்கங்களை சிந்திக்கிறேன்.",
  },
  {
    questionCode: "AIR_Q41",
    languageCode: "kn",
    questionText: "ಹೊಸ ತಂತ್ರಜ್ಞಾನಗಳನ್ನು ಅಳವಡಿಸಿಕೊಳ್ಳುವ ಮೊದಲು ಅವುಗಳ ಸಾಮಾಜಿಕ ಪರಿಣಾಮಗಳ ಬಗ್ಗೆ ಯೋಚಿಸುತ್ತೇನೆ.",
  },
  {
    questionCode: "AIR_Q41",
    languageCode: "ar",
    questionText: "أفكر بانتظام في العواقب الاجتماعية والإنسانية للتقنيات الجديدة قبل دعم تبنيها.",
  },

  {
    questionCode: "AIR_Q42",
    languageCode: "ml",
    questionText: "ഡിജിറ്റൽ സിസ്റ്റങ്ങളിൽ ആളുകളുടെ സ്വകാര്യതയും വ്യക്തിഗത വിവരങ്ങളും സംരക്ഷിക്കുന്നത് വളരെ പ്രധാനമാണെന്ന് ഞാൻ കരുതുന്നു.",
  },
  {
    questionCode: "AIR_Q42",
    languageCode: "hi",
    questionText: "डिजिटल सिस्टम का उपयोग करते समय उपयोगकर्ताओं की गोपनीयता और डेटा अधिकारों की रक्षा करना बहुत महत्वपूर्ण मानता हूं।",
  },
  {
    questionCode: "AIR_Q42",
    languageCode: "ta",
    questionText: "டிஜிட்டல் அமைப்புகளில் பயனர்களின் தனியுரிமை மற்றும் தரவு உரிமைகளைப் பாதுகாப்பது அவசியம் என்று கருதுகிறேன்.",
  },
  {
    questionCode: "AIR_Q42",
    languageCode: "kn",
    questionText: "ಡಿಜಿಟಲ್ ವ್ಯವಸ್ಥೆಗಳಲ್ಲಿ ಬಳಕೆದಾರರ ಗೌಪ್ಯತೆ ಮತ್ತು ವೈಯಕ್ತಿಕ ಡೇಟಾ ಹಕ್ಕುಗಳನ್ನು ರಕ್ಷಿಸುವುದು ಅತ್ಯಂತ ಮುಖ್ಯ ಎಂದು ಭಾವಿಸುತ್ತೇನೆ.",
  },
  {
    questionCode: "AIR_Q42",
    languageCode: "ar",
    questionText: "أعتبر أنه من الضروري حماية خصوصية المستخدم وحقوق البيانات الشخصية عند استخدام الأنظمة الرقمية.",
  },

  {
    questionCode: "AIR_Q43",
    languageCode: "ml",
    questionText: "കമ്പ്യൂട്ടർ സിസ്റ്റങ്ങളിലെ അൽഗോരിതങ്ങൾ ചില സമൂഹങ്ങളോട് വിവേചനം കാണിക്കാൻ സാധ്യതയുണ്ടെന്ന കാര്യത്തിൽ ഞാൻ ജാഗരൂകനാണ്.",
  },
  {
    questionCode: "AIR_Q43",
    languageCode: "hi",
    questionText: "मैं इस बात के प्रति सतर्क रहता हूं कि एल्गोरिथम निर्णय प्रणाली अनजाने में कुछ समूहों के साथ भेदभाव कर सकती है।",
  },
  {
    questionCode: "AIR_Q43",
    languageCode: "ta",
    questionText: "தானியங்கி முடிவுகள் குறிப்பிட்ட சமூகக் குழுக்களுக்கு எதிராக பாரபட்சமாக மாறக்கூடும் என்பதில் விழிப்புடன் இருக்கிறேன்.",
  },
  {
    questionCode: "AIR_Q43",
    languageCode: "kn",
    questionText: "ಅಲ್ಗಾರಿದಮ್ ನಿರ್ಧಾರಗಳು ಅಜಾಗರೂಕತೆಯಿಂದ ಕೆಲವು ಗುಂಪುಗಳ ವಿರುದ್ಧ ತಾರತಮ್ಯ ಮಾಡಬಹುದು ಎಂಬ ಬಗ್ಗೆ ನಾನು ಎಚ್ಚರವಾಗಿದ್ದೇನೆ.",
  },
  {
    questionCode: "AIR_Q43",
    languageCode: "ar",
    questionText: "أنا متيقظ للطرق التي قد تميز بها أنظمة القرار الخوارزمية عن غير قصد ضد مجموعات مجتمعية معينة.",
  },

  {
    questionCode: "AIR_Q44",
    languageCode: "ml",
    questionText: "നാം ഉപയോഗിക്കുന്ന AI സിസ്റ്റങ്ങൾ വരുത്തുന്ന തെറ്റുകൾക്ക് വ്യക്തിഗത ഉത്തരവാദിത്തം ഏറ്റെടുക്കാൻ നാം ബാധ്യസ്ഥരാണ്.",
  },
  {
    questionCode: "AIR_Q44",
    languageCode: "hi",
    questionText: "मेरा मानना है कि पेशेवरों को अपने द्वारा उपयोग किए जाने वाले AI सिस्टम की गलतियों की व्यक्तिगत जिम्मेदारी लेनी चाहिए।",
  },
  {
    questionCode: "AIR_Q44",
    languageCode: "ta",
    questionText: "நாம் பயன்படுத்தும் AI அமைப்புகள் செய்யும் தவறுகளுக்கு நாமே பொறுப்பேற்க வேண்டும் என்று நம்புகிறேன்.",
  },
  {
    questionCode: "AIR_Q44",
    languageCode: "kn",
    questionText: "ನಾವು ಬಳಸುವ AI ವ್ಯವಸ್ಥೆಗಳ ತಪ್ಪುಗಳಿಗೆ ನಾವೇ ವೈಯಕ್ತಿಕ ಹೊಣೆಗಾರಿಕೆ ತೆಗೆದುಕೊಳ್ಳಬೇಕು ಎಂದು ನಾನು ನಂಬುತ್ತೇನೆ.",
  },
  {
    questionCode: "AIR_Q44",
    languageCode: "ar",
    questionText: "أعتقد أنه يجب على المهنيين تحمل المسؤولية الشخصية عن الأخطاء التي ترتكبها أنظمة الذكاء الاصطناعي التي يشرفون عليها.",
  },

  {
    questionCode: "AIR_Q45",
    languageCode: "ml",
    questionText: "ഒരു സാങ്കേതിക ടൂൾ ജോലി വേഗത്തിലാക്കുന്നുണ്ടെങ്കിൽ അത് എല്ലാവരോടും നീതിപൂർവ്വമാണോ പ്രവർത്തിക്കുന്നത് എന്ന് ഞാൻ ശ്രദ്ധിക്കാറില്ല.",
  },
  {
    questionCode: "AIR_Q45",
    languageCode: "hi",
    questionText: "यदि कोई तकनीकी उपकरण काम को तेजी से पूरा करता है, तो मुझे इसकी परवाह नहीं है कि वह सभी के साथ समान व्यवहार करता है या नहीं।",
  },
  {
    questionCode: "AIR_Q45",
    languageCode: "ta",
    questionText: "ஒரு கருவி வேலையை விரைவாக முடித்தால், அது அனைவரையும் சமமாக நடத்துகிறதா என்பதைப் பற்றி நான் கவலைப்படுவதில்லை.",
  },
  {
    questionCode: "AIR_Q45",
    languageCode: "kn",
    questionText: "ತಂತ್ರಜ್ಞಾನ ಉಪಕರಣ ಕೆಲಸವನ್ನು ವೇಗಗೊಳಿಸಿದರೆ, ಅದು ಎಲ್ಲರನ್ನೂ ಸಮಾನವಾಗಿ ಕಾಣುತ್ತದೆಯೇ ಎಂಬುದು ನನಗೆ ಮುಖ್ಯವಲ್ಲ.",
  },
  {
    questionCode: "AIR_Q45",
    languageCode: "ar",
    questionText: "إذا كانت الأداة التكنولوجية تنجز العمل بشكل أسرع، فلا يهمني ما إذا كانت تعامل جميع الناس بإنصاف.",
  },

  {
    questionCode: "AIR_Q46",
    languageCode: "ml",
    questionText: "വേഗത, ചെലവ് ചുരുക്കൽ, മനുഷ്യ ജീവനക്കാരുടെ ക്ഷേമം എന്നിവ തമ്മിലുള്ള സന്തുലിതാവസ്ഥ മനസ്സിലാക്കാൻ ഞാൻ ശ്രമിക്കാറുണ്ട്.",
  },
  {
    questionCode: "AIR_Q46",
    languageCode: "hi",
    questionText: "मैं गति, लागत में कमी और श्रमिकों की भलाई के बीच नैतिक संतुलन को समझने का प्रयास करता हूं।",
  },
  {
    questionCode: "AIR_Q46",
    languageCode: "ta",
    questionText: "வேகம், செலவுக் குறைப்பு மற்றும் தொழிலாளர்களின் நல்வாழ்வு ஆகியவற்றுக்கு இடையேயான சமநிலையைப் புரிந்து கொள்ள முயற்சிக்கிறேன்.",
  },
  {
    questionCode: "AIR_Q46",
    languageCode: "kn",
    questionText: "ವೇಗ, ವೆಚ್ಚ ಕಡಿತ ಮತ್ತು ಉದ್ಯೋಗಿಗಳ ಯೋಗಕ್ಷೇಮದ ನಡುವಿನ ನೈತಿಕ ಸಮತೋಲನವನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ಪ್ರಯತ್ನಿಸುತ್ತೇನೆ.",
  },
  {
    questionCode: "AIR_Q46",
    languageCode: "ar",
    questionText: "أسعى لفهم المفاضلات الأخلاقية بين السرعة وخفض التكاليف ورفاهية العمال.",
  },

  {
    questionCode: "AIR_Q47",
    languageCode: "ml",
    questionText: "പഠനത്തിലോ ജോലിയിലോ സത്യസന്ധതയില്ലാത്ത കാര്യങ്ങൾ കാണുമ്പോൾ ധൈര്യത്തോടെ പ്രതികരിക്കാൻ ഞാൻ തയ്യാറാണ്.",
  },
  {
    questionCode: "AIR_Q47",
    languageCode: "hi",
    questionText: "जब मुझे किसी शैक्षणिक या व्यावसायिक प्रक्रिया में ईमानदारी की कमी दिखाई देती है, तो मैं बोलने में सहज महसूस करता हूं।",
  },
  {
    questionCode: "AIR_Q47",
    languageCode: "ta",
    questionText: "நேர்மையற்ற நடைமுறைகளைக் காணும்போது தயங்காமல் பேசுகிறேன்.",
  },
  {
    questionCode: "AIR_Q47",
    languageCode: "kn",
    questionText: "ಶೈಕ್ಷಣಿಕ ಅಥವಾ ವೃತ್ತಿಪರ ಕಾರ್ಯಗಳಲ್ಲಿ ಪ್ರಾಮಾಣಿಕತೆಯ ಕೊರತೆ ಕಂಡಾಗ ಧೈರ್ಯವಾಗಿ ಧ್ವನಿ ಎತ್ತುತ್ತೇನೆ.",
  },
  {
    questionCode: "AIR_Q47",
    languageCode: "ar",
    questionText: "أشعر بالراحة في التحدث علناً عندما ألاحظ إجراءً أكاديمياً أو مهنياً يفتقر إلى النزاهة.",
  },

  {
    questionCode: "AIR_Q48",
    languageCode: "ml",
    questionText: "കമ്പ്യൂട്ടറോ AI-യോ ഉപയോഗിച്ച് ഉണ്ടാക്കിയ ഉള്ളടക്കങ്ങൾ മറ്റുള്ളവരുമായി പങ്കിടുമ്പോൾ അത് തുറന്നുപറയണമെന്ന് ഞാൻ വിശ്വസിക്കുന്നു.",
  },
  {
    questionCode: "AIR_Q48",
    languageCode: "hi",
    questionText: "जब भी AI द्वारा बनाई गई सामग्री साझा की जाती है, तो मैं पारदर्शी और ईमानदार प्रकटीकरण की वकालत करता हूं।",
  },
  {
    questionCode: "AIR_Q48",
    languageCode: "ta",
    questionText: "AI உருவாக்கிய உள்ளடக்கத்தைப் பகிரும்போது அதை வெளிப்படையாகத் தெரிவிக்க வேண்டும் என்பதில் உறுதியாக உள்ளேன்.",
  },
  {
    questionCode: "AIR_Q48",
    languageCode: "kn",
    questionText: "AI ಸೃಷ್ಟಿಸಿದ ವಿಷಯವನ್ನು ಹಂಚಿಕೊಳ್ಳುವಾಗ ಅದನ್ನು ಪಾರದರ್ಶಕವಾಗಿ ತಿಳಿಸಬೇಕೆಂದು ನಾನು ಬಯಸುತ್ತೇನೆ.",
  },
  {
    questionCode: "AIR_Q48",
    languageCode: "ar",
    questionText: "أؤيد الإفصاح الشفاف والصادق كلما تمت مشاركة محتوى تم إنشاؤه بواسطة الذكاء الاصطناعي مع الآخرين.",
  },
];
