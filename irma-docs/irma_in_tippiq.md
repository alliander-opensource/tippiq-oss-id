### Keuze van attributen
Binnen Tippiq-id worden gebruikers uniek geidentificeerd met een uuid.
Gebruikers logggen echter in met een e-mailadres en wachtwoord. Als een
gebruiker zijn/haar e-mailadres verandert, dient hij/zij ook in te loggen met
dit nieuwe e-mailadres. Het uuid van de gebruiker blijft echter altijd
hetzelfde.

Als we inloggen met IRMA gaan ondersteunen hebben we twee keuzes: of we laten
gebruikers hun e-mailadres als attribuut tonen, of we laten ze een uuid tonen.
Een uuid heeft als voordeel dat het consistent is met de huidige implementatie
(uniek en immutable). Een e-mailadres als attribuut is voor de gebruiker echter
vele malen beter leesbaar en begrijpbaar.

Het probleem van het kiezen voor een e-mailadres als login-attribuut is dat deze
gewijzigd kan worden: wat er gebeurt er als een gebruiker zijn e-mailadres
wijzigt, maar geen nieuw e-mailadres-attribuut ontvangt? Zodra een andere
gebruiker dat e-mailadres dan claimt, kan deze inloggen onder de oude gebruiker.

Dit probleem is op te lossen door het e-mailadres-attribuut te 'revoken'. Dit is
momenteel nog niet mogelijk met IRMA, al zal dat niet heel lang meer duren.

Omdat we IRMA toch redelijk snel in productie willen hebben, kiezen we er
momenteel voor om zowel het e-mailadres als uuid te gebruiken als attributen bij
het aanmelden. Het e-mailadres is voornamelijk voor communicatie naar de
gebruiker, terwijl de uuid zal dienen als unieke identificatie van de gebruiker.

### Protocol-flow inloggen IRMA bij tippiq-id

*Algemene note vooraf:* Hier en daar gebruik ik de term 'pollen' als een partij
moet wachten op resultaat. Dit hoeft niet persee 'ouderwets' pollen te zijn en
zou net zo goed een websocket of andere techniek kunnen zijn (moet nog
uitgezocht worden).

In dit document wordt enkel het stuk van het IRMA-protocol dat van belang is
voor tippiq-id behandeld. Zie het volgende diagram voor een overzicht van het
gehele IRMA-protocol: http://credentials.github.io/images/DisclosureProof.png

Zie het diagram:

![Nieuwe logindiagram](./inloggen_in_detail_new.png)

