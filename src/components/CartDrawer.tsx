import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, CreditCard, Package, Loader2 } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";

const CartDrawer = () => {
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice, isOpen, closeCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [name, setName] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [postcode, setPostcode] = useState('');
  const [country, setCountry] = useState('');
  const [shippingOption, setShippingOption] = useState('standard');
  const [shippingError, setShippingError] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleCheckout = () => {
    // Reset email state when opening checkout
    setEmail('');
    setEmailError('');
    setShowCheckout(true);
    setCheckoutError(null);
  };

  /**
   * Calls our PHP endpoint which builds a signed myPOS IPC request.
   * The PHP returns { url, params, order } — we build a hidden form
   * and submit it so the browser POSTs to the myPOS hosted payment page.
   *
   * In local development (Vite, no PHP), a simulated success screen is shown instead.
   */
  const handleConfirmCheckout = async () => {
    setIsRedirecting(true);
    setCheckoutError(null);

    try {
      // ── Dev mode bypass (Localhost / Development only) ──────────────────────
      if (import.meta.env.DEV) {
        // Simulate a short redirect delay then "success"
        await new Promise(r => setTimeout(r, 1200));
        setIsRedirecting(false);
        setShowCheckout(false);
        clearCart();
        closeCart();
        // clear stored checkout info after successful flow
        try { localStorage.removeItem('checkoutInfo'); } catch {}
        // Show a brief dev-mode alert so the flow is clearly exercised
        window.alert(
          "⚡ Dev Mode — myPOS Checkout Simulation\n\n" +
          "On your live server, the customer would be redirected to the myPOS payment page.\n\n" +
          "Items in this order:\n" +
          items.map(i => `• ${i.name}${i.size ? ` (${i.size})` : ""} ×${i.quantity} — £${(i.price * i.quantity).toFixed(2)}`).join("\n") +
          `\n\nTotal: £${totalPrice.toFixed(2)}`
        );
        return;
      }
      // ── End dev mode bypass ────────────────────────────────────────────────

      const storedInfo = (() => {
        try {
          const s = localStorage.getItem('checkoutInfo');
          return s ? JSON.parse(s) : {};
        } catch {
          return {};
        }
      })();

      const response = await fetch("/mypos-checkout.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(i => ({
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            size: i.size,
          })),
          email,
          name,
          address1,
          address2,
          city,
          postcode,
          country,
          shippingOption,
        }),
      });

      // Clear stored checkout info after success
      try { localStorage.removeItem('checkoutInfo'); } catch {}

      // Read as text first so we can detect PHP-not-executing scenarios
      const rawText = await response.text();

      let data: { url?: string; params?: Record<string, string>; order?: string; error?: string };
      try {
        data = JSON.parse(rawText);
      } catch {
        throw new Error("Unexpected response from checkout server. Please try again.");
      }

      if (!response.ok || data.error) {
        throw new Error(data.error || "Checkout failed. Please try again.");
      }

      if (!data.url || !data.params) {
        throw new Error("Invalid checkout response. Please contact the club.");
      }

      // Build a hidden form and submit it to myPOS (POST required by IPC spec)
      const form = document.createElement("form");
      form.method = "POST";
      form.action = data.url;
      form.style.display = "none";

      Object.entries(data.params).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit(); // browser navigates to myPOS payment page

    } catch (err: unknown) {
      setIsRedirecting(false);
      setCheckoutError(err instanceof Error ? err.message : "An unexpected error occurred.");
    }
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            onClick={closeCart}
          />
        )}
      </AnimatePresence>

      {/* Drawer Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md z-[70] bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-[#8e160b]" />
                <h2 className="font-heading text-lg font-bold uppercase tracking-wider text-black">
                  Your Cart
                </h2>
                {totalItems > 0 && (
                  <span className="bg-[#8e160b] text-white text-xs font-bold font-heading w-5 h-5 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-xs font-heading uppercase tracking-wider text-slate-400 hover:text-[#8e160b] transition-colors px-2 py-1"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={closeCart}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-black transition-colors"
                  aria-label="Close cart"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <>
                <div className="flex flex-col items-center justify-center h-full gap-5 px-6 text-center">
                  <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center">
                    <Package size={32} className="text-slate-300" />
                  </div>
                  
                    <p className="font-heading text-base font-bold uppercase text-black mb-1">Your cart is empty</p>
                    <p className="font-body text-sm text-slate-500">Add some Hawks gear to get started!</p>
                  </div>
                  <Button
                    onClick={closeCart}
                    className="bg-[#8e160b] hover:bg-[#8e160b]/90 text-white font-heading uppercase text-xs tracking-widest h-11 px-6"
                  >
                    Browse the Shop
                  </Button>
                </>
              ) : (
                <div className="divide-y divide-slate-100">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 40 }}
                      className="flex gap-4 px-6 py-5"
                    >
                      {/* Product Image */}
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <span className="font-heading text-[9px] text-[#8e160b] font-bold uppercase tracking-widest">
                          {item.category}
                        </span>
                        <h3 className="font-heading text-sm font-bold text-black uppercase leading-tight mt-0.5 line-clamp-2">
                          {item.name}
                        </h3>
                        {item.size && (
                          <p className="font-body text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">
                            Size: {item.size}
                          </p>
                        )}
                        <p className="font-heading text-sm font-bold text-[#8e160b] mt-1">
                          £{(item.price * item.quantity).toFixed(2)}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-0 mt-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 rounded-l-lg border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 h-7 border-t border-b border-slate-200 flex items-center justify-center font-heading text-xs font-bold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 rounded-r-lg border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="ml-3 p-1.5 rounded-lg hover:bg-red-50 text-slate-300 hover:text-[#8e160b] transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer / Checkout */}
            {items.length > 0 && (
              <div className="border-t border-slate-100 px-6 py-6 bg-white">
                {/* Subtotal */}
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-body text-slate-500">Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})</span>
                    <span className="font-heading font-bold text-black">£{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-body text-slate-500">Shipping</span>
                    <span className="font-heading font-bold text-green-600 text-xs uppercase tracking-wide">Calculated at checkout</span>
                  </div>
                  <div className="border-t border-slate-100 pt-2 flex justify-between items-center">
                    <span className="font-heading text-base font-bold uppercase text-black">Total</span>
                    <span className="font-heading text-xl font-extrabold text-[#8e160b]">£{totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button
                  onClick={handleCheckout}
                  className="w-full h-13 bg-[#8e160b] hover:bg-[#8e160b]/90 text-white font-heading uppercase text-xs tracking-widest h-12 flex items-center justify-center gap-2 shadow-lg shadow-[#8e160b]/20"
                >
                  <CreditCard size={16} /> Checkout via myPOS <ArrowRight size={14} />
                </Button>
                <button
                  onClick={closeCart}
                  className="w-full mt-3 font-heading text-xs uppercase tracking-widest text-slate-400 hover:text-black transition-colors py-2"
                >
                  Continue Shopping
                </button>

                {/* Trust Badges */}
                <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-slate-100">
                  <span className="font-body text-[10px] text-slate-400 flex items-center gap-1">
                    🔒 Secure Checkout
                  </span>
                  <span className="font-body text-[10px] text-slate-400 flex items-center gap-1">
                    💳 myPOS Protected
                  </span>
                  <span className="font-body text-[10px] text-slate-400 flex items-center gap-1">
                    📦 UK Delivery
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkout Confirmation Modal */}
      <AnimatePresence>
        {showCheckout && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md md:max-w-lg lg:max-w-4xl border border-slate-100 overflow-hidden"
            >
              <button
                onClick={() => { if (!isRedirecting) setShowCheckout(false); }}
                disabled={isRedirecting}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-black transition-colors disabled:opacity-30"
              >
                <X size={20} />
              </button>

              <div className="p-8 grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  {/* Shipping Details */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="nameInput">Full name</label>
                    <input id="nameInput" type="text" className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#8e160b] focus:ring-[#8e160b]" placeholder="John Doe" value={name} onChange={e => { setName(e.target.value); if (shippingError) setShippingError(''); }} />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="address1Input">Address line 1</label>
                    <input id="address1Input" type="text" className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#8e160b] focus:ring-[#8e160b]" placeholder="123 Main St" value={address1} onChange={e => { setAddress1(e.target.value); if (shippingError) setShippingError(''); }} />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="address2Input">Address line 2 (optional)</label>
                    <input id="address2Input" type="text" className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#8e160b] focus:ring-[#8e160b]" placeholder="Apartment, suite, etc." value={address2} onChange={e => setAddress2(e.target.value)} />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="cityInput">City</label>
                    <input id="cityInput" type="text" className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#8e160b] focus:ring-[#8e160b]" placeholder="London" value={city} onChange={e => { setCity(e.target.value); if (shippingError) setShippingError(''); }} />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="postcodeInput">Postcode</label>
                    <input id="postcodeInput" type="text" className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#8e160b] focus:ring-[#8e160b]" placeholder="SW1A 1AA" value={postcode} onChange={e => { setPostcode(e.target.value); if (shippingError) setShippingError(''); }} />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="countryInput">Country</label>
                    <input id="countryInput" type="text" className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#8e160b] focus:ring-[#8e160b]" placeholder="United Kingdom" value={country} onChange={e => { setCountry(e.target.value); if (shippingError) setShippingError(''); }} />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="shippingSelect">Shipping</label>
                    <select id="shippingSelect" className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#8e160b] focus:ring-[#8e160b]" value={shippingOption} onChange={e => setShippingOption(e.target.value)}>
                      <option value="standard">Standard – free</option>
                      <option value="express">Express – +£5.00</option>
                    </select>
                  </div>
                  {/* Email Input */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="emailInput">Email address</label>
                    <input id="emailInput" type="email" className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#8e160b] focus:ring-[#8e160b]" placeholder="you@example.com" value={email} onChange={e => { setEmail(e.target.value); if (emailError) setEmailError(''); }} />
                    {emailError && <p className="mt-1 text-sm text-red-600">{emailError}</p>}
                    {shippingError && <p className="mt-1 text-sm text-red-600">{shippingError}</p>}
                  </div>

                {/* myPOS branding strip */}
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-[#8e160b] flex items-center justify-center">
                    <CreditCard size={15} className="text-white" />
                  </div>
                  <span className="font-heading text-xs uppercase font-extrabold tracking-widest text-[#8e160b]">
                    myPOS Secure Checkout
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-heading text-2xl font-bold uppercase text-black mb-2">Order Summary</h3>
                <p className="font-body text-sm text-slate-500 mb-6 leading-relaxed">
                  Review your order below. Clicking "Pay with myPOS" will redirect you to the secure myPOS payment page.
                </p>

                <div className="bg-slate-50 rounded-2xl p-4 mb-6 space-y-3">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg border border-slate-200" />
                      <div className="flex-1 min-w-0">
                        <p className="font-heading text-xs font-bold uppercase text-black truncate">{item.name}</p>
                        <p className="font-body text-[10px] text-slate-500">
                          {item.size && `Size: ${item.size} | `}Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="font-heading text-sm font-bold text-[#8e160b]">£{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t border-slate-200 pt-3 flex justify-between">
                    <span className="font-heading text-sm font-bold uppercase">Total</span>
                    <span className="font-heading text-base font-extrabold text-[#8e160b]">£{totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                {/* Error message */}
                {checkoutError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
                    <p className="font-body text-xs text-red-600">{checkoutError}</p>
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  <Button
                    onClick={() => {
                      // Validate required address fields
                      if (!name.trim() || !address1.trim() || !city.trim() || !postcode.trim() || !country.trim()) {
                        setShippingError('Please complete all required address fields');
                        return;
                      }
                      // Simple email validation before proceeding
                      const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
                      if (!emailRegex.test(email)) {
                        setEmailError('Please enter a valid email address');
                        return;
                      }
                      handleConfirmCheckout();
                    }}
                    disabled={isRedirecting}
                    className="w-full h-12 bg-[#8e160b] hover:bg-[#8e160b]/90 text-white font-heading uppercase text-xs tracking-widest gap-2 flex items-center justify-center disabled:opacity-60"
                  >
                    {isRedirecting ? (
                      <>
                        <Loader2 size={15} className="animate-spin" /> Redirecting to myPOS…
                      </>
                    ) : (
                      <>Pay with myPOS <ArrowRight size={14} /></>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setShowCheckout(false)}
                    disabled={isRedirecting}
                    className="w-full h-12 font-heading uppercase text-xs tracking-widest border-slate-200 text-slate-600 disabled:opacity-30 mt-3"
                  >
                    Back to Cart
                  </Button>

                  {/* Security note */}
                  <p className="font-body text-[10px] text-slate-400 text-center mt-4">
                    🔒 You will be securely redirected to myPOS to enter your card details. We never store payment information.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  </>
  );
};

export default CartDrawer;
