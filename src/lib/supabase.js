/**
 * Supabase API functions for listings management
 * COMPREHENSIVE FILTER SUPPORT INCLUDING TRANSACTION TYPE
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ MISSING SUPABASE ENVIRONMENT VARIABLES!');
  console.error('SUPABASE_URL:', SUPABASE_URL);
  console.error('SUPABASE_KEY present:', !!SUPABASE_KEY);
  console.error('Please check your .env.local file contains:');
  console.error('NEXT_PUBLIC_SUPABASE_URL=https://phaxtzaskkqkwpszzddh.supabase.co');
  console.error('NEXT_PUBLIC_SUPABASE_KEY=your_key_here');
  throw new Error('Missing Supabase environment variables');
} else {
  console.log('✅ Supabase environment variables loaded');
  console.log('SUPABASE_URL:', SUPABASE_URL);
  console.log('SUPABASE_KEY present:', !!SUPABASE_KEY);
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
      // Handle multiple cities separated by |
      if (city.includes('|')) {
        const cities = city.split('|');
        const cityConditions = cities.map(c => `city.ilike.*${c.trim()}*`).join(',');
        url.searchParams.append('or', `(${cityConditions})`);
      } else {
        url.searchParams.append('city', `ilike.*${city}*`);
      }
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
      console.log('🏷️ Transaction Type Filter:', { 
        original: transactionType, 
        mapped: apiType, 
        query: `data->transactionType->>id=eq.${apiType}` 
      });
      url.searchParams.append('data->transactionType->>id', `eq.${apiType}`);
    }
    
    // Bedrooms filter
    if (bedrooms && bedrooms !== 'Any Bedrooms' && bedrooms !== '') {
      if (bedrooms === '4+' || bedrooms === '6+') {
        const minBeds = bedrooms === '6+' ? 6 : 4;
        url.searchParams.append('data->numberOf->bedrooms', `gte.${minBeds}`);
      } else {
        url.searchParams.append('data->numberOf->bedrooms', `eq.${parseInt(bedrooms)}`);
      }
    }
    
    // Bathrooms filter  
    if (bathrooms && bathrooms !== 'Any Bathrooms' && bathrooms !== '') {
      if (bathrooms === '4+' || bathrooms === '5+') {
        const minBaths = bathrooms === '5+' ? 5 : 4;
        url.searchParams.append('data->numberOf->bathrooms', `gte.${minBaths}`);
      } else {
        url.searchParams.append('data->numberOf->bathrooms', `eq.${parseInt(bathrooms)}`);
      }
    }
    
    // Price range filters - use simple filters instead of complex OR conditions
    if (minPrice && minPrice !== '' && minPrice !== 'Min Price') {
      const price = parseInt(minPrice.toString().replace(/[^0-9]/g, ''));
      if (!isNaN(price)) {
        // Use converted USD price if available, otherwise filter on all prices
        url.searchParams.append('data->price->values->1->value', `gte.${price}`);
      }
    }
    
    if (maxPrice && maxPrice !== '' && maxPrice !== 'Max Price') {
      const price = parseInt(maxPrice.toString().replace(/[^0-9]/g, ''));
      if (!isNaN(price)) {
        // Use converted USD price if available, otherwise filter on all prices
        url.searchParams.append('data->price->values->1->value', `lte.${price}`);
      }
    }
    
    // Size filters - use area.total as primary filter
    if (minSize && minSize !== '' && minSize !== 'Min (SqFt)') {
      const size = parseInt(minSize.toString().replace(/[^0-9]/g, ''));
      if (!isNaN(size)) {
        url.searchParams.append('data->area->total', `gte.${size}`);
      }
    }
    
    if (maxSize && maxSize !== '' && maxSize !== 'Max (SqFt)') {
      const size = parseInt(maxSize.toString().replace(/[^0-9]/g, ''));
      if (!isNaN(size)) {
        url.searchParams.append('data->area->total', `lte.${size}`);
      }
    }
    
    // Search in title, description, or address - use proper JSONB text extraction with casting
    if (search && search.trim() !== '') {
      const searchTerm = search.trim();
      // Use ->> for text extraction and cast to text to use ilike
      const searchQuery = `data->title->0->>text.ilike.*${searchTerm}*,data->descriptionFull->0->>text.ilike.*${searchTerm}*,data->location->>address1.ilike.*${searchTerm}*,data->location->>city.ilike.*${searchTerm}*`;
      url.searchParams.append('or', `(${searchQuery})`);
    }
    
    // Sorting - handle new price structure
    let orderField = sortBy;
    if (sortBy === 'price') {
      // Try to sort by converted USD price, fallback to original price
      orderField = 'data->price->values->0->value';
    }
    url.searchParams.append('order', `${orderField}.${sortOrder}`);
    
    // Pagination
    url.searchParams.append('limit', limit.toString());
    url.searchParams.append('offset', offset.toString());
    
    console.log('🌐 Comprehensive API URL:', url.toString());
    
    // Extra debugging for transaction type
    if (transactionType) {
      console.log('🔍 Transaction Type Debug:', {
        filterValue: transactionType,
        isInUrl: url.toString().includes('transactionType'),
        fullUrl: url.toString()
      });
    }

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
    
    // Debug: Show unique transaction types in the response
    if (data.length > 0) {
      const transactionTypes = data
        .map(item => item.data?.transactionType)
        .filter(Boolean)
        .map(type => ({ id: type.id, name: type.name }));
      
      const uniqueTypes = [...new Map(transactionTypes.map(t => [t.id, t])).values()];
      if (uniqueTypes.length > 0) {
        console.log('🏷️ Available transaction types in data:', uniqueTypes);
      }
    }
    
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
    const { country, city, transactionType, search } = filters;
    
    if (country && country !== 'All Countries') {
      url.searchParams.append('country', `eq.${country}`);
    }
    if (city && city !== 'All Cities') {
      // Handle multiple cities separated by |
      if (city.includes('|')) {
        const cities = city.split('|');
        const cityConditions = cities.map(c => `city.ilike.*${c.trim()}*`).join(',');
        url.searchParams.append('or', `(${cityConditions})`);
      } else {
        url.searchParams.append('city', `ilike.*${city}*`);
      }
    }
    if (transactionType && transactionType !== 'All Types') {
      const typeMapping = { 'Sale': 'Sell', 'Rent': 'Rent', 'For Sale': 'Sell', 'For Rent': 'Rent' };
      const apiType = typeMapping[transactionType] || transactionType;
      url.searchParams.append('data->transactionType->>id', `eq.${apiType}`);
    }
    if (search && search.trim() !== '') {
      const searchTerm = search.trim();
      const searchQuery = `data->title->0->>text.ilike.*${searchTerm}*,data->descriptionFull->0->>text.ilike.*${searchTerm}*,data->location->>address1.ilike.*${searchTerm}*,data->location->>city.ilike.*${searchTerm}*`;
      url.searchParams.append('or', `(${searchQuery})`);
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
    console.log('🔍 Fetching listing by ID:', id);
    
    // Validate ID
    if (!id || id === 'undefined' || id === 'null') {
      console.error('❌ Invalid ID provided:', id);
      throw new Error('Invalid listing ID');
    }

    const url = `${SUPABASE_URL}/rest/v1/listings?id=eq.${id}`;
    console.log('🌐 API URL:', url);

    const response = await fetch(url, {
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
      throw new Error(`Failed to fetch listing: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Successfully fetched listing:', data.length > 0 ? 'Found' : 'Not found');
    
    return data[0] || null;
  } catch (error) {
    console.error('❌ getListingById error:', error);
    throw error;
  }
}

/**
 * Get distinct countries from listings
 */
