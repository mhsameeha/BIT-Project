export const Role = {
    ADMIN: 'admin',
    LEARNER: 'learner',
    TUTOR: 'tutor',
} as const;


export const allowedNavKeys: Record<Role, string[]> = {
  [Role.LEARNER]: [
    'overview',
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
