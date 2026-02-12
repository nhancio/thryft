import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  X,
  ChevronRight,
  ChevronLeft,
  Upload,
  Sparkles,
  Check,
  AlertCircle,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, title: "Category", description: "Choose product type" },
  { id: 2, title: "Photos", description: "Add at least 3 photos" },
  { id: 3, title: "Details", description: "Describe your item" },
  { id: 4, title: "Pricing", description: "Set your price" },
  { id: 5, title: "Publish", description: "Review & list" },
];

const categories = ["iPhone", "MacBook", "Watch"];
const conditions = ["New with tags", "New", "Like new", "Gently used", "Worn"];
const sizes = ["XS", "S", "M", "L", "XL", "XXL", "One Size"];
const iphoneSizes = ["64GB", "128GB", "256GB", "512GB", "1TB"];
const macbookSizes = ["128GB", "256GB", "512GB", "1TB", "2TB"];
const watchSizes = ["38mm", "40mm", "41mm", "44mm", "45mm", "49mm"];
const eras = ["2020s", "2010s", "2000s", "90s", "80s", "70s", "Vintage"];

export default function Sell() {
  const [currentStep, setCurrentStep] = useState(1);
  const [photos, setPhotos] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    brand: "",
    size: "",
    condition: "",
    era: "",
    description: "",
    price: "",
    allowOffers: true,
    shippingIncluded: false,
    localPickup: false,
    // Category-specific (iPhone)
    storage: "",
    model: "",
    batteryHealth: "",
    // MacBook
    ram: "",
    chip: "",
    // Watch
    cellular: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    const newUrls: string[] = [];
    for (let i = 0; i < files.length && photos.length + newUrls.length < 6; i++) {
      newUrls.push(URL.createObjectURL(files[i]));
    }
    setPhotos((prev) => [...prev, ...newUrls].slice(0, 6));
    e.target.value = "";
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => {
      if (prev[index]?.startsWith("blob:")) URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!formData.category;
      case 2:
        return photos.length >= 3;
      case 3:
        return (
          formData.title &&
          formData.size &&
          formData.condition
        );
      case 4:
        return formData.price && Number(formData.price) > 0;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-6 max-w-2xl">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between relative">
            {/* Progress Line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-border">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: "0%" }}
                animate={{ width: `${((currentStep - 1) / 4) * 100}%` }}
              />
            </div>

            {steps.map((step) => (
              <div
                key={step.id}
                className="relative z-10 flex flex-col items-center"
              >
                <motion.div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors",
                    currentStep >= step.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                  animate={{
                    scale: currentStep === step.id ? 1.1 : 1,
                  }}
                >
                  {currentStep > step.id ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    step.id
                  )}
                </motion.div>
                <div className="mt-2 text-center hidden sm:block">
                  <div
                    className={cn(
                      "text-sm font-medium",
                      currentStep >= step.id
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Success state after publish */}
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 px-6 rounded-3xl border border-primary/20 bg-primary/5"
          >
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-display font-bold mb-2">Listing submitted</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Your product is sent for verification. Sit back and chill now — we’ll notify you once it’s live.
            </p>
            <Button
              variant="outline"
              className="mt-8"
              onClick={() => { setSubmitted(false); setCurrentStep(1); setPhotos([]); setFormData({ title: "", category: "", brand: "", size: "", condition: "", era: "", description: "", price: "", allowOffers: true, shippingIncluded: false, localPickup: false, storage: "", model: "", batteryHealth: "", ram: "", chip: "", cellular: "" }); }}
            >
              List another item
            </Button>
          </motion.div>
        ) : (
        <>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Step 1: Category */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-display font-bold mb-2">
                    What are you selling?
                  </h2>
                  <p className="text-muted-foreground">
                    Choose the category that best fits your item.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setFormData({ ...formData, category: cat });
                        nextStep();
                      }}
                      className={cn(
                        "h-32 rounded-2xl border-2 flex flex-col items-center justify-center gap-3 transition-all hover:scale-[1.02]",
                        formData.category === cat
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50 bg-card"
                      )}
                    >
                      <span className="text-lg font-semibold">{cat}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Photos */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-display font-bold mb-2">
                    Add your photos
                  </h2>
                  <p className="text-muted-foreground">
                    Add at least 3 photos. The first photo will be your cover.
                  </p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
                <div className="grid grid-cols-3 gap-3">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "aspect-square rounded-xl border-2 border-dashed transition-colors overflow-hidden",
                        photos[i]
                          ? "border-transparent"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      {photos[i] ? (
                        <div className="relative w-full h-full group">
                          <img
                            src={photos[i]}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(i)}
                            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-foreground/80 text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          {i === 0 && (
                            <Badge className="absolute bottom-2 left-2">
                              Cover
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full h-full flex flex-col items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {i === 0 ? (
                            <Camera className="w-8 h-8 mb-2" />
                          ) : (
                            <Upload className="w-6 h-6 mb-1" />
                          )}
                          <span className="text-xs">
                            {i === 0 ? "Add cover" : "Add photo"}
                          </span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Tips */}
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium mb-1">Photo tips</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Use natural lighting for best results</li>
                        <li>• Show front, back, and any details/flaws</li>
                        <li>• Include a photo of the label/tag</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Details */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-display font-bold mb-2">
                    Describe your item
                  </h2>
                  <p className="text-muted-foreground">
                    Add details to help buyers find your item.
                  </p>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Brand + Item + Key detail (e.g., MacBook Pro M1 2020)"
                    className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.title.length}/80 characters
                  </p>
                </div>

                {/* Brand */}
                <div>
                  <label className="block text-sm font-medium mb-2">Brand</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) =>
                      setFormData({ ...formData, brand: e.target.value })
                    }
                    placeholder="e.g., Apple, Dell, Unknown"
                    className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                {/* Size - dynamic by category */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {formData.category === "iPhone" ? "Storage" : formData.category === "MacBook" ? "Storage" : formData.category === "Watch" ? "Case size" : "Size"} *
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(formData.category === "iPhone"
                      ? iphoneSizes
                      : formData.category === "MacBook"
                        ? macbookSizes
                        : formData.category === "Watch"
                          ? watchSizes
                          : sizes
                    ).map((size) => (
                      <Button
                        key={size}
                        variant={formData.size === size ? "default" : "tag"}
                        size="sm"
                        onClick={() => setFormData({ ...formData, size })}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* iPhone-specific */}
                {formData.category === "iPhone" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">Model (e.g. 14 Pro, 15)</label>
                      <input
                        type="text"
                        value={formData.model}
                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                        placeholder="e.g. iPhone 14 Pro"
                        className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Battery health (%)</label>
                      <input
                        type="text"
                        value={formData.batteryHealth}
                        onChange={(e) => setFormData({ ...formData, batteryHealth: e.target.value })}
                        placeholder="e.g. 87"
                        className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </>
                )}

                {/* MacBook-specific */}
                {formData.category === "MacBook" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">RAM</label>
                      <input
                        type="text"
                        value={formData.ram}
                        onChange={(e) => setFormData({ ...formData, ram: e.target.value })}
                        placeholder="e.g. 8GB, 16GB"
                        className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Chip</label>
                      <input
                        type="text"
                        value={formData.chip}
                        onChange={(e) => setFormData({ ...formData, chip: e.target.value })}
                        placeholder="e.g. M1, M2, M4"
                        className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </>
                )}

                {/* Watch-specific */}
                {formData.category === "Watch" && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Cellular?</label>
                    <div className="flex gap-2">
                      <Button
                        variant={formData.cellular === "Yes" ? "default" : "tag"}
                        size="sm"
                        onClick={() => setFormData({ ...formData, cellular: "Yes" })}
                      >
                        Yes
                      </Button>
                      <Button
                        variant={formData.cellular === "No" ? "default" : "tag"}
                        size="sm"
                        onClick={() => setFormData({ ...formData, cellular: "No" })}
                      >
                        No
                      </Button>
                    </div>
                  </div>
                )}

                {/* Condition */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Condition *
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {conditions.map((cond) => (
                      <Button
                        key={cond}
                        variant={formData.condition === cond ? "default" : "tag"}
                        size="sm"
                        onClick={() =>
                          setFormData({ ...formData, condition: cond })
                        }
                      >
                        {cond}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Era */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Era (optional)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {eras.map((era) => (
                      <Button
                        key={era}
                        variant={formData.era === era ? "default" : "tag"}
                        size="sm"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            era: formData.era === era ? "" : era,
                          })
                        }
                      >
                        {era}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Tell buyers what makes this piece special. Include any flaws or unique details."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.description.length}/800 characters
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Pricing */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-display font-bold mb-2">
                    Set your price
                  </h2>
                  <p className="text-muted-foreground">
                    Price it right to sell faster.
                  </p>
                </div>

                {/* Price Input */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Price *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      placeholder="0"
                      className="w-full h-14 pl-8 pr-4 text-2xl font-bold rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>

                {/* Suggested Price */}
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Suggested price</p>
                      <p className="text-sm text-muted-foreground">
                        Based on similar items
                      </p>
                    </div>
                    <p className="text-xl font-bold">₹1,299 - ₹1,899</p>
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-4 rounded-xl bg-muted/30 cursor-pointer">
                    <div>
                      <p className="font-medium">Allow offers</p>
                      <p className="text-sm text-muted-foreground">
                        Let buyers negotiate
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.allowOffers}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          allowOffers: e.target.checked,
                        })
                      }
                      className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 rounded-xl bg-muted/30 cursor-pointer">
                    <div>
                      <p className="font-medium">Free shipping</p>
                      <p className="text-sm text-muted-foreground">
                        Include shipping in price
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.shippingIncluded}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          shippingIncluded: e.target.checked,
                        })
                      }
                      className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 rounded-xl bg-muted/30 cursor-pointer">
                    <div>
                      <p className="font-medium">Local pickup</p>
                      <p className="text-sm text-muted-foreground">
                        Allow buyers to pick up
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.localPickup}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          localPickup: e.target.checked,
                        })
                      }
                      className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                    />
                  </label>
                </div>

                {/* Fee breakdown */}
                <div className="p-4 rounded-xl border border-border">
                  <h4 className="font-medium mb-3">Your earnings</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Listing price
                      </span>
                      <span>₹{formData.price || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Platform fee (7%)
                      </span>
                      <span>-₹{Math.round(Number(formData.price) * 0.07)}</span>
                    </div>
                    <div className="border-t border-border pt-2 flex justify-between font-semibold">
                      <span>You'll earn</span>
                      <span className="text-primary">
                        ₹{Math.round(Number(formData.price) * 0.93)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Review & Publish */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-display font-bold mb-2">
                    Review your listing
                  </h2>
                  <p className="text-muted-foreground">
                    Almost there! Review and publish your item.
                  </p>
                </div>

                {/* Preview Card */}
                <div className="rounded-2xl border border-border overflow-hidden">
                  {photos[0] && (
                    <div className="aspect-video relative">
                      <img
                        src={photos[0]}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg">
                      {formData.title || "Your item title"}
                    </h3>
                    <p className="text-2xl font-bold mt-2">
                      ₹{formData.price || 0}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.category && (
                        <Badge variant="secondary">{formData.category}</Badge>
                      )}
                      {formData.size && (
                        <Badge variant="secondary">{formData.size}</Badge>
                      )}
                      {formData.condition && (
                        <Badge variant="secondary">{formData.condition}</Badge>
                      )}
                      {formData.era && (
                        <Badge variant="secondary">{formData.era}</Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Checklist */}
                <div className="space-y-2">
                  {[
                    { done: photos.length >= 3, text: "At least 3 photos" },
                    { done: !!formData.title, text: "Title added" },
                    { done: !!formData.category, text: "Category selected" },
                    { done: !!formData.price, text: "Price set" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 text-sm"
                    >
                      {item.done ? (
                        <Check className="w-4 h-4 text-primary" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-destructive" />
                      )}
                      <span
                        className={
                          item.done ? "text-foreground" : "text-muted-foreground"
                        }
                      >
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Terms */}
                <label className="flex items-start gap-3 p-4 rounded-xl bg-muted/30">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-border text-primary focus:ring-primary mt-0.5"
                  />
                  <span className="text-sm text-muted-foreground">
                    I confirm this item is authentic and accurately described.
                    I agree to the{" "}
                    <a href="#" className="text-primary underline">
                      Seller Terms
                    </a>
                    .
                  </span>
                </label>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation - hidden when submitted */}
        <div className="flex justify-between mt-8 pt-6 border-t border-border">
          <Button
            variant="ghost"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {currentStep < 5 ? (
            <Button
              variant="hero"
              onClick={currentStep === 4 ? nextStep : nextStep}
              disabled={!canProceed()}
            >
              {currentStep === 4 ? "Review" : "Continue"}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              variant="hero"
              disabled={!canProceed()}
              onClick={() => setSubmitted(true)}
            >
              Publish Listing
              <Sparkles className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
        </>
        )}
      </main>

      <Footer />
    </div>
  );
}
