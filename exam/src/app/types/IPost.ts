import { IUser } from './IUser';

export interface IPost {
  _id:string;
  description: string;
  likedBy: string[];
  comments: {
    comment:string,
    _id:string,
    owner:IUser,
    createdAt:string;
    lastEditedAt:string;
  }[];
  owner: IUser;
  createdAt:string;
  lastEditedAt:string;
  image: {
    data: { data: [] };
    contentType: string;
  }|null;
}
