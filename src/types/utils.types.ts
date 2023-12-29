export type SuccessResponse<Data> = {
  message: string
  data: Data
}

export type ErrorResponse<Data> = {
  message: string
  errors?: Data
}

export type OnlyMessageResponse = {
  message: string
}

export type PaginationReqQuery = {
  page?: string
  limit?: string
}

export type PaginationType = {
  page: number
  limit: number
  totalRows: number
  totalPages: number
}
