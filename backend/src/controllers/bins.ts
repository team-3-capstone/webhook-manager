import express, { Request, Response } from 'express';
import { getBinRequests } from '../mongoAPI';

const binsRouter = express.Router();
interface Client {
  client: Response, 
  endpoint: string
}
let clients: Client[] = [];

binsRouter.get('/:endpoint_id', (req: Request, res: Response) => {
  getBinRequests(req.params.endpoint_id).then((webhookRequests) => res.json(webhookRequests));
});

binsRouter.get('/events/:endpoint_id', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Add the response object to the clients array
  clients.push({endpoint: req.params.endpoint_id, client: res});

  // Handle client disconnection
  req.on('close', () => {
    // Remove the response object from the clients array
    clients = clients.filter(({client}) => client !== res);
  });
});

export function sendEventToClients(eventData, endpoint) {
  const formattedEventData = `data: ${JSON.stringify(eventData)}\n\n`;

  clients.forEach(client => {
    if (client.endpoint === endpoint) {
      client.client.write(formattedEventData);
    }
  });
}

export default binsRouter;