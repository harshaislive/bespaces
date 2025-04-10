'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import createSupabaseClient from '@/lib/supabase/supabase-client';
import { Category, User } from '@/types';
import { Header } from '@/components/layout/Header';
import Link from 'next/link';
import { SupabaseClient } from '@supabase/supabase-js';

export default function UploadCard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    category: 'Tools' as Category, // Default to Tools instead of Videos
    tag: '',
    featured: false
  });

  useEffect(() => {
    setSupabase(createSupabaseClient());
  }, []);
  
  // Auth check effect
  useEffect(() => {
    if (!supabase) return;
    
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.email?.split('@')[0] || '',
          });
        } else {
          router.replace('/login');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        router.replace('/login');
      }
    };
    
    checkUser();
  }, [supabase, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Validate file size (100MB limit)
      if (file.size > 100 * 1024 * 1024) {
        setMessage({ text: 'File size should not exceed 100MB', type: 'error' });
        return;
      }

      // Validate file type
      if (!file.type.startsWith('video/')) {
        setMessage({ text: 'Please select a valid video file', type: 'error' });
        return;
      }

      setVideoFile(file);
      setMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !supabase) {
      setMessage({ text: 'You must be logged in to upload.', type: 'error' });
      return;
    }

    if (formData.category === 'Videos' && !videoFile) {
      setMessage({ text: 'Please select a video file to upload', type: 'error' });
      return;
    }
    
    setIsSubmitting(true);
    setMessage(null);
    
    try {
      let finalLink = formData.link;

      // Handle video upload if category is Videos
      if (formData.category === 'Videos' && videoFile) {
        const sanitizedFileName = videoFile.name.replace(/[^a-zA-Z0-9.]+/g, '_');
        const filePath = `${user.id}/${Date.now()}-${sanitizedFileName}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('bespace-videos')
          .upload(filePath, videoFile);

        if (uploadError) throw uploadError;
        if (!uploadData?.path) throw new Error('Upload succeeded but no path returned');
        
        finalLink = uploadData.path;
      }

      const { error } = await supabase.from('cards').insert({
        ...formData,
        link: finalLink,
        creator_id: user.id,
        creator_name: user.name || user.email,
      });

      if (error) throw error;
      
      setMessage({ text: 'Resource added successfully!', type: 'success' });
      setFormData({
        title: '',
        description: '',
        link: '',
        category: 'Tools' as Category,
        tag: '',
        featured: false
      });
      setVideoFile(null);
      
      // Optional: Redirect to home after successful upload
      router.push('/');
    } catch (error) {
      console.error('Upload error:', error);
      setMessage({ 
        text: `Failed to upload resource: ${error instanceof Error ? error.message : 'Unknown error'}`, 
        type: 'error' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#344736] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#344736] text-sm">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
      <Header user={user} />
      
      <div className="flex-1 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-serif font-bold text-[#344736]">Upload Resource</h1>
            <Link 
              href="/"
              className="text-sm text-[#344736] hover:text-[#415c43] underline"
            >
              Back to Resources
            </Link>
          </div>
          
          <div className="bg-white rounded-lg border border-[#e7e4df] p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category - Moved to top */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-[#342e29] mb-1">
                  Category <span className="text-[#86312b]">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-[#e7e4df] bg-[#fdfbf7] text-[#342e29] text-sm focus:ring-1 focus:ring-[#344736] focus:border-[#344736] focus:outline-none"
                >
                  <option value="Tools">Tools</option>
                  <option value="Videos">Videos</option>
                  <option value="Documents">Documents</option>
                  <option value="Knowledge">Knowledge</option>
                </select>
              </div>

              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-[#342e29] mb-1">
                  Title <span className="text-[#86312b]">*</span>
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-[#e7e4df] bg-[#fdfbf7] text-[#342e29] text-sm focus:ring-1 focus:ring-[#344736] focus:border-[#344736] focus:outline-none"
                />
              </div>
              
              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-[#342e29] mb-1">
                  Description <span className="text-[#86312b]">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-[#e7e4df] bg-[#fdfbf7] text-[#342e29] text-sm focus:ring-1 focus:ring-[#344736] focus:border-[#344736] focus:outline-none"
                />
              </div>
              
              {/* Resource Link or Video Upload based on category */}
              {formData.category === 'Videos' ? (
                <div>
                  <label htmlFor="video" className="block text-sm font-medium text-[#342e29] mb-1">
                    Video File <span className="text-[#86312b]">*</span>
                  </label>
                  <input
                    id="video"
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#344736]/10 file:text-[#344736] hover:file:bg-[#344736]/20"
                  />
                  <p className="text-xs text-[#51514d] mt-1">Maximum file size: 100MB. Supported formats: MP4, WebM, etc.</p>
                </div>
              ) : (
                <div>
                  <label htmlFor="link" className="block text-sm font-medium text-[#342e29] mb-1">
                    Link <span className="text-[#86312b]">*</span>
                  </label>
                  <input
                    id="link"
                    name="link"
                    type="url"
                    required
                    value={formData.link}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    className="w-full px-4 py-2 rounded-md border border-[#e7e4df] bg-[#fdfbf7] text-[#342e29] text-sm focus:ring-1 focus:ring-[#344736] focus:border-[#344736] focus:outline-none"
                  />
                </div>
              )}
              
              {/* Tag */}
              <div>
                <label htmlFor="tag" className="block text-sm font-medium text-[#342e29] mb-1">
                  Tag (Optional)
                </label>
                <input
                  id="tag"
                  name="tag"
                  type="text"
                  value={formData.tag}
                  onChange={handleChange}
                  placeholder="e.g. Tutorial, Workshop, etc."
                  className="w-full px-4 py-2 rounded-md border border-[#e7e4df] bg-[#fdfbf7] text-[#342e29] text-sm focus:ring-1 focus:ring-[#344736] focus:border-[#344736] focus:outline-none"
                />
              </div>
              
              {/* Featured Toggle */}
              <div className="flex items-center">
                <input
                  id="featured"
                  name="featured"
                  type="checkbox"
                  checked={formData.featured}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-[#344736] border-[#e7e4df] rounded focus:ring-[#344736]"
                />
                <label htmlFor="featured" className="ml-2 block text-sm text-[#342e29]">
                  Mark as featured resource (will appear in the featured section)
                </label>
              </div>
              
              {/* Success/Error Message */}
              {message && (
                <div className={`p-3 rounded-md text-sm ${
                  message.type === 'success' 
                    ? 'bg-[#b8dc99]/20 text-[#344736] border border-[#b8dc99]/30' 
                    : 'bg-[#9e3430]/10 text-[#86312b] border border-[#9e3430]/20'
                }`}>
                  {message.text}
                </div>
              )}
              
              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-md bg-[#344736] text-[#fdfbf7] text-sm hover:bg-[#415c43] disabled:opacity-50 transition-colors shadow-sm flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-4 w-4 border-2 border-t-transparent border-[#fdfbf7] rounded-full animate-spin"></span>
                      Uploading...
                    </>
                  ) : 'Upload Resource'}
                </button>
              </div>
            </form>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-xs text-[#51514d]">
              This page is for authorized users only. All uploads are tracked.
            </p>
          </div>
        </div>
      </div>
      
      <footer className="py-6 bg-[#e7e4df] border-t border-[#d1cec9] mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs text-[#51514d]">© {new Date().getFullYear()} Beforest. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 