export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  // courses: {
  //   list: '/courses/list',
  // },
  // dashboard: {
  //   overview: '/dashboard',
  //   account: '/dashboard/account',
  //   customers: '/dashboard/customers',
  //   integrations: '/dashboard/integrations',
  //   settings: '/dashboard/settings',
  //   courses: '/dashboard/courses/list',
  // },
  main: {
    overview: '/dashboard',
    // admindashboard : '/admin-dashboard',
    tutorDashboard : '/tutor-dashboard',
    learnerdashboard : '/learner-dashboard',
    // tutorcourse: '/courses/tutor-course',
    account: '/account',
    customers: '/customers',
    integrations: '/integrations',
    settings: '/settings',
    courses: '/courses/list',
    courseDetail: (id: string) => `/courses/${id}`,
    session:'/session',
    sessionBooking: (tutorId: string) => `/session/book/${tutorId}`,
    tutorProfile: (tutorId: string) => `/tutors/${tutorId}`,
    sessionManagement: '/session-management',
    courseManagement: '/course-management',
    reports: '/reports',
    adminReports: '/admin-reports'
  },
  errors: { notFound: '/errors/not-found' },
} as const;