export async function getDistinctCountries() {
  try {
    console.log('🌍 Fetching distinct countries');
    
    const url = new URL(`${SUPABASE_URL}/rest/v1/listings`);
    url.searchParams.append('select', 'country');
    url.searchParams.append('order', 'country.asc');
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch countries: ${response.status}`);
    }

    const data = await response.json();
    
    // Get unique countries and filter out null/empty values
    const countries = [...new Set(data.map(item => item.country))]
      .filter(country => country && country.trim() !== '')
      .map(country => ({
        value: country.toLowerCase(),
        label: country.toUpperCase()
      }));
    
    console.log('✅ Found', countries.length, 'distinct countries');
    return countries;
  } catch (error) {
    console.error('❌ getDistinctCountries error:', error);
    return [];
  }
}

/**
 * Get distinct cities from listings, optionally filtered by country
 */
export async function getDistinctCities(country = '') {
  try {
    console.log('🏙️ Fetching distinct cities', country ? `for country: ${country}` : '');
    
    const url = new URL(`${SUPABASE_URL}/rest/v1/listings`);
    url.searchParams.append('select', 'city');
    url.searchParams.append('order', 'city.asc');
    
    if (country && country !== '') {
      url.searchParams.append('country', `eq.${country}`);
    }
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch cities: ${response.status}`);
    }

    const data = await response.json();
    
    // Get unique cities and filter out null/empty values
    const cities = [...new Set(data.map(item => item.city))]
      .filter(city => city && city.trim() !== '')
      .map(city => ({
        value: city,
        label: city.charAt(0).toUpperCase() + city.slice(1)
      }));
    
    console.log('✅ Found', cities.length, 'distinct cities');
    return cities;
  } catch (error) {
    console.error('❌ getDistinctCities error:', error);
    return [];
  }
}

/**
 * Get random listings for homepage display
 */
export async function getRandomListings(count = 6, defaultCity = 'New York') {
  try {
    console.log(`🎲 Fetching ${count} random listings from ${defaultCity} for homepage`);
    
    const url = new URL(`${SUPABASE_URL}/rest/v1/listings`);
    
    // Filter by city (using wildcard search to match city names)
    if (defaultCity && defaultCity !== '') {
      url.searchParams.append('city', `ilike.*${defaultCity}*`);
    }
    
    // Get more records and randomize on client-side since random() isn't supported
    url.searchParams.append('order', 'created_at.desc');
    url.searchParams.append('limit', (count * 3).toString()); // Get 3x more to randomize from
    
    console.log('🌐 Random listings API URL:', url.toString());

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('📡 Random listings response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Random listings API Error:', errorText);
      throw new Error(`Supabase API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Successfully fetched', data.length, 'listings from', defaultCity);
    
    // If no listings found for the default city, try without city filter
    if (data.length === 0 && defaultCity) {
      console.log(`⚠️ No listings found for ${defaultCity}, trying without city filter...`);
      return getRandomListings(count, ''); // Recursive call without city filter
    }
    
    // Randomize and return the requested count
    const shuffled = data.sort(() => 0.5 - Math.random());
    const randomized = shuffled.slice(0, count);
    console.log('✅ Randomized to', randomized.length, 'listings');
    
    return randomized;
  } catch (error) {
    console.error('❌ getRandomListings error:', error);
    throw error;
  }
}