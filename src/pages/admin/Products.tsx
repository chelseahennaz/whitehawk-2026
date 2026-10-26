import { useState } from "react";
import { useProducts, useSettings } from "@/hooks/useSupabase";
import type { Product, ProductSize } from "@/types/Product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { deleteImageFromIonos } from "@/lib/imageHelpers";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Loader2, 
  ShoppingBag, 
  X, 
  Image as ImageIcon
} from "lucide-react";

export const Products = () => {
  const { data: products, isLoading, refetch } = useProducts();
  const { data: shopSettings, refetch: refetchSettings } = useSettings("shop_settings");
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [comingSoonSaving, setComingSoonSaving] = useState(false);

  const shopComingSoon = shopSettings?.value?.coming_soon ?? false;

  const handleToggleComingSoon = async (checked: boolean) => {
    setComingSoonSaving(true);
    try {
      const newValue = { coming_soon: checked };
      const { data: updateData, error } = await supabase
        .from("site_settings")
        .update({ value: newValue, updated_at: new Date().toISOString() })
        .eq("key", "shop_settings")
        .select();

      if (error) throw error;

      if (!updateData || updateData.length === 0) {
        const { error: insertError } = await supabase
          .from("site_settings")
          .insert({ key: "shop_settings", value: newValue });
        if (insertError) throw insertError;
      }

      toast.success(`Shop Coming Soon turned ${checked ? "ON" : "OFF"}`);
      refetchSettings();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to update shop status");
    } finally {
      setComingSoonSaving(false);
    }
  };

  const filteredProducts = (products || []).filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (product: Product) => {
    // Clone product to avoid editing cache directly
    setEditingProduct(JSON.parse(JSON.stringify(product)));
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setEditingProduct({
      name: "",
      price: 0,
      category: "shirts",
      image: "",
      description: "",
      badge: "",
      sizes: [{ size: "One Size", stock: 10 }],
      stripeMockUrl: "",
    });
    setIsEditing(true);
  };

  const handleSizeChange = (index: number, field: keyof ProductSize, value: any) => {
    if (!editingProduct) return;
    const newSizes = [...editingProduct.sizes];
    newSizes[index] = { ...newSizes[index], [field]: value };
    setEditingProduct({ ...editingProduct, sizes: newSizes });
  };

  const handleAddSizeField = () => {
    if (!editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      sizes: [...editingProduct.sizes, { size: "", stock: 0 }],
    });
  };

  const handleRemoveSizeField = (index: number) => {
    if (!editingProduct) return;
    const newSizes = editingProduct.sizes.filter((_: any, i: number) => i !== index);
    setEditingProduct({ ...editingProduct, sizes: newSizes });
  };

  const handleDelete = async (id: string) => {
    const product = products?.find(p => p.id === id);
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      if (product?.image) {
        await deleteImageFromIonos(product.image);
      }
      toast.success("Product deleted successfully");
      refetch();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to delete product");
    }
  };

  const handleSave = async () => {
    if (!editingProduct) return;
    if (!editingProduct.name) {
      toast.error("Product name is required");
      return;
    }
    if (editingProduct.price <= 0) {
      toast.error("Price must be greater than 0");
      return;
    }
    if (!editingProduct.description) {
      toast.error("Product description is required");
      return;
    }
    if (!editingProduct.image) {
      toast.error("Product image is required");
      return;
    }

    // Filter out invalid empty sizes
    const validSizes = editingProduct.sizes.filter((s: any) => s.size.trim() !== "");
    if (validSizes.length === 0) {
      toast.error("At least one size definition is required");
      return;
    }

    setSaving(true);
    try {
      const dbPayload = {
        name: editingProduct.name,
        price: parseFloat(editingProduct.price),
        category: editingProduct.category,
        image: editingProduct.image,
        description: editingProduct.description,
        badge: editingProduct.badge || null,
        sizes: validSizes,
        stripe_mock_url: editingProduct.stripeMockUrl || null,
      };

      if (editingProduct.id) {
        // Edit product
        const { error } = await supabase
          .from("products")
          .update(dbPayload)
          .eq("id", editingProduct.id);
        if (error) throw error;
        toast.success("Product updated successfully");
      } else {
        // Add new product
        const { error } = await supabase
          .from("products")
          .insert([dbPayload]);
        if (error) throw error;
        toast.success("Product created successfully");
      }
      setIsEditing(false);
      refetch();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="font-heading text-2xl font-bold uppercase tracking-wide text-slate-900 flex items-center gap-2">
            <ShoppingBag className="text-[#8e160b]" size={24} /> Shop Products Admin
          </h1>
          <p className="text-xs text-muted-foreground font-body mt-1">
            Manage merchandise catalog items, sizes, prices, and stock levels.
          </p>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200/85 rounded-lg px-3.5 py-2.5 h-11">
            <Switch
              id="shop-coming-soon"
              checked={shopComingSoon}
              onCheckedChange={handleToggleComingSoon}
              disabled={comingSoonSaving}
            />
            <Label htmlFor="shop-coming-soon" className="text-[10px] font-heading font-bold uppercase tracking-wider cursor-pointer text-slate-600">
              Coming Soon
            </Label>
          </div>
          <Button 
            onClick={handleAddNew} 
            className="bg-black hover:bg-[#8e160b] text-white font-heading text-xs uppercase tracking-wider h-11 px-6 shadow-sm flex items-center gap-2"
          >
            <Plus size={16} /> Add Product
          </Button>
        </div>
      </div>

      {/* Search Filter bar */}
      <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search products by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 text-xs bg-white border-slate-200"
          />
        </div>
        <span className="text-xs font-body text-slate-400">
          Showing {filteredProducts.length} items
        </span>
      </div>

      {/* Main product catalog list */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200 rounded-xl shadow-sm">
          <Loader2 className="w-8 h-8 animate-spin text-[#8e160b] mb-3" />
          <p className="font-heading text-xs uppercase tracking-wider text-slate-400">Loading products...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-xl shadow-sm">
          <p className="font-heading text-slate-400 uppercase text-sm">No products found</p>
          <p className="font-body text-xs text-slate-400 mt-1">Try refining your search or add a new product.</p>
        </div>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-slate-50 text-[10px] uppercase tracking-widest font-heading text-muted-foreground">
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock (Sizes)</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((product) => (
                  <tr 
                    key={product.id}
                    onClick={() => handleEdit(product)}
                    className="hover:bg-slate-50/50 cursor-pointer transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <ImageIcon size={20} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-heading font-bold uppercase text-sm group-hover:text-[#8e160b] transition-colors">
                            {product.name}
                          </p>
                          {product.badge && (
                            <span className="inline-block mt-1 text-[9px] font-heading font-bold uppercase tracking-wider px-2 py-0.5 bg-club-gold/25 text-amber-800 rounded">
                              {product.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-heading uppercase text-slate-500">
                      {product.category === "shirts" ? "Shirts & Hoodies" : product.category === "hats-scarves" ? "Hats & Scarves" : "Accessories"}
                    </td>
                    <td className="px-6 py-4 text-sm font-heading font-bold text-slate-900">
                      £{product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5 max-w-xs">
                        {product.sizes?.map((s) => (
                          <span 
                            key={s.size} 
                            className={`text-[10px] font-heading font-bold uppercase px-2 py-0.5 rounded border ${
                              s.stock <= 0 
                                ? "bg-red-50 text-red-600 border-red-100 animate-pulse" 
                                : s.stock <= 5 
                                  ? "bg-amber-50 text-amber-700 border-amber-100" 
                                  : "bg-slate-50 text-slate-600 border-slate-200"
                            }`}
                          >
                            {s.size}: {s.stock}
                          </span>
                        ))}
                        {(!product.sizes || product.sizes.length === 0) && (
                          <span className="text-[10px] text-red-500 font-bold uppercase">No Sizes Defined</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(product)}
                          className="h-8 w-8 hover:text-[#8e160b] hover:bg-slate-100"
                        >
                          <Edit2 size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(product.id)}
                          className="h-8 w-8 text-slate-300 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit / Add Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading font-bold uppercase tracking-wider text-slate-900">
              {editingProduct?.id ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>

          {editingProduct && (
            <div className="grid gap-5 py-4">
              {/* Product Info Group */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-[10px] uppercase tracking-widest font-heading text-muted-foreground">Product Name</label>
                  <Input
                    placeholder="e.g. Home Shirt 2026/27"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="text-xs"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-[10px] uppercase tracking-widest font-heading text-muted-foreground">Price (£)</label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="49.99"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    className="text-xs"
                  />
                </div>
              </div>

              {/* Category & Badge */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-[10px] uppercase tracking-widest font-heading text-muted-foreground">Category</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full bg-white border border-input rounded-md px-3 h-10 text-xs focus:ring-1 focus:ring-primary focus:outline-none font-heading uppercase"
                  >
                    <option value="shirts">Shirts & Hoodies</option>
                    <option value="hats-scarves">Hats & Scarves</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <label className="text-[10px] uppercase tracking-widest font-heading text-muted-foreground">Promo Badge (optional)</label>
                  <Input
                    placeholder="e.g. New Arrival, Popular, Sale"
                    value={editingProduct.badge || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                    className="text-xs"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="grid gap-2">
                <label className="text-[10px] uppercase tracking-widest font-heading text-muted-foreground">Description</label>
                <Textarea
                  placeholder="Describe your product detail..."
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="text-xs min-h-[70px]"
                />
              </div>

              {/* Stripe Link */}
              <div className="grid gap-2">
                <label className="text-[10px] uppercase tracking-widest font-heading text-muted-foreground">Stripe Payment Link (optional)</label>
                <Input
                  placeholder="e.g. https://checkout.stripe.com/..."
                  value={editingProduct.stripeMockUrl || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, stripeMockUrl: e.target.value })}
                  className="text-xs"
                />
              </div>

              {/* Image upload */}
              <div className="grid gap-2 border-t pt-4 border-slate-100">
                <label className="text-[10px] uppercase tracking-widest font-heading text-muted-foreground mb-1">Product Image</label>
                <ImageUpload
                  value={editingProduct.image}
                  onChange={(url) => setEditingProduct({ ...editingProduct, image: url })}
                />
                <div className="flex gap-2 items-center mt-2">
                  <span className="text-[9px] uppercase tracking-wide text-slate-400 font-heading shrink-0">Or URL:</span>
                  <Input
                    placeholder="Image URL link..."
                    value={editingProduct.image}
                    onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                    className="text-[11px] h-8 bg-slate-50/50"
                  />
                </div>
              </div>

              {/* Sizes and Stock */}
              <div className="grid gap-2 border-t pt-4 border-slate-100">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] uppercase tracking-widest font-heading text-muted-foreground">Sizes & Stock management</label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddSizeField}
                    className="text-[10px] font-heading font-bold uppercase tracking-wider flex items-center gap-1 h-7 px-2.5"
                  >
                    <Plus size={10} /> Add Size
                  </Button>
                </div>
                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                  {editingProduct.sizes?.map((s: any, idx: number) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <Input
                        placeholder="e.g. S, XL, One Size"
                        value={s.size}
                        onChange={(e) => handleSizeChange(idx, "size", e.target.value)}
                        className="flex-1 text-xs uppercase"
                      />
                      <Input
                        placeholder="Stock"
                        type="number"
                        min="0"
                        value={s.stock}
                        onChange={(e) => handleSizeChange(idx, "stock", parseInt(e.target.value) || 0)}
                        className="w-24 text-xs text-center font-bold"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveSizeField(idx)}
                        className="h-9 w-9 text-slate-400 hover:text-red-500 shrink-0"
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  ))}
                  {(!editingProduct.sizes || editingProduct.sizes.length === 0) && (
                    <p className="text-[10px] text-center text-slate-400 font-body italic py-4">
                      No sizes defined. Click "Add Size" to create size/stock details.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="border-t border-slate-100 pt-4 flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="font-heading text-xs uppercase tracking-wider h-11 px-5"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-black hover:bg-[#8e160b] text-white font-heading text-xs uppercase tracking-wider h-11 px-6 shadow-sm flex items-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;

