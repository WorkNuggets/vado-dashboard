import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Invoice from "@/components/invoice/Invoice";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "VADO Invoice",
  description:
    "This is Invoice Page",
};

export default function InvoicePage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Invoices" />
      <Invoice />
    </div>
  );
}
