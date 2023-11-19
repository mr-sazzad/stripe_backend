import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './config/index';
const httpStatus = require('http-status');


process.on('uncaughtException', error => {
  console.log(error);
  process.exit(1);
});

let server: Server;

async function boostrap() {
  try {
    await mongoose.connect(config.database_url as string);
    console.log(`🛢   Database is connected successfully`);

    server = app.listen(config.port, () => {
      console.log(`Application listening on port ${config.port}`);
    });
  } catch (err) {
    console.log('Failed to connect to the database', err);
    process.exit(1);
  }

  process.on('unhandledRejection', error => {
    console.log(
      'Unhandled Rejection is detected, we are closing our server...'
    );
    console.log(error);

    if (server) {
      server.close(() => {
        console.log('Server closed.');
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });

  process.on('SIGTERM', () => {
    console.log('SIGTERM is received');
    if (server) {
      server.close(() => {
        console.log('Process terminated');
      });
    }
  });
}

boostrap();
