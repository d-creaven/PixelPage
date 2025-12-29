import { Book, BookProvider } from "../props/Book.d";

export const parseBook = (
    item: any,
    provider: BookProvider
    ): Book => {
    if(provider === "googleBooksSearch") {
      return {
        title: item.volumeInfo?.title || 'Untitled',
        image: item.volumeInfo?.imageLinks?.thumbnail || item.volumeInfo?.imageLinks?.smallThumbnail || 'https://via.placeholder.com/128x192?text=No+Image',
        authors: item.volumeInfo?.authors || ['Unknown Author'],
        isbn: item.volumeInfo?.industryIdentifiers?.[0]?.identifier || item.id || 'no-isbn',
        averageRating: item.volumeInfo?.averageRating?.toString(),
        publishedDate: item.volumeInfo?.publishedDate,
        pageCount: item.volumeInfo?.pageCount?.toString(),
        description: item.volumeInfo?.description,
        genres: item.volumeInfo?.categories,
      };
    }
    return {
      title: item.title || 'Untitled',
      image: item.cover_edition_key 
        ? `https://covers.openlibrary.org/b/olid/${item.cover_edition_key}-M.jpg`
        : 'https://via.placeholder.com/128x192?text=No+Image',
      authors: item.author_name || ['Unknown Author'],
      isbn: item.isbn?.[0] || item.cover_edition_key || 'no-isbn',
      averageRating: item.ratings_average?.toString(),
      publishedDate: item.publish_date?.[0],
      pageCount: item.number_of_pages_median?.toString(),
      description: item.first_sentence?.[0],
      genres: item.subject,
    };
  };

/**
 * Search Google Books API directly (replaces StepZen GraphQL)
 * @param query - Search query string
 * @returns Promise with Google Books API response
 */
export const searchGoogleBooks = async (query: string): Promise<any> => {
  try {
    const encodedQuery = encodeURIComponent(query);
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodedQuery}&maxResults=40&country=US`;
    
    console.log('Searching Google Books API:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Google Books API response:', data);
    
    return {
      googleBooksSearch: {
        items: data.items || [],
        totalItems: data.totalItems || 0,
      },
    };
  } catch (error) {
    console.error('Error searching Google Books:', error);
    throw error;
  }
};