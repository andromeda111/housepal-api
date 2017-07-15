exports.up = function(knex, Promise) {
  return knex.schema.createTable('chores', (table) => {
    table.increments()
    table.string('chore').notNullable().defaultTo('')
    table.jsonb('daysDue').notNullable()
    table.jsonb('cycle').notNullable()
    table.boolean('done').notNullable().defaultTo(false)
    table.integer('house_id').references('id').inTable('houses').notNullable().defaultTo(0).onDelete('CASCADE').index()
    table.timestamps(true, true)
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('chores')
};
