




<?php 
    if($_SERVER['server_method']=="post"){
        $upload_path ="/uploads/";
        $filename =basename($_FILES["filetoupload"]["name"]);
        $target_file=$upload_path.$filename;
        $check =TRUE ;

        if(file_exists($target_file)) {
            $check = FALSE ;
            $output = "il file esiste gia ";

        }

        if($_FILES['file']['size']>2000000) { 
            $check =false ;
            $output ="file è troppo grande "
        }


        $ext=strtoupper(pathinfo($target_file,pathinfo_extension))
        if($ext != "pdf" , && $ext != "ping" ) {
            $check =FALSE ;
            $output ="not valid (solo pdf o png)"
        }

    if($check) {
        if(!move_uploaded_file($_FILES['file']['tmp_name'])) {
            echo "upload false";

        }else { 
            echo "file caricato con successo"     
        }
     }else { 
        
     }




     }
echo "title inserito :{ $_post ['title']} "
?>


