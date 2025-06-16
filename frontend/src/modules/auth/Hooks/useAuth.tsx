import { useContext } from "react"
import { DataContextUser } from "../Context/AuthContext"

export const useUser =()=>{
    // 1. Consumir el valor del contexto
    const user = useContext(DataContextUser)
    
  // 2. Si no hay usuario (es decir, estamos fuera del Provider), lanzar un error
  // Esto ayuda a detectar rápidamente un uso incorrecto del hook
    if(!user){
         throw new Error ('Error: este componente no está envuelto en ContextProvide')
    }
    // 3. Devolver el objeto user para que el componente lo utilice
    return user

}