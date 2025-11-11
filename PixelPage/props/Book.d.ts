export type Book = {
    image: string,
    title: string,
    authors: string[],
    averageRating: string,
    publishedDate: string,
    genres: string[],
    pageCount: string,
    description: string,
    isbn: string,
    category: string,
  };

export type BookProvider = "googleBooksSearch" | "openLibrarySearch"