exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('houses').del()
    .then(function() {
      // Inserts seed entries
      return knex('houses').insert([
        {
          id: 1,
          title: 'Tanglemansion',
          code: 'h1code'
        },
        {
          id: 2,
          title: 'Home 2',
          code: 'h2code'
        }
      ]);
    });
};
