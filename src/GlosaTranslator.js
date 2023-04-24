var request = require('superagent');

function GlosaTranslator(endpoint) {
  this.endpoint = endpoint;
}

GlosaTranslator.prototype.translate = function (text, domain, callback) {
  // console.log('Translate: ' + text);

  request.post(this.endpoint, { text: text, domain: domain }).end(
    function (err, response) {
      if (err) {
        callback(undefined, err);
        return;
      }

      callback(response.text);
    }
  );
};

module.exports = GlosaTranslator;
