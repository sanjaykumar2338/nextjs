import React from "react";

// Updated property type to match actual API structure
type Property = {
    id: string;
    title?: Array<{ text: string; language: string }>;
    area?: {
        unit?: { id: string; name: string };
        total?: number;
        values?: Array<{
            unit: { id: string; name: string };
            total: number;
        }>;
    };
    numberOf?: {
        bedrooms?: number;
        bathrooms?: number;
    };
    transactionType?: {
        id: string;
        name: string;
    };
    price?: {
        show?: boolean;
        values?: Array<{ type?: string; value: number; currencyId: string }>;
    };
    location?: {
        address1?: string;
        latitude?: number;
        longitude?: number;
    };
    // Keep backward compatibility
    data?: {
        title?: Array<{ text: string }>;
        descriptionFull?: Array<{ text: string }>;
        transactionType?: {
            id: string;
            name: string;
        };
        price?: {
            show?: boolean;
            values?: Array<{ type?: string; value: number; currencyId: string }>;
        };
        numberOf?: {
            bedrooms?: number;
            bathrooms?: number;
            floors?: number;
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

export default function Overview({ property }: { property: Property }) {
    // Extract data from property - handle both new API structure and old structure
    const bedrooms = property.numberOf?.bedrooms || property.data?.numberOf?.bedrooms || 0;
    const bathrooms = property.numberOf?.bathrooms || property.data?.numberOf?.bathrooms || 0;
    
    // Get area in square feet from the API response - use same logic as listing page
    const sqftArea = property.data?.area?.values?.find(v => v.unit?.id === "SquareFoot")?.total || 
                     property.area?.values?.find(v => v.unit?.id === "SquareFoot")?.total || 0;
    const livingArea = sqftArea || property.data?.area?.total || property.data?.area?.living || 0;
    const landArea = sqftArea || property.data?.area?.total || property.data?.area?.land || 0;
    
    const transactionType = property.transactionType?.name || property.data?.transactionType?.name || 'Property';
    
    // Format area with proper unit
    const formatArea = (area: number) => {
        return area > 0 ? `${area.toLocaleString()} SqFt` : 'N/A';
    };
    
    // Get current year for Year Built (you may want to add this to your data structure)
    const currentYear = new Date().getFullYear();

    return (
        <div>
            <h5 className="properties-title mb_20">Overview</h5>
            <div className="tf-grid-layout tf-col-2 xl-col-4 md-col-3">
                <div className="item d-flex gap_16">
                    <i className="icon icon-HouseSimple"></i>
                    <div className="d-flex flex-column gap">
                        <span className="text-body-default">ID:</span>
                        <span className="text-title fw-6 text_primary-color">
                            {property.id}
                        </span>
                    </div>
                </div>
                <div className="item d-flex gap_16">
                    <i className="icon icon-SlidersHorizontal"></i>
                    <div className="d-flex flex-column gap">
                        <span className="text-body-default">Type:</span>
                        <span className="text-title fw-6 text_primary-color">
                            {transactionType}
                        </span>
                    </div>
                </div>
                <div className="item d-flex gap_16">
                    <i className="icon icon-Bed"></i>
                    <div className="d-flex flex-column gap">
                        <span className="text-body-default">Bedrooms:</span>
                        <span className="text-title fw-6 text_primary-color">
                            {bedrooms > 0 ? `${bedrooms} ${bedrooms === 1 ? 'Room' : 'Rooms'}` : 'N/A'}
                        </span>
                    </div>
                </div>
                <div className="item d-flex gap_16">
                    <i className="icon icon-Shower"></i>
                    <div className="d-flex flex-column gap">
                        <span className="text-body-default">Bathrooms:</span>
                        <span className="text-title fw-6 text_primary-color">
                            {bathrooms > 0 ? `${bathrooms} ${bathrooms === 1 ? 'Room' : 'Rooms'}` : 'N/A'}
                        </span>
                    </div>
                </div>
                <div className="item d-flex gap_16">
                    <i className="icon icon-Warehouse"></i>
                    <div className="d-flex flex-column gap">
                        <span className="text-body-default">Garages:</span>
                        <span className="text-title fw-6 text_primary-color">
                            N/A
                        </span>
                    </div>
                </div>
                <div className="item d-flex gap_16">
                    <i className="icon icon-Ruler"></i>
                    <div className="d-flex flex-column gap">
                        <span className="text-body-default">Size:</span>
                        <span className="text-title fw-6 text_primary-color">
                            {formatArea(livingArea)}
                        </span>
                    </div>
                </div>
                <div className="item d-flex gap_16">
                    <i className="icon icon-Crop"></i>
                    <div className="d-flex flex-column gap">
                        <span className="text-body-default">Land area:</span>
                        <span className="text-title fw-6 text_primary-color">
                            {formatArea(landArea)}
                        </span>
                    </div>
                </div>
                <div className="item d-flex gap_16">
                    <i className="icon icon-CalendarBlank"></i>
                    <div className="d-flex flex-column gap">
                        <span className="text-body-default">Year Built:</span>
                        <span className="text-title fw-6 text_primary-color">
                            {currentYear}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
