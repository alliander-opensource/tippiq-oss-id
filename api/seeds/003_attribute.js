exports.seed = knex =>
  knex('attribute').insert([{
    id: 'd6c926af-9ee7-44c3-842d-0ed511db93bf',
    user_id: '90c7c881-4b85-4d84-8867-f52e89525d76',
    data: '{"type":"place_key","token":"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJwbGFjZUlkIjoiZmQxYTA3MmMtZjhkNy00MTViLTk1NjEtYzhmMDAzYmE1YmJkIiwiaWF0IjoxNDgyMjI5ODE3LCJleHAiOjQ2Mzc5ODk4MTcsImF1ZCI6InRpcHBpcS1pZC5sb2NhbCIsImlzcyI6InRpcHBpcS1wbGFjZXMubG9jYWwifQ.Ney7pWLCZ1u-AVNoZgruf0MnGtFL_qSqKKKvdJZi9iHtN5nLUYZMA1NsSydKbf9ZBZUDeql2xaChEA1BN8hLWAury2ljhoRJBwmbBkC8DZbR3LAJjAgFRzv76TMiv78xfSIiuUZ04mdRUGorudidbcXx6Gh2ZDgVmNU_9hCRCFw","placeId":"fd1a072c-f8d7-415b-9561-c8f003ba5bbd"}',
    label: 'Mijn huis',
  }]);
