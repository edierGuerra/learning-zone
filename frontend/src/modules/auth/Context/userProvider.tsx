import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerAPI } from "../Services/Register.server";
import { loginAPI } from "../Services/Login.server";
import type { TUser, TUserProfile } from "../../types/User";
import { UserContext } from "./userContext";
import { authStorage } from "../../../shared/Utils/authStorage";

// Importa el módulo de almacenamiento centralizado

// Tipo para los props del proveedor
type Props = {
  children: React.ReactNode;
};

export const UserProvider = ({ children }: Props) => {
  const navigate = useNavigate();

  // Estado para el token y el usuario autenticado
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<TUserProfile | null>(null);

  // Estado para indicar que ya se hizo la validación inicial
  const [isReady, setIsReady] = useState(false);

  // Efecto que se ejecuta una vez al iniciar para verificar si hay sesión guardada
  useEffect(() => {
    const storedUser = authStorage.getUser(); // Usa método seguro
    const storedToken = authStorage.getToken(); // Usa método seguro

    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
    }

    setIsReady(true); // Indica que la app ya está lista para renderizar
  }, []);

  // Registro de usuario: llama a la API y guarda los datos si tiene éxito
  const registerUser = async (
    num_identification: TUser['num_identification'],
    name: TUser['name'],
    lastNames: TUser['lastNames'],
    email: TUser['email'],
    password: TUser['password']
  ) => {
    try {
      const res = await registerAPI({ num_identification, name, lastNames, email, password });
      if (res) {
        const token = res.data.token;
        const userObj = {
          name: res.data.userName,
          email: res.data.email,
        };

        // Guarda usando el módulo de almacenamiento centralizado
        authStorage.setToken(token);
        authStorage.setUser(userObj);

        setToken(token);
        setUser(userObj);
        navigate("/login"); // Redirige tras registro exitoso
      }
    } catch (error) {
      console.error("Error en el registro:", error);
    }
  };

  // Login del usuario: consume la API y guarda el token/usuario
  const loginUser = async ({
    email,
    password,
  }: {
    email: TUser['email'];
    password: TUser['password'];
  }) => {
    try {
      const res = await loginAPI(email, password);
      if (res) {
        const token = res.data.token;
        const userObj = {
          name: res.data.userName,
          email: res.data.email,
        };

        // Guarda usando el módulo de almacenamiento centralizado
        authStorage.setToken(token);
        authStorage.setUser(userObj);

        setToken(token);
        setUser(userObj);
        navigate("/home"); // Redirige al dashboard tras login
      }
    } catch (error) {
      console.error("Error en el login:", error);
    }
  };

  // Verifica si el usuario está logueado
  const isLoggedIn = () => !!user;

  // Cierra sesión: limpia los datos y redirige
  const logout = () => {
    authStorage.removeToken(); // Limpia con el método centralizado
    authStorage.removeUser();  // Limpia con el método centralizado
    setUser(null);
    setToken(null);
    navigate("/");
  };

  return (
    <UserContext.Provider
      value={{ loginUser, user, token, logout, isLoggedIn, registerUser }}
    >
      {/* Espera a que se haga la verificación inicial antes de renderizar */}
      {isReady ? children : null}
    </UserContext.Provider>
  );
};
