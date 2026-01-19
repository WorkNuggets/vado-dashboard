# VADO Admin Dashboard - Implementation Plan

**Created:** 2026-01-17  
**Priority:** Post-Mobile App Launch  
**Status:** Planning Phase

## ⚠️ Important Context

**Timing:** This dashboard will be built AFTER the mobile app is launched to iOS and Android app stores  
**Database:** Shares the same Supabase database as the React Native mobile app  
**Authentication:** Uses the same OAuth providers (Google, Apple) as mobile app  
**Purpose:** Enable seller agents and brokerages to manage tour requests, properties, and communicate with mobile app users

---

## Executive Summary

This plan outlines the development of a Next.js admin dashboard for real estate agents and brokerages. The dashboard will allow agents to:

- Manage tour requests from mobile app users
- View and manage their property listings
- Communicate with potential buyers via messaging
- Integrate with existing CRM systems
- View analytics and insights

**Estimated Total Effort:** 40-60 hours  
**Recommended Architecture:** Separate repository with shared types package

---

## Repository Structure Decision

### ✅ **NX Monorepo** (Confirmed Approach)

**Rationale:**

1. **Shared Types:** Single source of truth for database types, API types, and entity types
2. **Shared Utilities:** Common functions, helpers, and utilities across all apps
3. **Consistent Tooling:** Unified linting, formatting, testing, and build processes
4. **Better DX:** Easier refactoring, better IDE support, unified dependency management
5. **Coordinated Releases:** Easier to version and release related changes together
6. **Framework Support:** NX supports Next.js, React Native/Expo, and Astro

**Monorepo Structure:**

```
vado-monorepo/            (NX monorepo at https://github.com/WorkNuggets/vado-monorepo)
├── apps/
│   ├── mobile/          (React Native/Expo - migrated from vado-react-native)
│   ├── dashboard/       (Next.js - migrated from vado-dashboard)
│   └── site/            (Astro - migrated from vado-site)
├── libs/
│   ├── shared-types/     (Database types, API types, entity types)
│   ├── shared-utils/     (Common utilities, helpers, constants)
│   └── shared-ui/        (Shared UI components - if any)
├── tools/                (NX generators, scripts)
├── nx.json
├── package.json
└── pnpm-workspace.yaml
```

**Framework Support Confirmed:**

- ✅ **Next.js:** `@nx/next` - Official NX plugin
- ✅ **React Native/Expo:** `@nx/expo` - Official NX plugin (Expo SDK 52+)
- ✅ **Astro:** `@nxtensions/astro` - Community plugin, stable

**Migration Plan:** See `MONOREPO_MIGRATION_PLAN.md` for detailed migration steps.

**Note:** Monorepo migration will happen AFTER mobile app launch, then admin dashboard development will proceed within the monorepo.

---

## Phase 1: Project Setup & Foundation

### 1.1 Next.js Project Initialization

**Status:** 🔴 Not started  
**Priority:** High  
**Estimated:** 2-3 hours

**Action Items:**

1. ✅ Create new Next.js 14+ project with TypeScript
2. ✅ Set up Tailwind CSS (matching TailAdmin design system)
3. ✅ Configure ESLint and Prettier (match mobile app config)
4. ✅ Set up path aliases (`@/` for `src/` or `app/`)
5. ✅ Configure environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server-side only)
   - OAuth credentials (Google, Apple)
6. ✅ Set up Supabase client (server and client components)
7. ✅ Initialize git repository
8. ✅ Set up basic folder structure

**Folder Structure:**

```
vado-admin-dashboard/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── callback/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── properties/
│   │   ├── tour-requests/
│   │   ├── messages/
│   │   └── settings/
│   └── layout.tsx
├── components/
│   ├── ui/          (TailAdmin components)
│   ├── dashboard/
│   ├── properties/
│   └── tour-requests/
├── lib/
│   ├── supabase/
│   ├── api/
│   └── utils/
├── types/
│   └── database.ts  (Shared from mobile app)
└── public/
```

