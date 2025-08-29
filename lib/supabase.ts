import { createClient } from '@supabase/supabase-js';

/* -----------------------------
   Supabase Client
------------------------------ */
const supabaseUrl = 'https://wqbqyipalgqzbzghjyyb.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('❌ Missing Supabase environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

/* -----------------------------
   Database Types
------------------------------ */
export interface Project {
  id: string;
  title: string;
  category: string;
  location: string;
  year: string;
  description: string;
  details: string;
  client: string;
  area: string;
  duration: string;
  featured: boolean;
  main_image: string;
  created_at: string;
  updated_at: string;
  project_images?: ProjectImage[];
}

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  alt_text?: string;
  sort_order: number;
  created_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio?: string;
  image_url: string;
  email?: string;
  linkedin_url?: string;
  sort_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  client_position: string;
  testimonial_text: string;
  rating: number;
  project_id?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SiteSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  username: string;
  password_hash: string;
  role: 'admin' | 'super_admin';
  permissions: Record<string, boolean>;
  active: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

/* -----------------------------
   Projects API
------------------------------ */
export const projectsApi = {
  async getAll(): Promise<Project[]> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*, project_images(*)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (err: any) {
      console.error('Failed to fetch projects:', err);
      throw new Error(err.message);
    }
  },

  async getById(id: string): Promise<Project | null> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*, project_images(*)')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    } catch (err: any) {
      console.error(`Failed to fetch project ${id}:`, err);
      throw new Error(err.message);
    }
  },

  async getFeatured(): Promise<Project[]> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*, project_images(*)')
        .eq('featured', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (err: any) {
      console.error('Failed to fetch featured projects:', err);
      throw new Error(err.message);
    }
  },

  async create(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
    if (!project.title || !project.category || !project.main_image) {
      throw new Error('Missing required fields: title, category, or main_image.');
    }
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert(project)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (err: any) {
      console.error('Failed to create project:', err);
      throw new Error(err.message);
    }
  },

  async update(id: string, project: Partial<Project>): Promise<Project> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(project)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (err: any) {
      console.error(`Failed to update project ${id}:`, err);
      throw new Error(err.message);
    }
  },

  async delete(id: string): Promise<void> {
    try {
      // Delete related images first
      const { error: imagesError } = await supabase
        .from('project_images')
        .delete()
        .eq('project_id', id);
      if (imagesError) throw imagesError;

      // Then delete project
      const { error: projectError } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      if (projectError) throw projectError;
    } catch (err: any) {
      console.error(`Failed to delete project ${id}:`, err);
      throw new Error(err.message);
    }
  }
};

/* -----------------------------
   Project Images API
------------------------------ */
export const projectImagesApi = {
  async create(projectImage: Omit<ProjectImage, 'id' | 'created_at'>): Promise<ProjectImage> {
    try {
      const { data, error } = await supabase
        .from('project_images')
        .insert(projectImage)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (err: any) {
      console.error('Failed to create project image:', err);
      throw new Error(err.message);
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase.from('project_images').delete().eq('id', id);
      if (error) throw error;
    } catch (err: any) {
      console.error(`Failed to delete project image ${id}:`, err);
      throw new Error(err.message);
    }
  }
};

/* -----------------------------
   Team Members API
------------------------------ */
export const teamMembersApi = {
  async getAll(): Promise<TeamMember[]> {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('active', true)
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data || [];
    } catch (err: any) {
      console.error('Failed to fetch team members:', err);
      throw new Error(err.message);
    }
  },

  async create(member: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>): Promise<TeamMember> {
    try {
      const { data, error } = await supabase.from('team_members').insert(member).select().single();
      if (error) throw error;
      return data;
    } catch (err: any) {
      console.error('Failed to create team member:', err);
      throw new Error(err.message);
    }
  },

  async update(id: string, member: Partial<TeamMember>): Promise<TeamMember> {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .update(member)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (err: any) {
      console.error(`Failed to update team member ${id}:`, err);
      throw new Error(err.message);
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase.from('team_members').delete().eq('id', id);
      if (error) throw error;
    } catch (err: any) {
      console.error(`Failed to delete team member ${id}:`, err);
      throw new Error(err.message);
    }
  }
};

