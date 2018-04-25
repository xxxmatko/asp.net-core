using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Demo
{
    public class Startup
    {
        // Konfigurácia aplikácie.
        public IConfiguration Configuration
        {
            get;
            private set;
        }

        // Konštruktor
        public Startup(IConfiguration config)
        {
            // Konfigurácia už bola načítaná zo súboru appsettings.json pri vytvorení 
            // hostu v súbore Program.cs a použije sa DI pre jej odloženie do property
            // Configruation
            this.Configuration = config;
        }
                        
        // Metóda je volaná runtime-om a použije sa na pridanie service-ov do kontajnera
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddOptions();
            // Použijeme MVC
            services.AddMvc();
        }

        // Metóda je volaná runtime-om a použije sa na konfiguráciu HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
            }

            app.UseStaticFiles();
            app.UseMvc(ConfigureMvc);
        }

        // Konfigurácia MVC
        public void ConfigureMvc(IRouteBuilder routes)
        {
            routes.MapRoute(
                name: "default",
                template: "{controller=Home}/{action=Index}/{id?}");
        }
    }
}
