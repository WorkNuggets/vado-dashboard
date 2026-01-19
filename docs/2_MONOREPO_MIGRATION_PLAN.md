# VADO Monorepo Migration Plan

**Created:** 2026-01-17  
**Priority:** High - Post Mobile App Launch  
**Status:** Planning Phase

## ⚠️ Important Context

**Timing:** This migration will happen AFTER the mobile app is launched to iOS and Android app stores  
**Goal:** Consolidate three separate repositories into one NX monorepo for better code sharing, type safety, and development workflow  
**Repositories to Migrate:**

- `vado-react-native` - React Native mobile app (Expo)
- `vado-dashboard` - Next.js admin dashboard
- `vado-site` - Astro landing page

**Target Repository:** `vado-monorepo` at https://github.com/WorkNuggets/vado-monorepo

---

## Executive Summary

This plan outlines the migration of three separate repositories into a single NX monorepo. The monorepo will enable:

- **Shared Types:** Single source of truth for database types, API types, and entity types
- **Shared Utilities:** Common functions, helpers, and utilities across all apps
- **Consistent Tooling:** Unified linting, formatting, testing, and build processes
- **Better DX:** Easier refactoring, better IDE support, unified dependency management
- **Coordinated Releases:** Easier to version and release related changes together

**Estimated Total Effort:** 12-16 hours  
**Framework Support:** ✅ All frameworks supported by NX

---

## Framework Compatibility Verification

### ✅ NX Support Confirmed

| Framework               | NX Plugin           | Status             | Notes                                       |
| ----------------------- | ------------------- | ------------------ | ------------------------------------------- |
| **Next.js**             | `@nx/next`          | ✅ Fully Supported | Official NX plugin, excellent support       |
| **React Native (Expo)** | `@nx/expo`          | ✅ Fully Supported | Official NX plugin, works with Expo SDK 52+ |
| **Astro**               | `@nxtensions/astro` | ✅ Supported       | Community plugin, stable                    |

### Version Compatibility

**Recommended Versions:**

- **NX:** Latest (v20+)
- **Next.js:** 15.x or 16.x
- **Expo SDK:** 52+ (supports React 19)
- **Astro:** 4.x
- **React:** 19.x (shared across all apps)
- **TypeScript:** 5.3+

**Note:** React version alignment is critical - all apps must use the same React version to avoid conflicts.

---

## Phase 1: Pre-Migration Preparation

### 1.1 Repository Analysis

**Status:** 🔴 Not started  
**Priority:** High  
**Estimated:** 2-3 hours

**Action Items:**

1. ✅ Clone all three repositories locally
2. ✅ Analyze each repository structure:
   - Dependencies (package.json)
   - Build configurations
   - Environment variables
   - Git history (decide on history migration)
3. ✅ Identify shared code:
   - Type definitions
   - Utility functions
   - Constants
   - API clients
4. ✅ Document current structure of each repo
5. ✅ Identify potential conflicts:
   - Dependency version conflicts
   - Configuration conflicts
   - Naming conflicts
6. ✅ Create migration checklist

**Repositories to Analyze:**

- https://github.com/WorkNuggets/vado-react-native
- https://github.com/WorkNuggets/vado-dashboard
- https://github.com/WorkNuggets/vado-site

**Acceptance Criteria:**

- [ ] All repos analyzed
- [ ] Shared code identified
- [ ] Conflicts documented
- [ ] Migration checklist created

---

### 1.2 Dependency Alignment

**Status:** 🔴 Not started  
**Priority:** High  
**Estimated:** 2-3 hours

**Action Items:**

1. ✅ Compare dependency versions across repos:
   - React version (must match)
   - TypeScript version
   - Common dependencies (date-fns, etc.)
2. ✅ Resolve version conflicts:
   - Choose highest compatible version
   - Document decisions
   - Update packages in source repos if needed
3. ✅ Identify shared dependencies:
   - Supabase client
   - Date utilities
   - Validation libraries
   - UI libraries (if any)
4. ✅ Plan dependency structure:
   - Root-level dependencies (shared)
   - App-specific dependencies
   - Library dependencies

**Critical Dependencies:**

- React (must be same version)
- TypeScript
- Supabase client
- Date utilities
- ESLint/Prettier

**Acceptance Criteria:**

- [ ] Dependency versions aligned
- [ ] Conflicts resolved
- [ ] Shared dependencies identified
- [ ] Dependency structure planned

