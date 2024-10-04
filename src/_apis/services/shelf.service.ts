import BaseApi from "./base-api";

class ShelfService extends BaseApi { }

const shelfService = new ShelfService("/shelves");

export default shelfService;