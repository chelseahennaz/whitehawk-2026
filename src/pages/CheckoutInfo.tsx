import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CheckoutInfo = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [postcode, setPostcode] = useState('');
  const [country, setCountry] = useState('');
  const [shipping, setShipping] = useState('standard');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const info = {
      fullName,
      address1,
      address2,
      city,
      postcode,
      country,
      shipping,
    };
    try {
      localStorage.setItem('checkoutInfo', JSON.stringify(info));
    } catch (err) {}
    navigate('/shop');
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <h1 className="font-heading text-3xl font-bold text-center mb-8">Shipping Details</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            type="text"
            required
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#8e160b] focus:ring-[#8e160b]"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="address1">Address Line 1</label>
          <input
            id="address1"
            type="text"
            required
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#8e160b] focus:ring-[#8e160b]"
            value={address1}
            onChange={e => setAddress1(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="address2">Address Line 2 (optional)</label>
          <input
            id="address2"
            type="text"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#8e160b] focus:ring-[#8e160b]"
            value={address2}
            onChange={e => setAddress2(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="city">City</label>
            <input
              id="city"
              type="text"
              required
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#8e160b] focus:ring-[#8e160b]"
              value={city}
              onChange={e => setCity(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="postcode">Postcode</label>
            <input
              id="postcode"
              type="text"
              required
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#8e160b] focus:ring-[#8e160b]"
              value={postcode}
              onChange={e => setPostcode(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="country">Country</label>
          <input
            id="country"
            type="text"
            required
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#8e160b] focus:ring-[#8e160b]"
            value={country}
            onChange={e => setCountry(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="shipping">Shipping Option</label>
          <select
            id="shipping"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#8e160b] focus:ring-[#8e160b]"
            value={shipping}
            onChange={e => setShipping(e.target.value)}
          >
            <option value="standard">Standard (Free)</option>
            <option value="express">Express (+£5.00)</option>
          </select>
        </div>
        <div className="flex justify-end mt-6">
          <Button type="submit" className="bg-[#8e160b] hover:bg-[#8e160b]/90 text-white font-heading uppercase">
            Save &amp; Continue Shopping
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutInfo;
