import { useState } from 'react';
import { PropertyComparison } from './components/PropertyComparison';
import { ComparisonForm } from './components/ComparisonForm';
import type { ComparisonResponse } from './types';

function App() {
  const [comparisonData, setComparisonData] = useState<ComparisonResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCompare = async (address1: string, address2: string) => {
    setLoading(true);
    setError(null);
    setComparisonData(null);

    try {
      const property1 = {
        address: address1,
        features: {
          property_type: "SFH",
          lot_area: 4500,
          building_area: 1800,
          bedrooms: 3,
          bathrooms: 2,
          year_built: 2005,
          has_pool: false,
          has_garage: true,
          school_rating: 8,
        },
      };

      const property2 = {
        address: address2,
        features: {
          property_type: "Condo",
          lot_area: 2000,
          building_area: 1200,
          bedrooms: 2,
          bathrooms: 1,
          year_built: 2010,
          has_pool: true,
          has_garage: false,
          school_rating: 7,
        },
      };

      const response = await fetch("https://casefilemirabackend.onrender.com/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ property1, property2 }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data: ComparisonResponse = await response.json();
      console.log("API Response:", data);

      setComparisonData(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">

      {/* Only title animation keyframes */}
      <style>{`
        @keyframes border-move-h {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
     
        .border-animate-h {
          animation: border-move-h 2s linear infinite;
        }
        .border-animate-v {
          animation: border-move-v 2s linear infinite;
        }
      `}</style>

      <div className="container mx-auto px-4 py-8">

        {/* Header - ONLY this has animation */}
        <div className="text-center mb-12">
          <div className="relative overflow-hidden inline-block px-6 py-4 bg-purple-500/20 border border-purple-500/30 rounded-xl">

            {/* Animated Borders (smaller & only on title) */}
            <span className="absolute top-0 left-0 h-0.5 w-1/2 bg-purple-400 border-animate-h" />
            <span className="absolute bottom-0 left-0 h-0.5 w-1/2 bg-purple-400 border-animate-h" />
            {/* <span className="absolute top-0 right-0 w-0.5 h-1/2 bg-purple-400 border-animate-v" />
            <span className="absolute bottom-0 left-0 w-0.5 h-1/2 bg-purple-400 border-animate-v" /> */}

            <h1 className="text-4xl font-bold text-white">
              🏠 Property Comparison Tool
            </h1>
          </div>

          <p className="text-gray-300 mt-3">
            Compare two properties side-by-side with AI-powered predictions
          </p>
        </div>

        {/* Form (NO ANIMATION HERE ANYMORE) */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4">
            <ComparisonForm onCompare={handleCompare} loading={loading} />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="max-w-3xl mx-auto mb-6">
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-red-300 font-semibold">⚠️ {error}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {comparisonData && (
          <PropertyComparison data={comparisonData} />
        )}

        {/* Footer */}
        <footer className="text-center text-gray-400 mt-12 text-sm">
          Powered by ML Price Prediction Model v2
        </footer>
      </div>
    </div>
  );
}

export default App;
