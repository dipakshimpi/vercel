# 📑 Professional Invoice PDF Generator

<p align="center">
  <img src="https://cdn-icons-png.flaticon.com/512/3665/3665923.png" width="120" alt="Project Logo" />
</p>

<div align="center">
  <sub>Built for</sub><br />
  <b>ELECTROSOURCE PRIVATE LIMITED</b>
</div>

---

### 🎯 Project Overview
A robust **Node.js** engine designed to automate the creation of high-fidelity Proforma Invoices. This system converts dynamic data into a pixel-perfect A4 PDF layout, ensuring consistent branding and integrated payment gateways.



### 🚀 Key Capabilities
* <b>Pixel-Perfect Rendering:</b> Leverages `Puppeteer` for exact CSS-to-PDF translation.
* <b>Dynamic QR Engine:</b> Integrated `qrcode` library to generate real-time UPI payment codes.
* <b>Self-Contained Assets:</b> Uses <b>Base64 Encoding</b> for logos and QR codes to prevent broken image paths in generated PDFs.
* <b>Fixed-Border Logic:</b> Advanced CSS Flexbox ensures a "Closed Box" design regardless of line-item quantity.

---

### 🛠️ Technical Stack
<table>
  <tr>
    <td><b>Runtime</b></td>
    <td>Node.js v22.x</td>
  </tr>
  <tr>
    <td><b>PDF Engine</b></td>
    <td>Puppeteer (Headless Chrome)</td>
  </tr>
  <tr>
    <td><b>Templating</b></td>
    <td>Handlebars.js</td>
  </tr>
  <tr>
    <td><b>Utilities</b></td>
    <td>Axios, QRCode, fs-extra</td>
  </tr>
</table>

---

### 📥 Installation & Setup

1. **Clone and Install Dependencies:**
   ```bash
   npm install puppeteer handlebars qrcode axios fs-extra
