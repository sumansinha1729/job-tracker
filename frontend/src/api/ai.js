import api from './axios';

export const parseJDApi = (jobDescription) =>
  api.post('/ai/parse', { jobDescription });