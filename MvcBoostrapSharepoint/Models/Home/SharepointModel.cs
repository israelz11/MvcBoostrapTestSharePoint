using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using Microsoft.SharePoint.Client;
using System.Security;

using ClientOM = Microsoft.SharePoint.Client;
using MvcBoostrapQTemplate.Models.Custom;
using System.Text.RegularExpressions;
/*Links:

    https://developer.microsoft.com/en-us/office/blogs/new-sharepoint-csom-version-released-for-office-365-may-2017/
    https://sharepoint.stackexchange.com/questions/246034/sharepoint-365-upload-file-to-subfolder-list-with-net-c-csom

    https://stackoverflow.com/questions/20329473/upload-file-to-sharepoint-2013-using-web-service-object-reference-not-set-to-a
    http://www.sharepointpals.com/post/How-to-Get-All-the-Files-within-a-Folder-using-CAML-Query-in-SharePoint-Office-365-using-C-CSOM
    https://docs.microsoft.com/en-us/previous-versions/office/developer/sharepoint-2010/ee956524(v=office.14)
    https://sharepoint.stackexchange.com/questions/173449/sharepoint-online-c-csom-download-file

*/

namespace MvcBoostrapQTemplate.Models.Home
{
    public class SharepointModel
    {
        #region Properties

        public ClientContext clientContext { get; set; }
        private string ServerSiteUrl = "https://somecompany.sharepoint.com/sites/ITVillahermosa";
        private string LibraryUrl = "Shared Documents/Invoices/";
        private string UserName = "someone.surname@somecompany.com";
        private string Password = "password";
        private Web WebClient { get; set; }

        #endregion

        #region Methods

        public SharepointModel()
        {
            this.Connect();
        }

        public SharepointModel(string serverSiteUrl, string libraryUrl)
        {
            this.Connect(serverSiteUrl, libraryUrl);
        }

        private void Connect()
        {
            try
            {
                using (clientContext = new ClientContext(ServerSiteUrl))
                {
                    var securePassword = new SecureString();
                    foreach (char c in Password)
                    {
                        securePassword.AppendChar(c);
                    }
 
                    clientContext.Credentials = new SharePointOnlineCredentials(UserName, securePassword);
                    WebClient = clientContext.Web;
                }
            }
            catch (Exception ex)
            {
                throw(ex);
            }
        }

        private void Connect(string serverSiteUrl, string libraryUrl)
        {
            try
            {
                this.ServerSiteUrl = serverSiteUrl;
                this.LibraryUrl = libraryUrl;
                using (clientContext = new ClientContext(this.ServerSiteUrl))
                {
                    var securePassword = new SecureString();
                    foreach (char c in Password)
                    {
                        securePassword.AppendChar(c);
                    }

                    clientContext.Credentials = new SharePointOnlineCredentials(UserName, securePassword);
                    WebClient = clientContext.Web;
                }
            }
            catch (Exception ex)
            {
                throw (ex);
            }
        }

        public string UploadMultiFiles(HttpRequestBase Request, HttpServerUtilityBase Server)
        {
            try
            {
                HttpPostedFileBase file = null;
                for (int f = 0; f < Request.Files.Count; f++)
                {
                    file = Request.Files[f] as HttpPostedFileBase;

                    string[] SubFolders = LibraryUrl.Split('/');
                    string filename = System.IO.Path.GetFileName(file.FileName);
                    var path = System.IO.Path.Combine(Server.MapPath("~/App_Data/uploads"), filename);
                    file.SaveAs(path);

                    clientContext.Load(WebClient, website => website.Lists, website => website.ServerRelativeUrl);
                    clientContext.ExecuteQuery();

                    //https://somecompany.sharepoint.com/sites/ITVillahermosa/Shared Documents/
                    List documentsList = clientContext.Web.Lists.GetByTitle("Documents"); //Shared Documents -> Documents
                    clientContext.Load(documentsList, i => i.RootFolder.Folders, i => i.RootFolder);
                    clientContext.ExecuteQuery();

                    string SubFolderName = SubFolders[1];//Get SubFolder 'Invoice'
                    var folderToBindTo = documentsList.RootFolder.Folders;
                    var folderToUpload = folderToBindTo.Where(i => i.Name == SubFolderName).First();

                    var fileCreationInformation = new FileCreationInformation();
                    //Assign to content byte[] i.e. documentStream
                    fileCreationInformation.Content = System.IO.File.ReadAllBytes(path);
                    //Allow owerwrite of document
                    fileCreationInformation.Overwrite = true;
                    //Upload URL
                    fileCreationInformation.Url = ServerSiteUrl + LibraryUrl + filename;

                    Microsoft.SharePoint.Client.File uploadFile = documentsList.RootFolder.Files.Add(fileCreationInformation);

                    //Update the metadata for a field having name "DocType"
                    uploadFile.ListItemAllFields["Title"] = "UploadedCSOM";

                    uploadFile.ListItemAllFields.Update();
                    clientContext.ExecuteQuery();
                }
                
                return "";
            }
            catch (Exception ex)
            {
                throw(ex);
            }
        }

