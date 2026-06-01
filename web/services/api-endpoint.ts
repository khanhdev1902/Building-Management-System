export const API_ENDPOINTS = {
  AUTH: "/auth",
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  REGISTER: "/auth/register",
  ME: "/auth/me",
  PROFILE: "/auth/profile",
  CART: "/cart",
  CART_ITEMS: (productVariantId: number) => `/cart/items/${productVariantId}`,
  CHECKOUT: "/checkout",
  REFRESH_TOKEN: "/auth/refresh-token",
  ORDER: "/orders",
  ORDERCART: "/orders/cart",
  ORDERBUYNOW: "/orders/buynow",
  USERADDRESS: "/addresses",
  PAYMENT_ORDERCODE: (orderCode: string) => `/payment/${orderCode}`,
  SERVICES: "/services",
  SERVICE_DETAIL: (id: string) => `/services/${id}`,
  ROOMS: "/rooms",
  ROOM_DETAIL: (id: string) => `/rooms/${id}`,

  ASSETS: "/assets",
  ASSET_DETAIL: (id: string) => `/assets/${id}`,
  ROOM_ASSETS: "/assets/room-assets/all",
  ROOM_ASSETS_DETAIL: (id: string) => `/assets/room-assets/${id}`,

  TENANTS: "users/tenants",
  TENANT_DETAIL: (id: string) => `users/tenants/${id}`,

  // ================= CONTRACTS =================
  CONTRACTS: "/contracts",
  CONTRACT_DETAIL: (id: string) => `/contracts/${id}`,
  CONTRACT_RENEW: (id: string) => `/contracts/${id}/renew`,
  CONTRACT_TERMINATE: (id: string) => `/contracts/${id}/terminate`,

  UTILITIES: "/utilities",
  UTILITY_DETAIL: (roomId: string) => `/utilities/${roomId}`,
  UTILITY_METER_READING: "/utilities/meter-reading",
} as const;
