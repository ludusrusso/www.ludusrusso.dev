import Image from 'next/image';
import { PostFrontMatter } from '../utils/getBlogData';
import { Tag } from './tag';

interface PostPreviewProps {
  post: PostFrontMatter;
}

export const PostPreview = ({ post }: PostPreviewProps) => {
  return (
    <div key={post.title} className="flex flex-col rounded-lg shadow-lg overflow-hidden">
      <div className="flex-shrink-0">
        <Image height={250} width={550} className="h-52 w-full object-cover" src={post.image} alt="" />
      </div>
      <div className="flex-1 bg-white p-6 flex flex-col justify-between">
        <div className="flex-1 ">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Tag key={tag} tag={tag} />
            ))}
          </div>
          <a href={post.href} className="block mt-2">
            <p className="text-xl font-semibold text-gray-900">{post.title}</p>
            <p className="mt-3 text-base text-gray-500">{post.description}</p>
          </a>
        </div>
        <div className="mt-6 flex items-center">
          <div className="flex-shrink-0">
            <div>
              <span className="sr-only">{post.author.name}</span>
              <Image width={40} height={40} className="h-10 w-10 rounded-full" src={post.author.profile} alt="" />
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">
              <span className="hover:underline">{post.author.name}</span>
            </p>
            <div className="flex space-x-1 text-sm text-gray-500">
              <time dateTime={post.published.toISOString()}>{post.publishedReadable}</time>
              <span aria-hidden="true">&middot;</span>
              <span>{post.readTime} read</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
