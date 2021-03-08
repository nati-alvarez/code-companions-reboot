exports.up = function(knex) {
    return knex.schema.createTable("UserLinks", table=>{
        table.increments();
        table.integer("userId").notNullable().unsigned().references("id").inTable("Users").onUpdate("CASCADE").onDelete("CASCADE");
        table.string("url").notNullable();
        table.unique(["userId", "url"]);
    });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("UserLinks");
};