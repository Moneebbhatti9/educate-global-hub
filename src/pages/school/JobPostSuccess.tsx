import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import DashboardLayout from "@/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CheckCircle,
  Users,
  Eye,
  Share2,
  MessageCircle,
  ArrowRight,
  Calendar,
  Globe,
  Briefcase,
  Building2,
  MapPin,
  GraduationCap,
  Clock,
  Plus,
  Megaphone,
  Upload,
  X,
  ImageIcon,
  Sparkles,
  Star,
  Loader2,
} from "lucide-react";
import { adApi } from "@/apis/ads";
import type { AdTier } from "@/apis/ads";
import { customToast } from "@/components/ui/sonner";

const JobPostSuccess = () => {
  const location = useLocation();
  const { jobId, jobTitle, jobOrganization } = location.state || {};

  // This would normally come from the submitted job data
  const jobData = {
    title: jobTitle || "Mathematics Teacher - Secondary",
    organization: jobOrganization || "Dubai International School",
    location: "Dubai, UAE",
    educationLevel: "Secondary (Grades 9-12)",
    subjects: ["Mathematics", "Statistics"],
    postedDate: new Date().toLocaleDateString(),
    expiryDate: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ).toLocaleDateString(),
  };

  // Ad tier state
  const [adTiers, setAdTiers] = useState<AdTier[]>([]);
  const [tiersLoading, setTiersLoading] = useState(true);

  // Ad request modal state
  const [selectedTier, setSelectedTier] = useState<AdTier | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [headline, setHeadline] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch ad tiers on mount
  useEffect(() => {
    const fetchTiers = async () => {
      try {
        const tiers = await adApi.getAdTiers();
        setAdTiers(tiers);
      } catch (error) {
        console.error("Failed to fetch ad tiers:", error);
      } finally {
        setTiersLoading(false);
      }
    };
    fetchTiers();
  }, []);

  const handleTierSelect = (tier: AdTier) => {
    if (!jobId) {
      customToast.warning(
        "Job data unavailable",
        "Please post a job first to promote it"
      );
      return;
    }
    setSelectedTier(tier);
    setModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      customToast.error("File too large", "Maximum file size is 2MB");
      return;
    }

    // Validate file type
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      customToast.error(
        "Invalid file type",
        "Please upload a JPEG, PNG, or WebP image"
      );
      return;
    }

    setBannerFile(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setBannerPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveBanner = () => {
    setBannerFile(null);
    setBannerPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmitAdRequest = async () => {
    if (!selectedTier || !bannerFile || !jobId) return;

    setSubmitting(true);
    try {
      await adApi.createAdRequest({
        jobId,
        tierId: selectedTier._id,
        banner: bannerFile,
        headline: headline || undefined,
        description: description || undefined,
      });

      customToast.success(
        "Ad request submitted!",
        "Our team will review your ad and notify you when it's approved."
      );

      // Reset modal state
      setModalOpen(false);
      setSelectedTier(null);
      setBannerFile(null);
      setBannerPreview(null);
      setHeadline("");
      setDescription("");
    } catch (error) {
      console.error("Failed to submit ad request:", error);
      customToast.error(
        "Submission failed",
        "Please try again or contact support"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleModalClose = (open: boolean) => {
    if (!open) {
      setModalOpen(false);
      setSelectedTier(null);
      setBannerFile(null);
      setBannerPreview(null);
      setHeadline("");
      setDescription("");
    }
  };

  const formatPrice = (pence: number) => {
    return `£${(pence / 100).toFixed(0)}`;
  };

  const nextSteps = [
    {
      icon: Users,
      title: "Monitor Applications",
      description: "Track candidates as they apply to your position",
      action: "View Candidates",
      href: "/dashboard/school/candidates",
      color: "text-brand-primary",
    },
    {
      icon: Share2,
      title: "Share Your Job",
      description: "Spread the word through your networks and social media",
      action: "Share Job",
      href: "#",
      color: "text-brand-accent-green",
    },
    {
      icon: MessageCircle,
      title: "Engage with Community",
      description: "Connect with educators in our forum",
      action: "Visit Forum",
      href: "/forum",
      color: "text-brand-secondary",
    },
    {
      icon: Briefcase,
      title: "Manage Postings",
      description: "View and edit all your job postings",
      action: "Manage Jobs",
      href: "/dashboard/school/postings",
      color: "text-brand-accent-orange",
    },
  ];

  const tips = [
    {
      title: "Respond Quickly",
      description:
        "Top candidates often receive multiple offers. Quick responses improve your chances.",
    },
    {
      title: "Complete School Profile",
      description:
        "A detailed school profile attracts 3x more quality applications.",
    },
    {
      title: "Use Screening Questions",
      description:
        "Pre-screening helps you identify the most suitable candidates efficiently.",
    },
    {
      title: "Promote Your Culture",
      description:
        "Highlight your school's unique culture and values to attract aligned candidates.",
    },
  ];

  return (
    <DashboardLayout role="school">
      <div className="space-y-8">
        {/* Success Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-brand-accent-green/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-brand-accent-green" />
            </div>
          </div>
          <div>
            <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
              Job Posted Successfully!
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your job posting is now live and visible to qualified educators
              worldwide.
            </p>
          </div>
        </div>

        {/* Job Summary Card */}
        <Card className="border-brand-accent-green/20 bg-brand-accent-green/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-heading text-xl flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-brand-accent-green" />
                  <span>Your Job is Now Live</span>
                </CardTitle>
                <CardDescription>
                  Here's a summary of your published job posting
                </CardDescription>
              </div>
              <Badge className="bg-brand-accent-green text-white">
                Published
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">{jobData.title}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <span>{jobData.organization}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{jobData.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="w-4 h-4 text-muted-foreground" />
                    <span>{jobData.educationLevel}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {jobData.subjects.map((subject, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-white rounded-lg border">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Posted</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {jobData.postedDate}
                    </div>
                  </div>
                  <div className="p-3 bg-white rounded-lg border">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Expires</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {jobData.expiryDate}
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Job Posting
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Promote Your Job - Ad Upsell Section */}
        {!tiersLoading && adTiers.length > 0 && (
          <div>
            <div className="text-center mb-6">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Megaphone className="w-6 h-6 text-brand-primary" />
                <h2 className="font-heading font-bold text-2xl text-foreground">
                  Promote Your Job
                </h2>
              </div>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Boost your job's visibility with premium advertising. Reach more
                qualified candidates and fill your position faster.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {adTiers.map((tier) => {
                const isPopular = tier.highlight !== null;
                return (
                  <Card
                    key={tier._id}
                    className={`relative group hover:shadow-card-hover transition-all duration-300 ${
                      isPopular
                        ? "border-brand-primary ring-2 ring-brand-primary/20"
                        : ""
                    }`}
                  >
                    {isPopular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="bg-brand-primary text-white px-3 py-1">
                          <Star className="w-3 h-3 mr-1" />
                          {tier.highlight}
                        </Badge>
                      </div>
                    )}
                    <CardHeader className={isPopular ? "pt-6" : ""}>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="font-heading text-lg">
                            {tier.name}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {tier.description}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          {tier.hasActiveLaunchPricing && (
                            <div className="text-xs text-muted-foreground line-through">
                              {formatPrice(tier.normalPrice)}
                            </div>
                          )}
                          <div className="text-2xl font-bold text-brand-primary">
                            {formatPrice(tier.effectivePrice)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {tier.durationLabel}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {tier.hasActiveLaunchPricing && (
                        <Badge
                          variant="secondary"
                          className="bg-brand-accent-green/10 text-brand-accent-green"
                        >
                          <Sparkles className="w-3 h-3 mr-1" />
                          Launch Offer - 60% Off
                        </Badge>
                      )}

                      <ul className="space-y-2">
                        {tier.features.map((feature, idx) => (
                          <li
                            key={idx}
                            className="flex items-start space-x-2 text-sm"
                          >
                            <CheckCircle className="w-4 h-4 text-brand-accent-green flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        variant={isPopular ? "hero" : "outline"}
                        className="w-full"
                        onClick={() => handleTierSelect(tier)}
                      >
                        <Megaphone className="w-4 h-4 mr-2" />
                        Select {tier.name}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div>
          <h2 className="font-heading font-bold text-2xl text-foreground mb-6">
            What's Next?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {nextSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Card
                  key={index}
                  className="group hover:shadow-card-hover transition-all duration-300"
                >
                  <CardHeader>
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-lg bg-muted/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className={`w-6 h-6 ${step.color}`} />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{step.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {step.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Link to={step.href}>
                      <Button
                        variant="outline"
                        className="w-full group-hover:bg-muted/50 transition-colors"
                      >
                        {step.action}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Tips for Success */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-xl">
              Tips for Recruiting Success
            </CardTitle>
            <CardDescription>
              Maximize your chances of finding the perfect candidate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tips.map((tip, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-brand-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-brand-primary"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{tip.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {tip.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/dashboard/school/postings">
            <Button variant="outline" className="w-full sm:w-auto">
              <Briefcase className="w-4 h-4 mr-2" />
              View All Job Postings
            </Button>
          </Link>
          <Link to="/dashboard/school/post-job">
            <Button variant="hero" className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Post Another Job
            </Button>
          </Link>
        </div>
      </div>

      {/* Ad Request Modal */}
      <Dialog open={modalOpen} onOpenChange={handleModalClose}>
        <DialogContent className="sm:max-w-[650px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl flex items-center space-x-2">
              <Megaphone className="w-5 h-5 text-brand-primary" />
              <span>Create Ad Request</span>
            </DialogTitle>
            <DialogDescription>
              {selectedTier && (
                <>
                  Submit your banner ad for{" "}
                  <span className="font-semibold">{selectedTier.name}</span> (
                  {formatPrice(selectedTier.effectivePrice)}/
                  {selectedTier.durationLabel}). Our team will review it and
                  notify you when approved.
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Banner Upload */}
            <div className="space-y-2">
              <Label htmlFor="banner" className="text-sm font-medium">
                Banner Image <span className="text-destructive">*</span>
              </Label>
              <p className="text-xs text-muted-foreground">
                Recommended: 1200x400px. Max 2MB. JPEG, PNG, or WebP.
              </p>

              {bannerPreview ? (
                <div className="relative">
                  <img
                    src={bannerPreview}
                    alt="Banner preview"
                    className="w-full h-auto rounded-lg border object-cover"
                    style={{ aspectRatio: "3/1" }}
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={handleRemoveBanner}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-brand-primary/50 hover:bg-muted/20 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ aspectRatio: "3/1" }}
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <ImageIcon className="w-10 h-10 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium text-muted-foreground">
                      Click to upload banner image
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      1200x400px recommended
                    </p>
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                id="banner"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Headline */}
            <div className="space-y-2">
              <Label htmlFor="headline" className="text-sm font-medium">
                Headline{" "}
                <span className="text-muted-foreground font-normal">
                  (optional, max 80 characters)
                </span>
              </Label>
              <Input
                id="headline"
                placeholder="e.g., Join Our Award-Winning Team!"
                value={headline}
                onChange={(e) => setHeadline(e.target.value.slice(0, 80))}
                maxLength={80}
              />
              <p className="text-xs text-muted-foreground text-right">
                {headline.length}/80
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description{" "}
                <span className="text-muted-foreground font-normal">
                  (optional, max 150 characters)
                </span>
              </Label>
              <Textarea
                id="description"
                placeholder="e.g., Competitive salary, modern facilities, and professional development opportunities."
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, 150))}
                maxLength={150}
                rows={2}
              />
              <p className="text-xs text-muted-foreground text-right">
                {description.length}/150
              </p>
            </div>

            {/* Tier Summary */}
            {selectedTier && (
              <Card className="bg-muted/30">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">
                        {selectedTier.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {selectedTier.durationLabel}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-brand-primary">
                        {formatPrice(selectedTier.effectivePrice)}
                      </p>
                      {selectedTier.hasActiveLaunchPricing && (
                        <p className="text-xs text-muted-foreground line-through">
                          {formatPrice(selectedTier.normalPrice)}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Payment is required only after admin approval.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => handleModalClose(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              variant="hero"
              onClick={handleSubmitAdRequest}
              disabled={!bannerFile || submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Submit Ad Request
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default JobPostSuccess;
