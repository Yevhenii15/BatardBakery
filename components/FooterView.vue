<template>
  <footer class="footer">
    <div class="footer-top">
      <!-- LEFT COLUMN — LOGO + TEXT -->
      <div class="footer-left">
        <div class="footer-logo">
          <img class="footer-logo-img" src="/img/logoBlack.png" alt="Batard Logo" /> 
        </div>

        <p class="footer-description">
          Et surdejsbageri med lækker kaffe, hvor<br />
          der er tænkt på alle detaljer!
        </p>
      </div>

      <!-- MIDDLE COLUMN — MENU -->
      <div class="footer-center">
        <h3 class="footer-title">Menu</h3>
        <ul class="footer-menu">
          <li>Forside</li>
          <li>Bestil</li>
          <li>Se smiley (FVST)</li>
          <li>Privatlivspolitik</li>
          <li>Returneringspolitik</li>
        </ul>
      </div>

      <!-- RIGHT COLUMN — CONTACT -->
      <div class="footer-right">
        <h3 class="footer-title">Kontaktinformation</h3>

        <p>Vejers Havvej 81B<br />6853 Vejers Strand</p>

        <p>
          Email: Hello@batardbakery.dk<br />
          Tlf.: +45 29 25 03 80<br />
          CVR: 43368532
        </p>
      </div>
    </div>

    <!-- BOTTOM BAR -->
    <div class="footer-bottom">
      <p>© 2025 All Rights Reserved.</p>
    </div>
  </footer>
</template>

<style>
.footer {
  width: 100%;
  background: #ffffff;
  padding-top: 4rem;
  color: #1d2a3a;
  font-family: inherit;
}

/* ————————————————
   TOP SECTION (3 COLUMNS)
——————————————— */
.footer-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  padding: 0 3rem 4rem;
}

/* LEFT — CENTERED */
.footer-left {
  text-align: center; 
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* LOGO FIXED */
.footer-logo {
  width: 260px;
  display: flex;
  margin-top: 40px;
}

.footer-logo img {
  width: 100%;
  height: auto;
  display: flex;
  justify-content: center;
    align-items: center;
  
}

.footer-description {
  margin-top: 1.5rem;
  font-size: 1.2rem;
  line-height: 1.5;
  color:#1d2a3a;
}

/* MIDDLE */
.footer-center {
  flex: 1;
  text-align: center;
}

.footer-title {
  font-size: 1.9rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.footer-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-menu li {
  font-size: 1.2rem;
  margin: 0.7rem 0;
  cursor: pointer;
  color:#1d2a3a;
  transition: color 0.25s ease, opacity 0.25s ease;
}

/* HOVER EFFECT — LIGHT BATARD BLUE */
.footer-menu li:hover {
  color: #afc4d4;
  opacity: 0.8;
}

/* RIGHT */
.footer-right {
  flex: 1;
  text-align: center;
}

.footer-right p {
  font-size: 1.2rem;
  margin-top: 1rem;
  line-height: 1.6;
  color:#1d2a3a;
}

/* ————————————————
   BOTTOM BAR
——————————————— */
.footer-bottom {
  text-align: center;
  background: #707f78; 
  color: white;
  padding: 0.8rem 0;
  font-size: 1.1rem;
}

/* ————————————————
   RESPONSIVE
——————————————— */
@media (max-width: 1050px) {
  .footer-top {
    gap: 4rem;
  }
}

@media (max-width: 900px) {
  .footer-top {
    flex-direction: column;
    align-items: center;
    gap: 3.5rem;
    padding: 0 2rem 3rem;
    text-align: center;
  }

  /* Adjust logo size */
  .footer-logo {
    width: 200px;
  }

  /* Make text slightly smaller */
  .footer-description,
  .footer-right p,
  .footer-menu li {
    font-size: 1.1rem;
  }
}

@media (max-width: 600px) {
  .footer-logo {
    width: 170px;
  }

  .footer-title {
    font-size: 1.6rem;
  }
}
</style>
