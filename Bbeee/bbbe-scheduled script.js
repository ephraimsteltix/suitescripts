/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/query', 'N/record'],
    /**
 * @param{query} query
 * @param{record} record
 */
    (query, record) => {

        /**
         * Defines the Scheduled script trigger point.
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - Script execution context. Use values from the scriptContext.InvocationType enum.
         * @since 2015.2
         */
      

        const execute=(context)=>{

                // Load dataset
                var myLoadedQuery = query.load({
                    id: 'custdataset123'
                });
            
                function convertToMoney(val) {
                    return (Math.ceil(val * 100) / 100).toFixed(2);
                }
            
              
            
                // Run the query and get the result set
                var resultSet = myLoadedQuery.run();
                var results = resultSet.results;
            
                // Log the length of results
                log.audit("number of certificates :", results.length);
            
                for (var i = 0; i < results.length; i++) {
            
                    var supplierId = results[i].values[0];
                    var supplierCertificateExpiry = results[i].values[2];
                    var supplierCertificateStartDate = results[i].values[3];
                    var internalId = results[i].values[4];
            
                    log.debug("supplierCertificateUnparsedExpire :",supplierCertificateExpiry);
                    log.debug("supplierCertificateUnparsedStart :",supplierCertificateStartDate);
            
                    // Convert date strings to Date objects
            
                    var [day,month,year]=supplierCertificateStartDate.split('/');
                    var supplierCertificateStartDateObj=new Date(+year,+month-1,+day);
            
                    var [day,month,year]=supplierCertificateExpiry.split('/');
                    var supplierCertificateExpiryObj=new Date(+year,+month-1,+day);
            
            
                    log.debug("supplierId", supplierId);
                    log.debug("supplierCertificateExpiry :", supplierCertificateExpiryObj);
                    log.debug("supplierCertificateStart :", supplierCertificateStartDateObj);
            
                    // Transaction query
                    var transQuery = query.load({
                        id: 'custdataset120'
                    });
            
                    var transCondition = transQuery.createCondition({
                        fieldId: 'entity',
                        operator: query.Operator.ANY_OF,
                        values: [supplierId],
                    });
                    var condition2 = transQuery.createCondition({
                        fieldId: 'transactionlines.mainline',
                        operator: query.Operator.IS,
                        values: false,
                    });
            
                    var condition3 = transQuery.createCondition({
                        fieldId: 'transactionlines.taxline',
                        operator: query.Operator.IS,
                        values: false,
                    });
            
                    var condition4=transQuery.createCondition({
                        fieldId: 'posting',
                        operator: query.Operator.IS,
                        values:true,
                    });
            
                    var condition5 = transQuery.createCondition({
                        fieldId: 'type',
                        operator: query.Operator.ANY_OF,
                        values:['VendBill','VendCred','Check','CardChrg','Journal'],
                    });
                    
                    var condition6=transQuery.createCondition({
                        fieldId: 'trandate',
                        operator: query.Operator.AFTER,
                        values:[supplierCertificateStartDate],
                    });
            
                    var condition7=transQuery.createCondition({
                        fieldId: 'trandate',
                        operator: query.Operator.BEFORE,
                        values:[supplierCertificateExpiry],
                    });
                    
            
                    // Apply condition and run the transaction query
                    transQuery.condition = transQuery.and(transCondition,condition2,condition3,condition4,condition5,condition6,condition7);
                    var transResultSet = transQuery.run();
                    var transResults = transResultSet.results;
            
                    // Log Length of transaction query results
                    log.audit("Transaction Query Length :", transResults.length);
            
                    var TotalAmountPaid = 0;
            
                    for (var j = 0; j < transResults.length; j++) {
            
                         //transdate
                         var transDate=transResults[j].values[0];
                        var [day,month,year]=transDate.split('/');
                        var transDate=new Date(+year,+month-1,+day);
            
            
                        //var transDate = new Date(transResults[j].values[0]);
                        var supTransId = transResults[j].values[1];
                        var transCurrency = parseFloat(transResults[j].values[3]);
                        var type=transResults[j].values[4];
                        log.debug("#######type",type);
            
            
                        if (supTransId === supplierId) {
                            TotalAmountPaid += transCurrency;
                        }
                    }
            
                    log.debug("Amount for this certificate", TotalAmountPaid);
                    log.debug("#######internalid :", internalId);
            
                    // Load the supplier record
                    var loadedRec = record.load({
                        type: 'customrecord_stx_supplier_bbbee_cert',
                        id: internalId
                    });
            
                    loadedRec.setValue('custrecord_stx_bbbee_spend_cert_validper', convertToMoney(TotalAmountPaid));
            
                    // Save the record
                    loadedRec.save();
                    log.debug("###Amount updated");
                }
            
        }

        return {execute}

    });
