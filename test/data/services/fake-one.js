function init(_config_, _logger_) {
    var logger = _logger_;      

    logger.info('I\'m a useless service');
}

function echo(msg) {
  return msg;
}

module.exports = {
    init: init,
    echo: echo
};
