import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from '../services/blog'

export const QUERY_KEYS = {
  BLOGS: 'blogs',
  BLOG: 'blog',
}

export const useBlogs = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.BLOGS],
    queryFn: blogService.getAll,
  })
}

export const useBlog = (id) => {
  return useQuery({
    queryKey: [QUERY_KEYS.BLOG, id],
    queryFn: () => blogService.getById(id),
    enabled: !!id, 
  })
}

export const useCreateBlog = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: blogService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BLOGS] })
    },
  })
}

export const useUpdateBlog = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, updatedBlog }) => blogService.update(id, updatedBlog),
    onSuccess: (updatedBlog) => {
      queryClient.setQueryData([QUERY_KEYS.BLOG, updatedBlog.id], updatedBlog)
      queryClient.setQueryData([QUERY_KEYS.BLOGS], (oldBlogs) => {
        return oldBlogs?.map(blog => 
          blog.id === updatedBlog.id ? updatedBlog : blog
        )
      })
    },
  })
}

export const useDeleteBlog = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: blogService.delete,
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: [QUERY_KEYS.BLOG, deletedId] })
      
      queryClient.setQueryData([QUERY_KEYS.BLOGS], (oldBlogs) => {
        return oldBlogs?.filter(blog => blog.id !== deletedId)
      })
    },
  })
}