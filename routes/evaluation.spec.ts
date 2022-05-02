import request from 'supertest';
import { createServer } from '../index';
import { SpeechesEvaluationResponse } from '../models';

describe('routes.evaluation:', () => {
  const app = createServer();

  it('should return empty SpeechesEvaluationResponse, if there is no URL query parameters passed',  (done) => {
    const expectedResult: SpeechesEvaluationResponse = {
      mostSpeeches: null,
      mostSecurity: null,
      leastWordy: null,
    };

    request(app)
      .get('/evaluation')
      .expect('Content-type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect((res.body)).toEqual(expectedResult);
        return done();
      });
  });

  it('should return error, if something went wrong', (done) => {
    request(app).get('/evaluation')
      .query({ url: 'https://localhost/error-exception.csv' })
      .send()
      .expect('Content-type', /json/)
      .expect(500)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body).toHaveProperty('message');
        return done();
      });
  });

  it('should return SpeechesEvaluationResponse properly',  (done) => {
    const expectedResult: SpeechesEvaluationResponse = {
      mostSpeeches: null,
      mostSecurity: 'Alexander Abel',
      leastWordy: 'Caesare Collins',
    };

    request(app).get('/evaluation')
      .query({ url: './mocks/speeches-1.mock.csv' })
      .send()
      .expect(200)
      .expect('Content-type', /json/)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body).toEqual(expectedResult);
        return done();
      });
  });
});
