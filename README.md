# 🚀 Blinkit Sales Analysis Dashboard

A comprehensive Power BI dashboard analyzing Blinkit's sales performance, customer satisfaction, and inventory distribution. This project offers interactive visualizations and KPIs to uncover insights and trends in Blinkit's retail operations.

---

## 📊 Dashboard Snapshot

![Dashboard Snapshot](/dashboard_snapshot.PNG)

---

## 📌 Project Overview

This project presents a data-driven Power BI dashboard that explores multiple dimensions of Blinkit's performance:

- **Sales Performance** (Total and Average)
- **Customer Feedback** (Average Rating)
- **Inventory and Item Analysis**
- **Outlet Location & Type Impact**
- **Health Preferences (Fat Content)**

The dashboard is built for interactive data exploration using slicers and charts, enabling real-time filtering based on outlet location, size, and item type.

---

## 📈 Key Performance Indicators (KPIs)

| KPI                 | Value         |
|---------------------|---------------|
| **Total Sales**     | $1.20M        |
| **Average Sales**   | $141          |
| **Number of Items** | 8,523         |
| **Average Rating**  | 3.9 / 5       |

---

## 🧩 Features

- **Filter Panel:** Slice data by outlet location type, size, and item category.
- **Outlet Establishment Trend:** Visualizes outlet growth (2010–2022).
- **Fat Content Analysis:** Tracks consumer preference for low-fat vs regular products.
- **Item Type Distribution:** Highlights best-selling categories.
- **Outlet Size & Location Analysis:** Compares sales by outlet tier and size.
- **Outlet Type Comparison:** Assesses different outlet types based on key metrics.

---

## 🔍 Key Insights

- 🥇 **Total sales surpassed $1.2M**, indicating strong market performance.
- 🥦 **Low-fat products are preferred**, suggesting health-conscious behavior.
- 🍇 **Fruits, vegetables, and snacks** are top-performing categories.
- 🏬 **Tier 3, medium-sized outlets** are the most profitable.
- 🛒 **Supermarkets drive high sales volume**, while **grocery stores offer better visibility** per item.

---

## 📂 Folder Structure
```
├── figures/                   # Additional visuals used in Dashboard design
├── BlinkIT Grocery Data.xlsx  # Raw source data (Excel workbook)
├── dashboard.pbix             # Power BI dashboard project file
├── dashboard_snapshot.PNG     # Snapshot image of the Power BI report
├── inspect_data.py            # Python preprocessing & cleaning script
├── data.js                    # Preprocessed JSON data wrapped in JS variable (CORS-friendly)
├── index.html                 # Interactive Web Dashboard frontend (HTML5 structure)
├── index.css                  # Modern dark-theme glassmorphic stylesheet
├── index.js                   # Filtering & Chart.js drawing controller
└── README.md                  # Project instructions and documentation
```

---

## 🛠️ How to Run the Dashboards

### Option 1: Power BI Desktop (Recommended for BI Analysis)
1. Ensure you have **Power BI Desktop** installed (download for free from the Microsoft Store).
2. Double-click the **`dashboard.pbix`** file to open it.
3. If Power BI shows a "Data Source Error" (because the file path changed):
   - In the top ribbon, click **Transform Data** > **Data source settings**.
   - Select `BlinkIT Grocery Data.xlsx` and click **Change Source**.
   - Click **Browse**, select the `BlinkIT Grocery Data.xlsx` file located in this project directory, and click **OK**.
   - Click **Close & Apply** to reload the visuals.

### Option 2: Interactive Web Dashboard (Instant Browser Viewer)
We have built an offline-ready, responsive, glassmorphic Web Dashboard that replicates all Power BI slicers, KPIs, line trends, and matrices.
1. Locate the **`index.html`** file in this directory.
2. **Double-click it** to open it instantly in Google Chrome, Microsoft Edge, Safari, or Firefox. 
3. *Alternatively*, if you want to run it via a local development server:
   - Open PowerShell or command line in this directory and run:
     ```bash
     python -m http.server 8000
     ```
   - Open your browser and navigate to: **`http://localhost:8000`**

---

⭐ *If you found this project helpful, please consider starring the repository!*

