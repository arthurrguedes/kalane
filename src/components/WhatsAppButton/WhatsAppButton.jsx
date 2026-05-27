import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import styles from './WhatsAppButton.module.css';

const WhatsAppButton = () => {
  const numeroWhatsApp = "5511999999999"; // Substituir pelo número real em breve
  const mensagem = "Olá! Gostaria de falar com vendas da Lachoe Beauty.";
  const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.floatingButton}
      aria-label="Fale conosco no WhatsApp"
    >
      <FaWhatsapp size={32} />
    </a>
  );
};

export default WhatsAppButton;