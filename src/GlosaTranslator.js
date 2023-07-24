var request = require('superagent');

function GlosaTranslator(endpoint) {
  this.endpoint = endpoint;
}

GlosaTranslator.prototype.translate = function (text, domain, callback) {
  let time = 5;
  let hasTimeout = false;
  const size = text.split(' ').length;

  if (size > 50) time += size * 0.4 / 10;

  const timeout = setTimeout(() => {
    hasTimeout = true;
    callback(undefined, 'timeout_error');
  }, time * 1000);

  request.post(this.endpoint, { text: text, domain: domain }).end(
    function (err, response) {
      if (hasTimeout) return;

      clearTimeout(timeout);
      if (err) callback(undefined, err);
      else callback(response.text);
    }
  );
};

module.exports = GlosaTranslator;
