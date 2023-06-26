import './config/init';
import cluster from 'cluster';
import path from 'path';
// Dont touch
cluster.setupPrimary({
  exec: path.join(__dirname, 'server', 'index.ts'),
});

cluster.fork();
cluster.fork();

cluster.on('disconnect', worker => {
  console.log(`worker id:${worker.id} disconnected`);
});

cluster.on('listening', worker => {
  console.log(`worker id:${worker.id} listen`);
});

cluster.on('exit', worker => {
  console.log(`worker id:${worker} exit`);
});
