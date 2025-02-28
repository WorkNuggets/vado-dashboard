import CardWithIconExample from "@/components/cards/card-with-icon/CardWithIconExample";
import CardWithImage from "@/components/cards/card-with-image/CardWithImage";
import CardWithLinkExample from "@/components/cards/card-with-link/CardWithLinkExample";
import HorizontalCardWithImage from "@/components/cards/horizontal-card/HorizontalCardWithImage";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "VADO Cards",
  description:
    "This is Cards Page",
};

export default function Cards() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Cards" />
      <div className="space-y-6 sm:space-y-5">
        <CardWithImage />
        <HorizontalCardWithImage />
        <CardWithLinkExample />
        <CardWithIconExample />
      </div>
    </div>
  );
}
