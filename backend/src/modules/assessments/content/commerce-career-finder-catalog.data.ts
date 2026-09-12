export interface AssessmentSectionCatalogItem {
  code: string;
  name: string;
  description: string;
  displayOrder: number;
  weight?: number;
}

export interface AssessmentDimensionCatalogItem {
  code: string;
  sectionCode: string;
  name: string;
  description: string;
  displayOrder: number;
}

export interface AssessmentOptionCatalogItem {
  optionKey: string;
  optionText: string;
  scoreValue: number;
  displayOrder: number;
  metadata?: Record<string, any>;
}

export interface AssessmentQuestionCatalogItem {
  code: string;
  sectionCode: string;
  dimensionCode?: string;
  questionType: string;
  questionText: string;
  displayOrder: number;
  isMandatory: boolean;
  scoringMethod: string;
  options: AssessmentOptionCatalogItem[];
}

export interface CommerceCareerFamilyDefinition {
  code: string;
  name: string;
  suggestedPathways: string;
  exampleAreas: string;
  counsellingNote: string;
}

export const COMMERCE_CAREER_FAMILIES: CommerceCareerFamilyDefinition[] = [
  {
    code: "ACCOUNTING_AUDIT_TAX",
    name: "Accounting, Audit & Tax",
    suggestedPathways: "Accounting, Audit, Tax, Financial Control, Compliance",
    exampleAreas: "CA, ACCA, CMA, Audit, Taxation, Financial Reporting, Internal Audit",
    counsellingNote: "Explore comfort with accuracy, structured work, regulation, documentation and ethical responsibility."
  },
  {
    code: "FINANCE_INVESTMENT_BANKING",
    name: "Finance, Investment & Banking",
    suggestedPathways: "Corporate Finance, Banking, Investment, Treasury, Risk",
    exampleAreas: "CFA, Investment Banking, Commercial Banking, Wealth Management, Treasury, Credit, Risk",
    counsellingNote: "Explore numerical reasoning, markets, risk-return thinking, decision-making and tolerance for uncertainty."
  },
  {
    code: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP",
    name: "Business, Management & Entrepreneurship",
    suggestedPathways: "Management, Consulting, Entrepreneurship, Operations, Sales, Marketing, HR",
    exampleAreas: "BBA, MBA pathways, Entrepreneurship, Consulting, Sales, Marketing, HR, Operations",
    counsellingNote: "Explore leadership, communication, initiative, customer understanding, execution and organizational interest."
  },
  {
    code: "ECONOMICS_ANALYTICS_FINTECH",
    name: "Economics, Analytics & FinTech",
    suggestedPathways: "Economics, Business Analytics, FinTech, Data-driven Finance",
    exampleAreas: "Economics, Statistics, Business Analytics, FinTech, Financial Data Analysis, Product Analytics",
    counsellingNote: "Explore data reasoning, technology comfort, forecasting, evidence-based decisions and interest in systems."
  }
];

export const COMMERCE_CAREER_FINDER_SECTIONS: AssessmentSectionCatalogItem[] = [
  {
    code: "SEC_FIN_NUM",
    name: "Financial & Numerical Reasoning",
    description: "Evaluates ability to work with numbers, accounts, budgets, and numerical analysis.",
    displayOrder: 1,
    weight: 1.0,
  },
  {
    code: "SEC_COMM_INT",
    name: "Commercial Interest",
    description: "Evaluates interest in commerce, business trends, market mechanisms, and transactions.",
    displayOrder: 2,
    weight: 1.0,
  },
  {
    code: "SEC_ANAL_DATA",
    name: "Analytical & Data Orientation",
    description: "Evaluates comfort in interpreting financial data, charts, ratios, and finding patterns.",
    displayOrder: 3,
    weight: 1.0,
  },
  {
    code: "SEC_ENTR_LEAD",
    name: "Entrepreneurial & Leadership Orientation",
    description: "Evaluates drive to start ventures, lead teams, innovate, and make managerial decisions.",
    displayOrder: 4,
    weight: 1.0,
  },
  {
    code: "SEC_COMM_NEG",
    name: "Communication & Negotiation",
    description: "Evaluates skills in persuasive communication, stakeholder negotiation, and presenting proposals.",
    displayOrder: 5,
    weight: 1.0,
  },
  {
    code: "SEC_DET_ETH",
    name: "Detail, Ethics & Risk Orientation",
    description: "Evaluates diligence in compliance, ethical conduct, error checking, and risk management.",
    displayOrder: 6,
    weight: 1.0,
  },
  {
    code: "SEC_CAR_SCEN",
    name: "Career Scenario Choice",
    description: "Evaluates practical preferences among simulated commerce and business scenarios.",
    displayOrder: 7,
    weight: 1.0,
  }
];

export const COMMERCE_CAREER_FINDER_DIMENSIONS: AssessmentDimensionCatalogItem[] = [
  {
    code: "DIM_FIN_NUM",
    sectionCode: "SEC_FIN_NUM",
    name: "Financial & Numerical Reasoning",
    description: "Working with accounts, numerical calculations, budgets, and balance sheets.",
    displayOrder: 1,
  },
  {
    code: "DIM_COMM_INT",
    sectionCode: "SEC_COMM_INT",
    name: "Commercial Interest",
    description: "Interest in business systems, trading, market operations, and consumer behavior.",
    displayOrder: 2,
  },
  {
    code: "DIM_ANAL_DATA",
    sectionCode: "SEC_ANAL_DATA",
    name: "Analytical & Data Orientation",
    description: "Interpreting tables, trend forecasting, quantitative models, and business analytics.",
    displayOrder: 3,
  },
  {
    code: "DIM_ENTR_LEAD",
    sectionCode: "SEC_ENTR_LEAD",
    name: "Entrepreneurial & Leadership Orientation",
    description: "Taking initiative, organizing resources, venture building, and guiding team outcomes.",
    displayOrder: 4,
  },
  {
    code: "DIM_COMM_NEG",
    sectionCode: "SEC_COMM_NEG",
    name: "Communication & Negotiation",
    description: "Client relations, deal negotiation, pitch presentations, and consensus building.",
    displayOrder: 5,
  },
  {
    code: "DIM_DET_ETH",
    sectionCode: "SEC_DET_ETH",
    name: "Detail, Ethics & Risk Orientation",
    description: "Auditing accuracy, ethical standards, statutory compliance, and risk containment.",
    displayOrder: 6,
  }
];

