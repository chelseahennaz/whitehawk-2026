import { useParams, Link } from "react-router-dom";
import { usePersonnelById } from "@/hooks/useSupabase";
import { Loader2, ArrowLeft, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

const StaffProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { data: staff, isLoading } = usePersonnelById(id || "");

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#8e160b]" />
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="container mx-auto py-24 text-center">
        <h2 className="text-3xl font-heading font-bold mb-4">Staff Member Not Found</h2>
        <Link to="/teams" className="text-[#8e160b] hover:underline flex items-center justify-center gap-2">
          <ArrowLeft size={16} /> Back to Teams
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 bg-[#141b2b] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://thehawksfc.com/wp-content/uploads/2023/10/E8A2020-scaled.jpg')] bg-cover bg-center" />
        <div className="container mx-auto px-4 relative z-10">
          <Link to="/teams" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8 font-body uppercase tracking-wider text-sm">
            <ArrowLeft size={16} /> Back to Squad
          </Link>

          <div className="flex flex-col md:flex-row gap-12 items-end">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative w-64 h-80 shrink-0 mx-auto md:mx-0 rounded-lg overflow-hidden bg-white/5 border-2 border-white/10"
            >
              {staff.image_url ? (
                <img 
                  src={staff.image_url} 
                  alt={staff.name} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-heading text-6xl font-bold text-white/20">
                    {staff.name.split(" ").map((n: string) => n[0]).join("")}
                  </span>
                </div>
              )}
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center md:text-left flex-1"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="px-4 py-1.5 bg-[#8e160b] text-white font-body text-xs font-bold uppercase tracking-widest rounded-full flex items-center gap-1.5">
                  <Briefcase size={12} /> {staff.role}
                </div>
              </div>
              <h1 className="font-heading text-5xl md:text-7xl font-bold uppercase mb-2 leading-none tracking-tighter">
                {staff.name}
              </h1>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Biography Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h3 className="font-heading text-2xl font-bold uppercase mb-6 border-b-2 border-gray-100 pb-4">
              Biography
            </h3>
            
            <div className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:uppercase prose-p:font-body prose-p:text-gray-600 prose-p:leading-relaxed">
              {staff.bio ? (
                <div dangerouslySetInnerHTML={{ __html: staff.bio.replace(/\n/g, '<br />') }} />
              ) : (
                <p className="italic text-gray-400">Biography coming soon.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default StaffProfile;
