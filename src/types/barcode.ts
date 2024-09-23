export interface BarcodeStateProps {
  getBarcode?: GetBarcode[];
  error?: object | string | null;
}

export interface GetBarcode {
  isBarcode?: boolean;
  userID?: string;
};
