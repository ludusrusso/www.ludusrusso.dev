const { withSuperjson } = require('next-superjson');

module.exports = withSuperjson({
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'tsx'],
});
