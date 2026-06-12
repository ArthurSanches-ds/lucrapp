const bcrypt = require('bcryptjs');
bcrypt.hash('sanches240592', 10).then(h => {
  console.log(h);
  bcrypt.compare('sanches240592', h).then(r => console.log('senha correta?', r));
});