import { Footer } from "components/footer";
import { Nav } from "components/nav";
import { SEO } from "components/seo";
import { allBooks } from "contentlayer/generated";
import { InferGetStaticPropsType } from "next";
import Link from "next/link";

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const BookPage = ({
  books,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <div>
      <SEO
        title="I libri che consiglio"
        description="Questa è una serie di libri che ho letto e che consiglio a tutti. Ogniuno di questi libri mi ha dato qualcosa di nuovo."
        type="article"
      />

      <Nav />
      <BookList books={books} />
      <Footer />
    </div>
  );
};

export default BookPage;

export const getStaticProps = () => {
  return {
    props: {
      books: allBooks,
    },
  };
};

const BookList = ({ books }: Pick<Props, "books">) => {
  return (
    <div className="bg-white">
      <div className="mx-auto py-12 px-4 max-w-7xl sm:px-6 lg:px-8 lg:py-24">
        <div className="space-y-12 lg:grid lg:grid-cols-3 lg:gap-8 lg:space-y-0">
          <div className="space-y-5 sm:space-y-4">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              I Libri che consiglio
            </h2>
            <p className="text-xl text-gray-500">
              Questa è una serie di libri che ho letto e che consiglio a tutti.
              Ogniuno di questi libri mi ha dato qualcosa di nuovo.
            </p>
          </div>
          <div className="lg:col-span-2">
            <ul
              role="list"
              className="space-y-12 sm:divide-y sm:divide-gray-200 sm:space-y-0 sm:-mt-8 lg:gap-x-8 lg:space-y-0"
            >
              {books.map((book) => (
                <li key={book.slug} className="sm:py-8">
                  <div className="space-y-4 sm:grid sm:grid-cols-6 sm:items-start sm:gap-6 sm:space-y-0">
                    <div className="aspect-w-3 aspect-h-2 sm:aspect-w-3 sm:aspect-h-4">
                      <img
                        className="object-cover w-32 shadow-lg rounded-lg"
                        src={book.imageUrl}
                        alt=""
                      />
                    </div>
                    <div className="sm:col-span-5">
                      <div className="space-y-4">
                        <div className="text-lg leading-6 font-medium space-y-1">
                          <h3>{book.title}</h3>
                          <p>
                            <span className="text-gray-600">Autore</span>{" "}
                            <span className="text-indigo-600">
                              {book.author}
                            </span>
                          </p>
                        </div>
                        <div className="text-lg">
                          {/* <p className="text-gray-500">{person.bio}</p> */}
                        </div>
                        <ul role="list" className="flex flex-col space-y-2">
                          {book.links.en && (
                            <li>
                              <a
                                href={book.links.en}
                                target="_blank"
                                rel="noreferrer"
                                className="text-gray-700 hover:text-green-200 hover:bg-green-700 px-2 py-1 bg-green-200 rounded-lg"
                              >
                                <span>Compra in Inglese 🇺🇸 </span>
                              </a>{" "}
                            </li>
                          )}

                          {book.links.it && (
                            <li>
                              <a
                                target="_blank"
                                rel="noreferrer"
                                href={book.links.it}
                                className="text-gray-700 hover:text-green-200 hover:bg-green-700 px-2 py-1 bg-green-200 rounded-lg"
                              >
                                <span>Compra in Italiano 🇮🇹 </span>
                              </a>{" "}
                            </li>
                          )}

                          <li>
                            <Link href={`/books/${book.slug}`}>
                              <a className="text-gray-800 underline">
                                <span>Cosa ne penso? 🧐</span>
                              </a>
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
