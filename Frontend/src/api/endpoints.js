export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    ME: "/auth/me",
  },

  CASES: {
    LIST: "/cases",
    CREATE: "/cases",
    DETAIL: (id) => `/cases/${id}`,
  },

  DOCUMENTS: {
    UPLOAD: "/documents/upload",
    DETAIL: (id) => `/documents/${id}`,
    DOWNLOAD: (id) => `/documents/${id}/download`,
    VERIFY: (id) => `/documents/${id}/verify`,
    VERSION: (id) => `/documents/${id}/version`,
    VERSIONS: (id) => `/documents/${id}/versions`,
  },

  AUDIT: {
    LOGS: "/audit-logs",
  },

  SECURITY: {
    EVENTS: "/security-events",
    RESOLVE: (id) => `/security-events/${id}/resolve`,
  },
};