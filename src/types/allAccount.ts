export interface AllAccountStateProps {
  allAccount?: GetAllAccount[];
  userAccount?: GetAllAccount;
  error?: object | string | null;
}

export interface GetAllAccount {
  userID?: string;
  username?: string;
  isActive?: boolean;
  fullName?: string;
  gender?: string;
  addressUser?: string;
  emailUser?: string;
  numberPhone?: string;
  imageUser?: string;
  birthDay?: string;
  departmentID?: string;
  role?: number;
  statusCode?: number
};
