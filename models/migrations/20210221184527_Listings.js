exports.up = function(knex) {
    return knex.schema.createTable("Listings", table=>{
        table.increments();
        table.string("listingTitle").notNullable();
        table.boolean("public").defaultTo(false);
        table.integer("projectId").notNullable().unsigned().references("id").inTable("Projects").onDelete("CASCADE").onUpdate("CASCADE");
        table.text("description").notNullable();
        table.timestamps(true, true);
        table.unique(["projectId", "listingTitle"]);
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists("Listings");
};
