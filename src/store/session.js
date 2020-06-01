const axios = require('axios').default;

module.exports.session = axios.create({
  baseURL: 'https://bdd-project.herokuapp.com/',
  timeout: 4000,
});
