export interface SuppliesLTStateProps {
  getSuppliesLT?: GetSuppliesLT[] | any;
  error?: object | string | null;
}

export interface GetSuppliesLT {
  id?: string;
  supplyName?: string;
  publisher?: string;
  printedMatter?: string;
  alias?: string;
  language?: string;
  translation?: string;
  ISBN?: number;
  ISSN?: string;
  numberPages?: string;
  numberEpisodes?: string;
  price?: string;
  yearPublication?: string;
  supplyDescription?: string;
  supplyNote?:string;
  quantity?:number;
  typeOfSupply?:string;
  category?:string;
  medias?:[];
  user?:{
    userID?:string;
    schoolName?: string;
  };
};
