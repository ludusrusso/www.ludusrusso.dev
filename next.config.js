const { withSuperjson } = require("next-superjson");

module.exports = withSuperjson()({
  images: {
    domains: ["avatars.githubusercontent.com", "res.cloudinary.com"],
  },
});
