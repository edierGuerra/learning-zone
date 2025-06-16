import { createContext, type ReactNode } from "react";
import type { TUser } from "../../types/User";



export const DataContextUser = createContext<TUser | null>(null)

type children ={
    children: ReactNode
}
export const ContextProvider = ({children}:children)=>{
    const value:TUser = {
        id:1,
        email:'dsd',
        lastNames:'rf',
        name:'ff',
        num_identification:13,
        password:'41341'
    }
    return (
        <DataContextUser.Provider value={value}>
            {children}
        </DataContextUser.Provider>
    )

}