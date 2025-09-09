import Link from 'next/link';

export default function SupabaseShowcasePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold text-center mb-8">🎉 Supabase Integration Showcase</h1>
      
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-green-800 mb-4">✅ All Features Implemented!</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">🔍 Advanced Filters:</h3>
            <ul className="text-sm space-y-1">
              <li>✅ Transaction Type (Sale/Rent)</li>
              <li>✅ Country & City search</li>
              <li>✅ Bedrooms & Bathrooms</li>
              <li>✅ Price range (Min/Max)</li>
              <li>✅ Property size (SqFt)</li>
              <li>✅ Text search in title/description</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">⚡ Performance Features:</h3>
            <ul className="text-sm space-y-1">
              <li>✅ Smart pagination (12 per page)</li>
              <li>✅ Total count for pagination</li>
              <li>✅ Efficient API queries</li>
              <li>✅ Loading states</li>
              <li>✅ Error handling & retry</li>
              <li>✅ Image optimization</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Original Supabase Pages */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">🧪 Original Test Pages</h2>
          <div className="space-y-3">
            <Link 
              href="/listings-supabase"
              className="block p-3 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100"
            >
              <strong>Client-Side Interactive</strong>
              <p className="text-sm text-gray-600">Real-time filters, state management</p>
            </Link>
            <Link 
              href="/listings-server"
              className="block p-3 bg-green-50 border border-green-200 rounded hover:bg-green-100"
            >
              <strong>Server-Side Rendered</strong>
              <p className="text-sm text-gray-600">SEO-friendly, URL-based filters</p>
            </Link>
            <Link 
              href="/debug-images"
              className="block p-3 bg-yellow-50 border border-yellow-200 rounded hover:bg-yellow-100"
            >
              <strong>Debug Images (Server)</strong>
              <p className="text-sm text-gray-600">Image troubleshooting</p>
            </Link>
            <Link 
              href="/debug-images-client"
              className="block p-3 bg-purple-50 border border-purple-200 rounded hover:bg-purple-100"
            >
              <strong>Debug Images (Client)</strong>
              <p className="text-sm text-gray-600">Interactive image testing</p>
            </Link>
          </div>
        </div>

        {/* Updated Property Pages */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">🏠 Property Listing Pages</h2>
          <p className="text-sm text-gray-600 mb-4">All pages now use real Supabase data with comprehensive filters!</p>
          <div className="space-y-3">
            <Link 
              href="/listing-topmap-grid"
              className="block p-3 bg-indigo-50 border border-indigo-200 rounded hover:bg-indigo-100"
            >
              <strong>Top Map Grid View</strong>
              <p className="text-sm text-gray-600">Map + grid layout with filters</p>
            </Link>
            <Link 
              href="/listing-topmap-list"
              className="block p-3 bg-indigo-50 border border-indigo-200 rounded hover:bg-indigo-100"
            >
              <strong>Top Map List View</strong>
              <p className="text-sm text-gray-600">Map + list layout with filters</p>
            </Link>
            <Link 
              href="/listing-left-sidebar"
              className="block p-3 bg-indigo-50 border border-indigo-200 rounded hover:bg-indigo-100"
            >
              <strong>Left Sidebar</strong>
              <p className="text-sm text-gray-600">Sidebar filters + listings</p>
            </Link>
            <Link 
              href="/listing-right-sidebar"
              className="block p-3 bg-indigo-50 border border-indigo-200 rounded hover:bg-indigo-100"
            >
              <strong>Right Sidebar</strong>
              <p className="text-sm text-gray-600">Sidebar filters + listings</p>
            </Link>
            <Link 
              href="/listing-half-map-grid"
              className="block p-3 bg-indigo-50 border border-indigo-200 rounded hover:bg-indigo-100"
            >
              <strong>Half Map Grid</strong>
              <p className="text-sm text-gray-600">Side-by-side map + grid</p>
            </Link>
            <Link 
              href="/listing-half-map-list"
              className="block p-3 bg-indigo-50 border border-indigo-200 rounded hover:bg-indigo-100"
            >
              <strong>Half Map List</strong>
              <p className="text-sm text-gray-600">Side-by-side map + list</p>
            </Link>
          </div>
        </div>
      </div>

      {/* API Examples */}
      <div className="bg-gray-50 border rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">🔧 API Usage Examples</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Filter by Transaction Type:</h3>
            <code className="block bg-white p-2 rounded text-sm mt-1">
              getListings({`{ transactionType: "Sale", country: "mx", limit: 12 }`})
            </code>
          </div>
          <div>
            <h3 className="font-semibold">Search with Price Range:</h3>
            <code className="block bg-white p-2 rounded text-sm mt-1">
              getListings({`{ minPrice: 100000, maxPrice: 500000, bedrooms: "3" }`})
            </code>
          </div>
          <div>
            <h3 className="font-semibold">Pagination:</h3>
            <code className="block bg-white p-2 rounded text-sm mt-1">
              getListings({`{ limit: 12, offset: 24 }`}) // Page 3
            </code>
          </div>
          <div>
            <h3 className="font-semibold">Full Text Search:</h3>
            <code className="block bg-white p-2 rounded text-sm mt-1">
              getListings({`{ search: "beach house", city: "playa del carmen" }`})
            </code>
          </div>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">📊 Performance & Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">12</div>
            <div className="text-sm text-gray-600">Items per page</div>
            <div className="text-xs text-gray-500">Prevents slow loading</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">10+</div>
            <div className="text-sm text-gray-600">Filter types</div>
            <div className="text-xs text-gray-500">All UI filters supported</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">2</div>
            <div className="text-sm text-gray-600">View modes</div>
            <div className="text-xs text-gray-500">Grid & List layouts</div>
          </div>
        </div>
      </div>

      {/* Quick Test Links */}
      <div className="mt-8 text-center">
        <h3 className="text-lg font-semibold mb-4">🚀 Quick Test Links</h3>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/listing-topmap-grid?transactionType=Sale" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Properties for Sale
          </Link>
          <Link href="/listing-topmap-grid?transactionType=Rent" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Properties for Rent  
          </Link>
          <Link href="/listing-topmap-grid?country=mx&city=caribbean" className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
            Caribbean Properties
          </Link>
          <Link href="/listing-topmap-grid?bedrooms=3&minPrice=200000" className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
            3BR Properties $200K+
          </Link>
        </div>
      </div>
    </div>
  );
}