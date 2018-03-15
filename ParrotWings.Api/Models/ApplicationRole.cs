using Microsoft.AspNet.Identity.EntityFramework;

namespace ParrotWings.Api.Models
{
  public class ApplicationRole : IdentityRole<int, ApplicationUserRole>
  {

    public ApplicationRole() { }

    public ApplicationRole(string name) { Name = name; }

  }
}