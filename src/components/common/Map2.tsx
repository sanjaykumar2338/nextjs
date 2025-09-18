"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export interface Property {
    id: number | string;
    address: string;
    title: string;
    beds?: number;
    baths?: number;
    sqft?: number;
    lat: number;
    long: number;
    coordinates?: [number, number];
    imgSrc: string;
}

export default function MapComponent({ property }: { property: Property }) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const popupRef = useRef<mapboxgl.Popup | null>(null);
    const [error, setError] = useState<string | null>(null);

    const createPopupHTML = (p: Property) => `
        <div class="popup-property">
            <div class="img-style">
                <img src="${
                    p.imgSrc
                }" width="120" height="120" alt="popup-property" />
            </div>
            <div class="content">
                <p class="text-caption-1 mb_4">${p.address}</p>
                <h6 class="mb_12 line-clamp-1">${p.title}</h6>
                <ul class="info d-flex">
                    <li><i class="icon-Bed"></i> ${p.beds ?? 0} Bed</li>
                    <li><i class="icon-Bathtub"></i> ${p.baths ?? 0} Bath</li>
                    <li><i class="icon-Ruler"></i> ${p.sqft ?? 0} sqft</li>
                </ul>
            </div>
        </div>
    `;

    useEffect(() => {
        const showPopup = (p: Property) => {
            const coords = p.coordinates ?? [p.long, p.lat];

            // Move map to property
            map.current?.flyTo({
                center: coords,
                zoom: 14,
                speed: 1.2,
                essential: true,
            });

            // Show popup
            popupRef.current?.remove();
            popupRef.current = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false,
                anchor: "bottom",
                offset: [0, -30],
            })
                .setLngLat(coords)
                .setHTML(createPopupHTML(p))
                .addTo(map.current!);
        };
        const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
        
        if (!accessToken) {
            setError("Missing Mapbox access token. Please check your environment variables.");
            return;
        }

        if (!mapContainer.current || map.current) return;

        try {
            mapboxgl.accessToken = accessToken;
            
            // Validate coordinates
            const coords = property.coordinates ?? [property.long, property.lat];
            if (!coords || coords.length !== 2 || isNaN(coords[0]) || isNaN(coords[1])) {
                coords[0] = -87.073885; // Playa del Carmen longitude
                coords[1] = 20.629559;  // Playa del Carmen latitude
            }
            
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: "mapbox://styles/mapbox/light-v10",
                center: coords,
                zoom: 15,
                cooperativeGestures: true,
            });

            // Wait for map to load before adding markers
            map.current.on('load', () => {
                
                // Create custom marker
                const markerEl = document.createElement("div");
                markerEl.className = "office-marker active"; 
                markerEl.innerHTML = `<i class="icon-HouseLine"></i>`;
                markerEl.style.cursor = 'pointer';

                new mapboxgl.Marker(markerEl)
                    .setLngLat(coords)
                    .addTo(map.current!);

                markerEl.addEventListener("click", () => {
                    document
                        .querySelectorAll(".office-marker")
                        .forEach((m) => m.classList.remove("active"));
                    markerEl.classList.add("active");
                    showPopup(property);
                });

                // Show popup initially
                setTimeout(() => showPopup(property), 500);
            });

            map.current.on("click", (e) => {
                const target = e.originalEvent.target as HTMLElement;
                if (!target.closest(".office-marker")) {
                    popupRef.current?.remove();
                    popupRef.current = null;
                    document
                        .querySelectorAll(".office-marker")
                        .forEach((m) => m.classList.remove("active"));
                }
            });

            // Add controls
            map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
            map.current.addControl(new mapboxgl.FullscreenControl(), "top-right");

            map.current.on("error", (e) => {
                console.error("Mapbox error:", e);
                setError(`Map error: ${e.error?.message || 'Unknown error'}`);
            });

            map.current.on('styledata', () => {
                // Map style loaded
            });

        } catch (err) {
            console.error("Map init error:", err);
            setError(`Map initialization failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }

        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, [property]);

    if (error) {
        return (
            <div className="map-error" style={{ 
                padding: '40px', 
                textAlign: 'center', 
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                border: '1px solid #dee2e6'
            }}>
                <h6>Map Error</h6>
                <p style={{ color: '#dc3545', margin: '10px 0' }}>{error}</p>
                <small style={{ color: '#6c757d' }}>
                    Please check your internet connection and try again.
                </small>
            </div>
        );
    }
    
    return (
        <>
            <div ref={mapContainer} className="map-container" style={{ height: '100%', width: '100%' }} />
            <style jsx>{`
                .map-container {
                    height: 400px;
                    width: 100%;
                    border-radius: 8px;
                    overflow: hidden;
                }
                
                :global(.office-marker) {
                    background-color: #3b82f6;
                    color: white;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                    transition: all 0.3s ease;
                    cursor: pointer;
                    border: 3px solid white;
                }
                
                :global(.office-marker:hover) {
                    transform: scale(1.1);
                    box-shadow: 0 6px 12px rgba(0,0,0,0.3);
                }
                
                :global(.office-marker.active) {
                    background-color: #ef4444;
                    transform: scale(1.2);
                    z-index: 1000;
                }
                
                :global(.popup-property) {
                    display: flex;
                    gap: 12px;
                    min-width: 250px;
                    max-width: 300px;
                }
                
                :global(.popup-property .img-style) {
                    flex-shrink: 0;
                }
                
                :global(.popup-property .img-style img) {
                    border-radius: 6px;
                    object-fit: cover;
                }
                
                :global(.popup-property .content) {
                    flex: 1;
                }
                
                :global(.popup-property .content h6) {
                    margin: 0 0 8px 0;
                    font-size: 14px;
                    font-weight: 600;
                    line-height: 1.3;
                }
                
                :global(.popup-property .content p) {
                    margin: 0 0 8px 0;
                    font-size: 12px;
                    color: #666;
                }
                
                :global(.popup-property .info) {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    gap: 8px;
                    font-size: 11px;
                }
                
                :global(.popup-property .info li) {
                    display: flex;
                    align-items: center;
                    gap: 2px;
                    color: #888;
                }
                
                :global(.popup-property .info i) {
                    font-size: 12px;
                }
            `}</style>
        </>
    );
}