**Acceptance Criteria:**

- [ ] Next.js project created and running
- [ ] Tailwind CSS configured
- [ ] Supabase client initialized
- [ ] Environment variables configured
- [ ] Basic folder structure in place

---

### 1.2 Shared Types Library (Already in Monorepo)

**Status:** 🟡 Will be created during monorepo migration  
**Priority:** High  
**Estimated:** Already done in monorepo migration

**Note:** The shared types library (`libs/shared-types`) will be created during the monorepo migration phase (see `MONOREPO_MIGRATION_PLAN.md` Phase 6.1). This phase assumes it already exists.

**Action Items:**

1. ✅ Verify `libs/shared-types` exists in monorepo
2. ✅ Import shared types in dashboard:
   ```typescript
   import { Property, TourRequest, AgentProfile } from "@vado/shared-types"
   ```
3. ✅ Verify type generation script works (should be set up during migration)
4. ✅ Test types work in dashboard
5. ✅ Add any dashboard-specific types to shared library if needed

**Library Location:**

```
libs/shared-types/
├── src/
│   ├── database.types.ts
│   ├── api.types.ts
│   ├── entities/
│   └── index.ts
└── project.json
```

**Acceptance Criteria:**

- [ ] Shared types library exists (from monorepo migration)
- [ ] Dashboard can import shared types
- [ ] Types are up-to-date
- [ ] Type generation works

---

### 1.3 Authentication Setup

**Status:** 🔴 Not started  
**Priority:** High  
**Estimated:** 3-4 hours

**Action Items:**

1. ✅ Set up Supabase Auth for Next.js (server components + client)
2. ✅ Configure OAuth providers (Google, Apple) - same as mobile app
3. ✅ Create authentication middleware:
   - Protect dashboard routes
   - Verify user is agent (`profiles.is_agent = true`)
   - Redirect non-agents to appropriate page
4. ✅ Create login page with OAuth buttons
5. ✅ Create OAuth callback handler
6. ✅ Set up session management
7. ✅ Create auth context/provider for client components
8. ✅ Test authentication flow

**Auth Flow:**

```
User clicks "Sign in with Google/Apple"
  → Redirects to OAuth provider
  → Callback to /auth/callback
  → Verify user has agent profile
  → Create session
  → Redirect to dashboard
```

**Acceptance Criteria:**

- [ ] OAuth login works (Google, Apple)
- [ ] Agent verification works
- [ ] Protected routes work
- [ ] Session management works
- [ ] Non-agents are blocked appropriately

---

## Phase 2: Dashboard Core Features

### 2.1 Dashboard Overview Page

**Status:** 🔴 Not started  
**Priority:** High  
**Estimated:** 4-5 hours

**Action Items:**

1. ✅ Design dashboard layout (using TailAdmin components)
2. ✅ Create sidebar navigation
3. ✅ Create header with user profile
4. ✅ Build dashboard overview with key metrics:
   - Total properties listed
   - Active tour requests
   - Pending approvals
   - Unread messages
   - Recent activity
5. ✅ Add charts/graphs for analytics:
   - Tour requests over time
   - Property views
   - Conversion metrics
6. ✅ Create responsive layout
7. ✅ Add loading states
8. ✅ Add error handling

**Dashboard Metrics:**

- Properties: Total, Active, Pending
- Tour Requests: Total, Pending Approval, Scheduled, Completed
- Messages: Unread count, Recent conversations
- Analytics: Views, Requests, Conversions

**Acceptance Criteria:**

- [ ] Dashboard displays key metrics
- [ ] Charts/graphs render correctly
- [ ] Responsive design works
- [ ] Loading states implemented
- [ ] Matches TailAdmin design system

---

### 2.2 Properties Management

**Status:** 🔴 Not started  
**Priority:** High  
**Estimated:** 6-8 hours

**Action Items:**

1. ✅ Create properties list page:
   - Table/grid view of agent's properties
   - Search and filter functionality
   - Sort by various fields
   - Pagination
