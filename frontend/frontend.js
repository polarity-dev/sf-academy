
var bodyFormData = new FormData();//ok

async function setBodyForm(){
    alert($('#fileSF')[0].value);
    bodyFormData.set('fileSF', $('#fileSF')[0].files[0]);
    alert($('#fileSF')[0].value);
    return bodyFormData;
}

async function postFile(){
bodyFormData = new FormData();
bodyFormData = await setBodyForm();
const url = 'http://localhost:8080/importDataFromFile';
let results = await axios.post(url, bodyFormData);
//check del result da gestire ? 
alert("file in caricamento"); //hm...

}





var textFile = null,
makeTextFile = function (text) {
var data = new Blob([text], {type: 'text/plain'});
textFile = window.URL.createObjectURL(data);
return textFile;
}

function randomFile() {
var textbox = '';
var N = Math.floor(Math.random() * 50)+1;
var B = Math.floor(Math.random() * N)+1;
var A = Math.floor(Math.random() * B);
var Data = A+" "+B+"\n"
for(var i=0; i<N; i++){
P=Math.floor(Math.random() * 5)+1;
K=Math.floor(Math.random() * 1001)-500;
Data+=P + " " + K;
    if(A<=(i+1) && i+1<=B){
    Data+= " Utile\n"
    }
    else{
    Data+= " Dummy\n"
    }
}
var link = document.getElementById('downloadlink');
link.setAttribute('download', 'dataToPost.txt');
//make the text file
link.href = makeTextFile(Data);
//link.style.display = 'block';
    //wait for the link to be rendered and then initiate a click to download the file
window.requestAnimationFrame(function () {
    var event = new MouseEvent('click');
    link.dispatchEvent(event);
    //document.body.removeChild(link);
});
}


async function getData() {
let url = 'http://localhost:8080/Data?limit='+Number($("#limit").val()); //SE 0 NEL BACKEND ALLORA NON DEVE ANDARE 
console.log($("#from")[0].checked);
if($("#from")[0].checked==true) url += "&&from="+$("#fromDate").val();
let results = await axios.get(url);
$("#json2").html(JSON.stringify(results.data));
}

async function getPendingData() {
    const url = 'http://localhost:8080/pendingData';
    let results = await axios.get(url);
    //alert( JSON.stringify(results.data))
    $("#json1").html(JSON.stringify(results.data));
}