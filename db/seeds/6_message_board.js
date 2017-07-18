exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('message_board').del()
    .then(function() {
      // Inserts seed entries
      return knex('message_board').insert([
        {
          id: 1,
          poster: 'John',
          content: 'Our neural pathways have become accustomed to your sensory input patterns. Now, how the hell do we defeat an enemy that knows us better than we know ourselves? Captain, why are we out here chasing comets? You did exactly what you had to do.',
          house_id: 1
        },
        {
          id: 2,
          poster: 'Cassa',
          content: 'This is post #2',
          house_id: 1
        },
        {
          id: 3,
          poster: 'Ryan',
          content: 'About four years. I got tired of hearing how young I looked. When has justice ever been as simple as a rule book? Worf, Its better than music. Its jazz.',
          house_id: 2
        }
      ]);
    }).then(() => {
      return knex.raw(
        "SELECT setval('message_board_id_seq', (SELECT MAX(id) FROM message_board));"
      );
    });
};
