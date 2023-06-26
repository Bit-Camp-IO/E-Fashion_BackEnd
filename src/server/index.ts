import express from 'express';

const app = express();

app.get('/h', async (_, res) => {
  // console.log(process.pid);
  let a = 0;
  for (let i = 0; i <= 100_000; i++) {
    a++;
  }
  res.json({
    pid: process.pid,
  });
});

app.listen(8080, () => {
  console.log('app listen in port 8080');
});

export default app;
