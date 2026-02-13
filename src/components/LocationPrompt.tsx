import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Loader2, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const LOCATION_KEY = "thryft_user_location";

export function getStoredLocation(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(LOCATION_KEY);
}

async function saveDetailsToSupabase(location: string, phone: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const update: Record<string, string> = {};
  if (location) update.location = location;
  if (phone) update.phone = phone;
  if (Object.keys(update).length > 0) {
    await supabase.from("users").update(update).eq("id", user.id);
  }
}

export function LocationPrompt({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [manualLocation, setManualLocation] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [detectedLocation, setDetectedLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    const loc = detectedLocation || manualLocation;
    if (!loc.trim() && !phoneNumber.trim()) return;
    if (loc.trim()) localStorage.setItem(LOCATION_KEY, loc.trim());
    saveDetailsToSupabase(loc.trim(), phoneNumber.trim());
    onClose();
  };

  const handleUseDeviceLocation = () => {
    setLoading(true);
    setError(null);
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`
          );
          const data = await res.json();
          const addr = data.address;
          const city = addr?.city || addr?.town || addr?.village || addr?.county || "";
          const state = addr?.state || "";
          const country = addr?.country || "";
          const parts = [city, state, country].filter(Boolean);
          const location = parts.length > 0 ? parts.join(", ") : `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          setDetectedLocation(location);
        } catch {
          setDetectedLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        }
        setLoading(false);
      },
      () => {
        setError("Could not get location. Enter it manually.");
        setLoading(false);
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Complete your profile
          </DialogTitle>
          <DialogDescription>
            Help us show relevant listings near you.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Location */}
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={handleUseDeviceLocation}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <MapPin className="w-4 h-4" />
            )}
            {detectedLocation || "Use my current location"}
          </Button>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          {!detectedLocation && (
            <div>
              <span className="text-sm text-muted-foreground">Or enter location manually</span>
              <Input
                type="text"
                placeholder="e.g. Mumbai, India"
                value={manualLocation}
                onChange={(e) => setManualLocation(e.target.value)}
                className="mt-2"
              />
            </div>
          )}

          {/* Mobile number */}
          <div>
            <label className="text-sm font-medium flex items-center gap-1.5 mb-2">
              <Phone className="w-4 h-4" />
              Mobile number
            </label>
            <Input
              type="tel"
              placeholder="e.g. 9876543210"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              maxLength={10}
            />
          </div>

          <Button
            className="w-full"
            onClick={handleSave}
            disabled={!(detectedLocation || manualLocation.trim()) && !phoneNumber.trim()}
          >
            Save & continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
