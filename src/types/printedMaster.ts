
export interface PrintedMatterStateProps {
  getPrintedMatter?: GetPrintedMatter[];
  error?: object | string | null;
}

export interface GetPrintedMatter {
  printedMatterId?: string;
  printedMatterName?: string;
  printedMatterDescription?: string;
};
