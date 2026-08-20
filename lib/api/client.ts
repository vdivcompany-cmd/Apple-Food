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
  tenantId: string;
  branchId: string;
  tableId: string;
  tableNumber: string;
  sessionId: string;
  tableSessionId?: string;
  channel?: string;
}

export interface TableContextData {
  tenantId: string;
  branchId: string;
  tableId: string;
  tableSessionId: string;
  tableNumber?: string;
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
}

export interface PlaceOrderPayload {
  tenantId: string;
  branchId: string;
  tableId: string;
  tableSessionId: string;
  items: PlaceOrderItemInput[];
}

export interface PlacedOrderData {
  _id: string;
  tenantId: string;
  branchId: string;
  tableId: string;
  tableSessionId: string;
  items: Array<{
    productId: string | { _id: string; name: string };
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    selectedVariants?: any[];
  }>;
  totalAmount: number;
  status: "placed" | "preparing" | "ready" | "delivered" | "cancelled";
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

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  try {
    const res = await fetch(url, { ...options, headers });
    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMsg =
        json.message ||
        (json.errors && json.errors.length > 0 ? json.errors[0].message : null) ||
        `Request failed with status ${res.status}`;
      throw new ApiError(errorMsg, res.status, json);
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
   * 1. Resolve/create session
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
        channelUserId: params.channelUserId,
      }),
    });
  },

  /**
   * 2. Get session context
   * GET /api/v1/chat-sessions/context/{chatId}
   */
  async getSessionContext(chatId: string): Promise<ApiResponse<TableContextData>> {
    return request<ApiResponse<TableContextData>>(`/api/v1/chat-sessions/context/${encodeURIComponent(chatId)}`);
  },

  /**
   * 3. Save table session
   * POST /api/v1/chat-sessions/save-table
   */
  async saveTableSession(payload: {
    chatId: string;
    tableId: string;
    tenantId: string;
    tableSessionId: string;
  }): Promise<ApiResponse<{ saved: boolean }>> {
    return request<ApiResponse<{ saved: boolean }>>("/api/v1/chat-sessions/save-table", {
      method: "POST",
      body: JSON.stringify(payload),
    });
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
  async getMenuSourceDocuments(tenantId: string): Promise<ApiResponse<MenuSourceDocument[]>> {
    return request<ApiResponse<MenuSourceDocument[]>>(`/api/v1/menu/source-documents/${encodeURIComponent(tenantId)}`);
  },

  /**
   * 6. Branch info
   * GET /api/v1/tenants/{tenantId}/branches/{branchId}/info
   */
  async getBranchInfo(tenantId: string, branchId: string): Promise<ApiResponse<BranchInfoData>> {
    return request<ApiResponse<BranchInfoData>>(
      `/api/v1/tenants/${encodeURIComponent(tenantId)}/branches/${encodeURIComponent(branchId)}/info`
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
      )}&limit=${limit}&channel=DINE_IN`
    );
  },

  /**
   * 8. Place order
   * POST /api/v1/orders/qr
   * Rules:
   * - Only send productId/variantId from Search Menu response.
   * - Never send price.
   */
  async placeOrder(payload: PlaceOrderPayload): Promise<ApiResponse<PlacedOrderData>> {
    return request<ApiResponse<PlacedOrderData>>("/api/v1/orders/qr", {
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
      `/api/v1/orders/${encodeURIComponent(orderId)}?tenantId=${encodeURIComponent(tenantId)}`
    );
  },

  /**
   * 10. Get full public menu with categories & products
   * GET /api/v1/menu?tenantId={tenantId}
   */
  async getPublicMenu(tenantId: string): Promise<ApiResponse<PublicMenuData>> {
    return request<ApiResponse<PublicMenuData>>(`/api/v1/menu?tenantId=${encodeURIComponent(tenantId)}`);
  },
};
