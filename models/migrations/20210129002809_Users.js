exports.up = function(knex) {
    return knex.schema.createTable("Users", table=>{
        table.increments();
        table.string("email").notNullable().unique();
        table.string("name")
        table.string("username").notNullable().unique();
        table.string("password").notNullable();
        table.timestamp("joinedOn").defaultTo(knex.fn.now());
        table.string("profilePicture"); //use react-icon as default
        table.string("title");
        table.text("about");
        table.string("githubAccessToken");
        table.integer("adminLevel").defaultTo(0);
    });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("Users");
};
