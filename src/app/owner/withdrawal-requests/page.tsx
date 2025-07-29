
'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"

const initialWithdrawalRequests = [
    { id: 'WDR456', user: 'Jane Smith', amount: '₹200', method: 'UPI (jane@upi)', date: '2023-10-26 09:00 AM' },
    { id: 'WDR457', user: 'WinnerGG', amount: '₹1200', method: 'Bank Transfer', date: '2023-10-27 02:15 PM' },
    { id: 'WDR458', user: 'NewUser24', amount: '₹150', method: 'UPI (new@upi)', date: '2023-10-29 10:00 AM' },
]

export default function OwnerWithdrawalRequestsPage() {
  const [requests, setRequests] = useState(initialWithdrawalRequests);

  const handleAction = (id: string) => {
    setRequests(prev => prev.filter(req => req.id !== id));
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Withdrawal Requests</h2>
      </div>
       <Card>
        <CardHeader>
          <CardTitle>Pending Withdrawals</CardTitle>
          <CardDescription>Review and approve or reject user withdrawal requests.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell>{req.user}</TableCell>
                  <TableCell className="font-bold">{req.amount}</TableCell>
                  <TableCell>{req.method}</TableCell>
                  <TableCell>{req.date}</TableCell>
                  <TableCell className="flex gap-2">
                     <Button variant="ghost" size="icon" className="text-green-500 hover:text-green-600 hover:bg-green-500/10" onClick={() => handleAction(req.id)}>
                        <Check className="h-5 w-5" />
                    </Button>
                     <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-500/10" onClick={() => handleAction(req.id)}>
                        <X className="h-5 w-5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
