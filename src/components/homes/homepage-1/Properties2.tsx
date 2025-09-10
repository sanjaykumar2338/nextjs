"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Property, getRandomPropertiesFromSupabase } from "@/utils/supabaseUtils";

export default function Properties2() {
    const [activeTab, setActiveTab] = useState("tab1");
    const [randomProperties, setRandomProperties] = useState<Property[]>([]);

    useEffect(() => {
        // Fetch random 5 properties from Supabase for the interactive tabs
        const fetchRandomProperties = async () => {
            try {
                const properties = await getRandomPropertiesFromSupabase(5);
                setRandomProperties(properties);
                if (properties.length > 0) {
                    setActiveTab(`tab1`);
                }
            } catch (error) {
                console.error('Error fetching random properties:', error);
                setRandomProperties([]);
            }
        };

        fetchRandomProperties();
    }, []);
    let hoverTimer: ReturnType<typeof setTimeout>;

    const handleMouseEnter = (tabId: string) => {
        hoverTimer = setTimeout(() => {
            setActiveTab(tabId);
        }, 100);
    };

    const handleMouseLeave = () => {
        clearTimeout(hoverTimer);
    };

    return (
        <div className="section-features-property tf-spacing-1">
            <div className="tf-container">
                <div className="tf-grid-layout lg-col-2 tabs-hover-wrap align-items-center">
                    <div className="box">
                        {randomProperties.map((property, index) => {
                            const tabId = `tab${index + 1}`;
                            return (
                                <div
                                    key={property.id}
                                    className={`process-item item scrolling-effect effectLeft${
                                        activeTab === tabId ? " active" : ""
                                    }`}
                                    data-tab={tabId}
                                    onMouseEnter={() =>
                                        handleMouseEnter(tabId)
                                    }
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <div className="property-item">
                                        <div className="dots"></div>
                                        <div className="content">
                                            <h4 className="title mb_8">
                                                <Link
                                                    href={`/property-details-1/${property.id}`}
                                                    className="link"
                                                >
                                                    {property.title}
                                                </Link>
                                            </h4>
                                            <p>{property.address}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="tab-content-wrap">
                        {randomProperties.map((property, index) => {
                            const tabId = `tab${index + 1}`;
                            return (
                                <div
                                    key={property.id}
                                    id={tabId}
                                    className={`tab-content${
                                        activeTab === tabId ? " active" : ""
                                    }`}
                                >
                                    <Link href={`/property-details-1/${property.id}`} className="img-style">
                                        <Image
                                            src={property.imgSrc}
                                            width={645}
                                            height={645}
                                            alt="property"
                                        />
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
