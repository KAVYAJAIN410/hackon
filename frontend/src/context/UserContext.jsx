import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users')
      .then((data) => {
        setUsers(data);
        if (data.length > 0) {
          setCurrentUser(data[0]); // default to first user
        }
      })
      .catch((err) => {
        console.error('Failed to fetch users:', err);
        // Fallback user so the app doesn't break
        setCurrentUser({ id: 'user-001', name: 'Demo User', city: 'Delhi', greenCredits: 0, greenTier: 'SEEDLING' });
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <UserContext.Provider value={{ users, currentUser, setCurrentUser, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within a UserProvider');
  return ctx;
}

export default UserContext;
