import Link from 'next/link';

export default function TestListingsPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Test Supabase Integration</h1>
      
      <div className="grid gap-6">
        {/* Client-Side Tests */}
        <div className="border rounded-lg p-6 bg-blue-50">
          <h2 className="text-xl font-semibold mb-4">Client-Side Page Tests</h2>
          <div className="space-y-2">
            <Link 
              href="/listings-supabase"
              className="block p-3 bg-white rounded hover:bg-gray-50"
            >
              📋 Default (Mexico, all cities)
            </Link>
            <Link 
              href="/listings-supabase?country=mx&city=caribbean vida"
              className="block p-3 bg-white rounded hover:bg-gray-50"
            >
              🏖️ Caribbean Vida listings
            </Link>
            <Link 
              href="/listings-supabase?country=mx&city=playa&page=1"
              className="block p-3 bg-white rounded hover:bg-gray-50"
            >
              🏝️ Playa listings with pagination
            </Link>
          </div>
        </div>

        {/* Server-Side Tests */}
        <div className="border rounded-lg p-6 bg-green-50">
          <h2 className="text-xl font-semibold mb-4">Server-Side Page Tests</h2>
          <div className="space-y-2">
            <Link 
              href="/listings-server"
              className="block p-3 bg-white rounded hover:bg-gray-50"
            >
              📋 Default (Mexico, all cities)
            </Link>
            <Link 
              href="/listings-server?country=mx&city=caribbean vida"
              className="block p-3 bg-white rounded hover:bg-gray-50"
            >
              🏖️ Caribbean Vida listings
            </Link>
            <Link 
              href="/listings-server?country=mx&city=playa&page=2"
              className="block p-3 bg-white rounded hover:bg-gray-50"
            >
              🏝️ Playa listings - Page 2
            </Link>
          </div>
        </div>

        {/* API Configuration Info */}
        <div className="border rounded-lg p-6 bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">Configuration</h2>
          <div className="space-y-2 text-sm">
            <p><strong>API URL:</strong> https://phaxtzaskkqkwpszzddh.supabase.co</p>
            <p><strong>Table:</strong> listings</p>
            <p><strong>Default Country:</strong> mx</p>
            <p><strong>Default Limit:</strong> 10 items per page</p>
          </div>
        </div>

        {/* Quick Test Commands */}
        <div className="border rounded-lg p-6 bg-yellow-50">
          <h2 className="text-xl font-semibold mb-4">Quick API Test</h2>
          <pre className="bg-black text-white p-4 rounded overflow-x-auto text-xs">
{`curl -X GET "https://phaxtzaskkqkwpszzddh.supabase.co/rest/v1/listings?country=eq.mx&city=ilike.*caribbean%20vida*&limit=5" \\
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoYXh0emFza2txa3dwc3p6ZGRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMDcwMzcsImV4cCI6MjA3MjU4MzAzN30.WfUDMUX2-I7nVOsR-C03aF6qSdUcWhFVS1tI4Ph37oM"`}
          </pre>
        </div>
      </div>
    </div>
  );
}