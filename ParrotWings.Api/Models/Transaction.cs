using System;
using Newtonsoft.Json;

namespace ParrotWings.Api.Models
{
  public class Transaction
  {

    [JsonProperty("id")]
    public int Id { get; set; }

    /// <summary>
    /// Owner Id.
    /// </summary>
    [JsonProperty("userId")]
    public int UserId { get; set; }

    /// <summary>
    /// Source or target user id.
    /// </summary>
    [JsonProperty("sourceId")]
    public int SourceId { get; set; }

    [JsonProperty("amount")]
    public decimal Amount { get; set; }

    [JsonProperty("transactionDate")]
    public DateTimeOffset TransactionDate { get; set; }

  }
}