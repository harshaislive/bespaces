import { Card, Category } from '@/types';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Card, 'id' | 'created_at' | 'likes' | 'creator_id' | 'creator_name'> & { videoFile?: FileList }) => void;
  isLoading?: boolean;
}

type FormValues = {
  title: string;
  description: string;
  link: string;
  category: Category;
  tag: string;
  videoFile?: FileList;
};

export function AddCardModal({ isOpen, onClose, onSubmit, isLoading = false }: AddCardModalProps) {
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<FormValues>({
    defaultValues: {
      title: '',
      description: '',
      link: '',
      category: 'Tools',
      tag: '',
      videoFile: undefined,
    }
  });
  
  const watchedCategory = watch('category');

  React.useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const handleFormSubmit = (data: FormValues) => {
    onSubmit({
      title: data.title,
      description: data.description,
      link: data.link,
      category: data.category,
      tag: data.tag || '',
      videoFile: data.category === 'Videos' ? data.videoFile : undefined,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="bg-card rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">Add New Resource</h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input
                          {...register('title', { required: 'Title is required' })}
                          className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary focus:outline-none"
                          placeholder="Resource Title"
                        />
                        {errors.title && <p className="text-destructive text-sm mt-1">{errors.title.message}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                          {...register('description', { required: 'Description is required' })}
                          className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary focus:outline-none"
                          rows={3}
                          placeholder="Brief description of the resource"
                        />
                        {errors.description && <p className="text-destructive text-sm mt-1">{errors.description.message}</p>}
                      </div>
                      
                      {watchedCategory !== 'Videos' ? (
                        <div>
                          <label className="block text-sm font-medium mb-1">Link</label>
                          <input
                            {...register('link', { 
                              required: watchedCategory !== 'Videos' ? 'Link is required' : false,
                              pattern: {
                                value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                                message: 'Please enter a valid URL'
                              }
                            })}
                            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary focus:outline-none"
                            placeholder="https://example.com"
                          />
                          {errors.link && <p className="text-destructive text-sm mt-1">{errors.link.message}</p>}
                        </div>
                      ) : (
                        <div>
                          <label className="block text-sm font-medium mb-1">Video File</label>
                          <input
                            type="file"
                            {...register('videoFile', {
                              required: watchedCategory === 'Videos' ? 'Video file is required' : false,
                              validate: (files) => {
                                if (watchedCategory !== 'Videos') return true;
                                if (!files || files.length === 0) return 'Video file is required';
                                const file = files[0];
                                if (file.size > 100 * 1024 * 1024) {
                                  return 'File size should not exceed 100MB';
                                }
                                if (!file.type.startsWith('video/')) {
                                  return 'Please select a valid video file';
                                }
                                return true;
                              }
                            })}
                            accept="video/*"
                            className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                          />
                          {errors.videoFile && <p className="text-destructive text-sm mt-1">{errors.videoFile.message as string}</p>}
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Category</label>
                          <select
                            {...register('category')}
                            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary focus:outline-none"
                          >
                            <option value="Tools">Tools</option>
                            <option value="Videos">Videos</option>
                            <option value="Documents">Documents</option>
                            <option value="Knowledge">Knowledge</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Tag (Optional)</label>
                          <input
                            {...register('tag')}
                            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary focus:outline-none"
                            placeholder="e.g. Poomaale, New"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-4 pt-4">
                        <button
                          type="button"
                          onClick={onClose}
                          className="px-4 py-2 rounded-lg border hover:bg-muted"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
                        >
                          {isLoading ? (
                            <>
                              <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                              Saving...
                            </>
                          ) : 'Add Resource'}
                        </button>
                      </div>
                    </form>
                  </div>
                  
                  <div className="bg-muted/30 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Preview</h4>
                    
                    <div className="bg-card border rounded-lg overflow-hidden shadow-sm">
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-lg font-bold">{watch('title') || 'Resource Title'}</h3>
                          <div className="flex items-center">
                            <span className={`text-xs px-2 py-1 rounded-full text-white ${
                              watchedCategory === 'Videos' ? 'bg-[#86312b]' : 
                              watchedCategory === 'Documents' ? 'bg-[#342e29]' : 
                              watchedCategory === 'Knowledge' ? 'bg-[#002140]' : 
                              'bg-[#344736]'
                            }`}>
                              {watchedCategory || 'Category'}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground mb-4 text-sm">
                          {watch('description') || 'Resource description will appear here'}
                        </p>
                        
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <div>Added by Beforest Team</div>
                          {watch('tag') && (
                            <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs">
                              {watch('tag')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 