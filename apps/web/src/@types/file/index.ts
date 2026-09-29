export type CategoryType = "doc" | "image" | "archive";
export type AllowedCategoryType = CategoryType | "all";

export interface IFile {
  file: File;
  author: {
    uid: string;
    name: string;
  };
  createdAt: Date;
}
