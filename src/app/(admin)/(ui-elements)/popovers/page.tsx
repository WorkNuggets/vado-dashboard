import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DefaultPopover from "@/components/ui/popover/DefaultPopover";
import PopoverButton from "@/components/ui/popover/PopoverButton";
import PopoverWithLink from "@/components/ui/popover/PopoverWithLink";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "VADO Popovers",
  description: "This is Popovers Page",
};

export default function Popovers() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Popovers" />
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="Default Popover">
          <DefaultPopover />
        </ComponentCard>{" "}
        <ComponentCard title="Popover With Button">
          <PopoverButton />
        </ComponentCard>{" "}
        <ComponentCard title="Popover With Link">
          <PopoverWithLink />
        </ComponentCard>
      </div>
    </div>
  );
}
