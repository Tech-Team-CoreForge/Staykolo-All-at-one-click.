# StayKolo — Complete Application Workflow, Architecture & Requirements

> **Overview**: StayKolo is a **4-level PG management + discovery ecosystem**, where each role serves a distinct functional purpose across the property discovery and operational lifecycle.
>
> **Phase 1**: Exclusive for Bengaluru — *"PG findings made easy in Bangalore"*
>
> **UID Standard**: The phone number is the **universal unique identifier (UID)** for all roles — User, Staff, Admin, and Super Admin. *(Req #19)*

---

```text
                         ┌─────────────────────────┐
                         │       STAYKOLO           │
                         │   PG Discovery Platform  │
                         └────────────┬────────────┘
                                      │
              ┌───────────────────────┼───────────────────────┐
              │                       │                       │
              ▼                       ▼                       ▼
        ┌───────────┐           ┌───────────┐          ┌───────────┐
        │   USER    │           │ PG OWNER  │          │  STAFF    │
        │ / TENANT  │           │  / ADMIN  │          │           │
        └─────┬─────┘           └─────┬─────┘          └─────┬─────┘
              │                       │                       │
              │                       │                       │
              └───────────────────────┼───────────────────────┘
                                      │
                                      ▼
                           ┌─────────────────────┐
                           │    SUPER ADMIN      │
                           │  StayKolo Control   │
                           │      Center         │
                           └─────────────────────┘
```

### Role-Based Login (Single Entry Point)

Login is **role-based** with a single entry point. *(Req #5)*

- If a user is tied to a PG as a **Tenant**, they login and are routed to `/tenant` — otherwise access is **denied**.
- PG Owners login into `/admin`.
- Staff login into `/staff`.
- Super Admin logins into `/superadmin`.

---

## 1. USER — PG Seeker → Tenant

The **User side has two stages**:

### A. Before Joining a PG (Discovery Phase)

```text
User visits StayKolo
        │
        ▼
Uses "StayKolo PG Locator"
(renamed from "Find PG" button — Req #42)
        │
        ▼
Searches location
        │
        ▼
StayKolo shows 5 PGs
(without login required)
        │
        ├───────────────┐
        │               │
        ▼               ▼
View PG details      Wants more
                     features
        │               │
        │               ▼
        │          Create Account
        │          (UID = Phone Number)
        │               │
        └───────┬───────┘
                ▼
       Login / User Account
                │
       ┌────────┼──────────┬─────────┐
       ▼        ▼          ▼         ▼
     Like     Compare    Contact   Improved
     PGs      PGs        PG via    Suggestion
              (liked     StayKolo  System
               PGs)                (Req #36)
                            │
                            ▼
                    Eligible for
                    25% 1st-month
                    offer* (Req #50)
```

### Important Distinction

- **No account required:**
  - Search PG
  - View initial 5 PG listings
  - View basic PG information

- **Account required:**
  - Continue searching beyond initial 5 PGs
  - Save / Like PG listings → listed in a "Liked" section *(Req #40)*
  - Compare PGs → compare liked PGs side-by-side *(Req #43)*
  - Contact PG through StayKolo
  - More filters & UX upgrade for search *(Req #41)*
  - Manage personal profile
  - Submit data deletion request (from user profile)
  - Rate PGs — amenities checklist rating: user can verify if the amenities advertised by admin are actually present, using a checkbox-based rating *(Req #22)*

### User Data & Lead Management

Every person who logs in to view PGs becomes a **lead** — collected automatically. *(Req #35)*

```text
Visitor
   │
   ▼
Search Activity (tracked)
   │
   ▼
Lead/User Record (in Super Admin)
   │
   ├── Name
   ├── Phone (UID)
   ├── Email
   ├── Search Location
   ├── PGs Viewed
   ├── Saved / Liked PGs
   ├── Contact Requests
   └── Timestamp (creation, last activity — Req #49)
```

### 25% Offer & Ecosystem Transfer *(Req #50)*

- If a user joins a PG that carries the **StayKolo Verified Badge**, they get **25% off** the 1st month rent (must contact PG through StayKolo website).
- If a tenant later wants to **move to another verified PG**, StayKolo enables an **easy ecosystem transfer** — seamless migration within the platform.

---

## 2. USER BECOMES A TENANT

Once a user actually joins a PG, the **PG Admin adds them** with full details:

```text
PG Owner/Admin
      │
      ▼
Adds Tenant
      │
      ├── Name
      ├── Mobile (UID)
      ├── Room Number
      ├── Floor
      ├── Joining Date
      └── Other Tenant Details
              │
              ▼
        StayKolo Tenant
            Account
              │
              ▼
        /tenant portal
        (role-based access — denied if not tied to a PG)
```

The tenant gains access to a dedicated operational portal.

### Tenant Portal Architecture

```text
                    TENANT PORTAL
                         │
    ┌──────────┬─────────┼──────────┬──────────────┐
    │          │         │          │              │
    ▼          ▼         ▼          ▼              ▼
 Room       Raise     Food/Menu  Payments     Notifications
 Details    Issues    & Attendance & Tracking   (with sound
    │          │         │          │            — Req #37)
    │          │         │          │
    │    ┌─────┤         │      Calendar-
    │    │     │         │      based view
    │    │     │         │      (Req #24)
    │    ▼     ▼         │
    │  WiFi  Electricity │
    │  Water  Furniture  │
    │  Other             │
    │                    │
    └────────┬───────────┘
             ▼
      Notices / Updates
             │
             ▼
      Staff on Duty Details
```

#### Core Tenant Modules *(Req #18 expanded)*:

| # | Module | Description |
|---|---|---|
| 1 | **Track Payments** | Calendar-based view — green tick when admin approves monthly payment, late reminders shown *(Req #24)* |
| 2 | **Raise Issue / Concern** | Wi-Fi, Electricity, Water, Furniture, Other — with status tracking |
| 3 | **Wi-Fi Credentials** | Show Wi-Fi name & password (controlled by admin — Req #14). No speed info provided *(Req #23)* |
| 4 | **Notifications** | With sound popup *(Req #37)* |
| 5 | **PG History / PG Details** | View current and historical PG information |
| 6 | **Staff on Duty** | See who is currently on duty |
| 7 | **Food Attendance** | Mark attendance for food & PG *(Req #18)* |
| 8 | **Food Menu** | View daily menu, special items |
| 9 | **Room / Floor Info** | Detailed view — floor, occupancy, room number *(Req #13)* |
| 10 | **Notices / Updates** | PG-level announcements |
| 11 | **Amenities** | List of available amenities |
| 12 | **Agreements / Damage Charges** | Shows deposit deduction terms — charges for damage visible to tenant *(Req #25)* |
| 13 | **Profile / Settings** | Personal profile management. **Settings placed last in sidebar** *(Req #14 sidebar)* |
| 14 | **Offers** | Current offers from StayKolo *(Req #38)* |

> **Key Takeaway**: *User* and *Tenant* represent functionally distinct lifecycle stages of the same individual.

---

## 3. PG OWNER / ADMIN

The PG Owner is responsible for property listing, room inventory, tenant management, and staff operations.

### Admin Onboarding Flow

```text
              PG OWNER
                  │
                  ▼
       "Login as PG Owner"
                  │
                  ▼
       Enters Phone (UID) + Password
       (password has view/hide toggle — Req #33)
                  │
                  ▼
          Account Request
     "Our team will contact you
      soon to complete profile creation"
                  │
                  ▼
           SUPER ADMIN
                  │
                  ▼
        Request Received
                  │
                  ▼
      StayKolo Team Contacts
              PG Owner
                  │
                  ▼
        Business Verification
        (certificates & docs required — Req #27)
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
    Documents          PG Information
    Verified             Verified
        │                   │
        └─────────┬─────────┘
                  ▼
           PG VERIFIED
        (Verified Badge — Req #28)
                  │
                  ▼
      Subscribe to StayKolo Plan
      (verified = subscribed — Req #28)
                  │
                  ▼
          Admin Dashboard
```

### PG Owner Dashboard Modules

Once verified and subscribed, the owner gains access to:

```text
                    ADMIN PANEL
                         │
     ┌───────────────────┼───────────────────┐
     │                   │                   │
     ▼                   ▼                   ▼
  Property             Tenants             Staff
  Management           Management          Management
     │                   │                   │
     ├── Rooms           ├── Add Tenant      ├── Add Staff
     ├── Floors          │   (1st Priority   ├── Delete Staff
     ├── Photos          │    — Req #20)     ├── Duty Allocation
     │   (pic upload     ├── Profile/Role    ├── User ID
     │    — Req #34)     │   Details         ├── Password
     ├── Amenities       ├── Room            └── Toggle Access
     │   (checkbox       ├── Floor              (Req #44)
     │    — Req #21)     ├── Status
     └── Pricing         └── Payment
                             Calendar
```

### Full Admin Panel Feature List

| # | Module | Details |
|---|---|---|
| 1 | **Analytics / Overview** | **FIRST section** — graphical analytics dashboard *(Req #31, #47)* |
| 2 | **PG Profile** | Listing info, photos (upload support — Req #34), pricing, amenities |
| 3 | **Add Property** | Full detailed collection for each PG *(Req #15)* |
| 4 | **Rooms** | Detailed room view — floor, occupancy, building naming nomenclature *(Req #13, #15)* |
| 5 | **Room Hierarchy** | Floor & building naming convention (nomenclature) *(Req #15)* |
| 6 | **Floors** | Floor management & occupancy mapping |
| 7 | **Tenants** | **1st Priority** — tenant profile/role details visible in admin *(Req #20)*. Payment calendar with green tick for approved months *(Req #24)* |
| 8 | **Staff** | Add, delete, duty allocation *(Req #17)*. Toggle what staff can access *(Req #44)* |
| 9 | **Food / Menu** | ① Daily-wise menu, ② Fixed menu toggle for all days, ③ Add special items. Proper edit UI *(Req #9, #16)* |
| 10 | **Raise Concern** | NOT "support ticket" — renamed to **"Raise Concern"** *(Req #26)*. Pre-defined quick-raise options + general questions + software glitch reporting. Admins are subscribed users who may face issues too |
| 11 | **Amenities** | Checkbox-based — check if amenity is available *(Req #21)* |
| 12 | **Visitors Log** | Admin can see visitor entries — updated by who, when, what *(Req #13)* |
| 13 | **Wi-Fi Management** | Admin sets Wi-Fi name & password → shown to tenants *(Req #14)* |
| 14 | **Payments** | Per-tenant payment details, month-wise calendar entry, green tick on approval, late reminders *(Req #24)* |
| 15 | **Billing** | Updated billing section *(Req #29)* |
| 16 | **Reports** | Analytics, revenue, occupancy |
| 17 | **Notifications** | With sound popup *(Req #37)* |
| 18 | **Offers** | Manage offers for tenants *(Req #38)* |
| 19 | **Subscription** | Plan management |
| 20 | **Payment Gateway Request** | Request for online payment receiving gateway |
| 21 | **Legal Documents** | Updated button/doc section *(Req #30)* |
| 22 | **Changes Log** | Track all recorded changes across all sections with timestamps *(Req #45)* |
| 23 | **Custom Buttons** | Room type & other configurable options *(Req #6)* |
| 24 | **Settings** | **Placed LAST in sidebar** *(Req #14 sidebar)* |

### Verification Badge Flow

```text
PG Owner
   │
   ▼
All Certificates + Documents Submitted
(Req #27 — must provide everything)
   │
   ▼
Super Admin Review
   │
   ├── Reject → Correction Required
   │
   └── Approve
          │
          ▼
     VERIFIED BADGE
     (verified = subscribed to plans — Req #28)
```

---

## 4. STAFF

Staff accounts are **created by the PG Admin**, not independently registered. *(Req #10)*

### Staff Portal: **Mobile-First Design** *(Req #11)*

```text
              PG ADMIN
                  │
                  ▼
             Staff Module
                  │
        ┌─────────┤
        ▼         ▼
   Add Staff   Delete Staff
   (Req #17)   (Req #17)
        │
        ├── Duty Allocation (Req #17)
        │
        ├── Toggle Access per Module
        │   (Admin controls what staff
        │    can do — Req #44)
        │
        ▼
   Create Credentials
        │
   ┌────┴────┐
   ▼         ▼
User ID   Password
(phone)   (assigned)
   │         │
   └────┬────┘
        ▼
  STAFF ACCOUNT
        │
        ▼
  Staff Dashboard
  (MOBILE-FIRST — Req #11)
```

### Staff Portal Features

| # | Module | Notes |
|---|---|---|
| 1 | **Analytics / Overview** | **First section** *(Req #47)* |
| 2 | **Visitors Log Entry** | Staff can add visitor entries *(Req #12, #18)* |
| 3 | **Issues Management** | Handle tenant-raised concerns |
| 4 | **Food / Menu** | Manage daily meals (if toggled on by admin) |
| 5 | **Tenant Info** | Assigned access only |
| 6 | **Changes Log** | Track all changes with timestamps *(Req #45)* |
| 7 | **Settings** | **Placed LAST** *(Req #14)* |

### Access Control Matrix (Admin-Controlled Toggles — Req #44)

| Module | Admin | Staff (if toggled ON) |
|---|---|---|
| **PG Profile** | Full Access | Limited / View Only |
| **Tenants** | Full Access | Assigned Access |
| **Issues / Maintenance** | Full Access | Manage & Resolve |
| **Food / Menu** | Full Access | Manage Daily Meals |
| **Visitors** | Full Access | Add & Manage Entries *(Req #12)* |
| **Staff Management** | Full Access | No Access |
| **Subscription Plan** | Full Access | No Access |
| **Payment Settings** | Full Access | No Access |

*Note: Staff records are visible to Super Admin for platform oversight. Admin toggles control exactly what each staff member can access.*

---

## 5. SUPER ADMIN — MASTER PLATFORM CONTROL

The developer controls the **entire StayKolo ecosystem**. *(Req #46)*

Super Admin has **no tenant problems** — they are not a tenant. *(Req #7)*

Super Admin has the **tenant database for all admin-owned PGs**. *(Req #8)*

```text
                         SUPER ADMIN
                              │
        ┌─────────────────────┼──────────────────────┐
        │                     │                      │
        ▼                     ▼                      ▼
    USERS / LEADS          PG OWNERS              PROPERTIES
        │                     │                      │
        │                     ├── Verification       ├── PG Details
        │                     ├── Approval           │   (full detail
        │                     ├── Subscription       │   view — Req #27)
        │                     └── Account            ├── Rooms
        │                                            ├── Floors
        ├── User Accounts                            └── Status
        ├── Search Data (leads — Req #35)
        ├── Contact Requests
        └── Deletion Requests

                              │
        ┌─────────────────────┼──────────────────────┐
        ▼                     ▼                      ▼
      STAFF                 TENANTS                SYSTEM
        │                     │                      │
        ├── Accounts          ├── Records            ├── Plans
        ├── Access            ├── PG Mapping         ├── Payments
        └── Status            └── Issues             ├── Reports
                                                     ├── Settings (LAST)
                                                     ├── Changes Log
                                                     └── Timestamps
```

### Super Admin Panel Feature List *(Req #46)*

| # | Module | Details |
|---|---|---|
| 1 | **Analytics / Overview** | **FIRST section** — graphical analytics for entire platform *(Req #31, #47)* |
| 2 | **Users / Leads** | All user accounts, search data, contact requests, deletion requests, lead collection *(Req #35)* |
| 3 | **PG Owners** | Verification, approval, subscription status, account management |
| 4 | **Properties** | List-box view of all properties — click to enter full detailed view *(Req #27)*. Multiple admins attached to properties. Approval workflow |
| 5 | **Tenants** | Full tenant database across all PGs *(Req #8)*. No tenant problems for super admin *(Req #7)* |
| 6 | **Staff** | All staff accounts, access levels, status across all PGs |
| 7 | **Verification** | Badge approval/rejection, certificate review |
| 8 | **Subscription Plans** | Enable/manage plans *(Req #28)* |
| 9 | **Billing** | Updated billing management *(Req #29)* |
| 10 | **Legal Documents** | Updated doc & button section *(Req #30)* |
| 11 | **Notifications** | With sound popup *(Req #37)* |
| 12 | **Offers Management** | Platform-wide offers *(Req #38)* |
| 13 | **Changes Log** | Track ALL recorded changes with timestamps across entire platform *(Req #45, #49)* |
| 14 | **System Settings** | Full flexibility to change settings, control all data *(Req #46)*. **Placed LAST in sidebar** *(Req #14)* |

---

## 6. COMPLETE STAYKOLO DATA FLOW

```text
                    ┌──────────────────┐
                    │    STAYKOLO      │
                    │     WEBSITE      │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  STAYKOLO PG    │
                    │   LOCATOR       │
                    │  (Req #42)      │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  SHOW 5 PGs     │
                    │ Without Login   │
                    └────────┬────────┘
                             │
                 ┌───────────┴────────────┐
                 │                        │
                 ▼                        ▼
          Continue browsing         Contact / Like /
          (needs account)           Compare / Save
                 │                        │
                 │                        ▼
                 │                  CREATE ACCOUNT
                 │                  (UID = Phone)
                 │                        │
                 └────────────┬───────────┘
                              ▼
                        USER ACCOUNT
                        (lead captured — Req #35)
                              │
                              ▼
                     CONTACT PG THROUGH
                         STAYKOLO
                              │
                              ▼
                    25% OFF IF VERIFIED PG
                        (Req #50)
                              │
                              ▼
                        PG ADMISSION
                              │
                              ▼
                    PG ADMIN ADDS TENANT
                              │
                              ▼
                       TENANT ACCOUNT
                       (/tenant — role-based)
                              │
                              ▼
                      TENANT PORTAL
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
       Issues              Food/Menu          Payments
       & Concerns          & Attendance       & Calendar
          │                   │                   │
          └───────────────────┼───────────────────┘
                              │
                         Notices │ Wi-Fi │ Staff Info
                              │
                              ▼
                       PG ADMIN PANEL
                              │
                              ▼
                     STAFF MANAGEMENT
                     (mobile-first — Req #11)
                              │
                              ▼
                     SUPER ADMIN SYSTEM
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
       USERS/LEADS          PGs                  ADMINS
          │                   │                   │
          ▼                   ▼                   ▼
       TENANTS             STAFF              VERIFICATION
                              │
                              ▼
                    ANALYTICS / CHANGES LOG /
                      PLATFORM CONTROL
```

---

## 7. Ecosystem Role Summary

| Role | Core Purpose | Access Level | UID |
|---|---|---|---|
| **User** | Find, compare, like, and contact PGs | Website + User Account | Phone |
| **Tenant** | Track payments, raise issues, food, Wi-Fi, notices | `/tenant` (role-gated) | Phone |
| **PG Admin / Owner** | Manage PG, rooms, tenants, staff, payments, menu | `/admin` | Phone |
| **Staff** | Day-to-day ops: issues, food, visitors (mobile-first) | `/staff` (toggle-controlled) | Phone |
| **Super Admin** | Control entire platform, all data, all settings | `/superadmin` | Phone |

---

## 8. Summary of Relationships

```text
                         STAYKOLO
                            │
                    ┌───────┴───────┐
                    │               │
                PLATFORM          USERS
                CONTROL             │
                    │               ▼
              SUPER ADMIN        USER ACCOUNT
                    │               │
          ┌─────────┼─────────┐     │
          │         │         │     ▼
        PGs       Owners    Staff  TENANT
          │         │         │     │
          └─────────┴─────────┘     │
                    │               │
                    ▼               │
                PG ADMIN ◄──────────┘
                    │
          ┌─────────┼──────────┐
          ▼         ▼          ▼
       ROOMS     TENANTS     STAFF
```

### Lifecycle Progression:
1. **User Discovery**: User finds PG → creates account → contacts PG.
2. **Tenant Onboarding**: User joins PG → PG Admin adds user as Tenant → Tenant accesses `/tenant` portal (role-gated).
3. **Owner Onboarding**: PG Owner applies → Super Admin verifies & approves → Owner subscribes → Admin Panel activated → Owner manages PG, tenants, staff, and pricing.
4. **Platform Oversight**: Super Admin controls platform users, PG listings, owner verification, subscriptions, staff roles, system settings, analytics, and all data.

---

## 9. UI/UX Requirements

### Global UI Rules

| # | Requirement | Ref |
|---|---|---|
| 1 | **Sticky navbar** on web version | Req #32 |
| 2 | **Password view/hide toggle** button on all login forms | Req #33 |
| 3 | **Sidebar scroll fix**: when selecting items in the left sidebar, the sidebar must NOT reset scroll position to the top — it must remember scroll position | Req #48 |
| 4 | **Settings placed LAST** in sidebar for all panels (Admin, Super Admin, Staff) | Req #14 |
| 5 | **Analytics/Overview placed FIRST** in all panels | Req #31, #47 |
| 6 | **Notifications with sound** popup | Req #37 |
| 7 | **Map colours** changed to StayKolo brand colours | Req #39 |
| 8 | **Karnataka flag** in footer — "Brand Karnataka" + state flag (yellow & red rectangle) | Req #16 |
| 9 | **Timestamps on all data** — creation, deletion, modification tracked everywhere | Req #49 |
| 10 | **Changes log** in every section across all panels | Req #45 |

### Branding Updates

| Item | Change | Ref |
|---|---|---|
| "Find PG" button | Rename to **"StayKolo PG Locator"** | Req #42 |
| "Exclusive for Bengaluru" | Update to **"PG findings made easy in Bangalore — Phase 1"** | Req #17 (branding) |
| Footer | Add **Karnataka flag** (yellow & red rectangle) + "Brand Karnataka" | Req #16 |
| Map pins/colours | Use **StayKolo brand colours** | Req #39 |

---

## 10. Complete Requirements Tracker (All 50 Points)

| # | Requirement | Category | Panel(s) | Status |
|---|---|---|---|---|
| 1 | User flow: search → 5 PGs → account → like/compare/contact | User | Website | — |
| 2 | Admin onboarding: login as PG owner → request → verify → subscribe → dashboard | Admin | Admin | — |
| 3 | Staff: admin creates credentials, visible in super admin | Staff | Admin, Super Admin | — |
| 4 | Super admin: see all, manage all properties, admins, verification, approvals | Super Admin | Super Admin | — |
| 5 | Role-based login: single entry, tenant route denied if not tied to PG | Auth | All | — |
| 6 | Custom buttons: room type and other configurable options | Admin | Admin | — |
| 7 | Super admin has NO tenant problems | Super Admin | Super Admin | — |
| 8 | Super admin has tenant database for admin-owned PGs | Super Admin | Super Admin | — |
| 9 | Menu: ① Daily-wise, ② Fixed toggle for all days, ③ Special items | Food | Admin, Staff, Tenant | — |
| 10 | Create staff module | Staff | Admin | — |
| 11 | `/staff` is **mobile-first** | Staff | Staff | — |
| 12 | Staff can add visitor log entries | Staff | Staff | — |
| 13 | Admin can see visitor log: who, when, what + detailed room/floor view | Admin | Admin | — |
| 14 | Wi-Fi page: show name & password to tenants, admin controls values | Feature | Admin, Tenant | — |
| 15 | Add property: full detailed collection for each PG | Admin | Admin | — |
| 16 | Karnataka flag in footer: "Brand Karnataka" + yellow/red rectangle | Branding | All | — |
| 17 | "Exclusive for Bengaluru" → "PG findings made easy in Bangalore — Phase 1" + staff add/delete/duty | Branding + Staff | Website, Admin | — |
| 18 | Tenant capabilities: track payments, raise issue, Wi-Fi, notifications, PG history, staff on duty, food attendance | Tenant | Tenant | — |
| 19 | UID = phone number for all roles | Auth | All | — |
| 20 | Admin portal MUST have tenant profile/role details **(1st priority)** | Admin | Admin | — |
| 21 | Amenities = checkbox-based selection by admin | Admin | Admin | — |
| 22 | User can rate PG amenities via same checkbox (verify what's actually there) | User | User/Tenant | — |
| 23 | Wi-Fi speed: NOT provided | Feature | — | — |
| 24 | Payments: per-tenant calendar view, green tick on approval, late reminders | Payments | Admin, Tenant | — |
| 25 | Agreements: damage charges deducted from deposit, visible to tenant | Legal | Admin, Tenant | — |
| 26 | Rename "Support Ticket" → **"Raise Concern"**. Pre-defined quick-raise options, general questions, software glitch reporting for admin | UX | Admin | — |
| 27 | Super admin: full property detail view, list-box, click-to-enter. PGs must provide all certificates for verification | Super Admin | Super Admin | — |
| 28 | Verified = subscribed to plans. Enable plans where they get dashboard | Business | Admin, Super Admin | — |
| 29 | Billing section update | Payments | Admin, Super Admin | — |
| 30 | Legal document section update, button change | Legal | Admin, Super Admin | — |
| 31 | Proper graphical analytics **FIRST** in dashboard | Analytics | Admin, Super Admin | — |
| 32 | Navbar sticky on web version | UI | All | — |
| 33 | Password view/hide toggle button | UI | All login forms | — |
| 34 | Admin dashboard: pic upload for options | UI | Admin | — |
| 35 | Lead collection: when a person logs in to see PGs, capture as lead | Leads | Super Admin | — |
| 36 | Improved suggestion system for users | UX | User | — |
| 37 | Notification popup with sound | UX | All | — |
| 38 | Offers section | Business | User, Tenant, Admin | — |
| 39 | Map colour → StayKolo brand colour | UI | User | — |
| 40 | Like concept: user can like preferred PGs → listed in "Liked" section | User | User | — |
| 41 | More filters, UX upgrade for search | UX | User | — |
| 42 | Rename "Find PG" → **"StayKolo PG Locator"** | Branding | User | — |
| 43 | PG comparison: compare liked PGs side-by-side | User | User | — |
| 44 | Admin toggle: control what staff can do per module | Admin | Admin | — |
| 45 | Changes log in ALL sections — track all recorded changes | Audit | All | — |
| 46 | Super admin: full flexibility to change settings, control all data | Super Admin | Super Admin | — |
| 47 | Analytics/overview FIRST in every panel | UI | All | — |
| 48 | Sidebar scroll bug: sidebar resets to top on item selection — MUST persist scroll position | Bug Fix | All | — |
| 49 | Timestamps on ALL data: creation, deletion, modification | Audit | All | — |
| 50 | 25% off for verified PGs + easy ecosystem transfer between verified PGs | Business | User, Tenant | — |
