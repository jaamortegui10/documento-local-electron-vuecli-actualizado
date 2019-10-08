<template>
	<v-container>
		<v-form>
			<v-row justify='space-around' dense>
				<v-col cols='12' sm='5'>
					<label class='ml-2'>Tipo de documento</label>
					<v-select
					class='mt-4'
					v-model = 'tipoDocumento'
					prepend-inner-icon='mdi-arrow-down-drop-circle'
					:items='itemsTipoDocumento'
					outlined
					rounded
					append-icon=''
					>
					</v-select>
				</v-col>
				<v-col cols='12' sm='5'>
					
					<label class='ml-2'>Fecha</label>
					<v-select
					class='mt-4'
					v-model = 'fecha'
					prepend-inner-icon='mdi-arrow-down-drop-circle'
					:items='itemsFecha'
					:disabled='!fechaValida'
					outlined
					rounded
					append-icon=''
					>
					</v-select>
					
				</v-col>
				<v-col cols='12' sm='5'>
					<label class='ml-2'>Número de factura</label>
					<v-text-field
					class='mt-4'
					v-model='numeroFactura'
					:disabled='!tercerFiltroValido'
					height='10'
					width='10'
					outlined
					rounded
					/>
				</v-col>
				<v-col cols='12' sm='5'>
					<label class='ml-2'>Nombre</label>
					<v-text-field
					class='mt-4'
					single-line
					v-model='nombreArchivo'
					prepend-inner-icon='mdi-magnify'
					:disabled='!tercerFiltroValido'
					outlined
					rounded
					/>
				</v-col>
				<v-col cols='12' sm='6' class='d-flex justify-center'>
					<v-btn class='pl-2 mb-6 mt-0'
					@click='enviarFiltros'
					:disabled='!valido'
	  				width='150'
	  				color='primary'
	  				rounded>
	  					<v-icon class='mr-2'>mdi-magnify</v-icon>
	  					<span>Consultar</span>
	  				</v-btn>
				</v-col>
			</v-row>
		</v-form>
	</v-container>
</template>
<script type="text/javascript">
	/*Recursos node*/
	const fs = require('fs');
	const path = require('path');
	const {ipcRenderer} = require('electron');

	/*librerias del front*/
	import datefns from 'date-fns';
	//import esLocale from 'date-fns/locale/es';

	/*Componentes locales vue*/
	import bus from '../bus.js';

	export default{
		data(){
			return {
				tipoDocumento:'',
				numeroFactura:'',
				nombreArchivo:'',
				itemsTipoDocumento:[],
				itemsFecha:['todas'],
				fecha:'',
				//1:numFactura, 2:nombre
				focusFiltro3:0,
				fechaValida:false,
				tercerFiltroValido:false

			}
		},
		computed:{
			valido(){
				return (this.fechaValida && this.tercerFiltroValido && (this.numeroFactura || this.nombreArchivo));
			}
		},
		watch:{
			tipoDocumento(newValue, lastValue){
				this.$store.commit('setFiltroTipoDocumento',newValue);
				if(this.tipoDocumento)
					this.fechaValida = true;
				else
					this.fechaValida = false;
				if(this.fecha)
					this.fecha = '';
				this.instanciarFechas();
			},		
			fecha(newValue, lastValue){
				this.$store.commit('setFiltroFecha', newValue);
				if(this.fecha)
					this.tercerFiltroValido = true;
				else
					this.tercerFiltroValido = false;
			},
			numeroFactura(newValue, lastValue){
				if(newValue != '')
					if(this.nombreArchivo.length > 0)
						this.nombreArchivo = '';
				//this.$store.commit('setFiltroNumeroFactura', newValue);
			},
			nombreArchivo(newValue, lastValue){
				if(newValue != '')
					if(this.numeroFactura.length > 0)
						this.numeroFactura = '';
			}
		},
		methods:{
			instanciarTiposDocumentos(){
				fs.readdir(this.rutaInicial, (err, files)=>{
					if(err){
						console.log('Ocurrió un error leyendo los directorios iniciales: ', err);
						return null;
					}

					let tiposDocumento = [];

					files.forEach(file => {
						let rutaFileActual = path.join(this.rutaInicial, file);
						let stat = fs.statSync(rutaFileActual);

						/*Se verifica que cada ruta leida sea un directorio*/
						if(stat.isDirectory())
							//Si la ruta del archivo actual no está más cerca que la ruta inicial (si el directorio actual no es la carpeta del proyecto de la app)
							if( !(path.relative(__dirname, rutaFileActual) < path.relative(__dirname, this.rutaInicial) ) )
								tiposDocumento.push(file);
					});
					this.$store.commit('setTiposDocumentos', tiposDocumento);
					this.itemsTipoDocumento = tiposDocumento;
				});
			},
			instanciarFechas(){
				fs.readdir(path.join(this.rutaInicial, this.tipoDocumento), (err, files) => {
						if(err){
							console.log('Ocurrió un error leyendo archivos de carpeta fecha: ', err);
							return null;
						}
						let fechas = [];
						files.forEach(file => {
							let rutaFechaActual = path.join(this.rutaInicial, this.tipoDocumento, file);
							let stat = fs.statSync(rutaFechaActual);

							if(stat.isDirectory()){
								fechas.push(file);
							}
						});
						fechas.push('todas');
						this.itemsFecha = fechas;
				});
			},
			instanciarDocumentos(){
				if(this.fecha == 'todas')
					this.itemsFecha.forEach(item => {
						if(item != 'todas')
							this.instanciarDocumentosPorFecha(item);
					});
				else
					this.instanciarDocumentosPorFecha(this.fecha);
			},
			instanciarDocumentosPorFecha(fecha){

			},
			enviarFiltros(){
				if(this.tipoDocumento)
					if(this.fecha)
						if(this.numeroFactura || this.nombreArchivo){
							let fechas = [this.fecha]
							if(this.fecha == 'todas')
							{
								fechas = [];
								this.itemsFecha.forEach(fechaActual => {
									if(fechaActual != this.fecha)
										fechas.push(fechaActual);
								})
							}
							bus.enviarFiltros(this.tipoDocumento, fechas, this.numeroFactura, this.nombreArchivo);
						}
			}
		},
		beforeCreate(){
			//this.$store.commit('resetState');
			

			ipcRenderer.on('ruta:get', (event, rutas) => {
				this.rutaInicial = rutas.rutaInicial;
				this.instanciarTiposDocumentos();

			});

			ipcRenderer.send('ruta:get');
			
		}
	}
</script>
<style type="text/css">
	.input-date:hover{
		cursor: pointer;
	}
</style>