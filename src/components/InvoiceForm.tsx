"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { EditableField } from "@/components/EditableField";
import {
  Plus,
  Trash2,
  Save,
  X,
  Eye,
  Upload,
  Image as ImageIcon,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Building2,
  History,
  Type,
  Palette,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import { AppSettings, Invoice, InvoiceItem } from "@/lib/types";

interface InvoiceFormProps {
  initialData?: Invoice | null;
  settings: AppSettings;
  onSave: (invoice: Invoice) => void;
  onCancel: () => void;
  onPreview: (invoice: Invoice) => void;
}

const ITEMS_PER_PAGE = 12;
const DEFAULT_LOGO = "/parent_logo.png";

const emptyItem: InvoiceItem = {
  id: "",
  description: "",
  quantity: 1,
  price: 0,
};

export default function InvoiceForm({
  initialData,
  settings,
  onSave,
  onCancel,
  onPreview,
}: InvoiceFormProps) {
  const [invoice, setInvoice] = useState<Invoice>(
    () =>
      initialData || {
        id: uuidv4(),
        invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
        date: new Date().toISOString().split("T")[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        clientName: "",
        clientEmail: "",
        clientAddress: "",
        senderName: settings.defaultSender.name,
        senderEmail: settings.defaultSender.email,
        senderAddress: settings.defaultSender.address,
        items: [{ ...emptyItem, id: uuidv4() }],
        notes: "",
        template: "minimal",
        status: "draft",
        logoUrl: settings.defaultSender.logoUrl || DEFAULT_LOGO,
        total: 0,
        createdAt: new Date().toISOString(),
        fontFamily: "var(--font-sans)",
        primaryColor: "#000000",
        backgroundColor: "#ffffff",
      },
  );

  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetToDefaults = () => {
    setInvoice((prev) => ({
      ...prev,
      senderName: settings.defaultSender.name,
      senderEmail: settings.defaultSender.email,
      senderAddress: settings.defaultSender.address,
      logoUrl: settings.defaultSender.logoUrl || DEFAULT_LOGO,
    }));
  };

  const fonts = [
    { name: "Inter", value: "var(--font-sans)" },
    { name: "Mono", value: "var(--font-mono)" },
    { name: "Serif", value: "serif" },
    { name: "Display", value: "Outfit, sans-serif" },
  ];

  const colors = [
    { name: "Black", value: "#000000" },
    { name: "Blue", value: "#2563eb" },
    { name: "Red", value: "#dc2626" },
    { name: "Green", value: "#16a34a" },
  ];

  const bgColors = [
    { name: "White", value: "#ffffff" },
    { name: "Paper", value: "#fcfcf7" },
    { name: "Zinc", value: "#f4f4f5" },
    { name: "Technical", value: "#E4E3E0" },
  ];

  const calculateTotal = (items: InvoiceItem[]) => {
    return items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  };

  const handleAddItem = () => {
    const newItems = [...invoice.items, { ...emptyItem, id: uuidv4() }];
    setInvoice((prev) => ({
      ...prev,
      items: newItems,
      total: calculateTotal(newItems),
    }));
  };

  const handleRemoveItem = (id: string) => {
    if (invoice.items.length === 1) return;
    const newItems = invoice.items.filter((item) => item.id !== id);
    setInvoice((prev) => ({
      ...prev,
      items: newItems,
      total: calculateTotal(newItems),
    }));
  };

  const handleItemChange = (
    id: string,
    field: keyof InvoiceItem,
    value: string | number,
  ) => {
    const newItems = invoice.items.map((item) =>
      item.id === id ? { ...item, [field]: value } : item,
    );
    setInvoice((prev) => ({
      ...prev,
      items: newItems,
      total: calculateTotal(newItems),
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInvoice({ ...invoice, logoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(invoice);
  };

  // Split items into pages
  const pages = [];
  for (let i = 0; i < invoice.items.length; i += ITEMS_PER_PAGE) {
    pages.push(invoice.items.slice(i, i + ITEMS_PER_PAGE));
  }

  return (
    <div className="flex -mx-4 md:-mx-8 lg:-mx-12 min-h-[calc(100vh-12rem)]">
      {/* Left Sidebar: Information & History */}
      {showLeftSidebar && (
        <div className="w-64 border-r border-black bg-white p-6 flex flex-col gap-8 overflow-y-auto sticky top-0 h-screen">
          <section>
            <div className="flex items-center gap-2 mb-4 opacity-40">
              <Building2 size={16} />
              <h2 className="text-[10px] font-mono uppercase tracking-widest">
                Saved Company
              </h2>
            </div>
            <div className="p-4 border border-black bg-zinc-50 space-y-2 relative group">
              <p className="font-bold text-sm">{settings.defaultSender.name}</p>
              <p className="text-[10px] opacity-60 font-mono">
                {settings.defaultSender.email}
              </p>
              <p className="text-[10px] opacity-60 font-mono whitespace-pre-line">
                {settings.defaultSender.address}
              </p>
              <button
                onClick={resetToDefaults}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-zinc-200"
                title="Apply these defaults"
              >
                <RotateCcw size={12} />
              </button>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4 opacity-40">
              <History size={16} />
              <h2 className="text-[10px] font-mono uppercase tracking-widest">
                Client History
              </h2>
            </div>
            <div className="space-y-2">
              {settings.clientHistory.length === 0 ? (
                <p className="text-[10px] italic opacity-40">
                  No saved clients yet
                </p>
              ) : (
                settings.clientHistory.map((client, i) => (
                  <button
                    key={i}
                    onClick={() =>
                      setInvoice({
                        ...invoice,
                        clientName: client.name,
                        clientEmail: client.email,
                        clientAddress: client.address,
                      })
                    }
                    className="w-full text-left p-3 border border-zinc-200 hover:border-black transition-colors group"
                  >
                    <p className="font-bold text-xs group-hover:underline">
                      {client.name}
                    </p>
                    <p className="text-[10px] opacity-60 font-mono truncate">
                      {client.email}
                    </p>
                  </button>
                ))
              )}
            </div>
          </section>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 px-8 pb-20 overflow-y-auto">
        {/* Sticky Header Controls */}
        <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-black p-4 -mx-8 flex justify-between items-center mb-8">
          <div className="flex gap-4 items-center">
            <button
              onClick={() => setShowLeftSidebar(!showLeftSidebar)}
              className="p-1 hover:bg-zinc-100 transition-colors"
              title={showLeftSidebar ? "Hide History" : "Show History"}
            >
              {showLeftSidebar ? (
                <ChevronLeft size={20} />
              ) : (
                <ChevronRight size={20} />
              )}
            </button>
            <h2 className="text-xl font-mono font-bold uppercase tracking-tighter">
              {initialData ? "Editing" : "Crafting"} Invoice
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setInvoice({ ...invoice, template: "minimal" })}
                className={`px-3 py-1 text-[10px] uppercase font-mono border border-black ${invoice.template === "minimal" ? "bg-black text-white" : "bg-white text-black"}`}
              >
                Minimal
              </button>
              <button
                onClick={() =>
                  setInvoice({ ...invoice, template: "technical" })
                }
                className={`px-3 py-1 text-[10px] uppercase font-mono border border-black ${invoice.template === "technical" ? "bg-black text-white" : "bg-white text-black"}`}
              >
                Technical
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onPreview(invoice)}
              className="rounded-none border-black h-9 text-xs"
            >
              <Eye className="w-3 h-3 mr-2" /> Preview
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="rounded-none border-black h-9 text-xs"
            >
              <X className="w-3 h-3 mr-2" /> Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="rounded-none bg-black text-white hover:bg-zinc-800 h-9 text-xs"
            >
              <Save className="w-3 h-3 mr-2" /> Save
            </Button>
            <button
              onClick={() => setShowRightSidebar(!showRightSidebar)}
              className="p-1 hover:bg-zinc-100 transition-colors ml-2"
              title={
                showRightSidebar ? "Hide Customization" : "Show Customization"
              }
            >
              {showRightSidebar ? (
                <ChevronRight size={20} />
              ) : (
                <ChevronLeft size={20} />
              )}
            </button>
          </div>
        </div>

        {/* A4 Page Representation */}
        <div className="flex flex-col gap-8 items-center">
          {pages.map((pageItems, pageIndex) => (
            <div
              key={pageIndex}
              style={{
                fontFamily: invoice.fontFamily,
                backgroundColor: invoice.backgroundColor,
                color: invoice.primaryColor === "#ffffff" ? "black" : "inherit",
              }}
              className={`w-full max-w-200 aspect-[1/1.414] shadow-2xl border border-zinc-200 relative p-12 flex flex-col ${
                invoice.template === "technical" ? "font-mono" : ""
              }`}
            >
              {/* Page Number Indicator */}
              <div className="absolute top-4 right-4 text-[10px] font-mono opacity-30 uppercase">
                Page {pageIndex + 1} / {pages.length}
              </div>

              {/* Header: Logo & Info */}
              {pageIndex === 0 && (
                <div className="flex justify-between items-start mb-12">
                  <div className="relative group w-32 h-32 border-2 border-dashed border-zinc-200 hover:border-black transition-colors">
                    {invoice.logoUrl ? (
                      <Image
                        src={invoice.logoUrl}
                        alt="Logo"
                        fill
                        className="object-contain p-2"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-zinc-300">
                        <ImageIcon className="w-8 h-8 mb-1" />
                        <span className="text-[8px] uppercase font-mono">
                          Logo
                        </span>
                      </div>
                    )}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] uppercase font-mono"
                    >
                      <Upload className="w-4 h-4 mr-2" /> Change
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleLogoUpload}
                      className="hidden"
                      accept="image/*"
                    />
                  </div>
                  <div className="text-right space-y-4 max-w-75">
                    <EditableField
                      value={invoice.senderName}
                      onChange={(v) =>
                        setInvoice({ ...invoice, senderName: v })
                      }
                      className="text-2xl font-bold tracking-tighter uppercase"
                      placeholder="Company Name"
                      style={{ color: invoice.primaryColor }}
                    />
                    <div className="space-y-1">
                      <EditableField
                        value={invoice.senderEmail}
                        onChange={(v) =>
                          setInvoice({ ...invoice, senderEmail: v })
                        }
                        className="text-sm opacity-60"
                        placeholder="email@company.com"
                      />
                      <EditableField
                        value={invoice.senderAddress}
                        onChange={(v) =>
                          setInvoice({ ...invoice, senderAddress: v })
                        }
                        className="text-sm opacity-60"
                        multiline
                        placeholder="Company Address"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Client & Invoice Meta */}
              {pageIndex === 0 && (
                <div className="grid grid-cols-2 gap-12 mb-12">
                  <div className="space-y-4">
                    <p className="text-[10px] uppercase font-mono opacity-40">
                      Bill To
                    </p>
                    <EditableField
                      value={invoice.clientName}
                      onChange={(v) =>
                        setInvoice({ ...invoice, clientName: v })
                      }
                      className="text-xl font-bold"
                      placeholder="Client Name"
                    />
                    <div className="space-y-1">
                      <EditableField
                        value={invoice.clientEmail}
                        onChange={(v) =>
                          setInvoice({ ...invoice, clientEmail: v })
                        }
                        className="text-sm opacity-60"
                        placeholder="client@email.com"
                      />
                      <EditableField
                        value={invoice.clientAddress}
                        onChange={(v) =>
                          setInvoice({ ...invoice, clientAddress: v })
                        }
                        className="text-sm opacity-60"
                        multiline
                        placeholder="Client Address"
                      />
                    </div>
                  </div>
                  <div className="text-right space-y-4">
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] uppercase font-mono opacity-40">
                        Invoice Number
                      </span>
                      <EditableField
                        value={invoice.invoiceNumber}
                        onChange={(v) =>
                          setInvoice({ ...invoice, invoiceNumber: v })
                        }
                        className="text-lg font-mono font-bold"
                      />
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] uppercase font-mono opacity-40">
                        Date
                      </span>
                      <EditableField
                        value={invoice.date}
                        onChange={(v) => setInvoice({ ...invoice, date: v })}
                        type="date"
                        className="text-sm"
                      />
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] uppercase font-mono opacity-40">
                        Due Date
                      </span>
                      <EditableField
                        value={invoice.dueDate}
                        onChange={(v) => setInvoice({ ...invoice, dueDate: v })}
                        type="date"
                        className="text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Items Table */}
              <div className="flex-1">
                <table className="w-full border-collapse">
                  <thead>
                    <tr
                      className={`border-b-2 border-black ${invoice.template === "technical" ? "bg-[#D1D0CC]" : ""}`}
                      style={{ borderColor: invoice.primaryColor }}
                    >
                      <th className="text-left py-3 px-2 text-[10px] uppercase font-mono opacity-40">
                        Description
                      </th>
                      <th className="text-right py-3 px-2 text-[10px] uppercase font-mono opacity-40 w-20">
                        Qty
                      </th>
                      <th className="text-right py-3 px-2 text-[10px] uppercase font-mono opacity-40 w-32">
                        Price
                      </th>
                      <th className="text-right py-3 px-2 text-[10px] uppercase font-mono opacity-40 w-32">
                        Total
                      </th>
                      <th className="w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageItems.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-zinc-100 group/row"
                      >
                        <td className="py-2 px-2">
                          <EditableField
                            value={item.description}
                            onChange={(v) =>
                              handleItemChange(item.id, "description", v)
                            }
                            className="text-sm"
                            placeholder="Item description"
                          />
                        </td>
                        <td className="py-2 px-2 text-right">
                          <EditableField
                            value={item.quantity.toString()}
                            onChange={(v) =>
                              handleItemChange(item.id, "quantity", Number(v))
                            }
                            type="number"
                            className="text-sm text-right"
                          />
                        </td>
                        <td className="py-2 px-2 text-right">
                          <EditableField
                            value={item.price.toString()}
                            onChange={(v) =>
                              handleItemChange(item.id, "price", Number(v))
                            }
                            type="number"
                            className="text-sm text-right"
                          />
                        </td>
                        <td className="py-2 px-2 text-right font-bold text-sm">
                          ZAR {(item.quantity * item.price).toFixed(2)}
                        </td>
                        <td className="py-2 px-2 text-right">
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="opacity-0 group-hover/row:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {pageIndex === pages.length - 1 && (
                  <button
                    onClick={handleAddItem}
                    className="w-full py-4 border-2 border-dashed border-zinc-100 hover:border-black hover:bg-zinc-50 transition-all flex items-center justify-center text-[10px] uppercase font-mono text-zinc-400 hover:text-black mt-4"
                  >
                    <Plus className="w-3 h-3 mr-2" /> Add Line Item
                  </button>
                )}
              </div>

              {/* Footer: Totals & Notes */}
              {pageIndex === pages.length - 1 && (
                <div className="mt-12 pt-8 border-t border-zinc-100">
                  <div className="grid grid-cols-2 gap-12">
                    <div className="space-y-4">
                      <p className="text-[10px] uppercase font-mono opacity-40">
                        Notes
                      </p>
                      <EditableField
                        value={invoice.notes}
                        onChange={(v) => setInvoice({ ...invoice, notes: v })}
                        multiline
                        className="text-xs opacity-60 italic"
                        placeholder="Additional terms or notes..."
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs opacity-60 font-mono uppercase">
                        <span>Subtotal</span>
                        <span>${invoice.total.toFixed(2)}</span>
                      </div>
                      <div
                        className={`flex justify-between text-3xl font-bold border-t-2 border-black pt-4 ${
                          invoice.template === "technical" ? "p-4 -mx-4" : ""
                        }`}
                        style={{
                          borderColor: invoice.primaryColor,
                          backgroundColor:
                            invoice.template === "technical"
                              ? invoice.primaryColor
                              : "transparent",
                          color:
                            invoice.template === "technical"
                              ? invoice.primaryColor === "#ffffff"
                                ? "black"
                                : "white"
                              : "inherit",
                        }}
                      >
                        <span
                          className={
                            invoice.template === "technical" ? "italic" : ""
                          }
                        >
                          Total
                        </span>
                        <span>${invoice.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Sidebar: Customization */}
      {showRightSidebar && (
        <div className="w-64 border-l border-black bg-white p-6 flex flex-col gap-8 overflow-y-auto sticky top-0 h-screen">
          <section>
            <div className="flex items-center gap-2 mb-4 opacity-40">
              <Type size={16} />
              <h2 className="text-[10px] font-mono uppercase tracking-widest">
                Typography
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {fonts.map((font) => (
                <button
                  key={font.name}
                  onClick={() =>
                    setInvoice({ ...invoice, fontFamily: font.value })
                  }
                  className={`p-2 border text-[10px] uppercase font-mono transition-colors ${
                    invoice.fontFamily === font.value
                      ? "bg-black text-white border-black"
                      : "border-zinc-200 hover:border-black"
                  }`}
                >
                  {font.name}
                </button>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4 opacity-40">
              <Palette size={16} />
              <h2 className="text-[10px] font-mono uppercase tracking-widest">
                Primary Color
              </h2>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() =>
                    setInvoice({ ...invoice, primaryColor: color.value })
                  }
                  className={`w-full aspect-square border-2 transition-transform hover:scale-110 ${
                    invoice.primaryColor === color.value
                      ? "border-black"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4 opacity-40">
              <Palette size={16} />
              <h2 className="text-[10px] font-mono uppercase tracking-widest">
                Page Background
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {bgColors.map((color) => (
                <button
                  key={color.name}
                  onClick={() =>
                    setInvoice({ ...invoice, backgroundColor: color.value })
                  }
                  className={`p-2 border text-[10px] uppercase font-mono transition-colors ${
                    invoice.backgroundColor === color.value
                      ? "bg-black text-white border-black"
                      : "border-zinc-200 hover:border-black"
                  }`}
                  style={{
                    backgroundColor: color.value,
                    color: color.value === "#ffffff" ? "black" : "inherit",
                  }}
                >
                  {color.name}
                </button>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