2. ✅ Create property detail page:
   - View all property information
   - Edit property details
   - View associated tour requests
   - View property analytics
3. ✅ Implement property CRUD operations:
   - Create new property
   - Update property details
   - Delete property (with confirmation)
   - Bulk operations
4. ✅ Add property status management:
   - Active, Pending, Sold, Off-market
5. ✅ Integrate with Realtor API:
   - Import properties from Realtor API
   - Sync property data
   - Handle API rate limits
6. ✅ Add property photos management:
   - Upload photos
   - Reorder photos
   - Delete photos
   - Set primary photo
7. ✅ Create property form components:
   - Address, price, beds, baths, etc.
   - Rich text editor for description
   - Photo upload component

**Property Fields:**

- Basic: Address, City, State, ZIP, Price, Beds, Baths, Square Feet
- Details: Description, Features, Amenities, Year Built, Lot Size
- Media: Photos, Virtual Tour URL
- Status: Listing Status, Availability
- Agent: Assigned Agent, Brokerage

**Acceptance Criteria:**

- [ ] Properties list displays correctly
- [ ] Property CRUD operations work
- [ ] Realtor API integration works
- [ ] Photo management works
- [ ] Search/filter/sort works

---

### 2.3 Tour Request Management

**Status:** 🔴 Not started  
**Priority:** Critical  
**Estimated:** 8-10 hours

**Action Items:**

1. ✅ Create tour requests list page:
   - Table view with all requests
   - Filter by status (pending, approved, rejected, scheduled, completed)
   - Filter by property
   - Sort by date, property, status
   - Search by user name/email
2. ✅ Create tour request detail page:
   - View full request details
   - View requester information
   - View property details
   - Approve/Reject actions
   - Schedule tour date/time
   - View tour history
3. ✅ Implement approval workflow:
   - Approve request → Send notification to user
   - Reject request → Send notification with reason
   - Schedule tour → Set date/time, send confirmation
   - Cancel tour → Notify user
4. ✅ Add bulk actions:
   - Bulk approve/reject
   - Export requests to CSV
5. ✅ Create tour calendar view:
   - Calendar showing scheduled tours
   - Drag-and-drop rescheduling
   - Color coding by status
6. ✅ Add tour request analytics:
   - Requests by property
   - Approval rate
   - Average time to approval
   - Conversion metrics
7. ✅ Integrate with mobile app:
   - Real-time updates when requests change
   - Push notifications (if implemented)

**Tour Request Statuses:**

- `pending` - Awaiting agent approval
- `approved` - Approved, awaiting scheduling
- `scheduled` - Date/time set
- `in_progress` - Tour currently happening
- `completed` - Tour finished
- `cancelled` - Cancelled by agent or user
- `rejected` - Rejected by agent

**Acceptance Criteria:**

- [ ] Tour requests list displays correctly
- [ ] Approval workflow works end-to-end
- [ ] Notifications sent to mobile app users
- [ ] Calendar view works
- [ ] Bulk actions work
- [ ] Analytics display correctly

---

### 2.4 Messaging System

**Status:** 🔴 Not started  
**Priority:** High  
**Estimated:** 6-8 hours

**Action Items:**

1. ✅ Integrate with Stream Chat (same as mobile app):
   - Use same Stream Chat instance
   - Connect agent users to Stream Chat
   - Create channels for agent-user conversations
2. ✅ Create messages list page:
   - List of conversations
   - Unread message indicators
   - Last message preview
   - Sort by unread, recent activity
3. ✅ Create chat interface:
   - Message thread view
   - Send messages
   - View message history
   - Typing indicators
   - Read receipts
   - File attachments (if needed)
4. ✅ Link messages to tour requests:
   - Show related tour request in chat
   - Quick actions (approve, schedule)
5. ✅ Add message filtering:
   - Filter by property
   - Filter by tour request
   - Filter by unread
6. ✅ Implement real-time updates:
   - New messages appear instantly
   - Unread counts update
   - Typing indicators work

**Message Features:**

