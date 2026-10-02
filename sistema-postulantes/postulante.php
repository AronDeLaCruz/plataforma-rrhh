<?php
    require_once("inc/combos.inc.php");
    $version = rand(0,1500);

    $comboCargo = cargos($pdo);
    $comboRegimen = regimen($pdo);
    $departamentos = ubigeo($pdo,1,"");
    $nacionalidad = paises($pdo);
    $bancos = general($pdo,"05");
    $documentos = general($pdo,"06");
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title></title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="css/style.css?v<?php echo $version?>">
        <link rel="stylesheet" href="css/all.css">
    </head>
    <body>
        <div class="modal_mensaje">
            <span></span>
        </div>
        <div class="modal" id="modalEsperar">
            <div class="loadingio-spinner-spinner-5ulcsi06hlf">
                <div class="ldio-fifgg00y5y">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        </div>
        <div class="modal" id="continueRegister">
            <div class="msj">
                <a href="" id="closeMess" class="closerWindows">x</a>
                <h3>Registro</h3>
                <p>Ud. ya esta registrado, para continuar con el proceso</p>
                <p>Verifique su correo electrónico e ingrese el número de</p>
                <p>de confirmación</p>

                <input type="text" name="numberComfirm" id="numberComfirm">
                <p class="message">Ingrese el número de confirmación</p>
                <hr>
                <button id="btnCheckRegister">Ingresar</button>
            </div>
        </div>
        <div class="modal" id="confirm">
            <div class="msj">
                <h3>Confirma el registro del documento?</h3>
                <hr>
                <div class="modalOptions">
                    <button id="btnAccept">Confirmar</button>
                    <button id="btnCancel">Cancelar</button>
                </div>
            </div>
        </div>
        <div class="modal" id="ficha">
            <div class="formatoFicha">
                <form action="" id="formFicha">
                    <input type="hidden" name="ubigdir" id="ubigdir">
                    <input type="hidden" name="ubignac" id="ubignac">
                    <input type="hidden" name="coddocumento" id="coddocumento">
                    <input type="hidden" name="codbanco" id="codbanco">
                    <input type="hidden" name="codpais" id="codpais">
                    <input type="hidden" name="postulante" id="postulante">
                    <input type="hidden" name="ruta_foto" id="ruta_foto">
                    <input type="hidden" name="latitud" id="latitud">
                    <input type="hidden" name="longitud" id="longitud">
                    <input type="hidden" name="ruta_croquis" id="ruta_croquis">

                    <div class="cabecera">
                        <div class="logo">
                            <img src="img/logo.jpg">
                        </div>
                        <div class="titulo">
                            <h3>FICHA DE DATOS PERSONALES DEL TRABAJADOR</h3>
                        </div>
                        <div class="descrip">
                            <p>PSPC-610-X-PR-001-FR-005</p>
                            <p>Revisión: 3</p>
                            <p>Emisión: 05/10/2022</p>
                        </div>
                    </div>
                    <div class="instrucciones">
                        <h4 style="margin-bottom: 7px;">Instrucciones</h4>
                        <p>1.- La siguiente Ficha tiene carácter de Declaración Jurada.</p>
                        <p>2.- Esta ficha formará parte de su LEGAJO DE PERSONAL permanente, por tanto llénelo cuidadosamente y con los datos correctos.</p>
                        <p>3.- Todos los datos deben ser registrados, si no le corresponde alguna de ellas debe señalarla expresamente con letra imprenta.</p>
                    </div>
                    <div class="seccion">
                        <h4 class="bordes_lados">I. DATOS PERSONALES</h4>
                        <div class="dgrid g31 w100por">
                            <div class="datos">
                                <div class="dataEntry con_borde">
                                    <div class="w50por">
                                        <label for="apat">Apellido Paterno</label>
                                        <input type="text" name="apat" id="apat" class="w100por texto_mayusculas closeoption">
                                    </div>
                                    <div class="w50por">
                                        <label for="amat">Apellido Materno</label>
                                        <input type="text" name="amat" id="amat" class="w100por texto_mayusculas closeoption">
                                    </div>
                                </div>
                                <div class="dataEntry con_borde">
                                    <div class="w85por">
                                        <label for="nombreficha">Nombres</label>
                                        <input type="text" name="nombreficha" id="nombreficha" class="w100por texto_mayusculas">
                                    </div>
                                    <div class="w15por">
                                        <label for="edad">Edad</label>
                                        <input type="number" name="edad" id="edad" class="w100por closeoption">
                                    </div>
                                </div>
                                <div class="dataEntry con_borde">
                                    <div class="w35por pos_relative">
                                        <span class="flecha_abajo"><i class="fas fa-sort-down"></i></span>
                                        <label for="tipodoc">Tipo Documento</label>
                                        <input type="text" name="tipodoc" id="tipodoc" class="w100por" readonly>
                                        <div class="optionselect ">
                                        <ul class="ubigeo" data-option="0">
                                            <?php echo $documentos ?>
                                        </ul>
                                    </div>
                                    </div>
                                    <div class="w40por">
                                        <label for="dnice">DNI / C.E.</label>
                                        <input type="text" name="dnice" id="dnice" class="w100por closeoption">
                                    </div>
                                    <div class="w20por">
                                        <label for="fnac">Fecha Nacimiento</label>
                                        <input type="date" name="fnac" id="fnac" class="closeoption">
                                    </div>
                                </div>
                                <div class="dataEntry con_borde">
                                    <div class="w100por">
                                        <label for="direccion">Dirección</label>
                                        <input type="text" name="direccion" id="direccion" class="w100por texto_mayusculas closeoption">
                                    </div>
                                </div>
                                <div class="dataEntry con_borde">
                                    <div class="w35por pos_relative">
                                        <span class="flecha_abajo"><i class="fas fa-sort-down"></i></span>
                                        <label for="dptoficha">Departamento</label>
                                        <input type="text" name="dptoficha" id="dptoficha" class="w100por" 
                                            placeholder="Seleccione una opcion">
                                        <div class="optionselect">
                                            <ul class="ubigeo ubigeoSearch" data-option="1">
                                                <?php echo $departamentos ?>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="w35por pos_relative">
                                        <label for="provficha">Provincia</label>
                                        <span class="flecha_abajo"><i class="fas fa-sort-down"></i></span>
                                        <input type="text" name="provficha" id="provficha" class="w100por" placeholder="Seleccione una opcion">
                                        <div class="optionselect ">
                                            <ul class="ubigeo ubigeoSearch" data-option="1">
                                                
                                            </ul>
                                        </div>
                                    </div>
                                    
                                    <div class="w30por pos_relative">
                                        <label for="distficha">Distrito</label>
                                        <span class="flecha_abajo"><i class="fas fa-sort-down"></i></span>
                                        <input type="text" name="distficha" id="distficha" class="w100por" placeholder="Seleccione una opcion">
                                        <div class="optionselect ">
                                            <ul class="ubigeo ubigeoSearch" data-option="1">
                                                
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div class="dataEntry con_borde">
                                    <div class="w35por">
                                        <label for="dpto">N°. Celular</label>
                                        <input type="text" name="celular" id="celular" class="w100por" maxlength="9">
                                    </div>
                                    <div class="w35por">
                                        <label for="teleficha">Télefono Fijo</label>
                                        <input type="text" name="teleficha" id="teleficha" class="w100por">
                                    </div>
                                    <div class="w30por">
                                        <label for="correoficha">Email:</label>
                                        <input type="email" name="correoficha" id="correoficha" class="w100por">
                                    </div>
                                </div>
                            </div>
                            <div class="foto con_borde">
                                <img src="" id="imgFoto" name="imgFoto">
                                <input type="file" id="photo" name="photo" class="oculto" accept=".jpeg,.jpg">
                                <div>
                                    <h1><a href="" id="uploadFoto" >Adjuntar foto</a></h1>
                                    <h5>dimensiones:500x500</h5>
                                    <h5>tamaño max.:500kb</h5>
                                </div>
                            </div>
                          
                        </div>
                    </div>
                    <div class="seccion dgrid g21 w100por">
                        
                        <div class="datos">
                            <div class="dataEntry con_borde">
                                <div class="w100por">
                                    <label>LUGAR DE NACIMIENTO</label>
                                </div>
                            
                            </div>
                            <div class="dataEntry con_borde">
                                <div class="w50por pos_relative">
                                    <label for="nacionalidad">Nacionalidad</label>
                                    <span class="flecha_abajo"><i class="fas fa-sort-down"></i></span>
                                    <input type="text" name="nacionalidad" id="nacionalidad" class="w100por texto_mayusculas" readonly>
                                    <div class="optionselect ">
                                        <ul class="ubigeo ubigeoSearch" data-option="3">
                                            <?php echo $nacionalidad ?>
                                        </ul>
                                    </div>
                                </div>
                                <div class="w50por ml5px mr5px pos_relative">
                                    <span class="flecha_abajo"><i class="fas fa-sort-down"></i></span>
                                    <label for="dptonac">Departamento</label>
                                    <input type="text" name="dptonac" id="dptonac" class="w100por" 
                                        placeholder="Seleccione una opcion">
                                    <div class="optionselect ">
                                        <ul class="ubigeo ubigeoSearch" data-option="2">
                                            <?php echo $departamentos ?>
                                        </ul>
                                    </div>
                                </div>    
                                
                                
                            </div>
                            <div class="dataEntry con_borde">           
                                <div class="w50por pos_relative">
                                    <label for="provnac">Provincia</label>
                                    <span class="flecha_abajo"><i class="fas fa-sort-down"></i></span>
                                    <input type="text" name="provnac" id="provnac" class="w100por" placeholder="Seleccione una opcion">
                                    <div class="optionselect ">
                                            <ul class="ubigeo ubigeoSearch" data-option="2">
                                                
                                            </ul>
                                        </div>
                                </div>
                                <div class="w50por pos_relative">
                                    <label for="distnac">Distrito</label>
                                    <span class="flecha_abajo"><i class="fas fa-sort-down"></i></span>
                                    <input type="text" name="distnac" id="distnac" class="w100por" placeholder="Seleccione una opcion">
                                    <div class="optionselect ">
                                            <ul class="ubigeo ubigeoSearch" data-option="2">
                                            </ul>
                                        </div>
                                </div>
                                
                            </div>
                            <div class="dataEntry con_borde">
                                <div class="w100por">
                                    <label for="avisoExtranjeros" >Personal extranjero: consignar los datos del LUGAR DE NACIMIENTO:</label>
                                </div>
                                
                            </div>
                            
                            <div class="dataEntry con_borde">
                                <div class="w100por">
                                    <input type="text" name="nacimientoext" id="nacimientoext" class="w100por texto_mayusculas closeoption">
                                </div>
                               
                            </div>
                            
                  
                        </div>
                        <div class="">

                            <div class="dataEntry con_borde">
                                <label for="">CUENTA BANCARIA</label>
                            </div>
                            <div class="dataEntry con_borde">
                                <div class="w100por pos_relative">
                                    <label for="banco">Banco :</label>
                                    <span class="flecha_abajo"><i class="fas fa-sort-down"></i></span>
                                    <input type="text" name="banco" id="banco" class="w100por texto_mayusculas">
                                    <div class="optionselect ">
                                        <ul class="ubigeo" data-option="4">
                                            <?php echo $bancos ?>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="dataEntry con_borde">
                                <div class="w100por">
                                    <label for="cuenta">N°. de Cuenta</label>
                                    <input type="text" name="cuenta" id="cuenta" class="w100por texto_mayusculas closeoption">
                                </div>
                            </div>
                            <div class="dataEntry con_borde">
                                <div class="w100por">
                                    <br>
                                    <label for="">Se encuentra afiliado a:</label>
                                </div>
                            </div>
                            <div class="dataEntry con_borde">
                                <div class="w100por dflex">
                                    <input type="radio" id="afp" name="pension" value="01">
                                    <label for="afp">AFP</label>
                                    <input type="radio" id="onp" name="pension" value="02">
                                    <label for="onp">ONP</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="seccion">
                        <div class="dataEntry con_borde">
                            <div class="w40por">
                                <label>Sexo</label>
                            </div>
                            <div class="w60por">
                                <label>Estado Civil</label>
                            </div>
                        </div>
                        <div class="dataEntry con_borde">
                            <div class="w40por dflex">
                                <input type="radio" id="masculino" name="sexo" value="MA">
                                <label for="masculino">Masculino</label>
                                <input type="radio" id="femenino" name="sexo" value="FE">
                                <label for="femenino">Femenino</label>
                            </div>
                            <div class="w60porv dflex">
                                <input type="radio" id="soltero" name="civil" value="SO">
                                <label for="soltero">Soltero</label>
                                <input type="radio" id="casado" name="civil" value="CA">
                                <label for="casado">Casado</label>
                                <input type="radio" id="viudo" name="civil" value="VI">
                                <label for="viudo">Viudo</label>
                                <input type="radio" id="divorciado" name="civil" value="DI">
                                <label for="divorciado">Divorciado</label>
                                <input type="radio" id="conviviente" name="civil" value="CO">
                                <label for="conviviente">Conviviente</label>
                                <input type="radio" id="otros" name="civil" value="OT">
                                <label for="otros">Otros</label>
                            </div>
                        </div>
                    </div>
                    <div class="seccion con_borde">
                        <h4 class="bordes_lados">II. DATOS FAMILIARES</h4>
                        <p class="detalles">
                            <span> Colocar los datos de: Cónyuge o Conviviente e hijos 
                                (de no tener colocar los datos de los familiares con quien vive actualmente)</span>
                            <button type="button" id="agregarFamilia" class="buttonAdd">Agregar</button>
                        </p>
                        <table id="tablafamilia">
                            <thead>
                                <tr>
                                    <th>Apellidos y Nombres</th>
                                    <th>Parentesco</th>
                                    <th>DNI</th>
                                    <th>Fecha Nacimiento</th>
                                    <th>G. Instrucción</th>
                                    <th>¿Vive con ellos?</th>
                                    <th>Ocupación Actual</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><input type="text" class="w100por texto_mayusculas"></td>
                                    <td><input type="text" class="w100por texto_mayusculas"></td>
                                    <td><input type="text" class="w100por texto_mayusculas"></td>
                                    <td><input type="date" class="w100por"></td>
                                    <td><input type="text" class="w100por texto_mayusculas"></td>
                                    <td><select >
                                            <option value="0">Si
                                            <option value="1">No</td>
                                        </select>
                                    <td><input type="text" class="w100por texto_mayusculas"></td>
                                </tr>
                            </tbody>
                        </table>
                        <!--div class="con_borde">
                                <div class=" dataEntry w100por dflex">
                                    <p class="w30por">Actualmente vives con tu familia:</p>
                                    <input type="radio" id="si" name="vivefamilia" value="01">
                                    <label for="si">Si</label>
                                    <input type="radio" id="no" name="vivefamilia" value="02">
                                    <label for="no">No</label>
                                </div>
                            </div-->
                    </div>
                    <div class="seccion con_borde">
                        <h4 class="bordes_lados">III. ESTUDIOS</h4>
                        
                        <table id="tablaEstudios"><!--VER COMO JALA ESTA TABLA Y CREAR UNA PARA EDUCACION-->
                            <thead>
                                <tr>
                                    <th>Tipo de Instrucción</th>
                                    <th>Nombre de la Institución</th>
                                    <th>Año de Inicio</th>
                                    <th>Año de termino</th>
                                    <th>Carrera Profesional</th>
                                    <th>Titulo o Grado Obtenido</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><option value="3">UNIVERSITARIA</option></td>
                                    <td><input type="text" class="w100por texto_mayusculas"></td>
                                    <td><input type="number" min="1900" max="2099" step="1" value=""></td>
                                    <td><input type="number" min="1900" max="2099" step="1" value=""></td>
                                    <td><input type="text" class="w100por texto_mayusculas"></td>
                                    <td><input type="text" class="w100por texto_mayusculas"></td>
                                </tr>
                                <tr>
                                    <td><option value="2">TECNICA</option></td>
                                    <td><input type="text" class="w100por texto_mayusculas"></td>
                                    <td><input type="number" min="1900" max="2099" step="1" value=""></td>
                                    <td><input type="number" min="1900" max="2099" step="1" value=""></td>
                                    <td><input type="text" class="w100por texto_mayusculas"></td>
                                    <td><input type="text" class="w100por texto_mayusculas"></td>
                                </tr>
                                <tr>
                                    <td><option value="1">SECUNDARIA</option></td>
                                    <td><input type="text" class="w100por texto_mayusculas"></td>
                                    <td><input type="number" min="1900" max="2099" step="1" value=""></td>
                                    <td><input type="number" min="1900" max="2099" step="1" value=""></td>
                                    <td><input type="text" class="w100por texto_mayusculas"></td>
                                    <td><input type="text" class="w100por texto_mayusculas"></td>
                                </tr>
                                <tr>
                                    <td><option value="0">PRIMARIA</option></td>
                                    <td><input type="text" class="w100por texto_mayusculas"></td>
                                    <td><input type="number" min="1900" max="2099" step="1" value=""></td>
                                    <td><input type="number" min="1900" max="2099" step="1" value=""></td>
                                    <td><input type="text" class="w100por texto_mayusculas"></td>
                                    <td><input type="text" class="w100por texto_mayusculas"></td>
                                </tr>
                                <tr>
                                    <td><option value="4">OTROS(Especialidades,Maestrias,Diplomados)</option></td>
                                    <td><input type="text" class="w100por texto_mayusculas"></td>
                                    <td><input type="number" min="1900" max="2099" step="1" value=""></td>
                                    <td><input type="number" min="1900" max="2099" step="1" value=""></td>
                                    <td><input type="text" class="w100por texto_mayusculas"></td>
                                    <td><input type="text" class="w100por texto_mayusculas"></td>
                                </tr>
                            </tbody>
                        </table>
                        <p class="detalles">
                            <button type="button" id="agregarEstudios" class="buttonAdd">Agregar</button><!--REVISAR TMB ESTE BOTON-->
                        </p>
                    </div>
                    <div class="seccion con_borde">
                        <h4 class="bordes_lados">IV. EXPERIENCIA LABORAL</h4>
                        <p class="detalles">
                            <span>DOS ULTIMOS EMPLEOS</span>
                            <button type="button" id="agregarExperiencia" class="buttonAdd">Agregar</button><!--REVISAR TMB ESTE BOTON-->
                        </p>
                        <table id="tablaExperiencia"><!--VER COMO JALA ESTA TABLA Y CREAR UNA PARA EDUCACION-->
                            <thead>
                                <tr>
                                    <th>Empresa</th>
                                    <th>Cargo</th>
                                    <th>Tiempo Laborado</th>
                                    <th>Motivo de Retiro</th>
                                    <th>Ultima Remuneración</th>
                                    <th>Nombre del jefe Inmediato</th>
                                    <th>Dirección</th>
                                    <th>Telefono</th>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                    </div>
                    <div class="seccion con_borde">
                        <h4 class="bordes_lados">V. SITUACION DE VIVIENDA</h4>
                        <div class="con_borde dflex dataGroup">
                            <span class="tituloItem w20por">Ubicación :<br> </span>
                            <div class="w80por">
                                <input type="radio" id="vivienda1" name="vivienda" value="07">
                                <label for="vivienda1">Residencial/Urb.</label>
                                <input type="radio" id="vivienda2" name="vivienda" value="05">
                                <label for="vivienda2">AA.HH.</label>
                                <input type="radio" id="vivienda3" name="vivienda" value="04">
                                <label for="vivienda3">Cooperativa/Agrupa./Asociación</label>
                                <input type="radio" id="vivienda4" name="vivienda" value="99">
                                <label for="vivienda4">Otros.</label>
                            </div>
                        </div>
                        <div class="con_borde dflex dataGroup">
                            <span class="tituloItem w30por">Tenencia :<br> </span>
                            <div class="w80por">
                                <input type="radio" id="tenencia1" name="tenencia" value="01">
                                <label for="tenencia1">Propia</label>
                                <input type="radio" id="tenencia2" name="tenencia" value="02">
                                <label for="tenencia2">Alquilada</label>
                                <input type="radio" id="tenencia3" name="tenencia" value="03">
                                <label for="tenencia3">Familiar</label>
                                <!--input type="radio" id="tenencia4" name="tenencia" value="04">
                                <label for="tenencia4">Invasión</label-->
                                <input type="radio" id="tenencia4" name="tenencia" value="04">
                                <label for="tenencia5">Otros.</label>
                            </div>
                        </div>
                        <div class="con_borde dflex dataGroup">
                            <span class="tituloItem w30por">Tipo :<br> </span>
                            <div class="w80por">
                                <input type="radio" id="tipo1" name="tipo" value="01">
                                <label for="tipo1">Casa</label>
                                <input type="radio" id="tipo2" name="tipo" value="02">
                                <label for="tipo2">Departamento</label>
                                <input type="radio" id="tipo3" name="tipo" value="03">
                                <label for="tipo3">Callejón</label>
                                <input type="radio" id="tipo4" name="tipo" value="04">
                                <label for="tipo4">Quinta</label>
                                <input type="radio" id="tipo5" name="tipo" value="05">
                                <label for="tipo5">Otros.</label>
                            </div>
                        </div>
                        <div class="con_borde dflex dataGroup">
                            <span class="tituloItem w30por">Material :<br> </span>
                            <div class="w80por">
                                <input type="radio" id="material1" name="material" value="01">
                                <label for="material1">Noble</label>
                                <input type="radio" id="material2" name="material" value="02">
                                <label for="material2">Esteras</label>
                                <input type="radio" id="material3" name="material" value="03">
                                <label for="material3">Madera</label>
                                <input type="radio" id="material4" name="material" value="04">
                                <label for="material4">Quincha</label>
                                <input type="radio" id="material5" name="material" value="05">
                                <label for="material5">Otros.</label>
                            </div>
                        </div>
                        <div class="con_borde dflex dataGroup">
                            <span class="tituloItem w30por">Servicios :</span>
                            <div class="w80por">
                                <input type="checkbox" id="servicio1" name="servicio1">
                                <label for="servicio1">Agua</label>
                                <input type="checkbox" id="servicio2" name="servicio2">
                                <label for="servicio2">Luz</label>
                                <input type="checkbox" id="servicio3" name="servicio3">
                                <label for="servicio3">Desagüe</label>
                                <input type="checkbox" id="servicio4" name="servicio4">
                                <label for="servicio4">Cable</label>
                                <input type="checkbox" id="servicio5" name="servicio5">
                                <label for="servicio5">Internet</label>
                                <input type="checkbox" id="servicio6" name="servicio6">
                                <label for="servicio6">Telf.Fijo</label>
                                <input type="checkbox" id="servicio7" name="servicio7">
                                <label for="servicio7">Otros</label>
                            </div>
                        </div>
                    </div>
                    <div class="seccion con_borde">
                        <h4 class="bordes_lados">VI. SITUACION DE SALUD</h4>
                        <p class="detalles w100por con_borde">¿A qué tipo de seguro está afiliado usted y su familia?</p>
                        <div class="con_borde dflex dataGroup">
                            <div class="w80por pl50px">
                                <input type="radio" id="afiliado1" name="afiliado" value="01">
                                <label for="afiliado1">EsSalud</label>
                                <input type="radio" id="afiliado2" name="afiliado" value="02">
                                <label for="afiliado2">EPS (Clínica Particular)</label>
                                <input type="radio" id="afiliado3" name="afiliado" value="03">
                                <label for="afiliado3"> Seguro Integral de Salud (SIS)</label>
                             </div>
                        </div>
                        <p class="detalles w100por con_borde">¿Padece o padeció alguna enfermedad crónica?</p>
                        <div class="con_borde dflex dataGroup">
                            <div class="w80por pl50px">
                                <input type="radio" id="enfermedad1" name="enfermedad" value="01">
                                <label for="enfermedad1">Si</label>
                                <input type="radio" id="enfermedad2" name="enfermedad" value="02">
                                <label for="enfermedad2">No</label>
                                <input type="radio" id="enfermedad3" name="enfermedad" value="03">
                                <label for="enfermedad3"> Cual</label>
                                <input type="text" name="emfermedadcual" id="enfermedadcual" class="w50por texto_mayusculas">
                             </div>
                        </div>
                        <p class="detalles w100por con_borde">¿Está recibiendo tratamiento?</p>
                        <div class="con_borde dflex dataGroup">
                            <div class="w80por pl50px">
                                <input type="radio" id="tratamiento1" name="tratamiento" value="01">
                                <label for="tratamiento1">Si</label>
                                <input type="radio" id="tratamiento2" name="tratamiento" value="02">
                                <label for="tratamiento2">No</label>
                                <input type="radio" id="tratamiento3" name="tratamiento" value="03">
                                <label for="tratamiento3"> Cual</label>
                                <input type="text" name="tratamientocual" id="tratamientocual" class="w50por texto_mayusculas">
                             </div>
                        </div>
                        <p class="detalles w100por con_borde">¿Tiene algún familiar que padece alguna enfermedad crónica u otra dolencia?</p>
                        <div class="con_borde dflex dataGroup">
                            <div class="w80por pl50px">
                                <input type="radio" id="familiar1" name="familiar" value="01">
                                <label for="familiar1">Si</label>
                                <input type="radio" id="familiar2" name="familiar" value="02">
                                <label for="familiar2">No</label>
                                <input type="radio" id="familiar3" name="familiar" value="03">
                                <label for="familiar3"> Cual</label>
                                <input type="text" name="familiarcual" id="familiarcual" class="w50por texto_mayusculas">
                             </div>
                        </div>
                        <p class="detalles w100por con_borde">¿Está recibiendo tratamiento?</p>
                        <div class="con_borde dflex dataGroup">
                            <div class="w80por pl50px">
                                <input type="radio" id="tratfamiliar1" name="tratfamiliar" value="01">
                                <label for="tratfamiliar1">Si</label>
                                <input type="radio" id="tratfamiliar2" name="tratfamiliar" value="02">
                                <label for="tratfamiliar2">No</label>
                                <input type="radio" id="tratfamiliar3" name="tratfamiliar" value="03">
                                <label for="tratfamiliarcual"> Cual</label>
                                <input type="text" name="tratfamiliarcual" id="tratfamiliarcual" class="w50por texto_mayusculas">
                             </div>
                        </div>
                        <p class="detalles w100por con_borde">Tiene algún pariente con problemas de: (Drogadicción, Alcohólicos, etc.).</p>
                        <div class="con_borde dflex dataGroup">
                            <div class="w80por pl50px">
                                <input type="radio" id="drogas1" name="drogas" value="01">
                                <label for="drogas1">Si</label>
                                <input type="radio" id="drogas2" name="drogas" value="02">
                                <label for="drogas2">No</label>
                                <input type="radio" id="drogas3" name="drogas" value="03">
                                <label for="drogas3"> Cual</label>
                                <input type="text" name="drogascual" id="drogascual" class="w50por texto_mayusculas">
                             </div>
                        </div>
                    </div>
                    <!--div class="seccion">
                        <h4 class="bordes_lados">VII. SITUACION ECONOMICA</h4>
                        <p class="detalles w100por con_borde">Indicar SI o NO y numeros de aportantes que contribuyen con el ingreso familiar:</p>
                        <div class="dataEntry con_borde">
                            <div class="w35por">
                                <label for="sueldoTrabajador">Usted como Trabajador</label>
                                <input type="number" name="sueldoTrabajador" id="sueldoTrabajador" class="w100por closeoption" placeholder="S/.">
                            </div>
                            <div class="w35por">
                                <label for="sueldoConyuje">Conyuje/Concubina</label>
                                <input type="number" name="sueldoConyuje" id="sueldoConyuje" class="w100por closeoption" placeholder="S/.">
                            </div>
                            <div class="w30por">
                                <label for="sueldoOtros">Otros: Especificar</label>
                                 <input type="number" name="sueldoOtros" id="sueldoOtros" class="w100por closeoption" placeholder="S/.">
                            </div>
                        </div>
                        <div class="dataEntry con_borde">
                            <div class="w45por">
                                <label for="gastoFamiliar">Indicar total de aportantes en el ingreso familiar</label>
                                <input type="number" name="gastoFamiliar" id="gastoFamiliar" class="w50por closeoption">
                            </div>
                        </div>
                    </div-->
                    <div class="seccion">
                        <h4 class="bordes_lados">VII. SITUACION ECONOMICA</h4>
                        <p class="detalles w100por con_borde">Indicar SI o NO y numeros de aportantes que contribuyen con el ingreso familiar:</p>
                        <div class="dataEntry con_borde">
                            <div class="w40por">
                                <label for="sueldoTrabajador">Usted como Trabajador</label>
                                <input type="radio" id="ingresotrab1" name="ingresotrab" value="01">
                                <label for="ingresotrab1">Si</label>
                                <input type="radio" id="ingresotrab2" name="ingresotrab" value="02">
                                <label for="ingresotrab2">No</label>
                            </div>
                            <div class="w35por">
                                <label for="sueldoTrabajador">Conyuge/Concubina</label>
                                <input type="radio" id="ingresoconyuje1" name="ingresoconyuje" value="01">
                                <label for="ingresoconyuje1">Si</label>
                                <input type="radio" id="ingresoconyuje2" name="ingresoconyuje" value="02">
                                <label for="ingresoconyuje2">No</label>
                            </div>
                        </div>
                        <p class="detalles w100por con_borde">Otros: Especificar</p>
                        <div class="con_borde dflex dataGroup">
                            <div class="w80por pl50px">
                                <input type="radio" id="ingresootros1" name="ingresootros" value="01">
                                <label for="ingresootros1">Si</label>
                                <input type="radio" id="ingresootros2" name="ingresootros" value="02">
                                <label for="ingresootros2">No</label>
                                <input type="radio" id="ingresootros3" name="ingresootros" value="03">
                                <label for="ingresootros3">Cual</label>
                                <input type="text" name="aporteOtros" id="aporteOtros" class="w50por closeoption texto_mayusculas">
                            </div>               
                        </div> 
                        <div class="dataEntry con_borde">
                            <div class="w45por">
                                <label for="gastoFamiliar">Indicar total de aportantes en el ingreso familiar</label>
                                <input type="number" name="gastoFamiliar" id="gastoFamiliar" class="w50por closeoption">
                            </div>
                        </div> 
                    </div>
                    <div class="seccion">
                        <h4 class="bordes_lados">VIII. EN CASO DE EMERGENCIA (Con quién debemos comunicarnos)</h4>
                        <div class="dataEntry con_borde">
                            <div class="w100por">
                                <label for="personaEmergencia">Apellidos y Nombres:</label>
                                <input type="text" name="personaEmergencia" id="personaEmergencia" class="w100por texto_mayusculas closeoption">
                            </div>
                        </div>
                        <div class="dataEntry con_borde">
                            <div class="w35por">
                                <label for="parentescoEmergencia">Parentesco:</label>
                                <input type="text" name="parentescoEmergencia" id="parentescoEmergencia" class="w100por texto_mayusculas closeoption">
                            </div>
                            <div class="w35por">
                                <label for="fijoEmergencia">Teléfono Fijo:</label>
                                <input type="text" name="fijoEmergencia" id="fijoEmergencia" class="w100por closeoption">
                            </div>
                            <div class="w30por">
                                <label for="celularEmergencia">Teléfono Celular: </label>
                                 <input type="text" name="celularEmergencia" id="celularEmergencia" class="w100por closeoption">
                            </div>
                        </div>
                        <div class="dataEntry con_borde">
                            <div class="w100por">
                                <label for="direccionEmergencia">Dirección:</label>
                                <input type="text" name="direccionEmergencia" id="direccionEmergencia" class="w100por texto_mayusculas closeoption">
                            </div>
                        </div>
                    </div>
                    <div class="seccion con_borde">
                        <div class="croquis">
                            <p>CROQUIS DE TU DOMICILIO</p>
                            <div id="map" style="display:none"></div><!--capaz asi puedo solucionar el problema del zoom-->
                            <div id="croquis"><img src="" id="imgCroquis" alt="Imagen en formato jpg/jpeg"></div>
                            <div id="buscar" class="oculto">Buscar</div><!--ver-->
                        </div>
                        <input type="file" id="subirCroquis" class="oculto" accept=".jpeg,.jpg">
                        <button type="button" id="agregarCroquis" class="buttonAdd" >Subir</button>
                        <span id="mensajeCroquis" >Subir croquis, una captura desde Google Maps</span>
                        <div class="dataEntry con_borde">
                            <div class="w100por">
                                <label for="referencia">Referencia:</label>
                                <input type="text" name="referencia" id="referencia" class="w100por texto_mayusculas closeoption">
                            </div>
                        </div>
                    </div>
                    <p class="con_borde italic pl5px">DECLARO BAJO JURAMENTO QUE LA INFORMACIÓN CONSIGNADA EN LA PRESENTE FICHA ES VERDADERA.</p>
                    <div class="seccion con_borde firmasFicha">
                        <div class="dgrid g55 pad30px texto_centro">
                            <div>
                                <div class="lienzo">
                                    <span id="firmado" class="oculto">0</span>
                                    <canvas id="mapupload" width="600" height="300" class="oculto">
                                        Tu navegador no soporta canvas.
                                    </canvas>
                                    <canvas id="firma" width="340" height="200" class="con_borde">
                                        Tu navegador no soporta las firmas
                                    </canvas>

                                   
                                </div>
                                <div>
                                    <p>Firma del Trabajador</p>
                                </div>
                            </div>
                            <div>
                                <div class="dflexCenter mwptop42">
                                    <div>
                                        <input type="date" name="fechaElabora" id="fechaElabora" class="w100por" 
                                        value="<?php echo date('Y-m-d')?>" readonly>
                                    </div>
                                </div>
                                <p>Fecha</p>
                            </div>
                        </div>
                        <div class="controles">
                            <input type="button" class="button" id="draw-clearBtn" value="Limpiar Firma"></input>
                            <input type="submit" class="button" id="save-SheetBtn" value="Enviar documento"></input>
                            <input type="button" class="button" id="close-document" value="Cerrar Ficha"></input>
                            <!--<input type="button" class="button" id="save-map" value="Grabar Mapa"></input>-->
                        </div>
                    </div>
                </form>
            </div>           
        </div>
        <div class="wrap">
            <div class="page1">
                <div class="titulo">
                    <p><strong>INSTRUCCIONES PARA EL POSTULANTE:</strong></p>
                    <p>- Ingresar a la plataforma con el código secreto de ingreso que reciba en su correo electrónico.</p>
                    <p>- Una vez que haya ingresado, podrá empezar a llenar la información y cargar los documentos que se le pide, y podrá completar todo lo requerido en una sola sesión o en varias. Cada vez que ingrese deberá colocar el código que le llego a su correo por razones de seguridad.</p>
                    <p>- Deberá leer detenidamente las instrucciones de esté formulario, así como ingresar toda la información requerida verificando que sea precisa y adecuada. En este marco, usted reconoce ser único y exclusivo responsable por la exactitud y corrección de los datos que introduzca en la plataforma, así como por errores u omisiones en los mismos, por lo que libera de toda responsabilidad a SEPCON por cualquier eventualidad relacionada con el empleo de dichos datos antes, durante o después de la relación laboral.</p>
                </div>
                <div class="titulo2">
                    <p>INGRESE EL NUMERO INDICADO EN EL CORREO ELECTRONICO:</p>
                </div>
                <div class="cuerpo">
                    <form action="#" method="POST" id="resgisterForm">
                        <div class="enterForm">
                            <div class="dataEnter">
                                <input type="text" name="numberid" id="numberid" required>
                            </div>
                        </div>
                        <div class="options">
                            <button id="btnPage1"><p>Continuar</p></button>
                        </div>
                    </form>
                    
                </div>
            </div>
            <div class="page2">
                <form action="" id="formUpload" method="POST">
                    <input type="hidden" name="divTarget" id="divTarget">
                    <input type="hidden" name="codigo_postulante" id="codigo_postulante">
                    <input type="hidden" name="estado_documento" id="estado_documento">
                    <input type="file" name="uploadfile" id="uploadfile" class="oculto" accept="application/pdf,image/jpeg">
                </form>
                <div class="titulo">
                    <p>ADJUNTAR TODA LA DOCUMENTACION SOLICITADA PARA EL INGRESO A PLANILLA E FORMATO </p>
                    <p>PDF (MAXIMO 10 MB), A EXCEPCION DE LA FOTO QUE DEBE SER EN FORMATO JPG</p>
                </div>
                <div class="presentacion">
                    <p id="nombres_postulante"></p>
                </div>
                <div class="titulo2">
                    <p>Puede ingresar la documentación gradualmente, tomando en cuenta la <strong>fecha limite indicada por RRHH</strong> para completar dicha documentación.</p>
                </div>
                <div class="lados">
                    <div class="izquierda">
                        <div class="fileEnter" id="file1">
                            <span>01</span>
                            <div>
                                <div class="descripcion">Ficha de Personal * <span class="alerta"> (Rellene primero la ficha) </span></div>
                                <div class="icono"><a href="#" class="atach"><i class="fas fa-pencil-alt"></i><p>Rellenar</p></a></div>    
                            </div>
                        </div>
                        <div class="fileEnter" id="file2">
                        <span>02</span>
                        <div>
                            <div class="descripcion">Certificado de Antecedentes Policiales/Certi Adulto/Certi Joven *</div>
                            <div class="icono"><a href="#" class="atach"><i class="fa fa-paperclip"></i><p>Adjuntar</p></a></div>    
                        </div>
                    </div>
                    <div class="fileEnter" id="file3">
                        <span>03</span>
                        <div>
                            <div class="descripcion">Certificado de Antecedentes Judiciales/Certi Adulto/Certi Joven *</div>
                            <div class="icono"><a href="#" class="atach"><i class="fa fa-paperclip"></i><p>Adjuntar</p></a></div>    
                        </div>
                    </div>
                    <div class="fileEnter" id="file4">
                        <span>04</span>
                        <div>
                            <div class="descripcion">Constancia de RETCC (solo R. civil)*</div>
                            <div class="icono"><a href="#" class="atach"><i class="fa fa-paperclip"></i><p>Adjuntar</p></a></div>    
                        </div>
                    </div>
                    <div class="fileEnter" id="file5">
                        <span>05</span>
                        <div>
                            <div class="descripcion">Declaración Jurada de Domicilio*</div>
                            <div class="icono">
                                <a href="#" class="atach"><i class="fa fa-paperclip"></i><p>Adjuntar</p></a>
                                <a href="/postulanterrhh/downloads/2. Declaración de Domicilio 2023.pdf" class="donwload" download="2. Declaración de Domicilio 2022.pdf"><i class="fas fa-download"></i><p>Descargar</p></a>
                            </div>    
                        </div>
                    </div>
                    <div class="fileEnter" id="file6">
                        <span>06</span>
                        <div>
                            <div class="descripcion">Declaración Jurada de Afiliación al Sistema de Pensiones*</div>
                            <div class="icono">
                                <a href="#" class="atach"><i class="fa fa-paperclip"></i><p>Adjuntar</p></a>
                                <a href="/postulanterrhh/downloads/Declaracion Jurada de Afilicion al Sistema de Pensiones.pdf" class="donwload" download="Declaracion Jurada de Afilicion al Sistema de Pensiones.pdf"><i class="fas fa-download"></i><p>Descargar</p></a>
                            </div>    
                        </div>
                    </div>
                    <div class="fileEnter" id="file7">
                        <span>07</span>
                        <div>
                            <div class="descripcion">Entrega de Declaración Jurada de Beneficiarios Seguro Vida Ley (Legalizado)*</div>
                            <div class="icono">
                                <a href="#" class="atach"><i class="fa fa-paperclip"></i><p>Adjuntar</p></a>
                                <a href="/postulanterrhh/downloads/FORMATO DJB VIDA LEY1.pdf" class="donwload" download="FORMATO DJB VIDA LEY1.pdf"><i class="fas fa-download"></i><p>Descargar</p></a>
                            </div>    
                        </div>
                    </div>
                    <div class="fileEnter" id="file8">
                        <span>08</span>
                        <div>
                            <div class="descripcion">Acta de Matrimonio o Reconocimiento de Unión de Hecho (para la Conviviente) + DNI de conyuge *</div>
                            <div class="icono"><a href="#" class="atach"><i class="fa fa-paperclip"></i><p>Adjuntar</p></a></div>    
                        </div>
                    </div>  
                    </div>
                    <div class="derecha">
                        <div class="fileEnter" id="file9">
                            <span>09</span>
                            <div>
                                <div class="descripcion">Certificado de Estudios de hijos (Solo R. Civil)*</div>
                                <div class="icono"><a href="#" class="atach"><i class="fa fa-paperclip"></i><p>Adjuntar</p></a></div>    
                            </div>
                        </div>
                        <div class="fileEnter" id="file11">
                            <span>10</span>
                            <div>
                                <div class="descripcion">Copia de DNI*</div>
                                <div class="icono"><a href="#" class="atach"><i class="fa fa-paperclip"></i><p>Adjuntar</p></a></div>    
                            </div>
                        </div>
                        <div class="fileEnter" id="file12">
                            <span>11</span>
                            <div>
                                <div class="descripcion">Certificado de Antecedentes Penales/Certi Adulto/Certi Joven *</div>
                                <div class="icono"><a href="#" class="atach"><i class="fa fa-paperclip"></i><p>Adjuntar</p></a></div>    
                            </div>
                        </div>
                        <div class="fileEnter" id="file13">
                            <span>12</span>
                            <div>
                                <div class="descripcion">Curriculum Vitae con certificados de trabajos anteriores*</div>
                                <div class="icono"><a href="#" class="atach"><i class="fa fa-paperclip"></i><p>Adjuntar</p></a></div>    
                            </div>
                        </div>
                        
                        <div class="fileEnter" id="file14">
                            <span>13</span>
                            <div>
                                <div class="descripcion">Certificado de Retención de Quinta Categoría*</div>
                                <div class="icono">
                                    <a href="#" class="atach"><i class="fa fa-paperclip"></i><p>Adjuntar</p></a>
                                    <a href="/postulanterrhh/downloads/3. Compromiso 5ta categoría 2022.pdf" class="donwload" download="3. Compromiso 5ta categoría 2022.pdf"><i class="fas fa-download"></i><p>Descargar</p></a>
                                </div>    
                            </div>
                        </div>
                        <div class="fileEnter" id="file15">
                            <span>14</span>
                            <div>
                                <div class="descripcion">DNI de cada Hijo Menor de Edad | Partida de Nacimiento hijos Mayores*</div>
                                <div class="icono"><a href="#" class="atach"><i class="fa fa-paperclip"></i><p>Adjuntar</p></a></div>    
                            </div>
                        </div>
                        <div class="fileEnter" id="file17">
                            <span>15</span>
                            <div>
                                <div class="descripcion">Constancia firmada /entrega Boletín informativo SPP / SNP*</div>
                                <div class="icono">
                                    <a href="#" class="atach"><i class="fa fa-paperclip"></i><p>Adjuntar</p></a>
                                    <a href="/postulanterrhh/downloads/4. Constancia Entrega de Boletín Informativo AFP.pdf" class="donwload" download="Constancia firmada entrega Boletín informativo SPPSNP.pdf"><i class="fas fa-download"></i><p>Descargar</p></a>
                                </div>    
                            </div>
                        </div>
                        <div class="fileEnter" id="file16">
                            <span>16</span>
                            <div>
                                <div class="descripcion">Voucher Número de Cuenta*</div>
                                <div class="icono"><a href="#" class="atach"><i class="fa fa-paperclip"></i><p>Adjuntar</p></a></div>    
                            </div>
                        </div>
                    </div>
                </div>
                    
                <div class="pie">
                    <p>Una vez haya completado toda la documentación, asegúrese de que los archivos cargados correspondan a los que se</p>
                    <p>indican en cada item. Considere que no podrá continuar con el proceso de contratación si no se completa adecuadamente toda</p>
                    <p>la documentación requerida. Una vez que lo haya hecho, podrá acceder a un nuevo link y cargar a travéz del mismo; los </p>
                    <p>documentos requeridos para dar inicio a su relación laboral con la empresa. </p>
                </div>
            </div>
            <div class="page3">
                <div class="titulo">
                    <p>ADJUNTAR TODA LA DOCUMENTACION SOLICITADA PARA EL INGRESA A PLANILLA EN FORMATO</p>
                    <p>PDF (MAXIMO 10 MB), DE ACUERDO A LO INDICADO EN CADA ITEM.</p>
                </div>
                <div class="presentacion">
                    <p id="nombres_postulante2"></p>
                </div>
                <div class="titulo2">
                    <p><strong>Toda la documentación indicada en los siguientes ítems, deberá completarla a la brevedad informando a RRHH el término de la misma.</strong></p>
                </div>
                <div class="files">
                    <div class="fileEnter" id="file18">
                        <span>18</span>
                        <div>
                            <div class="descripcion">T- Registro – SUNAT *</div>
                            <div class="icono"><a href="#" class="atach"><i class="fa fa-paperclip"></i><p>Adjuntar</p></a></div>    
                        </div>
                    </div>
                    <div class="fileEnter" id="file19">
                        <span>19</span>
                        <div>
                            <div class="descripcion">Funciones y Medias de Protección y Prevención – IPER *</div>
                            <div class="icono"><a href="#" class="atach"><i class="fa fa-paperclip"></i><p>Adjuntar</p></a></div>    
                        </div>
                    </div>
                    <div class="fileEnter" id="file20">
                        <span>20</span>
                        <div>
                            <div class="descripcion">Constancia (Reg. Interno de Seguridad y Salud, Reg.Interno de Trabajo, Cartilla Informativa de Política, Visión, Misión, Valores, otros)</div>
                            <div class="icono"><a href="#" class="atach"><i class="fa fa-paperclip"></i><p>Adjuntar</p></a></div>    
                        </div>
                    </div>
                    <div class="fileEnter" id="file21">
                        <span>21</span>
                        <div>
                            <div class="descripcion">Autorización de notificaciones electrónicas *</div>
                            <div class="icono"><a href="#" class="atach"><i class="fa fa-paperclip"></i><p>Adjuntar</p></a></div>    
                        </div>
                    </div>
                    <div class="fileEnter" id="file22">
                        <span>22</span>
                        <div>
                            <div class="descripcion">Boleta de ingreso a obra *</div>
                            <div class="icono"><a href="#" class="atach"><i class="fa fa-paperclip"></i><p>Adjuntar</p></a></div>    
                        </div>
                    </div>
                    <div class="fileEnter" id="file23">
                        <span>23</span>
                        <div>
                            <div class="descripcion">Contrato de Trabajo (Solo Reg. Común) *</div>
                            <div class="icono"><a href="#" class="atach"><i class="fa fa-paperclip"></i><p>Adjuntar</p></a></div>    
                        </div>
                    </div>
                    <div class="fileEnter" id="file24">
                        <span>24</span>
                        <div>
                            <div class="descripcion">Constancia RISSO-HUDBAY (Solo personal Mina)</div>
                            <div class="icono"><a href="#" class="atach"><i class="fa fa-paperclip"></i><p>Adjuntar</p></a></div>    
                        </div>
                    </div>
                    <div class="fileEnter" id="file25">
                        <span>25</span>
                        <div>
                            <div class="descripcion">Convalidación exámen médico</div>
                            <div class="icono"><a href="#" class="atach"><i class="fa fa-paperclip"></i><p>Adjuntar</p></a></div>    
                        </div>
                    </div>
                    <div class="fileEnter" id="file26">
                        <span>26</span>
                        <div>
                            <div class="descripcion">Declaración Jurada de Cuarentena (Solo al personal destacado al proyecto Plsupetrol - Malvinas)</div>
                            <div class="icono"><a href="#" class="atach"><i class="fa fa-paperclip"></i><p>Adjuntar</p></a></div>    
                        </div>
                    </div>
                    <div class="fileEnter" id="file27">
                        <span>27</span>
                        <div>
                            <div class="descripcion">Otros</div>
                            <div class="icono"><a href="#" class="atach"><i class="fa fa-paperclip"></i><p>Adjuntar</p></a></div>    
                        </div>
                    </div>
                    
                </div>
                <div class="pie">
                    <p>Gracias por su colaboración</p>
                    <p>Agradeceremos estar atento(a) a su correo electrónico ante cualquier consulta o requerimiento relacionado a la documentación presentada.</p>
                </div>
            </div>
        </div>
        <script src="js/jquery.js"></script>
        <script src="js/firma.js?v<?php echo $version?>"></script>
        <script src="js/index.js?v<?php echo $version?>"></script>
        <script src="js/gmaps.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.3.0/html2canvas.min.js"></script>
        <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAaQGOy1ViQK0XBH5yglejBtCr_bRTOb38"></script>
    </body>
</html>