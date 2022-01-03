const { withSuperjson } = require("next-superjson");

module.exports = withSuperjson()({
  swcMinify: false,
  reactStrictMode: true,
  images: {
    domains: ["avatars.githubusercontent.com"],
  },
});
