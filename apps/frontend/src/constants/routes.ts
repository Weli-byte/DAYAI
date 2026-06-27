export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  MARKETPLACE: '/marketplace',
  MODELS: '/models',
  UPLOAD: '/upload',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
