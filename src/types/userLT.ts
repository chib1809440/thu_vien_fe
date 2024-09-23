export interface UserLTStateProps {
  getUserLT?: GetUserLT[];
  error?: object | string | null;
}

export interface GetUserLT {
  userID?: string;
  username?: string;
  isLogin?: string;
  isActive?: string;
  fullName?: string;
  gender?: number;
  addressUser?: string;
  emailUser?: string;
  numberPhone?: string;
  imageUser?: string;
  birthDay?: string;
  role?: number;
  schoolName?: string;
};
