/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/query', 'N/record','N/format'],
    /**
 * @param{query} query
 * @param{record} record
 */
    (query, record,format) => {

        /**
         * Defines the Scheduled script trigger point.
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - Script execution context. Use values from the scriptContext.InvocationType enum.
         * @since 2015.2
         */
        const execute = (context) => {

              //id is workbook id
            var myLoadedQuery=query.load({
                id:'custdataset126'
            });

            var mySuiteQLQuery=myLoadedQuery.toSuiteQL();

            var resultSet=mySuiteQLQuery.run();

            var results=resultSet.results;
            var fiscalMonths=["JAN","FEB","MAR","APRR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
            var dateFormat=["01/01/","01/02/","01/03/","01/04/","01/05/","01/06/","01/07/","01/08/","01/09/","01/10/","01/11/","01/12/"]


            log.debug({title:'Query Length',details:results.length});
            for(var i=0;i<results.length;i++){
            var internalId = results[i].values[0];
            var month=results[i].values[3];

            var ficalMonthIndex=fiscalMonths.indexOf(month);

           //start date
            var fiscalStart1=new Date();

            var fiscalStart=new Date(fiscalStart1.getFullYear(),fiscalStart1.getMonth(),1);
            fiscalStart.setMonth(ficalMonthIndex);

        
            //end date
            const fiscalEndObj=new Date(fiscalStart);
            fiscalEndObj.setMonth(fiscalStart.getMonth()+11);

            
            var fiscalEndDate=new Date(fiscalEndObj.getFullYear(),fiscalEndObj.getMonth()+1,0);
            

            log.debug("internal id :",internalId);
            log.debug("fiscal start :",fiscalStart.toLocaleDateString("en-GB"));
            log.debug("fiscal end :",fiscalEndDate.toLocaleDateString("en-GB"));


            var loadedRec = record.load({
                type: 'subsidiary',
                id: internalId
            });

            var fiscalStart = format.format({
                value: fiscalStart,
                type: format.Type.DATETIMETZ
                });

            var fiscalEndDate = format.format({
                value: fiscalEndDate,
                type: format.Type.DATETIMETZ
                });

            loadedRec.setValue('custrecord1', fiscalStart);
            loadedRec.setValue('custrecord2',fiscalEndDate);

            // Save the record
            loadedRec.save();
            log.debug("###Date updated");

}
     
        }

        return {execute}

    });
