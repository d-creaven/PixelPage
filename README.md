![PixelPage Logo](https://github.com/d-creaven/PixelPage/assets/144898567/19a2ce25-ac41-4233-a334-108acc1fd2bb)

# PixelPage Book Club App

A modern, cross-platform social reading application built with React Native and Expo. Connect with fellow book lovers, discover new reads, share reviews, and build your personal library.

**Final Year Project by Daragh Creaven**  
_Project Supervisor: Karen Young_

---

## 📱 Features

### Core Functionality

- **📚 Book Discovery**
  - Search books using Google Books API
  - Browse book details including ratings, descriptions, and genres
  - Save books to your personal library

- **👥 Social Features**
  - Follow other readers and see their reviews
  - View user profiles with reading stats
  - Discover what your network is reading

- **📝 Reviews & Comments**
  - Write and share book reviews
  - Comment on reviews from the community
  - Like reviews from other users
  - View a feed of recent reviews

- **📖 Personal Library**
  - Organize books by category (Reading, Want to Read, Finished)
  - Track your reading progress
  - Manage your book collection

- **🎨 Modern UI/UX**
  - Intuitive interface
  - Dark mode support
  - Responsive design for mobile and web
  - Smooth navigation and animations

---

## 🛠️ Tech Stack

### Frontend
- **React Native** - Cross-platform mobile development
- **Expo** - Development platform and tooling
- **TypeScript** - Type-safe JavaScript
- **React Navigation** - Navigation library
- **React Context API** - State management

### Backend & Services
- **Firebase Authentication** - User authentication
- **Cloud Firestore** - Real-time database
- **Firebase Storage** - Image storage
- **Google Books API** - Book search and data

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Testing framework

---

## 📁 Project Structure

```
PixelPage/
├── PixelPage/              # Main application code
│   ├── components/         # Reusable UI components
│   │   ├── BookItem.tsx
│   │   ├── ReviewItem.tsx
│   │   ├── UserItem.tsx
│   │   └── ...
│   ├── screens/           # Screen components
│   │   ├── FeedScreen.tsx
│   │   ├── SearchScreen/
│   │   ├── MyBooksScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   └── ...
│   ├── navigation/        # Navigation configuration
│   ├── services/          # API and business logic
│   │   └── bookService.ts
│   ├── context/          # React Context providers
│   ├── hooks/            # Custom React hooks
│   ├── constants/        # Constants and configuration
│   ├── props/            # TypeScript type definitions
│   └── assets/           # Images, fonts, etc.
├── firestore.rules       # Firestore security rules
└── README.md             # This file
```

---

## 🔐 Security

- Firebase Authentication for secure user login
- Firestore Security Rules for data access control
- Environment variables for configuration management
- Input validation and sanitization
- Secure error handling

See [DEVELOPMENT.md](./DEVELOPMENT.md) for more security details and best practices.

---

## 🌐 Platform Support

- ✅ **iOS** - Native iOS app
- ✅ **Android** - Native Android app
- ✅ **Web** - Progressive Web App

---

## 📱 Screenshots

_Add screenshots of your app here to showcase the UI_

---

**Built with ❤️ using React Native and Expo**
