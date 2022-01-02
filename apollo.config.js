module.exports = {
  client: {
    includes: ['./**/*.graphql'],
    service: {
      url: 'http://localhost:4000/graphql',
      name: 'api.ludusrusso.dev',
    },
  },
};
