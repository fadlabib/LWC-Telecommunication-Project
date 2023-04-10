import { LightningElement,wire,api } from 'lwc';
import getUsages from '@salesforce/apex/UsageController.getUsages';
import getRelatedUsages from '@salesforce/apex/UsageController.getRelatedUsages';

export default class ChartAndAssetButtons extends LightningElement {
    doughnutChartLabels=[];
    doughnutChartData=[];

    dataUsage;
    dataArr = [];
    dataOfIphoneX = 0;
    dataOfIPhone11 = 0;
    dataOfIPhone12 = 0;
    dataOfIpadPro11 = 0;
    dataOfWatchSeries6 = 0;

    arrayOfTotalDeviceDatas = [];


    @api recordId
    @wire(getUsages, {billingAccountId: '$recordId'})
    UsageHandler({data, error}){
        if(data){
            this.dataUsage = data;
            console.log("This is the data " + JSON.stringify(this.dataUsage));
            console.log("This is the Model: " + typeof(this.dataUsage));
            
            //this will summarize the fields count
            const result = data.reduce((json, val)=>({...json, [val.Make_and_Model__c]:(json[val.Make_and_Model__c]|0)+1}), {});
            

            
            for(var i = 0; i < this.dataUsage.length;i++ ){
                if(this.dataUsage[i].Make_and_Model__c == "IPhone X"){
                    this.dataOfIphoneX = this.dataOfIphoneX + this.dataUsage[i].Usage__r[0].Data__c;
                }
                else if(this.dataUsage[i].Make_and_Model__c == "IPhone 11"){
                    this.dataOfIPhone11 = this.dataOfIPhone11 + this.dataUsage[i].Usage__r[0].Data__c;
                }
                else if(this.dataUsage[i].Make_and_Model__c == "IPhone 12"){
                    this.dataOfIPhone12 = this.dataOfIPhone12 + this.dataUsage[i].Usage__r[0].Data__c;
                }
                else if(this.dataUsage[i].Make_and_Model__c == "IPad Pro 11"){
                    this.dataOfIpadPro11 = this.dataOfIpadPro11 + this.dataUsage[i].Usage__r[0].Data__c; 
                }
                else if(this.dataUsage[i].Make_and_Model__c == "Watch Series 6 - 44mm"){
                    this.dataOfWatchSeries6 = this.dataOfWatchSeries6 + this.dataUsage[i].Usage__r[0].Data__c;
                }
            }
            this.arrayOfTotalDeviceDatas.push(this.dataOfIphoneX); 
            this.arrayOfTotalDeviceDatas.push(this.dataOfIPhone11);
            this.arrayOfTotalDeviceDatas.push(this.dataOfIPhone12);
            this.arrayOfTotalDeviceDatas.push(this.dataOfIpadPro11);
            this.arrayOfTotalDeviceDatas.push(this.dataOfWatchSeries6);

            console.log("Iphone X data: " + this.dataOfIphoneX);
            console.log("Iphone 11 data: " + this.dataOfIPhone11);
            console.log("Iphone 12 data: " + this.dataOfIPhone12);
            console.log("Ipad pro 11 data: " + this.dataOfIpadPro11);
            console.log("Watch series 6 data: " + this.dataOfWatchSeries6);
            console.log('Array of total device datas: ' + this.arrayOfTotalDeviceDatas);

            if(Object.keys(result).length){
                this.doughnutChartLabels = Object.keys(result);
                //adding the manufacture 
                this.doughnutChartLabels = this.doughnutChartLabels.map(i => 'Apple '+ i);
                console.log("This is Doughnut chart labels: " + this.doughnutChartLabels);
                
                // this.doughnutChartData = Object.values(result);
                this.doughnutChartData = this.arrayOfTotalDeviceDatas;
                console.log("This is Doughnut chart Data: " + this.doughnutChartData);
                
            }

            //Calculating the sum of Data, Text and Talk
            this.dataSumCalculation(this.dataUsage);
            this.textSumCalculation(this.dataUsage);
            this.talkSumCalculation(this.dataUsage);
        }
        if(error){
            console.error("ERRORR in Chart and asset: " + JSON.stringify(error));
        }
    }





    /* This is realted to calculating the sum of the data usage AND
        displaying it on the click of the button*/
    showData=false;
    handleDataClick(event){
        this.showData = true;
    }
    get dataText(){
        return "Total Data: " + this.dataSum + " GB";
    }
    
    dataSum;
    dataSumCalculation(arrayOfData){
        //For the data
        for(var i = 0; i < arrayOfData.length;i++){
            if(arrayOfData[i].Usage__r !== undefined){
                console.log(arrayOfData[i].Usage__r[0].Data__c)
                var dataElement = arrayOfData[i].Usage__r[0].Data__c;
                this.dataArr.push(dataElement);
            }
        }
        console.log("Array of datas: " + this.dataArr);
        console.log(typeof(this.dataArr));

        //calculating the sum
        const dataValues = Object.values(this.dataArr);
        const dataTotal = dataValues.reduce((accumulator, dataValues) => {
        return accumulator + dataValues;
        }, 0);
        console.log("The sum is: " + dataTotal); 
        this.dataSum = dataTotal;
    }
    /* This is for the text calculation */ 
    showText=false;
    handleTextClick(event){
        this.showText = true;
    }
    get textMessage(){
        return "Total Texts: " + this.textsum + " Texts";
    }

    textsum;
    textArr = [];
    textSumCalculation(arrayOfTexts){
        //For the data
        for(var i = 0; i < arrayOfTexts.length;i++){
            if(arrayOfTexts[i].Usage__r !== undefined){
                console.log(arrayOfTexts[i].Usage__r[0].SMS__c)
                var dataElement = arrayOfTexts[i].Usage__r[0].SMS__c;
                this.textArr.push(dataElement);
            }
        }
        console.log("Array of datas: " + this.textArr);
        console.log(typeof(this.textArr));

        //calculating the sum
        const textValues = Object.values(this.textArr);
        const textTotal = textValues.reduce((accumulator, textValues) => {
        return accumulator + textValues;
        }, 0);

        console.log("The sum of the texts: " + textTotal); 
        this.textsum = textTotal;
    }

    showTalk=false;
    handleTalkClick(event){
        this.showTalk = true;
    }
    get talkTotal(){
        return "Total Talks: " + this.talksum + " Minutes";
    }

    talksum;
    talkArr = [];
    talkSumCalculation(arrayOfTalks){
        //For the data
        for(var i = 0; i < arrayOfTalks.length;i++){
            if(arrayOfTalks[i].Usage__r !== undefined){
                console.log(arrayOfTalks[i].Usage__r[0].Voice_Mins__c)
                var dataElement = arrayOfTalks[i].Usage__r[0].Voice_Mins__c;
                this.talkArr.push(dataElement);
            }
        }
        console.log("Array of Talks: " + this.talkArr);
        console.log(typeof(this.talkArr));

        //calculating the sum
        const talkValues = Object.values(this.talkArr);
        const talkTotal = talkValues.reduce((accumulator, talkValues) => {
        return accumulator + talkValues;
        }, 0);

        console.log("The sum of the texts: " + talkTotal); 
        this.talksum = talkTotal;
    }


}