import { Navbar } from './navbar';
import { Sidebar } from './sidebar';
import { Footer } from './footer';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        {/* Main content area */}
        <div className="flex min-w-0 flex-1 flex-col">
          <main className="flex-1 p-4 lg:p-6">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
