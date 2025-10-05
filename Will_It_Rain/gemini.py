import google.generativeai as genai

GEMINI_API_KEY = "AIzaSyD2fHtwwRzaDs9t1BmJKJNNqEHGgBIp_IY"

async def get_explicacao(dados):
    try:
        # Monta o prompt para o Gemini
        prompt = (
           "Com base nos dados, retorne se o clima é muito agradável, agradável, neutro, desconfortável ou muito desconfortável."
            "e de uma breve dica para qual tipo de atividade seria favorável aquele dia."
            "O retorno deve ser apenas isso, de uma forma breve, máximo 15 palavras."
            "\nDados: "
            f"{dados}"

        )
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel("gemini-2.5-pro")
        resposta = model.generate_content(prompt)
        explicacao = resposta.text if hasattr(resposta, "text") else str(resposta)
        return explicacao
    except Exception as e:
        return {"erro": str(e)}