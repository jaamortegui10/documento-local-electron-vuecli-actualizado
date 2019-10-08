import VueRouter from 'vue-router';
import Vue from 'vue';

/*Vistas*/
import PrincipalView from './views/PrincipalView.vue';
import PdfView from './views/PdfView.vue';

Vue.use(VueRouter);

const rutas = [
	{
		path:'/',
		component: PrincipalView,
		name:'home'
	},
	{
		path:'/pdf',
		name:'pdf_viewer',
		component: PdfView
	}

];

export default new VueRouter({
	routes:rutas,
	//mode:'history',
	base:process.env.BASE_URL
});