        public List<CustomFiles> DownloadFiles()
        {
            try
            {
                string tempLocation = @"c:\Downloads\Sharepoint\";
                System.IO.DirectoryInfo di = new DirectoryInfo(tempLocation);
                foreach (FileInfo file in di.GetFiles())
                {
                    file.Delete();
                }

                FileCollection files = WebClient.GetFolderByServerRelativeUrl(this.LibraryUrl).Files;
                clientContext.Load(files);
                clientContext.ExecuteQuery();

                if (clientContext.HasPendingRequest)
                    clientContext.ExecuteQuery();

                foreach (ClientOM.File file in files)
                {
                    FileInformation fileInfo = ClientOM.File.OpenBinaryDirect(clientContext, file.ServerRelativeUrl);
                    clientContext.ExecuteQuery();

                    var filePath = tempLocation + file.Name;
                    using (var fileStream = new System.IO.FileStream(filePath, System.IO.FileMode.Create))
                    {
                        fileInfo.Stream.CopyTo(fileStream);
                    }
                }

                return this.GetLocalFiles();
            }
            catch (Exception ex)
            {
                throw(ex);
            }
        }

        public List<CustomFiles> GetLocalFiles()
        {
            try
            {
                string[] filePaths = Directory.GetFiles(@"c:\Downloads\Sharepoint\", "*.*", SearchOption.TopDirectoryOnly);
                List<CustomFiles> Files = new List<CustomFiles>();
                foreach(string file in filePaths)
                {
                    long length = new System.IO.FileInfo(file).Length;
                    string fileName = Path.GetFileName(file);
                    Files.Add(new CustomFiles { Name = file, ShortName = fileName, Length = UtilityModel.ConvertBytesToMegabytes(length) });
                }

                return Files;
            }
            catch (Exception ex)
            {
                throw(ex);
            }
        }

        public string DeleteFile(string FileName)
        {
            try
            {
                clientContext.Load(WebClient, website => website.Lists, website => website.ServerRelativeUrl);
                clientContext.ExecuteQuery();

                List documentsList = clientContext.Web.Lists.GetByTitle("Documents"); //Shared Documents -> Documents
                clientContext.Load(documentsList);
                //clientContext.ExecuteQuery();

                ClientOM.File file = WebClient.GetFileByServerRelativeUrl(WebClient.ServerRelativeUrl + "/" +  this.LibraryUrl + FileName);
                clientContext.Load(file);
                file.DeleteObject();
                clientContext.ExecuteQuery();
                if (!file.Exists)
                    throw new System.IO.FileNotFoundException();

                return "";
            }
            catch (Exception ex)
            {
                throw(ex);
            }
        }

        public string NewFolder(string folderName)
        {
            try
            {
                string[] SubFolders = LibraryUrl.Split('/');
                string SubFolderName = SubFolders[1];//Get SubFolder 'Invoice'

                List documentsList = clientContext.Web.Lists.GetByTitle("Documents"); //Shared Documents -> Documents
                clientContext.Load(documentsList, i => i.RootFolder.Folders, i => i.RootFolder);
                clientContext.ExecuteQuery();

                FolderCollection folderToBindTo = documentsList.RootFolder.Folders;
                Folder folderToUse = folderToBindTo.Where(i => i.Name == SubFolderName).First();
                Folder NewFolder = CreateFolderInternal(folderToUse, folderName);

                return "";
            }
            catch (Exception ex)
            {
                throw(ex);
            }
        }

        private Folder CreateFolderInternal(Folder parentFolder, string folderName)
        {
            Folder curFolder = parentFolder.Folders.Add(folderName);
            WebClient.Context.Load(curFolder);
            WebClient.Context.ExecuteQuery();

            return curFolder;
        }

        #endregion

    }
}