export interface Reviews {
  courseID:string,
  reviews:  Array<{
      username: string,
      dateCreated:string,
      review: string
    }>
  }

export interface Review {
  username: string,
  dateCreated:string,
  review: string
}