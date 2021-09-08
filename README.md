
# Exchange microservice

### Step 1: Creare il database con RDS

Per il salvataggio dati utenti è necessario creare un database MySQL. L'applicazione utilizza [RDS](https://console.aws.amazon.com/rds/home) per l'hosting di questo servizio. <br>
Un altro strumento utilizzato per la gestione del database è MySQL Workbench (Alternativamente anche MySQL Command Line Client) è reperibile al sito [MySQL](https://dev.mysql.com/downloads/). <br>

<ol>
  <li> Creare il database avente engine MySQL su RDS. Tenere traccia di master username e master password utilizzate. </li>
  <li> Assicurarsi che nelle inbound rules del security group sia permesso l'accesso al database dal proprio indirizzo IP pubblico per la porta 3306.
    <br>
    <br>
    <img width="850" alt="inbound_rules" src="https://user-images.githubusercontent.com/82449626/132405072-16fe8a1e-3714-48aa-bb82-037342c262d8.png">
    <br>
    <br>
    Una volta completato lo <strong><em>Step 3</em></strong> sarà necessario aggiungere anche l'IP dell'istanza EC2 per garantire l'accesso ai microservizi.
    <br>
    <br>
  </li>
  <li> Aprire Workbench e creare una nuova connessione
    <br>
    <br>
    <img width="585" alt="workbench" src="https://user-images.githubusercontent.com/82449626/132406617-34928e4b-9e33-4599-8117-543c4e3e376a.png">
    <br>
    <br>
       Per i campi username e password utilizzare i dati usati in precedenza durante la creazione del database su RDS. Scegliere un nome a piacere per la connessione e lasciare il campo Default schema in bianco. Il campo hostname (Endpoint) è recuperabile da RDS nella sezione <code>Connectivity & Security</code> del proprio database .
    <br>
    <br>
    <img width="287" alt="rds_endpoint" src="https://user-images.githubusercontent.com/82449626/132408340-01c92f9c-9ac8-4d0d-b7e6-b01955c47c23.png">
    <br>
    <br>
  </li>
  <li> Connettersi al database ed eseguire il seguente codice per creare le tabelle necessarie: </li>
</ol>

<pre>
CREATE DATABASE exchangedb;
USE exchangedb;

CREATE TABLE users(
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,  
  email varchar(255) NOT NULL UNIQUE,  
  password varchar(255) NOT NULL,  
  name varchar(255) NOT NULL,  
  iban varchar(30) NOT NULL  
);  

CREATE TABLE accounts(  
  user_id int NOT NULL,  
  currency char(3) NOT NULL,  
  balance decimal(20,4) NOT NULL DEFAULT 0,  
  PRIMARY KEY(user_id, currency),  
  FOREIGN KEY(user_id) REFERENCES users(id)  
);

CREATE TABLE transactions(  
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,  
  amount decimal(20,4) NOT NULL,
  currency_from char(3) NOT NULL,  
  currency_to char(3) NOT NULL,  
  user_id int NOT NULL,  
  trans_date datetime NOT NULL DEFAULT NOW(),  
  FOREIGN KEY(user_id) REFERENCES users(id),  
  FOREIGN KEY(user_id, currency_from) REFERENCES accounts(user_id, currency),  
  FOREIGN KEY(user_id, currency_to) REFERENCES accounts(user_id, currency)  
);  
</pre>

________________

### Step 2: Compilare le immagini docker per il backend e caricarle su ECR

Per eseguire questo step bisogna dotarsi di [Docker](https://docs.docker.com/engine/install/) e [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) sul proprio pc. [Amazon ECR](https://console.aws.amazon.com/ecr) servirà per caricare le proprie immagini docker sulla piattaforma AWS. Per potere utilizzare AWS CLI è necessario effettuare la configurazione e collegamento al proprio account AWS. Una guida è disponibile [Qui](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html).

<br>
<ol>
  <li>
    Iniziare creando una repository su ECR. Scegliere un nome (Qui useremo <strong><em>exchange-repo</em></strong>) e premere crea.
    <br>
    <br>
    <img width="643" alt="ecr" src="https://user-images.githubusercontent.com/82449626/132496816-d22fb7b3-5bb8-4617-b6ad-bf8b60269688.png">
    <br>
    <br> 
  </li>
  <li> Prima di costruire le immagini Docker è necessario creare un file chiamato <code>.env</code> per ogni microservizio.
    <br>
    In <code>sf-academy/backend/exchange</code> il file <code>.env</code> deve contenere il seguente codice:
    <br>
    <br>
<pre>
EXCH_PORT = porta_desiderata_exchange
</pre>
    Sostituire <code>porta_desiderata_exchange</code> con il numero di porta che si vuole utilizzare per il micorservizio exchange.
    <br>
    In <code>sf-academy/backend/user</code>:
    <br>
    <br>
<pre>
EXCH_PORT = porta_desiderata_exchange
USERS_PORT = porta_desiderata_users
SECRET = segreto_desiderato
DB_HOST = endpoint_rds
DB_USER = user_rds
DB_PASSWORD = password_rds
DB_DATABASE = exchangedb
</pre>
    Inserire la porta exchange scelta in precedenza; Scegliere una nuova porta per users e un segreto per la cifratura dei token jwt. Inoltre inserire i dati per l'accesso al       database, lasciando invariato l'ultimo campo.
    <br>
    In <code>sf-academy/backend/api</code> inserire:
    <br>
    <br>
<pre>
EXCH_PORT = porta_desiderata_exchange
USERS_PORT = porta_desiderata_users
PORT = 80
</pre>
    Inserire le due porte scelte precedentemente e 80 per l'api. Inoltre, se si è già a conoscenza del il dominio su cui verrà verra hostato il frontend, andare su           <code>api.js:152</code> e impostare la riga nel seguente modo:
    <br>
    <code>const allowedOrigins = ['http://miosito.com'];</code>
    <br>
    Volendo è possibile fornire una lista con multipli domini. Se non si conosce il dominio finale l'immagine docker dovrà essere costruita e caricata una seconda volta su ECR per permettere l'accesso all'api dal nuovo dominio dopo aver completato lo <strong><em>Step 4</em></strong>.
    <br>
    <br>
  </li>
  <br>
  <li>
    Adesso bisogna costruire le immagini docker. Aprire la console ed eseguire <code>docker build -t nome-microservizio dir-microservizio</code>. <br>
    In questo esempio userò i nomi <strong><em>exchange-ms</em></strong>, <strong><em>users-ms</em></strong> e <strong><em>api-ms</em></strong>. Se quindi siamo posizionati sulla directory <code>sf-academy/</code> eseguire in sequenza:
    <br>
    <br>
<pre>
docker build -t exchange-ms backend/exchange/
docker build -t users-ms backend/users/
docker build -t api-ms backend/api/
</pre>
  <br>
  </li>
  <li>
    Effettuare il login alla propria repository attraverso AWS CLI e caricare le immagini. Per effettuare il login usare: 
    <br>
    <br>
<pre>
aws ecr get-login-password --region regione | docker login --username AWS --password-stdin URI
</pre>
    Inserire al posto di <code>regione</code> la regione di utilizzo per ECR e al posto di <code>URI</code> il nome completo della propria repository.
    Per eseguire il push bisogna assegnare un tag alle immagini costruite precedentemente; Il seguente codice può essere usato per associare l'ultima versione di <strong><em>exchange-ms</em></strong> alla repository ECR <strong><em>exchange-repo</em></strong> con Image tag <strong><em>exchange-ms-ecr</em></strong> ed effettuare il push. 
    <br>
    <br>
<pre>
docker tag exchange-ms:latest URI:exchange-ms-ecr
docker push URI:exchange-ms-ecr
</pre>
    Ripetere per <strong><em>users-ms</em></strong> e <strong><em>api-ms</em></strong>.
  </li>
</ol>

________________
  
### Step 3: Creare Task Definition e Cluster con Servizio EC2

Per creare l'istanza EC2 contenente i tre microservizi servirà [Amazon ECS](https://console.aws.amazon.com/ecs).

<ol>
  <li>
    Creare una Task Definition con compatibilità EC2.
    <br>
    <br>
    <img width="836" alt="task_definition" src="https://user-images.githubusercontent.com/82449626/132511038-5499197c-62c5-44eb-a1ce-d9f5737e3b29.png">
    <br>
    <br>
    Sucessivamente dare un nome alla task e creare un container per il microservizio exchange:
    <br>
    <br>
    <img width="756" alt="task_definition_2" src="https://user-images.githubusercontent.com/82449626/132512465-74518b9e-be0c-45e8-8d60-8eae82e981bb.png">
    <br>
    <br>
    Usare l'URI dell'immagine su ECR con relativo tag, assegnare un limite di memoria (128MiB sono sufficienti) e assegnare la porta scelta. Ripetere la procedura per users ed api. Infine creare la task definition.
  </li>
  <br>
  <li>
    Creare un Cluster EC2 avente linux.
    <br>
    <br>
    <img width="725" alt="cluster" src="https://user-images.githubusercontent.com/82449626/132515427-91511b36-912e-4fb9-913d-a0e08f6196ed.png">
    <br>
    <br>
    Dare un nome al cluster e scegliere un Key Pair, eventualmente creandolo, per permettere la connessione all'istanza EC2 tramite SSH. Per il corretto funzionamento assicurarsi che il file contenente la chiave sia leggibile solamente dal proprio utente sul pc (Su sistemi Linux eseguire <code>chmod 400 nome_file.pem</code>). La VPC può essere la stessa del database. Il security group deve essere configurato nel seguente modo: 
    <br>
    <br>
    <img width="859" alt="cluster_2" src="https://user-images.githubusercontent.com/82449626/132519462-24fb38d8-cd66-4a49-839d-1b1fb9a2e77c.png">
    <br>
    <br>
    La prima regola deve consentire la ricezione di messaggi dall'indirizzo IP del database RDS; La seconda consente la connessione tramite SSH da indirizzo IP personale; La terza consente a tutti gli indirizzi IP di accedere alla porta 80 dell'istanza per accedere all'API.  
  </li>
  <br>
  <li>
    Creare un servizio nel Cluster. Scegliere la task definition e cluster creati in precedenza ed impostare il tipo a <code>DAEMON</code>
    <br>
    <br>
    <img width="690" alt="service" src="https://user-images.githubusercontent.com/82449626/132522955-becff1ea-56a7-4a58-b6eb-a3a54a91ac46.png">
    <br>
    <br>
  </li>
</ol>

Dopo aver creato il servizio dovrebbe apparire una nuova istanza nella propria [EC2](https://console.aws.amazon.com/ec2). 
<br>
<strong>N.B.</strong> Ricordarsi ora di aggiungere l'indirizzo IP dell'istanza al security group del database per la porta 3306, come spiegato in <strong><em>Step 1</strong></em>.

____________

### Step 4: Creare bucket S3 e includere il frontend

Strumenti utilizzati: [S3](https://s3.console.aws.amazon.com/s3)

<ol>
  <li>
    Creare un Bucket. Scegliere un nome, una regione e consentire l'accesso pubblico al bucket.
    <br>
    <br>
    <img width="488" alt="bucket" src="https://user-images.githubusercontent.com/82449626/132539447-eea52e51-5d39-43b3-8ee6-7028f1a1dff4.png">
    <br>
    <br>
  </li>
  <li>
    Selezionare il nuovo bucket creato e andare nella sezione <code>Permissions > Bucket Policy</code> e incollare il seguente codice: 
    <br>
    <br>
<pre>
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowPublicReadAccess",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::exchange-app/*"
        }
    ]
}
</pre>
  </li>
  <li>
    Creare un file <code>.env</code> in <code>sf-academy/frontend/exchange-app/</code> avente il seguente contenuto:
    <br>
    <br>
<pre>
REACT_APP_API_ADDRESS = http:\\EC2_PUBLIC_ADDRESS:80/
</pre>
    Dove <code>EC2_PUBLIC_ADDRESS</code> è l'indirizzo pubblico IPv4 DNS della propria istanza EC2
    <br>
    <br>
    <img width="724" alt="ec2_ip" src="https://user-images.githubusercontent.com/82449626/132545581-04900f4f-fb90-4f00-a456-bc17c945591c.png">
    <br>
    <br>
  </li>
  <li>
    Aprire la console in <code>sf-academy/frontend/exchange-app/</code> ed eseguire il seguente codice per eseguire il build dell'app REACT e sincronizzarlo con S3.
    <br>
    <br>
<pre>
npm run build
aws s3 sync build/ s3://exchange-app --acl public-read
</pre>
  </li>
  <li>
    Sul bucket di S3 andare nella sezione <code> Properties > Static Website Hosting</code> e cliccare su Edit. Configurare come visibile nella seguente immagine:
    <br>
    <br>
    <img width="413" alt="s3_hosting" src="https://user-images.githubusercontent.com/82449626/132547492-125c38e3-e63c-4282-af1d-06f8bd005c01.png">
    <br>
    <br>
  </li>
</ol>
A questo punto l'applicazione è disponibile sul Web, ma non potrà ancora collegarsi ai microservizi.
<br>
<strong> N.B </strong> Ricordarsi ora di aggiungere il dominio nella lista degli indirizzi consentiti per l'api, come spiegato in <strong><em>Step 2</strong></em>.

_________

### Step 5: Avviare i microservizi sulla EC2

Link utili per lo step: [EC2](https://console.aws.amazon.com/ec2) 

<ol>
  <li>
    Modificare il file <code>sf-academy/backend/docker-compose.yml</code> in modo che le immagini corrispondano al rispettivo URI sulla repository ECR (con tag ripetuto una volta sola). Inoltre impostare le due porte scelte per i microservizi.
    <br>
    <br>
<pre>
version: "3"
services:
  exchange-ms:
    image: URI:exchange-ms-ecr
    ports:
      - "PORTA_1:PORTA_1"
  users-ms:
    image: URI:exchange-ms-ecr:
    ports:
      - "PORTA_2:PORTA_2"
  api-ms:
    image: URI:api-ms-ecr
    ports:
      - "80:80"
</pre>
  </li>
  <li> Connettersi via SSH alla istanza EC2 creata precedentemente. Per fare questo andare sulla propria istanza e quindi premere <strong>Connect</strong> e <strong>SSH Client</strong>
    <br>
    <br>
    <img width="584" alt="ec2_ssh" src="https://user-images.githubusercontent.com/82449626/132584577-85c66a14-ab70-4c4b-a5e0-913e88420678.png">
    <br>
    <br>
    Copiare l'esempio sotto il punto 4 nell'immagine ed eseguirlo sulla propria console per connetersi in remoto all'istanza. Oppure copiarlo da qua sotto e modificando i campi nome_file e public_dns:
    <br>
    <br>
<pre>
ssh -i "nome_file.pem" ec2-user@public_dns
</pre>
  </li>
  <li> Installare il programma docker-compose sull'istanza eseguendo le due righe di codice in sequenza:
  <br>
  <br>
<pre>
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
</pre>
  </li>
  <li>
    Creare un file <code>docker-compose.yml</code> con il comando:
    <br>
    <br>
<pre>
cat > docker-compose.yml
</pre>
  E incollare il contenuto del file docker-compose.yml modificato nel primo passo di questo step. Premere Ctrl+D per terminare l'input e salvare il file.
  </li>
  <li>
  Avviare i container docker attraverso il comando:
  <br>
  <br>
<pre>
docker-compose up
</pre>
  </li>
</ol>

A questo punto il sito Web può connettersi ai microservizi.
