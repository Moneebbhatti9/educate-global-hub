import { Calendar, ExternalLink, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Transaction {
  id: string;
  date: string;
  type: 'sale' | 'payout' | 'refund';
  resource?: {
    title: string;
    id: string;
  };
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed' | 'processing';
  buyer?: string;
  method?: string;
  description?: string;
}

interface TransactionTableProps {
  transactions: Transaction[];
  title?: string;
  showActions?: boolean;
  maxRows?: number;
  onViewResource?: (resourceId: string) => void;
  onViewDetails?: (transactionId: string) => void;
  className?: string;
}

export const TransactionTable = ({
  transactions,
  title = "Recent Transactions",
  showActions = true,
  maxRows,
  onViewResource,
  onViewDetails,
  className = ""
}: TransactionTableProps) => {
  const displayTransactions = maxRows ? transactions.slice(0, maxRows) : transactions;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800">Processing</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sale':
        return '💰';
      case 'payout':
        return '📤';
      case 'refund':
        return '↩️';
      default:
        return '📄';
    }
  };

  const getAmountColor = (type: string) => {
    switch (type) {
      case 'sale':
        return 'text-green-600';
      case 'payout':
        return 'text-blue-600';
      case 'refund':
        return 'text-red-600';
      default:
        return 'text-foreground';
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="w-5 h-5" />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                {showActions && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={showActions ? 6 : 5} className="text-center py-8 text-muted-foreground">
                    No transactions found
                  </TableCell>
                </TableRow>
              ) : (
                displayTransactions.map((transaction) => (
                  <TableRow key={transaction.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {transaction.date}
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getTypeIcon(transaction.type)}</span>
                        <span className="capitalize font-medium">
                          {transaction.type}
                        </span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="space-y-1">
                        {transaction.resource ? (
                          <div>
                            <div className="font-medium text-sm">
                              {transaction.resource.title}
                            </div>
                            {transaction.buyer && (
                              <div className="text-xs text-muted-foreground">
                                by {transaction.buyer}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="font-medium text-sm">
                            {transaction.description || 'Transaction'}
                          </div>
                        )}
                        
                        {transaction.method && (
                          <div className="text-xs text-muted-foreground">
                            via {transaction.method}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <span className={`font-semibold ${getAmountColor(transaction.type)}`}>
                        {transaction.type === 'refund' ? '-' : '+'}
                        {transaction.currency}{Math.abs(transaction.amount).toFixed(2)}
                      </span>
                    </TableCell>
                    
                    <TableCell>
                      {getStatusBadge(transaction.status)}
                    </TableCell>
                    
                    {showActions && (
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          {transaction.resource && onViewResource && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onViewResource(transaction.resource!.id)}
                              className="h-8 w-8 p-0"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                          )}
                          
                          {onViewDetails && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onViewDetails(transaction.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Download className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {maxRows && transactions.length > maxRows && (
          <div className="mt-4 text-center">
            <Button variant="outline">
              View All Transactions ({transactions.length})
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};