var expect  = require('chai').expect
var request = require('request')

describe('Llegamos al inicio', function() {
    var url = "http://localhost:3000/"

    it('returns status 200', function() {
      request(url, function(error, response, body) {
        console.log('esto funciona')
        expect(response.statusCode).to.equal(200)
      })
    })
})
