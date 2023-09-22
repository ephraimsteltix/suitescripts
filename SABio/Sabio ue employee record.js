/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record'],
    /**
 * @param{record} record
 */
    (record) => {
        /**
         * Defines the function definition that is executed before record is loaded.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @param {Form} scriptContext.form - Current form
         * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
         * @since 2015.2
         */
        const beforeLoad = (scriptContext) => {

        }

        /**
         * Defines the function definition that is executed before record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const beforeSubmit = (context) => {
        

        }

        /**
         * Defines the function definition that is executed after record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const afterSubmit = (context) => {

            if (context.type === context.UserEventType.CREATE) {
                var recordContext=context.newRecord;

                var recordLoaded=record.load({
                    type:record.Type.EMPLOYEE,
                    id:recordContext.id
                });

                var employeeIdNumber=recordLoaded.getValue('custentity_sab_empidnumber');



                //setting employee id
                recordLoaded.setValue('externalid',employeeIdNumber);
                recordLoaded.save();
            }
            else if (context.type === context.UserEventType.EDIT) {
                var recordContext=context.currentRecord;

                var recordLoaded=record.load({
                    type:record.Type.EMPLOYEE,
                    id:recordContext.id
                });

                var employeeIdNumber=recordLoaded.getValue('custentity_sab_empidnumber');



                //setting employee id
                recordLoaded.setValue('externalid',employeeIdNumber);
                recordLoaded.save();
            
            }

        }

        return {beforeLoad, beforeSubmit, afterSubmit}

    });
