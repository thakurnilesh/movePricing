result = "";
debug = false;
// added variable for addvantage CAPP - CRM 1526
isAdvantageCapped=false;
// END CRM- 1526
nonUsageProductExists = false;//Kamal for CfS Broker
start_time = getcurrenttimeinmillis();
priceWithinPolicyFlag = true;
firstMonthlyAmount = 0;
lostRevenuePricing = 0;
promoDelim = ".!.";
menuItemDelim = "!!!";	
renewalFlag = false;
termErrorMessage = "";
allLinesUnpaidExtension = true;
invPoolPreAuthFlag = false;
invPoolNonPreAuthFlag = false;
showCaseProductExist = false;
turboProductExist = false;
zuoraCheckFlag = false;
currentDateStr = datetostr(getdate(),"yyyyMMdd");
currentDate = atoi(currentDateStr);
lineResult = "";
nonInventoryDocNumbers = "";
authDate = "";
lineItemStr = "";
effectiveDatekey = "";
operationName = "";
zouraErrorMessage = "";
//========================== START - LOOP VARIABLES INITIALIZATION ===============================//
//priceTierQtyDict = dict("integer");
promotionDiscount = 0.0;  // Defined to avoid Variable undefined compilation on save action. 
recurringLinesTotal = 0;
discountPercent = 0.0;
contractTerm = 0;
partNumberArray=string[];
pricingMethodArray = string[];
partSoldDict = dict("string");
soldWithPartNumber = string[]{"ANY"};
soldWithProdType = string[]{"ANY"};
assetStructureDict = dict("string");
quickKeyItemsDataDict = dict("string");
lineItemDict = dict("string");
childDocArr = string[];
allowedConTerm = dict("string");
effectiveDateDict = dict("string");
billingPeriodDivisorDict = dict("float");
inventoryAssetStructure = "{\"parent\": [{\"Type\": \"$actionType$\",\"SoldToaccountId\": \"$parentAccountId$\",\"assetId\": \"$assetId$\",\"fulfillTo\" : [{\"Type\": \"$actionType$\",\"assetId\": \"$assetId$\",\"FulfillToaccountId\": \"$FulfillToaccountId$\"}]}]}";
getImpressionTemplate = "<get:CampaignRecord><get:CampaignId>{{campaignId_line}}</get:CampaignId><get:StartDate>{{startDate}}</get:StartDate><get:EndDate>{{endDate}}</get:EndDate></get:CampaignRecord>";
//getImpressionTemplate = "<get:CampaignRecord><get:CampaignId>{{campaignId_line}}</get:CampaignId><get:EndDate>{{endDate}}</get:EndDate></get:CampaignRecord>";
cancelCampaignDict = dict("string");
turboImpressionCampaignIdArray = string[];
turboImpressionArray = string[];
impressionWScallXML = "";
discountTypeperdoll = "";
//contrctTermAllowed="";
totalListPrice = 0;
oneTimeTotalListPrice = 0;
autoTotalListPrice = 0;
manualTotalListPrice = 0;
totalLineItemDiscount = 0;
oneTimeTotalLineItemDiscount = 0;
autoTotalLineItemDiscount = 0;
manualTotalLineItemDiscount = 0;
oneTimeTotalEstTax = 0;
autoTotalEstTax = 0;
manualTotalEstTax = 0;
totalForCreditCheck = 0;
totalForExcessiveCFCBCredit = 0;
totalForExcessiveCredit = 0;

selectedMLSAssetFromConfig = "";
assetIdsStr = "";
inFlightAssetErrorMessage = "";
inFlightAssetClearErrorMessage = "";
inFlightErrorFlag = false;
inflightErrorDict = dict("string");
lineDataForInflight = dict("string");
uniqueLineActions = string[];
franchise = customerFranchise_quote;
totalExtNet = 0;
strategicDiscountName="";
lineDiscount = 0.0;
lineDiscountHidden=0.0;
PriceTier = 0;
EffDateInt = 0;
EffDate = "";
dateType = "";
QTY_INDEX = 2;
INSTALL_DATE_INDEX = 5;
USAGE_ENDDATE_INDEX = 6;
LEAD_TYPE_INDEX = 7;
MARKET_TYPE_INDEX = 9;
CONTRACT_TERM_INDEX = 10;

BILLING_PERIOD_INDEX = 11;
PROMOTION_INDEX = 12;
DISCOUNT_TYPE_INDEX = 13;
COMMERCE_GROUP_INDEX = 14;
PRODUCT_EMAIL_INDEX = 16;
LICENSE_TIER_RANGE_INDEX = 18;
HLCOVERRIDE_INDEX = 21;
ASSET_STATUS_INDEX = 22;
ZUORA_ID_INDEX = 24;
PRICE_TIER_INDEX = 26;
ZUORARATEPLANID_INDEX = 27;
SUBSCRIPTION_START_DATE_INDEX = 30;
SUBSCRIPTION_END_DATE_INDEX = 31;
HLC_INDEX = 32;
OVERRIDE_TERM_INDEX = 33;
LSIT_PRICE_OVERRIDE_INDEX = 42;
OVERRIDER_CONTRACT_TERM_INDEX = 34;
MANUAL_DISCOUNT_AMOUNT_INDEX = 36; // Replaced the variable MANUAL_DISCOUNT_TYPE_INDEX with MANUAL_DISCOUNT_AMOUNT_INDEX as 36 is for discount amount and not for type CRM: 1090
MANUAL_DISCOUNT_TYPE_INDEX = 37; // CRM: 1090
ASSET_PRICE_EFFECTIVE_DATE_INDEX = 38;
NEXT_CHARGE_DATE_INDEX = 43;
TERM_END_DATE_INDEX = 46;
EXTENDED_NET_PRICE_INDEX = 52;
MARKET_KEY_INDEX = 39;

FIELD_DELIM = "#";
hideMarketBudgetFee = true;// make it false if any product name in line item grid contains "TigerLead" to hide line level attribute 
tigerLeadProduct = false;
nonTigerLeadProduct = false;
inventoryFlag = false;
restrictedProducts = false;
linesHasAssetId = false;
hasTigerLeadProduct = false;
lineTypeAddOrRenewExist = false;
appliedPromotionSet = split(appliedPromotions_quote, "!!!");
appliedPromotionDict = dict("string");
zouraInputDict = dict("string");
docNumArrForZoura = string[];

tigerLeadParts = string[]{ "HOMESRCH", "HANDRAISER", "SRCHNPWS"};
tigerLeadParentInfo = dict("string");
dependantPartsDict = dict("string[]");
uniqDependantParts = string[];
resetAppliedPromoQuote = "";
lineItemsCount = 0;
totalOverrideDelta = 0.0;
advantageOverrideDelta = 0.0;
advantagelinediscount = 0.0;
isEligibleForSpecialApproval = false;
isBDXQuote = false;
thresholdSet = bmql("select Part_Number,Threshold_Value,Active from Market_Threshold");
thresholdDict = dict("float");
for eachThreshold in thresholdSet{
	if(get(eachThreshold,"Active") <> "false"){
		put(thresholdDict,get(eachThreshold,"Part_Number"),getfloat(eachThreshold,"Threshold_Value"));
	}
}

for aPromo in appliedPromotionSet{
	splitPromoSet = split(aPromo, ".!.");	
	if(splitPromoSet[0]<>"" AND isNumber(splitPromoSet[0]) AND splitPromoSet[1]<>""){
		put(appliedPromotionDict, integer(atof(splitPromoSet[0])), splitPromoSet[1]);
	}
}
if(find(parentAssetMLSString_quote,"#$#SHOWCASE#$#") <> -1 OR find(partNumberString_quote,"SHOWCASE#") <> -1)
{
	showCaseProductExist = true;
}
// Below code is written to optimize the appliedPromo datatable calls at line level
promoApplicationdct = dict("string");
c21LineDiscDict = dict("string");
appliedPromo = bmql("select DiscountPercent, Approval,Grandfathered,DateTo, PromoCode from LinePromotions");
for Promo in appliedPromo{
	put(promoApplicationdct,get(Promo, "PromoCode") + "@DiscountPercent", get(Promo, "DiscountPercent"));
	put(promoApplicationdct,get(Promo, "PromoCode") + "@Approval", get(Promo, "Approval"));
	put(promoApplicationdct,get(Promo, "PromoCode") + "@Grandfathered", get(Promo, "Grandfathered"));
	put(promoApplicationdct,get(Promo, "PromoCode") + "@PromoCode", get(Promo, "PromoCode"));
	put(promoApplicationdct,get(Promo, "PromoCode") + "@DateTo", get(Promo, "DateTo"));
}
//Promo Desc
promotionSet = string[];
promoCodeArr = string[];
docNumArr = string[];
promoRes = "";
promotionSet = split(appliedPromotions_quote,"!!!");
promoDescMap = dict("string");

/*Below is written to manage whole promotions logic Applicable to get all active promotions */

promoDisc = dict("string[]");
retStr = "";
outputStr = "";
partNumArr = string[];
productTypeArr =  string[]{"ANY"};
contractTermArr = string[]{"ANY"};
priceTierArr = string[]{"ANY"};
marketCodeArr = string[]{"ANY","ALL"};
grandfatheredArr = string[]{"",""};
bundleIDArr = string[]{"NONE"};
soldWithPartArr = string[]{"",""};
soldWithTypeArr = string[]{"ANY",""};
dateFromArr = string[]{"",""};
dateToArr = string[]{"",""};
userGroupArr = split(_system_user_groups, "+");	
append(userGroupArr,"ALL");
//Added by Ravi 7/18/2017
fieldsalesGroupArr = string[]{"fieldSalesUser","fieldSalesManager","technicalAdminstrator"};
fieldsalesuserflag = "N";
for each in fieldsalesGroupArr{
	if (findinarray(userGroupArr, each) <> -1)
	{
		fieldsalesuserflag = "Y";
		break;
	}
}
//Bridging promotional offer
fiveStreetlicenseQty = 0;
fiveStreetTerm = 0;

// Approval flags
approvalReasonArray = string[];

proStr = "";
prorationError = "";
prorationReviewNeeded = false;
callToBIFailedErrorMsg = "";
KEY_DELIMITER1 = "*@*";
KEY_DELIMITER2 = "$*$";
EffectiveDateResult = bmql("select BillingPeriod,CustomerReqCancel,NonPaymentCancel,BuyoutCancel from CancellationDate where BillingPreference = $billingPreference_quote");

for eachEffective in EffectiveDateResult {
	
	buyoutCancelkey = get(eachEffective,"BillingPeriod") + KEY_DELIMITER1 + "buyout"+ KEY_DELIMITER1 + "other";
	customerRequestedCancelKey = get(eachEffective,"BillingPeriod") + KEY_DELIMITER1 + "cancel"+ KEY_DELIMITER1 + "other";
	nonPaymentCancelKey = get(eachEffective,"BillingPeriod") + KEY_DELIMITER1 + "cancel"+ KEY_DELIMITER1 + "nonPayment";
	
	buyoutCancelvalue = get(eachEffective,"BuyoutCancel");
	customerRequestedCancelvalue = get(eachEffective,"CustomerReqCancel");
	nonPaymentCancelvalue = get(eachEffective,"NonPaymentCancel");
	
	put(effectiveDateDict,buyoutCancelkey,buyoutCancelvalue);			
	put(effectiveDateDict,customerRequestedCancelKey,customerRequestedCancelvalue);			
	put(effectiveDateDict,nonPaymentCancelKey,nonPaymentCancelvalue);						
}

fulfillToAssetDict = dict("string");
fulfillToAssetDetails = fulfillToAssetDetails_quote;
if(fulfillToAssetDetails <> "")
{
	fulFillToAssetsArray = split(fulfillToAssetDetails,"!^!");
	for eachfulFillTo in fulFillToAssetsArray
	{
		if(eachfulFillTo <> "")
		{
			assetIdArr = split(eachfulFillTo,"#$#");
			parentAssetId = assetIdArr[0];
			fulfillToAssetId = assetIdArr[1];
			put(fulfillToAssetDict,parentAssetId,fulfillToAssetId);
		}
	}
}
headers = dict("string");
session = "";
inputDict = dict("string");
endPoint = "";
quoteType_temp = quoteType_quote;// use this local varialbe everywhere in pricing ~Suraj
if(quoteType_temp == "Auto-Renew" AND (_system_user_login <> "sonusharma" AND _system_user_login <> "ravividhani" AND _system_user_login <> "surajmutha" AND _system_user_login <> "APIuser" AND _system_user_login <> "sgaddam" AND _system_user_login <> "daveespie") AND (_system_current_step_var=="start_step" OR _system_current_step_var=="pending_process"))
{
	quoteType_temp = "Modify";
	result = result + "1~skipAuthorization_quote~"+ "false" + "|";
}

if((_system_current_step_var=="start_step" OR _system_current_step_var=="pending_process") AND (quoteType_temp == "Retention" OR quoteType_temp == "Backout" OR quoteType_temp == "Modify" OR quoteType_temp == "Auto-Credit")){					
		endPoint = util.dynamicEndPoint("SOA", "Get Proration", _system_supplier_company_name);
		put(headers, "Content-Type", "text/xml");
		put(headers, "charset", "UTF-8");
		session = util.loginToZuora();
		
		put(inputDict, "session",session);
		put(inputDict,"endPoint",endPoint);
		if(session == "")
		{
			prorationError = "Login to Zuora Failed</br>";
		}
}
dateTime = getstrdate();
todayDate = split(dateTime," ");
dateArray = split(todayDate[0],"/");
dateForCompareStr = dateArray[2] + dateArray[0] + dateArray[1];
//endDateForTurbo = dateArray[2] + "-" + dateArray[0] + "-" + dateArray[1] + " 00:00:00";
dtTurbo = adddays(getdate(),1);
endDateForTurbo = datetostr(dtTurbo,"yyyy-MM-dd") + " 00:00:00.0";
/* Avoid calculations in this loop.  Only storing data to be used elsewhere.
** - Parts Database Refresh
** - Volume Pricing
** - Total Seek
*/
cancellationFlag = true;
assetWebServiceDataDict = Dict("dict<string>");
for line in transactionLine {
	partNumber = line._part_number;
	/* below is the logic written to achieve promotions logic -- start here */
	if(len(line._part_number)>0 AND (NOT false)){
			
		append(partNumArr,line._part_number);
		append(productTypeArr,line.productTypeLineGrid_line);
		append(contractTermArr,line.contractTerms_line);
		append(priceTierArr, string(line.priceTier_line));
		append(bundleIDArr, line.bundleID_line);
		append(docNumArr,line._document_number);
		lineMarketCode = line.marketCode_line;

		if(line.externalID_line <> "" AND line._part_custom_field13 == "true" AND actionName == "update" AND lower(line.lineType_line) == "renew"){
			payLoad = dict("string");
			put(payLoad,"ExternalID",line.externalID_line);
			put(payLoad,"Site_Name",siteName_quote);
			assetWebserviceData = util.getAssetWebService(payLoad);
			//Auto renewal promotions
			if(containsKey(assetWebserviceData,"market_code")){
				lineMarketCode = get(assetWebserviceData,"market_code");
			}
			put(assetWebServiceDataDict,line._document_number,assetWebserviceData);
		}
		append(marketCodeArr, lineMarketCode);
		lineItemsCount = lineItemsCount + 1;
		
		if(line.lineType_line <> "cancel" OR line.cancellationReason_line <> "nonPayment"){
			cancellationFlag = false;
		}
	}
	if(line.assetID_l <> "")
	{
		if(assetIdsStr <> ""){
			assetIdsStr = assetIdsStr + ",";
		}
		assetIdsStr = assetIdsStr + "'" + line.assetID_l + "'";
	}
	append(soldWithPartNumber, line._part_number);	
	append(soldWithProdType,line.productType_line);		
	/* above is the logic written to achieve promotions logic -- Ends here */
	/* below logic is used to get the document numbers of Non Inventory Items -- Starts here*/
	if(line._part_number <> ""){
		if(line._part_custom_field13=="false"){
			nonInventoryDocNumbers = nonInventoryDocNumbers + line._document_number + "@#@#"; 
		}	
	}
	result = result + "1~authorizationDate_quote~"+ authDate + "|";
	/* logic is used to get the document numbers of Non Inventory Items -- Ends here */

	put(partSoldDict, line._document_number, line._part_number + "~" + line.productType_line);	
	// TURBO get impression logic
	//if(partNumber == "TURBO" AND (quoteType_temp == "Retention" OR quoteType_temp == "Modify") AND line.lineType_line == "cancel" AND (actionName == "submit" OR actionName == "update"))
	if(partNumber == "TURBO" AND (((quoteType_temp == "Retention" OR quoteType_temp == "Modify") AND line.lineType_line == "cancel") OR (line.lineType_line == "credit" AND quoteType_temp == "Auto-Credit")) AND (actionName == "update"))// actionName == "submit" OR runs only on Save
	{
		campaignId = line.campaignId_line;
		temp = replace(getImpressionTemplate,"{{campaignId_line}}",campaignId);
		temp = replace(temp,"{{startDate}}",line.contractStartDate_l);
		temp = replace(temp,"{{endDate}}",endDateForTurbo);
		impressionWScallXML = impressionWScallXML + temp;
		
		//Cancel Campaign
		//statusDict = commerce.cancelCampaign(line.campaignId_line);
		//put(cancelCampaignDict, campaignId, get(statusDict,"StatusCode"));
	}
	
	if(line._part_custom_field9 == "Tigerleads"){
		tigerLeadProduct = true;
	}else{
		nonTigerLeadProduct = true;
	}	
	if(line._part_custom_field13=="true"){
		inventoryFlag=true;
	}	
	documentNumber = line._document_number;
	if(line._part_number <> ""){
		append(partNumberArray, line._part_number);
		append(pricingMethodArray , line._part_custom_field1);
		append(childDocArr , line._document_number);
		
		put(lineItemDict, line._document_number + "~_part_number", line._part_number);
		put(lineItemDict, line._document_number + "~_line_item_comment", line._line_item_comment);
		put(lineItemDict, line._document_number + "~_parent_doc_number", line._parent_doc_number);
		put(lineItemDict, line._document_number + "~_part_custom_field4", line._part_custom_field4);
		put(lineItemDict, line._document_number+"~_price_quantity", string(line._price_quantity));
		put(lineItemDict, line._document_number+"~marketZip", line.marketZip_line);
		
	}else{
		put(assetStructureDict,documentNumber,getconfigattrvalue(documentNumber, "assetStructure"));		
	}
	
	
	// summing up quantity per price tier for CfCB, will have to add condition so that it will only run for CfCB products
	
	//TIGER LEADS PRICING
	//Identify Parent Parts
	if( findinarray(tigerLeadParts, line._part_number) <> -1 ){
		hasTigerLeadProduct = true ;
		key = line._part_number+KEY_DELIMITER1+line._line_item_comment+KEY_DELIMITER2+line._parent_doc_number;tlparentDocs = string[];
		if( containsKey(tigerLeadParentInfo, key) ){
			tlparentDocs = split(get(tigerLeadParentInfo, key), ",");
		}
		append(tlparentDocs,line._document_number);
		put(tigerLeadParentInfo, key,join(tlparentDocs,","));
	}
	
	//Get Dependant Parts Info for Tiger Lead Parent Parts	
	if( line._part_custom_field4 <> "" AND findinarray(uniqDependantParts,line._part_number) == -1){
		parentParts = line._part_custom_field4;
		append(uniqDependantParts, line._part_number);
		parentPartArr = split(parentParts, ",");
		for eachParent in parentPartArr{
			dependentPartsArr = string[];
			if( containsKey(dependantPartsDict, eachParent) ){
				dependentPartsArr = get(dependantPartsDict, eachParent);				
			}
			append(dependentPartsArr, line._part_number);
			put(dependantPartsDict, eachParent, dependentPartsArr);
		}
	}
	//Invoke Zuora API for retention and modify type quotes only
	
	if(line.priceType_l == "Recurring"){
		recurringLinesTotal = recurringLinesTotal + 1;
	} 
	if(line.priceWithinPolicy_l == false){
		priceWithinPolicyFlag = false;		
	}
	if(lower(line.lineType_line)=="add"){
		//firstMonthlyAmount = firstMonthlyAmount + line.extendedNetPrice_line + line.estTax_line;
		if(partNumber <> "HOMESRCH" AND partNumber <> "HSMARKETSPND" AND partNumber <> "HANDRAISER")
		{
			firstMonthlyAmount = firstMonthlyAmount + line.extendedNetPrice_line + line.estTax_line;
		}
	}
	elif(lower(line.lineType_line)=="renew" OR lower(line.lineType_line) == "amend"){//1$ authorization is required for amend and renew
		renewalFlag = true;
	}
	if(partNumber <> "" AND (line.extendDays_line == 0 OR line.extensionType_line == "paid"))// LEAP-8747
	{
		allLinesUnpaidExtension = false;
	}
	// in flight asset logic
	if(line.assetID_l <> "")
	{
		if(findinarray(uniqueLineActions,line.lineType_line) == -1)
		{
			append(uniqueLineActions,line.lineType_line);
		}
		prodName = partNumber;
		if(line._part_custom_field13 == "true")
		{
			prodName = partNumber + " for Market "+ line.marketZip_line;
		}
		put(lineDataForInflight,line.assetID_l,line._group_sequence_number + "#" + line.lineType_line + "#" + line._document_number + "#" + prodName + "#" + line.assetLastModifiedDate_line);
	}
	
	//Bridging promotion
	if(partNumber == "FIVESTREET" AND line.license_line > fiveStreetlicenseQty ){
		tempFiveStreetTerm = 0;
		if(line.overrideTerm_line <> 0){
			tempFiveStreetTerm = line.overrideTerm_line;
		}elif(isNumber(line.contractTerms_line)){
			tempFiveStreetTerm = atoi(line.contractTerms_line);
		}
		if(tempFiveStreetTerm == 12){
			fiveStreetlicenseQty = line.license_line;
			fiveStreetTerm = tempFiveStreetTerm;
		}
	}
	//CRM-846
	if((lower(line.lineType_line)=="add" OR lower(line.lineType_line)=="renew") AND partNumber == "ADVANTAGE" AND specialAdvantagePricing_quote == true AND isEligibleForSpecialApproval == false){
		isEligibleForSpecialApproval = true;
	}
	//CRM-1567
	if(line.accountCategory_line == "BDX" AND isBDXQuote == false){
		isBDXQuote = true;
	}
}

