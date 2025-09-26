// src/prismic.js
import * as prismic from "@prismicio/client";

export const repositoryName = "do-tran"; // replace with your Prismic repo

// Create a client
export const client = prismic.createClient(repositoryName, {
  // If you have an access token, put it here
  accessToken:
    "MC5hTllWNUJJQUFDSUFZX09M.A2xQ77-977-9Ljzvv73vv73vv70ZdkAD77-9fu-_vSjvv73vv73vv70477-9dmzvv70MP--_vRlqPw",
});