- Real-time messaging via Stream Chat
- Message history
- Unread indicators
- Link to tour requests/properties
- Quick actions from chat

**Acceptance Criteria:**

- [ ] Stream Chat integration works
- [ ] Messages send/receive correctly
- [ ] Real-time updates work
- [ ] Unread indicators work
- [ ] Chat UI is polished

---

## Phase 3: CRM Integration

### 3.1 CRM Integration Architecture

**Status:** 🔴 Not started  
**Priority:** Medium  
**Estimated:** 4-6 hours

**Action Items:**

1. ✅ Research common real estate CRM APIs:
   - MLS systems
   - Popular CRMs (Chime, Follow Up Boss, etc.)
   - Identify integration patterns
2. ✅ Design integration architecture:
   - OAuth flow for CRM authentication
   - Webhook endpoints for CRM updates
   - Sync strategy (one-way vs two-way)
   - Conflict resolution
3. ✅ Create CRM integration base classes:
   - Abstract CRM provider interface
   - Common data transformation utilities
   - Error handling patterns
4. ✅ Set up webhook infrastructure:
   - Webhook endpoints
   - Signature verification
   - Queue system for processing
5. ✅ Create admin UI for CRM connections:
   - Connect/disconnect CRM
   - View sync status
   - Manual sync trigger
   - Sync logs

**Common CRM Integrations:**

- MLS systems (varies by region)
- Chime CRM
- Follow Up Boss
- LionDesk
- RealtyJuggler
- Custom APIs

**Acceptance Criteria:**

- [ ] Integration architecture designed
- [ ] Base classes created
- [ ] Webhook infrastructure ready
- [ ] Admin UI for connections works

---

### 3.2 Property Import from CRM

**Status:** 🔴 Not started  
**Priority:** Medium  
**Estimated:** 6-8 hours

**Action Items:**

1. ✅ Implement CRM property import:
   - Fetch properties from CRM API
   - Map CRM fields to VADO schema
   - Handle field differences
   - Create/update properties in Supabase
2. ✅ Add property mapping UI:
   - Map CRM fields to VADO fields
   - Save mapping configuration
   - Preview mapped data
3. ✅ Implement sync scheduling:
   - Automatic sync (daily, hourly)
   - Manual sync trigger
   - Sync status tracking
4. ✅ Handle conflicts:
   - Detect conflicts (property updated in both systems)
   - Conflict resolution UI
   - Choose which data to keep
5. ✅ Add sync logs:
   - View sync history
   - See what changed
   - Error logs
6. ✅ Test with sample CRM data

**Property Mapping:**

- CRM Address → VADO Address
- CRM Price → VADO Price
- CRM Beds/Baths → VADO Beds/Baths
- CRM Photos → VADO Photos
- CRM Status → VADO Status

**Acceptance Criteria:**

- [ ] Properties import from CRM
- [ ] Field mapping works
- [ ] Sync scheduling works
- [ ] Conflicts handled gracefully
- [ ] Sync logs visible

---

### 3.3 Tour Request Export to CRM

**Status:** 🔴 Not started  
**Priority:** Low  
**Estimated:** 4-6 hours

**Action Items:**

1. ✅ Implement tour request export:
   - Export approved tour requests to CRM
   - Map VADO data to CRM format
   - Create leads/contacts in CRM
   - Link to properties in CRM
2. ✅ Add export configuration:
   - Choose which requests to export
   - Map fields to CRM
   - Schedule automatic exports
3. ✅ Handle export errors:
   - Retry logic
   - Error notifications
   - Export logs
4. ✅ Test export functionality

**Acceptance Criteria:**

- [ ] Tour requests export to CRM
- [ ] Field mapping works
- [ ] Errors handled gracefully
- [ ] Export logs visible

---

## Phase 4: Analytics & Reporting

### 4.1 Analytics Dashboard

**Status:** 🔴 Not started  
**Priority:** Medium  
**Estimated:** 5-7 hours

**Action Items:**

1. ✅ Create analytics page:
   - Key performance indicators
   - Charts and graphs
   - Date range filters
