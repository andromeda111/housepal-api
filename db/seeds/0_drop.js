
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('laundry').del().then(() => {
    return knex('message_board').del().then(() => {
      return knex('shopping_list_items').del().then(() => {
        return knex('users').del().then(() => {
          return knex('houses').del()
        })
      })
    })
  })
}
