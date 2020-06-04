/**
 * Add new property to the network
 * @param {org.landRegistry.network.addNewProperty} addNewProperty - Add New Property Transaction
 * @transaction
 */

async function addNewProperty(addNewProperty){
  
    //declare universal variables and get factory class
    console.log('Input Details', JSON.stringify(addNewProperty));
    var factory = getFactory();
    var NS = 'org.landRegistry.network';
    var me = getCurrentParticipant().getIdentifier();
    
   
    //Check the registry whether property with same propertyID is already listed on the platform
   
    var assetRegistry = await getAssetRegistry('org.landRegistry.network.Property')	
        console.log('Registry 1 Details', JSON.stringify(assetRegistry));
        var exists = await assetRegistry.exists(addNewProperty.propertyID)
         if(exists) {
              console.log('Property already registered on the platform!Can’t create duplicate entries.');
                return ;
          }
        
         var newProperty = factory.newResource(NS,'Property',addNewProperty.PID);  
      
        newProperty.owner = me;
         newProperty.registrationDate = addNewProperty.property.registrationDate;
          newProperty.propertyType = addNewProperty.property.propertyType;
          newProperty.location = addNewProperty.property.location;
          newProperty.public = addNewProperty.property.public;
          newProperty.private = addNewProperty.property.private;
          newProperty.marketPrice = addNewProperty.property.marketPrice;
          newProperty.intentForSale = addNewProperty.property.intentForSale;
          newProperty.status = addNewProperty.property.status; 
      
      console.log('New property successfully registered. The unique property ID is ' + newProperty.PID);
      
      return assetRegistry.add(newProperty);
  
  }
  
  
  
  
  
  /**
   * Add new property to the network
   * @param {org.landRegistry.network.intentForSale} intent - Add New Property Transaction
   * @transaction
   */
  
  async function intentForSale(intent){
  
    //declare universal variables and get factory class
    console.log('Input Details', JSON.stringify(intent));
    
    var factory = getFactory();
    var NS = 'org.landRegistry.network';
    var me = getCurrentParticipant().getIdentifier();
    var assetRegistry = await getAssetRegistry('org.landRegistry.network.Property');
    var propertyExists = await assetRegistry.exists(intent.property.propertyID);
    if(!propertyExists) {
      console.log('Cannot list a Property that does not exist');
      return ;
    }
    
    var propertyListing = intent.propertyListing;
    
    var newPropertyListing = factory.newResource(NS, 'PropertyListing', intent.property.propertyID);  
  
    newPropertyListing.owner = me;
    newPropertyListing.registrationDate = propertyListing.registrationDate;
    newPropertyListing.propertyType = propertyListing.propertyType;
    newPropertyListing.location = propertyListing.location;
    newPropertyListing.marketPrice = propertyListing.marketPrice;
    assetRegistry = await getAssetRegistry('org.landRegistry.network.PropertyListing');
    return await assetRegistry.add(newPropertyListing);
  }
  
  
  
  
  /**
   * Register a property to the buyer
   * @param {org.landRegistry.network.registerTransactedProperty} registry - Register a property to the buyer Transaction
   * @transaction
   */
  
  async function registerTransactedProperty(registry) {
      console.log('Input Details', JSON.stringify(registry));
    
    var factory = getFactory();
    var NS = 'org.landRegistry.network';
    var me = getCurrentParticipant().getIdentifier();
    var assetRegistry = await getAssetRegistry('org.landRegistry.network.Property');
    var propertyExists = await assetRegistry.exists(registry.PID);
    if(!propertyExists) {
      console.log('Cannot register a Property that does not exist');
      return ;
    }
    if(registry.buyer.accountDetails.bankBalance && (registry.buyer.accountDetails.bankBalance > registry.properyListing.marketPrice)) {
        var property = await assetRegistry.get(registry.PID);
      property.owner = registry.buyer.emailID;
      property.status = 'REGISTERED';
      console.log("Property: " + JSON.stringify(property));
      property = await assetRegistry.update(property);
          console.log("Property: " + JSON.stringify(property));
      var propertyListingRegistry = await getAssetRegistry('org.landRegistry.network.PropertyListing');
      var remove = await propertyListingRegistry.remove(registry.properyListing)
      return registry.PID;
    }
    console.log('Insufficient Balance with the Buyer');
    
  }
  