'use client';

import { useState, useEffect, useCallback } from 'react';
import { getListings, getListingsCount, getDistinctCountries, getDistinctCities } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import Select from 'react-select';
import DropdownSelect2 from '../common/DropdownSelect2';
import Map from '../common/Map';
import './properties.module.css';

interface SupabaseListing {
  id: number;
  city: string;
  country: string;
  municipality?: string;
  state?: string;
  external_id?: number;
  created_at: string;
  updated_at: string;
  data?: {
    id?: number;
    hash?: string;
    type?: {
      id: string;
      name: string;
    };
    subType?: {
      id: string;
      name: string;
    };
    class?: string;
    title?: Array<{ text: string; language: string; original?: boolean }>;
    price?: {
      show?: boolean;
      values?: Array<{ type?: string; value: number; currencyId: string }>;
    };
    state?: {
      id: string;
      name: string;
    };
    location?: {
      city?: string;
      placeId?: string;
      address1?: string;
      latitude?: number;
      longitude?: number;
      postcode?: string;
      countryISO?: string;
      showAddress?: boolean;
      geocodeLevel?: string;
      showPostcode?: boolean;
    };
    numberOf?: {
      rooms?: number;
      bedrooms?: number;
      bathrooms?: number;
    };
    area?: {
      unit?: {
        id: string;
        name: string;
      };
      total?: number;
      living?: number;
      land?: number;
      internal?: number;
      values?: Array<{
        unit: { id: string; name: string };
        total: number;
        living?: number;
        internal?: number;
        original?: boolean;
      }>;
    };
    timeZone?: {
      id: number;
      ianaid: string;
    };
    reference?: string;
    categoryId?: number;
    isArchived?: boolean;
    showContact?: boolean;
    contactUsers?: Array<{
      type?: string;
      email?: string;
      phone?: string;
      mobile?: string;
      userId?: number;
      contactId?: number;
      firstName?: string;
      lastName?: string;
      [key: string]: unknown;
    }>;
    creationDate?: string;
    automaticTitle?: string;
    relevanceScore?: number;
    descriptionFull?: Array<{ text: string; language: string; original?: boolean }>;
    publicationDate?: string;
    transactionType?: {
      id: string;
      name: string;
    };
    contactAccountId?: number;
    geoPointReliable?: boolean;
    createdByAccountId?: number;
    isPriceChangeBoosted?: boolean;
    publicationNotificationStatus?: string;
  };
  amenities?: Array<{
    count: number;
    value: string;
  }>;
  images?: string[];
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

interface SelectOption {
  value: string;
  label: string;
}

// Custom styles for react-select to match the theme
const customSelectStyles = {
  control: (base: Record<string, unknown>) => ({
    ...base,
    backgroundColor: 'white',
    borderColor: '#e5e7eb',
    borderRadius: '0.5rem',
    padding: '2px',
    boxShadow: 'none',
    '&:hover': {
      borderColor: '#9ca3af',
    },
  }),
  menu: (base: Record<string, unknown>) => ({
    ...base,
    borderRadius: '0.5rem',
    overflow: 'hidden',
    zIndex: 9999,
  }),
  option: (base: Record<string, unknown>, state: { isSelected: boolean; isFocused: boolean }) => ({
    ...base,
    backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#eff6ff' : 'white',
    color: state.isSelected ? 'white' : '#111827',
    cursor: 'pointer',
  }),
  placeholder: (base: Record<string, unknown>) => ({
    ...base,
    color: '#9ca3af',
  }),
  input: (base: Record<string, unknown>) => ({
    ...base,
    color: '#111827',
  }),
  singleValue: (base: Record<string, unknown>) => ({
    ...base,
    color: '#111827',
  }),
};

export default function PropertiesSupabase() {
  const [listings, setListings] = useState<SupabaseListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(12);
  
  // Filter options from database
  const [countries, setCountries] = useState<SelectOption[]>([]);
  const [cities, setCities] = useState<SelectOption[]>([]);
  const [loadingFilters, setLoadingFilters] = useState(false);

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
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Transaction type options
  const transactionTypeOptions: SelectOption[] = [
    { value: '', label: 'All Types' },
    { value: 'Sale', label: 'For Sale' },
    { value: 'Rent', label: 'For Rent' }
  ];

  // Bedroom options
  const bedroomOptions: SelectOption[] = [
    { value: '', label: 'Any Bedrooms' },
    { value: '1', label: '1 Bedroom' },
    { value: '2', label: '2 Bedrooms' },
    { value: '3', label: '3 Bedrooms' },
    { value: '4', label: '4 Bedrooms' },
    { value: '5', label: '5 Bedrooms' },
    { value: '6+', label: '6+ Bedrooms' }
  ];

  // Bathroom options
  const bathroomOptions: SelectOption[] = [
    { value: '', label: 'Any Bathrooms' },
    { value: '1', label: '1 Bathroom' },
    { value: '2', label: '2 Bathrooms' },
    { value: '3', label: '3 Bathrooms' },
    { value: '4', label: '4 Bathrooms' },
    { value: '5+', label: '5+ Bathrooms' }
  ];

  // Load countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      setLoadingFilters(true);
      try {
        const countriesData = await getDistinctCountries();
        setCountries([
          { value: '', label: 'All Countries' },
          ...countriesData
        ]);
      } catch (err) {
        console.error('Failed to fetch countries:', err);
      } finally {
        setLoadingFilters(false);
      }
    };
    fetchCountries();
  }, []);

  // Load cities when country changes or on mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const citiesData = await getDistinctCities(filters.country);
        setCities([
          { value: '', label: 'All Cities' },
          ...citiesData
        ]);
      } catch (err) {
        console.error('Failed to fetch cities:', err);
      }
    };
    fetchCities();
  }, [filters.country]);

  const loadListings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const offset = (currentPage - 1) * itemPerPage;

      // Get listings and total count
      const [listingsData, count] = await Promise.all([
        getListings({
          ...filters,
          limit: itemPerPage,
          offset: offset
        }),
        getListingsCount(filters)
      ]);

      setListings(listingsData);
      setTotalCount(count);
      
      console.log('✅ Loaded', listingsData.length, 'listings, total:', count);
      
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
  }, [filters, currentPage, itemPerPage]);

  // Load listings when filters or page changes
  useEffect(() => {
    loadListings();
  }, [loadListings]);

  const updateFilter = (key: keyof Filters, value: string) => {
    console.log('🔄 Filter Update:', { key, value, previousValue: filters[key] });
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setFilters({
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
    setCurrentPage(1);
  };

  const getDisplayPrice = (listing: SupabaseListing) => {
    // Try to get converted USD price first, then original price
    const convertedPrice = listing.data?.price?.values?.find(v => v.type === 'Converted' && v.currencyId === 'USD');
    const originalPrice = listing.data?.price?.values?.find(v => v.type === 'Original') || listing.data?.price?.values?.[0];
    
    const priceData = convertedPrice || originalPrice;
    if (!priceData?.value) return 'Price on request';
    
    const price = priceData.value;
    const currency = priceData.currencyId || 'USD';
    const type = listing.data?.transactionType?.id;
    
    // Format price with proper currency symbol
    const currencySymbol = currency === 'USD' ? '$' : currency === 'MXN' ? '$' : currency;
    const formattedPrice = price.toLocaleString('en-US', { maximumFractionDigits: 0 });
    
    return `${currencySymbol}${formattedPrice} ${currency}${type === 'Rent' ? '/month' : ''}`;
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
        sqft: listing.data?.area?.values?.find(v => v.unit?.id === "SquareFoot")?.total || listing.data?.area?.total || listing.data?.area?.living || 0,
        imgSrc: listing.images?.[0] || '/images/property/property-1.jpg',
        price: getDisplayPrice(listing),
        city: listing.city,
        country: listing.country
      };
    });
  };

  const totalPages = Math.ceil(totalCount / itemPerPage);

  // Check if any filters are active
  const hasActiveFilters = filters.country || filters.city || filters.transactionType || 
    filters.bedrooms || filters.bathrooms || filters.minPrice || filters.maxPrice || 
    filters.minSize || filters.maxSize || filters.search;

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
            <div className="mb-3 d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Filter Properties</h5>
              {hasActiveFilters && (
                <button 
                  className="btn btn-sm btn-outline-secondary"
                  onClick={clearFilters}
                >
                  Clear All Filters
                </button>
              )}
            </div>
            
            <div className="row g-3">
              {/* Search Input */}
              <div className="col-md-6 col-lg-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search location, title..."
                  value={filters.search}
                  onChange={(e) => updateFilter('search', e.target.value)}
                  style={{
                    backgroundColor: 'white',
                    borderColor: '#e5e7eb',
                    borderRadius: '0.5rem',
                    padding: '10px 14px',
                  }}
                />
              </div>

              {/* Transaction Type */}
              <div className="col-md-6 col-lg-3">
                <Select
                  value={transactionTypeOptions.find(opt => opt.value === filters.transactionType)}
                  onChange={(option) => updateFilter('transactionType', option?.value || '')}
                  options={transactionTypeOptions}
                  styles={customSelectStyles}
                  placeholder="Transaction Type"
                  isClearable={false}
                  isSearchable={false}
                />
              </div>

              {/* Country */}
              <div className="col-md-6 col-lg-3">
                <Select
                  value={countries.find(opt => opt.value === filters.country)}
                  onChange={(option) => {
                    updateFilter('country', option?.value || '');
                    // Clear city when country changes
                    if (option?.value !== filters.country) {
                      updateFilter('city', '');
                    }
                  }}
                  options={countries}
                  styles={customSelectStyles}
                  placeholder="Select Country"
                  isClearable={false}
                  isSearchable
                  isLoading={loadingFilters}
                />
              </div>

              {/* City */}
              <div className="col-md-6 col-lg-3">
                <Select
                  value={cities.find(opt => opt.value === filters.city)}
                  onChange={(option) => updateFilter('city', option?.value || '')}
                  options={cities}
                  styles={customSelectStyles}
                  placeholder="Select City"
                  isClearable={false}
                  isSearchable
                  isDisabled={!cities.length || cities.length === 1}
                />
              </div>

              {/* Bedrooms */}
              <div className="col-md-6 col-lg-3">
                <Select
                  value={bedroomOptions.find(opt => opt.value === filters.bedrooms)}
                  onChange={(option) => updateFilter('bedrooms', option?.value || '')}
                  options={bedroomOptions}
                  styles={customSelectStyles}
                  placeholder="Bedrooms"
                  isClearable={false}
                  isSearchable={false}
                />
              </div>

              {/* Bathrooms */}
              <div className="col-md-6 col-lg-3">
                <Select
                  value={bathroomOptions.find(opt => opt.value === filters.bathrooms)}
                  onChange={(option) => updateFilter('bathrooms', option?.value || '')}
                  options={bathroomOptions}
                  styles={customSelectStyles}
                  placeholder="Bathrooms"
                  isClearable={false}
                  isSearchable={false}
                />
              </div>

              {/* Price Range */}
              <div className="col-md-6 col-lg-3">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Min Price (USD)"
                  value={filters.minPrice}
                  onChange={(e) => updateFilter('minPrice', e.target.value)}
                  style={{
                    backgroundColor: 'white',
                    borderColor: '#e5e7eb',
                    borderRadius: '0.5rem',
                    padding: '10px 14px',
                  }}
                />
              </div>
              <div className="col-md-6 col-lg-3">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Max Price (USD)"
                  value={filters.maxPrice}
                  onChange={(e) => updateFilter('maxPrice', e.target.value)}
                  style={{
                    backgroundColor: 'white',
                    borderColor: '#e5e7eb',
                    borderRadius: '0.5rem',
                    padding: '10px 14px',
                  }}
                />
              </div>

              {/* Advanced Filters Toggle */}
              <div className="col-12">
                <button 
                  type="button" 
                  className="btn btn-link p-0 text-decoration-none"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  {showAdvanced ? 'Hide' : 'Show'} Advanced Filters
                  <i className={`ms-2 icon-${showAdvanced ? 'CaretUp' : 'CaretDown'}`}></i>
                </button>
              </div>

              {/* Advanced Filters */}
              {showAdvanced && (
                <>
                  <div className="col-md-6 col-lg-3">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Min Size (Sqft)"
                      value={filters.minSize}
                      onChange={(e) => updateFilter('minSize', e.target.value)}
                      style={{
                        backgroundColor: 'white',
                        borderColor: '#e5e7eb',
                        borderRadius: '0.5rem',
                        padding: '10px 14px',
                      }}
                    />
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Max Size (Sqft)"
                      value={filters.maxSize}
                      onChange={(e) => updateFilter('maxSize', e.target.value)}
                      style={{
                        backgroundColor: 'white',
                        borderColor: '#e5e7eb',
                        borderRadius: '0.5rem',
                        padding: '10px 14px',
                      }}
                    />
                  </div>
                </>
              )}
            </div>
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
                  {hasActiveFilters && (
                    <button 
                      className="btn btn-primary mt-3"
                      onClick={clearFilters}
                    >
                      Clear All Filters
                    </button>
                  )}
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
                              <div className="image-placeholder" style={{ 
                                width: '100%', 
                                height: '308px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                backgroundColor: '#f3f4f6',
                                fontSize: '3rem'
                              }}>
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
                                {Math.round(listing.data?.area?.values?.find(v => v.unit?.id === "SquareFoot")?.total || listing.data?.area?.total || listing.data?.area?.living || 0).toLocaleString()} Sqft
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
                                <div className="image-placeholder" style={{ 
                                  width: '540px', 
                                  height: '360px', 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center',
                                  backgroundColor: '#f3f4f6',
                                  fontSize: '3rem'
                                }}>
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
                                {Math.round(listing.data?.area?.values?.find(v => v.unit?.id === "SquareFoot")?.total || listing.data?.area?.total || listing.data?.area?.living || 0).toLocaleString()} Sqft
                              </li>
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Pagination - Original UI Style */}
                  {totalPages > 1 && (
                    <div className="d-flex justify-content-center mt-5">
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