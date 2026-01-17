'use client';
import React, { useState } from 'react';

export default function InvoiceForm() {
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
        totalWords: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/generate-pdf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `Invoice-${formData.billNo || 'Draft'}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                alert('Failed to generate PDF');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error connecting to backend');
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Segoe UI, sans-serif' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Proforma Invoice Generator</h2>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px' }}>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <input name="billNo" placeholder="PI No (e.g. PI-001)" onChange={handleChange} required style={{ padding: '8px' }} />
                    <input name="date" placeholder="Date" type="date" onChange={handleChange} required style={{ padding: '8px' }} />
                </div>

                <input name="placeSupply" placeholder="Place of Supply" onChange={handleChange} style={{ padding: '8px' }} />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <textarea name="billTo" placeholder="Bill To Address" rows="3" onChange={handleChange} style={{ padding: '8px' }} />
                    <textarea name="shipTo" placeholder="Ship To Address" rows="3" onChange={handleChange} style={{ padding: '8px' }} />
                </div>

                <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '5px' }}>
                    <h4 style={{ margin: '0 0 10px 0' }}>Item Details</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                        <input name="itemName" placeholder="Item Name" onChange={handleChange} required style={{ padding: '8px' }} />
                        <input name="hsn" placeholder="HSN/SAC" onChange={handleChange} style={{ padding: '8px' }} />
                        <input name="description" placeholder="Description / SKU" onChange={handleChange} style={{ padding: '8px' }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                        <input name="qty" placeholder="Qty" type="number" onChange={handleChange} style={{ padding: '8px' }} />
                        <input name="rate" placeholder="Rate" type="number" onChange={handleChange} style={{ padding: '8px' }} />
                        <input name="amount" placeholder="Amount" type="number" onChange={handleChange} style={{ padding: '8px' }} />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                    <input name="cgst" placeholder="CGST Amount" type="number" onChange={handleChange} style={{ padding: '8px' }} />
                    <input name="sgst" placeholder="SGST Amount" type="number" onChange={handleChange} style={{ padding: '8px' }} />
                    <input name="total" placeholder="Total Amount" type="number" onChange={handleChange} required style={{ padding: '8px', fontWeight: 'bold' }} />
                </div>

                <input name="totalWords" placeholder="Total Amount in Words" onChange={handleChange} style={{ padding: '8px' }} />

                <button type="submit" style={{ padding: '15px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px', marginTop: '10px' }}>
                    Generate PDF
                </button>
            </form>
        </div>
    );
}