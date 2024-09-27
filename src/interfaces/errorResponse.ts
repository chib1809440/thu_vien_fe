export interface ErrorResponse {
    message: string | string[],
    path: string
    statusCode?: number;
    timestamp: string;
}