import { useParams, Link } from "react-router-dom";
import { usePlayerById } from "@/hooks/useSupabase";
import { Loader2, ArrowLeft, Shield, Hash, Goal, Key } from "lucide-react";
import { motion } from "framer-motion";

const PlayerProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { data: player, isLoading } = usePlayerById(id || "");

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#8e160b]" />
      </div>
    );
  }

  if (!player) {
    return (
      <div className="container mx-auto py-24 text-center">
        <h2 className="text-3xl font-heading font-bold mb-4">Player Not Found</h2>
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
              {player.photo_url ? (
                <img 
                  src={player.photo_url} 
                  alt={player.name} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-heading text-6xl font-bold text-white/20">
                    {player.name.split(" ").map((n: string) => n[0]).join("")}
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
                <div className="px-4 py-1.5 bg-[#8e160b] text-white font-body text-xs font-bold uppercase tracking-widest rounded-full">
                  {player.position}
                </div>
                {player.is_captain && (
                  <div className="px-4 py-1.5 bg-club-gold text-white font-body text-xs font-bold uppercase tracking-widest rounded-full flex items-center gap-1.5">
                    <Shield size={12} /> Captain
                  </div>
                )}
              </div>
              <h1 className="font-heading text-5xl md:text-7xl font-bold uppercase mb-2 leading-none tracking-tighter">
                {player.name}
              </h1>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Details Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            
            {/* Stats Sidebar */}
            <div className="space-y-6">
              <h3 className="font-heading text-2xl font-bold uppercase mb-6 border-b-2 border-gray-100 pb-4 flex items-center gap-2">
                <Shield className="text-[#8e160b]" /> Season Stats
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-center flex flex-col items-center justify-center group hover:border-[#8e160b]/30 transition-colors">
                  <Hash className="text-[#8e160b] mb-2" size={24} />
                  <span className="font-heading text-4xl font-bold text-black mb-1">{player.appearances || 0}</span>
                  <span className="font-body text-xs text-muted-foreground uppercase tracking-wider font-medium">Appearances</span>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-center flex flex-col items-center justify-center group hover:border-[#8e160b]/30 transition-colors">
                  <Goal className="text-[#8e160b] mb-2" size={24} />
                  <span className="font-heading text-4xl font-bold text-black mb-1">{player.goals || 0}</span>
                  <span className="font-body text-xs text-muted-foreground uppercase tracking-wider font-medium">Goals</span>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-center flex flex-col items-center justify-center col-span-2 group hover:border-[#8e160b]/30 transition-colors">
                  <Key className="text-[#8e160b] mb-2" size={24} />
                  <span className="font-heading text-4xl font-bold text-black mb-1">{player.assists || 0}</span>
                  <span className="font-body text-xs text-muted-foreground uppercase tracking-wider font-medium">Assists</span>
                </div>
              </div>
            </div>

            {/* Bio Content */}
            <div className="md:col-span-2">
              <h3 className="font-heading text-2xl font-bold uppercase mb-6 border-b-2 border-gray-100 pb-4">
                Player Biography
              </h3>
              
              <div className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:uppercase prose-p:font-body prose-p:text-gray-600 prose-p:leading-relaxed">
                {player.bio ? (
                  <div dangerouslySetInnerHTML={{ __html: player.bio.replace(/\n/g, '<br />') }} />
                ) : (
                  <p className="italic text-gray-400">Biography coming soon.</p>
                )}
              </div>
            </div>
            
          </div>
        </div>
      </section>
    </>
  );
};

export default PlayerProfile;