---

## Phase 2: NX Monorepo Setup

### 2.1 Create NX Workspace

**Status:** 🔴 Not started  
**Priority:** High  
**Estimated:** 1-2 hours

**Action Items:**

1. ✅ Create new repository: `vado-monorepo` at https://github.com/WorkNuggets/vado-monorepo
2. ✅ Initialize NX workspace:
   ```bash
   npx create-nx-workspace@latest vado-monorepo --preset=apps --packageManager=pnpm
   ```
3. ✅ Choose workspace structure:
   - Integrated (recommended for better DX)
   - Standalone (if preferred)
4. ✅ Configure package manager (pnpm recommended)
5. ✅ Set up basic workspace structure
6. ✅ Configure Git:
   - Initialize git
   - Set up .gitignore
   - Create initial commit

**Workspace Structure:**

```
vado-monorepo/
├── apps/
│   ├── mobile/          (React Native/Expo)
│   ├── dashboard/       (Next.js)
│   └── site/            (Astro)
├── libs/
│   ├── shared-types/    (Database types, API types)
│   ├── shared-utils/    (Common utilities)
│   └── shared-ui/       (Shared UI components - if any)
├── tools/               (NX generators, scripts)
├── nx.json
├── package.json
└── pnpm-workspace.yaml
```

**Acceptance Criteria:**

- [ ] NX workspace created
- [ ] Repository initialized
- [ ] Basic structure in place
- [ ] Git configured

---

### 2.2 Install NX Plugins

**Status:** 🔴 Not started  
**Priority:** High  
**Estimated:** 1 hour

**Action Items:**

1. ✅ Install Next.js plugin:
   ```bash
   pnpm add -D @nx/next
   ```
2. ✅ Install Expo plugin:
   ```bash
   pnpm add -D @nx/expo
   ```
3. ✅ Install Astro plugin:
   ```bash
   pnpm add -D @nxtensions/astro
   ```
4. ✅ Install other useful plugins:
   - `@nx/eslint` - ESLint integration
   - `@nx/jest` - Jest testing
   - `@nx/typescript` - TypeScript support
5. ✅ Verify plugins installed correctly

**Acceptance Criteria:**

- [ ] All plugins installed
- [ ] Plugins configured in nx.json
- [ ] No installation errors

---

### 2.3 Configure Workspace

**Status:** 🔴 Not started  
**Priority:** High  
**Estimated:** 2-3 hours

**Action Items:**

1. ✅ Configure `nx.json`:
   - Set up task runners
   - Configure caching
   - Set up affected detection
   - Configure parallel execution
2. ✅ Set up `pnpm-workspace.yaml`:
   - Define workspace packages
   - Configure workspace dependencies
3. ✅ Configure TypeScript:
   - Root `tsconfig.json`
   - App-specific tsconfigs
   - Library tsconfigs
   - Path mappings
4. ✅ Configure ESLint:
   - Root ESLint config
   - Extend from mobile app config
   - App-specific overrides
5. ✅ Configure Prettier:
   - Root Prettier config
   - Match mobile app formatting
6. ✅ Set up path aliases:
   - `@vado/shared-types` → `libs/shared-types`
   - `@vado/shared-utils` → `libs/shared-utils`
   - App-specific aliases

**Configuration Files:**

- `nx.json` - NX workspace configuration
- `pnpm-workspace.yaml` - PNPM workspace config
- `tsconfig.base.json` - Base TypeScript config
- `.eslintrc.json` - ESLint configuration
- `.prettierrc` - Prettier configuration

**Acceptance Criteria:**

- [ ] All configs set up
- [ ] Path aliases working
- [ ] Linting/formatting works
- [ ] TypeScript compiles

---

## Phase 3: Migrate Mobile App (React Native/Expo)

### 3.1 Create Mobile App in Monorepo

**Status:** 🔴 Not started  
**Priority:** High  
**Estimated:** 2-3 hours

**Action Items:**

1. ✅ Generate Expo app using NX:
   ```bash
   nx generate @nx/expo:application mobile --directory=apps/mobile
   ```
2. ✅ Copy source code from `vado-react-native`:
   - Copy `src/` directory
   - Copy `assets/` directory
   - Copy configuration files (app.json, eas.json, etc.)
   - Copy scripts from package.json
3. ✅ Migrate dependencies:
   - Add dependencies to root or app package.json
   - Resolve version conflicts
   - Test installation
