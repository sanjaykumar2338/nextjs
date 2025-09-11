'use client';

import { useState, useEffect } from 'react';
import { getListings, insertListing } from '@/lib/supabase';

// TypeScript interfaces
interface Listing {
  id: number;
  country: string; 
  city: string;
  data?: {
    title?: Array<{ text: string; language: string; original?: boolean }>;
    price?: {
      values?: Array<{ value: number; currencyId: string }>;
    };
    location?: {
      city?: string;
      address1?: string;
    };
    numberOf?: {
      bedrooms?: number;
      bathrooms?: number;
    };
    area?: {
      living?: number;
      land?: number;
    };
  };
  images?: string[];
  created_at: string;
}

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Filters matching client requirements
  const [filters, setFilters] = useState({
    country: 'mx',
    city: 'caribbean vida',
    limit: 10
  });

  const loadListings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const offset = (currentPage - 1) * filters.limit;
      
      console.log('🔄 Loading listings with:', {
        country: filters.country,
        city: filters.city,
        limit: filters.limit,
        offset: offset
      });
      
      const data = await getListings({
        country: filters.country,
        city: filters.city,
        limit: filters.limit,
        offset: offset
      });
      
      setListings(data);
      console.log('✅ Loaded', data.length, 'listings');
      
    } catch (err: unknown) {
      console.error('❌ Failed to load listings:', err);
      setError((err as Error)?.message || 'Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  // Load listings when filters or page changes
  useEffect(() => {
    loadListings();
  }, [filters, currentPage, loadListings]);

  const handleFilterChange = (key: string, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1); // Reset to first page
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const testInsertListing = async () => {
    try {
      setError(null);
      
      const testListing = {
        country: 'mx',
        city: 'Test City ' + Date.now(),
        external_id: Date.now(),
        data: {
          title: [{ text: 'Test Property ' + Date.now(), language: 'en', original: true }],
          price: { values: [{ value: 299000, currencyId: 'USD' }] },
          numberOf: { bedrooms: 3, bathrooms: 2 }
        },
        images: ['https://via.placeholder.com/400x300']
      };
      
      console.log('🧪 Testing insert with:', testListing);
      
      const inserted = await insertListing(testListing);
      console.log('✅ Insert successful:', inserted);
      
      // Reload listings to show the new one
      loadListings();
      
      alert('Test listing added successfully!');
    } catch (err: unknown) {
      console.error('❌ Insert failed:', err);
      setError('Insert failed: ' + (err as Error)?.message);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">🏠 Supabase Listings Integration</h1>
      
      {/* Configuration Panel */}
      <div className="bg-blue-50 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">⚙️ Configuration (Easy to Change)</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Country Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">Country:</label>
            <select
              value={filters.country}
              onChange={(e) => handleFilterChange('country', e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="mx">🇲🇽 Mexico (mx)</option>
              <option value="us">🇺🇸 United States (us)</option>
              <option value="ca">🇨🇦 Canada (ca)</option>
              <option value="">🌍 All Countries</option>
            </select>
          </div>
          
          {/* City Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">City (with wildcards):</label>
            <input
              type="text"
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
              placeholder="e.g. caribbean vida, playa, cancun"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Items per page */}
          <div>
            <label className="block text-sm font-medium mb-2">Items per page:</label>
            <select
              value={filters.limit}
              onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          
          {/* Test Insert */}
          <div>
            <label className="block text-sm font-medium mb-2">Test Insert:</label>
            <button
              onClick={testInsertListing}
              className="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500"
            >
              ➕ Add Test Listing
            </button>
          </div>
        </div>
      </div>

      {/* Current API Call Display */}
      <div className="bg-gray-100 rounded-lg p-4 mb-6">
        <h3 className="font-semibold mb-2">🔗 Current API Call:</h3>
        <code className="text-sm bg-white p-2 rounded block overflow-x-auto">
          {`getListings({ country: "${filters.country}", city: "${filters.city}", limit: ${filters.limit}, offset: ${(currentPage - 1) * filters.limit} })`}
        </code>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h3 className="text-red-800 font-semibold">❌ Error:</h3>
          <p className="text-red-700">{error}</p>
          <button
            onClick={loadListings}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            🔄 Retry
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading listings...</p>
        </div>
      )}

      {/* Results */}
      {!loading && (
        <>
          <div className="mb-4">
            <h2 className="text-xl font-semibold">
              📋 Results: {listings.length} listings (Page {currentPage})
            </h2>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300"
            >
              ← Previous
            </button>
            <span className="px-4 py-2 bg-gray-100 rounded">
              Page {currentPage}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={listings.length < filters.limit}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300"
            >
              Next →
            </button>
          </div>

          {/* Listings Grid */}
          {listings.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl text-gray-600">🔍 No listings found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <div key={listing.id} className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {/* Image */}
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    {listing.images && listing.images.length > 0 ? (
                      <img
                        src={listing.images[0]}
                        alt={listing.data?.title?.[0]?.text || 'Property'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.log('Image load error for:', listing.images?.[0]);
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300/e2e8f0/64748b?text=Property+Image';
                          (e.target as HTMLImageElement).style.objectFit = 'contain';
                        }}
                        onLoad={() => {
                          console.log('Image loaded successfully:', listing.images?.[0]);
                        }}
                        crossOrigin="anonymous"
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
                      <div className="flex gap-4 text-sm text-gray-500">
                        {listing.data.numberOf.bedrooms && (
                          <span>🛏️ {listing.data.numberOf.bedrooms} bed</span>
                        )}
                        {listing.data.numberOf.bathrooms && (
                          <span>🚿 {listing.data.numberOf.bathrooms} bath</span>
                        )}
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-400 mt-3">
                      ID: {listing.id} | Created: {new Date(listing.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}