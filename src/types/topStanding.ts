export interface StopStandingStateProps {
  getTopStanding?: GetTopStanding[];
  error?: object | string | null;
}

export interface GetTopStanding {
  total_borrowed_supplies?: number;
  supplyId?: string;
  supplyName?: string;
  printedMatter?: string;
  alias?: string;
  language?: string;
  translation?: string;
  ISBN?: string;
  ISSN?: string;
  numberPages?: string;
  numberEpisodes?: string;
  price?: string;
  yearPublication?: string;
  supplyUrl?: string;
  supplyDescription?: string;
  supplyNote?: string;
  quantity?: number;
  cabinet_quantity?: number;
  warehouse_quantity?: number;
  isOutStanding?: boolean;
};
