import api from './axios';

export const getApplicationsApi = () =>
  api.get('/applications');

export const createApplicationApi = (data) =>
  api.post('/applications', data);

export const updateApplicationApi = (id, data) =>
  api.put(`/applications/${id}`, data);

export const deleteApplicationApi = (id) =>
  api.delete(`/applications/${id}`);