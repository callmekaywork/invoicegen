"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2, Download, FileText, Plus } from "lucide-react";
import { format } from "date-fns";
import { Invoice } from "@/lib/types";

interface InvoiceListProps {
  invoices: Invoice[];
  onEdit: (invoice: Invoice) => void;
  onDelete: (id: string) => void;
  onExport: (invoice: Invoice) => void;
  onCreateNew: () => void;
}

export default function InvoiceList({
  invoices,
  onEdit,
  onDelete,
  onExport,
  onCreateNew,
}: InvoiceListProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-black pb-4">
        <h2 className="text-2xl font-mono font-bold uppercase tracking-tighter">
          Invoice History
        </h2>
        <Button
          onClick={onCreateNew}
          className="rounded-none bg-black text-white hover:bg-zinc-800"
        >
          <Plus className="w-4 h-4 mr-2" /> New Invoice
        </Button>
      </div>

      {invoices.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-zinc-200 rounded-none">
          <FileText className="w-12 h-12 mx-auto text-zinc-300 mb-4" />
          <p className="text-zinc-500 font-mono uppercase text-sm">
            No invoices generated yet
          </p>
        </div>
      ) : (
        <div className="border border-black overflow-hidden">
          <Table>
            <TableHeader className="bg-zinc-50 border-b border-black">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-mono uppercase text-xs text-black">
                  Invoice #
                </TableHead>
                <TableHead className="font-mono uppercase text-xs text-black">
                  Client
                </TableHead>
                <TableHead className="font-mono uppercase text-xs text-black">
                  Date
                </TableHead>
                <TableHead className="font-mono uppercase text-xs text-black">
                  Amount
                </TableHead>
                <TableHead className="font-mono uppercase text-xs text-black text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow
                  key={invoice.id}
                  className="border-b border-zinc-200 last:border-0 hover:bg-zinc-50"
                >
                  <TableCell className="font-mono font-bold">
                    {invoice.invoiceNumber}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{invoice.clientName}</span>
                      <span className="text-xs text-zinc-500">
                        {invoice.clientEmail}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-zinc-600">
                    {format(new Date(invoice.date), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell className="font-mono font-bold">
                    ZAR {invoice.total.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onExport(invoice)}
                        className="rounded-none hover:bg-zinc-200"
                        title="Export PDF"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(invoice)}
                        className="rounded-none hover:bg-zinc-200"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(invoice.id)}
                        className="rounded-none hover:bg-red-50 text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
