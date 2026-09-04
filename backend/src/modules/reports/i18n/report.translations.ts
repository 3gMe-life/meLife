/**
 * 3G MeLife Psychometric Report Multilingual Translation Dictionaries
 * Supported Languages: English (en), Malayalam (ml), Hindi (hi), Arabic (ar), Tamil (ta), Kannada (kn)
 */

export interface ReportI18nDictionary {
  reportTitle: string;
  reportSubtitle: string;
  confidentialNotice: string;
  sections: {
    studentProfile: string;
    profileSummary: string;
    interestProfile: string;
    skillBehaviour: string;
    aptitudeInsights: string;
    developmentalStrengths: string;
    explorationAreas: string;
    parentGuidance: string;
  };
  labels: {
    name: string;
    age: string;
    grade: string;
    institution: string;
    assessment: string;
    completedDate: string;
    reportId: string;
    archetypeLabel: string;
    strongAreas: string;
    developmentAreas: string;
    overallAccuracy: string;
    keyLearningHabits: string;
    explorationDisclaimer: string;
    recommendedActivities: string;
    focusAreas: string;
    dosHeader: string;
    dontsHeader: string;
    conversationStartersHeader: string;
    supportiveActionsHeader: string;
  };
  parentGuidance: {
    summary: string;
    dos: string[];
    donts: string[];
    conversations: string[];
    supportActions: string[];
  };
}

