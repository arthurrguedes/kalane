// Valida formato de e-mail seguro
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

// Exige: mín 8 caracteres, 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial
export const isStrongPassword = (password) => {
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return re.test(password);
};

// Exige nome e sobrenome (espaço no meio e mín 3 letras)
export const isValidName = (name) => {
  const trimmedName = name.trim();
  return trimmedName.length >= 3 && trimmedName.includes(' ');
};