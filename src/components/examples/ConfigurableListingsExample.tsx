'use client';

import { useState, useEffect } from 'react';
import { getListings } from '@/lib/supabase';

interface SupabaseListing {
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
      latitude?: number;
      longitude?: number;
    };
    numberOf?: {
      bedrooms?: number;
      bathrooms?: number;
    };
    images?: Array<{
      url: string;
      caption?: string;
      order?: number;
    }>;
  };
  created_at?: string;
  updated_at?: string;
}

// Easy configuration - just change these values
const CONFIG = {
  defaultCountry: 'mx',
  defaultCity: 'caribbean vida',
  itemsPerPage: 10,
  
  // Available country options
  countries: [
    { code: 'mx', label: 'Mexico' },
    { code: 'us', label: 'United States' },
    { code: 'ca', label: 'Canada' },
  ],
  
  // Popular city searches
  popularCities: [
    'caribbean vida',
    'playa del carmen',
    'cancun',
    'tulum',
    'puerto vallarta',
  ]
};

export default function ConfigurableListingsExample() {
  const [listings, setListings] = useState<SupabaseListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState(CONFIG.defaultCountry);
  const [city, setCity] = useState(CONFIG.defaultCity);
  const [page, setPage] = useState(1);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const offset = (page - 1) * CONFIG.itemsPerPage;
      const data = await getListings({
        country: country,
        city: city,
        limit: CONFIG.itemsPerPage,
        offset: offset
      });
      setListings(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [country, city, page, fetchListings]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Configurable Listings Example</h2>
      
      {/* Configuration Controls */}
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h3 className="font-semibold mb-2">Easy Configuration:</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Country Selector */}
          <div>
            <label className="block text-sm font-medium mb-1">Country:</label>
            <select 
              value={country} 
              onChange={(e) => {
                setCountry(e.target.value);
                setPage(1);
              }}
              className="w-full p-2 border rounded"
            >
              <option value="">All Countries</option>
              {CONFIG.countries.map(c => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
          </div>
          
          {/* City Input */}
          <div>
            <label className="block text-sm font-medium mb-1">City:</label>
            <input
              type="text"
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setPage(1);
              }}
              placeholder="Enter city name..."
              className="w-full p-2 border rounded"
            />
          </div>
          
          {/* Quick City Filters */}
          <div>
            <label className="block text-sm font-medium mb-1">Quick Filters:</label>
            <select 
              onChange={(e) => {
                setCity(e.target.value);
                setPage(1);
              }}
              className="w-full p-2 border rounded"
            >
              <option value="">Select city...</option>
              {CONFIG.popularCities.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
        
        <button 
          onClick={fetchListings}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh Listings
        </button>
      </div>
      
      {/* Current Query Display */}
      <div className="bg-blue-50 p-3 rounded mb-4">
        <strong>Current Query:</strong>
        <code className="block mt-1 text-sm">
          {`getListings({ country: "${country}", city: "${city}", limit: ${CONFIG.itemsPerPage}, offset: ${(page - 1) * CONFIG.itemsPerPage} })`}
        </code>
      </div>
      
      {/* Results */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <p className="mb-2">Found {listings.length} listings</p>
          
          {/* Pagination */}
          <div className="flex gap-2 mb-4">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-3 py-1">Page {page}</span>
            <button 
              onClick={() => setPage(p => p + 1)}
              disabled={listings.length < CONFIG.itemsPerPage}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
          
          {/* Listings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.map((listing) => (
              <div key={listing.id} className="border p-3 rounded">
                <h4 className="font-semibold">{listing.data?.title?.[0]?.text || 'No title'}</h4>
                <p className="text-sm text-gray-600">{listing.city}, {listing.country?.toUpperCase()}</p>
                <p className="text-lg font-bold text-blue-600">
                  ${listing.data?.price?.values?.[0]?.value?.toLocaleString() || 'N/A'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}