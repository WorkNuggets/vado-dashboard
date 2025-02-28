import React from "react";

export default function SidebarWidget() {
  return (
    <div
      className="
        mx-auto mb-20 xl:mb-10 rounded-2xl bg-gray-50 px-4 py-5 text-center dark:bg-white/[0.03]"
    >
      <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
        Elevate Your Real Estate Management
      </h3>
      <p className="mb-4 text-gray-500 text-theme-sm dark:text-gray-400">
        VADO: The premier platform for real estate professionals. Streamline your property
        portfolio with cutting-edge tools and insights.
      </p>
      <a
        href="https://vadoapp.com/pricing"
        target="_blank"
        rel="nofollow"
        className="flex items-center justify-center p-3 font-medium text-white rounded-lg bg-brand-500 text-theme-sm hover:bg-brand-600"
      >
        Explore Plans
      </a>
    </div>
  );
}
