<template>
	<v-container>
		<v-row>
			<v-col v-for='archivo in archivos' :key='archivo.indice' cols='12' sm='4' md='3'>
				<v-card class='text-center archivo' flat @click='abrirArchivo(archivo)' >
					<v-icon size='100' class='' :color='archivo.tipo === "directory"? "#A79025":"#7FA194"'>
						{{archivo.tipo === 'directory'? 'mdi-folder-open' : 'mdi-file-document'}}
					</v-icon>
					<v-card-title class='v-flex justify-center pl-0 pr-0'>
						<h4 justify='center' class='bx-0 body-2'>{{archivo.nombre}}</h4>
					</v-card-title>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>
<script type="text/javascript">
	/*Prueba*/
	const pdfLib2 = require('pdfjs-dist');
	const pdfLib = require('pdfjs-dist/build/pdf.js');
	//pdfLib.workerSrc = require('pdfjs-dist/build/pdf.worker.entry.js');



	const fs = require('fs');
	const path = require('path');
	const {ipcRenderer} = require('electron');

	import datefns from 'date-fns';

	import bus from '../bus.js';

	export default {
		data(){
			return {
				archivos:[],
				rutaInicial:''
			}
		},
		methods:{
			abrirArchivo(file){	
				console.log('Leyendo archivo: ', file);
				ipcRenderer.send('pdf:open', file.ruta);
			},
			retroceder(){
				ipcRenderer.send('ruta:post', null);
			},
			/***************************************/
			/*Métodos nuevos implementados*/
			/***************************************/
			/*Busca los archivos según los filtros determinados y guarda sus rutas*/
			buscarRutasArchivosCoincidentesFiltros(filtros){
				console.log('Desde Archivos:');
				console.log('Ruta Inicial: ', this.rutaInicial);
				let rutaBase = path.join(this.rutaInicial, filtros.tipoDoc);
				let archivosEncontrados = [];

				filtros.fechas.forEach(fechaActual => {
					let rutaFechaActual = path.join(rutaBase, fechaActual);
					let archivos = fs.readdirSync(rutaFechaActual);
					if(!archivos)
						console.log(`Ocurrió un error leyendo archivos en fecha: ${fechaActual}`);
					else{
						archivos.forEach(archivoActual => {
							if(filtros.numFactura){

								if(this.archivoPerteneceANumFactura(archivoActual, filtros.numFactura))
									this.agregarArchivo(archivosEncontrados, rutaFechaActual, archivoActual);
							}
							else if(filtros.nombre)
								if(archivoActual.search(filtros.nombre) != -1)
									this.agregarArchivo(archivosEncontrados, rutaFechaActual, archivoActual);
										
						});
					}
				});

				return archivosEncontrados;
			},
			/*Recorre el nombre de un archivo, sustrae su número de su factura y determina si es igual al número de factura pasado por parámetro*/
			archivoPerteneceANumFactura(nombreArchivo,numFactura){
				let numFacturaNombre = '';
				let recorriendoNumFactura = true;
				let actualCharNum;
				/*char:caracter actual*/
				for(let i = 0; i < nombreArchivo.length && recorriendoNumFactura; i++){
					actualCharNum = parseInt(nombreArchivo[i]);
					if(isNaN(actualCharNum)){
						if(numFacturaNombre.length > 0)
							recorriendoNumFactura = false;
					}
					else
						numFacturaNombre = numFacturaNombre + actualCharNum;
					
				}

				return (parseInt(numFacturaNombre) == numFactura)? true : false;

			},
			agregarArchivo(archivos, rutaBase, nombreArchivo){
				archivos.push({
					nombre:nombreArchivo, 
					ruta:path.join(rutaBase, nombreArchivo)
				});
			}
		},
		watch:{
		},
		created(){

			/*Se le pide al main_process que retorne la ruta Actual(la inicial)*/
			ipcRenderer.send('ruta:get');

			/*El main_process responde con la ruta actual*/
			ipcRenderer.on('ruta:get', (event, rutas) =>{
				/*
				this.rutaInicial = rutas.rutaInicial;
				this.rutaActual = rutas.rutaActual;
				let files = this.leerDirectorio();
				*/
				this.rutaInicial = rutas.rutaInicial;
			});

			bus.$on('enviarFiltros', (evento) => {
				let archivosEncontrados = this.buscarRutasArchivosCoincidentesFiltros(evento);
				this.archivos = archivosEncontrados;
				console.log('Rutas Archivos: ', this.archivos);
			});

		},
		mounted(){
			console.log('dirname:', __dirname);
			const rutaPrueba = '../tipo_doc_2/2017/fact_010 presupuesto aquel 13-12-2017.pdf';
			let info = pdfLib.getDocument('./assets/archivo.pdf');
			info.promise.then(pdfDoc => {
				console.log('pdf desde archivos: ', pdfDoc);
			})
			//this.abrirArchivo({nombre:'bla ', ruta:rutaPrueba});
		}
				
		

	}
</script>
<style type="text/css">
	.archivo:hover{
		cursor: pointer;
	}
</style>