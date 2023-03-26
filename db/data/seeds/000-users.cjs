/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const randomUUID = require('crypto').randomUUID();

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        { id: randomUUID, username: 'admin', password: '$2a$10$fNAZUq4Ll4JrH7aQYp0Bu.xkYiKYwtsXyYxBbGnjxbg1U6X7/Fp8K' }
      ]);
    });
};
