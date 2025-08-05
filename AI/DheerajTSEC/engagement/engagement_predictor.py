import joblib
import pandas as pd
from textblob import TextBlob

# Load the pre-trained models
# It's a good practice to load models once when the application starts
try:
    lgbm_model = joblib.load('lightgbm_multi_engagement_model.pkl')
    xgb_model = joblib.load('xgboost_multi_engagement_model.pkl')
    print("Engagement prediction models loaded successfully.")
except FileNotFoundError:
    lgbm_model = None
    xgb_model = None
    print("Warning: Model files not found. Prediction endpoint will not work.")
except Exception as e:
    lgbm_model = None
    xgb_model = None
    print(f"An error occurred while loading models: {e}")


def preprocess_input(data: dict):
    """
    Preprocesses the raw input from the API request into a format
    the model can understand.
    """
    # Create a DataFrame from the input data
    df = pd.DataFrame([data])

    # 1. Feature Engineering for Timestamp
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df['hour'] = df['timestamp'].dt.hour
    df['day_of_week'] = df['timestamp'].dt.dayofweek  # Monday=0, Sunday=6

    # 2. Feature Engineering for Text
    df['text_length'] = df['text'].apply(len)
    df['sentiment'] = df['text'].apply(lambda text: TextBlob(text).sentiment.polarity)

    # 3. One-Hot Encode the Platform
    df['platform_LinkedIn'] = df['platform'].apply(lambda x: 1 if x.lower() == 'linkedin' else 0)
    df['platform_Twitter'] = df['platform'].apply(lambda x: 1 if x.lower() == 'twitter' else 0)

    # Define the feature order required by the models
    feature_order = [
        'hour',
        'day_of_week',
        'text_length',
        'sentiment',
        'platform_LinkedIn',
        'platform_Twitter'
    ]

    # Ensure the DataFrame has all the required columns in the correct order
    df = df[feature_order]

    return df


def predict_engagement(input_data: dict):
    """
    Predicts engagement metrics using both LightGBM and XGBoost models.
    """
    if not lgbm_model or not xgb_model:
        return None, "Models are not loaded. Cannot make predictions."

    try:
        # Preprocess the input data
        processed_df = preprocess_input(input_data)

        # Make predictions with both models
        lgbm_prediction = lgbm_model.predict(processed_df)
        xgb_prediction = xgb_model.predict(processed_df)

        # The models output an array of shape (1, 3) -> [[likes, comments, impressions]]
        # We extract the first element.
        lgbm_preds = lgbm_prediction[0]
        xgb_preds = xgb_prediction[0]

        # Structure the predictions into a dictionary
        predictions = {
            "lightgbm_prediction": {
                "predicted_likes": round(max(0, lgbm_preds[0])),
                "predicted_comments": round(max(0, lgbm_preds[1])),
                "predicted_impressions": round(max(0, lgbm_preds[2]))
            },
            "xgboost_prediction": {
                "predicted_likes": round(max(0, xgb_preds[0])),
                "predicted_comments": round(max(0, xgb_preds[1])),
                "predicted_impressions": round(max(0, xgb_preds[2]))
            }
        }
        return predictions, None
    except Exception as e:
        print(f"Error during prediction: {e}")
        return None, str(e)

