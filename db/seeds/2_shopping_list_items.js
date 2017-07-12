exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('shopping_list_items').del()
    .then(function() {
      // Inserts seed entries
      return knex('shopping_list_items').insert([
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
    }).then(() => {
      return knex.raw(
        "SELECT setval('shopping_list_items_id_seq', (SELECT MAX(id) FROM shopping_list_items));"
      );
    });
};
