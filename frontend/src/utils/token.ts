export const getToken = () => {
  if (typeof window === "undefined") return null;

  return localStorage.getItem("accessToken");
};

export const setToken = (token: string) => {
  if (typeof window === "undefined") return;

  localStorage.setItem("accessToken", token);
};

export const removeToken = () => {
  if (typeof window === "undefined") return;

  localStorage.removeItem("accessToken");
};