export interface APIResponse {
  success: boolean;
  status: string;
  code: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  error?: {
    message: string;
  };
  message: string;
  timestamp: string;
}
