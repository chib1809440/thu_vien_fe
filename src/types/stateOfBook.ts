import { GetSupplies } from "./supplies";

export interface StateOfBookStateProps {
  getStateOfBook?: GetStateOfBook[] | any;
  error?: object | string | null;
}

export interface GetStateOfBook {
  id?: string;
  qty?: number;
  state?: string;
  supply?: GetSupplies;
};