//TURBO logic
if(impressionWScallXML <> "")
{
	payLoadTurbo = dict("string");
	put(payLoadTurbo,"lineItemsData",impressionWScallXML);
	//print payLoadTurbo;
	
	turboImpressionCamDict = commerce.getImpressions(payLoadTurbo);
	//print turboImpressionCamDict;
	if(containsKey(turboImpressionCamDict,"CampaignID"))
	{
		turboImpressionArray = get(turboImpressionCamDict,"Impressions");
		turboImpressionCampaignIdArray = get(turboImpressionCamDict,"CampaignID");
	}
	elif(containsKey(turboImpressionCamDict,"ERROR"))
	{
		errorArr = get(turboImpressionCamDict,"ERROR");
		callToBIFailedErrorMsg = errorArr[0];
	}
}

if(inflightAssetsString_quote <> "" AND (_system_current_step_var=="start_step" OR _system_current_step_var=="pending_process"))
{
	inflightResult = bmql("select lineAction,amend,renew,credit,buyout,backout,cancel from InflightError where lineAction in $uniqueLineActions");
	for res in inflightResult{
		lineAct = get(res,"lineAction");
		put(inflightErrorDict,lineAct + "#" + "amend",get(res,"amend"));
		put(inflightErrorDict,lineAct + "#" + "renew",get(res,"renew"));
		put(inflightErrorDict,lineAct + "#" + "credit",get(res,"credit"));
		put(inflightErrorDict,lineAct + "#" + "buyout",get(res,"buyout"));
		put(inflightErrorDict,lineAct + "#" + "backout",get(res,"backout"));
		put(inflightErrorDict,lineAct + "#" + "cancel",get(res,"cancel"));
	}
	creditInflightErrorsDict = Dict("string");
	put(creditInflightErrorsDict,"PendingRenewalQuote","Line item # $LINEITEM$ is currently pending renewal in $QUOTENUMBER$ quote. The pending renewal must be processed or cancelled to proceed.");
	put(creditInflightErrorsDict,"PendingApproval","Line item # $LINEITEM$ is currently submitted for approval in $QUOTENUMBER$ quote. The approval must be processed or cancelled to proceed.");
	put(creditInflightErrorsDict,"OrderedbutPendingFulfillment","Line item # $LINEITEM$ is currently pending fulfillment in $QUOTENUMBER$ order. The order must be completed or cancelled to proceed.");
	put(creditInflightErrorsDict,"NoninventoryAssetModificationInflight","Line item # $LINEITEM$ is currently being modified in $QUOTENUMBER$ quote. Once the modification is processed, this line item must be deleted and re-added to the quote");
	put(creditInflightErrorsDict,"InventoryAssetModificationInflight","Line item # $LINEITEM$ is currently being modified in $QUOTENUMBER$ quote. Once the modification is processed, this line item must be deleted and re-added to the quote");
	inflightAssetsArr = split(inflightAssetsString_quote,"!^!");
	for eachAsset in inflightAssetsArr{
		if(eachAsset <> ""){
			dataArr = split(eachAsset,"$#$");
			if(containsKey(lineDataForInflight,dataArr[0])){
				lineDataOnQLI = get(lineDataForInflight,dataArr[0]);
				lineDataOnQLIArr = split(lineDataOnQLI,"#");
				seqNo = lineDataOnQLIArr[0];
				lineTypeQLI = lineDataOnQLIArr[1];
				assetDataArr = split(dataArr[1],"*");
				creditInflightError = "";
				if(lineTypeQLI == "credit" AND sizeofarray(assetDataArr) > 2 AND containsKey(creditInflightErrorsDict,assetDataArr[2])){
					creditInflightError = get(creditInflightErrorsDict,assetDataArr[2]);
					creditInflightError = replace(creditInflightError,"$LINEITEM$",seqNo);
				}
				docNo = lineDataOnQLIArr[2];
				prodName = lineDataOnQLIArr[3];
				assetLastModifiedDate = lineDataOnQLIArr[4];
				if(assetLastModifiedDate <> "" AND assetLastModifiedDate <> dataArr[2]){
					if(inFlightAssetErrorMessage <> ""){
						inFlightAssetErrorMessage = inFlightAssetErrorMessage + "</br>";
					}else{
						inFlightAssetErrorMessage = "Below assets are InFlight on/Modified by other quotes</br>";
					}
					if(creditInflightError <> ""){
						inFlightAssetErrorMessage = inFlightAssetErrorMessage + replace(creditInflightError,"$QUOTENUMBER$","another");
					}else{
						inFlightAssetErrorMessage = inFlightAssetErrorMessage + "Line # " + seqNo + " " + prodName;
					}
					result = result + docNo + "~inFlightErrorFlag_line~true|";
				}elif(dataArr[1] <> ""){
					lineTypeAsset = lower(assetDataArr[1]);
					//if((_system_supplier_company_name == "devmoveinc" OR _system_supplier_company_name == "qamoveinc") AND (quoteType_temp <> "Auto-Credit" OR lineTypeAsset <> "renew")){//To skip Inflight validation as there is a dead lock situation.
					if(quoteType_temp <> "Auto-Credit" OR lineTypeAsset <> "renew"){//To skip Inflight validation as there is a dead lock situation.
					//Order for "Renewal" quote will not be fulfilled until "Auto-Credit" quote is ordered/processed completely. But "Auto-Credit" quote was throwing this valiation as "Inflight Quote" string on asset for Renewal quote is not cleared becuase order is not fulfilled.
					//OTC-175
						key = lineTypeQLI + "#" + lineTypeAsset;
						if(containsKey(inflightErrorDict,key) AND get(inflightErrorDict,key) == "YES"){
							if(inFlightAssetErrorMessage <> ""){
								inFlightAssetErrorMessage = inFlightAssetErrorMessage + "</br>";
							}else{
								inFlightAssetErrorMessage = "Below assets are InFlight on/Modified by other quotes</br>";
							}
							if(creditInflightError <> ""){
								inFlightAssetErrorMessage = inFlightAssetErrorMessage + replace(creditInflightError,"$QUOTENUMBER$",assetDataArr[0]);
							}else{
								inFlightAssetErrorMessage = inFlightAssetErrorMessage + "Line # " + seqNo + " " + assetDataArr[0] + " " + lineTypeAsset + " " + prodName;
							}
							result = result + docNo + "~inFlightErrorFlag_line~true|";
						}
					}
				}
			}
		}
	}
}
/*Start -  Query to fetch the active promotions */

currentDateStr = datetostr(getdate(),"yyyyMMdd");
currentDate = atoi(currentDateStr);

promoresults = recordset();
promoresults = bmql("select PartNumber,PromoCode,PromoDescription,DiscountPercent,ProductType,ContractTerm,PriceTier,MarketCode,Grandfathered,BundleID,UserGroup,SoldWithPart,SoldWithType,MarketCode,DateFrom,DateTo,lineAction from LinePromotions where PartNumber in $partNumArr and ProductType in $productTypeArr and ContractTerm in $contractTermArr and PriceTier in $priceTierArr and MarketCode in $marketCodeArr and BundleID in $bundleIDArr and DateFrom <= $currentDate and DateTo >= $currentDate");

/* End - Query to fetch the active promotion */
//print("promoresults");
//print(promoresults);

recurringPricingFlag = false;
if( recurringLinesTotal > 0 ){
	recurringPricingFlag = true;
}
if(renewalFlag AND firstMonthlyAmount == 0 AND allLinesUnpaidExtension == false){
	firstMonthlyAmount = 1;
}


result = result + "1~nonInventoryDocNumbers_Quote~" + nonInventoryDocNumbers + "|";
result = result + "1~hasRecurringPricing_t~" + string(recurringPricingFlag) + "|";
result = result + "1~priceWithinPolicy_t~" + string(priceWithinPolicyFlag) + "|";
result = result + "1~firstMonthlyPayment_quote~" + string(firstMonthlyAmount) + "|"
				+ "1~assetIdsForInflightCheck_quote~" + assetIdsStr + "|";

tlParentKeys = keys(tigerLeadParentInfo);
for eachParentTLKey in tlParentKeys{
	//Get Parent Part #
	keyArr = split(eachParentTLKey, KEY_DELIMITER1);
	allTLParentDocs = get(tigerLeadParentInfo,eachParentTLKey);
	tlDependentPartsDict = get(dependantPartsDict,keyArr[0]);
	if( NOT(ISNULL(tlDependentPartsDict)) ){
		for eachDependentKey in tlDependentPartsDict{
			newKey = eachDependentKey + KEY_DELIMITER1 + keyArr[1];
			put(tigerLeadParentInfo, newKey, allTLParentDocs);
		}
	}
}

tlRetStr = "";
dependantPartArrDict = dict("string");
dictFlag = false;
//Tiger Lead Child Parts Pricing
for eachDoc in childDocArr{
	marketZip = get(lineItemDict, eachDoc + "~marketZip");
	parentPart = get(lineItemDict, eachDoc + "~_part_custom_field4");
	tigerLeadKey = get(lineItemDict, eachDoc + "~_part_number")+KEY_DELIMITER1+get(lineItemDict, eachDoc + "~_line_item_comment")+KEY_DELIMITER2+get(lineItemDict, eachDoc + "~_parent_doc_number");
	partNum = get(lineItemDict, eachDoc + "~_part_number");
	if( parentPart <> "" AND containsKey(tigerLeadParentInfo, tigerLeadKey)){
		//Child Part		
		tlparentDocsArr = split(get(tigerLeadParentInfo, tigerLeadKey), ",");
		//Assign Parent/Child Relationship (First come first serve basis)
		if( sizeofarray(tlparentDocsArr) > 0 and tlparentDocsArr[0] <> "" ){
			mappedParentDocNum = tlparentDocsArr[0];
			tlRetStr = tlRetStr + eachDoc + "~parentChildMapping_line~" + mappedParentDocNum + "|";
			put(lineItemDict,eachDoc+"~parentChildMapping_line", mappedParentDocNum);
			remove(tlparentDocsArr,0);
			put(tigerLeadParentInfo, tigerLeadKey, join(tlparentDocsArr,","));
			
			if(partNum == "HSMARKETSPND")
			{
				put(dependantPartArrDict,mappedParentDocNum+"$$"+partNum+"$$"+marketZip,mappedParentDocNum+"$$"+parentPart+"$$"+marketZip);
				dictFlag = true;
			}
			put(lineItemDict,eachDoc +"childDoc",mappedParentDocNum);
		}
	}
	/* if(parentPart <> "" AND partNum == "HSMARKETSPND" )
		{
			put(dependantPartArrDict,mappedParentDocNum+"$$"+partNum+"$$"+marketZip,mappedParentDocNum+"$$"+parentPart+"$$"+marketZip);
			dictFlag = true;
		}
		put(lineItemDict,eachDoc +"childDoc",mappedParentDocNum);
	 */
	}

