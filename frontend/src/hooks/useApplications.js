import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getApplicationsApi,
  createApplicationApi,
  updateApplicationApi,
  deleteApplicationApi
} from '../api/applications';
import toast from 'react-hot-toast';

const QUERY_KEY = ['applications'];

export const useApplications = () => {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn:  async () => {
      const res = await getApplicationsApi();
      return res.data.data;
    }
  });
};

export const useCreateApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => createApplicationApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Application added!');
    },
    onError: () => toast.error('Failed to create application')
  });
};

export const useUpdateApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateApplicationApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Updated!');
    },
    onError: () => toast.error('Failed to update application')
  });
};

export const useDeleteApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteApplicationApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Application deleted');
    },
    onError: () => toast.error('Failed to delete application')
  });
};