'use client';

import { useState } from 'react';
import { getListings, insertListing, updateListing, deleteListing, getListingById } from '@/lib/supabase';

/**
 * Example component demonstrating various Supabase operations
 * This shows how to use all the functions from lib/supabase.js
 */
export default function SupabaseExamples() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Example 1: Fetch listings with different filters
  const fetchListings = async () => {
    setLoading(true);
    try {
      const listings = await getListings({
        country: 'mx',
        city: 'caribbean',
        limit: 5,
        offset: 0
      });
      setResult({ type: 'listings', data: listings });
    } catch (error) {
      setResult({ type: 'error', data: error });
    } finally {
      setLoading(false);
    }
  };

  // Example 2: Insert a new listing
  const addListing = async () => {
    setLoading(true);
    try {
      const newListing = {
        country: 'mx',
        city: 'Playa del Carmen',
        title: 'Luxury Beachfront Villa',
        price: 450000,
        description: 'Stunning oceanfront property with private beach access',
        image_url: 'https://via.placeholder.com/600x400',
        image_gallery: [
          'https://via.placeholder.com/600x400',
          'https://via.placeholder.com/600x400',
          'https://via.placeholder.com/600x400'
        ],
        location: {
          lat: 20.6296,
          lng: -87.0739
        },
        details: {
          bedrooms: 4,
          bathrooms: 3,
          area: 250,
          type: 'villa',
          features: ['pool', 'beachfront', 'garden', 'parking']
        }
      };

      const inserted = await insertListing(newListing);
      setResult({ type: 'inserted', data: inserted });
    } catch (error) {
      setResult({ type: 'error', data: error });
    } finally {
      setLoading(false);
    }
  };

  // Example 3: Update a listing (you'll need a real ID)
  const updateListingExample = async () => {
    setLoading(true);
    try {
      // This would need a real listing ID from your database
      const listingId = 'your-listing-id-here';
      const updateData = {
        price: 500000,
        description: 'Updated description'
      };

      const updated = await updateListing(listingId, updateData);
      setResult({ type: 'updated', data: updated });
    } catch (error) {
      setResult({ type: 'error', data: error });
    } finally {
      setLoading(false);
    }
  };

  // Example 4: Get a single listing by ID
  const getSingleListing = async () => {
    setLoading(true);
    try {
      // This would need a real listing ID from your database
      const listingId = 'your-listing-id-here';
      const listing = await getListingById(listingId);
      setResult({ type: 'single', data: listing });
    } catch (error) {
      setResult({ type: 'error', data: error });
    } finally {
      setLoading(false);
    }
  };

  // Example 5: Delete a listing
  const deleteListingExample = async () => {
    setLoading(true);
    try {
      // This would need a real listing ID from your database
      const listingId = 'your-listing-id-here';
      const success = await deleteListing(listingId);
      setResult({ type: 'deleted', data: success });
    } catch (error) {
      setResult({ type: 'error', data: error });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">Supabase Integration Examples</h2>
          
          <div className="row">
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h5>Available Operations</h5>
                </div>
                <div className="card-body">
                  <div className="d-grid gap-2">
                    <button 
                      className="btn btn-primary"
                      onClick={fetchListings}
                      disabled={loading}
                    >
                      {loading ? 'Loading...' : 'Fetch Listings (MX - Caribbean)'}
                    </button>
                    
                    <button 
                      className="btn btn-success"
                      onClick={addListing}
                      disabled={loading}
                    >
                      {loading ? 'Adding...' : 'Add New Listing'}
                    </button>
                    
                    <button 
                      className="btn btn-warning"
                      onClick={updateListingExample}
                      disabled={loading}
                    >
                      {loading ? 'Updating...' : 'Update Listing (Need ID)'}
                    </button>
                    
                    <button 
                      className="btn btn-info"
                      onClick={getSingleListing}
                      disabled={loading}
                    >
                      {loading ? 'Loading...' : 'Get Single Listing (Need ID)'}
                    </button>
                    
                    <button 
                      className="btn btn-danger"
                      onClick={deleteListingExample}
                      disabled={loading}
                    >
                      {loading ? 'Deleting...' : 'Delete Listing (Need ID)'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h5>Result</h5>
                </div>
                <div className="card-body">
                  {result && (
                    <div>
                      <h6>Type: {result.type}</h6>
                      <pre className="bg-light p-3 rounded" style={{ maxHeight: '400px', overflow: 'auto' }}>
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </div>
                  )}
                  {!result && (
                    <p className="text-muted">Click a button above to see the result</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Code Examples */}
          <div className="mt-5">
            <h4>Usage Examples</h4>
            <div className="accordion" id="codeExamples">
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button 
                    className="accordion-button" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#example1"
                  >
                    Basic Fetch with Filters
                  </button>
                </h2>
                <div id="example1" className="accordion-collapse collapse show">
                  <div className="accordion-body">
                    <pre><code>{`import { getListings } from '@/lib/supabase';

// Fetch listings with filters
const listings = await getListings({
  country: 'mx',
  city: 'caribbean vida',
  limit: 10,
  offset: 0
});`}</code></pre>
                  </div>
                </div>
              </div>
              
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button 
                    className="accordion-button collapsed" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#example2"
                  >
                    Insert New Listing
                  </button>
                </h2>
                <div id="example2" className="accordion-collapse collapse">
                  <div className="accordion-body">
                    <pre><code>{`import { insertListing } from '@/lib/supabase';

const newListing = {
  country: 'mx',
  city: 'Cancun',
  title: 'Beachfront Condo',
  price: 350000,
  description: 'Amazing ocean views',
  image_url: 'https://example.com/image.jpg',
  details: {
    bedrooms: 2,
    bathrooms: 2,
    area: 120
  }
};

const inserted = await insertListing(newListing);`}</code></pre>
                  </div>
                </div>
              </div>
              
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button 
                    className="accordion-button collapsed" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#example3"
                  >
                    Server-Side Usage
                  </button>
                </h2>
                <div id="example3" className="accordion-collapse collapse">
                  <div className="accordion-body">
                    <pre><code>{`// In a Next.js page component
import { getListings } from '@/lib/supabase';

export default async function ListingsPage({ searchParams }) {
  const listings = await getListings({
    country: searchParams.country || 'mx',
    city: searchParams.city || '',
    limit: 10,
    offset: 0
  });

  return (
    <div>
      {listings.map(listing => (
        <div key={listing.id}>{listing.title}</div>
      ))}
    </div>
  );
}`}</code></pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