2. ✅ Implement metrics:
   - Property views
   - Tour requests
   - Approval rate
   - Conversion rate (request → scheduled → completed)
   - Average response time
   - Popular properties
   - User engagement
3. ✅ Add data visualization:
   - Line charts (trends over time)
   - Bar charts (comparisons)
   - Pie charts (distributions)
   - Tables (detailed data)
4. ✅ Create export functionality:
   - Export reports to PDF
   - Export data to CSV
   - Schedule email reports
5. ✅ Add filtering:
   - By date range
   - By property
   - By agent (if brokerage view)
   - By status

**Key Metrics:**

- Total Properties Listed
- Total Tour Requests
- Approval Rate
- Conversion Rate
- Average Response Time
- Most Popular Properties
- User Engagement Score

**Acceptance Criteria:**

- [ ] Analytics page displays metrics
- [ ] Charts render correctly
- [ ] Filters work
- [ ] Export functionality works

---

### 4.2 Reporting Features

**Status:** 🔴 Not started  
**Priority:** Low  
**Estimated:** 3-4 hours

**Action Items:**

1. ✅ Create report templates:
   - Monthly summary
   - Property performance
   - Tour request analysis
   - User engagement report
2. ✅ Implement report generation:
   - Generate reports on demand
   - Schedule automatic reports
   - Email reports to agents
3. ✅ Add report customization:
   - Choose metrics to include
   - Custom date ranges
   - Format options
4. ✅ Create report history:
   - View past reports
   - Download reports
   - Share reports

**Acceptance Criteria:**

- [ ] Reports generate correctly
- [ ] Scheduling works
- [ ] Email delivery works
- [ ] Report history accessible

---

## Phase 5: User Management & Settings

### 5.1 Agent Profile Management

**Status:** 🔴 Not started  
**Priority:** Medium  
**Estimated:** 3-4 hours

**Action Items:**

1. ✅ Create agent profile page:
   - View agent information
   - Edit profile details
   - Update brokerage information
   - Manage license information
2. ✅ Add profile photo upload
3. ✅ Add contact information management
4. ✅ Add service areas management
5. ✅ Add specializations management
6. ✅ Link to agent profile in mobile app

**Acceptance Criteria:**

- [ ] Profile page displays correctly
- [ ] Profile editing works
- [ ] Photo upload works
- [ ] Changes sync to mobile app

---

### 5.2 Brokerage Management (If Applicable)

**Status:** 🔴 Not started  
**Priority:** Low  
**Estimated:** 4-6 hours

**Action Items:**

1. ✅ Create brokerage model:
   - Brokerage table in database
   - Agent-brokerage relationships
   - Brokerage admin roles
2. ✅ Create brokerage dashboard:
   - View all brokerage agents
   - View all brokerage properties
   - View brokerage analytics
3. ✅ Add brokerage settings:
   - Brokerage information
   - Branding (logo, colors)
   - Default settings for agents
4. ✅ Implement brokerage admin features:
   - Add/remove agents
   - Assign properties to agents
   - View brokerage-wide analytics

**Acceptance Criteria:**

- [ ] Brokerage model works
- [ ] Brokerage dashboard displays correctly
- [ ] Brokerage admin features work

---

### 5.3 Settings & Preferences

**Status:** 🔴 Not started  
**Priority:** Medium  
**Estimated:** 2-3 hours

**Action Items:**

1. ✅ Create settings page:
   - Notification preferences
   - Email preferences
   - Dashboard preferences
   - CRM integration settings
2. ✅ Add notification settings:
   - Email notifications for tour requests
   - Push notifications (if implemented)
   - Notification frequency
3. ✅ Add email preferences:
   - Email digest frequency
   - Report delivery preferences
4. ✅ Add dashboard preferences:
   - Default view
   - Widget configuration
   - Theme preferences

**Acceptance Criteria:**

- [ ] Settings page works
- [ ] Preferences save correctly
- [ ] Notifications work as configured

---

## Phase 6: Polish & Optimization

