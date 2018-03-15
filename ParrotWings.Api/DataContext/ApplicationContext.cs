using Microsoft.AspNet.Identity.EntityFramework;
using ParrotWings.Api.Models;
using System.Data.Entity;

namespace ParrotWings.Api.DataContext
{
  public class ApplicationContext : IdentityDbContext<ApplicationUser, ApplicationRole, int, ApplicationUserLogin, ApplicationUserRole, ApplicationUserClaim>
  {

    public DbSet<Transaction> Transactions { get; set; }

    public ApplicationContext() : base("DefaultConnection")
    {
    }

  }
}