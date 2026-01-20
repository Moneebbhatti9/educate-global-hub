import { useState, useEffect } from "react";
import DashboardLayout from "@/layout/DashboardLayout";
import { AddUserModal } from "@/components/admin/AddUserModal";
import { EditUserModal } from "@/components/admin/EditUserModal";
import { ViewProfileModal } from "@/components/admin/ViewProfileModal";
import { ChangeStatusModal } from "@/components/admin/ChangeStatusModal";
import { DeleteUserModal } from "@/components/admin/DeleteUserModal";
import { useAdmin } from "@/hooks/useAdmin";
import { UserManagementSkeleton } from "@/components/skeletons/user-management-skeleton";
import { DashboardErrorFallback, SectionErrorFallback } from "@/components/ui/error-fallback";
import { EmptySearchResults } from "@/components/ui/empty-state";
import {
  AdminUser,
  AdminCreateUserRequest,
  AdminUpdateProfileRequest,
} from "@/types/admin";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDropdownOptions } from "@/components/ui/dynamic-select";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Filter,
  UserPlus,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Download,
  Users,
  Building2,
  UserCheck,
  Truck,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState<AdminUser[]>([]);

  // Dynamic dropdown options
  const { data: userRoleOptions, isLoading: loadingUserRoles } = useDropdownOptions("userRole");
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  // Modal states
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [viewProfileOpen, setViewProfileOpen] = useState(false);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [changeStatusOpen, setChangeStatusOpen] = useState(false);
  const [deleteUserOpen, setDeleteUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  const {
    getAllUsers,
    deleteUser,
    changeUserStatus,
    exportUsers,
    createUser,
    updateUser,
    isLoading,
  } = useAdmin();

  // Fetch users on component mount and when filters change
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers({
          page: currentPage,
          limit: 10,
          search: searchTerm,
          role: roleFilter !== "all" ? roleFilter : undefined,
          status: statusFilter !== "all" ? statusFilter : undefined,
        });
         // Debug log
         // Debug log
        setUsers(response.data.data);
        setPagination(response.data.pagination);
        // Show success toast for first load
        if (
          currentPage === 1 &&
          !searchTerm &&
          roleFilter === "all" &&
          statusFilter === "all"
        ) {
          // Only show toast on initial load, not on filter changes
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, [currentPage, searchTerm, roleFilter, statusFilter, getAllUsers]);

  // Handle export functionality
  // const handleExport = async () => {
  //   try {
  //     const blob = await exportUsers({
  //       format: "csv",
  //       role: roleFilter !== "all" ? roleFilter : undefined,
  //       status: statusFilter !== "all" ? statusFilter : undefined,
  //     });

  //     // Create download link
  //     const url = window.URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = `users-export-${new Date().toISOString().split("T")[0]}.csv`;
  //     document.body.appendChild(a);
  //     a.click();
  //     window.URL.revokeObjectURL(url);
  //     document.body.removeChild(a);
  //   } catch (error) {
  //     console.error("Failed to export users:", error);
  //   }
  // };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "teacher":
        return <Users className="w-4 h-4" />;
      case "school":
        return <Building2 className="w-4 h-4" />;
      case "recruiter":
        return <UserCheck className="w-4 h-4" />;
      case "supplier":
        return <Truck className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-brand-accent-green text-white";
      case "pending":
        return "bg-brand-accent-orange text-white";
      case "inactive":
        return "bg-gray-500 text-white";
      case "suspended":
        return "bg-red-500 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  // Format date function
  const formatDate = (dateString: string | Date) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";

      // Format as "Aug 18, 2025" for join date
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  // Format date and time function for last active
  const formatDateTime = (dateString: string | Date) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";

      // Format as "Aug 21, 2025 at 7:23 AM"
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || (user.status || "pending") === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Modal handlers
  const handleAddUser = async (userData: any) => {
    try {
      await createUser(userData);
      // Refresh users list
      const response = await getAllUsers({
        page: currentPage,
        limit: 10,
        search: searchTerm,
        role: roleFilter !== "all" ? roleFilter : undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
      });
      setUsers(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Failed to add user:", error);
    }
  };

  const handleEditUser = async (userData: any) => {
    try {
      if (selectedUser) {
        const userId = selectedUser.id || selectedUser._id;
        if (userId) {
          // Update basic user data
          await updateUser(userId, {
            firstName: userData.firstName,
            lastName: userData.lastName,
          });

          // Refresh users list
          const response = await getAllUsers({
            page: currentPage,
            limit: 10,
            search: searchTerm,
            role: roleFilter !== "all" ? roleFilter : undefined,
            status: statusFilter !== "all" ? statusFilter : undefined,
          });
          setUsers(response.data.data);
          setPagination(response.data.pagination);
        }
      }
    } catch (error) {
      console.error("Failed to edit user:", error);
    }
  };

  const handleStatusChange = async (
    userId: string,
    newStatus: string,
    reason?: string
  ) => {
    console.log("handleStatusChange called with:", {
      userId,
      newStatus,
      reason,
    }); // Debug log
    try {
      await changeUserStatus(userId, newStatus);
      // Refresh users list
      const response = await getAllUsers({
        page: currentPage,
        limit: 10,
        search: searchTerm,
        role: roleFilter !== "all" ? roleFilter : undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
      });
      setUsers(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Failed to change user status:", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
      // Refresh users list
      const response = await getAllUsers({
        page: currentPage,
        limit: 10,
        search: searchTerm,
        role: roleFilter !== "all" ? roleFilter : undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
      });
      setUsers(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const openViewProfile = (user: AdminUser) => {
    setSelectedUser(user);
    setViewProfileOpen(true);
  };

  const openEditUser = (user: AdminUser) => {
    setSelectedUser(user);
    setEditUserOpen(true);
  };

  const openChangeStatus = (user: AdminUser) => {
     // Debug log
    setSelectedUser(user);
    setChangeStatusOpen(true);
  };

  const openDeleteUser = (user: AdminUser) => {
    
    
    setSelectedUser(user);
    setDeleteUserOpen(true);
  };

  // Show skeleton loader while loading or when no users are loaded yet
  if (isLoading || users.length === 0) {
    return (
      <DashboardLayout role="admin">
        <UserManagementSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
              User Management
            </h1>
            <p className="text-muted-foreground">
              Manage platform users and their account settings.
            </p>
          </div>
          <Button onClick={() => setAddUserOpen(true)} disabled={isLoading}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Search & Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                    disabled={isLoading}
                  />
                  {isLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
              </div>
              <Select
                value={roleFilter}
                onValueChange={setRoleFilter}
                disabled={isLoading || loadingUserRoles}
              >
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder={loadingUserRoles ? "Loading..." : "Filter by role"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {userRoleOptions?.map((option) => (
                    <SelectItem key={option._id} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
                disabled={isLoading}
              >
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              {/* <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                disabled={isLoading}
              >
                <Download className="w-4 h-4 mr-2" />
                {isLoading ? "Exporting..." : "Export"}
              </Button> */}
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Users ({users.length})</CardTitle>
            </div>
            <CardDescription>
              Manage and monitor all platform users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? // Show skeleton rows while loading
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={`skeleton-${index}`}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
                            <div className="space-y-2">
                              <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                              <div className="h-3 w-40 bg-muted rounded animate-pulse" />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="h-6 w-20 bg-muted rounded-full animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-6 w-16 bg-muted rounded-full animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-3 w-24 bg-muted rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-3 w-24 bg-muted rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-3 w-32 bg-muted rounded animate-pulse" />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="h-8 w-8 bg-muted rounded animate-pulse" />
                        </TableCell>
                      </TableRow>
                    ))
                  : filteredUsers.map((user) => (
                      <TableRow key={user.id || user._id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback>
                                {`${user.firstName} ${user.lastName}`
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{`${user.firstName} ${user.lastName}`}</div>
                              <div className="text-sm text-muted-foreground">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${getRoleColor(
                              user.role
                            )} flex items-center space-x-1 w-fit`}
                          >
                            {getRoleIcon(user.role)}
                            <span className="capitalize">{user.role}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={getStatusColor(user.status || "pending")}
                          >
                            {(user.status || "pending")
                              .charAt(0)
                              .toUpperCase() +
                              (user.status || "pending").slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {user.location ? `${user.location}` : "N/A"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(user.createdAt)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDateTime(user.lastActive || user.updatedAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => openViewProfile(user)}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => openEditUser(user)}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => openChangeStatus(user)}
                              >
                                <UserCheck className="w-4 h-4 mr-2" />
                                Change Status
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => openDeleteUser(user)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * 10 + 1} to{" "}
                  {Math.min(currentPage * 10, pagination.total)} of{" "}
                  {pagination.total} results
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={!pagination.hasPrev}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={!pagination.hasNext}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modals */}
        <AddUserModal
          open={addUserOpen}
          onOpenChange={setAddUserOpen}
          onSave={handleAddUser}
          mode="add"
          onSuccess={() => {
            // Refresh users list
            getAllUsers({
              page: currentPage,
              limit: 10,
              search: searchTerm,
              role: roleFilter !== "all" ? roleFilter : undefined,
              status: statusFilter !== "all" ? statusFilter : undefined,
            }).then((response) => {
              setUsers(response.data.data);
              setPagination(response.data.pagination);
            });
          }}
        />

        <EditUserModal
          open={editUserOpen}
          onOpenChange={setEditUserOpen}
          onSave={handleEditUser}
          userId={selectedUser ? (selectedUser.id || (selectedUser as any)._id) : null}
        />

        <ViewProfileModal
          open={viewProfileOpen}
          onOpenChange={setViewProfileOpen}
          userData={selectedUser as any}
        />

        <ChangeStatusModal
          open={changeStatusOpen}
          onOpenChange={setChangeStatusOpen}
          userData={selectedUser}
          onStatusChange={handleStatusChange}
        />

        <DeleteUserModal
          open={deleteUserOpen}
          onOpenChange={setDeleteUserOpen}
          userData={selectedUser}
          onDelete={handleDeleteUser}
        />
      </div>
    </DashboardLayout>
  );
};

export default UserManagement;
