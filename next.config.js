const { withSuperjson } = require("next-superjson");
const { withContentlayer } = require("next-contentlayer");

module.exports = withContentlayer(
  withSuperjson()({
    images: {
      domains: ["avatars.githubusercontent.com", "res.cloudinary.com"],
    },
  })
);
