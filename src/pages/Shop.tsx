import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, 
  CreditCard, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  DollarSign, 
  ChevronDown,
  Plus,
  Check,
  Loader2,
  Clock,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useProducts, useSettings } from "@/hooks/useSupabase";
import type { Product } from "@/types/Product";

const faqs = [
  {
    q: "How does the myPOS checkout work?",
    a: "When you click 'Checkout', you are securely redirected to the myPOS payment page. You complete your transaction there using Card, Apple Pay, or Google Pay. Once complete, you are redirected back to our site with a payment confirmation, and you'll receive a receipt from myPOS."
  },
  {
    q: "How are merchandise items delivered?",
    a: "We offer local UK shipping via Royal Mail (3-5 business days) for £4.50. Alternatively, you can choose free local pickup from the clubhouse on match days."
  },
  {
    q: "Are clothing sizes true to fit?",
    a: "Yes, our shirts and hoodies are standard athletic UK fit. We recommend ordering your normal size, or sizing up if you prefer a looser fit."
  },
  {
    q: "What is our merchandise returns policy?",
    a: "We offer a 14-day return or exchange policy on all unworn clothing items with original tags still attached. Custom printed shirts cannot be returned."
  }
];

const Shop = () => {
  const { addItem } = useCart();
  const { data: products, isLoading: isProductsLoading, error } = useProducts();
  const { data: shopSettings, isLoading: isSettingsLoading } = useSettings("shop_settings");
  const [activeCategory, setActiveCategory] = useState<"all" | "shirts" | "hats-scarves" | "accessories">("all");
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});

  const isLoading = isProductsLoading || isSettingsLoading;
  const isComingSoon = shopSettings?.value?.coming_soon ?? false;

  if (isComingSoon) {
    return (
      <div className="bg-[#141b2b] min-h-[90vh] flex flex-col justify-center items-center relative overflow-hidden px-4 py-20 text-white">
        {/* Decorative background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#8e160b]/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-club-gold/5 blur-[100px] pointer-events-none" />

        <div className="container max-w-2xl mx-auto relative z-10 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-club-gold text-xs font-heading font-bold uppercase tracking-widest mb-4"
          >
            <Clock size={12} className="animate-pulse" /> Launching Soon
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
          >
            <h1 className="font-heading text-5xl md:text-7xl font-bold uppercase tracking-tight leading-none bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
              Club Shop <br />
              <span className="text-[#8e160b]">Coming Soon</span>
            </h1>
            <p className="font-body text-white/60 text-base md:text-lg max-w-lg mx-auto leading-relaxed">
              We are currently updating the official Whitehawk FC online store with our brand new 2026/27 range. Check back soon to grab your gear!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="pt-6"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild className="bg-[#8e160b] hover:bg-[#8e160b]/90 text-white font-heading uppercase text-xs tracking-widest h-12 px-8">
                <Link to="/">
                  <ArrowLeft size={14} className="mr-2" /> Back to Homepage
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const filteredProducts = products
    ? (activeCategory === "all" 
        ? products 
        : products.filter(p => p.category === activeCategory))
    : [];

  const handleAddToCart = (product: Product, size: string) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      size: size,
    });
    // Flash the "Added" confirmation on the button briefly
    setAddedItems(prev => new Set(prev).add(product.id));
    setTimeout(() => {
      setAddedItems(prev => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 1500);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Header */}
      <section className="relative py-20 md:py-32 bg-white border-b border-border/50 overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[url('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-heading text-sm uppercase tracking-[0.4em] text-[#8e160b] font-bold mb-6">Official Club Shop</p>
            <h1 className="font-heading text-5xl md:text-8xl font-bold uppercase text-black leading-tight tracking-tighter">
              Get Your Gear
            </h1>
            <p className="font-body text-muted-foreground/80 max-w-2xl mx-auto mt-8 text-base md:text-xl leading-relaxed">
              Support the Hawks on and off the pitch. Buy official shirts, hoodies, training wear, hats, scarves, pins, and accessories.
            </p>
            <div className="h-2 w-24 bg-club-gold mx-auto mt-10" />
          </motion.div>
        </div>
      </section>

      {/* myPOS Info Banner */}
      <section className="bg-slate-50 border-b border-border/50 py-5">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#8e160b]/10 flex items-center justify-center text-[#8e160b]">
              <Sparkles size={18} />
            </div>
            <div className="text-left">
              <span className="font-heading text-xs uppercase font-bold tracking-wider text-[#8e160b]">Secure myPOS Checkout</span>
              <p className="text-xs text-slate-500 font-body mt-0.5">Add items to your cart and checkout securely via our myPOS payment gateway.</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#8e160b]/10 text-[#8e160b] border border-[#8e160b]/20 font-body shrink-0">
            <ShieldCheck size={12} /> Bank-Grade Encryption
          </span>
        </div>
      </section>

      {/* Store Catalog */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mb-12 md:mb-16 border-b border-slate-100 pb-8">
            {[
              { id: "all", label: "All Items" },
              { id: "shirts", label: "Shirts & Hoodies" },
              { id: "hats-scarves", label: "Hats & Scarves" },
              { id: "accessories", label: "Pins & Accessories" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as any)}
                className={`px-6 py-2.5 rounded-full font-heading text-xs uppercase tracking-widest font-semibold transition-all ${
                  activeCategory === tab.id
                    ? "bg-[#8e160b] text-white shadow-md shadow-[#8e160b]/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Loading and Error States */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-[#8e160b] mb-4" />
              <p className="font-heading text-sm uppercase tracking-wider text-slate-400">Loading Products...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-20">
              <p className="text-red-500 font-heading">Failed to load shop items. Please try again later.</p>
            </div>
          )}

          {!isLoading && !error && filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="font-heading text-slate-400">No products found in this category.</p>
            </div>
          )}

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {filteredProducts.map((product) => {
              const activeSize = selectedSizes[product.id] || 
                (product.sizes?.find(s => s.stock > 0)?.size || product.sizes?.[0]?.size || "One Size");
              const selectedSizeObj = product.sizes?.find(s => s.size === activeSize);
              const isProductOutOfStock = !product.sizes || product.sizes.every(s => s.stock <= 0);
              const isSelectedSizeOutOfStock = selectedSizeObj ? selectedSizeObj.stock <= 0 : true;

              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="group flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  {/* Image Section */}
                  <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.badge && (
                      <span className="absolute top-4 left-4 bg-club-gold text-black text-[10px] font-heading font-bold uppercase px-3 py-1 rounded-full tracking-wider">
                        {product.badge}
                      </span>
                    )}
                    <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-black text-xs font-heading font-bold uppercase px-3 py-1 rounded-full">
                      £{product.price.toFixed(2)}
                    </span>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 md:p-8 flex-1 flex flex-col">
                    <span className="font-heading text-[10px] text-[#8e160b] font-bold uppercase tracking-widest mb-2 block">
                      {product.category}
                    </span>
                    <h3 className="font-heading text-xl font-bold text-black uppercase mb-3 line-clamp-1 group-hover:text-[#8e160b] transition-colors">
                      {product.name}
                    </h3>
                    <p className="font-body text-sm text-slate-500 leading-relaxed mb-6 flex-1">
                      {product.description}
                    </p>

                    {/* Size Selector */}
                    {product.sizes && product.sizes.length > 0 && !(product.sizes.length === 1 && product.sizes[0].size === "One Size") && (
                      <div className="mb-6">
                        <span className="text-[10px] uppercase font-heading font-bold text-slate-400 tracking-wider block mb-2">
                          Select Size
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {product.sizes.map((s) => {
                            const isSelected = activeSize === s.size;
                            const isOutOfStock = s.stock <= 0;
                            return (
                              <button
                                key={s.size}
                                disabled={isOutOfStock}
                                onClick={() => setSelectedSizes(prev => ({ ...prev, [product.id]: s.size }))}
                                className={`h-8 min-w-[32px] px-2.5 rounded text-xs font-heading font-bold uppercase transition-all ${
                                  isOutOfStock
                                    ? "bg-slate-100 text-slate-300 line-through cursor-not-allowed"
                                    : isSelected
                                      ? "bg-[#8e160b] text-white shadow-sm shadow-[#8e160b]/20"
                                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                              >
                                {s.size}
                              </button>
                            );
                          })}
                        </div>
                        {selectedSizeObj && selectedSizeObj.stock > 0 && selectedSizeObj.stock <= 5 && (
                          <span className="text-[10px] text-orange-600 font-body block mt-2 font-medium">
                            ⚠️ Only {selectedSizeObj.stock} left in stock!
                          </span>
                        )}
                      </div>
                    )}
                    
                    {/* Add to Cart Button */}
                    <Button
                      disabled={isProductOutOfStock || isSelectedSizeOutOfStock}
                      onClick={() => handleAddToCart(product, activeSize)}
                      className={`w-full h-12 font-heading uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-2 ${
                        addedItems.has(product.id)
                          ? "bg-green-600 hover:bg-green-600 text-white"
                          : isProductOutOfStock || isSelectedSizeOutOfStock
                            ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                            : "bg-black hover:bg-[#8e160b] text-white"
                      }`}
                    >
                      {addedItems.has(product.id) ? (
                        <><Check size={14} /> Added to Cart!</>
                      ) : isProductOutOfStock ? (
                        "Out of Stock"
                      ) : isSelectedSizeOutOfStock ? (
                        `Size ${activeSize} Out of Stock`
                      ) : (
                        <><ShoppingBag size={14} /> Add to Cart</>
                      )}
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why myPOS Banner */}
      <section className="py-20 md:py-28 bg-[#141b2b] text-white overflow-hidden relative border-y border-white/5">
        <div className="absolute inset-y-0 right-0 w-1/3 bg-[#8e160b]/5 -skew-x-12 translate-x-1/4" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="font-heading text-sm uppercase tracking-widest text-club-gold mb-3">Official Whitehawk FC Payment Partner</p>
            <h2 className="font-heading text-4xl md:text-6xl font-bold uppercase mb-6 tracking-tighter leading-none">
              Powered by myPOS
            </h2>
            <p className="font-body text-white/70 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
              We partner with myPOS, a leading secure payment provider, to offer a fast, reliable, and highly secure checkout experience for all our online orders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <DollarSign className="text-club-gold" size={28} />,
                title: "Instant Secure Payment",
                desc: "Your transaction is completed instantly via myPOS, ensuring a fast checkout experience so you can secure your official merchandise immediately."
              },
              {
                icon: <ShieldCheck className="text-club-gold" size={28} />,
                title: "Bank-Grade Security",
                desc: "myPOS handles all card details, complying with PCI-DSS standards and Strong Customer Authentication (SCA). We never see or store your card number."
              },
              {
                icon: <CreditCard className="text-club-gold" size={28} />,
                title: "All Major Cards & Wallets",
                desc: "Easily pay using Visa, Mastercard, Apple Pay, or Google Pay. Fully optimized for a seamless checkout experience on both mobile and desktop."
              }
            ].map((item, idx) => (
              <div key={idx} className="p-8 bg-white/5 border border-white/10 rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h3 className="font-heading text-lg font-bold uppercase mb-3 text-white tracking-wide">{item.title}</h3>
                <p className="font-body text-sm text-white/60 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* How checkout works stepper */}
          <div className="mt-20 border-t border-white/10 pt-16 max-w-4xl mx-auto">
            <h3 className="font-heading text-xl font-bold text-center uppercase tracking-wider mb-10 text-white">How myPOS Checkout Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {[
                { step: "01", title: "Add to Cart", desc: "Browse the shop, select your size, and add items to your cart." },
                { step: "02", title: "Secure Redirect", desc: "Click checkout — our site securely passes your order to myPOS." },
                { step: "03", title: "Pay & Done", desc: "Enter your card details on the myPOS page. You'll get a receipt instantly." }
              ].map((s, idx) => (
                <div key={idx} className="flex gap-4 items-start relative z-10 bg-[#141b2b]">
                  <span className="font-heading text-4xl font-extrabold text-[#8e160b]">{s.step}</span>
                  <div>
                    <h4 className="font-heading text-sm font-bold uppercase mb-1 tracking-wide text-white">{s.title}</h4>
                    <p className="font-body text-xs text-white/50">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* FAQS */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <p className="font-heading text-sm uppercase tracking-widest text-[#8e160b] mb-3">Questions & Answers</p>
            <h2 className="font-heading text-4xl font-bold uppercase tracking-tighter text-black">Shop FAQs</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden transition-colors">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left font-heading text-base font-bold text-black uppercase tracking-wide hover:text-[#8e160b] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown size={18} className={`transition-transform shrink-0 ml-4 ${isOpen ? "rotate-180 text-[#8e160b]" : "text-slate-400"}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="overflow-hidden bg-slate-50"
                      >
                        <p className="px-6 pb-6 pt-2 font-body text-sm text-slate-600 leading-relaxed">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Shop;

