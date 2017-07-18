exports.up = function(knex, Promise) {
  return knex.schema.createTable('message_board', (table) => {
    table.increments()
    table.integer('posterId').notNullable()
    table.string('posterName').notNullable()
    table.text('content').notNullable()
    table.jsonb('postTime').notNullable()
    table.integer('house_id').references('id').inTable('houses').notNullable().defaultTo(0).onDelete('CASCADE').index()
    table.timestamps(true, true)
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('message_board')
};
