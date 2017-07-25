exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('shopping_list_items').del()
    .then(function() {
      // Inserts seed entries
      return knex('shopping_list_items').insert([
        {
          id: 1,
          item: 'Dishwasher Soap',
          checked: false,
          buyer: 'Lindsey',
          house_id: 1
        },
        {
          id: 2,
          item: 'Trash Bags',
          checked: false,
          buyer: '',
          house_id: 1
        },
        {
          id: 3,
          item: 'Coffee Filters',
          checked: false,
          buyer: 'Ryan',
          house_id: 1
        }
      ]);
    }).then(() => {
      return knex.raw(
        "SELECT setval('shopping_list_items_id_seq', (SELECT MAX(id) FROM shopping_list_items));"
      );
    });
};
