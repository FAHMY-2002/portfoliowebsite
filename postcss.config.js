import globalData from '@csstools/postcss-global-data';
import customMedia from 'postcss-custom-media';

// Makes the @custom-media breakpoints declared in tokens.css available in every CSS file.
export default {
  plugins: [globalData({ files: ['./src/styles/tokens.css'] }), customMedia()],
};
