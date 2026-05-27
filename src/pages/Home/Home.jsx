import React from 'react';
import styles from './Home.module.css';
import { ArrowUpRight, ChevronLeft, ChevronRight, Star } from 'lucide-react';

const Home = () => {
  const renderItems = [1, 2, 3];

  return (
    <div className={styles.homeContainer}>
      
      {/* HERO SECTION */}
      <section className={styles.hero}>
        <h2 className={styles.placeholderText}>imagem</h2>
        <div className={styles.heroButtonWrapper}>
          <button className={styles.btnSolid}>Garanta o Seu</button>
        </div>
      </section>

      {/* COLLECTION SECTION */}
      <section className={styles.collection}>
        <h2 className={styles.collectionTitle}>Conheça nossa nova coleção!</h2>
        <p className={styles.collectionSubtitle}>Os novos bodysplashs estão incríveis!</p>
        
        <div className={styles.cardsContainer}>
          {renderItems.map((item) => (
            <div key={item} className={styles.card}>
              <span className={styles.cardIcon}>imagem</span>
              <button className={styles.cardLinkBtn} aria-label="Ver produto">
                <ArrowUpRight size={20} />
              </button>
            </div>
          ))}
        </div>

        <button className={styles.btnOutline}>Descubra Meus Aromas</button>
      </section>

      {/* BANNER CARROSSEL */}
      <section className={styles.carousel}>
        <button className={`${styles.carouselBtn} ${styles.prev}`}>
          <ChevronLeft size={64} />
        </button>
        <h2 className={styles.placeholderText}>imagem</h2>
        <button className={`${styles.carouselBtn} ${styles.next}`}>
          <ChevronRight size={64} />
        </button>
      </section>

      {/* TESTIMONIALS (DEPOIMENTOS) */}
      <section className={styles.testimonials}>
        <h2 className={styles.testimonialsTitle}>A experiência de nossos clientes</h2>
        
        <div className={styles.testimonialsContainer}>
          {renderItems.map((item) => (
            <div key={item} className={styles.testimonialCard}>
              <div className={styles.testimonialHeader}>
                <div className={styles.avatar}>imagem</div>
                <div className={styles.stars}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
              </div>
              
              <p className={styles.testimonialText}>
                Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem
              </p>
              
              <div className={styles.testimonialAuthor}>
                Ipsum Lorem
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Home;