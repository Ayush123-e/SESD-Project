export interface RegisterDTO {
  name: string;
  email: string;
  password?: string;
  role?: 'LIBRARIAN' | 'Member';
}

export interface LoginDTO {
  email: string;
  password?: string;
}

export interface AuthResponseDTO {
  user: {
    _id: any;
    name: string;
    email: string;
    role: string;
    createdAt?: Date;
  };
  token: string;
}
