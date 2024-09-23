export interface ProjectWaitingStateProps {
  getlistprojectwaiting: GetListProjectWaiting | null;
  error: object | string | null;
}

export type GetListProjectWaiting = {
  _id: string;
  name: string;
  projectType: any;
  applicationType: any;
  createdAt: any;
};