4. ✅ Update imports:
   - Fix relative imports
   - Update to use path aliases
   - Update shared code imports
5. ✅ Update configuration files:
   - `app.json` - Update paths if needed
   - `eas.json` - Verify paths
   - `metro.config.js` - Update for monorepo
   - `babel.config.js` - Update if needed
6. ✅ Test build:
   - Run `nx run mobile:build`
   - Verify no errors
   - Test on simulator/device

**Files to Migrate:**

- All source code (`src/`)
- Assets (`assets/`)
- Config files (`app.json`, `eas.json`, `metro.config.js`, etc.)
- Environment files (`.env.example`)

**Acceptance Criteria:**

- [ ] Mobile app created in monorepo
- [ ] All code migrated
- [ ] Dependencies installed
- [ ] Builds successfully
- [ ] Runs on simulator/device

---

### 3.2 Update Mobile App Configuration

**Status:** 🔴 Not started  
**Priority:** High  
**Estimated:** 1-2 hours

**Action Items:**

1. ✅ Update `project.json` for mobile app:
   - Configure targets (build, serve, test, lint)
   - Set up Expo-specific targets
   - Configure outputs
2. ✅ Update Metro config for monorepo:
   - Configure watchFolders
   - Update resolver for monorepo
   - Test Metro bundler
3. ✅ Update EAS build configuration:
   - Verify paths are correct
   - Test EAS build
4. ✅ Update environment variables:
   - Move to monorepo root or app-specific
   - Update references
5. ✅ Test all scripts:
   - `nx run mobile:start`
   - `nx run mobile:build`
   - `nx run mobile:lint`
   - `nx run mobile:test`

**Acceptance Criteria:**

- [ ] Configuration updated
- [ ] Metro works in monorepo
- [ ] EAS builds work
- [ ] All scripts work

---

## Phase 4: Migrate Admin Dashboard (Next.js)

### 4.1 Create Dashboard App in Monorepo

**Status:** 🔴 Not started  
**Priority:** High  
**Estimated:** 2-3 hours

**Action Items:**

1. ✅ Generate Next.js app using NX:
   ```bash
   nx generate @nx/next:application dashboard --directory=apps/dashboard
   ```
2. ✅ Copy source code from `vado-dashboard`:
   - Copy `app/` or `src/` directory
   - Copy `public/` directory
   - Copy configuration files
   - Copy Tailwind config
3. ✅ Migrate dependencies:
   - Add Next.js dependencies
   - Add TailAdmin dependencies
   - Resolve version conflicts
4. ✅ Update imports:
   - Fix relative imports
   - Update to use path aliases
   - Update shared code imports
5. ✅ Update configuration:
   - `next.config.ts` - Update for monorepo
   - `tailwind.config.ts` - Update paths
   - Environment variables
6. ✅ Test build:
   - Run `nx run dashboard:build`
   - Verify no errors
   - Test dev server

**Files to Migrate:**

- All source code (`app/` or `src/`)
- Public assets (`public/`)
- Config files (`next.config.ts`, `tailwind.config.ts`, etc.)

**Acceptance Criteria:**

- [ ] Dashboard app created
- [ ] All code migrated
- [ ] Dependencies installed
- [ ] Builds successfully
- [ ] Dev server works

---

### 4.2 Update Dashboard Configuration

**Status:** 🔴 Not started  
**Priority:** High  
**Estimated:** 1 hour

**Action Items:**

1. ✅ Update `project.json` for dashboard:
   - Configure Next.js targets
   - Set up build/serve/test targets
2. ✅ Update Next.js config:
   - Configure for monorepo
   - Update paths
   - Test build
3. ✅ Update Tailwind config:
   - Configure content paths
   - Test styling
4. ✅ Test all scripts:
   - `nx run dashboard:serve`
   - `nx run dashboard:build`
   - `nx run dashboard:lint`

**Acceptance Criteria:**

- [ ] Configuration updated
- [ ] Next.js works in monorepo
- [ ] Tailwind works
- [ ] All scripts work

---

## Phase 5: Migrate Landing Site (Astro)

### 5.1 Create Site App in Monorepo

**Status:** 🔴 Not started  
**Priority:** Medium  
**Estimated:** 1-2 hours

**Action Items:**

1. ✅ Generate Astro app using NX:
   ```bash
   nx generate @nxtensions/astro:application site --directory=apps/site
   ```
