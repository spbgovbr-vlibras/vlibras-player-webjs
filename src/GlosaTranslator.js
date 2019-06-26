var request = require('superagent');

function GlosaTranslator(endpoint) {
  this.endpoint = endpoint;
}

GlosaTranslator.prototype.translate = function (text, callback) {
  // console.log('Translate: ' + text);

  request.post(this.endpoint, { text: text }).end(
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
