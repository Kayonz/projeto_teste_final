import request from 'supertest';
import express from 'express';

const app = express();
app.use(express.json());

app.get('/test', (req, res) => {
  res.status(200).json({ message: 'Hello from test route!' });
});

describe('GET /test', () => {
  it('should return a success message', async () => {
    const res = await request(app).get('/test');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ message: 'Hello from test route!' });
  });
});


