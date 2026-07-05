export interface Paginated<T> {
    data: T[];
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
}


export interface ApiResponse<T> {
    data: T;
    message?: string;
    status: boolean;
    statusCode: number;
}