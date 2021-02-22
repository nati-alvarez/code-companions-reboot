exports.up = function(knex) {
    return knex.schema.createTable("ListingSkills", table=>{
        table.increments();
        table.integer("listingId").notNullable().unsigned().references("id").inTable("Listings").onUpdate("CASCADE").onDelete("CASCADE");
        table.string("skillName").notNullable();
        table.unique(["listingId", "skillName"]);
    })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("ListingSkills");
};
