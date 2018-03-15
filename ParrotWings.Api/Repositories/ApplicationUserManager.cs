using Microsoft.AspNet.Identity;
using ParrotWings.Api.Models;

namespace ParrotWings.Api.Repositories
{
  public class ApplicationUserManager : UserManager<ApplicationUser, int>
  {

    public ApplicationUserManager(IUserStore<ApplicationUser, int> store) : base(store)
    {
      UserValidator = new UserValidator<ApplicationUser, int>(this)
      {
        AllowOnlyAlphanumericUserNames = false,
        RequireUniqueEmail = true
      };
    }

  }
}