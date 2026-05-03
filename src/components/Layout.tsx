import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Stethoscope, FileUp, Sparkles, Activity } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import React from "react";

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-slate-50 font-sans selection:bg-teal-100 selection:text-teal-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-white/80 backdrop-blur-xl border-r border-slate-200/60 flex flex-col shadow-sm relative z-20">
        <div className="p-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-teal-200 transition-transform group-hover:scale-105">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Diagno
              </h1>
              <p className="text-xs font-medium text-slate-500">ML Intelligence</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link
            to="/"
            className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              location.pathname === "/"
                ? "text-teal-700 bg-teal-50/80 shadow-sm border border-teal-100/50"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            {location.pathname === "/" && (
              <motion.div layoutId="nav-pill" className="absolute inset-0 bg-teal-50/80 rounded-xl border border-teal-100/50" />
            )}
            <Activity className={`w-5 h-5 relative z-10 ${location.pathname === "/" ? "text-teal-600" : ""}`} />
            <span className="font-semibold relative z-10">Home</span>
          </Link>

          <Link
            to="/dashboard"
            className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              location.pathname === "/dashboard"
                ? "text-teal-700 bg-teal-50/80 shadow-sm border border-teal-100/50"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            {location.pathname === "/dashboard" && (
              <motion.div layoutId="nav-pill" className="absolute inset-0 bg-teal-50/80 rounded-xl border border-teal-100/50" />
            )}
            <LayoutDashboard className={`w-5 h-5 relative z-10 ${location.pathname === "/dashboard" ? "text-teal-600" : ""}`} />
            <span className="font-semibold relative z-10">Dashboard</span>
          </Link>
          
          <Link
            to="/predict"
            className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              location.pathname === "/predict"
                ? "text-teal-700 bg-teal-50/80 shadow-sm border border-teal-100/50"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            {location.pathname === "/predict" && (
              <motion.div layoutId="nav-pill" className="absolute inset-0 bg-teal-50/80 rounded-xl border border-teal-100/50" />
            )}
            <Sparkles className={`w-5 h-5 relative z-10 ${location.pathname === "/predict" ? "text-teal-600" : ""}`} />
            <span className="font-semibold relative z-10">Prediction</span>
          </Link>
        </nav>
        
        <div className="p-6">
          <div className="bg-gradient-to-b from-teal-50 to-teal-100/50 border border-teal-100 p-5 rounded-2xl shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-teal-600/5 rounded-full blur-2xl"></div>
            <h3 className="text-sm font-bold text-teal-900 flex items-center gap-2 relative z-10">
              <FileUp className="w-4 h-4 text-teal-600" />
              Dataset Ready
            </h3>
            <p className="text-xs text-teal-700/80 mt-2 font-medium leading-relaxed relative z-10">
              Upload standard .csv sheets with 0 or 1 value features for optimal tuning.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-slate-50 relative">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none mix-blend-multiply"></div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative z-10 min-h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
