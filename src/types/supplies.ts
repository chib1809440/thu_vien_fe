export interface SuppliesStateProps {
  getSupplies?: GetSupplies[] | any;
  getSuppliesLT?: GetSuppliesLT[] | any;
  error?: object | string | null;
}

export interface GetSupplies {
  supplyId?: string;
  supplyName?: string;
  alias?: string;
  language?: string;
  translation?: string;
  ISBN?: string;
  ISSN?: string;
  numberPages?: number;
  numberEpisodes?: string;
  price?: string;
  yearPublication?: [];
  supplyUrl?: string;
  supplyDescription?: string;
  supplyNote?: string;
  listMedia?: [];
  publisher?: {
    publisherId?: string;
    publisherName?: string;
  };
  printedMatter?: {
    printedMatterId?: string;
    printedMatterName?: string;
  };
  category?: {
    categoryDetailId?: string;
    list?: [
      {
        categoryId: string;
        categoryName: string;
      }
    ]
  };
  typeOfStorage?: {
    detailTypeOfStorageId?: string;
    list?: [
      {
        typeOfStorageId: string;
        typeOfStorageName: string;
      }
    ]
  };
  authors?: {
    detailAuthorId?: string;
    list?: [
      {
        authorId: string;
        authorName: string;
      }
    ]
  };
};

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
