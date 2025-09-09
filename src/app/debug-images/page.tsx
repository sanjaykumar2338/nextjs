import { getListings } from '@/lib/supabase';

export default async function DebugImagesPage() {
  let listings: any[] = [];
  
  try {
    listings = await getListings({
      country: 'mx',
      city: 'caribbean vida', 
      limit: 3,
      offset: 0
    });
  } catch (error) {
    console.error('Debug page error:', error);
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">🔍 Image Debug Page (Server-Side)</h1>
      
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
                <h3 className="font-semibold mb-2">First 3 Image URLs:</h3>
                <div className="space-y-1">
                  {listing.images.slice(0, 3).map((url: string, imgIndex: number) => (
                    <div key={imgIndex} className="text-sm break-all">
                      <strong>{imgIndex + 1}:</strong> 
                      <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-2">
                        {url}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Test Images (Server-Side Safe) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {listing.images?.slice(0, 3).map((url: string, imgIndex: number) => (
                <div key={imgIndex} className="space-y-2">
                  <h4 className="font-medium">Image {imgIndex + 1}:</h4>
                  
                  {/* Method 1: Simple img tag */}
                  <div className="border p-2">
                    <p className="text-sm text-gray-600 mb-2">Simple img tag:</p>
                    <div className="w-full h-32 bg-gray-200 flex items-center justify-center overflow-hidden">
                      <img
                        src={url}
                        alt={`Property ${imgIndex + 1}`}
                        className="max-w-full max-h-full object-cover"
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