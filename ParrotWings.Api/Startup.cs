using AutoMapper;
using Microsoft.Owin;
using Microsoft.Owin.Security.OAuth;
using Owin;
using ParrotWings.Api.Models;
using System;
using System.Web.Http;

[assembly: OwinStartup(typeof(ParrotWings.Api.Startup))]
namespace ParrotWings.Api
{
  public class Startup
  {

    public void Configuration(IAppBuilder app)
    {
      ConfigureOAuth(app);

      var config = new HttpConfiguration();

      WebApiConfig.Register(config);

      app.UseCors(Microsoft.Owin.Cors.CorsOptions.AllowAll);
      app.UseWebApi(config);

      ConfigureMapper();
    }

    public void ConfigureOAuth(IAppBuilder app)
    {
      var OAuthServerOptions = new OAuthAuthorizationServerOptions()
      {
        AllowInsecureHttp = true,
        TokenEndpointPath = new PathString("/oauth2/token"),
        AccessTokenExpireTimeSpan = TimeSpan.FromDays(1),
        Provider = new AuthorizationServerProvider()
      };

      app.UseOAuthAuthorizationServer(OAuthServerOptions);
      app.UseOAuthBearerAuthentication(new OAuthBearerAuthenticationOptions());
    }

    public void ConfigureMapper()
    {
      Mapper.Initialize(cfg => {
        cfg.CreateMap<ApplicationUser, User>();
      });
    }

  }
}