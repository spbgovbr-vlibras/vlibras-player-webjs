var request = require('superagent');

function GlosaTranslator(endpoint) {
  this.endpoint = endpoint;
}

GlosaTranslator.prototype.translate = function (text, domain, callback) {
  const time = 30000; // 30s
  let hasTimeout = false;

  const timeout = setTimeout(() => {
    hasTimeout = true;
    callback(undefined, 'timeout_error');
  }, time);

  request.post(this.endpoint, { text, domain }).end(
    function (err, response) {
      if (hasTimeout) return;

      clearTimeout(timeout);
      if (err) callback(undefined, err);
      else callback(JSON.parse(response.text));
    }
  );
};

module.exports = GlosaTranslator;