put(billingPeriodDivisorDict,"Monthly",1.0);
put(billingPeriodDivisorDict,"Quarterly",3.0);
put(billingPeriodDivisorDict,"Bi-Annual",6.0);
put(billingPeriodDivisorDict,"Annual",12.0);
dependantPartFlag = false;
for line in transactionLine {
	documentNumber = line._document_number;
	partNumber = line._part_number;
	parentDocNum = line._parent_doc_number;
	lineRes = "";
	//priceEffDate = "";
	priceEffDate = "";
	assetPriceEffDate = "";
	assetPriceEffDateFormat = string[];
	assetArray = string[];
	overrideDelta = 0.0;
	isSpecialAdvantage = false;
	isGrandFatherPriceEligible = false;
	previouseLineType = "";//CRM-1090
    amendPromoSelected = false;//CRM-1090
	
	marketKey = "";
	if(line.assetDetails_line <> "")
	{
		assetArray 	= split(line.assetDetails_line, FIELD_DELIM);
		previouseLineType = getoldvalue("lineType_line",atoi(documentNumber)); //CRM-1090
		marketKey = assetArray[MARKET_KEY_INDEX];
	}
	//print dependantPart;
	if(line._part_number == "HSMARKETSPND"){
		dependantPart = get(lineItemDict,line._document_number+"childDoc")+"$$"+line._part_number+"$$"+line.marketZip_line;
		if((NOT(containskey(dependantPartArrDict,dependantPart)) OR NOT(dictFlag)) AND NOT(dependantPartFlag)){
			dependantPartFlag = true;
		}
	}elif(line._part_number == "HOMESRCH" AND NOT(containskey(dependantPartArrDict,line._document_number+"$$HSMARKETSPND$$"+line.marketZip_line)) AND NOT(dependantPartFlag)){
			dependantPartFlag = true;
	}
	
	//CRM-846
	if((lower(line.lineType_line)=="add" OR lower(line.lineType_line)=="renew") AND line._part_number == "ADVANTAGE" AND specialAdvantagePricing_quote == true){
		isSpecialAdvantage = true;
	}
	
	if(hideMarketBudgetFee == true AND find(line._part_desc,"TigerLead") <> -1)
	{
		hideMarketBudgetFee = false;
	}
	if(line.invPool_line == "preauth")
	{
		invPoolPreAuthFlag = true;
	}
	else
	{
		invPoolNonPreAuthFlag = true;
	}
	if(inFlightAssetErrorMessage == "" AND line.inFlightErrorFlag_line AND (_system_current_step_var=="start_step" OR _system_current_step_var=="pending_process"))
	{
		inFlightErrorFlag = true;
		if(inFlightAssetClearErrorMessage <> "")
		{
			inFlightAssetClearErrorMessage = inFlightAssetClearErrorMessage + "</br>";
		}
		inFlightAssetClearErrorMessage = inFlightAssetClearErrorMessage + "Line # " + line._group_sequence_number;
	}
	productType = line.productType_line;
	if (partNumber <> "" )
	{
		tempQtyTier = 0;
		ProductType = line.productType_line;
		lineType = lower(line.lineType_line);
		//productType = line.productType_line;
		leadType = line.leadType_line;
		billingPeriod = line.billingPeriod_line;
		undersoldAsset = line.undersoldAsset_line;
		underPerformingMarket = false;
		staleMarket = false;
		PriceTier = line.priceTier_line;
		accountCategory = line.accountCategory_line;
		promoCodeForRenewal = "";
		promoPercentageForRenewal = 0;
		promoStartDateForRenewal = 0;
		needManualRenew = line.needManualRenew_line;
		lineMarketCode = line.marketCode_line;
		checkInventory = line.checkInventory_l;
		todayDateTimeStr = getstrdate();
		todayDateStr = split(todayDateTimeStr," ");
		lineAddedDateStr = substring(line.createdDate_l, 0, find(line.createdDate_l, " "));	
		// CRM:1090 : Start
        oldLineType = line.oldLineType_line; 

		if((isNull(oldLineType) OR oldLineType == "") AND line.assetDetails_line <> "" AND previouseLineType <> "" AND previouseLineType <> "add"){
            oldLineType = lineType;
		} // CRM:1090 : End




		if(quoteType_quote == "Auto-Renew" AND lineType == "renew" AND getdiffindays(strtodate(lineAddedDateStr, "yyyy-MM-dd"),strtodate(todayDateStr[0], "MM/dd/yyyy")) > 0){
			checkInventory = true;
		}
		if(line.externalID_line <> "" AND line._part_custom_field13 == "true" AND actionName == "update"){
			price_tier = "";
			forecasted_leads = "";
			total_units_unavailable = 0.0;
            total_units = 0.0;
            if(lineType == "renew" AND containsKey(assetWebServiceDataDict,documentNumber))// get price tier from webservice call.
            {
                assetWebserviceData = get(assetWebServiceDataDict,documentNumber);
                //Auto renewal promotions
                if(containsKey(assetWebserviceData,"market_code")){
                    lineMarketCode = get(assetWebserviceData,"market_code");
                }
				if(containsKey(assetWebserviceData,"total_units_unavailable") AND isNumber(get(assetWebserviceData,"total_units_unavailable"))){
					total_units_unavailable = atof(get(assetWebserviceData,"total_units_unavailable"));
				}
				if(containsKey(assetWebserviceData,"total_units") AND isNumber(get(assetWebserviceData,"total_units"))){
					total_units = atof(get(assetWebserviceData,"total_units"));
				}
				marketSold = 0.0;
				if(total_units <> 0){
					marketSold = (total_units_unavailable/total_units)*100;
				}
				if(marketKey == "" AND containsKey(assetWebserviceData,"market_key")){
					marketKey = get(assetWebserviceData,"market_key");
				}
				/*
				if(marketKey <> "" AND undersoldAsset == false AND checkInventory == false){
					tempMarketKey = replace(substring(marketKey,0,len(marketKey)-6),"@@","%7C");
					waitlistInputDict = Dict("string");
					put(waitlistInputDict,"Market_Key",tempMarketKey);
					put(waitlistInputDict,"Waitlist_Type","Pre-Auth");
					preAuthCheck = true;
					waitListCheck = true;
					if(containsKey(thresholdDict,partNumber+"PREAUTHWAITLISTDEPTH")){
						preAuthWaitlistCount = commerce.getInventoryWaitlistCount(waitlistInputDict);
						preAuthWaitlistDepth = get(thresholdDict,partNumber+"PREAUTHWAITLISTDEPTH");
						if(isNumber(preAuthWaitlistCount) AND atof(preAuthWaitlistCount) == preAuthWaitlistDepth){
							undersoldAsset = true;
						}else{
							undersoldAsset = false;
							preAuthCheck = false;
							if(NOT isNumber(preAuthWaitlistCount)){
								if(prorationError <> "")
								{
									prorationError = prorationError + "</br>";
								}
								prorationError = prorationError + "Line # " + line._group_sequence_number + " " + partNumber + " for Market " + line.marketZip_line + " - " + preAuthWaitlistCount;
							}
						}
					}
					if(preAuthCheck == true AND containsKey(thresholdDict,partNumber+"WAITLISTDEPTH")){
						put(waitlistInputDict,"Waitlist_Type","");
						totalWaitlistCount = commerce.getInventoryWaitlistCount(waitlistInputDict);
						waitlistDepth = get(thresholdDict,partNumber+"WAITLISTDEPTH");
						if(isNumber(totalWaitlistCount) AND atof(totalWaitlistCount) < waitlistDepth){
							undersoldAsset = true;
						}else{
							undersoldAsset = false;
							waitListCheck = false;
							if(NOT isNumber(totalWaitlistCount)){
								if(prorationError <> "")
								{
									prorationError = prorationError + "</br>";
								}
								prorationError = prorationError + "Line # " + line._group_sequence_number + " " + partNumber + " for Market " + line.marketZip_line + " - " + totalWaitlistCount;
							}
						}
					}
					if(waitListCheck == true AND preAuthCheck == true AND containsKey(thresholdDict,partNumber+"SOLD")){
						thresholdSold = get(thresholdDict,partNumber+"SOLD");
						if((total_units_unavailable > 0 AND total_units == 0) OR marketSold > thresholdSold){
							undersoldAsset = false;
						}else{
							undersoldAsset = true;
						}
					}
				}*/
                if(checkInventory == false){
                    checkInventory = true;
					if(quoteType_temp == "Auto-Renew" AND containsKey(thresholdDict,partNumber) AND ((marketSold > get(thresholdDict,partNumber)) OR (total_units == 0 AND total_units_unavailable > 0))){
						needManualRenew = true;
					}
                    if(containsKey(assetWebserviceData,"price_tier"))
                    {
                        price_tier = get(assetWebserviceData,"price_tier");
                    }
                    if(containsKey(assetWebserviceData,"forecasted_leads")){// Kamal for CfS Broker
                        forecasted_leads = get(assetWebserviceData,"forecasted_leads");
                        if(isNumber(forecasted_leads))
                        {
                            forecastedLeads = integer(atof(forecasted_leads));
                            lineRes = lineRes + documentNumber + "~forecastedLeads_line~" + string(forecastedLeads) + "|";
                        }
                    }
                }else{
					price_tier = string(line.priceTier_line);
				}
			}
			else
			{
				checkInventory = false;
				//assetArray 	= split(line.assetDetails_line, FIELD_DELIM);
				if(sizeofarray(assetArray) >= PRICE_TIER_INDEX - 1)
				{
					price_tier = assetArray[PRICE_TIER_INDEX];
				}
				//kamal: Do we need this else condition for forecastedleads as the line item attribute is updated in above if condition itself?
			}
			if(isNumber(price_tier))
			{
				PriceTier = integer(atof(price_tier));
				lineRes = lineRes + documentNumber + "~priceTier_line~" + string(PriceTier) + "|";
			}
		}
		ContractTerm = line.overrideTerm_line;
		actualContractTerm = 0;
		if(isNumber(line.contractTerms_line))
        {
			actualContractTerm = atoi(line.contractTerms_line);
			if(ContractTerm == 0)
			{
				ContractTerm = actualContractTerm;
			}
        }
		listPrice = 0;
		grandFatherDiscount = 0.0;					
		netPriceEa = 0;
		netPriceEach = 0;
		extendedNetPriceEach = 0;
		totalPayment = 0;
		qty = line._price_quantity;
		results = recordset();
		listPriceColumnName = "ListPrice";
		HLCvalue = line.hLC_line;
		lineDiscount = line.override_line;
		lineDiscountHidden = line.overrideHidden_line;
		discountTypeperdoll = line.discountType_line;
		startDate = line.contractStartDate_l;
		endDate = line.contractEndDate_l;
		if(line.hlcOverride_line > 0)
		{
			HLCvalue = line.hlcOverride_line;
		}
		LicenseValue = line.license_line;
		MarketBuilderFlag = false;// true if marketbuilder product
		NarMembership = line.narMembership_line;
		// reset imported values for assets from SFDC
		if(line.assetDetails_line <> "")
		{
			if(lineType == "renew" AND lineType <> oldLineType) // CRM:1090
			{
				//Ravi CRM-1812
				if (fieldsalesuserflag == "N")
				{
					if (line.commerceGroup_line == "Broker Marketing Solution")
					{
						lineRes = lineRes + documentNumber + "~commerceGroup_line~" + "|";
					}
				}
				//End Ravi
				if(line._part_custom_field22 <> "")
				{
					eligibleContractTerm = atoi(line._part_custom_field22);
					lineRes = lineRes + documentNumber + "~contractTerms_line~" + string(eligibleContractTerm) + "|";
					actualContractTerm = eligibleContractTerm;
					if(line.overrideTerm_line == 0){
                        ContractTerm = actualContractTerm;
                    }
				}
				
				// CRM:1090
			   //billingPeriod = "Monthly";
			   billingPeriod=assetArray[BILLING_PERIOD_INDEX];
			   if (quoteType_temp <> "Auto-Renew")
			   {
				   if(billingPeriod <> "Monthly"){
					   if(contractTerm == 12){
							billingPeriod = "Annual";
					   }elif(contractTerm == 6){
							billingPeriod = "Bi-Annual";
					   }elif(contractTerm == 3){
							billingPeriod = "Quarterly";
					   }else{
							billingPeriod = "Monthly";
					   }
				   }
			   }
			  lineRes = lineRes + documentNumber + "~billingPeriod_line~" + billingPeriod + "|";
			  // clear override term for non inventory renewals			  
			  if(line._part_custom_field13=="false"){
			  lineRes = lineRes + documentNumber + "~overrideTerm_line~0|";
			  }
			}
			elif(lineType <> "renew" AND oldLineType == "renew") //CRM:1090
			{				
				if(oldLineType == "renew")// if line action is changed from renew to amend etc then reset values from asset so user can change discount or any other value after changing line action to amend
				{
					//Added by Ravi CRM-1812
					if (fieldsalesuserflag == "N")
					{
							lineRes = lineRes + documentNumber + "~commerceGroup_line~" + assetArray[COMMERCE_GROUP_INDEX] + "|";
					}
					if(assetArray[MANUAL_DISCOUNT_AMOUNT_INDEX] <> "" AND isNumber(assetArray[MANUAL_DISCOUNT_AMOUNT_INDEX])) // CRM:1090
					{
						
						assetDicscount = atof(assetArray[MANUAL_DISCOUNT_AMOUNT_INDEX]); // CRM:1090
						//if(assetDicscount < 0){
						//	assetDicscount=assetDicscount*-1;
						//}
						assetDiscountType = assetArray[MANUAL_DISCOUNT_TYPE_INDEX];
						lineDiscount = assetDicscount;
						lineRes = lineRes + documentNumber + "~override_line~" + string(assetDicscount) + "|";
						if(assetDiscountType == "Amt" OR assetDiscountType =="$"){
							lineRes = lineRes + documentNumber + "~discountType_line~Amt|";
						}else{
							lineRes = lineRes + documentNumber + "~discountType_line~%|";
						}
						amendPromoSelected = true;

					}
					if(isNumber(assetArray[CONTRACT_TERM_INDEX])){
						assetContractTerm = integer(atof(assetArray[CONTRACT_TERM_INDEX]));
						lineRes = lineRes + documentNumber + "~contractTerms_line~" + string(assetContractTerm) + "|";
						actualContractTerm = assetContractTerm;
						/*Ticket# 1090: Added below line*/
						ContractTerm = actualContractTerm;
						//if(line.overrideTerm_line == 0){
						//	ContractTerm = assetContractTerm;
						//}
					}
				}
			}
			if(lineType == "buyout" OR lineType == "cancel" OR (lineType <> "renew" AND oldLineType == "renew")){//CRM-1090
				//assetArray 	= split(line.assetDetails_line, FIELD_DELIM);
				listPriceOverride = 0;
				//lineDiscount = 0;
				leadType=assetArray[LEAD_TYPE_INDEX];
				if(leadType == "Flex Follow-up")
				{
					leadType = "Flex";
				}
				elif(leadType == "Fast Follow-up")
				{
					leadType = "Fast";
				}
				if(isNumber(assetArray[QTY_INDEX])){
					qty= integer(atof(assetArray[QTY_INDEX]));
				}
				billingPeriod=assetArray[BILLING_PERIOD_INDEX];
				if(isNumber(assetArray[HLCOVERRIDE_INDEX])){
					HLCvalue = integer(atof(assetArray[HLCOVERRIDE_INDEX]));
				}
				else
				{
					HLCvalue = 0;
				}
				if(HLCvalue == 0 AND isNumber(assetArray[HLC_INDEX]))
				{
					HLCvalue = integer(atof(assetArray[HLC_INDEX]));
				}
				if(isNumber(assetArray[LSIT_PRICE_OVERRIDE_INDEX])){
					listPriceOverride = atof(assetArray[LSIT_PRICE_OVERRIDE_INDEX]);
				}
		lineRes = lineRes + documentNumber + "~leadType_line~" + leadType + "|"
						  + documentNumber + "~_price_quantity~" + string(qty) + "|"
						  + documentNumber + "~billingPeriod_line~" + billingPeriod + "|"
						  + documentNumber + "~listPriceOverride_line~" + string(listPriceOverride) + "|"
						  + documentNumber + "~hlcOverride_line~" + string(HLCvalue) + "|";
						 // + documentNumber + "~override_line~" + string(lineDiscount) + "|";
				overrideContractTerm = 0;
				if(isNumber(assetArray[OVERRIDER_CONTRACT_TERM_INDEX])){
				overrideContractTerm=integer(atof(assetArray[OVERRIDER_CONTRACT_TERM_INDEX]));
				}
				if(overrideContractTerm > 0)
				{
					ContractTerm = overrideContractTerm;
					lineRes = lineRes + documentNumber + "~overrideTerm_line~" + string(ContractTerm) + "|";
				}
		}
		}
		if(restrictedProducts == false AND (accountType_quote == "Realtor Agent" OR accountType_quote == "Agent Team") AND quoteType_temp <> "Backout" AND (lineType == "add" OR lineType == "renew") AND NOT(cancellationFlag))
		{
			if(find(partNumberString_quote,partNumber + "#") <> -1)
			{
				restrictedProducts = true;
			}
		}
		
		dateType = "";
		EffDate = datetostr(getdate(), "yyyyMMdd");
		
		if(lineType == "add" OR lineType == "renew"){
			lineTypeAddOrRenewExist = true;
			/*if(undersoldAsset)
			{
				if(isnull(assetArray[ASSET_PRICE_EFFECTIVE_DATE_INDEX]) ==  false)
				{
					assetPriceEffDateFormat = split(assetArray[ASSET_PRICE_EFFECTIVE_DATE_INDEX],"T");
					assetPriceEffDateFormat = split(assetPriceEffDateFormat[0]," ");
					priceEffDate = assetPriceEffDateFormat[0];
				}
			}
			else
			{
				priceEffDate = substring(line.createdDate_l, 0, find(line.createdDate_l, " "));			
			}*/
			priceEffDate = substring(line.createdDate_l, 0, find(line.createdDate_l, " "));															  
		}
		elif(line.leadType_line == "Fast" AND find(line.assetDetails_line,"#Flex") > -1){
			priceEffDate = substring(line.createdDate_l, 0, find(line.createdDate_l, " "));			
		}
		else{
			//assetArray 	= split(line.assetDetails_line, FIELD_DELIM);
			if(isnull(assetArray[ASSET_PRICE_EFFECTIVE_DATE_INDEX]) ==  false){
				assetPriceEffDateFormat = split(assetArray[ASSET_PRICE_EFFECTIVE_DATE_INDEX],"T");
				assetPriceEffDateFormat = split(assetPriceEffDateFormat[0]," ");
				priceEffDate = assetPriceEffDateFormat[0];
			}			
		}

		if(lower(line.invPool_line) == "preauth" AND line.priceEffectiveDate_line <> ""){
			priceEffDate = line.priceEffectiveDate_line;
		}
		if(priceEffDate <> "")
		{
			EffDate = replace(priceEffDate,"-","");
		}
		if(len(dateType)>0){
			if(dateType=="Import" AND line.importDate_line <> ""){
				/*Imported Asset - Use Import Date*/
				EffDate = datetostr(strtojavadate(line.importDate_line, "yyyy-MM-dd"),"yyyyMMdd");
			}	
			elif(line.contractStartDate_l <> ""){
				/*Use Contract Start Date*/
				EffDate = datetostr(strtojavadate(line.contractStartDate_l, "yyyy-MM-dd"),"yyyyMMdd");
			}
			else{
				EffDate = datetostr(getdate(), "yyyyMMdd");
			}
		}
		PricingDimensionDict = dict("string");
		put(PricingDimensionDict,"PartNumber",partNumber);
		put(PricingDimensionDict,"quantity",string(qty));
		put(PricingDimensionDict,"BillingPeriod",BillingPeriod);
		termForPrice = actualContractTerm;
		/*if(line.contractTerms_line <> "" AND isNumber(line.contractTerms_line))// term can be changed on changing line action CRM-917 so commented this code
        {
            termForPrice = atoi(line.contractTerms_line);
        }*/
		put(PricingDimensionDict,"ContractTerm",string(termForPrice));
		put(PricingDimensionDict,"PriceTier",string(PriceTier));
		put(PricingDimensionDict,"ProductType",ProductType);
		put(PricingDimensionDict,"HLCvalue",string(HLCvalue));
		put(PricingDimensionDict,"LicenseValue",string(LicenseValue));
		put(PricingDimensionDict,"NarMembership",NarMembership);
		put(PricingDimensionDict,"LeadType",leadType);
		put(PricingDimensionDict,"market_name",line.marketZip_line);
	
		//if(partNumber == "SELLERLEADBUNDLE"){
		if(line._part_custom_field8 == "Usage"){
			put(PricingDimensionDict,"costPerAction",string(line.costPerAction_line));
			forecastedeadsCount = line.forecastedLeads_line;
			
			put(PricingDimensionDict,"featuredLeadsCount",string(forecastedeadsCount));
			
		}
		
		listPrice = util.getListPrice(PricingDimensionDict,line._part_custom_field1,EffDate);//dateForCompareStr

		
		if( line._part_number == "HSMARKETSPND" ){
			//Get Parent Part's Quantity
			parentDocNum = get(lineItemDict, line._document_number+"~parentChildMapping_line");
			parentQty = 1;
			if( containsKey(lineItemDict,parentDocNum+"~_price_quantity")){
				parentQty = atoi(get(lineItemDict,parentDocNum+"~_price_quantity"));
			}			
			listPrice = line.costPerAction_line * line.leadQty_line * parentQty;
		}
		// ListPrice Calculation for ADVANTAGE
		originalListPriceForDelta = 0.0;
		
		if(line._part_number == "ADVANTAGE" AND line.pricingStringForAdvantage_line <> ""){
			selectedPartArr = split(line.pricingStringForAdvantage_line,"$$");
			// Added To check is Showcase To advantage : CRM 1526
			isAdvantageCapped=(sizeofarray(selectedPartArr)==6);
			// END CRM 1526
			if(sizeofarray(selectedPartArr) > 2 ){
				/*if(line.billingPeriod_line=="Monthly" AND isnumber(selectedPartArr[1])){
					listPrice = atof(selectedPartArr[1]);
				}elif(line.billingPeriod_line=="Quarterly" AND isnumber(selectedPartArr[2])){
					listPrice = atof(selectedPartArr[2]) * 3;
				}elif(line.billingPeriod_line=="Bi-Annual" AND isnumber(selectedPartArr[2])){
					listPrice = atof(selectedPartArr[2]) * 6;
				}elif(line.billingPeriod_line=="Annual" AND isnumber(selectedPartArr[2])){
					listPrice = atof(selectedPartArr[2]) * 12;
				}*/
				if(line.billingPeriod_line=="Monthly" AND isnumber(selectedPartArr[1]))
				{
					listPrice = atof(selectedPartArr[1]);
					if(isNull(selectedPartArr[3]) == false)
					{
						originalListPriceForDelta = atof(selectedPartArr[3]);
					}
				}
				elif(containsKey(billingPeriodDivisorDict,line.billingPeriod_line))
				{
					listPrice = atof(selectedPartArr[2]) * get(billingPeriodDivisorDict,line.billingPeriod_line);
					if(isNull(selectedPartArr[3]) == false)
					{
						originalListPriceForDelta = atof(selectedPartArr[4]) * get(billingPeriodDivisorDict,line.billingPeriod_line);
					}
				}
			}
		}
		
		if(partNumber == "SHOWCASE")
		{
			showCaseProductExist = true;
			if(lineType == "add" OR lineType == "renew")
			{
				put(PricingDimensionDict,"HLCvalue",string(line.hLC_line));
				originalListPriceForDelta = util.getListPrice(PricingDimensionDict,line._part_custom_field1,EffDate);//dateForCompareStr
			}
		}
		if(lower(partNumber) == "turbo")
		{
			turboProductExist = true;
		}
		// discount calculations
		discountAmount = 0;
		if(line.listPriceOverride_line > 0)
		{
			discountAmount = listPrice - line.listPriceOverride_line;
		}
		elif(line.discountType_line == "%")
		{
			discountAmount = listPrice * line.override_line/100.0;
		}
		elif(line.discountType_line == "Amt")
		{
			discountAmount = line.override_line;
		}
		netPriceEa = listPrice - discountAmount; 

		discountAmountEach = 0;
		if(line.discountType_line == "%"){
			discountAmountEach = line.quoteDiscountAmount_line + (listPrice*(lineDiscount/100));
		}
		elif(line.discountType_line == "Amt"){
			discountAmountEach = lineDiscount + line.quoteDiscountAmount_line;
		}
		if(line.listPriceOverride_line > 0){
		
			netPriceEach = line.listPriceOverride_line - discountAmountEach;
		}else{
			netPriceEach = listPrice - discountAmountEach;
		}
		extendedNetPriceEach = netPriceEach * qty;
		amendDeltaStr = "0";
		assetOverrideTermFlag = false;
		//Invoke Zuora API for retention and modify type quotes only
		//if( (_system_current_step_var=="start_step" OR _system_current_step_var=="pending_process") AND (quoteType_temp == "Retention" OR quoteType_temp == "Backout" OR quoteType_temp == "Modify" OR quoteType_temp == "Auto-Credit")){//kamal for CfS Broker
		if((_system_current_step_var=="start_step" OR _system_current_step_var=="pending_process") AND (quoteType_temp == "Retention" OR quoteType_temp == "Backout" OR quoteType_temp == "Modify" OR quoteType_temp == "Auto-Credit")){
			//if(partNumber <> "SELLERLEADBUNDLE"){
			if(line._part_custom_field8 <> "Usage"){
				nonUsageProductExists = true;
			}
			lineItemValuesDict = dict("string");
			assetValuesDict = dict("string");
			today = datetostr(getdate(), "yyyy-MM-dd");
			if(line.assetDetails_line <> "") 
			{
				//LEAP-8807 below code will execute for the assets already have an 'unpaid' extension and trying to extend the term which is a paid extension.
				//assetArray = split(line.assetDetails_line, FIELD_DELIM);
				asset_EndDate = assetArray[USAGE_ENDDATE_INDEX];
				subscription_EndDate = assetArray[SUBSCRIPTION_END_DATE_INDEX];
				assetOverrdeTerm = 0;
				if(isNumber(assetArray[OVERRIDER_CONTRACT_TERM_INDEX])){
					assetOverrdeTerm = integer(atof(assetArray[OVERRIDER_CONTRACT_TERM_INDEX]));
				}
				 if(asset_EndDate <> "" AND NOT(isnull(asset_EndDate)) AND asset_EndDate <> "null" AND subscription_EndDate <> "" AND subscription_EndDate <> "null" AND NOT(isnull(subscription_EndDate)) AND lineType == "amend"){
					 if(comparedates(strtodate(asset_EndDate, "yyyy-MM-dd"),strtodate(subscription_EndDate, "yyyy-MM-dd")) == 1 AND (assetArray[CONTRACT_TERM_INDEX] <> string(actualContractTerm) OR assetOverrdeTerm <> line.overrideTerm_line)){
						// Warning message to user that they are not allowed to change term.
						if(termErrorMessage <> ""){
							termErrorMessage = termErrorMessage + "</br>";
						}else{
							termErrorMessage = "This assets already have an 'unpaid' extension and you cannot extend the term which is a paid extension<br>";
						}
						termErrorMessage = termErrorMessage + "Line #" + line._group_sequence_number  + " " + partNumber; 
						assetOverrideTermFlag = true;
						//resetting contract term and overrider term to the imported value from sfdc
						lineRes = "";
						lineRes = lineRes + documentNumber + "~contractTerms_line~" + assetArray[CONTRACT_TERM_INDEX]+ "|";
						lineRes = lineRes + documentNumber + "~overrideTerm_line~" + string(assetOverrdeTerm)+ "|";						
					} 
				}
				// LEAP-8788 below code will change today = subscription end date if today's date is in between subscription end date and asset end date(inclusive asset end date) this case arrise with unpaid extension and again modify same asset
				if(assetArray[USAGE_ENDDATE_INDEX] <> "" AND assetArray[SUBSCRIPTION_END_DATE_INDEX] <> "")
				{
					assetEndDt = util.salesforceStringToJavaDate(assetArray[USAGE_ENDDATE_INDEX]);
					subEndDt = util.salesforceStringToJavaDate(assetArray[SUBSCRIPTION_END_DATE_INDEX]);
					//todayDt = getdate();8788
					todayDt = strtojavadate(getstrdate(), "MM/dd/yyyy");
					compare1 = comparedates(subEndDt, todayDt);
					compare2 = comparedates(todayDt, assetEndDt);
					if(compare1 == -1 AND (compare2 == -1 OR compare2 == 0))
					{
						today = datetostr(subEndDt, "yyyy-MM-dd");
					}
				}
				//LEAP-8448 ~Vasundhara
				if(lineType <> "add" AND lineType <> "renew"){
					zuoraId = assetArray[ZUORA_ID_INDEX];
					assetExtendedNetPrice = assetArray[EXTENDED_NET_PRICE_INDEX];
					if(zuoraId <> ""){
						put(zouraInputDict,"session",session);
						put(zouraInputDict,"endPoint",endPoint);
						if(NOT containskey(zouraInputDict,line._document_number+"$$RatePlanID")){
							put(zouraInputDict,line._document_number+"$$RatePlanID",zuoraId);
							put(zouraInputDict,line._document_number+"$$GroupSequenceNum",line._group_sequence_number);
							put(zouraInputDict,line._document_number+"$$lineType",lineType);
							put(zouraInputDict,line._document_number+"$$partNumber",line._part_number);
							put(zouraInputDict,line._document_number+"$$assetExtNetPrice",assetExtendedNetPrice);
							append(docNumArrForZoura,line._document_number);
						}
						if(zuoraCheckFlag == false){
							zuoraCheckFlag = true;
						}
					}
					/* if(zouraSubNetPriceStr <> assetExtendedNetPrice){
						if(zouraErrorMessage <> "")
						{
							zouraErrorMessage = zouraErrorMessage + "</br>";
						}
						else
						{
							zouraErrorMessage = "Latest subscription is not sync to SFDC from Zuora for below assets</br>";
						}
						zouraErrorMessage = zouraErrorMessage + "Line # " + line._group_sequence_number + " " + line.lineType_line + " " + line._part_number;
					} */
				}
			}
			subscriptionStart = getdate();
			if(line.subscriptionStartDate_line <> "")
			{
				subscriptionStart = strtojavadate(line.subscriptionStartDate_line, "yyyy-MM-dd");
			}
			contractEnd = getdate();
			cancellationDate = "";
			cancellationEffectiveDate = "";
			subscriptionEndDate = "";
			subscriptionStartDate = "";
			documentNumber = line._document_number;
			if(lineType == "cancel" OR lineType == "buyout" OR lineType == "credit" OR lineType == "amend")
			{
				endDate = line.contractEndDate_l;
				if(line.overrideTerm_line <> 0)
				{
					ContractTerm = line.overrideTerm_line;
				}
				assetContractTerm = 0;
				/*if(isNumber(line.contractTerms_line) AND ContractTerm == 0)
				{
					ContractTerm = atoi(line.contractTerms_line);
				}*/
				//if(line.assetDetails_line <> ""){
				//assetArray 	= split(line.assetDetails_line, FIELD_DELIM);
				if(isNumber(assetArray[OVERRIDER_CONTRACT_TERM_INDEX])){
				assetContractTerm = integer(atof(assetArray[OVERRIDER_CONTRACT_TERM_INDEX]));
				}
				if(isNumber(assetArray[CONTRACT_TERM_INDEX]) AND assetContractTerm == 0)
				{
					assetContractTerm = integer(atof(assetArray[CONTRACT_TERM_INDEX]));
				}
				put(assetValuesDict,"contractTerms_line",string(assetContractTerm));
				startDate = datetostr(util.salesforceStringToJavaDate(assetArray[INSTALL_DATE_INDEX]),"yyyy-MM-dd");
				assetEndDate = datetostr(util.salesforceStringToJavaDate(assetArray[USAGE_ENDDATE_INDEX]),"yyyy-MM-dd");
				endDate = util.calculateContractEndDate(assetEndDate, ContractTerm - assetContractTerm);// differene in contract term from asset
				subscriptionStartDate = line.subscriptionStartDate_line;
				if(isNull(assetArray[SUBSCRIPTION_START_DATE_INDEX]) == false)
				{
					subscriptionStartDate = datetostr(util.salesforceStringToJavaDate(assetArray[SUBSCRIPTION_START_DATE_INDEX]));
				}
				subscriptionEndDate = line.subscriptionEndDate_line;
				subscriptionStart = getdate();
				if(subscriptionStartDate == "")
				{
					subscriptionStartDate = line.subscriptionStartDate_line;
				}
				if(subscriptionStartDate <> "")
				{
					if(find(subscriptionStartDate,"-") > -1)
					{
						subscriptionStart = strtojavadate(subscriptionStartDate, "yyyy-MM-dd");
					}
					else
					{
						subscriptionStart = strtojavadate(subscriptionStartDate, "MM/dd/yyyy");
					}
				}
			}
			put(assetValuesDict,"termStartDate", datetostr(subscriptionStart, "yyyy-MM-dd"));// before extension date ie date from asset without any modification
			//LEAP-8636 below code executes when lineType is "cancel" or "Buyout" - Enhancement of LEAP-8506
			//print line.lineType_line;
			if(lineType == "cancel" OR lineType == "buyout"){
				cancellationReason = line.cancellationReason_line;
				cancelDateType = "";
				if(lineType == "buyout" OR cancellationReason <> "nonPayment"){
					effectiveDatekey = BillingPeriod + KEY_DELIMITER1 + lineType + KEY_DELIMITER1 + "other";
				}else{
					effectiveDatekey = BillingPeriod + KEY_DELIMITER1 + lineType + KEY_DELIMITER1 + cancellationReason;
				}
				if(containskey(effectiveDateDict,effectiveDatekey)){
					cancelDateType = get(effectiveDateDict,effectiveDatekey);
				}
				//if(cancelDateType == "Cycle" AND line._part_number <> "SELLERLEADBUNDLE"){
				if(cancelDateType == "Cycle" AND line._part_custom_field8 <> "Usage"){//kamal for CfS broker
					SeparateInvoiceFlag = util.getSeparateInvoiceFlagFromZoura(line.zuoraSubscriptionID_line,inputDict);
					if(SeparateInvoiceFlag == false)
					{
						cancellationEffectiveDate = util.getNextBillingDate(zouraBillCycleDay_quote);
					}
					else
					{	
						//assetArray 	= split(line.assetDetails_line, FIELD_DELIM);
						if(assetArray[NEXT_CHARGE_DATE_INDEX] <> "" AND (NOT isNull(assetArray[NEXT_CHARGE_DATE_INDEX])) AND assetArray[NEXT_CHARGE_DATE_INDEX] <> "null" )
						{
							nextChargeDate = "";
							nextChargeDate = util.getNextBillingDate(assetArray[NEXT_CHARGE_DATE_INDEX]);
							cancellationEffectiveDate = nextChargeDate;
						}
						else
						{
							cancellationEffectiveDate = datetostr(subscriptionStart, "yyyy-MM-dd");// Its term start date from assetDetails_line
						}
					}
					//LEAP-8983
					if(line.assetDetails_line <> ""){
						//assetArray 	= split(line.assetDetails_line, FIELD_DELIM);
						if(NOT(isnull(assetArray[TERM_END_DATE_INDEX])) AND assetArray[TERM_END_DATE_INDEX] <> "" AND assetArray[TERM_END_DATE_INDEX] <> "null" AND cancellationEffectiveDate <> "" AND cancellationEffectiveDate <> "null"){
							if(comparedates(strtodate(cancellationEffectiveDate, "yyyy-MM-dd"),strtodate(assetArray[TERM_END_DATE_INDEX], "yyyy-MM-dd")) == 1){
								cancellationEffectiveDate = assetArray[TERM_END_DATE_INDEX];
							}
						}
					}
					if(cancellationEffectiveDate <> ""){
						lineRes = lineRes + documentNumber + "~cancellationEffectiveDate_l~" + cancellationEffectiveDate + "|";
					}
				}else{
					lineRes = lineRes + documentNumber + "~cancellationEffectiveDate_l~" + today + "|";
				}
				put(lineItemValuesDict,"effectiveDate",cancellationEffectiveDate);
			}elif(lineType == "amend" OR lineType == "credit"){
					
					//if(isNumber(assetArray[CONTRACT_TERM_INDEX]))
					//{
						
						
						//if(atoi(assetArray[CONTRACT_TERM_INDEX]) == ContractTerm){
						//startDate = datetostr(util.salesforceStringToJavaDate(assetArray[INSTALL_DATE_INDEX]));
						//endDate = datetostr(util.salesforceStringToJavaDate(assetArray[USAGE_ENDDATE_INDEX]));
						//}
						//elif(atoi(assetArray[CONTRACT_TERM_INDEX]) <> ContractTerm){
						//startDate = datetostr((adddays(util.salesforceStringToJavaDate(assetArray[INSTALL_DATE_INDEX]),1)),"yyyy-MM-dd");
						
						//}
					/*}
					else{
						startDate = datetostr((adddays(util.salesforceStringToJavaDate(assetArray[INSTALL_DATE_INDEX]),1)),"yyyy-MM-dd");
						endDate = util.calculateContractEndDate(startDate, ContractTerm);
					}*/
					
					//Extensions Logic
					
					if(line.extendDays_line>0){
						//Set Contract End Date
						if(endDate <> ""){
							if(find(endDate,"-") > -1)
							{
								contractEnd = strtojavadate(endDate, "yyyy-MM-dd");
							}
							else
							{
								contractEnd = strtojavadate(endDate, "MM/dd/yyyy");
							}
							contractEnd = adddays(contractEnd, line.extendDays_line);
							endDate = datetostr(contractEnd,"MM/dd/yyyy");
						}
						if(lower(line.extensionType_line)=="paid" AND subscriptionStartDate<>""){
							subscriptionStart = adddays(subscriptionStart, line.extendDays_line);
						}
					}
					//}
				//}
				put(lineItemValuesDict,"effectiveDate",today);

			}
			if(lineType == "cancel" OR lineType == "buyout" OR lineType == "credit" OR lineType == "amend")
			{
				subscriptionEndDate = util.calculateContractEndDate(datetostr(subscriptionStart,"yyyy-MM-dd"), ContractTerm);
				lineRes = lineRes + documentNumber + "~contractEndDate_l~" + endDate + "|"
								  + documentNumber + "~subscriptionEndDate_line~" + subscriptionEndDate + "|"
								  + documentNumber + "~subscriptionStartDate_line~" + datetostr(subscriptionStart, "yyyy-MM-dd") + "|";
			}
			/*if(line.lineType_line <> "amend" AND line.lineType_line <> "credit" AND line.originalSubscriptionStartDate_line <> "")
			{
				lineRes = lineRes + documentNumber + "~subscriptionStartDate_line~" + line.originalSubscriptionStartDate_line + "|";
			}*/
			if(lineType == "add" OR lineType == "renew" OR accountCategory == "BDX")
			{
				proStr = proStr + documentNumber + "~amendDelta_line~"+ amendDeltaStr + "|";// reset amend delta to 0 for add and renew
			}
			//elif(partNumber <> "SELLERLEADBUNDLE")
			elif(line._part_custom_field8 <> "Usage")
			{
				put(lineItemValuesDict,"contractEffectiveDate",today);
				put(lineItemValuesDict,"customerAcceptanceDate",today);
				put(lineItemValuesDict,"serviceDate",today);
				put(lineItemValuesDict,"_part_number",line._part_number);
				put(lineItemValuesDict,"lineType_line",lineType);
				put(lineItemValuesDict,"zuoraRatePlanID_line",line.zuoraRatePlanID_line);
				put(lineItemValuesDict,"zuoraProductRatePlanChargeID_line",line.zuoraProductRatePlanChargeID_line);
				put(lineItemValuesDict,"extendedNetPrice_line",string(extendedNetPriceEach));
				put(lineItemValuesDict,"overrideTerm_line",string(line.overrideTerm_line));
				put(lineItemValuesDict,"contractTerms_line",string(ContractTerm));
				put(lineItemValuesDict,"_document_number",line._document_number);
				put(lineItemValuesDict,"zuoraAmendmentID_line",line.zuoraAmendmentID_line);
				put(lineItemValuesDict,"zuoraSubscriptionID_line",line.zuoraSubscriptionID_line);
				put(lineItemValuesDict,"debug","true1");
				
				if(subscriptionStartDate <> "")
				{
					put(lineItemValuesDict,"termStartDate", datetostr(subscriptionStart, "yyyy-MM-dd"));
				}
				else
				{
					put(lineItemValuesDict,"termStartDate", "");
				}
				if(useOldProrationCall_quote)
				{
					proStr = proStr + commerce.getProration(inputDict,lineItemValuesDict,headers);
				}
				else
				{
					if(line.zuoraProductRatePlanChargeID_line <> "" AND line.zuoraAmendmentID_line <> "" AND line.zuoraSubscriptionID_line <> "")
					{
						temp = commerce.getProrationNew(inputDict,lineItemValuesDict,headers,assetValuesDict);
						prorationArr = split(temp,"!^!");
						if(prorationArr[1] <> "")
						{
							if(prorationError <> "")
							{
								prorationError = prorationError + "</br>";
							}
							if(line._part_custom_field13 == "true")
							{
								prorationError = prorationError + "Line # " + line._group_sequence_number + " " + partNumber + " for Market " + line.marketZip_line + " - " + prorationArr[1];
							}
							else
							{
								prorationError = prorationError + "Line # " + line._group_sequence_number + " " + partNumber + " - " + prorationArr[1];
							}
						}
						deltaAmt = 0.0;
						if(isNumber(prorationArr[0])){
							deltaAmt = atof(prorationArr[0]);
						}
						
						if(deltaAmt < 0)
						{
							if(lineType == "buyout")
							{
								lostRevenuePricing = lostRevenuePricing + (-1) * deltaAmt * (100 - line.buyoutDiscount_line)/100.0;
							}
							else
							{
								lostRevenuePricing = lostRevenuePricing + deltaAmt;
							}
						}
						if(prorationReviewNeeded == false AND isNumber(prorationArr[0]))
						{
							if(deltaAmt <> 0)
							{
								prorationReviewNeeded = true;
							}
						}
						amendDeltaStr  = prorationArr[0];
					}
					else
					{
						if(prorationError <> "")
						{
							prorationError = prorationError + "</br>";
						}
						if(line._part_custom_field13 == "true")
						{
							prorationError = prorationError + "Line # " + line._group_sequence_number + " " + partNumber + " for Market " + line.marketZip_line + " - Zuora ID's on asset are blank";
						}
						else
						{
							prorationError = prorationError + "Line # " + line._group_sequence_number + " " + partNumber + " - Zuora ID's on asset are blank";
						}
					}
					proStr = proStr + documentNumber + "~amendDelta_line~" + amendDeltaStr + "|";
				}
			}
			else{
				amendDeltaStr = "0";
			}
			//}
			if((isNumber(amendDeltaStr) AND atof(amendDeltaStr) <> 0) OR lineType == "amend"){
				if(find(lineItemStr,lineType) == -1){
					lineItemStr = lineItemStr + lineType + ",";
				}
			}
		}
		//Below block of code is written for Sellerleadsbundle
		//if(line.lineType_line == "cancel" AND partNumber == "SELLERLEADBUNDLE" AND (lower(line._part_custom_field8) == "usage") AND line.assetDetails_line <> "" ){
		if(lineType == "cancel" AND line._part_custom_field8 == "Usage" AND line.assetDetails_line <> ""){
				responseDict = dict("string[]");
				deliveredImpression = "0";
			
				//Sellerleadbundle development for cancel type
				//	if(NOT(isnull(line.assetStartDate_line)) AND NOT(isnull(line.assetEndDate_line)) AND line.assetEndDate_line <> "" AND line.assetStartDate_line <> ""){
				dateFormat = "yyyy-MM-dd";
				fulfillToAssetId = "0";
				tempAssetArray = split(line.assetDetails_line,"#");
				startDateofAsset = tempAssetArray[INSTALL_DATE_INDEX];
				//startDateOfAsset = util.dateToStringFormat(util.salesforceStringToJavaDate(line.assetStartDate_line),"yyyy-MM-dd");
				endDateOfAsset = datetostr(getdate(), dateFormat);
				getFirstDateOfMonthArr = split(endDateOfAsset,"-");
				startDateOfMonth = getFirstDateOfMonthArr[0]+"-"+getFirstDateOfMonthArr[1]+"-"+"01";
				if(NOT(isnull(get(fulfillToAssetDict,line.assetID_l)))){
					fulfillToAssetId = get(fulfillToAssetDict,line.assetID_l);
				}
				accountpartyId = partyID;
				marketId = line.marketZipLineGrid_line; 	
				inputLineItemsDict = dict("string");
				put(inputLineItemsDict,"startDate",startDateOfAsset);
				put(inputLineItemsDict,"endDate",endDateOfAsset);
				put(inputLineItemsDict,"StartDateOfMonth",startDateOfMonth);
				put(inputLineItemsDict,"FulfillToAssetId",fulfillToAssetId);
				put(inputLineItemsDict,"partyID",accountpartyId);
				put(inputLineItemsDict,"marketId",marketId); 
				put(inputLineItemsDict,"source","CPQ"); 
				deliveredImpressions = commerce.getForecastedLeads(inputLineItemsDict,operationName);
				if((not isnull(get(deliveredImpressions,"AggregatedLeads"))) AND isnumber(get(deliveredImpressions,"AggregatedLeads"))){
					deliveredImpression = get(deliveredImpressions,"AggregatedLeads");
				} 
				// For handling failure scenarios we are waiting for response format from SOA. Once we get it corresponding handle code will be writte
				//	}
				//}	
				forecastedeadsCount = line.forecastedLeads_line;
				/*if(forecastedeadsCount ==0){
					forecastedeadsCount = 5;//kamal get the value from Salesforce asset
				}*/
			
				lineRes = lineRes + documentNumber + "~forecastedLeads_line~" + string(forecastedeadsCount) + "|";
					contractedImp = line.contractedImpressions_line;//kamal-get the value from asset.
					if(isNumber(deliveredImpression) == false)
					{
						deliveredImpression = "0";
					}
					
					lineRes = lineRes + documentNumber + "~deliveredImpressions_line~" + deliveredImpression + "|";
					lineRes = lineRes + documentNumber + "~contractedImpressions_line~" + string(contractedImp) + "|";
					deltaAmountForCommisions = (atoi(deliveredImpression) - contractedImp) * line.listPrice_line;
					totalNet = line.totalList_line + deltaAmountForCommisions;
					lineRes = lineRes + documentNumber + "~deltaAssetPrice_line~" + string(deltaAmountForCommisions) + "|"
									  + documentNumber + "~totalNet_line~" + string(totalNet) + "|";// formula will return same value 
					//lineRes = lineRes + documentNumber + "~deltaPriceWoTax_line~" + string(deltaAmountForCommisions) + "|";
				
		}
		elif(lineType <> "credit")// added by Suraj if line action is reset from cancel/credit to any other then deltaAssetPrice_line should be $0
		{
			lineRes = lineRes + documentNumber + "~deltaAssetPrice_line~" + string(0) + "|";
		}
		/* deltaPercentage = 0;
		if(quoteType_temp == "Auto-Renew" AND line.assetPrice_line > 0)
		{
			//deltaAssetPrice = netPriceEa * qty - line.assetPrice_line;
			deltaAssetPrice = line.totalNet_line - line.assetPrice_line;
			if(deltaAssetPrice <> 0)
			{
				deltaPercentage = (deltaAssetPrice/line.assetPrice_line) * 100;
			}
			if(deltaPercentage > 20 OR deltaPercentage < -20)
			{
				needManualRenew = true;
			}
		} */
		totalPayment = netPriceEa * qty;
		totalListPriceLine = 0;
		totalDiscountLine = 0;
		totalValueLine = 0;
		totalEstTaxLine = 0;
		if(containsKey(billingPeriodDivisorDict,line.billingPeriod_line))//line.contractTerms_line <> "" AND 
		{
			totalListPriceLine = listPrice * qty * ceil(ContractTerm/get(billingPeriodDivisorDict,line.billingPeriod_line));
			totalDiscountLine = discountAmount * qty * ceil(ContractTerm/get(billingPeriodDivisorDict,line.billingPeriod_line));
			totalValueLine = totalListPriceLine - totalDiscountLine;
			totalEstTaxLine = round(totalValueLine * 9.0/100,2);
		}
		totalListPrice = totalListPrice + listPrice * qty;
		totalLineItemDiscount = totalLineItemDiscount + discountAmount * qty;
		totalExtNet = totalExtNet + netPriceEa * qty;
		if(line._part_custom_field8 == "One Time")
		{
			oneTimeTotalListPrice = oneTimeTotalListPrice + totalValueLine;
			oneTimeTotalLineItemDiscount = oneTimeTotalLineItemDiscount + totalDiscountLine;
			oneTimeTotalEstTax = oneTimeTotalEstTax + totalEstTaxLine;
		}
		elif(line._part_custom_field8 == "Recurring")
		{
			if(line._part_custom_field2 == "auto")
			{
				autoTotalListPrice = autoTotalListPrice + totalValueLine;
				autoTotalLineItemDiscount = autoTotalLineItemDiscount + totalDiscountLine;
				autoTotalEstTax = autoTotalEstTax + totalEstTaxLine;
			}
			elif(line._part_custom_field2 == "manual")
			{
				manualTotalListPrice = manualTotalListPrice + totalValueLine;
				manualTotalLineItemDiscount = manualTotalLineItemDiscount + totalDiscountLine;
				manualTotalEstTax = manualTotalEstTax + totalEstTaxLine;
			}
		}
		// ************************* Turbo Pricing starts *************************
		contractedImp = 0;
		deliveredImpression = "0";
		//if(partNumber == "SELLERLEADBUNDLE" AND lineType == "add"){
		if(line._part_custom_field8 == "Usage" AND lineType == "add"){
			contractedImp = line.forecastedLeads_line * ContractTerm * qty;
			lineRes = lineRes + documentNumber + "~contractedImpressions_line~" + string(contractedImp) + "|";

		}
		elif(partNumber == "TURBO")
		{
			contractedImp = ContractTerm * qty * 1000;
			//if(actionName == "submit" AND lineType == "cancel" AND containsKey(cancelCampaignDict,line.campaignId_line))
			if((actionName == "update") AND (lineType == "cancel" OR lineType == "credit"))//actionName == "submit" OR 
			{
				index = findinarray(turboImpressionCampaignIdArray,line.campaignId_line);
				//print index;
				if(index <> -1)
				{
					deliveredImpression = turboImpressionArray[index];
					if(isNumber(deliveredImpression) == false)
					{
						deliveredImpression = "0";
					}
					else
					{
						lineRes = lineRes + documentNumber + "~deliveredImpressionsUpdatedDate_line~" + endDateForTurbo + "|";
					}
					lineRes = lineRes + documentNumber + "~deliveredImpressions_line~" + deliveredImpression + "|";
				}
				listPriceValue = listPrice;
				amendDelta = 0.0;
				if(isNumber(amendDeltaStr)){
					amendDelta = atof(amendDeltaStr);
				}
				
				if(amendDelta < 0)
				{
					amendDelta = amendDelta * -1;
				}
				if(line.listPriceOverride_line > 0)
				{
					listPriceValue = line.listPriceOverride_line;
				}
				pricePerImpressionSold = listPriceValue / 1000.0;
				maxAmountBillable = 0;
				if(isNumber(deliveredImpression))
				{
					maxAmountBillable = (atof(deliveredImpression) * pricePerImpressionSold );
				}
				totalContractPrice = line.assetPrice_line;
				if(maxAmountBillable > totalContractPrice)
				{
					maxAmountBillable = totalContractPrice;
				}
				creditAmt = (totalContractPrice - amendDelta) - maxAmountBillable;
				lineRes = lineRes + line._document_number + "~creditAmount_line~" + string(creditAmt) + "|";
			}
			elif(lineType <> "credit" AND lineType <> "cancel")
			{
				creditAmt = 0;
				lineRes = lineRes + line._document_number + "~creditAmount_line~" + string(creditAmt) + "|";
			}
			lineRes = lineRes + documentNumber + "~contractedImpressions_line~" + string(contractedImp) + "|";
		}else{
			creditAmt = line.creditAmount_line;
			if(lineType <> "credit" AND lineType <> "cancel"){
				creditAmt = 0;
			}
			
			lineRes = lineRes + line._document_number + "~creditAmount_line~" + string(creditAmt) + "|";
		}
		// ************************* Turbo Pricing ends *************************
		//Skip for Pre-Auth quotes
		if(line.invPool_line <> "preauth"){
			lineRes = lineRes + documentNumber + "~priceEffectiveDate_line~" + priceEffDate + "|";
		}
		lineRes = lineRes + documentNumber + "~originalListPrice_line~" + string(listPrice) + "|"
						  //+ documentNumber + "~listPrice_line~" + string(listPrice) + "|"
						  //+ documentNumber + "~discountAmount_line~" + string(discountAmountEach) + "|"
						  //+ documentNumber + "~netPriceEach_line~" + string(netPriceEach) + "|"
						  //+ documentNumber + "~extendedNetPrice_line~" + string(extendedNetPriceEach) + "|"
						  + documentNumber + "~needManualRenew_line~" + string(needManualRenew) + "|"
						  + documentNumber + "~checkInventory_l~" + string(checkInventory) + "|"
						  + documentNumber + "~oldLineType_line~" + lineType + "|";
						  //+ documentNumber + "~undersoldAsset_line~" + String(undersoldAsset) + "|";
						  //+ documentNumber + "~priceEffectiveDate_line~" + priceEffDate + "|";
						
						  //+ documentNumber + "~totalDiscount_line~" + string(discountAmount) + "|"
						  //+ documentNumber + "~netPriceEach_line~" + string(netPriceEa) + "|"
						  //+ documentNumber + "~extendedNetPrice_line~" + string(totalPayment) + "|"
						  //+ documentNumber + "~totalList_line~" + string(totalListPriceLine) + "|";
						  //+ documentNumber + "~totalDiscount2_line~" + string(totalDiscountLine) + "|"
						  //+ documentNumber + "~totalValue_line~" + string(totalValueLine) + "|"
						  //+ documentNumber + "~estTax_line~" + string(totalEstTaxLine) + "|";
		/*Ticket# 1090: Added NOT (lineType <> "renew" AND oldLineType == "renew") condition in the below if*/
		if(listPrice <> line.originalListPrice_line AND (line.originalListPrice_line > 0 OR line._part_custom_field13=="false") AND NOT (lineType <> "renew" AND oldLineType == "renew"))// reset over ride amount if user modified any line level attribute which causes change in original list price
		{
			lineRes = lineRes + documentNumber + "~listPriceOverride_line~" + string(0) + "|";
		}
		if(marketKey <> "" AND line.marketId_line == ""){
			lineRes = lineRes + documentNumber + "~marketId_line~" + marketKey + "|";
		}
		totalBillingTerms = 0;
		if(containsKey(billingPeriodDivisorDict,line.billingPeriod_line))
		{
			totalBillingTerms = ContractTerm/get(billingPeriodDivisorDict,line.billingPeriod_line);
		}
		/*if(line.billingPeriod_line == "Monthly"){
			totalBillingTerms = ContractTerm;
		}elif(line.billingPeriod_line == "Quarterly"){
			totalBillingTerms = ContractTerm/3;
		}elif(line.billingPeriod_line == "Bi-Annual"){
			totalBillingTerms = ContractTerm/6;
		}elif(line.billingPeriod_line == "Annual"){
			totalBillingTerms = ContractTerm/12;
		}*/
		
		if(line.listPriceOverride_line <> 0 AND (lineType == "add" OR lineType == "renew") AND (listPrice <> line.listPriceOverride_line)){
						
			overrideDelta = (listPrice - line.listPriceOverride_line)*totalBillingTerms*qty;
			if(overrideDelta < 0){
				overrideDelta = overrideDelta*-1;
			}
			//Added as part of CRM 1933
			if(partNumber == "ADVANTAGE" AND isSpecialAdvantage == true)
			{
				advantageOverrideDelta = advantageOverrideDelta + overrideDelta;
			}
			//End of Added as part of CRM 1933
			totalOverrideDelta = totalOverrideDelta + overrideDelta;
		}
		if(lineType == "add" OR lineType == "renew")
		{
			overrideDelta = 0.0;
			if(partNumber == "ADVANTAGE" AND suppressAMLCPPLOverrideApproval_quote == false)
			{
				overrideDelta = (listPrice - originalListPriceForDelta)*totalBillingTerms*qty;
				//Added as part of CRM 1933
			    if(partNumber == "ADVANTAGE" AND isSpecialAdvantage == true)
				{
					advantageOverrideDelta = advantageOverrideDelta + overrideDelta;
				}	
				//End of Added as part of CRM 1933
			}		
			if(partNumber == "SHOWCASE" AND supressHLCapproval_quote == false)
			{
				overrideDelta = (listPrice - originalListPriceForDelta)*totalBillingTerms*qty;
			}
			if(overrideDelta < 0){
				overrideDelta = overrideDelta*-1;
			}
		
			//CRM-846
			if(isSpecialAdvantage == true){
				//advantageOverrideDelta = advantageOverrideDelta + overrideDelta;//Commented as part of CRM 1933
				advantagelinediscount = advantagelinediscount + line.totalDiscount2_line;//Added as part of CRM 1933
			}
			// Dont Add any overrride Delta amount in totalOverrideDelta  to block approval: CRM 1526
			if(isAdvantageCapped){
			//totalOverrideDelta=0.0;
			overrideDelta=0.0;
			}
			else{
				totalOverrideDelta = totalOverrideDelta + overrideDelta;
			}
			// End CRM 1526
		}
		if(line.assetDetails_line <> "" AND undersoldAsset == true){
			isGrandFatherPriceEligible = true;
			lineDetailsDict = Dict("string");
			put(lineDetailsDict,"priceType",line._part_custom_field8);
			put(lineDetailsDict,"listBillingPeriod",line.billingPeriod_line);
			if(line.listPriceOverride_line <> 0){
				put(lineDetailsDict,"listPrice",String(line.listPriceOverride_line));
			}else{
				put(lineDetailsDict,"listPrice",String(listPrice));
			}
			grandFatherDiscount = commerce.getGrandFatheringDiscount(line.assetDetails_line, lineDetailsDict,billingPeriodDivisorDict);
		}																						 
		//Promotions Logic starts here 
		eligiblePromotionString = "";
		accountType = accountType_quote;
		
		//Advantage promotions start
		isAdvPromotionEligible = "false";
		if(line._part_number == "ADVANTAGE" AND lineType == "add" AND accountType == "Broker" AND line.productTypeLineGrid_line == "Pro" AND find(line.selectOption_line,"Residential") <> -1 AND ContractTerm == 12){
			
			bridgingProInputDict = Dict("string");
			put(bridgingProInputDict,"parentAssetMLS",parentAssetMLSString_quote);
			put(bridgingProInputDict,"agentDetails",agentDetails_quote);
			put(bridgingProInputDict,"licenseQty",String(fiveStreetlicenseQty));
			put(bridgingProInputDict,"fiveStreetTerm",String(fiveStreetTerm));
			put(bridgingProInputDict,"AdvantageAnnualContractValue",String(listPrice * totalBillingTerms));
			
			isAdvPromotionEligible = commerce.getBridgingPromotionOffer(bridgingProInputDict);
		}
		//End Advantage promotions

		if((_system_current_step_var=="start_step" OR _system_current_step_var=="pending_process")){
			isadvantagePromoValid = "";
			for eachPromo in promoresults{
				tempPromoCodeForRenewal = "";
				tempPromoPercentageForRenewal = 0;
				tempPromoStartDateForRenewal = 0;
				
				userGroup = get(eachPromo,"UserGroup");
				promoCode = get(eachPromo,"PromoCode");
				
				marketCode = get(eachPromo,"MarketCode");
				tempStartDate = get(eachPromo,"DateFrom");
				tempLineAction = get(eachPromo,"lineAction");
                if(tempLineAction == "")
                {
                    tempLineAction = "ALL";
                }
                elif(tempLineAction == "add")
                {
                    tempLineAction = "add$amend$credit";
                }
				//Auto renewal promotions
				if(find(promoCode,"PRICEGRANDFATHER") <> -1 AND isGrandFatherPriceEligible == false){
                    continue;
                }

				if((findinarray(userGroupArr, userGroup)>-1) AND (find(eligiblePromotionString,promoCode) <> 0)){
					partNumber = get(eachPromo,"PartNumber")+"**"+get(eachPromo,"PromoCode")+"**"+get(eachPromo,"PromoDescription")+"**"+get(eachPromo,"DiscountPercent");
					if(get(eachPromo,"PartNumber") ==  line._part_number){
						if((get(eachPromo,"SoldWithPart") == "NONE" OR findinarray(soldWithPartNumber,get(eachPromo,"SoldWithPart")) <> -1) AND (get(eachPromo,"SoldWithType") == "NONE" OR findinarray(soldWithProdType,get(eachPromo,"SoldWithType")) <> -1) AND (tempLineAction == "ALL" OR find(tempLineAction,lineType) <> -1) OR (line._part_number == "FIVESTREET" AND find(parentAssetMLSString_quote,"#$#COBROKE#$#") <> -1 AND promoCode == "FSFREECBC")){
							////////////////////////////LEAP-8910 SHOWCASE CHANGES FOR NEW Promo

							if(promoCode == "C21BRKRSHOWCASE"){
								if(line._part_number == "SHOWCASE" AND lower(accountType) == "broker" AND (lower(trim(franchise)) == "century 21" OR lower(franchise) == "c21")){
									if(line.hlcOverride_line > 0){
										 discHlcValue = line.hlcOverride_line;
									 }else{
										 discHlcValue = line.hLC_line;
									 }
									 if(line.assetDetails_line <> ""){
										 //assetArray = split(line.assetDetails_line,FIELD_DELIM);
										 if(line.contractTermFlag_line == false){
											 if(isNumber(assetArray[OVERRIDER_CONTRACT_TERM_INDEX])){
												 if(atoi(assetArray[OVERRIDER_CONTRACT_TERM_INDEX]) > 0){
													contractTerm = atoi(assetArray[OVERRIDER_CONTRACT_TERM_INDEX]); 
												 }
											 }elif(isNumber(assetArray[CONTRACT_TERM_INDEX])){
												contractTerm = atoi(assetArray[CONTRACT_TERM_INDEX]);	 
											}
											contractTermFlag = true;
											lineRes = lineRes + documentNumber + "~contractTermFlag_line~" + string(contractTermFlag) + "|";
										 }else{
											 if(line.overrideTerm_line > 0){
												 contractTerm = line.overrideTerm_line;
											 }elif(isNumber(line.contractTerms_line)){
												 contractTerm = atoi(line.contractTerms_line);
											}
										}
									 }else{
										 if(line.overrideTerm_line > 0){
											 contractTerm = line.overrideTerm_line;
										 }elif(isNumber(line.contractTerms_line)){
											 contractTerm = atoi(line.contractTerms_line);
										 }
									 }
									if(line.listPriceOverride_line > 0.0){
										finalListPrice = line.listPriceOverride_line;
									}elif(line.baseListPrice_line > 0 ){
										if(line.priceType_l <> "One Time"){
											if(line.billingPeriod_line=="Monthly"){
												finalListPrice = line.baseListPrice_line;
											}elif(line.billingPeriod_line=="Quarterly"){
												finalListPrice = line.baseListPrice_line*3;
											}elif(line.billingPeriod_line=="Bi-Annual"){
												finalListPrice = line.baseListPrice_line*6;
											}elif(line.billingPeriod_line=="Annual"){
												finalListPrice = line.baseListPrice_line*12;
											}
										}else{
											finalListPrice = line.baseListPrice_line;
										}
									}else{
										finalListPrice = listPrice;
									}
									//listPriceForAllHLC = finalListPrice * discHlcValue;
									if(line.billingPeriod_line <> "" AND contractTerm > 0){ 
										if(line.billingPeriod_line=="Monthly"){
											termValue = contractTerm/1.0;
											contractTermValue = 16.5 / termValue;
										}elif(line.billingPeriod_line=="Quarterly"){
											termValue = contractTerm/3.0;
											contractTermValue = 16.5 / termValue;										
										}elif(line.billingPeriod_line=="Bi-Annual"){
											termValue = contractTerm/6.0; 
											contractTermValue = 16.5 / termValue;
										}elif(line.billingPeriod_line=="Annual"){
											
											termValue = contractTerm/12.0;
											contractTermValue = 16.5 / termValue;
										}else{
											
											contractTermValue = 0;
										}	
									}else{
										contractTermValue = 0;
									}
									hlcCountForDisc = contractTermValue * discHlcValue;
									if(finalListPrice <> 0 ){
										discountPercent = ((finalListPrice - hlcCountForDisc)/finalListPrice) * 100;
									}

									if((marketCode <> "ALL" AND marketCode == lineMarketCode)){
										promoCode = get(eachPromo,"PromoCode");
										//discountPercent = getFloat(eachPromo,"DiscountPercent");
										documentNumber = line._document_number;

										if((lineType == "amend" OR lineType == "renew"  OR lineType == "credit") AND line.assetDetails_line  <> ""){
											//assetArray 	= split(line.assetDetails_line, FIELD_DELIM);
											currentPromo = assetArray[PROMOTION_INDEX];
											if((promoCode == assetArray[PROMOTION_INDEX])){
												if(containsKey(promoApplicationdct, currentPromo+"@DiscountPercent") AND isNumber(get(promoApplicationdct, currentPromo+"@DiscountPercent"))){
													discountPercent = atof(get(promoApplicationdct,currentPromo+"@DiscountPercent"));
												}elif(assetArray[MANUAL_DISCOUNT_AMOUNT_INDEX] <> "" AND isNumber(assetArray[MANUAL_DISCOUNT_AMOUNT_INDEX])){ 
													discountPercent = atof(assetArray[MANUAL_DISCOUNT_AMOUNT_INDEX]);
												}else{
													discountPercent = 0;
												}
											}
										}
										eligiblePromotionString = eligiblePromotionString + promoCode + promoDelim + string(round(discountPercent,2)) + promoDelim + documentNumber + menuItemDelim ;
										tempPromoPercentageForRenewal = discountPercent;
										tempPromoCodeForRenewal = promoCode;
										if(isnumber(tempStartDate)){
											tempPromoStartDateForRenewal = atoi(tempStartDate);
										}
									}	elif(marketCode == "ALL"){
										//added  for req. CRM 1526
										
										//if((promoCode <> "ADVANTAGECAPPEDPRICE" ) OR (promoCode == "ADVANTAGECAPPEDPRICE" AND line.hidePromoFlag_line == false )){
										
											eligiblePromotionString = eligiblePromotionString + promoCode + promoDelim + string(round(discountPercent,2)) + promoDelim + documentNumber + menuItemDelim ;
											
										//}
										//End code for req. CRM1526
										
										tempPromoPercentageForRenewal = discountPercent;
										tempPromoCodeForRenewal = promoCode;
										if(isnumber(tempStartDate)){
											tempPromoStartDateForRenewal = atoi(tempStartDate);
										}
									}else{
										print "No promo is added";
									}
									if(containsKey(c21LineDiscDict, line._document_number + "**" + promoCode)){
										c21ValuesStr = get(c21LineDiscDict, line._document_number + "**" + promoCode);
										if(not isnull(c21ValuesStr)){
											c21ValuesArr = split(c21ValuesStr, "**");
											userInputLineDisc = c21ValuesArr[0];
											stragyDisc = c21ValuesArr[1];
											if(isnumber(userInputLineDisc) AND isnumber(stragyDisc) ){
												discountPercentValue = round(discountPercent, 2);
												if(atof(userInputLineDisc) <= discountPercentValue AND atof(stragyDisc) <= discountPercentValue){
													//print "final====";
													lineDiscPosition = findinarray(approvalReasonArray, "LineDiscount");
													if(lineDiscPosition <> -1){
														//print lineDiscPosition;
														//print approvalReasonArray;
														remove(approvalReasonArray, lineDiscPosition);//app(approvalReasonArray,"LineDiscount");
														//print approvalReasonArray;
													}
												}
											}
										}
									}
								}else{
									continue;
								}
							}
							// CRM-1816
							elif(promoCode == "C21ADVPROMO"){
								
                                if(line._part_number == "ADVANTAGE" AND lower(accountType) == "broker" AND (lower(trim(franchise)) == "century 21" OR lower(franchise) == "c21")){
									discountPercent = getFloat(eachPromo,"DiscountPercent");
									eligiblePromotionString = eligiblePromotionString + promoCode + promoDelim + string(round(discountPercent,2)) + promoDelim + documentNumber + menuItemDelim ;
									
								}
							}
							// END CRM-1816
							elif(find(promoCode,"ADVANTAGEPROBRIDGING") <> -1 AND line._part_number == "ADVANTAGE"){
								
								if(isAdvPromotionEligible == "false"){
									continue;
								}
								discountPercent = getFloat(eachPromo,"DiscountPercent");
								eligiblePromotionString = eligiblePromotionString + promoCode + promoDelim + string(round(discountPercent,2)) + promoDelim + line._document_number + menuItemDelim ;
								
							}else{
								
								discountPercent = getFloat(eachPromo,"DiscountPercent");
								if(find(promoCode,"PRICEGRANDFATHER") <> -1){
									discountPercent = grandFatherDiscount;
								}
								documentNumber = line._document_number;
								if((marketCode <> "ALL" AND marketCode == lineMarketCode)){
									//print findinarray(line.marketCode_line,get(eachPromo,"marketCode"));
									promoCode = get(eachPromo,"PromoCode");
									//discountPercent = getFloat(eachPromo,"DiscountPercent");
									documentNumber = line._document_number;

									if((lineType == "amend" OR lineType == "renew"  OR lineType == "credit") AND line.assetDetails_line  <> ""){
										//assetArray 	= split(line.assetDetails_line, FIELD_DELIM);
										currentPromo = assetArray[PROMOTION_INDEX];	
										if((promoCode == assetArray[PROMOTION_INDEX])){
											if(containsKey(promoApplicationdct, currentPromo+"@DiscountPercent") AND isNumber(get(promoApplicationdct, currentPromo+"@DiscountPercent"))){
												discountPercent = atof(get(promoApplicationdct,currentPromo+"@DiscountPercent"));
											}elif(assetArray[MANUAL_DISCOUNT_AMOUNT_INDEX] <> "" AND isNumber(assetArray[MANUAL_DISCOUNT_AMOUNT_INDEX])){
												discountPercent = atof(assetArray[MANUAL_DISCOUNT_AMOUNT_INDEX]);
											}else{
												discountPercent = 0;
											}
										}											
									}		
									eligiblePromotionString = eligiblePromotionString + promoCode + promoDelim + string(round(discountPercent,2)) + promoDelim + documentNumber + menuItemDelim ;
									tempPromoPercentageForRenewal = discountPercent;
									tempPromoCodeForRenewal = promoCode;
									if(isnumber(tempStartDate)){
										tempPromoStartDateForRenewal = atoi(tempStartDate);
									}
								}elif(marketCode == "ALL"){
									
									if((promoCode <> "ADVANTAGECAPPEDPRICE" ) ){
												
											
											eligiblePromotionString = eligiblePromotionString + promoCode + promoDelim + string(round(discountPercent,2)) + promoDelim + documentNumber + menuItemDelim ;
											
										}
									elif((promoCode == "ADVANTAGECAPPEDPRICE" AND line.hidePromoFlag_line == false )){
									eligiblePromotionString = eligiblePromotionString + promoCode + promoDelim + string(round(discountPercent,2)) + promoDelim + documentNumber + menuItemDelim ;
									}
									tempPromoPercentageForRenewal = discountPercent;
									tempPromoCodeForRenewal = promoCode;
									if(isnumber(tempStartDate)){
										tempPromoStartDateForRenewal = atoi(tempStartDate);
									}
								}else{
									print "No promo is added";
								}

								if((lineType == "amend" OR lineType == "renew"  OR lineType == "credit") AND line.assetDetails_line  <> ""){

									//assetArray 	= split(line.assetDetails_line, FIELD_DELIM);
									currentPromo = assetArray[PROMOTION_INDEX];	

									if((promoCode == assetArray[PROMOTION_INDEX])){

										if(containsKey(promoApplicationdct, currentPromo+"@DiscountPercent") AND isNumber(get(promoApplicationdct, currentPromo+"@DiscountPercent"))){
											discountPercent = atof(get(promoApplicationdct,currentPromo+"@DiscountPercent"));
										}elif(assetArray[MANUAL_DISCOUNT_AMOUNT_INDEX] <> "" AND isNumber(assetArray[MANUAL_DISCOUNT_AMOUNT_INDEX])){
											discountPercent = atof(assetArray[MANUAL_DISCOUNT_AMOUNT_INDEX]);
										}else{
											discountPercent = 0;
										}
									}				

								}/*elif(line.lineType_line == "cancel" OR line.lineType_line == "reinstate"  OR line.lineType_line == "buyout"){


								assetArray 	= split(line.assetDetails_line, FIELD_DELIM);
								if(assetArray[MANUAL_DISCOUNT_AMOUNT_INDEX] <> ""){
								discountPercent = atof(assetArray[MANUAL_DISCOUNT_AMOUNT_INDEX]);
								}else{
								discountPercent = 0;
								}
								}	*/
								/**	eligiblePromotionString = eligiblePromotionString + promoCode + promoDelim + string(round(discountPercent,2)) + promoDelim + documentNumber + menuItemDelim ;*/
							}
						}				
					}
				}
				 if((quoteType_temp == "Auto-Renew" OR oldLineType <> lineType) AND lineType == "renew") // CRM:1090
				{
					if((tempPromoPercentageForRenewal > promoPercentageForRenewal AND tempPromoPercentageForRenewal > 0)/* OR (tempPromoPercentageForRenewal < promoPercentageForRenewal AND tempPromoPercentageForRenewal < 0 AND promoPercentageForRenewal == 0)*/ OR (tempPromoPercentageForRenewal > promoPercentageForRenewal AND tempPromoPercentageForRenewal < 0 AND promoPercentageForRenewal <> 0) OR (tempPromoPercentageForRenewal == promoPercentageForRenewal AND tempPromoStartDateForRenewal > promoStartDateForRenewal)){
						promoPercentageForRenewal = tempPromoPercentageForRenewal;
						promoCodeForRenewal = tempPromoCodeForRenewal;
						promoStartDateForRenewal = tempPromoStartDateForRenewal;
					}
					//Added by Ravi 7/8/2017 for applying Grandfather promotion CRM-1918
					if(find(promoCode,"PRICEGRANDFATHER") <> -1 AND isGrandFatherPriceEligible == true)
					{
						promoPercentageForRenewal = tempPromoPercentageForRenewal;
						promoCodeForRenewal = tempPromoCodeForRenewal;
						promoStartDateForRenewal = tempPromoStartDateForRenewal;
						break;
					}
					//End
				}
			}

			if((lineType == "amend" OR lineType == "credit") AND line.assetDetails_line  <> ""){
				

				//assetArray 	= split(line.assetDetails_line, FIELD_DELIM);
				if(assetArray[PROMOTION_INDEX] <> ""){
					currentPromo = assetArray[PROMOTION_INDEX];	
					if(find(eligiblePromotionString,assetArray[PROMOTION_INDEX]+promoDelim) == -1 AND containsKey(promoApplicationdct,assetArray[PROMOTION_INDEX]+ "@PromoCode")){

						//grandFathered = get(promoApplicationdct, assetArray[PROMOTION_INDEX]+"@Grandfathered");//CRM-1090
						//toDate = atoi(get(promoApplicationdct, assetArray[PROMOTION_INDEX]+"@DateTo")); //CRM-1090
						//if((lower(line.lineType_line) == "amend") OR (lower(line.lineType_line) == "credit") OR (lower(line.lineType_line) == "renew" AND lower(grandFathered) == "yes")){
						//if((lineType == "amend") OR (lineType == "credit") OR (lineType == "renew" AND (undersoldAsset OR lower(grandFathered) == "yes") AND quoteType_temp <> "Auto-Renew")){ // commented above code and added undersoldAsset condition as part of CRM-427 so if undersoldAsset is true then promo code is valid from asset.////CRM-1090
							if(containsKey(promoApplicationdct, currentPromo+"@DiscountPercent") AND isNumber(get(promoApplicationdct, currentPromo+"@DiscountPercent"))){
									discountPercent = atof(get(promoApplicationdct,currentPromo+"@DiscountPercent"));
							}elif(assetArray[MANUAL_DISCOUNT_AMOUNT_INDEX] <> "" AND isNumber(assetArray[MANUAL_DISCOUNT_AMOUNT_INDEX])){
									discountPercent = atof(assetArray[MANUAL_DISCOUNT_AMOUNT_INDEX]);
							}else{
									discountPercent = 0;
							}

							//CRM-1090
							/*tempPromoPercentageForRenewal = discountPercent;
							if(assetArray[INSTALL_DATE_INDEX] <> ""){
								tempStartDate = replace(assetArray[INSTALL_DATE_INDEX],"-","");
								if(isnumber(tempStartDate)){
									tempPromoStartDateForRenewal = atoi(tempStartDate);
								}
							}



							if((quoteType_temp == "Auto-Renew") AND lineType == "renew" AND ((tempPromoPercentageForRenewal > promoPercentageForRenewal) OR (promoPercentageForRenewal == 0) OR (tempPromoPercentageForRenewal == promoPercentageForRenewal AND tempPromoStartDateForRenewal > promoStartDateForRenewal)))
							{

								promoPercentageForRenewal = tempPromoPercentageForRenewal;
								promoCodeForRenewal = assetArray[PROMOTION_INDEX];
								promoStartDateForRenewal = tempPromoStartDateForRenewal;
							}*/	

							eligiblePromotionString = eligiblePromotionString + assetArray[PROMOTION_INDEX] + promoDelim + string(round(discountPercent,2)) + promoDelim + documentNumber + menuItemDelim;
						//}
					}
				}
			}



			
			// Changes 
			if((lineType == "cancel" OR lineType == "reinstate"  OR lineType == "buyout")){
				//assetArray 	= split(line.assetDetails_line, FIELD_DELIM);
				existingPromo = "";
				if(assetArray[PROMOTION_INDEX] <> ""){
					existingPromo = assetArray[PROMOTION_INDEX];	
					if(find(eligiblePromotionString,assetArray[PROMOTION_INDEX]+promoDelim) == -1 AND containsKey(promoApplicationdct,assetArray[PROMOTION_INDEX]+ "@PromoCode")){
						if(assetArray[MANUAL_DISCOUNT_AMOUNT_INDEX] <> "" AND isNumber(assetArray[MANUAL_DISCOUNT_AMOUNT_INDEX])){
							discountPercent = atof(assetArray[MANUAL_DISCOUNT_AMOUNT_INDEX]);
						}else{
								discountPercent = 0;
						}
						eligiblePromotionString = eligiblePromotionString + existingPromo + promoDelim + string(round(discountPercent,2)) + promoDelim + documentNumber + menuItemDelim;
					}						
				}
				
				if(containsKey(appliedPromotionDict, atoi(documentNumber))){
					put(appliedPromotionDict,atoi(documentNumber),existingPromo);
				}
			}
			//CRM-1090
            if(line.assetDetails_line <> "" AND lineType <> "add" AND lineType <> "renew" AND oldLineType == "renew" AND assetArray[PROMOTION_INDEX] <> ""){
                put(appliedPromotionDict,atoi(documentNumber),assetArray[PROMOTION_INDEX]);
            }// End CRM-1090



		}
		/* if(containsKey(appliedPromotionDict,atoi(documentNumber))){
				resetAppliedPromoQuote = resetAppliedPromoQuote + documentNumber + ".!." + get(appliedPromotionDict,atoi(documentNumber)) + "!!!";
		} */
		if(_system_current_step_var=="start_step" OR _system_current_step_var=="pending_process"){
			lineRes = lineRes + documentNumber + "~eligiblePromotions_line~" + eligiblePromotionString + "|";
		}
		
		uniquePromosArray = string[];
		if(eligiblePromotionString <> ""){
			allPromos = split(eligiblePromotionString,"!!!");
			for each in allPromos{
				if(each <> ""){
					tempArray = split(each,".!.");
					append(uniquePromosArray, tempArray[0]);
				}
				
			}
		}
		
		//Applied Promotions Nanda
		appliedApproval = false;
		applied = "";
		if(containsKey(AppliedPromotionDict, atoi(documentNumber))){
			promoInAppliedQuoteString = get(AppliedPromotionDict, atoi(documentNumber));
			if(findinarray(uniquePromosArray,promoInAppliedQuoteString) <> -1){
				applied = promoInAppliedQuoteString;
			}elif((_system_current_step_var=="start_step" OR _system_current_step_var=="pending_process") AND amendPromoSelected == false){//CRM-1090
				lineRes = lineRes + documentNumber + "~override_line~" + "0.0" + "|";
			}
		}
		if((quoteType_temp == "Auto-Renew" OR oldLineType <> lineType) AND lineType == "renew" AND (_system_current_step_var=="start_step" OR _system_current_step_var=="pending_process")) //CRM:1090
		{
			applied = promoCodeForRenewal;
			resetAppliedPromoQuote = resetAppliedPromoQuote + documentNumber + ".!." + applied + "!!!" ;
			lineRes = lineRes + documentNumber + "~override_line~" + string(promoPercentageForRenewal) + "|";
		}elif(containsKey(appliedPromotionDict,atoi(documentNumber)) and applied <> ""){
			resetAppliedPromoQuote = resetAppliedPromoQuote + documentNumber + ".!." + get(appliedPromotionDict,atoi(documentNumber)) + "!!!";
		}
		if(documentNumber<>"1"){
			promotionDiscount = 0.0;
			if(NOT isnull(applied) AND applied<>""){
				if( containsKey(promoApplicationdct, applied+"@DiscountPercent") AND isNumber(get(promoApplicationdct, applied+"@DiscountPercent") )){
					promotionDiscount = atof(get(promoApplicationdct,applied+"@DiscountPercent"));
				}			
				Approval = get(promoApplicationdct,applied+"@Approval");
				if(Approval == "TRUE" AND quoteType_temp <> "Auto-Renew"){
						appliedApproval = true;
				}
				
			/*	appliedPromo = bmql("select DiscountPercent, Approval from LinePromotions where PromoCode=$applied");
				for Promo in appliedPromo{
					promotionDiscount = getFloat(Promo, "DiscountPercent");
					Approval = get(Promo, "Approval");
					
					if(Approval=="TRUE"){
						appliedApproval = true;
					}
				} */
			}
			if(_system_current_step_var=="start_step" OR _system_current_step_var=="pending_process"){
				lineRes = lineRes + documentNumber + "~appliedPromotions_line~" + applied + "|";
			}
		}
		else{
			promotionDiscount = 0.0;	
		}
		
		if(_system_current_step_var=="start_step" OR _system_current_step_var=="pending_process"){
			lineRes = lineRes + documentNumber + "~promotionDiscountPercent_line~" + string(round(promotionDiscount,2)) + "|";
			lineRes = lineRes + documentNumber + "~approvalFlag_line~" + string(appliedApproval) + "|";
		}
	
		//arrayofDiscounts = float[];
		//append(arrayofDiscounts,promotionDiscount);
		strategicDiscountper = line.strategicDiscountPercent_line;
		maxDiscount = strategicDiscountper;
		if(promotionDiscount > maxDiscount)
		{
			maxDiscount = promotionDiscount;
		}
		if(lineDiscount == lineDiscountHidden){
			if(line.discountType_line == "%" OR line.discountType_line == ""){
				lineDiscount = maxDiscount;
				discountTypeperdoll = "%";
				lineDiscountHidden  = maxDiscount;
			}
			if(line.discountType_line == "Amt"){
				lineDiscountinDoller = line.listPrice_line * maxDiscount/100;
				lineDiscount = lineDiscountinDoller;
				lineDiscountHidden  = lineDiscountinDoller;
			}
		}	
		elif(lineDiscount <> lineDiscountHidden ){
			if(line.strategicDiscountPercent_line == 0.0){
				lineDiscount = lineDiscount;
			}
			else{
				if(line.discountType_line == "%" OR line.discountType_line == " "){
					if(lineDiscount < line.strategicDiscountPercent_line)
					{
						discountTypeperdoll = "%";
						lineDiscount = line.strategicDiscountPercent_line;
					}
					else{
						discountTypeperdoll = "%";
						lineDiscount = lineDiscount;
					}
				}
				elif(line.discountType_line == "Amt"){
					lineDiscountinDoller = line.listPrice_line * line.strategicDiscountPercent_line/100;
					if(lineDiscountinDoller > lineDiscount){
						lineDiscount = lineDiscountinDoller;
					}
					else{
							lineDiscountinDoller = line.listPrice_line * lineDiscount/100;
						lineDiscount = lineDiscountinDoller;
					}
				}
			}
		}
		//LEAP-8922 //CRM-846
		if(appliedApproval == true AND (lineType == "add" OR lineType == "renew") AND isSpecialAdvantage == false){
				if(find(applied,"ADVANTAGEPROBRIDGING") <> -1){
					append(approvalReasonArray,"AdvantageBridging");
				}
				else
				{
					append(approvalReasonArray,"AppliedPromotion");
				}
		}
		lineDiscountPercentage = 0;
		if(line.discountType_line == "%" OR line.discountType_line == ""){
			lineDiscountPercentage = line.override_line;
		}
		if(line.discountType_line == "Amt" AND line.listPrice_line <> 0){
			//lineDiscountPercentage = line.listPrice_line * line.override_line/100;
			lineDiscountPercentage = (100 * line.override_line)/line.listPrice_line; //LEAP-7755
		}
		//CRM-846
		if(round(lineDiscountPercentage,2) > round(maxDiscount,2) AND isSpecialAdvantage == false AND quoteType_temp <> "Auto-Renew")
		{
			append(approvalReasonArray,"LineDiscount");
			if(applied == "C21BRKRSHOWCASE"){
				put(c21LineDiscDict, line._document_number + "**C21BRKRSHOWCASE",  string(round(lineDiscountPercentage,2)) + "**" + string(strategicDiscountper));
			}
		}
		if(lineType <> "")
		{
			if((lineType == "credit" OR lineType == "cancel") AND line.refundRequest_line == true)
			{
				append(approvalReasonArray,"RefundCredit");
			}
			elif(lineType == "credit")
			{
				append(approvalReasonArray,"LineActioncredit");
			}
			if((lineType == "credit" OR  (lineType == "cancel" AND line.creditAmount_line <> 0.0)) AND creditDispute_quote)
			{
				append(approvalReasonArray,"CreditDispute");
			}
			if(lineType == "amend" OR lineType == "credit")
			{
				
				diffInDays = 0;
				contractTermFromAsset = 0;
				assetQty = 0;
				if(line.assetDetails_line <> "")
				{
					//assetArray 	= split(line.assetDetails_line, FIELD_DELIM);
					if(isNumber(assetArray[OVERRIDER_CONTRACT_TERM_INDEX])){
					contractTermFromAsset = integer(atof(assetArray[OVERRIDER_CONTRACT_TERM_INDEX]));
					}
					if(isNumber(assetArray[CONTRACT_TERM_INDEX]) AND contractTermFromAsset == 0)
					{
						contractTermFromAsset = integer(atof(assetArray[CONTRACT_TERM_INDEX]));
					}
					if(isNumber(assetArray[QTY_INDEX]))
					{
						assetQty = integer(atof(assetArray[QTY_INDEX]));
					}
				}
				sameMonth = false;
				if(line.contractStartDate_l <> "")
				{
					dateFormat = strtodate(line.contractStartDate_l, "yyyy-MM-dd");
					startDateArray = split(datetostr(dateFormat ,"dd/MM/yyyy"),"/"); // Converting the yyyy-MM-dd format of date to dd/MM/yyyy
					todayDateArray = split(datetostr(getdate() ,"dd/MM/yyyy"),"/");
					if(startDateArray[1] == todayDateArray[1] AND startDateArray[2] == todayDateArray[2])//check year and month to be same.
					{
						sameMonth = true;
					}
					//diffInDays = getdiffindays(getdate(), strtojavadate(line.contractStartDate_l, "yyyy-MM-dd"));
				}
				//diffInDays > 30
				if(sameMonth == false AND contractTermFromAsset > ContractTerm AND assetOverrideTermFlag == false)// need to add one more condition for contract term
				{
					append(approvalReasonArray,"TermReduction");
				}
				if(qty < assetQty)
				{
					append(approvalReasonArray,"AssetQtyReduced");
				}
				
			}
			elif(lineType == "cancel" AND line.cancellationReason_line <> "nonPayment")
			{
				append(approvalReasonArray,"LineAction" + lineType);
			}
			elif(isSpecialAdvantage == false){//CRM-846
				append(approvalReasonArray,"LineAction" + lineType);
			}
			/* if(lineType == "add" AND line.overrideTerm_line > 0)
			{
				append(approvalReasonArray,"TermOverride");
			} */
			//LEAP-8924 //CRM-846
			if((lineType == "add" OR lineType == "renew") AND line.overrideTerm_line > 0 AND isSpecialAdvantage == false)
			{
				append(approvalReasonArray,"TermOverride");
				
			}elif(lineType == "amend" OR lineType == "credit" AND line.assetDetails_line <> ""){
				//assetArray 	= split(line.assetDetails_line, FIELD_DELIM);
				if(isNumber(assetArray[OVERRIDER_CONTRACT_TERM_INDEX])){
					override_ContractTerm = integer(atof(assetArray[OVERRIDER_CONTRACT_TERM_INDEX]));
					 if(assetOverrideTermFlag){
						 print "No OverrideTerm";
					 }
					elif(integer(atof(assetArray[OVERRIDER_CONTRACT_TERM_INDEX])) <> line.overrideTerm_line){
						append(approvalReasonArray,"TermOverride");
					}
				}elif(assetArray[OVERRIDER_CONTRACT_TERM_INDEX] == "" AND line.overrideTerm_line > 0){
					if(assetOverrideTermFlag){
						 print "No OverrideTerm";
					}else{
						append(approvalReasonArray,"TermOverride");
					}
				}
			}
		}
		if(lineType == "add" AND billingPreference_quote <> "CC-Direct" AND line._part_custom_field13 == "true")
		{
			totalForCreditCheck = totalForCreditCheck + line.totalNet_line;
		}
		/* if(lineType == "credit" AND partNumber == "COBROKE")
		{
			totalForExcessiveCFCBCredit = totalForExcessiveCFCBCredit + line.creditAmount_line;
		} */
		//LEAP-8922
		if((lineType == "credit" OR lineType == "cancel") AND line._part_custom_field13 == "true" AND billingPreference_quote <> "CC-Direct")
		{
			totalForExcessiveCFCBCredit = totalForExcessiveCFCBCredit + line.creditAmount_line;
		}
		if(line.extendDays_line > 0 AND line.extensionType_line == "unpaid")
		{
			append(approvalReasonArray,"FreeExtension");
		}
		if(supressHLCapproval_quote == false AND line.hLC_line > line.hlcOverride_line AND line.hlcOverride_line > 0)
		{
			contractHLCOverRide = 0;
			contractHLC = 0;
			if(line.assetDetails_line <> "")
			{
				//assetArray 	= split(line.assetDetails_line, FIELD_DELIM);
				if(isNumber(assetArray[HLCOVERRIDE_INDEX]))
				{
					contractHLCOverRide = integer(atof(assetArray[HLCOVERRIDE_INDEX]));
				}
				if(isNumber(assetArray[HLC_INDEX]))
				{
					contractHLC = integer(atof(assetArray[HLC_INDEX]));
				}
			}
			if(lineType == "add" OR lineType == "renew")
			{
				append(approvalReasonArray,"HLCOverRide");
			}
			elif ((lineType == "amend" OR lineType == "credit") AND (line.hLC_line <> contractHLC OR line.hlcOverride_line <> contractHLCOverRide))
			{
				append(approvalReasonArray,"HLCOverRide");
			}
		}
		/*if((line.aMLCOverride_line > 0 OR line.pPLOverride_line > 0) AND (lineType == "add" OR lineType == "renew") AND suppressAMLCPPLOverrideApproval_quote == false)
		{
			append(approvalReasonArray,"AMLCPPLOverride");
		}*/
		/* if(line.listPriceOverride_line > 0 AND (listPrice > line.listPriceOverride_line OR line._part_custom_field9 <> "Tigerleads") AND (lineType == "add" OR lineType == "renew"))
		{
			append(approvalReasonArray,"ListPriceOverride");
		} */
		//LEAP-8924 //CRM-846
		if(line.listPriceOverride_line > 0.0 AND (listPrice > line.listPriceOverride_line) AND (lineType == "add" OR lineType == "renew") AND isSpecialAdvantage == false)
		{
			append(approvalReasonArray,"ListPriceOverride");
		}elif(lineType == "amend" OR lineType == "credit"){
			//assetArray 	= split(line.assetDetails_line, FIELD_DELIM);
			if(isNumber(assetArray[LSIT_PRICE_OVERRIDE_INDEX])){
				assetListPriceOverride = integer(atof(assetArray[LSIT_PRICE_OVERRIDE_INDEX]));
				if( assetListPriceOverride <> 0 AND line.listPriceOverride_line > 0 AND assetListPriceOverride > line.listPriceOverride_line ){
					append(approvalReasonArray,"ListPriceOverride");
				}elif(assetListPriceOverride == 0 AND line.listPriceOverride_line > 0.0  AND listPrice > line.listPriceOverride_line){
					append(approvalReasonArray,"ListPriceOverride");
				}
			}elif(assetArray[LSIT_PRICE_OVERRIDE_INDEX] == ""  AND line.listPriceOverride_line > 0.0  AND listPrice > line.listPriceOverride_line){
				append(approvalReasonArray,"ListPriceOverride");
			}
		}
		if(line.leadType_line == "Fast" AND find(line.assetDetails_line,"#Flex") > -1)
		{
			append(approvalReasonArray,"CfCBFlexToFastDowngrade");
		}
		elif(lineType == "amend" OR lineType == "credit")
		{
			//assetArray 	= split(line.assetDetails_line, FIELD_DELIM);
			if(isNumber(assetArray[HLCOVERRIDE_INDEX]))
			{
				contractHLCOverRide = integer(atof(assetArray[HLCOVERRIDE_INDEX]));
			}
		}
		if(line.assetFlag_l == false){
			if(line.contractStartDate_l == "")
			{
				//mm/dd/yyyy to yyyy-MM-dd
				currentStartDateArray = split(getstrdate()," ");
				startDateArray=split(currentStartDateArray[0],"/");
				startDate = startDateArray[2]+"-"+startDateArray[0]+"-"+startDateArray[1];	
				endDate = util.calculateContractEndDate(startDate, ContractTerm);
			}
			else{
				startDate = line.contractStartDate_l;
				endDate = util.calculateContractEndDate(startDate, ContractTerm);
			}	
		}else{//asset line
			if(lineType == "renew"){
				if(line.assetDetails_line <> "")
				{
					//assetArray = split(line.assetDetails_line, FIELD_DELIM);
					
					subscriptionStartDate = datetostr(util.salesforceStringToJavaDate(assetArray[SUBSCRIPTION_END_DATE_INDEX]),"yyyy-MM-dd");
					startDate = subscriptionStartDate;
					subscriptionEndDate = util.calculateContractEndDate(subscriptionStartDate, ContractTerm);
					endDate = datetostr(minusdays(strtodate(subscriptionEndDate,"MM/dd/yyyy"),1),"yyyy-MM-dd");
					lineRes = lineRes + documentNumber + "~subscriptionEndDate_line~" + subscriptionEndDate + "|"
									  + documentNumber + "~subscriptionStartDate_line~" + subscriptionStartDate + "|";
				}
			}
		}

		//Cancellation Effective date
		cancellationDate = line.cancellationDate_line;
		//modify cancellation date of yyyy-MM-dd format to MM/dd/yyyy format
		if(cancellationDate <> "" AND find(cancellationDate, "-") <> -1){
			cancellationDateVal = split(cancellationDate," ");
			cancellationDateArray=split(cancellationDateVal[0],"-");
			cancellationDate = cancellationDateArray[1]+"/"+cancellationDateArray[2]+"/"+cancellationDateArray[0];
		}
			
		if(lineType == "cancel" OR lineType == "buyout"){
			//set cancellation date first time when user clicks cancel
			if(cancellationDate == ""){
				cancellationDateVal = split(getstrdate()," ");
				cancellationDateArray=split(cancellationDateVal[0],"/");
				//cancellationDate in MM/dd/yyyy format
				cancellationDate = cancellationDateArray[0]+"/"+cancellationDateArray[1]+"/"+cancellationDateArray[2];				
			}
			lineRes = lineRes + documentNumber + "~cancellationDate_line~" + cancellationDate + "|";
		}

		//Reset back the cancellation date when user clicks any action other than cancel
		assetStructure = "";
		if(containsKey(assetStructureDict,line._parent_doc_number))
		{
			assetStructure = get(assetStructureDict,line._parent_doc_number);
		}
		if(isNull(assetStructure) == false AND assetStructure <> "")
		{
			assetStructure = replace(assetStructure,"HLCOverrideValue",string(line.hlcOverride_line));
		}
		else
		{
			actionType = "NoChange";
			if(line.assetID_l == "")
			{
				actionType = "Add";
			}
			if(lineType == "amend" OR lineType == "buyout" OR lineType == "credit")
			{
				actionType = "Modify";
			}
			elif(lineType == "cancel")
			{
				actionType = "Remove";
			}
			if(line.originalAssetStructure_line <> "")// originalAssetStructure_line will be populated from sfdc webservice
			{
				//assetArray = split(line.assetDetails_line, FIELD_DELIM);
				assetStatus = assetArray[ASSET_STATUS_INDEX];
				if(assetStatus == "Cancelled" OR lineType == "cancel" OR lineType == "buyout")
				{
					actionType = "Remove";
				}
				elif(lineType == "renew")
				{
					actionType = "NoChange";
				}
				/*elif(lineType == "cancel" OR lineType == "buyout")
				{
					actionType = "Remove";
				}*/
				elif(lineType == "amend" OR lineType == "credit" OR lineType == "reinstate")
				{
					actionType = "Modify";
				}
				assetStructure = replace(line.originalAssetStructure_line,"$actionType$",actionType);
			}
			else
			{
				assetStructure = replace(inventoryAssetStructure,"$actionType$",actionType);
			}
			//assetStructure = replace(inventoryAssetStructure,"$actionType$",actionType);
			assetStructure = replace(assetStructure,"$parentAccountId$",_transaction_customer_id);
			if(line._part_custom_field9 == "Tigerleads" OR line._part_custom_field1 == "InventoryLeads" OR line._part_number == "SELLERLEAD" OR line._part_number == "SELLERLEADBUNDLE")
			{
				assetStructure = replace(assetStructure,"$FulfillToaccountId$",_transaction_customer_id);
			}
			else
			{
				if(line.selectedOffice_line == "blank")
				{
					assetStructure = replace(assetStructure,"$FulfillToaccountId$","");
				}
				else
				{
					assetStructure = replace(assetStructure,"$FulfillToaccountId$",line.selectedOffice_line);
				}
			}
			assetStructure = replace(assetStructure,"$assetId$",line.assetID_l);
			//assetStructure = "";
		}
		
		
		/*allowedConTerm=commerce.getAllowedContractTerm(partNumberArray,pricingMethodArray);
		if(containskey(allowedConTerm, partNumber)){
			contrctTermAllowed = get(allowedConTerm, partNumber);
		}
		else{
			contrctTermAllowed = "";
		}*/
		
		//lineRes = lineRes + documentNumber + "~override_line~" + string(lineDiscount) + "|"
		//lineRes = lineRes + documentNumber + "~overrideHidden_line~" + string(lineDiscountHidden) + "|"
		//lineRes = lineRes + documentNumber + "~promotionDiscountPercent_line~" + string(promotionDiscount) + "|"
		if(lineType <> "add"){
			lineRes = lineRes + documentNumber + "~contractStartDate_l~" + startDate + "|";
			if(lineType <> "amend" AND lineType <> "credit")
			{
				lineRes = lineRes + documentNumber + "~contractEndDate_l~" + endDate + "|";
			}
		}elif((line._part_number == "ADVANTAGE" OR line._part_number == "TRKPHNMBR") AND lineType == "add" AND line._parent_doc_number <> ""){ // StartDate And EndDate of Advantage product or Line type "Add".
			sunsetMigrationStr = getconfigattrvalue(line._parent_doc_number,"sunsetMigrationString");
			//sunsetMigrationStr = "SHOWCASE$$$Showcase^_^ADVANTAGE$$$Pro!^!ADVANTAGE$$$Brand!^!TRKPHNMBR$$$Standard^_^02im0000000tqlLAAQ$$$20150919$$$20160918$$$20160920";
			 if(sunsetMigrationStr <> "" AND sunsetMigrationStr <> "null" AND NOT(isnull(sunsetMigrationStr)) ){
				sunsetMigrationStrArray = split(sunsetMigrationStr,"^_^");
				assetDataStr = sunsetMigrationStrArray[2];
				if(assetDataStr <> "" AND assetDataStr <> "null" AND NOT(isnull(assetDataStr))){
					sunsetMigrationStrArr = split(assetDataStr,"$$$");
					if(sizeofarray(sunsetMigrationStrArr) > 3){
						startDateStr = sunsetMigrationStrArr[3];
						if(startDateStr <> "" AND NOT(isnull(startDateStr)) AND startDateStr <> "null"){
							startDate_adv = substring(startDateStr,0,4) + "-" + substring(startDateStr,4,6) + "-" + substring(startDateStr,6,8);
							adv_endDateStr = "";
							endDate_adv = "";
							if(startDate_adv <> "" AND NOT(isnull(startDate_adv)) AND startDate_adv <> "null"){
									adv_endDate = util.calculateContractEndDate(startDate_adv,ContractTerm);
									endDate_adv = datetostr(minusdays(strtodate(adv_endDate,"MM/dd/yyyy"),1),"yyyy-MM-dd");
							}else{
								endDate_adv = datetostr(util.salesforceStringToJavaDate(adv_endDateStr),"yyyy-MM-dd");
							}
							lineRes = lineRes + documentNumber + "~contractStartDate_l~" + startDate_adv + "|";
							lineRes = lineRes + documentNumber + "~contractEndDate_l~" + endDate_adv + "|";
						}
					}  
				}
			} 
		}
		lineRes = lineRes + documentNumber + "~assetStructure_line~" + assetStructure + "|";
						  //+ documentNumber + "~allowedContractTerm_line~" + contrctTermAllowed + "|";
	}
	
	//Strategic Discount
	//if(len(dateType)>0){
	
		EffDateInt = 0;
		
		if(isNumber(EffDate))
		{
			EffDateInt = atoi(EffDate);
		}
		any = "ANY";
		All = "ALL";
		accountType = accountType_quote;
		promoCode = "";
		splitBillAmt = 0.0;
		StrategicDiscountSet = bmql("select AccountType,PromoCode, SplitBillAmount, DiscountPercent, DiscountAmt from StrategicDiscount where (AccountType = $All or AccountType = $accountType) and PartNumber=$partNumber and (ProductType=$productType or ProductType=$any) and Franchise=$franchise and DateFrom<=$EffDateInt and DateTo>=$EffDateInt");
		/*print "StrategicDiscountSet";
		print StrategicDiscountSet;*/
		for StrategicDiscount in StrategicDiscountSet{
			accountTypeArr = string[];
			accountTypeArr = split(get(StrategicDiscount,"AccountType"),",");
			//print discountPercent;
			if(findinarray(accountTypeArr,"ALL") <> -1 AND findinarray(accountTypeArr,accountType) == -1){
				promoCode = get(StrategicDiscount,"PromoCode");
				discountPercent = getfloat(StrategicDiscount, "DiscountPercent");
				discountAmt = getfloat(StrategicDiscount, "DiscountAmt");
				splitBillAmt = getfloat(StrategicDiscount, "SplitBillAmount");
			}
			elif(findinarray(accountTypeArr,"ALL") == -1 AND findinarray(accountTypeArr,accountType) <> -1){
				promoCode = get(StrategicDiscount,"PromoCode");
				discountPercent = getfloat(StrategicDiscount, "DiscountPercent");
				discountAmt = getfloat(StrategicDiscount, "DiscountAmt");
				splitBillAmt = getfloat(StrategicDiscount, "SplitBillAmount");
			}
			
			if(discountPercent == 0){
				if(listPrice == 0 ){
					discountPercent = 100;
				}
				else{
					discountPercent = (discountAmt/listPrice)*100;
				}
			}
			else{
				discountAmt = discountPercent*(.01)*listPrice;
			}
			if(line.discountType_line=="Amt" AND (line.override_line<discountAmt OR line.override_line>listPrice)){
				lineRes = lineRes + documentNumber + "~override_line~" + string(discountAmt) + "|";
			}
			elif(line.discountType_line=="%" AND (line.override_line<discountPercent OR line.override_line>100)){
				lineRes = lineRes + documentNumber + "~override_line~" + string(discountPercent) + "|";	
			}
			
			//Write Strategic Discount to transaction Line
			lineRes = lineRes + documentNumber + "~strategicDiscount_line~" + promoCode + "|";
			lineRes = lineRes + documentNumber + "~strategicDiscountPercent_line~" + string(round(discountPercent,2)) + "|";
			lineRes = lineRes + documentNumber + "~strategicDiscountAmount_line~" + string(round(discountAmt, 2)) + "|";
			lineRes = lineRes + documentNumber + "~franchiseAmount_line~" + string(round(splitBillAmt*line.hLC_line,2)) + "|";
			break;
		}
	//}
	if(line.assetID_l <> "" AND linesHasAssetId == false)
	{
		linesHasAssetId = true;
	}
	
	
	lineResult = lineResult + lineRes;
}
if(resetAppliedPromoQuote <> ""){
	result = result + "1~appliedPromotions_quote~"+resetAppliedPromoQuote+"|";
}
result = result + lineResult;
result = result + tlRetStr;

