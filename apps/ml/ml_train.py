import pandas as pd
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.naive_bayes import MultinomialNB
from ml_data_loader import obtener_datos_desde_backend
import joblib


def entrenar_modelo():
    try:
        df = obtener_datos_desde_backend()

        if df.empty:
            print("⚠ No hay datos suficientes para entrenar.")
            return None, None

        # === Preparar datos ===
        X_raw = df["id_sintoma"].tolist()
        y = df["resultado"]

        mlb = MultiLabelBinarizer()
        X = mlb.fit_transform(X_raw)

        # === Modelo Naive Bayes ===
        model = MultinomialNB()
        model.fit(X, y)

        # Guardar modelo
        joblib.dump(model, "modelo.pkl")
        joblib.dump(mlb, "mlb.pkl")

        print("✅ Modelo entrenado satisfactoriamente.")
        return model, mlb

    except Exception as e:
        print("❌ Error entrenando modelo:", e)
        return None, None
