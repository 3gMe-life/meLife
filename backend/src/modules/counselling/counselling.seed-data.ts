/**
 * 3G MeLife Curated Certified Counsellors Seed Data
 */

export interface SeedCounsellorData {
  userEmail: string;
  firstName: string;
  lastName: string;
  qualification: string;
  experienceYears: number;
  bio: string;
  specialisations: string[];
  languages: string[];
  profileImage: string;
  rating: number;
  reviewCount: number;
  guidanceAreas: string[];
  availability: Array<{
    day: string;
    startTime: string;
    endTime: string;
  }>;
  reviews: Array<{
    studentName: string;
    rating: number;
    comment: string;
    date: string;
  }>;
}

export const SEED_COUNSELLORS: SeedCounsellorData[] = [
  {
    userEmail: "anjali.menon@melife.org",
    firstName: "Dr. Anjali",
    lastName: "Menon",
    qualification: "PhD in Educational & Career Psychology, UCLA",
    experienceYears: 8,
    bio: "Passionate about empowering high school and university students to uncover their natural cognitive affinities. Specialises in STEM, AI, and computing trajectories with over 1,200 successful student consultations.",
    specialisations: [
      "School Career Guidance",
      "STEM & Technology Careers",
      "Higher Education Advisory",
      "Cognitive Aptitude Alignment",
    ],
    languages: ["English", "Malayalam", "Hindi"],
    profileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewCount: 142,
    guidanceAreas: [
      "Secondary to Higher Secondary Stream Selection",
      "STEM vs Applied Technology Degree Paths",
      "AI & Data Science Skill Roadmaps",
      "Psychometric Assessment Debriefing",
    ],
    availability: [
      { day: "Monday", startTime: "09:00", endTime: "17:00" },
      { day: "Tuesday", startTime: "09:00", endTime: "17:00" },
      { day: "Wednesday", startTime: "09:00", endTime: "17:00" },
      { day: "Thursday", startTime: "09:00", endTime: "17:00" },
      { day: "Saturday", startTime: "10:00", endTime: "14:00" },
    ],
    reviews: [
      {
        studentName: "Aarav S.",
        rating: 5,
        comment: "Dr. Anjali clearly decoded my Skill Finder results. Her advice on selecting Physics and Math for high school removed all my confusion!",
        date: "2026-08-15",
      },
      {
        studentName: "Meera K.",
        rating: 5,
        comment: "Very empathetic and structured session. She helped me align my investigative interests with emerging AI career paths.",
        date: "2026-08-02",
      },
    ],
  },
  {
    userEmail: "rajesh.nambiar@melife.org",
    firstName: "Rajesh",
    lastName: "Nambiar",
    qualification: "MBA, Certified Global Career Analyst (NCDA)",
    experienceYears: 10,
    bio: "Senior career advisor specializing in commerce, finance, fintech, entrepreneurship, and strategic leadership pathways. Helps students transition from analytical curiosity to high-impact career planning.",
    specialisations: [
      "Business & Financial Technology",
      "Quantitative Economics",
      "Strategic Management",
      "Global University Admissions",
    ],
    languages: ["English", "Hindi", "Tamil"],
    profileImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewCount: 189,
    guidanceAreas: [
      "Commerce vs Economics Stream Advisory",
      "Undergraduate Business & FinTech Applications",
      "Leadership & Interpersonal Skill Cultivation",
      "Internship & Portfolio Strategy",
    ],
    availability: [
      { day: "Monday", startTime: "10:00", endTime: "18:00" },
      { day: "Tuesday", startTime: "10:00", endTime: "18:00" },
      { day: "Thursday", startTime: "10:00", endTime: "18:00" },
      { day: "Friday", startTime: "10:00", endTime: "18:00" },
    ],
    reviews: [
      {
        studentName: "Karthik R.",
        rating: 5,
        comment: "Rajesh sir was fantastic. He explained how Quantitative Economics fits my mathematical strengths and social interests.",
        date: "2026-08-20",
      },
    ],
  },
  {
    userEmail: "sarah.mansoor@melife.org",
    firstName: "Sarah",
    lastName: "Al-Mansoor",
    qualification: "MSc in Human-Centred Design & Psychology, UCL",
    experienceYears: 7,
    bio: "Specialist in creative technologies, UI/UX architecture, digital arts, media communication, and modern design ecosystems. Helps artistic and investigative students build meaningful creative futures.",
    specialisations: [
      "UX & Creative Technology",
      "Design & Visual Arts",
      "Media & Communication",
      "Creative Portfolio Guidance",
    ],
    languages: ["English", "Arabic"],
    profileImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewCount: 96,
    guidanceAreas: [
      "Design School Entrance Guidance",
      "UX/UI Career Roadmaps",
      "Artistic-Investigative Archetype Synthesis",
      "Digital Creative Industry Outlook",
    ],
    availability: [
      { day: "Tuesday", startTime: "11:00", endTime: "19:00" },
      { day: "Wednesday", startTime: "11:00", endTime: "19:00" },
      { day: "Thursday", startTime: "11:00", endTime: "19:00" },
      { day: "Sunday", startTime: "10:00", endTime: "16:00" },
    ],
    reviews: [
      {
        studentName: "Fatima Z.",
        rating: 5,
        comment: "Sarah helped me see how my spatial ability and artistic traits connect to interactive product design. Truly inspiring!",
        date: "2026-07-28",
      },
    ],
  },
  {
    userEmail: "david.chen@melife.org",
    firstName: "Dr. David",
    lastName: "Chen",
    qualification: "MD, MSc in Bio-Informatics & Genetic Analytics, Johns Hopkins",
    experienceYears: 12,
    bio: "Medical and life sciences career strategist. Mentors aspiring doctors, bio-informaticians, clinical researchers, and environmental scientists navigating global healthcare and pure science educational tracks.",
    specialisations: [
      "Healthcare & Medicine",
      "Biomedical Data Science",
      "Pure & Applied Sciences",
      "Clinical Research Tracks",
    ],
    languages: ["English", "Kannada", "Hindi"],
    profileImage: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80",
    rating: 5.0,
    reviewCount: 165,
    guidanceAreas: [
      "Pre-Med & Healthcare Curriculum Planning",
      "Biotechnology vs Clinical Medicine Pathways",
      "Research Apprenticeship Strategy",
      "Scientific Aptitude Maximization",
    ],
    availability: [
      { day: "Monday", startTime: "13:00", endTime: "19:00" },
      { day: "Wednesday", startTime: "13:00", endTime: "19:00" },
      { day: "Friday", startTime: "13:00", endTime: "19:00" },
      { day: "Saturday", startTime: "09:00", endTime: "15:00" },
    ],
    reviews: [
      {
        studentName: "Devika N.",
        rating: 5,
        comment: "Dr. Chen's breakdown of Biomedical Data Science versus Traditional Medicine gave me crystal clear focus for college applications.",
        date: "2026-08-10",
      },
    ],
  },
];
