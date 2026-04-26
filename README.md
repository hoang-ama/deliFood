Developer Guide + Roadmap

:::writing{variant=“standard” id=“10001”}

DeliFood - Multi-tenant Food Ordering SaaS
🎯 Project Goal
Build a multi-tenant food ordering platform that evolves in 3 phases:
Single Restaurant System (SaaS-ready)
Multi-tenant SaaS (multiple restaurants)
Marketplace (like DoorDash / UberEats)

🧠 Core Principle
We are NOT building a single restaurant app
We are building a SaaS system that currently has ONE tenant

🏗️ Architecture Overview
Tenant (Business)
 └── Restaurant (1 or many locations)
      ├── Menu
      ├── Orders
      └── Staff

⚙️ Current Tech Stack
Backend: Node.js (Express)
Database: MongoDB (Mongoose)
Auth: JWT
Frontend: React (existing)

📦 Module Structure
src/
 ├── modules/
 │   ├── tenant/
 │   ├── auth/
 │   ├── user/
 │   ├── restaurant/
 │   ├── menu/
 │   └── order/
 ├── common/
 │   ├── middleware/
 │   └── utils/
 └── app.js

🔑 Key Design Rules
1. Multi-tenancy FIRST
Every entity MUST include:
tenantId

2. No direct DB access from controller
Controller → Service → Model

3. Tenant Isolation (MANDATORY)
All queries must include:
{ tenantId: req.tenantId }

4. Request Flow
Request
 → Tenant Middleware
 → Auth Middleware
 → Controller
 → Service
 → Database

🚀 Development Phases
Phase 1: SaaS Foundation
Add Tenant model
Add tenantId to all entities
Tenant middleware
Refactor services

Phase 2: Auth & Role
JWT with tenantId
Roles: customer, owner, staff
Admin APIs

Phase 3: Restaurant Dashboard
Order management
Menu CRUD

Phase 4: SaaS Enablement
Tenant onboarding
Subdomain routing

❗ Anti-patterns (DO NOT DO)
❌ Hardcode restaurantId
❌ Query without tenantId
❌ Business logic inside controller
❌ Global shared data across tenants

✅ Success Criteria
Multiple tenants can exist
Data is fully isolated
System works with 1 tenant now
Ready to scale to many tenants later

🔥 Future Roadmap
Marketplace aggregation
Delivery system
Payment integration
Analytics dashboard

:::
