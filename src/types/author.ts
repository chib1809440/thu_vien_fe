export interface AuthorStateProps {
  getAuthor?: GetAuthor[];
  getAuthorLT?: GetAuthorLT[];
  error?: object | string | null;
}

export interface GetAuthor {
  authorId?: string;
  authorName?: string;
  authorDescription?: string;
};

export interface GetAuthorLT {
  id?: string;
  authorName?: string;
  authorDescription?: string;
  user?: {
    schoolName?: string;
  }
};
