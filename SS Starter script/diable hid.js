

if(document.getElementsByClassName('uir-disabledsss').length>=1){
    
    var disabedFields=document.getElementsByClassName('uir-disabled');

    for(var i=0;i<disabedFields.length;i++){
        disabedFields[i].innerText="";
    }
}
