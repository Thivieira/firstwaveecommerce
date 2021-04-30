const withPlugins = require("next-compose-plugins");
const withImages = require("next-images");

const imagesPlugin = withImages({
  esModule: true,
});

module.exports = withPlugins([imagesPlugin], {
  images: {
    domains: ["storage.googleapis.com"],
  },
  future: {
    webpack5: true,
  },
  env: {
    PUBLIC_KEY: "TEST-d7175695-a273-411f-aef9-2796b92731c2",
  },
});
