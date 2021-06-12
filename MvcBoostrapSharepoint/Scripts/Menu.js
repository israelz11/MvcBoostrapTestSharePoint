/*
Autor: Israel de la Cruz Hernandez
Fecha: 14/01/2016
Descripcion: Archivo de Funciones de los items de menus
*/

/*Funcion jQuery para centrar un elemento en la pantalla*/
jQuery.fn.center = function (parent)
{
    if (parent) {
        parent = this.parent();
    } else {
        parent = window;
    }

    var heightElement = this.height() / 2;
    var heightNew = ((($(parent).height() - this.outerHeight()) / 2) + $(parent).scrollTop());

    if (heightElement <= heightNew) {
        heightNew = heightNew - heightElement;
    }

    if (heightNew < 60)
        heightNew = ((($(parent).height() - this.outerHeight()) / 2) + $(parent).scrollTop())

    this.css({
        "position": "absolute",
        "top": (/*((($(parent).height() - this.outerHeight()) / 2) + $(parent).scrollTop() - heightElement)*/ heightNew + "px"),
        "left": ((($(parent).width() - this.outerWidth()) / 2) + $(parent).scrollLeft() + "px")
    });

    return this;
}

function BtnModalDialogDisabled(value) {
    $('#btnCerrarDialogo').prop('disabled', value);
    $('#btnAceptarDialogo').prop('disabled', value);
}

/*Funcion que permite desplegar un mensaje de Advertencia*/
function jAlert(texto, titulo, fnAceptar, fnCerrar) {
    _jClose();
    jDialog(texto,
				(titulo == null ? "Advertencia" : titulo)
				, "danger-alert"
				, fnAceptar
				, fnCerrar
				, "Aceptar"
				, "Cancelar"
	);
    setTimeout(function () { $('#btnAceptarDialogo').focus(); }, 700);
}

/*Funcion que permite desplegar un mensaje de confirmacion para una accion*/
function jConfirm(texto, titulo, fnAceptar, fnCerrar) {
    _jClose();
    jDialog(
				texto
				, (titulo == null ? "Confirmar" : titulo)
				, "hmodal-warning"
				, fnAceptar
				, fnCerrar
				, "Aceptar"
				, "Cancelar"
	);
    $('.modal-dialog').center(true);
    setTimeout(function () { $('#btnCerrarDialogo').focus(); }, 700);
}

/*Funcion que permite desplegar un mensaje de advertencia*/
function jWarning(mensaje, seg, fn) {
    try {
        if (isNaN(seg)) fn = seg;
        if (typeof (seg) == 'undefined' || seg == 0 || isNaN(seg))
            seg = 3000;

        _jClose();

        toastr.warning(mensaje);

        if (typeof (fn) != 'undefined')
            setTimeout(fn, seg);
    }
    catch (err) {
        err = null;
    }
}

/*Funcion que cerrar los dialogos abiertos en pantalla mostrando un mensaje flotante que de desvanece*/
function jClose(mensaje, seg, fn) {
    try {
        if (isNaN(seg)) fn = seg;
        if (typeof (seg) == 'undefined' || seg == 0 || isNaN(seg))
            seg = 3000;

        _jClose();

        toastr.success(mensaje);

        if (typeof (fn) != 'undefined')
            setTimeout(fn, seg);
    }
    catch (err) {
        err = null;
    }
}

/*Funcion que permite desplegar un mensaje de advertencia*/
function jAlert(Mensaje, titulo) {
    BtnModalDialogDisabled(true);
    sweetAlert({
        title: titulo,
        text: Mensaje,
        type: "warning"
    },
				function () {
				    BtnModalDialogDisabled(false);
				}
	);
    _jClose();
}

/*Funcion que permite desplegar un mensaje de error*/
function jError(Mensaje, titulo) {
    BtnModalDialogDisabled(true);
    sweetAlert({
        title: titulo,
        text: Mensaje,
        type: "error"
    },
				function () {
				    BtnModalDialogDisabled(false);
				}
	);
    _jClose();
}

