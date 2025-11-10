import http from './http'
export const listAll = (params) => http.get('/entrenadores', { params }).then(r=>r.data)
export const createOne = (payload) => http.post('/entrenadores', payload).then(r=>r.data)
export const updateOne = (id, payload) => http.put('/entrenadores/'+id, payload).then(r=>r.data)
export const deleteOne = (id) => http.delete('/entrenadores/'+id).then(r=>r.data)
