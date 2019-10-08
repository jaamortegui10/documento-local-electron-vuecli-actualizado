<template>
	<div>
      	<v-container
      	class='pb-1 pl-0 mt-0 pt-0'
      	>
      		<!--Prueba-->

      		<v-row class='d-flex justify-space-between' >
  				<v-col cols='12' sm='3' class='d-flex justify-center' >
  					<v-card class='pl-0 pr-0'>
  						<v-img 
		      			:src='urlEscudoValleCauca'
		      			width='120'
		      			
		      			position='center center'
		      			aspect-ratio='1'
		      			contain

		      			/>
  					</v-card>
  				</v-col>
      			<v-col cols='12' sm='8' md='8' class='d-flex align-center' >
      				<h2 class='titulo-header body-3 ml-7' >Aplicativo Digitalización</h2>
      			</v-col>
  			</v-row>
  			
      		<v-row class='mb-0' wrap >
	      	</v-row>
      	</v-container>
      	
      	<v-divider class='mt-0'/>  

	    <v-content>
	    	<v-row>
  				<filtro></filtro>
  			</v-row>
  			<v-divider class='mt-0'/>  
  			<v-row>
  				<archivos></archivos>
  			</v-row>
	    </v-content>
	</div>
</template>
<script type="text/javascript">
	/*Recursos estáticos*/
	import escudoValleCauca from '../assets/escudo_valle_cauca.jpg';

	/*Recursos Node*/
	const fs = require('fs');
	const path = require('path');
	const {ipcRenderer} = require('electron');

	/*Recursos vuejs*/
	import Filtro from '../components/Filtro.vue';
	import Archivos from '../components/Archivos.vue';

	export default {
		data(){
			return {
				urlEscudoValleCauca:escudoValleCauca,
				filtroTipoDocumento:'',
				filtroFecha:'',
				filtroNumeroFactura:null,
				rutaInicial:''
			}
		},
		methods:{
			enviarFiltroTipoDocumento(tipoDocumento){
				this.filtroTipoDocumento = tipoDocumento;
			},
			enviarFiltroFecha(fecha){
				this.filtroFecha = fecha;
			},
			enviarFiltroNumeroFactura(numeroFactura){
				this.numeroFactura = numeroFactura;
			}
			
		},
		beforeCreate(){
			ipcRenderer.send('ruta:get');

			ipcRenderer.on('ruta:get', (event, rutas) => {
				this.rutaInicial = rutas.rutaInicial;
				this.$store.commit('setRutaInicial', this.rutaInicial);
			});

			
		},
		components:{Filtro, Archivos}
	}
</script>
<style type="text/css">
	.btn-archivos{

	}
	.titulo-header{
		color:#317ACC;
		font-size:35px;
	}
</style>