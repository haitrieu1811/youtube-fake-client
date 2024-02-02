export enum AccountRole {
  Admin,
  User
}

export enum AccountStatus {
  Active,
  Inactive
}

export enum VideoAudience {
  Everyone,
  Onlyme
}

export enum CommentType {
  Video,
  Post
}

export enum ReactionType {
  Like,
  Dislike
}

export enum ReactionContentType {
  Video,
  Post,
  Comment
}

export enum PostAudience {
  Everyone,
  Onlyme
}

export enum EncodingStatus {
  Pending,
  Processing,
  Succeed,
  Failed
}

export enum PlaylistAudience {
  Everyone,
  Onlyme
}

export enum TokenType {
  AccessToken,
  RefreshToken,
  VerifyEmailToken,
  ForgotPasswordToken
}

export enum AccountVerifyStatus {
  Verified,
  Unverified
}

export enum MediaType {
  Image,
  Video,
  Hls
}

export enum ReportContentType {
  Video,
  Post,
  Comment
}

export enum ReportStatus {
  Resolved,
  Unresolved
}

export enum VideoStatus {
  Draft,
  Active,
  Unactive
}
