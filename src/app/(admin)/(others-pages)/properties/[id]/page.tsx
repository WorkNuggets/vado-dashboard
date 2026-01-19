"use client";

import { getProperty } from "@/services/property.service";
import type { PropertyWithAgent } from "@/types/entities";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<PropertyWithAgent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const propertyId = params.id as string;

  useEffect(() => {
    if (propertyId) {
      loadProperty();
    }
  }, [propertyId]);

  async function loadProperty() {
    setLoading(true);
    try {
      const data = await getProperty(propertyId);
      setProperty(data);
      setError(null);
    } catch (err) {
      setError("Failed to load property");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const formatPrice = (price: number | null) => {
    if (!price) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900/20 dark:text-red-400">
          <p>{error || "Property not found"}</p>
        </div>
        <Link
          href="/properties"
          className="inline-flex items-center gap-2 text-brand-500 hover:text-brand-600"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Properties
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/properties"
          className="inline-flex items-center gap-2 text-brand-500 hover:text-brand-600"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Properties
        </Link>
        <Link
          href={`/properties/${property.id}/edit`}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Edit Property
        </Link>
      </div>

      {/* Property Image */}
      <div className="relative h-96 w-full overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700">
        {property.featured_image_url ? (
          <img
            src={property.featured_image_url}
            alt={property.address || "Property"}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg
              className="h-24 w-24 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Property Details */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatPrice(property.price)}
            </h1>
            <p className="mt-2 text-lg font-medium text-gray-700 dark:text-gray-300">
              {property.address}
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              {property.city}, {property.state} {property.zip_code}
            </p>

            <div className="mt-4 flex gap-6 text-gray-700 dark:text-gray-300">
              {property.bedrooms && (
                <div>
                  <span className="text-2xl font-bold">{property.bedrooms}</span>
                  <span className="ml-1 text-sm">Bedrooms</span>
                </div>
              )}
              {property.bathrooms && (
                <div>
                  <span className="text-2xl font-bold">{property.bathrooms}</span>
                  <span className="ml-1 text-sm">Bathrooms</span>
                </div>
              )}
              {property.square_feet && (
                <div>
                  <span className="text-2xl font-bold">
                    {property.square_feet.toLocaleString()}
                  </span>
                  <span className="ml-1 text-sm">Sq Ft</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {property.description && (
            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Description
              </h2>
              <p className="mt-2 text-gray-700 dark:text-gray-300">
                {property.description}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Property Details */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Property Details
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              {property.property_type && (
                <div className="flex justify-between">
                  <dt className="text-gray-500 dark:text-gray-400">Type</dt>
                  <dd className="font-medium text-gray-900 dark:text-white">
                    {property.property_type}
                  </dd>
                </div>
              )}
              {property.listing_status && (
                <div className="flex justify-between">
                  <dt className="text-gray-500 dark:text-gray-400">Status</dt>
                  <dd className="font-medium text-gray-900 dark:text-white">
                    {property.listing_status}
                  </dd>
                </div>
              )}
              {property.year_built && (
                <div className="flex justify-between">
                  <dt className="text-gray-500 dark:text-gray-400">Year Built</dt>
                  <dd className="font-medium text-gray-900 dark:text-white">
                    {property.year_built}
                  </dd>
                </div>
              )}
              {property.lot_size && (
                <div className="flex justify-between">
                  <dt className="text-gray-500 dark:text-gray-400">Lot Size</dt>
                  <dd className="font-medium text-gray-900 dark:text-white">
                    {property.lot_size}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Location */}
          {(property.latitude && property.longitude) && (
            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Location
              </h2>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Lat: {property.latitude.toFixed(6)}
                <br />
                Lng: {property.longitude.toFixed(6)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
