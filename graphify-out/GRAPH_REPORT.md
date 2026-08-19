# Graph Report - Restaurant-SaaS-Platform  (2026-08-19)

## Corpus Check
- 246 files · ~97,786 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1347 nodes · 2908 edges · 121 communities (57 shown, 64 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 189 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Chat Sessions & Error Handling
- Subscriptions & Plan Guard
- App Core & Auth Middleware
- Auth Controller & JWT
- Menu Pricing & Order Calc
- Menu Model & Schema
- Cloudinary Media Integration
- Channel Adapters
- TypeScript Config
- Service Interfaces Docs
- Categories CRUD
- Customers CRUD
- Variants CRUD
- Cache Service Layer
- Branches CRUD
- Coupons CRUD
- Employees CRUD
- Jobs & Realtime Service
- Firestore Realtime Service
- Chat Sessions Controller
- Tables & QR Module
- Feedback Module
- Products CRUD
- Orders Module
- Reservations Module
- Tenants Module
- Notifications Module
- Menu Upload & Parsing
- Reports Module
- Notifications Controller
- Dev Dependencies
- Menu Parsers Pipeline
- QStash & Env Config
- Package Metadata
- NPM Scripts
- QR Channel & Dine-In Docs
- Runtime Dependencies
- Connection Verification
- QStash & Health Service
- Reports Model
- Pagination Utils
- Backup & Reliability Docs
- Transaction & Audit Docs
- Paymob Payment Integration
- Email Worker
- Env Loader Config
- Express Type Definitions
- QStash Middleware
- Hostinger Deployment Docs
- AI Gateway & n8n
- Tenant Context & RBAC Docs
- Analytics & AI Strategy Docs
- Tenant Provisioning Docs
- Axios Dependency
- Cloudinary Dependency
- Compression Dependency
- Cookie Parser Dependency
- CORS Dependency
- Date-fns Dependency
- Dotenv Dependency
- Envalid Dependency
- Express Dependency
- Rate Limiter Dependency
- Helmet Dependency
- HTTP Status Codes Dependency
- JWT Dependency
- Mammoth Dependency
- Mime Types Dependency
- Mongoose Dependency
- Multer Dependency
- Nanoid Dependency
- Node Cron Dependency
- PDF Parse Dependency
- Pino Logger Dependency
- Pino HTTP Dependency
- QRCode Dependency
- Redis Dependency
- Upstash Redis Dependency
- Upstash Vector Dependency
- UUID Dependency
- Zod Dependency
- Cross Env Dev Dependency
- Nodemon Dev Dependency
- Pino Pretty Dev Dependency
- TSX Dev Dependency
- Types Bcryptjs Dev Dependency
- Types Compression Dev Dependency
- Types Cookie Parser Dev Dependency
- Types Express Dev Dependency
- Types Multer Dev Dependency
- Types Node Dev Dependency
- Types Node Cron Dev Dependency
- Types PDF Parse Dev Dependency
- Types Supertest Dev Dependency
- Types UUID Dev Dependency
- TypeScript Dev Dependency
- Vercel Config
- RAG Vector Catalog Docs
- RAG & AI Stack Docs
- Tech Install Guide Docs
- MongoDB Replica Set Config
- Auth Routes Docs
- System Probes Docs
- Tenants Module Docs
- Feedback Module Docs
- Paymob Integration Docs
- Nginx Deploy Docs
- Health Probes Docs
- Notification Audit Docs
- Reservations Docs
- Tenant Context Docs
- Notification Enrichment Docs
- Billing RBAC Docs
- Cross Module Audit Docs
- QR Menu Styling Docs
- Enterprise Kernel Docs

## God Nodes (most connected - your core abstractions)
1. `logger` - 38 edges
2. `env` - 25 edges
3. `compilerOptions` - 25 edges
4. `tenantQuery` - 24 edges
5. `AppError` - 22 edges
6. `tenantMiddleware()` - 21 edges
7. `authMiddleware()` - 20 edges
8. `AuthService` - 20 edges
9. `rbacMiddleware()` - 19 edges
10. `TableService` - 17 edges

## Surprising Connections (you probably didn't know these)
- `Daily Table Order History Reporting` --conceptually_related_to--> `Pre-Computed Analytical Snapshot Engine`  [INFERRED]
  docs/backend-consistency-and-features-plan.md → README.md
- `POS Offline Batch Sync & Deduplication` --conceptually_related_to--> `Restaurant SaaS Platform`  [EXTRACTED]
  docs/POSTMAN_ENDPOINTS_GUIDE.md → README.md
- `Restaurant SaaS Platform` --references--> `Restaurant SaaS Tech Stack`  [EXTRACTED]
  README.md → docs/00-project-overview.md
- `Single Serverless Bootstrap Entrypoint` --implements--> `Zero-DevOps Cloud Architecture`  [EXTRACTED]
  docs/PROJECT_AUDIT_AND_FIX_PLAN.md → README.md
- `Zero-DevOps Cloud Architecture` --implements--> `PM2 and VPS Infrastructure Removal`  [EXTRACTED]
  README.md → docs/phase-10-qstash-qr-session-pm2-removal.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Serverless Cloud Transformation** — readme_zero_devops_cloud_architecture, docs_phase_10_qstash_qr_session_pm2_removal_qstash_queue_migration, docs_phase_10_qstash_qr_session_pm2_removal_pm2_removal [EXTRACTED 1.00]
- **Cryptographic & Fraud-Proof QR Ordering Pipeline** — docs_phase_9_completion_report_qr_jwt_signing, docs_phase_10_qstash_qr_session_pm2_removal_qr_session_fraud_prevention, docs_phase_11_ai_ordering_hardening_server_side_pricing_engine [EXTRACTED 1.00]
- **Multi-Tenant Isolation Foundation** — docs_project_rules_mandatory_tenant_query_scope, docs_00_project_overview_tenant_room_data_model, docs_phase_1_tenant_auth_foundation_multi_tenant_auth_foundation [EXTRACTED 1.00]
- **Three-Pillar Service Interface Abstraction Architecture** — docs_phase_2_service_interfaces_cache_service, docs_phase_2_service_interfaces_queue_service, docs_phase_2_service_interfaces_realtime_service, docs_restaurant_saas_architecture_service_interface_layer_pattern [EXTRACTED 1.00]
- **Serverless Modernization Cloud Stack & Managed Services Transition** — docs_phase_7_hostinger_golive_vercel_serverless_deployment, docs_phase_8_scale_adjustments_serverless_elastic_concurrency, docs_runbook_cloud_storage_tiering, docs_phase_7_hostinger_golive_zero_devops_philosophy [EXTRACTED 1.00]
- **Dining Table QR Lifecycle, Verification and Accounting Pipeline** — docs_phase_3_core_domain_modules_dining_tables_module, docs_phase_9_fixes_and_enhancements_signed_jwt_qr_tokens, docs_phase_9_fixes_and_enhancements_table_order_history_cleanup, docs_runbook_qr_table_session_operations [INFERRED 0.95]

## Communities (121 total, 64 thin omitted)

### Community 0 - "Chat Sessions & Error Handling"
Cohesion: 0.06
Nodes (43): AppError, TABLE_BINDING_TTL_SECONDS, MenuCatalog, IOrderItem, IOrderItemVariant, OrderChannel, OrderModel, OrderSchema (+35 more)

### Community 1 - "Subscriptions & Plan Guard"
Cohesion: 0.06
Nodes (27): PLAN_TIER, subscriptionGuard(), SubscriptionController, ISubscription, SubscriptionModel, SubscriptionPlan, subscriptionSchema, SubscriptionStatus (+19 more)

### Community 2 - "App Core & Auth Middleware"
Cohesion: 0.09
Nodes (37): authMiddleware(), JwtPayload, optionalAuthMiddleware(), apiRateLimiter, authRateLimiter, CacheRateLimitStore, rbacMiddleware(), requireSuperAdmin() (+29 more)

### Community 3 - "Auth Controller & JWT"
Cohesion: 0.07
Nodes (26): AuthController, IUser, UserModel, userSchema, UserRepository, AuthResponse, AuthService, TokenPair (+18 more)

### Community 4 - "Menu Pricing & Order Calc"
Cohesion: 0.05
Nodes (43): menuRepo, PricedOrder, PricedOrderItem, PricedOrderItemInput, priceOrderItems(), createCustomerOrderHandler(), createOrderHandler(), createQrOrderHandler() (+35 more)

### Community 5 - "Menu Model & Schema"
Cohesion: 0.08
Nodes (23): IMenu, IMenuLayout, IProductSubDoc, ISourceDocument, IVariantOptionSubDoc, IVariantSubDoc, MenuLayoutModel, menuSchema (+15 more)

### Community 6 - "Cloudinary Media Integration"
Cohesion: 0.08
Nodes (29): CloudinaryUploadResult, EntityFolderType, storage, uploadMiddleware, uploadTenantMedia(), CsvParser, RawCategory, DocxParser (+21 more)

### Community 7 - "Channel Adapters"
Cohesion: 0.11
Nodes (17): ChannelAdapter, ChannelName, ChannelRedirectContext, registry, resolveAdapter(), telegram, web, TelegramAdapter (+9 more)

### Community 8 - "TypeScript Config"
Cohesion: 0.06
Nodes (33): compilerOptions, allowSyntheticDefaultImports, declaration, declarationMap, esModuleInterop, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules (+25 more)

### Community 9 - "Service Interfaces Docs"
Cohesion: 0.06
Nodes (34): CacheService Interface, FirestoreRealtimeService Implementation, Queue Definitions & DLQ Topology, QueueService Interface, RabbitMQQueueService Implementation, RealtimeService Interface, RedisCacheService Implementation, Dining Tables Module (+26 more)

### Community 10 - "Categories CRUD"
Cohesion: 0.14
Nodes (15): createCategoryHandler(), deleteCategoryHandler(), getCategoryHandler(), listCategoriesHandler(), service, updateCategoryHandler(), CategoryModel, CategorySchema (+7 more)

### Community 11 - "Customers CRUD"
Cohesion: 0.13
Nodes (15): createCustomerHandler(), deleteCustomerHandler(), getCustomerHandler(), listCustomersHandler(), service, updateCustomerHandler(), CustomerModel, CustomerSchema (+7 more)

### Community 12 - "Variants CRUD"
Cohesion: 0.13
Nodes (16): createVariantHandler(), deleteVariantHandler(), getVariantHandler(), listVariantsHandler(), service, updateVariantHandler(), IVariant, IVariantOption (+8 more)

### Community 13 - "Cache Service Layer"
Cohesion: 0.07
Nodes (4): ICacheService, CacheItem, MemoryCacheService, RedisCacheService

### Community 14 - "Branches CRUD"
Cohesion: 0.14
Nodes (15): createBranchHandler(), deleteBranchHandler(), getBranchHandler(), listBranchesHandler(), service, updateBranchHandler(), BranchModel, BranchSchema (+7 more)

### Community 15 - "Coupons CRUD"
Cohesion: 0.14
Nodes (15): createCouponHandler(), deleteCouponHandler(), listCouponsHandler(), service, updateCouponHandler(), validateCouponHandler(), CouponModel, CouponSchema (+7 more)

### Community 16 - "Employees CRUD"
Cohesion: 0.14
Nodes (15): createEmployeeHandler(), deleteEmployeeHandler(), getEmployeeHandler(), listEmployeesHandler(), service, updateEmployeeHandler(), EmployeeModel, EmployeeSchema (+7 more)

### Community 17 - "Jobs & Realtime Service"
Cohesion: 0.12
Nodes (18): router, MenuModel, realtimeService, BackupJobPayload, processBackupJob(), FirestoreRetryPayload, processFirestoreRetryJob(), InvoiceJobPayload (+10 more)

### Community 18 - "Firestore Realtime Service"
Cohesion: 0.13
Nodes (5): getFirestore(), FirestoreRealtimeService, MemoryRealtimeService, IRealtimeService, { mockEnqueue, capturedMessages }

### Community 19 - "Chat Sessions Controller"
Cohesion: 0.12
Nodes (20): closeSessionHandler(), getByChannelHandler(), getTableContextHandler(), resolveSessionHandler(), saveTableBindingHandler(), router, ByChannelQuery, byChannelQuerySchema (+12 more)

### Community 20 - "Tables & QR Module"
Cohesion: 0.18
Nodes (8): ReservationController, IReservation, ReservationRepository, ReservationService, CreateReservationInput, CreateReservationSchema, UpdateReservationInput, UpdateReservationSchema

### Community 21 - "Feedback Module"
Cohesion: 0.17
Nodes (9): BillingController, BillingRecordModel, billingRecordSchema, BillingStatus, IBillingRecord, BillingRepository, BillingService, CreateBillingRecordInput (+1 more)

### Community 22 - "Products CRUD"
Cohesion: 0.12
Nodes (15): createApp(), errorHandler(), requestLogger(), IChatbotSettings, ITenantContact, ITenantSettings, TenantLanguage, tenantSchema (+7 more)

### Community 23 - "Orders Module"
Cohesion: 0.10
Nodes (20): Interface Layer Principle, MongoDB Source of Truth, Restaurant SaaS Tech Stack, Tenant Room Data Model, QStash Webhook Job Endpoints, Tier-Based Tenant Rate Limiting, Phase 0 Local Environment & Verification, PM2 and VPS Infrastructure Removal (+12 more)

### Community 24 - "Reservations Module"
Cohesion: 0.25
Nodes (9): bootstrapServerless(), vercelHandler(), initFirebase(), disconnectRedis(), getRedisClient(), bootstrap(), shutdown(), logger (+1 more)

### Community 25 - "Tenants Module"
Cohesion: 0.22
Nodes (10): createFeedbackHandler(), listFeedbackHandler(), service, FeedbackModel, FeedbackSchema, IFeedback, FeedbackRepository, FeedbackService (+2 more)

### Community 26 - "Notifications Module"
Cohesion: 0.16
Nodes (6): MemoryQueueService, QueuedMessage, QStashQueueService, EnqueueOptions, IQueueService, MessageHandler

### Community 27 - "Menu Upload & Parsing"
Cohesion: 0.11
Nodes (16): API_RATE_LIMIT_QUOTAS, DEFAULT_TENANT_SETTINGS, ERROR_CODES, ORDER_STATUS_VALUES, ORDER_STATUSES, ORDER_TYPES, OrderStatus, PAYMENT_METHODS (+8 more)

### Community 28 - "Reports Module"
Cohesion: 0.26
Nodes (10): migrateRestaurantToTenant(), seedSuperAdmin(), updateQrRedirectUrl(), connectDatabase(), disconnectDatabase(), redactUri(), NotificationLogModel, notificationLogSchema (+2 more)

### Community 29 - "Notifications Controller"
Cohesion: 0.24
Nodes (8): dispatchNotificationHandler(), listNotificationsHandler(), service, INotificationLog, NotificationRepository, NotificationService, SendNotificationDto, sendNotificationSchema

### Community 30 - "Dev Dependencies"
Cohesion: 0.13
Nodes (15): devDependencies, supertest, ts-node, @types/cors, @types/jsonwebtoken, @types/mime-types, @types/qrcode, vitest (+7 more)

### Community 31 - "Menu Parsers Pipeline"
Cohesion: 0.20
Nodes (11): getParserForMime(), IMenuUploadStatus, MenuUploadStatusModel, UploadSourceType, uploadStatusSchema, UploadStatusValue, MenuIngestionJobPayload, menuService (+3 more)

### Community 32 - "QStash & Env Config"
Cohesion: 0.26
Nodes (6): env, secureSecret, queueService, PLATFORM_QUEUES, PlatformQueueName, QueueDefinition

### Community 33 - "Package Metadata"
Cohesion: 0.18
Nodes (10): author, description, directories, test, keywords, license, main, name (+2 more)

### Community 34 - "NPM Scripts"
Cohesion: 0.20
Nodes (10): scripts, build, build:clean, build:prod, dev, seed:admin, setup:qstash-schedules, start (+2 more)

### Community 35 - "QR Channel & Dine-In Docs"
Cohesion: 0.20
Nodes (10): Chat Sessions Table Binding, POS Menu Tables & Kitchen Operations Routes, QR Channel DINE_IN Unification & TableId Refinement, Hot vs Cold Order Archival Pipeline, Redis QR Table Session Fraud Prevention, Server-Side Pricing Engine & Strict Order Schema, Cryptographic QR JWT Signing, Postman Collection & API Guide (+2 more)

### Community 36 - "Runtime Dependencies"
Cohesion: 0.22
Nodes (9): dependencies, bcryptjs, firebase-admin, resend, @upstash/qstash, bcryptjs, firebase-admin, resend (+1 more)

### Community 37 - "Connection Verification"
Cohesion: 0.56
Nodes (8): checkFirebase(), checkMongo(), checkQStash(), checkRedis(), errors, fail(), main(), pass()

### Community 38 - "QStash & Health Service"
Cohesion: 0.28
Nodes (4): getQStashClient(), HealthResult, HealthService, ServiceHealth

### Community 39 - "Reports Model"
Cohesion: 0.36
Nodes (4): IReportSnapshot, ReportSnapshotModel, reportSnapshotSchema, ReportRepository

### Community 40 - "Pagination Utils"
Cohesion: 0.32
Nodes (7): buildPaginatedResponse(), PaginatedResponse, PaginationMeta, paginationMiddleware(), PaginationQuery, parsePagination(), sendPaginated()

### Community 41 - "Backup & Reliability Docs"
Cohesion: 0.25
Nodes (8): Backup & Restore Drill Completeness Audit, MongoDB Off-Server Backup Strategy, Redis AOF Persistence Policy, Disaster Restore Drill Procedure, MongoDB Atlas Point-in-Time Restore Runbook, Disaster Recovery Cloud Storage Tiering Matrix, Upstash QStash Schedule Recovery Runbook, Upstash Redis Failover & Recovery Runbook

### Community 42 - "Transaction & Audit Docs"
Cohesion: 0.25
Nodes (8): Menu Bulk-Import Transaction Fallback Audit, n8n Webhook Signature Verification Audit, withTransactionOrFallback Shared Pattern, AI Menu Onboarding & Ingestion Pipeline, Cloudinary Document & Media Integration, n8n Workflow Automation Bridge, Manager AI Chatbot Kill-Switch & Status Gateway, Atomic Tenant Creation with Default Subscription

### Community 43 - "Paymob Payment Integration"
Cohesion: 0.29
Nodes (5): PaymobAuthResponse, PaymobOrderResponse, PaymobPaymentKeyResponse, PaymobWebhookPayload, NOTE: As per project rules and user instructions, Paymob is NOT currently active

### Community 44 - "Email Worker"
Cohesion: 0.47
Nodes (5): EmailJobPayload, EmailTemplateType, generateHtmlContent(), getResendClient(), processEmailJob()

### Community 45 - "Env Loader Config"
Cohesion: 0.40
Nodes (4): cwd, fallbackPath, preferredPath, result

### Community 46 - "Express Type Definitions"
Cohesion: 0.40
Nodes (4): AuthUser, Express, Request, UserRole

### Community 48 - "Hostinger Deployment Docs"
Cohesion: 0.50
Nodes (4): Hostinger Custom Domain DNS Mapping, Vercel Serverless Cloud Deployment, Zero-DevOps Serverless SaaS Philosophy, Serverless Elastic Horizontal Concurrency

### Community 49 - "AI Gateway & n8n"
Cohesion: 0.67
Nodes (3): Cloud AI & n8n RAG Automation Gateways, Action-Oriented AI Dining Assistant, n8n Cloud AI Gateway

### Community 50 - "Tenant Context & RBAC Docs"
Cohesion: 0.67
Nodes (3): Body-Based Tenant Context Requirement, Super Admin Only Billing & Subscription RBAC, Billing Target Tenant Existence Check

### Community 51 - "Analytics & AI Strategy Docs"
Cohesion: 0.67
Nodes (3): Daily Table Order History Reporting, AI Revenue & Smart Margin Advisor, Pre-Computed Analytical Snapshot Engine

### Community 52 - "Tenant Provisioning Docs"
Cohesion: 0.67
Nodes (3): Default Branch Auto-Provisioning on Signup, Mongoose Transaction Session Threading Fix, Atomic Tenant & Subscription Provisioning

## Knowledge Gaps
- **319 isolated node(s):** `name`, `version`, `description`, `main`, `test` (+314 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **64 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `tenantQuery` connect `Chat Sessions & Error Handling` to `Subscriptions & Plan Guard`, `Auth Controller & JWT`, `Menu Pricing & Order Calc`, `Menu Model & Schema`, `Reports Model`, `Categories CRUD`, `Customers CRUD`, `Variants CRUD`, `Branches CRUD`, `Coupons CRUD`, `Employees CRUD`, `Feedback Module`, `Tenants Module`, `Notifications Controller`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Why does `AppError` connect `Chat Sessions & Error Handling` to `Subscriptions & Plan Guard`, `Auth Controller & JWT`, `Menu Pricing & Order Calc`, `Cloudinary Media Integration`, `Categories CRUD`, `Customers CRUD`, `Variants CRUD`, `Branches CRUD`, `Coupons CRUD`, `Employees CRUD`, `Chat Sessions Controller`, `Feedback Module`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Why does `logger` connect `Reservations Module` to `QStash & Env Config`, `Chat Sessions & Error Handling`, `App Core & Auth Middleware`, `Subscriptions & Plan Guard`, `Menu Model & Schema`, `QStash & Health Service`, `Cloudinary Media Integration`, `Email Worker`, `QStash Middleware`, `Jobs & Realtime Service`, `Firestore Realtime Service`, `Reports Module`, `Menu Parsers Pipeline`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **What connects `name`, `version`, `description` to the rest of the system?**
  _319 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Chat Sessions & Error Handling` be split into smaller, more focused modules?**
  _Cohesion score 0.05506549051055867 - nodes in this community are weakly interconnected._
- **Should `Subscriptions & Plan Guard` be split into smaller, more focused modules?**
  _Cohesion score 0.05879917184265011 - nodes in this community are weakly interconnected._
- **Should `App Core & Auth Middleware` be split into smaller, more focused modules?**
  _Cohesion score 0.09471153846153846 - nodes in this community are weakly interconnected._