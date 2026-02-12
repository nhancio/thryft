import { useState, useEffect } from "react";
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

const LOCATION_KEY = "thryft_user_location";

export function getStoredLocation(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(LOCATION_KEY);
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
      (pos) => {
        const { latitude, longitude } = pos.coords;
        // Reverse geocode could be done with a service; for now store coords or use a simple display
        const location = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        saveLocation(location);
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
