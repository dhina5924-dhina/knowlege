"""
Model Evaluation Suite for Machine Learning Modules
Calculates standardized evaluation metrics for regression and clustering models.
"""
import numpy as np
import pandas as pd
from typing import Dict, Any
from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score,
    silhouette_score,
    calinski_harabasz_score,
    davies_bouldin_score
)

def evaluate_regression(y_true: np.ndarray, y_pred: np.ndarray) -> Dict[str, Any]:
    mae = mean_absolute_error(y_true, y_pred)
    mse = mean_squared_error(y_true, y_pred)
    rmse = np.sqrt(mse)
    r2 = r2_score(y_true, y_pred)
    mape = np.mean(np.abs((y_true - y_pred) / np.clip(y_true, 1, None))) * 100

    return {
        'model_name': 'Random Forest Regressor',
        'r2_score': round(float(r2), 4),
        'mae': round(float(mae), 3),
        'rmse': round(float(rmse), 3),
        'mape_pct': round(float(mape), 2),
        'verdict': 'Excellent Predictive Fit' if r2 >= 0.85 else 'Good Fit'
    }

def evaluate_clustering(X_scaled: np.ndarray, cluster_labels: np.ndarray) -> Dict[str, Any]:
    sil = silhouette_score(X_scaled, cluster_labels)
    calinski = calinski_harabasz_score(X_scaled, cluster_labels)
    davies = davies_bouldin_score(X_scaled, cluster_labels)

    return {
        'model_name': 'K-Means Clustering',
        'silhouette_score': round(float(sil), 4),
        'calinski_harabasz_index': round(float(calinski), 2),
        'davies_bouldin_index': round(float(davies), 3),
        'verdict': 'Well-Separated Performance Clusters' if sil >= 0.35 else 'Moderate Cluster Separation'
    }

