
export interface CabinetStateProps {
  getCabinet?: GetCabinet[] | any;
  error?: object | string | null;
}

export interface GetCabinet {
 cabinetId?: string;
 cabinetName?: string;
 cabinetDescription?: string;
};
