exports.up = function(knex) {
    return knex.schema.createTable("Projects", table=>{
        table.increments();
        table.integer("ownerId").references("id").inTable("Users").onUpdate("CASCADE").onDelete("CASCADE").notNullable();
        table.string("title").notNullable();
        table.text("description").notNullable();
        table.string("repoName") //optional but required for github integration
        table.unique(["ownerId", "title"]);
    });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("Projects");
};
