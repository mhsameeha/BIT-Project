import dayjs from 'dayjs';

// Types
export interface TutorEducation {
  degree: string;
  institution: string;
  year: string;
}

export interface TutorExperience {
  position: string;
  company: string;
  duration: string;
  description: string;
}

export interface TutorAvailability {
  day: string;
  timeSlots: string[];
}

export interface TutorData {
  id: string;
  name: string;
  avatar: string;
  title: string;
  specialties: string[];
  description: string;
  education: TutorEducation[];
  experience: TutorExperience[];
  rating: number;
  reviewCount: number;
  sessionsCompleted: number;
  hourlyRate: number;
  currency: string;
  languages: string[];
  availability: TutorAvailability[];
  isAvailable: boolean;
  joinedDate: Date;
}

export const TUTORS_DATA: Record<string, TutorData> = {
  'TUTOR-001': {
    id: 'TUTOR-001',
    name: 'Dr. Nimali Perera',
    avatar: '/assets/avatar-1.png',
    title: 'Senior Python Developer & Programming Instructor',
    specialties: ['Python Programming', 'Software Development', 'Data Structures', 'Algorithms'],
    description: 'Experienced Python developer with 8+ years in software development and 5+ years in teaching. Specialized in helping beginners master programming fundamentals and advance to intermediate level.',
    education: [
      {
        degree: 'PhD in Computer Science',
        institution: 'University of Colombo',
        year: '2015'
      },
      {
        degree: 'MSc in Software Engineering',
        institution: 'University of Moratuwa',
        year: '2011'
      }
    ],
    experience: [
      {
        position: 'Senior Software Engineer',
        company: 'TechCorp Solutions',
        duration: '2018 - Present',
        description: 'Lead Python development projects and mentor junior developers'
      },
      {
        position: 'Programming Instructor',
        company: 'CodeAcademy Sri Lanka',
        duration: '2019 - Present',
        description: 'Teaching Python programming to students from beginner to advanced levels'
      }
    ],
    rating: 4.9,
    reviewCount: 156,
    sessionsCompleted: 342,
    hourlyRate: 3500,
    currency: 'LKR',
    languages: ['English', 'Sinhala'],
    availability: [
      {
        day: 'Monday',
        timeSlots: ['09:00 AM', '10:00 AM', '02:00 PM', '03:00 PM', '04:00 PM']
      },
      {
        day: 'Wednesday',
        timeSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM']
      },
      {
        day: 'Friday',
        timeSlots: ['09:00 AM', '10:00 AM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM']
      },
      {
        day: 'Saturday',
        timeSlots: ['10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM']
      }
    ],
    isAvailable: true,
    joinedDate: dayjs().subtract(2, 'year').toDate()
  },
  'TUTOR-002': {
    id: 'TUTOR-002',
    name: 'Mark Thompson',
    avatar: '/assets/avatar-6.png',
    title: 'QA Lead & Software Testing Expert',
    specialties: ['Software Testing', 'Quality Assurance', 'Test Automation', 'Manual Testing'],
    description: 'Quality Assurance professional with 10+ years of experience in software testing across various industries. Expert in both manual and automated testing methodologies.',
    education: [
      {
        degree: 'MSc in Software Quality Assurance',
        institution: 'University of Westminster',
        year: '2013'
      },
      {
        degree: 'BSc in Computer Science',
        institution: 'University of London',
        year: '2011'
      }
    ],
    experience: [
      {
        position: 'QA Lead',
        company: 'GlobalTech Solutions',
        duration: '2020 - Present',
        description: 'Leading QA team and implementing testing strategies for enterprise applications'
      },
      {
        position: 'Senior QA Engineer',
        company: 'InnovateSoft',
        duration: '2016 - 2020',
        description: 'Developed comprehensive testing frameworks and mentored junior testers'
      }
    ],
    rating: 4.8,
    reviewCount: 89,
    sessionsCompleted: 198,
    hourlyRate: 4000,
    currency: 'LKR',
    languages: ['English'],
    availability: [
      {
        day: 'Tuesday',
        timeSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM']
      },
      {
        day: 'Thursday',
        timeSlots: ['09:00 AM', '10:00 AM', '02:00 PM', '03:00 PM', '04:00 PM']
      },
      {
        day: 'Saturday',
        timeSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM']
      }
    ],
    isAvailable: true,
    joinedDate: dayjs().subtract(1, 'year').subtract(6, 'month').toDate()
  },
  'TUTOR-003': {
    id: 'TUTOR-003',
    name: 'Alex Rodriguez',
    avatar: '/assets/avatar-9.png',
    title: 'Full-Stack JavaScript Developer',
    specialties: ['JavaScript', 'React', 'Node.js', 'Web Development', 'ES6+'],
    description: 'Passionate JavaScript developer with expertise in modern web technologies. Specialized in React, Node.js, and helping students build real-world web applications.',
    education: [
      {
        degree: 'BSc in Computer Science',
        institution: 'Stanford University',
        year: '2016'
      },
      {
        degree: 'Certified React Developer',
        institution: 'Meta (Facebook)',
        year: '2018'
      }
    ],
    experience: [
      {
        position: 'Senior Full-Stack Developer',
        company: 'WebFlow Solutions',
        duration: '2019 - Present',
        description: 'Building scalable web applications using React and Node.js'
      },
      {
        position: 'JavaScript Instructor',
        company: 'CodeBootcamp Online',
        duration: '2020 - Present',
        description: 'Teaching modern JavaScript and React to aspiring developers'
      }
    ],
    rating: 4.7,
    reviewCount: 234,
    sessionsCompleted: 456,
    hourlyRate: 4500,
    currency: 'LKR',
    languages: ['English', 'Spanish'],
    availability: [
      {
        day: 'Monday',
        timeSlots: ['11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM']
      },
      {
        day: 'Tuesday',
        timeSlots: ['09:00 AM', '10:00 AM', '02:00 PM', '03:00 PM']
      },
      {
        day: 'Thursday',
        timeSlots: ['11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM']
      },
      {
        day: 'Friday',
        timeSlots: ['09:00 AM', '10:00 AM', '11:00 AM']
      }
    ],
    isAvailable: true,
    joinedDate: dayjs().subtract(1, 'year').subtract(2, 'month').toDate()
  },
  'TUTOR-004': {
    id: 'TUTOR-004',
    name: 'Prof. Chandana Ratnayake',
    avatar: '/assets/avatar-11.png',
    title: 'Mathematics Professor & Calculus Expert',
    specialties: ['Calculus', 'Linear Algebra', 'Mathematical Analysis', 'Applied Mathematics'],
    description: 'Professor of Mathematics with 15+ years of teaching experience. Specialized in making complex mathematical concepts accessible and engaging for students.',
    education: [
      {
        degree: 'PhD in Mathematics',
        institution: 'University of Peradeniya',
        year: '2008'
      },
      {
        degree: 'MSc in Applied Mathematics',
        institution: 'University of Colombo',
        year: '2004'
      }
    ],
    experience: [
      {
        position: 'Professor of Mathematics',
        company: 'University of Peradeniya',
        duration: '2015 - Present',
        description: 'Teaching undergraduate and graduate mathematics courses'
      },
      {
        position: 'Mathematics Tutor',
        company: 'MathGenius Institute',
        duration: '2010 - Present',
        description: 'Private tutoring for advanced level and university mathematics'
      }
    ],
    rating: 4.9,
    reviewCount: 178,
    sessionsCompleted: 298,
    hourlyRate: 3000,
    currency: 'LKR',
    languages: ['English', 'Sinhala'],
    availability: [
      {
        day: 'Monday',
        timeSlots: ['08:00 AM', '09:00 AM', '10:00 AM']
      },
      {
        day: 'Wednesday',
        timeSlots: ['08:00 AM', '09:00 AM', '10:00 AM', '02:00 PM']
      },
      {
        day: 'Friday',
        timeSlots: ['08:00 AM', '09:00 AM', '10:00 AM', '02:00 PM', '03:00 PM']
      }
    ],
    isAvailable: true,
    joinedDate: dayjs().subtract(3, 'year').toDate()
  },
  'TUTOR-005': {
    id: 'TUTOR-005',
    name: 'Dr. Emily Watson',
    avatar: '/assets/avatar-2.png',
    title: 'Data Science & Linear Algebra Specialist',
    specialties: ['Linear Algebra', 'Data Science', 'Machine Learning Math', 'Statistics'],
    description: 'Data scientist and mathematician with expertise in linear algebra applications in machine learning. Helps students understand the mathematical foundations of AI and data science.',
    education: [
      {
        degree: 'PhD in Data Science',
        institution: 'MIT',
        year: '2014'
      },
      {
        degree: 'MSc in Mathematics',
        institution: 'Harvard University',
        year: '2010'
      }
    ],
    experience: [
      {
        position: 'Lead Data Scientist',
        company: 'DataCorp Analytics',
        duration: '2018 - Present',
        description: 'Leading data science projects and developing ML algorithms'
      },
      {
        position: 'Mathematics for ML Instructor',
        company: 'AI Academy',
        duration: '2020 - Present',
        description: 'Teaching mathematical foundations of machine learning'
      }
    ],
    rating: 4.8,
    reviewCount: 145,
    sessionsCompleted: 267,
    hourlyRate: 5000,
    currency: 'LKR',
    languages: ['English'],
    availability: [
      {
        day: 'Tuesday',
        timeSlots: ['10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM']
      },
      {
        day: 'Thursday',
        timeSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM']
      },
      {
        day: 'Saturday',
        timeSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM']
      }
    ],
    isAvailable: true,
    joinedDate: dayjs().subtract(2, 'year').subtract(3, 'month').toDate()
  },
  'TUTOR-006': {
    id: 'TUTOR-006',
    name: 'Jessica Miller',
    avatar: '/assets/avatar-3.png',
    title: 'Creative Director & Photoshop Expert',
    specialties: ['Adobe Photoshop', 'Graphic Design', 'Digital Art', 'Photo Editing'],
    description: 'Creative professional with 12+ years of experience in graphic design and digital art. Expert in Adobe Creative Suite with a passion for teaching creative skills.',
    education: [
      {
        degree: 'MFA in Graphic Design',
        institution: 'Rhode Island School of Design',
        year: '2011'
      },
      {
        degree: 'Adobe Certified Expert',
        institution: 'Adobe Systems',
        year: '2015'
      }
    ],
    experience: [
      {
        position: 'Creative Director',
        company: 'DesignStudio Pro',
        duration: '2017 - Present',
        description: 'Leading creative teams and managing high-profile design projects'
      },
      {
        position: 'Photoshop Instructor',
        company: 'CreativeSkills Academy',
        duration: '2019 - Present',
        description: 'Teaching Photoshop and digital design to students of all levels'
      }
    ],
    rating: 4.7,
    reviewCount: 203,
    sessionsCompleted: 387,
    hourlyRate: 3800,
    currency: 'LKR',
    languages: ['English'],
    availability: [
      {
        day: 'Monday',
        timeSlots: ['01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM']
      },
      {
        day: 'Wednesday',
        timeSlots: ['01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM']
      },
      {
        day: 'Friday',
        timeSlots: ['01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM']
      },
      {
        day: 'Sunday',
        timeSlots: ['10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM']
      }
    ],
    isAvailable: true,
    joinedDate: dayjs().subtract(1, 'year').subtract(8, 'month').toDate()
  },
  'TUTOR-007': {
    id: 'TUTOR-007',
    name: 'Kiran Fernando',
    avatar: '/assets/avatar-4.png',
    title: 'UX/UI Design Lead',
    specialties: ['UI/UX Design', 'Figma', 'Design Thinking', 'User Research', 'Prototyping'],
    description: 'UX/UI designer with extensive experience in creating user-centered digital experiences. Expert in design thinking methodology and modern design tools.',
    education: [
      {
        degree: 'MSc in Human-Computer Interaction',
        institution: 'University of Moratuwa',
        year: '2016'
      },
      {
        degree: 'Google UX Design Certificate',
        institution: 'Google',
        year: '2020'
      }
    ],
    experience: [
      {
        position: 'Senior UX/UI Designer',
        company: 'DigitalCraft Solutions',
        duration: '2018 - Present',
        description: 'Designing user experiences for web and mobile applications'
      },
      {
        position: 'Design Mentor',
        company: 'UX Bootcamp Lanka',
        duration: '2021 - Present',
        description: 'Mentoring aspiring designers and teaching UX methodology'
      }
    ],
    rating: 4.8,
    reviewCount: 167,
    sessionsCompleted: 234,
    hourlyRate: 4200,
    currency: 'LKR',
    languages: ['English', 'Sinhala', 'Tamil'],
    availability: [
      {
        day: 'Tuesday',
        timeSlots: ['09:00 AM', '10:00 AM', '11:00 AM']
      },
      {
        day: 'Thursday',
        timeSlots: ['09:00 AM', '10:00 AM', '02:00 PM', '03:00 PM']
      },
      {
        day: 'Saturday',
        timeSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM']
      },
      {
        day: 'Sunday',
        timeSlots: ['10:00 AM', '11:00 AM', '02:00 PM']
      }
    ],
    isAvailable: true,
    joinedDate: dayjs().subtract(1, 'year').subtract(4, 'month').toDate()
  },
  'TUTOR-008': {
    id: 'TUTOR-008',
    name: 'Robert Anderson',
    avatar: '/assets/avatar-5.png',
    title: '.NET Developer & C# Expert',
    specialties: ['C# Programming', '.NET Framework', 'ASP.NET', 'Object-Oriented Programming'],
    description: 'Senior .NET developer with 10+ years of experience building enterprise applications. Specialized in C# programming and helping developers master object-oriented concepts.',
    education: [
      {
        degree: 'MSc in Software Engineering',
        institution: 'University of Washington',
        year: '2013'
      },
      {
        degree: 'Microsoft Certified Professional',
        institution: 'Microsoft',
        year: '2015'
      }
    ],
    experience: [
      {
        position: 'Senior .NET Developer',
        company: 'EnterpriseCore Systems',
        duration: '2016 - Present',
        description: 'Developing scalable enterprise applications using .NET technologies'
      },
      {
        position: 'C# Programming Instructor',
        company: 'TechEducate Institute',
        duration: '2018 - Present',
        description: 'Teaching C# and .NET development to professionals and students'
      }
    ],
    rating: 4.6,
    reviewCount: 134,
    sessionsCompleted: 189,
    hourlyRate: 4300,
    currency: 'LKR',
    languages: ['English'],
    availability: [
      {
        day: 'Monday',
        timeSlots: ['09:00 AM', '10:00 AM', '03:00 PM', '04:00 PM']
      },
      {
        day: 'Wednesday',
        timeSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '03:00 PM']
      },
      {
        day: 'Friday',
        timeSlots: ['09:00 AM', '10:00 AM', '03:00 PM', '04:00 PM', '05:00 PM']
      }
    ],
    isAvailable: true,
    joinedDate: dayjs().subtract(2, 'year').subtract(1, 'month').toDate()
  }
};

