import Vuex from 'vuex';
import Vue from 'vue';
//import 'es6-promise/auto'

Vue.use(Vuex);

const store = {
	state:{
		rutaInicial:'',
		rutaActual:'',
		filtroTipoDocumento:'',
		filtroFecha:null,
		filtroNumeroFactura:null,
		tiposDocumentos:[]
	},
	getters:{
		getRutaInicial(state){
			return state.rutaInicial;
		},
		getFiltroTipoDocumento(state){
			return state.filtroTipoDocumento;
		},
		getFiltroFecha(state){
			return state.filtroFecha;
		},
		getFiltroNumeroFactura(state){
			return state.filtroNumeroFactura;
		},
		getTiposDocumentos(state){
			return state.tiposDocumentos;
		}
	},
	mutations:{
		setRutaInicial(state, value){
			state.rutaInicial = value;
		},
		setFiltroTipoDocumento(state, value){
			state.filtroTipoDocumento = value;
		},
		setFiltroFecha(state, value){
			state.filtroFecha = value;
		},
		setFiltroNumeroFactura(state, value){
			state.filtroNumeroFactura = value;
		},
		setTiposDocumentos(state, value){
			state.tiposDocumentos = value;
		},
		resetState(state){
			state.filtroTipoDocumento = '';
			state.filtroFecha=null;
			state.filtroNumeroFactura=null;
		}
	},
	actions:{

	}
};

export default new Vuex.Store({
	modules:[store]
});