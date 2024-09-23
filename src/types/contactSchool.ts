export interface ContactSchoolProps {
  getContactSchool?: GetContactSchool;
  error?: object | string | null;
}

export interface GetContactSchool {
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
};
