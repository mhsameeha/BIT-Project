import dayjs from 'dayjs';

// Types
export interface Lesson {
  id: number;
  title: string;
  duration: string;
}

export interface CurriculumSection {
  id: number;
  title: string;
  duration: string;
  lessons: Lesson[];
}

export interface Review {
  id: number;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: Date;
}

export interface CourseData {
  id: string;
  title: string;
  description: string;
  level: string;
  category: string;
  tutorName: string;
  tutorAvatar: string;
  logo: string;
  enrolledStudents: number;
  rating: number;
  reviewCount: number;
  fee: number;
  currency: string;
  updatedAt: Date;
  curriculum: CurriculumSection[];
  reviews: Review[];
}

export const COURSES_DATA: Record<string, CourseData> = {
  'INTEG-001': {
    id: 'INTEG-001',
    title: 'Introduction to Programming',
    description: 'Learn the basics of programming using Python. Ideal for complete beginners.',
    level: 'Beginner',
    category: 'Programming',
    tutorName: 'Dr. Nimali Perera',
    tutorAvatar: '/assets/avatar-1.png',
    logo: '/assets/logo-python.png',
    enrolledStudents: 594,
    rating: 4.5,
    reviewCount: 127,
    fee: 15000,
    currency: 'LKR',
    updatedAt: dayjs().subtract(12, 'minute').toDate(),
    curriculum: [
      {
        id: 1,
        title: 'Getting Started with Python',
        duration: '45 min',
        lessons: [
          { id: 1, title: 'What is Programming?', duration: '8 min' },
          { id: 2, title: 'Installing Python', duration: '12 min' },
          { id: 3, title: 'Your First Python Program', duration: '15 min' },
          { id: 4, title: 'Understanding Variables', duration: '10 min' }
        ]
      },
      {
        id: 2,
        title: 'Basic Programming Concepts',
        duration: '1hr 20min',
        lessons: [
          { id: 5, title: 'Data Types in Python', duration: '20 min' },
          { id: 6, title: 'Working with Strings', duration: '25 min' },
          { id: 7, title: 'Numbers and Math Operations', duration: '18 min' },
          { id: 8, title: 'Boolean Logic', duration: '17 min' }
        ]
      },
      {
        id: 3,
        title: 'Control Structures',
        duration: '1hr 35min',
        lessons: [
          { id: 9, title: 'If Statements', duration: '22 min' },
          { id: 10, title: 'Loops - For and While', duration: '28 min' },
          { id: 11, title: 'Nested Loops', duration: '20 min' },
          { id: 12, title: 'Break and Continue', duration: '15 min' },
          { id: 13, title: 'Practice Exercises', duration: '10 min' }
        ]
      }
    ],
    reviews: [
      {
        id: 1,
        userName: 'Kasun Silva',
        userAvatar: '/assets/avatar-2.png',
        rating: 5,
        comment: 'Excellent course for beginners! Dr. Perera explains everything clearly and the hands-on exercises really help solidify the concepts.',
        date: dayjs().subtract(2, 'day').toDate()
      },
      {
        id: 2,
        userName: 'Sarah Johnson',
        userAvatar: '/assets/avatar-3.png',
        rating: 4,
        comment: 'Great introduction to programming. The pace is perfect for someone with no prior experience. Would recommend!',
        date: dayjs().subtract(1, 'week').toDate()
      },
      {
        id: 3,
        userName: 'Michael Davis',
        userAvatar: '/assets/avatar-4.png',
        rating: 5,
        comment: 'This course gave me the confidence to start my programming journey. The projects are practical and engaging.',
        date: dayjs().subtract(2, 'week').toDate()
      },
      {
        id: 4,
        userName: 'Emily Chen',
        userAvatar: '/assets/avatar-5.png',
        rating: 4,
        comment: 'Very well structured course. The instructor is knowledgeable and responsive to questions.',
        date: dayjs().subtract(3, 'week').toDate()
      }
    ]
  },
  'INTEG-002': {
    id: 'INTEG-002',
    title: 'Software Testing & Quality Assurance',
    description: 'Understand the fundamentals of software testing including test cases, manual & automated testing tools.',
    level: 'Beginner–Intermediate',
    category: 'Programming',
    tutorName: 'Mark Thompson',
    tutorAvatar: '/assets/avatar-6.png',
    logo: '/assets/qa.png',
    enrolledStudents: 594,
    rating: 4.3,
    reviewCount: 89,
    fee: 18000,
    currency: 'LKR',
    updatedAt: dayjs().subtract(12, 'minute').toDate(),
    curriculum: [
      {
        id: 1,
        title: 'Introduction to Software Testing',
        duration: '1hr 10min',
        lessons: [
          { id: 1, title: 'What is Software Testing?', duration: '15 min' },
          { id: 2, title: 'Types of Testing', duration: '20 min' },
          { id: 3, title: 'Testing Life Cycle', duration: '25 min' },
          { id: 4, title: 'Quality Assurance vs Testing', duration: '10 min' }
        ]
      },
      {
        id: 2,
        title: 'Manual Testing Fundamentals',
        duration: '2hr 15min',
        lessons: [
          { id: 5, title: 'Writing Test Cases', duration: '30 min' },
          { id: 6, title: 'Test Execution', duration: '25 min' },
          { id: 7, title: 'Bug Reporting', duration: '40 min' },
          { id: 8, title: 'Test Documentation', duration: '40 min' }
        ]
      }
    ],
    reviews: [
      {
        id: 1,
        userName: 'Alex Johnson',
        userAvatar: '/assets/avatar-7.png',
        rating: 4,
        comment: 'Good coverage of testing fundamentals. The practical examples are very helpful.',
        date: dayjs().subtract(3, 'day').toDate()
      },
      {
        id: 2,
        userName: 'Lisa Rodriguez',
        userAvatar: '/assets/avatar-8.png',
        rating: 5,
        comment: 'Mark is an excellent instructor. This course prepared me well for my QA role.',
        date: dayjs().subtract(1, 'week').toDate()
      }
    ]
  },
  'INTEG-003': {
    id: 'INTEG-003',
    title: 'Advanced JavaScript & Web Development',
    description: 'Master modern JavaScript ES6+, DOM manipulation, and build interactive web applications.',
    level: 'Intermediate',
    category: 'Programming',
    tutorName: 'Alex Rodriguez',
    tutorAvatar: '/assets/avatar-9.png',
    logo: '/assets/logo-javascript.png',
    enrolledStudents: 1205,
    rating: 4.7,
    reviewCount: 203,
    fee: 19500,
    currency: 'LKR',
    updatedAt: dayjs().subtract(2, 'day').toDate(),
    curriculum: [
      {
        id: 1,
        title: 'Modern JavaScript Fundamentals',
        duration: '2hr 30min',
        lessons: [
          { id: 1, title: 'ES6+ Features', duration: '45 min' },
          { id: 2, title: 'Arrow Functions and Closures', duration: '35 min' },
          { id: 3, title: 'Promises and Async/Await', duration: '40 min' },
          { id: 4, title: 'Modules and Imports', duration: '30 min' }
        ]
      }
    ],
    reviews: [
      {
        id: 1,
        userName: 'David Kim',
        userAvatar: '/assets/avatar-10.png',
        rating: 5,
        comment: 'Alex is an amazing instructor! The course content is up-to-date and very practical.',
        date: dayjs().subtract(5, 'day').toDate()
      }
    ]
  },
  'INTEG-004': {
    id: 'INTEG-004',
    title: 'Calculus I: Limits and Derivatives',
    description: 'Introduction to differential calculus covering limits, continuity, and derivatives with real-world applications.',
    level: 'Intermediate',
    category: 'Mathematics',
    tutorName: 'Prof. Chandana Ratnayake',
    tutorAvatar: '/assets/avatar-11.png',
    logo: '/assets/logo-math.png',
    enrolledStudents: 782,
    rating: 4.2,
    reviewCount: 156,
    fee: 16500,
    currency: 'LKR',
    updatedAt: dayjs().subtract(5, 'day').toDate(),
    curriculum: [
      {
        id: 1,
        title: 'Limits and Continuity',
        duration: '3hr 15min',
        lessons: [
          { id: 1, title: 'Introduction to Limits', duration: '50 min' },
          { id: 2, title: 'Limit Laws', duration: '45 min' },
          { id: 3, title: 'Continuity', duration: '40 min' },
          { id: 4, title: 'Intermediate Value Theorem', duration: '40 min' }
        ]
      }
    ],
    reviews: []
  },
  'INTEG-005': {
    id: 'INTEG-005',
    title: 'Linear Algebra for Data Science',
    description: 'Essential linear algebra concepts including vectors, matrices, eigenvalues for machine learning applications.',
    level: 'Intermediate–Advanced',
    category: 'Mathematics',
    tutorName: 'Dr. Emily Watson',
    tutorAvatar: '/assets/avatar-2.png',
    logo: '/assets/logo-math.png',
    enrolledStudents: 923,
    rating: 4.6,
    reviewCount: 241,
    fee: 20000,
    currency: 'LKR',
    updatedAt: dayjs().subtract(1, 'week').toDate(),
    curriculum: [
      {
        id: 1,
        title: 'Vector Spaces and Linear Transformations',
        duration: '4hr 20min',
        lessons: [
          { id: 1, title: 'Vector Spaces', duration: '60 min' },
          { id: 2, title: 'Linear Independence', duration: '50 min' },
          { id: 3, title: 'Basis and Dimension', duration: '45 min' },
          { id: 4, title: 'Linear Transformations', duration: '45 min' }
        ]
      }
    ],
    reviews: []
  },
  'INTEG-006': {
    id: 'INTEG-006',
    title: 'Adobe Photoshop for Beginners',
    description: 'Learn photo editing, digital art creation, and graphic design fundamentals using Adobe Photoshop.',
    level: 'Beginner',
    category: 'Graphic Designing',
    tutorName: 'Jessica Miller',
    tutorAvatar: '/assets/avatar-3.png',
    logo: '/assets/logo-photoshop.png',
    enrolledStudents: 1456,
    rating: 4.4,
    reviewCount: 318,
    fee: 14000,
    currency: 'LKR',
    updatedAt: dayjs().subtract(3, 'day').toDate(),
    curriculum: [
      {
        id: 1,
        title: 'Photoshop Basics',
        duration: '2hr 45min',
        lessons: [
          { id: 1, title: 'Interface Overview', duration: '30 min' },
          { id: 2, title: 'Layers and Selection Tools', duration: '45 min' },
          { id: 3, title: 'Basic Photo Editing', duration: '50 min' },
          { id: 4, title: 'Text and Typography', duration: '40 min' }
        ]
      }
    ],
    reviews: []
  },
  'INTEG-007': {
    id: 'INTEG-007',
    title: 'UI/UX Design Principles',
    description: 'Master user interface and user experience design with hands-on projects using Figma and design thinking.',
    level: 'Beginner–Intermediate',
    category: 'Graphic Designing',
    tutorName: 'Kiran Fernando',
    tutorAvatar: '/assets/avatar-4.png',
    logo: '/assets/logo-design.png',
    enrolledStudents: 1123,
    rating: 4.8,
    reviewCount: 267,
    fee: 17500,
    currency: 'LKR',
    updatedAt: dayjs().subtract(4, 'day').toDate(),
    curriculum: [
      {
        id: 1,
        title: 'Design Fundamentals',
        duration: '3hr 30min',
        lessons: [
          { id: 1, title: 'Design Thinking Process', duration: '45 min' },
          { id: 2, title: 'User Research Methods', duration: '60 min' },
          { id: 3, title: 'Wireframing and Prototyping', duration: '65 min' },
          { id: 4, title: 'Usability Testing', duration: '40 min' }
        ]
      }
    ],
    reviews: []
  },
  'INTEG-008': {
    id: 'INTEG-008',
    title: 'C# Programming & .NET Development',
    description: 'Comprehensive C# programming course covering OOP concepts, .NET framework, and application development.',
    level: 'Intermediate',
    category: 'Programming',
    tutorName: 'Robert Anderson',
    tutorAvatar: '/assets/avatar-5.png',
    logo: '/assets/csharp.svg',
    enrolledStudents: 867,
    rating: 4.5,
    reviewCount: 194,
    fee: 18500,
    currency: 'LKR',
    updatedAt: dayjs().subtract(6, 'day').toDate(),
    curriculum: [
      {
        id: 1,
        title: 'C# Fundamentals',
        duration: '4hr 15min',
        lessons: [
          { id: 1, title: 'Introduction to C#', duration: '45 min' },
          { id: 2, title: 'Variables and Data Types', duration: '50 min' },
          { id: 3, title: 'Control Structures', duration: '60 min' },
          { id: 4, title: 'Object-Oriented Programming', duration: '80 min' }
        ]
      }
    ],
    reviews: []
  },
  'INTEG-009': {
    id: 'INTEG-009',
    title: 'Statistics for Data Analysis',
    description: 'Learn descriptive and inferential statistics, probability distributions, and hypothesis testing for data science.',
    level: 'Intermediate',
    category: 'Data Science',
    tutorName: 'Dr. Lisa Zhang',
    tutorAvatar: '/assets/avatar-6.png',
    logo: '/assets/logo-stats.png',
    enrolledStudents: 645,
    rating: 4.3,
    reviewCount: 132,
    fee: 16000,
    currency: 'LKR',
    updatedAt: dayjs().subtract(1, 'week').toDate(),
    curriculum: [
      {
        id: 1,
        title: 'Descriptive Statistics',
        duration: '3hr 45min',
        lessons: [
          { id: 1, title: 'Measures of Central Tendency', duration: '55 min' },
          { id: 2, title: 'Measures of Variability', duration: '45 min' },
          { id: 3, title: 'Probability Distributions', duration: '65 min' },
          { id: 4, title: 'Hypothesis Testing', duration: '60 min' }
        ]
      }
    ],
    reviews: []
  },
  'INTEG-010': {
    id: 'INTEG-010',
    title: 'Digital Illustration with Procreate',
    description: 'Create stunning digital artwork and illustrations using Procreate on iPad with professional techniques.',
    level: 'Beginner–Intermediate',
    category: 'Graphic Designing',
    tutorName: 'Sofia Martinez',
    tutorAvatar: '/assets/avatar-7.png',
    logo: '/assets/logo-procreate.png',
    enrolledStudents: 1034,
    rating: 4.6,
    reviewCount: 187,
    fee: 15500,
    currency: 'LKR',
    updatedAt: dayjs().subtract(2, 'week').toDate(),
    curriculum: [
      {
        id: 1,
        title: 'Procreate Fundamentals',
        duration: '2hr 30min',
        lessons: [
          { id: 1, title: 'Getting Started with Procreate', duration: '30 min' },
          { id: 2, title: 'Brushes and Drawing Tools', duration: '40 min' },
          { id: 3, title: 'Layer Management', duration: '35 min' },
          { id: 4, title: 'Creating Your First Illustration', duration: '45 min' }
        ]
      }
    ],
    reviews: []
  },
  'INTEG-011': {
    id: 'INTEG-011',
    title: 'Machine Learning Fundamentals',
    description: 'Introduction to ML algorithms, supervised/unsupervised learning, and hands-on Python implementation.',
    level: 'Advanced',
    category: 'AI',
    tutorName: 'Dr. James Wilson',
    tutorAvatar: '/assets/avatar-8.png',
    logo: '/assets/logo-ml.png',
    enrolledStudents: 756,
    rating: 4.7,
    reviewCount: 145,
    fee: 22000,
    currency: 'LKR',
    updatedAt: dayjs().subtract(5, 'day').toDate(),
    curriculum: [
      {
        id: 1,
        title: 'Introduction to Machine Learning',
        duration: '5hr 20min',
        lessons: [
          { id: 1, title: 'What is Machine Learning?', duration: '45 min' },
          { id: 2, title: 'Types of Learning', duration: '60 min' },
          { id: 3, title: 'Linear Regression', duration: '75 min' },
          { id: 4, title: 'Classification Algorithms', duration: '80 min' }
        ]
      }
    ],
    reviews: []
  },
  'INTEG-012': {
    id: 'INTEG-012',
    title: 'Web Design with HTML & CSS',
    description: 'Build responsive, modern websites from scratch using HTML5, CSS3, and responsive design principles.',
    level: 'Beginner',
    category: 'Programming',
    tutorName: 'Emma Davis',
    tutorAvatar: '/assets/avatar-9.png',
    logo: '/assets/logo-html.png',
    enrolledStudents: 1789,
    rating: 4.4,
    reviewCount: 412,
    fee: 12000,
    currency: 'LKR',
    updatedAt: dayjs().subtract(3, 'day').toDate(),
    curriculum: [
      {
        id: 1,
        title: 'HTML & CSS Basics',
        duration: '3hr 15min',
        lessons: [
          { id: 1, title: 'HTML Structure and Semantics', duration: '50 min' },
          { id: 2, title: 'CSS Styling and Selectors', duration: '45 min' },
          { id: 3, title: 'Responsive Design', duration: '60 min' },
          { id: 4, title: 'CSS Grid and Flexbox', duration: '40 min' }
        ]
      }
    ],
    reviews: []
  },
  'INTEG-013': {
    id: 'INTEG-013',
    title: 'AWS Cloud Fundamentals',
    description: 'Learn Amazon Web Services basics including EC2, S3, and cloud architecture principles.',
    level: 'Beginner–Intermediate',
    category: 'Cloud Computing',
    tutorName: 'Kevin Brown',
    tutorAvatar: '/assets/avatar-10.png',
    logo: '/assets/logo-aws.png',
    enrolledStudents: 892,
    rating: 4.5,
    reviewCount: 167,
    fee: 17000,
    currency: 'LKR',
    updatedAt: dayjs().subtract(1, 'week').toDate(),
    curriculum: [
      {
        id: 1,
        title: 'Cloud Computing Basics',
        duration: '4hr 0min',
        lessons: [
          { id: 1, title: 'Introduction to Cloud Computing', duration: '45 min' },
          { id: 2, title: 'AWS Core Services', duration: '60 min' },
          { id: 3, title: 'EC2 and Virtual Machines', duration: '75 min' },
          { id: 4, title: 'S3 Storage Solutions', duration: '60 min' }
        ]
      }
    ],
    reviews: []
  },
  'INTEG-014': {
    id: 'INTEG-014',
    title: 'Deep Learning with TensorFlow',
    description: 'Build neural networks and deep learning models using TensorFlow and Keras frameworks.',
    level: 'Advanced',
    category: 'AI',
    tutorName: 'Dr. Rachel Green',
    tutorAvatar: '/assets/avatar-11.png',
    logo: '/assets/logo-tensorflow.png',
    enrolledStudents: 534,
    rating: 4.6,
    reviewCount: 98,
    fee: 21000,
    currency: 'LKR',
    updatedAt: dayjs().subtract(4, 'day').toDate(),
    curriculum: [
      {
        id: 1,
        title: 'Deep Learning Fundamentals',
        duration: '6hr 30min',
        lessons: [
          { id: 1, title: 'Neural Network Basics', duration: '75 min' },
          { id: 2, title: 'TensorFlow and Keras', duration: '90 min' },
          { id: 3, title: 'Convolutional Networks', duration: '105 min' },
          { id: 4, title: 'Recurrent Networks', duration: '100 min' }
        ]
      }
    ],
    reviews: []
  },
  'INTEG-015': {
    id: 'INTEG-015',
    title: 'Data Visualization with Tableau',
    description: 'Create compelling data visualizations and dashboards using Tableau for business intelligence.',
    level: 'Intermediate',
    category: 'Data Science',
    tutorName: 'Tom Harrison',
    tutorAvatar: '/assets/avatar-1.png',
    logo: '/assets/logo-tableau.png',
    enrolledStudents: 723,
    rating: 4.4,
    reviewCount: 159,
    fee: 19000,
    currency: 'LKR',
    updatedAt: dayjs().subtract(6, 'day').toDate(),
    curriculum: [
      {
        id: 1,
        title: 'Tableau Basics',
        duration: '3hr 45min',
        lessons: [
          { id: 1, title: 'Getting Started with Tableau', duration: '45 min' },
          { id: 2, title: 'Data Connections and Preparation', duration: '55 min' },
          { id: 3, title: 'Creating Basic Visualizations', duration: '65 min' },
          { id: 4, title: 'Dashboard Design', duration: '60 min' }
        ]
      }
    ],
    reviews: []
  }
};

// Helper function to get course by ID
export const getCourseData = (id: string): CourseData | null => {
  return COURSES_DATA[id] || null;
};

// Helper function to get all courses as array (for list page)
export const getAllCourses = (): CourseData[] => {
  return Object.values(COURSES_DATA);
};
