"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  Camera, 
  MapPin, 
  Loader2, 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Building2, 
  Radio, 
  Users 
} from "lucide-react";
import Link from "next/link";
import { BRAND_CONFIG } from "@/config/brandConfig";
import ShareEngine from "@/components/ShareEngine";

export default function SubmitLead() {
  const [submissionType, setSubmissionType] = useState<"Future RAD Site" | "RAD in the Wild">("Future RAD Site");
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState("");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [category, setCategory] = useState("");
  const [securityGap, setSecurityGap] = useState("");
  const [radUnitSpotted, setRadUnitSpotted] = useState("ROSA");
  const [notes, setNotes] = useState("");
  
  // Optional contact fields (2x bonus points)
  const [contactName, setContactName] = useState("");
  const [contactInfo, setContactInfo] = useState("");

  const [locating, setLocating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [locError, setLocError] = useState<string | null>(null);
  
  // Post-submission success state
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(100);

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
      setFormError("Please capture an evidence photo.");
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("You must be signed in to submit a location. Please log in.");
      }

      // 1. DEFENSIVE UPSERT: Ensure scout profile exists before lead creation to prevent foreign-key / RLS violations
      const fallbackName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Scout";
      const { error: scoutUpsertError } = await supabase
        .from("scouts")
        .upsert(
          {
            id: user.id,
            email: user.email!,
            full_name: fallbackName,
          },
          { onConflict: "id" }
        );

      if (scoutUpsertError) {
        console.warn("Defensive scout upsert notice:", scoutUpsertError.message);
      }

      // 2. Upload Photo to "leads" bucket
      const fileExt = photo.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("leads")
        .upload(fileName, photo, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        console.error("Storage upload error:", uploadError);
        throw new Error(`Photo upload failed: ${uploadError.message}`);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("leads")
        .getPublicUrl(fileName);

      // Determine security gap or wild spotting description
      const finalSecurityGap = submissionType === "Future RAD Site"
        ? securityGap
        : `RAD in the Wild: Spotted ${radUnitSpotted}`;

      // 3. Insert Lead into Database
      const { error: insertError } = await supabase
        .from("leads")
        .insert({
          scout_id: user.id,
          photo_url: publicUrl,
          business_name: businessName,
          address: address,
          lat: lat,
          lng: lng,
          property_category: category,
          security_gap: finalSecurityGap,
          notes: notes,
          submission_type: submissionType,
          contact_name: contactName.trim() || null,
          contact_info: contactInfo.trim() || null,
          status: "Pending",
        });

      if (insertError) {
        console.error("Lead insert error:", insertError);
        throw new Error(`Failed to save lead: ${insertError.message}`);
      }

      // 4. Calculate & Award Points (100 base, 200 with actionable contact)
      const hasContact = Boolean(contactName.trim() || contactInfo.trim());
      const earned = hasContact ? 200 : 100;
      setPointsEarned(earned);

      // Fetch current points
      const { data: scoutRecord } = await supabase
        .from("scouts")
        .select("total_points, rank_level")
        .eq("id", user.id)
        .single();

      const newTotal = (scoutRecord?.total_points || 0) + earned;
      let newRankLevel = scoutRecord?.rank_level || 0;
      if (newTotal >= 1500) newRankLevel = 3;
      else if (newTotal >= 500) newRankLevel = 2;
      else if (newTotal >= 100) newRankLevel = 1;

      await supabase
        .from("scouts")
        .update({
          total_points: newTotal,
          rank_level: newRankLevel,
        })
        .eq("id", user.id);

      // 5. Trigger CRM / Zapier Webhook Pipeline
      fetch("/api/webhooks/sync-crm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          event_type: "lead_submitted",
          tag: "Field_Scout_Lead",
          metadata: {
            submission_type: submissionType,
            business_name: businessName,
            address: address,
            category: category,
            security_gap: finalSecurityGap,
            has_contact: hasContact,
            contact_name: contactName.trim() || null,
            points_awarded: earned,
          },
        }),
      }).catch((err) => console.warn("CRM sync webhook deferred:", err));

      // 6. Transition to Victory / Share Screen
      setSubmittedSuccess(true);
      setLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });

    } catch (error: unknown) {
      console.error("Submission pipeline error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to submit lead. Please try again.";
      setFormError(errorMessage);
      setLoading(false);
    }
  };

  // POST-SUBMISSION SUCCESS SCREEN
  if (submittedSuccess) {
    return (
      <div className="min-h-screen bg-black text-white pb-24">
        <header className="bg-zinc-900 border-b border-zinc-800 p-4 sticky top-0 z-10 flex items-center justify-between">
          <div className="font-bold text-lg text-cyan-400 flex items-center gap-2">
            <CheckCircle2 className="text-emerald-400" size={20} />
            <span>Submission Verified!</span>
          </div>
          <Link
            href="/dashboard"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
          >
            Go to Dashboard →
          </Link>
        </header>

        <main className="p-4 max-w-lg mx-auto space-y-6 mt-4">
          {/* Victory Card */}
          <div className="bg-gradient-to-b from-cyan-950/60 to-black border border-cyan-500/40 rounded-2xl p-6 text-center relative overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.2)]">
            <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <Sparkles size={32} />
            </div>

            <h2 className="text-2xl font-black text-white mb-1">
              +{pointsEarned} Points Unlocked!
            </h2>
            <p className="text-sm text-cyan-300 font-medium mb-3">
              {submissionType === "Future RAD Site" 
                ? "Commercial site securely logged in AITX sales pipeline."
                : "RAD in the Wild spotting logged for the community map!"}
            </p>
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm mx-auto">
              Your report has been routed to the enterprise sales team. Share your scout action with fellow shareholders to keep the momentum going!
            </p>
          </div>

          {/* Social Sharing & Referrals Engine */}
          <ShareEngine compact={false} />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => {
                setSubmittedSuccess(false);
                setPhoto(null);
                setPhotoPreview(null);
                setBusinessName("");
                setAddress("");
                setNotes("");
                setContactName("");
                setContactInfo("");
              }}
              className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3.5 px-4 rounded-xl text-center text-sm transition-colors border border-zinc-700"
            >
              + Submit Another Location
            </button>
            <Link
              href="/dashboard"
              className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold py-3.5 px-4 rounded-xl text-center text-sm transition-transform hover:scale-[1.02]"
            >
              View My Dashboard
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-cyan-950 via-zinc-900 to-black border-b border-cyan-800/40 px-4 py-2 text-center text-[11px] text-cyan-300/90 font-medium">
        {BRAND_CONFIG.subHeaderBanner}
      </div>

      {/* Main Header */}
      <header className="bg-zinc-900/90 backdrop-blur-md border-b border-zinc-800 p-4 sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={22} />
          </Link>
          <div className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={BRAND_CONFIG.logos.aitxWhite}
              alt="AITX"
              className="h-5 sm:h-6 w-auto object-contain"
            />
            <span className="text-zinc-700">|</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={BRAND_CONFIG.logos.radIcon}
              alt="RAD"
              className="h-5 w-auto object-contain"
            />
          </div>
        </div>
        <Link href="/dashboard" className="text-xs text-gray-400 hover:text-cyan-400">
          Cancel
        </Link>
      </header>

      <main className="p-4 max-w-lg mx-auto">
        {/* Toggle between "Future RAD Site" and "RAD in the Wild" */}
        <div className="mb-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
            Select Submission Type
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-900 border border-zinc-800 rounded-xl">
            <button
              type="button"
              onClick={() => setSubmissionType("Future RAD Site")}
              className={`py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                submissionType === "Future RAD Site"
                  ? "bg-cyan-500 text-black shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Building2 size={16} />
              <span>Future RAD Site</span>
            </button>
            <button
              type="button"
              onClick={() => setSubmissionType("RAD in the Wild")}
              className={`py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                submissionType === "RAD in the Wild"
                  ? "bg-cyan-500 text-black shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Radio size={16} />
              <span>RAD in the Wild</span>
            </button>
          </div>
          <p className="text-[11px] text-gray-400 mt-2 px-1">
            {submissionType === "Future RAD Site"
              ? "Spot a commercial property with unsecured perimeters or empty guard booths that needs autonomous edge-AI."
              : "Spotted an active ROSA, RIO, or ROAMEO deployed in public? Snap it and share the location!"}
          </p>
        </div>

        {formError && (
          <div className="mb-6 p-4 bg-red-950/50 border border-red-500/50 rounded-xl flex items-start gap-3 text-red-300">
            <AlertCircle size={20} className="shrink-0 mt-0.5 text-red-400" />
            <p className="text-sm">{formError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Photo Capture */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              {submissionType === "Future RAD Site" ? "Evidence Photo *" : "Spotting Photo *"}
            </label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`w-full h-44 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer overflow-hidden relative transition-colors ${photoPreview ? 'border-cyan-500 bg-black' : 'border-zinc-700 bg-zinc-900/60 hover:bg-zinc-800'}`}
            >
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <>
                  <Camera size={36} className="text-gray-500 mb-2" />
                  <span className="text-gray-300 font-bold text-sm">Tap to Open Camera</span>
                  <span className="text-[11px] text-gray-400 mt-1">
                    {submissionType === "Future RAD Site"
                      ? "Capture perimeter, gate, or commercial signage"
                      : "Snap photo of ROSA, RIO, or ROAMEO"}
                  </span>
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
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
              Property Location / Address *
            </label>
            <button 
              type="button" 
              onClick={getLocation}
              disabled={locating}
              className="w-full bg-cyan-950/70 border border-cyan-800/80 text-cyan-300 py-3 rounded-xl flex items-center justify-center gap-2 font-bold text-sm hover:bg-cyan-900 transition-colors disabled:opacity-50"
            >
              {locating ? <Loader2 className="animate-spin" size={16} /> : <MapPin size={16} />}
              {locating ? "Acquiring GPS Position..." : "📍 Use My Current Location"}
            </button>
            {locError && (
              <p className="text-red-400 text-xs mt-1">{locError}</p>
            )}
            <input 
              type="text" 
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Or enter manually (e.g. 123 Logistics Pkwy, Dallas, TX)"
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:border-cyan-500 text-white placeholder-gray-500 text-sm"
            />
          </div>

          {/* Business / Facility Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              {submissionType === "Future RAD Site" ? "Business or Facility Name *" : "Deployment Venue Name *"}
            </label>
            <input 
              type="text" 
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder={submissionType === "Future RAD Site" ? "e.g. Metro Freight Yard or Premier Auto Group" : "e.g. Atlantic City Boardwalk or Metro Health"}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:border-cyan-500 text-white placeholder-gray-500 text-sm"
            />
          </div>

          {/* Type-Specific Fields */}
          {submissionType === "Future RAD Site" ? (
            <>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Property Category *
                </label>
                <select 
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:border-cyan-500 text-white appearance-none text-sm"
                >
                  <option value="" disabled>Select a property category...</option>
                  <option value="Auto Dealership">Auto Dealership</option>
                  <option value="Logistics Hub & Trucking Yard">Logistics Hub & Trucking Yard</option>
                  <option value="Construction & Equipment Yard">Construction & Equipment Yard</option>
                  <option value="Self Storage Facility">Self Storage Facility</option>
                  <option value="Commercial Shopping Center / Retail">Commercial Shopping Center / Retail</option>
                  <option value="Hospital / Healthcare Campus">Hospital / Healthcare Campus</option>
                  <option value="Other Commercial Facility">Other Commercial Facility</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Observed Security Need / Gap *
                </label>
                <select 
                  required
                  value={securityGap}
                  onChange={(e) => setSecurityGap(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:border-cyan-500 text-white appearance-none text-sm"
                >
                  <option value="" disabled>Select the security condition observed...</option>
                  <option value="Unsecured Perimeter">Unsecured Perimeter</option>
                  <option value="Empty Guard Booth">Empty Guard Booth</option>
                  <option value="Passive Cameras Only (No Active Deterrence)">Passive Cameras Only (No Active Deterrence)</option>
                  <option value="High-Visibility Commercial Location">High-Visibility Commercial Location</option>
                  <option value="Unmonitored Access Gate">Unmonitored Access Gate</option>
                </select>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  RAD Unit Spotted *
                </label>
                <select 
                  required
                  value={radUnitSpotted}
                  onChange={(e) => setRadUnitSpotted(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:border-cyan-500 text-white appearance-none text-sm"
                >
                  <option value="ROSA">ROSA (Autonomous Edge-AI Deterrence)</option>
                  <option value="RIO 360">RIO 360 (Solar-Powered Mobile Tower)</option>
                  <option value="ROAMEO">ROAMEO (Mobile Patrol Autonomous Vehicle)</option>
                  <option value="RAD Light My Way">RAD Light My Way Station</option>
                  <option value="Multiple Units / Unsure">Multiple Units / Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Venue / Location Type *
                </label>
                <select 
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:border-cyan-500 text-white appearance-none text-sm"
                >
                  <option value="" disabled>Select venue setting...</option>
                  <option value="Casino / Entertainment Complex">Casino / Entertainment Complex</option>
                  <option value="Hospital / Healthcare Campus">Hospital / Healthcare Campus</option>
                  <option value="Logistics & Distribution Center">Logistics & Distribution Center</option>
                  <option value="Auto Dealership">Auto Dealership</option>
                  <option value="Public Transit / Municipal Facility">Public Transit / Municipal Facility</option>
                  <option value="Other Public Spotting">Other Public Spotting</option>
                </select>
              </div>
            </>
          )}

          {/* Optional Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Field Notes (Optional)
            </label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. High traffic area near main entrance; perimeter fence has several dark zones."
              rows={2}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:border-cyan-500 text-white placeholder-gray-500 text-sm resize-none"
            />
          </div>

          {/* BONUS SECTION: Actionable Contact Info (2x Points) */}
          <div className="bg-gradient-to-b from-cyan-950/40 via-zinc-900/60 to-black border border-cyan-500/40 rounded-2xl p-4 sm:p-5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-cyan-400" />
                <h4 className="font-extrabold text-sm text-white">
                  Do you know someone here?
                </h4>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                EARN 2X POINTS (+200 PTS)
              </span>
            </div>
            <p className="text-xs text-gray-400 mb-4">
              Optional: If you have a direct contact (facility manager, owner, security director), add their details below to double your points.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-300 mb-1">
                  Contact Name & Relationship
                </label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Mark Johnson (My uncle / Logistics Director)"
                  className="w-full px-3.5 py-2.5 bg-black border border-zinc-700 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-300 mb-1">
                  Contact Email or Phone Number
                </label>
                <input
                  type="text"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  placeholder="e.g. mark@company.com or (555) 234-5678"
                  className="w-full px-3.5 py-2.5 bg-black border border-zinc-700 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-base sm:text-lg py-4 rounded-xl transition-transform hover:scale-[1.01] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)]"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <ShieldCheck size={20} />}
            {loading ? "Transmitting to AITX Sales..." : "Submit Lead & Claim Points"}
          </button>
        </form>
      </main>
    </div>
  );
}
