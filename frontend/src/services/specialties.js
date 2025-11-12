import http from './http'
export const listAll = (params) => http.get('/especialidades', { params }).then(r=>r.data)
export const createOne = (payload) => http.post('/especialidades', payload).then(r=>r.data)
export const updateOne = (id, payload) => http.put('/especialidades/'+id, payload).then(r=>r.data)
export const deleteOne = (id) => http.delete('/especialidades/'+id).then(r=>r.data)
