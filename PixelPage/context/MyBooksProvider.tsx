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

  useEffect(() => {
    if (loaded) {
      persistData();
    }
  }, [savedBooks]);

  const areBooksTheSame = (a: Book, b: Book) => {
    return JSON.stringify(a) === JSON.stringify(b)
  }

  const isBookSaved = (book: Book) => {
    return savedBooks.some(
      (savedBook) => areBooksTheSame(savedBook, book)
    );
  }

  const onToggleSaved = async (book: Book, category: string) => {
    const userId = auth.currentUser.uid; // Ensure you have the current user's ID
    
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
        const bookRef = doc(db, `users/${userId}/books`, book.isbn);
        await setDoc(bookRef, updatedBook); // Update Firestore
  
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
      const bookRef = doc(db, `users/${userId}/books`, book.isbn);
      await setDoc(bookRef, newBook); // Add to Firestore
  
      // Add the new book to the local state array
      setSavedBooks(currentBooks => [newBook, ...currentBooks]);
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

  const loadData = async () => {
    const userId = auth.currentUser.uid; 
    const userBooksRef = collection(db, `users/${userId}/books`);
    const querySnapshot = await getDocs(userBooksRef);
    const books = querySnapshot.docs.map(doc => doc.data() as Book); // Ensure proper typing
    setSavedBooks(books);
    setLoaded(true);
  };

  return (
    <MyBooksContext.Provider value={{ onToggleSaved, isBookSaved, savedBooks }}>
      {children}
    </MyBooksContext.Provider>
  );
};

export const useMyBooks = () => useContext(MyBooksContext);

export default MyBooksProvider;