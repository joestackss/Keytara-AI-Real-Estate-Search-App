// Search Types
export interface SearchResult {
  bathrooms: number;
  bedrooms: number;
  city: string;
  country: string;
  currency: string;
  datePriceChanged?: number;
  daysOnZillow: number;
  homeStatus: string;
  homeStatusForHDP: string;
  homeType: string;
  imgSrc: string;
  isFeatured: boolean;
  isNonOwnerOccupied: boolean;
  isPreforeclosureAuction: boolean;
  isPremierBuilder: boolean;
  isShowcaseListing: boolean;
  isUnmappable: boolean;
  isZillowOwned: boolean;
  latitude: number;
  listing_sub_type: {
    is_FSBA: boolean;
    is_openHouse?: boolean;
  };
  livingArea: number;
  longitude: number;
  lotAreaUnit: string;
  lotAreaValue: number;
  openHouse?: string;
  price: number;
  priceChange?: number;
  priceForHDP: number;
  priceReduction?: string;
  shouldHighlight: boolean;
  state: string;
  streetAddress: string;
  taxAssessedValue: number;
  timeOnZillow: number;
  unit?: string;
  zipcode: string;
  zpid: number;
  zestimate?: number;
  rentZestimate?: number;
}

export interface SearchResponse {
  results: SearchResult[];
  resultsPerPage: number;
  totalPages: number;
  totalResultCount: number;
}

// Property Details Types
export interface PropertyAddress {
  city: string;
  community: string | null;
  neighborhood: string | null;
  state: string;
  streetAddress: string;
  subdivision: string | null;
  zipcode: string;
}

export interface AttributionInfo {
  agentName: string | null;
  agentPhoneNumber: string | null;
  brokerName: string | null;
  brokerPhoneNumber: string | null;
  mlsId: string | null;
  mlsName: string | null;
  providerLogo: string | null;
}

export interface School {
  assigned: boolean | null;
  distance: number;
  grades: string;
  isAssigned: boolean | null;
  level: string;
  link: string;
  name: string;
  rating: number;
  size: number | null;
  studentsPerTeacher: number | null;
  totalCount: number | null;
  type: string;
}

export interface PhotoSource {
  url: string;
  width: number;
}

export interface PropertyPhoto {
  caption: string;
  mixedSources: {
    jpeg: PhotoSource[];
    webp: PhotoSource[];
  };
}

export interface PriceHistoryItem {
  attributeSource: {
    infoString1: string;
    infoString2: string;
    infoString3: string | null;
  };
  buyerAgent: any | null;
  date: string;
  event: string;
  postingIsRental: boolean;
  price: number;
  priceChangeRate: number;
  pricePerSquareFoot: number;
  sellerAgent: any | null;
  showCountyLink: boolean;
  source: string;
  time: number;
}

export interface TaxHistoryItem {
  taxIncreaseRate: number;
  taxPaid: number;
  time: number;
  value: number;
  valueIncreaseRate: number;
}

export interface ResoFacts {
  appliances?: string[];
  associationFee?: string;
  associationName?: string;
  associationPhone?: string;
  atAGlanceFacts?: Array<{
    factLabel: string;
    factValue: string | null;
  }>;
  bathrooms: number;
  bathroomsFull: number | null;
  bathroomsHalf: number | null;
  bedrooms: number;
  cooling?: string[];
  hasAssociation: boolean;
  hasAttachedGarage: boolean;
  hasCooling: boolean;
  hasFireplace: boolean;
  hasGarage: boolean;
  hasHeating: boolean;
  hasView: boolean;
  heating?: string[];
  homeType: string;
  interiorFeatures?: string[];
  laundryFeatures?: string[];
  livingArea: string;
  lotSize: string;
  parkingCapacity?: number;
  parkingFeatures?: string[];
  pricePerSquareFoot: number;
  propertySubType?: string[];
  roomTypes?: string[];
  taxAnnualAmount: number;
  taxAssessedValue: number;
  view?: string[];
  yearBuilt: number;
  zoning?: string;
}

export interface PropertyDetails {
  abbreviatedAddress: string;
  address: PropertyAddress;
  attributionInfo: AttributionInfo;
  bathrooms: number;
  bedrooms: number;
  city: string;
  country: string;
  county: string;
  currency: string;
  datePostedString: string;
  daysOnZillow: number;
  description: string;
  favoriteCount: number;
  homeStatus: string;
  homeType: string;
  latitude: number;
  livingArea: number;
  livingAreaUnits: string;
  livingAreaUnitsShort: string;
  livingAreaValue: number;
  longitude: number;
  lotAreaUnits: string;
  lotAreaValue: number;
  lotSize: number;
  monthlyHoaFee?: number;
  originalPhotos: PropertyPhoto[];
  photoCount: number;
  price: number;
  priceChange?: number;
  priceHistory: PriceHistoryItem[];
  resoFacts: ResoFacts;
  schools: School[];
  state: string;
  streetAddress: string;
  yearBuilt: number;
  zipcode: string;
  zpid: number;
  zestimate?: number | null;
}

// Walk/Transit/Bike Score Types
export interface WalkScore {
  description: string;
  walkscore: number;
  ws_link: string;
}

export interface TransitScore {
  description: string;
  transit_score: number;
  ws_link: string;
}

export interface BikeScore {
  bikescore: number;
  description: string;
}

export interface PropertyScores {
  data: {
    property: {
      bikeScore: BikeScore;
      id: string;
      transitScore: TransitScore;
      walkScore: WalkScore;
    };
  };
}

// Photos Response Type
export interface PhotosResponse {
  photos: PropertyPhoto[];
}

// Schools Response Type
export interface SchoolsResponse {
  schools: School[];
}

// Price & Tax History Response Type
export interface PriceHistoryResponse {
  priceHistory: PriceHistoryItem[];
  taxHistory: TaxHistoryItem[];
}

// Search Parameters
export interface SearchParams {
  location: string;
  status?: "forSale" | "forRent" | "recentlySold";
  bedrooms?: number;
  bathrooms?: number;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string;
}

// Saved Property Type (simplified for storage)
export interface SavedProperty {
  zpid: number;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  livingArea: number;
  imgSrc: string;
  city: string;
  state: string;
  zipcode: string;
  savedAt: number;
}
