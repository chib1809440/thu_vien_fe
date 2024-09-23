export interface GroupPowerStateProps {
  getGroupPower?: GetGroupPower[];
  error?: object | string | null;
}

export interface GetGroupPower {
  groupId?: string;
  groupName?: string;
};
