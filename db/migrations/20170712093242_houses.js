exports.up = function(knex, Promise) {
  return knex.schema.createTable('houses', (table) => {
    table.increments()
    table.string('title').notNullable().unique()
    table.string('code').notNullable()
    table.timestamps(true, true)
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('houses')
};
