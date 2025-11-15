🏠 Property Comparison & Price Prediction App
Full Stack (React + TypeScript + Vite + TailwindCSS + FastAPI + ML Model)

This is a full-stack application that allows users to compare two property addresses and receive AI-generated price predictions using a provided machine learning model (complex_price_model_v2.pkl).

🚀 Features
Frontend (Vite + React + TypeScript + TailwindCSS)

Clean UI for entering two property addresses

Compare button triggers backend API

Displays side-by-side comparison of:

Property features

Predicted price

Fully typed with TypeScript

Responsive Tailwind design

Backend (FastAPI + Python)

Loads ML model (complex_price_model_v2.pkl) using pickle

API endpoint /compare

Generates mocked property feature data

Predicts price for each property

Returns structured JSON response

CORS enabled for frontend communication

📁 Project Structure
root/
│
├── backend/
│   ├── main.py
│   ├── complex_price_model_v2.pkl
│   ├── schemas.py
│   ├── mock_data.py
│   ├── utils/
│   └── requirements.txt
│
└── frontend/
    ├── index.html
    ├── src/
    │   ├── App.tsx
    │   ├── components/
    │   ├── api/
    │   ├── types/
    └── package.json

🛠️ Tech Stack
Frontend

React

TypeScript

Vite

TailwindCSS

Backend

FastAPI

Pydantic

Uvicorn

Python 3.10+

Machine Learning model (.pkl)

⚙️ Backend Setup (FastAPI)
1️⃣ Create virtual environment
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

2️⃣ Install requirements
pip install -r requirements.txt

3️⃣ Run the server
uvicorn main:app --reload


Backend runs at: http://localhost:8000

🖥️ Frontend Setup (React + Vite)
1️⃣ Install dependencies
cd frontend
npm install

2️⃣ Start dev server
npm run dev


Frontend runs at: http://localhost:5173

🔌 API Endpoint
POST /compare
Request Body
{
  "address1": "123 Main Street",
  "address2": "456 Market Avenue"
}

Response Example
{
  "property1": {
    "address": "123 Main Street",
    "bedrooms": 3,
    "bathrooms": 2,
    "year_built": 2012,
    "price": 420000
  },
  "property2": {
    "address": "456 Market Avenue",
    "bedrooms": 4,
    "bathrooms": 3,
    "year_built": 2018,
    "price": 570000
  }
}

🧠 Machine Learning Model

The backend loads the model:

with open("complex_price_model_v2.pkl", "rb") as f:
    model = pickle.load(f)


Model expects this schema:

{
  "property_type": "SFH" or "Condo",
  "lot_area": int,
  "building_area": int,
  "bedrooms": int,
  "bathrooms": int,
  "year_built": int,
  "has_pool": bool,
  "has_garage": bool,
  "school_rating": int
}

🎥 Demo Video

A full walkthrough of the application is available here:

👉 Watch the Demo Video: https://drive.google.com/file/d/1XRTo2lGOYw6AuKl6hm7lIL_pRJpJ4rsj/view?usp=sharing

This recording shows:

Frontend UI flow

Entering property addresses

API call to FastAPI backend

Model prediction response

Side-by-side comparison layout

End-to-end working functionality