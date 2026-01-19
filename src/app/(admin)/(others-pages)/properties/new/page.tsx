"use client";

import { useAuth } from "@/context/AuthContext";
import { createProperty } from "@/services/property.service";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Select from "@/components/form/Select";
import Label from "@/components/form/Label";
import { useRouter } from "next/navigation";
import { useState } from "react";

const propertyTypeOptions = [
  { value: "single_family", label: "Single Family" },
  { value: "condo", label: "Condo" },
  { value: "townhouse", label: "Townhouse" },
  { value: "multi_family", label: "Multi-Family" },
  { value: "land", label: "Land" },
];

const listingStatusOptions = [
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "sold", label: "Sold" },
  { value: "off_market", label: "Off Market" },
];

export default function NewPropertyPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    address: "",
    city: "",
    state: "",
    zip_code: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    square_feet: "",
    year_built: "",
    lot_size: "",
    property_type: "",
    listing_status: "active",
    description: "",
    featured_image_url: "",
    latitude: "",
    longitude: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      setError("You must be logged in to create a property");
      return;
    }

    // Validate required fields
    if (!formData.address || !formData.city || !formData.state || !formData.zip_code) {
      setError("Please fill in all required address fields");
      return;
    }

    if (!formData.price || !formData.property_type) {
      setError("Please fill in all required property details");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const propertyData = {
        listing_agent_id: user.id,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zip_code,
        price: parseFloat(formData.price),
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseFloat(formData.bathrooms) : null,
        square_feet: formData.square_feet ? parseInt(formData.square_feet) : null,
        year_built: formData.year_built ? parseInt(formData.year_built) : null,
        lot_size: formData.lot_size || null,
        property_type: formData.property_type as any,
        listing_status: formData.listing_status as any,
        description: formData.description || null,
        featured_image_url: formData.featured_image_url || null,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      };

      const newProperty = await createProperty(propertyData);
      router.push(`/properties/${newProperty.id}`);
    } catch (err) {
      console.error("Error creating property:", err);
      setError(err instanceof Error ? err.message : "Failed to create property");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Add New Property
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Create a new property listing
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Address Information */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Address Information
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <Label>
                Street Address <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                placeholder="123 Main St"
                defaultValue={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
              />
            </div>
            <div>
              <Label>
                City <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                placeholder="San Francisco"
                defaultValue={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
              />
            </div>
            <div>
              <Label>
                State <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                placeholder="CA"
                defaultValue={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
              />
            </div>
            <div>
              <Label>
                Zip Code <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                placeholder="94102"
                defaultValue={formData.zip_code}
                onChange={(e) => handleInputChange("zip_code", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Property Details
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label>
                Price <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                placeholder="500000"
                defaultValue={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                step={1000}
              />
            </div>
            <div>
              <Label>
                Property Type <span className="text-red-500">*</span>
              </Label>
              <Select
                options={propertyTypeOptions}
                placeholder="Select property type"
                defaultValue={formData.property_type}
                onChange={(value) => handleInputChange("property_type", value)}
              />
            </div>
            <div>
              <Label>Bedrooms</Label>
              <Input
                type="number"
                placeholder="3"
                defaultValue={formData.bedrooms}
                onChange={(e) => handleInputChange("bedrooms", e.target.value)}
                min="0"
              />
            </div>
            <div>
              <Label>Bathrooms</Label>
              <Input
                type="number"
                placeholder="2.5"
                defaultValue={formData.bathrooms}
                onChange={(e) => handleInputChange("bathrooms", e.target.value)}
                min="0"
                step={0.5}
              />
            </div>
            <div>
              <Label>Square Feet</Label>
              <Input
                type="number"
                placeholder="2000"
                defaultValue={formData.square_feet}
                onChange={(e) => handleInputChange("square_feet", e.target.value)}
                min="0"
              />
            </div>
            <div>
              <Label>Year Built</Label>
              <Input
                type="number"
                placeholder="2020"
                defaultValue={formData.year_built}
                onChange={(e) => handleInputChange("year_built", e.target.value)}
                min="1800"
                max={(new Date().getFullYear() + 1).toString()}
              />
            </div>
            <div>
              <Label>Lot Size</Label>
              <Input
                type="text"
                placeholder="0.25 acres"
                defaultValue={formData.lot_size}
                onChange={(e) => handleInputChange("lot_size", e.target.value)}
              />
            </div>
            <div>
              <Label>
                Listing Status <span className="text-red-500">*</span>
              </Label>
              <Select
                options={listingStatusOptions}
                placeholder="Select listing status"
                defaultValue={formData.listing_status}
                onChange={(value) => handleInputChange("listing_status", value)}
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Description
          </h2>
          <div>
            <Label>Property Description</Label>
            <TextArea
              placeholder="Enter a detailed description of the property..."
              rows={6}
              value={formData.description}
              onChange={(value) => handleInputChange("description", value)}
            />
          </div>
        </div>

        {/* Media */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Media
          </h2>
          <div>
            <Label>Featured Image URL</Label>
            <Input
              type="text"
              placeholder="https://example.com/image.jpg"
              defaultValue={formData.featured_image_url}
              onChange={(e) => handleInputChange("featured_image_url", e.target.value)}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Enter a direct URL to the property's featured image
            </p>
          </div>
        </div>

        {/* Location Coordinates (Optional) */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Coordinates (Optional)
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label>Latitude</Label>
              <Input
                type="number"
                placeholder="37.7749"
                defaultValue={formData.latitude}
                onChange={(e) => handleInputChange("latitude", e.target.value)}
                step={0.000001}
              />
            </div>
            <div>
              <Label>Longitude</Label>
              <Input
                type="number"
                placeholder="-122.4194"
                defaultValue={formData.longitude}
                onChange={(e) => handleInputChange("longitude", e.target.value)}
                step={0.000001}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Property"}
          </button>
        </div>
      </form>
    </div>
  );
}
