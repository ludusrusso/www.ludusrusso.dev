import { PrismaClient } from "@prisma/client";
import { promises as fs } from "fs";
import { glob } from "glob";
import matter from "gray-matter";
import path from "path";
import { Participant } from "utils/graphql";

const db = new PrismaClient();

async function main() {
  const data = await getData();
  console.log({ data });
}

interface Data {
  title: string;
  description: string;
  image: string;
  date: string;
  path?: string;
  tags: string[];
  [key: string]: any;
}

async function getFiles() {
  return new Promise<string[]>((resolve, reject) => {
    const contentDir = path.resolve(__dirname, "..", "hackability-dev-events");
    console.log(contentDir);
    glob(contentDir + "/**/*.{md,mdx}", (err, files) => {
      if (err) {
        return reject(err);
      }
      resolve(files);
    });
  });
}

const authors = [
  {
    id: "ludusrusso",
    name: "Ludovico Russo",
    bio: "Fullstack dev",
    twitter: "ludusrusso",
    linkedin: "ludusrusso",
    youtube: "ludusrusso",
    site: "https://ludusrusso.space/",
    image: "./img/guests/ludusrusso.jpg",
    github: "ludusrusso",
    email: "ludovico@ludusrusso.space",
  },
  {
    id: "davideimola",
    name: "Davide Imola",
    bio: "DevOps Engineer",
    twitter: "davideimola",
    linkedin: "davideimola",
    youtube: "DavideImolaIT",
    site: "https://davideimola.com/",
    image: "./img/guests/davideimola.jpg",
    github: "davideimola",
    email: "davide.imola@icloud.com",
  },
  {
    id: "log2",
    name: "Lorenzo Gallucci",
    bio: "DevOps Engineer",
    twitter: "log_two",
    linkedin: "log2",
    youtube: "LorenzoGallucci",
    site: "https://medium.com/@log2",
    image: "./img/guests/log2.jpg",
    github: "log2",
    email: "lgallucci@gmail.com",
  },
  {
    id: "carlbv",
    name: "Carlo Boccazzi Varotto",
    bio: "Social Innovator",
    linkedin: "carloboccazzivarotto",
    image:
      "https://res.cloudinary.com/ludusrusso/image/upload/c_crop,g_face/c_scale,w_200,h_200/v1641374825/ludusrusso.dev/participants/carlbv_shpwyt.jpg",
    email: "carlo@hackability.it",
  },
  {
    id: "chiarabisi",
    name: "Chiara Bisignani",
    bio: "Arte, ICT e Communication",
    linkedin: "cbisi",
    twitter: "KiabiCbisi",
    image:
      "https://res.cloudinary.com/ludusrusso/image/upload/c_crop,g_face/c_scale,w_200,h_200/v1641374825/ludusrusso.dev/participants/chiarabisi_wrzxdx.jpg",
    email: "chiara.bisignani@hackability.it",
  },
  {
    id: "lucabrognara",
    name: "Luca Brognara",
    bio: "Frontend dev",
    linkedin: "lucabrognara",
    twitter: "lucabrognara",
    image:
      "https://res.cloudinary.com/ludusrusso/image/upload/c_crop,g_face/c_scale,w_200,h_200/v1641374825/ludusrusso.dev/participants/lucabrognara_sdnzix.jpg",
    email: "luca.brognara@comperio.it",
  },
  {
    id: "giandodev",
    name: "Giandomenico Riceputi",
    bio: "Frontend",
    twitter: "Giando_Riceputi",
    linkedin: "giandomenicoriceputi",
    youtube: "UCXz0rIzLQTHHTT4a8QYA6kA",
    image: "./img/guests/giandodev.jpg",
    github: "GiandomenicoRiceputi",
    email: "giandomenicoriceputi@gmail.com",
  },
  {
    id: "aletornesello",
    name: "Alessandro Tornesello",
    bio: "Frontend dev",
    linkedin: "alessandro-tornesello",
    site: "https://alessandrotornesello.it",
    image: "./img/guests/aletornesello.png",
    email: "aletornesello@xxxx.xx",
  },
  {
    id: "johnpaul",
    name: "John Paul Du",
    bio: "Frontend Dev",
    linkedin: "john-paul-du-0aa021144",
    image: "./img/guests/johnpaul.jpg",
    email: "johnpaul@xxxx.xx",
  },
  {
    id: "gerson",
    name: "Gerson Enriquez Cruz",
    bio: "Frontend Dev",
    linkedin: "gerson-enriquez",
    image: "./img/guests/gerson.jpg",
    github: "GersonEC",
    email: "gersonenriquez94@gmail.com ",
  },
];

const getFileData = async (file: string) => {
  const md = await fs.readFile(file);
  const { data, content } = matter(md) as unknown as {
    data: Data;
    content: string;
  };
  const [host, ...guests]: Participant[] = await Promise.all(
    data.guests.map((g: string) => getParticipant(g))
  );
  return await db.episode.create({
    data: {
      description: data.description,
      scheduledTime: new Date(data.date),
      title: data.title,
      youtube: data.youtube,
      body: content,
      category: "hackability.dev",
      hostId: host.id,
      guests: {
        createMany: {
          data: guests.map((g) => ({
            guestId: g.id,
          })),
        },
      },
    },
  });
};

const getParticipant = async (id: string) => {
  const author = authors.find((a) => a.id === id);
  if (!author) {
    throw new Error();
  }
  let participant = await searchParticipant(
    author?.github || "",
    author?.image || ""
  );
  if (!participant) {
    participant = await db.participant.create({
      data: {
        bio: author.bio,
        email: author.email,
        name: author.name,
        github: author.github,
        avatar: author.image,
        linkedin: author.linkedin,
        twitter: author.twitter,
      },
    });
  }
  return participant;
};

const searchParticipant = async (github: string, image: string) => {
  let p = await db.participant.findFirst({
    where: {
      github,
    },
  });
  if (!p && !!image) {
    p = await db.participant.findFirst({
      where: {
        avatar: image,
      },
    });
  }
  return p;
};

const getData = async () => {
  const files = await getFiles();
  return Promise.all(files.map(getFileData));
};

main().then(() => console.log("done"));
