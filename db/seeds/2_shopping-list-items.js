exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('shopping-list-items').del()
    .then(function() {
      // Inserts seed entries
      return knex('shopping-list-items').insert([
        {
          id: 1,
          item: 'Toilet Paper (1)',
          checked: false,
          buyer: ''
        },
        {
          id: 2,
          item: 'Trash Bags (2)',
          checked: false,
          buyer: 'John'
        },
        {
          id: 3,
          item: 'Coffee Filters',
          checked: false,
          buyer: ''
        },
      ]);
    });
};
