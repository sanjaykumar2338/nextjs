/**
 * Supabase API functions for listings management
 * COMPREHENSIVE FILTER SUPPORT INCLUDING TRANSACTION TYPE
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ MISSING SUPABASE ENVIRONMENT VARIABLES!');
  console.error('Please check your .env.local file contains:');
  console.error('NEXT_PUBLIC_SUPABASE_URL=https://phaxtzaskkqkwpszzddh.supabase.co');
  console.error('NEXT_PUBLIC_SUPABASE_KEY=your_key_here');
  throw new Error('Missing Supabase environment variables');
}

/**
 * Fetches listings from Supabase with comprehensive filters
 * Supports all UI filters: transactionType, country, city, price range, bedrooms, bathrooms, etc.
 */
export async function getListings({ 
  // Basic filters
  country = '', 
  city = '', 
  transactionType = '', // 'Sell' or 'Rent'
  
  // Property details
  bedrooms = '', 
  bathrooms = '',
  minPrice = '',
  maxPrice = '',
  minSize = '',
  maxSize = '',
  
  // Search
  search = '',
  
  // Pagination
  limit = 10, 
  offset = 0,
  
  // Sorting
  sortBy = 'created_at',
  sortOrder = 'desc'
} = {}) {
  try {
    console.log('🔍 Fetching listings with comprehensive filters:', { 
      country, city, transactionType, bedrooms, bathrooms, 
      minPrice, maxPrice, search, limit, offset, sortBy, sortOrder 
    });
    
    const url = new URL(`${SUPABASE_URL}/rest/v1/listings`);
    
    // Country filter
    if (country && country !== 'All Countries' && country !== '') {
      url.searchParams.append('country', `eq.${country}`);
    }
    
    // City filter with wildcard search
    if (city && city !== 'All Cities' && city !== '') {
      url.searchParams.append('city', `ilike.*${city}*`);
    }
    
    // Transaction type filter (Sale/Rent)
    if (transactionType && transactionType !== 'All Types' && transactionType !== '') {
      // Map UI values to API values
      const typeMapping = {
        'Sale': 'Sell',
        'Rent': 'Rent',
        'For Sale': 'Sell', 
        'For Rent': 'Rent'
      };
      const apiType = typeMapping[transactionType] || transactionType;
      url.searchParams.append('data->transactionType->id', `eq.${apiType}`);
    }
    
    // Bedrooms filter
    if (bedrooms && bedrooms !== 'Any Bedrooms' && bedrooms !== '') {
      if (bedrooms === '4+') {
        url.searchParams.append('data->numberOf->bedrooms', `gte.4`);
      } else {
        url.searchParams.append('data->numberOf->bedrooms', `eq.${parseInt(bedrooms)}`);
      }
    }
    
    // Bathrooms filter  
    if (bathrooms && bathrooms !== 'Any Bathrooms' && bathrooms !== '') {
      if (bathrooms === '4+') {
        url.searchParams.append('data->numberOf->bathrooms', `gte.4`);
      } else {
        url.searchParams.append('data->numberOf->bathrooms', `eq.${parseInt(bathrooms)}`);
      }
    }
    
    // Price range filters
    if (minPrice && minPrice !== '' && minPrice !== 'Min Price') {
      const price = parseInt(minPrice.toString().replace(/[^0-9]/g, ''));
      if (!isNaN(price)) {
        url.searchParams.append('data->price->values->0->value', `gte.${price}`);
      }
    }
    
    if (maxPrice && maxPrice !== '' && maxPrice !== 'Max Price') {
      const price = parseInt(maxPrice.toString().replace(/[^0-9]/g, ''));
      if (!isNaN(price)) {
        url.searchParams.append('data->price->values->0->value', `lte.${price}`);
      }
    }
    
    // Size filters
    if (minSize && minSize !== '' && minSize !== 'Min (SqFt)') {
      const size = parseInt(minSize.toString().replace(/[^0-9]/g, ''));
      if (!isNaN(size)) {
        url.searchParams.append('data->area->living', `gte.${size}`);
      }
    }
    
    if (maxSize && maxSize !== '' && maxSize !== 'Max (SqFt)') {
      const size = parseInt(maxSize.toString().replace(/[^0-9]/g, ''));
      if (!isNaN(size)) {
        url.searchParams.append('data->area->living', `lte.${size}`);
      }
    }
    
    // Search in title, description, or address
    if (search && search.trim() !== '') {
      url.searchParams.append('or', `data->title->0->text.ilike.*${search}*,data->descriptionFull->0->text.ilike.*${search}*,data->location->address1.ilike.*${search}*`);
    }
    
    // Sorting
    const orderField = sortBy === 'price' ? 'data->price->values->0->value' : sortBy;
    url.searchParams.append('order', `${orderField}.${sortOrder}`);
    
    // Pagination
    url.searchParams.append('limit', limit.toString());
    url.searchParams.append('offset', offset.toString());
    
    console.log('🌐 Comprehensive API URL:', url.toString());

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('📡 Response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error Response:', errorText);
      throw new Error(`Supabase API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Successfully fetched', data.length, 'listings');
    
    return data;
  } catch (error) {
    console.error('❌ getListings error:', error);
    throw error;
  }
}

/**
 * Get total count of listings for pagination
 */
export async function getListingsCount(filters = {}) {
  try {
    const url = new URL(`${SUPABASE_URL}/rest/v1/listings`);
    
    // Apply same filters as getListings but get count
    const { country, city, transactionType, bedrooms, bathrooms, minPrice, maxPrice, search } = filters;
    
    if (country && country !== 'All Countries') {
      url.searchParams.append('country', `eq.${country}`);
    }
    if (city && city !== 'All Cities') {
      url.searchParams.append('city', `ilike.*${city}*`);
    }
    if (transactionType && transactionType !== 'All Types') {
      const typeMapping = { 'Sale': 'Sell', 'Rent': 'Rent', 'For Sale': 'Sell', 'For Rent': 'Rent' };
      const apiType = typeMapping[transactionType] || transactionType;
      url.searchParams.append('data->transactionType->id', `eq.${apiType}`);
    }
    if (search && search.trim() !== '') {
      url.searchParams.append('or', `data->title->0->text.ilike.*${search}*,data->descriptionFull->0->text.ilike.*${search}*`);
    }
    
    // Get count only
    url.searchParams.append('select', 'count');
    
    const response = await fetch(url.toString(), {
      method: 'HEAD', // HEAD request for count
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'count=exact'
      }
    });
    
    const count = response.headers.get('Content-Range');
    return count ? parseInt(count.split('/')[1]) : 0;
  } catch (error) {
    console.error('❌ getListingsCount error:', error);
    return 0;
  }
}

/**
 * Inserts a new listing into Supabase
 */
export async function insertListing(listingData) {
  try {
    console.log('➕ Inserting listing:', listingData);
    
    const response = await fetch(`${SUPABASE_URL}/rest/v1/listings`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(listingData)
    });

    console.log('📡 Insert response status:', response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ Insert error:', errorData);
      throw new Error(`Insert failed: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    console.log('✅ Successfully inserted listing');
    
    return Array.isArray(data) ? data[0] : data;
  } catch (error) {
    console.error('❌ insertListing error:', error);
    throw error;
  }
}

/**
 * Get single listing by ID
 */
export async function getListingById(id) {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/listings?id=eq.${id}`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch listing: ${response.status}`);
    }

    const data = await response.json();
    return data[0] || null;
  } catch (error) {
    console.error('❌ getListingById error:', error);
    throw error;
  }
}