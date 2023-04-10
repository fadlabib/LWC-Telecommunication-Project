import { LightningElement, wire, api} from 'lwc';
import getCategorizedAssets from '@salesforce/apex/getAssets.getCategorizedAssets';
import getUsageData from '@salesforce/apex/getAssets.getUsageData';
import USAGE_PHONE from '@salesforce/resourceUrl/UsagePhone';
import USAGE_TABLET from '@salesforce/resourceUrl/UsageTablet';
import USAGE_WATCH from '@salesforce/resourceUrl/UsageWatch';

export default class DataUsage extends LightningElement {
    
    assets;
    error;
    
    @api recordId;

    //importing static images
    phoneUsage = USAGE_PHONE;
    tabletUsage = USAGE_TABLET;
    watchUsage = USAGE_WATCH;


    @wire(getCategorizedAssets, {billingAccountId: '$recordId'})
    wiredAssets({data,error}){
        if(data){
            this.assets=data;
            
            //console.log("This is the data: " + JSON.stringify(this.assets));
        }
        if(error){
            this.error=error;
            console.error(this.error);
        }
    }
    usages;
    @wire(getUsageData)
    wiredUsages({data,error}){
        if(data){
            this.usages=data;
        }
        if(error){
            this.error=error;
            console.error(this.error);
        }
    }

    handleWarningSign(){
        for(const usage of this.usages){
            if(usage.Allotted_D__c !== undefined){
                if(usage.Data__c > usage.Allotted_D__c){
                    return true;
                }
                else{
                    return false;
                }
            }
        }
    }
    handleBellSign(){
        //If the Asset is near its limit (> 90% and < 100%), it should display an orange bell icon
        for(const usage of this.usages){
            if((usage.Data__c / usage.Allotted_D__c) > 0.9 && (usage.Data__c / usage.Allotted_D__c) < 1){
                return true;
            }
            else{
                return false;
            }
        }
    }
    
}