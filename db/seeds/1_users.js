exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function() {
      // Inserts seed entries
      return knex('users').insert([
        {
          id: 1,
          name: 'user1',
          email: 'jmseymour111@gmail.com',
          password: 'asdf'
        },
        {
          id: 2,
          name: 'user2',
          email: 'asdf@asdf.com',
          password: 'asdf'
        },
      ]);
    });
};
