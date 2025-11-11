import { Timestamp } from "firebase/firestore"

export type Review = {
    id?: string,
    bookId: string,
    reviewText: string,
    rating: number,
    userId: string,
    timestamp: Timestamp,
    likes: number,
    likedByUsers: string,
    comments: [],
    title: string,
    authors: [],
    cover: string,
    username: string,
    userProfileImage: string,
  }