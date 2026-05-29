import { useEffect, useState } from 'react';
import { adminLogin, getAdminMe } from './api';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem('adminToken')));

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    getAdminMe()
      .then((res) => setAdmin(res.data.admin))
      .catch(() => localStorage.removeItem('adminToken'))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await adminLogin({ email, password });
    localStorage.setItem('adminToken', res.data.token);
    setAdmin(res.data.admin);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
