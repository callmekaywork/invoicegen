export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  senderName: string;
  senderEmail: string;
  senderAddress: string;
  items: InvoiceItem[];
  notes: string;
  template: 'minimal' | 'technical';
  status: 'draft' | 'sent' | 'paid';
  logoUrl?: string;
  total: number;
  createdAt: string;
  // Customization
  fontFamily?: string;
  primaryColor?: string;
  backgroundColor?: string;
}

export interface AppSettings {
  defaultSender: {
    name: string;
    email: string;
    address: string;
    logoUrl?: string;
  };
  clientHistory: Array<{
    name: string;
    email: string;
    address: string;
  }>;
}
