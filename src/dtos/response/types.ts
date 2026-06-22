export interface ApiResponse<T> {
    success: boolean;
    statusCode: number;
    data: T;
    message: string;
    error?: any;
}

export interface MessageResponse {
    message: string;
}

export interface pagination {
    page?: number,
    limit?: number
}
