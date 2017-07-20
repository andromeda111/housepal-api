exports.up = function(knex, Promise) {
  return knex.schema.createTable('laundry', (table) => {
    table.increments()
    table.boolean('washer_status').notNullable().defaultTo(false)
    table.jsonb('washer_start_time').notNullable().defaultTo({time: null})
    table.integer('washer_current_user').defaultTo(null)
    table.jsonb('washer_notify').notNullable().defaultTo({users: null})
    table.boolean('dryer_status').notNullable().defaultTo(false)
    table.jsonb('dryer_start_time').notNullable().defaultTo({time: null})
    table.integer('dryer_current_user').defaultTo(null)
    table.jsonb('dryer_notify').notNullable().defaultTo({users: null})
    table.integer('house_id').references('id').inTable('houses').notNullable().defaultTo(0).onDelete('CASCADE').index()
    table.timestamps(true, true)
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('laundry')
};
