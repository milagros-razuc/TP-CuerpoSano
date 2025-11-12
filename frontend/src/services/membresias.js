import http from './http'

export const listAll = (params) => http.get('/membresias', { params }).then(r => r.data)

export default { listAll }
