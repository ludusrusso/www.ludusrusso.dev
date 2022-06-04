import { Footer } from "components/footer";
import { Nav } from "components/nav";
import { InferGetStaticPropsType } from "next";
import Link from "next/link";
import { getBlogData } from "utils/getBlogData";

type Props = InferGetStaticPropsType<typeof getStaticProps>;
type TagPorps = Props["posts"][number];

const BlogTagsPage = ({ posts }: Props) => {
  return (
    <div>
      <Nav />
      {posts.map((post) => (
        <div key={post.tag}>
          <TagInfo {...post} />
        </div>
      ))}
      <Footer />
    </div>
  );
};

export default BlogTagsPage;

export async function getStaticProps() {
  const blogData = getBlogData();
  const tags = Array.from(
    new Set(blogData.flatMap(({ frontMatter }) => frontMatter.tags || []))
  ).sort((a, b) => a.localeCompare(b));

  const posts = tags.map((tag) => {
    return {
      tag: tag,
      posts: blogData.filter(({ frontMatter }) =>
        frontMatter.tags?.includes(tag)
      ),
    };
  });

  return {
    props: { posts },
  };
}

const TagInfo = (tag: TagPorps) => {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-16 px-4 divide-y-2 divide-gray-200 sm:py-24 sm:px-6 lg:px-8">
        <h2 id={tag.tag} className="text-3xl font-extrabold text-gray-900">
          {tag.tag}
        </h2>
        <div className="mt-6 pt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:gap-x-8 md:gap-y-12">
            {tag.posts.map((post) => (
              <div key={post.frontMatter.href}>
                <dt className="text-lg leading-6 font-medium text-gray-900">
                  <Link href={post.frontMatter.href}>
                    <a className="hover:text-green-800 underline">
                      {post.frontMatter.title}
                    </a>
                  </Link>
                </dt>
                <dd className="mt-2 text-base text-gray-500">
                  {post.frontMatter.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};
