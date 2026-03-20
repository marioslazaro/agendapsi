import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Home, Users, Calendar, DollarSign, Settings } from 'lucide-react';
import clsx from 'clsx';

const PRIMARY_ROUTES = ['/', '/patients', '/agenda', '/finances'];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Distinguish 'primary' screens (that show navigation) from 'secondary' (that hide it and usually show a back button)
  const isPrimary = PRIMARY_ROUTES.includes(location.pathname);
  const isLogin = location.pathname === '/login';

  const navItems = [
    { label: 'Início', path: '/', icon: Home },
    { label: 'Agenda', path: '/agenda', icon: Calendar },
    { label: 'Pacientes', path: '/patients', icon: Users },
    { label: 'Finanças', path: '/finances', icon: DollarSign },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen w-full relative bg-slate-100 overflow-hidden">
      
      {/* Sidebar Navigation for Desktop Primary Screens */}
      {(isPrimary && !isLogin) && (
        <aside className="hidden md:flex flex-col w-64 bg-surface border-r border-slate-200 p-4 shrink-0 z-20 shadow-sm">
          <div className="flex items-center gap-3 px-2 mb-8 mt-2">
            <img src="/logo.png" alt="AgendaPsi" className="w-12 h-12 object-contain drop-shadow-md" />
            <span className="font-extrabold text-2xl text-slate-800 tracking-tight">AgendaPsi</span>
          </div>
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={clsx(
                    'flex items-center gap-3 p-3.5 rounded-xl transition-all w-full text-left font-semibold',
                    isActive 
                      ? 'bg-primary-50 text-primary-600' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                  )}
                >
                  <Icon size={20} className={isActive ? 'text-primary-600' : 'text-slate-400'} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>
      )}

      {/* Main Area */}
      <div className="flex flex-col flex-1 overflow-hidden relative">

      {/* Top Bar for secondary screens */}
      {(!isPrimary && !isLogin) && (
        <header className="flex items-center p-4 bg-surface border-b pb-3 sticky top-0 z-20">
           <button 
             onClick={() => navigate(-1)} 
             className="mr-3 p-2 bg-slate-100 rounded-full active:scale-95 transition-transform"
           >
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
               <path d="M15 18l-6-6 6-6" />
             </svg>
           </button>
           <h1 className="text-xl font-bold flex-1 text-center pr-10">Voltar</h1>
        </header>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto w-full relative bg-background">
         <div className={clsx("mx-auto h-full", !isLogin && "max-w-4xl bg-white md:shadow-sm md:border-x md:border-slate-100")}>
           {children}
         </div>
      </main>

      {/* Bottom Navigation for Mobile Primary Screens */}
      {(isPrimary && !isLogin) && (
        <nav className="md:hidden flex justify-around items-center bg-surface border-t py-2 pb-safe sticky bottom-0 z-20">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                className={clsx(
                  "flex flex-col items-center p-2 w-full active:scale-95 transition-transform", 
                  isActive ? "text-primary-600" : "text-text-secondary"
                )}
              >
                <Icon size={24} className={clsx("mb-1", isActive ? "stroke-primary-600" : "stroke-text-secondary")} />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      )}
      </div>
    </div>
  );
}
