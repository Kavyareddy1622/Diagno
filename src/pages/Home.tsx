import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, LayoutDashboard, Sparkles, ArrowRight, Github, Code } from 'lucide-react';
import { motion } from 'motion/react';

export default function Home() {
  return (
    <div className="p-8 max-w-[1400px] mx-auto min-h-full flex flex-col items-center justify-center relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl text-center"
      >
        <div className="w-24 h-24 mx-auto bg-white border border-slate-200 shadow-2xl shadow-teal-200/50 rounded-3xl flex items-center justify-center mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-teal-500 to-cyan-500 rounded-3xl opacity-10"></div>
          <Activity className="w-12 h-12 text-teal-600" />
        </div>
        
        <h1 className="text-6xl font-black text-slate-900 tracking-tight mb-6 leading-tight">
           Predict Disease Outcomes with <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600">Machine Learning</span>
        </h1>
        
        <p className="text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed">
          Upload your healthcare datasets, train custom ML models in real-time, and run predictions on patient parameters with an intuitive interface.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
          <Link 
            to="/dashboard" 
            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-10 rounded-2xl shadow-xl shadow-slate-900/20 transition-all flex items-center justify-center gap-3 text-lg group"
          >
            <LayoutDashboard className="w-5 h-5 group-hover:-rotate-6 transition-transform" />
            Go to Dashboard
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link 
            to="/predict" 
            className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-900 font-bold py-4 px-10 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 transition-all flex items-center justify-center gap-3 text-lg group"
          >
            <Sparkles className="w-5 h-5 text-teal-600 group-hover:scale-110 transition-transform" />
            Try Prediction
          </Link>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-16 w-full max-w-3xl"
      >
        <div className="bg-white/60 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-center gap-8 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100/80 border border-slate-200 rounded-full flex items-center justify-center">
              <Code className="w-5 h-5 text-slate-600" />
            </div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Project Creators</p>
          </div>
          
          <div className="flex items-center gap-3">
             <span className="text-sm font-bold bg-white text-slate-800 px-4 py-2 rounded-xl border border-slate-200 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] transition-transform hover:-translate-y-0.5">
               Kavya Reddy
             </span>
             <span className="text-sm font-bold bg-white text-slate-800 px-4 py-2 rounded-xl border border-slate-200 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] transition-transform hover:-translate-y-0.5">
               Thota Vennela sai
             </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
