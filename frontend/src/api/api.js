/**
 * api.js — centralized API calls for Talant Scan AI
 * All requests point to the Flask backend running on localhost:5000
 */

import axios from "axios";

// Base URL of the Flask backend
const BASE_URL = "http://localhost:8000/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 s — resume processing can be slow
});

/**
 * screenResumes
 * Sends job description + resume files to the backend for NLP scoring.
 * @param {string}   jobDescription  - raw text of the job posting
 * @param {FileList} files           - resume files (.pdf / .txt)
 * @returns {Promise<{candidates: Array}>}
 */
export async function screenResumes(jobDescription, files) {
  const formData = new FormData();
  formData.append("job_description", jobDescription);
  Array.from(files).forEach((file) => formData.append("resumes", file));

  const response = await api.post("/screen", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

/**
 * sendChatMessage
 * Sends a user message to the chatbot endpoint.
 * @param {string} message - the user's chat input
 * @returns {Promise<{reply: string}>}
 */
export async function sendChatMessage(message) {
  const response = await api.post("/chat", { message });
  return response.data;
}
