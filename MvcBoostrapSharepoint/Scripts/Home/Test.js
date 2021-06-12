var TEST = TEST || {
    CORE: {
        EventHandler: function () {
            EventHandlersControl();
            $('#cmdUpload').on('click', function () {
                TEST.SHAREPOINT.FILES.Upload();
            });
            $('#cmdShowFiles').on('click', function () {
                TEST.SHAREPOINT.FILES.GetFiles();
            });
            $('#cmdNewFolder').on('click', function () { TEST.SHAREPOINT.FOLDER.New(); });
        },
        ShowRequest: function (formData, jqForm, options) {
            return true;
        },
        ShowResponse: function (data) {
            if (typeof (data.Message) != "undefined") {
                jError(data.Message, 'Error');
            }
            else {
                _jClose();
                swal("Carga de Archivos", "Los archivos se cargaron con éxito al servidor Sharepoint", "success");
                TEST.SHAREPOINT.FILES.FormReset();
            }
        },
    },
    SHAREPOINT: {
        FILES: {
            Upload: function () {
                $('#frm').unbind();
                jDelay('Espere un momento por favor...');
                var options = {
                    beforeSubmit: TEST.CORE.ShowRequest,
                    success:  TEST.CORE.ShowResponse,
                    url: '/Sharepoint/Upload',
                    type: 'post',
                    dataType: 'json'
                };

                $('#frm').submit(function () {
                    $(this).ajaxSubmit(options);
                    return false;
                });
                $('#frm').submit();
            },
            GetFiles: function () {
                jDelay('Espere un momento por favor...');
                $.ajax({
                    type: 'GET',
                    url: '/Sharepoint/Download',
                    async: true,
                    dataType: "json",
                    data: {
                        "ServerUrl": $('#txtServerUrl').val(),
                        "RelativeUrl": $('#txtRelativeUrl').val()
                    },
                    contentType: "application/json; charset=utf-8",
                    success: function (data) {
                        if (typeof (data.Message) != "undefined") {
                            jError(data.Message, 'Error');
                        }
                        else {
                            var html = '<table class="table table-striped table-bordered table-hover dataTable no-footer" style="width:100%">';
                            html += '<thead>';
                            html += '   <tr>';
                            html += '       <th>File Name</th>';
                            html += '       <th style="text-align: center;">Lenght</th>';
                            html += '       <th style="text-align: center;">Opc.</th>';
                            html += '   </tr>';
                            html += '</thead>';
                            html += '<tbody>';
                            var cont = 0;
                            $(jQuery.parseJSON(JSON.stringify(data))).each(function () {
                                cont++;
                                html += '<tr>';
                                html += '   <td>' + this.Name + '</td>';
                                html += '   <td style="text-align: center;"> ' + this.Length.toFixed(2) + ' MB</td>';
                                html += '   <td style="text-align: center;"><a href="javascript:TEST.SHAREPOINT.FILES.Delete(\'' + this.ShortName + '\')"><i class="fa fa-remove"></i> </a></td>';
                                html += '</tr>';
                                $('#LabelFileCount').html('Archivos encontrados (' + cont + ')');
                            });
                            html += '</tbody>';
                            html += '</table>';
                            $('#DivTable').html(html);
                            _jClose();
                        }
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        jError((JSON.parse(xhr.responseText)).Message, 'Error');
                    }
                });
            },
            Delete: function (FileName) {
                swal({
                    title: "¿Confirmar?",
                    text: '¿Confirma que desea eliminar el archivo en SharePoint?',
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonClass: "btn-success",
                    cancelButtonText: "No!",
                    confirmButtonText: "Si!",
                    closeOnConfirm: true
                },
                function (isConfirm) {
                    if (isConfirm) {
                        jDelay('Espere un momento por favor...');
                        $.ajax({
                            type: 'GET',
                            url: '/Sharepoint/Delete',
                            async: true,
                            dataType: "json",
                            data: {
                                "ServerUrl": $('#txtServerUrl').val(),
                                "RelativeUrl": $('#txtRelativeUrl').val(),
                                "FileName": FileName
                            },
                            contentType: "application/json; charset=utf-8",
                            success: function (data) {
                                if (typeof (data.Message) != "undefined") {
                                    jError(data.Message, 'Error');
                                }
                                else {
                                    _jClose();
                                    swal("Archivo Eliminado", "El Archivo seleccionado fue eliminado con éxito del servidor Sharepoint", "success");
                                    TEST.SHAREPOINT.FILES.GetFiles();
                                }
                            },
                            error: function (xhr, ajaxOptions, thrownError) {
                                jError((JSON.parse(xhr.responseText)).Message, 'Error');
                            }
                        });
                    }
                });

                
            },
            FormReset: function () {
                $('#frm')[0].reset();
            }
        },
        FOLDER: {
            New: function () {
                swal({
                    title: "Nuevo Folder",
                    text: "Escriba el nombre del nuevo folder en SharePoint",
                    type: "input",
                    showCancelButton: true,
                    closeOnConfirm: true,
                    inputPlaceholder: "Write Folder Name"
                }, function (inputValue) {
                    if (inputValue === false) return false;
                    if (inputValue === "") {
                        swal.showInputError("Es necesario escribr el nombre del folder!");
                        return false
                    }
                    
                    jDelay('Espere un momento por favor...');
                    $.ajax({
                        type: 'GET',
                        url: '/Sharepoint/NewFolder',
                        async: true,
                        dataType: "json",
                        data: {
                            "ServerUrl": $('#txtServerUrl').val(),
                            "RelativeUrl": $('#txtRelativeUrl').val(),
                            "FolderName": inputValue
                        },
                        contentType: "application/json; charset=utf-8",
                        success: function (data) {
                            if (typeof (data.Message) != "undefined") {
                                jError(data.Message, 'Error');
                            }
                            else {
                                _jClose();
                                swal("Folder creado", "El folder fue creado con éxito en el servidor SharePoint", "success");
                            }
                        },
                        error: function (xhr, ajaxOptions, thrownError) {
                            jError((JSON.parse(xhr.responseText)).Message, 'Error');
                        }
                    });

                });
            }
        }
    }

}

$(document).ready(function () {
    TEST.CORE.EventHandler();   
});
