# 🏠 Property Comparison & Price Prediction App

A full-stack web application that compares two properties side-by-side and predicts their market prices using a machine learning model.

## 🎯 Features

- **Property Comparison**: Enter two property addresses and get instant side-by-side comparison
- **AI Price Prediction**: Uses a trained ML model (`complex_price_model_v2.pkl`) for accurate price estimates
- **Detailed Analytics**: View comprehensive property features including bedrooms, bathrooms, lot/building area, amenities, and school ratings
- **Modern UI**: Beautiful, responsive interface built with React, TypeScript, and Tailwind CSS
- **Fast API Backend**: High-performance FastAPI backend with automatic API documentation

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for blazing fast development
- **Tailwind CSS** for modern styling
- **ESLint** for code quality

### Backend
- **FastAPI** for high-performance API
- **Pydantic** for data validation
- **scikit-learn** for ML model inference
- **CORS** enabled for local development

## 📁 Project Structure

```
property-comparison-app/
├── backend/
│   ├── main.py                    # FastAPI application
│   ├── requirements.txt           # Python dependencies
│   └── complex_price_model_v2.pkl # ML model file (place here)
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ComparisonForm.tsx
│   │   │   ├── PropertyCard.tsx
│   │   │   └── PropertyComparison.tsx
│   │   ├── types.ts              # TypeScript interfaces
│   │   ├── App.tsx               # Main React component
│   │   ├── main.tsx              # React entry point
│   │   └── index.css             # Global styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── tsconfig.json
│   └── tsconfig.node.json
│
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** (v18 or higher)
- **Python** (3.8 or higher)
- **pip** (Python package manager)

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment** (recommended):
   ```bash
   python -m venv venv
   
   # Activate on macOS/Linux:
   source venv/bin/activate
   
   # Activate on Windows:
   venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Place the ML model file**:
   - Copy `complex_price_model_v2.pkl` into the `backend/` directory
   - The file should be at `backend/complex_price_model_v2.pkl`

5. **Run the backend server**:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

   The API will be available at:
   - API: `http://localhost:8000`
   - Interactive docs: `http://localhost:8000/docs`
   - Alternative docs: `http://localhost:8000/redoc`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

   The app will open automatically at `http://localhost:3000`

## 📝 Usage

1. **Start both servers** (backend on port 8000, frontend on port 3000)

2. **Enter property addresses**:
   - Property 1: `123 Main St, Springfield, CA`
   - Property 2: `456 Oak Ave, Riverside, NY`

3. **Click "Compare Properties"** to get:
   - Predicted market prices
   - Detailed feature comparison
   - Price difference analysis
   - Visual side-by-side comparison

## 🔧 Development

### Backend Development

**Run with auto-reload**:
```bash
uvicorn main:app --reload
```

**Test API endpoints**:
```bash
# Health check
curl http://localhost:8000/health

# Compare properties
curl -X POST http://localhost:8000/compare \
  -H "Content-Type: application/json" \
  -d '{"address1": "123 Main St", "address2": "456 Oak Ave"}'
```

### Frontend Development

**Development server**:
```bash
npm run dev
```

**Build for production**:
```bash
npm run build
```

**Preview production build**:
```bash
npm run preview
```

**Lint code**:
```bash
npm run lint
```

## 🤖 ML Model Details

The application uses `complex_price_model_v2.pkl` which expects the following input schema:

```python
{
  "property_type": "SFH" | "Condo",
  "lot_area": int,        # Used only for SFH
  "building_area": int,   # Used only for Condo
  "bedrooms": int,
  "bathrooms": int,
  "year_built": int,
  "has_pool": bool,
  "has_garage": bool,
  "school_rating": int    # 1-10 scale
}
```

### Mock Data Generator

Since we don't have a real property scraping service, the backend includes a deterministic mock data generator that:
- Creates consistent property data based on address hash
- Generates realistic features for both SFH and Condo types
- Returns the same data for the same address (for testing)

## 🌐 API Endpoints

### `GET /`
Health check endpoint

### `GET /health`
Detailed health status including model load status

### `POST /compare`
Compare two properties

**Request Body**:
```json
{
  "address1": "123 Main St, City, State",
  "address2": "456 Oak Ave, City, State"
}
```

**Response**:
```json
{
  "property1": {
    "address": "123 Main St, City, State",
    "features": { ... },
    "predicted_price": 525000.00
  },
  "property2": {
    "address": "456 Oak Ave, City, State",
    "features": { ... },
    "predicted_price": 480000.00
  }
}
```

## 🔒 CORS Configuration

The backend is configured to allow all origins during development. For production:

1. Update CORS settings in `backend/main.py`:
   ```python
   allow_origins=["https://your-frontend-domain.com"]
   ```

## 🐛 Troubleshooting

### Backend Issues

**Model file not found**:
- Ensure `complex_price_model_v2.pkl` is in the `backend/` directory
- The app will use fallback calculations if model is missing

**Port already in use**:
```bash
# Use a different port
uvicorn main:app --reload --port 8001
```

### Frontend Issues

**API connection refused**:
- Verify backend is running on `http://localhost:8000`
- Check CORS configuration
- Ensure no firewall is blocking the connection

**Build errors**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 🚀 Deployment

### Backend Deployment

**Option 1: Docker**
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Option 2: Railway, Render, or Heroku**
- Push to GitHub
- Connect repository
- Set Python buildpack
- Deploy

### Frontend Deployment

**Build for production**:
```bash
npm run build
```

**Deploy to Vercel**:
```bash
npm install -g vercel
vercel
```

**Deploy to Netlify**:
- Drag and drop `dist/` folder to Netlify

## 📊 Key Features Implemented

✅ Property comparison interface  
✅ ML model integration  
✅ Mock data generation  
✅ Price prediction  
✅ Responsive design  
✅ Error handling  
✅ Loading states  
✅ Type safety (TypeScript)  
✅ API documentation (FastAPI auto-docs)  
✅ Side-by-side comparison  
✅ Price difference analytics  

## 🎨 Design Highlights

- Modern gradient backgrounds
- Card-based property layout
- Responsive grid system
- Hover animations
- Loading spinners
- Error messaging
- Color-coded properties
- Emoji enhancements

## 📄 License

This project is part of the Agent Mira Junior Full Stack Developer Case Study.

## 🤝 Contributing

This is a case study project. For the actual evaluation:
1. Fork the repository
2. Create a feature branch
3. Make improvements
4. Submit with documentation

## 📞 Support

For questions about the case study:
- Review the provided documentation
- Check API docs at `http://localhost:8000/docs`
- Test endpoints in the interactive documentation

---

**Built with ❤️ for Agent Mira's Developer Case Study**