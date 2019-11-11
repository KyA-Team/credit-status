/* eslint-disable */
const chai = require('chai');
const chaiHttp = require('chai-http');

process.env.MONGO_USER = 'root';
process.env.MONGO_PASSWORD = 'example';
const app = require('../src/app');

chai.use(chaiHttp);
chai.should();


describe('Get available quota for a key', () => {
  describe('GET /api/available-quota/:key', () => {
    it('Should get quota for a key', (done) => {
      const key='limit10'
      const admin_key = 'admin'
      chai.request(app)
        .get(`/api/available-quota/${key}`)
        .set('Authorization', `bearer ${admin_key}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.quotaLimit.should.be.a('number');
          done();
        });
    });

    it('Should not get quota if there is no auth', (done) => {
      const key='limit10'
      chai.request(app)
        .get(`/api/available-quota/${key}`)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.quotaLimit.should.be.a('number');
          done();
        });
    });

    it('Should not get quota if non admin auth', (done) => {
      const key='limit10'
      const admin_key = 'non_admin'
      chai.request(app)
        .get(`/api/available-quota/${key}`)
        .set('Authorization', `bearer ${admin_key}`)
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.be.a('object');
          res.body.quotaLimit.should.be.a('number');
          done();
        });
    });

    it('Should get 404 if key doesnt exist', (done) => {
      const key='non_existent_key'
      const admin_key = 'admin'
      chai.request(app)
        .get(`/api/available-quota/${key}`)
        .set('Authorization', `bearer ${admin_key}`)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });

  });
});

describe('Get limit for a key', () => {
  describe('GET /api/quota-limit/:key', () => {
    
  });
});

describe('Set limit for a key', () => {
  describe('PUT /api/quota-limit/:key', () => {
    
  });
});

describe('Update consumed quota', () => {
  describe('PUT /api/consume-quota/:key', () => {
    
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
