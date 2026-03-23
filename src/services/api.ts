import axios from "axios";

import { HistoryResponse, PredictionFormPayload, PredictResponse } from "@/types/prediction";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1",
    timeout: 12000,
});

export const predictionApi = {
    async predict(payload: PredictionFormPayload): Promise<PredictResponse> {
        const response = await api.post<PredictResponse>("/predict", payload);
        return response.data;
    },

    async getHistory(limit = 10): Promise<HistoryResponse> {
        const response = await api.get<HistoryResponse>(`/predict/history?limit=${limit}`);
        return response.data;
    },
};
