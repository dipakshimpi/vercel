const express = require('express');
const puppeteer = require('puppeteer');
const hbs = require('handlebars');
const QRCode = require('qrcode');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Helper to fetch logo and convert to Base64
async function getImageBase64(url) {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data, 'binary').toString('base64');
        return `data:${response.headers['content-type']};base64,${buffer}`;
    } catch (e) {
        console.error("Logo fetch failed, using empty string");
        return "";
    }
}

// --- EMBEDDED TEMPLATE (No file loading required) ---
const invoiceTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice {{billNo}}</title>
    <style>
        @page { size: A4; margin: 0; }
        body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 25px; color: #000; line-height: 1.2; }
        
        .main-border { 
            border: 1.5px solid #000; 
            min-height: 1000px; 
            display: flex; 
            flex-direction: column; 
        }

        .company-header { padding: 10px; border-bottom: 1.5px solid #000; display: flex; justify-content: space-between; }
        .company-info { font-size: 10px; width: 65%; }
        .company-logo-area { text-align: right; width: 30%; }

        .info-grid { display: flex; border-bottom: 1px solid #000; }
        .info-col { flex: 1; padding: 5px 10px; border-right: 1px solid #000; font-size: 10px; }
        .info-col:last-child { border-right: none; }

        .address-header { display: flex; background-color: #e2e2e2; border-bottom: 1px solid #000; }
        .address-title { flex: 1; padding: 4px 10px; font-weight: bold; font-size: 11px; border-right: 1px solid #000; }
        .address-title:last-child { border-right: none; }

        .address-content { display: flex; border-bottom: 1px solid #000; min-height: 110px; }
        .address-box { flex: 1; padding: 8px 10px; font-size: 10px; border-right: 1px solid #000; }
        .address-box:last-child { border-right: none; }

        table { width: 100%; border-collapse: collapse; }
        th { background-color: #e2e2e2; border: 1px solid #000; padding: 6px; font-size: 11px; text-align: left; }
        td { border-left: 1px solid #000; border-right: 1px solid #000; padding: 8px 10px; font-size: 10.5px; vertical-align: top; }
        .item-row { height: 380px; } /* Ensures the table takes up vertical space */

        .footer-grid { display: flex; border-top: 1.5px solid #000; flex-grow: 1; }
        .footer-left { flex: 1.6; border-right: 1px solid #000; padding: 10px; font-size: 10px; }
        
        .footer-right { flex: 1; display: flex; flex-direction: column; }
        .calc-row { display: flex; border-bottom: 1px solid #000; font-size: 11px; }
        .calc-label { flex: 1.5; padding: 6px; text-align: right; border-right: 1px solid #000; font-weight: bold; }
        .calc-val { flex: 1; padding: 6px; text-align: right; }

        .qr-section { text-align: center; padding: 20px 10px; flex-grow: 1; }
        .qr-img { width: 130px; height: 130px; margin-top: 5px; }
    </style>
</head>
<body>
    <div class="main-border">
        <div class="company-header">
            <div class="company-info">
                <b style="font-size: 16px;">ELECTROSOURCE PRIVATE LIMITED</b><br>
                Nashik : 422009, Maharashtra, India<br>
                GSTIN: 27AAFCE7605R1Z1
            </div>
            <div class="company-logo-area">
                <img src="{{logoBase64}}" style="max-height: 60px; width: auto; margin-bottom: 10px;" alt="Company Logo">
                <div style="font-size: 18px; font-weight: bold; color: #333;">Proforma Invoice</div>
            </div>
        </div>

        <div class="info-grid">
            <div class="info-col"><b>#PI NO:</b> {{billNo}}<br><b>Estimate Date:</b> {{date}}</div>
            <div class="info-col"><b>Place of Supply:</b> {{placeSupply}}<br><b>Payment Terms:</b> 100% Advance</div>
        </div>

        <div class="address-header">
            <div class="address-title">Bill To</div>
            <div class="address-title">Ship To</div>
        </div>
        <div class="address-content">
            <div class="address-box">{{{billTo}}}</div>
            <div class="address-box">{{{shipTo}}}</div>
        </div>

        <table>
            <thead>
                <tr>
                    <th style="width: 50%;">Item & Description</th>
                    <th style="width: 15%;">HSN/SAC</th>
                    <th style="width: 10%;">Qty</th>
                    <th style="width: 10%;">Rate</th>
                    <th style="width: 15%;">Amount</th>
                </tr>
            </thead>
            <tbody>
                <tr class="item-row">
                    <td><b>{{itemName}}</b><br><small>{{description}}</small></td>
                    <td>{{hsn}}</td>
                    <td>{{qty}}</td>
                    <td>{{rate}}</td>
                    <td>{{amount}}</td>
                </tr>
            </tbody>
        </table>

        <div class="footer-grid">
            <div class="footer-left">
                <p><b>Total In Words:</b><br>{{totalWords}}</p>
                <p style="margin-top: 40px;"><b>Bank Details:</b><br>{{{bankDetails}}}</p>
            </div>
            <div class="footer-right">
                <div class="calc-row">
                    <div class="calc-label">Sub Total</div>
                    <div class="calc-val">{{amount}}</div>
                </div>
                <div class="calc-row">
                    <div class="calc-label">CGST (9%)</div>
                    <div class="calc-val">{{cgst}}</div>
                </div>
                <div class="calc-row">
                    <div class="calc-label">SGST (9%)</div>
                    <div class="calc-val">{{sgst}}</div>
                </div>
                <div class="calc-row" style="background: #f2f2f2; font-weight: bold;">
                    <div class="calc-label">Total</div>
                    <div class="calc-val">Rs {{total}}</div>
                </div>
                <div class="qr-section">
                    <b>Scan & Pay</b><br>
                    <small>TID: 62279532</small><br>
                    <img src="{{qrCodeImage}}" class="qr-img">
                </div>
            </div>
        </div>
    </div>
</body>
</html>
`;

app.post('/generate-pdf', async (req, res) => {
    try {
        const userInput = req.body;

        // 1. Branding & Dynamic QR Code
        const logoBase64 = await getImageBase64('https://cdn-icons-png.flaticon.com/512/3665/3665923.png');
        
        // QR Code generated based on the final Total Amount from User Input
        const upiLink = `upi://pay?pa=8412906903@hdfcbank&pn=ELECTROSOURCE&am=${userInput.total || '0'}`;
        const qrImageBase64 = await QRCode.toDataURL(upiLink, { margin: 1, width: 200 });

        // 2. Formatting text for Handlebars {{{triple brackets}}}
        const formattedBillTo = (userInput.billTo || "").replace(/\n/g, '<br>');
        const formattedShipTo = (userInput.shipTo || "").replace(/\n/g, '<br>');
        const formattedBankDetails = (userInput.bankDetails && userInput.bankDetails.trim() !== "")
            ? userInput.bankDetails.replace(/\n/g, '<br>')
            : `<b>ELECTROSOURCE PRIVATE LIMITED</b><br>HDFC Bank - Thatte Nagar, Nashik<br>Account No: 50200047011371<br>IFSC: HDFC0000064`;

        // 3. Assemble Data Object for Template
        const data = {
            ...userInput, // Contains billNo, date, placeSupply, itemName, hsn, qty, rate, amount, cgst, sgst, total, totalWords
            billTo: formattedBillTo,
            shipTo: formattedShipTo,
            logoBase64: logoBase64,
            qrCodeImage: qrImageBase64,
            bankDetails: formattedBankDetails
        };

        // 4. Compile HTML Template (Using embedded string)
        const compiled = hbs.compile(invoiceTemplate)(data);

        // 5. PDF Generation via Puppeteer
        const browser = await puppeteer.launch({ 
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox'] 
        });
        const page = await browser.newPage();
        
        // networkidle0 ensures images (QR/Logo) are finished loading before PDF starts
        await page.setContent(compiled, { waitUntil: 'load', timeout: 60000 });
        
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '0px', bottom: '0px', left: '0px', right: '0px' } 
        });

        await browser.close();

        // 6. Send the raw PDF buffer to the Frontend
        res.contentType("application/pdf");
        res.send(pdfBuffer);

        console.log(`✅ PDF Successfully Reflected for: ${userInput.billNo}`);

    } catch (err) {
        console.error("Backend PDF Error:", err);
        res.status(500).send("Error generating professional PDF");
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`-----------------------------------------`);
    console.log(`🚀 PDF Engine running at http://localhost:${PORT}`);
    console.log(`-----------------------------------------`);
});
