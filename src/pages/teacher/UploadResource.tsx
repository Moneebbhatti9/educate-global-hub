import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Upload,
  X,
  Plus,
  Eye,
  DollarSign,
  FileText,
  Image as ImageIcon,
  Save,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/layout/DashboardLayout";

// Form validation schema
const resourceSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(140, "Title must be under 140 characters"),
  shortDescription: z
    .string()
    .min(140, "Short description must be at least 140 characters")
    .max(300, "Short description must be under 300 characters"),
  fullDescription: z.string().min(1, "Full description is required"),
  resourceType: z.string().min(1, "Resource type is required"),
  subjects: z.array(z.string()).min(1, "At least one subject is required"),
  ageGroups: z.array(z.string()).min(1, "At least one age group is required"),
  curriculum: z.string().optional(),
  language: z.string().min(1, "Language is required"),
  pages: z.number().optional(),
  lessonTime: z.number().optional(),
  isFree: z.enum(["free", "paid"]),
  price: z.number().optional(),
  currency: z.string().optional(),
  licenseType: z.string().min(1, "License type is required"),
  tags: z.string().min(1, "At least 3 tags are recommended"),
  categories: z.array(z.string()).optional(),
  accessibility: z.string().optional(),
  visibility: z.string().min(1, "Visibility setting is required"),
  versionNotes: z.string().optional(),
});

type ResourceFormData = z.infer<typeof resourceSchema>;

const RESOURCE_TYPES = [
  "Worksheet",
  "Lesson Plan",
  "Presentation",
  "Assessment",
  "Scheme of Work",
  "Display",
  "Activity",
  "Game",
  "Video",
  "Other",
];

const SUBJECTS = [
  "Mathematics",
  "English",
  "Science",
  "History",
  "Geography",
  "Art",
  "Music",
  "PE",
  "Computing",
  "Languages",
  "PSHE",
  "Religious Studies",
];

const AGE_GROUPS = [
  "Early Years (2-5 years)",
  "Key Stage 1 (5-7 years)",
  "Key Stage 2 (7-11 years)",
  "Key Stage 3 (11-14 years)",
  "Key Stage 4 (14-16 years)",
  "Key Stage 5 (16-18 years)",
];

const CURRENCIES = [
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
];

const LICENSE_TYPES = [
  "Single Teacher License",
  "School License",
  "Multiple Use License",
  "Commercial License",
];

