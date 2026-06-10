const publicContent = {
  hero: {
    title: 'Global Institute of Information Technology & Business',
    badge: 'Makerere, Uganda',
    subtitle: "Kampala & Uganda's leading tertiary institution for practical, future-ready learning.",
    tagline:
      'Cutting-edge skills, innovative learning, and limitless opportunities for Uganda and beyond.',
    typewriter: [
      'Practical skills for tomorrow’s economy.',
      'Flexible, blended, and beautifully engaging learning.',
      'Build momentum. Track progress. Celebrate every milestone.',
    ],
    ctas: [
      { label: 'Apply Now', href: '/register' },
      { label: 'Explore Programmes', href: '/programmes' },
    ],
  },
  about: {
    headline: 'Get ready for the future',
    body:
      'Gi-IT is a leading talent development institution, building skilled manpower for national and global industry requirements with practical, tech-driven and flexible study models.',
    whoWeAre:
      'Gi-IT is a leading talent development institution, building skilled manpower for national and global industry requirements with practical, tech-driven and flexible study models.',
    mission:
      'To provide cutting-edge tech-driven and practical skills training that meets current and emerging global industry requirements.',
    vision: 'To be a leading institution of higher learning nationally and globally.',
    values: ['Excellence', 'Practicality', 'Flexibility', 'Innovation', 'Professional Growth'],
    highlights: [
      'Morning, afternoon, evening, weekend and online study options',
      'Certificate, diploma and joint degree pathways',
      'Industry-relevant, hands-on assessment and mentorship',
      'Admissions open for January, May and September intakes',
    ],
    objectives:
      'To partner with young aspiring students, professionals, institutions of higher learning and government to provide practical skills in IT, business and management with strong employability outcomes.',
    flexibility:
      'Morning, afternoon, evening, weekend and online programmes designed to fit busy schedules.',
    impact: 'Over the past decade, GIIT has equipped over 5,000 students with the skills to thrive in IT and business industries.',
  },
  contact: {
    address: 'P.O.Box 16759, Kampala, Uganda - Haruna Towers, Wandegeya',
    phone: '+256 776 945 602',
    altPhone: '+256 725 163 54',
    email: 'info@giit.ac.ug',
    campus: 'Makerere, Kampala, Uganda',
  },
  admissions: {
    duration:
      'Diploma and Certificate programmes run for two years as required by the National Council for Higher Education (NCHE) and are examined by UBTEB and DIT.',
    intakes: 'Three intakes per year: January, May and September. Admissions are open any time.',
    application:
      'Apply online or in person at Kampala campus in Wandegeya and Jinja City campus at Light Arcade Plot 80, Main Street.',
    applicationFee: 'UGX 50,000',
  },
  stats: [
    { label: 'Graduates Trained', value: 1200 },
    { label: 'Practical Courses', value: 30 },
    { label: 'Years of Excellence', value: 15 },
    { label: 'Student Satisfaction', value: 98, suffix: '%' },
  ],
  testimonials: [
    {
      name: 'Christine Katongole',
      cohort: 'Class of 2024',
      programme: 'Diploma in Journalism & Mass Communication',
      role: 'Digital Marketing Manager, Automotive Firm, Nansana-Wakiso',
      quote:
        'Studying at Global Institute Makerere changed everything for me. The training was intellectually rich and incredibly hands-on — exactly what the real world demands.',
    },
    {
      name: 'Aloysius Okanya',
      cohort: 'Class of 2020',
      programme: 'Diploma in Information Technology',
      role: 'CEO, GenX IT – Bukedea District',
      quote:
        'Global Institute gave me a lifeline and practical skills that transformed financial limitations into a launchpad for entrepreneurship.',
    },
    {
      name: 'Josh Byamu',
      cohort: 'Class of 2019',
      programme: 'Certificate in Accounting & Finance',
      role: 'Accounts Assistant, Regional Agro Supplies Ltd – Masaka',
      quote:
        'Global helped me find my purpose and gave me the practical tools to succeed in the workplace.',
    },
  ],
  news: [
    {
      title: 'Masterclass in Audio Technology Offers Essential Skills for Job Opportunities in Uganda',
      date: '2025-11-04',
      excerpt:
        'Aspiring sound engineers, AV technicians, event staff and content creators can elevate their skills through GIIT’s audio tech essentials masterclass.',
    },
    {
      title: 'Global Institute Makerere launches blended online skilling',
      date: '2025-07-22',
      excerpt:
        'GIIT unveiled a new blended learning model aimed at redefining practical skills acquisition for modern learners.',
    },
    {
      title: 'Director Ben Opolot highlights GIIT’s practical education vision at the 6th graduation',
      date: '2025-06-09',
      excerpt:
        'GIIT reaffirmed its commitment to experiential learning and employability at the institution’s graduation ceremony.',
    },
  ],
  partnerships: ['DIT Uganda', 'Ministry of Education & Sports', 'UBTEB', 'New Vision', 'Uganda Reading'],
};

const programmeCatalog = [
  {
    title: 'Business Administration',
    category: 'Career Program',
    department: 'Business Studies',
    level: 'Diploma',
    code: 'DBA|CBA',
    duration: '2 years',
    price: 650000,
    seats: 49,
    credits: 3,
    description:
      "Business competitiveness drives economic growth and sustainability. This programme trains skilled lower-level cadres to strengthen Uganda's business landscape.",
  },
  {
    title: 'Cyber Security',
    category: 'Career Program',
    department: 'Computer & IT',
    level: 'Diploma',
    code: 'CSIT',
    duration: '2 years',
    price: 700000,
    seats: 80,
    credits: 4,
    description:
      'A practical course covering threat identification, risk management, access control, network security and safe computing practices.',
  },
  {
    title: 'Software Engineering',
    category: 'Career Program',
    department: 'Computer & IT',
    level: 'Diploma',
    code: 'SDLC',
    duration: '2 years',
    price: 700000,
    seats: 60,
    credits: 4,
    description:
      'Learners build software systems through requirements analysis, system design, coding, testing, deployment and maintenance.',
  },
  {
    title: 'Journalism & Mass Communication',
    category: 'Career Program',
    department: 'Media Studies',
    level: 'Diploma',
    code: 'DMCJ|CMCJ',
    duration: '2 years',
    price: 600000,
    seats: 100,
    credits: 4,
    description:
      'Trains skilled journalists to manage the fast-growing information ecosystem enabled by mobile and internet technologies.',
  },
  {
    title: 'Information Technology',
    category: 'Career Program',
    department: 'Computer & IT',
    level: 'Diploma',
    code: 'DIT|CIT',
    duration: '2 years',
    price: 500000,
    seats: 100,
    credits: 4,
    description:
      'Practical ICT skills for installing, managing and troubleshooting computer systems, preparing learners for ICT support roles.',
  },
  {
    title: 'Procurement & Supply Chain Management',
    category: 'Career Program',
    department: 'Business Studies',
    level: 'Diploma',
    code: 'DPSM|CPSM',
    duration: '2 years',
    price: 450000,
    seats: 100,
    credits: 4,
    description:
      'Builds a strong background in procurement, stores management, logistics, supply chain and related fields.',
  },
  {
    title: 'Computer Applications',
    category: 'Short Course',
    department: 'Computer & IT',
    level: 'Short Course',
    code: 'CAU',
    duration: '3 months',
    price: 400000,
    seats: 100,
    credits: 2,
    description:
      'Hands-on training in essential computer skills and productivity applications for personal, academic and workplace success.',
  },
];

module.exports = { publicContent, programmeCatalog };
