using Microsoft.EntityFrameworkCore;
using TodoApi;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Enable CORS to allow requests from any origin.

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Retrieve the connection string from configuration.
var connectionString = builder.Configuration.GetConnectionString("todoDB");

// Register the DbContext with a scoped lifetime.
builder.Services.AddDbContext<ToDoDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

var app = builder.Build();

// Use CORS policy.
app.UseCors("AllowAllOrigins");

// Configure the HTTP request pipeline.
app.UseAuthorization();

// Map endpoints for CRUD operations.
app.MapGet("/", async (ToDoDbContext db) =>
    await db.Items.ToListAsync());

app.MapGet("/{id}", async (int id, ToDoDbContext db) =>
    await db.Items.FindAsync(id)
        is Item item
            ? Results.Ok(item)
            : Results.NotFound());

app.MapPost("/", async (Item item, ToDoDbContext db) =>
{
    db.Items.Add(item);
    await db.SaveChangesAsync();
    return Results.Created($"/{item.Id}", item);
});

app.MapPut("/{id}", async (int id, Item inputItem, ToDoDbContext db) =>
{
    var item = await db.Items.FindAsync(id);
    if (item is null) return Results.NotFound();
    Console.WriteLine(inputItem);
    //item.Name = inputItem.Name;
    item.IsComplete = inputItem.IsComplete;
    
    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.MapDelete("/{id}", async (int id, ToDoDbContext db) =>
{
    var item = await db.Items.FindAsync(id);
    if (item is null) return Results.NotFound();

    db.Items.Remove(item);
    await db.SaveChangesAsync();
    return Results.NoContent();
});
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.Run();
