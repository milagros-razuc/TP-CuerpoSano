import http from './http'
export const listAll = (params) => http.get('/metodoPago', { params }).then(r=>r.data)
export const createOne = (payload) => http.post('/metodoPago', payload).then(r=>r.data)
export const updateOne = (id, payload) => http.put('/metodoPago/'+id, payload).then(r=>r.data)
export const deleteOne = (id) => http.delete('/metodoPago/'+id).then(r=>r.data)
