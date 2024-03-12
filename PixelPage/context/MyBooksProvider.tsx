import { ReactNode, createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../FirebaseConfig";
import { collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";

type MyBooksContextType = {
  onToggleSaved: (book: Book) => void,
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

  const onToggleSaved = (book: Book) => {
    const userId = auth.currentUser.uid; // Replace with dynamic user ID retrieval logic
  
    if (isBookSaved(book)) {
      // If the book is already saved, remove it
      saveBook(userId, book.isbn, null, false);
    } else {
      // If the book is not saved, save it
      saveBook(userId, book.isbn, book, true);
    }
  
    // Update the local state to reflect the change
    setSavedBooks((currentBooks) => {
      if (isBookSaved(book)) {
        return currentBooks.filter((savedBook) => savedBook.id !== book.id);
      } else {
        return [book, ...currentBooks];
      }
    });
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