//Desarrollo de las visualizaciones
import * as d3 from 'd3';
import { numberWithCommas2 } from '../helpers';
//import { getInTooltip, getOutTooltip, positionTooltip } from './modules/tooltip';
import { setChartHeight } from '../modules/height';
import { setChartCanvas, setChartCanvasImage, setCustomCanvas, setChartCustomCanvasImage } from '../modules/canvas-image';
import { setRRSSLinks } from '../modules/rrss';
import { setFixedIframeUrl } from './chart_helpers';

//Colores fijos
const COLOR_PRIMARY_1 = '#F8B05C', 
COLOR_PRIMARY_2 = '#E37A42', 
COLOR_ANAG_1 = '#D1834F', 
COLOR_ANAG_2 = '#BF2727', 
COLOR_COMP_1 = '#528FAD', 
COLOR_COMP_2 = '#AADCE0', 
COLOR_GREY_1 = '#B5ABA4', 
COLOR_GREY_2 = '#64605A', 
COLOR_OTHER_1 = '#B58753', 
COLOR_OTHER_2 = '#731854';

export function initChart(iframe) {
    //Lectura de datos
    d3.csv('https://raw.githubusercontent.com/CarlosMunozDiazCSIC/informe_perfil_mayores_2022_social_4_12/main/data/piramide_estudios_censo_2011.csv', function(error,data) {
        if (error) throw error;
        
        //Pirámide con datos absolutos
        let currentType = 'Total';

        ///Valores iniciales de altura, anchura y márgenes
        let margin = {top: 20, right: 30, bottom: 40, left: 90},
            width = document.getElementById('chart').clientWidth - margin.left - margin.right,
            height = document.getElementById('chart').clientHeight - margin.top - margin.bottom;

        let svg = d3.select("#chart")
            .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        let x = d3.scaleLinear()
            .domain([-600000,600000])
            .range([0,width]);

        let xM = d3.scaleLinear()
            .domain([600000,0])
            .range([0, width / 2]);

        let xF = d3.scaleLinear()
            .domain([0,600000])
            .range([width / 2, width]);

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        let y = d3.scaleBand()
                .range([ 0, height ])
                .domain(d3.map(function(item) { return item.Edad; }).reverse())
                .padding(.1);

        svg.append("g")
            .call(d3.axisLeft(y));

        /////
        /////
        // Resto - Chart
        /////
        /////
        init();

        //Uso de dos botones para ofrecer datos absolutos y en miles
        document.getElementById('data_absolutos').addEventListener('click', function() {
            //Cambiamos color botón
            document.getElementById('data_porcentajes').classList.remove('active');
            document.getElementById('data_absolutos').classList.add('active');

            //Cambiamos gráfico
            setChart('Total');

            //Cambiamos valor actual
            currentType = 'Total';
        });

        document.getElementById('data_porcentajes').addEventListener('click', function() {
            //Cambiamos color botón
            document.getElementById('data_porcentajes').classList.add('active');
            document.getElementById('data_absolutos').classList.remove('active');

            //Cambiamos gráfico
            setChart('porc_total');

            //Cambiamos valor actual
            currentType = 'Porcentual';
        });
        
        //Animación del gráfico
        document.getElementById('replay').addEventListener('click', function() {
            animateChart();
        });

        /////
        /////
        // Resto
        /////
        /////

        //Iframe
        setFixedIframeUrl('informe_perfil_mayores_2022_social_4_12','nivel_estudios_generaciones');

        //Redes sociales > Antes tenemos que indicar cuál sería el texto a enviar
        setRRSSLinks('nivel_estudios_generaciones');

        //Captura de pantalla de la visualización
        setChartCanvas();
        setCustomCanvas();

        let pngDownload = document.getElementById('pngImage');

        pngDownload.addEventListener('click', function(){
            setChartCanvasImage('nivel_estudios_generaciones');
            setChartCustomCanvasImage('nivel_estudios_generaciones');
        });

        //Altura del frame
        setChartHeight(iframe);        
    });    
}