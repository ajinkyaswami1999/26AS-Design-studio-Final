// import { createClient } from '@supabase/supabase-js';

// // const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
// // const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
// const supabaseUrl = 'https://wqbqyipalgqzbzghjyyb.supabase.co';
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// if (!supabaseUrl || !supabaseKey) {
//   throw new Error('Missing Supabase environment variables.');
// }

// export const supabase = createClient(supabaseUrl, supabaseKey);

// // Database types
// export interface Project {
//   id: string;
//   title: string;
//   category: string;
//   location: string;
//   year: string;
//   description: string;
//   details: string;
//   client: string;
//   area: string;
//   duration: string;
//   featured: boolean;
//   main_image: string;
//   created_at: string;
//   updated_at: string;
//   project_images?: ProjectImage[];
// }

// export interface ProjectImage {
//   id: string;
//   project_id: string;
//   image_url: string;
//   alt_text?: string;
//   sort_order: number;
//   created_at: string;
// }

// export interface TeamMember {
//   id: string;
//   name: string;
//   position: string;
//   bio?: string;
//   image_url: string;
//   email?: string;
//   linkedin_url?: string;
//   sort_order: number;
//   active: boolean;
//   created_at: string;
//   updated_at: string;
// }

// export interface Testimonial {
//   id: string;
//   client_name: string;
//   client_position: string;
//   testimonial_text: string;
//   rating: number;
//   project_id?: string;
//   active: boolean;
//   created_at: string;
//   updated_at: string;
// }

// export interface SiteSetting {
//   id: string;
//   setting_key: string;
//   setting_value: any;
//   updated_at: string;
// }

// export interface AdminUser {
//   id: string;
//   username: string;
//   password_hash: string;
//   role: 'admin' | 'super_admin';
//   permissions: Record<string, boolean>;
//   active: boolean;
//   created_at: string;
//   updated_at: string;
//   last_login?: string;
// }

// // API functions
// export const projectsApi = {
//   async getAll(): Promise<Project[]> {
//     const { data, error } = await supabase
//       .from('projects')
//       .select(`
//         *,
//         project_images (*)
//       `)
//       .order('created_at', { ascending: false });
    
//     if (error) throw error;
//     return data || [];
//   },

//   async getById(id: string): Promise<Project | null> {
//     const { data, error } = await supabase
//       .from('projects')
//       .select(`
//         *,
//         project_images (*)
//       `)
//       .eq('id', id)
//       .single();
    
//     if (error) throw error;
//     return data;
//   },

//   async getFeatured(): Promise<Project[]> {
//     const { data, error } = await supabase
//       .from('projects')
//       .select(`
//         *,
//         project_images (*)
//       `)
//       .eq('featured', true)
//       .order('created_at', { ascending: false });
    
//     if (error) throw error;
//     return data || [];
//   },

//   async create(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
//     const { data, error } = await supabase
//       .from('projects')
//       .insert(project)
//       .select()
//       .single();
    
//     if (error) throw error;
//     return data;
//   },

//   async update(id: string, project: Partial<Project>): Promise<Project> {
//     const { data, error } = await supabase
//       .from('projects')
//       .update(project)
//       .eq('id', id)
//       .select()
//       .single();
    
//     if (error) throw error;
//     return data;
//   },

//   async delete(id: string): Promise<void> {
//     const { error } = await supabase
//       .from('projects')
//       .delete()
//       .eq('id', id);
    
//     if (error) throw error;
//   }
// };

// export const projectImagesApi = {
//   async create(projectImage: Omit<ProjectImage, 'id' | 'created_at'>): Promise<ProjectImage> {
//     const { data, error } = await supabase
//       .from('project_images')
//       .insert(projectImage)
//       .select()
//       .single();
    
//     if (error) throw error;
//     return data;
//   },

//   async delete(id: string): Promise<void> {
//     const { error } = await supabase
//       .from('project_images')
//       .delete()
//       .eq('id', id);
    
//     if (error) throw error;
//   }
// };

// export const teamMembersApi = {
//   async getAll(): Promise<TeamMember[]> {
//     const { data, error } = await supabase
//       .from('team_members')
//       .select('*')
//       .eq('active', true)
//       .order('sort_order', { ascending: true });
    
