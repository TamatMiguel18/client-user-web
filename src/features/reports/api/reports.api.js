import api from "../../../shared/api/api";

// Obtener todos los reportes del usuario
export const getReportsByUser = async (userId) => {
    return await api.get(`/reports/user/${userId}`);
};

// Obtener reportes malos
export const getReportsBad = async () => {
    return await api.get("/reports/malas");
};

// Obtener reportes por ID
export const getReportsById = async (id) => {
    return await api.get(`/reports/${id}`);
};

// Obtener reportes por campo
export const getReportsByField = async (id) => {
    return await api.get(`/reports/fields/${id}`);
}

// Obtener reportes por dispositivo
export const getReportsByDevice = async (id) => {
    return await api.get(`/reports/device/${id}`);
}

