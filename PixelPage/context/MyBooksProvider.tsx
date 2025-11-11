import { ReactNode, createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../FirebaseConfig";
import { collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";

type MyBooksContextType = {
  onToggleSaved: (book: Book, category: string) => void,
  isBookSaved: (book: Book) => boolean,
  savedBooks: Book[];
};

export const MyBooksContext = createContext<MyBooksContextType>({
  onToggleSaved: () => {},
  isBookSaved: () => false,
  savedBooks: [],
});

type Props = {
  children: ReactNode;
};

const MyBooksProvider = ({ children }: Props) => {
  const [savedBooks, setSavedBooks] = useState<Book[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      if (user) {
        loadData(user.uid);
      } else {
        setSavedBooks([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Removed the persistData useEffect to avoid infinite loops
  // Data is persisted directly in onToggleSaved

  const areBooksTheSame = (a: Book, b: Book) => {
    return JSON.stringify(a) === JSON.stringify(b)
  }

  const isBookSaved = (book: Book) => {
    return savedBooks.some(
      (savedBook) => savedBook.isbn === book.isbn
    );
  }

  // Helper function to remove undefined values from an object
  const removeUndefined = (obj: any) => {
    const cleaned: any = {};
    for (const key in obj) {
      if (obj[key] !== undefined) {
        cleaned[key] = obj[key];
      }
    }
    return cleaned;
  }

  const onToggleSaved = async (book: Book, category: string) => {
    if (!auth.currentUser) {
      console.error('User not authenticated');
      return;
    }

    const userId = auth.currentUser.uid;
    
    if (!category) {
      console.error('Category is required to save a book');
      return;
    }
    
    try {
      // Check if the book is already saved
      const existingBookIndex = savedBooks.findIndex(savedBook => savedBook.isbn === book.isbn);
    
      if (existingBookIndex !== -1) {
        // If the book is already saved
        const savedBook = savedBooks[existingBookIndex];
    
        // Decide to update the category or unsave the book
        if (savedBook.category === category) {
          // If the category is the same, the user is unsaving the book
          const bookRef = doc(db, `users/${userId}/books`, book.isbn);
          await deleteDoc(bookRef); // Remove from Firestore
    
          // Remove the book from the local state array
          setSavedBooks(currentBooks => currentBooks.filter((_, index) => index !== existingBookIndex));
        } else {
          // If the category is different, update the book with the new category
          const updatedBook = { ...savedBook, category }; // Update the book object with the new category
          const cleanedBook = removeUndefined(updatedBook); // Remove undefined values
          const bookRef = doc(db, `users/${userId}/books`, book.isbn);
          await setDoc(bookRef, cleanedBook); // Update Firestore
    
          // Update the book in the local state array
          setSavedBooks(currentBooks => 
            currentBooks.map((currentBook, index) => 
              index === existingBookIndex ? updatedBook : currentBook
            )
          );
        }
      } else {
        // If the book is not saved, add it with the category
        const newBook = { ...book, category }; // Create a new book object with the category
        const cleanedBook = removeUndefined(newBook); // Remove undefined values before saving
        const bookRef = doc(db, `users/${userId}/books`, book.isbn);
        await setDoc(bookRef, cleanedBook); // Add to Firestore
    
        // Add the new book to the local state array
        setSavedBooks(currentBooks => [newBook, ...currentBooks]);
      }
    } catch (error) {
      console.error('Error toggling saved book:', error);
      // Re-throw to allow UI to handle it if needed
      throw error;
    }
  };
  
  const saveBook = async (userId, bookId, bookDetails, isSaving) => {
    const bookRef = doc(db, `users/${userId}/books`, bookId);
    if (isSaving) {
      await setDoc(bookRef, bookDetails);
    } else {
      await deleteDoc(bookRef);
    }
  };

  const persistData = async () => {
    const userId = auth.currentUser.uid;
    savedBooks.forEach(async (book) => {
      const bookRef = doc(db, `users/${userId}/books`, book.isbn);
      await setDoc(bookRef, book);
    });
  };

  const loadData = async (userId: string) => {
    if (!userId) return;
    try {
      const userBooksRef = collection(db, `users/${userId}/books`);
      const querySnapshot = await getDocs(userBooksRef);
      const books = querySnapshot.docs.map(doc => doc.data() as Book); // Ensure proper typing
      setSavedBooks(books);
      setLoaded(true);
    } catch (error) {
      console.error('Error loading books:', error);
      setSavedBooks([]);
      setLoaded(true);
    }
  };

  return (
    <MyBooksContext.Provider value={{ onToggleSaved, isBookSaved, savedBooks }}>
      {children}
    </MyBooksContext.Provider>
  );
};

export const useMyBooks = () => useContext(MyBooksContext);

export default MyBooksProvider;