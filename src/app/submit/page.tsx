"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Camera, MapPin, Loader2, ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function SubmitLead() {
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState("");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [category, setCategory] = useState("");
  const [securityGap, setSecurityGap] = useState("");
  const [notes, setNotes] = useState("");
  
  const [locating, setLocating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [locError, setLocError] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
      setFormError(null);
    }
  };

  const getLocation = () => {
    setLocating(true);
    setLocError(null);
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          setLat(position.coords.latitude);
          setLng(position.coords.longitude);
          
          setAddress(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)} (GPS Acquired)`);
          setLocating(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocError("Please enable location services or type the address manually.");
          setLocating(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setLocError("Geolocation is not supported by your browser.");
      setLocating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!photo) {
      setFormError("Please capture a photo of the security gap.");
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // 1. Upload Photo
      const fileExt = photo.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('leads')
        .upload(fileName, photo);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('leads')
        .getPublicUrl(fileName);

      // 2. Insert Lead
      const { error: insertError } = await supabase
        .from('leads')
        .insert({
          scout_id: user.id,
          photo_url: publicUrl,
          business_name: businessName,
          address: address,
          lat: lat,
          lng: lng,
          property_category: category,
          security_gap: securityGap,
          notes: notes,
          status: 'Pending'
        });

      if (insertError) throw insertError;

      // Redirect back to dashboard
      router.push("/dashboard");

    } catch (error: unknown) {
      console.error("Submission error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to submit lead. Please try again.";
      setFormError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <header className="bg-zinc-900 border-b border-zinc-800 p-4 sticky top-0 z-10 flex items-center gap-4">
        <Link href="/dashboard" className="text-gray-400 hover:text-white">
          <ArrowLeft size={24} />
        </Link>
        <div className="font-bold text-xl">Submit New Lead</div>
      </header>

      <main className="p-4 max-w-lg mx-auto">
        {formError && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-900 rounded-lg flex items-start gap-3 text-red-400">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <p className="text-sm">{formError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Photo Capture */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Evidence Photo *</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`w-full h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer overflow-hidden relative transition-colors ${photoPreview ? 'border-cyan-500' : 'border-zinc-700 bg-zinc-900 hover:bg-zinc-800'}`}
            >
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <>
                  <Camera size={40} className="text-gray-500 mb-2" />
                  <span className="text-gray-400 font-medium text-sm">Tap to Open Camera</span>
                </>
              )}
            </div>
            <input 
              type="file" 
              accept="image/*" 
              capture="environment" 
              ref={fileInputRef}
              onChange={handlePhotoCapture}
              className="hidden"
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-400">Property Address *</label>
            <button 
              type="button" 
              onClick={getLocation}
              disabled={locating}
              className="w-full bg-cyan-950 border border-cyan-800 text-cyan-400 py-3 rounded-lg flex items-center justify-center gap-2 font-medium hover:bg-cyan-900 transition-colors disabled:opacity-50"
            >
              {locating ? <Loader2 className="animate-spin" size={18} /> : <MapPin size={18} />}
              {locating ? "Acquiring GPS..." : "📍 Use My Current Location"}
            </button>
            {locError && (
              <p className="text-red-400 text-xs mt-1">{locError}</p>
            )}
            <input 
              type="text" 
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Or enter manually (e.g. 123 Industrial Pkwy)"
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:border-cyan-500 text-white placeholder-gray-600"
            />
          </div>

          {/* Business Info */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Business Name *</label>
            <input 
              type="text" 
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Company name on the sign"
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:border-cyan-500 text-white placeholder-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Property Category *</label>
            <select 
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:border-cyan-500 text-white appearance-none"
            >
              <option value="" disabled>Select a category...</option>
              <option value="Auto Dealership">Auto Dealership</option>
              <option value="Logistics & Trucking">Logistics & Trucking</option>
              <option value="Construction Yard">Construction Yard</option>
              <option value="Storage">Storage</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Observed Security Gap *</label>
            <select 
              required
              value={securityGap}
              onChange={(e) => setSecurityGap(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:border-cyan-500 text-white appearance-none"
            >
              <option value="" disabled>Select what you saw...</option>
              <option value="Sleeping/Distracted Guard">Sleeping/Distracted Guard</option>
              <option value="Empty Guard Shack">Empty Guard Shack</option>
              <option value="Passive Cameras Only">Passive Cameras Only</option>
              <option value="Unsecured Gate">Unsecured Gate</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Extra Notes (Optional)</label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any other details? e.g. Gate was wide open at 2AM"
              rows={3}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:border-cyan-500 text-white placeholder-gray-600 resize-none"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-lg py-4 rounded-xl transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : null}
            {loading ? "Submitting..." : "Submit Lead"}
          </button>
        </form>
      </main>
    </div>
  );
}
