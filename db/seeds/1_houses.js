exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('houses').del()
    .then(function() {
      // Inserts seed entries
      return knex('houses').insert([
        {
          id: 1,
          name: 'House #1',
          code: '98105'
        },
        {
          id: 2,
          name: 'House #2',
          code: '97007'
        },
      ]);
    });
};
