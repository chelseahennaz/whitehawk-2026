import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { createClient } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

interface AdminUser {
  id: string;
  name?: string;
  email: string;
  password?: string;
  roles: string[]; // list of admin sections the user can access
}

const ADMIN_SECTIONS = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'posts', label: 'News Posts' },
  { key: 'squad', label: 'Squad' },
  { key: 'personnel', label: 'Personnel' },
  { key: 'videos', label: 'Videos' },
  { key: 'sponsors', label: 'Sponsors' },
  { key: 'fixtures', label: 'Fixtures' },
  { key: 'shop', label: 'Shop' },
  { key: 'settings', label: 'Settings' },
  { key: 'admin_users', label: 'Manage Admin Users' },
];

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingOriginalPassword, setEditingOriginalPassword] = useState('');

  // My Account state
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [myName, setMyName] = useState('');
  const [myPassword, setMyPassword] = useState('');
  const [savingAccount, setSavingAccount] = useState(false);
  const [hasAdminUsersRole, setHasAdminUsersRole] = useState(false);

  // Secondary client so signup doesn't log the admin out
  const signUpClient = createClient(
    import.meta.env.VITE_SUPABASE_URL || '',
    import.meta.env.VITE_SUPABASE_ANON_KEY || '',
    {
      auth: { persistSession: false, autoRefreshToken: false }
    }
  );

  const fetchCurrentUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', session.user.email)
      .single();

    if (!error && data) {
      const user = data as AdminUser;
      setCurrentUser(user);
      setMyName(user.name || '');
      setMyPassword('');
      setHasAdminUsersRole(user.roles?.includes('admin_users') || false);
    } else {
      // No admin_users record found — this is the main admin, grant full access
      setHasAdminUsersRole(true);
    }
  };

  const fetchUsers = async () => {
    const { data, error } = await supabase.from('admin_users').select('*');
    if (error) {
      toast.error('Failed to load admin users');
    } else {
      setUsers(data as AdminUser[]);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchUsers();
  }, []);

  // My Account: save own name and password
  const handleSaveMyAccount = async () => {
    if (!currentUser) return;
    if (!myName) return toast.error('Name is required');

    setSavingAccount(true);
    try {
      // Update name (and password if provided) in admin_users table
      const updates: any = { name: myName };
      if (myPassword) {
        updates.password = myPassword;
      }

      const { error } = await supabase
        .from('admin_users')
        .update(updates)
        .eq('id', currentUser.id);

      if (error) {
        toast.error('Failed to update account');
        return;
      }

      // If password changed, also update in Supabase Auth
      if (myPassword) {
        const { error: authError } = await supabase.auth.updateUser({
          password: myPassword,
        });
        if (authError) {
          toast.error('Name updated but failed to update login password: ' + authError.message);
          return;
        }
      }

      toast.success('Account updated successfully');
      setMyPassword('');
      fetchCurrentUser();
      fetchUsers();
    } finally {
      setSavingAccount(false);
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setSelectedRoles([]);
    setEditingId(null);
    setEditingOriginalPassword('');
  };

  const handleSaveUser = async () => {
    if (!email || !password || !name) return toast.error('Name, email, and password are required');
    
    if (editingId) {
      const { error } = await supabase.from('admin_users').update({
        name,
        email,
        password,
        roles: selectedRoles,
      }).eq('id', editingId);
      
      if (error) {
        toast.error('Failed to update admin');
        return;
      }

      // If password changed, also update in Supabase Auth via Edge Function
      if (password && password !== editingOriginalPassword) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          const res = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/update-user-password`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session?.access_token}`,
              },
              body: JSON.stringify({ email, password }),
            }
          );
          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            toast.error('Admin updated but login password failed to sync: ' + (data.error || 'Unknown error'));
            resetForm();
            fetchUsers();
            return;
          }
        } catch (err: any) {
          toast.error('Admin updated but login password failed to sync: ' + err.message);
          resetForm();
          fetchUsers();
          return;
        }
      }

      toast.success('Admin updated');
      resetForm();
      fetchUsers();
    } else {
      // Create user in Supabase Auth so they can log in
      const { data: authData, error: authError } = await signUpClient.auth.signUp({
        email,
        password,
      });

      if (authError) {
        return toast.error('Failed to create login: ' + authError.message);
      }

      const { error } = await supabase.from('admin_users').insert({
        name,
        email,
        password, // stored just for reference, though auth handles real login
        roles: selectedRoles,
      });
      if (error) {
        toast.error('Failed to add admin');
      } else {
        toast.success('Admin added');
        resetForm();
        fetchUsers();
      }
    }
  };

  const handleEdit = (user: AdminUser) => {
    setName(user.name || '');
    setEmail(user.email);
    setPassword(user.password || '');
    setEditingOriginalPassword(user.password || '');
    setSelectedRoles(user.roles || []);
    setEditingId(user.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this admin?')) return;
    const { error } = await supabase.from('admin_users').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete admin');
    } else {
      toast.success('Admin deleted');
      fetchUsers();
    }
  };

  const toggleRole = (roleKey: string) => {
    setSelectedRoles((prev) =>
      prev.includes(roleKey) ? prev.filter((r) => r !== roleKey) : [...prev, roleKey]
    );
  };

  return (
    <div className="space-y-8 p-6">
      {/* My Account Section - always visible */}
      <div className="border rounded-lg p-6 bg-white">
        <h1 className="text-2xl font-bold mb-1">My Account</h1>
        <p className="text-sm text-muted-foreground mb-4">
          Update your name and password. {currentUser?.email && `Signed in as ${currentUser.email}`}
        </p>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="text-sm font-medium mb-1 block">Name</label>
            <Input
              placeholder="Your name"
              value={myName}
              onChange={(e) => setMyName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">New Password</label>
            <Input
              type="password"
              placeholder="Leave blank to keep current password"
              value={myPassword}
              onChange={(e) => setMyPassword(e.target.value)}
            />
          </div>
          <Button onClick={handleSaveMyAccount} disabled={savingAccount}>
            {savingAccount ? 'Saving...' : 'Update My Account'}
          </Button>
        </div>
      </div>

      {/* Full Admin User Management - only for settings role */}
      {hasAdminUsersRole && (
        <>
          <hr />
          <div>
            <h2 className="text-2xl font-bold mb-4">Manage Admin Users</h2>
            <div className="space-y-4 max-w-md">
              <Input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                placeholder="User email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-2">
                {ADMIN_SECTIONS.map((section) => (
                  <label key={section.key} className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedRoles.includes(section.key)}
                      onCheckedChange={() => toggleRole(section.key)}
                    />
                    <span>{section.label}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveUser}>{editingId ? 'Update Admin' : 'Add Admin'}</Button>
                {editingId && <Button variant="outline" onClick={resetForm}>Cancel</Button>}
              </div>
            </div>
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Existing Admins</h2>
              <ul className="space-y-2">
                {users.map((u) => (
                  <li key={u.id} className="border p-2 rounded flex justify-between items-center">
                    <div>
                      <div className="font-medium">{u.name} ({u.email})</div>
                      <div className="text-sm text-muted-foreground">
                        Roles: {u.roles?.join(', ') || 'None'}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(u)}>Edit</Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(u.id)}>Delete</Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
