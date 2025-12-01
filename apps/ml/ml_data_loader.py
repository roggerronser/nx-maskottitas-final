import requests
import pandas as pd

API = "http://localhost:3000/api"   # ← Ajustar si tu backend usa otro puerto


def obtener_datos_desde_backend():
    # === 1. Obtener síntomas (opcional, solo informativo)
    sintomas = requests.get(f"{API}/sintoma").json()

    # === 2. Obtener consultas con sus síntomas
    consultas = requests.get(f"{API}/consulta").json()

    # === 3. Obtener exámenes
    examenes = requests.get(f"{API}/examen").json()

    # === 4. Obtener resultados diagnósticos
    resultados = requests.get(f"{API}/resultado").json()

    # Convertir a DataFrame
    df_consulta = pd.DataFrame(consultas)
    df_examen = pd.DataFrame(examenes)
    df_resultado = pd.DataFrame(resultados)

    # Asegurar columnas obligatorias
    if "id_sintoma" not in df_consulta:
        df_consulta["id_sintoma"] = [[] for _ in range(len(df_consulta))]

    # Relacionar consulta → examen
    df = df_consulta.merge(df_examen, on="id_consulta", how="left")

    # Relacionar examen → resultado
    df = df.merge(df_resultado, on="id_examen", how="left")

    # Filtrar columnas útiles
    df = df[["id_consulta", "id_sintoma", "diagnt_definitivo"]]

    df.rename(columns={"diagnt_definitivo": "resultado"}, inplace=True)

    # Filtrar filas válidas
    df = df.dropna(subset=["resultado"])

    return df
