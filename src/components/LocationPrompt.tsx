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
import { MapPin, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const LOCATION_KEY = "thryft_user_location";

export function getStoredLocation(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(LOCATION_KEY);
}

async function saveLocationToSupabase(location: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase
    .from("users")
    .update({ location })
    .eq("id", user.id);
}

export function LocationPrompt({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [manualLocation, setManualLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveLocation = (location: string) => {
    if (!location.trim()) return;
    localStorage.setItem(LOCATION_KEY, location.trim());
    saveLocationToSupabase(location.trim());
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
        // Try reverse geocoding with a free API
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
          saveLocation(location);
        } catch {
          // Fallback to coords
          saveLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
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
            Set your location
          </DialogTitle>
          <DialogDescription>
            We use this to show relevant listings and delivery options. You can change it later in profile.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
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
            Use my current location
          </Button>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <div className="relative">
            <span className="text-sm text-muted-foreground">Or enter manually</span>
            <Input
              type="text"
              placeholder="e.g. Mumbai, India"
              value={manualLocation}
              onChange={(e) => setManualLocation(e.target.value)}
              className="mt-2"
            />
            <Button
              className="mt-3 w-full"
              onClick={() => saveLocation(manualLocation)}
              disabled={!manualLocation.trim()}
            >
              Save location
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
