// netlify/functions/fauna-schema-upload.js
const fetch = require('node-fetch'); // Ensure you have node-fetch installed

exports.handler = async function(event, context) {
  const endpoint = 'https://db.fauna.com/v4/graphql'; // FaunaDB GraphQL endpoint
  const secret = 'fnAFnRFqR3AASQwciCPBRupsjorACNH2d3SmPRei'; // FaunaDB secret key

  const schema = `
  type User {
    netlifyID: ID!
    stripeID: ID!
  }

  type Query {
    getUserByNetlifyID(netlifyID: ID!): User!
    getUserByStripeID(stripeID: ID!): User!
  }`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${secret}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: `mutation { createSchema(schema: "${schema}") { schema } }` })
  });

  const data = await response.json();

  if (!response.ok) {
    return {
      statusCode: response.status,
      body: JSON.stringify({ message: data.errors || data })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Schema uploaded successfully!' })
  };
};
