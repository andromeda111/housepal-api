exports.up = function(knex, Promise) {
  return knex.schema.createTable('users_chores', (table) => {
    table.increments()
    table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE').index()
    table.integer('chore_id').notNullable().references('id').inTable('chores').onDelete('CASCADE').index()
    table.timestamps(true, true)
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users_chores')
};