### 6.1 UI/UX Polish

**Status:** 🔴 Not started  
**Priority:** Medium  
**Estimated:** 4-6 hours

**Action Items:**

1. ✅ Ensure consistent TailAdmin design system usage
2. ✅ Add loading states everywhere
3. ✅ Add error states and handling
4. ✅ Improve responsive design
5. ✅ Add animations and transitions
6. ✅ Improve accessibility (ARIA labels, keyboard navigation)
7. ✅ Add tooltips and help text
8. ✅ Optimize images and assets

**Acceptance Criteria:**

- [ ] UI is polished and professional
- [ ] Loading/error states everywhere
- [ ] Responsive design works
- [ ] Accessibility improved

---

### 6.2 Performance Optimization

**Status:** 🔴 Not started  
**Priority:** Medium  
**Estimated:** 3-4 hours

**Action Items:**

1. ✅ Optimize database queries:
   - Add indexes where needed
   - Optimize RLS policies
   - Use pagination
   - Cache frequently accessed data
2. ✅ Optimize Next.js:
   - Use server components where possible
   - Implement proper caching
   - Optimize images
   - Code splitting
3. ✅ Add monitoring:
   - Error tracking (Sentry)
   - Performance monitoring
   - Analytics
4. ✅ Test performance:
   - Load testing
   - Identify bottlenecks
   - Optimize slow queries

**Acceptance Criteria:**

- [ ] Page load times < 2 seconds
- [ ] Database queries optimized
- [ ] Monitoring in place
- [ ] Performance acceptable

---

### 6.3 Testing & QA

**Status:** 🔴 Not started  
**Priority:** High  
**Estimated:** 6-8 hours

**Action Items:**

1. ✅ Write unit tests for utilities
2. ✅ Write integration tests for API routes
3. ✅ Write E2E tests for critical flows:
   - Login flow
   - Tour request approval
   - Property management
   - Messaging
4. ✅ Manual testing:
   - Test all features
   - Test on different browsers
   - Test responsive design
   - Test error scenarios
5. ✅ Fix bugs found during testing
6. ✅ Get feedback from beta users (agents)

**Acceptance Criteria:**

- [ ] Unit tests written
- [ ] Integration tests written
- [ ] E2E tests written
- [ ] All critical bugs fixed
- [ ] Beta feedback incorporated

---

## Phase 7: Deployment & Launch

### 7.1 Production Setup

**Status:** 🔴 Not started  
**Priority:** High  
**Estimated:** 3-4 hours

**Action Items:**

1. ✅ Set up production environment:
   - Vercel deployment (recommended for Next.js)
   - Environment variables
   - Domain configuration
   - SSL certificates
2. ✅ Configure Supabase:
   - Production database
   - Production auth settings
   - RLS policies verified
3. ✅ Set up monitoring:
   - Error tracking
   - Performance monitoring
   - Uptime monitoring
4. ✅ Set up CI/CD:
   - GitHub Actions
   - Automated deployments
   - Testing in CI
5. ✅ Create deployment documentation

**Acceptance Criteria:**

- [ ] Production environment configured
- [ ] Monitoring in place
- [ ] CI/CD working
- [ ] Documentation complete

---

### 7.2 Launch Preparation

**Status:** 🔴 Not started  
**Priority:** High  
**Estimated:** 2-3 hours

**Action Items:**

1. ✅ Create user documentation:
   - Getting started guide
   - Feature documentation
   - FAQ
   - Video tutorials (optional)
2. ✅ Prepare marketing materials:
   - Landing page
   - Feature highlights
   - Screenshots
3. ✅ Set up support:
   - Support email
   - Help center
   - Contact form
4. ✅ Create onboarding flow:
   - Welcome email
   - Setup wizard
   - Tutorial tooltips
5. ✅ Plan launch:
   - Beta testing with select agents
   - Gather feedback
   - Iterate
   - Public launch

**Acceptance Criteria:**

- [ ] Documentation complete
- [ ] Marketing materials ready
- [ ] Support channels set up
- [ ] Onboarding flow works
- [ ] Launch plan ready

