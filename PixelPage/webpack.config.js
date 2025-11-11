const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const webpack = require('webpack');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAddModulePathsToTranspile: [
          'react-native-screens',
          'react-native-safe-area-context',
          'react-native-dropdown-picker',
        ],
      },
    },
    argv
  );

  // Fix for React Native web module resolution
  config.resolve.alias = {
    ...config.resolve.alias,
    'react-native$': 'react-native-web',
  };

  // Use NormalModuleReplacementPlugin to replace problematic imports
  config.plugins = config.plugins || [];
  config.plugins.push(
    // Replace relative Platform imports
    new webpack.NormalModuleReplacementPlugin(
      /\.\.\/Utilities\/Platform/,
      'react-native-web/dist/exports/Platform'
    ),
    // Replace react-native/Libraries imports with react-native-web
    new webpack.NormalModuleReplacementPlugin(
      /^react-native\/Libraries\//,
      'react-native-web/'
    )
  );

  // Add fallback for Node.js modules that don't exist in browser
  config.resolve.fallback = {
    ...config.resolve.fallback,
    fs: false,
    net: false,
    tls: false,
  };

  // Ensure proper module resolution
  config.resolve.extensions = [
    '.web.js',
    '.web.jsx',
    '.web.ts',
    '.web.tsx',
    '.js',
    '.jsx',
    '.ts',
    '.tsx',
    '.json',
  ];

  return config;
};

