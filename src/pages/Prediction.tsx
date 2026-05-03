import React, { useState } from 'react';
import { Activity, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';
import { useModel } from '../context/ModelContext';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Prediction() {
  const { features, models, classes, targetLabels } = useModel();
  const [isPredicting, setIsPredicting] = useState(false);
  const [results, setResults] = useState<Record<string, string> | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  // Initialize all features to '0' by default
  React.useEffect(() => {
    if (features && features.length > 0) {
      const initialData: Record<string, string> = {};
      features.forEach(f => initialData[f] = '0');
      setFormData(initialData);
    }
  }, [features]);

  const handleToggle = (feature: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [feature]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(models).length === 0) return;

    setIsPredicting(true);
    setResults(null);
    
    setTimeout(() => {
      try {
        const X = features.map(f => Number(formData[f]) || 0);
        
        const newResults: Record<string, string> = {};
        targetLabels.forEach(target => {
          const model = models[target];
          if (model) {
            const predictedIndex = model.predict(X);
            newResults[target] = classes[target][predictedIndex];
          }
        });
        
        setResults(newResults);
      } catch (err) {
        console.error("Prediction error:", err);
        setResults({ 'Error': 'Failed running prediction models' });
      }
      setIsPredicting(false);
    }, 1200);
  };

  if (Object.keys(models).length === 0) {
    return (
      <div className="p-8 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 bg-white border border-slate-200 shadow-xl shadow-slate-200/50 rounded-3xl flex items-center justify-center mb-6">
          <Activity className="w-10 h-10 text-teal-500" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-3 tracking-tight">Models Not Trained</h2>
        <p className="text-slate-500 mb-8 max-w-md text-lg leading-relaxed">
          Please upload your dataset and train the models in the Dashboard before running predictions.
        </p>
        <Link 
          to="/dashboard" 
          className="bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 px-8 rounded-xl shadow-lg shadow-slate-900/20 transition-all flex items-center gap-2 hover:gap-3"
        >
          Go to Dashboard
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  const isFormComplete = Object.keys(formData).length === features.length;

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Prediction</h1>
        <p className="text-slate-500 mt-2 text-lg">Set patient clinical metrics (0 or 1) to predict the {targetLabels.length > 0 ? targetLabels[0] : 'disease'} outcome.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-slate-200/40 border border-white p-8">
          <form onSubmit={handleSubmit}>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-slate-800">Patient Parameters</h2>
              <span className="bg-teal-50 text-teal-700 text-xs font-bold px-3 py-1 rounded-full border border-teal-100">
                {Object.keys(formData).length} / {features.length} Selected
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {features.map((feature, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  key={feature} 
                  className={`p-4 rounded-2xl transition-all duration-300 border ${formData[feature] !== undefined ? 'bg-teal-50/50 border-teal-100' : 'bg-slate-50 border-slate-200/60 hover:border-teal-200 hover:bg-slate-50/80'}`}
                >
                  <label className="block text-sm capitalize font-semibold text-slate-700 mb-3 truncate" title={feature.replace(/_/g, ' ')}>
                    {feature.replace(/_/g, ' ')}
                  </label>
                  <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 p-1">
                    <button
                      type="button"
                      onClick={() => handleToggle(feature, '0')}
                      className={`flex-1 py-1.5 text-sm font-bold rounded-lg transition-all ${
                        formData[feature] === '0' 
                          ? 'bg-slate-800 text-white shadow-md' 
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                      }`}
                    >
                      0
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggle(feature, '1')}
                      className={`flex-1 py-1.5 text-sm font-bold rounded-lg transition-all ${
                        formData[feature] === '1' 
                          ? 'bg-teal-600 text-white shadow-md' 
                          : 'text-slate-500 hover:bg-slate-50 hover:text-teal-600'
                      }`}
                    >
                      1
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 pt-8 border-t border-slate-100">
              <button 
                type="submit" 
                disabled={isPredicting || !isFormComplete}
                className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-teal-600/20 transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3 text-lg"
              >
                {isPredicting ? (
                  <>
                    <Activity className="w-6 h-6 animate-pulse" />
                    Analyzing Data...
                  </>
                ) : (
                  `Predict ${targetLabels[0]}`
                )}
              </button>
              {!isFormComplete && (
                <p className="text-center text-rose-500 text-sm mt-3 font-medium flex items-center justify-center gap-1">
                  <AlertCircle className="w-4 h-4" /> Please fill all parameters to predict
                </p>
              )}
            </div>
          </form>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-4">
          <div className="bg-slate-900 rounded-3xl shadow-xl border border-slate-800 p-8 sticky top-8 text-white min-h-[400px] flex flex-col">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-slate-800 pb-4">
               <Activity className="w-5 h-5 text-teal-400" />
              Prediction Results
            </h2>
            
            {!results && !isPredicting && (
              <div className="text-center py-16 px-4 flex-1 flex flex-col justify-center">
                <div className="mx-auto w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
                  <Activity className="w-8 h-8 text-slate-500" />
                </div>
                <p className="text-slate-400 font-medium">Submit the clinical parameters to see predictions</p>
              </div>
            )}

            {isPredicting && (
              <div className="text-center py-16 flex-1 flex flex-col justify-center items-center">
                <div className="relative w-16 h-16 mb-6">
                  <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-teal-300 font-bold animate-pulse tracking-wide">Processing Model...</p>
              </div>
            )}

            {results && !isPredicting && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <div className="text-center mb-8">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                  <h3 className="text-white font-bold text-xl">Analysis Complete</h3>
                </div>
                
                <div className="space-y-4">
                  {Object.entries(results).map(([target, prediction], i) => {
                    // Check if prediction is an actual disease name string vs 0/1 boolean format
                    const predStr = String(prediction).toLowerCase();
                    const isPositive = ['1', 'true', 'yes', 'positive', 'high'].includes(predStr) || (!['0', 'false', 'no', 'negative', 'low'].includes(predStr) && predStr !== 'normal');
                    const displayVal = prediction === '1' ? 'Detected' : prediction === '0' ? 'Negative' : prediction;
                    return (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        key={target} 
                        className={`border rounded-2xl p-5 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                          isPositive 
                            ? 'bg-rose-500/10 border-rose-500/30' 
                            : 'bg-emerald-500/10 border-emerald-500/30'
                        }`}
                      >
                        <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl rounded-full -mr-10 -mt-10 ${isPositive ? 'bg-rose-500/20' : 'bg-emerald-500/20'}`}></div>
                        
                        <div className="relative z-10 flex-1">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            Target Condition
                          </span>
                          <span className="text-lg font-bold text-white capitalize leading-tight block">
                            {target.replace(/_/g, ' ')}
                          </span>
                        </div>
                        
                        <div className={`relative z-10 sm:text-right flex items-center sm:block gap-3`}>
                          <div className={`text-2xl font-black uppercase tracking-wider ${isPositive ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {displayVal}
                          </div>
                          {!isPositive ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 sm:mt-1">
                              <CheckCircle2 className="w-3 h-3" /> Low Risk
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-500 bg-rose-500/10 px-2 py-1 rounded border border-rose-500/20 sm:mt-1">
                              <AlertCircle className="w-3 h-3" /> Indicator Present
                            </span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
