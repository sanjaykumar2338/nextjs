import { getListings } from '@/lib/supabase';
import Link from 'next/link';

interface Listing {
  id: number;
  country: string;
  city: string;
  data?: {
    title?: Array<{ text: string; language: string; original?: boolean }>;
    price?: {
      values?: Array<{ value: number; currencyId: string }>;
    };
    numberOf?: {
      bedrooms?: number;
      bathrooms?: number;
    };
  };
  images?: string[];
  created_at: string;
}

interface ListingsServerPageProps {
  searchParams: Promise<{
    country?: string;
    city?: string;
    page?: string;
    limit?: string;
  }>;
}

export default async function ListingsServerPage({ searchParams }: ListingsServerPageProps) {
  // Await searchParams for Next.js 15
  const params = await searchParams;
  
  // Extract parameters with defaults matching client requirements
  const country = params.country || 'mx';
  const city = params.city || 'caribbean vida';
  const page = parseInt(params.page || '1');
  const limit = parseInt(params.limit || '10');
  const offset = (page - 1) * limit;

  let listings: Listing[] = [];
  let error: string | null = null;

  try {
    console.log('🔍 Server-side fetching with:', { country, city, limit, offset });
    
    listings = await getListings({
      country,
      city,
      limit,
      offset
    });
    
    console.log('✅ Server-side fetched', listings.length, 'listings');
  } catch (err: unknown) {
    console.error('❌ Server-side fetch error:', err);
    error = (err as Error)?.message || 'Failed to load listings';
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">🏠 Server-Side Supabase Listings</h1>
      
      {/* Current Parameters */}
      <div className="bg-blue-50 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">📊 Current Parameters</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium">Country:</span> 
            <span className="ml-2 px-2 py-1 bg-white rounded">{country || 'All'}</span>
          </div>
          <div>
            <span className="font-medium">City:</span> 
            <span className="ml-2 px-2 py-1 bg-white rounded">{city || 'All'}</span>
          </div>
          <div>
            <span className="font-medium">Page:</span> 
            <span className="ml-2 px-2 py-1 bg-white rounded">{page}</span>
          </div>
          <div>
            <span className="font-medium">Per Page:</span> 
            <span className="ml-2 px-2 py-1 bg-white rounded">{limit}</span>
          </div>
        </div>
        
        {/* API Call Display */}
        <div className="mt-4 p-3 bg-gray-800 text-white rounded text-sm overflow-x-auto">
          <code>
            getListings({`{ country: "${country}", city: "${city}", limit: ${limit}, offset: ${offset} }`})
          </code>
        </div>
      </div>

      {/* Quick Filter Links */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">🔗 Quick Test Links (Easy Configuration)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <Link 
            href="/listings-server?country=mx&city=caribbean%20vida&limit=10"
            className="p-3 bg-white border rounded hover:bg-blue-50 text-center"
          >
            🇲🇽 Mexico - Caribbean Vida (10)
          </Link>
          <Link 
            href="/listings-server?country=mx&city=playa&limit=5"
            className="p-3 bg-white border rounded hover:bg-blue-50 text-center"
          >
            🇲🇽 Mexico - Playa (5)
          </Link>
          <Link 
            href="/listings-server?country=mx&limit=20"
            className="p-3 bg-white border rounded hover:bg-blue-50 text-center"
          >
            🇲🇽 All Mexico (20)
          </Link>
          <Link 
            href="/listings-server?country=us&limit=10"
            className="p-3 bg-white border rounded hover:bg-blue-50 text-center"
          >
            🇺🇸 USA Listings (10)
          </Link>
          <Link 
            href="/listings-server?country=&city=&limit=15"
            className="p-3 bg-white border rounded hover:bg-blue-50 text-center"
          >
            🌍 All Countries (15)
          </Link>
          <Link 
            href={`/listings-server?country=${country}&city=${city}&page=${page + 1}&limit=${limit}`}
            className="p-3 bg-white border rounded hover:bg-green-50 text-center"
          >
            ➡️ Next Page ({page + 1})
          </Link>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <h2 className="text-red-800 text-xl font-semibold mb-2">❌ Error</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <Link 
            href="/listings-server"
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            🔄 Try Default Parameters
          </Link>
        </div>
      )}

      {/* Results */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">
          📋 Results: {listings.length} listings found
        </h2>
        
        {/* Pagination */}
        {listings.length > 0 && (
          <div className="flex justify-center gap-4 mb-6">
            {page > 1 && (
              <Link
                href={`/listings-server?country=${country}&city=${encodeURIComponent(city)}&page=${page - 1}&limit=${limit}`}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                ← Page {page - 1}
              </Link>
            )}
            <span className="px-4 py-2 bg-gray-100 rounded">
              Page {page}
            </span>
            {listings.length === limit && (
              <Link
                href={`/listings-server?country=${country}&city=${encodeURIComponent(city)}&page=${page + 1}&limit=${limit}`}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Page {page + 1} →
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Listings Grid */}
      {listings.length === 0 && !error ? (
        <div className="text-center py-12">
          <h3 className="text-xl text-gray-600">🔍 No listings found</h3>
          <p className="text-gray-500 mt-2">Try different parameters with the quick links above</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div key={listing.id} className="bg-white border rounded-lg overflow-hidden shadow-sm">
              {/* Image */}
              <div className="relative h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                {listing.images && listing.images.length > 0 ? (
                  <img
                    src={listing.images[0]}
                    alt={listing.data?.title?.[0]?.text || 'Property'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600">
                    🏠 No Image Available
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">
                  {listing.data?.title?.[0]?.text || `Listing ${listing.id}`}
                </h3>
                
                <p className="text-gray-600 mb-2">
                  📍 {listing.city}, {listing.country.toUpperCase()}
                </p>
                
                {listing.data?.price?.values?.[0] && (
                  <p className="text-2xl font-bold text-green-600 mb-3">
                    ${listing.data.price.values[0].value.toLocaleString()} {listing.data.price.values[0].currencyId}
                  </p>
                )}
                
                {listing.data?.numberOf && (
                  <div className="flex gap-4 text-sm text-gray-500 mb-3">
                    {listing.data.numberOf.bedrooms && (
                      <span>🛏️ {listing.data.numberOf.bedrooms} bed</span>
                    )}
                    {listing.data.numberOf.bathrooms && (
                      <span>🚿 {listing.data.numberOf.bathrooms} bath</span>
                    )}
                  </div>
                )}
                
                <div className="text-xs text-gray-400">
                  <p>ID: {listing.id}</p>
                  <p>Created: {new Date(listing.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="mt-8 text-center">
        <Link 
          href="/listings-supabase"
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 mr-4"
        >
          🔄 Try Client-Side Version
        </Link>
        <Link 
          href="/test-listings"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          📋 Test Dashboard
        </Link>
      </div>
    </div>
  );
}