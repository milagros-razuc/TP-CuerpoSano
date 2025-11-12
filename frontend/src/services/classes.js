import http from './http'
export const listAll = (params) => http.get('/clases', { params }).then(r=>r.data)
export const createOne = (payload) => http.post('/clases', payload).then(r=>r.data)
export const updateOne = (id, payload) => http.put('/clases/'+id, payload).then(r=>r.data)
export const deleteOne = (id) => http.delete('/clases/'+id).then(r=>r.data)
