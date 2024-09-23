export interface AssetsLibStateProps {
    getAssetsLib?: GetAssetsLib[];
    error?: object | string | null;
  }
  
  export interface GetAssetsLib {
    id?: string;
    name?: string;
    note?: string;
    qty?: number;
    propertiesDetail?: [{
        id?: string;
        qty?: number;
        state?: string;
    }];
  };
  