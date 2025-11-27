export type ApiResponse<T> = {
    success: boolean
    timestamp: string
    path: string
    data: T
}

export type PaginatedApiResponse<T> = Omit<ApiResponse<T>, 'data'> & {
    data: Array<T>
    totalItems: number
    totalPages: number
    itemsPerPage: number
    currentPage: number
}
