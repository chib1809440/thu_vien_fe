import BaseApi from "./base-api";

class LoanSlipService extends BaseApi { }

const loanSlipService = new LoanSlipService("/loan-slip");

export default loanSlipService;