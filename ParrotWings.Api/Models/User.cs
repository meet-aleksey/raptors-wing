using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace ParrotWings.Api.Models
{
  public class User
  {

    [JsonProperty("id")]
    public int Id { get; set; }

    [Required]
    [StringLength(50)]
    [Display(Name = "User name")]
    [JsonProperty("userName")]
    public string UserName { get; set; }

    [Required]
    [Display(Name = "Email")]
    [EmailAddress(ErrorMessage = "Invalid Email Address.")]
    [JsonProperty("email")]
    public string Email { get; set; }

    [Required]
    [StringLength(50, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
    [DataType(DataType.Password)]
    [Display(Name = "Password")]
    [JsonProperty("password")]
    public string Password { get; set; }

    [DataType(DataType.Password)]
    [Display(Name = "Confirm password")]
    [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
    [JsonProperty("confirmPassword")]
    public string ConfirmPassword { get; set; }

    [JsonProperty("parrotWings")]
    public decimal ParrotWings { get; set; }

  }
}