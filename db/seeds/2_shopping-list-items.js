exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('shopping-list-items').del()
    .then(function() {
      // Inserts seed entries
      return knex('shopping-list-items').insert([
        {
          id: 1,
          item: 'Dishwasher Soap (1)',
          checked: false,
          buyer: 'John',
          house_id: 1
        },
        {
          id: 2,
          item: 'Trash Bags (1)',
          checked: false,
          buyer: 'John',
          house_id: 1
        },
        {
          id: 3,
          item: 'Coffee Beans (2)',
          checked: false,
          buyer: 'Ryan',
          house_id: 2
        },
        {
          id: 4,
          item: 'Coffee Filters (2)',
          checked: false,
          buyer: '',
          house_id: 2
        },
      ]);
    });
};
