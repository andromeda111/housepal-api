exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', (table) => {
    table.increments()
    table.string('name').notNullable()
    table.string('email').notNullable()
    table.string('h_pw').notNullable()
    table.integer('house_id').references('id').inTable('houses').defaultTo(null)
    table.timestamps(true, true)
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users')
};