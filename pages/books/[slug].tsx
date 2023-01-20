import { Mailchimp } from "components/mailchimp";
import { allBooks } from "contentlayer/generated";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { useMDXComponent } from "next-contentlayer/hooks";
import path from "path";
import YouTube from "react-youtube";
import { Footer } from "../../components/footer";
import { Nav } from "../../components/nav";
import { SEO } from "../../components/seo";

export default function BookPage({
  book,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const components = {
    img: ({ src, alt }: { src: string; alt: string }) => {
      return <img alt={alt} src={path.join(book.imagePath, src!)} />;
    },
    YouTube: ({ videoId }: { videoId: string }) => (
      <YouTube className="w-full aspect-video" videoId={videoId} />
    ),
    pre: (props: any) => <pre {...props} className="no-prose" />,
  } as any;

  const MdxSection = useMDXComponent(book.body.code);
  return (
    <>
      <SEO
        title={book.title}
        description={book.title}
        image={book.imageUrl}
        type="article"
      />

      <Nav />

      <main className="wrapper py-10">
        <h1 className="text-3xl md:text-4xl text-center py-4 px-4 sm:py-0 max-w-[900px] m-auto font-bold mt-10">
          {book.title}
        </h1>

        <div className="mt-4 m-auto grid place-content-center">
          <img
            className="object-cover w-32 shadow-lg rounded-lg"
            src={book.imageUrl}
            alt=""
          />
        </div>

        <div className="flex flex-col items-center mt-10">
          <div className="text-center">
            <p className="text-xl font-bold text-gray-900">
              by <span>{book.author}</span>
            </p>
            <div className="flex space-x-2 mt-4 text-lg text-gray-500">
              {book.links.en && (
                <a
                  href={book.links.en}
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-700 hover:text-green-200 hover:bg-green-700 px-2 py-1 bg-green-200 rounded-lg"
                >
                  <span>Compra in Inglese 🇺🇸 </span>
                </a>
              )}
              {book.links.it && (
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={book.links.it}
                  className="text-gray-700 hover:text-green-200 hover:bg-green-700 px-2 py-1 bg-green-200 rounded-lg"
                >
                  <span>Compra in Italiano 🇮🇹 </span>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="prose prose-lg m-auto mt-6 px-4 md:px-0">
          <MdxSection components={components} />
        </div>
      </main>

      <Mailchimp title="Ti è piaciuto questo libro?" />

      <Footer />
    </>
  );
}

export async function getStaticPaths() {
  const paths = allBooks.map((d) => {
    return {
      params: {
        slug: d.slug,
      },
    };
  });

  return {
    paths: paths,
    fallback: false,
  };
}

export async function getStaticProps({
  params,
}: GetStaticPropsContext<{ slug: string }>) {
  const slug = params!.slug;
  const book = allBooks.find((b) => b.slug === slug);

  if (!book) {
    throw new Error("book not found????");
  }

  return {
    props: {
      book,
    },
  };
}
