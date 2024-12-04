export const config = {
  maxHistoryLength: 50,
  maxMessageLength: 4000,
  maxTitleLength: 100,
  defaultSection: '1',
  rateLimits: {
    messagesPerMinute: 20,
    messagesPerHour: 200,
  },
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || '',
    timeout: 30000,
  },
};