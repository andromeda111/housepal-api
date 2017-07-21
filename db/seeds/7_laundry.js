exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('laundry').del()
    .then(function() {
      // Inserts seed entries
      return knex('laundry').insert([
        {
          id: 1,
          washer_status: false,
          washer_start_time: {time: null},
          washer_current_user: {id: null, name: null},
          washer_notify: {users: null},
          dryer_status: false,
          dryer_start_time: {time: null},
          dryer_current_user: {id: null, name: null},
          dryer_notify: {users: null},
          house_id: 1
        },
        {
          id: 2,
          washer_status: false,
          washer_start_time: {time: null},
          washer_current_user: {id: null, name: null},
          washer_notify: {users: null},
          dryer_status: false,
          dryer_start_time: {time: null},
          dryer_current_user: {id: null, name: null},
          dryer_notify: {users: null},
          house_id: 2
        }
      ]);
    }).then(() => {
      return knex.raw(
        "SELECT setval('laundry_id_seq', (SELECT MAX(id) FROM laundry));"
      );
    });
};
