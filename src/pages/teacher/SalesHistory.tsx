import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { salesAPI } from "@/apis/sales";
import {
  DollarSign,
  Search,
  Filter,
  RefreshCw,
  Calendar,
  Download,
  User,
  Globe,
  ShoppingCart,
  Package,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DashboardLayout from "@/layout/DashboardLayout";
import { Link } from "react-router-dom";

// Currency symbols
const CURRENCY_SYMBOLS: Record<string, string> = {
  GBP: "£",
  USD: "$",
  EUR: "€",
  PKR: "Rs",
};

const SalesHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currencyFilter, setCurrencyFilter] = useState<string>("all");
  const [page, setPage] = useState(1);

  // Fetch sales data
  const { data: salesData, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["mySales", page, statusFilter, currencyFilter],
    queryFn: async () => {
      const params: any = {
        page,
        limit: 20,
      };

      if (statusFilter && statusFilter !== "all") {
        params.status = statusFilter;
      }
      if (currencyFilter && currencyFilter !== "all") {
        params.currency = currencyFilter;
      }

      const response = await salesAPI.getMySales(params);
      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to fetch sales");
      }
      return response.data;
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "refunded":
        return <Badge className="bg-red-100 text-red-800">Refunded</Badge>;
      case "disputed":
        return <Badge className="bg-yellow-100 text-yellow-800">Disputed</Badge>;
      case "pending":
        return <Badge className="bg-blue-100 text-blue-800">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Filter sales based on search
  const filteredSales = salesData?.sales?.filter((sale: any) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      sale.resource?.title?.toLowerCase().includes(search) ||
      sale.buyer?.name?.toLowerCase().includes(search) ||
      sale.buyer?.email?.toLowerCase().includes(search)
    );
  });

  // Calculate totals
  const totalEarnings = salesData?.totalEarnings || {};

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Sales History</h1>
            <p className="text-muted-foreground mt-2">
              View and track all your resource sales
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/dashboard/teacher/earnings">
                <DollarSign className="w-4 h-4 mr-2" />
                Earnings Dashboard
              </Link>
            </Button>
            <Button
              variant="outline"
              onClick={() => refetch()}
              disabled={isRefetching}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefetching ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {salesData?.pagination?.total || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                All time
              </p>
            </CardContent>
          </Card>

          {Object.entries(totalEarnings).map(([currency, amount]) => (
            <Card key={currency}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Earnings ({currency})
                </CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {CURRENCY_SYMBOLS[currency]}
                  {((amount as number) / 100).toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Net earnings
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by resource or buyer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                  <SelectItem value="disputed">Disputed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>

              <Select value={currencyFilter} onValueChange={setCurrencyFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Currencies" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Currencies</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="PKR">PKR (Rs)</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setCurrencyFilter("all");
                }}
              >
                <Filter className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sales Table */}
        <Card>
          <CardHeader>
            <CardTitle>Sales</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading sales...</p>
              </div>
            ) : filteredSales && filteredSales.length > 0 ? (
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Resource</TableHead>
                      <TableHead>Buyer</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Earnings</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSales.map((sale: any) => (
                      <TableRow key={sale._id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            {new Date(sale.saleDate).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {sale.resource?.coverPhoto && (
                              <img
                                src={sale.resource.coverPhoto}
                                alt={sale.resource.title}
                                className="w-10 h-10 rounded object-cover"
                              />
                            )}
                            <div>
                              <div className="font-medium">
                                {sale.resource?.title || "Unknown Resource"}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {sale.resource?.type}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium">{sale.buyer?.name}</div>
                              {sale.country && (
                                <div className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Globe className="w-3 h-3" />
                                  {sale.country}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {sale.price}
                        </TableCell>
                        <TableCell className="text-right text-green-600 font-semibold">
                          {sale.earnings}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {sale.royaltyRate}
                          </Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(sale.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {salesData?.pagination && salesData.pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Showing {(page - 1) * 20 + 1} to{" "}
                      {Math.min(page * 20, salesData.pagination.total)} of{" "}
                      {salesData.pagination.total} results
                    </p>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page + 1)}
                        disabled={page >= salesData.pagination.totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No sales found</p>
                <Button variant="link" asChild className="mt-2">
                  <Link to="/dashboard/teacher/upload-resource">
                    Upload a resource to start selling
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SalesHistory;
