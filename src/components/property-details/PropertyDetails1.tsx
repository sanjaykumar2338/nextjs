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

export default function PropertyDetails1({ property }: { property: Property }) {
    // Create breadcrumb items based on property data
    const breadcrumbItems = [
        { label: 'Home', href: '/' },
        { label: 'Properties', href: '/listings-supabase' },
        { 
            label: property.country ? property.country.charAt(0).toUpperCase() + property.country.slice(1) : 'Country', 
            href: `/listings-supabase?country=${property.country?.toLowerCase() || ''}` 
        },
        { 
            label: property.city ? property.city.charAt(0).toUpperCase() + property.city.slice(1) : 'City',
            href: `/listings-supabase?country=${property.country?.toLowerCase() || ''}&city=${property.city || ''}` 
        },
        { 
            label: property.data?.title?.[0]?.text || `Property ${property.id}` 
        }
    ];

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
