using System.Threading.Tasks;
using System.Web.Http;
using ParrotWings.Api.Models;
using ParrotWings.Api.Repositories;

namespace ParrotWings.Api.Controllers
{
  [Authorize]
  [RoutePrefix("api/Transactions")]
  public class TransactionsController : ApiController
  {

    private UsersRepository _repository = null;

    public TransactionsController()
    {
      _repository = new UsersRepository();
    }

    [HttpPost]
    [Route("transaction")]
    public async Task<IHttpActionResult> Transaction(Transaction transaction)
    {
      await _repository.AddTransactionAsync(User.Identity.Name, transaction.SourceId, transaction.Amount);

      return Ok();
    }

    [HttpPost]
    [Route("list")]
    public async Task<DataResult<Transaction>> GetAll(Filter filter)
    {
      int limit = filter.Limit.GetValueOrDefault(10);
      int page = filter.Page.GetValueOrDefault(1) >= 1 ? filter.Page.GetValueOrDefault(1) : 1;
      int offset = ((page - 1) * limit);

      return await _repository.GetTransactionsAsync(User.Identity.Name, offset, limit);
    }

  }
}