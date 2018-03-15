using Newtonsoft.Json;

namespace ParrotWings.Api.Models
{
  public class SearchUserResult
  {

    [JsonProperty("id")]
    public int Id { get; set; }

    [JsonProperty("name")]
    public string Name { get; set; }

  }
}