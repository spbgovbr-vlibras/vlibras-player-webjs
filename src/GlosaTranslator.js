var request = require('superagent');

function GlosaTranslator(endpoint) {
  this.endpoint = endpoint;
}

GlosaTranslator.prototype.translate = function (text, callback) {
  console.log('GT.t:', 'Text: ' + text);

  request.get(this.endpoint).query({ text: text }).end(
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
