import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Overview', href: paths.main.overview, icon: 'chart-pie' },
  { key: 'overview', title: 'Tutor Dashboard', href: paths.main.tutordashboard, icon: 'chart-pie' },
  { key: 'overview', title: 'Learner Dashboard', href: paths.main.learnerdashboard, icon: 'chart-pie' },

  // { key: 'customers', title: 'Customers', href: paths.main.customers, icon: 'users' },
  { key: 'courses', title: 'Courses', href: paths.main.courses, icon: 'users' },
  { key: 'tutorcourse', title: 'Courses', href: paths.main.tutorcourse, icon: 'users' },

  // { key: 'integrations', title: 'Integrations', href: paths.main.integrations, icon: 'plugs-connected' },
  { key: 'settings', title: 'Settings', href: paths.main.settings, icon: 'gear-six' },
  { key: 'account', title: 'Account', href: paths.main.account, icon: 'user' },
  { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
] satisfies NavItemConfig[];
