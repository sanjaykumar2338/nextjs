import React from "react";
import MapComponent from "../common/Map2";

type Property = {
    id: number;
    imgSrc: string;
    alt?: string;
    address: string;
    title: string;
    beds?: number;
    baths?: number;
    sqft?: number;
    categories: string;
    type: string;
    lat?: number;
    long?: number;
    price: number;
    coordinates: [number, number];
    garages: number;
    city: string;
};

export default function Location({ property }: { property: Property }) {
    // Get coordinates, with fallback to default location if not available
    // Note: property.coordinates is [latitude, longitude] format
    const lat = property.coordinates?.[0] ?? property.lat ?? 20.629559; // Playa del Carmen default
    const lng = property.coordinates?.[1] ?? property.long ?? -87.073885;
    
    // Create Google Maps directions URL
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    
    return (
        <>
            <h5 className="properties-title mb_20">Location</h5>
            <div className="heading d-flex align-items-center justify-content-between flex-wrap gap_12 mb_16">
                <div className="d-flex align-items-center gap_4 text-button fw-7 text_primary-color flex-wrap">
                    <i className="icon-MapPin"></i>
                    {property.address || "Property Location"}
                </div>
                <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover-underline-link text-button fw-7 text_primary-color"
                >
                    Get Directions
                </a>
            </div>
            <div className="wrap-map" style={{ height: '400px', borderRadius: '8px', overflow: 'hidden' }}>
                <MapComponent
                    property={{
                        ...property,
                        lat: lat,
                        long: lng,
                        coordinates: [lng, lat] // Mapbox uses [lng, lat] format
                    }}
                />
            </div>
        </>
    );
}
