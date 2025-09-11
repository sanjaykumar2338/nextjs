'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { getListings, getListingsCount } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import DropdownSelect2 from '../common/DropdownSelect2';
import Map from '../common/Map';
import { CITIES_CONFIG } from '@/config/cities';
import './properties.module.css';

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
    area?: {
      living?: number;
      land?: number;
    };
    transactionType?: {
      id: string;
      name: string;
    };
  };
  images?: string[];
  created_at: string;
}

interface Filters {
  country: string;
  city: string;
  transactionType: string;
  bedrooms: string;
  bathrooms: string;
  minPrice: string;
  maxPrice: string;
  minSize: string;
  maxSize: string;
  search: string;
  sortBy: string;
  sortOrder: string;
}

export default function PropertiesSupabase() {
  const [listings, setListings] = useState<SupabaseListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(12);

  const [filters, setFilters] = useState<Filters>({
    country: '',
    city: '',
    transactionType: '',
    bedrooms: '',
    bathrooms: '',
    minPrice: '',
    maxPrice: '',
    minSize: '',
    maxSize: '',
    search: '',
    sortBy: 'created_at',
    sortOrder: 'desc'
  });

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const ddContainer = useRef<HTMLDivElement>(null);

  const loadListings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const offset = (currentPage - 1) * itemPerPage;

      // Apply cities config filtering
      let modifiedFilters = { ...filters };
      
      // If cities are configured and not showing all, apply city filter
      if (CITIES_CONFIG.ENABLED_CITIES.length > 0 && !filters.city) {
        const enabledCityNames = CITIES_CONFIG.ENABLED_CITIES.map(
          code => CITIES_CONFIG.CITY_MAPPINGS[code as keyof typeof CITIES_CONFIG.CITY_MAPPINGS]
        ).filter(Boolean);
        const cityQuery = enabledCityNames.join('|');
        modifiedFilters = { ...modifiedFilters, city: cityQuery };
      }

      // Get listings and total count
      const [listingsData, count] = await Promise.all([
        getListings({
          ...modifiedFilters,
          limit: itemPerPage,
          offset: offset
        }),
        getListingsCount(modifiedFilters)
      ]);

      setListings(listingsData);
      setTotalCount(count);
      
      console.log('✅ Loaded', listingsData.length, 'listings, total:', count);
      console.log('🏙️ Applied cities filter:', CITIES_CONFIG.ENABLED_CITIES.length > 0 ? 
        CITIES_CONFIG.ENABLED_CITIES.map(code => `${code} (${CITIES_CONFIG.CITY_MAPPINGS[code as keyof typeof CITIES_CONFIG.CITY_MAPPINGS]})`).join(', ') : 
        'All cities');
      
      // Debug: Check for listings with missing or invalid IDs
      const invalidListings = listingsData.filter((listing: SupabaseListing) => !listing.id || listing.id === null);
      if (invalidListings.length > 0) {
        console.warn('⚠️ Found', invalidListings.length, 'listings with invalid IDs:', invalidListings.map((l: SupabaseListing) => ({ id: l.id, title: l.data?.title?.[0]?.text })));
      }
    } catch (err: unknown) {
      console.error('❌ Failed to load listings:', err);
      setError((err as Error)?.message || 'Failed to load listings');
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage]);

  // Load listings when filters or page changes
  useEffect(() => {
    loadListings();
  }, [loadListings]);

  const updateFilter = (key: keyof Filters, value: string) => {
    console.log('🔄 Filter Update:', { key, value, previousValue: filters[key] });
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled automatically by useEffect
  };

  const toggleAdvancedFilter = () => {
    if (ddContainer.current) {
      ddContainer.current.classList.toggle('show');
    }
  };

  const getDisplayPrice = (listing: SupabaseListing) => {
    const price = listing.data?.price?.values?.[0]?.value;
    const currency = listing.data?.price?.values?.[0]?.currencyId || 'USD';
    const type = listing.data?.transactionType?.id;
    
    if (!price) return 'Price on request';
    
    return `$${price.toLocaleString()} ${currency}${type === 'Rent' ? '/month' : ''}`;
  };

  // Transform Supabase listings to Map component format
  const transformListingsForMap = (listings: SupabaseListing[]) => {
    return listings.map((listing, index) => {
      // Get coordinates from data.location or use Playa del Carmen base coordinates
      const baseLatitude = 20.629559;  // Playa del Carmen
      const baseLongitude = -87.073885;
      const gridSize = Math.ceil(Math.sqrt(listings.length));
      const row = Math.floor(index / gridSize);
      const col = index % gridSize;
      
      const lat = listing.data?.location?.latitude || (baseLatitude + (row * 0.005));
      const lng = listing.data?.location?.longitude || (baseLongitude + (col * 0.005));
      
      return {
        id: listing.id,
        title: listing.data?.title?.[0]?.text || `Property ${listing.id}`,
        address: listing.data?.location?.address1 || `${listing.city}, ${listing.country?.toUpperCase()}`,
        lat: lat,
        long: lng,
        beds: listing.data?.numberOf?.bedrooms || 0,
        baths: listing.data?.numberOf?.bathrooms || 0,
        sqft: listing.data?.area?.living || 0,
        imgSrc: listing.images?.[0] || '/images/property/property-1.jpg',
        price: getDisplayPrice(listing),
        city: listing.city,
        country: listing.country
      };
    });
  };

  const totalPages = Math.ceil(totalCount / itemPerPage);

  return (
    <>
      {/* Top Map Section */}
      <div className="flat-map">
        <div className="mapbox-3">
          <Map sorted={transformListingsForMap(listings)} />
        </div>
        
        {/* Advanced Search Filters */}
        <div className="tf-container">
          <div className="search-form-wrapper bg-white p-4 rounded shadow">
            <form onSubmit={handleSearch} className="search-form">
              <div className="row g-3">
                {/* Search Input */}
                <div className="col-md-3">
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by location or title..."
                      value={filters.search}
                      onChange={(e) => updateFilter('search', e.target.value)}
                    />
                  </div>
                </div>

                {/* Transaction Type */}
                <div className="col-md-2">
                  <select 
                    className="form-select"
                    value={filters.transactionType}
                    onChange={(e) => updateFilter('transactionType', e.target.value)}
                  >
                    <option value="">All Types</option>
                    <option value="Sale">For Sale</option>
                    <option value="Rent">For Rent</option>
                  </select>
                </div>

                {/* Country */}
                <div className="col-md-2">
                  <select 
                    className="form-select"
                    value={filters.country}
                    onChange={(e) => updateFilter('country', e.target.value)}
                  >
                    <option value="">All Countries</option>
                    <option value="mx">Mexico</option>
                    <option value="us">United States</option>
                    <option value="ca">Canada</option>
                  </select>
                </div>

                {/* Bedrooms */}
                <div className="col-md-2">
                  <select 
                    className="form-select"
                    value={filters.bedrooms}
                    onChange={(e) => updateFilter('bedrooms', e.target.value)}
                  >
                    <option value="">Any Bedrooms</option>
                    <option value="1">1 Bedroom</option>
                    <option value="2">2 Bedrooms</option>
                    <option value="3">3 Bedrooms</option>
                    <option value="4+">4+ Bedrooms</option>
                  </select>
                </div>

                {/* Price Range */}
                <div className="col-md-3">
                  <div className="d-flex gap-2">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Min Price"
                      value={filters.minPrice}
                      onChange={(e) => updateFilter('minPrice', e.target.value)}
                    />
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Max Price"
                      value={filters.maxPrice}
                      onChange={(e) => updateFilter('maxPrice', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Advanced Filters Toggle */}
              <div className="advanced-filters mt-3">
                <button 
                  type="button" 
                  className="btn btn-outline-primary btn-sm"
                  onClick={toggleAdvancedFilter}
                >
                  Advanced Filters
                </button>
                
                <div ref={ddContainer} className="advanced-options mt-3" style={{ display: 'none' }}>
                  <div className="row g-3">
                    <div className="col-md-3">
                      <select 
                        className="form-select"
                        value={filters.bathrooms}
                        onChange={(e) => updateFilter('bathrooms', e.target.value)}
                      >
                        <option value="">Any Bathrooms</option>
                        <option value="1">1 Bathroom</option>
                        <option value="2">2 Bathrooms</option>
                        <option value="3">3 Bathrooms</option>
                        <option value="4+">4+ Bathrooms</option>
                      </select>
                    </div>
                    <div className="col-md-3">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Min Size (Sqft)"
                        value={filters.minSize}
                        onChange={(e) => updateFilter('minSize', e.target.value)}
                      />
                    </div>
                    <div className="col-md-3">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Max Size (Sqft)"
                        value={filters.maxSize}
                        onChange={(e) => updateFilter('maxSize', e.target.value)}
                      />
                    </div>
                    <div className="col-md-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="City"
                        value={filters.city}
                        onChange={(e) => updateFilter('city', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="section-properties tf-spacing-1">
        <div className="tf-container">
          {/* Header with Results Count and View Toggle */}
          <div className="box-title mb_40">
            <div>
              <h4>Property Listings</h4>
              <p className="text-muted">
                {loading ? 'Loading...' : `${totalCount} properties found`}
                {CITIES_CONFIG.ENABLED_CITIES.length > 0 && !filters.city && (
                  <span className="ms-2 text-info">
                    (filtered by: {CITIES_CONFIG.ENABLED_CITIES.map(code => 
                      `${code} (${CITIES_CONFIG.CITY_MAPPINGS[code as keyof typeof CITIES_CONFIG.CITY_MAPPINGS]})`
                    ).join(', ')})
                  </span>
                )}
              </p>
            </div>
            
            <div className="right d-flex gap_12">
              {/* View Toggle */}
              <ul className="nav-tab-filter align-items-center group-layout d-flex gap_12">
                <li>
                  <button
                    className={`btn-layout grid ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <i className="icon-SquaresFour"></i>
                  </button>
                </li>
                <li>
                  <button
                    className={`btn-layout list ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                  >
                    <i className="icon-Rows"></i>
                  </button>
                </li>
              </ul>

              {/* Sort Options */}
              <DropdownSelect2
                onChange={(value) => {
                  if (value === 'Price Ascending') {
                    updateFilter('sortBy', 'price');
                    updateFilter('sortOrder', 'asc');
                  } else if (value === 'Price Descending') {
                    updateFilter('sortBy', 'price');
                    updateFilter('sortOrder', 'desc');
                  } else {
                    updateFilter('sortBy', 'created_at');
                    updateFilter('sortOrder', 'desc');
                  }
                }}
                addtionalParentClass="list-sort"
                options={[
                  "Sort by (Default)",
                  "Price Ascending", 
                  "Price Descending"
                ]}
              />
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="alert alert-danger mb-4">
              <strong>Error:</strong> {error}
              <button 
                className="btn btn-sm btn-outline-danger ms-3"
                onClick={loadListings}
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading properties...</p>
            </div>
          )}

          {/* Results */}
          {!loading && !error && (
            <>
              {listings.length === 0 ? (
                <div className="text-center py-5">
                  <h3>No properties found</h3>
                  <p>Try adjusting your search filters</p>
                </div>
              ) : (
                <>
                  {/* Grid View */}
                  {viewMode === 'grid' && (
                    <div className="tf-grid-layout lg-col-3 md-col-2">
                      {listings.map((listing) => (
                        <div key={listing.id} className="card-house style-default hover-image">
                          <div className="img-style mb_20">
                            {listing.images && listing.images.length > 0 ? (
                              <Image
                                src={listing.images[0]}
                                alt={listing.data?.title?.[0]?.text || 'Property'}
                                width={410}
                                height={308}
                                style={{ objectFit: 'cover' }}
                              />
                            ) : (
                              <div className="image-placeholder">
                                🏠
                              </div>
                            )}
                            
                            <div className="wrap-tag d-flex gap_8 mb_12">
                              <div className={`tag ${listing.data?.transactionType?.id === 'Sell' ? 'sale' : 'rent'} text-button-small fw-6 text_primary-color`}>
                                {listing.data?.transactionType?.name || 'Sale'}
                              </div>
                            </div>
                            
                            {listing.id && <Link href={`/property-details-1/${listing.id}`} className="overlay-link" />}
                          </div>
                          
                          <div className="content">
                            <h4 className="price mb_12">
                              {getDisplayPrice(listing)}
                            </h4>
                            
                            {listing.id ? (
                              <Link href={`/property-details-1/${listing.id}`} className="title mb_8 h5 link text_primary-color">
                                {listing.data?.title?.[0]?.text || `Property ${listing.id}`}
                              </Link>
                            ) : (
                              <h5 className="title mb_8 h5 text_primary-color">
                                {listing.data?.title?.[0]?.text || 'Property'}
                              </h5>
                            )}
                            
                            <p>{listing.data?.location?.address1 || `${listing.city}, ${listing.country?.toUpperCase()}`}</p>
                            
                            <ul className="info d-flex">
                              <li className="d-flex align-items-center gap_8 text-title text_primary-color fw-6">
                                <i className="icon-Bed"></i>
                                {listing.data?.numberOf?.bedrooms || 0} Bed
                              </li>
                              <li className="d-flex align-items-center gap_8 text-title text_primary-color fw-6">
                                <i className="icon-Bathtub"></i>
                                {listing.data?.numberOf?.bathrooms || 0} Bath
                              </li>
                              <li className="d-flex align-items-center gap_8 text-title text_primary-color fw-6">
                                <i className="icon-Ruler"></i>
                                {listing.data?.area?.living?.toLocaleString() || '0'} Sqft
                              </li>
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* List View */}
                  {viewMode === 'list' && (
                    <div className="wrap-list d-grid gap_30">
                      {listings.map((listing) => (
                        <div key={listing.id} className="card-house style-list v2">
                          <div className="wrap-img">
                            <div className="img-style">
                              {listing.images && listing.images.length > 0 ? (
                                <Image
                                  src={listing.images[0]}
                                  alt={listing.data?.title?.[0]?.text || 'Property'}
                                  width={540}
                                  height={360}
                                  style={{ objectFit: 'cover' }}
                                />
                              ) : (
                                <div className="image-placeholder">
                                  🏠
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="content">
                            <div className="d-flex align-items-center gap_6 top mb_16 flex-wrap justify-content-between">
                              <h4 className="price">
                                {getDisplayPrice(listing)}
                              </h4>
                              <div className="wrap-tag d-flex gap_8">
                                <div className={`tag ${listing.data?.transactionType?.id === 'Sell' ? 'sale' : 'rent'} text-button-small fw-6 text_primary-color`}>
                                  {listing.data?.transactionType?.name || 'Sale'}
                                </div>
                              </div>
                            </div>
                            
                            {listing.id ? (
                              <Link href={`/property-details-1/${listing.id}`} className="title mb_8 h5 link text_primary-color">
                                {listing.data?.title?.[0]?.text || `Property ${listing.id}`}
                              </Link>
                            ) : (
                              <h5 className="title mb_8 h5 text_primary-color">
                                {listing.data?.title?.[0]?.text || 'Property'}
                              </h5>
                            )}
                            
                            <p>{listing.data?.location?.address1 || `${listing.city}, ${listing.country?.toUpperCase()}`}</p>
                            
                            <ul className="info d-flex">
                              <li className="d-flex align-items-center gap_8 text-title text_primary-color fw-6">
                                <i className="icon-Bed"></i>
                                {listing.data?.numberOf?.bedrooms || 0} Bed
                              </li>
                              <li className="d-flex align-items-center gap_8 text-title text_primary-color fw-6">
                                <i className="icon-Bathtub"></i>
                                {listing.data?.numberOf?.bathrooms || 0} Bath
                              </li>
                              <li className="d-flex align-items-center gap_8 text-title text_primary-color fw-6">
                                <i className="icon-Ruler"></i>
                                {listing.data?.area?.living?.toLocaleString() || '0'} Sqft
                              </li>
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Pagination - Original UI Style */}
                  {totalPages > 1 && (
                    <div className="d-flex justify-content-center">
                      <ul className="wg-pagination">
                        {/* Previous button */}
                        <li onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}>
                          <a className="nav-item">
                            <i className="icon-CaretLeft" />
                          </a>
                        </li>
                        
                        {/* First page and leading ellipsis */}
                        {totalPages > 5 && currentPage > 3 && (
                          <>
                            <li>
                              <a
                                className={`nav-item ${currentPage === 1 ? 'active' : ''}`}
                                onClick={() => setCurrentPage(1)}
                              >
                                1
                              </a>
                            </li>
                            {currentPage > 4 && (
                              <li>
                                <a className="nav-item">...</a>
                              </li>
                            )}
                          </>
                        )}
                        
                        {/* Page numbers */}
                        {(() => {
                          const pages: number[] = [];
                          if (totalPages <= 5) {
                            for (let i = 1; i <= totalPages; i++) {
                              pages.push(i);
                            }
                          } else {
                            if (currentPage <= 3) {
                              pages.push(1, 2, 3, 4);
                            } else if (currentPage >= totalPages - 2) {
                              pages.push(totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
                            } else {
                              pages.push(currentPage - 1, currentPage, currentPage + 1);
                            }
                          }
                          return pages.filter(p => p > 0 && p <= totalPages).map(page => (
                            <li key={page}>
                              <a
                                className={`nav-item ${currentPage === page ? 'active' : ''}`}
                                onClick={() => setCurrentPage(page)}
                              >
                                {page}
                              </a>
                            </li>
                          ));
                        })()}
                        
                        {/* Trailing ellipsis and last page */}
                        {totalPages > 5 && currentPage < totalPages - 2 && (
                          <>
                            {currentPage < totalPages - 3 && (
                              <li>
                                <a className="nav-item">...</a>
                              </li>
                            )}
                            <li>
                              <a
                                className={`nav-item ${currentPage === totalPages ? 'active' : ''}`}
                                onClick={() => setCurrentPage(totalPages)}
                              >
                                {totalPages}
                              </a>
                            </li>
                          </>
                        )}
                        
                        {/* Next button */}
                        <li onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}>
                          <a className="nav-item">
                            <i className="icon-CaretRight" />
                          </a>
                        </li>
                      </ul>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}