<template>
	<div>
		<h2>Este es un visor de pdf</h2>
		
		<div class='col-12 mt-2 b pt-1' style='background:#7CA8A5; border:1px solid #358892'>
				<div class='d-flex justify-content-center mt-2'>
					<div class="btn-group" role="group">
						<button type='button' class='btn btn-outline-secondary' @click='pagAnteriorPdf'><v-icon class='material-icons'>mdi-arrow-left</v-icon></button>
						<button type='button' class='btn btn-outline-secondary' @click='pagSiguientePdf'><v-icon class='material-icons'>mdi-arrow-right</v-icon></button>
						<button type='button' class='btn btn-outline-secondary' @click='zoomMinus'><v-icon class='material-icons'>mdi-zoom-out</v-icon></button>
						<button type='button' class='btn btn-outline-secondary' @click='zoomPlus'><v-icon class='material-icons'>mdi-zoom-in</v-icon></button>
					</div>
				</div>
				
				
				
				<div class='d-flex justify-content-center'>
					<canvas id='pdf_renderer' clas='border border-secondary'></canvas>
				</div>
				
				
				<div class='d-flex justify-content-center mb-2'>
					<button type='button' class='btn btn-outline-secondary' @click='pagAnteriorPdf'><v-icon class='material-icons'>mdi-arrow-left</v-icon></button>
					<button type='button' class='btn btn-outline-secondary' @click='pagSiguientePdf'><v-icon class='material-icons'>mdi-arrow-right</v-icon></button>
					<button type='button' class='btn btn-outline-secondary' @click='zoomMinus'><v-icon class='material-icons'>mdi-zoom-out</v-icon></button>
					<button type='button' class='btn btn-outline-secondary' @click='zoomPlus'><v-icon class='material-icons'>mdi-zoom-in</v-icon></button>
				</div>
			</div>
	</div>
</template>
<script type="text/javascript">
	/*Recursos externos*/
	const fs = require('fs');
	const path = require('path');
	//import pdfjsLib from '../mixins/pdfjs/pdfjsLib';
	//pdfjsLib.workerSrc = '../mixins/pdfjs/pdf.workerse.entry.js'

	const pdfLib2 = require('pdfjs-dist');
	const pdfLib = require('pdfjs-dist/build/pdf.js');
	//pdfLib.workerSrc = require('pdfjs-dist/build/pdf.worker.entry.js');
	pdfLib.disableWorker = true;

	/*Recursos del back*/
	const {ipcRenderer} = require('electron');

	/*Componentes*/

	export default {
		data(){
			return{
				rutaPdf:'',
				numPages:0,
				actualPdf:{
					pdf: null,
			        currentPage: 1,
			        zoomPos: 4
		    	},
		    	zooms:[
			    	{scale:0.1},{scale:0.2},{scale:0.5},
			    	{scale:1},{scale:1.5},{scale:2},{scale:2.5},{scale:3},{scale:4}
			    ]
			} 
			
		},
		//mixins:[pdfjsLib],
		methods:{
			initPdf(pdf=null){
				this.actualPdf = {
					pdf: null,
			        currentPage: 1,
			        zoomPos: 4
		    	};
		    	
		    	//pdflib.disableWorker = true;
		    	/*
		    	let loadingTask = pdflib2.getDocument(this.rutaPdf);
				loadingTask.promise.then( (pdfFromRaw) => {
				    console.log('***********************Acá');
			        this.actualPdf.pdf = pdfFromRaw;
			        //this.renderPdf();
			    }).catch(err => {
			    	console.log('Ocurrió un error leyendo el pdf: ', err);
			    });
				*/
				console.log('justo antes de pdfLib');
				
				let info = pdfLib.getDocument(this.rutaPdf);
				consoole.log('info: ', info);
				info.promise.then(pdfDoc => {
					console.log('Elemento leido por pdfLib: ', pdfDoc);
				}).catch(err => {
					console.log('Ocurrió un error usando pdfLib: ', err);
				});
			    
			    //this.actualPdf.pdf = pdf;
			    //this.renderPdf();
			    
			},
			renderPdf(){
				let actualPdf = this.actualPdf;
		        actualPdf.pdf.getPage(actualPdf.currentPage).then( (page) =>{
			        var scale = this.zooms[actualPdf.zoomPos];
			        var viewport = page.getViewport(scale);
			        var canvas = document.getElementById('pdf_renderer');
			        var context = canvas.getContext('2d');
			        canvas.height = viewport.height;
			        canvas.width = viewport.width;

			        var renderContext = {
			          canvasContext: context,
			          viewport: viewport
			        };
			        page.render(renderContext);
			    });
				    
			},
			leerPdfPrueba(){
				console.log('Ruta del pdf: ', this.rutaPdf);
				console.log('Pdf leído: ', fs.readFile(this.rutaPdf, (err, file) => {
						if(err)
							console.log('Ocurrió un error leyendo con fs: ', err);
						else
							console.log('Información archivo pdf: ', file);
					}));
			},
			pagAnteriorPdf(){
				let actualPdf = this.actualPdf;
				if(actualPdf.currentPage > 1){
					this.actualPdf.currentPage--;
					this.renderPdf();
				}
			},
			pagSiguientePdf(){
				let actualPdf = this.actualPdf;
				if(actualPdf.currentPage < 3){
					this.actualPdf.currentPage++;
					this.renderPdf();
				}
			},
			zoomMinus(){
				if(this.actualPdf.zoomPos > 0){
					this.actualPdf.zoomPos--;
					this.renderPdf();
				}
			},
			zoomPlus(){
				
				if(this.actualPdf.zoomPos < this.zooms.length-1){
					this.actualPdf.zoomPos++;
					this.renderPdf();
				}
			}
		},
		created(){
			console.log('Creado');
			ipcRenderer.on('pdf:abrir', (event, rutaPdf) => {
				console.log('Aquí');
				console.log('Ruta: ', rutaPdf);

				
				this.rutaPdf = rutaPdf;
				//this.leerPdfPrueba();
				this.initPdf();
				

				console.log('Ruta pdf desde el main process: ', rutaPdf);
				
			});
		},
		mounted(){
		}
	}
</script>
<style type="text/css">
	
</style>