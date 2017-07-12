
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('shopping_list_items').del().then(() => {
    return knex('users').del().then(() => {
      return knex('houses').del()
    })
  })
}
