from flask import Flask, request, jsonify
import joblib
from ml_train import entrenar_modelo

app = Flask(__name__)

# === ENTRENAMIENTO AL INICIAR ===
print("🧠 Entrenando modelo automáticamente...")
model, mlb = entrenar_modelo()


@app.route("/predict", methods=["POST"])
def predict():
    global model, mlb

    if model is None or mlb is None:
        return jsonify({"error": "El modelo no está disponible"}), 500

    data = request.json
    sintomas = data.get("id_sintoma", [])

    if not sintomas:
        return jsonify({"error": "No se enviaron síntomas"}), 400

    X = mlb.transform([sintomas])
    proba = model.predict_proba(X)[0]
    clases = model.classes_

    predicciones = sorted(
        zip(clases, proba),
        key=lambda x: x[1],
        reverse=True
    )

    return jsonify({
        "principal": predicciones[0][0],
        "alternativos": [
            {"diagnostico": d, "probabilidad": round(p, 3)}
            for d, p in predicciones[1:]
        ]
    })


@app.route("/retrain", methods=["POST"])
def retrain():
    global model, mlb
    model, mlb = entrenar_modelo()
    return jsonify({"status": "Modelo reentrenado correctamente"})


if __name__ == "__main__":
    app.run(port=5000, debug=True)
