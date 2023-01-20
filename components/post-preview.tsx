import type { Author } from "authors";
import { BlogPost } from "contentlayer/generated";
import Image from "next/image";
import Link from "next/link";
import { Tag } from "./tag";

interface PostPreviewProps {
  post: Omit<BlogPost, "body">;
  author: Author;
}

export const PostPreview = ({ post, author }: PostPreviewProps) => {
  return (
    (<Link
      href={post.href}
      key={post.title}
      className="flex flex-col rounded-lg shadow overflow-hidden hover:shadow-xl hover:ring-2 cursor-pointer">

      <div className="flex-shrink-0">
        <Image
          height={250}
          width={550}
          className="h-52 w-full object-cover"
          src={post.imageUrl}
          alt={post.title}
        />
      </div>
      <div className="flex-1 bg-white p-6 flex flex-col justify-between">
        <div className="flex-1 ">
          <div className="flex flex-wrap gap-2">
            <span className="text-2xl">
              {post.lang === "en" ? "🇬🇧" : "🇮🇹"}{" "}
            </span>
            {post.tags.map((tag) => (
              <Tag key={tag} tag={tag} />
            ))}
          </div>
          <div className="block mt-2">
            <p className="text-xl font-semibold text-gray-900">
              {post.title}
            </p>
            <p className="mt-3 text-base text-gray-500">{post.description}</p>
          </div>
        </div>
        <div className="mt-6 flex items-center">
          <div className="flex-shrink-0">
            <div>
              <span className="sr-only">{author.name}</span>
              <Image
                width={40}
                height={40}
                className="h-10 w-10 rounded-full"
                src={author.profile}
                alt=""
              />
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">
              <span className="hover:underline">{author.name}</span>
            </p>
            <div className="flex space-x-1 text-sm text-gray-500">
              <time dateTime={new Date(post.date).toISOString()}>
                {post.publishedReadable}
              </time>
              <span aria-hidden="true">&middot;</span>
              <span>{readTime(post.readTime)}</span>
            </div>
          </div>
        </div>
      </div>

    </Link>)
  );
};

const readTime = (rt: number) => {
  if (rt === 1) {
    return "1 minuto";
  } else {
    return `${rt} minuti`;
  }
};
