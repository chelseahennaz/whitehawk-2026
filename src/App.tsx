import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Public Pages
import Index from "@/pages/Index";
import Teams from "@/pages/Teams";
import Matches from "@/pages/Matches";
import Sponsor from "@/pages/Sponsor";
import News from "@/pages/News";
import PostDetail from "@/pages/PostDetail";
import Contact from "@/pages/Contact";
import MatchCenter from "@/pages/MatchCenter";
import NotFound from "@/pages/NotFound";

// Admin & Layouts
import AdminLayout from "@/components/admin/AdminLayout";
import PublicLayout from "@/components/PublicLayout";
import Login from "@/pages/admin/Login";
import Dashboard from "@/pages/admin/Dashboard";
import AdminPosts from "@/pages/admin/Posts";
import EditPost from "@/pages/admin/EditPost";
import Squad from "@/pages/admin/Squad";
import Sponsors from "@/pages/admin/Sponsors";
import Settings from "@/pages/admin/Settings";
import AdminVideos from "@/pages/admin/Videos";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/sponsor" element={<Sponsor />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:slug" element={<PostDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/match-center/:id" element={<MatchCenter />} />
          </Route>
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="posts" element={<AdminPosts />} />
            <Route path="posts/new" element={<EditPost />} />
            <Route path="posts/edit/:id" element={<EditPost />} />
            <Route path="squad" element={<Squad />} />
            <Route path="sponsors" element={<Sponsors />} />
            <Route path="videos" element={<AdminVideos />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
