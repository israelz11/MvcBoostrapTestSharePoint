using System;
using System.Web;
using System.Web.Mvc;
using MvcBoostrapQTemplate.Models.View.Home;

namespace MvcBoostrapQTemplate.Controllers
{
    public class HomeController : MvcBoostraBaseController
    {
        #region Properties

        #endregion

        #region ActionResult 

        public ActionResult Index()
        {
            return RedirectToAction("Test", "Home");
        }

        public ActionResult Test()
        {
            try
            {
                TestView testView = new TestView();
                return View(testView);
            }
            catch (Exception ex)
            {
                throw(ex);
            }
            
        }

        #endregion

    }
}