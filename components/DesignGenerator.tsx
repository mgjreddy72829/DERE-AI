"use client";

import React, { useState } from 'react';

type DesignOption = {
  id: string;
  name: string;
  description: string;
  style: string;
  colorPalette: string[];
  estimatedCost: number;
  materials: string[];
  furnitureSuggestions: string[];
};

export default function DesignGenerator() {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<DesignOption[] | null>(null);
  const [activeTab, setActiveTab] = useState<number>(0);

  // form state
  const [formData, setFormData] = useState({
    roomType: 'Living Room',
    width: '15',
    length: '20',
    budget: '5000',
    fixedFeatures: 'Large window on the north wall, hardwood floors',
  });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setOptions(null);
    setActiveTab(0);
    
    try {
      // @ts-ignore - Chrome's experimental AI API
      const ai = window.ai;
      if (!ai) {
        throw new Error("Gemini Nano (window.ai) is not available in your browser. Please enable the Prompt API in Chrome flags.");
      }

      const prompt = `You are an expert interior designer and architect. Create 3 distinct design options for a ${formData.roomType} measuring ${formData.width}ft x ${formData.length}ft. The total budget is $${formData.budget}. Consider these fixed features: ${formData.fixedFeatures}.

Strictly return ONLY a valid JSON object conforming to the following structure:
{
  "options": [
    {
      "id": "unique-id",
      "name": "Design Name",
      "description": "Short description",
      "style": "Style Name",
      "colorPalette": ["#hex1", "#hex2", "#hex3", "#hex4"],
      "estimatedCost": 1000,
      "materials": ["Material 1", "Material 2"],
      "furnitureSuggestions": ["Furniture 1", "Furniture 2"]
    }
  ]
}
Ensure the output is ONLY valid JSON, with exactly 3 options. Do not include markdown code blocks like \`\`\`json or any other text.`;

      // Handle both new and old API versions for Chrome's Prompt API
      // @ts-ignore
      const session = ai.languageModel ? await ai.languageModel.create() : await ai.createTextSession();
      const result = await session.prompt(prompt);
      
      // Clean up markdown block if it exists
      const cleanedResult = result.replace(/^```(json)?\n?/i, '').replace(/\n?```$/i, '').trim();
      const data = JSON.parse(cleanedResult);

      if (data && data.options) {
        setOptions(data.options);
      }
    } catch (error) {
      console.error('Error generating design:', error);
      alert(error instanceof Error ? error.message : 'Failed to generate design. Ensure Gemini Nano is enabled and working.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-12">
      <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm">
        <h2 className="text-2xl font-semibold tracking-tight mb-6">Generate Room Design</h2>
        <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
            <input 
              type="text" 
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-all" 
              value={formData.roomType} 
              onChange={(e) => setFormData({...formData, roomType: e.target.value})}
              required 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Width (ft)</label>
              <input 
                type="number" 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-all" 
                value={formData.width} 
                onChange={(e) => setFormData({...formData, width: e.target.value})} 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Length (ft)</label>
              <input 
                type="number" 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-all" 
                value={formData.length} 
                onChange={(e) => setFormData({...formData, length: e.target.value})} 
                required 
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Budget ($)</label>
            <input 
              type="number" 
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-all" 
              value={formData.budget} 
              onChange={(e) => setFormData({...formData, budget: e.target.value})} 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fixed Features (Optional)</label>
            <input 
              type="text" 
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-all" 
              value={formData.fixedFeatures} 
              onChange={(e) => setFormData({...formData, fixedFeatures: e.target.value})} 
            />
          </div>
          <div className="md:col-span-2 pt-2">
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-black text-white p-4 rounded-xl font-medium hover:bg-gray-900 transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Masterpieces...
                </>
              ) : 'Generate Design Options'}
            </button>
          </div>
        </form>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-8 animate-pulse">
          <div className="flex space-x-6 border-b border-gray-200 pb-px">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-10 w-32 bg-gray-200 rounded-t-lg"></div>
            ))}
          </div>
          <div className="h-[400px] bg-gray-100 rounded-2xl border border-gray-200"></div>
        </div>
      )}

      {/* Results View */}
      {options && !loading && options.length > 0 && (
        <div className="space-y-8">
          {/* Top Navbar / Tabs */}
          <div className="flex space-x-8 border-b border-gray-200 relative">
            {options.map((opt, idx) => (
              <button
                key={opt.id || idx}
                onClick={() => setActiveTab(idx)}
                className={`pb-4 px-2 text-lg font-medium transition-all relative ${
                  activeTab === idx ? 'text-black' : 'text-gray-400 hover:text-gray-700'
                }`}
              >
                {opt.name}
                {activeTab === idx && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black rounded-t-full" />
                )}
              </button>
            ))}
          </div>
          
          {/* Detailed Sub-View */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-10 shadow-sm transition-all duration-500 ease-in-out">
            <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-4">
              <div>
                <h3 className="text-4xl font-bold tracking-tight mb-2 text-gray-900">{options[activeTab]?.name || 'Untitled Design'}</h3>
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                  {options[activeTab]?.style || 'Unknown Style'}
                </span>
              </div>
              <div className="text-left md:text-right bg-green-50 px-4 py-3 rounded-xl border border-green-100">
                <span className="text-sm font-semibold text-green-700 uppercase tracking-wider block mb-1">Estimated Cost</span>
                <p className="text-3xl font-bold text-green-600">${options[activeTab]?.estimatedCost?.toLocaleString() || '0'}</p>
              </div>
            </div>
            
            <p className="text-gray-600 mb-10 text-lg leading-relaxed max-w-4xl">
              {options[activeTab]?.description || 'No description provided.'}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold flex items-center text-gray-900">
                  <span className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 inline-flex items-center justify-center mr-3">🎨</span> 
                  Color Palette
                </h4>
                <div className="flex flex-wrap gap-3">
                  {Array.isArray(options[activeTab]?.colorPalette) && options[activeTab].colorPalette.map((color, idx) => (
                    <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
                       <span className="w-5 h-5 rounded-md shadow-sm border border-black/10" style={{ backgroundColor: color }}></span>
                       <span className="text-sm font-medium text-gray-700">{color}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-lg font-semibold flex items-center text-gray-900">
                  <span className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 inline-flex items-center justify-center mr-3">🧱</span> 
                  Materials
                </h4>
                <ul className="space-y-3">
                  {Array.isArray(options[activeTab]?.materials) && options[activeTab].materials.map((mat, idx) => (
                    <li key={idx} className="flex items-start text-gray-600 text-sm">
                      <svg className="w-5 h-5 text-amber-500 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {mat}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-lg font-semibold flex items-center text-gray-900">
                  <span className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 inline-flex items-center justify-center mr-3">🪑</span> 
                  Furniture Suggestions
                </h4>
                <ul className="space-y-3">
                  {Array.isArray(options[activeTab]?.furnitureSuggestions) && options[activeTab].furnitureSuggestions.map((furn, idx) => (
                    <li key={idx} className="flex items-start text-gray-600 text-sm">
                      <svg className="w-5 h-5 text-blue-500 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      {furn}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
