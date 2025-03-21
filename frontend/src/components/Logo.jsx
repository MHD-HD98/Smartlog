import styles from "./styles/Logo.module.css";
import logo from "../assets/logo.png";

const Logo = () => {
  return (
    <div className={styles.logoContainer}>
        <p>powered by</p>
      <img src={logo} alt="Lenok Logo" />
    </div>
  );
};

export default Logo;