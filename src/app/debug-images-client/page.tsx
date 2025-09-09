'use client';

import { useState, useEffect } from 'react';
import { getListings } from '@/lib/supabase';

export default function DebugImagesClientPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageStatus, setImageStatus] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await getListings({
          country: 'mx',
          city: 'caribbean vida',
          limit: 3,
          offset: 0
        });
        setListings(data);
      } catch (error) {
        console.error('Failed to fetch listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const handleImageLoad = (url: string) => {
    console.log('✅ Image loaded successfully:', url);
    setImageStatus(prev => ({ ...prev, [url]: 'loaded' }));
  };

  const handleImageError = (url: string) => {
    console.error('❌ Image failed to load:', url);
    setImageStatus(prev => ({ ...prev, [url]: 'error' }));
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">🔍 Client-Side Image Debug</h1>
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">🔍 Client-Side Image Debug</h1>
      
      <div className="bg-yellow-100 border border-yellow-400 rounded p-4 mb-6">
        <h2 className="font-semibold">Debug Information:</h2>
        <p>• Total listings: {listings.length}</p>
        <p>• Image statuses: {Object.keys(imageStatus).length} tracked</p>
        <p>• Check browser console for detailed image load logs</p>
      </div>
      
      <div className="space-y-8">
        {listings.map((listing, index) => (
          <div key={listing.id} className="border rounded-lg p-6 bg-white">
            <h2 className="text-xl font-semibold mb-4">
              Listing {listing.id}: {listing.data?.title?.[0]?.text || 'No Title'}
            </h2>
            
            {/* Debug Info */}
            <div className="bg-gray-100 p-4 rounded mb-4">
              <h3 className="font-semibold mb-2">Debug Info:</h3>
              <p><strong>Images Array Length:</strong> {listing.images?.length || 0}</p>
              <p><strong>First Image URL:</strong> {listing.images?.[0] || 'None'}</p>
              <p><strong>City:</strong> {listing.city}</p>
              <p><strong>Country:</strong> {listing.country}</p>
            </div>
            
            {/* Image URLs List */}
            {listing.images && listing.images.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Image URLs (first 3):</h3>
                <div className="space-y-1">
                  {listing.images.slice(0, 3).map((url: string, imgIndex: number) => (
                    <div key={imgIndex} className="text-sm break-all">
                      <strong>{imgIndex + 1}:</strong> 
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${
                        imageStatus[url] === 'loaded' ? 'bg-green-100 text-green-800' :
                        imageStatus[url] === 'error' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {imageStatus[url] || 'pending'}
                      </span>
                      <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-2">
                        {url}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Test Images */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {listing.images?.slice(0, 3).map((url: string, imgIndex: number) => (
                <div key={imgIndex} className="space-y-2">
                  <h4 className="font-medium">Image {imgIndex + 1}:</h4>
                  
                  {/* Method 1: Direct img with error handling */}
                  <div className="border p-2">
                    <p className="text-sm text-gray-600 mb-2">Direct img tag with handlers:</p>
                    <div className="w-full h-32 bg-gray-200 flex items-center justify-center overflow-hidden">
                      <img
                        src={url}
                        alt={`Property ${imgIndex + 1}`}
                        className="max-w-full max-h-full object-cover"
                        onLoad={() => handleImageLoad(url)}
                        onError={() => handleImageError(url)}
                      />
                    </div>
                  </div>
                  
                  {/* Method 2: Background image */}
                  <div className="border p-2">
                    <p className="text-sm text-gray-600 mb-2">Background image:</p>
                    <div 
                      className="w-full h-32 bg-gray-200 bg-cover bg-center"
                      style={{ backgroundImage: `url('${url}')` }}
                    ></div>
                  </div>
                  
                  {/* Method 3: With crossOrigin */}
                  <div className="border p-2">
                    <p className="text-sm text-gray-600 mb-2">With crossOrigin:</p>
                    <div className="w-full h-32 bg-gray-200 flex items-center justify-center overflow-hidden">
                      <img
                        src={url}
                        alt={`Property ${imgIndex + 1} CORS`}
                        className="max-w-full max-h-full object-cover"
                        crossOrigin="anonymous"
                        onLoad={() => console.log(`✅ CORS image loaded: ${url}`)}
                        onError={() => console.log(`❌ CORS image failed: ${url}`)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Test with placeholder */}
            <div className="mt-4 border p-2">
              <p className="text-sm text-gray-600 mb-2">Test placeholder image:</p>
              <img
                src="https://via.placeholder.com/300x200/e2e8f0/64748b?text=Test+Image"
                alt="Test placeholder"
                className="w-48 h-32 object-cover"
                onLoad={() => console.log('✅ Placeholder image loaded')}
                onError={() => console.log('❌ Placeholder image failed')}
              />
            </div>
          </div>
        ))}
      </div>
      
      {listings.length === 0 && (
        <div className="text-center py-8">
          <p className="text-xl text-gray-600">No listings found for debugging</p>
        </div>
      )}
    </div>
  );
}