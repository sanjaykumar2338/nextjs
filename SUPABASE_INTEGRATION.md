# Supabase Integration for Luminor Next.js

This document explains how to use the Supabase integration for managing property listings in your Next.js application.

## Setup

### 1. Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://phaxtzaskkqkwpszzddh.supabase.co
NEXT_PUBLIC_SUPABASE_KEY=your_supabase_anon_key_here
```

### 2. Database Schema

Make sure your Supabase `listings` table has the following structure:

```sql
CREATE TABLE listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  country VARCHAR(10) NOT NULL,
  city VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  description TEXT,
  image_url TEXT,
  image_gallery JSONB,
  location JSONB,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## API Functions

### `getListings(params)`

Fetches listings from Supabase with dynamic filters.

**Parameters:**
- `country` (string): Country code (e.g., "mx")
- `city` (string): City name with wildcards (e.g., "caribbean vida")
- `limit` (number): Number of results (default: 10)
- `offset` (number): Number of results to skip (default: 0)

**Example:**
```javascript
import { getListings } from '@/lib/supabase';

const listings = await getListings({
  country: 'mx',
  city: 'caribbean vida',
  limit: 10,
  offset: 0
});
```

### `insertListing(listingData)`

Inserts a new listing into the database.

**Parameters:**
- `listingData` (object): The listing data to insert

**Example:**
```javascript
import { insertListing } from '@/lib/supabase';

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

const inserted = await insertListing(newListing);
```

### `updateListing(id, updateData)`

Updates an existing listing.

**Parameters:**
- `id` (string): The ID of the listing to update
- `updateData` (object): The data to update

### `deleteListing(id)`

Deletes a listing from the database.

**Parameters:**
- `id` (string): The ID of the listing to delete

### `getListingById(id)`

Fetches a single listing by ID.

**Parameters:**
- `id` (string): The ID of the listing

## Usage Examples

### Client-Side Component

```jsx
'use client';

import { useState, useEffect } from 'react';
import { getListings } from '@/lib/supabase';

export default function ListingsPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadListings = async () => {
      try {
        const data = await getListings({
          country: 'mx',
          city: 'caribbean',
          limit: 10,
          offset: 0
        });
        setListings(data);
      } catch (error) {
        console.error('Error loading listings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadListings();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {listings.map(listing => (
        <div key={listing.id}>
          <h3>{listing.title}</h3>
          <p>{listing.city}, {listing.country}</p>
          <p>${listing.price.toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
```

### Server-Side Component

```jsx
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
        <div key={listing.id}>
          <h3>{listing.title}</h3>
          <p>{listing.city}, {listing.country}</p>
          <p>${listing.price.toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
```

## Available Pages

1. **Client-Side Listings**: `/listings-supabase`
   - Interactive filtering and pagination
   - Add new listings functionality
   - Real-time updates

2. **Server-Side Listings**: `/listings-server`
   - Server-side rendering
   - URL-based filtering
   - SEO-friendly

3. **Examples Page**: `/examples` (if you add the SupabaseExamples component)
   - Interactive examples of all API functions
   - Code snippets and documentation

## Error Handling

All functions include proper error handling and will throw descriptive errors if something goes wrong. Make sure to wrap your API calls in try-catch blocks:

```javascript
try {
  const listings = await getListings({ country: 'mx' });
  // Handle success
} catch (error) {
  console.error('Failed to fetch listings:', error.message);
  // Handle error
}
```

## Security Notes

- The `NEXT_PUBLIC_SUPABASE_KEY` is safe to expose in client-side code as it's the anon key
- For sensitive operations, consider using Row Level Security (RLS) in Supabase
- Never expose service role keys in client-side code

## Customization

You can easily customize the API functions by:

1. **Adding new filters**: Modify the `getListings` function to accept additional parameters
2. **Changing the base URL**: Update the `SUPABASE_URL` in the environment variables
3. **Adding new fields**: Update the TypeScript interfaces and function parameters
4. **Implementing caching**: Add caching logic to improve performance

## Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables"**
   - Make sure your `.env.local` file exists and contains the required variables
   - Restart your development server after adding environment variables

2. **"Supabase API error: 401"**
   - Check that your `NEXT_PUBLIC_SUPABASE_KEY` is correct
   - Verify that the key has the right permissions in your Supabase project

3. **"Supabase API error: 404"**
   - Make sure your `NEXT_PUBLIC_SUPABASE_URL` is correct
   - Verify that the `listings` table exists in your Supabase database

4. **CORS errors**
   - Make sure your Supabase project allows requests from your domain
   - Check the CORS settings in your Supabase project dashboard
