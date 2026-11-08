"""
Dataset Generator for Sports Management Platform ML Models
Generates realistic multi-sport performance, talent, and recommendation datasets.
"""
import os
import numpy as np
import pandas as pd

def generate_sports_dataset(num_samples: int = 1200, random_state: int = 42) -> pd.DataFrame:
    np.random.seed(random_state)
    
    sports = ['Football', 'Cricket', 'Basketball', 'Tennis', 'Badminton', 'Athletics']
    sports_weights = [0.25, 0.25, 0.20, 0.12, 0.10, 0.08]
    
    selected_sports = np.random.choice(sports, size=num_samples, p=sports_weights)
    
    records = []
    for i, sport in enumerate(selected_sports):
        player_id = f"player_{i+1:04d}"
        
        # Matches played: 10 to 90
        matches_played = int(np.random.randint(8, 85))
        
        # Win rate probability baseline
        true_ability = np.random.beta(a=5, b=5) # 0 to 1, centered at 0.5
        win_rate = np.clip(np.random.normal(loc=true_ability * 100, scale=8.0), 5.0, 95.0)
        matches_won = int(round(matches_played * (win_rate / 100.0)))
        matches_won = max(0, min(matches_played, matches_won))
        win_rate = round((matches_won / matches_played) * 100.0, 2)
        
        # Sport-specific goals / points and assists / passes
        if sport == 'Football':
            goals_or_points = round(float(np.random.poisson(lam=true_ability * 0.7 * matches_played)), 1)
            assists_or_passes = round(float(np.random.poisson(lam=true_ability * 0.9 * matches_played)), 1)
            minutes_played = int(matches_played * np.random.randint(65, 92))
        elif sport == 'Cricket':
            # Runs and wickets/catches
            goals_or_points = round(float(matches_played * np.random.uniform(15, 65) * true_ability), 1)
            assists_or_passes = round(float(matches_played * np.random.uniform(0.5, 3.2) * true_ability), 1)
            minutes_played = int(matches_played * np.random.randint(120, 360))
        elif sport == 'Basketball':
            goals_or_points = round(float(matches_played * np.random.uniform(10, 32) * true_ability), 1)
            assists_or_passes = round(float(matches_played * np.random.uniform(2, 9) * true_ability), 1)
            minutes_played = int(matches_played * np.random.randint(20, 38))
        elif sport in ['Tennis', 'Badminton']:
            goals_or_points = round(float(matches_played * np.random.uniform(8, 25) * true_ability), 1)
            assists_or_passes = round(float(matches_played * np.random.uniform(3, 12) * true_ability), 1)
            minutes_played = int(matches_played * np.random.randint(45, 120))
        else: # Athletics
            goals_or_points = round(float(matches_played * np.random.uniform(5, 18) * true_ability), 1)
            assists_or_passes = round(float(matches_played * np.random.uniform(1, 5) * true_ability), 1)
            minutes_played = int(matches_played * np.random.randint(30, 90))
            
        # Recent form (0 - 100)
        recent_form = float(np.clip(np.random.normal(loc=true_ability * 90 + 5, scale=7.5), 25.0, 99.0))
        
        # Consistency score (0 - 100)
        consistency_score = float(np.clip(np.random.normal(loc=true_ability * 85 + 10, scale=6.0), 30.0, 98.0))
        
        # Calculate Ground Truth Future Performance Score (0 - 100)
        # Performance formula weighting:
        # 30% recent form, 25% win rate, 20% consistency, 15% per-match points contribution, 10% experience
        per_match_contribution = min(100.0, (goals_or_points / max(1, matches_played)) * 3.5)
        experience_bonus = min(100.0, (matches_played / 70.0) * 100.0)
        
        raw_score = (
            0.30 * recent_form +
            0.25 * win_rate +
            0.20 * consistency_score +
            0.15 * per_match_contribution +
            0.10 * experience_bonus +
            np.random.normal(0, 1.8) # small natural variance
        )
        performance_score = round(float(np.clip(raw_score, 15.0, 99.0)), 2)
        
        records.append({
            'player_id': player_id,
            'sport_name': sport,
            'matches_played': matches_played,
            'matches_won': matches_won,
            'win_rate': win_rate,
            'goals_or_points': goals_or_points,
            'assists_or_passes': assists_or_passes,
            'recent_form': round(recent_form, 2),
            'consistency_score': round(consistency_score, 2),
            'minutes_played': minutes_played,
            'performance_score': performance_score
        })
        
    df = pd.DataFrame(records)
    return df

if __name__ == '__main__':
    dataset_dir = os.path.join(os.path.dirname(__file__), '..', 'datasets')
    os.makedirs(dataset_dir, exist_ok=True)
    csv_path = os.path.join(dataset_dir, 'sports_performance_dataset.csv')
    df = generate_sports_dataset(1500)
    df.to_csv(csv_path, index=False)
    print(f"Generated {len(df)} sports records at {csv_path}")
    print(df.head())

