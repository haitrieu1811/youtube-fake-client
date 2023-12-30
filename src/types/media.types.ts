import { SuccessResponse } from './utils.types'

// Response: Upload hình ảnh
export type UploadImagesResponse = SuccessResponse<{
  imageIds: string[]
}>
