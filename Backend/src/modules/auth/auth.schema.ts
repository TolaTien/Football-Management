export interface LoginDto {
  email: string;
  password: string;
}


export interface RegisterDto {
  email: string;
  password: string;
  phone: string;
  fullName: string;
};


export interface CheckAuthDto {
  userId: string;
}

export interface RefreshToken {
  refreshToken: string;
}