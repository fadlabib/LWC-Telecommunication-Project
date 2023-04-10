public with sharing class getAssets {

    @AuraEnabled(cacheable=true)
    public static List<Asset> getCategorizedAssets(String billingAccountId){
        try{
            //display all of the Assets associated based on that plan
            return [SELECT Id, User__c, Make_and_Model__c, Device_Type__c, Manufacturer__c, Phone_Number_Display__c, isPhone__c, isTablet__c, isWatch__c,
                    (SELECT Data__c, Allotted_D__c, Is_Unlimited_D__c FROM Usage__r), Plan__r.Billing_Account_Number__c
                    FROM Asset
                    WHERE Plan__r.Billing_Account_Number__c =: BillingAccountId];
        } catch(Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Usage__c> getUsageData(){
        try{ 
            return [SELECT Id, Allotted_D__c, Data__c
                    FROM Usage__c];
        } catch(Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }

}
