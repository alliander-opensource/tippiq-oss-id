import ServerMock from './server-mock';

export const irmaApiMockServer = new ServerMock({ port: 8888 });

export const qrIssueJson = {
  u: 'Lg5IbGqo3WR1n547LaI5KP5cmND82EfTzDFnKACxkp',
  v: '2.1',
  vmax: '2.1',
};

export const qrVerifyJson = {
  u: 'TJDvhrDC9yFHytOJkz5rstZWQw5IhIt22BNwPZAyYpA',
  v: '2.1',
  vmax: '2.1',
};

irmaApiMockServer.app
  .post('/irma_api_server/api/v2/verification', (req, res) =>
    res.json(qrVerifyJson)
  )
  .post('/irma_api_server/api/v2/issue', (req, res) =>
    res.json(qrIssueJson)
  );
