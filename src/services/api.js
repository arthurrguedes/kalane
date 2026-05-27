const API_URL = 'http://localhost:3000'; 

export const apiFetch = async (endpoint, options = {}) => {
  const config = {
    ...options,
    credentials: 'include', 
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);
  
  if (!response.ok) {
    // INTERCETOR: Verifica se o erro é de autenticação/autorização
    if (response.status === 401 || response.status === 403) {
      // Dispara um alarme global que o AuthContext vai ouvir
      window.dispatchEvent(new CustomEvent('session-expired'));
    }

    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Erro de comunicação com o servidor');
  }

  return response.json();
};