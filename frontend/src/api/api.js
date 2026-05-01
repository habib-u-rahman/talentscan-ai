import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Auth ──────────────────────────────────────────────────────────────────────

export const signupUser = async (name, email, password) =>
  (await api.post("/signup", { name, email, password })).data;

export const loginUser = async (email, password) => {
  const data = (await api.post("/login", { email, password })).data;
  // store token + user separately
  localStorage.setItem("token", data.access_token);
  localStorage.setItem("user", JSON.stringify(data.user));
  return data;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  sessionStorage.removeItem("pipeline_data");
};

// ── Screening History ─────────────────────────────────────────────────────────

export const getHistory = async () =>
  (await api.get("/history")).data;

export const saveHistory = async (title, resume_count, job_description = "", avg_score = null, top_score = null, results = null) =>
  (await api.post("/history", { title, resume_count, job_description, avg_score, top_score, results })).data;

export const getAnalytics = async () =>
  (await api.get("/analytics")).data;

export const deleteHistoryEntry = async (id) =>
  api.delete(`/history/${id}`);

export const clearHistory = async () =>
  api.delete("/history");

// ── NLP Screening ─────────────────────────────────────────────────────────────

export const screenResumes = async (jobDescription, files) => {
  const formData = new FormData();
  formData.append("job_description", jobDescription);
  Array.from(files).forEach((f) => formData.append("resumes", f));
  return (await api.post("/screen", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })).data;
};

// ── Email Verification ────────────────────────────────────────────────────────

export const verifyEmail = async (token) =>
  (await api.get(`/verify-email?token=${token}`)).data;

export const resendVerification = async (email) =>
  (await api.post("/resend-verification", { email })).data;

// ── Password Reset ────────────────────────────────────────────────────────────

export const forgotPassword = async (email) =>
  (await api.post("/forgot-password", { email })).data;

export const resetPassword = async (token, new_password) =>
  (await api.post("/reset-password", { token, new_password })).data;

// ── Chatbot ───────────────────────────────────────────────────────────────────

export const sendChatMessage = async (message, history = []) =>
  (await api.post("/chat", { message, history }, { timeout: 90000 })).data;
