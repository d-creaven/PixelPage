module.exports = {
  root: true,
  extends: [
    'expo',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    // Allow console.log in development (you may want to remove this in production)
    'no-console': 'warn',
    // Enforce consistent naming
    '@typescript-eslint/naming-convention': [
      'warn',
      {
        selector: 'variableLike',
        format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
      },
      {
        selector: 'typeLike',
        format: ['PascalCase'],
      },
    ],
    // Disable rules that are too strict for React Native
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    // React Native specific
    'react-native/no-inline-styles': 'warn',
    'react-native/no-unused-styles': 'warn',
  },
  ignorePatterns: ['node_modules/', '.expo/', 'web-build/'],
};

