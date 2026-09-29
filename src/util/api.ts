class ApiResponse {
  public statusCode: number;
  public message: string;
  public data: any;
  public success: boolean;
  public meta?: any;

  constructor(statusCode: number, message: string, data: any, meta?: any) {
    this.statusCode = statusCode;
    this.message = message;
    this.success = statusCode < 400;
    this.data = data;
    this.meta = meta;
  }
}

export { ApiResponse };
