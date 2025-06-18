export type TUser ={
    id:number 
    num_identification: number
    name: string 
    lastNames: string
    email:string
    password: string

}
// Define el tipo de datos que tendrá el contexto
export type UserContextType = {
  user: TUserProfile | null;
  token: TUserProfileToken["token"] | null;
  // Métodos disponibles desde el contexto
  registerUser: (
    num_identification: number,
    name: string,
    lastNames: string,
    email: string,
    password: string
  ) => void;
  loginUser: (dataLogin: Pick<TUser, "email" | "password">) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
};

export type TUserProfileToken  ={
    name: TUser['name'],
    email:TUser['email'],
    token:string
}

export type TUserProfile ={
    name: TUser['name'],
    email:TUser['email']
}