---

## Implementation Priority

### Critical Path (Must Complete):

1. ✅ Phase 1: Project Setup & Foundation
2. ✅ Phase 2.1: Dashboard Overview
3. ✅ Phase 2.3: Tour Request Management (Core Feature)
4. ✅ Phase 2.2: Properties Management
5. ✅ Phase 2.4: Messaging System
6. ✅ Phase 6.3: Testing & QA
7. ✅ Phase 7: Deployment & Launch

### High Priority (Should Complete):

1. ✅ Phase 3: CRM Integration (at least one CRM)
2. ✅ Phase 4.1: Analytics Dashboard
3. ✅ Phase 5: User Management
4. ✅ Phase 6.1-6.2: Polish & Optimization

### Nice to Have:

1. ⏸️ Phase 3.3: Tour Request Export to CRM
2. ⏸️ Phase 4.2: Reporting Features
3. ⏸️ Phase 5.2: Brokerage Management
4. ⏸️ Multiple CRM integrations

---

## Success Criteria

Before launch, all of the following must be true:

### Functionality:

- [ ] Agents can log in with OAuth (Google, Apple)
- [ ] Dashboard displays key metrics
- [ ] Agents can view and manage properties
- [ ] Agents can approve/reject tour requests
- [ ] Agents can schedule tours
- [ ] Agents can message mobile app users
- [ ] Properties can be imported from CRM (at least one CRM)
- [ ] Analytics dashboard works

### Code Quality:

- [ ] TypeScript strict mode enabled
- [ ] ESLint passes
- [ ] Tests written and passing
- [ ] Code reviewed

### Performance:

- [ ] Page load times < 2 seconds
- [ ] Database queries optimized
- [ ] No memory leaks
- [ ] Responsive design works

### User Experience:

- [ ] UI is polished and professional
- [ ] Loading states everywhere
- [ ] Error handling works
- [ ] Onboarding flow works
- [ ] Documentation complete

---

## Estimated Total Effort

- **Phase 1 (Setup):** 6-9 hours
- **Phase 2 (Core Features):** 24-31 hours
- **Phase 3 (CRM Integration):** 14-20 hours
- **Phase 4 (Analytics):** 8-11 hours
- **Phase 5 (User Management):** 9-13 hours
- **Phase 6 (Polish):** 13-18 hours
- **Phase 7 (Deployment):** 5-7 hours
- **Total:** 79-109 hours

**Realistic Timeline:** 3-4 months with part-time development, 1-2 months full-time

---

## Notes

- **Start After Mobile Launch:** Do NOT begin until mobile app is in app stores
- **Shared Database:** Be careful with schema changes - coordinate with mobile app team
- **RLS Policies:** Ensure RLS policies support admin dashboard access patterns
- **OAuth:** Use same OAuth setup as mobile app for consistency
- **Type Safety:** Use shared types package to keep mobile and admin in sync
- **Testing:** Test thoroughly with real agent users before launch
- **Iterative Development:** Launch MVP first, add features based on feedback

---

## Next Steps (After Mobile App Launch)

1. ⏸️ Review and approve this plan
2. ⏸️ Complete mobile app launch (REMAINING_WORK_PLAN.md Phase 7)
3. ⏸️ Migrate to NX monorepo (REMAINING_WORK_PLAN.md Phase 8 / MONOREPO_MIGRATION_PLAN.md)
4. ⏸️ Verify dashboard app migrated to monorepo (Phase 1.1)
5. ⏸️ Verify shared types library exists (Phase 1.2)
6. ⏸️ Implement authentication (Phase 1.3)
7. ⏸️ Build dashboard overview (Phase 2.1)
8. ⏸️ Implement tour request management (Phase 2.3)
9. ⏸️ Continue through phases systematically

**Remember:**

- This is a post-launch project. Focus on mobile app first.
- Monorepo migration must happen BEFORE admin dashboard development.
- Admin dashboard will be developed within the monorepo structure.