2. ✅ Copy source code from `vado-site`:
   - Copy `src/` directory
   - Copy `public/` directory
   - Copy configuration files
   - Copy Astro config
3. ✅ Migrate dependencies:
   - Add Astro dependencies
   - Resolve version conflicts
4. ✅ Update imports:
   - Fix relative imports
   - Update to use path aliases
5. ✅ Update configuration:
   - `astro.config.ts` - Update for monorepo
   - Environment variables
6. ✅ Test build:
   - Run `nx run site:build`
   - Verify no errors
   - Test dev server

**Acceptance Criteria:**

- [ ] Site app created
- [ ] All code migrated
- [ ] Dependencies installed
- [ ] Builds successfully
- [ ] Dev server works

---

### 5.2 Update Site Configuration

**Status:** 🔴 Not started  
**Priority:** Medium  
**Estimated:** 1 hour

**Action Items:**

1. ✅ Update `project.json` for site:
   - Configure Astro targets
   - Set up build/serve targets
2. ✅ Update Astro config:
   - Configure for monorepo
   - Update paths
   - Test build
3. ✅ Test all scripts:
   - `nx run site:serve`
   - `nx run site:build`
   - `nx run site:lint`

**Acceptance Criteria:**

- [ ] Configuration updated
- [ ] Astro works in monorepo
- [ ] All scripts work

---

## Phase 6: Create Shared Libraries

### 6.1 Shared Types Library

**Status:** 🔴 Not started  
**Priority:** High  
**Estimated:** 2-3 hours

**Action Items:**

1. ✅ Create shared types library:
   ```bash
   nx generate @nx/js:library shared-types --directory=libs/shared-types --importPath=@vado/shared-types
   ```
2. ✅ Extract database types:
   - Copy `supabase.types.ts` from mobile app
   - Set up type generation from Supabase
   - Create index exports
3. ✅ Extract API types:
   - Request/response types
   - Error types
   - Common types
4. ✅ Extract entity types:
   - Property, Tour, User, Agent types
   - Common interfaces
5. ✅ Set up type generation:
   - Script to generate from Supabase
   - Document generation process
6. ✅ Update all apps to use shared types:
   - Remove local type definitions
   - Import from `@vado/shared-types`
   - Verify types work

**Library Structure:**

```
libs/shared-types/
├── src/
│   ├── database.types.ts
│   ├── api.types.ts
│   ├── entities/
│   │   ├── property.ts
│   │   ├── tour.ts
│   │   ├── user.ts
│   │   └── agent.ts
│   └── index.ts
├── project.json
└── tsconfig.json
```

**Acceptance Criteria:**

- [ ] Shared types library created
- [ ] Types extracted and organized
- [ ] Type generation script works
- [ ] All apps use shared types
- [ ] Types stay in sync

---

### 6.2 Shared Utils Library

**Status:** 🔴 Not started  
**Priority:** Medium  
**Estimated:** 2-3 hours

**Action Items:**

1. ✅ Create shared utils library:
   ```bash
   nx generate @nx/js:library shared-utils --directory=libs/shared-utils --importPath=@vado/shared-utils
   ```
2. ✅ Identify shared utilities:
   - Date formatting
   - Validation functions
   - API helpers
   - Constants
   - Error handling
3. ✅ Extract utilities from apps:
   - Move common functions
   - Update imports in apps
   - Test utilities work
4. ✅ Organize utilities:
   - Group by domain
   - Create index exports
   - Document utilities
5. ✅ Add tests:
   - Unit tests for utilities
   - Run tests in CI

**Library Structure:**

```
libs/shared-utils/
├── src/
│   ├── date/
│   ├── validation/
│   ├── api/
│   ├── constants/
│   └── index.ts
├── project.json
└── tsconfig.json
```

**Acceptance Criteria:**

- [ ] Shared utils library created
- [ ] Utilities extracted
- [ ] All apps use shared utils
- [ ] Tests written
- [ ] Documentation added

---

## Phase 7: Update CI/CD & Scripts

### 7.1 Update CI/CD Pipelines

**Status:** 🔴 Not started  
**Priority:** High  
**Estimated:** 2-3 hours

**Action Items:**

1. ✅ Create GitHub Actions workflow:
   - Set up NX affected detection
   - Configure build/test/lint for all apps
   - Set up caching
   - Configure deployment
