import React from 'react';
import styles from './App.module.css'; // Importando o CSS do App
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import './index.css';

const App = () => {
  return (
    <div className={styles.appContainer}>
      <Header />
      
      <main className={styles.mainContent}>
        <Home />
      </main>

      <Footer />
    </div>
  );
};

export default App;