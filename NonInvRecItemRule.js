retVal = "";
descString ="";
commerceGroup = "";
parentsAssetsArray  = String[];
parentAssetIdArray = String[];
addToProductBundleArray = String[];
sentoCommerce_pPLOverride_adv = 0.0;
if(product <> "")
{
	dependentPartsSearch = "%" + product + "%";
	dependentPart = "";
	result = bmql("select part_number from _parts where custom_field4 like $dependentPartsSearch");
	for each in result{
		dependentPart = get(each, "part_number");
	}
	priceTier = "1";
	if(mSLTier_mls == "A")
	{
		priceTier = "2";
	}
	elif(mSLTier_mls == "B")
	{
		priceTier = "3";
	}
	elif(mSLTier_mls == "C")
	{
		priceTier = "4";
	}
	//overRideHLC = contractHLCOverride;//commented as per LEAP-5179
	//if(hLCOverride > 0)
	//{
	overRideHLC = hLCOverride;
	//}
	NarMembership = "NO";
	if(nar_Membership)
	{
		NarMembership = "YES";
	}
	 // added new attribute for CRM:1526
	sentoCommerce_pPLOverride_adv = pPLOverride_adv;
	if (decomissionedAssetID_adv <> ""){
	arrayStr = split(slectedPickPricingStringForAdvantage_adv, "$$");
	print arrayStr ;
	print arrayStr [5];
		//sentoCommerce_pPLOverride_adv = atof(arrayStr [5]);
	
	}
	//END : added sentoCommerce_pPLOverride_adv  variable value in below comment string.
	
	comment = string(totalHLC_mls) + "^_^" + mSLTier_mls + "^_^" + productType + "^_^" + string(licenseQuantity) + "^_^" + string(createBrokerTools) + "^_^" + string(featuredMortgage) + "^_^" + string(topConnector) + "^_^" + parentAssetId + "^_^" + lineAction + "^_^" + priceTier + "^_^" + string(overRideHLC) + "^_^" + NarMembership + "^_^" + licenseBucket + "^_^" + addToProductBundle + "^_^" + string(choiceLeadForm) + "^_^" + string(rESIDENTIALAMLCOVERRIDE_adv) + "^_^" + string(lANDAMLCOVERRIDE_adv) + "^_^" + string(rENTALAMLCOVERRIDE_adv) + "^_^" + string(cURRENTRESIDENTIALAMLC_adv) + "^_^" + string(cURRENTLANDAMLC_adv) + "^_^" + string(cURRENTRENTALAMLC_adv) + "^_^" + decomissionedAssetID_adv + "^_^" + slectedPickPricingStringForAdvantage_adv + "^_^" + string(sentoCommerce_pPLOverride_adv) + "^_^" + string(aMLCOverride_adv) + "^_^" + string(cURRENTLEADPPL_adv) + "^_^" + string(cURRENTBRANDPPL_adv)+ "^_^" + string(hideEffectivePrice_flag) ; 
	retVal = product + "~1~" +  comment;
	if(dependentPart <> "" AND lineAction == "add")
	{
		retVal = retVal + "|^|" + dependentPart + "~1~" +  comment;	
	}
}
return retVal;