2. ✅ Update EAS build configuration:
   - Update paths for monorepo
   - Test EAS builds
3. ✅ Update Vercel/Netlify configs:
   - Update build commands
   - Update output directories
   - Test deployments
4. ✅ Set up environment variables:
   - Configure in CI/CD platforms
   - Document required variables
5. ✅ Test CI/CD:
   - Push changes
   - Verify builds run
   - Verify deployments work

**CI/CD Configuration:**

- GitHub Actions for builds/tests
- EAS for mobile builds
- Vercel for dashboard
- Netlify/Vercel for site

**Acceptance Criteria:**

- [ ] CI/CD pipelines updated
- [ ] Builds work in CI
- [ ] Deployments work
- [ ] Caching configured

---

### 7.2 Update Package Scripts

**Status:** 🔴 Not started  
**Priority:** Medium  
**Estimated:** 1-2 hours

**Action Items:**

1. ✅ Create root-level scripts:
   - `pnpm dev` - Run all apps in dev mode
   - `pnpm build` - Build all apps
   - `pnpm lint` - Lint all apps
   - `pnpm test` - Test all apps
2. ✅ Create app-specific scripts:
   - `pnpm dev:mobile`
   - `pnpm dev:dashboard`
   - `pnpm dev:site`
3. ✅ Create utility scripts:
   - `pnpm generate:types` - Generate types from Supabase
   - `pnpm clean` - Clean all builds
   - `pnpm format` - Format all code
4. ✅ Document all scripts
5. ✅ Test all scripts

**Acceptance Criteria:**

- [ ] Scripts created
- [ ] Scripts documented
- [ ] All scripts work
- [ ] Scripts are convenient

---

## Phase 8: Testing & Verification

### 8.1 Test All Apps

**Status:** 🔴 Not started  
**Priority:** High  
**Estimated:** 3-4 hours

**Action Items:**

1. ✅ Test mobile app:
   - Run on iOS simulator
   - Run on Android emulator
   - Test all features
   - Verify builds work
2. ✅ Test dashboard:
   - Run dev server
   - Test all pages
   - Test authentication
   - Verify production build
3. ✅ Test site:
   - Run dev server
   - Test all pages
   - Verify production build
4. ✅ Test shared libraries:
   - Verify types work
   - Verify utilities work
   - Test imports
5. ✅ Test cross-app functionality:
   - Verify shared code works
   - Test type consistency
   - Verify no conflicts

**Acceptance Criteria:**

- [ ] All apps work correctly
- [ ] Shared libraries work
- [ ] No regressions
- [ ] All features functional

---

### 8.2 Performance Verification

**Status:** 🔴 Not started  
**Priority:** Medium  
**Estimated:** 1-2 hours

**Action Items:**

1. ✅ Test build times:
   - Compare to original repos
   - Verify caching works
   - Optimize if needed
2. ✅ Test dev server startup:
   - Verify fast startup
   - Test hot reload
3. ✅ Test NX affected:
   - Verify only changed apps build
   - Test dependency graph
4. ✅ Test parallel execution:
   - Verify parallel builds work
   - Test parallel tests

**Acceptance Criteria:**

- [ ] Build times acceptable
- [ ] Dev servers fast
- [ ] Affected detection works
- [ ] Parallel execution works

---

## Phase 9: Documentation & Cleanup

### 9.1 Update Documentation

**Status:** 🔴 Not started  
**Priority:** Medium  
**Estimated:** 2-3 hours

**Action Items:**

1. ✅ Create monorepo README:
   - Overview of structure
   - Getting started guide
   - Development workflow
   - Scripts documentation
2. ✅ Update app-specific READMEs:
   - Mobile app README
   - Dashboard README
   - Site README
3. ✅ Document shared libraries:
   - API documentation
   - Usage examples
   - Contribution guidelines
4. ✅ Create migration guide:
   - Document what changed
   - Migration notes
   - Troubleshooting

**Acceptance Criteria:**

- [ ] READMEs updated
- [ ] Documentation complete
- [ ] Migration guide created

---

### 9.2 Archive Old Repositories

**Status:** 🔴 Not started  
**Priority:** Low  
**Estimated:** 1 hour

**Action Items:**

1. ✅ Archive old repositories:
   - Add archive notice to READMEs
   - Update repository descriptions
   - Point to new monorepo
2. ✅ Update links:
   - Update any external links
   - Update documentation
   - Update CI/CD if needed
