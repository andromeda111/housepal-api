exports.up = function(knex, Promise) {
  return knex.schema.createTable('shopping-list-items', (table) => {
    table.increments()
    table.string('item').notNullable().defaultTo('')
    table.boolean('checked').notNullable().defaultTo(false)
    table.string('buyer').notNullable().defaultTo('')
    table.timestamps(true, true)
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('shopping-list-items')
};
