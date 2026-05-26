import React from 'react';
import styles from './Marca.module.css';

const Marca = () => {
  return (
    <div className={styles.container}>
      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Do zero à essência</h1>
          <p className={styles.subtitle}>O simples que transborda sofisticação.</p>
        </div>
      </section>

      {/* SESSÃO DE ORIGEM / ARTESANAL */}
      <section className={styles.storySection}>
        <div className={styles.textBlock}>
          <h2 className={styles.heading}>Nossa Origem</h2>
          <p className={styles.paragraph}>
            Nascemos do desejo de criar algo genuíno a partir do zero. Cada produto é <strong>100% artesanal</strong>,
            formulado com cuidado, paciência e atenção aos mínimos detalhes. Acreditamos que a verdadeira sofisticação
            não está no excesso, mas na pureza e na simplicidade dos ingredientes que escolhemos.
          </p>
        </div>
        <div className={styles.imagePlaceholder}>imagem artesanal / textura</div>
      </section>

      {/* SESSÃO ANCESTRALIDADE / FLOR DA FORTUNA */}
      <section className={styles.inspirationSection}>
        <div className={styles.imagePlaceholder}>imagem kalanchoe</div>
        <div className={styles.textBlock}>
          <h2 className={styles.heading}>A Flor da Fortuna</h2>
          <p className={styles.paragraph}>
            Nossa maior inspiração atende pelo nome de <strong>Kalanchoe</strong>, popularmente conhecida como Flor-da-fortuna. 
            De origem africana, assim como a ancestralidade de nossos fundadores, ela carrega em si um simbolismo poderoso.
          </p>
          <p className={styles.paragraph}>
            A Kalanchoe representa a resistência, a prosperidade e a capacidade de florescer lindamente nas condições 
            mais simples. É exatamente essa essência resiliente, ancestral e elegante que engarrafamos em cada linha de 
            nossos produtos.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Marca;