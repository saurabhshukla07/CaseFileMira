# main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle
import pandas as pd
from typing import Literal, Optional

app = FastAPI(title="Property Price Prediction API (Real Model)")

# CORS middleware for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------
# Pydantic models (request/response)
# ----------------------------
class PropertyFeatures(BaseModel):
    property_type: Literal["SFH", "Condo"]
    lot_area: int
    building_area: int
    bedrooms: int
    bathrooms: int
    year_built: int
    has_pool: bool
    has_garage: bool
    school_rating: int

class PredictRequest(BaseModel):
    address: Optional[str] = None  # optional
    features: PropertyFeatures

class PropertyResult(BaseModel):
    address: Optional[str] = None
    features: PropertyFeatures
    predicted_price: float

class CompareRequest(BaseModel):
    property1: PredictRequest
    property2: PredictRequest

class ComparisonResponse(BaseModel):
    property1: PropertyResult
    property2: PropertyResult

# ----------------------------
# ----------------------------
# Load trained pipeline
# ----------------------------
MODEL_PATH = "complex_price_model_v2.pkl"
try:
    print("Loading model:", MODEL_PATH)
    with open(MODEL_PATH, "rb") as f:
        pipeline = pickle.load(f)
    MODEL_LOADED = True
    print("Loaded model pipeline successfully.")
except Exception as e:
    pipeline = None
    MODEL_LOADED = False
    print("❌ ERROR loading model:", repr(e))

# ----------------------------
# Helper: convert features dict -> DataFrame for pipeline
# ----------------------------
def features_to_dataframe(features: PropertyFeatures) -> pd.DataFrame:
    d = {
        "property_type": features.property_type,
        "lot_area": int(features.lot_area),
        "building_area": int(features.building_area),
        "bedrooms": int(features.bedrooms),
        "bathrooms": int(features.bathrooms),
        "year_built": int(features.year_built),
        "has_pool": 1 if features.has_pool else 0,
        "has_garage": 1 if features.has_garage else 0,
        "school_rating": int(features.school_rating),
    }
    return pd.DataFrame([d])

# ----------------------------
# Optional: deterministic fallback to derive features from address
# (useful for demo, but NOT recommended for production)
# ----------------------------
def generate_features_from_address(address: str) -> PropertyFeatures:
    # deterministic pseudo-mapping — still synthetic
    s = sum(ord(c) for c in (address or ""))
    prop_type = "SFH" if (s % 10) < 6 else "Condo"
    lot_area = 3000 + (s % 9000)
    building_area = 1200 + (s % 2500) if prop_type == "SFH" else 800 + (s % 1700)
    bedrooms = 2 + (s % 4)
    bathrooms = 1 + (s % 3)
    year_built = 1980 + (s % 45)
    has_pool = ((s >> 3) % 2) == 1
    has_garage = ((s >> 4) % 2) == 1
    school_rating = 5 + (s % 6)

    return PropertyFeatures(
        property_type=prop_type,
        lot_area=int(lot_area),
        building_area=int(building_area),
        bedrooms=int(bedrooms),
        bathrooms=int(bathrooms),
        year_built=int(year_built),
        has_pool=bool(has_pool),
        has_garage=bool(has_garage),
        school_rating=int(school_rating),
    )

# ----------------------------
# Prediction logic using loaded pipeline
# ----------------------------
def predict_from_features(features: PropertyFeatures) -> float:
    if pipeline is None:
        raise RuntimeError("Model pipeline not loaded. Run training step first.")
    df = features_to_dataframe(features)
    preds = pipeline.predict(df)
    return float(round(float(preds[0]), 2))

# ----------------------------
# Routes
# ----------------------------
@app.get("/")
def root():
    return {"message": "Property Price Prediction API (Real Model)", "status": "running"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "model_loaded": MODEL_LOADED}

@app.post("/predict", response_model=PropertyResult)
def predict(req: PredictRequest):
    """
    Predict a price for a single property.
    Body example:
    {
        "address": "optional address string",
        "features": {
            "property_type": "SFH",
            "lot_area": 4500,
            "building_area": 1800,
            "bedrooms": 3,
            "bathrooms": 2,
            "year_built": 2005,
            "has_pool": false,
            "has_garage": true,
            "school_rating": 8
        }
    }
    """
    try:
        features = req.features
        price = predict_from_features(features)
        return PropertyResult(address=req.address, features=features, predicted_price=price)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/compare", response_model=ComparisonResponse)
def compare(req: CompareRequest):

    if pipeline is None:
        raise HTTPException(status_code=503, detail="Model not loaded.")

    # Auto-generate features if missing
    if req.property1.features is None:
        f1 = generate_features_from_address(req.property1.address)
    else:
        f1 = req.property1.features

    if req.property2.features is None:
        f2 = generate_features_from_address(req.property2.address)
    else:
        f2 = req.property2.features

    p1 = predict_from_features(f1)
    p2 = predict_from_features(f2)

    return ComparisonResponse(
        property1=PropertyResult(address=req.property1.address, features=f1, predicted_price=p1),
        property2=PropertyResult(address=req.property2.address, features=f2, predicted_price=p2),
    )

