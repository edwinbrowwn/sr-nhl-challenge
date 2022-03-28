export const paginateResponse = (page: number, pageSize: number, data: any[]) => {
    return {
        'currentPage': page,
        'pageSize': pageSize,
        'results': data.length,
        'data': data
    }
}
