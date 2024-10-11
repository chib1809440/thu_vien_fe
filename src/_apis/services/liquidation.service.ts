import BaseApi from "./base-api";

class LiquidationService extends BaseApi { }

const liquidationService = new LiquidationService("/liquidation");

export default liquidationService;