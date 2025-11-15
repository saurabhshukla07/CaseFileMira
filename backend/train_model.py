# train_model.py
"""
Train a realistic RandomForest regression model for property price prediction,
save it as `complex_price_model_v2.pkl`.

This script:
- generates synthetic but realistic property feature data
- creates a target price with a sensible formula + noise
- trains an sklearn Pipeline (OneHotEncoder + StandardScaler + RandomForestRegressor)
- evaluates and prints basic metrics
- saves the pipeline to complex_price_model_v2.pkl
"""

import numpy as np
import pandas as pd
import pickle
from sklearn.ensemble import RandomForestRegressor
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
from typing import Literal
import random

RANDOM_STATE = 42
N_SAMPLES = 8000

def generate_synthetic_dataset(n=N_SAMPLES, seed=RANDOM_STATE):
    rng = np.random.default_rng(seed)
    rows = []
    for i in range(n):
        prop_type = rng.choice(["SFH", "Condo"], p=[0.6, 0.4])
        if prop_type == "SFH":
            lot_area = int(rng.integers(3000, 12001))
            building_area = int(rng.integers(1000, 4000))
            bedrooms = int(rng.integers(2, 6))
        else:
            lot_area = 0
            building_area = int(rng.integers(600, 2501))
            bedrooms = int(rng.integers(1, 4))

        bathrooms = int(rng.integers(1, 5))
        year_built = int(rng.integers(1950, 2024))
        has_pool = bool(rng.choice([0, 1], p=[0.85, 0.15]))
        has_garage = bool(rng.choice([0, 1], p=[0.3, 0.7]))
        school_rating = int(rng.integers(4, 11))

        # price generation formula (synthetic but realistic)
        base = 50000
        if prop_type == "SFH":
            base += lot_area * 30 + building_area * 120
        else:
            base += building_area * 200

        base += bedrooms * 40000
        base += bathrooms * 25000
        age = 2024 - year_built
        base -= age * 800

        if has_pool:
            base += 35000
        if has_garage:
            base += 20000

        base += school_rating * 15000

        # Add heteroscedastic noise
        noise = rng.normal(0, base * 0.07)
        price = max(20000.0, base + noise)

        rows.append({
            "property_type": prop_type,
            "lot_area": lot_area,
            "building_area": building_area,
            "bedrooms": bedrooms,
            "bathrooms": bathrooms,
            "year_built": year_built,
            "has_pool": int(has_pool),
            "has_garage": int(has_garage),
            "school_rating": school_rating,
            "price": float(round(price, 2)),
        })

    df = pd.DataFrame(rows)
    return df

def build_pipeline():
    # Column categories
    cat_features = ["property_type"]
    num_features = [
        "lot_area", "building_area", "bedrooms", "bathrooms",
        "year_built", "has_pool", "has_garage", "school_rating"
    ]

    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore", sparse=False), cat_features),
            ("num", StandardScaler(), num_features),
        ],
        remainder="drop",
        sparse_threshold=0  # ensure dense output
    )

    pipeline = Pipeline([
        ("pre", preprocessor),
        ("rf", RandomForestRegressor(
            n_estimators=200,
            max_depth=20,
            random_state=RANDOM_STATE,
            n_jobs=-1
        ))
    ])
    return pipeline

def main():
    print("Generating synthetic dataset...")
    df = generate_synthetic_dataset()

    X = df.drop(columns=["price"])
    y = df["price"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.17, random_state=RANDOM_STATE
    )

    pipeline = build_pipeline()
    print("Training model...")
    pipeline.fit(X_train, y_train)

    print("Evaluating model...")
    preds = pipeline.predict(X_test)
    mae = mean_absolute_error(y_test, preds)
    r2 = r2_score(y_test, preds)
    print(f"Test MAE: {mae:.2f}")
    print(f"Test R2: {r2:.4f}")

    # Save model pipeline
    out_path = "complex_price_model_v2.pkl"
    with open(out_path, "wb") as f:
        pickle.dump(pipeline, f)
    print(f"Saved trained pipeline to {out_path}")

    # Save a small sample CSV for reference (optional)
    df.sample(5).to_csv("sample_synthetic_data.csv", index=False)
    print("Saved sample_synthetic_data.csv (5 rows)")

if __name__ == "__main__":
    main()
