import cors from './cors';
import adapterUnpacker from './adapter/unpacker';
import counter from './counter';
import logger from './logger';
import statistics from './statistics';
import params from './params';
import _return from './return';
import adapterWs2 from './adapter/ws2';
import adapterAppserv from './adapter/appserv';
import adapterWxHerald from './adapter/wx-herald';
import related from './related';
import spiderServer from './spider-server';
import axios from './axios';
import auth from './auth';
import admin from './admin';
import redis from './redis';
import guard from './guard';
import term from './term';
import { middleware as slack } from './slack';
import captcha from './captcha';

export {
  cors,
  adapterUnpacker,
  counter,
  logger,
  statistics,
  params,
  _return,
  adapterWs2,
  adapterAppserv,
  adapterWxHerald,
  related,
  spiderServer,
  axios,
  auth,
  admin,
  redis,
  guard,
  term,
  slack,
  captcha,
};
