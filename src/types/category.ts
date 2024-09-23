export interface CategoryStateProps {
  getCategory?: GetCategory[];
  getCategoryLT?: GetCategoryLT[];
  error?: object | string | null;
}

export interface GetCategory {
  categoryId?: string;
  categoryName?: string;
  categoryDescription?: string;
};

export interface GetCategoryLT {
  id?: string;
  categoryName?: string;
  categoryDescription?: string;
  user: {
    schoolName: string;
  }
};

