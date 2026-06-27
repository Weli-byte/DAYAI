// React 19 removed the `ReactSVG` type that some libraries (lucide-react ≤ 0.460)
// still reference in their type definitions. This declaration adds it back as an
// alias so the build does not fail until lucide-react publishes React 19-native types.
import type * as React from 'react';

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface ReactSVG extends React.SVGProps<SVGElement> {}
}
