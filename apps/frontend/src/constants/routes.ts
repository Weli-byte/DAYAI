export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  MARKETPLACE: '/marketplace',
  MODELS: '/models',
  MODEL_DETAIL: (id: string) => `/models/${id}`,
  MODEL_CREATE: '/models/create',
  UPLOAD: '/upload',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;

export type StaticRoute = Extract<(typeof ROUTES)[keyof typeof ROUTES], string>;
