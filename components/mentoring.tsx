import Link from "next/link";

export const MentoringLanding = () => {
  return (
    <div className="max-w-xl mx-auto text-gray-900 mb-10">
      <div className="text-center">
        <h2 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl">
          Mentoring
        </h2>
        <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
          Impariamo insieme e condividiamo conoscenza
        </p>
      </div>

      <Link
        href="https://calendly.com/ludusrusso/one2one"
        rel="noreferrer"
        target="_blank"
        className="inline-block my-10 px-4 py-2 w-full bg-green-500 text-white text-xl font-bold text-center rounded hover:bg-green-700">
        
          Schedule a one2one session
        
      </Link>

      <div className="prose prose-lg m-auto mt-6 px-4 md:px-0">
        <p>
          La condivisione della conoscenza è cruciale nel mondo tech è una cosa
          che a me personalmente piace tanto fare.
        </p>

        <p>
          Per questo motivo, offro delle sessione{" "}
          <span className="font-bold">gratuite</span> di mentoring 1-to-1 su
          questi argomenti:
        </p>

        <ul>
          <li>Software Engineering</li>
          <li>Robotics and Artificial Intelligence</li>
          <li>Microservices Architectures</li>
          <li>IoT</li>
        </ul>

        <p>E Tecnologie:</p>

        <ul>
          <li>kubernetes</li>
          <li>arduino</li>
          <li>raspberry pi</li>
          <li>nodejs</li>
          <li>golang</li>
          <li>angular and react</li>
        </ul>

        <h2>Come funziona?</h2>

        <p>
          Guarda le mie disponibilità su{" "}
          <a
            href="https://calendly.com/ludusrusso/one2one"
            target="_blank"
            rel="noreferrer"
          >
            Calendly
          </a>{" "}
          Avremmo a disposizione <span className="font-bold">~30 minuti</span>{" "}
          per parlare o fare pair programming!
        </p>

        <a
          rel="noreferrer"
          className="inline-block px-4 py-2 w-full bg-green-500 text-white text-xl font-bold text-center rounded mt-4 hover:bg-green-700"
          href="https://calendly.com/ludusrusso/one2one"
          target="_blank"
        >
          Programma una sessione 1-to-1
        </a>

        <h2 className="">Mi vuoi aiutare in questo progetto?</h2>

        <p>
          Spendo molto tempo aiutando persone e spingo tanto sul{" "}
          <strong>mutual improvement</strong>! Per questo motivo ogni aiuto è
          veramente apprezzato.
        </p>

        <p>
          Puoi aiutarmi in diversi modi, ecco alcuni suggerimenti{" "}
          <span role="img" aria-label="face">
            😃
          </span>
        </p>

        <ul>
          <li>
            Aggiungimi su{" "}
            <a
              href="https://www.linkedin.com/in/ludusrusso/"
              rel="noreferrer"
              target="_blank"
            >
              Linkedin
            </a>{" "}
            e scrivi una <strong>recommendation</strong> sul mio profilo. Questo
            mi aiuterà a trovare altre persone da aiutare!
          </li>
          <li>
            Condividi il mio profilo e questa pagina sul tuo social preferito!
          </li>
          <li>
            Offrimi{" "}
            <a
              href="https://www.paypal.com/paypalme/ludusrusso/"
              target="_blank"
              rel="noreferrer"
            >
              Qualcosa da bere
            </a>
            <span role="img" aria-label="drink">
              🍸
            </span>
            !
          </li>
        </ul>

        <p className="text-lg  mt-20 font-bold text-center">
          Grazie a<a href="https://jagasantagostino.com/mentoring"> Jaga </a>
          per l&apos;idea!{" "}
          <span role="img" aria-label="face">
            😆
          </span>
        </p>
      </div>
    </div>
  );
};
