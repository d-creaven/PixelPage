# Development Guide

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (optional): `npm install -g expo-cli`

### Setup

1. **Clone and install**
   ```bash
   git clone https://github.com/d-creaven/PixelPage.git
   cd PixelPage/PixelPage
   npm install
   ```

2. **Environment variables** (optional)
   ```bash
   cp env.example .env
   ```
   The `.env` file is already configured with default values.

3. **Start development server**
   ```bash
   npm start
   ```

### Running the App

```bash
npm start          # Start Expo dev server
npm run ios        # iOS simulator (Mac only)
npm run android    # Android emulator
npm run web        # Web browser
```

**Testing on physical device:**
1. Install Expo Go app on your phone
2. Scan the QR code from the terminal

---

## 📁 Project Structure

```
PixelPage/
├── PixelPage/
│   ├── components/      # Reusable UI components
│   ├── screens/         # Screen components
│   ├── navigation/     # Navigation configuration
│   ├── services/       # API and business logic
│   ├── context/        # React Context providers
│   ├── hooks/          # Custom React hooks
│   ├── constants/      # Constants and configuration
│   ├── props/          # TypeScript type definitions
│   └── assets/         # Images, fonts, etc.
└── firestore.rules     # Firestore security rules
```

---

## 🛠️ Development Workflow

### Before Committing

```bash
npm run lint          # Check for linting errors
npm run lint:fix      # Auto-fix linting errors
npm run format        # Format code with Prettier
npm run type-check    # Run TypeScript type checking
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo development server |
| `npm run ios` | Start iOS simulator |
| `npm run android` | Start Android emulator |
| `npm run web` | Start web version |
| `npm test` | Run tests |
| `npm run lint` | Check for linting errors |
| `npm run lint:fix` | Auto-fix linting errors |
| `npm run format` | Format code with Prettier |
| `npm run type-check` | TypeScript type checking |

---

## 📝 Code Style

### Naming Conventions

- **Components**: PascalCase (`BookItem.tsx`)
- **Functions/Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE or camelCase
- **Types/Interfaces**: PascalCase

### Import Order

1. React and React Native
2. Third-party libraries
3. Local components
4. Local utilities/services
5. Types
6. Styles

**Example:**
```typescript
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import BookItem from '../components/BookItem';
import { searchGoogleBooks } from '../services/bookService';
import Colors from '../constants/Colors';
```

---

## 🔐 Environment Variables

1. Copy example file: `cp env.example .env`
2. The `.env` file is already configured with default Firebase values
3. Only modify if you need different credentials

**Important:**
- ✅ `.env` is in `.gitignore` - won't be committed
- ✅ App works without `.env` - uses fallback values
- ⚠️ Never commit `.env` to version control

---

## 🎨 Styling & Theming

### Dark Mode Support

Always use theme colors from `Colors.ts`:

```typescript
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';

const colorScheme = useColorScheme();
const colors = Colors[colorScheme];

<View style={{ backgroundColor: colors.background }}>
  <Text style={{ color: colors.text }}>Hello</Text>
</View>
```

### Themed Components

Use themed components from `components/Themed.tsx`:

```typescript
import { View, Text } from '../components/Themed';

<View>
  <Text>Automatically adapts to light/dark mode</Text>
</View>
```

---

## 🐛 Common Issues

### Metro Bundler Issues

```bash
npm start -- --clear
```

### TypeScript Errors

```bash
npm run type-check
```

### Web Compatibility

Some React Native APIs don't work on web. Use platform checks:

```typescript
import { Platform } from 'react-native';

if (Platform.OS !== 'web') {
  // Native-only code
}
```

### Environment Variables Not Loading

1. Ensure `.env` exists in `PixelPage/` directory
2. Restart Expo dev server after creating/modifying `.env`
3. Check variable names match exactly (case-sensitive)

---

## 📚 Best Practices

### React Native

- Use `SafeAreaView` from `react-native-safe-area-context`
- Prefer functional components with hooks
- Handle loading and error states
- Use theme colors for dark mode support

### Code Quality

- Remove `console.log`s before committing
- Keep functions small and focused
- Add comments for complex logic
- Use meaningful variable names

### Performance

- Use `React.memo` for expensive components
- Optimize images and assets
- Avoid unnecessary re-renders

---

## 🔥 Firebase

### Security Rules

Firestore security rules are in `firestore.rules` at the project root.

- Review rules before deploying
- Test rules thoroughly
- Rules are your primary security mechanism

### Authentication

- Uses Firebase Authentication
- Email/password authentication
- Auth state managed automatically
