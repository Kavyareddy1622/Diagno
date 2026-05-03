import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import Papa from 'papaparse';
import { useModel } from '../context/ModelContext';
import { FileUp, Activity, CheckSquare, Square, Layers, Sparkles, BrainCircuit } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const COLORS = ['#0d9488', '#0ea5e9', '#f43f5e', '#f59e0b', '#8b5cf6'];

export default function Dashboard() {
  const { data, features, targetLabels, setDataset, isTraining, accuracies, classes } = useModel();
  const [selectedTarget, setSelectedTarget] = useState<string>('');
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [previewTarget, setPreviewTarget] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (targetLabels.length > 0 && !previewTarget) {
      setPreviewTarget(targetLabels[0]);
    }
  }, [targetLabels, previewTarget]);

  const handleFileProcess = (file: File) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        const d = results.data as any[];
        setParsedData(d);
        if (d.length > 0) {
          const cols = Object.keys(d[0]);
          setColumns(cols);
          const prog = cols.find(c => c.toLowerCase() === 'prognosis' || c.toLowerCase() === 'target' || c.toLowerCase() === 'disease' || c.toLowerCase() === 'class' || c.toLowerCase() === 'outcome');
          setSelectedTarget(prog || cols[cols.length - 1]);
        }
      }
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileProcess(file);
  };

  const processDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.name.endsWith('.csv')) {
      handleFileProcess(file);
    }
  };

  const handleTrainModel = () => {
    if (parsedData.length > 0 && selectedTarget) {
      setDataset(parsedData, [selectedTarget]);
      setPreviewTarget(selectedTarget);
    }
  };

  const generateChartData = (targetClass: string) => {
    if (data.length === 0 || !targetClass || !classes[targetClass]) return { barData: [], pieData: [] };

    const classCounts: Record<string, number> = {};
    data.forEach(row => {
      const cls = String(row[targetClass]);
      classCounts[cls] = (classCounts[cls] || 0) + 1;
    });

    const sortedClasses = Object.entries(classCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // Limit to top 15 classes for Bar Chart
    const barData = sortedClasses.slice(0, 15);

    // For Pie Chart, top 8 and "Other"
    let pieData = sortedClasses.slice(0, 8);
    if (sortedClasses.length > 8) {
       const otherValue = sortedClasses.slice(8).reduce((acc, curr) => acc + curr.value, 0);
       pieData.push({ name: 'Other', value: otherValue });
    }

    return { pieData, barData };
  };

  const { pieData, barData } = generateChartData(previewTarget);
  const numFeatureForBar = features.find(f => typeof data[0]?.[f] === 'number') || features[0];

  let totalAccuracy = 0;
  const accValues = Object.values(accuracies);
  accValues.forEach(acc => totalAccuracy += Number(acc));
  const avgAccuracy = accValues.length > 0 ? (totalAccuracy / accValues.length).toFixed(1) + '%' : 'N/A';

  return (
    <div className="p-8 max-w-[1400px] mx-auto min-h-full flex flex-col">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
          Workspace Overview
          <Sparkles className="w-6 h-6 text-teal-500" />
        </h1>
        <p className="text-slate-500 mt-2 text-lg">Upload your dataset to train disease prediction models based on 0/1 boolean inputs.</p>
      </div>

      <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-white shadow-xl shadow-slate-200/40 mb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-teal-600/5 rounded-full blur-3xl"></div>
        
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Layers className="w-6 h-6 text-teal-600" />
          Data Foundation
        </h3>
        
        <div className="flex flex-col xl:flex-row gap-8 items-start relative z-10">
          <div className="flex-1 w-full max-w-md">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Dataset (.csv)</label>
            <div 
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={processDrop}
              className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                isDragging 
                  ? 'border-teal-500 bg-teal-50/80 scale-[1.02]' 
                  : parsedData.length > 0 
                    ? 'border-teal-200 bg-teal-50/50' 
                    : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
              }`}
            >
              <input 
                type="file" 
                accept=".csv"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center gap-3">
                {parsedData.length > 0 ? (
                   <CheckSquare className="w-10 h-10 text-teal-500" />
                ) : (
                   <FileUp className={`w-10 h-10 ${isDragging ? 'text-teal-600' : 'text-slate-400'}`} />
                )}
                <div>
                  <p className="font-bold text-slate-700">
                    {parsedData.length > 0 ? "Dataset Loaded" : "Drop CSV dataset here"}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {parsedData.length > 0 ? `${parsedData.length} records parsed` : "or click to browse"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {columns.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-[2] w-full"
            >
              <label className="block text-sm font-semibold text-slate-700 mb-2">Select Target Label (What to Predict)</label>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <select 
                  value={selectedTarget}
                  onChange={(e) => setSelectedTarget(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-700 font-medium rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm"
                >
                  <option value="" disabled>-- Select a target column --</option>
                  {columns.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <p className="mt-2 text-xs font-semibold text-slate-500 flex items-center gap-1">
                   <Activity className="w-3 h-3 text-teal-500" /> All other columns will be used as input features to predict <span className="text-teal-600 ml-1">{selectedTarget || 'this target'}</span>.
                </p>
              </div>
            </motion.div>
          )}
        </div>
        
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleTrainModel}
            disabled={!selectedTarget || parsedData.length === 0 || isTraining}
            className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 hover:gap-3 group"
          >
            {isTraining ? <Activity className="w-5 h-5 animate-spin" /> : <BrainCircuit className="w-5 h-5 transition-transform group-hover:rotate-12" />}
            {isTraining ? 'Training Model...' : 'Train ML Models'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {data.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-white shadow-xl shadow-slate-200/40 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-teal-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                <h3 className="text-sm font-bold text-slate-500 tracking-wide uppercase">Records Loaded</h3>
                <div className="text-4xl font-black text-slate-900 mt-2 tracking-tight">{data.length}</div>
                <p className="text-sm font-medium text-slate-400 mt-2">Clean rows available</p>
              </div>
              <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-white shadow-xl shadow-slate-200/40 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                <h3 className="text-sm font-bold text-slate-500 tracking-wide uppercase">Active Features</h3>
                <div className="text-4xl font-black text-slate-900 mt-2 tracking-tight">{features.length}</div>
                <p className="text-sm font-medium text-slate-400 mt-2">Shared input parameters</p>
              </div>
              <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-white shadow-xl shadow-slate-200/40 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                <h3 className="text-sm font-bold text-slate-500 tracking-wide uppercase">Models Trained</h3>
                <div className="text-4xl font-black text-slate-900 mt-2 tracking-tight">{Object.keys(accuracies).length}</div>
                <p className="text-sm font-medium text-teal-600 mt-2">
                  Avg Accuracy: {avgAccuracy}
                </p>
              </div>
            </div>

            {targetLabels.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-white shadow-xl shadow-slate-200/40 h-[450px] flex flex-col">
                  <h3 className="text-lg font-bold text-slate-800 mb-6 truncate" title={`Top 15 outcomes in dataset`}>
                    Top Occurrences of <span className="text-teal-600">{previewTarget}</span>
                  </h3>
                  <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} dy={10} angle={-35} textAnchor="end" />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                        <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                        <Bar dataKey="value" name="Count" fill="#0d9488" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-white shadow-xl shadow-slate-200/40 h-[450px] flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="text-lg font-bold text-slate-800 truncate mr-3">Target Segments</h3>
                     {targetLabels.length > 1 && (
                       <select 
                         value={previewTarget} 
                         onChange={(e) => setPreviewTarget(e.target.value)}
                         className="text-sm font-semibold text-teal-700 bg-teal-50 border border-teal-100 rounded-xl focus:ring-teal-500 focus:border-teal-500 py-2 pl-4 pr-10 truncate max-w-[200px]"
                       >
                         {targetLabels.map(t => <option key={t} value={t}>{t}</option>)}
                       </select>
                     )}
                  </div>
                  
                  <div className="flex-1 min-h-0 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={120}
                          paddingAngle={5}
                          dataKey="value"
                          stroke="none"
                          label={({ name, percent }) => `${String(name).substring(0, 10)} (${(percent * 100).toFixed(0)}%)`}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                        <Legend iconType="circle" />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
                       <span className="text-slate-400 font-bold tracking-widest text-xs uppercase">OVERVIEW</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!data.length && (
        <div className="flex-1 border-2 border-dashed border-slate-200 rounded-3xl flex items-center justify-center p-12 text-center bg-slate-50/50">
          <p className="text-slate-400 font-medium text-lg flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Upload and train your dataset to reveal active intelligence arrays.
          </p>
        </div>
      )}
    </div>
  );
}
