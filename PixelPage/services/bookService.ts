export const parseBook = (
    item: any,
    provider: BookProvider
    ): Book => {
    if(provider === "googleBooksSearch") {
      return {
        title: item.volumeInfo.title,
        image: item.volumeInfo.imageLinks?.thumbnail,
        authors: item.volumeInfo.authors,
        isbn: item.volumeInfo.industryIdentifiers?.[0]?.identifier,
        averageRating: item.volumeInfo.averageRating,
        publishedDate: item.volumeInfo.publishedDate,
        pageCount: item.volumeInfo.pageCount,
        description: item.volumeInfo.description,
        genres: item.volumeInfo?.categories,
      };
    }
    return {
      title: item.title,
      image: `https://covers.openlibrary.org/b/olid/${item.cover_edition_key}-M.jpg`,
      authors: item.author_name,
      isbn: item.isbn?.[0],
      averageRating: item.ratings_average,
      publishedDate: item.publish_date,
      pageCount: item.pageCount,
      description: item.description,
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