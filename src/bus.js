'use strict'
import Vue from 'vue';
const bus = new Vue({
	methods:{
		enviarFiltros(tipoDoc, fechas, numFactura, nombre){
			let filtros = {tipoDoc, fechas, numFactura, nombre};
			console.log('Filtros enviandose en bus: ', filtros);
			this.$emit('enviarFiltros', filtros);
		}
	}
});

export default bus;