//     if (error) throw error;
//     return data || [];
//   },

//   async create(member: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>): Promise<TeamMember> {
//     const { data, error } = await supabase
//       .from('team_members')
//       .insert(member)
//       .select()
//       .single();
    
//     if (error) throw error;
//     return data;
//   },

//   async update(id: string, member: Partial<TeamMember>): Promise<TeamMember> {
//     const { data, error } = await supabase
//       .from('team_members')
//       .update(member)
//       .eq('id', id)
//       .select()
//       .single();
    
//     if (error) throw error;
//     return data;
//   },

//   async delete(id: string): Promise<void> {
//     const { error } = await supabase
//       .from('team_members')
//       .delete()
//       .eq('id', id);
    
//     if (error) throw error;
//   }
// };

// export const testimonialsApi = {
//   async getAll(): Promise<Testimonial[]> {
//     const { data, error } = await supabase
//       .from('testimonials')
//       .select('*')
//       .eq('active', true)
//       .order('created_at', { ascending: false });
    
//     if (error) throw error;
//     return data || [];
//   },

//   async create(testimonial: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>): Promise<Testimonial> {
//     const { data, error } = await supabase
//       .from('testimonials')
//       .insert(testimonial)
//       .select()
//       .single();
    
//     if (error) throw error;
//     return data;
//   },

//   async update(id: string, testimonial: Partial<Testimonial>): Promise<Testimonial> {
//     const { data, error } = await supabase
//       .from('testimonials')
//       .update(testimonial)
//       .eq('id', id)
//       .select()
//       .single();
    
//     if (error) throw error;
//     return data;
//   },

//   async delete(id: string): Promise<void> {
//     const { error } = await supabase
//       .from('testimonials')
//       .delete()
//       .eq('id', id);
    
//     if (error) throw error;
//   }
// };

// export const siteSettingsApi = {
//   async get(key: string): Promise<any> {
//     const { data, error } = await supabase
//       .from('site_settings')
//       .select('setting_value')
//       .eq('setting_key', key)
//       .single();
    
//     if (error) throw error;
//     return data?.setting_value;
//   },

//   async set(key: string, value: any): Promise<void> {
//     const { error } = await supabase
//       .from('site_settings')
//       .upsert(
//         {
//           setting_key: key,
//           setting_value: value
//         },
//         {
//           onConflict: 'setting_key' // ✅ This ensures update if the key exists
//         }
//       );
    
//     if (error) throw error;
//   }
// };


// export const adminUsersApi = {
//   async getAll(): Promise<AdminUser[]> {
//     const { data, error } = await supabase
//       .from('admin_users')
//       .select('*')
//       .eq('active', true)
//       .order('created_at', { ascending: false });
    
//     if (error) throw error;
//     return data || [];
//   },

//   async authenticate(username: string, password: string): Promise<AdminUser | null> {
//     const { data, error } = await supabase
//       .from('admin_users')
//       .select('*')
//       .ilike('username', username.toLowerCase())
//       .ilike('password_hash', password)
//       .single(); // ⛔ Removed active check

//     if (error || !data) return null;

//     await supabase
//       .from('admin_users')
//       .update({ last_login: new Date().toISOString() })
//       .eq('id', data.id);

//     return data;
//   },

//   async create(user: Omit<AdminUser, 'id' | 'created_at' | 'updated_at' | 'last_login'>): Promise<AdminUser> {
//     const { data, error } = await supabase
//       .from('admin_users')
//       .insert(user)
//       .select()
//       .single();
    
//     if (error) throw error;
//     return data;
//   },

//   async update(id: string, user: Partial<AdminUser>): Promise<AdminUser> {
//     const { data, error } = await supabase
//       .from('admin_users')
//       .update(user)
//       .eq('id', id)
//       .select()
//       .single();
    
//     if (error) throw error;
//     return data;
//   },

//   async delete(id: string): Promise<void> {
//     const { error } = await supabase
//       .from('admin_users')
//       .delete()
//       .eq('id', id);
    
//     if (error) throw error;
//   }
// };

import { createClient } from '@supabase/supabase-js';

