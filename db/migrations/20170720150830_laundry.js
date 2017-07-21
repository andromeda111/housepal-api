exports.up = function(knex, Promise) {
  return knex.schema.createTable('laundry', (table) => {
    table.increments()
    table.boolean('washer_status').notNullable().defaultTo(false)
    table.jsonb('washer_start_time').notNullable()
    table.jsonb('washer_current_user').notNullable()
    table.jsonb('washer_notify').notNullable()
    table.boolean('dryer_status').notNullable().defaultTo(false)
    table.jsonb('dryer_start_time').notNullable()
    table.jsonb('dryer_current_user').notNullable()
    table.jsonb('dryer_notify').notNullable()
    table.integer('house_id').references('id').inTable('houses').notNullable().defaultTo(0).onDelete('CASCADE').index()
    table.timestamps(true, true)
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('laundry')
};
