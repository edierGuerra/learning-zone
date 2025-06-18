// Hook personalizado para acceder al contexto
import { useContext } from "react"
import { UserContext } from "../Context/userContext"
export const useUser =()=>{
    // 1. Consumir el valor del contexto
    const user = useContext(UserContext)
    
  // 2. Si no hay usuario (es decir, estamos fuera del Provider), lanzar un error
  // Esto ayuda a detectar rápidamente un uso incorrecto del hook
    if(!user){
         throw new Error ('Error: este componente no está envuelto en ContextProvide')
    }
    // 3. Devolver el objeto user para que el componente lo utilice
    return user

}