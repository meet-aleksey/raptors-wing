using Microsoft.AspNet.Identity.EntityFramework;

namespace ParrotWings.Api.Models
{
  public class ApplicationUser : IdentityUser<int, ApplicationUserLogin, ApplicationUserRole, ApplicationUserClaim>
  {

    public decimal ParrotWings { get; set; }

  }
}