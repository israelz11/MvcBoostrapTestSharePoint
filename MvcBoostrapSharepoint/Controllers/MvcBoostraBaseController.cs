using System;
using System.Web.Mvc;

namespace MvcBoostrapQTemplate.Controllers
{
    public class MvcBoostraBaseController : Controller
    {
        #region Properties

        public static Exception Error { get; set; }
        public static int StatusCode { get; set; }

        #endregion

        #region Enumerators


        #endregion

        #region Methods

        protected override void OnException(ExceptionContext filterContext)
        {
            base.OnException(filterContext);
        }

        public ActionResult ThrowJSONError(Exception e)
        {
            Response.StatusCode = (int)System.Net.HttpStatusCode.BadRequest;
            Response.StatusCode = 0;
            return Json(new { Message = e.Message }, JsonRequestBehavior.AllowGet);
        }

        #endregion
    }
}