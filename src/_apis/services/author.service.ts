import BaseApi from "./base-api";

class AuthorService extends BaseApi { }

const authorService = new AuthorService("/author");

export default authorService;