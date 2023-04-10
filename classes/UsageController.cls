public with sharing class UsageController {
    @AuraEnabled(cacheable=true)
    public static List<Asset> getUsages(String billingAccountId){
        try{
            return [SELECT Id, 	Make_and_Model__c, Manufacturer__c, (SELECT Data__c,SMS__c,Voice_Mins__c FROM Usage__r)
                    FROM Asset
                    WHERE Plan__r.Billing_Account_Number__c =: BillingAccountId];
        }catch(Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Usage__c> getRelatedUsages(String billingAccountId){
        try {
            return [
                SELECT Id, Data__c, SMS__c,Voice_Mins__c
                FROM Usage__c];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
