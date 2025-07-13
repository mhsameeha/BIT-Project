export const Role = {
    ADMIN: 'admin',
    LEARNER: 'learner',
    TUTOR: 'tutor',
} as const;

export type RoleType = typeof Role[keyof typeof Role];

export const allowedNavKeys: Record<RoleType, string[]> = {
  [Role.LEARNER]: [
    'dashboard',
    'courses',
    'session',
    'reports',
    'settings',
    'account',
    'error',
  ],
  [Role.TUTOR]: [
    'tutor-dashboard',
    'course-management',
    'session-management',
    'reports',
    'settings',
    'account',
    'error',
  ],
  [Role.ADMIN]: [
    'tutor-dashboard',
    'overview',
    'courses',
    'course-management',
    'session',
    'session-management',
    'reports',
    'admin-reports',
    'settings',
    'account',
    'error',
  ],
};
