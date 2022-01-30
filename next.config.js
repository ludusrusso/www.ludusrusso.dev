const { withSuperjson } = require("next-superjson");

module.exports = withSuperjson()({
  swcMinify: false,
  images: {
    domains: ["avatars.githubusercontent.com", "res.cloudinary.com"],
  },
});
