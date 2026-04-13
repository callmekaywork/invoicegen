"use client";

import { AppSettings, Invoice } from "@/lib/types";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import InvoiceForm from "@/components/InvoiceForm";
import InvoiceList from "@/components/InvoiceList";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MinimalTemplate, TechnicalTemplate } from "@/components/Templates";

const STORAGE_KEY = "square_invoice_history";
const SETTINGS_KEY = "square_invoice_settings";

const DEFAULT_SETTINGS: AppSettings = {
  defaultSender: {
    name: "Your Company Name",
    email: "hello@company.com",
    address: "123 Business St\nCity, Country",
  },
  clientHistory: [],
};

export default function Home() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [view, setView] = useState<"list" | "form">("list");
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const templateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedInvoices = localStorage.getItem(STORAGE_KEY);
    if (savedInvoices) {
      try {
        setInvoices(JSON.parse(savedInvoices));
      } catch (e) {
        console.error("Failed to parse invoices", e);
      }
    }

    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
  }, []);

  const saveInvoices = (newInvoices: Invoice[]) => {
    setInvoices(newInvoices);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newInvoices));
  };

  const saveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
  };

  const handleSave = (invoice: Invoice) => {
    // Update client history if new client
    const clientExists = settings.clientHistory.some(
      (c) => c.email === invoice.clientEmail,
    );
    if (!clientExists && invoice.clientEmail) {
      const newHistory = [
        {
          name: invoice.clientName,
          email: invoice.clientEmail,
          address: invoice.clientAddress,
        },
        ...settings.clientHistory,
      ].slice(0, 10); // Keep last 10
      saveSettings({ ...settings, clientHistory: newHistory });
    }

    // Update default sender if it's a new invoice and sender info was changed
    if (!editingInvoice) {
      saveSettings({
        ...settings,
        defaultSender: {
          name: invoice.senderName,
          email: invoice.senderEmail,
          address: invoice.senderAddress,
          logoUrl: invoice.logoUrl,
        },
      });
    }

    if (editingInvoice) {
      saveInvoices(
        invoices.map((inv) => (inv.id === invoice.id ? invoice : inv)),
      );
    } else {
      saveInvoices([invoice, ...invoices]);
    }
    setView("list");
    setEditingInvoice(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this invoice?")) {
      saveInvoices(invoices.filter((inv) => inv.id !== id));
    }
  };

  const handleExport = async (invoice: Invoice) => {
    setPreviewInvoice(invoice);
    // Wait for dialog to open and template to render
    setTimeout(async () => {
      if (!templateRef.current) return;

      setIsExporting(true);
      try {
        // Find all page divs inside the template
        const pageDivs = templateRef.current.querySelectorAll(
          ".aspect-\\[1\\/1\\.414\\]",
        );
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "px",
        });

        for (let i = 0; i < pageDivs.length; i++) {
          const pageDiv = pageDivs[i] as HTMLElement;
          const canvas = await html2canvas(pageDiv, {
            scale: 2,
            useCORS: true,
            backgroundColor:
              invoice.backgroundColor ||
              (invoice.template === "technical" ? "#E4E3E0" : "#ffffff"),
          });

          const imgData = canvas.toDataURL("image/png");
          const imgWidth = canvas.width / 2;
          const imgHeight = canvas.height / 2;

          if (i > 0) {
            pdf.addPage([imgWidth, imgHeight], "portrait");
          } else {
            // Set first page size
            pdf.deletePage(1);
            pdf.addPage([imgWidth, imgHeight], "portrait");
          }

          pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        }

        pdf.save(`invoice-${invoice.invoiceNumber}.pdf`);
      } catch (error) {
        console.error("PDF generation failed", error);
      } finally {
        setIsExporting(false);
        setPreviewInvoice(null);
      }
    }, 500);
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="min-h-screen bg-white">
        <div className="p-4 md:p-8 lg:p-12 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-5xl font-mono font-black uppercase tracking-tighter leading-none mb-2 text-blue-700">
                  Govlead<span className="text-zinc-400">Invoice</span>
                </h1>
                <p className="text-sm font-mono uppercase opacity-50 tracking-widest">
                  Minimalist Billing System
                </p>
              </div>
              <div className="flex gap-4 font-mono text-xs uppercase">
                <div className="flex flex-col">
                  <span className="opacity-40">Status</span>
                  <span className="font-bold">Local Storage Mode</span>
                </div>
                <div className="flex flex-col">
                  <span className="opacity-40">Version</span>
                  <span className="font-bold">1.0.0</span>
                </div>
              </div>
            </header>

            {view === "list" ? (
              <InvoiceList
                invoices={invoices}
                onEdit={(inv) => {
                  setEditingInvoice(inv);
                  setView("form");
                }}
                onDelete={handleDelete}
                onExport={handleExport}
                onCreateNew={() => {
                  setEditingInvoice(null);
                  setView("form");
                }}
              />
            ) : (
              <InvoiceForm
                initialData={editingInvoice}
                settings={settings}
                onSave={handleSave}
                onCancel={() => {
                  setView("list");
                  setEditingInvoice(null);
                }}
                onPreview={(inv) => {
                  setPreviewInvoice(inv);
                }}
              />
            )}

            <Dialog
              open={!!previewInvoice}
              onOpenChange={(open) => !open && setPreviewInvoice(null)}
            >
              <DialogContent className="max-w-212.5 p-0 rounded-none border-black overflow-hidden bg-zinc-100">
                <DialogHeader className="p-4 bg-white border-b border-black flex flex-row items-center justify-between">
                  <DialogTitle className="font-mono uppercase text-sm">
                    Export Preview
                  </DialogTitle>
                  <div className="flex gap-2">
                    <Button
                      disabled={isExporting}
                      onClick={() =>
                        previewInvoice && handleExport(previewInvoice)
                      }
                      className="rounded-none bg-black text-white h-8 text-xs px-4"
                    >
                      {isExporting ? "Generating..." : "Download PDF"}
                    </Button>
                  </div>
                </DialogHeader>
                <div className="p-8 overflow-y-auto max-h-[80vh] flex justify-center bg-zinc-100">
                  {previewInvoice && (
                    <div className="shadow-2xl">
                      {previewInvoice.template === "minimal" ? (
                        <MinimalTemplate
                          ref={templateRef}
                          invoice={previewInvoice}
                        />
                      ) : (
                        <TechnicalTemplate
                          ref={templateRef}
                          invoice={previewInvoice}
                        />
                      )}
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <footer className="mt-20 py-8 border-t border-zinc-100 text-center">
            <p className="text-[10px] font-mono uppercase opacity-30 tracking-widest">
              &copy; 2024 GovleadInvoice &bull; Squared Off Design System
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
