exports.up = function(knex) {
    return knex.schema.createTable("UserSkills", table=>{
        table.increments();
        table.integer("userId").notNullable().unsigned().references("id").inTable("Users").onUpdate("CASCADE").onDelete("CASCADE");
        table.string("skillName").notNullable();
        table.unique(["userId", "skillName"]);
    });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("UserSKills");
};
