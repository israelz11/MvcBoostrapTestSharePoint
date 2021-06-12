using MvcBoostrapQTemplate.Models.Home;
using System;
using System.Web.Mvc;

namespace MvcBoostrapQTemplate.Controllers
{
    public class SharepointController : MvcBoostraBaseController
    {
        #region Properties


        #endregion

        #region Methods

        [HttpPost]
        public ActionResult Upload(FormCollection form)
        {
            try
            {
                SharepointModel sharepointModel = new SharepointModel(form["txtUploadServerUrl"], form["txtUploadLibraryUrl"]);
                return Json(sharepointModel.UploadMultiFiles(Request, Server), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return ThrowJSONError(ex);
            }
        }

        public ActionResult Download(string ServerUrl, string RelativeUrl)
        {
            try
            {
                SharepointModel sharepointModel = new SharepointModel(ServerUrl, RelativeUrl);
                return Json(sharepointModel.DownloadFiles(), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return ThrowJSONError(ex);
            }
        }

        public  ActionResult Delete(string ServerUrl, string RelativeUrl, string FileName)
        {
            try
            {
                SharepointModel sharepointModel = new SharepointModel(ServerUrl, RelativeUrl);
                return Json(sharepointModel.DeleteFile(FileName), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return ThrowJSONError(ex);
            }
        }

        public ActionResult NewFolder(string ServerUrl, string RelativeUrl, string FolderName)
        {
            try
            {
                SharepointModel sharepointModel = new SharepointModel(ServerUrl, RelativeUrl);
                return Json(sharepointModel.NewFolder(FolderName), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return ThrowJSONError(ex);
            }
        }

        #endregion
    }
}