import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React from "react";

import { Metadata } from "next";
import SpinnerFour from "./SpinnerFour";
import SpinnerOne from "./SpinnerOne";
import SpinnerThree from "./SpinnerThree";
import SpinnerTwo from "./SpinnerTwo";

export const metadata: Metadata = {
  title: "VADO Spinners",
  description:
    "This is Spinners Page",
};

export default function Spinners() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Spinners" />
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="Spinner 1">
          <SpinnerOne />
        </ComponentCard>{" "}
        <ComponentCard title="Spinner 2">
          <SpinnerTwo />
        </ComponentCard>{" "}
        <ComponentCard title="Spinner 3">
          <SpinnerThree />
        </ComponentCard>{" "}
        <ComponentCard title="Spinner 4">
          <SpinnerFour />
        </ComponentCard>
      </div>
    </div>
  );
}
