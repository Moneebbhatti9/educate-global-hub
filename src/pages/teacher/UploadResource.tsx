import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
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
  Edit,
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
import { customToast } from "@/components/ui/sonner";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { resourcesAPI } from "@/apis/resources";
import type {
  CreateResourceRequest,
  UpdateResourceRequest,
  TeacherResource,
} from "@/types/resource";
import DashboardLayout from "@/layout/DashboardLayout";

// Form validation schema
const resourceSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(140, "Title must be under 140 characters"),
    description: z.string().min(1, "Description is required"),
    type: z.string().min(1, "Resource type is required"),
    publishing: z.string().optional(),
    isFree: z.enum(["free", "paid"]),
    price: z.union([z.number(), z.literal("")]).optional(),
    currency: z.string().optional(),
    ageRange: z.string().min(1, "Age range is required"),
    curriculum: z.string().min(1, "Curriculum is required"),
    curriculumType: z.string().min(1, "Curriculum type is required"),
    subject: z.string().min(1, "Subject is required"),
  })
  .refine(
    (data) => {
      if (data.isFree === "paid") {
        return data.price && typeof data.price === "number" && data.price > 0;
      }
      return true;
    },
    {
      message: "Price is required for paid resources",
      path: ["price"],
    }
  );

type ResourceFormData = z.infer<typeof resourceSchema>;

const RESOURCE_TYPES = [
  "Assembly",
  "Assessment and revision",
  "Game/puzzle/quiz",
  "Audio, music & video",
  "Lesson (complete)",
  "Other",
  "Unit of work",
  "Visual aid/Display",
  "Worksheet/Activity",
];

const SUBJECTS = [
  "Aboriginal and Islander languages",
  "Aboriginal studies",
  "Afrikaans",
  "Albanian",
  "Amharic",
  "Anthropology",
  "Arabic",
  "Art and design",
  "Belarussian",
  "Bengali",
  "Biology",
  "Bosnian",
  "Bulgarian",
  "Business and finance",
  "Cantonese",
  "Catalan",
  "Chemistry",
  "Citizenship",
  "Classics",
  "Computing",
  "Core IB",
  "Croatian",
  "Cross-curricular topics",
  "Czech",
  "Danish",
  "Design, engineering and technology",
  "Drama",
  "Dutch",
  "Economics",
  "English",
  "English language learning",
  "Estonian",
  "Expressive arts and design",
  "Finnish",
  "French",
  "Geography",
  "German",
  "Government and politics",
  "Greek",
  "Gujarati",
  "Hebrew",
  "Hindi",
  "History",
  "Hungarian",
  "Icelandic",
  "Indonesian",
  "Irish Gaelic",
  "Italian",
  "Japanese",
  "Korean",
  "Latvian",
  "Law and legal studies",
  "Literacy for early years",
  "Lithuanian",
  "Macedonian",
  "Malay",
  "Mandarin",
  "Mathematics",
  "Maths for early years",
  "Media studies",
  "Music",
  "Nepali",
  "New teachers",
  "Norwegian",
  "Pedagogy and professional development",
  "Persian",
  "Personal, social and health education",
  "Philosophy and ethics",
  "Physical development",
  "Physical education",
  "Physics",
  "Pilipino",
  "Polish",
  "Portuguese",
  "Primary science",
  "Psychology",
  "Punjabi",
  "Religious education",
  "Romanian",
  "Russian",
  "Scottish Gaelic",
  "Serbian",
  "Sesotho",
  "Sinhalese",
  "Siswati",
  "Slovak",
  "Sociology",
  "Spanish",
  "Special educational needs",
  "Student careers advice",
  "Swahili",
  "Swedish",
  "Tamil",
  "Thai",
  "Turkish",
  "Ukrainian",
  "Understanding the world",
  "Urdu",
  "Vietnamese",
  "Vocational studies",
  "Welsh",
  "Whole school",
];

const AGE_GROUPS = [
  "3-5",
  "5-7",
  "7-11",
  "11-14",
  "14-16",
  "16+",
  "Age not applicable",
];

