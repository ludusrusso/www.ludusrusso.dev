const { withSuperjson } = require("next-superjson");
const { withContentlayer } = require("next-contentlayer");
const oldPaths = require("./paths");

module.exports = withContentlayer(
  withSuperjson()({
    images: {
      domains: ["avatars.githubusercontent.com", "res.cloudinary.com"],
    },
    redirects: () => {
      return [
        ...oldPaths.map((path) => ({
          source: `/${path}`,
          destination: `/blog/${path}`,
          permanent: true,
        })),
      ];
    },
  })
);
