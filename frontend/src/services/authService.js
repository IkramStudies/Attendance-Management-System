import api from "./api";

/* =========================
   AUTH
========================= */

export const loginUser = async (formData) => {
  const { data } = await api.post("/auth/login", formData);
  return data;
};

export const registerUser = async (formData) => {
  const { data } = await api.post("/auth/register", formData);
  return data;
};

/* =========================
   EMAIL VERIFICATION
========================= */

export const verifyEmail = async (token) => {
  const { data } = await api.get(`/auth/verify-email/${token}`);
  return data;
};

export const resendVerificationEmail = async (email) => {
  const { data } = await api.post("/auth/resend-verification", { email });
  return data;
};

/* =========================
   FORGOT / RESET PASSWORD
========================= */

export const forgotPassword = async (email) => {
  const { data } = await api.post("/auth/forgot-password", { email });
  return data;
};

export const resetPassword = async (token, password) => {
  const { data } = await api.post(`/auth/reset-password/${token}`, {
    password,
  });
  return data;
};
