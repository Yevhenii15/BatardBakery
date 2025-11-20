<template>
  <section class="about">
    <div class="about-container">
      <h2 class="about-title">OM OS</h2>
      <h3 class="about-subtitle">
        IDEEN TIL BATARD BAKERY STARTEDE<br />
        FOR MANGE ÅR SIDEN!
      </h3>

      <div class="about-text">
        <p>
          Batard Bakery er en passioneret og innovativ bagerivirksomhed med dybe rødder i fødevarebranchen,
          især inden for bageribranchen. Grundlagt af en erfaren gruppe fagfolk, der har arbejdet inden for
          fødevareindustrien i mange år, bringer vi ekspertise og kærlighed til håndværket til hver eneste
          brød og kage, vi bager.
        </p>

        <p>
          Siden sommeren 2023 har vi serviceret Vejers Strand og omegnens mange turister fra vores første
          butik med et bredt udvalg af friskbagte surdejsbrød, delikate stykker og vores fantastiske
          kageudvalg. Vores bagværk er lavet med de bedste råvarer og en omhyggelig proces, der sikrer høj
          kvalitet og uforglemmelig smag.
        </p>

        <p>
          Vores mission er at udvide kendskabet til Batard Bakery og blive danskernes foretrukne sted for
          friskbagte brød. Men vi ønsker også at være det naturlige valg, når man har brug for en god kop
          kaffe eller nogle hyggelige timer med veninderne. Vi drømmer om at skabe et sted, hvor fællesskab
          og kvalitet går hånd i hånd, og hvor hver kunde føler sig velkommen.
        </p>

        <p>
          Vi er stolte af vores dedikation til håndværket og vores engagement i at tilbyde en uovertruffen
          oplevelse til vores kunder. Batard Bakery er mere end bare en bageri – det er et sted, hvor minder
          skabes, og hvor hver bid er en fornøjelse.
        </p>

        <p class="about-location">
          Lokation: Batard Bakery Vejers Strand
        </p>
      </div>
    </div>
  </section>
</template>

<style>
/* Background and layout */
.about {
  background-color: #211a1a; 
  color: #fff;
  padding: 6rem 1rem;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.about-container {
  max-width: 900px;
  margin: 0 auto;
}

/* Headings */
.about-title {
  font-size: 3rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 0.8rem;
}

.about-subtitle {
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 3rem;
}

/* Paragraphs */
.about-text p {
  line-height: 1.8;
  font-size: 1.05rem;
  margin-bottom: 1.8rem;
  color: #f2f2f2;
}

.about-location {
  margin-top: 2rem;
  font-style: italic;
  font-size: 1.1rem;
  color: #ddd;
}

/* Responsive */
@media (max-width: 768px) {
  .about {
    padding: 4rem 1rem;
  }

  .about-title {
    font-size: 2.2rem;
  }

  .about-subtitle {
    font-size: 1rem;
  }

  .about-text p {
    font-size: 1rem;
  }
}
</style>
