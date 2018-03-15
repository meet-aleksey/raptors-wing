using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.Owin.Security.OAuth;
using ParrotWings.Api.Repositories;

namespace ParrotWings.Api
{

  public class AuthorizationServerProvider : OAuthAuthorizationServerProvider
  {

    public override async Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
    {
      context.Validated();
    }

    public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
    {
      context.OwinContext.Response.Headers.Add("Access-Control-Allow-Origin", new[] { "*" });

      using (var repository = new UsersRepository())
      {
        var user = await repository.FindUserAsync(context.UserName, context.Password);

        if (user == null)
        {
          context.SetError("invalid_grant", "The user name or password is incorrect.");
          return;
        }
      }

      var identity = new ClaimsIdentity(context.Options.AuthenticationType);

      identity.AddClaim(new Claim(ClaimTypes.Name, context.UserName));
      identity.AddClaim(new Claim(ClaimTypes.Role, "user"));

      context.Validated(identity);

    }

  }

}