import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Languages, LogOut, Home } from "lucide-react";

export default function Layout({ children }) {
  const location = useLocation();
  const isHome = location.pathname === createPageUrl("Home");
  
  // Check for teacher login
  const teacherData = localStorage.getItem("lvs_teacher");
  const teacher = teacherData ? JSON.parse(teacherData) : null;

  const handleLogout = () => {
    localStorage.removeItem("lvs_teacher");
    window.location.href = createPageUrl("Home");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-sky-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        
        :root {
          --primary: #4F46E5;
          --secondary: #0EA5E9;
          --accent: #10B981;
        }

        .glass-effect {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        /* Hide base44 badge with multiple selectors */
        #base44-badge,
        [id*="base44"],
        [class*="base44"],
        div[id^="base44"],
        a[href*="base44.io"] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          position: absolute !important;
          left: -9999px !important;
        }
      `}</style>

      {/* Header */}
      {!isHome && (
        <header className="glass-effect border-b border-white/20 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to={createPageUrl("Home")} className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Languages className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-sky-600 bg-clip-text text-transparent">
                    Live Vertaal Service
                  </h1>
                  <p className="text-xs text-gray-500">© Yoeran Moreel</p>
                </div>
              </Link>

              <div className="flex items-center gap-3">
                {teacher && (
                  <>
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-sky-400 flex items-center justify-center">
                        <span className="text-xs font-semibold text-white">
                          {teacher.fullName?.[0]?.toUpperCase() || 'L'}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-700">{teacher.fullName}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="p-2 rounded-xl hover:bg-white/50 transition-colors duration-200"
                      title="Uitloggen"
                    >
                      <LogOut className="w-5 h-5 text-gray-600" />
                    </button>
                  </>
                )}
                {!teacher && (
                  <Link to={createPageUrl("Home")}>
                    <button className="p-2 rounded-xl hover:bg-white/50 transition-colors duration-200">
                      <Home className="w-5 h-5 text-gray-600" />
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={isHome ? "" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"}>
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/50 backdrop-blur-sm mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>Live Vertaal Service — Verbinding door communicatie</p>
            <p className="mt-1">© 2025 - Ontwikkeld met ❤️ voor inclusief onderwijs door Yoeran Moreel</p>
          </div>
        </div>
      </footer>
    </div>
  );
}



