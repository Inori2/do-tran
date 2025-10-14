// src/prismic.js
import * as prismic from "@prismicio/client";

// load repo name and access token from environment variables
export const repositoryName = import.meta.env.VITE_PRISMIC_REPO_NAME;
export const accessToken = import.meta.env.VITE_PRISMIC_ACCESS_TOKEN;

// create the client using env variables
export const client = prismic.createClient(repositoryName, {
  accessToken,
});
