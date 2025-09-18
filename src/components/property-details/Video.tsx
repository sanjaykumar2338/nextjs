"use client";
import Image from "next/image";
import React, { useState, useCallback } from "react";
import ModalVideo from "../common/ModalVideo";

type Property = {
    id: number | string;
    imgSrc?: string;
};

export default function Video({ property }: { property: Property }) {
    const [isOpen, setIsOpen] = useState(false);

    const handleVideoClick = useCallback(() => {
        setIsOpen(true);
    }, []);

    return (
        <>
            <h5 className="properties-title mb_20">Video</h5>
            <div className="widget-video" style={{ position: "relative" }}>
                <Image
                    data-src={property.imgSrc || '/assets/images/home/home-1.jpg'}
                    src={property.imgSrc || '/assets/images/home/home-1.jpg'}
                    alt={property.imgSrc || 'Property video thumbnail'}
                    width={850}
                    height={400}
                />

                <div
                    onClick={handleVideoClick}
                    data-fancybox="gallery2"
                    className="btn-video popup-youtube"
                    aria-label="Play Video"
                >
                    <Image src="/assets/icons/play.svg" alt="play" width={60} height={60} />
                </div>
            </div>
            <ModalVideo
                setIsOpen={setIsOpen}
                isOpen={isOpen}
                videoId={"XHOmBV4js_E"}
            />
        </>
    );
}
