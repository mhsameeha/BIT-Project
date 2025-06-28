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
    // tutordashboard : '/tutor-dashboard',
    learnerdashboard : '/learner-dashboard',
    // tutorcourse: '/courses/tutor-course',
    account: '/account',
    customers: '/customers',
    integrations: '/integrations',
    settings: '/settings',
    courses: '/courses/list',
    session:'/session'
  },
  errors: { notFound: '/errors/not-found' },
} as const;
