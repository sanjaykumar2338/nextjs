import Layout from "@/components/layouts/Layout-defaul";
import PropertyDetails1 from "@/components/property-details/PropertyDetails1";
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

  // Validate ID before making API call
  if (!id || id === 'undefined' || id === 'null' || typeof id !== 'string' || id.trim() === '') {
    console.error('❌ Invalid property ID received:', id);
    notFound();
  }

  try {
    const property = await getListingById(id);
    
    if (!property) {
      notFound();
    }

    return (
      <Layout>
        <PropertyDetails1 property={property} />
        <Relatest />
      </Layout>
    );
  } catch (error) {
    console.error('Error fetching property:', error);
    notFound();
  }
}

// Remove generateStaticParams for dynamic pages with Supabase data
