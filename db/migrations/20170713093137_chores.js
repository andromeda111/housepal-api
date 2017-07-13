exports.up = function(knex, Promise) {
  return knex.schema.createTable('chores', (table) => {
    table.increments()
    table.string('chore').notNullable().defaultTo('')
    table.boolean('due_Sun').notNullable().defaultTo(false)
    table.boolean('due_Mon').notNullable().defaultTo(false)
    table.boolean('due_Tues').notNullable().defaultTo(false)
    table.boolean('due_Wed').notNullable().defaultTo(false)
    table.boolean('due_Thurs').notNullable().defaultTo(false)
    table.boolean('due_Fri').notNullable().defaultTo(false)
    table.boolean('due_Sat').notNullable().defaultTo(false)
    table.jsonb('cycle').notNullable()
    table.integer('startWith').notNullable().defaultTo(0)
    table.boolean('done').notNullable().defaultTo(false)
    table.integer('house_id').references('id').inTable('houses').notNullable().defaultTo(0).onDelete('CASCADE').index()
    table.timestamps(true, true)
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('chores')
};
