import http from './http'
export const income = (params) => http.get('/reports/income', { params }).then(r=>r.data)
export const attendance = (params) => http.get('/asistencias/reportes', { params }).then(r=>r.data)
