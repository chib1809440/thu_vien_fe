export interface ErrorResponse {
    message: string | string[],
    path: string
    statusCode?: 500;
    timestamp: string;
}