/* eslint-disable */
const chai = require('chai');
const chaiHttp = require('chai-http');

process.env.QUOTA_PORT = 3001;
process.env.MONGO_USER = 'root';
process.env.MONGO_PASSWORD = 'example';
const app = require('../src/app');

chai.use(chaiHttp);
chai.should();

const valid_token = '44444'
const valid_ids = [ 35366634, 94779065 ]
const [valid_id] = valid_ids;
const exhausted_token = '00000'


describe('credit-status single', () => {
  describe('GET /credit-status', () => {
    it('should get credit status for a single CUIT', (done) => {
      chai.request(app)
        .get(`/credit-status/${valid_id}`)
        .set('Authorization', `bearer ${valid_token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.should.to.have.lengthOf(1);
          done();
        });
    });

    it('should not get credit status without an api key', (done) => {
      chai.request(app)
        .get(`/credit-status/${valid_id}`)
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });

    it('should not get credit status with invalid api key', (done) => {
      const token = 'non-existent-token';
      chai.request(app)
        .get(`/credit-status/${valid_id}`)
        .set('Authorization', `bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(403);
          done();
        });
    });

    it('should not get credit status with exhausted api key', (done) => {
      chai.request(app)
        .get(`/credit-status/${valid_id}`)
        .set('Authorization', `bearer ${exhausted_token}`)
        .end((err, res) => {
          res.should.have.status(403);
          done();
        });
    });

    it('should not get credit status for non existent CUIT', (done) => {
      const id = 11111111121;
      chai.request(app)
        .get(`/credit-status/${id}`)
        .set('Authorization', `bearer ${valid_token}`)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
});


describe('credit-status multiple', () => {
  describe('GET /credit-status/multiple-query', () => {
    it('should get credit status for multiple CUITs', (done) => {
        chai.request(app)
        .post(`/credit-status/multiple-query`)
        .set('Authorization', `bearer ${valid_token}`)
        .send(valid_ids)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.should.to.have.lengthOf(2);
          done();
        });
    });

    it('should not get credit status without an api key', (done) => {
      chai.request(app)
        .post(`/credit-status/multiple-query`)
        .send(valid_ids)
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });

    it('should not get credit status with invalid api key', (done) => {
      const token = 'non-existent-token';
      chai.request(app)
        .post(`/credit-status/multiple-query`)
        .set('Authorization', `bearer ${token}`)
        .send(valid_ids)
        .end((err, res) => {
          res.should.have.status(403);
          done();
        });
    });

    it('should not get credit status with exhausted api key', (done) => {
      chai.request(app)
        .post(`/credit-status/multiple-query`)
        .set('Authorization', `bearer ${exhausted_token}`)
        .send(valid_ids)
        .end((err, res) => {
          res.should.have.status(403);
          done();
        });
    });

    it('should not get credit status without body in post', (done) => {
      chai.request(app)
        .get(`/credit-status/multiple-query`)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });

    it('should return error if body has wrong format', (done) => {
      chai.request(app)
        .get(`/credit-status/multiple-query`)
        .set('Authorization', `bearer ${valid_token}`)
        .send("wrongFormat")
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });

    it('should get 404 for credit status for non existant CUITs', (done) => {
      const ids = [ 11111111121, 11111111123 ];
      chai.request(app)
        .post(`/credit-status/multiple-query`)
        .set('Authorization', `bearer ${valid_token}`)
        .send(ids)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('array');
          res.body.should.to.have.lengthOf(0);
          done();
        });
    });
  });
});


describe('non-functional endpoints', () => {
  describe('Informational endpoints', () => {
    it('Should return 200 in /', (done) => {
      chai.request(app)
        .get('/')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });

    it('Should return 400 in credit-status/multiple-query', (done) => {
      chai.request(app)
        .get('/credit-status/multiple-query')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          done();
        });
    });

    it('Should return 400 in /credit-status with no CUIT', (done) => {
      chai.request(app)
        .get('/credit-status')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          done();
        });
    });
  });
  
  describe('Generic endpoints', () => {
    it('Should return 404 on non existent endpoints', (done) => {
      chai.request(app)
        .get('/non-existing-link')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          done();
        });
    });

    it('Should force an error when accessing break and return 500', (done) => {
      chai.request(app)
        .get('/break')
        .end((err, res) => {
          res.should.have.status(500);
          res.body.should.be.a('object');
          done();
        });
    });
  });
});
