var request = require('request');

describe('Calc', () =>{
    it('should multiply 2 and 2', () => {
        expect(2*2).toBe(4)
    }
    )
})



describe('get messages', () => {
    it('should return 200 OK', (done) => {
        request.get('http://localhost:3000/messages', (err, res) => {
            expect(res.statusCode).toEqual(200)
            done()
        })
    })
    it('should return a list, thats not empty', (done) => {
        request.get('http://localhost:3000/messages', (err, res) => {
            expect(JSON.parse(res.body).length).toBeGreaterThan(0)
            done()
        })
    })
})


describe('get messages from user', () => {
    it('should return 200 OK', (done) => {
        request.get('http://localhost:3000/messages/James', (err, res) => {
            expect(res.statusCode).toEqual(200)
            done()
        })
    })
    it('name should be james', (done) => {
        request.get('http://localhost:3000/messages/James', (err, res) => {
            console.log(JSON.parse(res.body)[1].name)
            expect(JSON.parse(res.body)[1].name).toEqual('James')
            done()
        })
    })
})



