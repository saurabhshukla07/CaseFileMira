import type { ComparisonResponse } from '../types';
import { PropertyCard } from './PropertyCard';

interface PropertyComparisonProps {
  data: ComparisonResponse;
}

export function PropertyComparison({ data }: PropertyComparisonProps) {
  const priceDiff = Math.abs(data.property1.predicted_price - data.property2.predicted_price);
  const higherProperty = data.property1.predicted_price > data.property2.predicted_price ? 1 : 2;
  const percentDiff = (
    (priceDiff / Math.min(data.property1.predicted_price, data.property2.predicted_price)) * 100
  ).toFixed(1);

  return (
    <div className="max-w-6xl mx-auto mt-10 space-y-6">
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          📊 Price Comparison Summary
        </h2>
        <div className="flex items-center justify-center space-x-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Price Difference</p>
            <p className="text-3xl font-bold text-indigo-600">
              ${priceDiff.toLocaleString()}
            </p>
          </div>

          <div className="text-4xl text-gray-300">•</div>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Higher Property</p>
            <p className="text-3xl font-bold text-purple-600">
              Property {higherProperty}
            </p>
          </div>

          <div className="text-4xl text-gray-300">•</div>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Difference</p>
            <p className="text-3xl font-bold text-blue-600">
              {percentDiff}%
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <PropertyCard property={data.property1} propertyNumber={1} />
        <PropertyCard property={data.property2} propertyNumber={2} />
      </div>
    </div>
  );
}