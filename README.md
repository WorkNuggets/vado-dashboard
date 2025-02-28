TailAdmin Pro - Next.js (v2.0) - VADO Real Estate Dashboard
======================================================

[TailAdmin](https://tailadmin.com) is a modern, responsive, and customizable admin dashboard template built using Tailwind CSS and Next.js. This project aims to build a **Real Estate Dashboard Admin** leveraging TailAdmin's powerful framework to manage property listings, agents, transactions, analytics, and more.

Project Overview
----------------

This dashboard will serve as a comprehensive real estate management platform, featuring:

-   **Property Management**: Add, edit, and manage property listings with images, descriptions, and pricing details.

-   **Agent Management**: Keep track of agents, their transactions, and performance analytics.

-   **User & Role Management**: Implement authentication and role-based access control for admins, agents, and users.

-   **Analytics & Reporting**: Utilize data visualization for insights into sales, active listings, and market trends.

-   **Integration with APIs**: Connect with real estate APIs for MLS data, geolocation services, and mortgage calculations.

-   **Responsive & Customizable UI**: Built with Tailwind CSS for easy customization and modern UI components.

Quick Links
-----------

-   [✨ Visit Website](https://tailadmin.com)

-   [📄 Documentation](https://tailadmin.com/docs)

-   [⬇️ Download](https://tailadmin.com/download)

-   [🌐 Live Site](https://nextjs-demo.tailadmin.com)

Tech Stack
----------

This project is built using the following technologies:

-   **Next.js 15** - Framework for React applications with server-side rendering and API routes.

-   **Tailwind CSS v4** - Utility-first CSS framework for styling and responsive design.

-   **TypeScript** - Ensuring type safety and better maintainability.

-   **ApexCharts** - For visualizing real estate data and analytics.

-   **NextAuth.js** - Secure authentication and session management.

-   **Prisma ORM** - Database interaction and schema management.

-   **PostgreSQL** - Scalable and reliable database for real estate data storage.

Installation
------------

### Prerequisites

To get started with this project, ensure you have the following installed:

-   Node.js 18.x or later (recommended: Node.js 20.x or later)

-   PostgreSQL for database management

### Getting Started

1.  Install dependencies:

    ```
    npm install --legacy-peer-deps
    # or
    yarn install
    ```

    > The `--legacy-peer-deps` flag resolves peer dependency issues with React 19.

2.  Set up environment variables by creating a `.env.local` file:

    ```
    DATABASE_URL="postgresql://user:password@localhost:5432/real_estate_db"
    NEXTAUTH_SECRET="your-secret-key"
    NEXTAUTH_URL="http://localhost:3000"
    ```

3.  Run database migrations:

    ```
    npx prisma migrate dev --name init
    ```

4.  Start the development server:

    ```
    npm run dev
    # or
    yarn dev
    ```

Changelog
---------

### Version 2.0.1 - [February 27, 2025]

#### Update Overview

-   Upgraded to Tailwind CSS v4 for improved performance and efficiency.

-   Optimized Next.js components for faster rendering.

-   Implemented authentication and role-based access for agents and admins.

-   Added property listing CRUD operations and API routes.

-   Integrated ApexCharts for real estate analytics.

#### Next Steps

-   Run `npm install` or `yarn install` to update dependencies.

-   Set up environment variables and database connection.

-   Test authentication and property management features.

-   Check out the latest Tailwind CSS v4 [Migration Guide](https://tailwindcss.com/docs/upgrade-guide).

### v2.0.0 (February 2025)

#### Major Improvements

-   Initial setup for the real estate admin dashboard.

-   Full redesign using Next.js 15 App Router and React Server Components.

-   Responsive and accessible UI components optimized for real estate management.

-   User authentication using NextAuth.js.

-   Property and agent management modules implemented.

-   Analytics dashboard using ApexCharts.

[Read more](https://tailadmin.com/docs/update-logs/nextjs) on this release.

License
-------

Refer to our [LICENSE](https://tailadmin.com/license) page for more information.