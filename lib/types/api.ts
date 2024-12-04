export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: any;
}

export interface ChatRequest {
  message: string;
  token: string;
  section?: string;
  useHistory?: boolean;
}

export interface ChatResponse {
  response: string;
}

export interface UsernameResponse {
  token?: string;
  username?: string;
}

export interface HistoryResponse {
  history: ChatMessage[];
  title: string | null;
}

export interface ConversationResponse {
  conversation: string;
  title: string | null;
}