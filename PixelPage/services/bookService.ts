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