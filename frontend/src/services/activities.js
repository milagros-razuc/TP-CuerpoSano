import http from './http'
export const listAll = (params) => http.get('/actividades', { params }).then(r=>r.data)
export const createOne = (payload) => http.post('/actividades', payload).then(r=>r.data)
export const updateOne = (id, payload) => http.put('/actividades/'+id, payload).then(r=>r.data)
export const deleteOne = (id) => http.delete('/actividades/'+id).then(r=>r.data)