promoDocumentDict = Dict("string");
//Promo Description
for eachPromotion in promotionSet{
	promotionArr = split(eachPromotion,".!.");
	if(NOT(isnull(promotionArr[0])) AND promotionArr[0] <> ""){
		//append(docNumArr,promotionArr[0]);
		//append(promoCodeArr,promotionArr[1]);
		put(promoDocumentDict,promotionArr[0],promotionArr[1]);
	}
}
promoCodeArr = values(promoDocumentDict);
promoDescriptionSet = bmql("select PromoCode,PromoDescription from LinePromotions where PromoCode in $promoCodeArr");
for promoDescription in promoDescriptionSet{
	promoDescriptionLine = get(promoDescription, "PromoDescription");
	promoCode = get(promoDescription, "PromoCode");
	put(promoDescMap,promoCode,promoDescriptionLine);
}

for docNum in docNumArr{
	promoDescription = "";
	if(containsKey(promoDocumentDict,docNum) AND containsKey(promoDescMap,get(promoDocumentDict,docNum))) {
		promoDescription = get(promoDescMap,get(promoDocumentDict,docNum));
	}
	promoRes = promoRes + docNum + "~promoDescription_line~" + promoDescription + "|";
}

result = result + promoRes;

// -----------------------------------------------Approval logic start---------------------------------------------
//get approver description
/*if(restrictedProducts AND (accountType_quote == "Realtor Agent" OR accountType_quote == "Agent Team"))
{
	append(approvalReasonArray,"RestrictedProducts");
}*/
if(totalForCreditCheck > 25000)
{
	append(approvalReasonArray,"CreditCheck");
}
if(totalForExcessiveCFCBCredit > 25000)
{
	append(approvalReasonArray,"ExcessiveCFCBCredit");
}
if(suppressDocuSign_quote AND find(_system_user_groups,"salesUser") <> -1)
{
	append(approvalReasonArray,"SupressDocusign");
}
lostRevenue = lostRevenue_quote;//LEAP-8909
if(lostRevenuePricing < lostRevenue)
{
	lostRevenue = lostRevenuePricing;
}
if(lostRevenue < 0)
{
	lostRevenue = lostRevenue * -1;
}
//CRM-846

