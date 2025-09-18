import React from "react";
import Overview from "./Overview";
import PropertiesTitle from "./PropertiesTitle";
import Description from "./Description";
import PropertiesUtility from "./Utility";
import Video from "./Video";
import Caculator from "./Caculator";
import Floor from "./Floor";
import Location from "./Location";
import Nearby from "./Nearby";

import FormComments from "../common/FormComments";
import BoxSeller1 from "./BoxSeller1";
import BoxFilter from "./BoxFilter";
import Slide1 from "./Slide1";
import Comment from "../common/Comment";
import Breadcrumb from "../common/Breadcrumb";

// Supabase property type - updated for new API structure
type Property = {
    id: string;
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
        descriptionFull?: Array<{ text: string; language: string; original?: boolean }>;
        transactionType?: {
            id: string;
            name: string;
        };
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
        amenities?: string[];
    };
    amenities?: Array<{
        count: number;
        value: string;
    }>;
    images?: string[];
};

function toTitleCase(str: string | null | undefined) {
  if (!str) return '';
  return str.toLowerCase().replace(/\b(\w)/g, (s: string) => s.toUpperCase());
}

export default function PropertyDetails1({ property }: { property: Property }) {
    // Create dynamic breadcrumb items based on property data hierarchy
    // EXACT ORDER: Home icon > Country > State > Municipality > City > Property Type > Current Property
    
    // CONFIGURABLE: Choose which listing page to link to
    const LISTING_PAGE_URL = '/listing-topmap-grid'; // Change this to any of:
    // '/listing-topmap-grid' | '/listing-topmap-list' | '/listing-left-sidebar' 
    // '/listing-right-sidebar' | '/listing-half-map-grid' | '/listing-half-map-list'
    
    const breadcrumbItems = [];

    // 1. Home (Static)
    breadcrumbItems.push({
        label: 'Home',
        href: '/',
        isHome: true
    });

    // 2. Country
    if (property.country) {
        const countryDisplayName = property.country === 'mx' ? 'Mexico' :

        property.country === 'us' ? 'United States' :

        property.country === 'ca' ? 'Canada' :

        property.country.charAt(0).toUpperCase() + property.country.slice(1);

        breadcrumbItems.push({

        label: countryDisplayName,

        href: `${LISTING_PAGE_URL}?country=${encodeURIComponent(property.country)}`

        });
    }

    // 3. State
    if (property.state) {
        const stateName = toTitleCase(property.state);
        breadcrumbItems.push({
            label: stateName,
            href: `${LISTING_PAGE_URL}?country=${encodeURIComponent(property.country || '')}&state=${encodeURIComponent(property.state)}`
        });
    }

    // 4. Municipality
    if (property.municipality) {
        // NEW: Remove the word "municipality" for a cleaner label
        const cleanedMunicipality = property.municipality.replace(/ municipality/gi, '').trim();
        
        // Capitalize the cleaned-up name
        const municipalityName = toTitleCase(cleanedMunicipality);

        breadcrumbItems.push({
            label: municipalityName, // Use the cleaned name for the label
            // Use the original, full name for the URL parameter to ensure correct filtering
            href: `${LISTING_PAGE_URL}?country=${encodeURIComponent(property.country || '')}&state=${encodeURIComponent(property.state || '')}&municipality=${encodeURIComponent(property.municipality)}`
        });
    }

    // 5. City
    /*
    if (property.city) {
        const cityName = toTitleCase(property.city);
        breadcrumbItems.push({
            label: cityName,
            href: `${LISTING_PAGE_URL}?country=${encodeURIComponent(property.country || '')}&state=${encodeURIComponent(property.state || '')}&municipality=${encodeURIComponent(property.municipality || '')}&city=${encodeURIComponent(property.city)}`
        });
    }
    */

    // 6. Property Type (Final item, no link)
    const propertyType = property.data?.type?.name;
    if (propertyType) {
        breadcrumbItems.push({
            label: toTitleCase(propertyType)
            // No 'href' as this is the current page/item
        });
    }

    // DEBUG: Log breadcrumb items to verify correct URLs
    console.log('🔗 BREADCRUMB DEBUG:', {
        LISTING_PAGE_URL,
        breadcrumbItems: breadcrumbItems.map(item => ({ label: item.label, href: item.href })),
        property: {
            country: property.country,
            state: property.state,
            dataState: property.data?.state?.name,
            municipality: property.municipality,
            city: property.city,
            dataCity: property.data?.location?.city
        }
    });

    return (
        <>
            <div className="properties-details">
                <Slide1 property={property} />
                <Breadcrumb items={breadcrumbItems} className="tf-container" />
                <div className="tf-container tf-spacing-7">
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="properties-title ">
                                <PropertiesTitle property={property} />
                            </div>
                            <div className="properties-overview tf-spacing-8">
                                <Overview property={property} />
                            </div>
                            <div className="properties-description">
                                <Description />
                            </div>
                            <div className="properties-utility tf-spacing-8">
                                <PropertiesUtility />
                            </div>
                            <div className="properties-video">
                                <Video property={property} />
                            </div>
                            <div className="properties-calculator tf-spacing-8">
                                <Caculator />
                            </div>
                            <div className="properties-floor">
                                <Floor />
                            </div>
                            <div className="properties-location tf-spacing-8">
                                <Location property={{
                                    id: parseInt(property.id),
                                    imgSrc: property.images?.[0] || '/assets/images/home/home-1.jpg',
                                    address: property.data?.location?.address1 || property.city || 'Unknown Location',
                                    title: property.data?.title?.[0]?.text || 'Property',
                                    categories: property.data?.transactionType?.name || 'Property',
                                    type: property.data?.transactionType?.id || 'Sale',
                                    price: (() => {
                                        const convertedPrice = property.data?.price?.values?.find(v => v.type === 'Converted' && v.currencyId === 'USD');
                                        const originalPrice = property.data?.price?.values?.find(v => v.type === 'Original') || property.data?.price?.values?.[0];
                                        return (convertedPrice || originalPrice)?.value || 0;
                                    })(),
                                    coordinates: [property.data?.location?.latitude || 0, property.data?.location?.longitude || 0],
                                    garages: 1,
                                    city: property.city || 'Unknown'
                                } as const} />
                            </div>
                            <div className="properties-nearby">
                                <Nearby />
                            </div>
                            <div className="tf-spacing-8 pb-0 mb_40">
                                <Comment />
                            </div>
                            <FormComments />
                        </div>
                        <div className="col-lg-4">
                            <div className="right sticky-top">
                                <div className="box-sellers mb_30">
                                    <BoxSeller1 />
                                </div>
                                <div className="tf-filter-sidebar ms-lg-auto">
                                    <BoxFilter />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