3. ✅ Create migration announcement:
   - Notify team
   - Provide migration timeline
   - Answer questions

**Acceptance Criteria:**

- [ ] Old repos archived
- [ ] Links updated
- [ ] Team notified

---

## Implementation Priority

### Critical Path (Must Complete):

1. ✅ Phase 1: Pre-Migration Preparation
2. ✅ Phase 2: NX Monorepo Setup
3. ✅ Phase 3: Migrate Mobile App
4. ✅ Phase 4: Migrate Dashboard
5. ✅ Phase 5: Migrate Site
6. ✅ Phase 6: Create Shared Libraries
7. ✅ Phase 8.1: Test All Apps

### High Priority (Should Complete):

1. ✅ Phase 7: Update CI/CD
2. ✅ Phase 8.2: Performance Verification
3. ✅ Phase 9: Documentation

### Nice to Have:

1. ⏸️ Phase 9.2: Archive Old Repositories (can be done later)

---

## Success Criteria

Before considering migration complete, all of the following must be true:

### Functionality:

- [ ] All three apps work correctly in monorepo
- [ ] Shared libraries work across all apps
- [ ] No regressions from original repos
- [ ] All features functional

### Build & Deploy:

- [ ] All apps build successfully
- [ ] CI/CD pipelines work
- [ ] Deployments work (EAS, Vercel, Netlify)
- [ ] Build times acceptable

### Developer Experience:

- [ ] Dev servers start quickly
- [ ] Hot reload works
- [ ] NX affected detection works
- [ ] Scripts are convenient
- [ ] Documentation is complete

### Code Quality:

- [ ] TypeScript compiles without errors
- [ ] ESLint passes
- [ ] Tests pass
- [ ] Code is formatted

---

## Estimated Total Effort

- **Phase 1 (Preparation):** 4-6 hours
- **Phase 2 (NX Setup):** 4-6 hours
- **Phase 3 (Mobile Migration):** 3-5 hours
- **Phase 4 (Dashboard Migration):** 3-4 hours
- **Phase 5 (Site Migration):** 2-3 hours
- **Phase 6 (Shared Libraries):** 4-6 hours
- **Phase 7 (CI/CD):** 3-5 hours
- **Phase 8 (Testing):** 4-6 hours
- **Phase 9 (Documentation):** 3-4 hours
- **Total:** 30-45 hours

**Realistic Timeline:** 1-2 weeks with focused development

---

## Notes

- **Start After Mobile Launch:** Do NOT begin until mobile app is in app stores
- **Test Incrementally:** Test each app after migration, don't wait until the end
- **Preserve Git History:** Consider migrating git history if valuable (optional)
- **Coordinate with Team:** Ensure team is aware of migration and timeline
- **Backup Everything:** Keep original repos until migration is verified complete
- **React Version:** Critical to align React version across all apps
- **Dependency Conflicts:** Resolve conflicts early, document decisions

---

## Next Steps (After Mobile App Launch)

1. ⏸️ Review and approve this plan
2. ⏸️ Begin Phase 1 (Repository Analysis)
3. ⏸️ Set up NX workspace (Phase 2)
4. ⏸️ Migrate mobile app first (Phase 3)
5. ⏸️ Migrate dashboard (Phase 4)
6. ⏸️ Migrate site (Phase 5)
7. ⏸️ Create shared libraries (Phase 6)
8. ⏸️ Update CI/CD (Phase 7)
9. ⏸️ Test everything (Phase 8)
10. ⏸️ Document and cleanup (Phase 9)

**Remember:** This is a post-launch project. Focus on mobile app first, then begin monorepo migration.

---

## Troubleshooting

### Common Issues:

1. **React Version Conflicts:**
   - Use `pnpm resolutions` or `overrides` to force React version
   - Ensure all apps use same React version
   - Test Metro bundler with aligned versions

2. **Metro Bundler Issues:**
   - Configure `watchFolders` in metro.config.js
   - Update resolver for monorepo structure
   - Test with `nx run mobile:start`

3. **Path Alias Issues:**
   - Verify tsconfig path mappings
   - Check Metro resolver config
   - Test imports work

4. **Build Failures:**
   - Check NX cache (clear if needed)
   - Verify all dependencies installed
   - Check for circular dependencies

5. **CI/CD Failures:**
   - Verify build commands
   - Check environment variables
   - Test locally first
