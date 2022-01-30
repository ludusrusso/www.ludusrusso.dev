import { data as articles } from "./blog";
import { Feed } from "feed";
import { promises as fs } from "fs";

const generateRSSFeed = async () => {
  const baseUrl = "https://www.ludusrusso.dev";
  const author = {
    name: "Ludovico Russo",
    email: "ludovico@ludusrusso.space",
    link: "https://twitter.com/ludusrusso",
  };

  const feed = new Feed({
    title: "Blog di Ludovico Russo",
    description: "Il mio blog sulle mie sperimentazioni",
    id: baseUrl,
    link: baseUrl,
    language: "it",
    feedLinks: {
      rss2: `${baseUrl}/rss.xml`,
    },
    author,
    copyright: "2016 - 2022 Ludovico Russo. All rights reserved.",
  });

  // Add each article to the feed
  articles.forEach((post) => {
    const {
      frontMatter: { path, published, description, title },
    } = post;
    const url = `${baseUrl}/${path}`;

    feed.addItem({
      title,
      id: url,
      link: url,
      description,
      author: [author],
      date: new Date(published),
    });
  });

  await fs.writeFile(__dirname + "/public/rss.xml", feed.rss2());
};

generateRSSFeed().then(() => console.log("done"));
