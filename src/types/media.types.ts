import { SuccessResponse } from './utils.types'

export type VideoStatusType = {
  _id: string
  name: string
  status: number
  messsage: string
  createdAt: string
  updatedAt: string
}

// Response: Upload hình ảnh
export type UploadImagesResponse = SuccessResponse<{
  imageIds: string[]
}>

// Response: Upload video HLS
export type UploadVideoHLSResponse = SuccessResponse<{
  videoIdName: string
}>

// Response: Lấy trạng thái video upload
export type GetVideoStatusResponse = SuccessResponse<{
  videoStatus: VideoStatusType
}>
