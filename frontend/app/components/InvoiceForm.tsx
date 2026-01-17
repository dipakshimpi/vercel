"use client";

import React, { useState } from 'react';
import { Download, Loader2, ShieldCheck, Calendar, MapPin, User, Package, CreditCard, FileText, Hash, Landmark } from 'lucide-react';

export default function InvoiceForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    billNo: '',
    date: '',
    placeSupply: '',
    billTo: '',
    shipTo: '',
    itemName: '',
    description: '',
    hsn: '',
    qty: '',
    rate: '',
    amount: '',
    cgst: '',
    sgst: '',
    total: '',
    totalWords: '',
    bankDetails: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generatePDF = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const response = await fetch(`${apiUrl}/generate-pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Connection failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Invoice-${formData.billNo || 'Draft'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
      alert("Error: Ensure your Node.js backend (node index.js) is running on port 8080!");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-700 placeholder:text-slate-400 font-medium";
  const labelClass = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 ml-1";

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-2xl shadow-slate-200 rounded-3xl overflow-hidden border border-slate-100 font-sans">
      
      {/* Header */}
      <div className="bg-slate-900 p-8 text-white flex justify-between items-center relative overflow-hidden">
        <div className="relative z-10">
            <h2 className="text-3xl font-black flex items-center gap-3 tracking-tight">
            <ShieldCheck className="text-blue-400" size={32} /> 
            Proforma Generator
            </h2>
            <p className="text-slate-400 mt-2 font-medium">Create professional invoices in seconds</p>
        </div>
        {/* Decorative circle */}
        <div className="absolute -right-10 -top-10 w-64 h-64 bg-blue-600 rounded-full opacity-10 blur-3xl"></div>
      </div>

      <form onSubmit={generatePDF} className="p-8 space-y-10">
        
        {/* Section: Invoice Details */}
        <section>
            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-2">
                <Hash className="text-blue-500" size={20} />
                <h3 className="text-lg font-bold text-slate-800">Invoice Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className={labelClass}>Invoice No.</label>
                    <input name="billNo" placeholder="e.g. PI-001" onChange={handleChange} className={inputClass} required />
                </div>
                <div>
                    <label className={labelClass}>Date</label>
                    <div className="relative">
                        <input name="date" type="date" onChange={handleChange} className={`${inputClass} pl-10`} required />
                        <Calendar className="absolute left-3 top-3.5 text-slate-400" size={18} />
                    </div>
                </div>
                <div>
                    <label className={labelClass}>Place of Supply</label>
                    <div className="relative">
                        <input name="placeSupply" placeholder="State (e.g. Maharashtra)" onChange={handleChange} className={`${inputClass} pl-10`} />
                        <MapPin className="absolute left-3 top-3.5 text-slate-400" size={18} />
                    </div>
                </div>
            </div>
        </section>

        {/* Section: Parties */}
        <section>
            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-2">
                <User className="text-blue-500" size={20} />
                <h3 className="text-lg font-bold text-slate-800">Billed To & Shipped To</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <label className={labelClass}>Billing Address</label>
                    <textarea name="billTo" placeholder="Company Name, Address, GSTIN..." rows={4} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                    <label className={labelClass}>Shipping Address</label>
                    <textarea name="shipTo" placeholder="Receiver Name, Address, Contact..." rows={4} onChange={handleChange} className={inputClass} />
                </div>
            </div>
        </section>

        {/* Section: Items */}
        <section className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2 mb-6">
                <Package className="text-blue-500" size={20} />
                <h3 className="text-lg font-bold text-slate-800">Item Details</h3>
            </div>
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-5">
                        <label className={labelClass}>Item Name</label>
                        <input name="itemName" placeholder="Product Name" onChange={handleChange} className={inputClass} required />
                    </div>
                    <div className="md:col-span-3">
                        <label className={labelClass}>HSN/SAC</label>
                        <input name="hsn" placeholder="Code" onChange={handleChange} className={inputClass} />
                    </div>
                    <div className="md:col-span-4">
                        <label className={labelClass}>Description / SKU</label>
                        <input name="description" placeholder="Additional details" onChange={handleChange} className={inputClass} />
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className={labelClass}>Quantity</label>
                        <input name="qty" type="number" placeholder="0" onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>Rate</label>
                        <input name="rate" type="number" placeholder="0.00" onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>Amount</label>
                        <input name="amount" type="number" placeholder="0.00" onChange={handleChange} className={`${inputClass} font-bold text-slate-900`} />
                    </div>
                </div>
            </div>
        </section>

        {/* Section: Bank Details */}
        <section>
            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-2">
                <Landmark className="text-blue-500" size={20} />
                <h3 className="text-lg font-bold text-slate-800">Bank Details</h3>
            </div>
            <div>
                <label className={labelClass}>Bank Information (Optional)</label>
                <textarea name="bankDetails" placeholder="Account Name&#10;Bank Name&#10;Account No&#10;IFSC Code" rows={4} onChange={handleChange} className={inputClass} />
                <p className="text-xs text-slate-400 mt-2 flex justify-end items-center gap-1">
                  <ShieldCheck size={12} /> Leave blank to use default company bank details
                </p>
            </div>
        </section>

        {/* Section: Totals */}
        <section>
            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-2">
                <CreditCard className="text-blue-500" size={20} />
                <h3 className="text-lg font-bold text-slate-800">Payment Summary</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                     <label className={labelClass}>Amount in Words</label>
                     <div className="relative">
                        <textarea name="totalWords" placeholder="e.g. One Hundred Only" rows={3} onChange={handleChange} className={`${inputClass} pl-10`} />
                        <FileText className="absolute left-3 top-4 text-slate-400" size={18} />
                     </div>
                </div>
                <div className="space-y-4 bg-blue-50 p-6 rounded-2xl border border-blue-100">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>CGST</label>
                            <input name="cgst" type="number" placeholder="0.00" onChange={handleChange} className="w-full bg-white border border-blue-200 rounded-lg px-3 py-2 text-right font-medium" />
                        </div>
                        <div>
                            <label className={labelClass}>SGST</label>
                            <input name="sgst" type="number" placeholder="0.00" onChange={handleChange} className="w-full bg-white border border-blue-200 rounded-lg px-3 py-2 text-right font-medium" />
                        </div>
                    </div>
                    <div className="pt-2 border-t border-blue-200">
                        <label className="block text-xs font-bold text-blue-600 uppercase tracking-wider mb-1 text-right">Total Payable</label>
                        <div className="relative">
                            <span className="absolute left-4 top-3 text-blue-900 font-bold text-lg">₹</span>
                            <input name="total" type="number" placeholder="0.00" onChange={handleChange} className="w-full bg-white border-2 border-blue-500 rounded-xl px-4 py-3 pl-10 text-right font-black text-2xl text-blue-900 focus:outline-none shadow-sm" required />
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-slate-900 hover:bg-black text-white p-5 rounded-2xl font-bold text-lg flex justify-center items-center gap-3 transition-all transform active:scale-[0.99] shadow-xl shadow-slate-200"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Download size={24} />}
          Generate Professional Invoice
        </button>
      </form>
    </div>
  );
}