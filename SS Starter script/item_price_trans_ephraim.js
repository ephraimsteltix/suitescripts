/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/record','N/query','N/search'],
/**
 * @param{record} record
 * @param{query} query
 */
function(record,query,search) {
    
    /**
     * Function to be executed after page is initialized.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
     *
     * @since 2015.2
     */
    function pageInit(scriptContext) {
      //alert('Page has loaded');
    }

    /**
     * Function to be executed when field is changed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
     * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
     *
     * @since 2015.2
     */
    function postSourcing(context) {

      //var locationAddress=context.currentRecord;

      console.log("context id :",context.fieldId);



        if(context.sublistId==="item" && context.fieldId==="item"){
            var itemContext=context.currentRecord;
    
                    
                    
            var warehouseLocationId=itemContext.getValue({
                fieldId:'location'
            })

            console.log("locatin warehouse is :", warehouseLocationId);
            console.log("location field id :",context.fieldId)



            var itemName=itemContext.getCurrentSublistText({
                sublistId: 'item',
                fieldId: 'item',
            });
            var itemId=itemContext.getCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'item',
            });
            
            console.log("item selected is item: ",itemId);

            //------------------------------------------------------------
            

            if(itemId){
                console.log("item selected is item: ",itemId);
                    var myLoadedQuery=query.load({
                      id:'custdataset24'
                  })
                  var firstCondition=myLoadedQuery.createCondition({
                      fieldId:'id',
                      operator:query.Operator.ANY_OF,
                      values:[itemId]
                  });
              
                  function convertToMoney(val){
                    return (Math.floor(val*100).toFixed(0)/100).toFixed(2);
                }
    


                myLoadedQuery.condition=firstCondition;
                  var resultSet=myLoadedQuery.run();
              
                  var results=resultSet.results;
              
                  for(var i=0;i<results.length;i++){
                      var warehouseId=results[i].values[4];
                    
                      console.log("warehouse id from results :",warehouseId);
                      console.log("Warehouse from id :",warehouseLocationId);
                      if(warehouseId==warehouseLocationId){
                        console.log("warehouse Matched###########");
                          var averagePrice=results[i].values[3];
                          if(averagePrice==0){
                            alert("This item has average price of 0,Please fill it manually.");
                          }
                          //update sublist
                          else{
                            var averagecst=convertToMoney(averagePrice);

                         
                            console.log('Item average price is :',averagecst);
                            var setSublist=itemContext.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'rate',
                                value: averagecst,

                            });
                            //amount field is set as default
                            var setSublist=itemContext.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'amount',
                                value: averagecst,
                                ignoreFieldChange:true,
                                forceSyncSourcing: true

                            });

                            //description
                            var description=itemContext.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'description',
                                value: results[i].values[5],
                                ignoreFieldChange:true,
                                forceSyncSourcing: true
                            });

                            //department
                            var department=itemContext.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'department',
                                value: results[i].values[6],
                                ignoreFieldChange:true,
                                forceSyncSourcing: true
                            });

                            //class
                            var classs=itemContext.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'class',
                                value: results[i].values[7],
                                ignoreFieldChange:true,
                                forceSyncSourcing: true
                            });


                            //quantityavailable
                            var quantityAvail=itemContext.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'quantityavailable',
                                value: results[i].values[9],
                                ignoreFieldChange:true,
                                forceSyncSourcing: true
                            });

                            //quantityonhand
                            var quantityonhand=itemContext.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'quantityonhand',
                                value: results[i].values[8],
                                ignoreFieldChange:true,
                                forceSyncSourcing: true
                            });

                            //quantity
                            var quantity=itemContext.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'quantity',
                                value:1,
                                ignoreFieldChange:true,
                                forceSyncSourcing: true
                            });

                            //units
                            var unitss=itemContext.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'units',
                                value: results[i].values[10],
                                ignoreFieldChange:true,
                                forceSyncSourcing: true
                            });

                            //commit
                            var commitinv=itemContext.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'commitinventory',
                                value:1,
                                ignoreFieldChange:true,
                                forceSyncSourcing: true
                            });

                            document.getElementById('rate_formattedValue').value=averagecst;

                      
                            itemContext.commitLine({
                                sublistId: 'item'
                            });
                    
                            console.log('sublist has committed successfully');
                            console.log('Transferfield updated');

                            

                      
                            
                          }
                          
                          
                        
                      }
              
                  }        
              }



        }
    }
   
    
  

    



    

    return {
       // pageInit: pageInit,
        //fieldChanged: fieldChanged,
        //sublistChanged:sublistChanged,
        postSourcing:postSourcing
     
    };
    
});
