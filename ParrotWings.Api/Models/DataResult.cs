using Newtonsoft.Json;
using System.Collections.Generic;

namespace ParrotWings.Api.Models
{
  public class DataResult<T>
  {

    [JsonProperty("totalRecords")]
    public int TotalRecords { get; set; }

    [JsonProperty("data")]
    public List<T> Data { get; set; }

    [JsonProperty("users")]
    public List<User> Users { get; set; }

  }
}