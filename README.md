# ClaimZen 🛡️✨

**ClaimZen** is a professional, high-performance web console designed for vehicle insurance adjusters and automotive collision inspectors to automate damage diagnostics, estimate repair costs in INR, and flag fraud indicators. 

The application is built using the **MERN (MongoDB, Express, React, Node.js) stack** and features a cryptographic content-hashing image classifier to provide zero-cost, offline-first damage analysis during live demonstrations.

---

## 📖 How It Works (The Core Engine)

To guarantee **100% availability, zero API charges, and instant processing speeds** during live hackathon judging, ClaimZen utilizes a dual-engine simulation in **[`aiService.js`](./backend/services/aiService.js)**:

### 1. Cryptographic MD5 Hashing Classifier
When you upload any random image, the backend reads the binary file buffer and generates an **MD5 cryptographic hash**. It then sums the character byte values of the hash modulo 5 to index one of the 5 targeted damage categories.
* **Content-Driven Consistency**: Uploading **Image A** will always return the same classification and cost. Uploading **Image B** will calculate a different hash and consistently map to a different category, simulating a live computer vision classifier.

### 2. Manual Keyword Overrides (Filename Control)
You can manually force any of the 5 categories during your pitch by simply renaming your test image file. If the filename contains any matching keywords (e.g., `scratch.jpg` or `broken_windshield.png`), the classifier prioritizes that category.

---

## 🎯 Target Damage Classifications

ClaimZen maps all vehicle scans to the following 5 industry-standard repair categories:

| Target Image Scenario | Damage Type Classification | Severity | Expected Cost Range | AI Recommendation Highlights |
| :--- | :--- | :--- | :--- | :--- |
| **Front bumper dent** | `Front Bumper Dent` | Medium | **₹15,000 – ₹30,000** | Repair cover; inspect underlying brackets; color match. |
| **Side door scratch** | `Side Door Scratch` | Low | **₹2,000 – ₹8,000** | Local clearcoat compound polishing; clearcoat re-application. |
| **Broken windshield** | `Broken Windshield` | High | **₹8,000 – ₹20,000** | Windshield replacement; mandatory ADAS sensor recalibration. |
| **Rear bumper collision** | `Rear Bumper Collision` | Medium | **₹12,000 – ₹25,000** | Replace bumper cover cover; audit parking sensor wiring. |
| **Broken headlight** | `Broken Headlight` | Medium | **₹4,000 – ₹12,000** | Replace composite headlight housing; recalibrate beam direction. |

---

## 🛠️ Tech Stack

* **Frontend**: React (Vite compiler), Tailwind CSS v4, React Router Dom (v6), Axios, Lucide React.
* **Backend**: Node.js & Express REST API, JSON Web Tokens (JWT) for session management, Bcrypt.js.
* **Image Uploads**: Multer middleware.
* **Database**: MongoDB & Mongoose ODM.

---

## 🌟 Core Features

1. **Clean Passwordless Auth**: Centered minimalist email login/register cards that bypass browser autofills and generate secure JWT keys under the hood.
2. **Instant Image Uploader**: Drag-and-drop file panel with **auto-submission on file select**. Adjusters don't need to click any submit button—the system uploads and redirects to the audit report instantly.
3. **Recent Audits History**: Dynamically lists the 3 most recently processed claims directly at the bottom of the upload page, complete with cost indicators and quick navigation links.
4. **INR Currency Formatting**: Rupee symbol (`₹`) representations configured across the dashboard charts, KPI cards, tables, and invoice print screens.
5. **Print-Ready Invoices**: Native styling configured to export clean, single-page PDF invoices when using browser print commands (`Ctrl + P`).
6. **Adjuster Profile Hub**: Displays name, credentials, token expiry notice, and live MongoDB cluster information.

---

## ⚙️ Setup & Installation

### 1. Prerequisites
* Install [Node.js](https://nodejs.org/) (v16 or later)
* Set up a local MongoDB instance, or create a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster.

### 2. Backend Installation & Start
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder:
   ```env
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret_key
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/claimzen
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### 3. Frontend Installation & Start
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to **[http://localhost:5173/](http://localhost:5173/)**.

---

## 🔒 Security & Input Validation

* **Route Protection**: All console routes (Dashboard, Upload, History, Profile) are protected via React Router `<ProtectedRoute>` session gates. Unauthenticated requests are redirected back to the Login card.
* **Input Validation**: Backend API schemas enforce size and string length constraints.
* **Multer File Size Limits**: Configured with a 5MB limit, returning a graceful `400 Bad Request` if file sizes exceed specifications to prevent server bloat.

---

## 🚀 Upgrading to Production AI (Gemini Integration)
To switch from the MD5 content hashing classifier to a live Multimodal model, simply modify **[`aiService.js`](./backend/services/aiService.js)**:

1. Install the Google Gen AI SDK:
   ```bash
   npm install @google/genai
   ```
2. Replace `analyzeDamage` with a call to `gemini-2.5-flash`:
   ```javascript
   const { GoogleGenAI } = require("@google/genai");
   const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

   const analyzeDamage = async (imagePath, description) => {
     const imageBuffer = fs.readFileSync(path.resolve(__dirname, '../', imagePath));
     const response = await ai.models.generateContent({
       model: 'gemini-2.5-flash',
       contents: [
         { inlineData: { data: imageBuffer.toString("base64"), mimeType: "image/jpeg" } },
         `Analyze this vehicle collision photo. Classify damage category, severity (Low, Medium, High), and estimated repair cost in INR. Return a JSON structure.`
       ]
     });
     return JSON.parse(response.text);
   };
   ```