if(lostRevenue > 0 OR (totalOverrideDelta > 0 AND advantageOverrideDelta <> totalOverrideDelta))
{
	append(approvalReasonArray,"LineDiscount");
}
descriptionString = "";// used to show in HTML and Email Template
specialDescriptionArray = string[];
lineItemDiscountDesc = "";
userNames = "";
specialUserNames = string[];
levelString = "";
financeLevel = "";
specialLevelString = "";
financeUserName = "";
financeDescriptionString = "";
financeFirstApprover = "";
financeLevelNo = 1;
if(quoteType_temp <> "Backout" AND NOT(cancellationFlag) AND NOT(isBDXQuote))//CRM-1567
{
	// get approval descriptions and special/finance approver
	descriptionResult = bmql("select Description,ApprovalName,SpecialApprover,FinanceApprover from ApprovalDesc where ApprovalName in $approvalReasonArray");
	for eachDesc in descriptionResult
	{
		if(get(eachDesc,"ApprovalName") == "LineDiscount")
		{
			lineItemDiscountDesc = get(eachDesc,"Description");
		}
		if(descriptionString <> "")
		{
			descriptionString = descriptionString + "$";
		}
		descriptionString = descriptionString + get(eachDesc,"Description");
		if(get(eachDesc,"SpecialApprover") <> "")
		{
			if(specialLevelString == "")
			{
				specialLevelString = "SpecialApproval";
			}
			append(specialUserNames,get(eachDesc,"SpecialApprover"));
			append(specialDescriptionArray,get(eachDesc,"Description"));
		}
		if(get(eachDesc,"FinanceApprover") <> "")
		{
			financeFirstApprover = get(eachDesc,"FinanceApprover");// assuming there will be same first finance approver in ApprovalDesc table
			if(financeDescriptionString <> "")
			{
				financeDescriptionString = financeDescriptionString + "$";
			}
			financeDescriptionString = financeDescriptionString + get(eachDesc,"Description");
		}
	}
}
//get sales approver

