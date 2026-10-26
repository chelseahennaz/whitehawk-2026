import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Heart, 
  LogOut, 
  Menu, 
  X,
  ChevronRight,
  User,
  ExternalLink,
  Settings,
  Play,
  Shield,
  Calendar,
  ShoppingBag,
  LayoutList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const AdminLayout = () => {
  const [session, setSession] = useState<any>(null);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAdmin = async (currentSession: any) => {
      if (!currentSession) {
        setLoading(false);
        navigate("/admin/login");
        return;
      }
      
      // Verify user is in admin_users table
      const { data, error } = await supabase
        .from("admin_users")
        .select("*")
        .eq("email", currentSession.user.email)
        .single();
        
      if (error || !data) {
        // Temporarily bypassing so you can log in and add yourself to Admin Users
        console.error("Admin check failed", error);
        // await supabase.auth.signOut();
        // setSession(null);
        // setLoading(false);
        // navigate("/admin/login");
        // return;
      }
      
      setAdminUser(data);
      setSession(currentSession);
      setLoading(false);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      checkAdmin(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      checkAdmin(session);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  if (loading) {
    return <div className="h-screen w-screen flex items-center justify-center bg-club-dark text-white font-heading uppercase text-xl animate-pulse">Hawks Admin</div>;
  }

  if (!session) return null;

  const menuItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard, roleKey: "dashboard" },
    { label: "News Posts", href: "/admin/posts", icon: FileText, roleKey: "posts" },
    { label: "Squad", href: "/admin/squad", icon: Users, roleKey: "squad" },
    { label: "Personnel", href: "/admin/personnel", icon: Shield, roleKey: "personnel" },
    { label: "Videos", href: "/admin/videos", icon: Play, roleKey: "videos" },
    { label: "Sponsors", href: "/admin/sponsors", icon: Heart, roleKey: "sponsors" },
    { label: "Fixtures", href: "/admin/fixtures", icon: Calendar, roleKey: "fixtures" },
    { label: "Shop", href: "/admin/products", icon: ShoppingBag, roleKey: "shop" },
    { label: "Settings", href: "/admin/settings", icon: Settings, roleKey: "settings" },
    { label: "Menu Pages", href: "/admin/menu-pages", icon: LayoutList, roleKey: "settings" },
    { label: "Admin Users", href: "/admin/users", icon: User, roleKey: "admin_users" },
  ];

  const hasAdminUsersRole = !adminUser?.roles || adminUser.roles.includes('admin_users');

  const visibleMenuItems = [
    ...menuItems.filter(item => 
      !adminUser?.roles || adminUser.roles.includes(item.roleKey)
    ),
    // Always show My Account if Admin Users isn't already visible
    ...(!hasAdminUsersRole ? [{ label: "My Account", href: "/admin/users", icon: User, roleKey: "" }] : []),
  ];

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Mobile Sidebar Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity",
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 w-64 bg-club-dark text-white z-50 transition-transform duration-300 lg:relative lg:translate-x-0 pb-10",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 flex items-center gap-3 border-b border-white/10">
          <div className="bg-white/10 p-1 rounded-full w-8 h-8 flex items-center justify-center border border-white/5 shadow-inner">
             <img 
               src="https://thehawksfc.com/wp-content/uploads/2023/04/cropped-twitter-badge-round.png" 
               alt="Whitehawk FC Logo" 
               className="w-full h-full object-contain"
             />
          </div>
          <span className="font-heading font-bold uppercase tracking-wider text-sm">Hawks Admin</span>
        </div>

        <nav className="mt-6 px-4 space-y-1">
          {visibleMenuItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setIsSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-heading uppercase tracking-wide transition-colors",
                location.pathname === item.href 
                  ? "bg-primary text-white" 
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-6 left-4 right-4 space-y-2">
          <Link 
            to="/" 
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-heading uppercase tracking-wide text-white/40 hover:text-white hover:bg-white/5 transition-colors"
          >
            <ExternalLink size={16} />
            View Site
          </Link>
          <Button 
            onClick={handleLogout}
            variant="ghost" 
            className="w-full justify-start gap-3 text-white/60 hover:text-white hover:bg-white/5 font-heading uppercase tracking-wide text-xs"
          >
            <LogOut size={16} />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-border flex items-center justify-between px-4 lg:px-8 shrink-0">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 text-muted-foreground hover:text-foreground"
          >
            <Menu size={24} />
          </button>
          
          <div className="flex items-center gap-4 ml-auto">
             <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-heading font-semibold uppercase">{session.user.email}</span>
                <span className="text-[10px] text-muted-foreground uppercase opacity-70">Administrator</span>
             </div>
             <div className="w-8 h-8 rounded-full bg-club-dark/5 flex items-center justify-center border border-border">
                <User size={16} className="text-muted-foreground" />
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
           <Outlet />
        </main>
      </div>
    </div>
  );
};


export default AdminLayout;
