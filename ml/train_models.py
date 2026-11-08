"""
Model Training and Serialization Script
Trains and serializes:
1. Random Forest Regressor for Performance Prediction
2. K-Means Clusterer for Talent Identification
"""
import os
import sys

# Add root folder to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from ml.datasets.generate_sports_data import generate_sports_dataset
from ml.performance_prediction import PlayerPerformancePredictor
from ml.talent_identification import SportsTalentIdentifier

def main():
    print("=========================================================")
    print("  AI SPORTS PLATFORM - TRAINING MACHINE LEARNING MODELS  ")
    print("=========================================================")

    # 1. Dataset Generation
    dataset_dir = os.path.join(os.path.dirname(__file__), "datasets")
    os.makedirs(dataset_dir, exist_ok=True)
    csv_file = os.path.join(dataset_dir, "sports_performance_dataset.csv")

    print("[1/3] Generating comprehensive sports performance dataset...")
    df = generate_sports_dataset(num_samples=2000, random_state=42)
    df.to_csv(csv_file, index=False)
    print(f"      Saved {len(df)} sports training records to {csv_file}")

    # 2. Train Module 1: Random Forest Regressor
    print("\n[2/3] Training Module 1: Random Forest Regression (Performance Prediction)...")
    rf_predictor = PlayerPerformancePredictor()
    rf_metrics = rf_predictor.train(df)
    print("      Model Trained & Saved successfully:")
    print(f"      - R2 Score: {rf_metrics['r2_score']}")
    print(f"      - Mean Absolute Error (MAE): {rf_metrics['mae']}")
    print(f"      - Root Mean Squared Error (RMSE): {rf_metrics['rmse']}")
    print(f"      - Training Samples: {rf_metrics['samples_trained']}")

    # 3. Train Module 2: K-Means Talent Identifier
    print("\n[3/3] Training Module 2: K-Means Clustering (Talent Identification)...")
    talent_identifier = SportsTalentIdentifier(n_clusters=4)
    kmeans_metrics = talent_identifier.train(df)
    print("      Model Trained & Saved successfully:")
    print(f"      - Silhouette Score: {kmeans_metrics['silhouette_score']}")
    print(f"      - Total Variance Retained: {kmeans_metrics['total_variance_retained']}%")
    print(f"      - Number of Clusters: {kmeans_metrics['n_clusters']}")

    print("\n=========================================================")
    print("  SUCCESS: ALL MACHINE LEARNING MODELS TRAINED & SAVED!  ")
    print("=========================================================")

if __name__ == '__main__':
    main()

