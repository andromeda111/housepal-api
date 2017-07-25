exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users_chores').del()
    .then(function() {
      // Inserts seed entries
      return knex('users_chores').insert([
        {
          id: 1,
          user_id: 2,
          chore_id: 1
        },
        {
          id: 2,
          user_id: 3,
          chore_id: 1
        },
        {
          id: 3,
          user_id: 3,
          chore_id: 2
        },
        {
          id: 4,
          user_id: 4,
          chore_id: 2
        },
        {
          id: 5,
          user_id: 2,
          chore_id: 3
        },
        {
          id: 6,
          user_id: 4,
          chore_id: 3
        }
      ]);
    }).then(() => {
      return knex.raw(
        "SELECT setval('users_chores_id_seq', (SELECT MAX(id) FROM users_chores));"
      );
    });
};
