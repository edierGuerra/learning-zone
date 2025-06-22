export type TStudent ={
    id:number 
    numIdentification: number
    name: string 
    lastNames: string
    email:string
    password: string

}


export type TStudentProfileToken  ={
    name: TStudent['name'],
    email:TStudent['email'],
    token:string
}
export type TStudentProfile ={
  name: TStudent['name'],
  email:TStudent['email']
}

export type StudentContextType = {
  student: TStudentProfile | null; // Usuario actual
  token: TStudentProfileToken["token"] | null; // Token JWT
  isLoggedIn: boolean; // Indica si está logueado
  logout: () => void; // Cierra sesión
  setStudent?: React.Dispatch<React.SetStateAction<TStudentProfile | null>>; // Opcional: útil si lo usas desde hooks
  setToken?: React.Dispatch<React.SetStateAction<string | null>>; // Opcional: igual que arriba
};

