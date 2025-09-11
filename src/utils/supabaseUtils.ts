import { getRandomListings } from '@/lib/supabase';
import { HOMEPAGE_CONFIG } from '@/config/homepage';

// Supabase listing interface
interface SupabaseListing {
  id: number;
  country: string;
  city: string;
  // Direct properties from new API structure
  area?: {
    unit?: { id: string; name: string };
    total?: number;
    values?: Array<{
      unit: { id: string; name: string };
      total: number;
    }>;
  };
  numberOf?: {
    bedrooms?: number;
    bathrooms?: number;
  };
  transactionType?: {
    id: string;
    name: string;
  };
  price?: {
    values: Array<{ value: number; currencyId: string }>;
  };
  location?: {
    city?: string;
    address1?: string;
    latitude?: number;
    longitude?: number;
  };
  title?: Array<{ text: string; language: string; original?: boolean }>;
  data?: {
    title?: Array<{ text: string; language: string; original?: boolean }>;
    price?: {
      values?: Array<{ value: number; currencyId: string }>;
    };
    location?: {
      city?: string;
      address1?: string;
      latitude?: number;
      longitude?: number;
    };
    numberOf?: {
      bedrooms?: number;
      bathrooms?: number;
    };
    area?: {
      living?: number;
      land?: number;
      values?: Array<{
        unit: { id: string; name: string };
        total: number;
      }>;
    };
    transactionType?: {
      id: string;
      name: string;
    };
    images?: Array<{
      id: string;
      url: string;
      isPrimary?: boolean;
    }>;
    description?: Array<{ text: string; language?: string }>;
  };
  images?: string[];
  created_at: string;
}

// Property interface expected by homepage components
export interface Property {
  id: number;
  imgSrc: string;
  imgSrc2?: string;
  alt?: string;
  address: string;
  title: string;
  beds?: number;
  baths?: number;
  sqft?: number;
  categories: string;
  type: string;
  price: number;
  coordinates: [number, number];
  garages: number;
  city: string;
  description?: string;
  authorAvatar?: string;
  authorName?: string;
  authorPosition?: string;
}

/**
 * Convert Supabase listing to Property format for homepage components
 */
export function convertSupabaseListingToProperty(listing: SupabaseListing): Property {
  const data = listing.data || {};
  
  // Handle both new API structure and old data structure
  const location = listing.location || data.location || {};
  const price = listing.price?.values?.[0]?.value || data.price?.values?.[0]?.value || 0;
  const title = listing.title?.find(t => t.original || t.language === 'en')?.text || 
               data.title?.find(t => t.original || t.language === 'en')?.text || 
               `Property ${listing.id}`;
  const address = location.address1 || `${location.city || listing.city}, ${listing.country}`;
  
  // Get area in square feet from the API structure - find SquareFoot unit
  const sqftArea = data.area?.values?.find(v => v.unit?.id === "SquareFoot")?.total || 
                   listing.area?.values?.find(v => v.unit?.id === "SquareFoot")?.total || 
                   data.area?.living || 
                   0;
  
  // Get primary image or first available image
  let imgSrc = '/assets/images/home/home-1.jpg'; // fallback image
  if (data.images && data.images.length > 0) {
    const primaryImage = data.images.find(img => img.isPrimary) || data.images[0];
    if (primaryImage && primaryImage.url) {
      imgSrc = primaryImage.url;
    }
  } else if (listing.images && listing.images.length > 0) {
    imgSrc = listing.images[0];
  }
  
  // Get coordinates or default to US center
  const coordinates: [number, number] = [
    location.longitude || -98.5795,
    location.latitude || 39.8283
  ];
  
  return {
    id: listing.id,
    imgSrc,
    imgSrc2: data.images?.[1]?.url,
    alt: 'property',
    address,
    title,
    beds: listing.numberOf?.bedrooms || data.numberOf?.bedrooms || 0,
    baths: listing.numberOf?.bathrooms || data.numberOf?.bathrooms || 0,
    sqft: Math.round(sqftArea), // Round to nearest whole number
    categories: listing.transactionType?.name || data.transactionType?.name || 'Property',
    type: listing.transactionType?.id || data.transactionType?.id || 'Sale',
    price,
    coordinates,
    garages: 1, // Default value as it's not in Supabase data
    city: location.city || listing.city,
    description: data.description?.[0]?.text || 'No description available',
    authorAvatar: '/assets/images/avatar/avatar-7.jpg',
    authorName: 'Property Agent',
    authorPosition: 'Real Estate Agent'
  };
}

/**
 * Fetch random properties from Supabase and convert to Property format
 */
export async function getRandomPropertiesFromSupabase(count: number = 6, city?: string): Promise<Property[]> {
  try {
    const targetCity = city || HOMEPAGE_CONFIG.DEFAULT_CITY;
    console.log(`🏠 Fetching ${count} random properties from ${targetCity} via Supabase`);
    
    const supabaseListings = await getRandomListings(count, targetCity);
    
    const properties = supabaseListings.map(convertSupabaseListingToProperty);
    
    console.log(`✅ Converted ${properties.length} Supabase listings from ${targetCity} to Property format`);
    
    return properties;
  } catch (error) {
    console.error('❌ Error fetching random properties from Supabase:', error);
    // Return empty array on error - components can handle this gracefully
    return [];
  }
}