const CURRICULA = [
  "No curriculum",
  "American",
  "Australian",
  "Canadian",
  "English",
  "International",
  "Irish",
  "New Zealand",
  "Northern Irish",
  "Scottish",
  "Welsh",
  "Zambian",
];

const CURRICULUM_TYPES = [
  "No curriculum type",
  "Cambridge",
  "Foundation Stage",
  "IB PYP",
  "IPC",
  "IPC/IEYC",
  "Montessori",
  "Northern Ireland Curriculum",
  "School's own",
  "Waldorf/Steiner",
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
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { handleError, showSuccess, showError } = useErrorHandler();

  // Check for edit mode from location state or URL params
  const editState = location.state as {
    editMode?: boolean;
    resourceData?: TeacherResource;
  } | null;
  const isEditMode = Boolean(id) || Boolean(editState?.editMode);
  const [resourceData, setResourceData] = useState<TeacherResource | null>(
    null
  );
  const [isLoadingResource, setIsLoadingResource] = useState(false);

  // Form state
  const form = useForm<ResourceFormData>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "",
      publishing: "public",
      isFree: "free",
      price: "",
      currency: "GBP",
      ageRange: "",
      curriculum: "",
      curriculumType: "",
      subject: "",
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

  // Load resource data for edit mode
  useEffect(() => {
    if (isEditMode) {
      if (editState?.editMode && editState?.resourceData) {
        // Handle edit mode from location state
        const resource = editState.resourceData;
        console.log("🔍 EDIT MODE - Resource data received:", resource);
        console.log(
          "🔍 EDIT MODE - Cover photo URL:",
          resource.coverPhoto?.url
        );
        console.log("🔍 EDIT MODE - Preview images:", resource.previewImages);
        console.log("🔍 EDIT MODE - Main file:", resource.mainFile);
        console.log("🔍 EDIT MODE - Main file URL:", resource.mainFile?.url);
        console.log(
          "🔍 EDIT MODE - Main file type:",
          resource.mainFile?.fileType
        );

        setResourceData(resource);

        // Populate form with existing data
        form.reset({
          title: resource.title || "",
          description: resource.description || "",
          type: resource.type || "",
          publishing: resource.publishing || "public",
          isFree: resource.isFree ? "free" : "paid",
          price: typeof resource.price === "number" ? resource.price : 0,
          currency: resource.currency || "GBP",
          ageRange: resource.ageRange || "",
          curriculum: resource.curriculum || "",
          curriculumType: resource.curriculumType || "",
          subject: resource.subject || "",
        });
      } else if (id && typeof id === "string" && id.trim().length > 0) {
        // Handle edit mode from URL params (legacy)
        loadResourceData(id.trim());
      } else if (isEditMode && id) {
        console.error("Invalid resource ID for edit mode:", id);
        showError("Invalid resource ID", "Resource ID is invalid");
        navigate("/dashboard/teacher/resource-management");
      }
    }
  }, [isEditMode, id, editState]);

  const loadResourceData = async (resourceId: string) => {
    if (
      !resourceId ||
      typeof resourceId !== "string" ||
      resourceId.trim().length === 0
    ) {
      console.error("Invalid resource ID:", resourceId);
      showError("Invalid resource ID", "Resource ID is required");
      navigate("/teacher/resource-management");
      return;
    }

    setIsLoadingResource(true);
    try {
      const response = await resourcesAPI.getResourceById(resourceId.trim());

      // Safety checks for response
      if (!response) {
        showError(
          "Failed to load resource",
          "No response received from server"
        );
        navigate("/dashboard/teacher/resource-management");
        return;
      }

      if (response.success && response.data) {
        // Safety checks for resource data
        if (!response.data || typeof response.data !== "object") {
          console.warn("Invalid resource data structure:", response.data);
          showError("Invalid resource data", "Resource data is malformed");
          navigate("/dashboard/teacher/resource-management");
          return;
        }

        if (!response.data.id || typeof response.data.id !== "string") {
          console.warn("Resource missing valid ID:", response.data);
          showError("Invalid resource", "Resource ID is missing");
          navigate("/dashboard/teacher/resource-management");
          return;
        }

        const resource = response.data;
        console.log("🔍 API LOAD - Resource data received:", resource);
        console.log("🔍 API LOAD - Banner image URL:", resource.bannerImage);
        console.log("🔍 API LOAD - Preview images:", resource.previewImages);
        console.log("🔍 API LOAD - Resource files:", resource.resourceFiles);

        // Convert Resource to TeacherResource format for consistency
        const teacherResource: TeacherResource = {
          _id: resource.id,
          title: resource.title,
          description: resource.fullDescription || resource.shortDescription,
          type: resource.resourceType,
          ageRange: resource.ageGroups?.[0] || "",
          curriculum: resource.curriculum || "",
          curriculumType: resource.curriculumType || "",
          subject: resource.subjects?.[0] || "",
          isFree: resource.isFree,
          currency: resource.currency || null,
          price: resource.price || 0,
          publishing: resource.visibility,
          createdBy: {
            userId: resource.authorId,
            role: "teacher",
          },
          coverPhoto: resource.bannerImage
            ? {
                _id: "",
                resourceId: resource.id,
                fileType: "cover",
                url: resource.bannerImage,
                uploadedBy: resource.authorId,
                createdAt: resource.uploadDate,
                updatedAt: resource.lastModified,
                __v: 0,
              }
            : {
                _id: "",
                resourceId: resource.id,
                fileType: "cover",
                url: "",
                uploadedBy: resource.authorId,
                createdAt: resource.uploadDate,
                updatedAt: resource.lastModified,
                __v: 0,
              },
          previewImages: resource.previewImages.map((url, index) => ({
            _id: `preview_${index}`,
            resourceId: resource.id,
            fileType: "preview",
            url: url,
            uploadedBy: resource.authorId,
            createdAt: resource.uploadDate,
            updatedAt: resource.lastModified,
            __v: 0,
          })),
          mainFile: resource.resourceFiles[0]
            ? {
                _id: "",
                resourceId: resource.id,
                fileType: "main",
                url: resource.resourceFiles[0],
                uploadedBy: resource.authorId,
                createdAt: resource.uploadDate,
                updatedAt: resource.lastModified,
                __v: 0,
              }
            : {
                _id: "",
                resourceId: resource.id,
                fileType: "main",
                url: "",
                uploadedBy: resource.authorId,
                createdAt: resource.uploadDate,
                updatedAt: resource.lastModified,
                __v: 0,
              },
          status: resource.status === "published" ? "approved" : "draft",
          approvedBy: null,
          isDeleted: false,
          createdAt: resource.uploadDate,
          updatedAt: resource.lastModified,
          __v: 0,
        };

        setResourceData(teacherResource);

        // Populate form with existing data with safety checks
        form.reset({
          title: resource.title || "",
          description:
            resource.fullDescription || resource.shortDescription || "",
          type: resource.resourceType || "",
          publishing: resource.visibility || "public",
          isFree: resource.isFree ? "free" : "paid",
          price: typeof resource.price === "number" ? resource.price : 0,
          currency: resource.currency || "GBP",
          ageRange: resource.ageGroups?.[0] || "",
          curriculum: resource.curriculum || "",
          curriculumType: resource.curriculumType || "",
          subject: resource.subjects?.[0] || "",
        });

        // Set existing files (if any)
        // Note: In a real implementation, you'd need to convert URLs back to File objects
        // For now, we'll just show the existing data
      } else {
        const errorMessage = response?.message || "Resource not found";
        showError("Failed to load resource", errorMessage);
        navigate("/dashboard/teacher/resource-management");
      }
    } catch (error) {
      console.error("Error loading resource:", error);
      handleError(error, "Failed to load resource");
      navigate("/teacher/resource-management");
    } finally {
      setIsLoadingResource(false);
    }
  };

  const watchIsFree = form.watch("isFree");

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
    if (!file) {
      console.warn("No file selected for banner upload");
      return;
    }

    // Safety checks for file
    if (!(file instanceof File)) {
      console.error("Invalid file object:", file);
      showError("Invalid file", "Please select a valid file");
      return;
    }

    // Check file size
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      showError("File too large", "Banner image must be under 5MB");
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      showError("Invalid file type", "Banner must be an image file");
      return;
    }

    setBannerImage(file);
  };

  const handlePreviewUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) {
      console.warn("No files selected for preview upload");
      return;
    }

    const maxFiles = 5;
    if (previewImages.length + files.length > maxFiles) {
      showError("Too many files", `Maximum ${maxFiles} preview images allowed`);
      return;
    }

    const validFiles = files.filter((file) => {
      if (!(file instanceof File)) {
        console.error("Invalid file object:", file);
        showError("Invalid file", "Please select valid files");
        return false;
      }

      if (!file.type.startsWith("image/")) {
        showError("Invalid file type", `${file.name} must be an image file`);
        return false;
      }

      const maxSize = 3 * 1024 * 1024; // 3MB
      if (file.size > maxSize) {
        showError("File too large", `${file.name} is over 3MB limit`);
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
    if (files.length === 0) {
      console.warn("No files selected for resource upload");
      return;
    }

    const maxFiles = 3;
    if (resourceFiles.length + files.length > maxFiles) {
      showError("Too many files", `Maximum ${maxFiles} resource files allowed`);
      return;
    }

    let totalSize = 0;
    const validFiles = files.filter((file) => {
      if (!(file instanceof File)) {
        console.error("Invalid file object:", file);
        showError("Invalid file", "Please select valid files");
        return false;
      }

      totalSize += file.size;
      return true;
    });

    const maxTotalSize = 500 * 1024 * 1024; // 500MB
    if (totalSize > maxTotalSize) {
      showError("Files too large", "Total file size must be under 500MB");
      return;
    }

    setResourceFiles((prev) => [...prev, ...validFiles]);
  };

  const removePreviewImage = (index: number) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeResourceFile = (index: number) => {
    setResourceFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Clear form function
  const clearForm = () => {
    // Reset form fields
    form.reset({
      title: "",
      description: "",
      type: "",
      publishing: "public",
      isFree: "free",
      price: "",
      currency: "GBP",
      ageRange: "",
      curriculum: "",
      curriculumType: "",
      subject: "",
    });

    // Clear all file states
    setBannerImage(null);
    setPreviewImages([]);
    setResourceFiles([]);
    setUploadProgress(0);

    // Clear edit mode states
    setResourceData(null);

    // Reset UI states
    setExpectedEarnings(0);
    setCurrentRoyaltyTier("Bronze (60%)");

    // Navigate to create mode (clear edit mode)
    navigate("/dashboard/teacher/upload-resource", {
      replace: true,
      state: { editMode: false, resourceData: null },
    });

    console.log("🧹 Form cleared completely and exited edit mode");
  };

  // Form submission
  const onSubmit = async (data: ResourceFormData) => {
    // Safety checks for form data
    if (!data || typeof data !== "object") {
      console.error("Invalid form data:", data);
      showError("Invalid form data", "Form data is invalid");
      return;
    }

    const isPaid = data.isFree === "paid";

    // File validation checks (not handled by form schema)
    console.log("🔍 VALIDATION - Banner image:", bannerImage);
    console.log(
      "🔍 VALIDATION - Resource data cover photo:",
      resourceData?.coverPhoto?.url
    );
    console.log("🔍 VALIDATION - Preview images:", previewImages.length);
    console.log(
      "🔍 VALIDATION - Resource data preview images:",
      resourceData?.previewImages?.length
    );
    console.log("🔍 VALIDATION - Resource files:", resourceFiles.length);
    console.log(
      "🔍 VALIDATION - Resource data main file:",
      resourceData?.mainFile?.url
    );

    if (!bannerImage && !resourceData?.coverPhoto?.url) {
      showError(
        "Banner image required",
        "Please upload a banner image for your resource"
      );
      return;
    }

    if (
      previewImages.length < 1 &&
      (!resourceData?.previewImages || resourceData.previewImages.length === 0)
    ) {
      showError("Preview images required", "Please upload 1-5 preview images");
      return;
    }

    if (resourceFiles.length < 1 && !resourceData?.mainFile?.url) {
      showError("Resource files required", "Please upload 1-3 resource files");
      return;
    }

    if (
      isPaid &&
      (!data.price || typeof data.price !== "number" || data.price <= 0)
    ) {
      showError(
        "Price required",
        "Please set a valid price for your paid resource"
      );
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      // Prepare the resource data with safety checks
      const resourceData: CreateResourceRequest = {
        title: data.title.trim(),
        description: data.description.trim(),
        type: data.type,
        publishing: data.publishing || "public",
        isFree: data.isFree === "free",
        price:
          isPaid && typeof data.price === "number" && data.price > 0
            ? data.price
            : undefined,
        currency: data.currency || "GBP",
        saveAsDraft: false, // Set to true for draft saving
        ageRange: data.ageRange,
        curriculum: data.curriculum,
        curriculumType: data.curriculumType || "",
        subject: data.subject,
        banner: bannerImage || new File([], "placeholder"), // Use new banner if uploaded, otherwise placeholder
        previews:
          previewImages.length > 0
            ? previewImages
            : [new File([], "placeholder")], // Use new previews if uploaded, otherwise placeholder
        files:
          resourceFiles.length > 0
            ? resourceFiles
            : [new File([], "placeholder")], // Use new files if uploaded, otherwise placeholder
      };

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

      // Call the appropriate API based on mode
      let response;
      if (isEditMode) {
        // Determine resource ID for update
        const resourceId = id || editState?.resourceData?._id;

        if (
          resourceId &&
          typeof resourceId === "string" &&
          resourceId.trim().length > 0
        ) {
          // Update existing resource
          const updateData: UpdateResourceRequest = {
            title: data.title.trim(),
            description: data.description.trim(),
            type: data.type,
            publishing: data.publishing || "public",
            isFree: data.isFree === "free",
            price:
              isPaid && typeof data.price === "number" && data.price > 0
                ? data.price
                : undefined,
            currency: data.currency || "GBP",
            ageRange: data.ageRange,
            curriculum: data.curriculum,
            curriculumType: data.curriculumType || "",
            subject: data.subject,
            coverPhoto: bannerImage || undefined,
            previewImages: previewImages.length > 0 ? previewImages : undefined,
            mainFile: resourceFiles.length > 0 ? resourceFiles[0] : undefined,
          };
          response = await resourcesAPI.updateResource(
            resourceId.trim(),
            updateData
          );
        } else {
          showError(
            "Invalid resource ID",
            "Cannot update resource without valid ID"
          );
          return;
        }
      } else {
        // Create new resource
        response = await resourcesAPI.createResource(resourceData);
      }

      setUploadProgress(100);
      clearInterval(progressInterval);

      // Safety checks for response
      if (!response) {
        showError("Upload failed", "No response received from server");
        return;
      }

      if (response.success) {
        showSuccess(
          isEditMode
            ? "Resource updated successfully!"
            : "Resource uploaded successfully!",
          isEditMode
            ? "Your resource has been updated successfully."
            : "Your resource is now live and available for purchase."
        );

        // Clear the form completely
        clearForm();
      } else {
        const errorMessage =
          response?.message ||
          (isEditMode
            ? "Failed to update resource"
            : "Failed to upload resource");
        showError(isEditMode ? "Update failed" : "Upload failed", errorMessage);
      }
    } catch (error) {
      console.error("Error uploading resource:", error);
      handleError(error, "Upload failed");
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const saveDraft = async () => {
    try {
      const formData = form.getValues();

      // Safety checks for form data
      if (!formData || typeof formData !== "object") {
        console.error("Invalid form data for draft:", formData);
        showError("Invalid form data", "Form data is invalid");
        return;
      }

      const isPaid = formData.isFree === "paid";

      // Basic validation for draft
      if (
        !formData.title ||
        typeof formData.title !== "string" ||
        formData.title.trim().length === 0
      ) {
        showError("Title required", "Please enter a title to save as draft");
        return;
      }

      // For draft, we need at least a banner image
      if (!bannerImage && !resourceData?.coverPhoto?.url) {
        showError(
          "Banner image required",
          "Please upload a banner image to save as draft"
        );
        return;
      }

      setIsSubmitting(true);
      setUploadProgress(0);

      // Prepare draft data with safety checks
      const draftData: CreateResourceRequest = {
        title: formData.title.trim(),
        description:
          formData.description && typeof formData.description === "string"
            ? formData.description.trim()
            : "",
        type:
          formData.type && typeof formData.type === "string"
            ? formData.type
            : "",
        publishing: formData.publishing || "public",
        isFree: formData.isFree === "free",
        price:
          isPaid && typeof formData.price === "number" && formData.price > 0
            ? formData.price
            : undefined,
        currency: formData.currency || "GBP",
        saveAsDraft: true,
        ageRange:
          formData.ageRange && typeof formData.ageRange === "string"
            ? formData.ageRange
            : "",
        curriculum:
          formData.curriculum && typeof formData.curriculum === "string"
            ? formData.curriculum
            : "",
        curriculumType:
          formData.curriculumType && typeof formData.curriculumType === "string"
            ? formData.curriculumType
            : "",
        subject:
          formData.subject && typeof formData.subject === "string"
            ? formData.subject
            : "",
        banner: bannerImage || new File([], "placeholder"), // Use new banner if uploaded, otherwise placeholder
        previews:
          previewImages.length > 0
            ? previewImages
            : [new File([], "placeholder")],
        files:
          resourceFiles.length > 0
            ? resourceFiles
            : [new File([], "placeholder")],
      };

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

      // Call the createResource API with saveAsDraft: true
      const response = await resourcesAPI.createResource(draftData);

      setUploadProgress(100);
      clearInterval(progressInterval);

      // Safety checks for response
      if (!response) {
        showError("Draft save failed", "No response received from server");
        return;
      }

      if (response.success) {
        showSuccess(
          "Draft saved successfully!",
          "Your resource has been saved as a draft and can be edited later."
        );

        // Clear the form after successful draft save
        clearForm();
      } else {
        const errorMessage = response?.message || "Failed to save draft";
        showError("Draft save failed", errorMessage);
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      handleError(error, "Failed to save draft");
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            {isEditMode ? "Edit Resource" : "Create a Resource"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isEditMode
              ? "Update your teaching resource details and files"
              : "Share your teaching materials with educators worldwide"}
          </p>
        </div>

        {/* Loading State for Edit Mode */}
        {isLoadingResource && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center space-x-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span>Loading resource data...</span>
              </div>
            </CardContent>
          </Card>
        )}

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
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              showError(
                "Form validation failed",
                "Please check all required fields"
              );
            })}
          >
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
                        ) : isEditMode && resourceData?.coverPhoto?.url ? (
                          <div className="space-y-2">
                            <img
                              src={resourceData.coverPhoto.url}
                              alt="Existing banner"
                              className="w-full h-32 object-cover rounded"
                              onLoad={() =>
                                console.log(
                                  "✅ Banner image loaded successfully:",
                                  resourceData.coverPhoto.url
                                )
                              }
                              onError={(e) =>
                                console.error(
                                  "❌ Banner image failed to load:",
                                  resourceData.coverPhoto.url,
                                  e
                                )
                              }
                            />
                            <p className="text-sm text-muted-foreground">
                              Existing banner image
                            </p>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                console.log(
                                  "🔄 Replacing existing banner image"
                                );
                                setBannerImage(null);
                              }}
                            >
                              Replace
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
                        Upload 1-5 preview images (required)
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

                      {isEditMode &&
                        resourceData?.previewImages &&
                        resourceData.previewImages.length > 0 &&
                        previewImages.length === 0 && (
                          <div className="grid grid-cols-2 gap-2 mb-3">
                            {resourceData.previewImages.map(
                              (preview, index) => (
                                <div key={index} className="relative">
                                  <img
                                    src={preview.url}
                                    alt={`Existing preview ${index + 1}`}
                                    className="w-full h-20 object-cover rounded"
                                    onLoad={() =>
                                      console.log(
                                        "✅ Preview image loaded successfully:",
                                        preview.url
                                      )
                                    }
                                    onError={(e) =>
                                      console.error(
                                        "❌ Preview image failed to load:",
                                        preview.url,
                                        e
                                      )
                                    }
                                  />
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    className="absolute -top-2 -right-2 w-6 h-6 p-0"
                                    onClick={() => {
                                      console.log(
                                        "🔄 Removing existing preview image:",
                                        preview.url
                                      );
                                      // Note: In a real implementation, you'd need to track which existing images to remove
                                    }}
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </div>
                              )
                            )}
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
                        1200×825px recommended, max 3MB each (1-5 images)
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

                      {isEditMode &&
                        resourceData?.mainFile &&
                        resourceData.mainFile.url &&
                        resourceFiles.length === 0 && (
                          <div className="space-y-2 mb-3">
                            <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                              <div className="flex items-center space-x-2">
                                <FileText className="w-4 h-4" />
                                <span className="text-sm">
                                  Existing Resource File
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  ({resourceData.mainFile.fileType})
                                </span>
                                <a
                                  href={resourceData.mainFile.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-primary hover:underline"
                                  onClick={() =>
                                    console.log(
                                      "🔗 Opening existing resource file:",
                                      resourceData.mainFile.url
                                    )
                                  }
                                >
                                  View File
                                </a>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  console.log(
                                    "🔄 Replacing existing resource file:",
                                    resourceData.mainFile.url
                                  );
                                  // Note: In a real implementation, you'd need to track which existing files to remove
                                }}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
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
                        PDF, DOCX, PPTX, ZIP, images. Total max 500MB (1-3
                        files)
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
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Detailed description of your resource..."
                              className="h-32"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Include learning outcomes, duration, equipment
                            needed, and detailed instructions.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="type"
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
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="ageRange"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Age Range *</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select age range" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {AGE_GROUPS.map((ageGroup) => (
                                  <SelectItem key={ageGroup} value={ageGroup}>
                                    {ageGroup}
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
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject *</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select subject" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {SUBJECTS.map((subject) => (
                                  <SelectItem key={subject} value={subject}>
                                    {subject}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="curriculum"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Curriculum *</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select curriculum" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {CURRICULA.map((curriculum) => (
                                  <SelectItem
                                    key={curriculum}
                                    value={curriculum}
                                  >
                                    {curriculum}
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
                        name="curriculumType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Curriculum Type *</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select curriculum type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {CURRICULUM_TYPES.map((type) => (
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
                                    value={
                                      field.value === "" ? "" : field.value
                                    }
                                    onChange={(e) => {
                                      const value =
                                        e.target.value === ""
                                          ? ""
                                          : parseFloat(e.target.value) || 0;
                                      field.onChange(value);
                                      if (
                                        typeof value === "number" &&
                                        value > 0
                                      ) {
                                        calculateEarnings(value);
                                      }
                                    }}
                                  />
                                </FormControl>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    )}
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
                      name="publishing"
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
                              <SelectItem value="public">Public</SelectItem>
                              <SelectItem value="private">Private</SelectItem>
                              <SelectItem value="school only">
                                School Only
                              </SelectItem>
                              <SelectItem value="unlisted">
                                Unlisted Link
                              </SelectItem>
                            </SelectContent>
                          </Select>
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
                    {isEditMode ? "Save Changes" : "Save Draft"}
                  </Button>

                  <Button
                    type="submit"
                    disabled={isSubmitting || isLoadingResource}
                    className="px-8"
                  >
                    {isEditMode ? (
                      <>
                        <Edit className="w-4 h-4 mr-2" />
                        Update Resource
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Publish Resource
                      </>
                    )}
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
