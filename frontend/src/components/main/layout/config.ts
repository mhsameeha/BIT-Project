import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  // { key: 'overview', title: 'Overview', href: paths.main.overview, icon: 'chart-pie' },

  { key: 'admin-dashboard', title: 'Admin Dashboard', href: paths.main.adminDashboard, icon: 'chart-pie' },
  { key: 'tutor-dashboard', title: 'Tutor Dashboard', href: paths.main.tutorDashboard, icon: 'chart-pie' },
  { key: 'learner-dashboard', title: 'Learner Dashboard', href: paths.main.learnerdashboard, icon: 'chart-pie' },
  { key: 'tutor-management', title: 'Tutor Management', href: paths.main.tutorManagement, icon: 'chart-pie' },
  { key: 'payment-management', title: 'Payment Management', href: paths.main.paymentApproval, icon: 'chart-pie' },



  // { key: 'customers', title: 'Customers', href: paths.main.customers, icon: 'users' },
  { key: 'courses', title: 'Courses', href: paths.main.courses, icon: 'users' },
  { key: 'course-management', title: 'Course Management', href: paths.main.courseManagement, icon: 'books' },
  { key: 'session', title: 'Session', href: paths.main.session, icon: 'users' },
  { key: 'session-management', title: 'Session Management', href: paths.main.sessionManagement, icon: 'calendar' },
  { key: 'reports', title: 'Tutor Reports', href: paths.main.reports, icon: 'chart-line'  },
  { key: 'admin-reports', title: 'Admin Reports', href: paths.main.adminReports, icon: 'chart-line' },
  { key: 'account', title: 'Account', href: paths.main.account, icon: 'user' },
] satisfies NavItemConfig[];
