import ComponentCard from "@/components/common/ComponentCard";
import FaqsOneExample from "@/components/faqs/FaqOneExample";
import FaqsThree from "@/components/faqs/FaqsThree";
import FaqsTwo from "@/components/faqs/FaqsTwo";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "VADO Faq's",
  description: "This is Faq's Page",
};

export default function Faq() {
  return (
    <div>
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="Faq’s 1">
          <FaqsOneExample />
        </ComponentCard>
        <ComponentCard title="Faq’s 2">
          <FaqsTwo />
        </ComponentCard>
        <ComponentCard title="Faq’s 3">
          <FaqsThree />
        </ComponentCard>
      </div>
    </div>
  );
}
