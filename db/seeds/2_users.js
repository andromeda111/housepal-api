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
          deviceId: 'blank1',
          house_id: 2
        },
        {
          id: 2,
          name: 'Ryan',
          email: 'ryan@ryan.com',
          h_pw: '$2a$12$P38wkHnIwx9LDuyL4TYMFeLjDEbruZ6QQrsswIjqnpS.eZ.eGiOse',
          deviceId: 'blank2',
          house_id: 1
        },
        {
          id: 3,
          name: 'Cassa',
          email: 'c@c.com',
          h_pw: '$2a$12$P38wkHnIwx9LDuyL4TYMFeLjDEbruZ6QQrsswIjqnpS.eZ.eGiOse',
          deviceId: 'blank3',
          house_id: 1
        },
        {
          id: 4,
          name: 'Lindsey',
          email: 'lindsey@lindsey.com',
          h_pw: '$2a$12$P38wkHnIwx9LDuyL4TYMFeLjDEbruZ6QQrsswIjqnpS.eZ.eGiOse',
          deviceId: 'blank4',
          house_id: 1
        },
        {
          id: 5,
          name: 'David',
          email: 'david@david.com',
          h_pw: '$2a$12$P38wkHnIwx9LDuyL4TYMFeLjDEbruZ6QQrsswIjqnpS.eZ.eGiOse',
          deviceId: 'blank5',
          house_id: 1
        }
      ]);
    }).then(() => {
      return knex.raw(
        "SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));"
      );
    });
};
