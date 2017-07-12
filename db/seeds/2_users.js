exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function() {
      // Inserts seed entries
      return knex('users').insert([
        {
          id: 1,
          name: 'John',
          email: 'john@john.com',
          h_pw: '$2a$12$Prg9z3l7/owKTEGIeoPUvuyMLstsawt8Py4VWGFJ8ZhcY8o2YXni.',
          house_id: 1
        },
        {
          id: 2,
          name: 'Ryan',
          email: '2@2.com',
          h_pw: '$2a$12$gLkiPfsf6OpZhifWe9ISI.8zICOQhy.d2QKsKDmD9jijcCHF/Da.y',
          house_id: 2
        },
        {
          id: 3,
          name: 'Cassa',
          email: 'c@c.com',
          h_pw: '$2a$12$Prg9z3l7/owKTEGIeoPUvuyMLstsawt8Py4VWGFJ8ZhcY8o2YXni.',
          house_id: 1
        }
      ]);
    }).then(() => {
      return knex.raw(
        "SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));"
      );
    });
};
