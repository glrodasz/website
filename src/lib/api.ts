import client, { previewClient } from './sanity';

const eventFields = `
  title,
  'slug': slug.current,
  'category': {
    'name': category->name,
  },
  'cover': {
    'alt': cover.alt,
    'src': cover.asset->url
  },
  date,
  description,
  tags,
  recording
`;

const mentorsFields = `
  name,
  description,
  'photo': {
    'alt': photo.alt,
    'src': photo.asset->url
  },
  web,
  calendly,
  github,
  linkedin,
  topics
`;

const docFields = `
  title,
  slug,
  body
`;

const mentoringTopics = `
  topics,
  _id,
  title
`;

const getClient = (preview) => (preview ? previewClient : client);

export async function getAllEvents(preview) {
  const data = await getClient(preview).fetch(
    `*[_type == "event"] | order(date desc) {
      ${eventFields}
    }`,
  );

  return data;
}

export async function getAllMentors(preview) {
  const data = await getClient(preview).fetch(
    `*[_type == "mentor"] | order(date desc) {
      ${mentorsFields}
    }`,
  );
  return data;
}

export async function getAllDocs() {
  const data = await client.fetch(
    `*[_type == "docs" ] | order(date desc) {
      ${docFields}
    }`,
  );
  return data;
}

export async function getDocBySlug(slug) {
  const data = await client.fetch(
    `*[_type == "docs" && slug.current == "${slug}"][0]{
      ${docFields}
    }`,
    { slug },
  );
  return data;
}

export async function getMentoringTopics(preview) {
  const data = await getClient(preview).fetch(
    `*[_type == "topic"] | order(date desc) {
      ${mentoringTopics}
    }`,
  );
  return data;
}
