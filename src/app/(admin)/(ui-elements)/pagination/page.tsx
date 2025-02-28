import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PaginationExample from "@/components/ui/pagination/PaginationExample";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "VADO Pagination",
  description: "This is Pagination Page",
};

export default function Pagination() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Pagination" />
      <PaginationExample />
    </div>
  );
}
