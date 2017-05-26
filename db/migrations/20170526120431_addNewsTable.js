
exports.up = function(knex, Promise) {
  return knex.schema.createTable('fake_news', (table) => {
    table.increments('id').primary();
    table.string('headline', '1000');
    table.string('byline', '10000');
    table.string('summary', '1000');
    table.string('content', '10000');
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('fake_news');
};
