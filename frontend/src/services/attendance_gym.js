import http from './http'
export const listAll = (params) => http.get('/asistencias/gimnasio', { params }).then(r=>r.data)
export const createOne = (payload) => http.post('/asistencias/gimnasio', payload).then(r=>r.data)
export const updateOne = (id, payload) => http.put('/asistencias/gimnasio/'+id, payload).then(r=>r.data)
export const deleteOne = (id) => http.delete('/asistencias/gimnasio/'+id).then(r=>r.data)