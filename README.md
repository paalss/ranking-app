# Rangeringsapp (work in progress)
En liten app for å rangere forskjellige elementer, og lagre endringene permanent

## Åpne løsningen i nettleser
### 1. Last ned filene i server-mappe
1.1 Åpne programmet XAMPP, MAMP eller lignende. «Live Server» plugin fra Visual Studio Code er ikke tilstrekkelig som server. Denne løsningen må kunne lese fra en tekstfil, og skrive over tekstfilen igjen med PHP.
For XAMPP på Mac: Du får ikke den nødvendige filstrukturen i automatisk, du må mount'e i XAMPP for å få den tilgjengelig i Finder.

1.3 Last ned repository-filene under servermappen xampp/htdocs/ (xampp windows), lampp/htdocs (xampp mac) eller lignende. 

### 2. Åpne nettsiden i en localhost server:
2.1 Start Apache i XAMPP e.l.

2.2 Åpne nettsiden med URL: localhost/path/til/mappe (xampp windows), localhost:8080/path/til/mappe (xampp mac)

## Bruk
Opprett listeelementer, arranger og lagre.

### NB
For en eller annen grunn må man åpne consollet før man kan lagre listen 

## Manglende funksjonalitet som kommer etterhvert
Sletting av listepunkt

Endre listepunkt

Opprette egne lister

Fint «lag nytt listepunkt» GUI

En angre «snackbar» for å trekke tilbake slettede elementer