export type PropertyType = 'SFH' | 'Condo';

export interface PropertyFeatures {
  property_type: PropertyType;
  lot_area: number;
  building_area: number;
  bedrooms: number;
  bathrooms: number;
  year_built: number;
  has_pool: boolean;
  has_garage: boolean;
  school_rating: number;
}

export interface PropertyResult {
  address: string;
  features: PropertyFeatures;
  predicted_price: number;
}

export interface ComparisonResponse {
  property1: PropertyResult;
  property2: PropertyResult;
}