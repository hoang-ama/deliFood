:::writing{variant=“standard” id=“10002”}

PRODUCT SPEC - DeliFood

1. Product Vision

DeliFood is a multi-tenant SaaS platform that enables restaurants to:
	•	Manage orders
	•	Manage menus
	•	Serve customers online

⸻

2. Core Entities

Tenant

Represents a business (restaurant brand)

Fields:
	•	id
	•	name
	•	subdomain
	•	settings (JSON — locale, currency, feature flags, etc.)

⸻

User
Fields:
	•	id
	•	email
	•	password
	•	role (customer | owner | staff)
	•	tenantId

⸻

Restaurant

Fields:
	•	id
	•	name
	•	tenantId

⸻

Menu

Fields:
	•	id
	•	name
	•	price
	•	restaurantId
	•	tenantId

⸻

Order

Fields:
	•	id
	•	userId
	•	restaurantId
	•	tenantId
	•	items
	•	total
	•	status

3. Data Isolation Rule (CRITICAL)

All data MUST be filtered by:
- tenantId
No exception.

4. User Roles

Customer
	•	Browse menu
	•	Place order

Owner
	•	Manage menu
	•	View orders

Staff
	•	Update  order status


⸻

5. Data Flow

Order Flow
 
 Customer → Create Order → Order saved with tenantId
 → Owner views order → Staff updates status

 6. API Design Principles
	•	RESTful APIs
	•	All protected routes require JWT
	•	All queries scoped by tenantId

Onboarding (SaaS bootstrap)
	•	`POST /api/onboarding` — one atomic operation: create Tenant (with initial `settings`), Owner user, first Restaurant; response includes JWT for immediate login (same payload shape as auth).
	•	This route does not require an existing tenant context (resolved before tenant middleware).
	•	In production, set environment variable `ONBOARDING_SECRET` and send header `x-onboarding-secret` with the same value (guard is disabled when the variable is unset, for local development only).

⸻

7. Multi-tenancy Strategy
	•	Single database
	•	Shared schema
	•	tenantId column

⸻

8. Future Expansion

SaaS
	•	Subscription
	•	Billing

Marketplace
	•	Cross-tenant discovery
	•	Ranking system

⸻

9. Non-Goals (for now)
	•	Delivery system
	•	Real-time tracking
	•	Multi-country scaling

⸻

10. Definition of Done
	•	System supports multiple tenants
	•	Each tenant has isolated data
	•	Restaurant owner can operate independently

    :::