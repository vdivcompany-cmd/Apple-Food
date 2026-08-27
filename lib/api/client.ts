/**
 * API Client for Restaurant SaaS Platform Backend
 * Base URL: https://restaurant-saas-platform-backend.vercel.app
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://restaurant-saas-platform-backend.vercel.app";

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  errors?: Array<{ field: string; message: string }>;
}

export interface SessionResolveResponse {
  chatId: string;
  tenantId: string;
  branchId: string;
  tableId: string;
  tableNumber: string | number;
  sessionId: string;
  tableSessionId?: string;
  channel?: string;
  startedAt?: number;
}

export interface TableContextData {
  tenantId: string;
  branchId: string;
  tableId: string;
  tableSessionId: string;
  tableNumber?: string | number;
}

export interface BranchInfoData {
  tenant: {
    id: string;
    name: string;
    brandName?: string;
    slug?: string;
    cuisineType?: string;
    currency: string;
    timezone?: string;
  };
  branch: {
    id: string;
    name: string;
    address?: string;
    phone?: string;
  };
}

export interface MenuSourceDocument {
  url: string;
  publicId?: string;
  fileType?: string;
  originalFilename?: string;
  uploadedAt?: string;
}

export interface PublicMenuVariant {
  _id: string;
  name: string;
  minSelect?: number;
  maxSelect?: number;
  options?: Array<{
    name: string;
    price: number;
    additionalPrice?: number;
  }>;
}

export interface PublicMenuProduct {
  _id: string;
  name: string;
  description?: string;
  basePrice: number;
  categoryId: string;
  categoryName?: string;
  isAvailable?: boolean;
  imageUrl?: string;
  variants?: PublicMenuVariant[];
  variantIds?: PublicMenuVariant[];
}

export interface PublicMenuCategory {
  id: string;
  name: string;
  displayOrder?: number;
  products: PublicMenuProduct[];
}

export interface PublicMenuData {
  tenantId: string;
  categories: PublicMenuCategory[];
}

export interface SearchedProduct {
  productId: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  variants?: Array<{
    variantId: string;
    name: string;
    price: number;
    options?: string[];
  }>;
  variantId?: string;
  availability?: boolean;
}

export interface PlaceOrderItemInput {
  productId: string;
  quantity: number;
  variantId?: string;
  selectedOptionNames?: string[];
  notes?: string;
}

export interface PlaceOrderPayload {
  tenantId: string;
  branchId: string;
  tableId: string;
  tableSessionId: string;
  tableNumber?: string | number;
  customerName?: string;
  customerPhone?: string;
  couponCode?: string;
  items: PlaceOrderItemInput[];
}

export interface PlaceCustomerOrderPayload {
  tenantId: string;
  branchId?: string;
  channel: "TAKEAWAY" | "DELIVERY";
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  couponCode?: string;
  deliveryAddress?: string;
  notes?: string;
  items: PlaceOrderItemInput[];
}

export interface CreateFeedbackPayload {
  tenantId: string;
  branchId?: string;
  orderId?: string;
  rating: number; // 1 to 5
  comment?: string;
  customerName?: string;
}

export interface CouponValidationResponse {
  valid: boolean;
  coupon?: {
    id: string;
    code: string;
    discountType: string;
    discountValue: number;
    discountPercentage?: number;
  };
  discountAmount?: number;
  discountPercentage?: number;
  subtotal?: number;
  newTotal?: number;
  reason?: string;
}


export interface PlacedOrderData {
  _id: string;
  orderNumber?: string;
  tenantId: string;
  branchId: string;
  channel?: "DINE_IN" | "TAKEAWAY" | "DELIVERY" | "QR" | "WEB" | "TELEGRAM";
  tableId?: string;
  tableSessionId?: string;
  customerName?: string;
  customerPhone?: string;
  deliveryAddress?: string;
  items: Array<{
    productId: string | { _id: string; name: string };
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    selectedVariants?: any[];
  }>;
  subtotal?: number;
  taxAmount?: number;
  totalAmount: number;
  status:
    | "PENDING"
    | "PREPARING"
    | "READY"
    | "SERVED"
    | "PAID"
    | "CANCELLED"
    | "placed"
    | "preparing"
    | "ready"
    | "delivered"
    | "cancelled";
  estimatedMinutes?: number;
  createdAt: string;
}

export class ApiError extends Error {
  statusCode: number;
  data?: any;

  constructor(message: string, statusCode: number, data?: any) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.data = data;
  }
}

// Dual-layer cache (In-Memory + localStorage) for instant 0ms rendering across reloads
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const memoryCache = new Map<string, CacheEntry<any>>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour persistent cache TTL for public menu catalogs
const STORAGE_CACHE_PREFIX = "tablechat_apicache_";

export interface ExtendedRequestInit extends RequestInit {
  useCache?: boolean;
  ttlMs?: number;
  forceRefresh?: boolean;
}

async function request<T>(endpoint: string, options: ExtendedRequestInit = {}): Promise<T> {
  const isGet = !options.method || options.method.toUpperCase() === "GET";
  const cacheKey = endpoint;
  const ttl = options.ttlMs || CACHE_TTL_MS;

  // 1. Check in-memory client cache
  if (isGet && options.useCache !== false && !options.forceRefresh) {
    const cached = memoryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data as T;
    }

    // 2. Check localStorage persistent cache if memory was cleared on reload
    if (typeof window !== "undefined") {
      try {
        const storedStr = localStorage.getItem(`${STORAGE_CACHE_PREFIX}${cacheKey}`);
        if (storedStr) {
          const stored: CacheEntry<T> = JSON.parse(storedStr);
          if (stored && Date.now() - stored.timestamp < ttl) {
            memoryCache.set(cacheKey, stored);
            return stored.data;
          }
        }
      } catch {}
    }
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  try {
    const res = await fetch(url, { ...options, headers });
    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      if (res.status === 403 || res.status === 401) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("tablechat:session-expired"));
        }
      }
      const errorMsg =
        json.message ||
        (json.errors && json.errors.length > 0 ? json.errors[0].message : null) ||
        `Request failed with status ${res.status}`;
      throw new ApiError(errorMsg, res.status, json);
    }

    // 3. Cache successful GET responses in memory and localStorage
    if (isGet && options.useCache !== false) {
      const entry = { data: json, timestamp: Date.now() };
      memoryCache.set(cacheKey, entry);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(`${STORAGE_CACHE_PREFIX}${cacheKey}`, JSON.stringify(entry));
        } catch {}
      }
    }

    return json as T;
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error.message || "Network error occurred", 500);
  }
}

export const apiClient = {
  /**
   * 1. Resolve/create session (server-minted chatId)
   * POST /api/v1/chat-sessions/resolve
   */
  async resolveSession(params: {
    token: string;
    channel?: string;
    channelUserId?: string;
  }): Promise<ApiResponse<SessionResolveResponse>> {
    return request<ApiResponse<SessionResolveResponse>>("/api/v1/chat-sessions/resolve", {
      method: "POST",
      body: JSON.stringify({
        token: params.token,
        channel: params.channel || "web",
        ...(params.channelUserId ? { channelUserId: params.channelUserId } : {}),
      }),
    });
  },

  /**
   * 2. Revalidate session by channel and chatId
   * GET /api/v1/chat-sessions/by-channel?channel={channel}&channelUserId={chatId}
   */
  async revalidateSession(chatId: string, channel: string = "web"): Promise<ApiResponse<SessionResolveResponse>> {
    return request<ApiResponse<SessionResolveResponse>>(
      `/api/v1/chat-sessions/by-channel?channel=${encodeURIComponent(channel)}&channelUserId=${encodeURIComponent(chatId)}`,
      { useCache: false }
    );
  },

  /**
   * 3. Get session context
   * GET /api/v1/chat-sessions/context/{chatId}
   */
  async getSessionContext(chatId: string): Promise<ApiResponse<TableContextData>> {
    return request<ApiResponse<TableContextData>>(`/api/v1/chat-sessions/context/${encodeURIComponent(chatId)}`);
  },

  /**
   * 4. Search menu / knowledge base
   * POST /api/v1/chat-sessions/search
   */
  async searchMenu(params: {
    sessionId: string;
    query: string;
    topK?: number;
  }): Promise<ApiResponse<SearchedProduct[]>> {
    return request<ApiResponse<SearchedProduct[]>>("/api/v1/chat-sessions/search", {
      method: "POST",
      body: JSON.stringify({
        sessionId: params.sessionId,
        query: params.query,
        topK: params.topK || 5,
      }),
    });
  },

  /**
   * 5. Menu source documents (Cloudinary Hosted)
   * GET /api/v1/menu/source-documents/{tenantId}
   */
  async getMenuSourceDocuments(tenantId: string, forceRefresh = false): Promise<ApiResponse<MenuSourceDocument[]>> {
    return request<ApiResponse<MenuSourceDocument[]>>(
      `/api/v1/menu/source-documents/${encodeURIComponent(tenantId)}`,
      { forceRefresh, ttlMs: 10 * 60 * 1000 }
    );
  },

  /**
   * 6. Branch info
   * GET /api/v1/tenants/{tenantId}/branches/{branchId}/info
   */
  async getBranchInfo(tenantId: string, branchId: string, forceRefresh = false): Promise<ApiResponse<BranchInfoData>> {
    return request<ApiResponse<BranchInfoData>>(
      `/api/v1/tenants/${encodeURIComponent(tenantId)}/branches/${encodeURIComponent(branchId)}/info`,
      { forceRefresh, ttlMs: 10 * 60 * 1000 }
    );
  },

  /**
   * 7. Table order history
   * GET /api/v1/tables/{tableId}/history?tenantId={tenantId}&limit=50&channel=DINE_IN
   */
  async getTableOrderHistory(
    tableId: string,
    tenantId: string,
    limit: number = 50
  ): Promise<ApiResponse<PlacedOrderData[]>> {
    return request<ApiResponse<PlacedOrderData[]>>(
      `/api/v1/tables/${encodeURIComponent(tableId)}/history?tenantId=${encodeURIComponent(
        tenantId
      )}&limit=${limit}&channel=DINE_IN`,
      { useCache: false }
    );
  },

  /**
   * 8. Place Dine-In QR order
   * POST /api/v1/orders/qr
   */
  async placeOrder(payload: PlaceOrderPayload): Promise<ApiResponse<PlacedOrderData>> {
    return request<ApiResponse<PlacedOrderData>>("/api/v1/orders/qr", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * 8b. Place Takeaway or Delivery customer order
   * POST /api/v1/orders/customer
   */
  async placeCustomerOrder(payload: PlaceCustomerOrderPayload): Promise<ApiResponse<PlacedOrderData>> {
    return request<ApiResponse<PlacedOrderData>>("/api/v1/orders/customer", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * 9. Get single order status
   * GET /api/v1/orders/{orderId}?tenantId={tenantId}
   */
  async getOrderStatus(orderId: string, tenantId: string): Promise<ApiResponse<PlacedOrderData>> {
    return request<ApiResponse<PlacedOrderData>>(
      `/api/v1/orders/${encodeURIComponent(orderId)}?tenantId=${encodeURIComponent(tenantId)}`,
      { useCache: false }
    );
  },

  /**
   * 10. Get full menu catalog with categories & products
   * GET /api/v1/menu/catalog?tenantId={tenantId}
   */
  async getPublicMenu(tenantId: string, forceRefresh = false): Promise<ApiResponse<PublicMenuData>> {
    return request<ApiResponse<PublicMenuData>>(
      `/api/v1/menu/catalog?tenantId=${encodeURIComponent(tenantId)}`,
      { forceRefresh, ttlMs: 10 * 60 * 1000 }
    );
  },

  async getMenuCatalog(tenantId: string, forceRefresh = false): Promise<ApiResponse<PublicMenuData>> {
    return request<ApiResponse<PublicMenuData>>(
      `/api/v1/menu/catalog?tenantId=${encodeURIComponent(tenantId)}`,
      { forceRefresh, ttlMs: 10 * 60 * 1000 }
    );
  },

  /**
   * 11. Validate Coupon code
   * GET /api/v1/coupons/validate?tenantId={tenantId}&code={code}&subtotal={subtotal}
   */
  async validateCoupon(tenantId: string, code: string, subtotal?: number): Promise<CouponValidationResponse> {
    const subtotalParam = subtotal !== undefined ? `&subtotal=${encodeURIComponent(subtotal)}` : "";
    return request<CouponValidationResponse>(
      `/api/v1/coupons/validate?tenantId=${encodeURIComponent(tenantId)}&code=${encodeURIComponent(code)}${subtotalParam}`,
      { useCache: false }
    );
  },

  /**
   * 12. Submit Customer Feedback
   * POST /api/v1/feedback
   */
  async createFeedback(payload: CreateFeedbackPayload): Promise<ApiResponse<any>> {
    return request<ApiResponse<any>>("/api/v1/feedback", {
      method: "POST",
      headers: {
        "X-Tenant-ID": payload.tenantId,
      },
      body: JSON.stringify(payload),
    });
  },


  /**
   * Synchronously retrieve cached data from memory or localStorage (0ms initial mount helper)
   */
  getCached<T>(endpoint: string): T | null {
    const memory = memoryCache.get(endpoint);
    if (memory && Date.now() - memory.timestamp < CACHE_TTL_MS) {
      return memory.data as T;
    }
    if (typeof window !== "undefined") {
      try {
        const storedStr = localStorage.getItem(`${STORAGE_CACHE_PREFIX}${endpoint}`);
        if (storedStr) {
          const stored: CacheEntry<T> = JSON.parse(storedStr);
          if (stored && Date.now() - stored.timestamp < CACHE_TTL_MS) {
            memoryCache.set(endpoint, stored);
            return stored.data;
          }
        }
      } catch {}
    }
    return null;
  },

  /**
   * Clear in-memory and persistent client cache
   */
  clearCache() {
    memoryCache.clear();
    if (typeof window !== "undefined") {
      try {
        Object.keys(localStorage)
          .filter((k) => k.startsWith(STORAGE_CACHE_PREFIX))
          .forEach((k) => localStorage.removeItem(k));
      } catch {}
    }
  },
};
