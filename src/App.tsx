import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Public Pages
import Index from "@/pages/Index";
import Teams from "@/pages/Teams";
import Matches from "@/pages/Matches";
import Standings from "@/pages/Standings";
import Sponsor from "@/pages/Sponsor";
import Hospitality from "@/pages/Hospitality";
import Fanzone from "@/pages/Fanzone";
import Personnel from "@/pages/Personnel";
import WomenTeam from "@/pages/teams/Women";
import U18Team from "@/pages/teams/U18";
import YouthPathway from "@/pages/teams/Youth";
import CommunityFootball from "@/pages/teams/Community";
import Academy from "@/pages/teams/Academy";
import AcademyU7 from "@/pages/teams/academy/U7";
import AcademyU12 from "@/pages/teams/academy/U12";
import AcademyU13Red from "@/pages/teams/academy/U13Red";
import AcademyU13White from "@/pages/teams/academy/U13White";
import AcademyU13 from "@/pages/teams/academy/U13";
import AcademyU14 from "@/pages/teams/academy/U14";
import AcademyU15 from "@/pages/teams/academy/U15";
import AcademyU16 from "@/pages/teams/academy/U16";
import News from "@/pages/News";
import PostDetail from "@/pages/PostDetail";
import Contact from "@/pages/Contact";
import Shop from "@/pages/Shop";
import MatchCenter from "@/pages/MatchCenter";
import MatchReport from "@/pages/MatchReport";
import PlayerProfile from "@/pages/PlayerProfile";
import StaffProfile from "@/pages/StaffProfile";
import NotFound from "@/pages/NotFound";
import Terms from "@/pages/Terms";
import RefundPolicy from "@/pages/RefundPolicy";
import DeliveryTerms from "@/pages/DeliveryTerms";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import CookiePolicy from "@/pages/CookiePolicy";
import Safeguarding from "@/pages/Safeguarding";
import HirePitch from "@/pages/HirePitch";
import HireClubhouse from "@/pages/HireClubhouse";
import MatchPhotos from "@/pages/MatchPhotos";

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
import AdminPersonnel from "@/pages/admin/Personnel";
import Products from "@/pages/admin/Products";
import AdminFixtures from "@/pages/admin/Fixtures";
import AdminUsers from "@/pages/admin/AdminUsers";
import MenuPages from "@/pages/admin/MenuPages";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,       // 2 minutes — avoids hammering FWP on every mount
      gcTime: 1000 * 60 * 10,          // 10 minutes — keep data in cache longer
      retry: 2,                         // Retry failed requests twice
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000), // Exponential backoff
      refetchOnWindowFocus: false,       // Respect staleTime — don't refetch on every tab switch
    },
  },
});

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
            <Route path="/player/:id" element={<PlayerProfile />} />
            <Route path="/staff/:id" element={<StaffProfile />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/standings" element={<Standings />} />
            <Route path="/sponsor" element={<Sponsor />} />
            <Route path="/hospitality" element={<Hospitality />} />
            <Route path="/fanzone" element={<Fanzone />} />
            <Route path="/personnel" element={<Personnel />} />
            <Route path="/teams/women" element={<WomenTeam />} />
            <Route path="/teams/u18" element={<U18Team />} />
            <Route path="/teams/youth" element={<YouthPathway />} />
            <Route path="/teams/community" element={<CommunityFootball />} />
            <Route path="/teams/academy" element={<Academy />} />
            <Route path="/teams/academy/u7" element={<AcademyU7 />} />
            <Route path="/teams/academy/u12" element={<AcademyU12 />} />
            <Route path="/teams/academy/u13-red" element={<AcademyU13Red />} />
            <Route path="/teams/academy/u13-white" element={<AcademyU13White />} />
            <Route path="/teams/academy/u13" element={<AcademyU13 />} />
            <Route path="/teams/academy/u14" element={<AcademyU14 />} />
            <Route path="/teams/academy/u15" element={<AcademyU15 />} />
            <Route path="/teams/academy/u16" element={<AcademyU16 />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:slug" element={<PostDetail />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/match-center/:id" element={<MatchCenter />} />
            <Route path="/match-report/:id" element={<MatchReport />} />
            <Route path="/match-photos" element={<MatchPhotos />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/delivery-terms" element={<DeliveryTerms />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/safeguarding" element={<Safeguarding />} />
            <Route path="/hire-pitch" element={<HirePitch />} />
            <Route path="/hire-clubhouse" element={<HireClubhouse />} />
          </Route>
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="posts" element={<AdminPosts />} />
            <Route path="posts/new" element={<EditPost />} />
            <Route path="posts/edit/:id" element={<EditPost />} />
            <Route path="squad" element={<Squad />} />
            <Route path="personnel" element={<AdminPersonnel />} />
            <Route path="sponsors" element={<Sponsors />} />
            <Route path="videos" element={<AdminVideos />} />
            <Route path="products" element={<Products />} />
            <Route path="settings" element={<Settings />} />
            <Route path="fixtures" element={<AdminFixtures />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="menu-pages" element={<MenuPages />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