/* -----------------------------
   Testimonials API
------------------------------ */
export const testimonialsApi = {
  async getAll(): Promise<Testimonial[]> {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (err: any) {
      console.error('Failed to fetch testimonials:', err);
      throw new Error(err.message);
    }
  },

  async create(testimonial: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>): Promise<Testimonial> {
    try {
      const { data, error } = await supabase.from('testimonials').insert(testimonial).select().single();
      if (error) throw error;
      return data;
    } catch (err: any) {
      console.error('Failed to create testimonial:', err);
      throw new Error(err.message);
    }
  },

  async update(id: string, testimonial: Partial<Testimonial>): Promise<Testimonial> {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .update(testimonial)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (err: any) {
      console.error(`Failed to update testimonial ${id}:`, err);
      throw new Error(err.message);
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (error) throw error;
    } catch (err: any) {
      console.error(`Failed to delete testimonial ${id}:`, err);
      throw new Error(err.message);
    }
  }
};

/* -----------------------------
   Site Settings API
------------------------------ */
export const siteSettingsApi = {
  async get(key: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', key)
        .single();
      if (error) throw error;
      return data?.setting_value;
    } catch (err: any) {
      console.error(`Failed to get site setting "${key}":`, err);
      throw new Error(err.message);
    }
  },

  async set(key: string, value: any): Promise<void> {
    try {
      const { error } = await supabase.from('site_settings').upsert(
        { setting_key: key, setting_value: value },
        { onConflict: 'setting_key' }
      );
      if (error) throw error;
    } catch (err: any) {
      console.error(`Failed to set site setting "${key}":`, err);
      throw new Error(err.message);
    }
  }
};

/* -----------------------------
   Admin Users API
------------------------------ */
export const adminUsersApi = {
  async getAll(): Promise<AdminUser[]> {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (err: any) {
      console.error('Failed to fetch admin users:', err);
      throw new Error(err.message);
    }
  },

  async authenticate(username: string, password: string): Promise<AdminUser | null> {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('username', username.toLowerCase())
        .eq('password_hash', password) // ⚠️ Consider hashing in production
        .single();
      if (error || !data) return null;

      // Update last login
      await supabase
        .from('admin_users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', data.id);

      return data;
    } catch (err: any) {
      console.error('Admin authentication failed:', err);
      return null;
    }
  },

  async create(user: Omit<AdminUser, 'id' | 'created_at' | 'updated_at' | 'last_login'>): Promise<AdminUser> {
    try {
      const { data, error } = await supabase.from('admin_users').insert(user).select().single();
      if (error) throw error;
      return data;
    } catch (err: any) {
      console.error('Failed to create admin user:', err);
      throw new Error(err.message);
    }
  },

  async update(id: string, user: Partial<AdminUser>): Promise<AdminUser> {
    try {
      const { data, error } = await supabase.from('admin_users').update(user).eq('id', id).select().single();
      if (error) throw error;
      return data;
    } catch (err: any) {
      console.error(`Failed to update admin user ${id}:`, err);
      throw new Error(err.message);
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase.from('admin_users').delete().eq('id', id);
      if (error) throw error;
    } catch (err: any) {
      console.error(`Failed to delete admin user ${id}:`, err);
      throw new Error(err.message);
    }
  }
};

/* -----------------------------
   Storage Helpers
------------------------------ */
export const storageApi = {
  async upload(bucket: string, path: string, file: File | Blob): Promise<string> {
    try {
      const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
      if (error) throw error;

      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      return data.publicUrl;
    } catch (err: any) {
      console.error('Failed to upload file:', err);
      throw new Error(err.message);
    }
  },

  async delete(bucket: string, path: string): Promise<void> {
    try {
      const { error } = await supabase.storage.from(bucket).remove([path]);
      if (error) throw error;
    } catch (err: any) {
      console.error('Failed to delete file:', err);
      throw new Error(err.message);
    }
  }
};

/* -----------------------------
   Project Image Upload Helpers
------------------------------ */
export const uploadImage = async (file: File): Promise<string> => {
  const ext = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const filePath = `projects/${fileName}`;
  return storageApi.upload('project-images', filePath, file);
};

export const uploadImages = async (files: File[]): Promise<string[]> => {
  const urls: string[] = [];
  for (const file of files) {
    const url = await uploadImage(file);
    urls.push(url);
  }
  return urls;
};