# Product Requirements Document (PRD)
## TableChat AI Waiter App

**Version:** 1.1.0  
**Status:** Approved / Ready for Scaffolding (Phase 2)  
**Stitch App ID:** `17711231060904158057`  

---

## 1. Product Summary & Purpose
**TableChat AI Waiter** is a web-based, AI-driven dining assistant and smart ordering application for dine-in restaurant guests. When customers scan a QR code at their table, TableChat provides a conversational AI waiter experience that helps them explore the menu, ask dietary and ingredient questions, receive personalized recommendations in plain text, manage their table order, and track order status from kitchen preparation to table delivery.

---

## 2. Target Users & Personas

1. **The Fast & Direct Diner:**
   - Wants quick ordering, knows what they want or wants to reorder previous meals.
   - Values speed, clarity, and access to order tracking.

2. **The Inquisitive / Dietary-Constrained Diner:**
   - Asks questions about allergies, gluten-free/vegan options, spice levels, or dish ingredients.
   - Values conversational AI recommendations and advice.

3. **The Social Table Group:**
   - Diners ordering across different courses, sharing items, or adding extras incrementally.
   - Values responsive conversational feedback and order status visibility.

---

## 3. Core User Flows & Routing Architecture

### Flow Diagram
```mermaid
graph TD
    A[Customer Scans QR Code at Table] --> B["Welcome & Empty Chat (/)"]
    B -->|Starts Chat / Quick Prompts| C["Active AI Conversation (/)"]
    C -->|Asks Questions / Browses| C
    C -->|Places Order to Kitchen| C
    C -->|Manually Navigates to Tracking (Button/Nav)| D["My Order Tracking (/tracking)"]
    D -->|Navigates Back to Chat| C
    A -.->|Session Expired / Invalid Token| E["Session Expired State (/expired)"]
    E -->|Rescan QR Code| B
```

### Routing Strategy
1. **Responsive Main Routes (Auto-adapts to Viewport):**
   - `/` — Main Experience (Empty state when chat is empty; switches to active conversation once message is sent. Reflows between desktop split-view and mobile layout).
   - `/tracking` — My Order Tracking view (status stepper, order summary, bill request).
   - `/expired` — Session Expired / Invalid QR code state.

2. **Dedicated Demo / Isolation Routes (`/demo/...`):**
   - `/demo/welcome-desktop` — Screen #2: Desktop Welcome & Empty Chat in isolation.
   - `/demo/active-chat-desktop` — Screen #1: Desktop Active AI Conversation in isolation.
   - `/demo/active-chat-mobile` — Screen #4: Mobile Active Chat in isolation.
   - `/demo/order-tracking-mobile` — Screen #5: Mobile My Order Tracking in isolation.
   - `/demo/session-expired` — Screen #6: Session Expired State in isolation.
   - `/demo/design-system` — Screen #3: Design System tokens and component catalog.

---

## 4. Feature List per Screen (Functional Requirements)

### Screen 1: Active AI Conversation (Desktop)
* **ID:** `0cbd0e5bc2524016a3bfedfede29e8b3`
* **Layout:** Desktop split view (Chat pane + Side panel for Order context / quick details).
* **Functional Features:**
  - Full chat stream history between diner and AI Waiter.
  - Plain text dish recommendations and dietary answers from the AI.
  - Multi-turn conversational memory display.
  - Sticky header with Table number, Restaurant name, and navigation link to Order Tracking.
  - Manual action button to view Order Tracking once an order is placed.

### Screen 2: Welcome & Empty Chat (Desktop)
* **ID:** `44b4085b4ac24378a4b577bb78644de3`
* **Layout:** Desktop clean landing state before conversation begins.
* **Functional Features:**
  - Warm table greeting (e.g., *"Welcome! Table 04 is ready"*).
  - Quick action prompt chips (e.g., *"View Popular Dishes"*, *"Chef's Specials"*, *"Vegetarian Options"*). Clicking a chip populates and sends the initial chat query.
  - Prominent message input field with send button and mic icon.
  - Restaurant branding and table metadata.

### Screen 3: Design System Catalog
* **ID:** `asset-stub-assets_2229db5ef58d472493cdce32c13b9e1a`
* **Functional Scope:**
  - Token reference for colors (*Terracotta Amber #FF6B00, Cream #FDFBF7, Charcoal #121212, Surface White #FFFFFF*), typography (*Plus Jakarta Sans*), 8px rhythm, border radii, shadows, and base primitives.

### Screen 4: Active Chat (Mobile)
* **ID:** `8985cd179b5e42f28399cf81a8a24425`
* **Layout:** Mobile-optimized vertical chat view with bottom input area.
* **Functional Features:**
  - Mobile chat stream with auto-scroll on new messages.
  - AI message bubbles delivering plain text answers and recommendations.
  - User message bubbles aligned right.
  - Sticky bottom input bar with send button and quick prompt pills.
  - Compact top app bar with Table Number, Call Waiter button, and Order Tracking link.

### Screen 5: My Order Tracking (Mobile)
* **ID:** `7c942cd2e07346ed85471e3dcacfdba1`
* **Layout:** Mobile order status dashboard.
* **Functional Features:**
  - Visual progress stepper (*Order Placed → Kitchen Preparing → Ready to Serve → Delivered*).
  - Estimated preparation time badge.
  - Itemized order list with quantities, item names, and total price calculation.
  - "Back to Chat" navigation button.
  - "Request Bill / Pay" trigger button.

### Screen 6: Session Expired State
* **ID:** `6885bc35e3e542f69d85bed6e358fd4f`
* **Layout:** Mobile/Desktop fallback error & re-engagement screen.
* **Functional Features:**
  - Friendly session expiry notice explaining that the dining session has timed out.
  - Primary CTA: *"Scan Table QR Code"* to resume.
  - Secondary fallback: manual table code / PIN input.

---

## 5. Technology Stack & Architecture

* **Framework:** Next.js 14+ (App Router, TypeScript).
* **Styling:** Tailwind CSS (configured in Phase 3 with design tokens).
* **State Management:** React Context API (`SessionContext`, `ChatContext`, `OrderContext`).
* **Mock Data Layer:**
  - `mockMenu.ts` — Food catalog items, categories, descriptions, prices.
  - `mockChat.ts` — Initial conversations, pre-configured conversational text replies.
  - `mockOrder.ts` — Placed order structure, status progression, item breakdown.
  - `mockSession.ts` — Table number, tenant/restaurant info, session validity.

---

## 6. Confirmed Implementation Decisions

1. **Routing:** Responsive main routes (`/`, `/tracking`, `/expired`) + isolated `/demo/...` routes for all 6 Stitch screens.
2. **AI Responses:** Plain text format for recommendations and dietary queries (interactive "Add +" card triggers deferred to future iterations).
3. **Order Lifecycle Navigation:** No automatic redirects on order placement — user stays in the conversation context and manually clicks through to `/tracking` when desired.

---

## 7. Out of Scope for Initial Phases

* Live external backend API calls (mock data used).
* Live LLM API streaming (mocked client-side logic used).
* Real payment gateway integration.
