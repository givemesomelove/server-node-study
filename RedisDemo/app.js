const studyRedis = require('./testRedis');

(async () => {
    await studyRedis.connect();
    studyRedis.test();
})();