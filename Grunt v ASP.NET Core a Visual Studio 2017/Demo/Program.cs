using System.IO;

using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;

namespace Demo
{
    public class Program
    {
        public static void Main(string[] args)
        {
            // Vytvorit host
            var host = new WebHostBuilder();
            var env = host.GetSetting("environment");

            // Nacitanie konfiguracie
            var config = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env}.json", optional: true)
                .Build();

            // Nastavenie host
            host.UseKestrel()
                .UseConfiguration(config)
                // Pouzit url z konfiguracie
                .UseUrls(config["server:urls"])
                .UseContentRoot(Directory.GetCurrentDirectory())
                .UseStartup<Startup>()
                .Build()
                .Run();
        }
    }
}
