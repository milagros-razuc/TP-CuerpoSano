import http from './http'
export const income = (params) => http.get('/pagos/reportes', { params }).then(r=>r.data)
export const attendance = (params) => http.get('/asistencias/reportes', { params }).then(r=>r.data)
