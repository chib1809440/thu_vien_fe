import BaseApi from "./base-api";

class PublicationsService extends BaseApi {}

const publicationsService = new PublicationsService("/publications");

export default publicationsService;