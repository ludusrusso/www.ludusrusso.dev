module.exports = {
  reactStrictMode: true,
  siteUrl: process.env.SITE_URL || "https://www.ludusrusso.dev",
  generateRobotsTxt: true, // (optional)
  exclude: ["/admin/*", "/episodes/*"],
  changefreq: "daily",
  priority: 0.7,
  sitemapSize: 5000,
};