/*Funcion que permite desplegar un mensaje personalizado y ejecutar acciones segun los botones configurados*/
function jDialog(texto, titulo, modalType, fnAceptar, fnCerrar, OptionalButtonNameAccept, OptionalButtonNameClose, Html) {
    $('#myModal').remove();
    var iconModal = "";

    if (typeof (Html) == undefined || Html == null)
        Html = "";
    if (typeof (modalType) == undefined || modalType == null || modalType == "")
        modalType = "in";
    if (modalType == "danger")
        modalType = "hmodal-danger";
    if (modalType == "danger-alert") {
        modalType = "hmodal-danger";
        iconModal = "warning_48.png";
    }
    if (modalType == "danger-error") {
        modalType = "hmodal-danger";
        iconModal = "delete_48.png";
    }
    if (modalType == "success")
        modalType = "hmodal-success";
    if (modalType == "info")
        modalType = "hmodal-info";
    if (modalType == "warning")
        modalType = "hmodal-warning";

    $("BODY").append('<div class="modal fade ' + modalType + ' in" id="myModal" tabindex="-1" role="dialog"  aria-hidden="false" style="display: block; padding-right: 17px;">' +
					 '<div class="modal-backdrop fade in" style="height: auto;"></div>' +
                     '<div class="modal-dialog" style="margin-top: 0px; margin-left: -10px;">' +
                     '   <div id="myContent" class="modal-content">' +
                     '      <div class="color-line"></div>' +
                     '       <div class="modal-header" style="padding:10px">' +
                     '           <h4 class="modal-title">' + titulo + '</h4>' +
                     '       </div>' +
                     '       <div class="modal-body">' +
					 (Html == '' ? '		 <table style="width: 100%;"><tr>' + (iconModal != "" ? '<td style="width:60px;"><img src="../Content/images/' + iconModal + '" style="width:48px; height:48px" align="absmiddle"></td>' : '') + '<td><span style="font-size:15px;">' + texto + '</span></td></tr></table>' : texto) +
                     '       </div>' +
                     '       <div class="modal-footer">' +
                     '       <div id="div_foot_opc" style="position:relative;"></div>' +
                     '           <button id="btnCerrarDialogo" type="button" class="btn btn-default" data-dismiss="modal">' + (typeof (OptionalButtonNameClose) != undefined && OptionalButtonNameClose != null ? OptionalButtonNameClose : 'Cancelar') + '</button>' +
                     '           <button id="btnAceptarDialogo" type="button" class="btn btn-primary">' + (typeof (OptionalButtonNameAccept) != undefined && OptionalButtonNameAccept != null ? OptionalButtonNameAccept : 'Aceptar') + '</button>' +
                     '       </div>' +
                     '   </div>' +
                     '</div>' +
                	 '</div>'
	);

    if (typeof (fnCerrar) == undefined || fnCerrar == null) {
        $('#btnCerrarDialogo').click(function (event) {
            $("BODY").css({ "padding-right": "" });
            $("BODY").removeClass("modal-open");
        });
    }

    /*Manejador para el boton cerrar*/
    if (typeof (fnCerrar) != undefined && fnCerrar != null)
        $('#btnCerrarDialogo').click(function (event) { fnCerrar(); });
    else
        $('#btnCerrarDialogo').click(function (event) { _jClose(); });

    /*Manejador para el boton aceptar*/
    if (typeof (fnAceptar) != undefined && fnAceptar != null)
        $('#btnAceptarDialogo').click(function (event) { fnAceptar(); });
    else
        $('#btnAceptarDialogo').click(function (event) { _jClose(); });

    setTimeout(function () { $('#btnCerrarDialogo').focus(); }, 700);
}

/*Funcion que permite cierra un mensaje*/
function _jClose() {
    $('[id=myModal]').remove();
    $("BODY").css({ "padding-right": "" });
    $("BODY").removeClass("modal-open");
}

/*Funcion que muestra un mensaje de espera en pantalla mientras se realiza un proceso*/
function jDelay(titulo) {
    _jClose();
    $("BODY").append('<div class="modal in" id="myModal" tabindex="-1" role="dialog"  aria-hidden="true">' +
                     '<div class="modal-dialog modal-sm" style="width: 370px;">' +
                     '   <div class="modal-content">' +
                     '      <div class="color-line"></div>' +
                     '       <div class="modal-header" style="padding:10px">' +
                     '           <h4 class="modal-title">Procesando</h4>' +
                     '       </div>' +
                     '       <div class="modal-body" id="modalBody" style="background-color: white;"><img src="../Content/images/loading.gif" align="absmiddle" />&nbsp;&nbsp;<div style="position:absolute; left:110px; top:40px"><h5>' + titulo + '</h5></div></div>' +
                     '   </div>' +
                     '</div>' +
                	 '</div>'
	);

    if (typeof (titulo) == 'undefined' || titulo == '') titulo = 'Procesando';
    /*Configuramos a modo estatico para no cerrar con un click fuera de ventana*/
    /*$('#myModal').modal({
        backdrop: 'static',
        keyboard: false
    });*/
    //$('#modalBody').html('<img src="../Content/images/loading.gif" align="absmiddle" />&nbsp;&nbsp;<div style="position:absolute; left:110px; top:40px"><h5>Espere un momento por favor...</h5></div>');
    $('#modalTitle').html(titulo);
    $('#myModal').show();
    //centramos aqui en pantalla
    $('.modal-dialog').center(true);
}

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
}

function validateEmail(emailAddress) {
    var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    return pattern.test(emailAddress);
}
