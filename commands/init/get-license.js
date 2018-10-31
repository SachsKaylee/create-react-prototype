const https = require("https");

const getLicense = name => {
  const nameLower = name.toLowerCase();
  const options = {
    hostname: "api.github.com",
    path: `/licenses/${nameLower}`,
    method: 'GET',
    agent: false,
    headers: {
      "User-Agent": "create-react-prototype"
    }
  };
  return new Promise((resolve, reject) => {
    https.get(options, resp => {
      let data = '';

      if (resp.statusCode !== 200) {
        reject(resp.statusCode);
      }

      resp.on('data', (chunk) => {
        data += chunk;
      });

      resp.on('end', () => {
        try {
          const { body } = JSON.parse(data);
          resolve(body);
        } catch (e) {
          reject(e);
        }
      });

    }).on("error", reject);
  });
};

module.exports = getLicense;