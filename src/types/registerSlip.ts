import { GetSupplies } from "./supplies";
import { UserProfileV2 } from "./user-profile";

export interface RegisterSlipStateProps {
  getRegisterSlip?: GetRegisterSlip[] | any;
  getRegisterSlipLT?: GetRegisterSlipLT[] | any;
  getAllRegisterSlipLT?: GetRegisterSlipLT[] | any;
  error?: object | string | null;
}

export interface GetRegisterSlip {
  id?: string;
  create_at?: string;
  return_date?: string;
  return_at?: string;
  numberPhone?: string;
  approver_id?: string;
  state?: string;
  note?: string;
  detail?: GetSupplies;
  user?: UserProfileV2;
};

export interface GetRegisterSlipLT {
  id?: string;
  create_at?: string;
  return_date?: string;
  return_at?: string;
  numberPhone?: string;
  approver_id?: string;
  state?: string;
  note?: string;
  detail?: [{
    qty: number
    supplies: string
  }];
  ownerUser: {};
  user: {}
};

