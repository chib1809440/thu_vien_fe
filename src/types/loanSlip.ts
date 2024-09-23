export interface LoanSlipStateProps {
  getLoanSlip?: GetLoanSlip[];
  getLoanSlipLT?: GetLoanSlipLT[];
  getAllLoanSlipLT?: GetLoanSlipLT[];
  error?: object | string | null;
}

export interface GetLoanSlip {
  loanSlipNumber?: string;
  name?: string;
  create_at?: string;
  return_date?: string;
  return_at?: string;
  numberPhone?: string;
  creator_id?: string;
  approver_id?: string;
  quantity?: number;
  state?: string;
  note?: string;
  supplies?: [];
};

export interface GetLoanSlipLT {
  loanSlipNumber?: string;
  create_at?: string;
  return_date?: string;
  return_at?: string;
  limited_date?: string;
  numberPhone?: string;
  creator_id?: string;
  approver_id?: string;
  state?: boolean;
  note?: string;
  users?: {};
  owner?: {};
  supplies?: [];
};

