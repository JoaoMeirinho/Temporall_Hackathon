
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CloudRain, Thermometer, Wind, Droplets, Lightbulb } from "lucide-react";
import { Snowflake as SnowIcon } from "lucide-react";
import { toast } from "sonner";
import { buildUrl } from "@/lib/api";
import ChatBot from "@/components/ChatBot";

interface WeatherData {
  temperatura_previsto: number;
  temperatura_max_previsto: number;
  temperatura_min_previsto: number;
  precipitacao_previsto: number;
  precipitacao_neve_previsto: number;
  umidade_previsto: number;
  uv_previsto: number;
  vento_previsto: number;
}
interface Explanation {
  temperatura_previsto?: string;
  temperatura_max_previsto?: string;
  temperatura_min_previsto?: string;
  precipitacao_previsto?: string;
  precipitacao_neve_previsto?: string;
  umidade_previsto?: string;
  uv_previsto?: string;
  vento_previsto?: string;
  dicas_gerais?: { dica: string }[];
  // Adicione outros campos se necessário
}

interface BackendResponse {
  dados: WeatherData;
  explicacao: Record<string, string>;
}

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [explanation, setExplanation] = useState<Record<string,string>>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { date, locationData } = location.state || {};

  function getTemperatureColor(temp: number) {
    if (temp > 30) return 'text-red-600';
    if (temp >= 20 && temp <= 30) return 'text-yellow-500';
    if (temp >= 10 && temp < 20) return 'text-blue-300';
    if (temp < 10) return 'text-blue-600';
    return 'text-primary';
  }

  function getHumidityColor(humidity: number) {
    if (humidity < 30) return 'text-red-600';
    if ((humidity >= 30 && humidity < 40) || (humidity > 60 && humidity <= 70)) return 'text-yellow-500';
    if (humidity >= 40 && humidity <= 60) return 'text-green-600';
    if (humidity > 70) return 'text-yellow-500';
    return 'text-primary';
  }
  
  const getSnowDepth = (snow: number) => {
    if (snow > 20) return "Profunda (> 20 cm)";
    if (snow > 5) return "Moderada (5-20 cm)";
    if (snow > 0) return "Rasa (< 5 cm)";
    return "Nenhuma";
  };

  useEffect(() => {
    if (!date || !locationData) {
      toast.error("Dados incompletos. Por favor, selecione data e localização.");
      navigate("/");
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      const formattedDate = date.toISOString().split('T')[0];
      const url = buildUrl("/get", {
        latitude: locationData.lat,
        longitude: locationData.lng,
        data: formattedDate,
      });

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Erro ao buscar dados do servidor.");
        }
        const data: BackendResponse = await response.json();
        console.log("Dados recebidos:", data);
        console.log("Explicação recebida:", data.explicacao);
        setWeather(data.dados);
        setExplanation(data.explicacao);

        const newSuggestions = [];
        if (data.explicacao.umidade) {
            newSuggestions.push(`💧 Umidade do ar: ${data.explicacao.umidade}`);
        }
        if (data.explicacao.precipitacao) {
            newSuggestions.push(`☂️ Precipitação: ${data.explicacao.precipitacao}`);
        }
        if (data.explicacao.temperatura) {
            newSuggestions.push(`🌡️ Temperatura: ${data.explicacao.temperatura}`);
        }
        if (data.explicacao.precipitacao_neve) {
          newSuggestions.push(`❄️ Neve: ${data.explicacao.precipitacao_neve}`);
        }
        if (data.explicacao.vento) {
          newSuggestions.push(`💨 Vento: ${data.explicacao.vento}`);
        }

        if (newSuggestions.length === 0) {
          newSuggestions.push("✨ Condições climáticas favoráveis com bastante umidade! Aproveite seu dia!");
        }

        setSuggestions(newSuggestions);

      } catch (error) {
        toast.error(`Falha ao buscar previsão: ${error.message}`);
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [date, locationData, navigate]);

  if (isLoading || !weather) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p>Carregando dados...</p>
      </div>
    );
  }

  console.log("Explanation att:" + explanation);

  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage: "url('https://www.rodamundo.tur.br/blog/wp-content/uploads/2019/03/Ba%C3%ADa-dos-Porcos-em-Fernando-de-Noronha-rodamundo-1.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 bg-black/40 z-0" />
      <div className="relative z-10 p-4">
        <div className="max-w-4xl mx-auto px-4">
          <Button
            onClick={() => navigate("/")}
            variant="ghost"
            className="mb-6 text-white hover:bg-white/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <div className="space-y-6">
            <Card className="p-6 border-2">
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Previsão do Tempo
              </h1>
              <p className="text-muted-foreground">
                Data: {new Date(date).toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <p className="text-sm text-muted-foreground">
                Localização: {locationData.lat.toFixed(4)}, {locationData.lng.toFixed(4)}
              </p>
            </Card>

            <Card className="p-6 border-4 border-yellow-400 shadow-lg bg-yellow-50">
              <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="w-8 h-8 text-yellow-500 animate-pulse" />
                <h2 className="text-2xl font-bold text-yellow-700">Sugestões Personalizadas</h2>
              </div>
              <div className="space-y-3">
                {suggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-yellow-100 rounded-lg border-l-4 border-yellow-400"
                  >
                    <p className="text-sm text-yellow-900">{suggestion}</p>
                  </div>
                ))}
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-6 border-2">
                {/* Temperatura */}
                <div className="flex items-center gap-3 mb-4">
                  <Thermometer className="w-8 h-8 text-primary" />
                  <h2 className="text-xl font-semibold">Temperatura</h2>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Média</span>
                    <span className={`text-3xl font-bold ${getTemperatureColor(weather.temperatura_previsto)}`}>
                      {weather.temperatura_previsto}°C
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Máxima</span>
                    <span className="text-xl font-semibold">{weather.temperatura_max_previsto}°C</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Mínima</span>
                    <span className="text-xl font-semibold">{weather.temperatura_min_previsto}°C</span>
                  </div>
                  {explanation?.temperatura_previsto && (
                    <div className="mt-2 text-xs text-blue-900 bg-blue-100 rounded px-3 py-2 border-l-4 border-blue-300">
                      {explanation.temperatura_previsto}
                    </div>
                  )}
                  {explanation?.temperatura_max_previsto && (
                    <div className="mt-2 text-xs text-orange-900 bg-orange-100 rounded px-3 py-2 border-l-4 border-orange-300">
                      {explanation.temperatura_max_previsto}
                    </div>
                  )}
                  {explanation?.temperatura_min_previsto && (
                    <div className="mt-2 text-xs text-cyan-900 bg-cyan-100 rounded px-3 py-2 border-l-4 border-cyan-300">
                      {explanation.temperatura_min_previsto}
                    </div>
                  )}
                </div>
              </Card>

              <Card className="p-6 border-2">
                {/* Precipitação */}
                <div className="flex items-center gap-3 mb-4">
                  <CloudRain className="w-8 h-8 text-primary" />
                  <h2 className="text-xl font-semibold">Precipitação</h2>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Precipitação Total</span>
                    <span className="text-3xl font-bold text-primary">{weather.precipitacao_previsto} mm</span>
                  </div>
                  {explanation?.precipitacao_previsto && (
                    <div className="mt-2 text-xs text-blue-900 bg-blue-100 rounded px-3 py-2 border-l-4 border-blue-300">
                      {explanation.precipitacao_previsto}
                    </div>
                  )}
                </div>
              </Card>

              <Card className="p-6 border-2">
                {/* Umidade */}
                <div className="flex items-center gap-3 mb-4">
                  <Droplets className="w-8 h-8 text-primary" />
                  <h2 className="text-xl font-semibold">Umidade</h2>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Umidade relativa</span>
                    <span className={`text-3xl font-bold ${getHumidityColor(weather.umidade_previsto)}`}>
                      {weather.umidade_previsto}%
                    </span>
                  </div>
                  {explanation?.umidade_previsto && (
                    <div className="mt-2 text-xs text-blue-900 bg-blue-100 rounded px-3 py-2 border-l-4 border-blue-300">
                      {explanation.umidade_previsto}
                    </div>
                  )}
                </div>
              </Card>

              <Card className="p-6 border-2">
                {/* Vento */}
                <div className="flex items-center gap-3 mb-4">
                  <Wind className="w-8 h-8 text-primary" />
                  <h2 className="text-lg font-semibold">Vento</h2>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Velocidade</span>
                    <span className="text-2xl font-bold text-primary">{weather.vento_previsto} km/h</span>
                  </div>
                  {explanation?.vento_previsto && (
                    <div className="mt-2 text-xs text-blue-900 bg-blue-100 rounded px-3 py-2 border-l-4 border-blue-300">
                      {explanation.vento_previsto}
                    </div>
                  )}
                </div>
              </Card>
              
              <Card className="p-6 border-2">
                {/* Neve */}
                <div className="flex items-center gap-3 mb-4">
                  <SnowIcon className="w-8 h-8 text-primary" />
                  <h2 className="text-xl font-semibold">Neve</h2>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Precipitação</span>
                    <span className="text-2xl font-bold text-blue-700">
                      {weather.precipitacao_neve_previsto}mm
                    </span>
                  </div>
                
                  {explanation?.precipitacao_neve_previsto && (
                    <div className="mt-2 text-xs text-blue-900 bg-blue-100 rounded px-3 py-2 border-l-4 border-blue-300">
                      {explanation.precipitacao_neve_previsto}
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Dicas Gerais */}
            {explanation?.dicas_gerais && Array.isArray(explanation.dicas_gerais) && (
              <Card className="p-6 border-2 mt-6">
                <div className="flex items-center gap-3 mb-4">
                  <Lightbulb className="w-8 h-8 text-yellow-500 animate-pulse" />
                  <h2 className="text-2xl font-bold text-yellow-700">Dicas Gerais</h2>
                </div>
                <ul className="list-disc pl-6 space-y-2">
                  {explanation.dicas_gerais.map((item: any, idx: number) => (
                    <li key={idx} className="text-yellow-900">{item.dica}</li>
                  ))}
                </ul>
              </Card>
            )}
          </div>
        </div>
        <ChatBot />
      </div>
    </div>
  );
}