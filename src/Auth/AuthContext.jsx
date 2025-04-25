import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../api/ClassesFunctions/firebaseConfig'
import { onAuthStateChanged } from 'firebase/auth'; 


const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(undefined);
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setAuthenticated(true);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setAuthenticated(false);
    setUser(null);
    localStorage.removeItem('user');
    window.location.reload()
  };

  useEffect(() => {
    // Usamos onAuthStateChanged para observar el estado de autenticación
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // Si el usuario está autenticado, almacenamos su información
        setAuthenticated(true);
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData)); // Guardamos los datos del usuario en localStorage
      } else {
        // Si no hay usuario autenticado, limpiamos el estado y el localStorage
        setAuthenticated(false);
        setUser(null);
        localStorage.removeItem('user');
      }
    });

    // Limpiamos la suscripción cuando el componente se desmonte
    return () => unsubscribe();
  }, []);



  return (
    <AuthContext.Provider value={{ authenticated, user, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };

