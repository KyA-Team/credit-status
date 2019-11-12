/* eslint-disable import/no-extraneous-dependencies */
/* eslint-env mocha */
const chai = require('chai');
const chaiHttp = require('chai-http');

process.env.MONGO_USER = 'root';
process.env.MONGO_PASSWORD = 'example';
const app = require('../src/app');

chai.use(chaiHttp);
chai.should();

const validKey = '44444';
const adminKey = 'admin';
const exhaustedKey = '00000';

describe('Get available quota for a key', () => {
  describe('GET /api/available-quota/:key', () => {
    it('Should get quota for a key', (done) => {
      chai.request(app)
        .get(`/api/available-quota/${validKey}`)
        .set('Authorization', `bearer ${adminKey}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('availableQuota').to.be.a('number').not.to.equal(0);
          done();
        });
    });

    it('Should get quota for an exhausted key', (done) => {
      chai.request(app)
        .get(`/api/available-quota/${exhaustedKey}`)
        .set('Authorization', `bearer ${adminKey}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('availableQuota', 0);
          res.body.should.have.property('availableQuota').to.be.a('number');
          done();
        });
    });

    it('Should not get quota if there is no auth', (done) => {
      chai.request(app)
        .get(`/api/available-quota/${validKey}`)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.not.have.property('availableQuota');
          done();
        });
    });

    it('Should not get quota if non admin auth', (done) => {
      const nonAdminKey = 'non_admin';
      chai.request(app)
        .get(`/api/available-quota/${validKey}`)
        .set('Authorization', `bearer ${nonAdminKey}`)
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.not.have.property('availableQuota');
          done();
        });
    });

    it('Should get 404 if key doesnt exist', (done) => {
      const key = 'non_existent_key';
      chai.request(app)
        .get(`/api/available-quota/${key}`)
        .set('Authorization', `bearer ${adminKey}`)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.not.have.property('availableQuota');
          done();
        });
    });
  });
  describe('GET /api/available-quota', () => {
    it('Should get quota for requesting user (non admin)', (done) => {
      chai.request(app)
        .get('/api/available-quota')
        .set('Authorization', `bearer ${validKey}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('availableQuota').to.be.a('number').not.to.equal(0);
          done();
        });
    });
  });
});

describe('Get limit for a key', () => {
  describe('GET /api/quota-limit/:key', () => {
    it('Should get quota limit for a key', (done) => {
      chai.request(app)
        .get(`/api/quota-limit/${validKey}`)
        .set('Authorization', `bearer ${adminKey}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('quotaLimit').to.be.a('number').not.to.equal(0);
          done();
        });
    });

    it('Should get quota limit for an exhausted key', (done) => {
      chai.request(app)
        .get(`/api/quota-limit/${exhaustedKey}`)
        .set('Authorization', `bearer ${adminKey}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('quotaLimit', 0);
          res.body.should.have.property('quotaLimit').to.be.a('number');
          done();
        });
    });

    it('Should not get quota limit if there is no auth', (done) => {
      chai.request(app)
        .get(`/api/quota-limit/${validKey}`)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.not.have.property('quotaLimit');
          done();
        });
    });

    it('Should not get quota limit if non admin auth', (done) => {
      const nonAdminKey = 'non_admin';
      chai.request(app)
        .get(`/api/quota-limit/${validKey}`)
        .set('Authorization', `bearer ${nonAdminKey}`)
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.not.have.property('quotaLimit');
          done();
        });
    });

    it('Should get 404 if key doesnt exist', (done) => {
      const key = 'non_existent_key';
      chai.request(app)
        .get(`/api/quota-limit/${key}`)
        .set('Authorization', `bearer ${adminKey}`)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.not.have.property('quotaLimit');
          done();
        });
    });
  });
  describe('GET /api/quota-limit', () => {
    it('Should get quota limit for requesting user (non admin)', (done) => {
      chai.request(app)
        .get('/api/quota-limit')
        .set('Authorization', `bearer ${validKey}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('quotaLimit').to.be.a('number').not.to.equal(0);
          done();
        });
    });
  });
});

describe('Set limit for a key', () => {
  describe('PUT /api/quota-limit/:key', () => {
    it('Should have tests', (done) => {
      chai.request(app)
        .put('/api/quota-limit')
        .end((err, res) => {
          res.should.fail();
          done();
        });
    });
  });
});

describe('Update consumed quota', () => {
  describe('PUT /api/consume-quota/:key', () => {
    it('Should have tests', (done) => {
      chai.request(app)
        .put('/api/quota-limit')
        .end((err, res) => {
          res.should.fail();
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
