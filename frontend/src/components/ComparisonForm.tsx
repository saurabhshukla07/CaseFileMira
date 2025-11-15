import { useState } from 'react';

interface ComparisonFormProps {
  onCompare: (address1: string, address2: string) => void;
  loading: boolean;
}

export function ComparisonForm({ onCompare, loading }: ComparisonFormProps) {
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');

  const handleSubmit = () => {
    if (!address1.trim() || !address2.trim()) return;
    onCompare(address1, address2);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
        Enter Property Addresses
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Property 1 Address
          </label>
          <input
            type="text"
            value={address1}
            onChange={(e) => setAddress1(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="123 Main St, New York, NY"
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Property 2 Address
          </label>
          <input
            type="text"
            value={address2}
            onChange={(e) => setAddress2(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="456 Elm St, Los Angeles, CA"
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`w-full mt-6 py-3 rounded-lg text-white font-semibold text-lg transition ${
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90'
        }`}
      >
        {loading ? 'Comparing...' : 'Compare Properties'}
      </button>
    </div>
  );
}