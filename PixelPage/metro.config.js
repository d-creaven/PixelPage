const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// Add support for .cjs files (Firebase uses CommonJS modules)
defaultConfig.resolver.sourceExts.push('cjs');

// Disable package.json exports field to fix Firebase module resolution
defaultConfig.resolver.unstable_enablePackageExports = false;

module.exports = defaultConfig;

