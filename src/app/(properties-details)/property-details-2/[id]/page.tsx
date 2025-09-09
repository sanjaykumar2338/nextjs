import Layout from "@/components/layouts/Layout-defaul";
import PropertyDetails2 from "@/components/property-details/PropertyDetails2";
import Relatest from "@/components/property-details/Relatest";
import { getListingById } from "@/lib/supabase";
import React from "react";
import { notFound } from "next/navigation";

type PageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function Page({ params }: PageProps) {
    const { id } = await params;

    try {
        const property = await getListingById(id);
        
        if (!property) {
            notFound();
        }

        return (
            <Layout>
                <PropertyDetails2 property={property} />
                <Relatest />
            </Layout>
        );
    } catch (error) {
        console.error('Error fetching property:', error);
        notFound();
    }
}

// Remove generateStaticParams for dynamic pages with Supabase data
