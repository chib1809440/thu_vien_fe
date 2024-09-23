export interface TypeSuplyStateProps {
  getTypeSuply?: GetTypeSuply[];
  getTypeSuplyLT?: GetTypeSuplyLT[];
  error?: object | string | null;
}

export interface GetTypeSuply {
  id?: string;
  name?: string;
  note?: string;
};
export interface GetTypeSuplyLT {
  id?: string;
  name?: string;
  note?: string;
  user?: {
    schoolName: string;
  }
};