// ✅ Always use env variables in production
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
   API Functions
------------------------------ */
export const projectsApi = {
  async getAll(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select(`*, project_images (*)`)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .select(`*, project_images (*)`)
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async getFeatured(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select(`*, project_images (*)`)
      .eq('featured', true)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async create(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, project: Partial<Project>): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .update(project)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
  }
};

export const projectImagesApi = {
  async create(projectImage: Omit<ProjectImage, 'id' | 'created_at'>): Promise<ProjectImage> {
    const { data, error } = await supabase
      .from('project_images')
      .insert(projectImage)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('project_images').delete().eq('id', id);
    if (error) throw error;
  }
};

export const teamMembersApi = {
  async getAll(): Promise<TeamMember[]> {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('active', true)
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async create(member: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>): Promise<TeamMember> {
    const { data, error } = await supabase.from('team_members').insert(member).select().single();
    if (error) throw error;
    return data;
  },

  async update(id: string, member: Partial<TeamMember>): Promise<TeamMember> {
    const { data, error } = await supabase
      .from('team_members')
      .update(member)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('team_members').delete().eq('id', id);
    if (error) throw error;
  }
};

export const testimonialsApi = {
  async getAll(): Promise<Testimonial[]> {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async create(testimonial: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>): Promise<Testimonial> {
    const { data, error } = await supabase.from('testimonials').insert(testimonial).select().single();
    if (error) throw error;
    return data;
  },

  async update(id: string, testimonial: Partial<Testimonial>): Promise<Testimonial> {
    const { data, error } = await supabase
      .from('testimonials')
      .update(testimonial)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (error) throw error;
  }
};

export const siteSettingsApi = {
  async get(key: string): Promise<any> {
    const { data, error } = await supabase
      .from('site_settings')
      .select('setting_value')
      .eq('setting_key', key)
      .single();
    if (error) throw error;
    return data?.setting_value;
  },

  async set(key: string, value: any): Promise<void> {
    const { error } = await supabase.from('site_settings').upsert(
      {
        setting_key: key,
        setting_value: value
      },
      { onConflict: 'setting_key' }
    );
    if (error) throw error;
  }
};

/* -----------------------------
   Secure Admin Auth
------------------------------ */
export const adminUsersApi = {
  async getAll(): Promise<AdminUser[]> {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async authenticate(username: string, password: string): Promise<AdminUser | null> {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('username', username.toLowerCase())
      .eq('password_hash', password) // ⚠️ plain text compare
      .single();

    if (error || !data) return null;

    await supabase
      .from('admin_users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', data.id);

    return data;
  },

    async create(
        user: Omit<AdminUser, 'id' | 'created_at' | 'updated_at' | 'last_login'>
    ): Promise<AdminUser> {
        const { data, error } = await supabase
            .from('admin_users')
            .insert(user)
            .select()
            .single();

        if (error) throw error;
        return data;
    },


  async update(id: string, user: Partial<AdminUser>): Promise<AdminUser> {
    const { data, error } = await supabase
      .from('admin_users')
      .update(user)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('admin_users').delete().eq('id', id);
    if (error) throw error;
  }
};

/* -----------------------------
   Storage Helper (upload/delete files)
------------------------------ */
export const storageApi = {
  async upload(bucket: string, path: string, file: File | Blob): Promise<string> {
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
    if (error) throw error;
    return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  },

  async delete(bucket: string, path: string): Promise<void> {
    const { error } = await supabase.storage.from(bucket).remove([path]);
    if (error) throw error;
  }
};

/* -----------------------------
   Project Image Upload Helpers
------------------------------ */
export const uploadImage = async (file: File): Promise<string> => {
  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const filePath = `projects/${fileName}`;

  const { error } = await supabase.storage
    .from("project-images") // bucket name
    .upload(filePath, file);

  if (error) throw error;

  const { data } = supabase.storage
    .from("project-images")
    .getPublicUrl(filePath);

  return data.publicUrl;
};

export const uploadImages = async (files: File[]): Promise<string[]> => {
  const urls: string[] = [];
  for (const file of files) {
    const url = await uploadImage(file);
    urls.push(url);
  }
  return urls;
};