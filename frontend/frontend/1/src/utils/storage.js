export const setAuth = (token, role, id) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("user_id", id);
  };
  
  export const getToken = () => localStorage.getItem("token");
  export const getRole = () => localStorage.getItem("role");
  export const getUserId = () => localStorage.getItem("user_id");
  
  export const logout = () => localStorage.clear();
  