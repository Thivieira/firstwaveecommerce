const withPlugins = require("next-compose-plugins");
const withImages = require("next-images");

const imagesPlugin = withImages({
  esModule: true,
});

module.exports = withPlugins([imagesPlugin], {
  images: {
    domains: ["storage.googleapis.com"],
  },
});