export const REPORT_TRANSLATIONS: Record<string, ReportI18nDictionary> = {
  en: {
    reportTitle: "Skill Finder Psychometric Assessment Report",
    reportSubtitle: "Discovering Your Unique Strengths, Exploratory Interests and Learning Patterns",
    confidentialNotice: "CONFIDENTIAL & PROPRIETARY — Calibrated strictly for the student, parent, and authorized educational counsellor.",
    sections: {
      studentProfile: "1. Student Profile & Evaluation Context",
      profileSummary: "2. Executive Learning Profile Summary",
      interestProfile: "3. Vocational & Exploratory Interest Profile (RIASEC)",
      skillBehaviour: "4. Skill Instincts & Behavioural Indicators",
      aptitudeInsights: "5. Demonstrated Cognitive Aptitude & Problem Solving",
      developmentalStrengths: "6. Developmental Strengths & Learning Habits",
      explorationAreas: "7. Recommended Exploration Pathways & Activity Areas",
      parentGuidance: "8. Parent & Educator Guidance (Nurturing Mindset)",
    },
    labels: {
      name: "Student Name",
      age: "Age",
      grade: "Grade / Class",
      institution: "School / Institution",
      assessment: "Assessment Battery",
      completedDate: "Evaluation Date",
      reportId: "Report Identifier",
      archetypeLabel: "Primary Learning Archetype",
      strongAreas: "Strongest Behavioural Strengths",
      developmentAreas: "High-Potential Growth Opportunities",
      overallAccuracy: "Overall Demonstrated Task Accuracy",
      keyLearningHabits: "Positive Habits to Cultivate",
      explorationDisclaimer: "IMPORTANT NOTE: These represent broad areas for curiosity-driven exploration, NOT rigid career decisions.",
      recommendedActivities: "Suggested Hands-on Activities & Projects",
      focusAreas: "Sample Exploration Focus Areas",
      dosHeader: "Supportive Parenting Practices (DOs)",
      dontsHeader: "Practices to Avoid (DON'Ts)",
      conversationStartersHeader: "Empathetic Conversation Starters",
      supportiveActionsHeader: "Recommended Home & Classroom Support Actions",
    },
    parentGuidance: {
      summary: "Your child possesses unique cognitive instincts and natural curiosity patterns. The best approach is to provide rich, pressure-free opportunities to experiment, build, and explore without imposing premature career labels.",
      dos: [
        "Celebrate effort, creative experimentation, and resilience rather than just final grades.",
        "Provide access to books, hobby kits, coding tools, and community clubs aligned with their natural curiosity.",
        "Encourage collaborative projects where they can learn alongside peers with diverse interests.",
        "Listen actively when they explain how they solved a complex problem or designed a project.",
      ],
      donts: [
        "Do not declare definitive career choices (e.g. 'You must become an engineer'). Keep doors open.",
        "Avoid comparing your child's learning pace or interest profile to siblings or peers.",
        "Do not discourage emerging interests even if they seem unconventional or exploratory.",
        "Avoid turning exploratory hobbies into high-pressure competitive tasks.",
      ],
      conversations: [
        "What was the most exciting or surprising challenge you tackled this week?",
        "If you could design a new invention to solve any daily problem, what would it do?",
        "Which project did you enjoy working on the most recently, and what made it fun?",
      ],
      supportActions: [
        "Visit local science centers, makerspaces, art galleries, and technology exhibitions together.",
        "Establish a dedicated workspace at home with accessible stationery, building blocks, and tools.",
        "Schedule regular informal check-ins to discuss their learning discoveries without judgment.",
      ],
    },
  },

  ml: {
    reportTitle: "സ്കിൽ ഫൈൻഡർ സൈക്കോമെട്രിക് മൂല്യനിർണ്ണയ റിപ്പോർട്ട്",
    reportSubtitle: "നിങ്ങളുടെ സവിശേഷമായ കഴിവുകൾ, താൽപ്പര്യങ്ങൾ, പഠന രീതികൾ എന്നിവ കണ്ടെത്തുന്നു",
    confidentialNotice: "രഹസ്യസ്വഭാവമുള്ളത് — വിദ്യാർത്ഥിക്കും മാതാപിതാക്കൾക്കും അംഗീകൃത കൗൺസിലർമാർക്കും മാത്രമുള്ളത്.",
    sections: {
      studentProfile: "1. വിദ്യാർത്ഥി വിവരങ്ങൾ",
      profileSummary: "2. ലേണിംഗ് പ്രൊഫൈൽ സംഗ്രഹം",
      interestProfile: "3. താൽപ്പര്യങ്ങളുടെ വിശകലനം (RIASEC)",
      skillBehaviour: "4. നൈപുണ്യ സ്വഭാവ സൂചകങ്ങൾ",
      aptitudeInsights: "5. ബുദ്ധിപരവും പ്രശ്നപരിഹാരവുമായ കഴിവുകൾ",
      developmentalStrengths: "6. വികസന ശക്തികളും പഠന ശീലങ്ങളും",
      explorationAreas: "7. പര്യവേക്ഷണ മേഖലകളും പ്രോജക്ടുകളും",
      parentGuidance: "8. മാതാപിതാക്കൾക്കും അധ്യാപകർക്കുമുള്ള മാർഗ്ഗനിർദ്ദേശം",
    },
    labels: {
      name: "വിദ്യാർത്ഥിയുടെ പേര്",
      age: "പ്രായം",
      grade: "ക്ലാസ്സ് / ഗ്രേഡ്",
      institution: "സ്കൂൾ / സ്ഥാപനം",
      assessment: "മൂല്യനിർണ്ണയം",
      completedDate: "പൂർത്തിയാക്കിയ തീയതി",
      reportId: "റിപ്പോർട്ട് ഐഡി",
      archetypeLabel: "പ്രധാന ലേണിംഗ് പ്രൊഫൈൽ",
      strongAreas: "ശക്തമായ കഴിവുകൾ",
      developmentAreas: "കൂടുതൽ മെച്ചപ്പെടുത്താവുന്ന മേഖലകൾ",
      overallAccuracy: "മൊത്തത്തിലുള്ള കൃത്യത",
      keyLearningHabits: "വളർത്തിയെടുക്കേണ്ട നല്ല ശീലങ്ങൾ",
      explorationDisclaimer: "ശ്രദ്ധിക്കുക: ഇത് താൽപ്പര്യങ്ങൾ തിരിച്ചറിയാനുള്ള പര്യവേക്ഷണ മേഖലകളാണ്; അന്തിമ കരിയർ തീരുമാനമല്ല.",
      recommendedActivities: "ശുപാർശ ചെയ്യുന്ന പ്രായോഗിക പ്രവർത്തനങ്ങൾ",
      focusAreas: "പ്രധാന ശ്രദ്ധാകേന്ദ്രങ്ങൾ",
      dosHeader: "പ്രോത്സാഹിപ്പിക്കേണ്ട നല്ല രീതികൾ",
      dontsHeader: "ഒഴിവാക്കേണ്ട കാര്യങ്ങൾ",
      conversationStartersHeader: "സഹായകരമായ ചർച്ചാ വിഷയങ്ങൾ",
      supportiveActionsHeader: "വീട്ടിലും ക്ലാസിലും നൽകാവുന്ന പിന്തുണ",
    },
    parentGuidance: {
      summary: "നിങ്ങളുടെ കുട്ടിക്ക് സവിശേഷമായ ചിന്താശേഷിയും സ്വാഭാവിക ജിജ്ഞാസയുമുണ്ട്. അമിത സമ്മർദ്ദമില്ലാതെ പുതിയ കാര്യങ്ങൾ പഠിക്കാനും പരീക്ഷണങ്ങൾ നടത്താനുമുള്ള അവസരങ്ങൾ ഒരുക്കുകയാണ് പ്രധാനം.",
      dos: [
        "മാർക്കുകളേക്കാൾ അവരുടെ കഠിനാധ്വാനത്തെയും പുതിയ പരീക്ഷണങ്ങളെയും അഭിനന്ദിക്കുക.",
        "അവരുടെ സ്വാഭാവിക താൽപ്പര്യങ്ങൾക്ക് അനുയോജ്യമായ പുസ്തകങ്ങളും ശാസ്ത്ര ഉപകരണങ്ങളും ലഭ്യമാക്കുക.",
        "സഹപാഠികളുമായി ഒത്തുചേർന്ന് പ്രോജക്ടുകൾ ചെയ്യാൻ പ്രോത്സാഹിപ്പിക്കുക.",
        "ഒരു പ്രശ്നം അവർ എങ്ങനെ പരിഹരിച്ചു എന്ന് വിശദീകരിക്കുമ്പോൾ ക്ഷമയോടെ കേൾക്കുക.",
      ],
      donts: [
        "കുട്ടികൾ ഇന്ന ജോലി തന്നെ തിരഞ്ഞെടുക്കണം എന്ന് മുൻകൂട്ടി നിർബന്ധിക്കരുത്.",
        "മറ്റ് കുട്ടികളുമായോ സഹോദരങ്ങളുമായോ ഒരിക്കലും താരതമ്യം ചെയ്യരുത്.",
        "അവരുടെ പുതിയ താൽപ്പര്യങ്ങളെ നിരുത്സാഹപ്പെടുത്തരുത്.",
        "പഠനത്തോടൊപ്പമുള്ള വിനോദങ്ങളെ കടുത്ത മത്സരമാക്കരുത്.",
      ],
      conversations: [
        "ഈ ആഴ്ച നിന്നെ ഏറ്റവും അത്ഭുതപ്പെടുത്തിയ പുതിയ കാര്യം എന്തായിരുന്നു?",
        "ഏതെങ്കിലും ഒരു പ്രശ്നം പരിഹരിക്കാൻ ഒരു പുതിയ ഉപകരണം ഉണ്ടാക്കുകയാണെങ്കിൽ നീ എന്താണ് ഉണ്ടാക്കുക?",
        "അടുത്തിടെ നീ ചെയ്തതിൽ ഏറ്റവും സന്തോഷം നൽകിയ പ്രോജക്റ്റ് ഏതാണ്?",
      ],
      supportActions: [
        "സയൻസ് സെന്ററുകൾ, പ്ലാനറ്റോറിയം, സാങ്കേതിക എക്സിബിഷനുകൾ എന്നിവ സന്ദർശിക്കുക.",
        "വീട്ടിൽ ക്രിയാത്മകമായി കാര്യങ്ങൾ നിർമ്മിക്കാൻ ആവശ്യമായ സൗകര്യങ്ങൾ നൽകുക.",
        "പഠന കാര്യങ്ങളെക്കുറിച്ച് സമ്മർദ്ദമില്ലാതെ ദിവസവും സംസാരിക്കുക.",
      ],
    },
  },

  hi: {
    reportTitle: "स्किल फाइंडर साइकोमेट्रिक असेसमेंट रिपोर्ट",
    reportSubtitle: "आपकी विशिष्ट क्षमताओं, रुचियों और सीखने की शैलियों की खोज",
    confidentialNotice: "गोपनीय — केवल छात्र, अभिभावक और अधिकृत काउंसलर के मार्गदर्शन हेतु।",
    sections: {
      studentProfile: "1. छात्र विवरण एवं मूल्यांकन संदर्भ",
      profileSummary: "2. मुख्य लर्निंग प्रोफाइल सारांश",
      interestProfile: "3. रुचि एवं रुझान विश्लेषण (RIASEC)",
      skillBehaviour: "4. कौशल व्यवहार एवं क्षमता संकेतक",
      aptitudeInsights: "5. बौद्धिक क्षमता एवं समस्या समाधान",
      developmentalStrengths: "6. विकासात्मक क्षमताएं एवं अध्ययन आदतें",
      explorationAreas: "7. अनुशंसित अन्वेषण क्षेत्र एवं परियोजनाएं",
      parentGuidance: "8. माता-पिता एवं शिक्षकों के लिए मार्गदर्शन",
    },
    labels: {
      name: "छात्र का नाम",
      age: "आयु",
      grade: "कक्षा / ग्रेड",
      institution: "विद्यालय / संस्थान",
      assessment: "असेसमेंट का नाम",
      completedDate: "पूर्ण होने की तिथि",
      reportId: "रिपोर्ट आईडी",
      archetypeLabel: "प्रमुख लर्निंग आर्केटाइप",
      strongAreas: "मजबूत क्षमताएं",
      developmentAreas: "विकास के संभावित अवसर",
      overallAccuracy: "कुल कार्य सटीकता",
      keyLearningHabits: "सकारात्मक अध्ययन आदतें",
      explorationDisclaimer: "महत्वपूर्ण नोट: ये केवल सीखने और अन्वेषण के क्षेत्र हैं, कोई अंतिम करियर निर्णय नहीं।",
      recommendedActivities: "सुझाए गए व्यावहारिक प्रोजेक्ट",
      focusAreas: "प्रमुख अन्वेषण क्षेत्र",
      dosHeader: "सकारात्मक अभिभावकीय दृष्टिकोण (क्या करें)",
      dontsHeader: "बचने योग्य बातें (क्या न करें)",
      conversationStartersHeader: "प्रेरक बातचीत के विषय",
      supportiveActionsHeader: "घर और विद्यालय में आवश्यक सहायता",
    },
    parentGuidance: {
      summary: "आपके बच्चे में अनूठी बौद्धिक जिज्ञासा और स्वाभाविक सीखने की क्षमता है। बिना किसी दबाव के उसे नए अनुभव और प्रयोग करने का अवसर प्रदान करें।",
      dos: [
        "केवल अंकों के बजाय बच्चे के प्रयासों, रचनात्मकता और लगन की सराहना करें।",
        "उनकी रुचियों के अनुसार पुस्तकें, साइंस किट और व्यावहारिक उपकरण उपलब्ध कराएं।",
        "सहपाठियों के साथ मिलकर ग्रुप प्रोजेक्ट करने के लिए प्रोत्साहित करें।",
        "जब बच्चा अपनी किसी खोज या समाधान के बारे में बताए तो उसे ध्यानपूर्वक सुनें।",
      ],
      donts: [
        "बच्चे पर कोई निश्चित करियर विकल्प (जैसे 'इंजीनियर ही बनना है') न थोपें।",
        "भाई-बहनों या अन्य बच्चों से कभी तुलना न करें।",
        "असामान्य या नई रुचियों को कभी हतोत्साहित न करें।",
        "सीखने की गतिविधियों को अत्यधिक दबाव वाली प्रतिस्पर्धा न बनाएं।",
      ],
      conversations: [
        "इस सप्ताह तुमने कौन सी सबसे दिलचस्प या नई बात सीखी?",
        "यदि तुम्हें किसी समस्या को हल करने के लिए नई मशीन बनानी हो, तो वह क्या होगी?",
        "हाल ही में किस प्रोजेक्ट को करते समय तुम्हें सबसे अधिक आनंद आया?",
      ],
      supportActions: [
        "साइंस म्यूजियम, प्लेनेटेरियम और नवाचार प्रदर्शनियों में साथ जाएं।",
        "घर पर रचनात्मक काम और प्रयोग करने के लिए एक शांत कोना तैयार करें।",
        "बिना किसी आलोचना के नियमित रूप से सीखने पर संवाद करें।",
      ],
    },
  },

  ar: {
    reportTitle: "تقرير التقييم السيكومتري لبرنامج مستكشف المهارات (Skill Finder)",
    reportSubtitle: "اكتشاف نقاط قوتك واهتماماتك الاستكشافية وأنماطك التعليمية الفريدة",
    confidentialNotice: "سري ومحمي — مخصص حصرياً للطالب وولي الأمر والمرشد الأكاديمي المعتمد.",
    sections: {
      studentProfile: "١. ملف الطالب وسياق التقييم",
      profileSummary: "٢. الملخص التنفيذي لنمط التعلم",
      interestProfile: "٣. تحليل الميول والاهتمامات الاستكشافية (RIASEC)",
      skillBehaviour: "٤. المؤشرات السلوكية والمهارات التطبيقية",
      aptitudeInsights: "٥. القدرات الإدراكية وحل المشكلات",
      developmentalStrengths: "٦. نقاط القوة التنموية وعادات التعلم",
      explorationAreas: "٧. مجالات الاستكشاف والأنشطة المقترحة",
      parentGuidance: "٨. إرشادات أولياء الأمور والمعلمين",
    },
    labels: {
      name: "اسم الطالب",
      age: "العمر",
      grade: "الصف الدراسي",
      institution: "المدرسة / المؤسسة",
      assessment: "نوع التقييم",
      completedDate: "تاريخ التقييم",
      reportId: "معرّف التقرير",
      archetypeLabel: "النمط التعليمي الأساسي",
      strongAreas: "أبرز نقاط القوة السلوكية",
      developmentAreas: "مجالات النمو الواعدة",
      overallAccuracy: "دقة الأداء الإجمالية",
      keyLearningHabits: "عادات تعليمية إيجابية",
      explorationDisclaimer: "ملاحظة هامة: هذه المجالات تمثل مسارات استكشافية قائمة على الفضول المعرفي وليست قرارات مهنية نهائية.",
      recommendedActivities: "الأنشطة والمشاريع التطبيقية المقترحة",
      focusAreas: "مجالات التركيز الاستكشافية",
      dosHeader: "الممارسات الإيجابية الداعمة (افعل)",
      dontsHeader: "الممارسات الواجب تجنبها (لا تفعل)",
      conversationStartersHeader: "مواضيع حوارية ملهمة",
      supportiveActionsHeader: "خطوات الدعم المنزلي والمدرسي",
    },
    parentGuidance: {
      summary: "يمتلك طفلك قدرات ذهنية وشغفاً استكشافياً مميزاً. الدعم الأفضل يتمثل في توفير بيئة تعليمية غنية ومحفزة خالية من الضغوط أو الأحكام المسبقة.",
      dos: [
        "الاحتفاء بالمجهود والمحاولات الإبداعية والمثابرة بدلاً من التركيز فقط على الدرجات النهائية.",
        "توفير الكتب والأدوات التعليمية والتطبيقات التي تلبي شغفه المعرفي.",
        "تشجيعه على التعاون والعمل الجماعي مع أقرانه في المشاريع المتنوعة.",
        "الاستماع باهتمام عندما يشرح كيف توصل إلى حل مسألة معقدة أو ابتكار جديد.",
      ],
      donts: [
        "تجنب حصر مستقبل الطالب في مسار مهني واحد مبكراً.",
        "تجنب مقارنة تقدمه الدراسي مع إخوته أو أقرانه.",
        "عدم التقليل من أهمية أي اهتمام معرفي جديد يبديه الطالب.",
        "تجنب تحويل الهوايات الاستكشافية إلى مهام تنافسية مرهقة.",
      ],
      conversations: [
        "ما هو أكثر تحدٍ ممتع واجهته وتغلبت عليه هذا الأسبوع؟",
        "لو أتيحت لك الفرصة لابتكار جهاز يحل مشكلة يومية، فماذا سيكون؟",
        "ما هو المشروع الذي استمتعت بالعمل عليه مؤخراً ولماذا؟",
      ],
      supportActions: [
        "زيارة المتاحف العلمية والمراكز الاستكشافية والمعارض التقنية معاً.",
        "تخصيص مساحة مريحة ومجهزة في المنزل لتشجيع الابتكار والتفكير الإبداعي.",
        "إجراء جلسات حوارية ودية ومنتظمة لمناقشة تجاربه واكتشافاته بحرية.",
      ],
    },
  },

  ta: {
    reportTitle: "ஸ்கில் ஃபைண்டர் உளவியல் மதிப்பீட்டு அறிக்கை",
    reportSubtitle: "உங்கள் தனித்துவமான திறன்கள், ஆர்வங்கள் மற்றும் கற்றல் பாணிகளை கண்டறிதல்",
    confidentialNotice: "ரகசியமானது — மாணவர், பெற்றோர் மற்றும் கல்வி ஆலோசகருக்கு மட்டுமே.",
    sections: {
      studentProfile: "1. மாணவர் சுயவிவரம்",
      profileSummary: "2. கற்றல் சுயவிவர சுருக்கம்",
      interestProfile: "3. ஆர்வங்கள் மதிப்பீடு (RIASEC)",
      skillBehaviour: "4. திறன் நடத்தை குறிகாட்டிகள்",
      aptitudeInsights: "5. அறிவாற்றல் மற்றும் சிக்கல் தீர்க்கும் திறன்",
      developmentalStrengths: "6. வளர்ச்சி பலங்கள் மற்றும் கற்றல் பழக்கங்கள்",
      explorationAreas: "7. பரிந்துரைக்கப்பட்ட ஆய்வு பகுதிகள்",
      parentGuidance: "8. பெற்றோர்கள் மற்றும் ஆசிரியர்களுக்கான வழிகாட்டுதல்",
    },
    labels: {
      name: "மாணவர் பெயர்",
      age: "வயது",
      grade: "வகுப்பு / தரம்",
      institution: "பள்ளி / நிறுவனம்",
      assessment: "மதிப்பீடு",
      completedDate: "முடித்த தேதி",
      reportId: "அறிக்கை எண்",
      archetypeLabel: "முதன்மை கற்றல் வடிவம்",
      strongAreas: "வலுவான திறன்கள்",
      developmentAreas: "மேம்படுத்த வேண்டிய பகுதிகள்",
      overallAccuracy: "ஒட்டுமொத்த துல்லியம்",
      keyLearningHabits: "வளர்க்க வேண்டிய நல்ல பழக்கங்கள்",
      explorationDisclaimer: "குறிப்பு: இவை மாணவரின் ஆர்வத்தை கண்டறியும் ஆய்வுப் பகுதிகள்; இறுதி தொழில் முடிவு அல்ல.",
      recommendedActivities: "பரிந்துரைக்கப்பட்ட செயல்பாடுகள்",
      focusAreas: "முக்கிய ஆய்வு பகுதிகள்",
      dosHeader: "ஊக்கப்படுத்த வேண்டிய அணுகுமுறைகள்",
      dontsHeader: "தவிர்க்க வேண்டிய அணுகுமுறைகள்",
      conversationStartersHeader: "ஆக்கபூர்வமான உரையாடல் தலைப்புகள்",
      supportiveActionsHeader: "வீட்டிலும் பள்ளியிலும் அளிக்கக்கூடிய ஆதரவு",
    },
    parentGuidance: {
      summary: "உங்கள் குழந்தை தனித்துவமான சிந்தனை மற்றும் அறிவாற்றல் அமைப்பைக் கொண்டுள்ளது. அதிக அழுத்தம் தராமல் புதிய விஷயங்களை ஆராய வாய்ப்பளிப்பதே சிறந்தது.",
      dos: [
        "மதிப்பெண்களை விட அவர்களின் முயற்சி மற்றும் புதுமை படைக்கும் திறனைப் பாராட்டுங்கள்.",
        "அவர்களின் இயல்பான ஆர்வத்திற்கு ஏற்ற புத்தகங்கள் மற்றும் ஆய்வு கருவிகளை வழங்குங்கள்.",
        "சக மாணவர்களுடன் இணைந்து திட்டங்களைச் செய்ய ஊக்குவிக்கவும்.",
      ],
      donts: [
        "குழந்தையின் மீது குறிப்பிட்ட தொழில் தேர்வுகளை முன்கூட்டியே திணிக்காதீர்கள்.",
        "பிற குழந்தைகளுடனோ உடன்பிறப்புகளுடனோ ஒப்பிடாதீர்கள்.",
      ],
      conversations: [
        "இந்த வாரம் நீ கற்றுக்கொண்டதில் மிகவும் ஆச்சரியமான விஷயம் என்ன?",
        "ஒரு சிக்கலைத் தீர்க்க புதிய கருவியை உருவாக்கினால், அது என்னவாக இருக்கும்?",
      ],
      supportActions: [
        "அறிவியல் மையங்கள் மற்றும் கண்காட்சிகளுக்கு அழைத்துச் செல்லுங்கள்.",
        "சுதந்திரமாக சிந்திக்கவும் புதியவற்றை உருவாக்கவும் ஏற்ற சூழலை வீட்டில் அமையுங்கள்.",
      ],
    },
  },

  kn: {
    reportTitle: "ಸ್ಕಿಲ್ ಫೈಂಡರ್ ಸೈಕೋಮೆಟ್ರಿಕ್ ಮೌಲ್ಯಮಾಪನ ವರದಿ",
    reportSubtitle: "ನಿಮ್ಮ ವಿಶಿಷ್ಟ ಸಾಮರ್ಥ್ಯಗಳು, ಆಸಕ್ತಿಗಳು ಮತ್ತು ಕಲಿಕೆಯ ಶೈಲಿಗಳನ್ನು ಕಂಡುಕೊಳ್ಳುವುದು",
    confidentialNotice: "ಗೌಪ್ಯ — ವಿದ್ಯಾರ್ಥಿ, ಪೋಷಕರು ಮತ್ತು ಅಧಿಕೃತ ಸಲಹೆಗಾರರಿಗೆ ಮಾತ್ರ.",
    sections: {
      studentProfile: "1. ವಿದ್ಯಾರ್ಥಿ ವಿವರ",
      profileSummary: "2. ಕಲಿಕೆಯ ಪ್ರೊಫೈಲ್ ಸಾರಾಂಶ",
      interestProfile: "3. ಆಸಕ್ತಿಗಳ ವಿಶ್ಲೇಷಣೆ (RIASEC)",
      skillBehaviour: "4. ಕೌಶಲ್ಯ ನಡವಳಿಕೆ ಸೂಚಕಗಳು",
      aptitudeInsights: "5. ಬೌದ್ಧಿಕ ಸಾಮರ್ಥ್ಯ ಮತ್ತು ಸಮಸ್ಯೆ ಪರಿಹಾರ",
      developmentalStrengths: "6. ಬೆಳವಣಿಗೆಯ ಸಾಮರ್ಥ್ಯಗಳು ಮತ್ತು ಕಲಿಕೆಯ ಅಭ್ಯಾಸಗಳು",
      explorationAreas: "7. ಶಿಫಾರಸು ಮಾಡಿದ ಅನ್ವೇಷಣಾ ಕ್ಷೇತ್ರಗಳು",
      parentGuidance: "8. ಪೋಷಕರು ಮತ್ತು ಶಿಕ್ಷಕರಿಗೆ ಮಾರ್ಗದರ್ಶನ",
    },
    labels: {
      name: "ವಿದ್ಯಾರ್ಥಿಯ ಹೆಸರು",
      age: "ವಯಸ್ಸು",
      grade: "ತರಗತಿ / ಗ್ರೇಡ್",
      institution: "ಶಾಲೆ / ಸಂಸ್ಥೆ",
      assessment: "ಮೌಲ್ಯಮಾಪನ",
      completedDate: "ಪೂರ್ಣಗೊಂಡ ದಿನಾಂಕ",
      reportId: "ವರದಿ ಐಡಿ",
      archetypeLabel: "ಮುಖ್ಯ ಕಲಿಕೆಯ ಶೈಲಿ",
      strongAreas: "ಪ್ರಬಲ ಸಾಮರ್ಥ್ಯಗಳು",
      developmentAreas: "ಸುಧಾರಣೆಯ ಅವಕಾಶಗಳು",
      overallAccuracy: "ಒಟ್ಟಾರೆ ನಿಖರತೆ",
      keyLearningHabits: "ಬೆಳೆಸಿಕೊಳ್ಳಬೇಕಾದ ಉತ್ತಮ ಅಭ್ಯಾಸಗಳು",
      explorationDisclaimer: "ಗಮನಿಸಿ: ಇವು ಆಸಕ್ತಿಗಳನ್ನು ತಿಳಿಯುವ ಅನ್ವೇಷಣಾ ಕ್ಷೇತ್ರಗಳಾಗಿದ್ದು, ಅಂತಿಮ ವೃತ್ತಿ ನಿರ್ಧಾರವಲ್ಲ.",
      recommendedActivities: "ಶಿಫಾರಸು ಮಾಡಿದ ಪ್ರಾಯೋಗಿಕ ಚಟುವಟಿಕೆಗಳು",
      focusAreas: "ಪ್ರಮುಖ ಗಮನ ಕ್ಷೇತ್ರಗಳು",
      dosHeader: "ಮಾಡಬೇಕಾದ ಸಕಾರಾತ್ಮಕ ಕಾರ್ಯಗಳು",
      dontsHeader: "ಮಾಡಬಾರದ ಕಾರ್ಯಗಳು",
      conversationStartersHeader: "ಉಪಯುಕ್ತ ಸಂಭಾಷಣಾ ವಿಷಯಗಳು",
      supportiveActionsHeader: "ಮನೆ ಮತ್ತು ಶಾಲೆಯಲ್ಲಿ ನೀಡಬಹುದಾದ ಬೆಂಬಲ",
    },
    parentGuidance: {
      summary: "ನಿಮ್ಮ ಮಗು ವಿಶಿಷ್ಟ ಬೌದ್ಧಿಕ ಸಾಮರ್ಥ್ಯ ಮತ್ತು ನೈಸರ್ಗಿಕ ಜಿಜ್ಞಾಸೆಯನ್ನು ಹೊಂದಿದೆ. ಒತ್ತಡವಿಲ್ಲದೆ ಹೊಸ ವಿಷಯಗಳನ್ನು ಅನ್ವೇಷಿಸಲು ಪ್ರೋತ್ಸಾಹಿಸುವುದು ಅತ್ಯಂತ ಮುಖ್ಯ.",
      dos: [
        "ಅಂಕಗಳಿಗಿಂತ ಹೆಚ್ಚಾಗಿ ಅವರ ಪ್ರಯತ್ನ, ಸೃಜನಶೀಲತೆ ಮತ್ತು ಪರಿಶ್ರಮವನ್ನು ಪ್ರಶಂಸಿಸಿ.",
        "ಅವರ ಆಸಕ್ತಿಗೆ ತಕ್ಕಂತೆ ಪುಸ್ತಕಗಳು ಮತ್ತು ವೈಜ್ಞಾನಿಕ ಕಿಟ್‌ಗಳನ್ನು ಒದಗಿಸಿ.",
        "ಸಹಪಾಠಿಗಳೊಂದಿಗೆ ಕೂಡಿ ಕೆಲಸ ಮಾಡಲು ಪ್ರೋತ್ಸಾಹಿಸಿ.",
      ],
      donts: [
        "ನಿರ್ದಿಷ್ಟ ವೃತ್ತಿ ಆಯ್ಕೆಯನ್ನು ಮಗುವಿನ ಮೇಲೆ ಬಲವಂತವಾಗಿ ಹೇರಬೇಡಿ.",
        "ಇತರ ಮಕ್ಕಳೊಂದಿಗೆ ಅಥವಾ ಒಡಹುಟ್ಟಿದವರೊಂದಿಗೆ ಎಂದಿಗೂ ಹೋಲಿಸಬೇಡಿ.",
      ],
      conversations: [
        "ಈ ವಾರ ನೀನು ಕಲಿತ ಅತ್ಯಂತ ಆಸಕ್ತಿದಾಯಕ ವಿಷಯ ಯಾವುದು?",
        "ಒಂದು ಸಮಸ್ಯೆಯನ್ನು ಪರಿಹರಿಸಲು ಹೊಸ ಯಂತ್ರವನ್ನು ರೂಪಿಸಿದರೆ ಅದು ಹೇಗಿರುತ್ತದೆ?",
      ],
      supportActions: [
        "ವಿಜ್ಞಾನ ಕೇಂದ್ರಗಳು, ತಾರಾಲಯ ಮತ್ತು ಪ್ರದರ್ಶನಗಳಿಗೆ ಭೇಟಿ ನೀಡಿ.",
        "ಮನೆಯಲ್ಲಿ ಸೃಜನಾತ್ಮಕವಾಗಿ ಕಲಿಯಲು ಪ್ರಶಾಂತ ವಾತಾವರಣವನ್ನು ಸೃಷ್ಟಿಸಿ.",
      ],
    },
  },
};

/**
 * Helper to resolve report translations with English fallback.
 */
export function getReportTranslation(languageCode = "en"): ReportI18nDictionary {
  const code = (languageCode || "en").toLowerCase().trim();
  return REPORT_TRANSLATIONS[code] || REPORT_TRANSLATIONS.en;
}
