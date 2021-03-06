const CCC = require('./ccc-streamer-utilities');

const _cache = {
  BTC: {},
  BCH: {},
  ETH: {},
  LTC: {},
};

const socket = require('socket.io-client')('https://streamer.cryptocompare.com/');

const subscription = ['2~Coinbase~BTC~USD', '2~Coinbase~BCH~USD', '2~Coinbase~ETH~USD', '2~Coinbase~LTC~USD'];

socket.on('connect', function() {
  console.log('Socket Connected!');
  socket.emit('SubAdd', {subs: subscription});
});

socket.on('disconnect', function() {
  console.log('Socket Disconnected!');
});

socket.on('reconnect', function() {
  console.log('Socket Reconnected!');
  socket.emit('SubAdd', {subs: subscription});
});

socket.on('m', function(message) {
  // e.g. 2~Coinbase~BTC~USD~1~18990~1513646467~0.15758392~2992.5186408~28890362~18310.834604059848~344920976.41323745~ce9
  const messageType = message.substring(0, message.indexOf("~"));
  if (messageType === CCC.STATIC.TYPE.CURRENT) {
    const res = CCC.CURRENT.unpack(message);
    if (res.PRICE) {
      priceUpdated(res.FROMSYMBOL, parseFloat(res.PRICE));
    }
  }
});

function priceUpdated(symbol, price) {
  const cachedObj = _cache[symbol];
  // if (price !== cachedObj.price) {
  //   console.log(symbol, price, price > cachedObj.price ? 'UP' : 'DOWN');
  // }
  cachedObj.price = price;
}

module.exports.getPrice = function(symbol) {
  return _cache[symbol].price;
};
