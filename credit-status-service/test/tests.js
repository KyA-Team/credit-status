/* eslint-disable */
const chai = require('chai');
const chaiHttp = require('chai-http');

process.env.QUOTA_PORT = 3001;
process.env.MONGO_USER = 'root';
process.env.MONGO_PASSWORD = 'example';
const app = require('../src/app');

chai.use(chaiHttp);
chai.should();


describe('credit-status single', () => {
  describe('GET /creditStatus', () => {
    it('should get credit status for a single CUIT', (done) => {
      
      const id = 35366634;
      const token = 'limit10';
      chai.request(app)
        .get(`/creditStatus/${id}`)
        .set('Authorization', `bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.should.to.have.lengthOf(1);
          done();
        });
    });

    it('should not get credit status without an api key', (done) => {
      const id = 35366634;
      chai.request(app)
        .get(`/creditStatus/${id}`)
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });

    it('should not get credit status with invalid api key', (done) => {
      const id = 35366634;
      const token = 'non-existent-token';
      chai.request(app)
        .get(`/creditStatus/${id}`)
        .set('Authorization', `bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(403);
          done();
        });
    });

    it('should not get credit status with exhausted api key', (done) => {
      const id = 35366634;
      const token = 'limit0';
      chai.request(app)
        .get(`/creditStatus/${id}`)
        .set('Authorization', `bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(403);
          done();
        });
    });

    it('should not get credit status for non existent CUIT', (done) => {
      const id = -1;
      chai.request(app)
        .get(`/creditStatus/${id}`)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
});


describe('credit-status multiple', () => {
  describe('GET /creditStatus/multipleQuery', () => {
    it('should get credit status for multiple CUITs', (done) => {
      
      const ids = [ 35366634, 94779065 ];
      const token = 'limit10';
      chai.request(app)
        .post(`/creditStatus/multipleQuery`)
        .set('Authorization', `bearer ${token}`)
        .send(ids)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.should.to.have.lengthOf(2);
          done();
        });
    });

    it('should not get credit status without an api key', (done) => {
      const ids = [ 35366634, 94779065 ];
      chai.request(app)
        .post(`/creditStatus/multipleQuery`)
        .send(ids)
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });

    it('should not get credit status with invalid api key', (done) => {
      const ids = [ 35366634, 94779065 ];
      const token = 'non-existent-token';
      chai.request(app)
        .post(`/creditStatus/multipleQuery`)
        .set('Authorization', `bearer ${token}`)
        .send(ids)
        .end((err, res) => {
          res.should.have.status(403);
          done();
        });
    });

    it('should not get credit status with exhausted api key', (done) => {
      const ids = [ 35366634, 94779065 ];
      const token = 'limit0';
      chai.request(app)
        .post(`/creditStatus/multipleQuery`)
        .set('Authorization', `bearer ${token}`)
        .send(ids)
        .end((err, res) => {
          res.should.have.status(403);
          done();
        });
    });

    it('should not get credit status without body in post', (done) => {
      chai.request(app)
        .get(`/creditStatus/multipleQuery`)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });

    it('should return error if body has wrong format', (done) => {
      const token = 'limit10';
      chai.request(app)
        .get(`/creditStatus/multipleQuery`)
        .set('Authorization', `bearer ${token}`)
        .send("wrongFormat")
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });

    it('should get 404 for credit status for non existant CUITs', (done) => {
      const ids = [ -1, -2 ];
      const token = 'limit10';
      chai.request(app)
        .post(`/creditStatus/multipleQuery`)
        .set('Authorization', `bearer ${token}`)
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

    it('Should return 400 in creditStatus/multipleQuery', (done) => {
      chai.request(app)
        .get('/creditStatus/multipleQuery')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          done();
        });
    });

    it('Should return 400 in /creditStatus with no CUIT', (done) => {
      chai.request(app)
        .get('/creditStatus')
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
