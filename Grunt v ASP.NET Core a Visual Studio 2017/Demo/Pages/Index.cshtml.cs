using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Demo.Pages
{
    public class IndexModel : PageModel
    {
        // Názov prostredia v ktorom je spúšťaná aplikácia
        public string EnvironmentName
        {
            get;
            private set;
        }
        
        // Konštruktor
        public IndexModel(IHostingEnvironment env)
        {
            // Odložíme si názov prostredia v ktorom je spúšťaná aplikácia
            this.EnvironmentName = env.EnvironmentName;
        }

        // Metóda GET
        public void OnGetAsync()
        {
        }
    }
}