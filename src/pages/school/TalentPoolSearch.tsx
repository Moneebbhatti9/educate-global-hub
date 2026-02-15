import { useState, useEffect } from "react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Users,
  MapPin,
  Briefcase,
  GraduationCap,
  Bookmark,
  BookmarkCheck,
  Send,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  UserSearch,
  Heart,
} from "lucide-react";
import { toast } from "sonner";
import {
  talentPoolAPI,
  TalentPoolTeacher,
  SavedTeacher,
  SearchParams,
} from "@/apis/talentPool";

const TalentPoolSearch = () => {
  // Filter state
  const [subject, setSubject] = useState("");
  const [country, setCountry] = useState("");
  const [qualification, setQualification] = useState("");
  const [minExperience, setMinExperience] = useState("");
  const [filterAvailability, setFilterAvailability] = useState("");

  // Results state
  const [teachers, setTeachers] = useState<TalentPoolTeacher[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });
  const [searchLoading, setSearchLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Saved teachers state
  const [savedTeachers, setSavedTeachers] = useState<SavedTeacher[]>([]);
  const [savedTeacherIds, setSavedTeacherIds] = useState<Set<string>>(
    new Set()
  );
  const [savedLoading, setSavedLoading] = useState(false);

  // Invite dialog state
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteTarget, setInviteTarget] = useState<TalentPoolTeacher | null>(
    null
  );
  const [inviteMessage, setInviteMessage] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);

  // Active tab
  const [activeTab, setActiveTab] = useState("search");

  // Load saved teachers on mount (needed to show save/unsave state)
  useEffect(() => {
    fetchSavedTeachers();
  }, []);

  const fetchSavedTeachers = async () => {
    setSavedLoading(true);
    try {
      const response = await talentPoolAPI.getSavedTeachers();
      if (response.success) {
        const saved = response.savedTeachers || [];
        setSavedTeachers(saved);
        setSavedTeacherIds(new Set(saved.map((t) => t.id)));
      }
    } catch {
      // Silently fail on initial load
    } finally {
      setSavedLoading(false);
    }
  };

  const handleSearch = async (page = 1) => {
    setSearchLoading(true);
    setHasSearched(true);
    try {
      const params: SearchParams = {
        page,
        limit: pagination.limit,
      };
      if (subject.trim()) params.subject = subject.trim();
      if (country.trim()) params.country = country.trim();
      if (qualification && qualification !== "all")
        params.qualification = qualification;
      if (minExperience) params.minExperience = parseInt(minExperience, 10);
      if (filterAvailability && filterAvailability !== "all")
        params.availabilityStatus = filterAvailability;

      const response = await talentPoolAPI.search(params);
      if (response.success) {
        setTeachers(response.teachers || []);
        setPagination(
          response.pagination || {
            page: 1,
            limit: 12,
            total: 0,
            totalPages: 0,
          }
        );
      }
    } catch {
      toast.error("Failed to search talent pool");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSubject("");
    setCountry("");
    setQualification("");
    setMinExperience("");
    setFilterAvailability("");
  };

  const handleSaveTeacher = async (teacher: TalentPoolTeacher) => {
    try {
      if (savedTeacherIds.has(teacher.id)) {
        await talentPoolAPI.unsaveTeacher(teacher.id);
        setSavedTeacherIds((prev) => {
          const next = new Set(prev);
          next.delete(teacher.id);
          return next;
        });
        setSavedTeachers((prev) => prev.filter((t) => t.id !== teacher.id));
        toast.success("Teacher removed from shortlist");
      } else {
        await talentPoolAPI.saveTeacher(teacher.id);
        setSavedTeacherIds((prev) => new Set(prev).add(teacher.id));
        toast.success("Teacher saved to shortlist");
        // Refresh saved list if on shortlist tab
        if (activeTab === "shortlist") {
          fetchSavedTeachers();
        }
      }
    } catch {
      toast.error("Failed to update shortlist");
    }
  };

  const handleInviteClick = (teacher: TalentPoolTeacher) => {
    setInviteTarget(teacher);
    setInviteMessage("");
    setInviteDialogOpen(true);
  };

  const handleSendInvite = async () => {
    if (!inviteTarget) return;
    setInviteLoading(true);
    try {
      const response = await talentPoolAPI.inviteToApply(
        inviteTarget.id,
        undefined,
        inviteMessage.trim() || undefined
      );
      if (response.success) {
        toast.success("Invitation sent successfully");
        setInviteDialogOpen(false);
        setInviteTarget(null);
        setInviteMessage("");
      }
    } catch {
      toast.error("Failed to send invitation");
    } finally {
      setInviteLoading(false);
    }
  };

  const handleRemoveFromShortlist = async (teacherId: string) => {
    try {
      await talentPoolAPI.unsaveTeacher(teacherId);
      setSavedTeacherIds((prev) => {
        const next = new Set(prev);
        next.delete(teacherId);
        return next;
      });
      setSavedTeachers((prev) => prev.filter((t) => t.id !== teacherId));
      toast.success("Teacher removed from shortlist");
    } catch {
      toast.error("Failed to remove from shortlist");
    }
  };

  const getAvailabilityBadge = (status: string) => {
    switch (status) {
      case "available":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Available
          </Badge>
        );
      case "open_to_offers":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Open to Offers
          </Badge>
        );
      case "not_looking":
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            Not Looking
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const TeacherCard = ({
    teacher,
    showRemove = false,
    savedNotes,
  }: {
    teacher: TalentPoolTeacher;
    showRemove?: boolean;
    savedNotes?: string;
  }) => (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1 min-w-0">
            <CardTitle className="text-base truncate">{teacher.name}</CardTitle>
            <div className="flex flex-wrap gap-1">
              <Badge variant="secondary" className="text-xs">
                {teacher.subject || "Not specified"}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {teacher.qualification || "Not specified"}
              </Badge>
            </div>
          </div>
          {getAvailabilityBadge(teacher.availabilityStatus)}
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 flex-shrink-0" />
            <span>
              {teacher.experience}{" "}
              {teacher.experience === 1 ? "year" : "years"} experience
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">
              {teacher.location || "Location not specified"}
            </span>
          </div>
          {teacher.bio && (
            <p className="text-xs line-clamp-3">
              {teacher.bio.length > 150
                ? `${teacher.bio.substring(0, 150)}...`
                : teacher.bio}
            </p>
          )}
          {savedNotes && (
            <div className="mt-2 p-2 bg-muted/30 rounded text-xs">
              <span className="font-medium">Notes:</span> {savedNotes}
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            className="flex-1"
            onClick={() => handleInviteClick(teacher)}
          >
            <Send className="w-3.5 h-3.5 mr-1.5" />
            Invite to Apply
          </Button>
          {showRemove ? (
            <Button
              size="sm"
              variant="outline"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => handleRemoveFromShortlist(teacher.id)}
            >
              <X className="w-3.5 h-3.5 mr-1.5" />
              Remove
            </Button>
          ) : (
            <Button
              size="sm"
              variant={savedTeacherIds.has(teacher.id) ? "secondary" : "outline"}
              onClick={() => handleSaveTeacher(teacher)}
            >
              {savedTeacherIds.has(teacher.id) ? (
                <>
                  <BookmarkCheck className="w-3.5 h-3.5 mr-1.5" />
                  Saved
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5 mr-1.5" />
                  Save
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const SkeletonCard = () => (
    <Card className="animate-pulse">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="h-5 bg-muted rounded w-3/4" />
            <div className="flex gap-1">
              <div className="h-5 bg-muted rounded w-16" />
              <div className="h-5 bg-muted rounded w-20" />
            </div>
          </div>
          <div className="h-5 bg-muted rounded w-20" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-1/2" />
          <div className="h-4 bg-muted rounded w-2/3" />
          <div className="h-12 bg-muted rounded w-full" />
        </div>
        <div className="flex gap-2 pt-2">
          <div className="h-8 bg-muted rounded flex-1" />
          <div className="h-8 bg-muted rounded w-20" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout role="school">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Talent Pool</h1>
          <p className="text-muted-foreground">
            Search and connect with teachers looking for opportunities
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="search" className="gap-2">
              <Search className="w-4 h-4" />
              Search
            </TabsTrigger>
            <TabsTrigger value="shortlist" className="gap-2">
              <Heart className="w-4 h-4" />
              Shortlist
              {savedTeachers.length > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                >
                  {savedTeachers.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Search Tab */}
          <TabsContent value="search" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Subject</Label>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                      <Input
                        placeholder="e.g. Mathematics"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Country</Label>
                    <Input
                      placeholder="e.g. United Kingdom"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Qualification</Label>
                    <Select
                      value={qualification}
                      onValueChange={setQualification}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="Bachelor">Bachelor</SelectItem>
                        <SelectItem value="Master">Master</SelectItem>
                        <SelectItem value="PhD">PhD</SelectItem>
                        <SelectItem value="Diploma">Diploma</SelectItem>
                        <SelectItem value="Certificate">Certificate</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">
                      Min. Experience (years)
                    </Label>
                    <Input
                      type="number"
                      placeholder="0"
                      min="0"
                      value={minExperience}
                      onChange={(e) => setMinExperience(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Availability</Label>
                    <Select
                      value={filterAvailability}
                      onValueChange={setFilterAvailability}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="open_to_offers">
                          Open to Offers
                        </SelectItem>
                        <SelectItem value="not_looking">Not Looking</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end gap-2">
                    <Button onClick={() => handleSearch(1)} className="flex-1">
                      <Search className="w-4 h-4 mr-1.5" />
                      Search
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleClearFilters}
                      title="Clear filters"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            {searchLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : teachers.length > 0 ? (
              <>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    Showing {teachers.length} of {pagination.total} teachers
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {teachers.map((teacher) => (
                    <TeacherCard key={teacher.id} teacher={teacher} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSearch(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSearch(pagination.page + 1)}
                      disabled={pagination.page >= pagination.totalPages}
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                )}
              </>
            ) : hasSearched ? (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center text-muted-foreground">
                    <UserSearch className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No teachers found</p>
                    <p className="text-sm mt-1">
                      No teachers found matching your criteria. Try adjusting
                      your filters.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">
                      Search the talent pool
                    </p>
                    <p className="text-sm mt-1">
                      Use the filters above to find teachers looking for
                      opportunities.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Shortlist Tab */}
          <TabsContent value="shortlist" className="space-y-6">
            {savedLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : savedTeachers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedTeachers.map((teacher) => (
                  <TeacherCard
                    key={teacher.id}
                    teacher={teacher}
                    showRemove
                    savedNotes={teacher.notes}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center text-muted-foreground">
                    <Bookmark className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No saved teachers</p>
                    <p className="text-sm mt-1">
                      You haven't saved any teachers yet. Search the talent pool
                      to find and save teachers.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Invite Dialog */}
        <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Invite to Apply</DialogTitle>
              <DialogDescription>
                Send an invitation to{" "}
                <span className="font-medium text-foreground">
                  {inviteTarget?.name}
                </span>{" "}
                to apply for a position at your school.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="invite-message">
                  Message (optional)
                </Label>
                <Textarea
                  id="invite-message"
                  placeholder="Add a personal message to the invitation..."
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setInviteDialogOpen(false)}
                disabled={inviteLoading}
              >
                Cancel
              </Button>
              <Button onClick={handleSendInvite} disabled={inviteLoading}>
                {inviteLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Invitation
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default TalentPoolSearch;
