export interface UsbStateProps {
  getUsb?: GetUsb[];
  error?: object | string | null;
}

export interface GetUsb {
  isUsb?: boolean;
};
