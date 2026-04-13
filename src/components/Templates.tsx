import React from "react";
import { format } from "date-fns";
import Image from "next/image";
import { Invoice } from "@/lib/types";

interface TemplateProps {
  invoice: Invoice;
}

const ITEMS_PER_PAGE = 12;

export const MinimalTemplate = React.forwardRef<HTMLDivElement, TemplateProps>(
  ({ invoice }, ref) => {
    const pages = [];
    for (let i = 0; i < invoice.items.length; i += ITEMS_PER_PAGE) {
      pages.push(invoice.items.slice(i, i + ITEMS_PER_PAGE));
    }

    return (
      <div ref={ref} className="flex flex-col gap-8">
        {pages.map((pageItems, pageIndex) => (
          <div
            key={pageIndex}
            style={{
              fontFamily: invoice.fontFamily,
              backgroundColor: invoice.backgroundColor,
              color: invoice.primaryColor === "#ffffff" ? "black" : "inherit",
            }}
            className="bg-white p-12 w-200 aspect-[1/1.414] mx-auto text-black font-sans leading-relaxed shadow-sm relative flex flex-col"
          >
            <div className="absolute top-4 right-4 text-[10px] font-mono opacity-30 uppercase">
              Page {pageIndex + 1} / {pages.length}
            </div>

            {pageIndex === 0 && (
              <div className="flex justify-between items-start mb-16">
                <div>
                  {invoice.logoUrl && (
                    <div className="relative w-32 h-32 mb-4">
                      <Image
                        src={invoice.logoUrl}
                        alt="Logo"
                        fill
                        className="object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}
                  <h1
                    className="text-4xl font-bold tracking-tighter mb-2 uppercase"
                    style={{ color: invoice.primaryColor }}
                  >
                    Invoice
                  </h1>
                  <p className="font-mono text-sm opacity-60">
                    #{invoice.invoiceNumber}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{invoice.senderName}</p>
                  <p className="text-sm opacity-70">{invoice.senderEmail}</p>
                  <p className="text-sm opacity-70 whitespace-pre-line">
                    {invoice.senderAddress}
                  </p>
                </div>
              </div>
            )}

            {pageIndex === 0 && (
              <div className="grid grid-cols-2 gap-12 mb-16">
                <div>
                  <p className="text-xs uppercase font-mono opacity-40 mb-2">
                    Bill To
                  </p>
                  <p className="font-bold text-lg">{invoice.clientName}</p>
                  <p className="text-sm opacity-70">{invoice.clientEmail}</p>
                  <p className="text-sm opacity-70 whitespace-pre-line">
                    {invoice.clientAddress}
                  </p>
                </div>
                <div className="text-right">
                  <div className="mb-4">
                    <p className="text-xs uppercase font-mono opacity-40 mb-1">
                      Date
                    </p>
                    <p className="text-sm">
                      {format(new Date(invoice.date), "MMMM dd, yyyy")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase font-mono opacity-40 mb-1">
                      Due Date
                    </p>
                    <p className="text-sm">
                      {format(new Date(invoice.dueDate), "MMMM dd, yyyy")}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex-1">
              <table className="w-full mb-12">
                <thead>
                  <tr
                    className="border-b-2 border-black"
                    style={{ borderColor: invoice.primaryColor }}
                  >
                    <th className="text-left py-4 font-mono text-xs uppercase opacity-40">
                      Description
                    </th>
                    <th className="text-right py-4 font-mono text-xs uppercase opacity-40">
                      Qty
                    </th>
                    <th className="text-right py-4 font-mono text-xs uppercase opacity-40">
                      Price
                    </th>
                    <th className="text-right py-4 font-mono text-xs uppercase opacity-40">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((item) => (
                    <tr key={item.id} className="border-b border-zinc-100">
                      <td className="py-4">{item.description}</td>
                      <td className="py-4 text-right">{item.quantity}</td>
                      <td className="py-4 text-right">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="py-4 text-right font-bold">
                        ${(item.quantity * item.price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pageIndex === pages.length - 1 && (
              <>
                <div className="flex justify-end mb-16">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between text-sm opacity-60">
                      <span>Subtotal</span>
                      <span>${invoice.total.toFixed(2)}</span>
                    </div>
                    <div
                      className="flex justify-between text-2xl font-bold border-t-2 border-black pt-2"
                      style={{ borderColor: invoice.primaryColor }}
                    >
                      <span>Total</span>
                      <span>${invoice.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {invoice.notes && (
                  <div className="border-t border-zinc-100 pt-8">
                    <p className="text-xs uppercase font-mono opacity-40 mb-2">
                      Notes
                    </p>
                    <p className="text-sm opacity-70">{invoice.notes}</p>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    );
  },
);

MinimalTemplate.displayName = "MinimalTemplate";

export const TechnicalTemplate = React.forwardRef<
  HTMLDivElement,
  TemplateProps
>(({ invoice }, ref) => {
  const pages = [];
  for (let i = 0; i < invoice.items.length; i += ITEMS_PER_PAGE) {
    pages.push(invoice.items.slice(i, i + ITEMS_PER_PAGE));
  }

  return (
    <div ref={ref} className="flex flex-col gap-8">
      {pages.map((pageItems, pageIndex) => (
        <div
          key={pageIndex}
          style={{
            fontFamily: invoice.fontFamily || "var(--font-mono)",
            backgroundColor: invoice.backgroundColor || "#E4E3E0",
            color: invoice.primaryColor === "#ffffff" ? "black" : "inherit",
            borderColor: invoice.primaryColor,
          }}
          className="bg-[#E4E3E0] w-200 aspect-[1/1.414] mx-auto text-[#141414] font-mono border border-[#141414] relative flex flex-col shadow-sm"
        >
          <div className="absolute top-4 right-4 text-[10px] font-mono opacity-30 uppercase">
            Page {pageIndex + 1} / {pages.length}
          </div>

          {pageIndex === 0 && (
            <div
              className="grid grid-cols-2 border-b border-[#141414]"
              style={{ borderColor: invoice.primaryColor }}
            >
              <div
                className="p-8 border-r border-[#141414]"
                style={{ borderColor: invoice.primaryColor }}
              >
                {invoice.logoUrl && (
                  <div
                    className="relative w-24 h-24 mb-4 border border-[#141414] p-2 bg-white"
                    style={{ borderColor: invoice.primaryColor }}
                  >
                    <Image
                      src={invoice.logoUrl}
                      alt="Logo"
                      fill
                      className="object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
                <h1
                  className="text-3xl font-bold uppercase italic tracking-tighter mb-4"
                  style={{ color: invoice.primaryColor }}
                >
                  Invoice
                </h1>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="opacity-50 italic">ID:</span>
                    <span>{invoice.invoiceNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-50 italic">DATE:</span>
                    <span>{invoice.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-50 italic">DUE:</span>
                    <span>{invoice.dueDate}</span>
                  </div>
                </div>
              </div>
              <div
                className="p-8 bg-[#141414] text-[#E4E3E0]"
                style={{
                  backgroundColor: invoice.primaryColor,
                  color:
                    invoice.primaryColor === "#ffffff" ? "black" : "#E4E3E0",
                }}
              >
                <p className="text-xs italic opacity-50 mb-2 uppercase">From</p>
                <p className="font-bold text-lg mb-1">{invoice.senderName}</p>
                <p className="text-xs opacity-70">{invoice.senderEmail}</p>
                <p className="text-xs opacity-70 whitespace-pre-line">
                  {invoice.senderAddress}
                </p>
              </div>
            </div>
          )}

          {pageIndex === 0 && (
            <div
              className="p-8 border-b border-[#141414]"
              style={{ borderColor: invoice.primaryColor }}
            >
              <p className="text-xs italic opacity-50 mb-2 uppercase">
                Bill To
              </p>
              <p className="font-bold text-lg mb-1">{invoice.clientName}</p>
              <p className="text-sm">{invoice.clientEmail}</p>
              <p className="text-sm whitespace-pre-line">
                {invoice.clientAddress}
              </p>
            </div>
          )}

          <div className="flex-1">
            <table className="w-full border-collapse">
              <thead>
                <tr
                  className="border-b border-[#141414] bg-[#D1D0CC]"
                  style={{
                    borderColor: invoice.primaryColor,
                    backgroundColor:
                      invoice.primaryColor === "#000000"
                        ? "#D1D0CC"
                        : `${invoice.primaryColor}22`,
                  }}
                >
                  <th
                    className="text-left p-4 text-xs italic uppercase border-r border-[#141414]"
                    style={{ borderColor: invoice.primaryColor }}
                  >
                    Description
                  </th>
                  <th
                    className="text-right p-4 text-xs italic uppercase border-r border-[#141414]"
                    style={{ borderColor: invoice.primaryColor }}
                  >
                    Qty
                  </th>
                  <th
                    className="text-right p-4 text-xs italic uppercase border-r border-[#141414]"
                    style={{ borderColor: invoice.primaryColor }}
                  >
                    Price
                  </th>
                  <th className="text-right p-4 text-xs italic uppercase">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-[#141414]"
                    style={{ borderColor: invoice.primaryColor }}
                  >
                    <td
                      className="p-4 border-r border-[#141414]"
                      style={{ borderColor: invoice.primaryColor }}
                    >
                      {item.description}
                    </td>
                    <td
                      className="p-4 text-right border-r border-[#141414]"
                      style={{ borderColor: invoice.primaryColor }}
                    >
                      {item.quantity}
                    </td>
                    <td
                      className="p-4 text-right border-r border-[#141414]"
                      style={{ borderColor: invoice.primaryColor }}
                    >
                      ${item.price.toFixed(2)}
                    </td>
                    <td className="p-4 text-right font-bold">
                      ${(item.quantity * item.price).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pageIndex === pages.length - 1 && (
            <div
              className="grid grid-cols-2 border-t border-[#141414]"
              style={{ borderColor: invoice.primaryColor }}
            >
              <div
                className="p-8 border-r border-[#141414]"
                style={{ borderColor: invoice.primaryColor }}
              >
                {invoice.notes && (
                  <>
                    <p className="text-xs italic opacity-50 mb-2 uppercase">
                      Additional Notes
                    </p>
                    <p className="text-xs leading-relaxed">{invoice.notes}</p>
                  </>
                )}
              </div>
              <div className="p-8 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="italic opacity-50">SUBTOTAL</span>
                  <span>${invoice.total.toFixed(2)}</span>
                </div>
                <div
                  className="flex justify-between text-2xl font-bold bg-[#141414] text-[#E4E3E0] p-4 -mx-8 -mb-8"
                  style={{
                    backgroundColor: invoice.primaryColor,
                    color:
                      invoice.primaryColor === "#ffffff" ? "black" : "#E4E3E0",
                  }}
                >
                  <span className="italic">TOTAL</span>
                  <span>${invoice.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
});

TechnicalTemplate.displayName = "TechnicalTemplate";
