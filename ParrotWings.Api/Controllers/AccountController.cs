using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http;
using Microsoft.AspNet.Identity;
using ParrotWings.Api.Models;
using ParrotWings.Api.Repositories;

namespace ParrotWings.Api.Controllers
{
  [Authorize]
  [RoutePrefix("api/Account")]
  public class AccountController : ApiController
  {

    private UsersRepository _repository = null;

    public AccountController()
    {
      _repository = new UsersRepository();
    }

    [AllowAnonymous]
    [Route("registration")]
    public async Task<IHttpActionResult> Registration(User user)
    {
      if (!ModelState.IsValid)
      {
        return BadRequest(ModelState);
      }

      IdentityResult result = await _repository.RegisterUserAsync(user);

      IHttpActionResult errorResult = GetErrorResult(result);

      if (errorResult != null)
      {
        return errorResult;
      }

      return Ok();
    }

    [Route("me")]
    public async Task<User> Me()
    {
      var user = await _repository.GetUserByEmailAsync(User.Identity.Name);

      return new User
      {
        Email = user.Email,
        UserName = user.UserName,
        ParrotWings = user.ParrotWings
      };
    }

    [Route("search")]
    public async Task<List<SearchUserResult>> Search(SearchUserRequest request)
    {
      var users = await _repository.FindUsersAsync(request.Query);
      var result = new List<SearchUserResult>();

      foreach (var user in users)
      {
        if (user.Email.Equals(User.Identity.Name))
        {
          continue;
        }

        result.Add
        (
          new SearchUserResult
          {
            Id = user.Id,
            Name = $"{user.UserName} <{user.Email}>"
          }
        );
      }

      return result;
    }

    protected override void Dispose(bool disposing)
    {
      if (disposing)
      {
        _repository.Dispose();
      }

      base.Dispose(disposing);
    }

    private IHttpActionResult GetErrorResult(IdentityResult result)
    {
      if (result == null)
      {
        return InternalServerError();
      }

      if (!result.Succeeded)
      {
        if (result.Errors != null)
        {
          foreach (string error in result.Errors)
          {
            ModelState.AddModelError("", error);
          }
        }

        if (ModelState.IsValid)
        {
          return BadRequest();
        }

        return BadRequest(ModelState);
      }

      return null;
    }

  }
}