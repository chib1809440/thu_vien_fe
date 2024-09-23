export interface ApiStateProps {
  getApiLT?: GetApiLT[];
  error?: object | string | null;
}

export interface GetApiLT {
  id?: string;
  api?: string;
  name?: string;
};