firstLevelApprover = false;
systemAdminApprovalRequired = false;
if(descriptionString <> "")
{
	approverLevels = range(6);
	approverPosition = "";
	approvalLimitDatatable = 0;
	////Added as part of CRM 1933
	discounts = totalLineItemDiscounts_quote;
	if (isEligibleForSpecialApproval == true)
	{
		totalOverrideDelta = totalOverrideDelta - advantageOverrideDelta;
		discounts = discounts - advantagelinediscount;
	}
	approvalLimit = discounts + lostRevenue + totalCredits_quote + totalOverrideDelta;//refundRequestedTotal_quote;
	//End of Added as part of CRM 1933
	/*if(approvalLimit < 0)
	{
		approvalLimit = approvalLimit * -1;//LEAP-8117
	}*/
	submitterDataExist = false;
	approverDataExist = false;
	for eachLevel in approverLevels
	{
		if(approverPosition == "")
		{
			approverResult = recordset();

			if(NOT lineTypeAddOrRenewExist AND find(_system_user_groups,"accountManager") <> -1)
			{
				approverResult = bmql("select ParentPosition,approvalLimit from ApprovalTrigger where Type = 'Sales' AND UserName = $_system_user_login");// get Parent for current logged in user
			}
			else
			{
				approverResult = bmql("select ParentPosition,approvalLimit from ApprovalTrigger where Type = 'Sales' AND Position like $quoteOwnerId_quote");// get the quote account owner's records
			}
			/*if(lineTypeAddOrRenewExist AND find(_system_user_groups,"accountManager") <> -1 AND salesTeam_quote <> "")
			{
				name = split(trim(salesTeam_quote)," ");
				firstName = name[0];
				lastName = name[1];
				approverResult = bmql("select ParentPosition,approvalLimit from ApprovalTrigger where Type = 'Sales' AND FirstName = $firstName AND LastName = $lastName");// get the quote account owner's records
			}
			else
			{
				approverResult = bmql("select ParentPosition,approvalLimit from ApprovalTrigger where Type = 'Sales' AND UserName = $_system_user_login");// get Parent for current logged in user
			}*/
			for eachApprover in approverResult
			{
				approverPosition = get(eachApprover,"ParentPosition");
				//approvalLimitDatatable = getFloat(eachApprover,"approvalLimit");
				approvalLimitDatatable = 0.1;// setting it to 0.1 for submitter as any submitter can not approve their own quote.
				submitterDataExist = true;
				break;
			}
		}
		else
		{
			approverResult = bmql("select ParentPosition,UserName,approvalLimit from ApprovalTrigger where Type = 'Sales' AND Position = $approverPosition");// get UserLogin and Parent for current Position
			approverPosition = "";
			for eachApprover in approverResult
			{
				approverDataExist = true;
				if((approvalLimit > approvalLimitDatatable AND (approvalLimitDatatable > 0 OR approvalLimit > 0)) OR firstLevelApprover == false)// check limit and get Approvers or get at least first level approver for sales approval other than discount
				{
					userName = get(eachApprover,"UserName");
					spclIndex = findinarray(specialUserNames,userName);
					if(spclIndex <> -1)// remove approver from special approval if present in sales approval
					{
						remove(specialDescriptionArray,spclIndex);
						remove(specialUserNames,spclIndex);
					}
					if(levelString <> "")
					{
						levelString = levelString + "$";
						userNames = userNames + "$";
					}
					if(firstLevelApprover == false)
					{
						firstLevelApprover = true;
						if(approvalLimit < approvalLimitDatatable AND lineItemDiscountDesc <> "")// approvalLimitDatatable set to 0.1 in first query because for 0 discount desc will be blank and line discount approval will not fire.
						{
							descriptionString = replace(descriptionString,lineItemDiscountDesc,"");
						}
					}
					if(descriptionString <> "")
					{
						approverPosition = get(eachApprover,"ParentPosition");
						levelString = levelString + "L" + string(eachLevel);
						userNames = userNames + get(eachApprover,"UserName");
					}
					approvalLimitDatatable = getFloat(eachApprover,"approvalLimit");// for next check
				}
			}
		}
		if(approverPosition == "")
		{
			break;
		}
	}
	if(submitterDataExist == false)// || approverDataExist == false
	{
		systemAdminApprovalRequired = true;
	}
}
specialApproverString = "";
specialDescriptionString = "";
if(sizeofarray(specialUserNames) > 0)
{
	specialApproverString = replace(getarrayattrstring(specialUserNames),"$,$","$");
	specialDescriptionString = replace(getarrayattrstring(specialDescriptionArray),"$,$","$");
}
else{
	specialLevelString = "";
}
financeApproverLevels = range(6);
financePosition = "";
refundTotal = refundRequestedTotal_quote;
approvalLimitForFinanceDatatable = 0;
for eachLevel in financeApproverLevels
{
	if(financeFirstApprover <> "")
	{
		approverResult = recordset();
		if(financePosition == "")
		{
			approverResult = bmql("select ParentPosition,UserName,approvalLimit from ApprovalTrigger where Type = 'Finance' AND UserName = $financeFirstApprover");
		}
		else
		{
			approverResult = bmql("select ParentPosition,UserName,approvalLimit from ApprovalTrigger where Type = 'Finance' AND Position = $financePosition");
		}
		//approverResult = bmql("select ParentPosition,UserName,approvalLimit from ApprovalTrigger where Position = $financeFirstApprover");
		recordRead = false;
		financePosition = "";
		for eachApprover in approverResult
		{
			recordRead = true;
			if(approvalLimitForFinanceDatatable < refundTotal)
			{
				approvalLimitForFinanceDatatable = getfloat(eachApprover,"approvalLimit");
				financePosition = get(eachApprover,"ParentPosition");
				approver = get(eachApprover,"UserName");
				if(financeLevel <> "")
				{
					financeLevel = financeLevel + "$";
					financeUserName = financeUserName + "$";
				}
				financeLevel = financeLevel + "FinanceApprovalLevel" + string(financeLevelNo);
				financeUserName = financeUserName + approver;
				financeLevelNo = financeLevelNo + 1;
			}
			else
			{
				break;
			}
		}
		if(recordRead == false OR financePosition == "")
		{
			break;
		}
	}
	else
	{
		break;
	}
}
productExclusionGrp = "";
productExclusionLevel = "";
if(restrictedProducts)
{
	productExclusionGrp = "exclusionApprovalGroup";
	productExclusionLevel = "productExclusionLevel";
}
levelString = levelString + "^_^" + specialLevelString + "^_^" + productExclusionLevel + "^_^" + financeLevel;
userNames = userNames + "^_^" + specialApproverString + "^_^" + productExclusionGrp + "^_^" + financeUserName;
descriptionString = descriptionString + "^_^" + specialDescriptionString + "^_^" + financeDescriptionString;
//Added below code for CRM-1933
if(isEligibleForSpecialApproval ){
	levelString = "L0$"+levelString;
	userNames = "jevinchase$"+userNames;
	descriptionString = "Approval Required for Special Advantage pricing$" + descriptionString;
}
//End of Added below code for CRM-1933
approverString = levelString + "#" + userNames;

