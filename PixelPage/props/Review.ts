import { Timestamp } from "firebase/firestore"

type Review = {
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