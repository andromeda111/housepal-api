exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('chores').del()
    .then(function() {
      // Inserts seed entries
      return knex('chores').insert([
        {
          id: 1,
          chore: 'Clean Kitchen Counters',
          daysDue: {daysDue: [true, false, false, false, false, false, false]},
          cycle: {cycleList: [1]},
          currentDueDay: {null: null, actualIdx: 0},
          currentAssigned: 0,
          dueToday: false,
          done: false,
          late: false,
          house_id: 1
        },
        {
          id: 2,
          chore: 'Trash to curb',
          daysDue: {daysDue: [true, true, false, false, false, false, false]},
          cycle: {cycleList: [1, 3]},
          currentDueDay: {null: null, actualIdx: 0},
          currentAssigned: 0,
          dueToday: false,
          done: false,
          late: false,
          house_id: 1
        },
        {
          id: 3,
          chore: 'Clean bathroom',
          daysDue: {daysDue: [true, true, true, false, false, false, false]},
          cycle: {cycleList: [2]},
          currentDueDay: {null: null, actualIdx: 0},
          currentAssigned: 0,
          dueToday: false,
          done: false,
          late: false,
          house_id: 2
        }
      ]);
    }).then(() => {
      return knex.raw(
        "SELECT setval('chores_id_seq', (SELECT MAX(id) FROM chores));"
      );
    });
};