//CRM-846 CRM-1933 Commented below
/*if(isEligibleForSpecialApproval ){
	if (approverString == "^_^^_^^_^#^_^^_^^_^")
	{
		//approverString = "L0^_^^_^^_^#jevinchase^_^^_^^_^";
		descriptionString = "Approval Required for Special Advantage pricing"+"^_^"+"^_^";
	}
	else
	{
		approverString = "L0$"+approverString;
		approverStringarray = split(approverString,"^_^^_^^_");
		approverString = approverStringarray[0]+"^_^^_^^_^#jevinchase$"+approverStringarray[1];
		descriptionString = descriptionString + "Approval Required for Special Advantage pricing"+"^_^"+"^_^";
	}
	//descriptionString = "Approval Required for Special Advantage pricing"+"^_^"+"^_^";
}*/

if((linesHasAssetId AND quoteType_temp == "New") OR (quoteType_temp == "Modify" AND quoteType_quote == "Auto-Renew"))
{
	result = result + "1~quoteType_quote~" + "Modify" + "|";
}
elif(linesHasAssetId == false AND quoteType_temp == "Modify")
{
	result = result + "1~quoteType_quote~" + "New" + "|";
}

if(authorizationSFDCDateString_quote <> "")
{
	dt = substring(authorizationSFDCDateString_quote,0,10);
	authDate = datetostr(util.salesforceStringToJavaDate(dt));
	result = result + "1~authorizationDate_quote~"+ authDate + "|";
}
preAuthInvPoolValidationRequired = false;
preAuthInvPoolQuote = preAuthInvPoolQuote_quote;
if(invPoolNonPreAuthFlag AND invPoolPreAuthFlag) 
{
	preAuthInvPoolValidationRequired = true;
}
if(preAuthInvPoolQuote == false AND invPoolPreAuthFlag)
{
	preAuthInvPoolQuote = true;
}
if(actionName == "request approval" and approverString <> "^_^^_^^_^#^_^^_^^_^")
{
	quoteInputs = dict("string");
	put(quoteInputs,"status_t","Pending Approval");
	put(quoteInputs,"approvalTriggerString_quote",approverString);
	put(quoteInputs,"currentApprover_quote",currentApprover_quote);
	put(quoteInputs,"system_user_login",_system_user_login);
	put(quoteInputs,"system_user_groups",_system_user_groups);
	retVal = util.getNextApprover(quoteInputs);
	result = result + "1~nextApproverName_quote~" + retVal + "|";
}
/*if(actionName == "request approval" and restrictedProducts)
{
	result = result + "1~pendingApprovalGroup_quote~exclusionApprovalGroup|";
}*/
zuoraErrorFlag = false;
//print "nonUsageProductExists";
//print nonUsageProductExists;
if(nonUsageProductExists == false){//Kamal for CfS Broker
	prorationError = "";
}
elif(prorationError <> "")
{
	prorationError = "<b><font color='red'>Zuora has generated a pricing error. Please contact your SFDC Administrator</br></br>" + prorationError + "</font></b>";
	zuoraErrorFlag = true;
}
elif(prorationReviewNeeded)
{
	//prorationError = "<b><font color='green'>Please review amendment delta before submitting the quote</font></b>";
	prorationError = "";
}
if(inFlightAssetErrorMessage <> "" AND inFlightErrorFlag == false)
{
	if(prorationError <> "")
	{
		prorationError = prorationError + "</br></br>";
	}
	prorationError = prorationError + "<b><font color='red'>" + inFlightAssetErrorMessage + "</font></b>";
	inFlightErrorFlag = true;
}
elif(inFlightErrorFlag)
{
	if(prorationError <> "")
	{
		prorationError = prorationError + "</br></br>";
	}
	if(quoteType_temp == "Modify")
	{
		prorationError = prorationError + "<b><font color='red'>Inflight assets are cleared now!</br>Please delete below imported lines and click on Import Asset/add from catlog for non inventory products</br> " + inFlightAssetClearErrorMessage + " </font></b>";
	}
	else
	{
		prorationError = prorationError + "<b><font color='red'>Inflight assets are cleared now!</br>Please create another quote for further processing</font></b>";
	}
}
callToBIFailedFlag = false;
if(callToBIFailedErrorMsg <> "")
{
	if(prorationError <> "")
	{
		prorationError = prorationError + "</br></br>";
	}
	prorationError = prorationError + "<b><font color='red'>Call to BI failed</br>" + callToBIFailedErrorMsg + "</font></b>";
	callToBIFailedFlag = true;
}
//result = result + "1~transactionDescription_t~" + actionName + "|";
if((callToBIFailedFlag OR callToBIFailed_quote) AND (actionName == "request approval" OR actionName == "submit"))
{
	result = result + "1~status_t~Pending Admin Approval|";
	callToBIFailedFlag = true;
}
if(termErrorMessage <> ""){
	if(prorationError <> "")
	{
		prorationError = prorationError + "</br></br>";
	}
	prorationError = prorationError + "<b><font color='red'>" + termErrorMessage + "</font></b>";
}
zuoraCheckFlag = false;// Skiping to check net price for now
if(zuoraCheckFlag == true){
	zouraErrorMessage = commerce.getZouraSubNetPrice(zouraInputDict,docNumArrForZoura);
	if(zouraErrorMessage <> ""){
		if(prorationError <> "")
		{
			prorationError = prorationError + "</br></br>";
		}
		prorationError = prorationError + "<b><font color='red'>" + zouraErrorMessage + "</font></b>";
	}
}
salesOperationFlag = false;
if(zuoraErrorFlag == true OR inFlightErrorFlag == true){
	salesOperationFlag = true;
}
result = result + "1~hideMarketBudgetFee_quote~" + string(hideMarketBudgetFee) + "|"
				//+ "1~approvalTriggerString_quote~" + approverString + "|"
				+ "1~showcaseProductExists_t~" + string(showCaseProductExist) + "|"
				+ "1~turboProductExist_quote~" + string(turboProductExist) + "|"
				+ "1~productExclusionFlagForApproval_quote~" + string(restrictedProducts) + "|"
				+ "1~preAuthInvPoolValidationRequired_quote~" + string(preAuthInvPoolValidationRequired) + "|"
				+ "1~preAuthInvPoolQuote_quote~" + string(preAuthInvPoolQuote) + "|"
				+ "1~systemAdminApprovalRequiredForDataIssue_quote~" + string(systemAdminApprovalRequired) + "|"
				//+ "1~approvalDescriptionString_quote~" + descriptionString + "|"
				//+ "1~selectedMLSAssetFromConfig_quote~" + selectedMLSAssetFromConfig + "|"
				+ "1~tigerLeadProductExists_quote~"+string(tigerLeadProduct) + "|"
				+ "1~nonTigerLeadProductExist_quote~" + string(nonTigerLeadProduct) + "|"
				+ "1~currentDocumentNoForReconfigure_quote~" + string(0) + "|"
				+ "1~inventoryFlag_quote~" + string(inventoryFlag) + "|"
				//+ "1~prorationMessageText_quote~" + prorationError + "|"
				+ "1~zuoraError_quote~" + string(zuoraErrorFlag) + "|"
				//+ "1~callToBIFailed_quote~" + string(callToBIFailedFlag) + "|"
				//+ "1~inFlightErrorFlag_quote~" + string(inFlightErrorFlag) + "|"
				+ "1~hasTigerLeadProduct_quote~" + string(hasTigerLeadProduct) + "|"
				+ "1~dependantPartsFlag_quote~" + string(dependantPartFlag) + "|"
				+ "1~totalOverrideDelta_quote~" + string(totalOverrideDelta) + "|";
if(_system_current_step_var=="start_step" OR _system_current_step_var=="pending_process")
{
		result = result + "1~approvalTriggerString_quote~" + approverString + "|"
				+ "1~approvalDescriptionString_quote~" + descriptionString + "|"
				+ "1~inFlightErrorFlag_quote~" + string(inFlightErrorFlag) + "|"// update inflgith only for start or pending step
				+ "1~salesOperationFlag_quote~" + string(salesOperationFlag) + "|";
}

if(_system_current_step_var=="start_step" OR _system_current_step_var=="pending_process" OR callToBIFailedFlag)
{
	result = result + "1~prorationMessageText_quote~" + prorationError + "|";
}
//Unique line items string
if(lineItemStr <> ""){
	lineItemStr = substring(lineItemStr,0,-1);
}
result = result + "1~lineType_quote~" + lineItemStr + "|";

end_time = getcurrenttimeinmillis();
if( debug ){
	print "end_time";
	print end_time;
	print "performance test: "+string(end_time-start_time);
}
return result+proStr;