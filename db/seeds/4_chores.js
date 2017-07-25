exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('chores').del()
    .then(function() {
      // Inserts seed entries
      return knex('chores').insert([
        {
          id: 1,
          chore: 'Clean Kitchen Counters, Sink',
          daysDue: {daysDue: [0, 2]},
          cycle: {cycleList: [4]},
          currentDueDay: {currentDueDay: "2017-07-25", currentDueIdx: 0},
          currentAssigned: 0,
          dueToday: true,
          done: false,
          late: false,
          house_id: 1
        },
        {
          id: 2,
          chore: 'Trash to curb',
          daysDue: {daysDue: [4]},
          cycle: {cycleList: [3, 4]},
          currentDueDay: {currentDueDay: "2017-07-27", currentDueIdx: 0},
          currentAssigned: 0,
          dueToday: false,
          done: true,
          late: false,
          house_id: 1
        },
        {
          id: 3,
          chore: 'Clean bathroom',
          daysDue: {daysDue: [0, 4]},
          cycle: {cycleList: [2, 4]},
          currentDueDay: {currentDueDay: "2017-07-23", currentDueIdx: 0},
          currentAssigned: 0,
          dueToday: true,
          done: false,
          late: true,
          house_id: 1
        }
      ]);
    }).then(() => {
      return knex.raw(
        "SELECT setval('chores_id_seq', (SELECT MAX(id) FROM chores));"
      );
    });
};
