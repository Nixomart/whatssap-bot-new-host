export interface ApiResponse<T> {
    status: string;
    status_code?: number;
    message: string;
    data?: T;
}