const UploadResource = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form state
  const form = useForm<ResourceFormData>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      isFree: "free",
      language: "English",
      currency: "GBP",
      licenseType: "Single Teacher License",
      visibility: "Public",
    },
  });

  // File upload states
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [previewImages, setPreviewImages] = useState<File[]>([]);
  const [resourceFiles, setResourceFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // UI states
  const [activeTab, setActiveTab] = useState("details");
  const [expectedEarnings, setExpectedEarnings] = useState(0);
  const [currentRoyaltyTier, setCurrentRoyaltyTier] = useState("Bronze (60%)");

  const watchIsFree = form.watch("isFree");
  const watchPrice = form.watch("price");

  // Calculate expected earnings when price changes
  const calculateEarnings = (price: number) => {
    const royaltyRate = 0.6; // Bronze tier
    const transactionFee = price < 3 ? 0.2 : 0;
    const vatRate = 0.2;

    const afterVat = price * (1 - vatRate);
    const afterFees = afterVat - transactionFee;
    const earnings = afterFees * royaltyRate;

    setExpectedEarnings(Math.max(0, earnings));
  };

  // Handle file uploads
  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Banner image must be under 5MB",
          variant: "destructive",
        });
        return;
      }
      setBannerImage(file);
    }
  };

  const handlePreviewUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const isPaid = watchIsFree === "paid";
    const maxFiles = isPaid ? 5 : 1;

    if (previewImages.length + files.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `${
          isPaid ? "Paid" : "Free"
        } resources can have maximum ${maxFiles} preview image${
          maxFiles > 1 ? "s" : ""
        }`,
        variant: "destructive",
      });
      return;
    }

    const validFiles = files.filter((file) => {
      if (file.size > 3 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} is over 3MB limit`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });

    setPreviewImages((prev) => [...prev, ...validFiles]);
  };

  const handleResourceFilesUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);

    if (totalSize > 500 * 1024 * 1024) {
      toast({
        title: "Files too large",
        description: "Total file size must be under 500MB",
        variant: "destructive",
      });
      return;
    }

    setResourceFiles((prev) => [...prev, ...files]);
  };

  const removePreviewImage = (index: number) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeResourceFile = (index: number) => {
    setResourceFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Form submission
  const onSubmit = async (data: ResourceFormData) => {
    const isPaid = data.isFree === "paid";

    // Validation checks
    if (!bannerImage) {
      toast({
        title: "Banner image required",
        description: "Please upload a banner image for your resource",
        variant: "destructive",
      });
      return;
    }

    if (isPaid && previewImages.length < 5) {
      toast({
        title: "Preview images required",
        description: "Paid resources must have exactly 5 preview images",
        variant: "destructive",
      });
      return;
    }

    if (!isPaid && previewImages.length < 1) {
      toast({
        title: "Preview image required",
        description: "Free resources must have at least 1 preview image",
        variant: "destructive",
      });
      return;
    }

    if (isPaid && (!data.price || data.price <= 0)) {
      toast({
        title: "Price required",
        description: "Please set a price for your paid resource",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 20;
        });
      }, 500);

      // TODO: Implement actual file upload and resource creation API call
      await new Promise((resolve) => setTimeout(resolve, 3000));

      setUploadProgress(100);
      clearInterval(progressInterval);

      toast({
        title: "Resource uploaded successfully!",
        description: "Your resource is now live and available for purchase.",
      });

      navigate("/teacher/dashboard");
    } catch (error) {
      toast({
        title: "Upload failed",
        description:
          "There was an error uploading your resource. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const saveDraft = () => {
    toast({
      title: "Draft saved",
      description: "Your resource has been saved as a draft.",
    });
  };

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Create a Resource
          </h1>
          <p className="text-muted-foreground mt-2">
            Share your teaching materials with educators worldwide
          </p>
        </div>

        {/* Upload Progress */}
        {isSubmitting && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Uploading resource...</span>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - File Uploads */}
              <div className="space-y-6">
                {/* Banner Image */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <ImageIcon className="w-5 h-5" />
                      <span>Banner Image *</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                        {bannerImage ? (
                          <div className="space-y-2">
                            <img
                              src={URL.createObjectURL(bannerImage)}
                              alt="Banner preview"
                              className="w-full h-32 object-cover rounded"
                            />
                            <p className="text-sm text-muted-foreground">
                              {bannerImage.name}
                            </p>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setBannerImage(null)}
                            >
                              Remove
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                            <div>
                              <label
                                htmlFor="banner-upload"
                                className="cursor-pointer"
                              >
                                <span className="text-primary hover:underline">
                                  Click to upload
                                </span>
                                <span className="text-muted-foreground">
                                  {" "}
                                  or drag and drop
                                </span>
                              </label>
                              <input
                                id="banner-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleBannerUpload}
                                className="hidden"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Recommended: 1200×400px (16:5), min 800×300px, JPEG/PNG,
                        max 5MB
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Preview Images */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Eye className="w-5 h-5" />
                      <span>Preview Images *</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground">
                        {watchIsFree === "paid"
                          ? "Exactly 5 preview images required for paid resources"
                          : "Minimum 1 preview image required for free resources"}
                      </div>

                      {previewImages.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          {previewImages.map((file, index) => (
                            <div key={index} className="relative">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-20 object-cover rounded"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute -top-2 -right-2 w-6 h-6 p-0"
                                onClick={() => removePreviewImage(index)}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                        <label
                          htmlFor="preview-upload"
                          className="cursor-pointer"
                        >
                          <Plus className="w-6 h-6 mx-auto text-muted-foreground mb-2" />
                          <span className="text-sm text-primary hover:underline">
                            Add Preview Images
                          </span>
                          <input
                            id="preview-upload"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handlePreviewUpload}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <p className="text-xs text-muted-foreground">
                        Screenshots of worksheets, slides, or sample pages.
                        1200×825px recommended, max 3MB each
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Resource Files */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="w-5 h-5" />
                      <span>Resource Files</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {resourceFiles.length > 0 && (
                        <div className="space-y-2 mb-3">
                          {resourceFiles.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 bg-muted/50 rounded"
                            >
                              <div className="flex items-center space-x-2">
                                <FileText className="w-4 h-4" />
                                <span className="text-sm">{file.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  ({(file.size / 1024 / 1024).toFixed(1)} MB)
                                </span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeResourceFile(index)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                        <label
                          htmlFor="resource-upload"
                          className="cursor-pointer"
                        >
                          <Upload className="w-6 h-6 mx-auto text-muted-foreground mb-2" />
                          <span className="text-sm text-primary hover:underline">
                            Upload Resource Files
                          </span>
                          <input
                            id="resource-upload"
                            type="file"
                            accept=".pdf,.docx,.pptx,.zip,image/*"
                            multiple
                            onChange={handleResourceFilesUpload}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <p className="text-xs text-muted-foreground">
                        PDF, DOCX, PPTX, ZIP, images. Total max 500MB
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Form Fields */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Clear, searchable title. Include key stage & topic."
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            {field.value?.length || 0}/140 characters
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="shortDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Short Description *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Brief overview of your resource..."
                              className="h-20"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            {field.value?.length || 0}/300 characters (140-300
                            required)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fullDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Description *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe learning outcomes, duration, equipment needed..."
                              className="h-32"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Include headings, bullet points, learning outcomes,
                            and requirements.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="resourceType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Resource Type *</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select resource type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {RESOURCE_TYPES.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="language"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Language *</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="English">English</SelectItem>
                                <SelectItem value="Spanish">Spanish</SelectItem>
                                <SelectItem value="French">French</SelectItem>
                                <SelectItem value="German">German</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Pricing & Licensing */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <DollarSign className="w-5 h-5" />
                      <span>Pricing & Licensing</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="isFree"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Is this resource free? *</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="flex space-x-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="free" id="free" />
                                <Label htmlFor="free">Free</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="paid" id="paid" />
                                <Label htmlFor="paid">Paid</Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {watchIsFree === "paid" && (
                      <div className="space-y-4 border border-border rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="currency"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Currency *</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {CURRENCIES.map((currency) => (
                                      <SelectItem
                                        key={currency.code}
                                        value={currency.code}
                                      >
                                        {currency.symbol} {currency.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Price *</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                    {...field}
                                    onChange={(e) => {
                                      const value =
                                        parseFloat(e.target.value) || 0;
                                      field.onChange(value);
                                      calculateEarnings(value);
                                    }}
                                  />
                                </FormControl>
                                {watchPrice && watchPrice < 3 && (
                                  <p className="text-sm text-amber-600">
                                    ⚠️ Items under £3 incur a transaction fee of
                                    £0.20
                                  </p>
                                )}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Royalty Information */}
                        <div className="bg-muted/50 p-3 rounded-lg space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Current Royalty Tier:</span>
                            <Badge variant="secondary">
                              {currentRoyaltyTier}
                            </Badge>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Expected Net Earnings:</span>
                            <span className="font-medium text-primary">
                              £{expectedEarnings.toFixed(2)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Your share after VAT, transaction fees, and platform
                            commission
                          </p>
                        </div>
                      </div>
                    )}

                    <FormField
                      control={form.control}
                      name="licenseType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>License Type *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {LICENSE_TYPES.map((license) => (
                                <SelectItem key={license} value={license}>
                                  {license}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Select the license to apply to buyers
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Publishing Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle>Publishing Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="visibility"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Visibility *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Public">Public</SelectItem>
                              <SelectItem value="Private">Private</SelectItem>
                              <SelectItem value="School-only">
                                School Only
                              </SelectItem>
                              <SelectItem value="Unlisted">
                                Unlisted Link
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="versionNotes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Version Notes</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe updates or changes..."
                              className="h-20"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={saveDraft}
                    disabled={isSubmitting}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Draft
                  </Button>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Publish Resource
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </DashboardLayout>
  );
};

export default UploadResource;
