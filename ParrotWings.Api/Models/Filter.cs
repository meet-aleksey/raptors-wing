using Newtonsoft.Json;

namespace ParrotWings.Api.Models
{
  public class Filter
  {

    [JsonProperty("page")]
    public int? Page { get; set; }

    [JsonProperty("limit")]
    public int? Limit { get; set; }

  }
}