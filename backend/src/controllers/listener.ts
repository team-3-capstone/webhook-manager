import express from 'express';

const listenerRouter = express.Router();

import { ListenerRequest, } from '../models';
import requestModel from '../models';

// debug route
listenerRouter.get('/', (_req, res) => {
  requestModel.find({}).then((requests) => {
    res.json(requests);
  });
});

listenerRouter.post('/:endpoint', (req, res) => {
  const body = req.body as object;

  const result: ListenerRequest = {
    headers: req.headers,
    endpoint: req.params.endpoint,
    body,
  };

  const request = new requestModel(result);
  request.save();

  // console.log(result);
  res.send(request.toJSON());
});

export default listenerRouter;