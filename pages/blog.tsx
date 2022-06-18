import { InferGetStaticPropsType } from "next";
import { getBlogData } from "utils/getBlogData";
import { Footer } from "../components/footer";
import { Nav } from "../components/nav";
import { PostPreview } from "../components/post-preview";
import { SEO } from "../components/seo";

export default function Blog({
  posts,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <SEO title="Blog" />
      <Nav />

      <div className="relative bg-gray-50 pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8">
        <div className="absolute inset-0">
          <div className="bg-white h-1/3 sm:h-2/3" />
        </div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl">
              Dal mio Blog
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Qui trovi tutti gli articoli che ho scritto nel mio blog
            </p>
          </div>
          <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
            {posts.map((post) => (
              <PostPreview
                post={post.frontMatter}
                author={post.author}
                key={post.frontMatter.title}
              />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export async function getStaticProps() {
  const posts = getBlogData().filter(({ frontMatter }) => {
    const p = frontMatter._raw.flattenedPath;
    return p.startsWith("blog/it") || p.startsWith("blog/en");
  });

  return {
    props: { posts },
  };
}
