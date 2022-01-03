const { withSuperjson } = require("next-superjson");

module.exports = withSuperjson()({
  reactStrictMode: true,
  images: {
    domains: ["avatars.githubusercontent.com"],
  },
});
