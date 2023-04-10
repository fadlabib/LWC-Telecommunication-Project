import { LightningElement,api} from 'lwc';
import ChartJava from '@salesforce/resourceUrl/ChartJs';
import {loadScript} from 'lightning/platformResourceLoader'

export default class Charts extends LightningElement {
    isChartJsInitialized;
    chart;

    @api type
    @api chartLabels
    @api chartData

    

    /* will be called whenever a change happens to the component */
    renderedCallback(){
        if(this.isChartJsInitialized){
            return;
        }
        loadScript(this, ChartJava).then(() =>{
            console.log("ChartJs file loaded successfully");
            this.isChartJsInitialized = true;
            this.loadCharts();
        }).catch(error=>{
            console.error("ERRORR in renderedCallback: " + error);
        });
    }

    loadCharts(){
        window.Chart.platform.disableCSSInjection = true; 
        const canvas = document.createElement('canvas'); //will create <canvas>
        this.template.querySelector('div.chart').appendChild(canvas);
        const ctx = canvas.getContext('2d');
        this.chart = new window.Chart(ctx, this.config())

    }
    
    config(){
        // const centerText = {
        //     id: 'centerText',
        //     afterDatasetsDraw(chart,args,options){
        //         const {ctx, chartArea: {left,right,top,bottom,width,height} } = chart;
    
        //         ctx.save();
    
        //         console.log(top);
                
        //         ctx.font = 'bolder 30px Arial';
        //         ctx.fillStyle = 'rgba(255, 26, 104, 1)';
        //         ctx.textAlign = 'center';
        //         ctx.fillText('Sales: ', 400,200 + 200);
        //         //ctx.fillText('Sales: ', width / 2, height / 2 + 54);
    
        //     }
        // }

        return {
            type: this.type,
            data: {
                labels: this.chartLabels,
                datasets: [{
                    data: Object.values(this.chartData),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.8)',
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(255, 206, 86, 0.8)',
                        'rgba(75, 192, 192, 0.8)',
                        'rgba(153, 102, 255, 0.8)',
                        'rgba(255, 159, 64, 0.8)',
                        'rgba(30, 204, 148, 0.8)',
                        'rgba(130, 204, 148, 0.8)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                legend: {
                    position: 'bottom',
                    labels:{
                        usePointStyle: true,
                        boxWidth: 20
                    }
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
        }
    }
    
}