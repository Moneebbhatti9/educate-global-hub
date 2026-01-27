import { useState, useEffect } from "react";
import { useFormValidation } from "@/hooks/useFormValidation";
import { useAdmin } from "@/hooks/useAdmin";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CountryDropdown } from "@/components/ui/country-dropdown";
import { PhoneInput } from "@/components/ui/phone-input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Mail, Shield } from "lucide-react";
import {
  CURRICULUM_OPTIONS,
  SCHOOL_SIZE_OPTIONS,
  SCHOOL_TYPE_OPTIONS,
  GENDER_TYPE_OPTIONS,
  AGE_GROUP_OPTIONS,
  QUALIFICATION_OPTIONS,
} from "@/types/profiles";

// Schema for editing users (excluding role and email)
const editUserSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phoneNumber: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  zipCode: z.string().optional(),
  address: z.string().optional(),
  // Teacher-specific fields
  qualification: z
    .enum(["Bachelor", "Master", "PhD", "Diploma", "Certificate", "Other"])
    .optional(),
  subject: z.string().optional(),
  pgce: z.boolean().optional(),
  yearsOfTeachingExperience: z.number().min(0).optional(),
  professionalBio: z.string().optional(),
  keyAchievements: z.array(z.string()).optional(),
  certifications: z.array(z.string()).optional(),
  additionalQualifications: z.array(z.string()).optional(),
  // School-specific fields
  schoolName: z.string().optional(),
  schoolEmail: z.string().email("Invalid school email").optional(),
  schoolContactNumber: z.string().optional(),
  curriculum: z.array(z.string()).optional(),
  schoolSize: z
    .enum([
      "Small (1-500 students)",
      "Medium (501-1000 students)",
      "Large (1001+ students)",
    ])
    .optional(),
  schoolType: z
    .enum([
      "Public",
      "Private",
      "International",
      "Charter",
      "Religious",
      "Other",
    ])
    .optional(),
  genderType: z.enum(["Boys Only", "Girls Only", "Mixed"]).optional(),
  ageGroup: z.array(z.string()).optional(),
  schoolWebsite: z.string().optional(),
  aboutSchool: z.string().optional(),
  // Recruiter/Supplier fields
  companyName: z.string().optional(),
  industry: z.string().optional(),
  position: z.string().optional(),
  products: z.array(z.string()).optional(),
  website: z.string().optional(),
});

interface EditUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (userData: any) => void;
  userId: string | null;
}

