import React from 'react';
import styles from './Footer.module.css';
import { FaInstagram, FaFacebookF, FaTiktok, FaPinterestP } from 'react-icons/fa';
import { Mail, Phone, MapPin, ShieldCheck, CreditCard } from 'lucide-react';
import logoMarca from '../../assets/logo-rodape.png';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.column}>
          <img src={logoMarca} alt="Logo" className={styles.logo} />
          <p className={styles.aboutText}>
            Produtos 100% artesanais que unem a essência da natureza à sofisticação. Inspirados na beleza e resiliência da Flor-da-Fortuna.
          </p>
          <p className={styles.socialText}>
            Nos siga nas redes sociais:
          </p>
          <div className={styles.socials}>
            <a href="https://instagram.com/lachoebeauty" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
    <FaInstagram size={20} />
  </a>
  <a href="https://facebook.com/lachoebeauty" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
    <FaFacebookF size={20} />
  </a>
  <a href="https://tiktok.com/lachoebeauty" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
    <FaTiktok size={20} />
  </a>
  <a href="https://pinterest.com/lachoebeauty" target="_blank" rel="noopener noreferrer" aria-label="Pinterest">
    <FaPinterestP size={20} />
  </a>
          </div>
        </div>

        <div className={styles.column}>
          <h3 className={styles.title}>Links Úteis</h3>
          <ul className={styles.links}>
            <li><a href="/marca">A Marca</a></li>
            <li><a href="/produtos">Produtos</a></li>
            <li><a href="/kits">Kits</a></li>
            <li><a href="/politica-de-privacidade">Política de Privacidade</a></li>
            <li><a href="/termos">Termos de Uso</a></li>
          </ul>
        </div>

        <div className={styles.column}>
          <h3 className={styles.title}>Atendimento</h3>
          <ul className={styles.contactList}>
            <li>
              <Phone size={16} className={styles.icon} />
              <span>(11) 99999-9999</span>
            </li>
            <li>
              <Mail size={16} className={styles.icon} />
              <span>contato@lachoebeauty.com.br</span>
            </li>
            <li>
              <MapPin size={16} className={styles.icon} />
              <span>Rio de Janeiro, RJ - Brasil</span>
            </li>
          </ul>
          <p className={styles.workingHours}>Segunda a Domingo: 9h às 18h</p>
        </div>

        <div className={styles.column}>
          <h3 className={styles.title}>Segurança</h3>
          <div className={styles.badgeWrapper}>
            <div className={styles.securityBadge}>
              <ShieldCheck size={18} className={styles.securityIcon} />
              <div>
                <p className={styles.badgeTitle}>Site Seguro</p>
                <p className={styles.badgeDesc}>Criptografia SSL</p>
              </div>
            </div>
          </div>

          <h3 className={styles.titlePayment}>Formas de Pagamento</h3>
          <div className={styles.paymentIcons}>
            <div className={styles.paymentMethod} title="Cartão de Crédito">
              <CreditCard size={18} />
              <span className={styles.paymentText}>Cartão</span>
            </div>
            <div className={styles.pixBadge}>PIX</div>
            <div className={styles.boletoBadge}>Boleto</div>
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <div className={styles.bottomContainer}>
          <p>&copy; {new Date().getFullYear()} Lachoe Beauty. Todos os direitos reservados.</p>
          <p>CNPJ: 00.000.000/0001-00 | Rio de Janeiro - RJ</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;