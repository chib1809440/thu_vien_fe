import { SuppliesStateProps } from "./supplies";

export interface LibraryConnectionStateProps {
  getLibraryConnection?: SuppliesStateProps[] | any;
  getContact?: GetContact[] | any;
  error?: object | string | null;
}

export interface GetContact {
  idContact?: string;
  nameContact?: string;
  nameContactEN?: string;
  addressContact?: string;
  phoneContact?: string;
  hotline?: string;
  fax?: string;
  zaloContact?: string;
  emailContact?: string;
  facebookContact?: string;
  youtubeContact?: string;
  urlContact?: string;
  urlGoogleMap?: string;
  ScriptFacebook?: string;
  imageLogo?: string;
 };
 