// Helper function to get tutor by ID
export const getTutorData = (id: string): TutorData | null => {
  return TUTORS_DATA[id] || null;
};

// Helper function to get all tutors as array
export const getAllTutors = (): TutorData[] => {
  return Object.values(TUTORS_DATA);
};

// Helper function to get tutors by specialty
export const getTutorsBySpecialty = (specialty: string): TutorData[] => {
  return getAllTutors().filter(tutor => 
    tutor.specialties.some(s => s.toLowerCase().includes(specialty.toLowerCase()))
  );
};

// Helper function to search tutors
export const searchTutors = (query: string): TutorData[] => {
  const lowercaseQuery = query.toLowerCase();
  return getAllTutors().filter(tutor => 
    tutor.name.toLowerCase().includes(lowercaseQuery) ||
    tutor.title.toLowerCase().includes(lowercaseQuery) ||
    tutor.description.toLowerCase().includes(lowercaseQuery) ||
    tutor.specialties.some(s => s.toLowerCase().includes(lowercaseQuery)) ||
    tutor.education.some(e => 
      e.degree.toLowerCase().includes(lowercaseQuery) ||
      e.institution.toLowerCase().includes(lowercaseQuery)
    )
  );
};

// Get unique specialties for filter options
export const getAllSpecialties = (): string[] => {
  const specialties = new Set<string>();
  getAllTutors().forEach(tutor => {
    tutor.specialties.forEach(specialty => specialties.add(specialty));
  });
  return Array.from(specialties).sort();
};
