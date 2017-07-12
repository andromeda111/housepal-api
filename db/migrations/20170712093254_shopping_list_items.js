exports.up = function(knex, Promise) {
  return knex.schema.createTable('shopping_list_items', (table) => {
    table.increments()
    table.string('item').notNullable().defaultTo('')
    table.boolean('checked').notNullable().defaultTo(false)
    table.string('buyer').notNullable().defaultTo('')
    table.integer('house_id').references('id').inTable('houses').notNullable().defaultTo(0).onDelete('CASCADE').index()
    table.timestamps(true, true)
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('shopping_list_items')
};
