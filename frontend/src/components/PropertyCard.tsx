import type { PropertyResult } from '../types';

interface PropertyCardProps {
  property: PropertyResult;
  propertyNumber: number;
}

export function PropertyCard({ property, propertyNumber }: PropertyCardProps) {
  const { address, features, predicted_price } = property;
  const propertyAge = new Date().getFullYear() - features.year_built;

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-shadow">
      {/* Header */}
      <div className={`${propertyNumber === 1 ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'bg-gradient-to-r from-purple-600 to-purple-700'} text-white p-6`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold uppercase tracking-wide">Property {propertyNumber}</span>
          <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
            {features.property_type}
          </span>
        </div>
        <h3 className="text-xl font-bold mb-3">{address}</h3>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <p className="text-sm opacity-90 mb-1">Predicted Price</p>
          <p className="text-3xl font-bold">${predicted_price.toLocaleString()}</p>
        </div>
      </div>

      {/* Features */}
      <div className="p-6 space-y-4">
        {/* Key Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">Bedrooms</p>
            <p className="text-2xl font-bold text-gray-900">🛏️ {features.bedrooms}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">Bathrooms</p>
            <p className="text-2xl font-bold text-gray-900">🚿 {features.bathrooms}</p>
          </div>
        </div>

        {/* Area Info */}
        <div className="space-y-2">
          {features.property_type === 'SFH' ? (
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Lot Area</span>
              <span className="text-sm font-semibold text-gray-900">
                {features.lot_area.toLocaleString()} sq ft
              </span>
            </div>
          ) : (
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Building Area</span>
              <span className="text-sm font-semibold text-gray-900">
                {features.building_area.toLocaleString()} sq ft
              </span>
            </div>
          )}

          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Year Built</span>
            <span className="text-sm font-semibold text-gray-900">
              {features.year_built} ({propertyAge} years old)
            </span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">School Rating</span>
            <span className="text-sm font-semibold text-gray-900">
              ⭐ {features.school_rating}/10
            </span>
          </div>
        </div>

        {/* Amenities */}
        <div className="pt-2">
          <p className="text-xs text-gray-600 mb-2 font-semibold uppercase tracking-wide">Amenities</p>
          <div className="flex flex-wrap gap-2">
            {features.has_pool && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                🏊 Pool
              </span>
            )}
            {features.has_garage && (
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                🚗 Garage
              </span>
            )}
            {!features.has_pool && !features.has_garage && (
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                No additional amenities
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}