
exports.up = function(knex) {
  return knex.schema.createTable('users', table => {
      table.uuid('id').unique().notNullable();
      table.text('username', 128).unique().notNullable();
      table.text('password', 128).notNullable();
  })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('users')
};