- De tippid-id frontend doet een `GET /api/irma/generate-login-request`
- De tippiq-id backend doet stuurt een `sprequest` naar de api-server
  ('DisclosureProofRequest' in diagram). Zie
  [hier](http://credentials.github.io/protocols/irma-protocol/) voor meer
  informatie over hoe een `sprequest` er uit ziet. Dit `sprequest` wordt gesigned
  met een jwt private key. In dit `sprequest` zit ook een return-url waarop de
  api-server het resultaat van de proof bekend zal maken.
- De api-server stuurt vervolgens een response in de vorm van een SessionToken
  terug.

  Voorbeeld van zo'n request/response-cycle tussen tippiq-id backend en api-server:

  Request:
  ```
    $  curl -X POST -H 'Content-Type:application/json; charset=utf-8' -d "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzcHJlcXVlc3QiOnsiZGF0YSI6ImZvb2JhciIsInZhbGlkaXR5Ijo2MCwidGltZW91dCI6NjAsInJlcXVlc3QiOnsiY29udGVudCI6W3sibGFiZWwiOiJUZXN0IiwiYXR0cmlidXRlcyI6WyJ0aXBwaXEuVGlwcGlxLnRpcHBpcUlkLmUtbWFpbCJdfV19fSwiaWF0IjoxNDc3MDUwMDUxLCJpc3MiOiJ0ZXN0c3AiLCJzdWIiOiJ2ZXJpZmljYXRpb25fcmVxdWVzdCJ9." https://irma.tippiq.nl/api/v2/verification

  ```

  Response:
  ```
    {"u":"GITTWbM9XInlnjRsHemWBY5JZQZa3CkDyobOBdfBv5","v":"2.0","vmax":"2.1"}
  ```
- De tippiq-id backend slaat dit response op, zodat er later naar verwezen kan
  worden.
- De tippiq-id backend bouwt een url van dit response en stuurt deze naar de
  tippiq-id frontend.
- De tippiq-id frontend laat de gebruiker een QR-code met daarin deze
  gebouwde URL zien.
- De gebruiker scant deze code, en verzendt een IRMA-proof naar de api-server
  (zie het overzichtsdiagram).
- Zodra de api-server een IRMA-proof van de gebruiker ontvangen heeft zal hij
  deze controleren en het resultaat in een signed JWT bekend maken via een POST
  aan de tippiq-id backend bekend maken. Deze POST wordt gedaan naar de callback
  URL die in het `sprequest` gedefinieerd is.
- Ondertussen is de tippiq-id frontend aan het pollen op
  `/api/irma/retrieve-login-token//< SESSIONTOKEN >`. Zodra daar een bearer-token op
  verschijnt is de gebruiker ingelogd en kan de frontend dit naar de gebruiker
  communiceren.

### Configuratie van variabelen op Tippiq id
Tippiq-id moet de api-server kunnen bereiken, daarvoor moeten de volgende
variabelen ingesteld worden in `api/config.js`:
- irmaApiServerHost
- irmaApiServerPort
- irmaApiServerPublicKey

De public key van de api server is nodig om requests/calls van de
`irma_api_server` naar Tippiq-id te verifieren. Op de api-server worden deze
gesigned met de key die in de variable `jwt_privatekey` opgegeven staat. Binnen
tippiq-id moet de jwt public key in `api/config.js` gedefinieerd worden in de
variable `irmaApiServerPublicKey`.

Als 1 van deze variabelen niet is ingesteld (de standaardinstelling) wordt alle
IRMA-functionaliteit binnen de Tippiq-id backend uitgeschakeld. Om de
IRMA-functionaliteit ook in de frontend uit te schakelen dient de optie
`irmaEnabled` in `src/config.js` op `false` gezet te worden.

Tippiq-id moet zowel verify- als issuerequests signen voordat de api-server deze
accepteert. In de toekomst zal ook de Irma-app en mogelijk andere partijen deze
requests controleren (hier moet nog wel een oplossing voor de key distribution
gevonden worden).

Om deze requests te signen moet tippiq-id een JWT keypair aanmaken. Daarnaast
moet Tippiq-id een JWT issuer name opgeven. Dit wordt gedaan in de volgende
variabelen in `api/config.js`:
- tippiqIdIrmaPrivateKey
- tippiqIdIrmaPublicKey
- tippiqIdIrmaName

De public key moet daarnaast ook in de configuratiedirectory van de Irma
api-server terecht komen in zowel de map `issuers/<tippiqIdIrmaName>/pk.der` als
`verifiers/<tippiqIdIrmaName>/pk.der`(let op dat de key naar der-formaat
omgezet moet worden!).

### Configuratie van variabelen voor de irma api server
In plaats van deze bestanden kunnen deze keys ook via
omgevingsvariabelen meegegeven worden, hiervoor dienen de volgende
omgevingsvariabelen ingesteld te worden voor het starten van `irma_api_server`:

- `IRMA_API_CONF_BASE64_JWT_ISSUERS_TIPPIQ`
- `IRMA_API_CONF_BASE64_JWT_VERIFIERS_TIPPIQ`
- `IRMA_API_CONF_BASE64_JWT_PUBLICKEY`
- `IRMA_API_CONF_BASE64_JWT_PRIVATEKEY`

Aangezien deze keys in het binaire der-formaat opgegeven moeten worden, moeten
ze in het geval van omgevingsvariabelen eerst omgezet worden naar base64. Zie
[hier](https://github.com/credentials/irma_api_server#config-via-environment-variables)
voor meer informatie.

### DevOps

Een doel is om `irma_api_server` draaiende te krijgen op de URL irma.tippiq.nl.
Hiervoor willen we een losse microservice maken van deze api server. Deze
service is dan publiek beschikbaar voor de gebruikers (met hun telefoons) en
tippiq id (en later ook de cloud-based attribute storage). Deze api-server is
'stateless': hij doet slechts 1 ding, namelijk irma-berekeningen uitvoeren en
deze vertalen naar 'normale' API-calls die gemakkelijk te implementeren zijn
voor andere partijen.

Aangezien de rest van het platform in Kubernetes draait is het logisch om
dezelfde infrastructuur ook voor de `irma_api_server` te gebruiken. Dit zou
betekenen dat globaal de volgende workflow nodig is om een nieuwe versie van de
api server 'in de lucht te krijgen:'
- Configuratie wordt in kubernetes gezet met config Maps en secrets voor de
  sleutelinformatie.
  - Deze configuratie wordt door de `irma_api_server` via omgevingsvariabelen
    benaderd.
- Zodra er een nieuwe versie van de api server in git gezet wordt, wordt Jenkins
  aangeroepen.
- Jenkins gebruikt de bijgevoegde Jenkins file om de build te testen.
- Als de tests slagen bouwt Jenkins een docker container met deze build, gebruik
  makende van de bijgevoegde Dockerfile.
- Na het bouwen van de Dockerfile zal deze gepusht worden naar onze Docker
  registry. Vervolgens roept Jenkins Kubernetes aan om een nieuwe versie van de
  `irma_api_server` deployment online te zetten.

Aangezien alle configuratie via omgevingsvariabelen gaat, hoeft dit enkel in
Kubernetes goed ingesteld te worden.

De enige uitzondering op het gebied van configuratie is de directory
`irma_configuration`: Hierin staan alle public keys van de Issuers en alle
attributenspecificaties. Deze map komt uit git en zullen we 'meebouwen' in de
Docker image. We gebruiken hiervoor een bepaalde versie (commit hash), die als
variabele in de Jenkins file staat. Op deze manier kunnen we garanderen dat de
docker images altijd van dezelfde versie van `irma_configuration` gebruik kunnen
maken. Op de lange termijn zal hier wel een slimmere oplossing voor gevonden
moeten worden. Dezelfde versie van dit schema zal ook online beschikbaar moeten
zijn voor de android app. Hier gebruiken we op dit moment de raw github file
hosting voor, maar ook dit zal in de toekomst wat netter moeten.

Onze huidige oplossing zorgt ervoor dat we een nieuwe versie van de container
moeten bouwen als we `irma_configuration` updaten. Dit lijkt onnodig voor zo'n
kleine update, maar het garandeert wel stabiliteit. Op de lange termijn (als er
vaker updates zullen zijn) zullen we mogelijk naar een betere oplossing moeten
kijken.
