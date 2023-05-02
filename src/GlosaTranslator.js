var request = require('superagent');

function GlosaTranslator(endpoint) {
  this.endpoint = endpoint;
}

GlosaTranslator.prototype.translate = function (text, domain, callback) {
  let ok = true;
  let time = 5;
  const size = text.split(' ').length;

  if (size > 50) time += size * 0.4 / 10;

  const timeout = setTimeout(() => {
    ok = false;
    callback(undefined, 'timeout_error');
  }, time * 1000);

  request.post(this.endpoint, { text: text, domain: domain }).end(
    function (err, response) {
      if (err) {
        callback(undefined, err);
        return;
      } else clearTimeout(timeout);

      if (ok) callback(response.text);
    }
  );
};

module.exports = GlosaTranslator;
