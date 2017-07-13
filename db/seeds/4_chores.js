exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('chores').del()
    .then(function() {
      // Inserts seed entries
      return knex('chores').insert([
        {
          id: 1,
          chore: 'Clean Kitchen Counters',
          due_Sun: false,
          due_Mon: false,
          due_Tues: true,
          due_Wed: false,
          due_Thurs: false,
          due_Fri: false,
          due_Sat: false,
          cycle: {cycleList: [1]},
          startWith: 1,
          done: false,
          house_id: 1
        },
        {
          id: 2,
          chore: 'Trash to curb',
          due_Sun: false,
          due_Mon: false,
          due_Tues: false,
          due_Wed: false,
          due_Thurs: false,
          due_Fri: true,
          due_Sat: false,
          cycle: {cycleList: [1, 2]},
          startWith: 2,
          done: false,
          house_id: 1
        },
        {
          id: 3,
          chore: 'Clean bathroom',
          due_Sun: false,
          due_Mon: false,
          due_Tues: false,
          due_Wed: false,
          due_Thurs: false,
          due_Fri: false,
          due_Sat: true,
          cycle: {cycleList: [2]},
          startWith: 2,
          done: false,
          house_id: 2
        }
      ]);
    }).then(() => {
      return knex.raw(
        "SELECT setval('chores_id_seq', (SELECT MAX(id) FROM chores));"
      );
    });
};
