import { createContext,  useState } from 'react';

const AuthContext = createContext();

 function AuthProvider({ children }) {
  const [userRole, setUserRole] = useState('customer'); 
  const [user, setUser] = useState(null);

  return (
    <AuthContext.Provider value={{ userRole, setUserRole, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };

 