export const EditUserModal = ({
  open,
  onOpenChange,
  onSave,
  userId,
}: EditUserModalProps) => {
  const [userData, setUserData] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const { getUserById, getUserProfile, updateUser, updateUserProfile } =
    useAdmin();

  const form = useFormValidation({
    schema: editUserSchema,
    defaultValues: {},
  });

  // Fetch user data when modal opens
  useEffect(() => {
    if (open && userId) {
      fetchUserData();
    }
  }, [open, userId]);

  const fetchUserData = async () => {
    if (!userId) return;

    setIsFetching(true);
    try {
      // Fetch basic user data
      const userResponse = await getUserById(userId);
      const user = userResponse.data;
      setUserData(user);

      // Fetch profile data if available
      try {
        const profileResponse = await getUserProfile(userId);
        const profile = profileResponse.data.profile;
        setProfileData(profile);

        // Set form values with combined data
        const formData = {
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          phoneNumber: (profile as any)?.phoneNumber || "",
          country: (profile as any)?.country || "",
          city: (profile as any)?.city || "",
          province: (profile as any)?.province || "",
          zipCode: (profile as any)?.zipCode || "",
          address: (profile as any)?.address || "",
          // Teacher fields
          qualification: (profile as any)?.qualification || "",
          subject: (profile as any)?.subject || "",
          pgce: (profile as any)?.pgce || false,
          yearsOfTeachingExperience: (profile as any)?.yearsOfTeachingExperience || 0,
          professionalBio: (profile as any)?.professionalBio || "",
          keyAchievements: (profile as any)?.keyAchievements || [],
          certifications: (profile as any)?.certifications || [],
          additionalQualifications: (profile as any)?.additionalQualifications || [],
          // School fields
          schoolName: (profile as any)?.schoolName || "",
          schoolEmail: (profile as any)?.schoolEmail || "",
          schoolContactNumber: (profile as any)?.schoolContactNumber || "",
          curriculum: (profile as any)?.curriculum || [],
          schoolSize: (profile as any)?.schoolSize || "",
          schoolType: (profile as any)?.schoolType || "",
          genderType: (profile as any)?.genderType || "",
          ageGroup: (profile as any)?.ageGroup || [],
          schoolWebsite: (profile as any)?.schoolWebsite || "",
          aboutSchool: (profile as any)?.aboutSchool || "",
          // Recruiter/Supplier fields
          companyName: (profile as any)?.companyName || "",
          industry: (profile as any)?.industry || "",
          position: (profile as any)?.position || "",
          products: (profile as any)?.products || [],
          website: (profile as any)?.website || "",
        };

        form.reset(formData);
      } catch (profileError) {
        
        // Set form with basic user data only
        form.reset({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (data: any) => {
    if (!userId) return;

    setIsLoading(true);
    try {
      // Update basic user data
      await updateUser(userId, {
        firstName: data.firstName,
        lastName: data.lastName,
      });

      // Update profile data if it exists
      if (profileData) {
        const profileUpdateData = {
          ...data,
          // Remove user-level fields
          firstName: undefined,
          lastName: undefined,
        };

        await updateUserProfile(userId, profileUpdateData);
      }

      onSave(data);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!userData) {
    return null;
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "teacher":
        return "bg-brand-primary text-white";
      case "school":
        return "bg-brand-accent-green text-white";
      case "recruiter":
        return "bg-brand-secondary text-white";
      case "supplier":
        return "bg-brand-accent-orange text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit User Profile</DialogTitle>
          <DialogDescription>
            Update user information for {userData.firstName} {userData.lastName}
          </DialogDescription>
        </DialogHeader>

        {isFetching ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="ml-2">Loading user data...</span>
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              {/* User Header - Read Only */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={userData.avatar} />
                    <AvatarFallback>
                      {`${userData.firstName} ${userData.lastName}`
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">
                      {userData.firstName} {userData.lastName}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {userData.email}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 mt-2">
                      <Badge className={getRoleColor(userData.role)}>
                        <Shield className="w-3 h-3 mr-1" />
                        {userData.role.charAt(0).toUpperCase() +
                          userData.role.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Account Information - Editable */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">User Account</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Teacher-specific fields */}
              {userData.role === "teacher" && (
                <>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <PhoneInput
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Enter phone number"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <CountryDropdown
                                onChange={(country) =>
                                  field.onChange(country.name)
                                }
                                defaultValue={field.value}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="province"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Province/State</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Zip Code</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Professional Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="qualification"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Qualification</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select qualification" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {QUALIFICATION_OPTIONS.map((option) => (
                                  <SelectItem key={option} value={option}>
                                    {option}
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
                            <FormLabel>Subject</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="yearsOfTeachingExperience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Years of Experience</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value) || 0)
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="pgce"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>PGCE Qualified</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="professionalBio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Professional Bio</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}

              {/* School-specific fields */}
              {userData.role === "school" && (
                <>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">School Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="schoolName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>School Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="schoolContactNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>School Contact Number</FormLabel>
                            <FormControl>
                              <PhoneInput
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Enter contact number"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <CountryDropdown
                                onChange={(country) =>
                                  field.onChange(country.name)
                                }
                                defaultValue={field.value}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="province"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Province/State</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Zip Code</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="schoolWebsite"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>School Website</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="aboutSchool"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>About School</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      School Configuration
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="curriculum"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Curriculum</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={(value) => {
                                  const currentValues = Array.isArray(
                                    field.value
                                  )
                                    ? field.value
                                    : [];
                                  if (!currentValues.includes(value)) {
                                    field.onChange([...currentValues, value]);
                                  }
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select curriculum" />
                                </SelectTrigger>
                                <SelectContent>
                                  {CURRICULUM_OPTIONS.map((option) => (
                                    <SelectItem key={option} value={option}>
                                      {option}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            {Array.isArray(field.value) &&
                              field.value.length > 0 && (
                                <div className="mt-2 space-y-2">
                                  {field.value.map((item, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center space-x-2"
                                    >
                                      <span className="text-sm bg-muted px-2 py-1 rounded">
                                        {item}
                                      </span>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          const newValues = (field.value || []).filter(
                                            (_, i) => i !== index
                                          );
                                          field.onChange(newValues);
                                        }}
                                      >
                                        ×
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="schoolSize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>School Size</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select school size" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {SCHOOL_SIZE_OPTIONS.map((option) => (
                                  <SelectItem key={option} value={option}>
                                    {option}
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
                        name="schoolType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>School Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select school type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {SCHOOL_TYPE_OPTIONS.map((option) => (
                                  <SelectItem key={option} value={option}>
                                    {option}
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
                        name="genderType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select gender type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {GENDER_TYPE_OPTIONS.map((option) => (
                                  <SelectItem key={option} value={option}>
                                    {option}
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
                        name="ageGroup"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Age Groups</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={(value) => {
                                  const currentValues = Array.isArray(
                                    field.value
                                  )
                                    ? field.value
                                    : [];
                                  if (!currentValues.includes(value)) {
                                    field.onChange([...currentValues, value]);
                                  }
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select age group" />
                                </SelectTrigger>
                                <SelectContent>
                                  {AGE_GROUP_OPTIONS.map((option) => (
                                    <SelectItem key={option} value={option}>
                                      {option}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            {Array.isArray(field.value) &&
                              field.value.length > 0 && (
                                <div className="mt-2 space-y-2">
                                  {field.value.map((item, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center space-x-2"
                                    >
                                      <span className="text-sm bg-muted px-2 py-1 rounded">
                                        {item}
                                      </span>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          const newValues = (field.value || []).filter(
                                            (_, i) => i !== index
                                          );
                                          field.onChange(newValues);
                                        }}
                                      >
                                        ×
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Recruiter-specific fields */}
              {userData.role === "recruiter" && (
                <>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <PhoneInput
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Enter phone number"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <CountryDropdown
                                onChange={(country) =>
                                  field.onChange(country.name)
                                }
                                defaultValue={field.value}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="province"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Province/State</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Zip Code</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Company Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="industry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Industry</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="position"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Position</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Supplier-specific fields */}
              {userData.role === "supplier" && (
                <>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <PhoneInput
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Enter phone number"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <CountryDropdown
                                onChange={(country) =>
                                  field.onChange(country.name)
                                }
                                defaultValue={field.value}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="province"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Province/State</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Zip Code</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Company Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Website</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="products"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Products/Services</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Enter products or services (one per line)"
                              value={
                                Array.isArray(field.value)
                                  ? field.value.join("\n")
                                  : ""
                              }
                              onChange={(e) => {
                                const products = e.target.value
                                  .split("\n")
                                  .filter((p) => p.trim());
                                field.onChange(products);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                >
                  {isLoading ? "Updating..." : "Update User"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};
