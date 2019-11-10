const express = require('express');
const bodyParser = require('body-parser'); // Parse JSON in request body
const riskStatusService = require('./riskStatusService');

const app = express();
const authentication = require('./authentication');

app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Nothing goes here'));

app.get('/riskStatus/multipleQuery', (req, res) => {
  res.status(400).send('You should be using POST');
});

app.get('/riskStatus', (req, res) => {
  res.status(400).send('You need to add a CUIL for this to work');
});

app.post('/riskStatus/multipleQuery', authentication.parseKey, async (req, res) => {
  const ids = req.body;
  if (!Array.isArray(ids)) {
    res.status(400).json({ status: 'Invalid request' });
    return;
  }

  // TODO: Don't send the ids length, remove duplicates first
  const hasQuota = await authentication.hasQuota(ids.length, res);
  if (!hasQuota) {
    return;
  }

  riskStatusService.getCreditStatus(ids).then((creditStatus) => {
    if (creditStatus.length) {
      res.json(creditStatus);
    } else {
      res.status(404).json([]);
    }
  }).catch((reason) => { res.status(500).json({}); throw reason; });
});

app.get('/riskStatus/:id(\\d+)', authentication.parseKey, (req, res) => {
  const { id } = req.params;
  riskStatusService.getCreditStatus([id]).then((creditStatus) => {
    if (creditStatus.length) {
      res.json(creditStatus);
    } else {
      res.status(404).json({});
    }
  });
});

app.get('/break', () => {
  throw new Error('Forced error for testing');
});

app.use((req, res) => {
  res.status(404).send('The page you are looking for does not exist');
});

app.use((req, res, err) => {
  console.error(err.stack); // eslint-disable-line no-console
  res.status(500).send('Oh no, the app just had an error!');
});

module.exports = app;
