"use client";
import React from "react";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Property, getRandomPropertiesFromSupabase } from "@/utils/supabaseUtils";
import Image from "next/image";
import Link from "next/link";

export default function Properties() {
    const [isMobile, setIsMobile] = useState(false);
    const [randomProperties, setRandomProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkScreen = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkScreen();
        window.addEventListener("resize", checkScreen);
        return () => window.removeEventListener("resize", checkScreen);
    }, []);

    useEffect(() => {
        // Fetch random properties from Supabase on component mount
        const fetchRandomProperties = async () => {
            try {
                setLoading(true);
                console.log('🏠 Homepage: Starting to fetch properties...');
                
                // Test environment variables first
                console.log('🏠 Environment test:', {
                    hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
                    hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_KEY,
                    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
                });
                
                const properties = await getRandomPropertiesFromSupabase(6);
                console.log('🏠 Homepage: Received properties:', properties.length, properties);
                setRandomProperties(properties);
                
                if (properties.length === 0) {
                    console.warn('⚠️ No properties received from Supabase');
                }
            } catch (error) {
                console.error('❌ Homepage: Error fetching random properties:', error);
                // Try to fallback to local data for testing
                console.log('🔄 Attempting fallback...');
                try {
                    const { properties: localProperties } = await import('@/data/properties');
                    const randomLocal = localProperties.slice(0, 6);
                    console.log('🔄 Using local fallback data:', randomLocal.length);
                    setRandomProperties(randomLocal);
                } catch (fallbackError) {
                    console.error('❌ Fallback also failed:', fallbackError);
                    setRandomProperties([]);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchRandomProperties();
    }, []);

    return (
        <div className="section-features-property-4 tf-spacing-1 pt-0">
            <div className="tf-container">
                <div className="heading-section justify-content-center text-center mb_46">
                    <span className="sub text-uppercase fw-6 text_secondary-color-2 split-text effect-rotate">
                        Featured Properties
                    </span>
                    <h3 className="split-text effect-blur-fade">
                        Find Your Dream Home
                    </h3>
                    <p style={{ fontSize: '12px', color: '#666', textAlign: 'center' }}>
                        {loading ? 'Loading properties...' : `Showing ${randomProperties.length} properties`}
                    </p>
                </div>
                {loading ? (
                    <div className="tf-sw-mobile bg_1">
                        <div className="tf-grid-layout-md lg-col-3 md-col-2">
                            {[...Array(6)].map((_, idx) => (
                                <div className="swiper-slide" key={idx}>
                                    <div className="card-house style-default">
                                        <div className="img-style mb_20 loading-skeleton" style={{ height: '250px', backgroundColor: '#f0f0f0', borderRadius: '12px' }}></div>
                                        <div className="content">
                                            <div className="loading-skeleton" style={{ height: '20px', backgroundColor: '#f0f0f0', borderRadius: '4px', marginBottom: '8px' }}></div>
                                            <div className="loading-skeleton" style={{ height: '16px', backgroundColor: '#f0f0f0', borderRadius: '4px', marginBottom: '8px' }}></div>
                                            <div className="loading-skeleton" style={{ height: '14px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : randomProperties.length === 0 ? (
                    <div className="text-center py-5">
                        <h3>No properties available</h3>
                        <p>Unable to load properties from the database.</p>
                    </div>
                ) : isMobile ? (
                    <Swiper
                        modules={[Pagination]}
                        spaceBetween={15}
                        slidesPerView={1}
                        pagination={{ clickable: true, el: ".sw-dots" }}
                        className="tf-sw-mobile bg_1"
                    >
                        {randomProperties.map((property, idx) => (
                            <SwiperSlide key={idx}>
                                <div
                                    key={property.id}
                                    className="card-house style-default hover-image"
                                    data-id={property.id}
                                >
                                    <div className="img-style mb_20">
                                        <Image
                                            src={property.imgSrc}
                                            width={410}
                                            height={308}
                                            alt="home"
                                        />
                                        <div className="wrap-tag d-flex gap_8 mb_12">
                                            <div
                                                className={`tag ${
                                                    property.type === "Sale"
                                                        ? "sale"
                                                        : property.type ===
                                                          "Rent"
                                                        ? "rent"
                                                        : property.type
                                                }  text-button-small fw-6 text_primary-color`}
                                            >
                                                For {property.type}
                                            </div>
                                            <div className="tag categoreis text-button-small fw-6 text_primary-color">
                                                {property.categories}
                                            </div>
                                        </div>
                                        {property.id && (
                                            <Link
                                                href={`/property-details-1/${property.id}`}
                                                className="overlay-link"
                                            ></Link>
                                        )}
                                        <div className="wishlist">
                                            <div className="hover-tooltip tooltip-left box-icon">
                                                <span className="icon icon-Heart"></span>
                                                <span className="tooltip">
                                                    Add to Wishlist
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="content">
                                        <h4
                                            className="price mb_12"
                                            suppressHydrationWarning
                                        >
                                            ${property.price.toLocaleString()}
                                            <span className="text_secondary-color text-body-default">
                                                {property.type === "Sale"
                                                    ? "/Sqft"
                                                    : "/month"}
                                            </span>
                                        </h4>
                                        {property.id ? (
                                            <Link
                                                href={`/property-details-1/${property.id}`}
                                                className="title mb_8 h5 link text_primary-color"
                                            >
                                                {property.title}
                                            </Link>
                                        ) : (
                                            <h5 className="title mb_8 h5 text_primary-color">
                                                {property.title}
                                            </h5>
                                        )}
                                        <p>{property.address}</p>
                                        <ul className="info d-flex">
                                            <li className="d-flex align-items-center gap_8 text-title text_primary-color fw-6">
                                                <i className="icon-Bed"></i>
                                                {property.beds} Bed
                                            </li>
                                            <li className="d-flex align-items-center gap_8 text-title text_primary-color fw-6">
                                                <i className="icon-Bathtub"></i>
                                                {property.baths} Bath
                                            </li>
                                            <li
                                                className="d-flex align-items-center gap_8 text-title text_primary-color fw-6 "
                                                suppressHydrationWarning
                                            >
                                                <i className="icon-Ruler"></i>
                                                {property.sqft
                                                    ? property.sqft.toLocaleString()
                                                    : "0"}{" "}
                                                Sqft
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                        <div className="sw-dots style-1 sw-pagination-mb mt_24 justify-content-center d-flex d-md-none"></div>
                    </Swiper>
                ) : (
                    <div className="tf-sw-mobile bg_1">
                        <div className="tf-grid-layout-md lg-col-3 md-col-2">
                            {randomProperties.map((property, idx) => (
                                <div className="swiper-slide" key={idx}>
                                    <div
                                        key={property.id}
                                        className="card-house style-default hover-image"
                                        data-id={property.id}
                                    >
                                        <div className="img-style mb_20">
                                            <Image
                                                src={property.imgSrc}
                                                width={410}
                                                height={308}
                                                alt="home"
                                            />
                                            <div className="wrap-tag d-flex gap_8 mb_12">
                                                <div
                                                    className={`tag ${
                                                        property.type === "Sale"
                                                            ? "sale"
                                                            : property.type ===
                                                              "Rent"
                                                            ? "rent"
                                                            : property.type
                                                    }  text-button-small fw-6 text_primary-color`}
                                                >
                                                    For {property.type}
                                                </div>
                                                <div className="tag categoreis text-button-small fw-6 text_primary-color">
                                                    {property.categories}
                                                </div>
                                            </div>
                                            {property.id && (
                                                <Link
                                                    href={`/property-details-1/${property.id}`}
                                                    className="overlay-link"
                                                ></Link>
                                            )}
                                            <div className="wishlist">
                                                <div className="hover-tooltip tooltip-left box-icon">
                                                    <span className="icon icon-Heart"></span>
                                                    <span className="tooltip">
                                                        Add to Wishlist
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="content">
                                            <h4
                                                className="price mb_12"
                                                suppressHydrationWarning
                                            >
                                                $
                                                {property.price.toLocaleString()}
                                                <span className="text_secondary-color text-body-default">
                                                    {property.type === "Sale"
                                                        ? "/Sqft"
                                                        : "/month"}
                                                </span>
                                            </h4>
                                            {property.id ? (
                                                <Link
                                                    href={`/property-details-1/${property.id}`}
                                                    className="title mb_8 h5 link text_primary-color"
                                                >
                                                    {property.title}
                                                </Link>
                                            ) : (
                                                <h5 className="title mb_8 h5 text_primary-color">
                                                    {property.title}
                                                </h5>
                                            )}
                                            <p>{property.address}</p>
                                            <ul className="info d-flex">
                                                <li className="d-flex align-items-center gap_8 text-title text_primary-color fw-6">
                                                    <i className="icon-Bed"></i>
                                                    {property.beds} Bed
                                                </li>
                                                <li className="d-flex align-items-center gap_8 text-title text_primary-color fw-6">
                                                    <i className="icon-Bathtub"></i>
                                                    {property.baths} Bath
                                                </li>
                                                <li
                                                    className="d-flex align-items-center gap_8 text-title text_primary-color fw-6 "
                                                    suppressHydrationWarning
                                                >
                                                    <i className="icon-Ruler"></i>
                                                    {property.sqft
                                                        ? property.sqft.toLocaleString()
                                                        : "0"}{" "}
                                                    Sqft
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <Link
                    href={'/listing-topmap-grid'}
                    className="tf-btn btn-bg-1 mx-auto btn-px-32 scrolling-effect effectBottom"
                >
                    <span>View All Properties</span>
                    <span className="bg-effect"></span>
                </Link>
            </div>
        </div>
    );
}
