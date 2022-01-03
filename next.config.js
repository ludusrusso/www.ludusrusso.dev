const { withSuperjson } = require("next-superjson");

module.exports = withSuperjson()({
  presets: ["next/babel"],
  reactStrictMode: true,
  images: {
    domains: ["avatars.githubusercontent.com"],
  },
});
