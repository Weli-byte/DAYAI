export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  MARKETPLACE: '/marketplace',
  MODELS: '/models',
  MODEL_DETAIL: (id: string) => `/models/${id}`,
  MODEL_CREATE: '/models/create',
  MODEL_UPLOAD: '/models/upload',
  UPLOAD: '/models/upload',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  PLAYGROUND: '/playground',
} as const;

export type StaticRoute = Extract<(typeof ROUTES)[keyof typeof ROUTES], string>;
