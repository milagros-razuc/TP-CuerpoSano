import http from './http'
export const listAll = (params) => http.get('/pagos', { params }).then(r=>r.data)
export const createOne = (payload) => http.post('/pagos', payload).then(r=>r.data)
export const updateOne = (id, payload) => http.put('/pagos/'+id, payload).then(r=>r.data)
export const deleteOne = (id) => http.delete('/pagos/'+id).then(r=>r.data)
