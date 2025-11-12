export type ApiResponse<T> = {
    success: boolean
    timestamp: string
    path: string
    data: T
}

export type PaginatedApiResponse<T> = ApiResponse<T> & {
    data: T[]
    totalItems: number
    totalPages: number
    itemsPerPage: number
    currentPage: number
}
