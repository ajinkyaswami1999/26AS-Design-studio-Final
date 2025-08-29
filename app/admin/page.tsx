'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FolderOpen,
  Users,
  BarChart3,
  Phone,
  Share2,
  UserCog,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Eye,
  EyeOff
} from 'lucide-react';
import {
  projectsApi,
  teamMembersApi,
  testimonialsApi,
  siteSettingsApi,
  adminUsersApi,
  projectImagesApi,
  uploadImage, uploadImages,
  type Project,
  type TeamMember,
  type Testimonial,
  type AdminUser
} from '@/lib/supabase';

interface User {
  id: string;
  username: string;
  role: 'admin' | 'super_admin';
  permissions: {
    projects: boolean;
    team: boolean;
    stats: boolean;
    contact: boolean;
    social: boolean;
    users: boolean;
  };
}

export default function AdminPanel() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [mainFile, setMainFile] = useState<File | null>(null);
  const [extraFiles, setExtraFiles] = useState<File[]>([]);
  const [previewMain, setPreviewMain] = useState("");
  const [previewExtras, setPreviewExtras] = useState<string[]>([]);

  // Login state
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // Data states
  const [projects, setProjects] = useState<Project[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [stats, setStats] = useState({
    projectsCompleted: 150,
    yearsExperience: 12,
    happyClients: 200,
    successRate: 95
  });
  const [contactInfo, setContactInfo] = useState({
    address: '123 Design Street, Suite 456, New York, NY 10001',
    phone: '+1 (555) 123-4567',
    email: 'info@26asdesign.com'
  });
  const [socialLinks, setSocialLinks] = useState({
    facebook: 'https://facebook.com/26asdesign',
    instagram: 'https://instagram.com/26asdesign',
    twitter: 'https://twitter.com/26asdesign',
    youtube: 'https://youtube.com/@26asdesign',
    behance: 'https://behance.net/26asdesign'
  });
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);

  // Form states
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [showNewUserForm, setShowNewUserForm] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const checkAuth = () => {
    const user = localStorage.getItem('adminUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
      setIsAuthenticated(true);
    }
    setLoading(false);
  };

  const loadData = async () => {
    try {
      const [projectsData, teamData, testimonialsData, statsData, contactData, socialData, usersData] = await Promise.all([
        projectsApi.getAll(),
        teamMembersApi.getAll(),
        testimonialsApi.getAll(),
        siteSettingsApi.get('stats'),
        siteSettingsApi.get('contact_info'),
        siteSettingsApi.get('social_links'),
        adminUsersApi.getAll()
      ]);

      setProjects(projectsData);
      setTeamMembers(teamData);
      setTestimonials(testimonialsData);
      if (statsData) setStats(statsData);
      if (contactData) setContactInfo(contactData);
      if (socialData) setSocialLinks(socialData);
      setAdminUsers(usersData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    try {
      const user = await adminUsersApi.authenticate(loginForm.username, loginForm.password);
      if (user) {
        // var userData = {
        //   id: user.id,
        //   username: user.username,
        //   role: user.role,
        //   permissions: {
        //     projects: user.permissions?.projects ?? false,
        //     team: user.permissions?.team ?? false,
        //     stats: user.permissions?.stats ?? false,
        //     contact: user.permissions?.contact ?? false,
        //     social: user.permissions?.social ?? false,
        //     users: user.permissions?.users ?? false,
        //   }
        // };
        const userData: User = {
          id: user.id,
          username: user.username,
          role: user.role,
          permissions: {
            projects: user.permissions?.projects ?? false,
            team: user.permissions?.team ?? false,
            stats: user.permissions?.stats ?? false,
            contact: user.permissions?.contact ?? false,
            social: user.permissions?.social ?? false,
            users: user.permissions?.users ?? false,
          }
        };


        localStorage.setItem('adminUser', JSON.stringify(userData));

        setCurrentUser(userData);
        setIsAuthenticated(true);
      } else {
        setLoginError('Invalid credentials');
      }
    } catch (error) {
      setLoginError('Login failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    setIsAuthenticated(false);
    setCurrentUser(null);
    router.push('/');
  };

  const hasPermission = (permission: string) => {
    return currentUser?.permissions[permission as keyof typeof currentUser.permissions] || false;
  };

  const saveProject = async (project: Partial<Project>) => {
    try {
      if (editingProject?.id) {
        const updated = await projectsApi.update(editingProject.id, project);
        setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
      } else {
        const created = await projectsApi.create(project as Omit<Project, 'id' | 'created_at' | 'updated_at'>);
        setProjects(prev => [created, ...prev]);
      }
      setEditingProject(null);
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const deleteProject = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await projectsApi.delete(id);
        setProjects(prev => prev.filter(p => p.id !== id));
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const saveTeamMember = async (member: Partial<TeamMember>) => {
    try {
      if (editingTeamMember?.id) {
        const updated = await teamMembersApi.update(editingTeamMember.id, member);
        setTeamMembers(prev => prev.map(m => m.id === updated.id ? updated : m));
      } else {
        const created = await teamMembersApi.create(member as Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>);
        setTeamMembers(prev => [created, ...prev]);
      }
      setEditingTeamMember(null);
    } catch (error) {
      console.error('Error saving team member:', error);
    }
  };

  const deleteTeamMember = async (id: string) => {
    if (confirm('Are you sure you want to delete this team member?')) {
      try {
        await teamMembersApi.delete(id);
        setTeamMembers(prev => prev.filter(m => m.id !== id));
      } catch (error) {
        console.error('Error deleting team member:', error);
      }
    }
  };

  const saveStats = async () => {
    try {
      await siteSettingsApi.set('stats', stats);
      alert('Stats updated successfully!');
    } catch (error) {
      console.error('Error saving stats:', error);
    }
  };

  const saveContactInfo = async () => {
    try {
      await siteSettingsApi.set('contact_info', contactInfo);
      alert('Contact info updated successfully!');
    } catch (error) {
      console.error('Error saving contact info:', error);
    }
  };

  const saveSocialLinks = async () => {
    try {
      await siteSettingsApi.set('social_links', socialLinks);
      alert('Social links updated successfully!');
    } catch (error) {
      console.error('Error saving social links:', error);
    }
  };

  const saveUser = async (user: Partial<AdminUser>) => {
    try {
      if (editingUser?.id) {
        const updated = await adminUsersApi.update(editingUser.id, user);
        setAdminUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
      } else {
        const created = await adminUsersApi.create(user as Omit<AdminUser, 'id' | 'created_at' | 'updated_at' | 'last_login'>);
        setAdminUsers(prev => [created, ...prev]);
      }
      setEditingUser(null);
      setShowNewUserForm(false);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const deleteUser = async (id: string) => {
    if (id === currentUser?.id) {
      alert('You cannot delete your own account');
      return;
    }
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await adminUsersApi.delete(id);
        setAdminUsers(prev => prev.filter(u => u.id !== id));
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-yellow-400 text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="bg-gray-900 p-8 rounded-lg shadow-2xl w-full max-w-md border border-yellow-400/20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-light text-yellow-400 tracking-widest">26AS</h1>
            <p className="text-gray-300 mt-2">Admin Panel</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white"
                required
              />
            </div>

            {loginError && (
              <div className="text-red-400 text-sm text-center">{loginError}</div>
            )}

            <button
              type="submit"
              className="w-full bg-yellow-400 text-black py-3 rounded-lg font-medium hover:bg-yellow-500 transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, permission: null },
    { id: 'projects', label: 'Projects', icon: FolderOpen, permission: 'projects' },
    { id: 'team', label: 'Team', icon: Users, permission: 'team' },
    { id: 'stats', label: 'Statistics', icon: BarChart3, permission: 'stats' },
    { id: 'contact', label: 'Contact Info', icon: Phone, permission: 'contact' },
    { id: 'social', label: 'Social Media', icon: Share2, permission: 'social' },
    ...(currentUser?.role === 'super_admin' ? [{ id: 'users', label: 'User Management', icon: UserCog, permission: 'users' }] : [])
  ].filter(item => !item.permission || hasPermission(item.permission));

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 border-r border-yellow-400/20">
        <div className="p-6 border-b border-yellow-400/20">
          <h1 className="text-2xl font-light text-yellow-400 tracking-widest">26AS</h1>
          <p className="text-gray-400 text-sm mt-1">Admin Panel</p>
          <p className="text-gray-500 text-xs mt-2">Welcome, {currentUser?.username}</p>
        </div>

        <nav className="p-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-colors ${activeTab === item.id
                ? 'bg-yellow-400 text-black'
                : 'text-gray-300 hover:bg-gray-800'
                }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg mt-8 text-red-400 hover:bg-red-400/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {activeTab === 'dashboard' && (
            <div>
              <h2 className="text-3xl font-light mb-8 text-yellow-400">Dashboard</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gray-900 p-6 rounded-lg border border-yellow-400/20">
                  <h3 className="text-lg font-medium mb-2">Total Projects</h3>
                  <p className="text-3xl font-light text-yellow-400">{projects.length}</p>
                </div>
                <div className="bg-gray-900 p-6 rounded-lg border border-yellow-400/20">
                  <h3 className="text-lg font-medium mb-2">Team Members</h3>
                  <p className="text-3xl font-light text-yellow-400">{teamMembers.length}</p>
                </div>
                <div className="bg-gray-900 p-6 rounded-lg border border-yellow-400/20">
                  <h3 className="text-lg font-medium mb-2">Testimonials</h3>
                  <p className="text-3xl font-light text-yellow-400">{testimonials.length}</p>
                </div>
                <div className="bg-gray-900 p-6 rounded-lg border border-yellow-400/20">
                  <h3 className="text-lg font-medium mb-2">Admin Users</h3>
                  <p className="text-3xl font-light text-yellow-400">{adminUsers.length}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-900 p-6 rounded-lg border border-yellow-400/20">
                  <h3 className="text-lg font-medium mb-4">Recent Projects</h3>
                  <div className="space-y-3">
                    {projects.slice(0, 5).map((project) => (
                      <div key={project.id} className="flex items-center space-x-3">
                        <img src={project.main_image} alt={project.title} className="w-12 h-12 object-cover rounded" />
                        <div>
                          <p className="font-medium">{project.title}</p>
                          <p className="text-sm text-gray-400">{project.category} • {project.location}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-900 p-6 rounded-lg border border-yellow-400/20">
                  <h3 className="text-lg font-medium mb-4">System Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Projects Completed</span>
                      <span className="text-yellow-400">{stats.projectsCompleted}+</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Years Experience</span>
                      <span className="text-yellow-400">{stats.yearsExperience}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Happy Clients</span>
                      <span className="text-yellow-400">{stats.happyClients}+</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Success Rate</span>
                      <span className="text-yellow-400">{stats.successRate}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'projects' && hasPermission('projects') && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-light text-yellow-400">Projects</h2>
                <button
                  onClick={() => setEditingProject({} as Project)}
                  className="bg-yellow-400 text-black px-6 py-2 rounded-lg font-medium hover:bg-yellow-500 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Project</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <div key={project.id} className="bg-gray-900 rounded-lg overflow-hidden border border-yellow-400/20">
                    <img src={project.main_image} alt={project.title} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <h3 className="font-medium mb-2">{project.title}</h3>
                      <p className="text-sm text-gray-400 mb-2">{project.category} • {project.location}</p>
                      <p className="text-sm text-gray-300 mb-4 line-clamp-2">{project.description}</p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingProject(project)}
                          className="flex-1 bg-yellow-400 text-black px-3 py-2 rounded text-sm font-medium hover:bg-yellow-500 transition-colors flex items-center justify-center space-x-1"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => deleteProject(project.id)}
                          className="bg-red-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'team' && hasPermission('team') && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-light text-yellow-400">Team Members</h2>
                <button
                  onClick={() => setEditingTeamMember({} as TeamMember)}
                  className="bg-yellow-400 text-black px-6 py-2 rounded-lg font-medium hover:bg-yellow-500 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Member</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamMembers.map((member) => (
                  <div key={member.id} className="bg-gray-900 rounded-lg overflow-hidden border border-yellow-400/20">
                    <img src={member.image_url} alt={member.name} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <h3 className="font-medium mb-1">{member.name}</h3>
                      <p className="text-sm text-yellow-400 mb-2">{member.position}</p>
                      <p className="text-sm text-gray-300 mb-4 line-clamp-3">{member.bio}</p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingTeamMember(member)}
                          className="flex-1 bg-yellow-400 text-black px-3 py-2 rounded text-sm font-medium hover:bg-yellow-500 transition-colors flex items-center justify-center space-x-1"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => deleteTeamMember(member.id)}
                          className="bg-red-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'stats' && hasPermission('stats') && (
            <div>
              <h2 className="text-3xl font-light mb-8 text-yellow-400">Statistics</h2>
              <div className="bg-gray-900 p-6 rounded-lg border border-yellow-400/20 max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Projects Completed
                    </label>
                    <input
                      type="number"
                      value={stats.projectsCompleted}
                      onChange={(e) => setStats(prev => ({ ...prev, projectsCompleted: parseInt(e.target.value) }))}
                      className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Years Experience
                    </label>
                    <input
                      type="number"
                      value={stats.yearsExperience}
                      onChange={(e) => setStats(prev => ({ ...prev, yearsExperience: parseInt(e.target.value) }))}
                      className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Happy Clients
                    </label>
                    <input
                      type="number"
                      value={stats.happyClients}
                      onChange={(e) => setStats(prev => ({ ...prev, happyClients: parseInt(e.target.value) }))}
                      className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Success Rate (%)
                    </label>
                    <input
                      type="number"
                      value={stats.successRate}
                      onChange={(e) => setStats(prev => ({ ...prev, successRate: parseInt(e.target.value) }))}
                      className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white"
                    />
                  </div>
                </div>
                <button
                  onClick={saveStats}
                  className="mt-6 bg-yellow-400 text-black px-6 py-3 rounded-lg font-medium hover:bg-yellow-500 transition-colors flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Statistics</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'contact' && hasPermission('contact') && (
            <div>
              <h2 className="text-3xl font-light mb-8 text-yellow-400">Contact Information</h2>
              <div className="bg-gray-900 p-6 rounded-lg border border-yellow-400/20 max-w-2xl">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Address
                    </label>
                    <textarea
                      value={contactInfo.address}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, address: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone
                    </label>
                    <input
                      type="text"
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white"
                    />
                  </div>
                </div>
                <button
                  onClick={saveContactInfo}
                  className="mt-6 bg-yellow-400 text-black px-6 py-3 rounded-lg font-medium hover:bg-yellow-500 transition-colors flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Contact Info</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'social' && hasPermission('social') && (
            <div>
              <h2 className="text-3xl font-light mb-8 text-yellow-400">Social Media Links</h2>
              <div className="bg-gray-900 p-6 rounded-lg border border-yellow-400/20 max-w-2xl">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Facebook
                    </label>
                    <input
                      type="url"
                      value={socialLinks.facebook}
                      onChange={(e) => setSocialLinks(prev => ({ ...prev, facebook: e.target.value }))}
                      className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Instagram
                    </label>
                    <input
                      type="url"
                      value={socialLinks.instagram}
                      onChange={(e) => setSocialLinks(prev => ({ ...prev, instagram: e.target.value }))}
                      className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Twitter
                    </label>
                    <input
                      type="url"
                      value={socialLinks.twitter}
                      onChange={(e) => setSocialLinks(prev => ({ ...prev, twitter: e.target.value }))}
                      className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      YouTube
                    </label>
                    <input
                      type="url"
                      value={socialLinks.youtube}
                      onChange={(e) => setSocialLinks(prev => ({ ...prev, youtube: e.target.value }))}
                      className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Behance
                    </label>
                    <input
                      type="url"
                      value={socialLinks.behance}
                      onChange={(e) => setSocialLinks(prev => ({ ...prev, behance: e.target.value }))}
                      className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white"
                    />
                  </div>
                </div>
                <button
                  onClick={saveSocialLinks}
                  className="mt-6 bg-yellow-400 text-black px-6 py-3 rounded-lg font-medium hover:bg-yellow-500 transition-colors flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Social Links</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'users' && currentUser?.role === 'super_admin' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-light text-yellow-400">User Management</h2>
                <button
                  onClick={() => setShowNewUserForm(true)}
                  className="bg-yellow-400 text-black px-6 py-2 rounded-lg font-medium hover:bg-yellow-500 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add User</span>
                </button>
              </div>

              <div className="bg-gray-900 rounded-lg border border-yellow-400/20 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Permissions</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Last Login</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {adminUsers.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-white">{user.username}</div>
                            <div className="text-sm text-gray-400">{user.id === currentUser?.id ? '(You)' : ''}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'super_admin'
                            ? 'bg-yellow-400 text-black'
                            : 'bg-gray-700 text-gray-300'
                            }`}>
                            {user.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {Object.entries(user.permissions).filter(([_, value]) => value).map(([key]) => (
                              <span key={key} className="inline-flex px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded">
                                {key}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setEditingUser(user)}
                              className="text-yellow-400 hover:text-yellow-300"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            {user.id !== currentUser?.id && (
                              <button
                                onClick={() => deleteUser(user.id)}
                                className="text-red-400 hover:text-red-300"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Project Form Modal */}
      {editingProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-yellow-400/20">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-medium text-yellow-400">
                {editingProject.id ? "Edit Project" : "Add Project"}
              </h3>
              <button
                onClick={() => setEditingProject(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const formData = new FormData(e.currentTarget);

                  let mainImageUrl = editingProject?.main_image || "";

                  // ✅ Upload new main image if selected
                  if (mainFile) {
                    mainImageUrl = await uploadImage(mainFile);
                  }

                  const project = {
                    title: formData.get("title") as string,
                    category: formData.get("category") as string,
                    location: formData.get("location") as string,
                    year: formData.get("year") as string,
                    description: formData.get("description") as string,
                    details: formData.get("details") as string,
                    client: formData.get("client") as string,
                    area: formData.get("area") as string,
                    duration: formData.get("duration") as string,
                    featured: formData.get("featured") === "on",
                    main_image: mainImageUrl,
                  };

                  let savedProject;
                  if (editingProject?.id) {
                    savedProject = await projectsApi.update(editingProject.id, project);
                  } else {
                    savedProject = await projectsApi.create(project);
                  }

                  // ✅ Upload extra images if provided
                  if (extraFiles.length > 0) {
                    const urls = await uploadImages(extraFiles);
                    for (let i = 0; i < urls.length; i++) {
                      await projectImagesApi.create({
                        project_id: savedProject.id,
                        image_url: urls[i],
                        alt_text: `Image ${i + 1}`,
                        sort_order: i,
                      });
                    }
                  }

                  // ✅ Reset form + close modal
                  setEditingProject(null);
                  setMainFile(null);
                  setExtraFiles([]);
                  setPreviewMain("");
                  setPreviewExtras([]);
                  loadData();
                } catch (err) {
                  console.error("❌ Failed to save project:", err);
                  alert("Failed to save project. Please try again.");
                }
              }}
              className="space-y-4"
            >
              {/* ------------------- Inputs ------------------- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    name="title"
                    type="text"
                    defaultValue={editingProject?.title || ""}
                    required
                    className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    defaultValue={editingProject?.category || ""}
                    required
                    className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 text-white"
                  >
                    <option value="">Select Category</option>
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Industrial">Landscape</option>
                    <option value="Renovation">Renovation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    name="location"
                    type="text"
                    defaultValue={editingProject?.location || ""}
                    required
                    className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Year
                  </label>
                  <input
                    name="year"
                    type="text"
                    defaultValue={editingProject?.year || ""}
                    required
                    className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Client
                  </label>
                  <input
                    name="client"
                    type="text"
                    defaultValue={editingProject?.client || ""}
                    required
                    className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Area
                  </label>
                  <input
                    name="area"
                    type="text"
                    defaultValue={editingProject?.area || ""}
                    required
                    className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Duration
                  </label>
                  <input
                    name="duration"
                    type="text"
                    defaultValue={editingProject?.duration || ""}
                    required
                    className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 text-white"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    name="featured"
                    type="checkbox"
                    defaultChecked={editingProject?.featured || false}
                    className="w-4 h-4 text-yellow-400 bg-black border-gray-600 rounded focus:ring-yellow-400"
                  />
                  <label className="ml-2 text-sm text-gray-300">
                    Featured Project
                  </label>
                </div>
              </div>

              {/* ------------------- Main Image ------------------- */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Main Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setMainFile(e.target.files[0]);
                      setPreviewMain(URL.createObjectURL(e.target.files[0]));
                    }
                  }}
                  className="w-full text-gray-300"
                />
                {(previewMain || editingProject?.main_image) && (
                  <img
                    src={previewMain || editingProject?.main_image}
                    alt="preview"
                    className="mt-2 w-32 rounded"
                  />
                )}
              </div>

              {/* ------------------- Description ------------------- */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={editingProject?.description || ""}
                  required
                  className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 text-white resize-none"
                />
              </div>

              {/* ------------------- Extra Images ------------------- */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Extra Images
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files) {
                      const files = Array.from(e.target.files);
                      setExtraFiles(files);
                      setPreviewExtras(files.map((f) => URL.createObjectURL(f)));
                    }
                  }}
                  className="w-full text-gray-300"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {previewExtras.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt={`extra-${i}`}
                      className="w-20 h-20 object-cover rounded"
                    />
                  ))}
                </div>
              </div>

              {/* ------------------- Details ------------------- */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Details
                </label>
                <textarea
                  name="details"
                  rows={5}
                  defaultValue={editingProject?.details || ""}
                  required
                  className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 text-white resize-none"
                />
              </div>

              {/* ------------------- Buttons ------------------- */}
              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-yellow-400 text-black px-6 py-3 rounded-lg font-medium hover:bg-yellow-500 transition-colors flex items-center justify-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Project</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-6 py-3 border border-gray-600 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* Team Member Form Modal */}
      {editingTeamMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-yellow-400/20">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-medium text-yellow-400">
                {editingTeamMember.id ? 'Edit Team Member' : 'Add Team Member'}
              </h3>
              <button
                onClick={() => setEditingTeamMember(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const member = {
                name: formData.get('name') as string,
                position: formData.get('position') as string,
                bio: formData.get('bio') as string,
                image_url: formData.get('image_url') as string,
                email: formData.get('email') as string,
                linkedin_url: formData.get('linkedin_url') as string,
                sort_order: parseInt(formData.get('sort_order') as string) || 0,
                active: formData.get('active') === 'on',
              };
              saveTeamMember(member);
            }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                  <input
                    name="name"
                    type="text"
                    defaultValue={editingTeamMember.name || ''}
                    required
                    className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Position</label>
                  <input
                    name="position"
                    type="text"
                    defaultValue={editingTeamMember.position || ''}
                    required
                    className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    name="email"
                    type="email"
                    defaultValue={editingTeamMember.email || ''}
                    className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Sort Order</label>
                  <input
                    name="sort_order"
                    type="number"
                    defaultValue={editingTeamMember.sort_order || 0}
                    className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
                <input
                  name="image_url"
                  type="url"
                  defaultValue={editingTeamMember.image_url || ''}
                  required
                  className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">LinkedIn URL</label>
                <input
                  name="linkedin_url"
                  type="url"
                  defaultValue={editingTeamMember.linkedin_url || ''}
                  className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                <textarea
                  name="bio"
                  rows={4}
                  defaultValue={editingTeamMember.bio || ''}
                  className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white resize-none"
                />
              </div>

              <div className="flex items-center">
                <input
                  name="active"
                  type="checkbox"
                  defaultChecked={editingTeamMember.active !== false}
                  className="w-4 h-4 text-yellow-400 bg-black border-gray-600 rounded focus:ring-yellow-400"
                />
                <label className="ml-2 text-sm text-gray-300">Active</label>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-yellow-400 text-black px-6 py-3 rounded-lg font-medium hover:bg-yellow-500 transition-colors flex items-center justify-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Member</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditingTeamMember(null)}
                  className="px-6 py-3 border border-gray-600 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Form Modal */}
      {(editingUser || showNewUserForm) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-lg border border-yellow-400/20">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-medium text-yellow-400">
                {editingUser?.id ? 'Edit User' : 'Add User'}
              </h3>
              <button
                onClick={() => {
                  setEditingUser(null);
                  setShowNewUserForm(false);
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const permissions = {
                projects: formData.get('projects') === 'on',
                team: formData.get('team') === 'on',
                stats: formData.get('stats') === 'on',
                contact: formData.get('contact') === 'on',
                social: formData.get('social') === 'on',
                users: formData.get('users') === 'on',
              };

              const user = {
                username: formData.get('username') as string,
                password_hash: formData.get('password') as string,
                role: formData.get('role') as 'admin' | 'super_admin',
                permissions,
                active: formData.get('active') === 'on',
              };
              saveUser(user);
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                <input
                  name="username"
                  type="text"
                  defaultValue={editingUser?.username || ''}
                  required
                  className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <input
                  name="password"
                  type="password"
                  defaultValue={editingUser?.password_hash || ''}
                  required={!editingUser?.id}
                  className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                <select
                  name="role"
                  defaultValue={editingUser?.role || 'admin'}
                  required
                  className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white"
                >
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Permissions</label>
                <div className="grid grid-cols-2 gap-3">
                  {['projects', 'team', 'stats', 'contact', 'social', 'users'].map((permission) => (
                    <div key={permission} className="flex items-center">
                      <input
                        name={permission}
                        type="checkbox"
                        defaultChecked={editingUser?.permissions?.[permission as keyof typeof editingUser.permissions] || false}
                        className="w-4 h-4 text-yellow-400 bg-black border-gray-600 rounded focus:ring-yellow-400"
                      />
                      <label className="ml-2 text-sm text-gray-300 capitalize">{permission}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  name="active"
                  type="checkbox"
                  defaultChecked={editingUser?.active !== false}
                  className="w-4 h-4 text-yellow-400 bg-black border-gray-600 rounded focus:ring-yellow-400"
                />
                <label className="ml-2 text-sm text-gray-300">Active</label>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-yellow-400 text-black px-6 py-3 rounded-lg font-medium hover:bg-yellow-500 transition-colors flex items-center justify-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save User</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingUser(null);
                    setShowNewUserForm(false);
                  }}
                  className="px-6 py-3 border border-gray-600 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}