module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@assets': './assets',
            '@components': './components',
            '@screens': './screens',
            '@navigation': './navigation',
            '@contexts': './contexts',
            '@constants': './constants',
            '@utils': './utils',
          },
        },
      ],
      [
        'babel-plugin-inline-dotenv',
        {
          path: '.env',
        }
      ]
    ],
  };
};