export const COMMERCE_CAREER_FINDER_QUESTIONS: AssessmentQuestionCatalogItem[] = [
  {
    code: "CCF01",
    sectionCode: "SEC_FIN_NUM",
    dimensionCode: "DIM_FIN_NUM",
    questionType: "likert_1_5",
    questionText: "I enjoy working with numbers when the goal is to understand money, costs, or financial performance.",
    displayOrder: 1,
    isMandatory: true,
    scoringMethod: "LIKERT_SCALE",
    options: [
      {
        optionKey: "1",
        optionText: "Strongly Disagree",
        scoreValue: 1,
        displayOrder: 1,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "2",
        optionText: "Disagree",
        scoreValue: 2,
        displayOrder: 2,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "3",
        optionText: "Not Sure",
        scoreValue: 3,
        displayOrder: 3,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "4",
        optionText: "Agree",
        scoreValue: 4,
        displayOrder: 4,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "5",
        optionText: "Strongly Agree",
        scoreValue: 5,
        displayOrder: 5,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
    ]
  },
  {
    code: "CCF02",
    sectionCode: "SEC_FIN_NUM",
    dimensionCode: "DIM_FIN_NUM",
    questionType: "likert_1_5",
    questionText: "I like checking whether calculations and financial figures make sense before making a decision.",
    displayOrder: 2,
    isMandatory: true,
    scoringMethod: "LIKERT_SCALE",
    options: [
      {
        optionKey: "1",
        optionText: "Strongly Disagree",
        scoreValue: 1,
        displayOrder: 1,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "2",
        optionText: "Disagree",
        scoreValue: 2,
        displayOrder: 2,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "3",
        optionText: "Not Sure",
        scoreValue: 3,
        displayOrder: 3,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "4",
        optionText: "Agree",
        scoreValue: 4,
        displayOrder: 4,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "5",
        optionText: "Strongly Agree",
        scoreValue: 5,
        displayOrder: 5,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
    ]
  },
  {
    code: "CCF03",
    sectionCode: "SEC_FIN_NUM",
    dimensionCode: "DIM_FIN_NUM",
    questionType: "likert_1_5",
    questionText: "I enjoy comparing different financial options using numbers and evidence.",
    displayOrder: 3,
    isMandatory: true,
    scoringMethod: "LIKERT_SCALE",
    options: [
      {
        optionKey: "1",
        optionText: "Strongly Disagree",
        scoreValue: 1,
        displayOrder: 1,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "2",
        optionText: "Disagree",
        scoreValue: 2,
        displayOrder: 2,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "3",
        optionText: "Not Sure",
        scoreValue: 3,
        displayOrder: 3,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "4",
        optionText: "Agree",
        scoreValue: 4,
        displayOrder: 4,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "5",
        optionText: "Strongly Agree",
        scoreValue: 5,
        displayOrder: 5,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
    ]
  },
  {
    code: "CCF04",
    sectionCode: "SEC_FIN_NUM",
    dimensionCode: "DIM_FIN_NUM",
    questionType: "likert_1_5",
    questionText: "I am comfortable interpreting tables, percentages, ratios, or basic financial information.",
    displayOrder: 4,
    isMandatory: true,
    scoringMethod: "LIKERT_SCALE",
    options: [
      {
        optionKey: "1",
        optionText: "Strongly Disagree",
        scoreValue: 1,
        displayOrder: 1,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
      {
        optionKey: "2",
        optionText: "Disagree",
        scoreValue: 2,
        displayOrder: 2,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
      {
        optionKey: "3",
        optionText: "Not Sure",
        scoreValue: 3,
        displayOrder: 3,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
      {
        optionKey: "4",
        optionText: "Agree",
        scoreValue: 4,
        displayOrder: 4,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
      {
        optionKey: "5",
        optionText: "Strongly Agree",
        scoreValue: 5,
        displayOrder: 5,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
    ]
  },
  {
    code: "CCF05",
    sectionCode: "SEC_FIN_NUM",
    dimensionCode: "DIM_FIN_NUM",
    questionType: "likert_1_5",
    questionText: "I like solving problems that require careful numerical reasoning rather than guessing.",
    displayOrder: 5,
    isMandatory: true,
    scoringMethod: "LIKERT_SCALE",
    options: [
      {
        optionKey: "1",
        optionText: "Strongly Disagree",
        scoreValue: 1,
        displayOrder: 1,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "2",
        optionText: "Disagree",
        scoreValue: 2,
        displayOrder: 2,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "3",
        optionText: "Not Sure",
        scoreValue: 3,
        displayOrder: 3,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "4",
        optionText: "Agree",
        scoreValue: 4,
        displayOrder: 4,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "5",
        optionText: "Strongly Agree",
        scoreValue: 5,
        displayOrder: 5,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
    ]
  },
  {
    code: "CCF06",
    sectionCode: "SEC_FIN_NUM",
    dimensionCode: "DIM_FIN_NUM",
    questionType: "likert_1_5",
    questionText: "I enjoy tracking income, expenses, budgets, or other measurable financial information.",
    displayOrder: 6,
    isMandatory: true,
    scoringMethod: "LIKERT_SCALE",
    options: [
      {
        optionKey: "1",
        optionText: "Strongly Disagree",
        scoreValue: 1,
        displayOrder: 1,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "2",
        optionText: "Disagree",
        scoreValue: 2,
        displayOrder: 2,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "3",
        optionText: "Not Sure",
        scoreValue: 3,
        displayOrder: 3,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "4",
        optionText: "Agree",
        scoreValue: 4,
        displayOrder: 4,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "5",
        optionText: "Strongly Agree",
        scoreValue: 5,
        displayOrder: 5,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
    ]
  },
  {
    code: "CCF07",
    sectionCode: "SEC_FIN_NUM",
    dimensionCode: "DIM_FIN_NUM",
    questionType: "likert_1_5",
    questionText: "I can stay focused when a task requires several steps of calculation and checking.",
    displayOrder: 7,
    isMandatory: true,
    scoringMethod: "LIKERT_SCALE",
    options: [
      {
        optionKey: "1",
        optionText: "Strongly Disagree",
        scoreValue: 1,
        displayOrder: 1,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "2",
        optionText: "Disagree",
        scoreValue: 2,
        displayOrder: 2,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "3",
        optionText: "Not Sure",
        scoreValue: 3,
        displayOrder: 3,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "4",
        optionText: "Agree",
        scoreValue: 4,
        displayOrder: 4,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "5",
        optionText: "Strongly Agree",
        scoreValue: 5,
        displayOrder: 5,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
    ]
  },
  {
    code: "CCF08",
    sectionCode: "SEC_FIN_NUM",
    dimensionCode: "DIM_FIN_NUM",
    questionType: "likert_1_5",
    questionText: "I like identifying numerical patterns that can help explain a business situation.",
    displayOrder: 8,
    isMandatory: true,
    scoringMethod: "LIKERT_SCALE",
    options: [
      {
        optionKey: "1",
        optionText: "Strongly Disagree",
        scoreValue: 1,
        displayOrder: 1,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
      {
        optionKey: "2",
        optionText: "Disagree",
        scoreValue: 2,
        displayOrder: 2,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
      {
        optionKey: "3",
        optionText: "Not Sure",
        scoreValue: 3,
        displayOrder: 3,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
      {
        optionKey: "4",
        optionText: "Agree",
        scoreValue: 4,
        displayOrder: 4,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
      {
        optionKey: "5",
        optionText: "Strongly Agree",
        scoreValue: 5,
        displayOrder: 5,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
    ]
  },
  {
    code: "CCF09",
    sectionCode: "SEC_FIN_NUM",
    dimensionCode: "DIM_FIN_NUM",
    questionType: "likert_1_5",
    questionText: "I enjoy deciding between alternatives by comparing their financial consequences.",
    displayOrder: 9,
    isMandatory: true,
    scoringMethod: "LIKERT_SCALE",
    options: [
      {
        optionKey: "1",
        optionText: "Strongly Disagree",
        scoreValue: 1,
        displayOrder: 1,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "2",
        optionText: "Disagree",
        scoreValue: 2,
        displayOrder: 2,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "3",
        optionText: "Not Sure",
        scoreValue: 3,
        displayOrder: 3,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "4",
        optionText: "Agree",
        scoreValue: 4,
        displayOrder: 4,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "5",
        optionText: "Strongly Agree",
        scoreValue: 5,
        displayOrder: 5,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
    ]
  },
  {
    code: "CCF10",
    sectionCode: "SEC_FIN_NUM",
    dimensionCode: "DIM_FIN_NUM",
    questionType: "likert_1_5",
    questionText: "I feel satisfied when I can make a complex financial idea clear using numbers.",
    displayOrder: 10,
    isMandatory: true,
    scoringMethod: "LIKERT_SCALE",
    options: [
      {
        optionKey: "1",
        optionText: "Strongly Disagree",
        scoreValue: 1,
        displayOrder: 1,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "2",
        optionText: "Disagree",
        scoreValue: 2,
        displayOrder: 2,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "3",
        optionText: "Not Sure",
        scoreValue: 3,
        displayOrder: 3,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "4",
        optionText: "Agree",
        scoreValue: 4,
        displayOrder: 4,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "5",
        optionText: "Strongly Agree",
        scoreValue: 5,
        displayOrder: 5,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
    ]
  },
  {
    code: "CCF11",
    sectionCode: "SEC_COMM_INT",
    dimensionCode: "DIM_COMM_INT",
    questionType: "likert_1_5",
    questionText: "I am curious about how companies earn revenue and remain profitable.",
    displayOrder: 11,
    isMandatory: true,
    scoringMethod: "LIKERT_SCALE",
    options: [
      {
        optionKey: "1",
        optionText: "Strongly Disagree",
        scoreValue: 1,
        displayOrder: 1,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "2",
        optionText: "Disagree",
        scoreValue: 2,
        displayOrder: 2,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "3",
        optionText: "Not Sure",
        scoreValue: 3,
        displayOrder: 3,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "4",
        optionText: "Agree",
        scoreValue: 4,
        displayOrder: 4,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "5",
        optionText: "Strongly Agree",
        scoreValue: 5,
        displayOrder: 5,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
    ]
  },
  {
    code: "CCF12",
    sectionCode: "SEC_COMM_INT",
    dimensionCode: "DIM_COMM_INT",
    questionType: "likert_1_5",
    questionText: "I enjoy understanding why customers choose one product or service over another.",
    displayOrder: 12,
    isMandatory: true,
    scoringMethod: "LIKERT_SCALE",
    options: [
      {
        optionKey: "1",
        optionText: "Strongly Disagree",
        scoreValue: 1,
        displayOrder: 1,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "2",
        optionText: "Disagree",
        scoreValue: 2,
        displayOrder: 2,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "3",
        optionText: "Not Sure",
        scoreValue: 3,
        displayOrder: 3,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "4",
        optionText: "Agree",
        scoreValue: 4,
        displayOrder: 4,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "5",
        optionText: "Strongly Agree",
        scoreValue: 5,
        displayOrder: 5,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
    ]
  },
  {
    code: "CCF13",
    sectionCode: "SEC_COMM_INT",
    dimensionCode: "DIM_COMM_INT",
    questionType: "likert_1_5",
    questionText: "I like following how businesses compete, grow, and respond to market changes.",
    displayOrder: 13,
    isMandatory: true,
    scoringMethod: "LIKERT_SCALE",
    options: [
      {
        optionKey: "1",
        optionText: "Strongly Disagree",
        scoreValue: 1,
        displayOrder: 1,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
      {
        optionKey: "2",
        optionText: "Disagree",
        scoreValue: 2,
        displayOrder: 2,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
      {
        optionKey: "3",
        optionText: "Not Sure",
        scoreValue: 3,
        displayOrder: 3,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
      {
        optionKey: "4",
        optionText: "Agree",
        scoreValue: 4,
        displayOrder: 4,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
      {
        optionKey: "5",
        optionText: "Strongly Agree",
        scoreValue: 5,
        displayOrder: 5,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
    ]
  },
  {
    code: "CCF14",
    sectionCode: "SEC_COMM_INT",
    dimensionCode: "DIM_COMM_INT",
    questionType: "likert_1_5",
    questionText: "I am interested in how pricing decisions affect demand and profitability.",
    displayOrder: 14,
    isMandatory: true,
    scoringMethod: "LIKERT_SCALE",
    options: [
      {
        optionKey: "1",
        optionText: "Strongly Disagree",
        scoreValue: 1,
        displayOrder: 1,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "2",
        optionText: "Disagree",
        scoreValue: 2,
        displayOrder: 2,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "3",
        optionText: "Not Sure",
        scoreValue: 3,
        displayOrder: 3,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "4",
        optionText: "Agree",
        scoreValue: 4,
        displayOrder: 4,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "5",
        optionText: "Strongly Agree",
        scoreValue: 5,
        displayOrder: 5,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
    ]
  },
  {
    code: "CCF15",
    sectionCode: "SEC_COMM_INT",
    dimensionCode: "DIM_COMM_INT",
    questionType: "likert_1_5",
    questionText: "I enjoy thinking about what makes a product or service commercially successful.",
    displayOrder: 15,
    isMandatory: true,
    scoringMethod: "LIKERT_SCALE",
    options: [
      {
        optionKey: "1",
        optionText: "Strongly Disagree",
        scoreValue: 1,
        displayOrder: 1,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "2",
        optionText: "Disagree",
        scoreValue: 2,
        displayOrder: 2,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "3",
        optionText: "Not Sure",
        scoreValue: 3,
        displayOrder: 3,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "4",
        optionText: "Agree",
        scoreValue: 4,
        displayOrder: 4,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "5",
        optionText: "Strongly Agree",
        scoreValue: 5,
        displayOrder: 5,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
    ]
  },
  {
    code: "CCF16",
    sectionCode: "SEC_COMM_INT",
    dimensionCode: "DIM_COMM_INT",
    questionType: "likert_1_5",
    questionText: "I like discussing how a small business could attract customers and grow.",
    displayOrder: 16,
    isMandatory: true,
    scoringMethod: "LIKERT_SCALE",
    options: [
      {
        optionKey: "1",
        optionText: "Strongly Disagree",
        scoreValue: 1,
        displayOrder: 1,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "2",
        optionText: "Disagree",
        scoreValue: 2,
        displayOrder: 2,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "3",
        optionText: "Not Sure",
        scoreValue: 3,
        displayOrder: 3,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "4",
        optionText: "Agree",
        scoreValue: 4,
        displayOrder: 4,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "5",
        optionText: "Strongly Agree",
        scoreValue: 5,
        displayOrder: 5,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
    ]
  },
  {
    code: "CCF17",
    sectionCode: "SEC_COMM_INT",
    dimensionCode: "DIM_COMM_INT",
    questionType: "likert_1_5",
    questionText: "I am interested in how different departments contribute to business performance.",
    displayOrder: 17,
    isMandatory: true,
    scoringMethod: "LIKERT_SCALE",
    options: [
      {
        optionKey: "1",
        optionText: "Strongly Disagree",
        scoreValue: 1,
        displayOrder: 1,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
      {
        optionKey: "2",
        optionText: "Disagree",
        scoreValue: 2,
        displayOrder: 2,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
      {
        optionKey: "3",
        optionText: "Not Sure",
        scoreValue: 3,
        displayOrder: 3,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
      {
        optionKey: "4",
        optionText: "Agree",
        scoreValue: 4,
        displayOrder: 4,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
      {
        optionKey: "5",
        optionText: "Strongly Agree",
        scoreValue: 5,
        displayOrder: 5,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
    ]
  },
  {
    code: "CCF18",
    sectionCode: "SEC_COMM_INT",
    dimensionCode: "DIM_COMM_INT",
    questionType: "likert_1_5",
    questionText: "I enjoy observing business trends and asking what they might mean for companies.",
    displayOrder: 18,
    isMandatory: true,
    scoringMethod: "LIKERT_SCALE",
    options: [
      {
        optionKey: "1",
        optionText: "Strongly Disagree",
        scoreValue: 1,
        displayOrder: 1,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "2",
        optionText: "Disagree",
        scoreValue: 2,
        displayOrder: 2,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "3",
        optionText: "Not Sure",
        scoreValue: 3,
        displayOrder: 3,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "4",
        optionText: "Agree",
        scoreValue: 4,
        displayOrder: 4,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "5",
        optionText: "Strongly Agree",
        scoreValue: 5,
        displayOrder: 5,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
    ]
  },
  {
    code: "CCF19",
    sectionCode: "SEC_COMM_INT",
    dimensionCode: "DIM_COMM_INT",
    questionType: "likert_1_5",
    questionText: "I like learning how companies create value for customers and stakeholders.",
    displayOrder: 19,
    isMandatory: true,
    scoringMethod: "LIKERT_SCALE",
    options: [
      {
        optionKey: "1",
        optionText: "Strongly Disagree",
        scoreValue: 1,
        displayOrder: 1,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "2",
        optionText: "Disagree",
        scoreValue: 2,
        displayOrder: 2,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "3",
        optionText: "Not Sure",
        scoreValue: 3,
        displayOrder: 3,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "4",
        optionText: "Agree",
        scoreValue: 4,
        displayOrder: 4,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "5",
        optionText: "Strongly Agree",
        scoreValue: 5,
        displayOrder: 5,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
    ]
  },
  {
    code: "CCF20",
    sectionCode: "SEC_COMM_INT",
    dimensionCode: "DIM_COMM_INT",
    questionType: "likert_1_5",
    questionText: "I am curious about how new business ideas can become sustainable ventures.",
    displayOrder: 20,
    isMandatory: true,
    scoringMethod: "LIKERT_SCALE",
    options: [
      {
        optionKey: "1",
        optionText: "Strongly Disagree",
        scoreValue: 1,
        displayOrder: 1,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "2",
        optionText: "Disagree",
        scoreValue: 2,
        displayOrder: 2,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "3",
        optionText: "Not Sure",
        scoreValue: 3,
        displayOrder: 3,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "4",
        optionText: "Agree",
        scoreValue: 4,
        displayOrder: 4,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "5",
        optionText: "Strongly Agree",
        scoreValue: 5,
        displayOrder: 5,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
    ]
  },
  {
    code: "CCF21",
    sectionCode: "SEC_ANAL_DATA",
    dimensionCode: "DIM_ANAL_DATA",
    questionType: "likert_1_5",
    questionText: "I enjoy using data to compare alternatives before reaching a conclusion.",
    displayOrder: 21,
    isMandatory: true,
    scoringMethod: "LIKERT_SCALE",
    options: [
      {
        optionKey: "1",
        optionText: "Strongly Disagree",
        scoreValue: 1,
        displayOrder: 1,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "2",
        optionText: "Disagree",
        scoreValue: 2,
        displayOrder: 2,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "3",
        optionText: "Not Sure",
        scoreValue: 3,
        displayOrder: 3,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "4",
        optionText: "Agree",
        scoreValue: 4,
        displayOrder: 4,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "5",
        optionText: "Strongly Agree",
        scoreValue: 5,
        displayOrder: 5,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
    ]
  },
  {
    code: "CCF22",
    sectionCode: "SEC_ANAL_DATA",
    dimensionCode: "DIM_ANAL_DATA",
    questionType: "likert_1_5",
    questionText: "I like finding patterns in information and using them to explain what is happening.",
    displayOrder: 22,
    isMandatory: true,
    scoringMethod: "LIKERT_SCALE",
    options: [
      {
        optionKey: "1",
        optionText: "Strongly Disagree",
        scoreValue: 1,
        displayOrder: 1,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
      {
        optionKey: "2",
        optionText: "Disagree",
        scoreValue: 2,
        displayOrder: 2,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
      {
        optionKey: "3",
        optionText: "Not Sure",
        scoreValue: 3,
        displayOrder: 3,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
      {
        optionKey: "4",
        optionText: "Agree",
        scoreValue: 4,
        displayOrder: 4,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
      {
        optionKey: "5",
        optionText: "Strongly Agree",
        scoreValue: 5,
        displayOrder: 5,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
    ]
  },
  {
    code: "CCF23",
    sectionCode: "SEC_ANAL_DATA",
    dimensionCode: "DIM_ANAL_DATA",
    questionType: "likert_1_5",
    questionText: "I am interested in how technology can improve financial or business decisions.",
    displayOrder: 23,
    isMandatory: true,
    scoringMethod: "LIKERT_SCALE",
    options: [
      {
        optionKey: "1",
        optionText: "Strongly Disagree",
        scoreValue: 1,
        displayOrder: 1,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "2",
        optionText: "Disagree",
        scoreValue: 2,
        displayOrder: 2,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "3",
        optionText: "Not Sure",
        scoreValue: 3,
        displayOrder: 3,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "4",
        optionText: "Agree",
        scoreValue: 4,
        displayOrder: 4,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "5",
        optionText: "Strongly Agree",
        scoreValue: 5,
        displayOrder: 5,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
    ]
  },
  {
    code: "CCF24",
    sectionCode: "SEC_ANAL_DATA",
    dimensionCode: "DIM_ANAL_DATA",
    questionType: "likert_1_5",
    questionText: "I enjoy turning a large amount of information into a smaller set of useful findings.",
    displayOrder: 24,
    isMandatory: true,
    scoringMethod: "LIKERT_SCALE",
    options: [
      {
        optionKey: "1",
        optionText: "Strongly Disagree",
        scoreValue: 1,
        displayOrder: 1,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "2",
        optionText: "Disagree",
        scoreValue: 2,
        displayOrder: 2,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "3",
        optionText: "Not Sure",
        scoreValue: 3,
        displayOrder: 3,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "4",
        optionText: "Agree",
        scoreValue: 4,
        displayOrder: 4,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "5",
        optionText: "Strongly Agree",
        scoreValue: 5,
        displayOrder: 5,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
    ]
  },
  {
    code: "CCF25",
    sectionCode: "SEC_ANAL_DATA",
    dimensionCode: "DIM_ANAL_DATA",
    questionType: "likert_1_5",
    questionText: "I like testing whether a business claim is supported by evidence.",
    displayOrder: 25,
    isMandatory: true,
    scoringMethod: "LIKERT_SCALE",
    options: [
      {
        optionKey: "1",
        optionText: "Strongly Disagree",
        scoreValue: 1,
        displayOrder: 1,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "2",
        optionText: "Disagree",
        scoreValue: 2,
        displayOrder: 2,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "3",
        optionText: "Not Sure",
        scoreValue: 3,
        displayOrder: 3,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "4",
        optionText: "Agree",
        scoreValue: 4,
        displayOrder: 4,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "5",
        optionText: "Strongly Agree",
        scoreValue: 5,
        displayOrder: 5,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
    ]
  },
  {
    code: "CCF26",
    sectionCode: "SEC_ANAL_DATA",
    dimensionCode: "DIM_ANAL_DATA",
    questionType: "likert_1_5",
    questionText: "I enjoy working with spreadsheets, dashboards, or structured data.",
    displayOrder: 26,
    isMandatory: true,
    scoringMethod: "LIKERT_SCALE",
    options: [
      {
        optionKey: "1",
        optionText: "Strongly Disagree",
        scoreValue: 1,
        displayOrder: 1,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
      {
        optionKey: "2",
        optionText: "Disagree",
        scoreValue: 2,
        displayOrder: 2,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
      {
        optionKey: "3",
        optionText: "Not Sure",
        scoreValue: 3,
        displayOrder: 3,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
      {
        optionKey: "4",
        optionText: "Agree",
        scoreValue: 4,
        displayOrder: 4,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
      {
        optionKey: "5",
        optionText: "Strongly Agree",
        scoreValue: 5,
        displayOrder: 5,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
    ]
  },
  {
    code: "CCF27",
    sectionCode: "SEC_ANAL_DATA",
    dimensionCode: "DIM_ANAL_DATA",
    questionType: "likert_1_5",
    questionText: "I prefer evidence-based decisions over decisions based mainly on intuition.",
    displayOrder: 27,
    isMandatory: true,
    scoringMethod: "LIKERT_SCALE",
    options: [
      {
        optionKey: "1",
        optionText: "Strongly Disagree",
        scoreValue: 1,
        displayOrder: 1,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "2",
        optionText: "Disagree",
        scoreValue: 2,
        displayOrder: 2,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "3",
        optionText: "Not Sure",
        scoreValue: 3,
        displayOrder: 3,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "4",
        optionText: "Agree",
        scoreValue: 4,
        displayOrder: 4,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "5",
        optionText: "Strongly Agree",
        scoreValue: 5,
        displayOrder: 5,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
    ]
  },
  {
    code: "CCF28",
    sectionCode: "SEC_ANAL_DATA",
    dimensionCode: "DIM_ANAL_DATA",
    questionType: "likert_1_5",
    questionText: "I am curious about forecasting sales, demand, prices, or financial outcomes.",
    displayOrder: 28,
    isMandatory: true,
    scoringMethod: "LIKERT_SCALE",
    options: [
      {
        optionKey: "1",
        optionText: "Strongly Disagree",
        scoreValue: 1,
        displayOrder: 1,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "2",
        optionText: "Disagree",
        scoreValue: 2,
        displayOrder: 2,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "3",
        optionText: "Not Sure",
        scoreValue: 3,
        displayOrder: 3,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "4",
        optionText: "Agree",
        scoreValue: 4,
        displayOrder: 4,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "5",
        optionText: "Strongly Agree",
        scoreValue: 5,
        displayOrder: 5,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
    ]
  },
  {
    code: "CCF29",
    sectionCode: "SEC_ANAL_DATA",
    dimensionCode: "DIM_ANAL_DATA",
    questionType: "likert_1_5",
    questionText: "I enjoy learning how algorithms or models can support business decisions.",
    displayOrder: 29,
    isMandatory: true,
    scoringMethod: "LIKERT_SCALE",
    options: [
      {
        optionKey: "1",
        optionText: "Strongly Disagree",
        scoreValue: 1,
        displayOrder: 1,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "2",
        optionText: "Disagree",
        scoreValue: 2,
        displayOrder: 2,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "3",
        optionText: "Not Sure",
        scoreValue: 3,
        displayOrder: 3,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "4",
        optionText: "Agree",
        scoreValue: 4,
        displayOrder: 4,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "5",
        optionText: "Strongly Agree",
        scoreValue: 5,
        displayOrder: 5,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
    ]
  },
  {
    code: "CCF30",
    sectionCode: "SEC_ANAL_DATA",
    dimensionCode: "DIM_ANAL_DATA",
    questionType: "likert_1_5",
    questionText: "I like investigating why two sets of business data show different results.",
    displayOrder: 30,
    isMandatory: true,
    scoringMethod: "LIKERT_SCALE",
    options: [
      {
        optionKey: "1",
        optionText: "Strongly Disagree",
        scoreValue: 1,
        displayOrder: 1,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
      {
        optionKey: "2",
        optionText: "Disagree",
        scoreValue: 2,
        displayOrder: 2,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
      {
        optionKey: "3",
        optionText: "Not Sure",
        scoreValue: 3,
        displayOrder: 3,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
      {
        optionKey: "4",
        optionText: "Agree",
        scoreValue: 4,
        displayOrder: 4,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
      {
        optionKey: "5",
        optionText: "Strongly Agree",
        scoreValue: 5,
        displayOrder: 5,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
    ]
  },
  {
    code: "CCF31",
    sectionCode: "SEC_ENTR_LEAD",
    dimensionCode: "DIM_ENTR_LEAD",
    questionType: "likert_1_5",
    questionText: "I enjoy taking responsibility for turning an idea into a practical result.",
    displayOrder: 31,
    isMandatory: true,
    scoringMethod: "LIKERT_SCALE",
    options: [
      {
        optionKey: "1",
        optionText: "Strongly Disagree",
        scoreValue: 1,
        displayOrder: 1,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
      {
        optionKey: "2",
        optionText: "Disagree",
        scoreValue: 2,
        displayOrder: 2,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
      {
        optionKey: "3",
        optionText: "Not Sure",
        scoreValue: 3,
        displayOrder: 3,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
      {
        optionKey: "4",
        optionText: "Agree",
        scoreValue: 4,
        displayOrder: 4,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
      {
        optionKey: "5",
        optionText: "Strongly Agree",
        scoreValue: 5,
        displayOrder: 5,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
    ]
  },
  {
    code: "CCF32",
    sectionCode: "SEC_ENTR_LEAD",
    dimensionCode: "DIM_ENTR_LEAD",
    questionType: "likert_1_5",
    questionText: "I like deciding what should be done when a team has several possible options.",
    displayOrder: 32,
    isMandatory: true,
    scoringMethod: "LIKERT_SCALE",
    options: [
      {
        optionKey: "1",
        optionText: "Strongly Disagree",
        scoreValue: 1,
        displayOrder: 1,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "2",
        optionText: "Disagree",
        scoreValue: 2,
        displayOrder: 2,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "3",
        optionText: "Not Sure",
        scoreValue: 3,
        displayOrder: 3,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "4",
        optionText: "Agree",
        scoreValue: 4,
        displayOrder: 4,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "5",
        optionText: "Strongly Agree",
        scoreValue: 5,
        displayOrder: 5,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
    ]
  },
  {
    code: "CCF33",
    sectionCode: "SEC_ENTR_LEAD",
    dimensionCode: "DIM_ENTR_LEAD",
    questionType: "likert_1_5",
    questionText: "I am comfortable taking calculated risks when the potential benefit is clear.",
    displayOrder: 33,
    isMandatory: true,
    scoringMethod: "LIKERT_SCALE",
    options: [
      {
        optionKey: "1",
        optionText: "Strongly Disagree",
        scoreValue: 1,
        displayOrder: 1,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "2",
        optionText: "Disagree",
        scoreValue: 2,
        displayOrder: 2,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "3",
        optionText: "Not Sure",
        scoreValue: 3,
        displayOrder: 3,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "4",
        optionText: "Agree",
        scoreValue: 4,
        displayOrder: 4,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "5",
        optionText: "Strongly Agree",
        scoreValue: 5,
        displayOrder: 5,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
    ]
  },
  {
    code: "CCF34",
    sectionCode: "SEC_ENTR_LEAD",
    dimensionCode: "DIM_ENTR_LEAD",
    questionType: "likert_1_5",
    questionText: "I enjoy organizing people and resources to achieve a shared goal.",
    displayOrder: 34,
    isMandatory: true,
    scoringMethod: "LIKERT_SCALE",
    options: [
      {
        optionKey: "1",
        optionText: "Strongly Disagree",
        scoreValue: 1,
        displayOrder: 1,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "2",
        optionText: "Disagree",
        scoreValue: 2,
        displayOrder: 2,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "3",
        optionText: "Not Sure",
        scoreValue: 3,
        displayOrder: 3,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "4",
        optionText: "Agree",
        scoreValue: 4,
        displayOrder: 4,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "5",
        optionText: "Strongly Agree",
        scoreValue: 5,
        displayOrder: 5,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
    ]
  },
  {
    code: "CCF35",
    sectionCode: "SEC_ENTR_LEAD",
    dimensionCode: "DIM_ENTR_LEAD",
    questionType: "likert_1_5",
    questionText: "I like identifying opportunities that others may not have noticed.",
    displayOrder: 35,
    isMandatory: true,
    scoringMethod: "LIKERT_SCALE",
    options: [
      {
        optionKey: "1",
        optionText: "Strongly Disagree",
        scoreValue: 1,
        displayOrder: 1,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
      {
        optionKey: "2",
        optionText: "Disagree",
        scoreValue: 2,
        displayOrder: 2,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
      {
        optionKey: "3",
        optionText: "Not Sure",
        scoreValue: 3,
        displayOrder: 3,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
      {
        optionKey: "4",
        optionText: "Agree",
        scoreValue: 4,
        displayOrder: 4,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
      {
        optionKey: "5",
        optionText: "Strongly Agree",
        scoreValue: 5,
        displayOrder: 5,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
    ]
  },
  {
    code: "CCF36",
    sectionCode: "SEC_ENTR_LEAD",
    dimensionCode: "DIM_ENTR_LEAD",
    questionType: "likert_1_5",
    questionText: "I would enjoy building a business or leading a project from an early stage.",
    displayOrder: 36,
    isMandatory: true,
    scoringMethod: "LIKERT_SCALE",
    options: [
      {
        optionKey: "1",
        optionText: "Strongly Disagree",
        scoreValue: 1,
        displayOrder: 1,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "2",
        optionText: "Disagree",
        scoreValue: 2,
        displayOrder: 2,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "3",
        optionText: "Not Sure",
        scoreValue: 3,
        displayOrder: 3,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "4",
        optionText: "Agree",
        scoreValue: 4,
        displayOrder: 4,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "5",
        optionText: "Strongly Agree",
        scoreValue: 5,
        displayOrder: 5,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
    ]
  },
  {
    code: "CCF37",
    sectionCode: "SEC_ENTR_LEAD",
    dimensionCode: "DIM_ENTR_LEAD",
    questionType: "likert_1_5",
    questionText: "I stay motivated when I have ownership of an outcome.",
    displayOrder: 37,
    isMandatory: true,
    scoringMethod: "LIKERT_SCALE",
    options: [
      {
        optionKey: "1",
        optionText: "Strongly Disagree",
        scoreValue: 1,
        displayOrder: 1,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "2",
        optionText: "Disagree",
        scoreValue: 2,
        displayOrder: 2,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "3",
        optionText: "Not Sure",
        scoreValue: 3,
        displayOrder: 3,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "4",
        optionText: "Agree",
        scoreValue: 4,
        displayOrder: 4,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "5",
        optionText: "Strongly Agree",
        scoreValue: 5,
        displayOrder: 5,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
    ]
  },
  {
    code: "CCF38",
    sectionCode: "SEC_ENTR_LEAD",
    dimensionCode: "DIM_ENTR_LEAD",
    questionType: "likert_1_5",
    questionText: "I enjoy negotiating priorities when time or resources are limited.",
    displayOrder: 38,
    isMandatory: true,
    scoringMethod: "LIKERT_SCALE",
    options: [
      {
        optionKey: "1",
        optionText: "Strongly Disagree",
        scoreValue: 1,
        displayOrder: 1,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "2",
        optionText: "Disagree",
        scoreValue: 2,
        displayOrder: 2,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "3",
        optionText: "Not Sure",
        scoreValue: 3,
        displayOrder: 3,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "4",
        optionText: "Agree",
        scoreValue: 4,
        displayOrder: 4,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "5",
        optionText: "Strongly Agree",
        scoreValue: 5,
        displayOrder: 5,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
    ]
  },
  {
    code: "CCF39",
    sectionCode: "SEC_ENTR_LEAD",
    dimensionCode: "DIM_ENTR_LEAD",
    questionType: "likert_1_5",
    questionText: "I like experimenting with new approaches rather than always following established methods.",
    displayOrder: 39,
    isMandatory: true,
    scoringMethod: "LIKERT_SCALE",
    options: [
      {
        optionKey: "1",
        optionText: "Strongly Disagree",
        scoreValue: 1,
        displayOrder: 1,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
      {
        optionKey: "2",
        optionText: "Disagree",
        scoreValue: 2,
        displayOrder: 2,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
      {
        optionKey: "3",
        optionText: "Not Sure",
        scoreValue: 3,
        displayOrder: 3,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
      {
        optionKey: "4",
        optionText: "Agree",
        scoreValue: 4,
        displayOrder: 4,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
      {
        optionKey: "5",
        optionText: "Strongly Agree",
        scoreValue: 5,
        displayOrder: 5,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
    ]
  },
  {
    code: "CCF40",
    sectionCode: "SEC_ENTR_LEAD",
    dimensionCode: "DIM_ENTR_LEAD",
    questionType: "likert_1_5",
    questionText: "I am interested in how leaders make decisions when outcomes are uncertain.",
    displayOrder: 40,
    isMandatory: true,
    scoringMethod: "LIKERT_SCALE",
    options: [
      {
        optionKey: "1",
        optionText: "Strongly Disagree",
        scoreValue: 1,
        displayOrder: 1,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "2",
        optionText: "Disagree",
        scoreValue: 2,
        displayOrder: 2,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "3",
        optionText: "Not Sure",
        scoreValue: 3,
        displayOrder: 3,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "4",
        optionText: "Agree",
        scoreValue: 4,
        displayOrder: 4,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "5",
        optionText: "Strongly Agree",
        scoreValue: 5,
        displayOrder: 5,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
    ]
  },
  {
    code: "CCF41",
    sectionCode: "SEC_COMM_NEG",
    dimensionCode: "DIM_COMM_NEG",
    questionType: "likert_1_5",
    questionText: "I enjoy explaining a business idea so that other people can understand its value.",
    displayOrder: 41,
    isMandatory: true,
    scoringMethod: "LIKERT_SCALE",
    options: [
      {
        optionKey: "1",
        optionText: "Strongly Disagree",
        scoreValue: 1,
        displayOrder: 1,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "2",
        optionText: "Disagree",
        scoreValue: 2,
        displayOrder: 2,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "3",
        optionText: "Not Sure",
        scoreValue: 3,
        displayOrder: 3,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "4",
        optionText: "Agree",
        scoreValue: 4,
        displayOrder: 4,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "5",
        optionText: "Strongly Agree",
        scoreValue: 5,
        displayOrder: 5,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
    ]
  },
  {
    code: "CCF42",
    sectionCode: "SEC_COMM_NEG",
    dimensionCode: "DIM_COMM_NEG",
    questionType: "likert_1_5",
    questionText: "I am comfortable discussing prices, terms, or agreements with other people.",
    displayOrder: 42,
    isMandatory: true,
    scoringMethod: "LIKERT_SCALE",
    options: [
      {
        optionKey: "1",
        optionText: "Strongly Disagree",
        scoreValue: 1,
        displayOrder: 1,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "2",
        optionText: "Disagree",
        scoreValue: 2,
        displayOrder: 2,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "3",
        optionText: "Not Sure",
        scoreValue: 3,
        displayOrder: 3,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "4",
        optionText: "Agree",
        scoreValue: 4,
        displayOrder: 4,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "5",
        optionText: "Strongly Agree",
        scoreValue: 5,
        displayOrder: 5,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
    ]
  },
  {
    code: "CCF43",
    sectionCode: "SEC_COMM_NEG",
    dimensionCode: "DIM_COMM_NEG",
    questionType: "likert_1_5",
    questionText: "I like listening to different viewpoints before proposing a business solution.",
    displayOrder: 43,
    isMandatory: true,
    scoringMethod: "LIKERT_SCALE",
    options: [
      {
        optionKey: "1",
        optionText: "Strongly Disagree",
        scoreValue: 1,
        displayOrder: 1,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "2",
        optionText: "Disagree",
        scoreValue: 2,
        displayOrder: 2,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "3",
        optionText: "Not Sure",
        scoreValue: 3,
        displayOrder: 3,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "4",
        optionText: "Agree",
        scoreValue: 4,
        displayOrder: 4,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "5",
        optionText: "Strongly Agree",
        scoreValue: 5,
        displayOrder: 5,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
    ]
  },
  {
    code: "CCF44",
    sectionCode: "SEC_COMM_NEG",
    dimensionCode: "DIM_COMM_NEG",
    questionType: "likert_1_5",
    questionText: "I enjoy presenting information to a group when I understand the subject.",
    displayOrder: 44,
    isMandatory: true,
    scoringMethod: "LIKERT_SCALE",
    options: [
      {
        optionKey: "1",
        optionText: "Strongly Disagree",
        scoreValue: 1,
        displayOrder: 1,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
      {
        optionKey: "2",
        optionText: "Disagree",
        scoreValue: 2,
        displayOrder: 2,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
      {
        optionKey: "3",
        optionText: "Not Sure",
        scoreValue: 3,
        displayOrder: 3,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
      {
        optionKey: "4",
        optionText: "Agree",
        scoreValue: 4,
        displayOrder: 4,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
      {
        optionKey: "5",
        optionText: "Strongly Agree",
        scoreValue: 5,
        displayOrder: 5,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
    ]
  },
  {
    code: "CCF45",
    sectionCode: "SEC_COMM_NEG",
    dimensionCode: "DIM_COMM_NEG",
    questionType: "likert_1_5",
    questionText: "I am interested in how communication influences customer and business relationships.",
    displayOrder: 45,
    isMandatory: true,
    scoringMethod: "LIKERT_SCALE",
    options: [
      {
        optionKey: "1",
        optionText: "Strongly Disagree",
        scoreValue: 1,
        displayOrder: 1,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "2",
        optionText: "Disagree",
        scoreValue: 2,
        displayOrder: 2,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "3",
        optionText: "Not Sure",
        scoreValue: 3,
        displayOrder: 3,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "4",
        optionText: "Agree",
        scoreValue: 4,
        displayOrder: 4,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "5",
        optionText: "Strongly Agree",
        scoreValue: 5,
        displayOrder: 5,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
    ]
  },
  {
    code: "CCF46",
    sectionCode: "SEC_COMM_NEG",
    dimensionCode: "DIM_COMM_NEG",
    questionType: "likert_1_5",
    questionText: "I can adapt the way I explain something depending on the person I am speaking with.",
    displayOrder: 46,
    isMandatory: true,
    scoringMethod: "LIKERT_SCALE",
    options: [
      {
        optionKey: "1",
        optionText: "Strongly Disagree",
        scoreValue: 1,
        displayOrder: 1,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "2",
        optionText: "Disagree",
        scoreValue: 2,
        displayOrder: 2,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "3",
        optionText: "Not Sure",
        scoreValue: 3,
        displayOrder: 3,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "4",
        optionText: "Agree",
        scoreValue: 4,
        displayOrder: 4,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "5",
        optionText: "Strongly Agree",
        scoreValue: 5,
        displayOrder: 5,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
    ]
  },
  {
    code: "CCF47",
    sectionCode: "SEC_COMM_NEG",
    dimensionCode: "DIM_COMM_NEG",
    questionType: "likert_1_5",
    questionText: "I enjoy persuading people using reasons and evidence rather than pressure.",
    displayOrder: 47,
    isMandatory: true,
    scoringMethod: "LIKERT_SCALE",
    options: [
      {
        optionKey: "1",
        optionText: "Strongly Disagree",
        scoreValue: 1,
        displayOrder: 1,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "2",
        optionText: "Disagree",
        scoreValue: 2,
        displayOrder: 2,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "3",
        optionText: "Not Sure",
        scoreValue: 3,
        displayOrder: 3,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "4",
        optionText: "Agree",
        scoreValue: 4,
        displayOrder: 4,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "5",
        optionText: "Strongly Agree",
        scoreValue: 5,
        displayOrder: 5,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
    ]
  },
  {
    code: "CCF48",
    sectionCode: "SEC_COMM_NEG",
    dimensionCode: "DIM_COMM_NEG",
    questionType: "likert_1_5",
    questionText: "I would be comfortable working in a role that involves regular client or stakeholder interaction.",
    displayOrder: 48,
    isMandatory: true,
    scoringMethod: "LIKERT_SCALE",
    options: [
      {
        optionKey: "1",
        optionText: "Strongly Disagree",
        scoreValue: 1,
        displayOrder: 1,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
      {
        optionKey: "2",
        optionText: "Disagree",
        scoreValue: 2,
        displayOrder: 2,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
      {
        optionKey: "3",
        optionText: "Not Sure",
        scoreValue: 3,
        displayOrder: 3,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
      {
        optionKey: "4",
        optionText: "Agree",
        scoreValue: 4,
        displayOrder: 4,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
      {
        optionKey: "5",
        optionText: "Strongly Agree",
        scoreValue: 5,
        displayOrder: 5,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
    ]
  },
  {
    code: "CCF49",
    sectionCode: "SEC_COMM_NEG",
    dimensionCode: "DIM_COMM_NEG",
    questionType: "likert_1_5",
    questionText: "I like resolving disagreements by finding a practical solution that works for both sides.",
    displayOrder: 49,
    isMandatory: true,
    scoringMethod: "LIKERT_SCALE",
    options: [
      {
        optionKey: "1",
        optionText: "Strongly Disagree",
        scoreValue: 1,
        displayOrder: 1,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "2",
        optionText: "Disagree",
        scoreValue: 2,
        displayOrder: 2,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "3",
        optionText: "Not Sure",
        scoreValue: 3,
        displayOrder: 3,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "4",
        optionText: "Agree",
        scoreValue: 4,
        displayOrder: 4,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "5",
        optionText: "Strongly Agree",
        scoreValue: 5,
        displayOrder: 5,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
    ]
  },
  {
    code: "CCF50",
    sectionCode: "SEC_COMM_NEG",
    dimensionCode: "DIM_COMM_NEG",
    questionType: "likert_1_5",
    questionText: "I enjoy building professional relationships that may help a team or organization succeed.",
    displayOrder: 50,
    isMandatory: true,
    scoringMethod: "LIKERT_SCALE",
    options: [
      {
        optionKey: "1",
        optionText: "Strongly Disagree",
        scoreValue: 1,
        displayOrder: 1,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "2",
        optionText: "Disagree",
        scoreValue: 2,
        displayOrder: 2,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "3",
        optionText: "Not Sure",
        scoreValue: 3,
        displayOrder: 3,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "4",
        optionText: "Agree",
        scoreValue: 4,
        displayOrder: 4,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "5",
        optionText: "Strongly Agree",
        scoreValue: 5,
        displayOrder: 5,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
    ]
  },
  {
    code: "CCF51",
    sectionCode: "SEC_DET_ETH",
    dimensionCode: "DIM_DET_ETH",
    questionType: "likert_1_5",
    questionText: "I naturally notice small errors in financial or business information.",
    displayOrder: 51,
    isMandatory: true,
    scoringMethod: "LIKERT_SCALE",
    options: [
      {
        optionKey: "1",
        optionText: "Strongly Disagree",
        scoreValue: 1,
        displayOrder: 1,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "2",
        optionText: "Disagree",
        scoreValue: 2,
        displayOrder: 2,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "3",
        optionText: "Not Sure",
        scoreValue: 3,
        displayOrder: 3,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "4",
        optionText: "Agree",
        scoreValue: 4,
        displayOrder: 4,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "5",
        optionText: "Strongly Agree",
        scoreValue: 5,
        displayOrder: 5,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
    ]
  },
  {
    code: "CCF52",
    sectionCode: "SEC_DET_ETH",
    dimensionCode: "DIM_DET_ETH",
    questionType: "likert_1_5",
    questionText: "I believe financial decisions should be documented clearly and accurately.",
    displayOrder: 52,
    isMandatory: true,
    scoringMethod: "LIKERT_SCALE",
    options: [
      {
        optionKey: "1",
        optionText: "Strongly Disagree",
        scoreValue: 1,
        displayOrder: 1,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "2",
        optionText: "Disagree",
        scoreValue: 2,
        displayOrder: 2,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "3",
        optionText: "Not Sure",
        scoreValue: 3,
        displayOrder: 3,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "4",
        optionText: "Agree",
        scoreValue: 4,
        displayOrder: 4,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "5",
        optionText: "Strongly Agree",
        scoreValue: 5,
        displayOrder: 5,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
    ]
  },
  {
    code: "CCF53",
    sectionCode: "SEC_DET_ETH",
    dimensionCode: "DIM_DET_ETH",
    questionType: "likert_1_5",
    questionText: "I would rather verify important information than rely on an assumption.",
    displayOrder: 53,
    isMandatory: true,
    scoringMethod: "LIKERT_SCALE",
    options: [
      {
        optionKey: "1",
        optionText: "Strongly Disagree",
        scoreValue: 1,
        displayOrder: 1,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
      {
        optionKey: "2",
        optionText: "Disagree",
        scoreValue: 2,
        displayOrder: 2,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
      {
        optionKey: "3",
        optionText: "Not Sure",
        scoreValue: 3,
        displayOrder: 3,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
      {
        optionKey: "4",
        optionText: "Agree",
        scoreValue: 4,
        displayOrder: 4,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
      {
        optionKey: "5",
        optionText: "Strongly Agree",
        scoreValue: 5,
        displayOrder: 5,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
    ]
  },
  {
    code: "CCF54",
    sectionCode: "SEC_DET_ETH",
    dimensionCode: "DIM_DET_ETH",
    questionType: "likert_1_5",
    questionText: "I am interested in how organizations manage financial, legal, or operational risk.",
    displayOrder: 54,
    isMandatory: true,
    scoringMethod: "LIKERT_SCALE",
    options: [
      {
        optionKey: "1",
        optionText: "Strongly Disagree",
        scoreValue: 1,
        displayOrder: 1,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "2",
        optionText: "Disagree",
        scoreValue: 2,
        displayOrder: 2,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "3",
        optionText: "Not Sure",
        scoreValue: 3,
        displayOrder: 3,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "4",
        optionText: "Agree",
        scoreValue: 4,
        displayOrder: 4,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "5",
        optionText: "Strongly Agree",
        scoreValue: 5,
        displayOrder: 5,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
    ]
  },
  {
    code: "CCF55",
    sectionCode: "SEC_DET_ETH",
    dimensionCode: "DIM_DET_ETH",
    questionType: "likert_1_5",
    questionText: "I think professional integrity is essential when handling money or confidential information.",
    displayOrder: 55,
    isMandatory: true,
    scoringMethod: "LIKERT_SCALE",
    options: [
      {
        optionKey: "1",
        optionText: "Strongly Disagree",
        scoreValue: 1,
        displayOrder: 1,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "2",
        optionText: "Disagree",
        scoreValue: 2,
        displayOrder: 2,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "3",
        optionText: "Not Sure",
        scoreValue: 3,
        displayOrder: 3,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "4",
        optionText: "Agree",
        scoreValue: 4,
        displayOrder: 4,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "5",
        optionText: "Strongly Agree",
        scoreValue: 5,
        displayOrder: 5,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
    ]
  },
  {
    code: "CCF56",
    sectionCode: "SEC_DET_ETH",
    dimensionCode: "DIM_DET_ETH",
    questionType: "likert_1_5",
    questionText: "I enjoy reviewing documents carefully before approving or submitting them.",
    displayOrder: 56,
    isMandatory: true,
    scoringMethod: "LIKERT_SCALE",
    options: [
      {
        optionKey: "1",
        optionText: "Strongly Disagree",
        scoreValue: 1,
        displayOrder: 1,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "2",
        optionText: "Disagree",
        scoreValue: 2,
        displayOrder: 2,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "3",
        optionText: "Not Sure",
        scoreValue: 3,
        displayOrder: 3,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "4",
        optionText: "Agree",
        scoreValue: 4,
        displayOrder: 4,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "5",
        optionText: "Strongly Agree",
        scoreValue: 5,
        displayOrder: 5,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
    ]
  },
  {
    code: "CCF57",
    sectionCode: "SEC_DET_ETH",
    dimensionCode: "DIM_DET_ETH",
    questionType: "likert_1_5",
    questionText: "I am comfortable following rules when they protect people, organizations, or financial systems.",
    displayOrder: 57,
    isMandatory: true,
    scoringMethod: "LIKERT_SCALE",
    options: [
      {
        optionKey: "1",
        optionText: "Strongly Disagree",
        scoreValue: 1,
        displayOrder: 1,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
      {
        optionKey: "2",
        optionText: "Disagree",
        scoreValue: 2,
        displayOrder: 2,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
      {
        optionKey: "3",
        optionText: "Not Sure",
        scoreValue: 3,
        displayOrder: 3,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
      {
        optionKey: "4",
        optionText: "Agree",
        scoreValue: 4,
        displayOrder: 4,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
      {
        optionKey: "5",
        optionText: "Strongly Agree",
        scoreValue: 5,
        displayOrder: 5,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
    ]
  },
  {
    code: "CCF58",
    sectionCode: "SEC_DET_ETH",
    dimensionCode: "DIM_DET_ETH",
    questionType: "likert_1_5",
    questionText: "I like identifying what could go wrong before a business decision is implemented.",
    displayOrder: 58,
    isMandatory: true,
    scoringMethod: "LIKERT_SCALE",
    options: [
      {
        optionKey: "1",
        optionText: "Strongly Disagree",
        scoreValue: 1,
        displayOrder: 1,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "2",
        optionText: "Disagree",
        scoreValue: 2,
        displayOrder: 2,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "3",
        optionText: "Not Sure",
        scoreValue: 3,
        displayOrder: 3,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "4",
        optionText: "Agree",
        scoreValue: 4,
        displayOrder: 4,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "5",
        optionText: "Strongly Agree",
        scoreValue: 5,
        displayOrder: 5,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
    ]
  },
  {
    code: "CCF59",
    sectionCode: "SEC_DET_ETH",
    dimensionCode: "DIM_DET_ETH",
    questionType: "likert_1_5",
    questionText: "I would speak up if I noticed information being presented in a misleading way.",
    displayOrder: 59,
    isMandatory: true,
    scoringMethod: "LIKERT_SCALE",
    options: [
      {
        optionKey: "1",
        optionText: "Strongly Disagree",
        scoreValue: 1,
        displayOrder: 1,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "2",
        optionText: "Disagree",
        scoreValue: 2,
        displayOrder: 2,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "3",
        optionText: "Not Sure",
        scoreValue: 3,
        displayOrder: 3,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "4",
        optionText: "Agree",
        scoreValue: 4,
        displayOrder: 4,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "5",
        optionText: "Strongly Agree",
        scoreValue: 5,
        displayOrder: 5,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
    ]
  },
  {
    code: "CCF60",
    sectionCode: "SEC_DET_ETH",
    dimensionCode: "DIM_DET_ETH",
    questionType: "likert_1_5",
    questionText: "I prefer accurate and responsible work even when it takes more time.",
    displayOrder: 60,
    isMandatory: true,
    scoringMethod: "LIKERT_SCALE",
    options: [
      {
        optionKey: "1",
        optionText: "Strongly Disagree",
        scoreValue: 1,
        displayOrder: 1,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "2",
        optionText: "Disagree",
        scoreValue: 2,
        displayOrder: 2,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "3",
        optionText: "Not Sure",
        scoreValue: 3,
        displayOrder: 3,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "4",
        optionText: "Agree",
        scoreValue: 4,
        displayOrder: 4,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "5",
        optionText: "Strongly Agree",
        scoreValue: 5,
        displayOrder: 5,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
    ]
  },
  {
    code: "CCF61",
    sectionCode: "SEC_CAR_SCEN",
    dimensionCode: "DIM_COMM_INT",
    questionType: "forced_choice_4",
    questionText: "You are given a company's monthly accounts. Which task would you most enjoy?",
    displayOrder: 61,
    isMandatory: true,
    scoringMethod: "WEIGHTED_OPTIONS",
    options: [
      {
        optionKey: "A",
        optionText: "Checking records, reconciliations, and accuracy",
        scoreValue: 1.0,
        displayOrder: 1,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "B",
        optionText: "Evaluating investment implications",
        scoreValue: 1.0,
        displayOrder: 2,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "C",
        optionText: "Planning how the business could grow",
        scoreValue: 1.0,
        displayOrder: 3,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "D",
        optionText: "Finding trends and insights in the data",
        scoreValue: 1.0,
        displayOrder: 4,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
    ]
  },
  {
    code: "CCF62",
    sectionCode: "SEC_CAR_SCEN",
    dimensionCode: "DIM_COMM_INT",
    questionType: "forced_choice_4",
    questionText: "A company has extra cash available. Which question interests you most?",
    displayOrder: 62,
    isMandatory: true,
    scoringMethod: "WEIGHTED_OPTIONS",
    options: [
      {
        optionKey: "A",
        optionText: "How should the transaction be recorded and controlled?",
        scoreValue: 1.0,
        displayOrder: 1,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "B",
        optionText: "Where could the money be invested for an appropriate return?",
        scoreValue: 1.0,
        displayOrder: 2,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "C",
        optionText: "How could the business use it to expand or launch something new?",
        scoreValue: 1.0,
        displayOrder: 3,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "D",
        optionText: "What data could help compare the possible uses?",
        scoreValue: 1.0,
        displayOrder: 4,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
    ]
  },
  {
    code: "CCF63",
    sectionCode: "SEC_CAR_SCEN",
    dimensionCode: "DIM_COMM_INT",
    questionType: "forced_choice_4",
    questionText: "A new product is losing money. What would you most want to investigate first?",
    displayOrder: 63,
    isMandatory: true,
    scoringMethod: "WEIGHTED_OPTIONS",
    options: [
      {
        optionKey: "A",
        optionText: "Whether costs and records are accurate",
        scoreValue: 1.0,
        displayOrder: 1,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "B",
        optionText: "Whether capital and pricing assumptions are sound",
        scoreValue: 1.0,
        displayOrder: 2,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "C",
        optionText: "Whether the product, customers, or business model need to change",
        scoreValue: 1.0,
        displayOrder: 3,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "D",
        optionText: "What the sales and customer data reveal",
        scoreValue: 1.0,
        displayOrder: 4,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
    ]
  },
  {
    code: "CCF64",
    sectionCode: "SEC_CAR_SCEN",
    dimensionCode: "DIM_COMM_INT",
    questionType: "forced_choice_4",
    questionText: "Which project sounds most interesting?",
    displayOrder: 64,
    isMandatory: true,
    scoringMethod: "WEIGHTED_OPTIONS",
    options: [
      {
        optionKey: "A",
        optionText: "Preparing and reviewing financial statements",
        scoreValue: 1.0,
        displayOrder: 1,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "B",
        optionText: "Studying markets, investments, and portfolio decisions",
        scoreValue: 1.0,
        displayOrder: 2,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "C",
        optionText: "Building a business plan and leading a launch",
        scoreValue: 1.0,
        displayOrder: 3,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "D",
        optionText: "Creating a model to forecast business performance",
        scoreValue: 1.0,
        displayOrder: 4,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
    ]
  },
  {
    code: "CCF65",
    sectionCode: "SEC_CAR_SCEN",
    dimensionCode: "DIM_COMM_INT",
    questionType: "forced_choice_4",
    questionText: "A client asks for help with a financial problem. Which role would suit you most?",
    displayOrder: 65,
    isMandatory: true,
    scoringMethod: "WEIGHTED_OPTIONS",
    options: [
      {
        optionKey: "A",
        optionText: "Review the accounts and identify discrepancies",
        scoreValue: 1.0,
        displayOrder: 1,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "B",
        optionText: "Assess financial choices and risk-return trade-offs",
        scoreValue: 1.0,
        displayOrder: 2,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "C",
        optionText: "Recommend a business strategy and implementation plan",
        scoreValue: 1.0,
        displayOrder: 3,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "D",
        optionText: "Analyze the available data and identify patterns",
        scoreValue: 1.0,
        displayOrder: 4,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
    ]
  },
  {
    code: "CCF66",
    sectionCode: "SEC_CAR_SCEN",
    dimensionCode: "DIM_COMM_INT",
    questionType: "forced_choice_4",
    questionText: "Which professional activity sounds most satisfying?",
    displayOrder: 66,
    isMandatory: true,
    scoringMethod: "WEIGHTED_OPTIONS",
    options: [
      {
        optionKey: "A",
        optionText: "Accounting, Audit & Tax pathway",
        scoreValue: 1.0,
        displayOrder: 1,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "B",
        optionText: "Finance, Investment & Banking pathway",
        scoreValue: 1.0,
        displayOrder: 2,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "C",
        optionText: "Business, Management & Entrepreneurship pathway",
        scoreValue: 1.0,
        displayOrder: 3,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "D",
        optionText: "Economics, Analytics & FinTech pathway",
        scoreValue: 1.0,
        displayOrder: 4,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
    ]
  },
  {
    code: "CCF67",
    sectionCode: "SEC_CAR_SCEN",
    dimensionCode: "DIM_COMM_INT",
    questionType: "forced_choice_4",
    questionText: "A small company wants to grow. What would you naturally focus on?",
    displayOrder: 67,
    isMandatory: true,
    scoringMethod: "WEIGHTED_OPTIONS",
    options: [
      {
        optionKey: "A",
        optionText: "Accounting, Audit & Tax pathway",
        scoreValue: 1.0,
        displayOrder: 1,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "B",
        optionText: "Finance, Investment & Banking pathway",
        scoreValue: 1.0,
        displayOrder: 2,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "C",
        optionText: "Business, Management & Entrepreneurship pathway",
        scoreValue: 1.0,
        displayOrder: 3,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "D",
        optionText: "Economics, Analytics & FinTech pathway",
        scoreValue: 1.0,
        displayOrder: 4,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
    ]
  },
  {
    code: "CCF68",
    sectionCode: "SEC_CAR_SCEN",
    dimensionCode: "DIM_COMM_INT",
    questionType: "forced_choice_4",
    questionText: "Which problem would you rather solve?",
    displayOrder: 68,
    isMandatory: true,
    scoringMethod: "WEIGHTED_OPTIONS",
    options: [
      {
        optionKey: "A",
        optionText: "Accounting, Audit & Tax pathway",
        scoreValue: 1.0,
        displayOrder: 1,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "B",
        optionText: "Finance, Investment & Banking pathway",
        scoreValue: 1.0,
        displayOrder: 2,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "C",
        optionText: "Business, Management & Entrepreneurship pathway",
        scoreValue: 1.0,
        displayOrder: 3,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "D",
        optionText: "Economics, Analytics & FinTech pathway",
        scoreValue: 1.0,
        displayOrder: 4,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
    ]
  },
  {
    code: "CCF69",
    sectionCode: "SEC_CAR_SCEN",
    dimensionCode: "DIM_COMM_INT",
    questionType: "forced_choice_4",
    questionText: "You receive a complex spreadsheet. Which outcome would feel most rewarding?",
    displayOrder: 69,
    isMandatory: true,
    scoringMethod: "WEIGHTED_OPTIONS",
    options: [
      {
        optionKey: "A",
        optionText: "Accounting, Audit & Tax pathway",
        scoreValue: 1.0,
        displayOrder: 1,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "B",
        optionText: "Finance, Investment & Banking pathway",
        scoreValue: 1.0,
        displayOrder: 2,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "C",
        optionText: "Business, Management & Entrepreneurship pathway",
        scoreValue: 1.0,
        displayOrder: 3,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "D",
        optionText: "Economics, Analytics & FinTech pathway",
        scoreValue: 1.0,
        displayOrder: 4,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
    ]
  },
  {
    code: "CCF70",
    sectionCode: "SEC_CAR_SCEN",
    dimensionCode: "DIM_COMM_INT",
    questionType: "forced_choice_4",
    questionText: "If you could shadow one professional for a day, which would you choose?",
    displayOrder: 70,
    isMandatory: true,
    scoringMethod: "WEIGHTED_OPTIONS",
    options: [
      {
        optionKey: "A",
        optionText: "Accounting, Audit & Tax pathway",
        scoreValue: 1.0,
        displayOrder: 1,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "B",
        optionText: "Finance, Investment & Banking pathway",
        scoreValue: 1.0,
        displayOrder: 2,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "C",
        optionText: "Business, Management & Entrepreneurship pathway",
        scoreValue: 1.0,
        displayOrder: 3,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "D",
        optionText: "Economics, Analytics & FinTech pathway",
        scoreValue: 1.0,
        displayOrder: 4,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
    ]
  },
  {
    code: "CCF71",
    sectionCode: "SEC_CAR_SCEN",
    dimensionCode: "DIM_COMM_INT",
    questionType: "forced_choice_4",
    questionText: "A company is considering entering a new market. What interests you most?",
    displayOrder: 71,
    isMandatory: true,
    scoringMethod: "WEIGHTED_OPTIONS",
    options: [
      {
        optionKey: "A",
        optionText: "Accounting, Audit & Tax pathway",
        scoreValue: 1.0,
        displayOrder: 1,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "B",
        optionText: "Finance, Investment & Banking pathway",
        scoreValue: 1.0,
        displayOrder: 2,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "C",
        optionText: "Business, Management & Entrepreneurship pathway",
        scoreValue: 1.0,
        displayOrder: 3,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "D",
        optionText: "Economics, Analytics & FinTech pathway",
        scoreValue: 1.0,
        displayOrder: 4,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
    ]
  },
  {
    code: "CCF72",
    sectionCode: "SEC_CAR_SCEN",
    dimensionCode: "DIM_COMM_INT",
    questionType: "forced_choice_4",
    questionText: "Which statement sounds most like you?",
    displayOrder: 72,
    isMandatory: true,
    scoringMethod: "WEIGHTED_OPTIONS",
    options: [
      {
        optionKey: "A",
        optionText: "Accounting, Audit & Tax pathway",
        scoreValue: 1.0,
        displayOrder: 1,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "B",
        optionText: "Finance, Investment & Banking pathway",
        scoreValue: 1.0,
        displayOrder: 2,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "C",
        optionText: "Business, Management & Entrepreneurship pathway",
        scoreValue: 1.0,
        displayOrder: 3,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "D",
        optionText: "Economics, Analytics & FinTech pathway",
        scoreValue: 1.0,
        displayOrder: 4,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
    ]
  },
  {
    code: "CCF73",
    sectionCode: "SEC_CAR_SCEN",
    dimensionCode: "DIM_COMM_INT",
    questionType: "forced_choice_4",
    questionText: "A business owner wants to know why profit changed. What would you prefer to do?",
    displayOrder: 73,
    isMandatory: true,
    scoringMethod: "WEIGHTED_OPTIONS",
    options: [
      {
        optionKey: "A",
        optionText: "Accounting, Audit & Tax pathway",
        scoreValue: 1.0,
        displayOrder: 1,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "B",
        optionText: "Finance, Investment & Banking pathway",
        scoreValue: 1.0,
        displayOrder: 2,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "C",
        optionText: "Business, Management & Entrepreneurship pathway",
        scoreValue: 1.0,
        displayOrder: 3,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "D",
        optionText: "Economics, Analytics & FinTech pathway",
        scoreValue: 1.0,
        displayOrder: 4,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
    ]
  },
  {
    code: "CCF74",
    sectionCode: "SEC_CAR_SCEN",
    dimensionCode: "DIM_COMM_INT",
    questionType: "forced_choice_4",
    questionText: "Which university project would you choose?",
    displayOrder: 74,
    isMandatory: true,
    scoringMethod: "WEIGHTED_OPTIONS",
    options: [
      {
        optionKey: "A",
        optionText: "Accounting, Audit & Tax pathway",
        scoreValue: 1.0,
        displayOrder: 1,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "B",
        optionText: "Finance, Investment & Banking pathway",
        scoreValue: 1.0,
        displayOrder: 2,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "C",
        optionText: "Business, Management & Entrepreneurship pathway",
        scoreValue: 1.0,
        displayOrder: 3,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "D",
        optionText: "Economics, Analytics & FinTech pathway",
        scoreValue: 1.0,
        displayOrder: 4,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
    ]
  },
  {
    code: "CCF75",
    sectionCode: "SEC_CAR_SCEN",
    dimensionCode: "DIM_COMM_INT",
    questionType: "forced_choice_4",
    questionText: "When a decision involves uncertainty, what is your preferred contribution?",
    displayOrder: 75,
    isMandatory: true,
    scoringMethod: "WEIGHTED_OPTIONS",
    options: [
      {
        optionKey: "A",
        optionText: "Accounting, Audit & Tax pathway",
        scoreValue: 1.0,
        displayOrder: 1,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "B",
        optionText: "Finance, Investment & Banking pathway",
        scoreValue: 1.0,
        displayOrder: 2,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "C",
        optionText: "Business, Management & Entrepreneurship pathway",
        scoreValue: 1.0,
        displayOrder: 3,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "D",
        optionText: "Economics, Analytics & FinTech pathway",
        scoreValue: 1.0,
        displayOrder: 4,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
    ]
  },
  {
    code: "CCF76",
    sectionCode: "SEC_CAR_SCEN",
    dimensionCode: "DIM_COMM_INT",
    questionType: "forced_choice_4",
    questionText: "Which career environment appeals to you most?",
    displayOrder: 76,
    isMandatory: true,
    scoringMethod: "WEIGHTED_OPTIONS",
    options: [
      {
        optionKey: "A",
        optionText: "Accounting, Audit & Tax pathway",
        scoreValue: 1.0,
        displayOrder: 1,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "B",
        optionText: "Finance, Investment & Banking pathway",
        scoreValue: 1.0,
        displayOrder: 2,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "C",
        optionText: "Business, Management & Entrepreneurship pathway",
        scoreValue: 1.0,
        displayOrder: 3,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "D",
        optionText: "Economics, Analytics & FinTech pathway",
        scoreValue: 1.0,
        displayOrder: 4,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
    ]
  },
  {
    code: "CCF77",
    sectionCode: "SEC_CAR_SCEN",
    dimensionCode: "DIM_COMM_INT",
    questionType: "forced_choice_4",
    questionText: "You find an error in a financial report just before submission. What attracts you most?",
    displayOrder: 77,
    isMandatory: true,
    scoringMethod: "WEIGHTED_OPTIONS",
    options: [
      {
        optionKey: "A",
        optionText: "Accounting, Audit & Tax pathway",
        scoreValue: 1.0,
        displayOrder: 1,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "B",
        optionText: "Finance, Investment & Banking pathway",
        scoreValue: 1.0,
        displayOrder: 2,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "C",
        optionText: "Business, Management & Entrepreneurship pathway",
        scoreValue: 1.0,
        displayOrder: 3,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "D",
        optionText: "Economics, Analytics & FinTech pathway",
        scoreValue: 1.0,
        displayOrder: 4,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
    ]
  },
  {
    code: "CCF78",
    sectionCode: "SEC_CAR_SCEN",
    dimensionCode: "DIM_COMM_INT",
    questionType: "forced_choice_4",
    questionText: "Which question would you most like to answer?",
    displayOrder: 78,
    isMandatory: true,
    scoringMethod: "WEIGHTED_OPTIONS",
    options: [
      {
        optionKey: "A",
        optionText: "Accounting, Audit & Tax pathway",
        scoreValue: 1.0,
        displayOrder: 1,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "B",
        optionText: "Finance, Investment & Banking pathway",
        scoreValue: 1.0,
        displayOrder: 2,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "C",
        optionText: "Business, Management & Entrepreneurship pathway",
        scoreValue: 1.0,
        displayOrder: 3,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "D",
        optionText: "Economics, Analytics & FinTech pathway",
        scoreValue: 1.0,
        displayOrder: 4,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
    ]
  },
  {
    code: "CCF79",
    sectionCode: "SEC_CAR_SCEN",
    dimensionCode: "DIM_COMM_INT",
    questionType: "forced_choice_4",
    questionText: "A team has a difficult business problem. Which role fits you best?",
    displayOrder: 79,
    isMandatory: true,
    scoringMethod: "WEIGHTED_OPTIONS",
    options: [
      {
        optionKey: "A",
        optionText: "Accounting, Audit & Tax pathway",
        scoreValue: 1.0,
        displayOrder: 1,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "B",
        optionText: "Finance, Investment & Banking pathway",
        scoreValue: 1.0,
        displayOrder: 2,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "C",
        optionText: "Business, Management & Entrepreneurship pathway",
        scoreValue: 1.0,
        displayOrder: 3,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "D",
        optionText: "Economics, Analytics & FinTech pathway",
        scoreValue: 1.0,
        displayOrder: 4,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
    ]
  },
  {
    code: "CCF80",
    sectionCode: "SEC_CAR_SCEN",
    dimensionCode: "DIM_COMM_INT",
    questionType: "forced_choice_4",
    questionText: "Which outcome would make you most proud?",
    displayOrder: 80,
    isMandatory: true,
    scoringMethod: "WEIGHTED_OPTIONS",
    options: [
      {
        optionKey: "A",
        optionText: "Accounting, Audit & Tax pathway",
        scoreValue: 1.0,
        displayOrder: 1,
        metadata: {
          familyCode: "ACCOUNTING_AUDIT_TAX"
        }
      },
      {
        optionKey: "B",
        optionText: "Finance, Investment & Banking pathway",
        scoreValue: 1.0,
        displayOrder: 2,
        metadata: {
          familyCode: "FINANCE_INVESTMENT_BANKING"
        }
      },
      {
        optionKey: "C",
        optionText: "Business, Management & Entrepreneurship pathway",
        scoreValue: 1.0,
        displayOrder: 3,
        metadata: {
          familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
        }
      },
      {
        optionKey: "D",
        optionText: "Economics, Analytics & FinTech pathway",
        scoreValue: 1.0,
        displayOrder: 4,
        metadata: {
          familyCode: "ECONOMICS_ANALYTICS_FINTECH"
        }
      },
    ]
  },
];
