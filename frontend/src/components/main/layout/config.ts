import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  // { key: 'overview', title: 'Overview', href: paths.main.overview, icon: 'chart-pie' },
  { key: 'tutor-dashboard', title: 'Tutor Dashboard', href: paths.main.tutorDashboard, icon: 'chart-pie' },
  { key: 'overview', title: 'Dashboard', href: paths.main.learnerdashboard, icon: 'chart-pie' },

  // { key: 'customers', title: 'Customers', href: paths.main.customers, icon: 'users' },
  { key: 'courses', title: 'Courses', href: paths.main.courses, icon: 'users' },
  // { key: 'tutorcourse', title: 'Courses', href: paths.main.tutorcourse, icon: 'users' },
  { key: 'course-management', title: 'Course Management', href: paths.main.courseManagement, icon: 'books' },
  { key: 'session', title: 'Session', href: paths.main.session, icon: 'users' },
  { key: 'session-management', title: 'Session Management', href: paths.main.sessionManagement, icon: 'calendar' },
  { key: 'reports', title: 'Reports', href: paths.main.reports, icon: 'chart-bar' },
  { key: 'admin-reports', title: 'Admin Reports', href: paths.main.adminReports, icon: 'chart-line' },

  // { key: 'integrations', title: 'Integrations', href: paths.main.integrations, icon: 'plugs-connected' },
  { key: 'settings', title: 'Settings', href: paths.main.settings, icon: 'gear-six' },
  { key: 'account', title: 'Account', href: paths.main.account, icon: 'user' },
  { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
] satisfies NavItemConfig[];
