export interface IUser {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    birthdate: string;
    bio:string;
    profilePicture: {
      data: { data: [] };
      contentType: string;
    };
    following:string[];
    followers:string[];
  }
  