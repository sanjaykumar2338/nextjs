'use client';

import { useState, useEffect } from 'react';
import { getRandomListings } from '@/lib/supabase';

export default function SupabaseTest() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testSupabase = async () => {
      try {
        setLoading(true);
        console.log('🧪 Testing direct Supabase call...');
        
        const data = await getRandomListings(3, 'caribbean vida');
        console.log('🧪 Direct API result:', data);
        
        setResult(data);
      } catch (err: any) {
        console.error('🧪 Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    testSupabase();
  }, []);

  if (loading) return <div>Testing Supabase...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: '20px', background: '#f0f0f0', margin: '20px', borderRadius: '8px' }}>
      <h3>Supabase Test Results</h3>
      <p>Found {result?.length || 0} properties</p>
      {result && result.map((item: any, idx: number) => (
        <div key={idx} style={{ marginBottom: '10px', padding: '10px', background: 'white', borderRadius: '4px' }}>
          <strong>ID: {item.id}</strong><br/>
          City: {item.city}<br/>
          Title: {item.data?.title?.[0]?.text || 'No title'}
        </div>
      ))}
    </div>
  );
}