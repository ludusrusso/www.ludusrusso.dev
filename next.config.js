const { withSuperjson } = require("next-superjson");

module.exports = withSuperjson()({
  swcMinify: false,
  generateRobotsTxt: true, // (optional)
  images: {
    domains: ["avatars.githubusercontent.com", "res.cloudinary.com"],
  },
});
