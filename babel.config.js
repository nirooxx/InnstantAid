module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
      },
    ],
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@assets': './assets',
          '@components': './components',
          '@screens': './screens',
          // Weitere Aliase je nach Bedarf hinzufügen
        },
      },
    ],
  ],
};
