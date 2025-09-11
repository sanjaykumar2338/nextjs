import React from "react";

// Supabase property type
type Property = {
    id: string;
    title?: string;
    country: string;
    city?: string;
    data?: {
        title?: Array<{ text: string }>;
        descriptionFull?: Array<{ text: string }>;
        transactionType?: {
            id: string;
            name: string;
        };
        price?: {
            values: Array<{ value: number; currency: string }>;
        };
        numberOf?: {
            bedrooms?: number;
            bathrooms?: number;
            floors?: number;
        };
        area?: {
            living?: number;
            land?: number;
        };
        location?: {
            address1?: string;
            latitude?: number;
            longitude?: number;
        };
        images?: Array<{ url: string; alt?: string }>;
        features?: string[];
        amenities?: string[];
    };
    created_at?: string;
    updated_at?: string;
};

export default function PropertiesTitle({ property }: { property: Property }) {
    // Extract data from Supabase structure
    const title = property.data?.title?.[0]?.text || property.title || 'Property Title';
    const transactionType = property.data?.transactionType?.id || 'Sale';
    const price = property.data?.price?.values?.[0]?.value || 0;
    const currency = property.data?.price?.values?.[0]?.currency || 'USD';
    const bedrooms = property.data?.numberOf?.bedrooms || 0;
    const bathrooms = property.data?.numberOf?.bathrooms || 0;
    // Get area in square feet from the API response - find SquareFoot unit
    const sqftArea = property.data?.area?.values?.find(v => v.unit?.id === "SquareFoot")?.total || 
                     property.area?.values?.find(v => v.unit?.id === "SquareFoot")?.total || 0;
    const area = sqftArea || property.data?.area?.living || property.data?.area?.land || 0;
    const address = property.data?.location?.address1 || `${property.city}, ${property.country}`;
    
    // Format price
    const formatPrice = (price: number, currency: string) => {
        if (currency === 'USD') {
            return `$${price.toLocaleString()}`;
        }
        return `${currency} ${price.toLocaleString()}`;
    };
    return (
        <div>
            <div className="d-flex align-items-center justify-content-between flex-wrap gap_12">
                <div>
                    <div className="wrap-tag d-flex gap_8 mb_12">
                        <div
                            className={`tag ${
                                transactionType === "Sell"
                                    ? "sale"
                                    : transactionType === "Rent"
                                    ? "rent"
                                    : "sale"
                            }  text-button-small fw-6 text_primary-color`}
                        >
                            For {transactionType === "Sell" ? "Sale" : transactionType}
                        </div>
                        <div className="tag categoreis text-button-small fw-6 text_primary-color">
                            {property.country} Property
                        </div>
                    </div>
                    <h4>{title}</h4>
                    <div className="text-body-default mb_12">{address}</div>
                </div>
                <h4 className="price">
                    {formatPrice(price, currency)}
                    <span className="text_secondary-color text-body-1">
                        {transactionType === "Sell" ? "/Total" : "/month"}
                    </span>
                </h4>
            </div>
            <div className="wrap-info d-flex justify-content-between align-items-end">
                <div>
                    <div className="text-body-default mb_12">Features:</div>
                    <ul className="info d-flex">
                        <li className="d-flex align-items-center gap_8 h6 text_primary-color fw-6">
                            <i className="icon-Bed"></i>
                            {bedrooms} {bedrooms === 1 ? 'Bed' : 'Beds'}
                        </li>
                        <li className="d-flex align-items-center gap_8 h6 text_primary-color fw-6">
                            <i className="icon-Bathstub"></i>
                            {bathrooms} {bathrooms === 1 ? 'Bath' : 'Baths'}
                        </li>
                        <li className="d-flex align-items-center gap_8 h6 text_primary-color fw-6">
                            <i className="icon-Ruler"></i>
                            {area.toLocaleString()} sqft
                        </li>
                    </ul>
                </div>
                <ul className="list-action d-flex gap_16">
                    <li>
                        <a href="#" className="">
                            <i className="icon-ArrowsLeftRight"></i>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <span className="icon icon-Heart"></span>
                        </a>
                    </li>
                    <li>
                        {" "}
                        <a href="#" className="">
                            <i className="icon-ShareNetwork"></i>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
}
