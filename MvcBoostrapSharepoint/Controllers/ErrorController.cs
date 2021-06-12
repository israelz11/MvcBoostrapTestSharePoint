using System.Net;
using System.Web.Mvc;

namespace MvcBoostrapQTemplate.Controllers
{
    public class ErrorController : MvcBoostraBaseController
    {
        #region ActionResult

        public ActionResult BadRequest()
        {
            Response.StatusCode = (int)HttpStatusCode.BadRequest;
            return View();
        }

        public ActionResult Unauthorized()
        {
            Response.StatusCode = (int)HttpStatusCode.Unauthorized;
            return View();
        }

        public ActionResult Forbidden()
        {
            Response.StatusCode = (int)HttpStatusCode.Forbidden;
            return View();
        }

        public ActionResult PageNotFound()
        {
            Response.StatusCode = (int)HttpStatusCode.NotFound;
            return View();
        }

        public ActionResult CustomError()
        {
            ViewBag.Error = MvcApplication.ErrorObject;
            Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            return View();
        }

        #endregion
    }
}